---
title: Spring Cloud Azure support for Testcontainers
description: Spring Cloud Azure support for Testcontainers to test service locally such as Event Hubs, Service Bus, and Storage Queue.
ms.date: 08/20/2024
author: KarlErickson
ms.author: hangwan
ms.topic: reference
ms.custom: devx-track-java, devx-track-extended-java
---

# Spring Cloud Azure support for Testcontainers

**This article applies to:** ✔️ Version 5.15.0

This article describes how to integrate Spring Cloud Azure with [Testcontainers](https://testcontainers.com/) to write effective integration tests for your applications.

## Testcontainers for Spring Cloud Azure

### Key concepts
**Testcontainers** is an open-source framework for providing throwaway, lightweight instances of databases, message brokers, web browsers, or just about anything that can run in a Docker container. It integrates with JUnit, allowing you to write a test class that can start up a container before any of the tests run. Testcontainers is especially useful for writing integration tests that talk to a real backend service.

The `spring-cloud-azure-testcontainers` library now supports integration testing for the following Azure services:
- [Cosmos DB](https://azure.microsoft.com/products/cosmos-db/)
- [Storage Blobs](https://azure.microsoft.com/products/storage/blobs/)
- [Storage Queues](https://azure.microsoft.com/products/storage/queues/)

#### Service Connections
A service connection is a connection to any remote service. Spring Boot’s auto-configuration can consume the details of a service connection and use them to establish a connection to a remote service. When doing so, the connection details take precedence over any connection-related configuration properties.

When using Testcontainers, connection details can be automatically created for a service running in a container by annotating the container field in the test class.

The `@ServiceConnection` annotation are processed by `xxxContainerConnectionDetailsFactory` classes registered with `spring.factories`. These factories can create a `ConnectionDetails` bean based on a specific Container subclass, or the Docker image name. 

Here are the **Connection Details Factory** supported in the **spring-cloud-azure-testcontainers** jar:

| Connection Details Factory Class             |  Connection Details Bean        |
|----------------------------------------------|---------------------------------|
| `CosmosContainerConnectionDetailsFactory`  | `AzureCosmosConnectionDetails`     |
| `StorageBlobContainerConnectionDetailsFactory` | `AzureStorageBlobConnectionDetails` |
| `StorageQueueContainerConnectionDetailsFactory` | `AzureStorageQueueConnectionDetails` |

### Dependency setup

#### [test for Cosmos](#tab/test-for-cosmos)
```xml
<dependency>
  <groupId>org.testcontainers</groupId>
  <artifactId>azure</artifactId>
</dependency>
<dependency>
  <groupId>com.azure.spring</groupId>
  <artifactId>spring-cloud-azure-testcontainers</artifactId>
</dependency>
<dependency>
  <groupId>com.azure.spring</groupId>
  <artifactId>spring-cloud-azure-starter-cosmos</artifactId>
</dependency>
```

#### [test for Storage Blob](#tab/test-for-storage-blob)
```xml
<dependency>
  <groupId>com.azure.spring</groupId>
  <artifactId>spring-cloud-azure-testcontainers</artifactId>
</dependency>
<dependency>
  <groupId>com.azure.spring</groupId>
  <artifactId>spring-cloud-azure-starter-storage-blob</artifactId>
</dependency>
```

#### [test for Storage Queue](#tab/test-for-storage-queue)
```xml
<dependency>
  <groupId>com.azure.spring</groupId>
  <artifactId>spring-cloud-azure-testcontainers</artifactId>
</dependency>
<dependency>
  <groupId>com.azure.spring</groupId>
  <artifactId>spring-cloud-azure-starter-storage-queue</artifactId>
</dependency>
```

---

### Basic usage

#### [test for Cosmos](#tab/test-for-cosmos)
```java
@SpringBootTest
@Testcontainers
@ImportAutoConfiguration(classes = { AzureGlobalPropertiesAutoConfiguration.class, AzureCosmosAutoConfiguration.class})
public class CosmosTestcontainersTest {

    @TempDir
    private static File tempFolder;

    @Autowired
    private CosmosClient client;

    @Container
    @ServiceConnection
    static CosmosDBEmulatorContainer cosmos = new CosmosDBEmulatorContainer(
    DockerImageName.parse("mcr.microsoft.com/cosmosdb/linux/azure-cosmos-emulator:latest"));

    @BeforeAll
    static void setup() {
    cosmos.start();
    Path keyStoreFile = new File(tempFolder, "azure-cosmos-emulator.keystore").toPath();
    KeyStore keyStore = cosmos.buildNewKeyStore();
    try {
    keyStore.store(Files.newOutputStream(keyStoreFile.toFile().toPath()), cosmos.getEmulatorKey().toCharArray());
    } catch (Exception e) {
    throw new RuntimeException(e);
    }

    System.setProperty("javax.net.ssl.trustStore", keyStoreFile.toString());
    System.setProperty("javax.net.ssl.trustStorePassword", cosmos.getEmulatorKey());
    System.setProperty("javax.net.ssl.trustStoreType", "PKCS12");
    }

    @Test
    void test() {
        // ...
    }
}
```

To use `CosmosDBEmulatorContainer`, we need to prepare KeyStore for SSL, see [Azure Module in Testcontainers](https://java.testcontainers.org/modules/azure/#cosmosdb). With `@ServiceConnection`, the above configuration allows Cosmos DB-related beans in the app to communicate with Cosmos DB running inside the Testcontainers-managed Docker container. This action is done by automatically defining a `AzureCosmosConnectionDetails` bean, which is then used by the Cosmos DB autoconfiguration, overriding any connection-related configuration properties.

#### [test for Storage Blob](#tab/test-for-storage-blob)
```java
@SpringBootTest
@Testcontainers
@ImportAutoConfiguration(classes = { AzureGlobalPropertiesAutoConfiguration.class, AzureStorageBlobAutoConfiguration.class, AzureStorageBlobResourceAutoConfiguration.class})
public class StorageBlobTestcontainersTest {
    @Container
    @ServiceConnection
    private static final GenericContainer<?> AZURITE_CONTAINER = new GenericContainer<>(
        "mcr.microsoft.com/azure-storage/azurite:latest")
        .withExposedPorts(10000);

    @Value("azure-blob://testcontainers/message.txt")
    private Resource blobFile;

    @BeforeAll
    static void setup() {
        AZURITE_CONTAINER.start();
    }

    @Test
    void test() {
        // ...
    }
}
```

With `@ServiceConnection`, the above configuration allows Storage Blob-related beans in the app to communicate with Storage Blob running inside the Testcontainers-managed Docker container. This action is done by automatically defining a `AzureStorageBlobConnectionDetails` bean, which is then used by the Storage Blob autoconfiguration, overriding any connection-related configuration properties.

#### [test for Storage Queue](#tab/test-for-storage-queue)
```java
@SpringBootTest
@Testcontainers
@TestPropertySource(properties = "spring.cloud.azure.storage.queue.queue-name=devstoreaccount1/tc-queue")
@ImportAutoConfiguration(classes = { AzureGlobalPropertiesAutoConfiguration.class, AzureStorageQueueAutoConfiguration.class})
public class StorageQueueTestcontainersTest {

    @Container
    @ServiceConnection
    private static final GenericContainer<?> AZURITE_CONTAINER = new GenericContainer<>(
        "mcr.microsoft.com/azure-storage/azurite:latest")
        .withExposedPorts(10001);

    @Autowired
    private QueueClient queueClient;

    @BeforeAll
    static void setup() {
        AZURITE_CONTAINER.start();
    }

    @Test
    void test() {
        // ...
    }
}
```

With `@ServiceConnection`, the above configuration allows Storage Queue-related beans in the app to communicate with Storage Queue running inside the Testcontainers-managed Docker container. This action is done by automatically defining a `AzureStorageQueueConnectionDetails` bean, which is then used by the Storage Queue autoconfiguration, overriding any connection-related configuration properties.

---

### Samples

For more information, see the [azure-spring-boot-samples](https://github.com/Azure-Samples/azure-spring-boot-samples/tree/main/testcontainers) repository on GitHub.
