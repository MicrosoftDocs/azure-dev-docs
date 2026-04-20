---
title: Spring Cloud Azure support for Docker Compose
description: Describes how to integrate Spring Cloud Azure with Docker Compose to write effective integration tests for your applications.
ms.date: 03/18/2026
author: KarlErickson
ms.author: karler
ms.reviewer: rujche
ms.topic: reference
ms.custom: devx-track-java
appliesto:
- ✅ Version 5.25.0
- ✅ Version 6.2.0
- ✅ Version 7.2.0
---

# Spring Cloud Azure support for Docker Compose

This article describes how to integrate Spring Cloud Azure with [Docker Compose](https://docs.docker.com/compose/) to write effective integration tests for your applications.

*Docker Compose* is a tool for defining and running multi-container applications. It's the key to unlocking a streamlined and efficient development and deployment experience.

The `spring-cloud-azure-docker-compose` library now supports integration testing for the following Azure services:

- [Azure Blob Storage](https://azure.microsoft.com/products/storage/blobs/)
- [Azure Queue Storage](https://azure.microsoft.com/products/storage/queues/)
- [Azure Event Hubs](https://azure.microsoft.com/products/event-hubs/)
- [Azure Service Bus](https://azure.microsoft.com/products/service-bus/)

## Service connections

A service connection is a connection to any remote service. Spring Boot's autoconfiguration can consume the details of a service connection and use them to establish a connection to a remote service. When doing so, the connection details take precedence over any connection-related configuration properties.

When you use Docker compose, you can automatically create connection details for a service running in a container by adding the `@SpringBootTest` annotation with the `spring.docker.compose.file` property in the test class.

The `xxxDockerComposeConnectionDetailsFactory` classes are registered with `spring.factories`. These factories create a `ConnectionDetails` bean based on a `DockerComposeConnectionDetails`.

The following table provides information about the connection details factory classes supported in the `spring-cloud-azure-docker-compose` JAR:

| Connection details factory class                    | Connection details bean              |
|-----------------------------------------------------|--------------------------------------|
| `StorageBlobDockerComposeConnectionDetailsFactory`  | `AzureStorageBlobConnectionDetails`  |
| `StorageQueueDockerComposeConnectionDetailsFactory` | `AzureStorageQueueConnectionDetails` |
| `EventHubsDockerComposeConnectionDetailsFactory`    | `AzureEventHubsConnectionDetails`    |
| `ServiceBusDockerComposeConnectionDetailsFactory`   | `AzureServiceBusConnectionDetails`   |

## Set up dependencies

The following configuration sets up the required dependencies:

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
      <groupId>com.azure.spring</groupId>
      <artifactId>spring-cloud-azure-starter-storage-blob</artifactId>
    </dependency>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-test</artifactId>
      <scope>test</scope>
    </dependency>
    <dependency>
      <groupId>com.azure.spring</groupId>
      <artifactId>spring-cloud-azure-docker-compose</artifactId>
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
      <groupId>com.azure.spring</groupId>
      <artifactId>spring-cloud-azure-starter-storage-queue</artifactId>
    </dependency>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-test</artifactId>
      <scope>test</scope>
    </dependency>
    <dependency>
      <groupId>com.azure.spring</groupId>
      <artifactId>spring-cloud-azure-docker-compose</artifactId>
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
      <groupId>com.azure.spring</groupId>
      <artifactId>spring-cloud-azure-starter-eventhubs</artifactId>
    </dependency>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-test</artifactId>
      <scope>test</scope>
    </dependency>
    <dependency>
      <groupId>com.azure.spring</groupId>
      <artifactId>spring-cloud-azure-docker-compose</artifactId>
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
      <groupId>com.azure</groupId>
      <artifactId>azure-messaging-eventhubs</artifactId>
    </dependency>
    <dependency>
      <groupId>com.azure.spring</groupId>
      <artifactId>spring-cloud-azure-stream-binder-eventhubs</artifactId>
    </dependency>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-test</artifactId>
      <scope>test</scope>
    </dependency>
    <dependency>
      <groupId>com.azure.spring</groupId>
      <artifactId>spring-cloud-azure-docker-compose</artifactId>
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
      <groupId>com.azure.spring</groupId>
      <artifactId>spring-messaging-azure-servicebus</artifactId>
    </dependency>
    <dependency>
      <groupId>com.azure.spring</groupId>
      <artifactId>spring-cloud-azure-starter</artifactId>
    </dependency>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-test</artifactId>
      <scope>test</scope>
    </dependency>
    <dependency>
      <groupId>com.azure.spring</groupId>
      <artifactId>spring-cloud-azure-docker-compose</artifactId>
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
      <groupId>com.azure.spring</groupId>
      <artifactId>spring-cloud-azure-stream-binder-servicebus</artifactId>
    </dependency>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-test</artifactId>
      <scope>test</scope>
    </dependency>
    <dependency>
      <groupId>com.azure.spring</groupId>
      <artifactId>spring-cloud-azure-autoconfigure</artifactId>
      <scope>test</scope>
    </dependency>
    <dependency>
      <groupId>com.azure.spring</groupId>
      <artifactId>spring-cloud-azure-docker-compose</artifactId>
      <scope>test</scope>
    </dependency>
  </dependencies>
```

---

## Create test resource files

Create these files in the `src/test/resources` folder:

### [Blob Storage](#tab/test-for-storage-blob)

`storage-compose.yaml`:

```yaml
services:
  storage:
    image: mcr.microsoft.com/azure-storage/azurite:latest
    ports:
      - '10000'
      - '10001'
      - '10002'
    command: azurite -l /data --blobHost 0.0.0.0 --queueHost 0.0.0.0 --tableHost 0.0.0.0 --skipApiVersionCheck
```

### [Queue Storage](#tab/test-for-storage-queue)

`storage-compose.yaml`:

```yaml
services:
  storage:
    image: mcr.microsoft.com/azure-storage/azurite:latest
    ports:
      - '10000'
      - '10001'
      - '10002'
    command: azurite -l /data --blobHost 0.0.0.0 --queueHost 0.0.0.0 --tableHost 0.0.0.0 --skipApiVersionCheck
```

### [Event Hubs](#tab/test-for-event-hubs)

`eventhubs-compose.yaml`:

```yaml
services:
  eventhubs:
    image: mcr.microsoft.com/azure-messaging/eventhubs-emulator:latest
    pull_policy: always
    volumes:
      # Mount the emulator configuration to the path expected by the emulator image
      - "./Config.json:/Eventhubs_Emulator/ConfigFiles/Config.json"
    ports:
      - "5672"
    environment:
      # Event Hubs emulator requires external blob/metadata storage provided by azurite
      BLOB_SERVER: azurite
      METADATA_SERVER: azurite
      ACCEPT_EULA: Y
    depends_on:
      - azurite
    networks:
      eh-emulator:
        aliases:
          - "eh-emulator"

  azurite:
    image: "mcr.microsoft.com/azure-storage/azurite:latest"
    ports:
      - "10000"
      - "10001"
      - "10002"
    networks:
      eh-emulator:
        aliases:
          - "azurite"

networks:
  eh-emulator:
```

`Config.json`:

```json
{
  "UserConfig": {
    "NamespaceConfig": [
      {
        "Type": "EventHub",
        "Name": "emulatorns1",
        "Entities": [
          {
            "Name": "eh1",
            "PartitionCount": "2",
            "ConsumerGroups": []
          }
        ]
      }
    ],
    "LoggingConfig": {
      "Type": "File"
    }
  }
}
```

### [Event Hubs Binder](#tab/test-for-event-hubs-binder)

`eventhubs-compose.yaml`:

```yaml
services:
  eventhubs:
    image: mcr.microsoft.com/azure-messaging/eventhubs-emulator:latest
    pull_policy: always
    volumes:
      # Mount the emulator configuration to the path expected by the emulator image
      - "./Config.json:/Eventhubs_Emulator/ConfigFiles/Config.json"
    ports:
      - "5672"
    environment:
      # Event Hubs emulator requires external blob/metadata storage provided by azurite
      BLOB_SERVER: azurite
      METADATA_SERVER: azurite
      ACCEPT_EULA: Y
    depends_on:
      - azurite
    networks:
      eh-emulator:
        aliases:
          - "eh-emulator"

  azurite:
    image: "mcr.microsoft.com/azure-storage/azurite:latest"
    command: "azurite -l /data --blobHost 0.0.0.0 --queueHost 0.0.0.0 --tableHost 0.0.0.0 --skipApiVersionCheck"
    ports:
      - "10000"
      - "10001"
      - "10002"
    networks:
      eh-emulator:
        aliases:
          - "azurite"

networks:
  eh-emulator:
```

`Config.json`:

```json
{
  "UserConfig": {
    "NamespaceConfig": [
      {
        "Type": "EventHub",
        "Name": "emulatorns1",
        "Entities": [
          {
            "Name": "eh1",
            "PartitionCount": "2",
            "ConsumerGroups": []
          }
        ]
      }
    ],
    "LoggingConfig": {
      "Type": "File"
    }
  }
}
```

### [Service Bus](#tab/test-for-service-bus)

`servicebus-compose.yaml`:

```yaml
services:
  servicebus:
    image: mcr.microsoft.com/azure-messaging/servicebus-emulator:latest
    pull_policy: always
    volumes:
      - "./Config.json:/ServiceBus_Emulator/ConfigFiles/Config.json"
    ports:
      - "5672"
    environment:
      SQL_SERVER: sqledge
      MSSQL_SA_PASSWORD: A_Str0ng_Required_Password
      ACCEPT_EULA: Y
    depends_on:
      - sqledge
    networks:
      sb-emulator:
        aliases:
          - "sb-emulator"
  sqledge:
    image: "mcr.microsoft.com/azure-sql-edge:latest"
    networks:
      sb-emulator:
        aliases:
          - "sqledge"
    environment:
      ACCEPT_EULA: Y
      MSSQL_SA_PASSWORD: A_Str0ng_Required_Password

networks:
  sb-emulator:
```

`Config.json`:

```json
{
  "UserConfig": {
    "Namespaces": [
      {
        "Name": "sbemulatorns",
        "Queues": [
          {
            "Name": "queue.1",
            "Properties": {
              "DeadLetteringOnMessageExpiration": false,
              "DefaultMessageTimeToLive": "PT1H",
              "DuplicateDetectionHistoryTimeWindow": "PT20S",
              "ForwardDeadLetteredMessagesTo": "",
              "ForwardTo": "",
              "LockDuration": "PT1M",
              "MaxDeliveryCount": 10,
              "RequiresDuplicateDetection": false,
              "RequiresSession": false
            }
          }
        ],

        "Topics": [
          {
            "Name": "topic.1",
            "Properties": {
              "DefaultMessageTimeToLive": "PT1H",
              "DuplicateDetectionHistoryTimeWindow": "PT20S",
              "RequiresDuplicateDetection": false
            },
            "Subscriptions": [
              {
                "Name": "subscription.1",
                "Properties": {
                  "DeadLetteringOnMessageExpiration": false,
                  "DefaultMessageTimeToLive": "PT1H",
                  "LockDuration": "PT1M",
                  "MaxDeliveryCount": 10,
                  "ForwardDeadLetteredMessagesTo": "",
                  "ForwardTo": "",
                  "RequiresSession": false
                },
                "Rules": [
                  {
                    "Name": "app-prop-filter-1",
                    "Properties": {
                      "FilterType": "Correlation",
                      "CorrelationFilter": {
                        "ContentType": "application/text",
                        "CorrelationId": "id1",
                        "Label": "subject1",
                        "MessageId": "msgid1",
                        "ReplyTo": "someQueue",
                        "ReplyToSessionId": "sessionId",
                        "SessionId": "session1",
                        "To": "xyz"
                      }
                    }
                  }
                ]
              },
              {
                "Name": "subscription.2",
                "Properties": {
                  "DeadLetteringOnMessageExpiration": false,
                  "DefaultMessageTimeToLive": "PT1H",
                  "LockDuration": "PT1M",
                  "MaxDeliveryCount": 10,
                  "ForwardDeadLetteredMessagesTo": "",
                  "ForwardTo": "",
                  "RequiresSession": false
                },
                "Rules": [
                  {
                    "Name": "user-prop-filter-1",
                    "Properties": {
                      "FilterType": "Correlation",
                      "CorrelationFilter": {
                        "Properties": {
                          "prop3": "value3"
                        }
                      }
                    }
                  }
                ]
              },
              {
                "Name": "subscription.3",
                "Properties": {
                  "DeadLetteringOnMessageExpiration": false,
                  "DefaultMessageTimeToLive": "PT1H",
                  "LockDuration": "PT1M",
                  "MaxDeliveryCount": 10,
                  "ForwardDeadLetteredMessagesTo": "",
                  "ForwardTo": "",
                  "RequiresSession": false
                }
              }
            ]
          }
        ]
      }
    ],
    "Logging": {
      "Type": "File"
    }
  }
}
```

### [Service Bus Binder](#tab/test-for-service-bus-binder)

`servicebus-compose.yaml`:

```yaml
services:
  servicebus:
    image: mcr.microsoft.com/azure-messaging/servicebus-emulator:latest
    pull_policy: always
    volumes:
      - "./Config.json:/ServiceBus_Emulator/ConfigFiles/Config.json"
    ports:
      - "5672"
    environment:
      SQL_SERVER: sqledge
      MSSQL_SA_PASSWORD: A_Str0ng_Required_Password
      ACCEPT_EULA: Y
    depends_on:
      - sqledge
    networks:
      sb-emulator:
        aliases:
          - "sb-emulator"
  sqledge:
    image: "mcr.microsoft.com/azure-sql-edge:latest"
    networks:
      sb-emulator:
        aliases:
          - "sqledge"
    environment:
      ACCEPT_EULA: Y
      MSSQL_SA_PASSWORD: A_Str0ng_Required_Password

networks:
  sb-emulator:
```

`Config.json`:

```json
{
  "UserConfig": {
    "Namespaces": [
      {
        "Name": "sbemulatorns",
        "Queues": [
          {
            "Name": "queue.1",
            "Properties": {
              "DeadLetteringOnMessageExpiration": false,
              "DefaultMessageTimeToLive": "PT1H",
              "DuplicateDetectionHistoryTimeWindow": "PT20S",
              "ForwardDeadLetteredMessagesTo": "",
              "ForwardTo": "",
              "LockDuration": "PT1M",
              "MaxDeliveryCount": 10,
              "RequiresDuplicateDetection": false,
              "RequiresSession": false
            }
          }
        ],

        "Topics": [
          {
            "Name": "topic.1",
            "Properties": {
              "DefaultMessageTimeToLive": "PT1H",
              "DuplicateDetectionHistoryTimeWindow": "PT20S",
              "RequiresDuplicateDetection": false
            },
            "Subscriptions": [
              {
                "Name": "subscription.1",
                "Properties": {
                  "DeadLetteringOnMessageExpiration": false,
                  "DefaultMessageTimeToLive": "PT1H",
                  "LockDuration": "PT1M",
                  "MaxDeliveryCount": 10,
                  "ForwardDeadLetteredMessagesTo": "",
                  "ForwardTo": "",
                  "RequiresSession": false
                },
                "Rules": [
                  {
                    "Name": "app-prop-filter-1",
                    "Properties": {
                      "FilterType": "Correlation",
                      "CorrelationFilter": {
                        "ContentType": "application/text",
                        "CorrelationId": "id1",
                        "Label": "subject1",
                        "MessageId": "msgid1",
                        "ReplyTo": "someQueue",
                        "ReplyToSessionId": "sessionId",
                        "SessionId": "session1",
                        "To": "xyz"
                      }
                    }
                  }
                ]
              },
              {
                "Name": "subscription.2",
                "Properties": {
                  "DeadLetteringOnMessageExpiration": false,
                  "DefaultMessageTimeToLive": "PT1H",
                  "LockDuration": "PT1M",
                  "MaxDeliveryCount": 10,
                  "ForwardDeadLetteredMessagesTo": "",
                  "ForwardTo": "",
                  "RequiresSession": false
                },
                "Rules": [
                  {
                    "Name": "user-prop-filter-1",
                    "Properties": {
                      "FilterType": "Correlation",
                      "CorrelationFilter": {
                        "Properties": {
                          "prop3": "value3"
                        }
                      }
                    }
                  }
                ]
              },
              {
                "Name": "subscription.3",
                "Properties": {
                  "DeadLetteringOnMessageExpiration": false,
                  "DefaultMessageTimeToLive": "PT1H",
                  "LockDuration": "PT1M",
                  "MaxDeliveryCount": 10,
                  "ForwardDeadLetteredMessagesTo": "",
                  "ForwardTo": "",
                  "RequiresSession": false
                }
              }
            ]
          }
        ]
      }
    ],
    "Logging": {
      "Type": "File"
    }
  }
}
```

---

## Create Java codes

The following code example demonstrates the basic usage of Docker compose:

### [Blob Storage](#tab/test-for-storage-blob)

```java
@SpringBootTest(properties = {
        "spring.docker.compose.skip.in-tests=false",
        "spring.docker.compose.file=classpath:storage-compose.yaml",
        "spring.docker.compose.stop.command=down"
})
public class AzureBlobResourceDockerComposeTest {

    @Value("azure-blob://testcontainers/message.txt")
    private Resource blobFile;

    @Test
    void blobResourceShouldWriteAndReadContent() throws IOException {
        String originalContent = "Hello World!";
        try (OutputStream os = ((WritableResource) this.blobFile).getOutputStream()) {
            os.write(originalContent.getBytes());
        }
        String resultContent = StreamUtils.copyToString(this.blobFile.getInputStream(), Charset.defaultCharset());
        assertThat(resultContent).isEqualTo(originalContent);
    }

    @Configuration(proxyBeanMethods = false)
    @ImportAutoConfiguration(classes = {
            AzureGlobalPropertiesAutoConfiguration.class,
            AzureStorageBlobAutoConfiguration.class,
            AzureStorageBlobResourceAutoConfiguration.class})
    static class Config {
    }
}
```

With `spring.docker.compose.file`, this configuration enables related beans in the app to communicate with Blob Storage running inside the Docker container. This action is done by automatically defining a `AzureStorageBlobConnectionDetails` bean, which is then used by the Blob Storage autoconfiguration, overriding any connection-related configuration properties.

### [Queue Storage](#tab/test-for-storage-queue)

```java
@SpringBootTest(properties = {
        "spring.docker.compose.skip.in-tests=false",
        "spring.docker.compose.file=classpath:storage-compose.yaml",
        "spring.docker.compose.stop.command=down",
        "spring.cloud.azure.storage.queue.queue-name=devstoreaccount1/tc-queue"
})
class StorageQueueDockerComposeTest {

    @Autowired
    private QueueClient queueClient;

    @Test
    void queueClientShouldSendAndReceiveMessage() {
        String message = "Hello World!";
        this.queueClient.create();
        this.queueClient.sendMessage(message);
        var messageItem = this.queueClient.receiveMessage();
        assertThat(messageItem.getBody().toString()).isEqualTo(message);
    }

    @Configuration
    @ImportAutoConfiguration(classes = {
            AzureGlobalPropertiesAutoConfiguration.class,
            AzureStorageQueueAutoConfiguration.class})
    static class Config {
    }

}
```

With `spring.docker.compose.file`, this configuration enables related beans in the app to communicate with Queue Storage running inside the Docker container. This action is done by automatically defining an `AzureStorageQueueConnectionDetails` bean, which is then used by the Queue Storage autoconfiguration, overriding any connection-related configuration properties.

### [Event Hubs](#tab/test-for-event-hubs)

```java
@SpringBootTest(properties = {
        "spring.docker.compose.skip.in-tests=false",
        "spring.docker.compose.file=classpath:eventhubs-compose.yaml",
        "spring.docker.compose.stop.command=down",
        "spring.docker.compose.readiness.timeout=PT5M",
        "spring.cloud.azure.eventhubs.event-hub-name=eh1",
        "spring.cloud.azure.eventhubs.producer.event-hub-name=eh1"
})
class EventHubsDockerComposeTest {

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
    @ImportAutoConfiguration(classes = {
            AzureGlobalPropertiesAutoConfiguration.class,
            AzureEventHubsAutoConfiguration.class})
    static class Config {
    }
}
```

With `spring.docker.compose.file`, this configuration enables related beans in the app to communicate with Event Hubs running inside the Docker container. This action is done by automatically defining an `AzureEventHubsConnectionDetails` bean, which is then used by the Event Hubs autoconfiguration, overriding any connection-related configuration properties.

### [Event Hubs Binder](#tab/test-for-event-hubs-binder)

```java
@SpringBootTest(properties = {
        "spring.docker.compose.skip.in-tests=false",
        "spring.docker.compose.file=classpath:eventhubs-compose.yaml",
        "spring.docker.compose.stop.command=down",
        "spring.docker.compose.readiness.timeout=PT5M",
        "spring.cloud.function.definition=consume;supply",
        "spring.cloud.stream.bindings.consume-in-0.destination=eh1",
        "spring.cloud.stream.bindings.consume-in-0.group=$Default",
        "spring.cloud.stream.bindings.supply-out-0.destination=eh1",
        "spring.cloud.stream.eventhubs.bindings.consume-in-0.consumer.checkpoint.mode=MANUAL",
        "spring.cloud.stream.poller.fixed-delay=1000",
        "spring.cloud.stream.poller.initial-delay=0"
})
class EventHubsDockerComposeTest {

    private static final Logger LOGGER = LoggerFactory.getLogger(EventHubsDockerComposeTest.class);
    private static final Set<String> RECEIVED_MESSAGES = ConcurrentHashMap.newKeySet();
    private static final AtomicInteger MESSAGE_SEQUENCE = new AtomicInteger(0);

    @Test
    void supplierAndConsumerShouldWorkThroughEventHub() {
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
        public BlobCheckpointStore blobCheckpointStore(AzureStorageBlobConnectionDetails connectionDetails) {
            BlobServiceAsyncClient blobServiceAsyncClient = new BlobServiceClientBuilder()
                    .connectionString(connectionDetails.getConnectionString())
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

With `spring.docker.compose.file`, this configuration enables related beans in the app to communicate with Event Hubs running inside the Docker container. This action is done by automatically defining an `AzureEventHubsConnectionDetails` bean, which is then used by the Event Hubs autoconfiguration, overriding any connection-related configuration properties.

### [Service Bus](#tab/test-for-service-bus)

```java
@SpringBootTest(properties = {
        "spring.docker.compose.skip.in-tests=false",
        "spring.docker.compose.file=classpath:servicebus-compose.yaml",
        "spring.docker.compose.stop.command=down",
        "spring.docker.compose.readiness.timeout=PT5M",
        "spring.cloud.azure.servicebus.namespace=sbemulatorns",
        "spring.cloud.azure.servicebus.entity-name=queue.1",
        "spring.cloud.azure.servicebus.entity-type=queue",
        "spring.cloud.azure.servicebus.producer.entity-name=queue.1",
        "spring.cloud.azure.servicebus.producer.entity-type=queue",
        "spring.cloud.azure.servicebus.processor.entity-name=queue.1",
        "spring.cloud.azure.servicebus.processor.entity-type=queue"
})
class ServiceBusDockerComposeTest {

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
        // The emulator depends on SQL Edge and needs time to initialize the messaging entities
        waitAtMost(Duration.ofSeconds(120)).pollInterval(Duration.ofSeconds(2)).untilAsserted(() -> {
            this.senderClient.sendMessage(new ServiceBusMessage("Hello World!"));
        });

        waitAtMost(Duration.ofSeconds(30)).pollDelay(Duration.ofSeconds(5)).untilAsserted(() -> {
            assertThat(Config.MESSAGES).contains("Hello World!");
        });
    }

    @Test
    void serviceBusTemplateCanSendMessage() {
        // Wait for Service Bus emulator to be fully ready and queue entity to be available
        // The emulator depends on SQL Edge and needs time to initialize the messaging entities
        waitAtMost(Duration.ofSeconds(120)).pollInterval(Duration.ofSeconds(2)).untilAsserted(() -> {
            this.serviceBusTemplate.sendAsync("queue.1",
                    MessageBuilder.withPayload("Hello from ServiceBusTemplate!").build()).block(Duration.ofSeconds(10));
        });

        waitAtMost(Duration.ofSeconds(30)).pollDelay(Duration.ofSeconds(5)).untilAsserted(() -> {
            assertThat(Config.MESSAGES).contains("Hello from ServiceBusTemplate!");
        });
    }

    @Configuration(proxyBeanMethods = false)
    @ImportAutoConfiguration(classes = {
            AzureGlobalPropertiesAutoConfiguration.class,
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

With `spring.docker.compose.file`, this configuration enables related beans in the app to communicate with Service Bus running inside the Docker container. This action is done by automatically defining an `AzureServiceBusConnectionDetails` bean, which is then used by the Service Bus autoconfiguration, overriding any connection-related configuration properties.

### [Service Bus Binder](#tab/test-for-service-bus-binder)

```java
@SpringBootTest(properties = {
        "spring.docker.compose.skip.in-tests=false",
        "spring.docker.compose.file=classpath:servicebus-compose.yaml",
        "spring.docker.compose.stop.command=down",
        "spring.cloud.function.definition=consume;supply",
        "spring.cloud.stream.bindings.consume-in-0.destination=queue.1",
        "spring.cloud.stream.bindings.supply-out-0.destination=queue.1",
        "spring.cloud.stream.servicebus.bindings.consume-in-0.consumer.auto-complete=false",
        "spring.cloud.stream.servicebus.bindings.supply-out-0.producer.entity-type=queue",
        "spring.cloud.stream.poller.fixed-delay=1000",
        "spring.cloud.stream.poller.initial-delay=0"
})
class ServiceBusDockerComposeTest {

    private static final Logger LOGGER = LoggerFactory.getLogger(ServiceBusDockerComposeTest.class);
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

With `spring.docker.compose.file`, this configuration enables related beans in the app to communicate with Service Bus running inside the Docker container. This action is done by automatically defining an `AzureServiceBusConnectionDetails` bean, which is then used by the Service Bus autoconfiguration, overriding any connection-related configuration properties.

---

## Samples

For more information, see the [spring-cloud-azure-docker-compose examples](https://github.com/Azure-Samples/azure-spring-boot-samples/tree/main/spring-cloud-azure-docker-compose).
