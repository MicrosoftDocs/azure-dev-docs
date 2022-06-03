---
ms.date: 05/27/2022
author: KarlErickson
ms.author: v-yonghuiye
---

## Spring Cloud Azure configuration

Most of Azure Service SDKs can be divided into two categories by transport type: HTTP-based or AMQP-based. There are properties that are common to all SDKs, such as authentication principals and Azure environment settings, or common to HTTP-based clients, such as logging level to log HTTP requests and responses. In Spring Cloud Azure 4.0, we added five common categories of configuration properties that you can specify for each Azure service.

The following table lists properties common to multiple services:

> [!div class="mx-tdBreakAll"]
> | Property                                      | Description                                                                      |
> |-----------------------------------------------|----------------------------------------------------------------------------------|
> | *spring.cloud.azure.azure-service*.client     | Configures the transport clients underneath one Azure service SDK.               |
> | *spring.cloud.azure.azure-service*.credential | Configures authentication with Azure Active Directory for one Azure service SDK. |
> | *spring.cloud.azure.azure-service*.profile    | Configures the Azure cloud environment for one Azure service SDK.                |
> | *spring.cloud.azure.azure-service*.proxy      | Configures the proxy options for one Azure service SDK.                          |
> | *spring.cloud.azure.azure-service*.retry      | Configures the retry options applicable to one Azure service SDK. The retry options has supported part of the SDKs, there’s no spring.cloud.azure.cosmos.retry.                                                                     |

There are some properties that you can share among different Azure services, for example to use the same service principal to access Azure Cosmos DB and Azure Event Hubs. Spring Cloud Azure 4.0 enables you to define properties that apply to all Azure SDKs in the namespace `spring.cloud.azure`.

The following table lists global properties:

> [!div class="mx-tdBreakAll"]
> | Property                        | Description                                                                          |
> |---------------------------------|--------------------------------------------------------------------------------------|
> | *spring.cloud.azure*.client     | Configures the transport clients; applies to all Azure SDKs by default.              |
> | *spring.cloud.azure*.credential | Configures authentication with Azure Active Directory for all Azure SDKs by default. |
> | *spring.cloud.azure*.profile    | Configures the Azure cloud environment for all Azure SDKs by default.                |
> | *spring.cloud.azure*.proxy      | Configures the proxy options applicable to all Azure SDK clients by default.         |
> | *spring.cloud.azure*.retry      | Configures the retry options applicable to all Azure SDK clients by default.         |

> [!NOTE]
> Properties configured under each Azure service will override the global configurations.

The configuration properties' prefixes have been unified to the `spring.cloud.azure` namespace since Spring Cloud Azure 4.0 to make configuration properties more consistent and more intuitive. The following table provides a quick review of the prefixes for supported Azure services:

| Azure service               | Configuration property prefix             | Configuration Properties Link                                                                                |
|-----------------------------|-------------------------------------------|--------------------------------------------------------------------------------------------------------------|
| Azure App Configuration     | *spring.cloud.azure*.appconfiguration     | [App Configuration Properties](../../spring-cloud-azure-appendix.md#azure-app-configuration-properties)           |
| Azure Cosmos DB             | *spring.cloud.azure*.cosmos               | [Cosmos DB Properties](../../spring-cloud-azure-appendix.md#azure-cosmos-db-properties)                                 |
| Azure Event Hubs            | *spring.cloud.azure*.eventhubs            | [Event Hubs Properties](../../spring-cloud-azure-appendix.md#azure-event-hubs-properties)                         |
| Azure Key Vault Certificate | *spring.cloud.azure*.keyvault.certificate | [Key Vault Certificates Properties](../../spring-cloud-azure-appendix.md#azure-key-vault-certificates-properties) |
| Azure Key Vault Secret      | *spring.cloud.azure*.keyvault.secret      | [Key Vault Secrets Properties](../../spring-cloud-azure-appendix.md#azure-key-vault-secrets-properties)           |
| Azure Service Bus           | *spring.cloud.azure*.servicebus           | [Service Bus Properties](../../spring-cloud-azure-appendix.md#azure-service-bus-properties)                       |
| Azure Storage Blob          | *spring.cloud.azure*.storage.blob         | [Storage Blob Properties](../../spring-cloud-azure-appendix.md#azure-storage-blob-properties)                     |
| Azure Storage File Share    | *spring.cloud.azure*.storage.fileshare    | [Storage File Share Properties](../../spring-cloud-azure-appendix.md#azure-storage-file-share-properties)         |
| Azure Storage Queue         | *spring.cloud.azure*.storage.queue        | [Storage Queue Properties](../../spring-cloud-azure-appendix.md#azure-storage-queue-properties)                   |
