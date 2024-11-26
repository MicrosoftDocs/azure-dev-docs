---
title: Spring Cloud Stream support
description: This article describes how Spring Cloud Azure and Spring Cloud Stream can be used together.
ms.date: 04/06/2023
author: KarlErickson
ms.author: hangwan
ms.topic: reference
ms.custom: devx-track-java, devx-track-extended-java
---

# Spring Cloud Azure support for Spring Cloud Stream

**This article applies to:** ✅ Version 4.19.0 ✅ Version 5.18.0

Spring Cloud Stream is a framework for building highly scalable event-driven microservices connected with shared messaging systems.

The framework provides a flexible programming model built on already established and familiar Spring idioms and best practices. These best practices include support for persistent pub/sub semantics, consumer groups, and stateful partitions.

Current binder implementations include:

* `spring-cloud-azure-stream-binder-eventhubs` - for more information, see [Spring Cloud Stream Binder for Azure Event Hubs](#spring-cloud-stream-binder-for-azure-event-hubs)
* `spring-cloud-azure-stream-binder-servicebus` - for more information, see [Spring Cloud Stream Binder for Azure Service Bus](#spring-cloud-stream-binder-for-azure-service-bus)

## Spring Cloud Stream Binder for Azure Event Hubs

### Key concepts

The Spring Cloud Stream Binder for Azure Event Hubs provides the binding implementation for the Spring Cloud Stream framework.
This implementation uses Spring Integration Event Hubs Channel Adapters at its foundation. From design's perspective,
Event Hubs is similar as Kafka. Also, Event Hubs could be accessed via Kafka API. If your project has tight dependency
on Kafka API, you can try [Events Hub with Kafka API Sample](https://github.com/Azure-Samples/azure-spring-boot-samples/tree/main/eventhubs/spring-cloud-azure-starter/spring-cloud-azure-sample-eventhubs-kafka)

#### Consumer group

Event Hubs provides similar support of consumer group as Apache Kafka, but with slight different logic. While Kafka stores all committed offsets in the broker, you have to store offsets of Event Hubs messages being processed manually. Event Hubs SDK provides the function to store such offsets inside Azure Storage.

#### Partitioning support

Event Hubs provides a similar concept of physical partition as Kafka. But unlike Kafka's auto rebalancing between consumers and partitions, Event Hubs provides a kind of preemptive mode. The storage account acts as a lease to determine which consumer owns which partition. When a new consumer starts, it tries to steal some partitions from the most heavily loaded consumers to achieve the workload balance.

To specify the load balancing strategy, properties of `spring.cloud.stream.eventhubs.bindings.<binding-name>.consumer.load-balancing.*` are provided. For more information, see the [Consumer properties](#consumer-properties) section.

#### Batch consumer support

Spring Cloud Azure Stream Event Hubs binder supports [Spring Cloud Stream Batch Consumer feature](https://docs.spring.io/spring-cloud-stream/docs/current/reference/html/spring-cloud-stream.html#_batch_consumers).

To work with the batch-consumer mode, set the `spring.cloud.stream.bindings.<binding-name>.consumer.batch-mode` property to `true`. When enabled, a message with a payload of a list of batched events is received and passed to the `Consumer` function. Each message header is also converted to a list, of which the content is the associated header value parsed from each event. The communal headers of partition ID, checkpointer, and last enqueued properties are presented as a single value because the entire batch of events shares the same value. For more information, see the [Event Hubs message headers](spring-integration-support.md#event-hubs-message-headers) section of [Spring Cloud Azure support for Spring Integration](./spring-integration-support.md).

> [!NOTE]
> The checkpoint header only exists when the `MANUAL` checkpoint mode is used.

Checkpointing of batch consumer supports two modes: `BATCH` and `MANUAL`. `BATCH` mode is an auto checkpointing mode to checkpoint the entire batch of events together once the binder receives them. `MANUAL` mode is to checkpoint the events by users. When used, the `Checkpointer` is passed into the message header, and users could use it to do checkpointing.

You can specify the batch size by setting the `max-size` and `max-wait-time`  properties that have a prefix of `spring.cloud.stream.eventhubs.bindings.<binding-name>.consumer.batch.`. The `max-size` property is necessary and the `max-wait-time` property is optional. For more information, see the [Consumer properties](#consumer-properties) section.

### Dependency setup

```xml
<dependency>
    <groupId>com.azure.spring</groupId>
    <artifactId>spring-cloud-azure-stream-binder-eventhubs</artifactId>
</dependency>
```

Alternatively, you can also use the Spring Cloud Azure Stream Event Hubs Starter, as shown in the following example for Maven:

```xml
<dependency>
    <groupId>com.azure.spring</groupId>
    <artifactId>spring-cloud-azure-starter-stream-eventhubs</artifactId>
</dependency>
```

### Configuration

The binder provides the following three parts of configuration options:

#### Connection configuration properties

This section contains the configuration options used for connecting to Azure Event Hubs.

> [!NOTE]
> If you choose to use a security principal to authenticate and authorize with Microsoft Entra ID for accessing an Azure resource, see [Authorize access with Microsoft Entra ID](authentication.md#authorize-access-with-azure-active-directory) to make sure the security principal has been granted the sufficient permission to access the Azure resource.

Connection configurable properties of spring-cloud-azure-stream-binder-eventhubs:

> [!div class="mx-tdBreakAll"]
> | Property                                                 | Type    | Description                                                                                                                |
> |----------------------------------------------------------|---------|----------------------------------------------------------------------------------------------------------------------------|
> | **spring.cloud.azure.eventhubs**.enabled                 | boolean | Whether an Azure Event Hubs is enabled.                                                                                    |
> | **spring.cloud.azure.eventhubs**.connection-string       | String  | Event Hubs Namespace connection string value.                                                                              |
> | **spring.cloud.azure.eventhubs**.namespace               | String  | Event Hubs Namespace value, which is the prefix of the FQDN. A FQDN should be composed of NamespaceName.DomainName |
> | **spring.cloud.azure.eventhubs**.domain-name             | String  | Domain name of an Azure Event Hubs Namespace value.                                                                        |
> | **spring.cloud.azure.eventhubs**.custom-endpoint-address | String  | Custom Endpoint address.                                                                                                   |

> [!TIP]
> Common Azure Service SDK configuration options are configurable for the Spring Cloud Azure Stream Event Hubs binder as well. The supported configuration options are introduced in [Spring Cloud Azure configuration](configuration.md), and could be configured with either the unified prefix `spring.cloud.azure.` or the prefix of `spring.cloud.azure.eventhubs.`.

The binder also supports [Spring Could Azure Resource Manager](resource-manager.md) by default. To learn about how to retrieve the connection string with security principals that aren't granted with `Data` related roles, see the [Basic usage](resource-manager.md#basic-usage) section of [Spring Could Azure Resource Manager](resource-manager.md).

#### Checkpoint configuration properties

This section contains the configuration options for the Storage Blobs service, which is used for persisting partition ownership and checkpoint information.

> [!NOTE]
> From version 4.0.0, when the property of **spring.cloud.azure.eventhubs.processor.checkpoint-store.create-container-if-not-exists** isn't enabled manually, no Storage container will be created automatically with the name from **spring.cloud.stream.bindings.binding-name.destination**.

Checkpointing configurable properties of spring-cloud-azure-stream-binder-eventhubs:

> [!div class="mx-tdBreakAll"]
> | Property                                                                                   | Type    | Description                                         |
> |--------------------------------------------------------------------------------------------|---------|-----------------------------------------------------|
> | **spring.cloud.azure.eventhubs.processor.checkpoint-store**.create-container-if-not-exists | Boolean | Whether to allow creating containers if not exists. |
> | **spring.cloud.azure.eventhubs.processor.checkpoint-store**.account-name                   | String  | Name for the storage account.                       |
> | **spring.cloud.azure.eventhubs.processor.checkpoint-store**.account-key                    | String  | Storage account access key.                         |
> | **spring.cloud.azure.eventhubs.processor.checkpoint-store**.container-name                 | String  | Storage container name.                             |

> [!TIP]
> Common Azure Service SDK configuration options are configurable for Storage Blob checkpoint store as well. The supported configuration options are introduced in [Spring Cloud Azure configuration](configuration.md), and could be configured with either the unified prefix `spring.cloud.azure.` or the prefix of `spring.cloud.azure.eventhubs.processor.checkpoint-store`.

#### Azure Event Hubs Binding configuration properties

The following options are divided into four sections: Consumer Properties, Advanced Consumer Configurations, Producer Properties and Advanced Producer Configurations.

##### Consumer properties

These properties are exposed via `EventHubsConsumerProperties`.

> [!NOTE]
> To avoid repetition, since version 4.19.0 and 5.18.0, Spring Cloud Azure Stream Binder Event Hubs supports setting values for all channels, in the format of `spring.cloud.stream.eventhubs.default.consumer.<property>=<value>`.

Consumer configurable properties of spring-cloud-azure-stream-binder-eventhubs:

> [!div class="mx-tdBreakAll"]
> | Property                                                                                                                    | Type                                                                          | Description                                                                                                                                                                      |
> |-----------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
> | **spring.cloud.stream.eventhubs.bindings.binding-name.consumer**.checkpoint.mode                                        | CheckpointMode                                                                | Checkpoint mode used when consumer decide how to checkpoint message                                                                                                              |
> | **spring.cloud.stream.eventhubs.bindings.binding-name.consumer**.checkpoint.count                                       | Integer                                                                       | Decides the amount of message for each partition to do one checkpoint. Will take effect only when `PARTITION_COUNT` checkpoint mode is used.                                     |
> | **spring.cloud.stream.eventhubs.bindings.binding-name.consumer**.checkpoint.interval                                    | Duration                                                                      | Decides the time interval to do one checkpoint. Will take effect only when `TIME` checkpoint mode is used.                                                                       |
> | **spring.cloud.stream.eventhubs.bindings.<binding-name.consumer**.batch.max-size                                         | Integer                                                                       | The maximum number of events in a batch. Required for the batch-consumer mode.                                                                                                   |
> | **spring.cloud.stream.eventhubs.bindings.binding-name.consumer**.batch.max-wait-time                                    | Duration                                                                      | The maximum time duration for batch consuming. Will take effect only when the batch-consumer mode is enabled and is optional.                                                    |
> | **spring.cloud.stream.eventhubs.bindings.binding-name.consumer**.load-balancing.update-interval                         | Duration                                                                      | The interval time duration for updating.                                                                                                                                         |
> | **spring.cloud.stream.eventhubs.bindings.binding-name.consumer**.load-balancing.strategy                                | LoadBalancingStrategy                                                         | The load balancing strategy.                                                                                                                                                     |
> | **spring.cloud.stream.eventhubs.bindings.binding-name.consumer**.load-balancing.partition-ownership-expiration-interval | Duration                                                                      | The time duration after which the ownership of partition expires.                                                                                                                |
> | **spring.cloud.stream.eventhubs.bindings.binding-name.consumer**.track-last-enqueued-event-properties                   | Boolean                                                                       | Whether the event processor should request information on the last enqueued event on its associated partition, and track that information as events are received.                |
> | **spring.cloud.stream.eventhubs.bindings.binding-name.consumer**.prefetch-count                                         | Integer                                                                       | The count used by the consumer to control the number of events the Event Hub consumer will actively receive and queue locally.                                                   |
> | **spring.cloud.stream.eventhubs.bindings.binding-name.consumer**.initial-partition-event-position                       | Map with the key as the partition ID, and values of `StartPositionProperties` | The map containing the event position to use for each partition if a checkpoint for the partition does not exist in checkpoint store. This map is keyed off of the partition ID. |

> [!NOTE]
> The `initial-partition-event-position` configuration accepts a `map` to specify the initial position for each event hub. Thus, its key is the partition ID, and the value is of `StartPositionProperties`, which includes properties of offset, sequence number, enqueued date time and whether inclusive. For example, you can set it as

```yaml
spring:
  cloud:
    stream:
      eventhubs:
        bindings:
          <binding-name>:
            consumer:
              initial-partition-event-position:
                0:
                  offset: earliest
                1:
                  sequence-number: 100
                2:
                  enqueued-date-time: 2022-01-12T13:32:47.650005Z
                4:
                  inclusive: false
```

##### Advanced consumer configuration

The above [connection](#connection-configuration-properties), [checkpoint](#checkpoint-configuration-properties), and [common Azure SDK client](configuration.md) configuration support customization for each binder consumer, which you can configure with the prefix `spring.cloud.stream.eventhubs.bindings.<binding-name>.consumer.`.

##### Producer properties

These properties are exposed via `EventHubsProducerProperties`.

> [!NOTE]
> To avoid repetition, since version 4.19.0 and 5.18.0, Spring Cloud Azure Stream Binder Event Hubs supports setting values for all channels, in the format of `spring.cloud.stream.eventhubs.default.producer.<property>=<value>`.

Producer configurable properties of spring-cloud-azure-stream-binder-eventhubs:

> [!div class="mx-tdBreakAll"]
> | Property                                                                          | Type    | Description                                                                                                              |
> |-----------------------------------------------------------------------------------|---------|--------------------------------------------------------------------------------------------------------------------------|
> | **spring.cloud.stream.eventhubs.bindings.binding-name.producer**.sync         | boolean | The switch flag for sync of producer. If true, the producer will wait for a response after a send operation.             |
> | **spring.cloud.stream.eventhubs.bindings.binding-name.producer**.send-timeout | long    | The amount of time to wait for a response after a send operation. Will take effect only when a sync producer is enabled. |

##### Advanced producer configuration

The above [connection](#connection-configuration-properties) and [common Azure SDK client](configuration.md) configuration support customization for each binder producer, which you can configure with the prefix `spring.cloud.stream.eventhubs.bindings.<binding-name>.producer.`.

### Basic usage

#### Sending and receiving messages from/to Event Hubs

1. Fill the configuration options with credential information.

   * For credentials as connection string, configure the following properties in your *application.yml* file:

     ```yaml
     spring:
       cloud:
         azure:
           eventhubs:
             connection-string: ${EVENTHUB_NAMESPACE_CONNECTION_STRING}
             processor:
               checkpoint-store:
                 container-name: ${CHECKPOINT_CONTAINER}
                 account-name: ${CHECKPOINT_STORAGE_ACCOUNT}
                 account-key: ${CHECKPOINT_ACCESS_KEY}
         function:
           definition: consume;supply
         stream:
           bindings:
             consume-in-0:
               destination: ${EVENTHUB_NAME}
               group: ${CONSUMER_GROUP}
             supply-out-0:
               destination: ${THE_SAME_EVENTHUB_NAME_AS_ABOVE}
           eventhubs:
             bindings:
               consume-in-0:
                 consumer:
                   checkpoint:
                     mode: MANUAL
     ```

   * For credentials as service principal, configure the following properties in your *application.yml* file:

     ```yaml
     spring:
       cloud:
         azure:
           credential:
             client-id: ${AZURE_CLIENT_ID}
             client-secret: ${AZURE_CLIENT_SECRET}
           profile:
             tenant-id: <tenant>
           eventhubs:
             namespace: ${EVENTHUB_NAMESPACE}
             processor:
               checkpoint-store:
                 container-name: ${CONTAINER_NAME}
                 account-name: ${ACCOUNT_NAME}
         function:
           definition: consume;supply
         stream:
           bindings:
             consume-in-0:
               destination: ${EVENTHUB_NAME}
               group: ${CONSUMER_GROUP}
             supply-out-0:
               destination: ${THE_SAME_EVENTHUB_NAME_AS_ABOVE}
           eventhubs:
             bindings:
               consume-in-0:
                 consumer:
                   checkpoint:
                     mode: MANUAL
     ```

> [!NOTE]
> The values allowed for `tenant-id` are: `common`, `organizations`, `consumers`, or the tenant ID. For more information about these values, see the [Used the wrong endpoint (personal and organization accounts)](/troubleshoot/azure/active-directory/error-code-aadsts50020-user-account-identity-provider-does-not-exist#cause-3-used-the-wrong-endpoint-personal-and-organization-accounts) section of [Error AADSTS50020 - User account from identity provider does not exist in tenant](/troubleshoot/azure/active-directory/error-code-aadsts50020-user-account-identity-provider-does-not-exist). For information on converting your single-tenant app, see [Convert single-tenant app to multitenant on Microsoft Entra ID](/entra/identity-platform/howto-convert-app-to-be-multi-tenant).

   * For credentials as managed identities, configure the following properties in your *application.yml* file:

     ```yaml
     spring:
       cloud:
         azure:
           credential:
             managed-identity-enabled: true
             client-id: ${AZURE_MANAGED_IDENTITY_CLIENT_ID} # Only needed when using a user-assigned managed identity
           eventhubs:
             namespace: ${EVENTHUB_NAMESPACE}
             processor:
               checkpoint-store:
                 container-name: ${CONTAINER_NAME}
                 account-name: ${ACCOUNT_NAME}
         function:
           definition: consume;supply
         stream:
           bindings:
             consume-in-0:
               destination: ${EVENTHUB_NAME}
               group: ${CONSUMER_GROUP}
             supply-out-0:
               destination: ${THE_SAME_EVENTHUB_NAME_AS_ABOVE}

           eventhubs:
             bindings:
               consume-in-0:
                 consumer:
                   checkpoint:
                     mode: MANUAL
     ```

1. Define supplier and consumer.

   ```java
   @Bean
   public Consumer<Message<String>> consume() {
       return message -> {
           Checkpointer checkpointer = (Checkpointer) message.getHeaders().get(CHECKPOINTER);
           LOGGER.info("New message received: '{}', partition key: {}, sequence number: {}, offset: {}, enqueued time: {}",
                   message.getPayload(),
                   message.getHeaders().get(EventHubsHeaders.PARTITION_KEY),
                   message.getHeaders().get(EventHubsHeaders.SEQUENCE_NUMBER),
                   message.getHeaders().get(EventHubsHeaders.OFFSET),
                   message.getHeaders().get(EventHubsHeaders.ENQUEUED_TIME)
           );

           checkpointer.success()
                   .doOnSuccess(success -> LOGGER.info("Message '{}' successfully checkpointed", message.getPayload()))
                   .doOnError(error -> LOGGER.error("Exception found", error))
                   .block();
       };
   }

   @Bean
   public Supplier<Message<String>> supply() {
       return () -> {
           LOGGER.info("Sending message, sequence " + i);
           return MessageBuilder.withPayload("Hello world, " + i++).build();
       };
   }
   ```

#### Partitioning support

A `PartitionSupplier` with user-provided partition information is created to configure the partition information about the message to be sent. The following flowchart shows the process of obtaining different priorities for the partition ID and key:

:::image type="content" source="media/spring-cloud-azure/flowchart-partitioning-support.png" alt-text="Diagram showing a flowchart of the partitioning support process." border="false":::

#### Batch consumer support

1. Provide the batch configuration options, as shown in the following example:

   ```yaml
   spring:
     cloud:
       function:
         definition: consume
       stream:
         bindings:
           consume-in-0:
             destination: ${AZURE_EVENTHUB_NAME}
             group: ${AZURE_EVENTHUB_CONSUMER_GROUP}
             consumer:
               batch-mode: true
         eventhubs:
           bindings:
             consume-in-0:
               consumer:
                 batch:
                   max-batch-size: 10 # Required for batch-consumer mode
                   max-wait-time: 1m # Optional, the default value is null
                 checkpoint:
                   mode: BATCH # or MANUAL as needed
   ```

1. Define supplier and consumer.

   For checkpointing mode as `BATCH`, you can use the following code to send messages and consume in batches.

   ```java
   @Bean
   public Consumer<Message<List<String>>> consume() {
       return message -> {
           for (int i = 0; i < message.getPayload().size(); i++) {
               LOGGER.info("New message received: '{}', partition key: {}, sequence number: {}, offset: {}, enqueued time: {}",
                       message.getPayload().get(i),
                       ((List<Object>) message.getHeaders().get(EventHubsHeaders.BATCH_CONVERTED_PARTITION_KEY)).get(i),
                       ((List<Object>) message.getHeaders().get(EventHubsHeaders.BATCH_CONVERTED_SEQUENCE_NUMBER)).get(i),
                       ((List<Object>) message.getHeaders().get(EventHubsHeaders.BATCH_CONVERTED_OFFSET)).get(i),
                       ((List<Object>) message.getHeaders().get(EventHubsHeaders.BATCH_CONVERTED_ENQUEUED_TIME)).get(i));
           }
       };
   }

   @Bean
   public Supplier<Message<String>> supply() {
       return () -> {
           LOGGER.info("Sending message, sequence " + i);
           return MessageBuilder.withPayload("\"test"+ i++ +"\"").build();
       };
   }
   ```

   For checkpointing mode as `MANUAL`, you can use the following code to send messages and consume/checkpoint in batches.

   ```java
   @Bean
   public Consumer<Message<List<String>>> consume() {
       return message -> {
           for (int i = 0; i < message.getPayload().size(); i++) {
               LOGGER.info("New message received: '{}', partition key: {}, sequence number: {}, offset: {}, enqueued time: {}",
                   message.getPayload().get(i),
                   ((List<Object>) message.getHeaders().get(EventHubHeaders.BATCH_CONVERTED_PARTITION_KEY)).get(i),
                   ((List<Object>) message.getHeaders().get(EventHubHeaders.BATCH_CONVERTED_SEQUENCE_NUMBER)).get(i),
                   ((List<Object>) message.getHeaders().get(EventHubHeaders.BATCH_CONVERTED_OFFSET)).get(i),
                   ((List<Object>) message.getHeaders().get(EventHubHeaders.BATCH_CONVERTED_ENQUEUED_TIME)).get(i));
           }

           Checkpointer checkpointer = (Checkpointer) message.getHeaders().get(CHECKPOINTER);
           checkpointer.success()
                       .doOnSuccess(success -> LOGGER.info("Message '{}' successfully checkpointed", message.getPayload()))
                       .doOnError(error -> LOGGER.error("Exception found", error))
                       .block();
       };
   }

   @Bean
   public Supplier<Message<String>> supply() {
       return () -> {
           LOGGER.info("Sending message, sequence " + i);
           return MessageBuilder.withPayload("\"test"+ i++ +"\"").build();
       };
   }
   ```

> [!NOTE]
> In the batch-consuming mode, the default content type of Spring Cloud Stream binder is `application/json`, so make sure the message payload is aligned with the content type. For example, when using the default content type of `application/json` to receive messages with `String` payload, the payload should be `JSON String`, surrounded with double quotes for the original `String` text. While for `text/plain` content type, it can be a `String` object directly. For more information, see [Spring Cloud Stream Content Type Negotiation](https://docs.spring.io/spring-cloud-stream/docs/current/reference/html/spring-cloud-stream.html#content-type-management).

#### Handle error messages

##### [Spring Cloud Azure 4.x](#tab/SpringCloudAzure4x)

* Handle outbound binding error messages

  By default, Spring Integration creates a global error channel called `errorChannel`. Configure the following message endpoint to handle outbound binding error messages:

  ```java
  @ServiceActivator(inputChannel = IntegrationContextUtils.ERROR_CHANNEL_BEAN_NAME)
  public void handleError(ErrorMessage message) {
      LOGGER.error("Handling outbound binding error: " + message);
  }
  ```

* Handle inbound binding error messages

  Spring Cloud Stream Event Hubs Binder supports two solutions to handle errors for the inbound message bindings: custom error channels and handlers.

  **Error channel**:

  Spring Cloud Stream provides an error channel for each inbound binding. An `ErrorMessage` is sent to the error channel. For more information, see [Handling Errors](https://docs.spring.io/spring-cloud-stream/docs/3.2.6/reference/html/spring-cloud-stream.html#polled-errors) in the Spring Cloud Stream documentation.

  * Default error channel

    You can use a global error channel named `errorChannel` to consume all inbound binding error messages. To handle these messages, configure the following message endpoint:

    ```java
    @ServiceActivator(inputChannel = IntegrationContextUtils.ERROR_CHANNEL_BEAN_NAME)
    public void handleError(ErrorMessage message) {
        LOGGER.error("Handling inbound binding error: " + message);
    }
    ```

  * Binding-specific error channel

    You can use a specific error channel to consume the specific inbound binding error messages with a higher priority than the default error channel. To handle these messages, configure the following message endpoint:

    ```java
    // Replace destination with spring.cloud.stream.bindings.<input-binding-name>.destination
    // Replace group with spring.cloud.stream.bindings.<input-binding-name>.group
    @ServiceActivator(inputChannel = "{destination}.{group}.errors")
    public void handleError(ErrorMessage message) {
        LOGGER.error("Handling inbound binding error: " + message);
    }
    ```

    > [!NOTE]
    > The binding-specific error channel is mutually exclusive with other provided error handlers and channels.

  **Error Handler**:

  Spring Cloud Stream exposes a mechanism for you to provide a custom error handler by adding a `Consumer` that accepts `ErrorMessage` instances. For more information, see [Error Handling](https://docs.spring.io/spring-cloud-stream/docs/3.2.6/reference/html/spring-cloud-stream.html#spring-cloud-stream-overview-error-handling) in the Spring Cloud Stream documentation.

  > [!NOTE]
  > When any binding error handler is configured, it can work with the default error channel.

  * Binding-default error handler

    Configure a single `Consumer` bean to consume all inbound binding error messages. The following default function subscribes to each inbound binding error channel:

    ```java
    @Bean
    public Consumer<ErrorMessage> myDefaultHandler() {
        return message -> {
            // consume the error message
        };
    }
    ```

    You also need to set the `spring.cloud.stream.default.error-handler-definition` property to the function name.

  * Binding-specific error handler

    Configure a `Consumer` bean to consume the specific inbound binding error messages. The following function subscribes to the specific inbound binding error channel and has a higher priority than the binding-default error handler:

    ```java
    @Bean
    public Consumer<ErrorMessage> myErrorHandler() {
        return message -> {
            // consume the error message
        };
    }
    ```

    You also need to set the `spring.cloud.stream.bindings.<input-binding-name>.error-handler-definition` property to the function name.

##### [Spring Cloud Azure 5.x](#tab/SpringCloudAzure5x)

* Handle outbound binding error messages

  By default, Spring Integration creates a global error channel called `errorChannel`. Configure the following message endpoint to handle outbound binding error messages.

  ```java
  @ServiceActivator(inputChannel = IntegrationContextUtils.ERROR_CHANNEL_BEAN_NAME)
  public void handleError(ErrorMessage message) {
      LOGGER.error("Handling outbound binding error: " + message);
  }
  ```

* Handle inbound binding error messages

  Spring Cloud Stream Event Hubs Binder supports one solution to handle errors for the inbound message bindings: error handlers.

  **Error Handler**:

  Spring Cloud Stream exposes mechanism for you to provide custom error handler by adding `Consumer` that accepts `ErrorMessage` instances. For more information, see [Handle Error Messages](https://docs.spring.io/spring-cloud-stream/docs/current/reference/html/spring-cloud-stream.html#_handle_error_messages) in the Spring Cloud Stream documentation.

  * Binding-default error handler

    Configure a single `Consumer` bean to consume all inbound binding error messages. The following default function subscribes to each inbound binding error channel.

    ```java
    @Bean
    public Consumer<ErrorMessage> myDefaultHandler() {
        return message -> {
            // consume the error message
        };
    }
    ```

    You also need to set the `spring.cloud.stream.default.error-handler-definition` property to the function name.

  * Binding-specific error handler

    Configure a `Consumer` bean to consume the specific inbound binding error messages. The following function subscribes to the specific inbound binding error channel and has a higher priority than the binding-default error handler.

    ```java
    @Bean
    public Consumer<ErrorMessage> myErrorHandler() {
        return message -> {
            // consume the error message
        };
    }
    ```

    You also need to set the `spring.cloud.stream.bindings.<input-binding-name>.error-handler-definition` property to the function name.

---

#### Event Hubs message headers

For the basic message headers supported, see the [Event Hubs message headers](spring-integration-support.md#event-hubs-message-headers) section of [Spring Cloud Azure support for Spring Integration](./spring-integration-support.md).

#### Multiple binder support

Connection to multiple Event Hubs namespaces is also supported by using multiple binders. This sample takes a connection string as example. Credentials of service principals and managed identities are also supported. You can set related properties in each binder's environment settings.

1. To use multiple binders with Event Hubs, configure the following properties in your *application.yml* file:

   ```yaml
   spring:
     cloud:
       function:
         definition: consume1;supply1;consume2;supply2
       stream:
         bindings:
           consume1-in-0:
             destination: ${EVENTHUB_NAME_01}
             group: ${CONSUMER_GROUP_01}
           supply1-out-0:
             destination: ${THE_SAME_EVENTHUB_NAME_01_AS_ABOVE}
           consume2-in-0:
             binder: eventhub-2
             destination: ${EVENTHUB_NAME_02}
             group: ${CONSUMER_GROUP_02}
           supply2-out-0:
             binder: eventhub-2
             destination: ${THE_SAME_EVENTHUB_NAME_02_AS_ABOVE}
         binders:
           eventhub-1:
             type: eventhubs
             default-candidate: true
             environment:
               spring:
                 cloud:
                   azure:
                     eventhubs:
                       connection-string: ${EVENTHUB_NAMESPACE_01_CONNECTION_STRING}
                       processor:
                         checkpoint-store:
                           container-name: ${CHECKPOINT_CONTAINER_01}
                           account-name: ${CHECKPOINT_STORAGE_ACCOUNT}
                           account-key: ${CHECKPOINT_ACCESS_KEY}
           eventhub-2:
             type: eventhubs
             default-candidate: false
             environment:
               spring:
                 cloud:
                   azure:
                     eventhubs:
                       connection-string: ${EVENTHUB_NAMESPACE_02_CONNECTION_STRING}
                       processor:
                         checkpoint-store:
                           container-name: ${CHECKPOINT_CONTAINER_02}
                           account-name: ${CHECKPOINT_STORAGE_ACCOUNT}
                           account-key: ${CHECKPOINT_ACCESS_KEY}
         eventhubs:
           bindings:
             consume1-in-0:
               consumer:
                 checkpoint:
                   mode: MANUAL
             consume2-in-0:
               consumer:
                 checkpoint:
                   mode: MANUAL
         poller:
           initial-delay: 0
           fixed-delay: 1000
   ```

   > [!NOTE]
   > The previous application file shows how to configure a single default poller for application to all bindings. If you want to configure the poller for a specific binding, you can use a configuration such as `spring.cloud.stream.bindings.<binding-name>.producer.poller.fixed-delay=3000`.

1. We need define two suppliers and two consumers:

   ```java
   @Bean
   public Supplier<Message<String>> supply1() {
       return () -> {
           LOGGER.info("Sending message1, sequence1 " + i);
           return MessageBuilder.withPayload("Hello world1, " + i++).build();
       };
   }

   @Bean
   public Supplier<Message<String>> supply2() {
       return () -> {
           LOGGER.info("Sending message2, sequence2 " + j);
           return MessageBuilder.withPayload("Hello world2, " + j++).build();
       };
   }

   @Bean
   public Consumer<Message<String>> consume1() {
       return message -> {
           Checkpointer checkpointer = (Checkpointer) message.getHeaders().get(CHECKPOINTER);
           LOGGER.info("New message1 received: '{}'", message);
           checkpointer.success()
                   .doOnSuccess(success -> LOGGER.info("Message1 '{}' successfully checkpointed", message))
                   .doOnError(error -> LOGGER.error("Exception found", error))
                   .block();
       };
   }

   @Bean
   public Consumer<Message<String>> consume2() {
       return message -> {
           Checkpointer checkpointer = (Checkpointer) message.getHeaders().get(CHECKPOINTER);
           LOGGER.info("New message2 received: '{}'", message);
           checkpointer.success()
                   .doOnSuccess(success -> LOGGER.info("Message2 '{}' successfully checkpointed", message))
                   .doOnError(error -> LOGGER.error("Exception found", error))
                   .block();
       };
   }
   ```

#### Resource provisioning

Event Hubs binder supports provisioning of event hub and consumer group, users could use the following properties to enable provisioning.

```yaml
spring:
  cloud:
    azure:
      credential:
        tenant-id: <tenant>
      profile:
        subscription-id: ${AZURE_SUBSCRIPTION_ID}
      eventhubs:
        resource:
          resource-group: ${AZURE_EVENTHUBS_RESOURECE_GROUP}
```

> [!NOTE]
> The values allowed for `tenant-id` are: `common`, `organizations`, `consumers`, or the tenant ID. For more information about these values, see the [Used the wrong endpoint (personal and organization accounts)](/troubleshoot/azure/active-directory/error-code-aadsts50020-user-account-identity-provider-does-not-exist#cause-3-used-the-wrong-endpoint-personal-and-organization-accounts) section of [Error AADSTS50020 - User account from identity provider does not exist in tenant](/troubleshoot/azure/active-directory/error-code-aadsts50020-user-account-identity-provider-does-not-exist). For information on converting your single-tenant app, see [Convert single-tenant app to multitenant on Microsoft Entra ID](/entra/identity-platform/howto-convert-app-to-be-multi-tenant).

### Samples

For more information, see the [azure-spring-boot-samples](https://github.com/Azure-Samples/azure-spring-boot-samples/tree/main/eventhubs/spring-cloud-azure-stream-binder-eventhubs) repository on GitHub.

## Spring Cloud Stream Binder for Azure Service Bus

### Key concepts

The Spring Cloud Stream Binder for Azure Service Bus provides the binding implementation for the Spring Cloud Stream Framework.
This implementation uses Spring Integration Service Bus Channel Adapters at its foundation.

#### Scheduled message

This binder supports submitting messages to a topic for delayed processing. Users can send scheduled messages with header `x-delay`
expressing in milliseconds a delay time for the message. The message will be delivered to the respective topics after `x-delay` milliseconds.

#### Consumer group

Service Bus Topic provides similar support of consumer group as Apache Kafka, but with slight different logic.
This binder relies on `Subscription` of a topic to act as a consumer group.

### Dependency setup

```xml
<dependency>
    <groupId>com.azure.spring</groupId>
    <artifactId>spring-cloud-azure-stream-binder-servicebus</artifactId>
</dependency>
```

Alternatively, you can also use the Spring Cloud Azure Stream Service Bus Starter, as shown in the following example for Maven:

```xml
<dependency>
    <groupId>com.azure.spring</groupId>
    <artifactId>spring-cloud-azure-starter-stream-servicebus</artifactId>
</dependency>
```

### Configuration

The binder provides the following two parts of configuration options:

#### Connection configuration properties

This section contains the configuration options used for connecting to Azure Service Bus.

> [!NOTE]
> If you choose to use a security principal to authenticate and authorize with Microsoft Entra ID for accessing an Azure resource, see [Authorize access with Microsoft Entra ID](authentication.md#authorize-access-with-azure-active-directory) to make sure the security principal has been granted the sufficient permission to access the Azure resource.

Connection configurable properties of spring-cloud-azure-stream-binder-servicebus:

> [!div class="mx-tdBreakAll"]
> | Property                                            | Type    | Description                                                                                                                 |
> |-----------------------------------------------------|---------|-----------------------------------------------------------------------------------------------------------------------------|
> | **spring.cloud.azure.servicebus**.enabled           | boolean | Whether an Azure Service Bus is enabled.                                                                                    |
> | **spring.cloud.azure.servicebus**.connection-string | String  | Service Bus Namespace connection string value.                                                                              |
> | **spring.cloud.azure.servicebus**.custom-endpoint-address | String  | The custom endpoint address to use when connecting to Service Bus.                                                                              |
> | **spring.cloud.azure.servicebus**.namespace         | String  | Service Bus Namespace value, which is the prefix of the FQDN. A FQDN should be composed of NamespaceName.DomainName |
> | **spring.cloud.azure.servicebus**.domain-name       | String  | Domain name of an Azure Service Bus Namespace value.                                                                        |

> [!NOTE]
> Common Azure Service SDK configuration options are configurable for the Spring Cloud Azure Stream Service Bus binder as well. The supported configuration options are introduced in [Spring Cloud Azure configuration](configuration.md), and could be configured with either the unified prefix `spring.cloud.azure.` or the prefix of `spring.cloud.azure.servicebus.`.

The binder also supports [Spring Could Azure Resource Manager](resource-manager.md) by default. To learn about how to retrieve the connection string with security principals that aren't granted with `Data` related roles, see the [Basic usage](resource-manager.md#basic-usage) section of [Spring Could Azure Resource Manager](resource-manager.md).

#### Azure Service Bus binding configuration properties

The following options are divided into four sections: Consumer Properties, Advanced Consumer
Configurations, Producer Properties and Advanced Producer Configurations.

##### Consumer properties

These properties are exposed via `ServiceBusConsumerProperties`.

> [!NOTE]
> To avoid repetition, since version 4.19.0 and 5.18.0, Spring Cloud Azure Stream Binder Service Bus supports setting values for all channels, in the format of `spring.cloud.stream.servicebus.default.consumer.<property>=<value>`.

Consumer configurable properties of spring-cloud-azure-stream-binder-servicebus:

> [!div class="mx-tdBreakAll"]
> | Property                                                                                           | Type                  | Default   | Description                                                                                                 |
> |----------------------------------------------------------------------------------------------------|-----------------------|-----------|-------------------------------------------------------------------------------------------------------------|
> | **spring.cloud.stream.servicebus.bindings.binding-name.consumer**.requeue-rejected             | boolean               | false     | If the failed messages are routed to the DLQ.                                                               |
> | **spring.cloud.stream.servicebus.bindings.binding-name.consumer**.max-concurrent-calls         | Integer               | 1         | Max concurrent messages that the Service Bus processor client should process. When session enabled, it applies to each session.                              |
> | **spring.cloud.stream.servicebus.bindings.binding-name.consumer**.max-concurrent-sessions      | Integer               | null      | Maximum number of concurrent sessions to process at any given time.                                         |
> | **spring.cloud.stream.servicebus.bindings.binding-name.consumer**.session-enabled              | Boolean               | null      | Whether session is enabled.                                                                                 |
> | **spring.cloud.stream.servicebus.bindings.binding-name.consumer**.prefetch-count               | Integer               | 0         | The prefetch count of the Service Bus processor client.                                                     |
> | **spring.cloud.stream.servicebus.bindings.binding-name.consumer**.sub-queue                    | SubQueue              | none      | The type of the sub queue to connect to.                                                                    |
> | **spring.cloud.stream.servicebus.bindings.binding-name.consumer**.max-auto-lock-renew-duration | Duration              | 5m        | The amount of time to continue auto-renewing the lock.                                                      |
> | **spring.cloud.stream.servicebus.bindings.binding-name.consumer**.receive-mode                 | ServiceBusReceiveMode | peek_lock | The receive mode of the Service Bus processor client.                                                       |
> | **spring.cloud.stream.servicebus.bindings.binding-name.consumer**.auto-complete                | Boolean               | true      | Whether to settle messages automatically. If set as false, a message header of `Checkpointer` will be added to enable developers to settle messages manually.     |

> [!IMPORTANT]
> When you use the [Azure Resource Manager](resource-manager.md) (ARM), you must configure the `spring.cloud.stream.servicebus.bindings.<binding-name>.consume.entity-type` property. For more information, see the [servicebus-queue-binder-arm](https://github.com/Azure-Samples/azure-spring-boot-samples/tree/main/servicebus/spring-cloud-azure-stream-binder-servicebus/servicebus-queue-binder-arm) sample on GitHub.

##### Advanced consumer configuration

The above [connection](#connection-configuration-properties-1) and [common Azure SDK client](configuration.md) configuration support customization for each binder consumer, which you can configure with the prefix `spring.cloud.stream.servicebus.bindings.<binding-name>.consumer.`.

##### Producer properties

These properties are exposed via `ServiceBusProducerProperties`.

> [!NOTE]
> To avoid repetition, since version 4.19.0 and 5.18.0, Spring Cloud Azure Stream Binder Service Bus supports setting values for all channels, in the format of `spring.cloud.stream.servicebus.default.producer.<property>=<value>`.

Producer configurable properties of spring-cloud-azure-stream-binder-servicebus:

> [!div class="mx-tdBreakAll"]
> | Property                                                                       | Type                 | Default | Description                                                                        |
> |--------------------------------------------------------------------------------|----------------------|---------|------------------------------------------------------------------------------------|
> | **spring.cloud.stream.servicebus.bindings.binding-name.producer**.sync         | boolean              | false   | Switch flag for sync of producer.                                                  |
> | **spring.cloud.stream.servicebus.bindings.binding-name.producer**.send-timeout | long                 | 10000   | Timeout value for sending of producer.                                             |
> | **spring.cloud.stream.servicebus.bindings.binding-name.producer**.entity-type  | ServiceBusEntityType | null    | Service Bus entity type of the producer, required for the binding producer. |

> [!IMPORTANT]
> When using the binding producer, property of `spring.cloud.stream.servicebus.bindings.<binding-name>.producer.entity-type` is required to be configured.

##### Advanced producer configuration

The above [connection](#connection-configuration-properties-1) and [common Azure SDK client](configuration.md) configuration support customization for each binder producer, which you can configure with the prefix `spring.cloud.stream.servicebus.bindings.<binding-name>.producer.`.

### Basic usage

#### Sending and receiving messages from/to Service Bus

1. Fill the configuration options with credential information.

   * For credentials as connection string, configure the following properties in your *application.yml* file:

     ```yaml
         spring:
           cloud:
             azure:
               servicebus:
                 connection-string: ${SERVICEBUS_NAMESPACE_CONNECTION_STRING}
             function:
               definition: consume;supply
             stream:
               bindings:
                 consume-in-0:
                   destination: ${SERVICEBUS_ENTITY_NAME}
                   # If you use Service Bus Topic, add the following configuration
                   # group: ${SUBSCRIPTION_NAME}
                 supply-out-0:
                   destination: ${SERVICEBUS_ENTITY_NAME_SAME_AS_ABOVE}
               servicebus:
                 bindings:
                   consume-in-0:
                     consumer:
                       auto-complete: false
                   supply-out-0:
                     producer:
                       entity-type: queue # set as "topic" if you use Service Bus Topic
     ```

   * For credentials as service principal, configure the following properties in your *application.yml* file:

     ```yaml
         spring:
           cloud:
             azure:
               credential:
                 client-id: ${AZURE_CLIENT_ID}
                 client-secret: ${AZURE_CLIENT_SECRET}
               profile:
                 tenant-id: <tenant>
               servicebus:
                 namespace: ${SERVICEBUS_NAMESPACE}
             function:
               definition: consume;supply
             stream:
               bindings:
                 consume-in-0:
                   destination: ${SERVICEBUS_ENTITY_NAME}
                   # If you use Service Bus Topic, add the following configuration
                   # group: ${SUBSCRIPTION_NAME}
                 supply-out-0:
                   destination: ${SERVICEBUS_ENTITY_NAME_SAME_AS_ABOVE}
               servicebus:
                 bindings:
                   consume-in-0:
                     consumer:
                       auto-complete: false
                   supply-out-0:
                     producer:
                       entity-type: queue # set as "topic" if you use Service Bus Topic
     ```

> [!NOTE]
> The values allowed for `tenant-id` are: `common`, `organizations`, `consumers`, or the tenant ID. For more information about these values, see the [Used the wrong endpoint (personal and organization accounts)](/troubleshoot/azure/active-directory/error-code-aadsts50020-user-account-identity-provider-does-not-exist#cause-3-used-the-wrong-endpoint-personal-and-organization-accounts) section of [Error AADSTS50020 - User account from identity provider does not exist in tenant](/troubleshoot/azure/active-directory/error-code-aadsts50020-user-account-identity-provider-does-not-exist). For information on converting your single-tenant app, see [Convert single-tenant app to multitenant on Microsoft Entra ID](/entra/identity-platform/howto-convert-app-to-be-multi-tenant).

   * For credentials as managed identities, configure the following properties in your *application.yml* file:

     ```yaml
         spring:
           cloud:
             azure:
               credential:
                 managed-identity-enabled: true
                 client-id: ${MANAGED_IDENTITY_CLIENT_ID} # Only needed when using a user-assigned managed identity
               servicebus:
                 namespace: ${SERVICEBUS_NAMESPACE}
             function:
               definition: consume;supply
             stream:
               bindings:
                 consume-in-0:
                   destination: ${SERVICEBUS_ENTITY_NAME}
                   # If you use Service Bus Topic, add the following configuration
                   # group: ${SUBSCRIPTION_NAME}
                 supply-out-0:
                   destination: ${SERVICEBUS_ENTITY_NAME_SAME_AS_ABOVE}
               servicebus:
                 bindings:
                   consume-in-0:
                     consumer:
                       auto-complete: false
                   supply-out-0:
                     producer:
                       entity-type: queue # set as "topic" if you use Service Bus Topic
     ```

1. Define supplier and consumer.

   ```java
   @Bean
   public Consumer<Message<String>> consume() {
       return message -> {
           Checkpointer checkpointer = (Checkpointer) message.getHeaders().get(CHECKPOINTER);
           LOGGER.info("New message received: '{}'", message.getPayload());

           checkpointer.success()
                   .doOnSuccess(success -> LOGGER.info("Message '{}' successfully checkpointed", message.getPayload()))
                   .doOnError(error -> LOGGER.error("Exception found", error))
                   .block();
       };
   }

   @Bean
   public Supplier<Message<String>> supply() {
       return () -> {
           LOGGER.info("Sending message, sequence " + i);
           return MessageBuilder.withPayload("Hello world, " + i++).build();
       };
   }
   ```

#### Partition key support

The binder supports [Service Bus partitioning](/azure/service-bus-messaging/service-bus-partitioning) by allowing setting partition key and session ID in the message header. This section introduces how to set partition key for messages.

Spring Cloud Stream provides a partition key SpEL expression property `spring.cloud.stream.bindings.<binding-name>.producer.partition-key-expression`. For example, setting this property as `"'partitionKey-' + headers[<message-header-key>]"` and add a header called message-header-key. Spring Cloud Stream uses the value for this header when evaluating the expression to assign a partition key. The following code provides an example producer:

```java
@Bean
public Supplier<Message<String>> generate() {
    return () -> {
        String value = "random payload";
        return MessageBuilder.withPayload(value)
            .setHeader("<message-header-key>", value.length() % 4)
            .build();
    };
}
```

#### Session support

The binder supports [message sessions](/azure/service-bus-messaging/message-sessions) of Service Bus. Session ID of a message could be set via the message header.

```java
@Bean
public Supplier<Message<String>> generate() {
    return () -> {
        String value = "random payload";
        return MessageBuilder.withPayload(value)
            .setHeader(ServiceBusMessageHeaders.SESSION_ID, "Customize session ID")
            .build();
    };
}
```

> [!NOTE]
> According to [Service Bus partitioning](/azure/service-bus-messaging/service-bus-partitioning), session ID has higher priority than partition key. So when both of `ServiceBusMessageHeaders#SESSION_ID` and `ServiceBusMessageHeaders#PARTITION_KEY` headers are set, the value of the session ID is eventually used to overwrite the value of the partition key.

#### Handle error messages

##### [Spring Cloud Azure 4.x](#tab/SpringCloudAzure4x)

* Handle outbound binding error messages

  By default, Spring Integration creates a global error channel called `errorChannel`. Configure the following message endpoint to handle outbound binding error message.

  ```java
  @ServiceActivator(inputChannel = IntegrationContextUtils.ERROR_CHANNEL_BEAN_NAME)
  public void handleError(ErrorMessage message) {
      LOGGER.error("Handling outbound binding error: " + message);
  }
  ```

* Handle inbound binding error messages

  Spring Cloud Stream Service Bus Binder supports three solutions to handle errors for the inbound message bindings: the binder error handler, custom error channels, and handlers.

  **Binder error handler**:

  The default binder error handler handles the inbound binding. You use this handler to send failed messages to the dead-letter queue when `spring.cloud.stream.servicebus.bindings.<binding-name>.consumer.requeue-rejected` is enabled. Otherwise, the failed messages are abandoned. Except for configuring the binding-specific error channel, the binder error handler always takes effect regardless of whether there are other custom error handlers or channels.

  **Error channel**:

  Spring Cloud Stream provides an error channel for each inbound binding. An `ErrorMessage` is sent to the error channel. For more information, see [Handling Errors](https://docs.spring.io/spring-cloud-stream/docs/3.2.6/reference/html/spring-cloud-stream.html#polled-errors) in the Spring Cloud Stream documentation.

  * Default error channel

    You can use a global error channel named `errorChannel` to consume all inbound binding error messages. To handle these messages, configure the following message endpoint:

    ```java
    @ServiceActivator(inputChannel = IntegrationContextUtils.ERROR_CHANNEL_BEAN_NAME)
    public void handleError(ErrorMessage message) {
        LOGGER.error("Handling inbound binding error: " + message);
    }
    ```

  * Binding-specific error channel

    You can use a specific error channel to consume the specific inbound binding error messages with a higher priority than the default error channel. To handle these messages, configure the following message endpoint:

    ```java
    // Replace destination with spring.cloud.stream.bindings.<input-binding-name>.destination
    // Replace group with spring.cloud.stream.bindings.<input-binding-name>.group
    @ServiceActivator(inputChannel = "{destination}.{group}.errors")
    public void handleError(ErrorMessage message) {
        LOGGER.error("Handling inbound binding error: " + message);
    }
    ```

    > [!NOTE]
    > The binding-specific error channel is mutually exclusive with other provided error handlers and channels.

  **Error handler**:

  Spring Cloud Stream exposes a mechanism for you to provide a custom error handler by adding a `Consumer` that accepts `ErrorMessage` instances. For more information, see [Error Handling](https://docs.spring.io/spring-cloud-stream/docs/3.2.6/reference/html/spring-cloud-stream.html#spring-cloud-stream-overview-error-handling) in the Spring Cloud Stream documentation.

  > [!NOTE]
  > When any binding error handler is configured, it can work with the default error channel and the binder error handler.

  * Binding-default error handler

    Configure a single `Consumer` bean to consume all inbound binding error messages. The following default function subscribes to each inbound binding error channel:

    ```java
    @Bean
    public Consumer<ErrorMessage> myDefaultHandler() {
        return message -> {
            // consume the error message
        };
    }
    ```

    You also need to set the `spring.cloud.stream.default.error-handler-definition` property to the function name.

  * Binding-specific error handler

    Configure a `Consumer` bean to consume the specific inbound binding error messages. The following function subscribes to the specific inbound binding error channel with a higher priority than the binding-default error handler.

    ```java
    @Bean
    public Consumer<ErrorMessage> myDefaultHandler() {
        return message -> {
            // consume the error message
        };
    }
    ```

    You also need to set the `spring.cloud.stream.bindings.<input-binding-name>.error-handler-definition` property to the function name.

##### [Spring Cloud Azure 5.x](#tab/SpringCloudAzure5x)

* Handle outbound binding error messages

  By default, Spring Integration creates a global error channel called `errorChannel`. Configure the following message endpoint to handle outbound binding error message.

  ```java
  @ServiceActivator(inputChannel = IntegrationContextUtils.ERROR_CHANNEL_BEAN_NAME)
  public void handleError(ErrorMessage message) {
      LOGGER.error("Handling outbound binding error: " + message);
  }
  ```

* Handle inbound binding error messages

  Spring Cloud Stream Service Bus Binder supports two solutions to handle errors for the inbound message bindings: the binder error handler and handlers.

  **Binder error handler**:

  The default binder error handler handles the inbound binding. You use this handler to send failed messages to the dead-letter queue when `spring.cloud.stream.servicebus.bindings.<binding-name>.consumer.requeue-rejected` is enabled. Otherwise, the failed messages are abandoned. The binder error handler is mutually exclusive with other provided error handlers.

  **Error handler**:

  Spring Cloud Stream exposes a mechanism for you to provide a custom error handler by adding a `Consumer` that accepts `ErrorMessage` instances. For more information, see [Handle Error Messages](https://docs.spring.io/spring-cloud-stream/docs/current/reference/html/spring-cloud-stream.html#_handle_error_messages) in the Spring Cloud Stream documentation.

  * Binding-default error handler

    Configure a single `Consumer` bean to consume all inbound binding error messages. The following default function subscribes to each inbound binding error channel:

    ```java
    @Bean
    public Consumer<ErrorMessage> myDefaultHandler() {
        return message -> {
            // consume the error message
        };
    }
    ```

    You also need to set the `spring.cloud.stream.default.error-handler-definition` property to the function name.

  * Binding-specific error handler

    Configure a `Consumer` bean to consume the specific inbound binding error messages. The following function subscribes to the specific inbound binding error channel with a higher priority than the binding-default error handler.

    ```java
    @Bean
    public Consumer<ErrorMessage> myDefaultHandler() {
        return message -> {
            // consume the error message
        };
    }
    ```

    You also need to set the `spring.cloud.stream.bindings.<input-binding-name>.error-handler-definition` property to the function name.

---

#### Service Bus message headers

For the basic message headers supported, see the [Service Bus message headers](spring-integration-support.md#service-bus-message-headers) section of [Spring Cloud Azure support for Spring Integration](spring-integration-support.md).

> [!NOTE]
> When setting the partition key, the priority of message header is higher than Spring Cloud Stream property. So `spring.cloud.stream.bindings.<binding-name>.producer.partition-key-expression` takes effect only when none of the `ServiceBusMessageHeaders#SESSION_ID` and `ServiceBusMessageHeaders#PARTITION_KEY` headers are configured.

#### Multiple binder support

Connection to multiple Service Bus namespaces is also supported by using multiple binders. This sample takes connection string as example. Credentials of service principals and managed identities are also supported, users can set related properties in each binder's environment settings.

1. To use multiple binders of ServiceBus, configure the following properties in your *application.yml* file:

   ```yaml
   spring:
     cloud:
       function:
         definition: consume1;supply1;consume2;supply2
       stream:
         bindings:
           consume1-in-0:
             destination: ${SERVICEBUS_TOPIC_NAME}
             group: ${SUBSCRIPTION_NAME}
           supply1-out-0:
             destination: ${SERVICEBUS_TOPIC_NAME_SAME_AS_ABOVE}
           consume2-in-0:
             binder: servicebus-2
             destination: ${SERVICEBUS_QUEUE_NAME}
           supply2-out-0:
             binder: servicebus-2
             destination: ${SERVICEBUS_QUEUE_NAME_SAME_AS_ABOVE}
         binders:
           servicebus-1:
             type: servicebus
             default-candidate: true
             environment:
               spring:
                 cloud:
                   azure:
                     servicebus:
                       connection-string: ${SERVICEBUS_NAMESPACE_01_CONNECTION_STRING}
           servicebus-2:
             type: servicebus
             default-candidate: false
             environment:
               spring:
                 cloud:
                   azure:
                     servicebus:
                       connection-string: ${SERVICEBUS_NAMESPACE_02_CONNECTION_STRING}
         servicebus:
           bindings:
             consume1-in-0:
               consumer:
                 auto-complete: false
             supply1-out-0:
               producer:
                 entity-type: topic
             consume2-in-0:
               consumer:
                 auto-complete: false
             supply2-out-0:
               producer:
                 entity-type: queue
         poller:
           initial-delay: 0
           fixed-delay: 1000
   ```

   > [!NOTE]
   > The previous application file shows how to configure a single default poller for application to all bindings. If you want to configure the poller for a specific binding, you can use a configuration such as `spring.cloud.stream.bindings.<binding-name>.producer.poller.fixed-delay=3000`.

1. we need define two suppliers and two consumers

   ```java
   @Bean
   public Supplier<Message<String>> supply1() {
       return () -> {
           LOGGER.info("Sending message1, sequence1 " + i);
           return MessageBuilder.withPayload("Hello world1, " + i++).build();
       };
   }

   @Bean
   public Supplier<Message<String>> supply2() {
       return () -> {
           LOGGER.info("Sending message2, sequence2 " + j);
           return MessageBuilder.withPayload("Hello world2, " + j++).build();
       };
   }

   @Bean
   public Consumer<Message<String>> consume1() {
       return message -> {
           Checkpointer checkpointer = (Checkpointer) message.getHeaders().get(CHECKPOINTER);
           LOGGER.info("New message1 received: '{}'", message);
           checkpointer.success()
                   .doOnSuccess(s -> LOGGER.info("Message '{}' successfully checkpointed", message.getPayload()))
                   .doOnError(e -> LOGGER.error("Error found", e))
                   .block();
       };
   }

   @Bean
   public Consumer<Message<String>> consume2() {
       return message -> {
           Checkpointer checkpointer = (Checkpointer) message.getHeaders().get(CHECKPOINTER);
           LOGGER.info("New message2 received: '{}'", message);
           checkpointer.success()
                   .doOnSuccess(s -> LOGGER.info("Message '{}' successfully checkpointed", message.getPayload()))
                   .doOnError(e -> LOGGER.error("Error found", e))
                   .block();
       };

   }
   ```

#### Resource provisioning

Service bus binder supports provisioning of queue, topic and subscription, users could use the following properties to enable provisioning.

```yaml
spring:
  cloud:
    azure:
      credential:
        tenant-id: <tenant>
      profile:
        subscription-id: ${AZURE_SUBSCRIPTION_ID}
      servicebus:
        resource:
          resource-group: ${AZURE_SERVICEBUS_RESOURECE_GROUP}
    stream:
      servicebus:
        bindings:
          <binding-name>:
            consumer:
              entity-type: ${SERVICEBUS_CONSUMER_ENTITY_TYPE}
```

> [!NOTE]
> The values allowed for `tenant-id` are: `common`, `organizations`, `consumers`, or the tenant ID. For more information about these values, see the [Used the wrong endpoint (personal and organization accounts)](/troubleshoot/azure/active-directory/error-code-aadsts50020-user-account-identity-provider-does-not-exist#cause-3-used-the-wrong-endpoint-personal-and-organization-accounts) section of [Error AADSTS50020 - User account from identity provider does not exist in tenant](/troubleshoot/azure/active-directory/error-code-aadsts50020-user-account-identity-provider-does-not-exist). For information on converting your single-tenant app, see [Convert single-tenant app to multitenant on Microsoft Entra ID](/entra/identity-platform/howto-convert-app-to-be-multi-tenant).

#### Customize Service Bus client properties

Developers can use `AzureServiceClientBuilderCustomizer` to customize Service Bus Client properties. The following example customizes the `sessionIdleTimeout` property in `ServiceBusClientBuilder`:

```java
@Bean
public AzureServiceClientBuilderCustomizer<ServiceBusClientBuilder.ServiceBusSessionProcessorClientBuilder> customizeBuilder() {
    return builder -> builder.sessionIdleTimeout(Duration.ofSeconds(10));
}
```

### Samples

For more information, see the [azure-spring-boot-samples](https://github.com/Azure-Samples/azure-spring-boot-samples/tree/main/servicebus/spring-cloud-azure-stream-binder-servicebus) repository on GitHub.
