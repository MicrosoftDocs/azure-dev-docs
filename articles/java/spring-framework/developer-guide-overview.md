---
title: Spring Cloud Azure overview
description: This reference doc contains Spring Cloud Azure overview.
ms.date: 04/06/2023
author: KarlErickson
ms.author: v-yeyonghui
ms.topic: reference
ms.custom: devx-track-java, devx-track-extended-java
---

# Spring Cloud Azure developer guide

**This article applies to:** ✔️ Version 4.8.0 ✔️ Version 5.1.0

Spring is an open-source application framework developed by VMware that provides a simplified, modular approach for creating Java applications. Spring Cloud Azure is an open-source project that provides seamless Spring integration with Azure.

For more information about supported versions, see [Spring Versions Mapping](https://github.com/Azure/azure-sdk-for-java/wiki/Spring-Versions-Mapping).

## Get help

If you have any questions about this documentation, create a GitHub issue in one of the following GitHub repositories. Pull requests are also welcome.

| GitHub repositories                                                                          | Description                              |
|----------------------------------------------------------------------------------------------|------------------------------------------|
| [Azure/azure-sdk-for-java](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/spring) | This repository holds the source code.   |
| [MicrosoftDocs/azure-dev-docs](https://github.com/MicrosoftDocs/azure-dev-docs)              | This repository holds the documentation. |

## What's new in 4.0 since 3.10.x

This documentation covers changes made in 4.0 since 3.10. This major release brings better security, leaner dependencies, support for production readiness, and more.

> [!TIP]
> For more information on migrating to 4.0, see [Migration guide for 4.0](migration-guide-for-4.0.md).

The following list summarizes some of the changes that Spring Cloud Azure 4.0 provides:

* A unified development experience, with unified project name, artifact ID, and properties.
* Simplified dependency management using a single `spring-cloud-azure-dependencies` BOM.
* Expanded Azure support on [Spring Initializr](https://start.spring.io) to cover Kafka, Event Hubs, Azure Cache for Redis, and Azure App Configuration.
* Rearchitected Spring module dependencies to remove excess layers and entanglement.
* Managed Identity support for Azure App Configuration, Event Hubs, Service Bus, Azure Cosmos DB, Key Vault, Storage Blob, and Storage Queue.
* Continued support for authentication methods in the underlying Azure SDK from our Spring libraries, such as SAS token and token credential authentication with Service Bus and Event Hubs.
* Credential chain is now enabled by default, enabling applications to obtain credentials from application properties, environment variables, managed identity, IDEs, and so on. For more information, see the [DefaultAzureCredential](/java/api/overview/azure/identity-readme#defaultazurecredential) section of [Azure Identity client library for Java](/java/api/overview/azure/identity-readme).
* Granular access control at the resource level (such as Service Bus queue) to enable better security governance and adherence to IT policies.
* More options exposed in a Spring-idiomatic way through significantly improved auto-configuration coverage of Azure SDK clients for both synchronous and asynchronous scenarios.
* Added health indicators for Azure App Configuration, Event Hubs, Azure Cosmos DB, Key Vault, Storage Blob, Storage Queue, and Storage File.
* Spring Cloud Sleuth support for all HTTP-based Azure SDKs.

## Migration guide for 4.0

For more information on migrating to 4.0, see [Migration guide for 4.0](migration-guide-for-4.0.md).

## Getting started

### Setting up dependencies

#### Bill of materials (BOM)

```xml
<dependencyManagement>
  <dependencies>
    <dependency>
      <groupId>com.azure.spring</groupId>
      <artifactId>spring-cloud-azure-dependencies</artifactId>
      <version>4.8.0</version>
      <type>pom</type>
      <scope>import</scope>
    </dependency>
  </dependencies>
</dependencyManagement>
```

> [!NOTE]
> If you're using Spring Boot 3.x, be sure to set the `spring-cloud-azure-dependencies` version to `5.1.0`.
> For more information about the `spring-cloud-azure-dependencies` version, see [Which Version of Spring Cloud Azure Should I Use](https://github.com/Azure/azure-sdk-for-java/wiki/Spring-Versions-Mapping#which-version-of-spring-cloud-azure-should-i-use).

#### Starter dependencies

Spring Cloud Azure Starters are a set of convenient dependency descriptors to include in your application. Each starter contains all the dependencies and transitive dependencies needed to begin using their corresponding Spring Cloud Azure module. These starters boost your Spring Boot application development with Azure services.

For example, if you want to get started using Spring and Azure Cosmos DB for data persistence, include the `spring-cloud-azure-starter-cosmos` dependency in your project.

The following table lists application starters provided by Spring Cloud Azure under the `com.azure.spring` group:

> [!div class="mx-tdBreakAll"]
> | Name                                             | Description                                                                             |
> |--------------------------------------------------|-----------------------------------------------------------------------------------------|
> | spring-cloud-azure-starter                       | The core starter, including auto-configuration support.                                 |
> | spring-cloud-azure-starter-active-directory      | The starter for using Azure Active Directory with Spring Security.                      |
> | spring-cloud-azure-starter-active-directory-b2c  | The starter for using Azure Active Directory B2C with Spring Security.                  |
> | spring-cloud-azure-starter-appconfiguration      | The starter for using Azure App Configuration.                                          |
> | spring-cloud-azure-starter-cosmos                | The starter for using Azure Cosmos DB.                                                  |
> | spring-cloud-azure-starter-eventhubs             | The starter for using Azure Event Hubs.                                                 |
> | spring-cloud-azure-starter-keyvault              | The Starter for using Azure Key Vault.                                                  |
> | spring-cloud-azure-starter-keyvault-secrets      | The starter for using Azure Key Vault Secrets.                                          |
> | spring-cloud-azure-starter-keyvault-certificates | The starter for using Azure Key Vault Certificates.                                     |
> | spring-cloud-azure-starter-servicebus            | The starter for using Azure Service Bus.                                                |
> | spring-cloud-azure-starter-servicebus-jms        | The starter for using Azure Service Bus and JMS.                                        |
> | spring-cloud-azure-starter-storage               | The starter for using Azure Storage.                                                    |
> | spring-cloud-azure-starter-storage-blob          | The starter for using Azure Storage Blob.                                               |
> | spring-cloud-azure-starter-storage-file-share    | The starter for using Azure Storage File Share.                                         |
> | spring-cloud-azure-starter-storage-queue         | The starter for using Azure Storage Queue.                                              |
> | spring-cloud-azure-starter-actuator              | The starter for using Spring Boot’s Actuator, which provides production ready features. |

The following table lists starters for Spring Data support:

> [!div class="mx-tdBreakAll"]
> | Name                                   | Description                                                      |
> |----------------------------------------|------------------------------------------------------------------|
> | spring-cloud-azure-starter-data-cosmos | The starter for using Spring Data for Azure Cosmos DB. |

The following table lists starters for Spring Integration support:

> [!div class="mx-tdBreakAll"]
> | Name                                                 | Description                                                       |
> |------------------------------------------------------|-------------------------------------------------------------------|
> | spring-cloud-azure-starter-integration-eventhubs     | The starter for using Azure Event Hubs and Spring Integration.    |
> | spring-cloud-azure-starter-integration-servicebus    | The starter for using Azure Service Bus and Spring Integration.   |
> | spring-cloud-azure-starter-integration-storage-queue | The starter for using Azure Storage Queue and Spring Integration. |

The following table lists starters for Spring Cloud Stream support:

> [!div class="mx-tdBreakAll"]
> | Name                                         | Description                                                             |
> |----------------------------------------------|-------------------------------------------------------------------------|
> | spring-cloud-azure-starter-stream-eventhubs  | The starters for using Azure Event Hubs and Spring Cloud Stream Binder. |
> | spring-cloud-azure-starter-stream-servicebus | The starter for using Azure Service Bus and Spring Cloud Stream Binder. |

The following table lists starters for MySQL support:

> [!div class="mx-tdBreakAll"]
> | Name                                         | Description                                                                   |
> |----------------------------------------------|-------------------------------------------------------------------------------|
> | spring-cloud-azure-starter-jdbc-mysql        | The starters for using Azure MySQLs and JDBC through Azure AD authentication. |

The following table lists starters for PostgreSQL support:

> [!div class="mx-tdBreakAll"]
> | Name                                         | Description                                                                       |
> |----------------------------------------------|-----------------------------------------------------------------------------------|
> | spring-cloud-azure-starter-jdbc-postgresql   | The starters for using Azure PostgreSQL and JDBC through Azure AD authentication. |

### Learning Spring Cloud Azure

We've prepared a full list of samples to show usage. You can find these samples at [Spring Cloud Azure Samples](https://github.com/Azure-Samples/azure-spring-boot-samples/tree/main).
