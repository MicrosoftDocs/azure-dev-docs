---
title: Migrate Spring Boot applications to Azure Spring Cloud
description: This guide describes what you should be aware of when you want to migrate an existing Spring Boot application to run on Azure Spring Cloud.
author: yevster
ms.author: yebronsh
ms.topic: conceptual
ms.date: 5/26/2020
---

# Migrate Spring Boot applications to Azure Spring Cloud

This guide describes what you should be aware of when you want to migrate an existing Spring Cloud application to run on Azure Spring Cloud.

## Pre-migration

To ensure a successful migration, before you start, complete the assessment and inventory steps described in the following sections.

If you can't meet any of these pre-migration requirements, see the following companion migration guides:

* Migrate executable JAR applications to containers on Azure Kubernetes Service (guidance planned)
* Migrate executable JAR Applications to Azure Virtual Machines (guidance planned)

### Inspect application components

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

#### All other external resources

It isn't feasible for this guide to document every possible external dependency. After the migration, it's your responsibility to verify that you can satisfy every external dependency of your application.

[!INCLUDE [inventory-configuration-sources-and-secrets-spring-boot](includes/inventory-configuration-sources-and-secrets-spring-boot.md)]

[!INCLUDE [inspect-the-deployment-architecture-spring-boot](includes/inspect-the-deployment-architecture-spring-boot.md)]

## Migration

### Create an Azure Spring Cloud instance and apps

Provision an Azure Spring Cloud instance in your Azure subscription. Then, provision an app for every service you're migrating. Don't include the Spring Cloud registry and configuration servers. Do include the Spring Cloud Gateway service. For instructions, see [Quickstart: Launch an existing Azure Spring Cloud application using the Azure portal](/azure/spring-cloud/spring-cloud-quickstart-launch-app-portal).

[!INCLUDE [ensure-console-logging-and-configure-diagnostic-settings-azure-spring-cloud](includes/ensure-console-logging-and-configure-diagnostic-settings-azure-spring-cloud.md)]

[!INCLUDE [configure-persistent-storage-azure-spring-cloud](includes/configure-persistent-storage-azure-spring-cloud.md)]

### Migrate Spring Cloud Vault secrets to Azure KeyVault

You can inject secrets directly into applications through Spring by using the Azure KeyVault Spring Boot Starter. For more information, see [How to use the Spring Boot Starter for Azure Key Vault](/azure/developer/java/spring-framework/configure-spring-boot-starter-java-app-with-azure-key-vault).

> [!NOTE]
> Migration may require you to rename some secrets. Update your application code accordingly.

### Migrate all certificates to KeyVault

Azure Spring Cloud doesn't provide access to the JRE keystore, so you must migrate certificates to Azure KeyVault, and change the application code to access certificates in KeyVault. For more information, see [Get started with Key Vault certificates](/azure/key-vault/certificates/certificate-scenarios) and [Azure Key Vault Certificate client library for Java](/java/api/overview/azure/security-keyvault-certificates-readme).

### Remove application performance management (APM) integrations

Eliminate any integrations with APM tools/agents. For information on configuring performance management with Azure Monitor, see the [Post-migration](#post-migration) section.

### Replace explicit Zipkin dependencies with Spring Cloud Starters

If any of the migrated applications has explicit Zipkin dependencies, remove them and replace them with Spring Cloud Starters as described in the [Distributed Tracing Dependency](/azure/spring-cloud/spring-cloud-tutorial-prepare-app-deployment#distributed-tracing-dependency) section of [Prepare a Java Spring application for deployment in Azure Spring Cloud](/azure/spring-cloud/spring-cloud-tutorial-prepare-app-deployment). For information on distributed tracing with Azure App Insights, see the [Post-migration](#post-migration) section.

### Disable metrics clients and endpoints in your applications

Remove any metrics clients used or any metrics endpoints exposed in your applications.

### Deploy the services

Deploy each of the migrated microservices (not including the Spring Cloud Config and Registry servers), as described in the [Quickstart: Launch an existing Azure Spring Cloud application using the Azure portal](/azure/spring-cloud/spring-cloud-quickstart-launch-app-portal).

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
* If the identity provider is an on-premises Active Directory forest, consider implementing a hybrid identity solution with Azure Active Directory. For guidance, see the [Hybrid identity documentation](/azure/active-directory/hybrid/).
* If the identity provider is another on-premises solution, such as PingFederate, consult the [Custom installation of Azure AD Connect](/azure/active-directory/hybrid/how-to-connect-install-custom) topic to configure federation with Azure Active Directory. Alternatively, consider using Spring Security to use your identity provider through [OAuth2/OpenID Connect](https://docs.spring.io/spring-security/site/docs/current/reference/html5/#oauth2) or [SAML](https://docs.spring.io/spring-security/site/docs/current/reference/html5/#servlet-saml2).

### Update client applications

Update the configuration of all client applications to use the published Azure Spring Cloud endpoints for migrated applications.

## Post-migration

* Consider Adding a Spring Cloud Config server to centrally manage and version-control configuration for all your Spring Cloud microservices. For more information, see [Tutorial: Set up a Spring Cloud Config Server instance for your service](/azure/spring-cloud/spring-cloud-tutorial-config-server).

* Consider adding a deployment pipeline for automatic, consistent deployments. Instructions are available [for Azure Pipelines](/azure/spring-cloud/spring-cloud-howto-cicd), [for GitHub Actions](/azure/spring-cloud/spring-cloud-howto-github-actions), and [for Jenkins](/azure/jenkins/tutorial-jenkins-deploy-cli-spring-cloud-service).

* Consider using staging deployments to test code changes in production before they're available to some or all of your end users. For more information, see [Set up a staging environment in Azure Spring Cloud](/azure/spring-cloud/spring-cloud-howto-staging-environment).

* Consider adding service bindings to connect your application to supported Azure databases. These service bindings would eliminate the need for you to provide connection information, including credentials, to your Spring Cloud applications.

* Consider [using Distributed Tracing and Azure App Insights](/azure/spring-cloud/spring-cloud-tutorial-distributed-tracing) to monitor performance and interactions of your applications.

* Consider adding Azure Monitor alert rules and action groups to quickly detect and address aberrant conditions. For more information, see [Tutorial: Monitor Spring Cloud resources using alerts and action groups](/azure/spring-cloud/spring-cloud-tutorial-alerts-action-groups).

* Consider replicating the Azure Spring Cloud deployment in another region for lower latency and higher reliability and fault tolerance. Use [Azure Traffic Manager](/azure/traffic-manager) to load balance among deployments or use [Azure Front Door](/azure/frontdoor) to add SSL offloading and Web Application Firewall with DDoS protection.

* If geo-replication isn't necessary, consider adding an [Azure Application Gateway](/azure/application-gateway) to add SSL offloading and Web Application Firewall with DDoS protection.

* If your applications use legacy Spring Cloud Netflix components, consider replacing them with current alternatives:

   | Legacy                        | Current                                                |
   |-------------------------------|--------------------------------------------------------|
   | Spring Cloud Eureka           | Spring Cloud Service Registry                          |
   | Spring Cloud Netflix Zuul     | Spring Cloud Gateway                                   |
   | Spring Cloud Netflix Archaius | Spring Cloud Config Server                             |
   | Spring Cloud Netflix Ribbon   | Spring Cloud Load Balancer (client-side load balancer) |
   | Spring Cloud Hystrix          | Spring Cloud Circuit Breaker + Resilience4J            |
   | Spring Cloud Netflix Turbine  | Micrometer + Prometheus                                |
