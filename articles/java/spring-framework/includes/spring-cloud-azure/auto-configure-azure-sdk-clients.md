---
ms.date: 11/01/2022
author: KarlErickson
ms.author: v-yonghuiye
---

## Auto-configure Azure SDK clients

Spring Boot simplifies the Spring Cloud Azure development experience. Spring Cloud Azure starters are a set of convenient dependency descriptors to include in your application. The starters handle the object instantiation and configuration logic, so you don’t have to. Every starter depends on `spring-cloud-azure-starter` to provide critical bits of configuration, like the Azure cloud environment and authentication information. You can configure these as properties in, for example, a YAML file, as shown in the following example:

```yaml
spring:
  cloud:
    azure:
      profile:
        tenant-id: ${AZURE_TENANT_ID}
        cloud-type: Azure
      credential:
        client-id: ${AZURE_CLIENT_ID}
```

> [!NOTE]
> The `cloud` property is optional.

These properties are optional and, if not specified, Spring Boot will try to automatically find them for you. For details on how Spring Boot finds these properties, refer to the documentation.

### Dependency setup

There are two ways to use Spring Cloud Azure starters. The first way is to use Azure SDKs with the `spring-cloud-azure-starter` dependency as shown in the following example:

```xml
<dependency>
  <groupId>com.azure</groupId>
  <artifactId>azure-cosmos</artifactId>
</dependency>
<dependency>
    <groupId>com.azure.spring</groupId>
    <artifactId>spring-cloud-azure-starter</artifactId>
</dependency>
```

The second way is to avoid adding Azure SDK dependencies and instead include the Spring Cloud Azure Starter for each Service directly. For example, with Azure Cosmos DB, you would add the following dependency:

```xml
<dependency>
    <groupId>com.azure.spring</groupId>
    <artifactId>spring-cloud-azure-starter-cosmos</artifactId>
</dependency>
```

> [!TIP]
> For the list of supported starters, see [Starter dependencies](#starter-dependencies).

### Configuration

> [!NOTE]
> If you use a security principal to authenticate and authorize with Azure Active Directory for accessing an Azure resource, be sure the security principal has been granted sufficient permission to access the Azure resource. For more information, see [Authorize access with Azure Active Directory](#authorize-access-with-azure-active-directory).

Configuration properties for each Azure service are under prefix `spring.cloud.azure.<azure-service>`.

> [!TIP]
> For the list of all Spring Cloud Azure configuration properties, see [List of configuration properties](../../spring-cloud-azure-appendix.md#list-of-configuration-properties).

### Basic usage

Adding the following properties to your *application.yaml* file will autoconfigure the Azure Cosmos DB client for you.

```yaml
spring:
  cloud:
    azure:
      cosmos:
        database: ${AZURE_COSMOS_DATABASE_NAME}
        endpoint: ${AZURE_COSMOS_ENDPOINT}
        consistency-level: eventual
        connection-mode: direct
```

Then, both `CosmosClient` and `CosmosAsyncClient` are available in the context and can be autowired, as shown in the following example:

```java
class Demo {
@Autowired
private CosmosClient cosmosClient;

    @Override
    public void run() {
        User item = User.randomUser();
        CosmosContainer container = cosmosClient.getDatabase(databaseName).getContainer(containerName);
        container.createItem(item);
    }
}
```

### Samples

See the [azure-spring-boot-samples](https://github.com/Azure-Samples/azure-spring-boot-samples/tree/spring-cloud-azure_4.4.1) on GitHub.
