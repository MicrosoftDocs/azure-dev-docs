---
title: Spring Cloud Azure configuration
description: This reference doc contains all Spring Cloud Azure common configuration.
ms.date: 04/06/2023
author: KarlErickson
ms.author: hangwan
ms.topic: reference
ms.custom: devx-track-java, devx-track-extended-java
---

# Spring Cloud Azure configuration

**This article applies to:** ✔️ Version 4.19.0 ✔️ Version 5.16.0

This article describes all the Spring Cloud Azure common configuration properties.

## Configuration for each Azure Service SDK

Most of Azure Service SDKs can be divided into two categories by transport type: HTTP-based or AMQP-based. There are properties that are common to all SDKs, such as authentication principals and Azure environment settings, or common to HTTP-based clients, such as logging level to log HTTP requests and responses. In Spring Cloud Azure 4.0, we added five common categories of configuration properties that you can specify for each Azure service.

The following table lists properties common to multiple services:

> [!div class="mx-tdBreakAll"]
> | Property                                      | Description                                                                      |
> |-----------------------------------------------|----------------------------------------------------------------------------------|
> | *spring.cloud.azure.azure-service*.client     | Configures the transport clients underneath one Azure service SDK.               |
> | *spring.cloud.azure.azure-service*.credential | Configures authentication with Microsoft Entra ID for one Azure service SDK. |
> | *spring.cloud.azure.azure-service*.profile    | Configures the Azure cloud environment for one Azure service SDK.                |
> | *spring.cloud.azure.azure-service*.proxy      | Configures the proxy options for one Azure service SDK.                          |
> | *spring.cloud.azure.azure-service*.retry      | Configures the retry options applicable to one Azure service SDK. The retry options has supported part of the SDKs, there’s no spring.cloud.azure.cosmos.retry.                                                                     |

The configuration properties' prefixes have been unified to the `spring.cloud.azure` namespace since Spring Cloud Azure 4.0 to make configuration properties more consistent and more intuitive. The following table provides a quick review of the prefixes for supported Azure services:

| Azure service               | Configuration property prefix             | Configuration properties link                                                                                          |
|-----------------------------|-------------------------------------------|------------------------------------------------------------------------------------------------------------------------|
| Azure App Configuration     | *spring.cloud.azure*.appconfiguration     | [App Configuration configuration properties](configuration-properties-azure-app-configuration.md)                |
| Azure Cosmos DB             | *spring.cloud.azure*.cosmos               | [Azure Cosmos DB configuration properties](configuration-properties-azure-cosmos-db.md)                          |
| Azure Event Hubs            | *spring.cloud.azure*.eventhubs            | [Event Hubs configuration properties](configuration-properties-azure-event-hubs.md) |
| Azure Key Vault Certificate | *spring.cloud.azure*.keyvault.certificate | [Key Vault Certificates configuration properties](configuration-properties-azure-key-vault-certificates.md)      |
| Azure Key Vault Secret      | *spring.cloud.azure*.keyvault.secret      | [Key Vault Secrets configuration properties](configuration-properties-azure-key-vault-secrets.md)                |
| Azure Service Bus           | *spring.cloud.azure*.servicebus           | [Service Bus configuration properties](configuration-properties-azure-service-bus.md)                            |
| Azure Storage Blob          | *spring.cloud.azure*.storage.blob         | [Storage Blob configuration properties](configuration-properties-azure-storage-blob.md)                          |
| Azure Storage File Share    | *spring.cloud.azure*.storage.fileshare    | [Storage File Share configuration properties](configuration-properties-azure-storage-file-share.md)              |
| Azure Storage Queue         | *spring.cloud.azure*.storage.queue        | [Storage Queue configuration properties](configuration-properties-azure-storage-queue.md)                        |

## Global configuration for Azure Service SDKs

There are some properties that you can share among different Azure services, for example to use the same service principal to access Azure Cosmos DB and Azure Event Hubs. Spring Cloud Azure 4.0 enables you to define properties that apply to all Azure SDKs in the namespace `spring.cloud.azure`.

The following table lists global properties:

> [!div class="mx-tdBreakAll"]
> | Property                        | Description                                                                          |
> |---------------------------------|--------------------------------------------------------------------------------------|
> | *spring.cloud.azure*.client     | Configures the transport clients; applies to all Azure SDKs by default.              |
> | *spring.cloud.azure*.credential | Configures authentication with Microsoft Entra ID for all Azure SDKs by default. |
> | *spring.cloud.azure*.profile    | Configures the Azure cloud environment for all Azure SDKs by default.                |
> | *spring.cloud.azure*.proxy      | Configures the proxy options applicable to all Azure SDK clients by default.         |
> | *spring.cloud.azure*.retry      | Configures the retry options applicable to all Azure SDK clients by default.         |

> [!NOTE]
> Properties configured under each Azure service will override the global configurations.

## Configuration examples

### Global retry configuration for Azure Service SDKs

The following example shows you how to configure the retry behavior for any HTTP or AMQP protocol based Azure SDK client:

```yaml
spring.cloud.azure:
  retry:
    mode: exponential
    exponential:
      max-retries: 4
      base-delay: PT0.0801S
      max-delay: PT9S
```

### Retry configuration for Key Vault property source

The following configuration example shows you how to configure the retry behavior for the Azure Key Vault Secret client:

```yaml
spring.cloud.azure:
  keyvault:
    secret:
      property-source-enabled: true
      property-sources:
        - endpoint: <your-Azure-Key-Vault-endpoint>
          retry:
            mode: exponential
            exponential:
              max-retries: 4
              base-delay: PT0.0801S
              max-delay: PT9S
```
