---
title: Migrate Spring Boot applications to Azure Spring Cloud
description: This guide describes what you should be aware of when you want to migrate an existing Spring Boot application to run on Azure Spring Cloud.
author: yevster
ms.author: yebronsh
ms.topic: conceptual
ms.date: 5/26/2020
ms.custom: devx-track-java
---

# Migrate Spring Boot applications to Azure Spring Cloud

This guide describes what you should be aware of when you want to migrate an existing Spring Boot application to run on Azure Spring Cloud.

## Pre-migration

To ensure a successful migration, before you start, complete the assessment and inventory steps described in the following sections.

If you can't meet any of these pre-migration requirements, see the following companion migration guides:

* Migrate executable JAR applications to containers on Azure Kubernetes Service (guidance planned)
* Migrate executable JAR Applications to Azure Virtual Machines (guidance planned)

### Inspect application components

[!INCLUDE [identify-local-state](includes/identify-local-state-azure-spring-cloud.md)]

[!INCLUDE [static-content-azure-spring-cloud](includes/determine-whether-and-how-the-file-system-is-used-azure-spring-cloud.md)]

#### Determine whether any of the services contain OS-specific code

[!INCLUDE [determine-whether-your-application-contains-os-specific-code](includes/determine-whether-your-application-contains-os-specific-code-no-title.md)]

[!INCLUDE [switch-to-a-supported-platform-azure-spring-cloud](includes/switch-to-a-supported-platform-azure-spring-cloud.md)]

[!INCLUDE [identify-spring-boot-versions](includes/identify-spring-boot-versions.md)]

For any applications using Spring Boot 1.x, follow the [Spring Boot 2.0 migration guide](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-2.0-Migration-Guide) to update them to a supported Spring Boot version. For supported versions, see [Prepare a Java Spring app for deployment](/azure/spring-cloud/spring-cloud-tutorial-prepare-app-deployment#spring-boot-and-spring-cloud-versions).

[!INCLUDE [identify-logs-metrics-apm-azure-spring-cloud.md](includes/identify-logs-metrics-apm-azure-spring-cloud.md)]

### Inventory external resources

Identify external resources, such as data sources, JMS message brokers, and URLs of other services. In Spring Boot applications, you can typically find the configuration for such resources in the *src/main/directory* folder, in a file typically called *application.properties* or *application.yml*.

[!INCLUDE [inventory-databases-spring-boot](includes/inventory-databases-spring-boot.md)]

[!INCLUDE [identify-jms-brokers-in-spring](includes/identify-jms-brokers-in-spring.md)]

After you've identified the broker or brokers in use, find the corresponding settings. In Spring Boot applications, you can typically find them in the *application.properties* and *application.yml* files in the application directory.

[!INCLUDE [jms-broker-settings-examples-in-spring](includes/jms-broker-settings-examples-in-spring.md)]

[!INCLUDE [identify-external-caches-azure-spring-cloud](includes/identify-external-caches-azure-spring-cloud.md)]

[!INCLUDE [inventory-identity-providers-spring-boot.md](includes/inventory-identity-providers-spring-boot.md)]

#### Identify any clients relying on a non-standard port

Azure Spring Cloud overwrites the `server.port` setting in the deployed application. If any clients of the clients rely on the application being available on a port other than 443, you will need to modify them.

#### All other external resources

It isn't feasible for this guide to document every possible external dependency. After the migration, it's your responsibility to verify that you can satisfy every external dependency of your application.

[!INCLUDE [inventory-configuration-sources-and-secrets-spring-boot](includes/inventory-configuration-sources-and-secrets-spring-boot.md)]

[!INCLUDE [inspect-the-deployment-architecture-spring-boot](includes/inspect-the-deployment-architecture-spring-boot.md)]

## Migration

### Create an Azure Spring Cloud instance and apps

Provision an Azure Spring Cloud instance in your Azure subscription, if one does not already exist. Then, create an application there. For more information, see [Quickstart: Launch an existing Azure Spring Cloud application using the Azure portal](/azure/spring-cloud/spring-cloud-quickstart-launch-app-portal).

[!INCLUDE [ensure-console-logging-and-configure-diagnostic-settings-azure-spring-cloud](includes/ensure-console-logging-and-configure-diagnostic-settings-azure-spring-cloud.md)]

[!INCLUDE [configure-persistent-storage-azure-spring-cloud](includes/configure-persistent-storage-azure-spring-cloud.md)]

[!INCLUDE [migrate-all-certificates-to-keyvault-azure-spring-cloud](articles\java\migration\includes\migrate-all-certificates-to-keyvault-azure-spring-cloud.md)]

### Remove application performance management (APM) integrations

Eliminate any integrations with APM tools/agents. For information on configuring performance management with Azure Monitor, see the [Post-migration](#post-migration) section.

### Disable metrics clients and endpoints in your applications

Remove any metrics clients used or any metrics endpoints exposed in your applications.

### Deploy the application

Deploy each of the migrated microservices (not including the Spring Cloud Config and Registry servers), as described in [Quickstart: Launch an existing Azure Spring Cloud application using the Azure portal](/azure/spring-cloud/spring-cloud-quickstart-launch-app-portal).

### Configure per-service secrets and externalized settings

You can inject any per-service configuration settings into each service as environment variables. Use the following steps in the Azure portal:

1. Navigate to the Azure Spring Cloud Instance and select **Apps**.
1. Select the service to configure.
1. Select **Configuration**.
1. Enter the variables to configure.
1. Select **Save**.

![Spring Cloud App Configuration Settings](media/migrate-spring-cloud-to-azure-spring-cloud/spring-cloud-app-configuration-settings.png)

### Migrate and enable the identity provider

If any of the Spring Cloud applications require authentication or authorization, ensure they're configured to access the identity provider:

* If the identity provider is Azure Active Directory, no changes should be necessary.
* If the identity provider is an on-premises Active Directory forest, consider implementing a hybrid identity solution with Azure Active Directory. For more information, see the [Hybrid identity documentation](/azure/active-directory/hybrid/).
* If the identity provider is another on-premises solution, such as PingFederate, consult the [Custom installation of Azure AD Connect](/azure/active-directory/hybrid/how-to-connect-install-custom) topic to configure federation with Azure Active Directory. Alternatively, consider using Spring Security to use your identity provider through [OAuth2/OpenID Connect](https://docs.spring.io/spring-security/site/docs/current/reference/html5/#oauth2) or [SAML](https://docs.spring.io/spring-security/site/docs/current/reference/html5/#servlet-saml2).

### Expose the application

By default, applications deployed to Azure Spring Cloud are not visible externally. You can expose your application by making it public with the following command:

```azurecli
az spring-cloud app update -n <application name> --is-public true
```

Skip this step if you are using or intend to use a Spring Cloud Gateway (more on this in the following section).

## Post-migration

Now that you've completed your migration, verify that your application works as you expect. You can then make your application more cloud-native by using the following recommendations.

* Consider enabling your application to work with Spring Cloud Registry. This will enable your application to be dynamically discovered by other deployed microservices and clients. For more information, see [Tutorial: Prepare a Java Spring app for deployment](/azure/spring-cloud/spring-cloud-tutorial-prepare-app-deployment). Then, modify any application clients to use the Spring Client Load balancer. This allows the client to obtain addresses of all the running instances of the application and find an instance that works if another instance become corrupted or unresponsive. For more information, see [Spring Tips: Spring Cloud Loadbalancer](https://spring.io/blog/2020/03/25/spring-tips-spring-cloud-loadbalancer) in the Spring Blog.

* Instead of making your application public, consider adding a [Spring Cloud Gateway](https://cloud.spring.io/spring-cloud-gateway/reference/html/) instance. Spring Cloud Gateway provides a single endpoint for all applications/microservices deployed in your Azure Spring Cloud instance. If a Spring Cloud Gateway is already deployed, ensure that it's configured to route traffic to your newly deployed application.

* Consider adding a Spring Cloud Config server to centrally manage and version-control configuration for all your Spring Cloud microservices. First, create a Git repository to house the configuration and configure the Azure Spring Cloud instance to use it. For more information, see [Tutorial: Set up a Spring Cloud Config Server instance for your service](/azure/spring-cloud/spring-cloud-tutorial-config-server). Then, migrate your configuration using the following steps:

  1. Create a directory in the configuration Git repository with the same name as the application you defined on the Azure Spring Cloud instance.

  1. Inside this directory, create a *bootstrap.yml* file with the following contents:

     ```yml
     spring:
       application:
         name: <Your the application name used in the previous step>
     ```

  1. Create an *application.yml* file inside the directory above, and then move the application settings there. If the settings were previously in a *.properties* file, they will need to be converted to YAML.

  1. Commit and push these changes to the Git repository.

* Consider adding a deployment pipeline for automatic, consistent deployments. Instructions are available [for Azure Pipelines](/azure/spring-cloud/spring-cloud-howto-cicd), [for GitHub Actions](/azure/spring-cloud/spring-cloud-howto-github-actions), and [for Jenkins](/azure/jenkins/tutorial-jenkins-deploy-cli-spring-cloud-service).

* Consider using staging deployments to test code changes in production before they're available to some or all of your end users. For more information, see [Set up a staging environment in Azure Spring Cloud](/azure/spring-cloud/spring-cloud-howto-staging-environment).

* Consider adding service bindings to connect your application to supported Azure databases. These service bindings would eliminate the need for you to provide connection information, including credentials, to your Spring Cloud applications.

* Consider using Distributed Tracing and Azure App Insights to monitor performance and interactions of your applications. For more information, see [Use distributed tracing with Azure Spring Cloud](/azure/spring-cloud/spring-cloud-tutorial-distributed-tracing).

* Consider adding Azure Monitor alert rules and action groups to quickly detect and address aberrant conditions. For more information, see [Tutorial: Monitor Spring Cloud resources using alerts and action groups](/azure/spring-cloud/spring-cloud-tutorial-alerts-action-groups).

* Consider replicating the Azure Spring Cloud deployment in another region for lower latency and higher reliability and fault tolerance. Use [Azure Traffic Manager](/azure/traffic-manager) to load balance among deployments or use [Azure Front Door](/azure/frontdoor) to add SSL offloading and Web Application Firewall with DDoS protection.

* If geo-replication isn't necessary, consider adding an [Azure Application Gateway](/azure/application-gateway) to add SSL offloading and Web Application Firewall with DDoS protection.
