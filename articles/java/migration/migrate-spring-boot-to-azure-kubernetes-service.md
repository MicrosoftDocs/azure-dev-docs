---
title: Migrate Spring Boot applications to run on Azure Kubernetes Service
description: This guide describes what you should be aware of when you want to migrate an existing Spring Boot application to run in an Azure Kubernetes Service container.
author: mriem
ms.author: manriem
ms.topic: conceptual
ms.date: 4/10/2020
---

# Migrate Spring Boot applications to Azure Kubernetes Service

This guide describes what you should be aware of when you want to migrate an existing Spring Boot application to run on Azure Kubernetes Service (AKS).

## Pre-migration

To ensure a successful migration, before you start, complete the assessment and inventory steps described in the following sections.

### Validate that the supported Java version works correctly

We recommend using a supported version of Java when running a Spring Boot application on AKS. Confirm that your application runs correctly using that supported version.

[!INCLUDE [note-obtain-your-current-java-version](includes/note-obtain-your-current-java-version.md)]

### Determine whether and how the file system is used

Any usage of the file system by your Spring Boot application will require reconfiguration or, in rare cases, architectural changes. You may identify some or all of the scenarios described in the following sections.

[!INCLUDE [static-content](includes/static-content.md)]

[!INCLUDE [dynamic-or-internal-content-aks](includes/dynamic-or-internal-content-aks.md)]

[!INCLUDE [determine-whether-your-application-relies-on-scheduled-jobs](includes/determine-whether-your-application-relies-on-scheduled-jobs.md)]

[!INCLUDE [determine-whether-a-connection-to-on-premises-is-needed](includes/determine-whether-a-connection-to-on-premises-is-needed.md)]

[!INCLUDE [determine-whether-your-application-contains-os-specific-code](includes/determine-whether-your-application-contains-os-specific-code.md)]

[!INCLUDE [identify-all-outside-processes-and-daemons-running-on-the-production-servers](includes/identify-all-outside-processes-and-daemons-running-on-the-production-servers.md)]

[!INCLUDE [identify-spring-boot-versions](includes/identify-spring-boot-versions.md)]

### Review your database properties

If your application uses a database, review the database properties in your *application.properties* file to make sure your Spring Boot application can still access the database after you migrate to AKS. If your database is on-premise, you'll need to either migrate it to the cloud, or establish connectivity to your on-premise database.

### Identify log aggregation solutions

Identify any log aggregation solutions in use by the applications you are migrating.

### Identify application performance management (APM) agents

Identify any application performance monitoring agents in use with your applications (such as Dynatrace and Datadog). In place of such agents, Azure Spring Cloud offers deep integration with Azure Monitor for performance management and real-time response to aberrations. For more information, see [Post-migration](#post-migration).

### Identify Zipkin dependencies

Determine whether your application has explicit dependencies on Zipkin. Look for dependencies on the `io.zipkin.java` group in your Maven or Gradle dependencies.

### Inventory external resources

Identify external resources, such as data sources, JMS message brokers, and URLs of other services. In Spring Boot applications, you can typically find the configuration for such resources in the *src/main/directory* folder, in a file typically called *application.properties* or *application.yml*.

[!INCLUDE [inventory-databases-spring-boot](includes/inventory-databases-spring-boot.md)]

[!INCLUDE [identify-jms-brokers-in-spring](includes/identify-jms-brokers-in-spring.md)]

After you've identified the broker or brokers in use, find the corresponding settings. In Spring Boot applications, you can typically find them in the *application.properties* and *application.yml* files in the application directory.

[!INCLUDE [jms-broker-settings-examples-in-spring](includes/jms-broker-settings-examples-in-spring.md)]

[!INCLUDE [identify-external-caches-azure-spring-cloud](includes/identify-external-caches-azure-spring-cloud.md)]

#### Identity providers

Identify all identity providers and all Spring Boot applications that require authentication and/or authorization. For information on how identity providers may be configured, consult the following:

* For Auth0 Spring Security configuration, see the [Auth0 Spring Security documentation](https://auth0.com/docs/quickstart/backend/java-spring-security5/01-authorization).
* For PingFederate Spring Security configuration, see the [Auth0 PingFederate instructions](https://auth0.com/authenticate/java-spring-security/ping-federate/).

#### Resources configured through Pivotal Cloud Foundry (PCF)

For applications managed with Pivotal Cloud Foundry, external resources, including the resources described earlier, are often configured via PCF service bindings. To examine the configuration for such resources, use the [Cloud Foundry CLI](https://docs.cloudfoundry.org/cf-cli/) view the `VCAP_SERVICES` variable for the application.

```bash
# Log into PCF, if needed (enter credentials when prompted)
cf login -a <API endpoint>

# Set the organization and space containing the application, if not already selected during login.
cf target org <Organization Name>
cf target space <Space Name>

# Display variables for the application
cf env <Application Name>
```

Examine the `VCAP_SERVICES` variable for configuration settings of external services bound to the application. For more information, see [PCF documentation](https://docs.cloudfoundry.org/devguide/deploy-apps/environment-variable.html#VCAP-SERVICES).

[!INCLUDE [inventory-configuration-sources-and-secrets](includes/inventory-configuration-sources-and-secrets.md)]

[!INCLUDE [inspect-the-deployment-architecture](includes/inspect-the-deployment-architecture.md)]

### In-place testing

Before you create container images, migrate your application to the JDK and Spring Boot version that you intend to use on AKS. Test your application thoroughly to ensure compatibility and performance.

## Migration

[!INCLUDE [provision-azure-container-registry-and-azure-kubernetes-service](includes/provision-azure-container-registry-and-azure-kubernetes-service.md)]

### Create a Docker image for Spring Boot

To create a Dockerfile, you'll need the following prerequisites:

* A supported JDK.
* Your JVM runtime options.
* A way to pass in environment variables (if applicable).

You can then do the steps described in the following sections, where applicable. You can use the [Spring Boot Container Quickstart repo](https://github.com/Azure/spring-boot-container-quickstart) as a starting point for your Dockerfile and your Spring Boot application.

#### Configure KeyVault FlexVolume

Create an Azure KeyVault and populate all the necessary secrets. For more information, see [Quickstart: Set and retrieve a secret from Azure Key Vault using Azure CLI](/azure/key-vault/quick-create-cli). Then, configure a [KeyVault FlexVolume](https://github.com/Azure/kubernetes-keyvault-flexvol/blob/master/README.md) to make those secrets accessible to pods.

You'll also need to update the startup script used to bootstrap your Spring Boot application. This script must import the certificates into the keystore used by Spring Boot before starting the application.

### Build and push the Docker image to Azure Container Registry

After you've created the Dockerfile, you'll need to build the Docker image and publish it to your Azure container registry.

If you used our [Spring Boot Container Quickstart GitHub repo](https://github.com/Azure/spring-boot-container-quickstart), the process of building and pushing your image to your Azure container registry would be the equivalent of invoking the following three commands.

In these examples, the `MY_ACR` environment variable holds the name of your Azure container registry and the `MY_APP_NAME` variable holds the name of the web application you want to use on your Azure container registry.

Build the deployment file:

```bash
mvn package
```

Log into your Azure container registry:

```azurecli
az acr login -n ${MY_ACR}
```

Build and push the image:

```azurecli
az acr build -t ${MY_ACR}.azurecr.io/${MY_APP_NAME} .
```

Alternatively, you can use Docker CLI to first build and test the image locally, as shown in the following commands. This approach can simplify testing and refining the image before initial deployment to ACR. However, it requires you to install the Docker CLI and ensure the Docker daemon is running.

Build the image:

```bash
docker build -t ${MY_ACR}.azurecr.io/${MY_APP_NAME}
```

Run the image locally:

```bash
docker run -it -p 8080:8080 ${MY_ACR}.azurecr.io/${MY_APP_NAME}
```

You can now access your application at [http://localhost:8080](http://localhost:8080).

Log into your Azure container registry:

```azurecli
az acr login -n ${MY_ACR}
```

Push the image to your Azure container registry:

```bash
docker push ${MY_ACR}.azurecr.io/${MY_APP_NAME}
```

For more in-depth information on building and storing container images in Azure, see the Learn module [Build and store container images with Azure Container Registry](/learn/modules/build-and-store-container-images/).

If you used our [Spring Boot Container Quickstart GitHub repo](https://github.com/Azure/spring-boot-container-quickstart), you can also include a custom keystore that will be added to your JVM upon startup. This addition will occur if you put the keystore file at */opt/spring-boot/mycert.crt*. You can do so by adding the file directly to the Dockerfile, or by using a KeyVault FlexVolume, as mentioned previously.

If you used our [Spring Boot Container Quickstart GitHub repo](https://github.com/Azure/spring-boot-container-quickstart), you can also enable Application Insights by setting the `APPLICATIONINSIGHTS_CONNECTION_STRING` environment variable in your Kubernetes deployment file (the value of the environment variable should look `InstrumentationKey=00000000-0000-0000-0000-000000000000`). For more information, see [Java codeless application monitoring Azure Monitor Application Insights](/azure/azure-monitor/app/java-in-process-agent).

If you don't require any customization of your Docker image, you could alternatively explore the use of the [Maven Jib plugin](https://github.com/GoogleContainerTools/jib/tree/master/jib-maven-plugin) or deploy to AKS. For more information, see [Deploy Spring Boot Application to the Azure Kubernetes Service](/azure/developer/java/spring-framework/deploy-spring-boot-java-app-on-kubernetes).

[!INCLUDE [provision-a-public-ip-address](includes/provision-a-public-ip-address.md)]

### Deploy to AKS

Create and apply your Kubernetes YAML file(s). For more information, see [Quickstart: Deploy an Azure Kubernetes Service cluster using the Azure CLI](/azure/aks/kubernetes-walkthrough#run-the-application). If you're creating an external load balancer (whether for your application or for an ingress controller), be sure to provide the IP address provisioned in the previous section as the `LoadBalancerIP`.

Include externalized parameters as environment variables. For more information, see [Define Environment Variables for a Container](https://kubernetes.io/docs/tasks/inject-data-application/define-environment-variable-container/).

Be sure to include memory and CPU settings when creating your deployment YAML so your containers are properly sized.

### Ensure console logging and configure diagnostic settings

Configure your logging so that all applications log to the console and not to files.

After an application is deployed to Azure Kubernetes Service, you can see the logs by using `kubectl`.

#### LogStash/ELK Stack

If you use LogStash/ELK Stack for log aggregation, configure the diagnostic setting to stream the console output to an [Azure Event Hub](/azure/event-hubs/). Then, use the [LogStash EventHub plugin](https://github.com/logstash-plugins/logstash-input-azure_event_hubs) to ingest logged events into LogStash.

#### Splunk

If you use Splunk for log aggregation, configure the diagnostic setting to stream the console output to [Azure Blob Storage](/azure/storage/blobs/). Then, use the [Splunk Add-on for Microsoft Cloud Services](https://splunkbase.splunk.com/app/3757/) to ingest logged events into Splunk.

### Migrate and enable the identity provider

If any of the Spring Boot applications require authentication or authorization, ensure they're configured to access the identity provider:

* If the identity provider is Azure Active Directory, no changes should be necessary.
* If the identity provider is an on-premises Active Directory forest, consider implementing a hybrid identity solution with Azure Active Directory. For guidance, see the [Hybrid identity documentation](/azure/active-directory/hybrid/).
* If the identity provider is another on-premises solution, such as PingFederate, consult the [Custom installation of Azure AD Connect](/azure/active-directory/hybrid/how-to-connect-install-custom) topic to configure federation with Azure Active Directory. Alternatively, consider using Spring Security to use your identity provider through [OAuth2/OpenID Connect](https://docs.spring.io/spring-security/site/docs/current/reference/html5/#oauth2) or [SAML](https://docs.spring.io/spring-security/site/docs/current/reference/html5/#servlet-saml2).

### Configure persistent storage

If your application requires non-volatile storage, configure one or more [Persistent Volumes](/azure/aks/azure-disks-dynamic-pv).

[!INCLUDE [migrate-scheduled-jobs-aks](includes/migrate-scheduled-jobs-aks.md)]

## Post-migration

Now that you've migrated your application to AKS, you should verify that it works as you expect. After you've done that, we have some recommendations for you that can make your application more cloud-native.

### Recommendations

* Consider adding a DNS name to the IP address allocated to your ingress controller or application load balancer. For more information, see [Create an ingress controller with a static public IP address in AKS](/azure/aks/ingress-static-ip).

* Consider adding [HELM charts](https://helm.sh/docs/topics/charts/) for your application. A helm chart allows you to parameterize your application deployment for use and customization by a more diverse set of customers.

* Design and implement a DevOps strategy. In order to maintain reliability while increasing your development velocity, consider automating deployments and testing with Azure Pipelines. For more information, see [Build and deploy to AKS](/azure/devops/pipelines/ecosystems/kubernetes/aks-template).

* Enable [Azure Monitoring for the cluster](/azure/azure-monitor/insights/container-insights-enable-existing-clusters) to allow the collection of container logs, track usage, and so on.

* Consider exposing application-specific metrics via Prometheus. Prometheus is an open-source metrics framework broadly adopted in the Kubernetes community. You can configure [Prometheus Metrics scraping in Azure Monitor](/azure/azure-monitor/insights/container-insights-prometheus-integration) instead of hosting your own Prometheus server to enable metrics aggregation from your applications and automated response to or escalation of aberrant conditions.

* Design and implement a business continuity and disaster recovery strategy. For mission-critical applications, consider a [multi-region deployment architecture](/azure/aks/operator-best-practices-multi-region).

* Review the [Kubernetes Version Support policy](/azure/aks/supported-kubernetes-versions#kubernetes-version-support-policy). It's your responsibility to keep [updating your AKS cluster](/azure/aks/upgrade-cluster) to ensure it's always running a supported version.

* Have all team members responsible for cluster administration and application development review the pertinent [AKS best practices](/azure/aks/best-practices).

* Make sure your deployment file specifies how rolling updates are done. For more information, see [Rolling Update Deployment](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/#rolling-update-deployment) in the Kubernetes documentation.

* Set up auto scaling to deal with peak time loads. For more information, see [Automatically scale a cluster to meet application demands on AKS](/azure/aks/cluster-autoscaler).

* Consider [monitoring the code cache size](https://docs.oracle.com/javase/8/embedded/develop-apps-platforms/codecache.htm) and adding the parameters `-XX:InitialCodeCacheSize` and `-XX:ReservedCodeCacheSize` to the `JAVA_OPTS` variable in the Dockerfile to further optimize performance.
