---
title: Migrate Spring Cloud applications to Azure Container Apps
description: This guide describes what you should be aware of when you want to migrate an existing Spring Cloud application to run on Azure Container Apps.
author: KarlErickson
ms.author: karler
ms.topic: upgrade-and-migration-article
ms.date: 09/30/2024
ms.custom: devx-track-java, migration-java, devx-track-extended-java
recommendations: false
---

# Migrate Spring Cloud applications to Azure Container Apps

This guide describes what you should be aware of when you want to migrate an existing Spring Cloud application to run on Azure Container Apps.

## Pre-migration

To ensure a successful migration, before you start, complete the assessment and inventory steps described in the following sections.

If you can't meet any of these pre-migration requirements, see the following companion migration guides:

* Migrate executable JAR applications to containers on Azure Kubernetes Service (guidance planned)
* Migrate executable JAR Applications to Azure Virtual Machines (guidance planned)

### Inspect application components

[!INCLUDE [determine-whether-and-how-the-file-system-is-used-azure-container-apps](includes/determine-whether-and-how-the-file-system-is-used-azure-container-apps.md)]

#### Determine whether any of the services contain OS-specific code

[!INCLUDE [determine-whether-your-application-contains-os-specific-code](includes/determine-whether-your-application-contains-os-specific-code-no-title.md)]

[!INCLUDE [switch-to-a-supported-platform-azure-container-apps](includes/switch-to-a-supported-platform-azure-container-apps.md)]

[!INCLUDE [identify-spring-boot-versions](includes/identify-spring-boot-versions.md)]

For any applications using Spring Boot versions prior to 3.x, follow the [Spring Boot 2.0 migration guide](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-2.0-Migration-Guide) or [Spring Boot 3.0 Migration Guide](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-3.0-Migration-Guide) to update them to a supported Spring Boot version. For supported versions, see the [Spring Cloud](https://spring.io/projects/spring-cloud#overview) documentation.

#### Identify Spring Cloud versions

Examine the dependencies of each application you're migrating to determine the version of the Spring Cloud components it uses.

##### Maven

In Maven projects, the Spring Cloud version is typically set in the `spring-cloud.version` property:

```xml
  <properties>
    <spring-cloud.version>2023.0.2</spring-cloud.version>
  </properties>
```

##### Gradle

In Gradle projects, the Spring Cloud version is typically set in the "extra properties" block:

```gradle
ext {
  set('springCloudVersion', "2023.0.2")
}
```

You need to update all applications to use supported versions of Spring Cloud. For supported versions, see the [Spring Cloud](https://spring.io/projects/spring-cloud#overview) documentation.

[!INCLUDE [identify-logs-metrics-apm-azure-container-apps.md](includes/identify-logs-metrics-apm-azure-container-apps.md)]

### Inventory external resources

Identify external resources, such as data sources, JMS message brokers, and URLs of other services. In Spring Cloud applications, you can typically find the configuration for such resources in one of the following locations:

* In the **src/main/resources** folder, in a file typically called **application.properties** or **application.yml**.
* In the Spring Cloud Config Server repository that you identified in the previous step.

[!INCLUDE [inventory-databases-spring-boot](includes/inventory-databases-spring-boot.md)]

[!INCLUDE [identify-jms-brokers-in-spring](includes/identify-jms-brokers-in-spring.md)]

After you've identified the broker or brokers in use, find the corresponding settings. In Spring Cloud applications, you can typically find them in the **application.properties** and **application.yml** files in the application directory, or in the Spring Cloud Config Server repository.

[!INCLUDE [jms-broker-settings-examples-in-spring](includes/jms-broker-settings-examples-in-spring.md)]

[!INCLUDE [identify-external-caches-azure-container-apps](includes/identify-external-caches-azure-container-apps.md)]

#### Identity providers

Identify all identity providers and all Spring Cloud applications that require authentication and/or authorization. For information on how you can configure identity providers, see the following resources:

* For OAuth2 configuration, see the [Spring Cloud Security quickstart](https://spring.io/projects/spring-cloud-security).
* For Auth0 Spring Security configuration, see the [Auth0 Spring Security documentation](https://auth0.com/docs/quickstart/backend/java-spring-security5/01-authorization).
* For PingFederate Spring Security configuration, see the [Auth0 PingFederate instructions](https://auth0.com/authenticate/java-spring-security/ping-federate/).

#### Resources configured through VMware Tanzu Application Service (TAS) (formerly Pivotal Cloud Foundry)

For applications managed with TAS, external resources, including the resources described earlier, are often configured via TAS service bindings. To examine the configuration for such resources, use the [TAS (Cloud Foundry) CLI](https://docs.cloudfoundry.org/cf-cli/) to view the `VCAP_SERVICES` variable for the application.

```bash
# Log into TAS, if needed (enter credentials when prompted)
cf login -a <API endpoint>

# Set the organization and space containing the application, if not already selected during login.
cf target org <organization name>
cf target space <space name>

# Display variables for the application
cf env <Application Name>
```

Examine the `VCAP_SERVICES` variable for configuration settings of external services bound to the application. For more information, see the [TAS (Cloud Foundry) documentation](https://docs.cloudfoundry.org/devguide/deploy-apps/environment-variable.html#VCAP-SERVICES).

#### All other external resources

It isn't feasible for this guide to document every possible external dependency. After the migration, it's your responsibility to verify that you can satisfy every external dependency of your application.

[!INCLUDE [inventory-configuration-sources-and-secrets-spring-cloud](includes/inventory-configuration-sources-and-secrets-spring-cloud.md)]

[!INCLUDE [inspect-the-deployment-architecture-spring-cloud](includes/inspect-the-deployment-architecture-spring-cloud.md)]

## Migration

### Remove restricted configurations

The Azure Container Apps environment offers managed Eureka Server, Spring Cloud Config Server, and Admin. When an application is bound to the Java component, Azure Container Apps injects related properties as system environment variables. According to the [Spring Boot Externalized Configuration](https://docs.spring.io/spring-boot/reference/features/external-config.html) design, application properties defined in your code or packaged in artifacts are overwritten by system environment variables.

If you set one of the following properties via command-line argument, a Java system property, or container's environment variable, you must remove it to avoid conflicts and unexpected behavior:

* `SPRING_CLOUD_CONFIG_COMPONENT_URI`
* `SPRING_CLOUD_CONFIG_URI`
* `SPRING_CONFIG_IMPORT`
* `eureka.client.fetch-registry`
* `eureka.client.service-url.defaultZone`
* `eureka.instance.prefer-ip-address`
* `eureka.client.register-with-eureka`
* `SPRING_BOOT_ADMIN_CLIENT_INSTANCE_PREFER-IP`
* `SPRING_BOOT_ADMIN_CLIENT_URL`

### Create an Azure Container Apps managed environment and apps

Provision an Azure Container Apps app in your Azure subscription on an existing managed environment or create a new one for every service you're migrating. You don't need to create apps running as Spring Cloud registry and Configuration servers. For more information, see [Quickstart: Deploy your first container app using the Azure portal](/azure/container-apps/quickstart-portal).

### Prepare the Spring Cloud Config Server

Configure the Config server in your Azure Container Apps for Spring component. For more information, see [Configure settings for the Config Server for Spring component in Azure Container Apps](/azure/container-apps/java-config-server-usage).

> [!NOTE]
> If your current Spring Cloud Config repository is on the local file system or on premises, you first need to migrate or replicate your configuration files to a cloud-based repository, such as GitHub, Azure Repos, or BitBucket.

[!INCLUDE [ensure-console-logging-and-configure-diagnostic-settings-azure-container-apps](includes/ensure-console-logging-and-configure-diagnostic-settings-azure-container-apps.md)]

[!INCLUDE [configure-persistent-storage-azure-container-apps](includes/configure-persistent-storage-azure-container-apps.md)]

### Migrate Spring Cloud Vault secrets to Azure KeyVault

You can inject secrets directly into applications through Spring by using the Azure KeyVault Spring Boot Starter. For more information, see [How to use the Spring Boot Starter for Azure Key Vault](../spring-framework/configure-spring-boot-starter-java-app-with-azure-key-vault.md).

> [!NOTE]
> Migration might require you to rename some secrets. Update your application code accordingly.

[!INCLUDE [migrate-all-certificates-to-keyvault-azure-container-apps](includes/migrate-all-certificates-to-keyvault-azure-container-apps.md)]

### Configure application performance management (APM) integrations

If you've already configured APM-related variables within the container, all you need to do is ensure that the connection to the target APM platform can be established. If the APM configuration references environment variables from the container, you need to set the runtime environment variables accordingly on Azure Container Apps. Sensitive information, such as the connection string, should be handled securely. You can either specify it as a secret or reference a secret stored in Azure Key Vault.

### Configure per-service secrets and externalized settings

You can inject configuration settings into each container as environment variables. Any changes in the variables create a new revision for the existing app. Secrets are key-value pairs and remain valid across all revisions.

### Migrate and enable the identity provider

If any of the Spring Cloud applications require authentication or authorization, use the following guidelines to ensure that they're configured to access the identity provider:

* If the identity provider is Microsoft Entra ID, no changes should be necessary.
* If the identity provider is an on-premises Active Directory forest, consider implementing a hybrid identity solution with Microsoft Entra ID. For guidance, see the [Hybrid identity documentation](/azure/active-directory/hybrid/).
* If the identity provider is another on-premises solution, such as PingFederate, consult the [Custom installation of Microsoft Entra Connect](/azure/active-directory/hybrid/how-to-connect-install-custom) topic to configure federation with Microsoft Entra ID. Alternatively, consider using Spring Security to use your identity provider through [OAuth2/OpenID Connect](https://docs.spring.io/spring-security/reference/index.html) or [SAML](https://docs.spring.io/spring-security/reference/index.html).

### Update client applications

Update the configuration of all client applications to use the published Azure Container Apps endpoints for migrated applications.

## Post-migration

[!INCLUDE [post-migration-spring-boot-azure-container-apps](includes/post-migration-spring-boot-azure-container-apps.md)]

* If your applications use legacy Spring Cloud Netflix components, consider replacing them with current alternatives, as shown in the following table:

  | Legacy                        | Current                                                |
  |-------------------------------|--------------------------------------------------------|
  | Spring Cloud Eureka           | Spring Cloud Service Registry                          |
  | Spring Cloud Netflix Zuul     | Spring Cloud Gateway                                   |
  | Spring Cloud Netflix Archaius | Spring Cloud Config Server                             |
  | Spring Cloud Netflix Ribbon   | Spring Cloud Load Balancer (client-side load balancer) |
  | Spring Cloud Hystrix          | Spring Cloud Circuit Breaker + Resilience4J            |
  | Spring Cloud Netflix Turbine  | Micrometer + Prometheus                                |
