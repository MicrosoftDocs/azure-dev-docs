---
title: Migration guide for Spring Cloud Azure 4.0
description: Helps with migration to Spring Cloud Azure 4.0 from legacy Azure Spring libraries.
author: KarlErickson
ms.author: hangwan
ms.date: 04/06/2023
ms.topic: reference
ms.custom: devx-track-java, spring-cloud-azure, devx-track-extended-java
---

# Migration guide for Spring Cloud Azure 4.0

This guide helps with migration to Spring Cloud Azure 4.0 from legacy Azure Spring libraries.

## Introduction

We'll call libraries whose group ID and artifact ID follow the pattern `com.azure.spring:spring-cloud-azure-*` the **modern** libraries, and those with pattern `com.azure.spring:azure-spring-boot-*`, `com.azure.spring:azure-spring-cloud-*`, or `com.azure.spring:azure-spring-integration-*` the *legacy* libraries.

This guide will focus on side-by-side comparisons for similar configurations between the modern and legacy libraries.

Familiarity with `com.azure.spring:azure-spring-boot-*`, `com.azure.spring:azure-spring-cloud-*` or `com.azure.spring:azure-spring-integration-*` package is assumed.

If you're new to the Spring Cloud Azure 4.0 libraries, see the [Spring Cloud Azure developer guide](developer-guide-overview.md) rather than this guide.

## Migration benefits

A natural question to ask when considering whether to adopt a new version or library is its benefits. As Azure has matured and been embraced by a more diverse group of developers, we've been focused on learning the patterns and practices to best support developer productivity and to understand the gaps that the Spring Cloud Azure libraries have.

There were several areas of consistent feedback expressed across the Spring Cloud Azure libraries. The most important is that the libraries for different Azure services haven't enabled the complete set of configurations. Additionally, the inconsistency of project naming, artifact IDs, versions, and configurations made the learning curve steep.

To improve the development experience across Spring Cloud Azure libraries, a set of design guidelines was introduced to ensure that Spring Cloud Azure libraries have a natural and idiomatic feel with respect to the Spring ecosystem. Further details are available in the [design doc](https://github.com/Azure/azure-sdk-for-java/wiki/Spring-Cloud-Azure-4.0-design) for those interested.

Spring Cloud Azure 4.0 provides the shared experience across libraries integrating with different Spring projects, for example Spring Boot, Spring Integration, Spring Cloud Stream, and so on. The shared experience includes:

* A unified BOM to include all Spring Cloud Azure 4.0 libraries.
* A consistent naming convention for artifacts.
* A unified way to configure credential, proxy, retry, cloud environment, and transport layer settings.
* Supporting all the authenticating methods an Azure Service or Azure Service SDK supports.

## Overview

This migration guide consists of the following sections:

* Naming changes for Spring Cloud Azure 4.0
* Artifact changes: renamed / added / deleted
* Dependency changes
* Authentication changes
* Configuration properties
* API breaking changes
* Library changes

## Naming changes

There has never been a consistent or official name to call all the Spring Cloud Azure libraries. Some of them were called `Azure Spring Boot` and some of them `Spring on Azure`. Since 4.0, we began to use the project name `Spring Cloud Azure` to represent all the Azure Spring libraries.

## BOM

We used to ship two BOMs for our libraries, the `azure-spring-boot-bom` and `azure-spring-cloud-dependencies`, but we combined these two BOMs into one BOM since 4.0, the `spring-cloud-azure-dependencies`. Add an entry in the `dependencyManagement` section of your project to benefit from the dependency management.

```xml
<dependencyManagement>
  <dependencies>
    <dependency>
      <groupId>com.azure.spring</groupId>
      <artifactId>spring-cloud-azure-dependencies</artifactId>
      <version>5.16.0</version>
      <type>pom</type>
      <scope>import</scope>
    </dependency>
  </dependencies>
</dependencyManagement>
```

> [!NOTE]
> If you're using Spring Boot 2.x, be sure to set the `spring-cloud-azure-dependencies` version to `4.19.0`.
> For more information about the version used for this BOM, see [Which Version of Spring Cloud Azure Should I Use](https://github.com/Azure/azure-sdk-for-java/wiki/Spring-Versions-Mapping#which-version-of-spring-cloud-azure-should-i-use).

## Artifact changes: renamed / added / deleted

Group IDs are the same for modern and legacy Spring Cloud Azure libraries. They're all `com.azure.spring`. Artifact IDs for the modern Spring Cloud Azure libraries have changed. According to which Spring project it belongs to, Spring Boot, Spring Integration, or Spring Cloud Stream, the artifact IDs pattern could be `spring-cloud-azure-starter-[service]`, `spring-integration-azure-[service]`, or `spring-cloud-azure-stream-binder-[service]`. The legacy starters for each has an artifact ID following the pattern `azure-spring-*`. This provides a quick and accessible means to help understand, at a glance, whether you're using modern or legacy starters.

In the process of developing Spring Cloud Azure 4.0, we renamed some artifacts to make them follow the new naming conventions, deleted some artifacts so that the functionality could be put into a more appropriate artifact, and added some new artifacts to better serve some scenarios.

The following table shows the mappings between legacy artifact ID and modern artifact ID:

> [!div class="mx-tdBreakAll"]
> | Legacy Artifact ID                                | Modern Artifact ID                                                                         | Description                                                                                                                                                                                                                                                                                                  |
> |---------------------------------------------------|--------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
> | azure-spring-boot-starter                         | spring-cloud-azure-starter                                                                 | This artifact has been deleted with all functionality be merged into the new `spring-cloud-azure-starter` artifact.                                                                                                                                                                                          |
> | azure-spring-boot-starter-active-directory        | spring-cloud-azure-starter-active-directory                                                | Renamed the artifact.                                                                                                                                                                                                                                                                                        |
> | azure-spring-boot-starter-active-directory-b2c    | spring-cloud-azure-starter-active-directory-b2c                                            | Renamed the artifact.                                                                                                                                                                                                                                                                                        |
> | azure-spring-boot-starter-cosmos                  | spring-cloud-azure-starter-data-cosmos                                                     | Renamed the artifact to add `data`, indicating using Spring Data Azure Cosmos DB.                                                                                                                                                                                                                                  |
> | azure-spring-boot-starter-keyvault-certificates   | not applicable                                                                             | Not included in this release, but will be supported in later version.                                                                                                                                                                                                                                        |
> | azure-spring-boot-starter-keyvault-secrets        | spring-cloud-azure-starter-keyvault-secrets                                                | Renamed the artifact.                                                                                                                                                                                                                                                                                        |
> | azure-spring-boot-starter-servicebus-jms          | spring-cloud-azure-starter-servicebus-jms                                                  | Renamed the artifact.                                                                                                                                                                                                                                                                                        |
> | azure-spring-boot-starter-storage                 | spring-cloud-azure-starter-storage-blob <br/>spring-cloud-azure-starter-storage-file-share | The legacy artifact contains the functionality of both Storage Blob and File Share, it's been spliced into two separate artifacts in 4.0, spring-cloud-azure-starter-storage-blob and spring-cloud-azure-starter-storage-file-share.                                                                         |
> | azure-spring-boot                                 | not applicable                                                                             | This artifact has been deleted with all functionality be merged into the new `spring-cloud-azure-autoconfigure` artifact.                                                                                                                                                                                    |
> | azure-spring-cloud-autoconfigure                  | not applicable                                                                             | This artifact has been deleted with all functionality be merged into the new `spring-cloud-azure-autoconfigure` artifact.                                                                                                                                                                                    |
> | azure-spring-cloud-context                        | not applicable                                                                             | This artifact has been deleted with all functionality be merged into the new `spring-cloud-azure-autoconfigure` and `spring-cloud-azure-resourcemanager` artifacts.                                                                                                                                          |
> | azure-spring-cloud-messaging                      | spring-messaging-azure                                                                     | The messaging listener annotation has been dropped.                                                                                                                                                                                                                                                          |
> | azure-spring-cloud-starter-cache                  | not applicable                                                                             | This artifact has been deleted, for using redis, just add spring-boot-starter-data-redis, spring-boot-starter-cache, spring-cloud-azure-resourcemanager and spring-cloud-azure-starter. For more information about usage, see [Spring Cloud Azure Redis support](redis-support.md). |
> | azure-spring-cloud-starter-eventhubs-kafka        | not applicable                                                                             | This artifact has been deleted, for using kafka, just add spring kafka, spring-cloud-azure-resourcemanager and spring-cloud-azure-starter. For more information about usage, see [Spring Cloud Azure Kafka support](kafka-support.md).                                              |
> | azure-spring-cloud-starter-eventhubs              | spring-cloud-azure-starter-integration-eventhubs                                           | Renamed the artifact to add `integration`, indicating using Spring Integration with Event Hubs.                                                                                                                                                                                                              |
> | azure-spring-cloud-starter-servicebus             | spring-cloud-azure-starter-integration-servicebus                                          | Renamed the artifact to add `integration`, indicating using Spring Integration with Service Bus.                                                                                                                                                                                                             |
> | azure-spring-cloud-starter-storage-queue          | spring-cloud-azure-starter-integration-storage-queue                                       | Renamed the artifact to add `integration`, indicating using Spring Integration with Storage Queue.                                                                                                                                                                                                           |
> | azure-spring-cloud-storage                        | not applicable                                                                             | This artifact has been deleted with all functionalities merged into the new `spring-cloud-azure-autoconfigure` artifact.                                                                                                                                                                                     |
> | azure-spring-cloud-stream-binder-eventhubs        | spring-cloud-azure-stream-binder-eventhubs                                                 | This artifact has been refactored using a new design, mainly `spring-cloud-azure-stream-binder-eventhubs` and `spring-cloud-azure-stream-binder-eventhubs-core`.                                                                                                                                             |
> | azure-spring-cloud-stream-binder-service-core     | spring-cloud-azure-stream-binder-servicebus-core                                           | Renamed the artifact.                                                                                                                                                                                                                                                                                        |
> | azure-spring-cloud-stream-binder-servicebus-queue | spring-cloud-azure-stream-binder-servicebus                                                | This artifact has been deleted with all functionality be merged into the `spring-cloud-azure-stream-binder-servicebus` artifact.                                                                                                                                                                             |
> | azure-spring-cloud-stream-binder-servicebus-topic | spring-cloud-azure-stream-binder-servicebus                                                | This artifact has been deleted with all functionality be merged into the `spring-cloud-azure-stream-binder-servicebus` artifact.                                                                                                                                                                             |
> | azure-spring-integration-core                     | spring-integration-azure-core                                                              | Renamed the artifact.                                                                                                                                                                                                                                                                                        |
> | azure-spring-integration-eventhubs                | spring-integration-azure-eventhubs                                                         | Rename the artifact.                                                                                                                                                                                                                                                                                         |
> | azure-spring-integration-servicebus               | spring-integration-azure-servicebus                                                        | Rename the artifact.                                                                                                                                                                                                                                                                                         |
> | azure-spring-integration-storage-queue            | spring-integration-azure-storage-queue                                                     | Rename the artifact.                                                                                                                                                                                                                                                                                         |
> | not applicable                                    | spring-cloud-azure-actuator                                                                | The newly added Spring Cloud Azure Actuator artifact.                                                                                                                                                                                                                                                        |
> | not applicable                                    | spring-cloud-azure-actuator-autoconfigure                                                  | The newly added Spring Cloud Azure Actuator AutoConfigure artifact, including autoconfiguration for actuator.                                                                                                                                                                                                |
> | not applicable                                    | spring-cloud-azure-autoconfigure                                                           | Newly added Spring Cloud Azure AutoConfigure artifact, including all auto-configuration for SDK clients, Spring Security support, Spring Data support and Spring Integration support.                                                                                                                        |
> | not applicable                                    | spring-cloud-azure-core                                                                    | Newly added Spring Cloud Azure Core artifact, including all core functionality.                                                                                                                                                                                                                              |
> | not applicable                                    | spring-cloud-azure-resourcemanager                                                         | Newly added Resource Manager artifact. It's the Core library using Azure Resource Manager to read metadata and create resources.                                                                                                                                                                             |
> | not applicable                                    | spring-cloud-azure-service                                                                 | Newly added Spring Cloud Azure Service artifact, including abstractions for Azure services.                                                                                                                                                                                                                  |
> | not applicable                                    | spring-cloud-azure-starter-appconfiguration                                                | Newly added starter for using Azure App Configuration SDK client.                                                                                                                                                                                                                                            |
> | not applicable                                    | spring-cloud-azure-starter-cosmos                                                          | Newly added starter for using Azure Cosmos DB SDK client.                                                                                                                                                                                                                                                    |
> | not applicable                                    | spring-cloud-azure-starter-eventhubs                                                       | Newly added starter for using Azure Event Hubs SDK client.                                                                                                                                                                                                                                                   |
> | not applicable                                    | spring-cloud-azure-starter-servicebus                                                      | Newly added starter for using Azure Service Bus SDK client.                                                                                                                                                                                                                                                  |
> | not applicable                                    | spring-cloud-azure-starter-storage-blob                                                    | Newly added starter for using Azure Storage Blob SDK client.                                                                                                                                                                                                                                                 |
> | not applicable                                    | spring-cloud-azure-starter-storage-file-share                                              | Newly added starter for using Azure Storage File Share SDK client.                                                                                                                                                                                                                                           |
> | not applicable                                    | spring-cloud-azure-starter-storage-queue                                                   | Newly added starter for using Azure Storage Queue SDK client.                                                                                                                                                                                                                                                |
> | not applicable                                    | spring-cloud-azure-starter-stream-eventhubs                                                | Newly added starter for using Azure Event Hubs Spring Cloud Stream Binder.                                                                                                                                                                                                                                   |
> | not applicable                                    | spring-cloud-azure-starter-stream-servicebus                                               | Newly added starter for using Azure Service Bus Spring Cloud Stream Binder                                                                                                                                                                                                                                   |
> | not applicable                                    | spring-cloud-azure-stream-binder-eventhubs-core                                            | Newly added Spring Cloud Stream core artifact for Azure Event Hubs.                                                                                                                                                                                                                                          |

## Dependencies changes

Some unnecessary dependencies were included in the legacy artifacts, which we've removed in the modern Spring Cloud Azure 4.0 libraries. Be sure to add the removed dependencies manually to your project to prevent crashes.

Libraries that have dependency changes include:

* [spring-cloud-azure-starter](#dependency-changes)
* [spring-cloud-azure-starter-active-directory](#dependency-changes-1)
* [spring-cloud-azure-starter-active-directory-b2c](#dependency-changes-2)

## Authentication changes

Spring Cloud Azure 4.0 supports all the authentication methods that each Azure Service SDK supports. It enables you to configure a global token credential as well as providing the token credential at each service level. But a credential isn't required to configure  Spring Cloud Azure 4.0 because it can apply the credential stored in a local developing environment or managed identity in Azure Services. Just be sure the principal has been granted sufficient permission to access the target Azure resources.

> [!NOTE]
> When assign roles to the security principals to interact with Azure messaging services, the `Data` related roles are required to conduct messaging operations. For Azure Spring Apps Stream Event Hubs / Service Bus Binder libraries, `Contributor` role is required when the function of auto creating resources is needed. For more information, see [Azure built-in roles](/azure/role-based-access-control/built-in-roles).

A chained credential, the `DefaultAzureCredential` bean is auto-configured by default and will be used by all components if no more authentication information is specified. For more information, see the [DefaultAzureCredential](/java/api/overview/azure/identity-readme#defaultazurecredential) section of [Azure Identity client library for Java](/java/api/overview/azure/identity-readme).

## Configuration properties

### Properties migration

We've created an *additional-spring-configuration-metadata.json* file to smooth the property migration when using with `spring-boot-properties-migrator`. First, add the following property migrator to your application:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-properties-migrator</artifactId>
    <scope>runtime</scope>
</dependency>
```

Or, if you’re using Gradle:

```shell
runtime("org.springframework.boot:spring-boot-properties-migrator")
```

If you run the app, it will identify the properties that are no longer managed by Spring Cloud Azure. If there's a replacement, it will temporarily remap the property for you with a warning. If there isn’t a replacement, an error report will give you more information. Either way, the configuration has to be updated and the dependency removed once you've updated the configuration.

Before you move on, it's a good idea to use the search feature of your IDE to double-check that you aren’t using one of the properties you’ve migrated in an integration test.

> [!NOTE]
> We've changed many configuration properties in this change. Using the `spring-boot-properties-migrator` will help smooth your migration.

### Global configurations

The modern `spring-cloud-azure-starter` enables you to define properties that apply to all Azure SDKs in the namespace `spring.cloud.azure`. This feature wasn't supported in the legacy `azure-spring-boot-starter`. The global configurations can be divided into five categories, shown in the following table:

| Prefix                          | Description                                                   |
|---------------------------------|---------------------------------------------------------------|
| *spring.cloud.azure*.client     | Configures the transport clients underneath each Azure SDK.   |
| *spring.cloud.azure*.credential | Configures how to authenticate with Microsoft Entra ID.   |
| *spring.cloud.azure*.profile    | Configures the Azure cloud environment.                       |
| *spring.cloud.azure*.proxy      | Configures the proxy options, apply to all Azure SDK clients. |
| *spring.cloud.azure*.retry      | Configures the retry options, apply to all Azure SDK clients. The retry options have supported part of the SDKs, there’s no `spring.cloud.azure.cosmos.retry`. |

For a full list of configurations, see [Spring Cloud Azure configuration properties](./configuration-properties-all.md).

### Configure each SDK

For details about the configuration options at the SDK level, use the following links:

* [From azure-spring-boot-starter-active-directory to spring-cloud-azure-starter-active-directory](#sdk-configuration-changes)
* [From azure-spring-boot-starter-active-directory-b2c to spring-cloud-azure-starter-active-directory-b2c](#sdk-configuration-changes-1)
* [From azure-spring-boot-starter-cosmos to spring-cloud-azure-starter-data-cosmos](#sdk-configuration-changes-2)
* [From azure-spring-boot-starter-keyvault-secrets to spring-cloud-azure-starter-keyvault-secrets](#sdk-configuration-changes-3)
* [From azure-spring-boot-starter-servicebus-jms to spring-cloud-azure-starter-servicebus-jms](#sdk-configuration-changes-4)
* [From azure-spring-boot-starter-storage to spring-cloud-azure-starter-storage-blob](#sdk-configuration-changes-5)
* [From azure-spring-boot-starter-storage to spring-cloud-azure-starter-storage-file-share](#sdk-configuration-changes-6)
* [From azure-spring-cloud-starter-eventhubs to spring-cloud-azure-starter-integration-eventhubs](#sdk-configuration-changes-7)
* [From azure-spring-cloud-starter-servicebus to spring-cloud-azure-starter-integration-servicebus](#sdk-configuration-changes-8)
* [From azure-spring-cloud-starter-storage-queue to spring-cloud-azure-starter-integration-storage-queue](#sdk-configuration-changes-9)
* [From azure-spring-cloud-stream-binder-eventhubs to spring-cloud-azure-stream-binder-eventhubs](#sdk-configuration-changes-10)
* [From azure-spring-cloud-stream-binder-servicebus-* to spring-cloud-azure-stream-binder-servicebus](#sdk-configuration-changes-11)

## API breaking changes

For details about API breaking changes in each library, use the following links:

* [From azure-spring-boot-starter-active-directory to spring-cloud-azure-starter-active-directory](#api-changes)
* [From azure-spring-boot-starter-active-directory-b2c to spring-cloud-azure-starter-active-directory-b2c](#api-changes-1)
* [From azure-spring-boot-starter-storage to spring-cloud-azure-starter-storage-blob](#api-changes-2)
* [From azure-spring-boot-starter-storage to spring-cloud-azure-starter-storage-file-share](#api-changes-3)
* [From azure-spring-cloud-starter-eventhubs to spring-cloud-azure-starter-integration-eventhubs](#api-changes-4)
* [From azure-spring-integration-eventhubs to spring-integration-azure-eventhubs](#api-changes-5)
* [From azure-spring-cloud-starter-servicebus to spring-cloud-azure-starter-integration-servicebus](#api-changes-6)
* [From azure-spring-integration-servicebus to spring-integration-azure-servicebus](#api-changes-7)
* [From azure-spring-cloud-starter-storage-queue to spring-cloud-azure-starter-integration-storage-queue](#api-changes-8)
* [From azure-spring-integration-storage-queue to spring-integration-azure-storage-queue](#api-changes-9)
* [From azure-spring-cloud-stream-binder-eventhubs to spring-cloud-azure-stream-binder-eventhubs](#api-changes-10)
* [From azure-spring-cloud-stream-binder-servicebus-* to spring-cloud-azure-stream-binder-servicebus](#api-changes-11)

## Library changes
Breaking changes in each library are introduced as follows.

### From azure-spring-boot-starter to spring-cloud-azure-starter
This guide is intended to assist in the migration to [spring-cloud-azure-starter](https://search.maven.org/artifact/com.azure.spring/spring-cloud-azure-starter) from
version 3 of [azure-spring-boot-starter](https://search.maven.org/artifact/com.azure.spring/azure-spring-boot-starter).

For general information, use the following links:

* For an overview of the changes in 4.0, see the [Introduction](#introduction) and [Migration benefits](#migration-benefits) sections.
* To learn more about the strategy changes in the project naming, see the [Naming changes](#naming-changes) section.
* To learn how to use one BOM for all Spring Cloud Azure libraries, see the [BOM](#bom) section.
* To learn how to handle authentication in Spring Cloud Azure 4.0, see the [Authentication changes](#authentication-changes) section.
* To learn how to leverage `spring-boot-properties-migrator` during migration, see the [Configure each SDK](#configure-each-sdk) section.
* To learn more about the global and common configuration changes, see the [Global configurations](#global-configurations) section.

#### Dependency changes

Some unnecessary dependencies were included in the legacy artifacts, which we have removed in the modern Spring Cloud Azure 4.0 libraries. Be sure to add the removed dependencies manually to your project to prevent unintentional crash.

The following table shows the Removed dependencies:

> [!div class="mx-tdBreakAll"]
> | Removed dependencies                                    | Description                                                                   |
> |---------------------------------------------------------|-------------------------------------------------------------------------------|
> | org.springframework.boot:spring-boot-starter-validation | Include the validation starter if you want to use Hibernate Validator. |

### From azure-spring-boot-starter-active-directory to spring-cloud-azure-starter-active-directory

This guide is intended to assist the migration to [spring-cloud-azure-starter-active-directory](https://search.maven.org/artifact/com.azure.spring/spring-cloud-azure-starter-active-directory) from
version 3 of [azure-spring-boot-starter-active-directory](https://search.maven.org/artifact/com.azure.spring/azure-spring-boot-starter-active-directory).

For general information, use the following links:

* For an overview of the changes in 4.0, see the [Introduction](#introduction) and [Migration benefits](#migration-benefits) sections.
* To learn more about the strategy changes in the project naming, see the [Naming changes](#naming-changes) section.
* To learn how to use one BOM for all Spring Cloud Azure libraries, see the [BOM](#bom) section.
* To learn how to handle authentication in Spring Cloud Azure 4.0, see the [Authentication changes](#authentication-changes) section.
* To learn how to leverage `spring-boot-properties-migrator` during migration, see the [Configure each SDK](#configure-each-sdk) section.
* To learn more about the global and common configuration changes, see the [Global configurations](#global-configurations) section.

#### Dependency changes

Some unnecessary dependencies in the legacy artifact have been removed since the modern Spring Cloud Azure 4.0 library. Add these removed dependencies to your project to prevent unintentional crash.

The following table shows the Removed dependencies:

> [!div class="mx-tdBreakAll"]
> | Removed dependencies                                    | Description                                    |
> |---------------------------------------------------------|------------------------------------------------|
> | com.fasterxml.jackson.core:jackson-databind             | Add this dependency to your project if needed. |
> | io.projectreactor.netty:reactor-netty                   | Add this dependency to your project if needed. |
> | org.springframework.boot:spring-boot-starter-validation | Add this dependency to your project if needed. |
> | org.springframework.boot:spring-boot-starter-webflux    | Add this dependency to your project if needed. |

#### SDK configuration changes

This section includes the changes about the properties added, removed and changed.

* *The following two points are the main to pay your attention to*:
1. All configuration property names' prefix changed from `azure.activedirectory` to `spring.cloud.azure.active-directory`.
1. New property `spring.cloud.azure.active-directory.enabled` is added to enable/disable Microsoft Entra related features. The default value is `false`.

The following table shows the property mappings between `azure-spring-boot-starter-active-directory` and `spring-cloud-azure-starter-active-directory`:

> [!div class="mx-tdBreakAll"]
> | Legacy properties                                                                      | Modern properties                                                                                    |
> |----------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------|
> | azure.activedirectory.app-id-uri                                                       | spring.cloud.azure.active-directory.app-id-uri                                                       |
> | azure.activedirectory.application-type                                                 | spring.cloud.azure.active-directory.application-type                                                 |
> | azure.activedirectory.authorization-clients                                            | spring.cloud.azure.active-directory.authorization-clients                                            |
> | azure.activedirectory.authorization-clients.AZURE_CLIENT_NAME.authorization-grant-type | spring.cloud.azure.active-directory.authorization-clients.AZURE_CLIENT_NAME.authorization-grant-type |
> | azure.activedirectory.authorization-clients.AZURE_CLIENT_NAME.on-demand                | spring.cloud.azure.active-directory.authorization-clients.AZURE_CLIENT_NAME.on-demand                |
> | azure.activedirectory.authorization-clients.AZURE_CLIENT_NAME.scopes                   | spring.cloud.azure.active-directory.authorization-clients.AZURE_CLIENT_NAME.scopes                   |
> | azure.activedirectory.authenticate-additional-parameters                               | spring.cloud.azure.active-directory.authenticate-additional-parameters                               |
> | azure.activedirectory.base-uri                                                         | spring.cloud.azure.active-directory.profile.environment.active-directory-endpoint                    |
> | azure.activedirectory.client-id                                                        | spring.cloud.azure.active-directory.credential.client-id                                             |
> | azure.activedirectory.client-secret                                                    | spring.cloud.azure.active-directory.credential.client-secret                                         |
> | azure.activedirectory.graph-membership-uri                                             | Check the following table for more information.                                                      |
> | azure.activedirectory.jwt-connect-timeout                                              | spring.cloud.azure.active-directory.jwt-connect-timeout.                                             |
> | azure.activedirectory.jwt-read-timeout                                                 | spring.cloud.azure.active-directory.jwt-read-timeout.                                                |
> | azure.activedirectory.jwt-size-limit                                                   | spring.cloud.azure.active-directory.jwt-size-limit.                                                  |
> | azure.activedirectory.jwk-set-cache-lifespan                                           | spring.cloud.azure.active-directory.jwk-set-cache-lifespan.                                          |
> | azure.activedirectory.jwk-set-cache-refresh-time                                       | spring.cloud.azure.active-directory.jwk-set-cache-refresh-time                                       |
> | azure.activedirectory.post-logout-redirect-uri                                         | spring.cloud.azure.active-directory.post-logout-redirect-uri                                         |
> | azure.activedirectory.session-stateless                                                | spring.cloud.azure.active-directory.session-stateless                                                |
> | azure.activedirectory.redirect-uri-template                                            | spring.cloud.azure.active-directory.redirect-uri-template                                            |
> | azure.activedirectory.resource-server.claim-to-authority-prefix-map                    | spring.cloud.azure.active-directory.resource-server.claim-to-authority-prefix-map                    |
> | azure.activedirectory.resource-server.principal-claim-name                             | spring.cloud.azure.active-directory.resource-server.principal-claim-name                             |
> | azure.activedirectory.tenant-id                                                        | spring.cloud.azure.active-directory.profile.tenant-id                                                |
> | azure.activedirectory.user-group.allowed-group-ids                                     | spring.cloud.azure.active-directory.user-group.allowed-group-ids                                     |
> | azure.activedirectory.user-group.allowed-group-names                                   | spring.cloud.azure.active-directory.user-group.allowed-group-names                                   |
> | azure.activedirectory.user-name-attribute                                              | spring.cloud.azure.active-directory.user-name-attribute                                              |

* *The value type of the following properties is changed from `long` to `Duration`*:

    * `jwt-connect-timeout`
    * `jwt-read-timeout`
    * `jwk-set-cache-lifespan`
    * `jwk-set-cache-refresh-time`.

* *The following properties are removed*:

    * azure.activedirectory.allow-telemetry
    * azure.activedirectory.user-group.enable-full-list
    * azure.activedirectory.graph-base-uri
    * azure.activedirectory.graph-membership-uri

* *The following properties are added*:

    * spring.cloud.azure.active-directory.enabled
    * spring.cloud.azure.active-directory.profile.environment.microsoft-graph-endpoint
    * spring.cloud.azure.active-directory.user-group.use-transitive-members

> [!NOTE]
> The function of `azure.activedirectory.graph-membership-uri` has been replaced by 2 properties: `spring.cloud.azure.active-directory.profile.environment.microsoft-graph-endpoint` and `spring.cloud.azure.active-directory.user-group.use-transitive-members`. The first property is used to specify the host name, and the second a flag for using the URL path: `v1.0/me/memberOf` or `v1.0/me/transitiveMemberOf`.

Here are some examples of migration:

* *Example 1. Case 1*

  * For legacy:
    azure.activedirectory.graph-membership-uri=https://graph.microsoft.com/v1.0/me/memberOf

  * For modern:
    spring.cloud.azure.active-directory.profile.environment.microsoft-graph-endpoint=`https://graph.microsoft.com/` +
    spring.cloud.azure.active-directory.user-group.use-transitive-members=`false`

* *Example 2. Case 2*

  * For legacy:
    azure.activedirectory.graph-membership-uri=https://graph.microsoft.com/v1.0/me/transitiveMemberOf

  * For modern:
    spring.cloud.azure.active-directory.profile.environment.microsoft-graph-endpoint=`https://graph.microsoft.com/` +
      spring.cloud.azure.active-directory.user-group.use-transitive-members=`true`

#### API changes

The following table shows the class mappings from `azure-spring-boot-starter-active-directory` to `spring-cloud-azure-starter-active-directory`:

> [!div class="mx-tdBreakAll"]
> | Legacy class                                                               | Modern class                                                                                  |
> |----------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------|
> | com.azure.spring.aad.webapi.AADJwtBearerTokenAuthenticationConverter       | com.azure.spring.cloud.autoconfigure.aad.AadJwtBearerTokenAuthenticationConverter             |
> | com.azure.spring.aad.webapi.AADResourceServerProperties                    | com.azure.spring.cloud.autoconfigure.aad.properties.AadResourceServerProperties               |
> | com.azure.spring.aad.webapi.AADResourceServerWebSecurityConfigurerAdapter  | com.azure.spring.cloud.autoconfigure.aad.AadResourceServerWebSecurityConfigurerAdapter |
> | com.azure.spring.aad.webapp.AADWebSecurityConfigurerAdapter                | com.azure.spring.cloud.autoconfigure.aad.AadWebSecurityConfigurerAdapter               |
> | com.azure.spring.aad.webapp.AuthorizationClientProperties                  | com.azure.spring.cloud.autoconfigure.aad.properties.AuthorizationClientProperties             |
> | com.azure.spring.aad.AADApplicationType                                    | com.azure.spring.cloud.autoconfigure.aad.properties.AadApplicationType                        |
> | com.azure.spring.aad.AADAuthorizationGrantType                             | com.azure.spring.cloud.autoconfigure.aad.properties.AadAuthorizationGrantType                 |
> | com.azure.spring.aad.AADAuthorizationServerEndpoints                       | com.azure.spring.cloud.autoconfigure.aad.properties.AadAuthorizationServerEndpoints           |
> | com.azure.spring.aad.AADClientRegistrationRepository                       | com.azure.spring.cloud.autoconfigure.aad.AadClientRegistrationRepository                      |
> | com.azure.spring.aad.AADTrustedIssuerRepository                            | com.azure.spring.cloud.autoconfigure.aad.AadTrustedIssuerRepository                           |
> | com.azure.spring.autoconfigure.aad.AADAppRoleStatelessAuthenticationFilter | com.azure.spring.cloud.autoconfigure.aad.filter.AadAppRoleStatelessAuthenticationFilter       |
> | com.azure.spring.autoconfigure.aad.AADAuthenticationFilter                 | com.azure.spring.cloud.autoconfigure.aad.filter.AadAuthenticationFilter                       |
> | com.azure.spring.autoconfigure.aad.AADAuthenticationProperties             | com.azure.spring.cloud.autoconfigure.aad.properties.AadAuthenticationProperties               |
> | com.azure.spring.autoconfigure.aad.UserPrincipal                           | com.azure.spring.cloud.autoconfigure.aad.filter.UserPrincipal                                 |
> | com.azure.spring.autoconfigure.aad.UserPrincipalManager                    | com.azure.spring.cloud.autoconfigure.aad.filter.UserPrincipalManager                          |

This section lists the removed classes from azure-spring-boot-starter-active-directory.

* *Removed legacy class*

  * com.azure.spring.aad.webapp.AADHandleConditionalAccessFilter
  * com.azure.spring.aad.webapi.validator.AADJwtAudienceValidator
  * com.azure.spring.aad.webapi.validator.AADJwtClaimValidator

### From azure-spring-boot-starter-active-directory-b2c to spring-cloud-azure-starter-active-directory-b2c

This guide is intended to assist in the migration to [spring-cloud-azure-starter-active-directory-b2c](https://search.maven.org/artifact/com.azure.spring/spring-cloud-azure-starter-active-directory-b2c) from version 3 of [azure-spring-boot-starter-active-directory-b2c](https://search.maven.org/artifact/com.azure.spring/azure-spring-boot-starter-active-directory-b2c).

For general information, use the following links:

* For an overview of the changes in 4.0, see the [Introduction](#introduction) and [Migration benefits](#migration-benefits) sections.
* To learn more about the strategy changes in the project naming, see the [Naming changes](#naming-changes) section.
* To learn how to use one BOM for all Spring Cloud Azure libraries, see the [BOM](#bom) section.
* To learn how to handle authentication in Spring Cloud Azure 4.0, see the [Authentication changes](#authentication-changes) section.
* To learn how to leverage `spring-boot-properties-migrator` during migration, see the [Configure each SDK](#configure-each-sdk) section.
* To learn more about the global and common configuration changes, see the [Global configurations](#global-configurations) section.

#### Dependency changes

Some unnecessary dependencies were included in the legacy artifacts, which we have removed in the modern Spring Cloud Azure 4.0 libraries. Be sure to add the removed dependencies manually to your project to prevent unintentional crash.

The following table shows the Removed dependencies:

> [!div class="mx-tdBreakAll"]
> | Removed dependencies                                    | Description                                                                   |
> |---------------------------------------------------------|-------------------------------------------------------------------------------|
> | org.springframework.boot:spring-boot-starter-validation | Include the validation starter if you want to use Hibernate Validator. |

#### SDK configuration changes

This section includes the changes about the properties added, removed and changed.

* The following two points are the main to pay your attention to:

1. All configuration property names changed the prefix from `azure.activedirectory.b2c` to `spring.cloud.azure.active-directory.b2c`.
1. New property `spring.cloud.azure.active-directory.b2c.enabled` is added to allow enable / disable Azure AD B2C related features. The default value is false.

The following table shows the property mappings from `azure-spring-boot-starter-active-directory-b2c` to `spring-cloud-azure-starter-active-directory-b2c`:

> [!div class="mx-tdBreakAll"]
> | Legacy properties                                                                             | Modern properties                                                                                            |
> |-----------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------|
> | *azure.activedirectory.b2c*.authenticate-additional-parameters                                | *spring.cloud.azure.active-directory.b2c*.authenticate-additional-parameters                                 |
> | *azure.activedirectory.b2c*.authorization-clients                                             | *spring.cloud.azure.active-directory.b2c*.authorization-clients                                              |
> |*azure.activedirectory.b2c*.authorization-clients.<AZURE_CLIENT_NAME>.authorization-grant-type | *spring.cloud.azure.active-directory.b2c*.authorization-clients.<AZURE_CLIENT_NAME>.authorization-grant-type |
> | *azure.activedirectory.b2c*.authorization-clients.<AZURE_CLIENT_NAME>.scopes                  | *spring.cloud.azure.active-directory.b2c*.authorization-clients.<AZURE_CLIENT_NAME>.scopes                   |
> | *azure.activedirectory.b2c*.app-id-uri                                                        | *spring.cloud.azure.active-directory.b2c*.app-id-uri                                                         |
> | *azure.activedirectory.b2c*.base-uri                                                          | *spring.cloud.azure.active-directory.b2c*.base-uri                                                           |
> | *azure.activedirectory.b2c*.client-id                                                         | *spring.cloud.azure.active-directory.b2c*.credential.client-id                                               |
> | *azure.activedirectory.b2c*.client-secret                                                     | *spring.cloud.azure.active-directory.b2c*.credential.client-secret                                           |
> | *azure.activedirectory.b2c*.jwt-connect-timeout                                               | *spring.cloud.azure.active-directory.b2c*.jwt-connect-timeout                                                |
> | *azure.activedirectory.b2c*.jwt-read-timeout                                                  | *spring.cloud.azure.active-directory.b2c*.jwt-read-timeout                                                   |
> | *azure.activedirectory.b2c*.jwt-size-limit                                                    | *spring.cloud.azure.active-directory.b2c*.jwt-size-limit                                                     |
> | *azure.activedirectory.b2c*.login-flow                                                        | *spring.cloud.azure.active-directory.b2c*.login-flow                                                         |
> | *azure.activedirectory.b2c*.logout-success-url                                                | *spring.cloud.azure.active-directory.b2c*.logout-success-url                                                 |
> | *azure.activedirectory.b2c*.reply-url                                                         | *spring.cloud.azure.active-directory.b2c*.reply-url                                                          |
> | *azure.activedirectory.b2c*.tenant-id                                                         | *spring.cloud.azure.active-directory.b2c*.profile.tenant-id                                                  |
> | *azure.activedirectory.b2c*.user-flows                                                        | *spring.cloud.azure.active-directory.b2c*.user-flows                                                         |
> | *azure.activedirectory.b2c*.user-name-attribute-name                                          | *spring.cloud.azure.active-directory.b2c*.user-name-attribute-name                                           |

* Removed properties from azure-spring-boot-starter-active-directory-b2c:

  * azure.activedirectory.b2c.allow-telemetry
  * azure.activedirectory.b2c.tenant

* The value type of the following properties is changed from `long` to `Duration`:

  * jwt-connect-timeout
  * jwt-read-timeout

#### API changes

The following table shows the class mappings from `azure-spring-boot-starter-active-directory-b2c` to `spring-cloud-azure-starter-active-directory-b2c`:

> [!div class="mx-tdBreakAll"]
> | Legacy class                                                                   | Modern class                                                                             |
> |--------------------------------------------------------------------------------|------------------------------------------------------------------------------------------|
> | com.azure.spring.autoconfigure.b2c.AADB2CAuthorizationRequestResolver          | com.azure.spring.cloud.autoconfigure.aadb2c.AadB2cAuthorizationRequestResolver           |
> | com.azure.spring.autoconfigure.b2c.AADB2CJwtBearerTokenAuthenticationConverter | com.azure.spring.cloud.autoconfigure.aad.AadJwtBearerTokenAuthenticationConverter |
> | com.azure.spring.autoconfigure.b2c.AADB2CLogoutSuccessHandler                  | com.azure.spring.cloud.autoconfigure.aadb2c.AadB2cLogoutSuccessHandler                   |
> | com.azure.spring.autoconfigure.b2c.AADB2COidcLoginConfigurer                   | com.azure.spring.cloud.autoconfigure.aadb2c.AadB2COidcLoginConfigurer                   |
> | com.azure.spring.autoconfigure.b2c.AADB2CProperties                            | com.azure.spring.cloud.autoconfigure.aadb2c.properties.AadB2cProperties                  |
> | com.azure.spring.autoconfigure.b2c.AADB2CTrustedIssuerRepository               | com.azure.spring.cloud.autoconfigure.aadb2c.AadB2cTrustedIssuerRepository                |
> | com.azure.spring.autoconfigure.b2c.AuthorizationClientProperties               | com.azure.spring.cloud.autoconfigure.aad.properties.AuthorizationClientProperties        |

### From azure-spring-boot-starter-cosmos to spring-cloud-azure-starter-data-cosmos

This guide is intended to assist in the migration to [spring-cloud-azure-starter-data-cosmos](https://search.maven.org/artifact/com.azure.spring/spring-cloud-azure-starter-data-cosmos) from version 3 of [azure-spring-boot-starter-cosmos](https://search.maven.org/artifact/com.azure.spring/azure-spring-boot-starter-cosmos).

For general information, use the following links:

* For an overview of the changes in 4.0, see the [Introduction](#introduction) and [Migration benefits](#migration-benefits) sections.
* To learn more about the strategy changes in the project naming, see the [Naming changes](#naming-changes) section.
* To learn how to use one BOM for all Spring Cloud Azure libraries, see the [BOM](#bom) section.
* To learn how to handle authentication in Spring Cloud Azure 4.0, see the [Authentication changes](#authentication-changes) section.
* To learn how to leverage `spring-boot-properties-migrator` during migration, see the [Configure each SDK](#configure-each-sdk) section.
* To learn more about the global and common configuration changes, see the [Global configurations](#global-configurations) section.

#### SDK configuration changes

All configuration property names changed the prefix from `azure.cosmos` to `spring.cloud.azure.cosmos`.

The following table shows the class mappings from `azure-spring-boot-starter-cosmos` to `spring-cloud-azure-starter-data-cosmos`:

> [!div class="mx-tdBreakAll"]
> | Legacy properties                    | Modern properties                                 |
> |--------------------------------------|---------------------------------------------------|
> |*azure.cosmos*.connection-mode        |*spring.cloud.azure.cosmos*.connection-mode        |
> |*azure.cosmos*.consistency-level      |*spring.cloud.azure.cosmos*.consistency-level      |
> |*azure.cosmos*.database               |*spring.cloud.azure.cosmos*.database               |
> |*azure.cosmos*.key                    |*spring.cloud.azure.cosmos*.key                    |
> |*azure.cosmos*.populate-query-metrics |*spring.cloud.azure.cosmos*.populate-query-metrics |
> |*azure.cosmos*.uri                    |*spring.cloud.azure.cosmos*.endpoint               |

### From azure-spring-boot-starter-keyvault-secrets to spring-cloud-azure-starter-keyvault-secrets

This guide is intended to assist in the migration to [spring-cloud-azure-starter-keyvault-secrets](https://search.maven.org/artifact/com.azure.spring/spring-cloud-azure-starter-keyvault-secrets) from version 3 of [azure-spring-boot-starter-keyvault-secrets](https://search.maven.org/artifact/com.azure.spring/azure-spring-boot-starter-keyvault-secrets).

For general information, use the following links:

* For an overview of the changes in 4.0, see the [Introduction](#introduction) and [Migration benefits](#migration-benefits) sections.
* To learn more about the strategy changes in the project naming, see the [Naming changes](#naming-changes) section.
* To learn how to use one BOM for all Spring Cloud Azure libraries, see the [BOM](#bom) section.
* To learn how to handle authentication in Spring Cloud Azure 4.0, see the [Authentication changes](#authentication-changes) section.
* To learn how to leverage `spring-boot-properties-migrator` during migration, see the [Configure each SDK](#configure-each-sdk) section.
* To learn more about the global and common configuration changes, see the [Global configurations](#global-configurations) section.

#### SDK configuration changes

This section includes the changes about the properties added, removed and changed.

The following table shows the property mappings from `azure-spring-boot-starter-keyvault-secrets` to `spring-cloud-azure-starter-keyvault-secrets`:

> [!div class="mx-tdBreakAll"]
> | Legacy properties                     | Modern properties                                                                                                             |
> |---------------------------------------|-------------------------------------------------------------------------------------------------------------------------------|
> | *azure.keyvault*.case-sensitive-keys  | *spring.cloud.azure.keyvault.secret*.property-source[n].case-sensitive                                                        |
> | *azure.keyvault*.certificate-password | *spring.cloud.azure.keyvault.secret*.property-source[n].credential.client-certificate-password                                |
> | *azure.keyvault*.certificate-path     | *spring.cloud.azure.keyvault.secret*.property-source[n].credential.client-certificate-path                                    |
> | *azure.keyvault*.client-id            | *spring.cloud.azure.keyvault.secret*.property-source[n].credential.client-id                                                  |
> | *azure.keyvault*.client-key           | *spring.cloud.azure.keyvault.secret*.property-source[n].credential.client-secret                                              |
> | *azure.keyvault*.enabled              | *spring.cloud.azure.keyvault.secret*.property-source-enabled and *spring.cloud.azure.keyvault.secret*.property-source-enabled |
> | *azure.keyvault*.order                | No longer supported. Use the order in property-source[n] instead.                                                             |
> | *azure.keyvault*.refresh-interval     | *spring.cloud.azure.keyvault.secret*.property-source[n].refresh-interval                                                      |
> | *azure.keyvault*.secret-keys          | *spring.cloud.azure.keyvault.secret*.property-source[n].secret-keys                                                           |
> | *azure.keyvault*.tenant-id            | *spring.cloud.azure.keyvault.secret*.property-source[n].profile.tenant-id                                                     |
> | *azure.keyvault*.uri                  | *spring.cloud.azure.keyvault.secret*.property-source[n].endpoint                                                              |

* Removed properties from spring-cloud-azure-starter-keyvault-secrets

azure.keyvault.allow-telemetry
azure.keyvault.order

The following points you should pay your attention to:

1.  All configuration property names changed the prefix from `azure.keyvault` to `spring.cloud.azure.keyvault.secret`.
1. `spring.cloud.azure.keyvault.secret.enabled` is used to enable all Key Vault Secret features, include configure Key Vault secret client beans(like `SecretClient` and `SecretAsyncClient`) and add `KeyVaultPropertySource` in `ConfigurableEnvironment`.
1. `spring.cloud.azure.keyvault.secret.property-source-enabled` is used to enable all `KeyVaultPropertySource`. It will take effect only when `spring.cloud.azure.keyvault.secret.enabled=true`.
1. For Azure common properties(like `client`, `proxy`, `retry`, `credential`, `profile`) and Key Vault properties(like `endpoint`, `service-version`). If `spring.cloud.azure.keyvault.secret.property-sources[n].PROPERTY_NAME` isn't configured, `spring.cloud.azure.keyvault.secret.PROPERTY_NAME` will be used.
1. `spring.cloud.azure.keyvault.secret.property-sources[n].resource` is specific to a unique Azure resource, so if it's not configured, it won't get value from other places.

### From azure-spring-boot-starter-servicebus-jms to spring-cloud-azure-starter-servicebus-jms

This guide is intended to assist in the migration to [spring-cloud-azure-starter-servicebus-jms](https://search.maven.org/artifact/com.azure.spring/spring-cloud-azure-starter-servicebus-jms) from version 3 of [azure-spring-boot-starter-servicebus-jms](https://search.maven.org/artifact/com.azure.spring/azure-spring-boot-starter-servicebus-jms).

For general information, use the following links:

* For an overview of the changes in 4.0, see the [Introduction](#introduction) and [Migration benefits](#migration-benefits) sections.
* To learn more about the strategy changes in the project naming, see the [Naming changes](#naming-changes) section.
* To learn how to use one BOM for all Spring Cloud Azure libraries, see the [BOM](#bom) section.
* To learn how to handle authentication in Spring Cloud Azure 4.0, see the [Authentication changes](#authentication-changes) section.
* To learn how to leverage `spring-boot-properties-migrator` during migration, see the [Configure each SDK](#configure-each-sdk) section.
* To learn more about the global and common configuration changes, see the [Global configurations](#global-configurations) section.

#### SDK configuration changes

Configuration type for `spring.jms.servicebus.idle-timeout` changed from `long`(milliseconds) to `Duration` pattern for readability.

### From azure-spring-boot-starter-storage to spring-cloud-azure-starter-storage-blob

This guide is intended to assist in the migration to [spring-cloud-azure-starter-storage-blob](https://search.maven.org/artifact/com.azure.spring/spring-cloud-azure-starter-storage-blob) from version 3 of [azure-spring-boot-starter-storage](https://search.maven.org/artifact/com.azure.spring/azure-spring-boot-starter-storage).

For general information, use the following links:

* For an overview of the changes in 4.0, see the [Introduction](#introduction) and [Migration benefits](#migration-benefits) sections.
* To learn more about the strategy changes in the project naming, see the [Naming changes](#naming-changes) section.
* To learn how to use one BOM for all Spring Cloud Azure libraries, see the [BOM](#bom) section.
* To learn how to handle authentication in Spring Cloud Azure 4.0, see the [Authentication changes](#authentication-changes) section.
* To learn how to leverage `spring-boot-properties-migrator` during migration, see the [Configure each SDK](#configure-each-sdk) section.
* To learn more about the global and common configuration changes, see the [Global configurations](#global-configurations) section.

#### SDK configuration changes

All configuration property names changed the prefix from `azure.storage` to `spring.cloud.azure.storage.blob`.

The following table shows the property mappings from `azure-spring-boot-starter-storage` to `spring-cloud-azure-starter-storage-blob`:

| Legacy properties             | Modern properties                              |
|-------------------------------|------------------------------------------------|
| *azure.storage*.account-name  | *spring.cloud.azure.storage.blob*.account-name |
| *azure.storage*.account-key   | *spring.cloud.azure.storage.blob*.account-key  |
| *azure.storage*.blob-endpoint | *spring.cloud.azure.storage.blob*.endpoint     |

#### API changes

The following table shows the class mappings from `azure-spring-boot-starter-storage` to `spring-cloud-azure-starter-storage-blob`:

> [!div class="mx-tdBreakAll"]
> | Legacy class                                                                        | Modern class                                                    |
> |-------------------------------------------------------------------------------------|-----------------------------------------------------------------|
> | com.azure.spring.autoconfigure.storage.resource.AzureStorageProtocolResolver        | com.azure.spring.core.resource.AzureStorageBlobProtocolResolver |
> | com.azure.spring.autoconfigure.storage.resource.BlobStorageResource                 | com.azure.spring.core.resource.StorageBlobResource              |
> | com.azure.spring.autoconfigure.storage.resource.AzureStorageResourcePatternResolver | com.azure.spring.core.resource.AzureStorageBlobProtocolResolver |

### From azure-spring-boot-starter-storage to spring-cloud-azure-starter-storage-file-share

This guide is intended to assist in the migration to [spring-cloud-azure-starter-storage-file-share](https://search.maven.org/artifact/com.azure.spring/spring-cloud-azure-starter-storage-file-share) from version 3 of [azure-spring-boot-starter-storage](https://search.maven.org/artifact/com.azure.spring/azure-spring-boot-starter-storage).

For general information, use the following links:

* For an overview of the changes in 4.0, see the [Introduction](#introduction) and [Migration benefits](#migration-benefits) sections.
* To learn more about the strategy changes in the project naming, see the [Naming changes](#naming-changes) section.
* To learn how to use one BOM for all Spring Cloud Azure libraries, see the [BOM](#bom) section.
* To learn how to handle authentication in Spring Cloud Azure 4.0, see the [Authentication changes](#authentication-changes) section.
* To learn how to leverage `spring-boot-properties-migrator` during migration, see the [Configure each SDK](#configure-each-sdk) section.
* To learn more about the global and common configuration changes, see the [Global configurations](#global-configurations) section.

#### SDK configuration changes

All configuration property names changed the prefix from `azure.storage` to `spring.cloud.azure.storage.fileshare`.

The following table shows the property mappings from `azure-spring-boot-starter-storage` to `spring-cloud-azure-starter-storage-file-share`:

| Legacy properties             | Modern properties                                   |
|-------------------------------|-----------------------------------------------------|
| *azure.storage*.account-name  | *spring.cloud.azure.storage.fileshare*.account-name |
| *azure.storage*.account-key   | *spring.cloud.azure.storage.fileshare*.account-key  |
| *azure.storage*.file-endpoint | *spring.cloud.azure.storage.fileshare*.endpoint     |

#### API changes

The following table shows the class mappings from `azure-spring-boot-starter-storage` to `spring-cloud-azure-starter-storage-file-share`:

> [!div class="mx-tdBreakAll"]
> | Legacy class                                                                        | Modern class                                                    |
> |-------------------------------------------------------------------------------------|-----------------------------------------------------------------|
> | com.azure.spring.autoconfigure.storage.resource.AzureStorageProtocolResolver        | com.azure.spring.core.resource.AzureStorageFileProtocolResolver |
> | com.azure.spring.autoconfigure.storage.resource.FileStorageResource                 | com.azure.spring.core.resource.StorageFileResource              |
> | com.azure.spring.autoconfigure.storage.resource.AzureStorageResourcePatternResolver | com.azure.spring.core.resource.AzureStorageFileProtocolResolver |

### From azure-spring-cloud-starter-eventhubs to spring-cloud-azure-starter-integration-eventhubs

This guide is intended to assist in the migration to [spring-cloud-azure-starter-integration-eventhubs](https://search.maven.org/artifact/com.azure.spring/spring-cloud-azure-starter-integration-eventhubs) from version 2 of [azure-spring-cloud-starter-eventhubs](https://search.maven.org/artifact/com.azure.spring/azure-spring-cloud-starter-eventhubs).

For general information, use the following links:

* For an overview of the changes in 4.0, see the [Introduction](#introduction) and [Migration benefits](#migration-benefits) sections.
* To learn more about the strategy changes in the project naming, see the [Naming changes](#naming-changes) section.
* To learn how to use one BOM for all Spring Cloud Azure libraries, see the [BOM](#bom) section.
* To learn how to handle authentication in Spring Cloud Azure 4.0, see the [Authentication changes](#authentication-changes) section.
* To learn how to leverage `spring-boot-properties-migrator` during migration, see the [Configure each SDK](#configure-each-sdk) section.
* To learn more about the global and common configuration changes, see the [Global configurations](#global-configurations) section.

#### SDK configuration changes

> [!IMPORTANT]
> Configuration prefix has been changed from `spring.cloud.azure.eventhub` to `spring.cloud.azure.eventhubs.`

For changes to the child entries for this prefix, see the following tables:

The following table shows property mappings from `azure-spring-cloud-starter-eventhubs` to `spring-cloud-azure-starter-integration-eventhubs`:

> [!div class="mx-tdBreakAll"]
> | Legacy properties                                        | Modern properties                                                        |
> |----------------------------------------------------------|--------------------------------------------------------------------------|
> | *spring.cloud.azure*.resource-group                      | *spring.cloud.azure.eventhubs*.resource.resource-group                   |
> | *spring.cloud.azure.eventhub*.namespace                  | *spring.cloud.azure.eventhubs*.namespace                                 |
> | *spring.cloud.azure.eventhub*.connection-string          | *spring.cloud.azure.eventhubs*.connection-string                         |
> | *spring.cloud.azure.eventhub*.checkpoint-storage-account | *spring.cloud.azure.eventhubs.processor*.checkpoint-store.account-name   |
> | *spring.cloud.azure.eventhub*.checkpoint-access-key      | *spring.cloud.azure.eventhubs.processor*.checkpoint-store.account-key    |
> | *spring.cloud.azure.eventhub*.checkpoint-container       | *spring.cloud.azure.eventhubs.processor*.checkpoint-store.container-name |

For example, change from:

```yaml
spring:
  cloud:
    azure:
      eventhub:
        connection-string: ${AZURE_EVENTHUBS_CONNECTION_STRING}
        checkpoint-storage-account: ${AZURE_CHECKPOINT_STORAGE_ACCOUNT_NAME}
        checkpoint-access-key: ${AZURE_CHECKPOINT_ACCOUNT_KEY}
        checkpoint-container: ${AZURE_CHECKPOINT_CONTAINER_NAME}
```

to:

```yaml
spring:
  cloud:
    azure:
      eventhubs:
        connection-string: ${AZURE_EVENTHUBS_CONNECTION_STRING}
        processor:
          checkpoint-store:
            container-name: ${AZURE_STORAGE_CONTAINER_NAME}
            account-name: ${AZURE_STORAGE_ACCOUNT_NAME}
            account-key: ${AZURE_STORAGE_ACCOUNT_KEY}
```

#### API changes

* For the changes to the listener annotations, see the migration guide of the <<migration-azure-spring-cloud-messaging, azure-spring-cloud-messaging>> library.
* Drop `EventHubOperation` with the subscribing function moved to class `EventHubsMessageListenerContainer` and the sending function moved to `EventHubsTemplate`.
* Rename `EventHubInboundChannelAdapter` as `EventHubsInboundChannelAdapter` to keep consistent with the service of Azure
  Event Hubs.
* Change the constructor from `EventHubInboundChannelAdapter(String, SubscribeByGroupOperation, String)` to `EventHubsInboundChannelAdapter(EventHubsMessageListenerContainer)` and `EventHubsInboundChannelAdapter(EventHubsMessageListenerContainer, ListenerMode)`.
* Change `CheckpointConfig` instantiation style to the simple constructor instead of build style.
* Drop API `EventHubOperation#setCheckpointConfig`. To set the checkpoint configuration for the inbound channel adapter, users can call the method `EventHubsContainerProperties#setCheckpointConfig`.
* Drop API `EventHubOperation#setBatchConsumerConfig`. To set the batch-consuming configuration for the inbound channel adapter, users can call the two methods `EventHubsContainerProperties#getBatch#setMaxSize` and `EventHubsContainerProperties#getBatch#setMaxWaitTime` meanwhile.
* For the batch consuming mode, change the message header names converted from batched messages.
    * Change message header from `azure_eventhub_enqueued_time` to `azure_eventhubs_batch_converted_enqueued_time`.
    * Change message header from `azure_eventhub_offset` to `azure_eventhubs_batch_converted_offset`.
    * Change message header from `azure_eventhub_sequence_number` to `azure_eventhubs_batch_converted_sequence_number`.
    * Change message header from `azure_partition_key` to `azure_batch_converted_partition_key`.
* When publishing messages to Event Hubs, ignore all message headers converted from batched messages. Headers include:
    * azure_batch_converted_partition_key
    * azure_eventhubs_batch_converted_enqueued_time
    * azure_eventhubs_batch_converted_offset
    * azure_eventhubs_batch_converted_sequence_number
    * azure_eventhubs_batch_converted_system_properties
    * azure_eventhubs_batch_converted_application_properties
* The `BATCH` checkpoint mode only works in the batch-consuming mode now, which can be enabled by passing `ListenerMode.BATCH` to EventHubsInboundChannelAdapter constructor.

The following table shows the class mappings from `azure-spring-cloud-starter-eventhubs` to `spring-cloud-azure-starter-integration-eventhubs`:

> [!div class="mx-tdBreakAll"]
> | Legacy class                                                                | Modern class                                                                 |
> |-----------------------------------------------------------------------------|------------------------------------------------------------------------------|
> | com.azure.spring.integration.core.AzureHeaders                              | com.azure.spring.messaging.AzureHeaders                                      |
> | com.azure.spring.integration.core.EventHubHeaders                           | com.azure.spring.messaging.eventhubs.support.EventHubsHeaders                |
> | com.azure.spring.integration.core.api.CheckpointConfig                      | com.azure.spring.messaging.eventhubs.core.checkpoint.CheckpointConfig        |
> | com.azure.spring.integration.core.api.CheckpointMode                        |com.azure.spring.messaging.eventhubs.core.checkpoint.CheckpointMode           |
> | com.azure.spring.integration.core.api.reactor.Checkpointer                  |com.azure.spring.messaging.checkpoint.Checkpointer                            |
> | com.azure.spring.integration.core.api.reactor.DefaultMessageHandler         |com.azure.spring.integration.core.handler.DefaultMessageHandler               |
> | com.azure.spring.integration.eventhub.inbound.EventHubInboundChannelAdapter |com.azure.spring.integration.eventhubs.inbound.EventHubsInboundChannelAdapter |

#### Sample code snippet

* `EventHubsInboundChannelAdapter` sample code:

  Legacy code:

  ```java
  public class Demo {
      @Bean
      public EventHubInboundChannelAdapter messageChannelAdapter(
          @Qualifier("INPUT_CHANNEL") MessageChannel inputChannel, EventHubOperation   eventhubOperation) {
          eventhubOperation.setCheckpointConfig(CheckpointConfig.builder().checkpointMode  (CheckpointMode.MANUAL).build());
          EventHubInboundChannelAdapter adapter = new EventHubInboundChannelAdapter("EVENTHUB_NAME",
              eventhubOperation, "CONSUMER_GROUP");
          adapter.setOutputChannel(inputChannel);
          return adapter;
      }
  }
  ```

  Modern code:

  ```java
  public class Demo {
      @Bean
      public EventHubsMessageListenerContainer messageListenerContainer(EventHubsProcessorFactory processorFactory) {
          EventHubsContainerProperties containerProperties = new EventHubsContainerProperties();
          containerProperties.setEventHubName("EVENTHUB_NAME");
          containerProperties.setConsumerGroup("CONSUMER_GROUP");
          CheckpointConfig config = new CheckpointConfig(CheckpointMode.MANUAL);
          containerProperties.setCheckpointConfig(config);
          return new EventHubsMessageListenerContainer(processorFactory, containerProperties);
      }

      @Bean
      public EventHubsInboundChannelAdapter messageChannelAdapter(@Qualifier("INPUT_CHANNEL") MessageChannel inputChannel,
                                                                  EventHubsMessageListenerContainer listenerContainer) {
          EventHubsInboundChannelAdapter adapter = new EventHubsInboundChannelAdapter(listenerContainer);
          adapter.setOutputChannel(inputChannel);
          return adapter;
      }
  }
  ```

* `DefaultMessageHandler` sample code:

  Legacy code:

  ```java
  public class Demo {
      @Bean
      @ServiceActivator(inputChannel = "OUTPUT_CHANNEL")
      public MessageHandler messageSender(EventHubOperation eventhubOperation) {
          DefaultMessageHandler handler = new DefaultMessageHandler("EVENTHUB_NAME", eventhubOperation);
          handler.setSendCallback(new ListenableFutureCallback<Void>() {
              @Override
              public void onSuccess(Void result) {
                  LOGGER.info("Message was sent successfully.");
              }

              @Override
              public void onFailure(Throwable ex) {
                  LOGGER.error("There was an error sending the message.", ex);
              }
          });
          return handler;
      }
  }
  ```

  Modern code:

  ```java
  public class Demo {
      @Bean
      @ServiceActivator(inputChannel = "OUTPUT_CHANNEL")
      public MessageHandler messageSender(EventHubsTemplate eventhubOperation) {
          DefaultMessageHandler handler = new DefaultMessageHandler("EVENTHUB_NAME", eventhubOperation);
          handler.setSendCallback(new ListenableFutureCallback<Void>() {
              @Override
              public void onSuccess(Void result) {
                  LOGGER.info("Message was sent successfully.");
              }

              @Override
              public void onFailure(Throwable ex) {
                  LOGGER.error("There was an error sending the message.", ex);
              }
          });

          return handler;
      }
  }
  ```

### From azure-spring-integration-eventhubs to spring-integration-azure-eventhubs

This guide is intended to assist in the migration to [spring-integration-azure-eventhubs](https://search.maven.org/artifact/com.azure.spring/spring-integration-azure-eventhubs) from version 2 of [azure-spring-integration-eventhubs](https://search.maven.org/artifact/com.azure.spring/azure-spring-integration-eventhubs).

* For an overview of the changes in 4.0, see the [Introduction](#introduction) and [Migration benefits](#migration-benefits) sections.
* To learn more about the strategy changes in the project naming, see the [Naming changes](#naming-changes) section.
* To learn how to use one BOM for all Spring Cloud Azure libraries, see the [BOM](#bom) section.

#### API changes

* Drop `EventHubOperation` with the subscribing function moved to class `EventHubsMessageListenerContainer` and the sending function moved to `EventHubsTemplate`.
* Rename `EventHubInboundChannelAdapter` as `EventHubsInboundChannelAdapter` to keep consistent with the service of Azure Event Hubs.
* Change the constructor from `EventHubInboundChannelAdapter(String, SubscribeByGroupOperation, String)` to `EventHubsInboundChannelAdapter(EventHubsMessageListenerContainer)` and `EventHubsInboundChannelAdapter(EventHubsMessageListenerContainer, ListenerMode)`.
* Change `CheckpointConfig` instantiation style to the simple constructor instead of build style.
* Drop API `EventHubOperation#setCheckpointConfig`. To set the checkpoint configuration for the inbound channel adapter, users can call the method `EventHubsContainerProperties#setCheckpointConfig`.
* Drop API `EventHubOperation#setBatchConsumerConfig`. To set the batch-consuming configuration for the inbound channel adapter, users can call the two methods `EventHubsContainerProperties#getBatch#setMaxSize` and `EventHubsContainerProperties#getBatch#setMaxWaitTime` meanwhile.
* For the batch consuming mode, change the message header names converted from batched messages.
  * Change message header from `azure_eventhub_enqueued_time` to `azure_eventhubs_batch_converted_enqueued_time`.
  * Change message header from `azure_eventhub_offset` to `azure_eventhubs_batch_converted_offset`.
  * Change message header from `azure_eventhub_sequence_number` to `azure_eventhubs_batch_converted_sequence_number`.
  * Change message header from `azure_partition_key` to `azure_batch_converted_partition_key`.
* When publishing messages to Event Hubs, ignore all message headers converted from batched messages. Headers include:
  * azure_batch_converted_partition_key
  * azure_eventhubs_batch_converted_enqueued_time
  * azure_eventhubs_batch_converted_offset
  * azure_eventhubs_batch_converted_sequence_number
  * azure_eventhubs_batch_converted_system_properties
  * azure_eventhubs_batch_converted_application_properties
* The `BATCH` checkpoint mode only works in the batch-consuming mode now, which can be enabled by passing `ListenerMode.BATCH` to EventHubsInboundChannelAdapter constructor.

The following table shows the class mappings from `azure-spring-integration-eventhubs ` to `spring-integration-azure-eventhubs`:

> [!div class="mx-tdBreakAll"]
> | Legacy class                                                               | Modern class                                                                 |
> |----------------------------------------------------------------------------|------------------------------------------------------------------------------|
> |com.azure.spring.integration.core.AzureHeaders                              |com.azure.spring.messaging.AzureHeaders                                       |
> |com.azure.spring.integration.core.EventHubHeaders                           |com.azure.spring.messaging.eventhubs.support.EventHubsHeaders                 |
> |com.azure.spring.integration.core.api.CheckpointConfig                      |com.azure.spring.messaging.eventhubs.core.checkpoint.CheckpointConfig         |
> |com.azure.spring.integration.core.api.CheckpointMode                        |com.azure.spring.messaging.eventhubs.core.checkpoint.CheckpointMode           |
> |com.azure.spring.integration.core.api.reactor.Checkpointer                  |com.azure.spring.messaging.checkpoint.Checkpointer                            |
> |com.azure.spring.integration.core.api.reactor.DefaultMessageHandler         |com.azure.spring.integration.core.handler.DefaultMessageHandler               |
> |com.azure.spring.integration.eventhub.inbound.EventHubInboundChannelAdapter |com.azure.spring.integration.eventhubs.inbound.EventHubsInboundChannelAdapter |

### From azure-spring-cloud-starter-servicebus to spring-cloud-azure-starter-integration-servicebus

This guide is intended to assist in the migration to [spring-cloud-azure-starter-integration-servicebus](https://search.maven.org/artifact/com.azure.spring/spring-cloud-azure-starter-integration-servicebus) from version 2 of [azure-spring-cloud-starter-servicebus](https://search.maven.org/artifact/com.azure.spring/azure-spring-cloud-starter-servicebus).

For general information, use the following links:

* For an overview of the changes in 4.0, see the [Introduction](#introduction) and [Migration benefits](#migration-benefits) sections.
* To learn more about the strategy changes in the project naming, see the [Naming changes](#naming-changes) section.
* To learn how to use one BOM for all Spring Cloud Azure libraries, see the [BOM](#bom) section.
* To learn how to handle authentication in Spring Cloud Azure 4.0, see the [Authentication changes](#authentication-changes) section.
* To learn how to leverage `spring-boot-properties-migrator` during migration, see the [Configure each SDK](#configure-each-sdk) section.
* To learn more about the global and common configuration changes, see the [Global configurations](#global-configurations) section.

#### SDK configuration changes

For all configuration options supported in `spring-cloud-azure-starter-integration-servicebus`, the prefix remains as `spring.cloud.azure.servicebus`.

The following table shows the property mappings from `azure-spring-cloud-starter-servicebus` to `spring-cloud-azure-starter-integration-servicebus`:

> [!div class="mx-tdBreakAll"]
> | Legacy properties                                        | Modern properties                                                                                                                                                                                                              |
> |----------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
> |*spring.cloud.azure*.resource-group                       |*spring.cloud.azure.servicebus*.resource.resource-group                                                                                                                                                                         |
> |*spring.cloud.azure.servicebus*.transport-type            |*spring.cloud.azure.servicebus*.client.transport-type                                                                                                                                                                           |
> |*spring.cloud.azure.servicebus*.retry-options.retry-mode  |*spring.cloud.azure.servicebus*.retry.mode                                                                                                                                                                                      |
> |*spring.cloud.azure.servicebus*.retry-options.max-retries |*spring.cloud.azure.servicebus*.retry.exponential.max-retries or *spring.cloud.azure.servicebus*.retry.fixed.max-retries, should be configured depending on *spring.cloud.azure.servicebus*.retry.mode=*fixed* or *exponential* |
> |*spring.cloud.azure.servicebus*.retry-options.delay       |*spring.cloud.azure.servicebus*.retry.exponential.base-delay or *spring.cloud.azure.servicebus*.retry.fixed.delay, should be configured depending on *spring.cloud.azure.servicebus*.retry.mode=*fixed* or *exponential*  |
> |*spring.cloud.azure.servicebus*.retry-options.max-delay   |*spring.cloud.azure.servicebus*.retry.exponential.max-delay                                                                                                                                                                     |
> |*spring.cloud.azure.servicebus*.retry-options.try-timeout |*spring.cloud.azure.servicebus*.retry.try-timeout                                                                                                                                                                               |

#### API changes

* Drop `ServiceBusQueueOperation` and `ServiceBusTopicOperation` with the subscribing function moved to class `ServiceBusMessageListenerContainer` and the sending function moved to `ServiceBusTemplate`.
* Drop `ServiceBusQueueInboundChannelAdapter` and `ServiceBusTopicInboundChannelAdapter`, and move the functionality to listen to a Service Bus queue/topic entity to ServiceBusInboundChannelAdapter.
* Change the constructor from `ServiceBusQueueInboundChannelAdapter(String, SubscribeByGroupOperation, String)` to `ServiceBusInboundChannelAdapter(ServiceBusMessageListenerContainer)` and `ServiceBusInboundChannelAdapter(ServiceBusMessageListenerContainer, ListenerMode)`.
* Change the constructor from `ServiceBusTopicInboundChannelAdapter(String, SubscribeByGroupOperation, String)` to `ServiceBusInboundChannelAdapter(ServiceBusMessageListenerContainer)` and `ServiceBusInboundChannelAdapter(ServiceBusMessageListenerContainer, ListenerMode)`.
* Drop APIs `ServiceBusQueueOperation#setCheckpointConfig` and `ServiceBusTopicOperation#setCheckpointConfig`. To set the checkpoint configuration for the inbound channel adapter, users can call the method `ServiceBusContainerProperties#setAutoComplete` instead. To disable the auto-complete mode is equivalent to `MANUAL` checkpoint mode and to enable it will trigger the `RECORD` mode.
* Drop APIs `ServiceBusQueueOperatio#setClientConfig` and `ServiceBusTopicOperation#setClientConfig`. To configure the underlying `ServiceBusProcessorClient` used by the inbound channel adapter, users can use `ServiceBusContainerProperties` instead.
* Drop `CompletableFuture` support in `ServiceBusTemplate` and `DefaultMessageHandler`, support `Reactor` instead.
* Add new API of `ServiceBusTemplate#setDefaultEntityType` to specify the entity type, which is required when no bean of `PropertiesSupplier&lt;String, ProducerProperties&gt;` is provided for the `ProducerProperties#entityType`.
* Drop message header `AzureHeaders.RAW_ID`. Use `ServiceBusMessageHeaders.MESSAGE_ID` instead.

The following table shows the class mappings from `azure-spring-cloud-starter-servicebus` to `spring-cloud-azure-starter-integration-servicebus`:

> [!div class="mx-tdBreakAll"]
> | Legacy class                                                                        | Modern class                                                                      |
> |-------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------|
> |com.azure.spring.integration.core.AzureHeaders                                       |com.azure.spring.messaging.AzureHeaders                                            |
> |com.azure.spring.integration.servicebus.converter.ServiceBusMessageHeaders           |com.azure.spring.messaging.servicebus.support.ServiceBusMessageHeaders             |
> |com.azure.spring.integration.servicebus.converter.ServiceBusMessageConverter         |com.azure.spring.messaging.servicebus.support.converter.ServiceBusMessageConverter |
> |com.azure.spring.integration.core.DefaultMessageHandler                              |com.azure.spring.integration.core.handler.DefaultMessageHandler                    |
> |com.azure.spring.integration.servicebus.inbound.ServiceBusQueueInboundChannelAdapter |com.azure.spring.integration.servicebus.inbound.ServiceBusInboundChannelAdapter    |
> |com.azure.spring.integration.servicebus.inbound.ServiceBusTopicInboundChannelAdapter |com.azure.spring.integration.servicebus.inbound.ServiceBusInboundChannelAdapter    |

#### Sample code snippet

* `ServiceBusInboundChannelAdapter` sample code:

  Legacy code of using `ServiceBusQueueInboundChannelAdapter` or `ServiceBusTopicInboundChannelAdapter`:

  ```java
  public class Demo {
      @Bean
      public ServiceBusQueueInboundChannelAdapter queueMessageChannelAdapter(
          @Qualifier("INPUT_CHANNEL_NAME") MessageChannel inputChannel, ServiceBusQueueOperation queueOperation) {
          queueOperation.setCheckpointConfig(CheckpointConfig.builder().checkpointMode(CheckpointMode.MANUAL).build());
          ServiceBusQueueInboundChannelAdapter adapter = new ServiceBusQueueInboundChannelAdapter("QUEUE_NAME",
              queueOperation);
          adapter.setOutputChannel(inputChannel);
          return adapter;
      }

      @Bean
      public ServiceBusTopicInboundChannelAdapter topicMessageChannelAdapter(
          @Qualifier("INPUT_CHANNEL_NAME") MessageChannel inputChannel, ServiceBusTopicOperation topicOperation) {
          topicOperation.setCheckpointConfig(CheckpointConfig.builder().checkpointMode(CheckpointMode.MANUAL).build());
          ServiceBusTopicInboundChannelAdapter adapter = new ServiceBusTopicInboundChannelAdapter("TOPIC_NAME",
              topicOperation, "SUBSCRIPTION_NAME");
          adapter.setOutputChannel(inputChannel);
          return adapter;
      }

  }
  ```

  Modern code:

  ```java
  public class Demo {
      @Bean("queue-listener-container")
      public ServiceBusMessageListenerContainer messageListenerContainer(ServiceBusProcessorFactory processorFactory) {
          ServiceBusContainerProperties containerProperties = new ServiceBusContainerProperties();
          containerProperties.setEntityName("QUEUE_NAME");
          containerProperties.setAutoComplete(false);
          return new ServiceBusMessageListenerContainer(processorFactory, containerProperties);
      }

      @Bean
      public ServiceBusInboundChannelAdapter queueMessageChannelAdapter(
          @Qualifier("INPUT_CHANNEL") MessageChannel inputChannel,
          @Qualifier("queue-listener-container") ServiceBusMessageListenerContainer listenerContainer) {
          ServiceBusInboundChannelAdapter adapter = new ServiceBusInboundChannelAdapter(listenerContainer);
          adapter.setOutputChannel(inputChannel);
          return adapter;
      }

      @Bean("topic-listener-container")
      public ServiceBusMessageListenerContainer messageListenerContainer(ServiceBusProcessorFactory processorFactory) {
          ServiceBusContainerProperties containerProperties = new ServiceBusContainerProperties();
          containerProperties.setEntityName("TOPIC_NAME");
          containerProperties.setSubscriptionName("SUBSCRIPTION_NAME");
          containerProperties.setAutoComplete(false);
          return new ServiceBusMessageListenerContainer(processorFactory, containerProperties);
      }

      @Bean
      public ServiceBusInboundChannelAdapter topicMessageChannelAdapter(
          @Qualifier("INPUT_CHANNEL") MessageChannel inputChannel,
          @Qualifier("topic-listener-container") ServiceBusMessageListenerContainer listenerContainer) {
          ServiceBusInboundChannelAdapter adapter = new ServiceBusInboundChannelAdapter(listenerContainer);
          adapter.setOutputChannel(inputChannel);
          return adapter;
      }
  }
  ```

* `DefaultMessageHandler` sample code:

  Legacy code, taking queue as example:

  ```java
  public class Demo {
      @Bean
      @ServiceActivator(inputChannel = "OUTPUT_CHANNEL_NAME")
      public MessageHandler queueMessageSender(ServiceBusQueueOperation queueOperation) {
          DefaultMessageHandler handler = new DefaultMessageHandler("QUEUE_NAME", queueOperation);
          handler.setSendCallback(new ListenableFutureCallback<Void>() {
              @Override
              public void onSuccess(Void result) {
                  LOGGER.info("Message was sent successfully.");
              }
              @Override
              public void onFailure(Throwable ex) {
                  LOGGER.info("There was an error sending the message.");
              }
          });
          return handler;
      }
  }
  ```

  Modern code:

  ```java
  public class Demo {

      @Bean
      @ServiceActivator(inputChannel = "OUTPUT_CHANNEL_NAME")
      public MessageHandler queueMessageSender(ServiceBusTemplate serviceBusTemplate) {
          serviceBusTemplate.setDefaultEntityType(ServiceBusEntityType.QUEUE);
          DefaultMessageHandler handler = new DefaultMessageHandler("QUEUE_NAME", serviceBusTemplate);
          handler.setSendCallback(new ListenableFutureCallback<Void>() {
              @Override
              public void onSuccess(Void result) {
                  LOGGER.info("Message was sent successfully for {}.", "QUEUE_NAME");
              }

              @Override
              public void onFailure(Throwable ex) {
                  LOGGER.info("There was an error sending the message.");
              }
          });

          return handler;
      }
  }
  ```

### From azure-spring-integration-servicebus to spring-integration-azure-servicebus

This guide is intended to assist in the migration to [spring-integration-azure-servicebus](https://search.maven.org/artifact/com.azure.spring/spring-integration-azure-servicebus) from version 2 of [azure-spring-integration-servicebus](https://search.maven.org/artifact/com.azure.spring/azure-spring-integration-servicebus).

* For an overview of the changes in 4.0, see the [Introduction](#introduction) and [Migration benefits](#migration-benefits) sections.
* To learn more about the strategy changes in the project naming, see the [Naming changes](#naming-changes) section.
* To learn how to use one BOM for all Spring Cloud Azure libraries, see the [BOM](#bom) section.

#### API changes

* Drop `ServiceBusQueueOperation` and `ServiceBusTopicOperation` with the subscribing function moved to class `ServiceBusMessageListenerContainer` and the sending function moved to `ServiceBusTemplate`.
* Drop `ServiceBusQueueInboundChannelAdapter` and `ServiceBusTopicInboundChannelAdapter`, and move the functionality to listen to a Service Bus queue/topic entity to ServiceBusInboundChannelAdapter.
* Change the constructor from `ServiceBusQueueInboundChannelAdapter(String, SubscribeByGroupOperation, String)` to `ServiceBusInboundChannelAdapter(ServiceBusMessageListenerContainer)` and `ServiceBusInboundChannelAdapter(ServiceBusMessageListenerContainer, ListenerMode)`.
* Change the constructor from `ServiceBusTopicInboundChannelAdapter(String, SubscribeByGroupOperation, String)` to `ServiceBusInboundChannelAdapter(ServiceBusMessageListenerContainer)` and `ServiceBusInboundChannelAdapter(ServiceBusMessageListenerContainer, ListenerMode)`.
* Drop APIs `ServiceBusQueueOperation#setCheckpointConfig` and `ServiceBusTopicOperation#setCheckpointConfig`. To set the checkpoint configuration for the inbound channel adapter, users can call the method `ServiceBusContainerProperties#setAutoComplete` instead. To disable the auto-complete mode is equivalent to `MANUAL` checkpoint mode and to enable it will trigger the `RECORD` mode.
* Drop APIs `ServiceBusQueueOperation#setClientConfig` and `ServiceBusTopicOperation#setClientConfig`. To configure the underlying `ServiceBusProcessorClient` used by the inbound channel adapter, users can use `ServiceBusContainerProperties` instead.
* Drop `CompletableFuture` support in `ServiceBusTemplate` and `DefaultMessageHandler`, support `Reactor` instead.
* Add new API of `ServiceBusTemplate#setDefaultEntityType` to specify the entity type, which is required when no bean of `PropertiesSupplier&lt;String, ProducerProperties&gt;` is provided for the `ProducerProperties#entityType`.
* Drop message header `AzureHeaders.RAW_ID`. Use `ServiceBusMessageHeaders.MESSAGE_ID` instead.

The following table shows the class mappings from `azure-spring-integration-servicebus` to `spring-integration-azure-servicebus`:

> [!div class="mx-tdBreakAll"]
> | Legacy class                                                                        | Modern class                                                                      |
> |-------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------|
> |com.azure.spring.integration.core.AzureHeaders                                       |com.azure.spring.messaging.AzureHeaders                                            |
> |com.azure.spring.integration.servicebus.converter.ServiceBusMessageHeaders           |com.azure.spring.messaging.servicebus.support.ServiceBusMessageHeaders             |
> |com.azure.spring.integration.servicebus.converter.ServiceBusMessageConverter         |com.azure.spring.messaging.servicebus.support.converter.ServiceBusMessageConverter |
> |com.azure.spring.integration.core.DefaultMessageHandler                              |com.azure.spring.integration.core.handler.DefaultMessageHandler                    |
> |com.azure.spring.integration.servicebus.inbound.ServiceBusQueueInboundChannelAdapter |com.azure.spring.integration.servicebus.inbound.ServiceBusInboundChannelAdapter    |
> |com.azure.spring.integration.servicebus.inbound.ServiceBusTopicInboundChannelAdapter |com.azure.spring.integration.servicebus.inbound.ServiceBusInboundChannelAdapter    |

### From azure-spring-cloud-starter-storage-queue to spring-cloud-azure-starter-integration-storage-queue

This guide is intended to assist in the migration to [spring-cloud-azure-starter-integration-storage-queue](https://search.maven.org/artifact/com.azure.spring/spring-cloud-azure-starter-integration-storage-queue) from version 2 of [azure-spring-cloud-starter-storage-queue](https://search.maven.org/artifact/com.azure.spring/azure-spring-cloud-starter-storage-queue).

For general information, use the following links:

* For an overview of the changes in 4.0, see the [Introduction](#introduction) and [Migration benefits](#migration-benefits) sections.
* To learn more about the strategy changes in the project naming, see the [Naming changes](#naming-changes) section.
* To learn how to use one BOM for all Spring Cloud Azure libraries, see the [BOM](#bom) section.
* To learn how to handle authentication in Spring Cloud Azure 4.0, see the [Authentication changes](#authentication-changes) section.
* To learn how to leverage `spring-boot-properties-migrator` during migration, see the [Configure each SDK](#configure-each-sdk) section.
* To learn more about the global and common configuration changes, see the [Global configurations](#global-configurations) section.

#### SDK configuration changes

All configuration property names changed the prefix from `spring.cloud.azure.storage` to `spring.cloud.azure.storage.queue`.

The following table shows the property mappings from `azure-spring-cloud-starter-storage-queue` to `spring-cloud-azure-starter-integration-storage-queue`:

> [!div class="mx-tdBreakAll"]
> | Legacy properties                           | Modern properties                                          |
> |---------------------------------------------|------------------------------------------------------------|
> | *spring.cloud.azure.storage*.account        | *spring.cloud.azure.storage.queue*.account-name            |
> | *spring.cloud.azure.storage*.access-key     | *spring.cloud.azure.storage.queue*.account-key             |
> | *spring.cloud.azure.storage*.resource-group | *spring.cloud.azure.storage.queue*.resource.resource-group |

#### API changes

* Drop `StorageQueueOperation` and provide `StorageQueueTemplate` instead.
* Drop `checkpoint-mode` configuration in `StorageQueueTemplate`, only support the `MANUAL` mode.

The following table shows the class mappings from `azure-spring-cloud-starter-storage-queue` to `spring-cloud-azure-starter-integration-storage-queue`.

> [!div class="mx-tdBreakAll"]
> | Legacy class                                                                      | Modern class                                                                           |
> |-----------------------------------------------------------------------------------|----------------------------------------------------------------------------------------|
> | com.azure.spring.integration.core.AzureHeaders                                    | com.azure.spring.messaging.AzureHeaders                                                |
> | com.azure.spring.integration.storage.queue.converter.StorageQueueMessageConverter |com.azure.spring.messaging.storage.queue.support.converter.StorageQueueMessageConverter |
> | com.azure.spring.integration.core.api.reactor.Checkpointer                        | com.azure.spring.messaging.checkpoint.Checkpointer                                     |
> | com.azure.spring.integration.storage.queue.StorageQueueTemplate                   | com.azure.spring.storage.queue.core.StorageQueueTemplate                               |
> | com.azure.spring.integration.core.api.reactor.DefaultMessageHandler               | com.azure.spring.integration.core.handler.DefaultMessageHandler                        |
> | com.azure.spring.integration.storage.queue.inbound.StorageQueueMessageSource      | com.azure.spring.integration.storage.queue.inbound.StorageQueueMessageSource           |

### From azure-spring-integration-storage-queue to spring-integration-azure-storage-queue

This guide is intended to assist in the migration to [spring-integration-azure-storage-queue](https://search.maven.org/artifact/com.azure.spring/spring-integration-azure-storage-queue) from version 2 of [azure-spring-integration-storage-queue](https://search.maven.org/artifact/com.azure.spring/azure-spring-integration-storage-queue).

* For an overview of the changes in 4.0, see the [Introduction](#introduction) and [Migration benefits](#migration-benefits) sections.
* To learn more about the strategy changes in the project naming, see the [Naming changes](#naming-changes) section.
* To learn how to use one BOM for all Spring Cloud Azure libraries, see the [BOM](#bom) section.

#### API changes

* Drop `StorageQueueOperation` and provide `StorageQueueTemplate` instead.
* Drop `checkpoint-mode` configuration in `StorageQueueTemplate`, only support the `MANUAL` mode.

The following table shows the class mappings from `azure-spring-integration-storage-queue` to `spring-integration-azure-storage-queue`.

> [!div class="mx-tdBreakAll"]
> | Legacy class                                                                      | Modern class                                                                           |
> |-----------------------------------------------------------------------------------|----------------------------------------------------------------------------------------|
> | com.azure.spring.integration.core.AzureHeaders                                    | com.azure.spring.messaging.AzureHeaders                                                |
> | com.azure.spring.integration.storage.queue.converter.StorageQueueMessageConverter |com.azure.spring.messaging.storage.queue.support.converter.StorageQueueMessageConverter |
> | com.azure.spring.integration.core.api.reactor.Checkpointer                        | com.azure.spring.messaging.checkpoint.Checkpointer                                     |
> | com.azure.spring.integration.storage.queue.StorageQueueTemplate                   | com.azure.spring.storage.queue.core.StorageQueueTemplate                               |
> | com.azure.spring.integration.core.api.reactor.DefaultMessageHandler               | com.azure.spring.integration.core.handler.DefaultMessageHandler                        |
> | com.azure.spring.integration.storage.queue.inbound.StorageQueueMessageSource      | com.azure.spring.integration.storage.queue.inbound.StorageQueueMessageSource           |

### From azure-spring-cloud-stream-binder-eventhubs to spring-cloud-azure-stream-binder-eventhubs

This guide is intended to assist in the migration to [spring-cloud-azure-stream-binder-eventhubs](https://search.maven.org/artifact/com.azure.spring/spring-cloud-azure-stream-binder-eventhubs) from version 2 of [azure-spring-cloud-stream-binder-eventhubs](https://search.maven.org/artifact/com.azure.spring/azure-spring-cloud-stream-binder-eventhubs).

For general information, use the following links:

* For an overview of the changes in 4.0, see the [Introduction](#introduction) and [Migration benefits](#migration-benefits) sections.
* To learn more about the strategy changes in the project naming, see the [Naming changes](#naming-changes) section.
* To learn how to use one BOM for all Spring Cloud Azure libraries, see the [BOM](#bom) section.
* To learn how to handle authentication in Spring Cloud Azure 4.0, see the [Authentication changes](#authentication-changes) section.
* To learn how to leverage `spring-boot-properties-migrator` during migration, see the [Configure each SDK](#configure-each-sdk) section.
* To learn more about the global and common configuration changes, see the [Global configurations](#global-configurations) section.

#### SDK configuration changes

> [!IMPORTANT]
> Configuration prefix has been changed from `spring.cloud.azure.eventhub` to `spring.cloud.azure.eventhubs.`

> [!IMPORTANT]
> The binder type is renamed from: `eventhub` to `eventhubs`.

For changes to the child entries for the following prefix, see the following table.

The following table shows property mappings from `azure-spring-cloud-stream-binder-eventhubs` to `spring-cloud-azure-stream-binder-eventhubs`:

> [!div class="mx-tdBreakAll"]
> | Legacy properties                                                                   | Modern properties                                                                                 |
> |-------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------|
> | *spring.cloud.azure*.resource-group                                                 | *spring.cloud.azure.eventhubs*.resource.resource-group                                            |
> | *spring.cloud.azure.eventhub*.namespace                                             | *spring.cloud.azure.eventhubs*.namespace                                                          |
> | *spring.cloud.azure.eventhub*.connection-string                                     | *spring.cloud.azure.eventhubs*.connection-string                                                  |
> | *spring.cloud.azure.eventhub*.checkpoint-storage-account                            | *spring.cloud.azure.eventhubs.processor*.checkpoint-store.account-name                            |
> | *spring.cloud.azure.eventhub*.checkpoint-access-key                                 | *spring.cloud.azure.eventhubs.processor*.checkpoint-store.account-key                             |
> | *spring.cloud.azure.eventhub*.checkpoint-container                                  | *spring.cloud.azure.eventhubs.processor*.checkpoint-store.container-name                          |
> | *spring.cloud.stream.eventhub.bindings.binding-name.consumer*.max-batch-size      | *spring.cloud.stream.eventhubs.bindings.binding-name.consumer*.batch.max-size                   |
> | *spring.cloud.stream.eventhub.bindings.binding-name.consumer*.max-wait-time       | *spring.cloud.stream.eventhubs.bindings.binding-name.consumer*.batch.max-wait-time              |
> | *spring.cloud.stream.eventhub.bindings.binding-name.consumer*.checkpoint-mode     | *spring.cloud.stream.eventhubs.bindings.binding-name.consumer*.checkpoint.mode                  |
> | *spring.cloud.stream.eventhub.bindings.binding-name.consumer*.checkpoint-count    | *spring.cloud.stream.eventhubs.bindings.binding-name.consumer*.checkpoint.count                 |
> | *spring.cloud.stream.eventhub.bindings.binding-name.consumer*.checkpoint-interval | *spring.cloud.stream.eventhubs.bindings.binding-name.consumer*.checkpoint.interval              |
> |*spring.cloud.stream.eventhub.bindings.binding-name.consumer*.start-position       | *spring.cloud.stream.eventhubs.bindings.binding-name.consumer*.initial-partition-event-position |

> [!NOTE]
> The value type of the `start-position` configuration is also changed from an enum of `com.azure.spring.integration.core.api.StartPosition` to a `map` of `StartPositionProperties` for each partition. Thus, the key is the partition ID, and the value is of `com.azure.spring.cloud.service.eventhubs.properties.StartPositionProperties` which includes properties of offset, sequence number, enqueued date time and whether inclusive.

*Configuration migration examples*

To use the connection string for authentication and migrate the above mentioned properties, configuration changes are listed the follows:

Legacy configuration:

```yaml
spring:
  cloud:
    azure:
      eventhub:
        connection-string: ${AZURE_EVENTHUBS_CONNECTION_STRING}
        checkpoint-storage-account: ${AZURE_CHECKPOINT_STORAGE_ACCOUNT_NAME}
        checkpoint-access-key: ${AZURE_CHECKPOINT_ACCOUNT_KEY}
        checkpoint-container: ${AZURE_CHECKPOINT_CONTAINER_NAME}
    stream:
      eventhub:
        bindings:
          <binding-name>:
            consumer:
              max-batch-size: ${AZURE_MAX_BATCH_SIZE}
              max-wait-time: ${AZURE_MAX_WAIT_TIME}
              checkpoint-mode: ${AZURE_CHECKPOINT_MODE}
              checkpoint-count: ${AZURE_CHECKPOINT_COUNT}
              checkpoint-interval: ${AZURE_CHECKPOINT_INTERVAL}
              start-position: EARLIEST
```

Modern configuration:

```yaml
spring:
  cloud:
    azure:
      eventhubs:
        connection-string: ${AZURE_EVENTHUBS_CONNECTION_STRING}
        processor:
          checkpoint-store:
            container-name: ${AZURE_STORAGE_CONTAINER_NAME}
            account-name:  ${AZURE_STORAGE_ACCOUNT_NAME}
            account-key: ${AZURE_STORAGE_ACCOUNT_KEY}
    stream:
      eventhubs:
        bindings:
          <binding-name>:
            consumer:
              batch:
                max-size: ${AZURE_MAX_BATCH_SIZE}
                max-wait-time: ${AZURE_MAX_WAIT_TIME}
              checkpoint:
                mode: ${AZURE_CHECKPOINT_MODE}
                count: ${AZURE_CHECKPOINT_COUNT}
                interval: ${AZURE_CHECKPOINT_INTERVAL}
              initial-partition-event-position:
                0:
                  offset: earliest
                1:
                  sequence-number: 100
                2:
                  enqueued-date-time: 2022-01-12T13:32:47.650005Z
                4:
                  inclusive: false
```

If you use security principals instead of connection strings, in versions before 4.0 the application will firstly connect to Azure Resource Manager (ARM) with the provided security principal, and then retrieve the connection string of the specified namespace with ARM. In the end the application uses the retrieved connection string to connect to Azure Event Hubs. In this way the provided security principal should be granted with the [Contributor](/azure/role-based-access-control/built-in-roles#contributor) role to retrieve of the associated Azure Event Hubs namespace.

For Azure Spring Apps 4.0, we provide two ways of leveraging security principals for authentication. One is still using the principals to connect to ARM and retrieve the connection strings where the `Contributor` role is required for the principals. The other leverages security principals to authenticate to Microsoft Entra ID and then connect to Azure Event Hubs directly. In this case, the `Contributor` role isn't necessary anymore, while other `Data` related roles are required for messaging operations. To make sure the security principal has been granted the sufficient permission to access the Azure resource, see [Authorize access with Microsoft Entra ID](authentication.md#authorize-access-with-azure-active-directory).

For authentication based on ARM, taking service principal as example, configuration migration is listed the follows, where the assigned role should not change:

Legacy configuration:

```yaml
spring:
  cloud:
    azure:
      client-id: ${AZURE_CLIENT_ID}
      client-secret: ${AZURE_CLIENT_SECRET}
      tenant-id: <tenant>
      resource-group: ${EVENTHUB_RESOURCE_GROUP}
      eventhub:
        namespace: ${EVENTHUB_NAMESPACE}
```

> [!NOTE]
> The values allowed for `tenant-id` are: `common`, `organizations`, `consumers`, or the tenant ID. For more information about these values, see the [Used the wrong endpoint (personal and organization accounts)](/troubleshoot/azure/active-directory/error-code-aadsts50020-user-account-identity-provider-does-not-exist#cause-3-used-the-wrong-endpoint-personal-and-organization-accounts) section of [Error AADSTS50020 - User account from identity provider does not exist in tenant](/troubleshoot/azure/active-directory/error-code-aadsts50020-user-account-identity-provider-does-not-exist). For information on converting your single-tenant app, see [Convert single-tenant app to multitenant on Microsoft Entra ID](/entra/identity-platform/howto-convert-app-to-be-multi-tenant).

Modern configuration, properties for Azure subscription ID and resource group are required:

```yaml
spring:
  cloud:
    azure:
      credential:
        client-id: ${AZURE_CLIENT_ID}
        client-secret: ${AZURE_CLIENT_SECRET}
      profile:
        tenant-id: <tenant>
        subscription-id: ${AZURE_SUBSCRIPTION_ID}
      eventhubs:
        namespace: ${EVENTHUB_NAMESPACE}
        resource:
          resource-group: ${RESOURCE_GROUP}
```

> [!NOTE]
> The values allowed for `tenant-id` are: `common`, `organizations`, `consumers`, or the tenant ID. For more information about these values, see the [Used the wrong endpoint (personal and organization accounts)](/troubleshoot/azure/active-directory/error-code-aadsts50020-user-account-identity-provider-does-not-exist#cause-3-used-the-wrong-endpoint-personal-and-organization-accounts) section of [Error AADSTS50020 - User account from identity provider does not exist in tenant](/troubleshoot/azure/active-directory/error-code-aadsts50020-user-account-identity-provider-does-not-exist). For information on converting your single-tenant app, see [Convert single-tenant app to multitenant on Microsoft Entra ID](/entra/identity-platform/howto-convert-app-to-be-multi-tenant).

You can also migrate to authenticate and authorize with Microsoft Entra ID directly without making a detour to ARM. Make sure to grant the security principal necessary `Data` roles for messaging operations. The configuration examples of the service principal and the managed identity are listed the follows:

* With a service principal

  ```yaml
  spring:
    cloud:
      azure:
        credential:
          client-id: ${AZURE_CLIENT_ID}
          client-secret: ${AZURE_CLIENT_SECRET}
        profile:
          tenant-id: <tenant>
        eventhubs:
          namespace: ${EVENTHUB_NAMESPACE}
  ```

> [!NOTE]
> The values allowed for `tenant-id` are: `common`, `organizations`, `consumers`, or the tenant ID. For more information about these values, see the [Used the wrong endpoint (personal and organization accounts)](/troubleshoot/azure/active-directory/error-code-aadsts50020-user-account-identity-provider-does-not-exist#cause-3-used-the-wrong-endpoint-personal-and-organization-accounts) section of [Error AADSTS50020 - User account from identity provider does not exist in tenant](/troubleshoot/azure/active-directory/error-code-aadsts50020-user-account-identity-provider-does-not-exist). For information on converting your single-tenant app, see [Convert single-tenant app to multitenant on Microsoft Entra ID](/entra/identity-platform/howto-convert-app-to-be-multi-tenant).

* With a managed identity

  ```yaml
  spring:
    cloud:
      azure:
        credential:
          managed-identity-enabled: true
          client-id: ${AZURE_MANAGED_IDENTITY_CLIENT_ID} # Only needed when using a user-assigned managed identity
        eventhubs:
          namespace: ${EVENTHUB_NAMESPACE}
  ```

#### API changes

The following table shows the class mappings from `azure-spring-cloud-stream-binder-eventhubs` to `spring-cloud-azure-stream-binder-eventhubs`.

> [!div class="mx-tdBreakAll"]
> | Legacy class                                              | Modern class                                                 |
> |-----------------------------------------------------------|--------------------------------------------------------------|
> |com.azure.spring.integration.core.api.reactor.Checkpointer |com.azure.spring.messaging.checkpoint.Checkpointer            |
> |com.azure.spring.integration.core.AzureHeaders             |com.azure.spring.messaging.AzureHeaders                       |
> |com.azure.spring.integration.core.EventHubHeaders          |com.azure.spring.messaging.eventhubs.support.EventHubsHeaders |

### From azure-spring-cloud-stream-binder-servicebus-* to spring-cloud-azure-stream-binder-servicebus

This guide is intended to assist in the migration to [spring-cloud-azure-stream-binder-servicebus](https://search.maven.org/artifact/com.azure.spring/spring-cloud-azure-stream-binder-servicebus) from version 2 of [azure-spring-cloud-stream-binder-servicebus-queue](https://search.maven.org/artifact/com.azure.spring/azure-spring-cloud-stream-binder-servicebus-queue) or [azure-spring-cloud-stream-binder-servicebus-topic](https://search.maven.org/artifact/com.azure.spring/azure-spring-cloud-stream-binder-servicebus-topic).

For general information, use the following links:

* For an overview of the changes in 4.0, see the [Introduction](#introduction) and [Migration benefits](#migration-benefits) sections.
* To learn more about the strategy changes in the project naming, see the [Naming changes](#naming-changes) section.
* To learn how to use one BOM for all Spring Cloud Azure libraries, see the [BOM](#bom) section.
* To learn how to handle authentication in Spring Cloud Azure 4.0, see the [Authentication changes](#authentication-changes) section.
* To learn how to leverage `spring-boot-properties-migrator` during migration, see the [Configure each SDK](#configure-each-sdk) section.
* To learn more about the global and common configuration changes, see the [Global configurations](#global-configurations) section.

#### SDK configuration changes

> [!IMPORTANT]
> Legacy binder libaries are `azure-spring-cloud-stream-binder-servicebus-queue` and `azure-spring-cloud-stream-binder-servicebus-topic`, and now they're merged into one `spring-cloud-azure-stream-binder-servicebus`.

> [!IMPORTANT]
> The binder type is combined from `servicebus-queue` and `servicebus-topic` as `servicebus`.

The following table lists the new configuration properties of `spring-cloud-azure-stream-binder-servicebus`:

> [!div class="mx-tdBreakAll"]
> | Modern properties                                                             | Description                                                                                            |
> |-------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------|
> | *spring.cloud.stream.servicebus*.bindings.binding-name.producer.entity-type | If you use the sending function, you need to set the entity-type, which you can set to topic or queue. |

The following table shows the property mappings from `azure-spring-cloud-stream-binder-servicebus-*` to `spring-cloud-azure-stream-binder-servicebus`:

> [!div class="mx-tdBreakAll"]
> | Legacy properties                                 | Modern properties                                                                                                                                                                                                                                                      |
> |---------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
> |*spring.cloud.azure*.resource-group                                                       |*spring.cloud.azure.servicebus*.resource.resource-group                                                                                                                                                                          |
> |*spring.cloud.azure.servicebus*.transport-type                                            |*spring.cloud.azure.servicebus*.client.transport-type                                                                                                                                                                            |
> |*spring.cloud.azure.servicebus*.retry-options.retry-mode                                  |*spring.cloud.azure.servicebus*.retry.mode                                                                                                                                                                                       |
> |*spring.cloud.azure.servicebus*.retry-options.max-retries                                 |*spring.cloud.azure.servicebus*.retry.exponential.max-retries or *spring.cloud.azure.servicebus*.retry.fixed.max-retries, should be configured depending on *spring.cloud.azure.servicebus*.retry.mode=*fixed* or *exponential* |
> |*spring.cloud.azure.servicebus*.retry-options.delay                                       |*spring.cloud.azure.servicebus*.retry.exponential.base-delay or *spring.cloud.azure.servicebus*.retry.fixed.delay, should be configured depending on *spring.cloud.azure.servicebus*.retry.mode=*fixed* or *exponential*        |
> |*spring.cloud.azure.servicebus*.retry-options.max-delay                                   |*spring.cloud.azure.servicebus*.retry.exponential.max-delay                                                                                                                                                                      |
> |*spring.cloud.azure.servicebus*.retry-options.try-timeout                                 |*spring.cloud.azure.servicebus*.retry.try-timeout                                                                                                                                                                                |
> | *spring.cloud.stream.servicebus*.queue.bindings.*                                        | *spring.cloud.stream.servicebus.bindings*.*                                                                                                                                                                                     |
> |*spring.cloud.stream.servicebus.queue*.bindings.binding-name.consumer.*concurrency*     |*spring.cloud.stream.servicebus*.bindings.binding-name.consumer.max-concurrent-sessions/max-concurrent-calls                                                                                                                   |
> |*spring.cloud.stream.servicebus.queue*.bindings.binding-name.consumer.*checkpoint-mode* |*spring.cloud.stream.servicebus*.bindings.binding-name.consumer.*auto-complete*                                                                                                                                                |
> | *spring.cloud.stream.servicebus*.topic.bindings.*                                        | *spring.cloud.stream.servicebus.bindings*.*                                                                                                                                                                                     |
> |*spring.cloud.stream.servicebus.topic*.bindings.binding-name.consumer.*concurrency*     |*spring.cloud.stream.servicebus*.bindings.binding-name.consumer.max-concurrent-sessions/max-concurrent-calls                                                                                                                   |
> |*spring.cloud.stream.servicebus.topic*.bindings.binding-name.consumer.*checkpoint-mode* |*spring.cloud.stream.servicebus*.bindings.binding-name.consumer.*auto-complete*                                                                                                                                                |

> [!NOTE]
> The concurrency property will be replaced by the maxConcurrentSessions when sessionsEnabled is `true` and the maxConcurrentCalls when sessionsEnabled is `false`.

> [!NOTE]
> Enabling auto-complete is equal to `RECORD` checkpoint mode, and oppositely the `MANUAL` mode.

*Configuration migration examples*

Legacy configuration, taking queue as example:

```yaml
spring:
  cloud:
    azure:
      servicebus:
        connection-string: ${AZURE_SERVICEBUS_BINDER_CONNECTION_STRING}
    stream:
      function:
        definition: consume;supply
      bindings:
        consume-in-0:
          destination: ${AZURE_SERVICEBUS_QUEUE_NAME}
        supply-out-0:
          destination: ${AZURE_SERVICEBUS_QUEUE_NAME}
      servicebus:
        queue:
          bindings:
            consume-in-0:
              consumer:
                checkpoint-mode: MANUAL
```

Modern configuration:

```yaml
spring:
  cloud:
    azure:
      servicebus:
        connection-string: ${AZURE_SERVICEBUS_BINDER_CONNECTION_STRING}
    stream:
      function:
        definition: consume;supply
      bindings:
        consume-in-0:
          destination: ${AZURE_SERVICEBUS_QUEUE_NAME}
        supply-out-0:
          destination: ${AZURE_SERVICEBUS_QUEUE_NAME}
      servicebus:
        bindings:
          consume-in-0:
            consumer:
              auto-complete: false
          supply-out-0:
            producer:
              entity-type: queue #set as topic if needed
```

If you use security principals instead of connection strings, in versions before 4.0 the application will firstly connect to Azure Resource Manager (ARM) with the provided security principal, and then retrieve the connection string of the specified namespace with ARM. In the end the application uses the retrieved connection string to connect to Azure Service Bus. In this way the provided security principal should be granted with the [Contributor](/azure/role-based-access-control/built-in-roles#contributor) role to retrieve of the associated Azure Service Bus namespace.

For Azure Spring Apps 4.0, we provide two ways of leveraging security principals for authentication. One is still using the principals to connect to ARM and retrieve the connection strings where the `Contributor` role is required for the principals. The other leverages security principals to authenticate to Microsoft Entra ID and then connect to the Azure Service Bus directly. In this case, the `Contributor` role isn't necessary anymore, while other `Data` related roles are required for messaging operations. To make sure the security principal has been granted the sufficient permission to access the Azure resource, see [Authorize access with Microsoft Entra ID](authentication.md#authorize-access-with-azure-active-directory).

For authentication based on ARM, taking service principal as example, configuration migration is listed the follows, where the assigned role should not change:

Legacy configuration:

```yaml
spring:
  cloud:
    azure:
      client-id: ${AZURE_CLIENT_ID}
      client-secret: ${AZURE_CLIENT_SECRET}
      tenant-id: <tenant>
      resource-group: ${SERVICEBUS_RESOURCE_GROUP}
      servicebus:
        namespace: ${SERVICEBUS_NAMESPACE}
```

> [!NOTE]
> The values allowed for `tenant-id` are: `common`, `organizations`, `consumers`, or the tenant ID. For more information about these values, see the [Used the wrong endpoint (personal and organization accounts)](/troubleshoot/azure/active-directory/error-code-aadsts50020-user-account-identity-provider-does-not-exist#cause-3-used-the-wrong-endpoint-personal-and-organization-accounts) section of [Error AADSTS50020 - User account from identity provider does not exist in tenant](/troubleshoot/azure/active-directory/error-code-aadsts50020-user-account-identity-provider-does-not-exist). For information on converting your single-tenant app, see [Convert single-tenant app to multitenant on Microsoft Entra ID](/entra/identity-platform/howto-convert-app-to-be-multi-tenant).

Modern configuration, properties for Azure subscription ID and resource group are required:

```yaml
spring:
  cloud:
    azure:
      credential:
        client-id: ${AZURE_CLIENT_ID}
        client-secret: ${AZURE_CLIENT_SECRET}
      profile:
        tenant-id: <tenant>
        subscription-id: ${AZURE_SUBSCRIPTION_ID}
      servicebus:
        namespace: ${SERVICEBUS_NAMESPACE}
        resource:
          resource-group: ${SERVICEBUS_RESOURCE_GROUP}
```

> [!NOTE]
> The values allowed for `tenant-id` are: `common`, `organizations`, `consumers`, or the tenant ID. For more information about these values, see the [Used the wrong endpoint (personal and organization accounts)](/troubleshoot/azure/active-directory/error-code-aadsts50020-user-account-identity-provider-does-not-exist#cause-3-used-the-wrong-endpoint-personal-and-organization-accounts) section of [Error AADSTS50020 - User account from identity provider does not exist in tenant](/troubleshoot/azure/active-directory/error-code-aadsts50020-user-account-identity-provider-does-not-exist). For information on converting your single-tenant app, see [Convert single-tenant app to multitenant on Microsoft Entra ID](/entra/identity-platform/howto-convert-app-to-be-multi-tenant).

You can also migrate to authenticate and authorize with Microsoft Entra ID directly without making a detour to ARM. Make sure to grant the security principal necessary `Data` roles for messaging operations. The configuration examples of the service principal and the managed identity are listed the follows:

* With a service principal

  ```yaml
  spring:
    cloud:
      azure:
        credential:
          client-id: ${AZURE_CLIENT_ID}
          client-secret: ${AZURE_CLIENT_SECRET}
        profile:
          tenant-id: <tenant>
        servicebus:
          namespace: ${SERVICEBUS_NAMESPACE}
  ```

> [!NOTE]
> The values allowed for `tenant-id` are: `common`, `organizations`, `consumers`, or the tenant ID. For more information about these values, see the [Used the wrong endpoint (personal and organization accounts)](/troubleshoot/azure/active-directory/error-code-aadsts50020-user-account-identity-provider-does-not-exist#cause-3-used-the-wrong-endpoint-personal-and-organization-accounts) section of [Error AADSTS50020 - User account from identity provider does not exist in tenant](/troubleshoot/azure/active-directory/error-code-aadsts50020-user-account-identity-provider-does-not-exist). For information on converting your single-tenant app, see [Convert single-tenant app to multitenant on Microsoft Entra ID](/entra/identity-platform/howto-convert-app-to-be-multi-tenant).

* With a managed identity

  ```yaml
  spring:
    cloud:
      azure:
        credential:
          managed-identity-enabled: true
          client-id: ${AZURE_MANAGED_IDENTITY_CLIENT_ID} # Only needed when using a user-assigned   managed identity
        servicebus:
          namespace: ${SERVICEBUS_NAMESPACE}
  ```

#### API changes

* Drop message header `AzureHeaders.RAW_ID`. Use `ServiceBusMessageHeaders.MESSAGE_ID` instead.

The following table shows the class mappings from `azure-spring-cloud-stream-binder-eventhubs` to `spring-cloud-azure-stream-binder-eventhubs`.

> [!div class="mx-tdBreakAll"]
> | Legacy class                                                              | Modern class                                                          |
> |---------------------------------------------------------------------------|-----------------------------------------------------------------------|
> |com.azure.spring.integration.core.AzureHeaders                             |com.azure.spring.messaging.AzureHeaders                                |
> |com.azure.spring.integration.servicebus.converter.ServiceBusMessageHeaders |com.azure.spring.messaging.servicebus.support.ServiceBusMessageHeaders |
> |com.azure.spring.integration.core.api.Checkpointer                         |com.azure.spring.messaging.checkpoint.Checkpointer                     |

### azure-spring-cloud-messaging

The `com.azure.spring:azure-spring-cloud-messaging` library isn't ready for 4.0. The function of listener annotations is under redesign, so the `@AzureMessageListener`, `@AzureMessageListeners`, and `@EnableAzureMessaging` annotations aren't currently supported.
