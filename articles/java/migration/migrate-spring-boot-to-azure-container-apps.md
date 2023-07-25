---
title: Migrate Spring Boot applications to run on Azure Container Apps
description: This guide describes what you should be aware of when you want to migrate an existing Spring Boot application to run on Azure Container Apps.
author: KarlErickson
ms.author: manriem
ms.topic: conceptual
ms.date: 08/05/2022
ms.custom: devx-track-java, devx-track-extended-java
recommendations: false
---

# Migrate Spring Boot applications to Azure Container Apps

This guide describes what you should be aware of when you want to migrate an existing Spring Boot application to run on Azure Container Apps (ACA).

## Pre-migration

To ensure a successful migration, before you start, complete the assessment and inventory steps described in the following sections.

### Validate that the supported Java version works correctly

We recommend using a supported version of Java when running a Spring Boot application on ACA. Confirm that your application runs correctly using that supported version.

[!INCLUDE [note-obtain-your-current-java-version](includes/note-obtain-your-current-java-version.md)]

### Determine whether and how the file system is used

Any usage of the file system by your Spring Boot application will require reconfiguration or, in rare cases, architectural changes. You may identify some or all of the scenarios described in the following sections.

[!INCLUDE [static-content](includes/static-content.md)]

[!INCLUDE [determine-whether-your-application-relies-on-scheduled-jobs](includes/determine-whether-your-application-relies-on-scheduled-jobs.md)]

[!INCLUDE [determine-whether-a-connection-to-on-premises-is-needed](includes/determine-whether-a-connection-to-on-premises-is-needed.md)]

[!INCLUDE [determine-whether-your-application-contains-os-specific-code](includes/determine-whether-your-application-contains-os-specific-code.md)]

[!INCLUDE [identify-all-outside-processes-and-daemons-running-on-the-production-servers](includes/identify-all-outside-processes-and-daemons-running-on-the-production-servers.md)]

[!INCLUDE [identify-spring-boot-versions](includes/identify-spring-boot-versions.md)]

For any applications using Spring Boot 1.x, follow the [Spring Boot 2.0 migration guide](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-2.0-Migration-Guide) to update them to a supported Spring Boot version.

### Review your database properties

If your application uses a database, review the database properties in your *application.properties* file to make sure your Spring Boot application can still access the database after you migrate to ACA. If your database is on-premises, you'll need to either migrate it to the cloud, or establish connectivity to your on-premises database.

### Identify log aggregation solutions

Identify any log aggregation solutions in use by the applications you're migrating.

### Identify application performance management (APM) agents

Identify any application performance monitoring agents in use with your applications (such as Dynatrace and Datadog). You'll need to reconfigure these APM agents to be included in a Dockerfile or Jib configuration, or to use the Application Insights in-process Java agent.

### Identify Zipkin dependencies

Determine whether your application has explicit dependencies on Zipkin. Look for dependencies on the `io.zipkin.java` group in your Maven or Gradle dependencies.

### Inventory external resources

Identify external resources, such as data sources, JMS message brokers, and URLs of other services. In Spring Boot applications, you can typically find the configuration for such resources in the *src/main/directory* folder, in a file typically called *application.properties* or *application.yml*. Additionally, check the production deployment's environment variables for any pertinent configuration settings.

[!INCLUDE [inventory-databases-spring-boot](includes/inventory-databases-spring-boot.md)]

[!INCLUDE [identify-jms-brokers-in-spring](includes/identify-jms-brokers-in-spring.md)]

After you've identified the broker or brokers in use, find the corresponding settings. In Spring Boot applications, you can typically find them in the *application.properties* and *application.yml* files in the application directory.

[!INCLUDE [jms-broker-settings-examples-in-spring](includes/jms-broker-settings-examples-in-spring.md)]

[!INCLUDE [identify-external-caches-azure-spring-apps](includes/identify-external-caches-azure-spring-apps.md)]

[!INCLUDE [inventory-configuration-sources-and-secrets-spring-boot](includes/inventory-configuration-sources-and-secrets-spring-boot.md)]

[!INCLUDE [inspect-the-deployment-architecture-spring-boot](includes/inspect-the-deployment-architecture-spring-boot.md)]

#### Identity providers

Identify all identity providers and all Spring Boot applications that require authentication and/or authorization. For information on how identity providers may be configured, consult the following resources:

* For OAuth or OAuth2 Spring Security configuration, see [Spring Security](https://spring.io/projects/spring-security).
* For Auth0 Spring Security configuration, see the [Auth0 Spring Security documentation](https://auth0.com/docs/quickstart/backend/java-spring-security5/01-authorization).
* For PingFederate Spring Security configuration, see the [Auth0 PingFederate instructions](https://auth0.com/authenticate/java-spring-security/ping-federate/).

#### Resources configured through VMware Tanzu Application Service (TAS) (formerly Pivotal Cloud Foundry)

For applications managed with TAS, external resources, including the resources described earlier, are often configured via TAS service bindings. To examine the configuration for such resources, use the [TAS (Cloud Foundry) CLI](https://docs.cloudfoundry.org/cf-cli/) to view the `VCAP_SERVICES` variable for the application, as shown in the following example:

```bash
# Sign in to TAS, if needed (enter credentials when prompted)
cf login -a <API endpoint>

# Set the organization and space containing the application, if not already selected during login.
cf target org <Organization Name>
cf target space <Space Name>

# Display variables for the application
cf env <Application Name>
```

Examine the `VCAP_SERVICES` variable for configuration settings of external services bound to the application. For more information, see the [TAS (Cloud Foundry) documentation](https://docs.cloudfoundry.org/devguide/deploy-apps/environment-variable.html#VCAP-SERVICES).

### In-place testing

Before you create container images, migrate your application to the JDK and Spring Boot version that you intend to use on Azure Kubernetes Service (AKS). Test your application thoroughly to ensure compatibility and performance.

## Migration

### Create a Docker image for Spring Boot

To create a Dockerfile, you'll need the following prerequisites:

* A supported JDK.
* Your JVM runtime options.
* A way to pass in environment variables (if applicable).

You can then do the steps described in the following sections, where applicable. You can use the [Spring Boot Container Quickstart repo](https://github.com/Azure/spring-boot-container-quickstart) as a starting point for your Dockerfile and your Spring Boot application.

### Build and push the Docker image to Azure Container Registry

After you've created the Dockerfile, you'll need to build the Docker image and publish it to your Azure container registry.

If you used our [Spring Boot Container Quickstart GitHub repo](https://github.com/Azure/spring-boot-container-quickstart), the process of building and pushing your image to your Azure container registry would be the equivalent of invoking the following three commands.

In these examples, the `MY_ACR` environment variable holds the name of your Azure container registry and the `MY_APP_NAME` variable holds the name of the web application you want to use on your Azure container registry.

Build the deployment file by using the following command:

```bash
mvn package
```

Sign in to your Azure container registry by using the following command:

```azurecli
az acr login --name ${MY_ACR}
```

Build and push the image by using the following command.

```azurecli
az acr build --image ${MY_ACR}.azurecr.io/${MY_APP_NAME} .
```

Alternatively, you can use Docker CLI to first build and test the image locally, as shown in the following commands. This approach can simplify testing and refining the image before initial deployment to ACR. However, it requires you to install the Docker CLI and ensure the Docker daemon is running.

Build the image by using the following command:

```bash
docker build -t ${MY_ACR}.azurecr.io/${MY_APP_NAME}
```

Run the image locally by using the following command:

```bash
docker run -it -p 8080:8080 ${MY_ACR}.azurecr.io/${MY_APP_NAME}
```

You can now access your application at `http://localhost:8080`.

Sign in to your Azure container registry by using the following command:

```azurecli
az acr login --name ${MY_ACR}
```

Push the image to your Azure container registry by using the following command:

```bash
docker push ${MY_ACR}.azurecr.io/${MY_APP_NAME}
```

For more in-depth information on building and storing container images in Azure, see [Build and store container images with Azure Container Registry](/training/modules/build-and-store-container-images/).

If you used our [Spring Boot Container Quickstart GitHub repo](https://github.com/Azure/spring-boot-container-quickstart), you can also include a custom keystore that will be added to your JVM upon startup. This addition will occur if you put the keystore file at */opt/spring-boot/mycert.crt*. You can do so by adding the file directly to the Dockerfile.

If you used our [Spring Boot Container Quickstart GitHub repo](https://github.com/Azure/spring-boot-container-quickstart), you can also enable Application Insights by setting the `APPLICATIONINSIGHTS_CONNECTION_STRING` environment variable in your Kubernetes deployment file. The value of the environment variable should look like *InstrumentationKey=00000000-0000-0000-0000-000000000000*. For more information, see [Java codeless application monitoring Azure Monitor Application Insights](/azure/azure-monitor/app/java-in-process-agent).

If you don't require any customization of your Docker image, you could alternatively explore the use of the [Maven Jib plugin](https://github.com/GoogleContainerTools/jib/tree/master/jib-maven-plugin).

### Deploy to Azure Container Apps

The following command shows an example deployment:

```azurecli
az containerapp create \
    --resource-group <RESOURCE_GROUP> \
    --name <APP_NAME> \
    --environment <ENVIRONMENT_NAME> \
    --image <IMAGE_NAME> \
    --target-port 8080 \
    --ingress 'external' \
    --registry-server <REGISTRY_SERVER> \
    --min-replicas 1
```

For a more in-depth quickstart, see [Quickstart: Deploy your first container app](/azure/container-apps/get-started?tabs=bash).

### Ensure console logging and configure diagnostic settings

Configure your logging so that all applications log to the console and not to files.

#### LogStash/ELK Stack

If you use LogStash/ELK Stack for log aggregation, configure the diagnostic setting to stream the console output to [Azure Event Hubs](/azure/event-hubs/). Then, use the [LogStash EventHub plugin](https://github.com/logstash-plugins/logstash-input-azure_event_hubs) to ingest logged events into LogStash.

#### Splunk

If you use Splunk for log aggregation, configure the diagnostic setting to stream the console output to [Azure Blob Storage](/azure/storage/blobs/). Then, use the [Splunk Add-on for Microsoft Cloud Services](https://splunkbase.splunk.com/app/3757/) to ingest logged events into Splunk.

### Migrate and enable the identity provider

If any of the Spring Boot applications require authentication or authorization, ensure they're configured to access the identity provider by using the following guidance:

* If the identity provider is Azure Active Directory, no changes should be necessary.
* If the identity provider is an on-premises Active Directory forest, consider implementing a hybrid identity solution with Azure Active Directory. For guidance, see the [Hybrid identity documentation](/azure/active-directory/hybrid/).
* If the identity provider is another on-premises solution, such as PingFederate, configure federation with Azure Active Directory. For more information, see [Custom installation of Azure Active Directory Connect](/azure/active-directory/hybrid/how-to-connect-install-custom). Alternatively, consider using Spring Security to use your identity provider through [OAuth2/OpenID Connect](https://docs.spring.io/spring-security/reference/index.html) or [SAML](https://docs.spring.io/spring-security/reference/index.html).

## Post-migration

Now that you've migrated your application to ACA, you should verify that it works as you expect. After you've done that, we have some recommendations for you that can make your application more cloud-native.

### Recommendations

* Design and implement a DevOps strategy. In order to maintain reliability while increasing your development velocity, consider automating deployments and testing with Azure Pipelines or GitHub Actions.

* Consider exposing application-specific metrics via Prometheus. Prometheus is an open-source metrics framework broadly adopted in the Kubernetes community. You can configure Prometheus Metrics scraping in Azure Monitor instead of hosting your own Prometheus server. Prometheus Metrics scraping enables metrics aggregation from your applications and automated response to or escalation of aberrant conditions. For more information, see [Configure scraping of Prometheus metrics with Container insights](/azure/azure-monitor/insights/container-insights-prometheus-integration).

* Consider monitoring the code cache size and adding the parameters `-XX:InitialCodeCacheSize` and `-XX:ReservedCodeCacheSize` to the `JAVA_OPTS` variable in the Dockerfile to further optimize performance. For more information, see [Codecache Tuning](https://docs.oracle.com/javase/8/embedded/develop-apps-platforms/codecache.htm) in the Oracle documentation.

* Consider adding Azure Monitor alert rules and action groups to quickly detect and address aberrant conditions.

* Consider replicating the Azure Container Apps deployment in another region for lower latency and higher reliability and fault tolerance. Use [Azure Traffic Manager](/azure/traffic-manager) to load balance among deployments or use [Azure Front Door](/azure/frontdoor) to add SSL offloading and Web Application Firewall with DDoS protection.

* If geo-replication isn't necessary, consider adding an [Azure Application Gateway](/azure/application-gateway) to add SSL offloading and Web Application Firewall with DDoS protection.
