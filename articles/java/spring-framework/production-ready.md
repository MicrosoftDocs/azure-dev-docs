---
title: Spring Cloud Azure Production ready
description: This article describes Spring Cloud Azure Production ready.
ms.date: 04/06/2023
author: KarlErickson
ms.author: hangwan
ms.topic: reference
ms.custom: devx-track-java, devx-track-extended-java
---

# Production ready

**This article applies to:** ✔️ Version 4.19.0

We’ve added health indicators for App Configuration, Event Hubs, Azure Cosmos DB, Key Vault, Storage Blob, Storage Queue, and Storage File, as well as Spring Cloud Sleuth support for all HTTP-based Azure SDKs. As an example, you now can probe to determine whether a storage blob is up or down via Spring Boot actuator endpoint, as well as track dependencies and latencies going from your application to Key Vault.

## Enable health indicator

To enable the health indicators, add the Spring Cloud Azure Actuator Starter dependency to your *pom.xml* file. This dependency will also include the `spring-boot-starter-actuator`.

```xml
<dependency>
    <groupId>com.azure.spring</groupId>
    <artifactId>spring-cloud-azure-starter-actuator</artifactId>
</dependency>
```

The following table lists configurable properties to enable or disable health indicators for each Azure service:

| Azure Service         | Property                                               |
|-----------------------|--------------------------------------------------------|
| App Configuration     | *management.health.azure*-appconfiguration.enabled     |
| Azure Cosmos DB             | *management.health.azure*-cosmos.enabled               |
| Event Hubs            | *management.health.azure*-eventhubs.enabled            |
| Key Vault Certificate | *management.health.azure*-keyvault-certificate.enabled |
| Key Vault Secret      | *management.health.azure*-keyvault-secret.enabled      |
| Storage Blob          | *management.health.azure*-storage-blob.enabled         |
| Storage File Share    | *management.health.azure*-storage-fileshare.enabled    |
| Storage Queue         | *management.health.azure*-storage-queue.enabled        |

> [!IMPORTANT]
> Calling the health endpoint of Azure services may cause extra charges. For example, if you call `http://HOST_NAME:{port}/actuator/health/cosmos` to get Azure Cosmos DB health info, it will calculate Request Units (RUs). For more information, see [Request Units in Azure Cosmos DB](/azure/cosmos-db/request-units).

> [!NOTE]
> For calling the health endpoint of `Cosmos`, the option `spring.cloud.azure.cosmos.database` should be configured; Otherwise, the health status of `unknown` will be returned.
>
> For calling the health endpoint of `Storage Queue`, role of `Storage Account Contributor` is required if `Azure AD` is used for authorizing.

## Enable sleuth

When you want to trace Azure SDK activities by using Spring Cloud Sleuth, add the following Spring Cloud Azure Trace Sleuth dependency to your *pom.xml* file:

```xml
<dependency>
    <groupId>com.azure.spring</groupId>
    <artifactId>spring-cloud-azure-trace-sleuth</artifactId>
</dependency>
```

> [!NOTE]
> Only HTTP-based Azure SDK clients are currently supported. For example, Event Hubs and Service Bus with AMQP transport are currently not supported. For these requirements, we recommend that you use [Azure Application Insight](/azure/azure-monitor/app/app-insights-overview).
