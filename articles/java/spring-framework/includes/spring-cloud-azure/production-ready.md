---
ms.date: 04-26-2022
ms.author: v-yonghuiye
---

## Production ready

We’ve added health indicators for App Configuration, Event Hubs, Cosmos DB, Key Vault, Storage Blob, Storage Queue, and Storage File, as well as Spring Cloud Sleuth support for all HTTP-based Azure SDKs. As an example, you now can probe to determine whether a storage blob is up or down via Spring Boot actuator endpoint, as well as track dependencies and latencies going from your application to Key Vault.

### Enable health indicator

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
| Cosmos DB             | *management.health.azure*-cosmos.enabled               |
| Event Hubs            | *management.health.azure*-eventhubs.enabled            |
| Key Vault Certificate | *management.health.azure*-keyvault-certificate.enabled |
| Key Vault Secret      | *management.health.azure*-keyvault-secret.enabled      |
| Storage Blob          | *management.health.azure*-storage-blob.enabled         |
| Storage File Share    | *management.health.azure*-storage-fileshare.enabled    |
| Storage Queue         | *management.health.azure*-storage-queue.enabled        |

> [!IMPORTANT]
> Calling the health endpoint of Azure services may cause extra charges. For example, if you call `http://HOST_NAME:{port}/actuator/health/cosmos` to get the Cosmos DB health info, it will calculate Request Units (RUs). For more information, see [Request Units in Azure Cosmos DB](/azure/cosmos-db/request-units).

### Enable sleuth

When you want to trace Azure SDK activities by using Spring Cloud Sleuth, add the following Spring Cloud Azure Trace Sleuth dependency to your *pom.xml* file:

```xml
<dependency>
    <groupId>com.azure.spring</groupId>
    <artifactId>spring-cloud-azure-trace-sleuth</artifactId>
</dependency>
```

> [!NOTE]
> Only HTTP-based Azure SDK clients are currently supported. For example, Event Hubs and Service Bus with AMQP transport are currently not supported. For these requirements, we recommend that you use [Azure Application Insight](/azure/azure-monitor/app/app-insights-overview).
