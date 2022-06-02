---
ms.date: 05/27/2022
ms.author: v-yonghuiye
---

## Redis support

Connect to Azure Cache for Redis using Spring Redis libraries. With adding `spring-cloud-azure-starter` and `spring-cloud-azure-resourcemanager` to your application, it's possible to read the Azure Cache for Redis connection information through Azure Resource Manager and auto-configure the Redis properties.

### Dependency setup

Add the following dependencies if you want to use the Spring Cloud Azure Redis support to your Spring Boot application using Redis.

``` xml
<dependencies>
    <dependency>
      <groupId>com.azure.spring</groupId>
      <artifactId>spring-cloud-azure-starter</artifactId>
    </dependency>
    <dependency>
      <groupId>com.azure.spring</groupId>
      <artifactId>spring-cloud-azure-resourcemanager</artifactId>
    </dependency>
</dependencies>
```

### Configuration

> [!NOTE]
> If you choose to use a security principal to authenticate and authorize with Azure Active Directory for accessing an Azure resource, refer to [Authorize access with Azure AD](#authorize-access-with-azure-active-directory) to make sure the security principal has been granted the sufficient permission to access the Azure resource.

Configurable properties when using Redis support:

> [!div class="mx-tdBreakAll"]
> | Property                                             | Description                                  | Default Value | Required |
> |------------------------------------------------------|----------------------------------------------|---------------|----------|
> | **spring.cloud.azure.redis**.enabled                 | Whether an Azure Cache for Redis is enabled. | true          | No       |
> | **spring.cloud.azure.redis**.name                    | Azure Cache for Redis instance name.         |               | Yes      |
> | **spring.cloud.azure.redis**.resource.resource-group | The resource group of Azure Cache for Redis. |               | Yes      |
> | **spring.cloud.azure**.profile.subscription-id       | The subscription ID.                         |               | Yes      |

> [!NOTE]
Authentication information is also required for authenticating for Azure Resource Manager. The credential related configurations of Resource Manager should be configured under prefix `spring.cloud.azure`. For more information, see the [Authentication](#spring-cloud-azure-authentication) section.

### Basic usage

Add the following properties and you are good to go.

``` properties
spring.cloud.azure.redis.name=${AZURE_CACHE_REDIS_NAME}
spring.cloud.azure.redis.resource.resource-group=${AZURE_CACHE_REDIS_RESOURCE_GROUP}
```

### Samples

See [azure-spring-boot-samples](https://github.com/Azure-Samples/azure-spring-boot-samples/tree/spring-cloud-azure_4.2.0) for more details.
