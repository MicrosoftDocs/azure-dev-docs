---
ms.date: 06/30/2022
author: KarlErickson
ms.author: v-yonghuiye
---

## What's new in 4.0 since 3.10.x

This documentation covers changes made in 4.0 since 3.10. This major release brings better security, leaner dependencies, support for production readiness, and more.

> [!TIP]
> For more information on migrating to 4.0, see [Migration guide for 4.0](../../spring-cloud-azure-appendix.md#migration-guide-for-40).

The following list summarizes some of the changes that Spring Cloud Azure 4.0 provides:

* A unified development experience, with unified project name, artifact ID, and properties.
* Simplified dependency management using a single `spring-cloud-azure-dependencies` BOM.
* Expanded Azure support on [Spring Initializr](https://start.spring.io) to cover Kafka, Event Hubs, Azure Cache for Redis, and Azure App Configuration.
* Rearchitected Spring module dependencies to remove excess layers and entanglement.
* Managed Identity support for Azure App Configuration, Event Hubs, Service Bus, Cosmos DB, Key Vault, Storage Blob, and Storage Queue.
* Continued support for authentication methods in the underlying Azure SDK from our Spring libraries, such as SAS token and token credential authentication with Service Bus and Event Hubs.
* [Credential chain](/java/api/overview/azure/identity-readme?view=azure-java-stable&preserve-view=true#defaultazurecredential) is now enabled by default, enabling applications to obtain credentials from application properties, environment variables, managed identity, IDEs, and so on.
* Granular access control at the resource level (such as Service Bus queue) to enable better security governance and adherence to IT policies.
* More options exposed in a Spring-idiomatic way through significantly improved auto-configuration coverage of Azure SDK clients for both synchronous and asynchronous scenarios.
* Added health indicators for Azure App Configuration, Event Hubs, Cosmos DB, Key Vault, Storage Blob, Storage Queue, and Storage File.
* Spring Cloud Sleuth support for all HTTP-based Azure SDKs.
