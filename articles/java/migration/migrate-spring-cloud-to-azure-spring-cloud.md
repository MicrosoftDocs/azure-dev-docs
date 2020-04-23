---
title: Migrate Spring Cloud applications to Azure Spring Cloud
description: This guide describes what you should be aware of when you want to migrate an existing Spring Cloud application to run on Azure Spring Cloud
author: yevster
ms.author: yebronsh
ms.topic: conceptual
ms.date: 2/12/2020
---

# Migrate Spring Cloud applications to Azure Spring Cloud

This guide describes what you should be aware of when you want to migrate an existing Spring Cloud application to run on Azure Spring Cloud.

## Before you start

If you can't meet any of the pre-migration requirements, see the following companion migration guides:

* Migrate executable JAR applications to containers on Azure Kubernetes Service (planned)
* Migrate executable JAR Applications to Azure Virtual Machines (planned)

To ensure a successful migration, some assessment and inventory steps are necessary before starting:

1. [Inspect application components](#inspect-application-components).
1. [Inventory external resources](#inventory-external-resources)
1. [Inventory configuration sources and secrets](#inventory-configuration-sources-and-secrets).
1. [Inspect the deployment architecture](#inspect-the-deployment-architecture).

### Inspect application components

[!INCLUDE [identify-use-of-local-file-system-azure-spring-cloud](includes/identify-use-of-local-file-system-azure-spring-cloud.md)]

#### Determine whether any of the services contain OS-specific code

[!INCLUDE [determine-whether-your-application-contains-os-specific-code](includes/determine-whether-your-application-contains-os-specific-code-no-title.md)]

[!INCLUDE [switch-to-a-supported-platform-azure-spring-cloud](includes/switch-to-a-supported-platform-azure-spring-cloud.md)]

[!INCLUDE [identify-spring-boot-versions-azure-spring-cloud](includes/identify-spring-boot-versions-azure-spring-cloud.md)]

#### Identify Spring Cloud Version(s)

Examine the dependencies of each application being migrated to determine the version of the Spring Cloud components it uses.

##### Maven

In Maven projects, the Spring Cloud version is typically set in the `spring-cloud.version` property:

```xml
  <properties>
    <java.version>1.8</java.version>
    <spring-cloud.version>Hoxton.SR3</spring-cloud.version>
  </properties>
```

##### Gradle

In Gradle projects, the Spring Cloud version is typically set in the "extra properties" block:

```gradle
ext {
  set('springCloudVersion', "Hoxton.SR3")
}
```

[!INCLUDE [identify-logs-metrics-apm-azure-spring-cloud.md](includes/identify-logs-metrics-apm-azure-spring-cloud.md)]

#### Identify Zipkin Dependencies

Determine if your application has explicit dependencies on Zipkin. Look for dependencies on the `io.zipkin.java` group in your Maven or Gradle dependencies.

### Inventory external resources

Identify external resources, such as data sources, JMS message brokers, and URLs of other services. In Spring Cloud applications, you can typically find the configuration for such resources in one of the following locations:

* In the *src/main/directory* folder in a file typically called *application.properties* or *application.yml*.
* In the Spring Cloud Config repository identified in the previous step.

[!INCLUDE [inventory-databases-spring-boot](includes/inventory-databases-spring-boot.md)]

#### JMS Message Brokers

[!INCLUDE [identify-jms-brokers-in-spring](includes/identify-jms-brokers-in-spring.md)]

After you've identified the broker or brokers in use, find the corresponding settings. In Spring Cloud applications, you can typically find them in the *application.properties* and *application.yml* files in the application directory, or in the Spring Cloud Config server repository.

[!INCLUDE [jms-broker-settings-examples-in-spring](includes/jms-broker-settings-examples-in-spring.md)]

[!INCLUDE [external-caches-azure-spring-cloud](includes/external-caches-azure-spring-cloud.md)]

#### Identity Providers

Identify all identity providers as well as all Spring Cloud applications that require authentication and/or authorization. Consult the [Spring Cloud Security quickstart](https://cloud.spring.io/spring-cloud-static/spring-cloud-security/current/reference/html/#_quickstart) for examples of how such applications are typically configured.

#### Resources configured through Pivotal Cloud Foundry (PCF)

For applications managed with Pivotal Cloud Foundry, external resources, including those described above, are often configured via PCF service bindings. To examine the configuration for such resources, use the [Cloud Foundry CLI](https://docs.cloudfoundry.org/cf-cli/) view the `VCAP_SERVICES` variable for the application.

```bash
# Log into PCF, if needed (enter credentials when prompted)
cf login -a <API endpoint>

# Set the organization and space containing the application, if not already selected during login.
cf target org <Organization Name>
cf target space <Space Name>

# Display variables for the application
cf env <Application Name>
```

Examine the 'VCAP_SERVICES' for configuration settings of external services bound to the application. See [PCF documentation](https://docs.cloudfoundry.org/devguide/deploy-apps/environment-variable.html#VCAP-SERVICES) for more information.

#### All other external resources

It isn't feasible for this guide to document every possible external dependency. After the migration, it's your responsibility to verify that you can satisfy every external dependency of your application.

### Inventory configuration sources and secrets

#### Inventory passwords and secure strings

Check all properties and configuration files and all environment variables on the production deployment(s) for any secret strings and passwords. In a Spring Cloud application, such strings will likely be found in *application.properties* or *application.yml* files in individual services or in the Spring Cloud Config repository.

[!INCLUDE [inventory-certificates-azure-spring-cloud](includes/inventory-certificates-azure-spring-cloud.md)]

#### Determine if Spring Cloud Vault is used

If Spring Cloud Vault is used to store and access secrets, identify the backing secret store (e.g. HashiCorp Vault or CredHub). Then identify all the secrets used by the application code.

#### Locate configuration server source

If your application uses a [Spring Cloud Config server](https://cloud.spring.io/spring-cloud-config/reference/html/#_spring_cloud_config_server), identify where the configuration is stored. This setting will typically be found in `bootstrap.yml`, or `bootstrap.properties` (sometimes in `application.yml` or `application.properties`) :

```properties
spring.cloud.config.server.git.uri: file://${user.home}/spring-cloud-config-repo
```

While git is most commonly used as Spring Cloud Config's backing datastore, as shown above, one of the other possible backends may be in use. Consult the [Spring Cloud Config documentation](https://cloud.spring.io/spring-cloud-config/reference/html/#_environment_repository) for information on other backends, such as [Relational Database (JDBC)](https://cloud.spring.io/spring-cloud-config/reference/html/#_jdbc_backend), [SVN](https://cloud.spring.io/spring-cloud-config/reference/html/#_version_control_backend_filesystem_use), and [local file system](https://cloud.spring.io/spring-cloud-config/reference/html/#_file_system_backend).

> [!NOTE]
> If your configuration server data is stored on premises, such as GitHub Enterprise, you will need to make it available to Azure Spring Cloud via a Git repository.

### Inspect the Deployment Architecture

#### Document hardware requirements for each service

For each of your Spring Cloud services (not including the configuration server, registry, or gateway), document the following:

* The number of instances running
* The number of CPUs allocated to each instance
* The amount of RAM allocated to each instance

#### Document Geo-Replication/Distribution

Determine whether the Spring Cloud applications are currently distributed among several regions or data centers. Document the uptime requirements/SLA for the applications being migrated.

#### Identify Clients that Bypass Service Registry

Identify any client applications that invoke any of the services to be migrated without using the Spring Cloud Service Registry. After the migration, such invocations will no longer be possible. Update such clients to use [Spring Cloud OpenFeign](https://spring.io/projects/spring-cloud-openfeign) prior to migration.

## Migration

### Update Spring Boot and Spring Cloud components to current versions

All applications need to be updated to use supported versions of Spring Boot and Spring Cloud. See [Prepare a Java Spring app for deployment](/azure/spring-cloud/spring-cloud-tutorial-prepare-app-deployment#spring-boot-and-spring-cloud-versions) for a list of supported versions.

For any applications using Spring Boot 1.x, follow the [Spring Boot 2.0 migration guide](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-2.0-Migration-Guide) to update them to a the supported Spring Boot version.

### Remove explicit configuration server settings

In the services being migrated, find any explicit assignments of Eureka settings and remove them. Such settings typically appear in `application.properties` or `application.yml` files.

**`application.yml`**

```yaml
eureka:
  client:
    serviceUrl:
      defaultZone: http://myusername:mysecretpassword@localhost:8761/eureka/
```

### Create an Azure Spring Cloud instance and Apps

Provision an Azure Spring Cloud instance in your Azure subscription. Then, provision an app for every service being migrated. Do not include the Spring Cloud registry and configuration servers. Do include the Spring Cloud Gateway service. See the [Azure Spring Cloud quickstart](/azure/spring-cloud/spring-cloud-quickstart-launch-app-portal) for instructions.

### Prepare the Spring Cloud Config server

> [!NOTE]
> If your current Spring Cloud Config repository is on the local file system or on premises, you will first need to migrate or replicate your configuration files to a private cloud-based repository, such as GitHub, Azure Repos, or BitBucket.

[Configure the configuration server](/azure/spring-cloud/spring-cloud-tutorial-config-server) in your Azure Spring Cloud instance.

[!INCLUDE [ensure-console-logging-and-configure-diagnostic-settings-azure-spring-cloud](includes/ensure-console-logging-and-configure-diagnostic-settings-azure-spring-cloud.md)]

[!INCLUDE [configure-persistent-storage-azure-spring-cloud](includes/configure-persistent-storage-azure-spring-cloud.md)]

### Migrate Spring Cloud Vault secrets to Azure KeyVault

Follow the instructions to [Migrate secrets to Azure KeyVault](migrate-secrets-to-azure-keyvault.md).

> [!NOTE]
> Migration may require renaming of some secrets. Update your application code accordingly.

Secrets can be injected directly into applications through Spring by using the [Azure KeyVault Spring Boot Starter](/azure/java/spring-framework/configure-spring-boot-starter-java-app-with-azure-key-vault).

### Migrate all certificates to KeyVault

Azure Spring Cloud does not provide access to the JRE keystore. It is therefore necessary to [migrate certificates to Azure KeyVault](/azure/key-vault/certificate-scenarios), and change the application code to [access certificates in KeyVault](/java/api/overview/azure/keyvault-certs-readme).

### Remove/Disable APM integrations

Eliminate any integrations with Application Performance Management tools/agents. See [After the Migration](#after-the-migration) for information on configuring performance management with Azure Monitor.

### Replace explicit Zipkin dependencies with Spring Cloud Starters

If any of the migrated applications has explicit Zipkin dependencies, remove them and replace them with Spring Cloud Starters as described in the "Distributed Tracing Dependency" section of [Prepare a Java Spring application for deployment in Azure Spring Cloud](/azure/spring-cloud/spring-cloud-tutorial-prepare-app-deployment). See [After the Migration](#after-the-migration) for information on Distributed Tracing with Azure App Insights.

### Disable Metrics Clients and Endpoints in your applications

Remove any metrics clients used or any metrics endpoints exposed in your applications.

### Deploy the services

Deploy each of the migrated microservices (not including the Spring Cloud Config and Registry servers), as instructed in the [QuickStart tutorial](/azure/spring-cloud/spring-cloud-quickstart-launch-app-portal).

### Configure per-service secrets and externalized settings

Any per-service configuration settings can be injected into each service as environment variables:

In the Azure portal:

- Navigate to the Azure Spring Cloud Instance and select "Apps".
- Select the service to be configured.
- Click on "Configuration".
- Enter the variables to be configured.
- Click "Save".

![Spring Cloud App Configuration Settings](media/migration-azure-spring-cloud/spring-cloud-app-configuration-settings.png)

### Migrate/Enable Identity Provider

If any of the Spring Cloud applications require authentication or authorization, ensure they are configured to access the identity provider:

* If the identity provider is Azure Active Directory, no changes should be necessary.
* If the identity provider is an on-premises Active Directory forest, consider implementing a hybrid identity solution with Azure Active Directory. See [Hybrid Identity](/azure/active-directory/hybrid/) documentation for guidance.
* If the identity provider is another on-premises solution, such as PingFederate, consult the [Custom installation of Azure AD Connect](/azure/active-directory/hybrid/how-to-connect-install-custom) documentation to configure federation with Azure Active Directory. Alternatively, consider using Spring Security to use your identity provider through [OAuth2/OpenID Connect](https://docs.spring.io/spring-security/site/docs/current/reference/html5/#oauth2) or [SAML](https://docs.spring.io/spring-security/site/docs/current/reference/html5/#servlet-saml2).

### Update Client Applications

Update the configuration of all client applications to use the published Azure Spring Cloud endpoints for migrated applications.

## After the Migration

1. Consider adding a deployment pipeline for automatic, consistent deployments. Instructions are available [for Azure Pipelines](/azure/spring-cloud/spring-cloud-howto-cicd), [for GitHub Actions](/azure/spring-cloud/spring-cloud-howto-github-actions), and [for Jenkins](/azure/jenkins/tutorial-jenkins-deploy-cli-spring-cloud-service).

1. Consider using staging deployments to test code changes in production before they are available to some or all of your end users. For more information, see [Set up a staging environment in Azure Spring Cloud](/azure/spring-cloud/spring-cloud-howto-staging-environment).

1. Consider adding service bindings to connect your application to supported Azure databases. This eliminates the need for you to provide connection information, including credentials, to your Spring Cloud applications.

1. Consider [using Distributed Tracing and Azure App Insights](/azure/spring-cloud/spring-cloud-tutorial-distributed-tracing) to monitor performance and interactions of your applications.

1. Consider adding Azure Monitor alert rules and action groups to quickly detect and address aberrant conditions. For more information, see [Tutorial: Monitor Spring Cloud resources using alerts and action groups](/azure/spring-cloud/spring-cloud-tutorial-alerts-action-groups).

1. Consider replicating the Azure Spring Cloud deployment in another region for lower latency and higher reliability and fault tolerance. Use [Azure Traffic Manager](/azure/traffic-manager) to load balance among deployments or use [Azure Front Door](/azure/frontdoor) to add SSL offloading and Web Application Firewall with DDoS protection.

1. If Geo-replication is not necessary, consider adding an [Azure Application Gateway](/azure/application-gateway) to add SSL offloading and Web Application Firewall with DDoS protection.

1. If your applications use legacy Spring Cloud Netflix components, consider replacing them with current alternatives:

    | Legacy                      | Current                     |
    |-----------------------------|-----------------------------|
    |Spring Cloud Eureka          |Spring Cloud Service Registry|
    |Spring Cloud Netflix Zuul	  |Spring Cloud Gateway         |
    |Spring Cloud Netflix Archaius|Spring Cloud Config Server |
    |Spring Cloud Netflix Ribbon  |Spring Cloud Load Balancer (client-side load balancer) |
    |Spring Cloud Hystrix 	      |Spring Cloud Circuit Breaker + Resilience4J |
    |Spring Cloud Netflix Turbine	| Micrometer + Prometheus   |
