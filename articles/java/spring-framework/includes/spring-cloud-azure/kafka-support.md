---
ms.date: 05/27/2022
ms.author: v-yonghuiye
---

## Kafka support

Connect to Azure Event Hubs ([Basic pricing tier isn't supported](https://azure.microsoft.com/pricing/details/event-hubs/#explore-pricing-options)) using Spring Kafka libraries. There are two approaches to connect to Azure Event Hubs for Kafka, the first one is to provide the Azure Event Hubs connection string directly, the other is to use Azure Resource Manager to retrieve the connection string.

### Dependency setup

Add the following dependencies if you want to migrate your Apache Kafka application to use Azure Event Hubs for Kafka.

``` xml
<dependency>
  <groupId>com.azure.spring</groupId>
  <artifactId>spring-cloud-azure-starter</artifactId>
</dependency>
```

If you want to retrieve the connection string using Azure Resource Manager, add the following dependency:

``` xml
<dependency>
  <groupId>com.azure.spring</groupId>
  <artifactId>spring-cloud-azure-resourcemanager</artifactId>
</dependency>
```

### Configuration

> [!NOTE]
> If you choose to use a security principal to authenticate and authorize with Azure Active Directory for accessing an Azure resource, refer to [Authorize access with Azure AD](#authorize-access-with-azure-active-directory) to make sure the security principal has been granted the sufficient permission to access the Azure resource.

Configurable properties when using Kafka support:

> [!div class="mx-tdBreakAll"]
> | Property                                                 | Description                                                                                                                                           |
> |----------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------|
> | **spring.cloud.azure.eventhubs**.kafka.enabled           | Whether to enable the Azure Event Hubs Kafka support, default to true.                                                                                |
> | **spring.cloud.azure.eventhubs**.connection-string       | Azure Event Hubs connection string. Should be provided when want to provide the connection string directly.                                           |
> | **spring.cloud.azure.eventhubs**.namespace               | Azure Event Hubs namespace. Should be provided when want to retrieve the connection information through Azure Resource Manager.                       |
> | **spring.cloud.azure.eventhubs**.resource.resource-group | The resource group of Azure Event Hubs namespace. Should be provided when want to retrieve the connection information through Azure Resource Manager. |
> | **spring.cloud.azure**.profile.subscription-id           | The subscription ID. Should be provided when want to retrieve the connection information through Azure Resource Manager.                              |

> [!NOTE]
> Authentication information is also required for authenticating for Azure Resource Manager. The credential related configurations of Resource Manager should be configured under prefix `spring.cloud.azure`. For more information, see the [Authentication](#spring-cloud-azure-authentication) section.

### Basic usage

#### Use Event Hubs connection string

The simplest way to connect to Event Hubs for Kafka is with the connection string.

Add the following properties and you're good to go.

``` yaml
spring:
  cloud:
    azure:
      eventhubs:
        connection-string: ${AZURE_EVENTHUBS_CONNECTION_STRING}
```

#### Use Azure Resource Manager to retrieve connection string

If you don't want to configure connection string in your application, it's also possible to use Azure Resource Manager to retrieve the connection string. And you could use credentials stored in Azure CLI or other local development tool, like Visual Studio Code or Intellij IDEA to authenticate with Azure Resource Manager. Or Managed Identity if your application is deployed to Azure Cloud. Just make sure the principal have sufficient permission to read resource metadata.

Add the following properties and you're good to go.

``` yaml
spring:
  cloud:
    azure:
      profile:
        subscription-id: ${AZURE_SUBSCRIPTION_ID}
      eventhubs:
        namespace: ${AZURE_EVENTHUBS_NAMESPACE}
        resource:
          resource-group: ${AZURE_EVENTHUBS_RESOURCE_GROUP}
```

### Samples

See [azure-spring-boot-samples](https://github.com/Azure-Samples/azure-spring-boot-samples/tree/spring-cloud-azure_4.2.0) for more details.
