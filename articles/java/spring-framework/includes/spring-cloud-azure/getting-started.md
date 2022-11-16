---
ms.date: 11/01/2022
author: KarlErickson
ms.author: v-yonghuiye
---

## Getting started

### Setting up dependencies

#### Bill of material (BOM)

```xml
<dependencyManagement>
  <dependencies>
    <dependency>
      <groupId>com.azure.spring</groupId>
      <artifactId>spring-cloud-azure-dependencies</artifactId>
      <version>${spring.cloud.azure.version}</version>
      <type>pom</type>
      <scope>import</scope>
    </dependency>
  </dependencies>
</dependencyManagement>
```

The version for spring-cloud-azure-dependencies is 4.4.1.

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

We've prepared a full list of samples to show usage. You can find these samples at [Spring Cloud Azure Samples](https://github.com/Azure-Samples/azure-spring-boot-samples/tree/spring-cloud-azure_4.4.1).
