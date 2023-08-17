---
title: Spring Cloud Stream support
description: This article describes how Spring Cloud Azure and Spring Cloud Stream can be used together.
ms.date: 04/06/2023
author: KarlErickson
ms.author: v-yeyonghui
ms.topic: reference
ms.custom: devx-track-java
---

# Spring Cloud Azure support for Spring Cloud Stream

**This article applies to:** ✔️ Version 4.7.0 ✔️ Version 5.0.0

Spring Cloud Stream is a framework for building highly scalable event-driven microservices connected with shared messaging systems.

The framework provides a flexible programming model built on already established and familiar Spring idioms and best practices, including support for persistent pub/sub semantics, consumer groups, and stateful partitions.

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

Event Hubs provides a similar concept of physical partition as Kafka. But unlike Kafka's auto re-balancing between consumers and partitions, Event Hubs provides a kind of preemptive mode. The storage account acts as a lease to determine which partition is owned by which consumer. When a new consumer starts, it will try to steal some partitions from most heavy-loaded consumers to achieve the workload balancing.

To specify the load balancing strategy, properties of `spring.cloud.stream.eventhubs.bindings.<binding-name>.consumer.load-balancing.*` are provided. For more information, see the [Consumer properties](#consumer-properties) section.

#### Batch consumer support

Spring Cloud Azure Stream Event Hubs binder supports [Spring Cloud Stream Batch Consumer feature](https://docs.spring.io/spring-cloud-stream/docs/current/reference/html/spring-cloud-stream.html#_batch_consumers).

To work with the batch-consumer mode, the property of `spring.cloud.stream.bindings.<binding-name>.consumer.batch-mode` should be set as `true`. When enabled, an **Message** of which the payload is a list of batched events will be received and passed to the `Consumer` function. Each message header is also converted as a list, of which the content is the associated header value parsed from each event. For the communal headers of partition ID, checkpointer and last enqueued properties, they are presented as a single value for the entire batch of events shares the same one. For more information, see the [Event Hubs message headers](spring-integration-support.md#event-hubs-message-headers) section of [Spring Cloud Azure support for Spring Integration](./spring-integration-support.md).

> [!NOTE]
> The checkpoint header only exists when **MANUAL** checkpoint mode is used.

Checkpointing of batch consumer supports two modes: `BATCH` and `MANUAL`. `BATCH` mode is an auto checkpointing mode to checkpoint the entire batch of events together once they are received by the binder. `MANUAL` mode is to checkpoint the events by users. When used, the
**Checkpointer** will be passed into the message header, and users could use it to do checkpointing.

The batch size can be specified by properties of `max-size` and `max-wait-time` with prefix as `spring.cloud.stream.eventhubs.bindings.<binding-name>.consumer.batch.`, where `max-size` is a necessary property while `max-wait-time` is optional. For more information, see the [Consumer properties](#consumer-properties) section.

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

The binder provides the following 3 parts of configuration options:

#### Connection configuration properties

This section contains the configuration options used for connecting to Azure Event Hubs.

> [!NOTE]
> If you choose to use a security principal to authenticate and authorize with Azure Active Directory for accessing an Azure resource, see [Authorize access with Azure AD](authentication.md#authorize-access-with-azure-active-directory) to make sure the security principal has been granted the sufficient permission to access the Azure resource.

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

The binder also supports [Spring Could Azure Resource Manager](resource-manager.md) by default. To learn about how to retrieve the connection string with security principals that are not granted with `Data` related roles, see the [Basic usage](resource-manager.md#basic-usage) section of [Spring Could Azure Resource Manager](resource-manager.md).

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
> The `initial-partition-event-position` configuration accepts a `map` to specify the initial position for each event hub. Thus, its key is the partition ID, and the value is of `StartPositionProperties` which includes properties of offset, sequence number, enqueued date time and whether inclusive. For example, you can set it as

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

The above [connection](#connection-configuration-properties), [checkpoint](#checkpoint-configuration-properties) and [common Azure SDK client](configuration.md) configuration are supported to be customized for each binder consumer, which can be configured with the prefix `spring.cloud.stream.eventhubs.bindings.<binding-name>.consumer.`.

##### Producer properties

These properties are exposed via `EventHubsProducerProperties`.

Producer configurable properties of spring-cloud-azure-stream-binder-eventhubs:

> [!div class="mx-tdBreakAll"]
> | Property                                                                          | Type    | Description                                                                                                              |
> |-----------------------------------------------------------------------------------|---------|--------------------------------------------------------------------------------------------------------------------------|
> | **spring.cloud.stream.eventhubs.bindings.binding-name.producer**.sync         | boolean | The switch flag for sync of producer. If true, the producer will wait for a response after a send operation.             |
> | **spring.cloud.stream.eventhubs.bindings.binding-name.producer**.send-timeout | long    | The amount of time to wait for a response after a send operation. Will take effect only when a sync producer is enabled. |

##### Advanced producer configuration

The above [connection](#connection-configuration-properties) and [common Azure SDK client](configuration.md) configuration are supported to be customized for each binder producer, which can be configured with the prefix `spring.cloud.stream.eventhubs.bindings.<binding-name>.producer.`.

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
         stream:
           function:
             definition: consume;supply
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
             tenant-id: ${AZURE_TENANT_ID}
           eventhubs:
             namespace: ${EVENTHUB_NAMESPACE}
             processor:
               checkpoint-store:
                 container-name: ${CONTAINER_NAME}
                 account-name: ${ACCOUNT_NAME}
         stream:
           function:
             definition: consume;supply
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

   * For credentials as managed identites, configure the following properties in your *application.yml* file:

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
         stream:
           function:
             definition: consume;supply
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

A `PartitionSupplier` with user-provided partition information will be created to configure the partition information about the message to be sent, the following is the process of obtaining different priorities of the partition ID and key:

:::image type="content" source="media/spring-cloud-azure/flowchart-partitioning-support.png" alt-text="Flowchart showing the partitioning support process." border="false":::)

#### Batch consumer support

1. Fill the batch configuration options

   ```yaml
   spring:
     cloud:
       stream:
         function:
           definition: consume
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
> In the batch-consuming mode, the default content type of Spring Cloud Stream binder is `application/json`, so make sure the message payload is aligned with the content type. For example, when using the default content type of `application/json` to receive messages with `String` payload, the payload should be JSON String, surrounded with double quotes for the original String text. While for `text/plain` content type, it can be a `String` object directly. For more information, see [Spring Cloud Stream Content Type Negotiation](https://docs.spring.io/spring-cloud-stream/docs/current/reference/html/spring-cloud-stream.html#content-type-management).

#### Error channels

* Consumer error channel

  This channel is open by default, you can handle the error message in this way:

  ```java
  // Replace destination with spring.cloud.stream.bindings.input.destination
  // Replace group with spring.cloud.stream.bindings.input.group
  @ServiceActivator(inputChannel = "{destination}.{group}.errors")
  public void consumerError(Message<?> message) {
      LOGGER.error("Handling customer ERROR: " + message);
  }
  ```

* Producer error channel

  This channel isn't open by default. You need to add a configuration in your *application.properties* file to enable it, like this:

  ```properties
  spring.cloud.stream.default.producer.errorChannelEnabled=true
  ```

  You can handle the error message in this way:

  ```java
  // Replace destination with spring.cloud.stream.bindings.output.destination
  @ServiceActivator(inputChannel = "{destination}.errors")
  public void producerError(Message<?> message) {
      LOGGER.error("Handling Producer ERROR: " + message);
  }
  ```

* Global default error channel:

  A global error channel called "errorChannel" is created by default Spring Integration, which allows users to subscribe many endpoints to it.

  ```java
  @ServiceActivator(inputChannel = "errorChannel")
  public void producerError(Message<?> message) {
      LOGGER.error("Handling ERROR: " + message);
  }
  ```

#### Event Hubs message headers

For the basic message headers supported, see the [Event Hubs message headers](spring-integration-support.md#event-hubs-message-headers) section of [Spring Cloud Azure support for Spring Integration](./spring-integration-support.md).

#### Multiple binder support

Connection to multiple Event Hubs namespaces is also supported by using multiple binders.This sample takes connection string as example. Credentials of service principals and managed identities are also supported, users can set related properties in each binder's environment settings.

1. To use multiple binders of EventHubs, configure the following properties in your *application.yml* file:

   ```yaml
   spring:
     cloud:
       stream:
         function:
           definition: consume1;supply1;consume2;supply2
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

#### Resource provision

Event Hubs binder supports provisioning of event hub and consumer group, users could use the following properties to enable provisioning.

```yaml
spring:
  cloud:
    azure:
      credential:
        tenant-id: ${AZURE_TENANT_ID}
      profile:
        subscription-id: ${AZURE_SUBSCRIPTION_ID}
      eventhubs:
        resource:
          resource-group: ${AZURE_EVENTHUBS_RESOURECE_GROUP}
```

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

The binder provides the following 2 parts of configuration options:

#### Connection configuration properties

This section contains the configuration options used for connecting to Azure Service Bus.

> [!NOTE]
> If you choose to use a security principal to authenticate and authorize with Azure Active Directory for accessing an Azure resource, see [Authorize access with Azure AD](authentication.md#authorize-access-with-azure-active-directory) to make sure the security principal has been granted the sufficient permission to access the Azure resource.

Connection configurable properties of spring-cloud-azure-stream-binder-servicebus:

> [!div class="mx-tdBreakAll"]
> | Property                                            | Type    | Description                                                                                                                 |
> |-----------------------------------------------------|---------|-----------------------------------------------------------------------------------------------------------------------------|
> | **spring.cloud.azure.servicebus**.enabled           | boolean | Whether an Azure Service Bus is enabled.                                                                                    |
> | **spring.cloud.azure.servicebus**.connection-string | String  | Service Bus Namespace connection string value.                                                                              |
> | **spring.cloud.azure.servicebus**.namespace         | String  | Service Bus Namespace value, which is the prefix of the FQDN. A FQDN should be composed of NamespaceName.DomainName |
> | **spring.cloud.azure.servicebus**.domain-name       | String  | Domain name of an Azure Service Bus Namespace value.                                                                        |

> [!NOTE]
> Common Azure Service SDK configuration options are configurable for the Spring Cloud Azure Stream Service Bus binder as well. The supported configuration options are introduced in [Spring Cloud Azure configuration](configuration.md), and could be configured with either the unified prefix `spring.cloud.azure.` or the prefix of `spring.cloud.azure.servicebus.`.

The binder also supports [Spring Could Azure Resource Manager](resource-manager.md) by default. To learn about how to retrieve the connection string with security principals that are not granted with `Data` related roles, see the [Basic usage](resource-manager.md#basic-usage) section of [Spring Could Azure Resource Manager](resource-manager.md).

#### Azure Service Bus binding configuration properties

The following options are divided into four sections: Consumer Properties, Advanced Consumer
Configurations, Producer Properties and Advanced Producer Configurations.

##### Consumer properties

These properties are exposed via `ServiceBusConsumerProperties`.

Consumer configurable properties of spring-cloud-azure-stream-binder-servicebus:

> [!div class="mx-tdBreakAll"]
> | Property                                                                                           | Type                  | Default   | Description                                                                                                 |
> |----------------------------------------------------------------------------------------------------|-----------------------|-----------|-------------------------------------------------------------------------------------------------------------|
> | **spring.cloud.stream.servicebus.bindings.binding-name.consumer**.requeue-rejected             | boolean               | false     | If the failed messages are routed to the DLQ.                                                               |
> | **spring.cloud.stream.servicebus.bindings.binding-name.consumer**.max-concurrent-calls         | Integer               | 1         | Max concurrent messages that the Service Bus processor client should process.                               |
> | **spring.cloud.stream.servicebus.bindings.binding-name.consumer**.max-concurrent-sessions      | Integer               | null      | Maximum number of concurrent sessions to process at any given time.                                         |
> | **spring.cloud.stream.servicebus.bindings.binding-name.consumer**.session-enabled              | Boolean               | null      | Whether session is enabled.                                                                                 |
> | **spring.cloud.stream.servicebus.bindings.binding-name.consumer**.prefetch-count               | Integer               | 0         | The prefetch count of the Service Bus processor client.                                                     |
> | **spring.cloud.stream.servicebus.bindings.binding-name.consumer**.sub-queue                    | SubQueue              | none      | The type of the sub queue to connect to.                                                                    |
> | **spring.cloud.stream.servicebus.bindings.binding-name.consumer**.max-auto-lock-renew-duration | Duration              | 5m        | The amount of time to continue auto-renewing the lock.                                                      |
> | **spring.cloud.stream.servicebus.bindings.binding-name.consumer**.receive-mode                 | ServiceBusReceiveMode | peek_lock | The receive mode of the Service Bus processor client.                                                       |
> | **spring.cloud.stream.servicebus.bindings.binding-name.consumer**.auto-complete                | Boolean               | true      | Whether to settle messages automatically. If set as false, a message header of `Checkpointer` will be added to enable developers to settle messages manually.     |

##### Advanced consumer configuration

The above [connection](#connection-configuration-properties-1) and [common Azure SDK client](configuration.md) configuration are supported to be customized for each binder consumer, which can be configured with the prefix `spring.cloud.stream.servicebus.bindings.<binding-name>.consumer.`.

##### Producer properties

These properties are exposed via `ServiceBusProducerProperties`.

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

The above [connection](#connection-configuration-properties-1) and [common Azure SDK client](configuration.md) configuration are supported to be customized for each binder producer, which can be configured with the prefix `spring.cloud.stream.servicebus.bindings.<binding-name>.producer.`.

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
             stream:
               function:
                 definition: consume;supply
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
                 tenant-id: ${AZURE_TENANT_ID}
               servicebus:
                 namespace: ${SERVICEBUS_NAMESPACE}
             stream:
               function:
                 definition: consume;supply
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
             stream:
               function:
                 definition: consume;supply
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

Spring Cloud Stream provides a partition key SpEL expression property `spring.cloud.stream.bindings.<binding-name>.producer.partition-key-expression`. For example, setting this property as `"'partitionKey-' + headers[<message-header-key>]"` and add a header called message-header-key. Spring Cloud Stream will use the value for this header when evaluating the above expression to assign a partition key. Here is an example producer code:

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
> According to [Service Bus partitioning](/azure/service-bus-messaging/service-bus-partitioning), session ID has higher priority than partition key. So when both of `ServiceBusMessageHeaders#SESSION_ID` and `ServiceBusMessageHeaders#PARTITION_KEY` (or `AzureHeaders#PARTITION_KEY`) headers are set,
the value of the session ID will eventually be used to overwrite the value of the partition key.

#### Error channels

* Consumer error channel

This channel is open by default, and a default consumer error channel handler is used to send failed messages to the dead-letter queue when `spring.cloud.stream.servicebus.bindings.<binding-name>.consumer.requeue-rejected` is enabled, otherwise the failed messages will be abandoned.

To customize the consumer error channel handler, you can register you own error handler to the related consumer error channel in this way:

```java
// Replace destination with spring.cloud.stream.bindings.input.destination
// Replace group with spring.cloud.stream.bindings.input.group
@ServiceActivator(inputChannel = "{destination}.{group}.errors")
public void consumerError(Message<?> message) {
    LOGGER.error("Handling customer ERROR: " + message);
}
```

* Producer error channel

This channel isn't open by default. You need to add a configuration in your *application.properties* file to enable it, like this:

```properties
spring.cloud.stream.default.producer.errorChannelEnabled=true
```

You can handle the error message in this way:

```java
// Replace destination with spring.cloud.stream.bindings.output.destination
@ServiceActivator(inputChannel = "{destination}.errors")
public void producerError(Message<?> message) {
    LOGGER.error("Handling Producer ERROR: " + message);
}
```

* Global default error channel

A global error channel called "errorChannel" is created by default Spring Integration, which allows users to subscribe many endpoints to it.

```java
@ServiceActivator(inputChannel = "errorChannel")
public void producerError(Message<?> message) {
    LOGGER.error("Handling ERROR: " + message);
}
```

#### Service Bus message headers

For the basic message headers supported, see the [Service Bus message headers](spring-integration-support.md#service-bus-message-headers) section of [Spring Cloud Azure support for Spring Integration](spring-integration-support.md).

> [!NOTE]
> When setting the partiton key, the priority of message header is higher than Spring Cloud Stream property. So `spring.cloud.stream.bindings.<binding-name>.producer.partition-key-expression` will take effect only when none of the headers of `ServiceBusMessageHeaders#SESSION_ID`, `ServiceBusMessageHeaders#PARTITION_KEY`, `AzureHeaders#PARTITION_KEY` is configured.

#### Multiple Binder support

Connection to multiple Service Bus namespaces is also supported by using multiple binders. This sample takes connection string as example. Credentials of service principals and managed identities are also supported, users can set related properties in each binder's environment settings.

1. To use multiple binders of ServiceBus, configure the following properties in your *application.yml* file:

   ```yaml
   spring:
     cloud:
       stream:
         function:
           definition: consume1;supply1;consume2;supply2
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

#### Resource provision

Service bus binder supports provisioning of queue, topic and subscription, users could use the following properties to enable provisioning.

```yaml
spring:
  cloud:
    azure:
      credential:
        tenant-id: ${AZURE_TENANT_ID}
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

### Samples

For more information, see the [azure-spring-boot-samples](https://github.com/Azure-Samples/azure-spring-boot-samples/tree/main/servicebus/spring-cloud-azure-stream-binder-servicebus) repository on GitHub.
