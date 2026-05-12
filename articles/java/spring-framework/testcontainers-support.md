---
title: Spring Cloud Azure support for Testcontainers
description: Describes how to integrate Spring Cloud Azure with Testcontainers to write effective integration tests for your applications.
ms.date: 03/18/2026
author: KarlErickson
ms.author: karler
ms.reviewer: seal
ms.topic: reference
ms.custom: devx-track-java
appliesto:
- ✅ Version 5.25.0
- ✅ Version 6.2.0
- ✅ Version 7.2.0
---

# Spring Cloud Azure support for Testcontainers

This article describes how to integrate Spring Cloud Azure with [Testcontainers](https://testcontainers.com/) to write effective integration tests for your applications.

*Testcontainer* is an open-source framework for providing throwaway, lightweight instances of databases, message brokers, web browsers, or just about anything that can run in a Docker container. It integrates with JUnit, enabling you to write a test class that can start up a container before any of the tests run. Testcontainer is especially useful for writing integration tests that talk to a real backend service.

The `spring-cloud-azure-testcontainers` library now supports integration testing for the following Azure services:

- [Azure Cosmos DB](https://azure.microsoft.com/products/cosmos-db/)
- [Azure Blob Storage](https://azure.microsoft.com/products/storage/blobs/)
- [Azure Queue Storage](https://azure.microsoft.com/products/storage/queues/)
- [Azure Event Hubs](https://azure.microsoft.com/products/event-hubs/)
- [Azure Service Bus](https://azure.microsoft.com/products/service-bus/)

## Service connections

A service connection is a connection to any remote service. Spring Boot's autoconfiguration can consume the details of a service connection and use them to establish a connection to a remote service. When doing so, the connection details take precedence over any connection-related configuration properties.

When you use Testcontainers, you can automatically create connection details for a service running in a container by annotating the container field in the test class.

`xxxContainerConnectionDetailsFactory` classes are registered with `spring.factories`. These factories create a `ConnectionDetails` bean based on a specific `Container` subclass or the Docker image name.

The following table provides information about the connection details factory classes supported in the `spring-cloud-azure-testcontainers` JAR:

| Connection details factory class                | Connection details bean              |
|-------------------------------------------------|--------------------------------------|
| `CosmosContainerConnectionDetailsFactory`       | `AzureCosmosConnectionDetails`       |
| `StorageBlobContainerConnectionDetailsFactory`  | `AzureStorageBlobConnectionDetails`  |
| `StorageQueueContainerConnectionDetailsFactory` | `AzureStorageQueueConnectionDetails` |
| `EventHubsContainerConnectionDetailsFactory`    | `AzureEventHubsConnectionDetails`    |
| `ServiceBusContainerConnectionDetailsFactory`   | `AzureServiceBusConnectionDetails`   |

## Set up dependencies

The following configuration sets up the required dependencies:

### [Cosmos](#tab/test-for-cosmos)

```xml
  <properties>
    <version.spring.cloud.azure>7.2.0</version.spring.cloud.azure>
  </properties>

  <dependencyManagement>
    <dependencies>
      <dependency>
        <groupId>com.azure.spring</groupId>
        <artifactId>spring-cloud-azure-dependencies</artifactId>
        <version>${version.spring.cloud.azure}</version>
        <type>pom</type>
        <scope>import</scope>
      </dependency>
    </dependencies>
  </dependencyManagement>

  <dependencies>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-test</artifactId>
      <scope>test</scope>
    </dependency>
    <dependency>
      <groupId>org.testcontainers</groupId>
      <artifactId>testcontainers-junit-jupiter</artifactId>
      <scope>test</scope>
    </dependency>
    <dependency>
      <groupId>com.azure.spring</groupId>
      <artifactId>spring-cloud-azure-testcontainers</artifactId>
      <scope>test</scope>
    </dependency>
    <dependency>
      <groupId>com.azure.spring</groupId>
      <artifactId>spring-cloud-azure-starter-cosmos</artifactId>
      <scope>test</scope>
    </dependency>
  </dependencies>
```

### [Blob Storage](#tab/test-for-storage-blob)

```xml
  <properties>
    <version.spring.cloud.azure>7.2.0</version.spring.cloud.azure>
  </properties>

  <dependencyManagement>
    <dependencies>
      <dependency>
        <groupId>com.azure.spring</groupId>
        <artifactId>spring-cloud-azure-dependencies</artifactId>
        <version>${version.spring.cloud.azure}</version>
        <type>pom</type>
        <scope>import</scope>
      </dependency>
    </dependencies>
  </dependencyManagement>

  <dependencies>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-test</artifactId>
      <scope>test</scope>
    </dependency>
    <dependency>
      <groupId>org.testcontainers</groupId>
      <artifactId>testcontainers-junit-jupiter</artifactId>
      <scope>test</scope>
    </dependency>
    <dependency>
      <groupId>com.azure.spring</groupId>
      <artifactId>spring-cloud-azure-testcontainers</artifactId>
      <scope>test</scope>
    </dependency>
    <dependency>
      <groupId>com.azure.spring</groupId>
      <artifactId>spring-cloud-azure-starter-storage-blob</artifactId>
      <scope>test</scope>
    </dependency>
  </dependencies>

```

### [Queue Storage](#tab/test-for-storage-queue)

```xml
  <properties>
    <version.spring.cloud.azure>7.2.0</version.spring.cloud.azure>
  </properties>

  <dependencyManagement>
    <dependencies>
      <dependency>
        <groupId>com.azure.spring</groupId>
        <artifactId>spring-cloud-azure-dependencies</artifactId>
        <version>${version.spring.cloud.azure}</version>
        <type>pom</type>
        <scope>import</scope>
      </dependency>
    </dependencies>
  </dependencyManagement>

  <dependencies>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-test</artifactId>
      <scope>test</scope>
    </dependency>
    <dependency>
      <groupId>org.testcontainers</groupId>
      <artifactId>testcontainers-junit-jupiter</artifactId>
      <scope>test</scope>
    </dependency>
    <dependency>
      <groupId>com.azure.spring</groupId>
      <artifactId>spring-cloud-azure-testcontainers</artifactId>
      <scope>test</scope>
    </dependency>
    <dependency>
      <groupId>com.azure.spring</groupId>
      <artifactId>spring-cloud-azure-starter-storage-queue</artifactId>
      <scope>test</scope>
    </dependency>
  </dependencies>
```

### [Event Hubs](#tab/test-for-event-hubs)

```xml
  <properties>
    <version.spring.cloud.azure>7.2.0</version.spring.cloud.azure>
  </properties>

  <dependencyManagement>
    <dependencies>
      <dependency>
        <groupId>com.azure.spring</groupId>
        <artifactId>spring-cloud-azure-dependencies</artifactId>
        <version>${version.spring.cloud.azure}</version>
        <type>pom</type>
        <scope>import</scope>
      </dependency>
    </dependencies>
  </dependencyManagement>

  <dependencies>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-test</artifactId>
      <scope>test</scope>
    </dependency>
    <dependency>
      <groupId>org.testcontainers</groupId>
      <artifactId>testcontainers-junit-jupiter</artifactId>
      <scope>test</scope>
    </dependency>
    <dependency>
      <groupId>com.azure.spring</groupId>
      <artifactId>spring-cloud-azure-testcontainers</artifactId>
      <scope>test</scope>
    </dependency>
    <dependency>
      <groupId>com.azure.spring</groupId>
      <artifactId>spring-cloud-azure-starter-eventhubs</artifactId>
      <scope>test</scope>
    </dependency>
  </dependencies>
```

### [Event Hubs Binder](#tab/test-for-event-hubs-binder)

```xml
  <properties>
    <version.spring.cloud.azure>7.2.0</version.spring.cloud.azure>
  </properties>

  <dependencyManagement>
    <dependencies>
      <dependency>
        <groupId>com.azure.spring</groupId>
        <artifactId>spring-cloud-azure-dependencies</artifactId>
        <version>${version.spring.cloud.azure}</version>
        <type>pom</type>
        <scope>import</scope>
      </dependency>
    </dependencies>
  </dependencyManagement>

  <dependencies>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-test</artifactId>
      <scope>test</scope>
    </dependency>
    <dependency>
      <groupId>org.testcontainers</groupId>
      <artifactId>testcontainers-junit-jupiter</artifactId>
      <scope>test</scope>
    </dependency>
    <dependency>
      <groupId>com.azure.spring</groupId>
      <artifactId>spring-cloud-azure-testcontainers</artifactId>
      <scope>test</scope>
    </dependency>
    <dependency>
      <groupId>com.azure.spring</groupId>
      <artifactId>spring-cloud-azure-stream-binder-eventhubs</artifactId>
      <scope>test</scope>
    </dependency>
  </dependencies>
```

### [Service Bus](#tab/test-for-service-bus)

```xml
  <properties>
    <version.spring.cloud.azure>7.2.0</version.spring.cloud.azure>
  </properties>

  <dependencyManagement>
    <dependencies>
      <dependency>
        <groupId>com.azure.spring</groupId>
        <artifactId>spring-cloud-azure-dependencies</artifactId>
        <version>${version.spring.cloud.azure}</version>
        <type>pom</type>
        <scope>import</scope>
      </dependency>
    </dependencies>
  </dependencyManagement>

  <dependencies>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-test</artifactId>
      <scope>test</scope>
    </dependency>
    <dependency>
      <groupId>org.testcontainers</groupId>
      <artifactId>testcontainers-junit-jupiter</artifactId>
      <scope>test</scope>
    </dependency>
    <dependency>
      <groupId>com.azure.spring</groupId>
      <artifactId>spring-cloud-azure-testcontainers</artifactId>
      <scope>test</scope>
    </dependency>
    <dependency>
      <groupId>com.azure.spring</groupId>
      <artifactId>spring-cloud-azure-starter</artifactId>
      <scope>test</scope>
    </dependency>
    <dependency>
      <groupId>com.azure.spring</groupId>
      <artifactId>spring-messaging-azure-servicebus</artifactId>
      <scope>test</scope>
    </dependency>
    <dependency>
      <groupId>com.microsoft.sqlserver</groupId>
      <artifactId>mssql-jdbc</artifactId>
      <scope>test</scope>
    </dependency>
  </dependencies>
```

### [Service Bus Binder](#tab/test-for-service-bus-binder)

```xml
  <properties>
    <version.spring.cloud.azure>7.2.0</version.spring.cloud.azure>
  </properties>

  <dependencyManagement>
    <dependencies>
      <dependency>
        <groupId>com.azure.spring</groupId>
        <artifactId>spring-cloud-azure-dependencies</artifactId>
        <version>${version.spring.cloud.azure}</version>
        <type>pom</type>
        <scope>import</scope>
      </dependency>
    </dependencies>
  </dependencyManagement>

  <dependencies>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-test</artifactId>
      <scope>test</scope>
    </dependency>
    <dependency>
      <groupId>org.testcontainers</groupId>
      <artifactId>testcontainers-junit-jupiter</artifactId>
      <scope>test</scope>
    </dependency>
    <dependency>
      <groupId>com.azure.spring</groupId>
      <artifactId>spring-cloud-azure-testcontainers</artifactId>
      <scope>test</scope>
    </dependency>
    <dependency>
      <groupId>com.azure.spring</groupId>
      <artifactId>spring-cloud-azure-stream-binder-servicebus</artifactId>
      <scope>test</scope>
    </dependency>
    <dependency>
      <groupId>com.microsoft.sqlserver</groupId>
      <artifactId>mssql-jdbc</artifactId>
      <scope>test</scope>
    </dependency>
  </dependencies>
```

---

## Use Testcontainers

The following code example demonstrates the basic usage of Testcontainers:

### [Cosmos](#tab/test-for-cosmos)

```java
@SpringBootTest(classes = CosmosTestcontainersTest.class)
@Testcontainers
@ExtendWith(SpringExtension.class)
@ImportAutoConfiguration(classes = { AzureGlobalPropertiesAutoConfiguration.class, AzureCosmosAutoConfiguration.class})
public class CosmosTestcontainersTest {

    @TempDir
    private static File tempFolder;

    @Autowired
    private CosmosClient client;

    @Container
    @ServiceConnection
    static CosmosDBEmulatorContainer cosmos = new CosmosDBEmulatorContainer(
        DockerImageName.parse("mcr.microsoft.com/cosmosdb/linux/azure-cosmos-emulator:latest"))
                .waitingFor(Wait.forHttps("/_explorer/emulator.pem").forStatusCode(200).allowInsecure())
                .withStartupTimeout(Duration.ofMinutes(3));

    @BeforeAll
    public static void setup() throws IOException, CertificateException, KeyStoreException, NoSuchAlgorithmException {
        Path keyStoreFile = new File(tempFolder, "azure-cosmos-emulator.keystore").toPath();
        KeyStore keyStore = cosmos.buildNewKeyStore();
        try (var out = Files.newOutputStream(keyStoreFile.toFile().toPath())) {
            keyStore.store(out, cosmos.getEmulatorKey().toCharArray());
        }

        System.setProperty("javax.net.ssl.trustStore", keyStoreFile.toString());
        System.setProperty("javax.net.ssl.trustStorePassword", cosmos.getEmulatorKey());
        System.setProperty("javax.net.ssl.trustStoreType", "PKCS12");
    }

    @Test
    public void test() {
        CosmosDatabaseResponse databaseResponse = client.createDatabaseIfNotExists("Azure");
        assertThat(databaseResponse.getStatusCode()).isEqualTo(201);
        CosmosContainerResponse containerResponse = client
            .getDatabase("Azure")
            .createContainerIfNotExists("ServiceContainer", "/name");
        assertThat(containerResponse.getStatusCode()).isEqualTo(201);
    }

}
```

To use `CosmosDBEmulatorContainer`, you need to prepare a `KeyStore` for TLS/SSL. For more information, see [Cosmos DB Azure Module](https://java.testcontainers.org/modules/azure/#cosmosdb) in the Testcontainers documentation. With `@ServiceConnection`, this configuration enables Cosmos DB-related beans in the app to communicate with Cosmos DB running inside the Testcontainers-managed Docker container. This setup automatically defines an `AzureCosmosConnectionDetails` bean, which the Cosmos DB autoconfiguration then uses to override any connection-related configuration properties.

### [Blob Storage](#tab/test-for-storage-blob)

```java
@SpringJUnitConfig
@Testcontainers
class StorageBlobTestcontainersTest {
    @Container
    @ServiceConnection
    private static final GenericContainer<?> AZURITE_CONTAINER = new GenericContainer<>(
            "mcr.microsoft.com/azure-storage/azurite:latest")
            .withExposedPorts(10000)
            .withCommand("azurite --skipApiVersionCheck && azurite -l /data --blobHost 0.0.0.0 --queueHost 0.0.0.0 --tableHost 0.0.0.0");

    @Value("azure-blob://testcontainers/message.txt")
    private Resource blobFile;

    @Test
    void test() throws IOException {
        String originalContent = "Hello World!";
        try (OutputStream os = ((WritableResource) this.blobFile).getOutputStream()) {
            os.write(originalContent.getBytes());
        }
        String resultContent = StreamUtils.copyToString(this.blobFile.getInputStream(), Charset.defaultCharset());
        assertThat(resultContent).isEqualTo(originalContent);
    }

    @Configuration(proxyBeanMethods = false)
    @ImportAutoConfiguration(classes = {AzureGlobalPropertiesAutoConfiguration.class, AzureStorageBlobAutoConfiguration.class, AzureStorageBlobResourceAutoConfiguration.class})
    static class Config {
    }
}
```

With `@ServiceConnection`, this configuration enables blob-related beans in the app to communicate with Blob Storage running inside the Testcontainers-managed Docker container. This setup automatically defines an `AzureStorageBlobConnectionDetails` bean, which the Blob Storage autoconfiguration then uses to override any connection-related configuration properties.

### [Queue Storage](#tab/test-for-storage-queue)

```java
@SpringBootTest(classes = StorageQueueTestcontainersTest.class)
@Testcontainers
@TestPropertySource(properties = "spring.cloud.azure.storage.queue.queue-name=devstoreaccount1/tc-queue")
@ExtendWith(SpringExtension.class)
@ImportAutoConfiguration(classes = { AzureGlobalPropertiesAutoConfiguration.class, AzureStorageQueueAutoConfiguration.class})
public class StorageQueueTestcontainersTest {

    @Container
    @ServiceConnection
    private static final GenericContainer<?> AZURITE_CONTAINER = new GenericContainer<>(
        "mcr.microsoft.com/azure-storage/azurite:latest")
        .withExposedPorts(10001)
        .withCommand("azurite-queue", "--queueHost", "0.0.0.0", "--skipApiVersionCheck");

    @Autowired
    private QueueClient queueClient;

    @BeforeAll
    public static void setup() {
        AZURITE_CONTAINER.start();
    }

    @Test
    public void test() {
        String message = "Hello World!";
        this.queueClient.create();
        this.queueClient.sendMessage(message);
        assertThat(this.queueClient.receiveMessage().getBody().toString()).isEqualTo(message);
    }

}
```

With `@ServiceConnection`, this configuration enables queue-related beans in the app to communicate with Queue Storage running inside the Testcontainers-managed Docker container. This setup automatically defines an `AzureStorageQueueConnectionDetails` bean, which the Queue Storage autoconfiguration then uses to override any connection-related configuration properties.

### [Event Hubs](#tab/test-for-event-hubs)

```java
@SpringJUnitConfig
@TestPropertySource(properties = { "spring.cloud.azure.eventhubs.event-hub-name=eh1",
        "spring.cloud.azure.eventhubs.producer.event-hub-name=eh1" })
@Testcontainers
class EventHubsTestContainerTest {

    private static final Network NETWORK = Network.newNetwork();

    private static final AzuriteContainer AZURITE = new AzuriteContainer(
            "mcr.microsoft.com/azure-storage/azurite:latest")
            .withNetwork(NETWORK)
            .withNetworkAliases("azurite");

    @Container
    @ServiceConnection
    private static final EventHubsEmulatorContainer EVENT_HUBS = new EventHubsEmulatorContainer(
            "mcr.microsoft.com/azure-messaging/eventhubs-emulator:latest")
            .acceptLicense()
            .withCopyFileToContainer(MountableFile.forClasspathResource("Config.json"),
                    "/Eventhubs_Emulator/ConfigFiles/Config.json")
            .withNetwork(NETWORK)
            .withAzuriteContainer(AZURITE);

    @Autowired
    private AzureEventHubsConnectionDetails connectionDetails;

    @Autowired
    private EventHubProducerClient producerClient;

    @Test
    void connectionDetailsShouldBeProvidedByFactory() {
        assertThat(connectionDetails).isNotNull();
        assertThat(connectionDetails.getConnectionString())
                .isNotBlank()
                .startsWith("Endpoint=sb://");
    }

    @Test
    void producerClientCanSendMessage() {
        // Wait for Event Hubs emulator to be fully ready and event hub entity to be available
        waitAtMost(Duration.ofSeconds(120)).pollInterval(Duration.ofSeconds(2)).untilAsserted(() -> {
            EventData event = new EventData("Hello World!");
            this.producerClient.send(Collections.singletonList(event));
        });
    }

    @Configuration(proxyBeanMethods = false)
    @ImportAutoConfiguration(classes = {AzureGlobalPropertiesAutoConfiguration.class,
            AzureEventHubsAutoConfiguration.class})
    static class Config {

    }
}
```

With `@ServiceConnection`, this configuration enables related beans in the app to communicate with Event Hubs running inside the Testcontainers-managed Docker container. This setup automatically defines an `AzureEventHubsConnectionDetails` bean, which the Event Hubs autoconfiguration then uses to override any connection-related configuration properties.

### [Event Hubs Binder](#tab/test-for-event-hubs-binder)

```java

@SpringJUnitConfig
@TestPropertySource(properties = {
        "spring.cloud.function.definition=consume;supply",
        "spring.cloud.stream.bindings.consume-in-0.destination=eh1",
        "spring.cloud.stream.bindings.consume-in-0.group=$Default",
        "spring.cloud.stream.bindings.supply-out-0.destination=eh1",
        "spring.cloud.stream.eventhubs.bindings.consume-in-0.consumer.checkpoint.mode=MANUAL",
        "spring.cloud.stream.poller.fixed-delay=1000",
        "spring.cloud.stream.poller.initial-delay=0"})
@Testcontainers
class EventHubsTestContainerTest {

    private static final Network NETWORK = Network.newNetwork();

    private static final AzuriteContainer AZURITE = new AzuriteContainer(
            "mcr.microsoft.com/azure-storage/azurite:latest")
            .withCommand("azurite", "--blobHost", "0.0.0.0", "--queueHost", "0.0.0.0", "--tableHost", "0.0.0.0",
                    "--skipApiVersionCheck")
            .withNetwork(NETWORK)
            .withNetworkAliases("azurite");

    @Container
    @ServiceConnection
    private static final EventHubsEmulatorContainer EVENT_HUBS = new EventHubsEmulatorContainer(
            "mcr.microsoft.com/azure-messaging/eventhubs-emulator:latest")
            .acceptLicense()
            .withCopyFileToContainer(MountableFile.forClasspathResource("Config.json"),
                    "/Eventhubs_Emulator/ConfigFiles/Config.json")
            .withNetwork(NETWORK)
            .withAzuriteContainer(AZURITE);

    private static final Logger LOGGER = LoggerFactory.getLogger(EventHubsTestContainerTest.class);
    private static final Set<String> RECEIVED_MESSAGES = ConcurrentHashMap.newKeySet();
    private static final AtomicInteger MESSAGE_SEQUENCE = new AtomicInteger(0);

    @Test
    void supplierAndConsumerShouldWorkThroughEventHubs() {
        waitAtMost(Duration.ofSeconds(120))
                .pollDelay(Duration.ofSeconds(2))
                .pollInterval(Duration.ofSeconds(2))
                .untilAsserted(() -> {
                    assertThat(RECEIVED_MESSAGES).isNotEmpty();
                    LOGGER.info("✓ Test passed - Consumer received {} message(s)", RECEIVED_MESSAGES.size());
                });
    }

    @Configuration(proxyBeanMethods = false)
    @EnableAutoConfiguration
    @ImportAutoConfiguration(classes = {
            AzureGlobalPropertiesAutoConfiguration.class,
            AzureEventHubsAutoConfiguration.class,
            AzureEventHubsMessagingAutoConfiguration.class})
    static class Config {

        private static final String CHECKPOINT_CONTAINER_NAME = "eventhubs-checkpoint";

        @Bean
        public BlobCheckpointStore blobCheckpointStore() {
            BlobServiceAsyncClient blobServiceAsyncClient = new BlobServiceClientBuilder()
                    .connectionString(AZURITE.getConnectionString())
                    .serviceVersion(BlobServiceVersion.V2025_01_05)
                    .buildAsyncClient();
            BlobContainerAsyncClient containerAsyncClient = blobServiceAsyncClient
                    .getBlobContainerAsyncClient(CHECKPOINT_CONTAINER_NAME);
            if (Boolean.FALSE.equals(containerAsyncClient.exists().block(Duration.ofSeconds(3)))) {
                containerAsyncClient.create().block(Duration.ofSeconds(3));
            }
            return new BlobCheckpointStore(containerAsyncClient);
        }

        @Bean
        public Supplier<Message<String>> supply() {
            return () -> {
                int sequence = MESSAGE_SEQUENCE.getAndIncrement();
                String payload = "Hello world, " + sequence;
                LOGGER.info("[Supplier] Invoked - message sequence: {}", sequence);
                return MessageBuilder.withPayload(payload).build();
            };
        }

        @Bean
        public Consumer<Message<String>> consume() {
            return message -> {
                String payload = message.getPayload();
                RECEIVED_MESSAGES.add(payload);
                LOGGER.info("[Consumer] Received message: {}", payload);

                Checkpointer checkpointer = (Checkpointer) message.getHeaders().get(CHECKPOINTER);
                if (checkpointer != null) {
                    checkpointer.success()
                            .doOnSuccess(s -> LOGGER.info("[Consumer] Message checkpointed"))
                            .doOnError(e -> LOGGER.error("[Consumer] Checkpoint failed", e))
                            .block();
                }
            };
        }
    }
}
```

With `@ServiceConnection`, this configuration enables related beans in the app to communicate with Event Hubs running inside the Testcontainers-managed Docker container. This setup automatically defines an `AzureEventHubsConnectionDetails` bean, which the Event Hubs autoconfiguration then uses to override any connection-related configuration properties.

### [Service Bus](#tab/test-for-service-bus)

```java
@SpringJUnitConfig
@TestPropertySource(properties = { "spring.cloud.azure.servicebus.entity-name=queue.1",
        "spring.cloud.azure.servicebus.entity-type=queue" })
@Testcontainers
class ServiceBusTestContainerTest {

    private static final Network NETWORK = Network.newNetwork();

    private static final MSSQLServerContainer<?> SQLSERVER = new MSSQLServerContainer<>(
            "mcr.microsoft.com/mssql/server:2022-CU14-ubuntu-22.04")
            .acceptLicense()
            .withNetwork(NETWORK)
            .withNetworkAliases("sqlserver");

    @Container
    @ServiceConnection
    private static final ServiceBusEmulatorContainer SERVICE_BUS = new ServiceBusEmulatorContainer(
            "mcr.microsoft.com/azure-messaging/servicebus-emulator:latest")
            .acceptLicense()
            .withCopyFileToContainer(MountableFile.forClasspathResource("Config.json"),
                    "/ServiceBus_Emulator/ConfigFiles/Config.json")
            .withNetwork(NETWORK)
            .withMsSqlServerContainer(SQLSERVER);

    @Autowired
    private AzureServiceBusConnectionDetails connectionDetails;

    @Autowired
    private ServiceBusSenderClient senderClient;

    @Autowired
    private ServiceBusTemplate serviceBusTemplate;

    @Test
    void connectionDetailsShouldBeProvidedByFactory() {
        assertThat(connectionDetails).isNotNull();
        assertThat(connectionDetails.getConnectionString())
                .isNotBlank()
                .startsWith("Endpoint=sb://");
    }

    @Test
    void senderClientCanSendMessage() {
        // Wait for Service Bus emulator to be fully ready and queue entity to be available
        waitAtMost(Duration.ofSeconds(120)).pollInterval(Duration.ofSeconds(2)).untilAsserted(() -> {
            this.senderClient.sendMessage(new ServiceBusMessage("Hello World!"));
        });

        waitAtMost(Duration.ofSeconds(30)).untilAsserted(() -> {
            assertThat(Config.MESSAGES).contains("Hello World!");
        });
    }

    @Test
    void serviceBusTemplateCanSendMessage() {
        // Wait for Service Bus emulator to be fully ready and queue entity to be available
        waitAtMost(Duration.ofSeconds(120)).pollInterval(Duration.ofSeconds(2)).untilAsserted(() -> {
            this.serviceBusTemplate.sendAsync("queue.1",
                    MessageBuilder.withPayload("Hello from ServiceBusTemplate!").build()).block(Duration.ofSeconds(10));
        });

        waitAtMost(Duration.ofSeconds(30)).untilAsserted(() -> {
            assertThat(Config.MESSAGES).contains("Hello from ServiceBusTemplate!");
        });
    }


    @Configuration(proxyBeanMethods = false)
    @ImportAutoConfiguration(classes = {AzureGlobalPropertiesAutoConfiguration.class,
            AzureServiceBusAutoConfiguration.class,
            AzureServiceBusMessagingAutoConfiguration.class})
    static class Config {

        private static final Set<String> MESSAGES = ConcurrentHashMap.newKeySet();

        @Bean
        ServiceBusRecordMessageListener processMessage() {
            return context -> {
                MESSAGES.add(context.getMessage().getBody().toString());
            };
        }

        @Bean
        ServiceBusErrorHandler errorHandler() {
            // No-op error handler for tests: acknowledge errors without affecting test execution.
            return (context) -> {
            };
        }

    }
}
```

With `@ServiceConnection`, this configuration enables related beans in the app to communicate with Service Bus running inside the Testcontainers-managed Docker container. This setup automatically defines an `AzureServiceBusConnectionDetails` bean, which the Service Bus autoconfiguration then uses to override any connection-related configuration properties.

### [Service Bus Binder](#tab/test-for-service-bus-binder)

```java

@SpringJUnitConfig
@TestPropertySource(properties = {
        "spring.cloud.function.definition=consume;supply",
        "spring.cloud.stream.bindings.consume-in-0.destination=queue.1",
        "spring.cloud.stream.bindings.supply-out-0.destination=queue.1",
        "spring.cloud.stream.servicebus.bindings.consume-in-0.consumer.auto-complete=false",
        "spring.cloud.stream.servicebus.bindings.supply-out-0.producer.entity-type=queue",
        "spring.cloud.stream.poller.fixed-delay=1000",
        "spring.cloud.stream.poller.initial-delay=0"})
@Testcontainers
class ServiceBusTestContainerTest {

    private static final Network NETWORK = Network.newNetwork();

    private static final MSSQLServerContainer<?> SQLSERVER = new MSSQLServerContainer<>(
            "mcr.microsoft.com/mssql/server:2022-CU14-ubuntu-22.04")
            .acceptLicense()
            .withNetwork(NETWORK)
            .withNetworkAliases("sqlserver");

    @Container
    @ServiceConnection
    private static final ServiceBusEmulatorContainer SERVICE_BUS = new ServiceBusEmulatorContainer(
            "mcr.microsoft.com/azure-messaging/servicebus-emulator:latest")
            .acceptLicense()
            .withCopyFileToContainer(MountableFile.forClasspathResource("Config.json"),
                    "/ServiceBus_Emulator/ConfigFiles/Config.json")
            .withNetwork(NETWORK)
            .withMsSqlServerContainer(SQLSERVER);

    private static final Logger LOGGER = LoggerFactory.getLogger(ServiceBusTestContainerTest.class);
    private static final Set<String> RECEIVED_MESSAGES = ConcurrentHashMap.newKeySet();
    private static final AtomicInteger MESSAGE_SEQUENCE = new AtomicInteger(0);

    @Test
    void supplierAndConsumerShouldWorkThroughServiceBusQueue() {
        waitAtMost(Duration.ofSeconds(60))
                .pollDelay(Duration.ofSeconds(2))
                .untilAsserted(() -> {
                    assertThat(RECEIVED_MESSAGES).isNotEmpty();
                    LOGGER.info("✓ Test passed - Consumer received {} message(s)", RECEIVED_MESSAGES.size());
                });
    }

    @Configuration(proxyBeanMethods = false)
    @EnableAutoConfiguration
    @ImportAutoConfiguration(classes = {
            AzureGlobalPropertiesAutoConfiguration.class,
            AzureServiceBusAutoConfiguration.class,
            AzureServiceBusMessagingAutoConfiguration.class})
    static class Config {

        @Bean
        public Supplier<Message<String>> supply() {
            return () -> {
                int sequence = MESSAGE_SEQUENCE.getAndIncrement();
                String payload = "Hello world, " + sequence;
                LOGGER.info("[Supplier] Invoked - message sequence: {}", sequence);
                return MessageBuilder.withPayload(payload).build();
            };
        }

        @Bean
        public Consumer<Message<String>> consume() {
            return message -> {
                String payload = message.getPayload();
                RECEIVED_MESSAGES.add(payload);
                LOGGER.info("[Consumer] Received message: {}", payload);

                Checkpointer checkpointer = (Checkpointer) message.getHeaders().get(CHECKPOINTER);
                if (checkpointer != null) {
                    checkpointer.success()
                            .doOnSuccess(s -> LOGGER.info("[Consumer] Message checkpointed"))
                            .doOnError(e -> LOGGER.error("[Consumer] Checkpoint failed", e))
                            .block();
                }
            };
        }
    }
}
```

With `@ServiceConnection`, this configuration enables related beans in the app to communicate with Service Bus running inside the Testcontainers-managed Docker container. This setup automatically defines an `AzureServiceBusConnectionDetails` bean, which the Service Bus autoconfiguration then uses to override any connection-related configuration properties.

---

## Samples

For more information, see the [`spring-cloud-azure-testcontainers` examples](https://github.com/Azure-Samples/azure-spring-boot-samples/tree/main/spring-cloud-azure-testcontainers).
