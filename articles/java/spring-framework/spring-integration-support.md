---
title: Spring Cloud Azure support for Spring Integration
description: This article describes how Spring Cloud Azure and Spring Integration can be used together.
ms.date: 04/06/2023
author: KarlErickson
ms.author: karler
ms.reviewer: seal
ms.topic: reference
ms.custom: devx-track-java, devx-track-extended-java
---

# Spring Cloud Azure support for Spring Integration

**This article applies to:** ✅ Version 4.19.0 ✅ Version 5.20.1

Spring Integration Extension for Azure provides Spring Integration adapters for the various services provided by the [Azure SDK for Java](https://github.com/Azure/azure-sdk-for-java/). We provide Spring Integration support for these Azure services: Event Hubs, Service Bus, Storage Queue. The following is a list of supported adapters:

* `spring-cloud-azure-starter-integration-eventhubs` - for more information, see [Spring Integration with Azure Event Hubs](#spring-integration-with-azure-event-hubs)
* `spring-cloud-azure-starter-integration-servicebus` - for more information, see [Spring Integration with Azure Service Bus](#spring-integration-with-azure-service-bus)
* `spring-cloud-azure-starter-integration-storage-queue` - for more information, see [Spring Integration with Azure Storage Queue](#spring-integration-with-azure-storage-queue)

## Spring Integration with Azure Event Hubs

### Key concepts

Azure Event Hubs is a big data streaming platform and event ingestion service. It can receive and process millions of events per second. Data sent to an event hub can be transformed and stored by using any real-time analytics provider or batching/storage adapters.

Spring Integration enables lightweight messaging within Spring-based applications and supports integration with external systems via declarative adapters. Those adapters provide a higher-level of abstraction over Spring's support for remoting, messaging, and scheduling. The **Spring Integration for Event Hubs** extension project provides inbound and outbound channel adapters and gateways for Azure Event Hubs.

> [!NOTE]
> RxJava support APIs are dropped from version 4.0.0. See Javadoc for details.

#### Consumer group

Event Hubs provides similar support of consumer group as Apache Kafka, but with slight different logic. While Kafka stores all committed offsets in the broker, you have to store offsets of Event Hubs messages being processed manually. Event Hubs SDK provides the function to store such offsets inside Azure Storage.

#### Partitioning support

Event Hubs provides a similar concept of physical partition as Kafka. But unlike Kafka's auto re-balancing between consumers and partitions, Event Hubs provides a kind of preemptive mode. The storage account acts as a lease to determine which partition is owned by which consumer. When a new consumer starts, it will try to steal some partitions from most heavy-loaded consumers to achieve the workload balancing.

To specify the load balancing strategy, developers can use `EventHubsContainerProperties` for the configuration. See [the following section](#receive-messages-from-azure-event-hubs) for an example of how to configure `EventHubsContainerProperties`.

#### Batch consumer support

The `EventHubsInboundChannelAdapter` supports the batch-consuming mode. To enable it, users can specify the listener mode as `ListenerMode.BATCH` when constructing an `EventHubsInboundChannelAdapter` instance.
When enabled, an **Message** of which the payload is a list of batched events will be received and passed to the downstream channel. Each message header is also converted as a list, of which the content is the associated header value parsed from each event. For the communal headers of partition ID, checkpointer and last enqueued properties, they are presented as a single value for the entire batch of events shares the same one. For more information, see the [Event Hubs Message Headers](#event-hubs-message-headers) section.

> [!NOTE]
> The checkpoint header only exists when **MANUAL** checkpoint mode is used.

Checkpointing of batch consumer supports two modes: `BATCH` and `MANUAL`. `BATCH` mode is an auto checkpointing mode to checkpoint the entire batch of events together once they are received. `MANUAL` mode is to checkpoint the events by users. When used, the
**Checkpointer** will be passed into the message header, and users could use it to do checkpointing.

The batch consuming policy can be specified by properties of `max-size` and `max-wait-time`, where `max-size` is a necessary property while `max-wait-time` is optional.
To specify the batch consuming strategy, developers can use `EventHubsContainerProperties` for the configuration. See [the following section](#receive-messages-from-azure-event-hubs) for an example of how to configure `EventHubsContainerProperties`.

### Dependency setup

```xml
<dependency>
    <groupId>com.azure.spring</groupId>
    <artifactId>spring-cloud-azure-starter-integration-eventhubs</artifactId>
</dependency>
```

### Configuration

This starter provides the following 3 parts of configuration options:

#### Connection Configuration Properties

This section contains the configuration options used for connecting to Azure Event Hubs.

> [!NOTE]
> If you choose to use a security principal to authenticate and authorize with Microsoft Entra ID for accessing an Azure resource, see [Authorize access with Microsoft Entra ID](authentication.md#authorize-access-with-microsoft-entra-id) to make sure the security principal has been granted the sufficient permission to access the Azure resource.

Connection configurable properties of spring-cloud-azure-starter-integration-eventhubs:

> [!div class="mx-tdBreakAll"]
> | Property                                                 | Type    | Description                                                                                                                |
> |----------------------------------------------------------|---------|----------------------------------------------------------------------------------------------------------------------------|
> | **spring.cloud.azure.eventhubs**.enabled                 | boolean | Whether an Azure Event Hubs is enabled.                                                                                    |
> | **spring.cloud.azure.eventhubs**.connection-string       | String  | Event Hubs Namespace connection string value.                                                                              |
> | **spring.cloud.azure.eventhubs**.namespace               | String  | Event Hubs Namespace value, which is the prefix of the FQDN. A FQDN should be composed of NamespaceName.DomainName |
> | **spring.cloud.azure.eventhubs**.domain-name             | String  | Domain name of an Azure Event Hubs Namespace value.                                                                        |
> | **spring.cloud.azure.eventhubs**.custom-endpoint-address | String  | Custom Endpoint address.                                                                                                   |
> | **spring.cloud.azure.eventhubs**.shared-connection       | Boolean | Whether the underlying EventProcessorClient and EventHubProducerAsyncClient use the same connection. By default, a new connection is constructed and used created for each Event Hub client created. |

#### Checkpoint Configuration Properties

This section contains the configuration options for the Storage Blobs service, which is used for persisting partition ownership and checkpoint information.

> [!NOTE]
> From version 4.0.0, when the property of **spring.cloud.azure.eventhubs.processor.checkpoint-store.create-container-if-not-exists** isn't enabled manually, no Storage container will be created automatically.

Checkpointing configurable properties of spring-cloud-azure-starter-integration-eventhubs:

> [!div class="mx-tdBreakAll"]
> | Property                                                                                   | Type    | Description                                         |
> |--------------------------------------------------------------------------------------------|---------|-----------------------------------------------------|
> | **spring.cloud.azure.eventhubs.processor.checkpoint-store**.create-container-if-not-exists | Boolean | Whether to allow creating containers if not exists. |
> | **spring.cloud.azure.eventhubs.processor.checkpoint-store**.account-name                   | String  | Name for the storage account.                       |
> | **spring.cloud.azure.eventhubs.processor.checkpoint-store**.account-key                    | String  | Storage account access key.                         |
> | **spring.cloud.azure.eventhubs.processor.checkpoint-store**.container-name                 | String  | Storage container name.                             |

Common Azure Service SDK configuration options are configurable for Storage Blob checkpoint store as well. The supported configuration options are introduced in [Spring Cloud Azure configuration](configuration.md), and could be configured with either the unified prefix `spring.cloud.azure.` or the prefix of `spring.cloud.azure.eventhubs.processor.checkpoint-store`.

#### Event Hub processor configuration properties

The `EventHubsInboundChannelAdapter` uses the `EventProcessorClient` to consume messages from an event hub, to configure the overall properties of an `EventProcessorClient`,
developers can use `EventHubsContainerProperties` for the configuration. See [the following section](#receive-messages-from-azure-event-hubs) about how to work with `EventHubsInboundChannelAdapter`.

### Basic usage

#### Send messages to Azure Event Hubs

1. Fill the credential configuration options.

   * For credentials as connection string, configure the following properties in your **application.yml** file:

     ```yaml
     spring:
       cloud:
         azure:
           eventhubs:
             connection-string: ${AZURE_EVENT_HUBS_CONNECTION_STRING}
             processor:
               checkpoint-store:
                 container-name: ${CHECKPOINT-CONTAINER}
                 account-name: ${CHECKPOINT-STORAGE-ACCOUNT}
                 account-key: ${CHECKPOINT-ACCESS-KEY}
     ```

     [!INCLUDE [security-note](../includes/security-note.md)]

   * For credentials as managed identities, configure the following properties in your **application.yml** file:

     ```yaml
     spring:
       cloud:
         azure:
           credential:
             managed-identity-enabled: true
             client-id: ${AZURE_CLIENT_ID}
           eventhubs:
             namespace: ${AZURE_EVENT_HUBS_NAMESPACE}
             processor:
               checkpoint-store:
                 container-name: ${CONTAINER_NAME}
                 account-name: ${ACCOUNT_NAME}
     ```

   * For credentials as service principal, configure the following properties in your **application.yml** file:

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
             namespace: ${AZURE_EVENT_HUBS_NAMESPACE}
             processor:
               checkpoint-store:
                 container-name: ${CONTAINER_NAME}
                 account-name: ${ACCOUNT_NAME}
     ```

> [!NOTE]
> The values allowed for `tenant-id` are: `common`, `organizations`, `consumers`, or the tenant ID. For more information about these values, see the [Used the wrong endpoint (personal and organization accounts)](/troubleshoot/azure/active-directory/error-code-aadsts50020-user-account-identity-provider-does-not-exist#cause-3-used-the-wrong-endpoint-personal-and-organization-accounts) section of [Error AADSTS50020 - User account from identity provider does not exist in tenant](/troubleshoot/azure/active-directory/error-code-aadsts50020-user-account-identity-provider-does-not-exist). For information on converting your single-tenant app, see [Convert single-tenant app to multitenant on Microsoft Entra ID](/entra/identity-platform/howto-convert-app-to-be-multi-tenant).

1. Create `DefaultMessageHandler` with the `EventHubsTemplate` bean to send messages to Event Hubs.

   ```java
   class Demo {
       private static final String OUTPUT_CHANNEL = "output";
       private static final String EVENTHUB_NAME = "eh1";

       @Bean
       @ServiceActivator(inputChannel = OUTPUT_CHANNEL)
       public MessageHandler messageSender(EventHubsTemplate eventHubsTemplate) {
           DefaultMessageHandler handler = new DefaultMessageHandler(EVENTHUB_NAME, eventHubsTemplate);
           handler.setSendCallback(new ListenableFutureCallback<Void>() {
               @Override
               public void onSuccess(Void result) {
                   LOGGER.info("Message was sent successfully.");
               }
               @Override
               public void onFailure(Throwable ex) {
                   LOGGER.error("There was an error sending the message.", ex);
               }
           });
           return handler;
       }
   }
   ```

1. Create a message gateway binding with the above message handler via a message channel.

   ```java
   class Demo {
       @Autowired
       EventHubOutboundGateway messagingGateway;
   
       @MessagingGateway(defaultRequestChannel = OUTPUT_CHANNEL)
       public interface EventHubOutboundGateway {
           void send(String text);
       }
   }
   ```

1. Send messages using the gateway.

   ```java
   class Demo {
       public void demo() {
           this.messagingGateway.send(message);
       }
   }
   ```

#### Receive messages from Azure Event Hubs

1. Fill the credential configuration options.

1. Create a bean of message channel as the input channel.

   ```java
   @Configuration
   class Demo {
       @Bean
       public MessageChannel input() {
           return new DirectChannel();
       }
   }
   ```

1. Create `EventHubsInboundChannelAdapter` with the `EventHubsMessageListenerContainer` bean to receive messages from Event Hubs.

   ```java
   @Configuration
   class Demo {
       private static final String INPUT_CHANNEL = "input";
       private static final String EVENTHUB_NAME = "eh1";
       private static final String CONSUMER_GROUP = "$Default";

       @Bean
       public EventHubsInboundChannelAdapter messageChannelAdapter(
               @Qualifier(INPUT_CHANNEL) MessageChannel inputChannel,
               EventHubsMessageListenerContainer listenerContainer) {
           EventHubsInboundChannelAdapter adapter = new EventHubsInboundChannelAdapter(processorContainer);
           adapter.setOutputChannel(inputChannel);
           return adapter;
       }

       @Bean
       public EventHubsMessageListenerContainer messageListenerContainer(EventHubsProcessorFactory processorFactory) {
           EventHubsContainerProperties containerProperties = new EventHubsContainerProperties();
           containerProperties.setEventHubName(EVENTHUB_NAME);
           containerProperties.setConsumerGroup(CONSUMER_GROUP);
           containerProperties.setCheckpointConfig(new CheckpointConfig(CheckpointMode.MANUAL));
           return new EventHubsMessageListenerContainer(processorFactory, containerProperties);
       }
   }
   ```

1. Create a message receiver binding with EventHubsInboundChannelAdapter via the message channel created before.

   ```java
   class Demo {
       @ServiceActivator(inputChannel = INPUT_CHANNEL)
       public void messageReceiver(byte[] payload, @Header(AzureHeaders.CHECKPOINTER) Checkpointer checkpointer) {
           String message = new String(payload);
           LOGGER.info("New message received: '{}'", message);
           checkpointer.success()
                   .doOnSuccess(s -> LOGGER.info("Message '{}' successfully checkpointed", message))
                   .doOnError(e -> LOGGER.error("Error found", e))
                   .block();
       }
   }
   ```

#### Configure EventHubsMessageConverter to customize objectMapper

`EventHubsMessageConverter` is made as a configurable bean to allow users to customize ObjectMapper.

#### Batch consumer support

To consume messages from Event Hubs in batches is similar with the above sample, besides users should set the batch-consuming related configuration options for `EventHubsInboundChannelAdapter`.

When create `EventHubsInboundChannelAdapter`, the listener mode should be set as `BATCH`. When create bean of `EventHubsMessageListenerContainer`, set the checkpoint mode as either `MANUAL` or `BATCH`, and the batch options can be configured as needed.

```java
@Configuration
class Demo {
    private static final String INPUT_CHANNEL = "input";
    private static final String EVENTHUB_NAME = "eh1";
    private static final String CONSUMER_GROUP = "$Default";

    @Bean
    public EventHubsInboundChannelAdapter messageChannelAdapter(
            @Qualifier(INPUT_CHANNEL) MessageChannel inputChannel,
            EventHubsMessageListenerContainer listenerContainer) {
        EventHubsInboundChannelAdapter adapter = new EventHubsInboundChannelAdapter(processorContainer, ListenerMode.BATCH);
        adapter.setOutputChannel(inputChannel);
        return adapter;
    }

    @Bean
    public EventHubsMessageListenerContainer messageListenerContainer(EventHubsProcessorFactory processorFactory) {
        EventHubsContainerProperties containerProperties = new EventHubsContainerProperties();
        containerProperties.setEventHubName(EVENTHUB_NAME);
        containerProperties.setConsumerGroup(CONSUMER_GROUP);
        containerProperties.getBatch().setMaxSize(100);
        containerProperties.setCheckpointConfig(new CheckpointConfig(CheckpointMode.MANUAL));
        return new EventHubsMessageListenerContainer(processorFactory, containerProperties);
    }
}
```

#### Event Hubs message headers

The following table illustrates how Event Hubs message properties are mapped to Spring message headers. For Azure Event Hubs, message is called as `event`.

Mapping between Event Hubs Message / Event Properties and Spring Message Headers in Record Listener Mode:

> [!div class="mx-tdBreakAll"]
> | Event Hubs Event Properties    | Spring Message Header Constants                 | Type                        | Description                                                                                           |
> |--------------------------------|-------------------------------------------------|-----------------------------|-------------------------------------------------------------------------------------------------------|
> | Enqueued time                  | EventHubsHeaders#ENQUEUED_TIME                  | Instant                     | The instant, in UTC, of when the event was enqueued in the Event Hub partition.                       |
> | Offset                         | EventHubsHeaders#OFFSET                         | Long                        | The offset of the event when it was received from the associated Event Hub partition.                 |
> | Partition key                  | AzureHeaders#PARTITION_KEY                      | String                      | The partition hashing key if it was set when originally publishing the event.                         |
> | Partition ID                   | AzureHeaders#RAW_PARTITION_ID                   | String                      | The partition ID of the Event Hub.                                                                    |
> | Sequence number                | EventHubsHeaders#SEQUENCE_NUMBER                | Long                        | The sequence number assigned to the event when it was enqueued in the associated Event Hub partition. |
> | Last enqueued event properties | EventHubsHeaders#LAST_ENQUEUED_EVENT_PROPERTIES | LastEnqueuedEventProperties | The properties of the last enqueued event in this partition.                                          |
> | NA                             | AzureHeaders#CHECKPOINTER                       | Checkpointer                | The header for checkpoint the specific message.                                                       |

Users can parse the message headers for the related information of each event. To set a message header for the event, all customized headers will be put as an application property of an event, where the header is set as the property key. When events are received from Event Hubs, all application properties will be converted to the message header.

> [!NOTE]
> Message headers of partition key, enqueued time, offset and sequence number isn't supported to be set manually.

When the batch-consumer mode is enabled, the specific headers of batched messages are listed the follows, which contains a list of values from each single Event Hubs event.

Mapping between Event Hubs Message / Event Properties and Spring Message Headers in Batch Listener Mode:

> [!div class="mx-tdBreakAll"]
> | Event Hubs Event Properties | Spring Batch Message Header Constants                   | Type            | Description                                                                                                            |
> |-----------------------------|---------------------------------------------------------|-----------------|------------------------------------------------------------------------------------------------------------------------|
> | Enqueued time               | EventHubsHeaders#ENQUEUED_TIME                          | List of Instant | List of the instant, in UTC, of when each event was enqueued in the Event Hub partition.                               |
> | Offset                      | EventHubsHeaders#OFFSET                                 | List of Long    | List of the offset of each event when it was received from the associated Event Hub partition.                         |
> | Partition key               | AzureHeaders#PARTITION_KEY                              | List of String  | List of the partition hashing key if it was set when originally publishing each event.                                 |
> | Sequence number             | EventHubsHeaders#SEQUENCE_NUMBER                        | List of Long    | List of the sequence number assigned to each event when it was enqueued in the associated Event Hub partition.         |
> | System properties           | EventHubsHeaders#BATCH_CONVERTED_SYSTEM_PROPERTIES      | List of Map     | List of the system properties of each event.                                                                           |
> | Application properties      | EventHubsHeaders#BATCH_CONVERTED_APPLICATION_PROPERTIES | List of Map     | List of the application properties of each event, where all customized message headers or event properties are placed. |

> [!NOTE]
> When publish messages, all the above batch headers will be removed from the messages if exist.

### Samples

For more information, see the [azure-spring-boot-samples](https://github.com/Azure-Samples/azure-spring-boot-samples/tree/main/eventhubs/spring-cloud-azure-starter-integration-eventhubs/eventhubs-integration) repository on GitHub.

## Spring Integration with Azure Service Bus

### Key concepts

Spring Integration enables lightweight messaging within Spring-based applications and supports integration with external systems via declarative adapters.

The Spring Integration for Azure Service Bus extension project provides inbound and outbound channel adapters for Azure Service Bus.

> [!NOTE]
> CompletableFuture support APIs have been deprecated from version 2.10.0, and is replaced by Reactor Core from version 4.0.0.
See Javadoc for details.

### Dependency setup

```xml
<dependency>
    <groupId>com.azure.spring</groupId>
    <artifactId>spring-cloud-azure-starter-integration-servicebus</artifactId>
</dependency>
```

### Configuration

This starter provides the following 2 parts of configuration options:

#### Connection configuration properties

This section contains the configuration options used for connecting to Azure Service Bus.

> [!NOTE]
> If you choose to use a security principal to authenticate and authorize with Microsoft Entra ID for accessing an Azure resource, see [Authorize access with Microsoft Entra ID](authentication.md#authorize-access-with-microsoft-entra-id) to make sure the security principal has been granted the sufficient permission to access the Azure resource.

Connection configurable properties of spring-cloud-azure-starter-integration-servicebus:

> [!div class="mx-tdBreakAll"]
> | Property                                            | Type    | Description                                                                                                                 |
> |-----------------------------------------------------|---------|-----------------------------------------------------------------------------------------------------------------------------|
> | **spring.cloud.azure.servicebus**.enabled           | boolean | Whether an Azure Service Bus is enabled.                                                                                    |
> | **spring.cloud.azure.servicebus**.connection-string | String  | Service Bus Namespace connection string value.                                                                              |
> | **spring.cloud.azure.servicebus**.custom-endpoint-address | String  | The custom endpoint address to use when connecting to Service Bus.                                                                              |
> | **spring.cloud.azure.servicebus**.namespace         | String  | Service Bus Namespace value, which is the prefix of the FQDN. A FQDN should be composed of NamespaceName.DomainName |
> | **spring.cloud.azure.servicebus**.domain-name       | String  | Domain name of an Azure Service Bus Namespace value.                                                                        |

#### Service Bus processor configuration properties

The `ServiceBusInboundChannelAdapter` uses the `ServiceBusProcessorClient` to consume messages, to configure the overall properties of an `ServiceBusProcessorClient`,
developers can use `ServiceBusContainerProperties` for the configuration. See [the following section](#receive-messages-from-azure-service-bus) about how to work with `ServiceBusInboundChannelAdapter`.

### Basic usage

#### Send messages to Azure Service Bus

1. Fill the credential configuration options.

   * For credentials as connection string, configure the following properties in your **application.yml** file:

     ```yaml
     spring:
       cloud:
         azure:
           servicebus:
             connection-string: ${AZURE_SERVICE_BUS_CONNECTION_STRING}
     ```

     [!INCLUDE [security-note](../includes/security-note.md)]

   * For credentials as managed identities, configure the following properties in your **application.yml** file:

     ```yaml
     spring:
       cloud:
         azure:
           credential:
             managed-identity-enabled: true
             client-id: ${AZURE_CLIENT_ID}
           profile:
             tenant-id: <tenant>
           servicebus:
             namespace: ${AZURE_SERVICE_BUS_NAMESPACE}
     ```

> [!NOTE]
> The values allowed for `tenant-id` are: `common`, `organizations`, `consumers`, or the tenant ID. For more information about these values, see the [Used the wrong endpoint (personal and organization accounts)](/troubleshoot/azure/active-directory/error-code-aadsts50020-user-account-identity-provider-does-not-exist#cause-3-used-the-wrong-endpoint-personal-and-organization-accounts) section of [Error AADSTS50020 - User account from identity provider does not exist in tenant](/troubleshoot/azure/active-directory/error-code-aadsts50020-user-account-identity-provider-does-not-exist). For information on converting your single-tenant app, see [Convert single-tenant app to multitenant on Microsoft Entra ID](/entra/identity-platform/howto-convert-app-to-be-multi-tenant).

   * For credentials as service principal, configure the following properties in your **application.yml** file:

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
             namespace: ${AZURE_SERVICE_BUS_NAMESPACE}
     ```

> [!NOTE]
> The values allowed for `tenant-id` are: `common`, `organizations`, `consumers`, or the tenant ID. For more information about these values, see the [Used the wrong endpoint (personal and organization accounts)](/troubleshoot/azure/active-directory/error-code-aadsts50020-user-account-identity-provider-does-not-exist#cause-3-used-the-wrong-endpoint-personal-and-organization-accounts) section of [Error AADSTS50020 - User account from identity provider does not exist in tenant](/troubleshoot/azure/active-directory/error-code-aadsts50020-user-account-identity-provider-does-not-exist). For information on converting your single-tenant app, see [Convert single-tenant app to multitenant on Microsoft Entra ID](/entra/identity-platform/howto-convert-app-to-be-multi-tenant).

1. Create `DefaultMessageHandler` with the `ServiceBusTemplate` bean to send messages to Service Bus, set the entity type for the ServiceBusTemplate. This sample takes Service Bus Queue as example.

   ```java
   class Demo {
       private static final String OUTPUT_CHANNEL = "queue.output";

       @Bean
       @ServiceActivator(inputChannel = OUTPUT_CHANNEL)
       public MessageHandler queueMessageSender(ServiceBusTemplate serviceBusTemplate) {
           serviceBusTemplate.setDefaultEntityType(ServiceBusEntityType.QUEUE);
           DefaultMessageHandler handler = new DefaultMessageHandler(QUEUE_NAME, serviceBusTemplate);
           handler.setSendCallback(new ListenableFutureCallback<Void>() {
               @Override
               public void onSuccess(Void result) {
                   LOGGER.info("Message was sent successfully.");
               }

               @Override
               public void onFailure(Throwable ex) {
                   LOGGER.info("There was an error sending the message.");
               }
           });

           return handler;
       }
   }
   ```

1. Create a message gateway binding with the above message handler via a message channel.

   ```java
   class Demo {
       @Autowired
       QueueOutboundGateway messagingGateway;

       @MessagingGateway(defaultRequestChannel = OUTPUT_CHANNEL)
       public interface QueueOutboundGateway {
           void send(String text);
       }
   }
   ```

1. Send messages using the gateway.

   ```java
   class Demo {
       public void demo() {
           this.messagingGateway.send(message);
       }
   }
   ```

#### Receive messages from Azure Service Bus

1. Fill the credential configuration options.

1. Create a bean of message channel as the input channel.

   ```java
   @Configuration
   class Demo {
       private static final String INPUT_CHANNEL = "input";

       @Bean
       public MessageChannel input() {
           return new DirectChannel();
       }
   }
   ```

1. Create `ServiceBusInboundChannelAdapter` with the `ServiceBusMessageListenerContainer` bean to receive messages to Service Bus. This sample takes Service Bus Queue as example.

   ```java
   @Configuration
   class Demo {
       private static final String QUEUE_NAME = "queue1";

       @Bean
       public ServiceBusMessageListenerContainer messageListenerContainer(ServiceBusProcessorFactory processorFactory) {
           ServiceBusContainerProperties containerProperties = new ServiceBusContainerProperties();
           containerProperties.setEntityName(QUEUE_NAME);
           containerProperties.setAutoComplete(false);
           return new ServiceBusMessageListenerContainer(processorFactory, containerProperties);
       }

       @Bean
       public ServiceBusInboundChannelAdapter queueMessageChannelAdapter(
           @Qualifier(INPUT_CHANNEL) MessageChannel inputChannel,
           ServiceBusMessageListenerContainer listenerContainer) {
           ServiceBusInboundChannelAdapter adapter = new ServiceBusInboundChannelAdapter(listenerContainer);
           adapter.setOutputChannel(inputChannel);
           return adapter;
       }
   }
   ```

1. Create a message receiver binding with `ServiceBusInboundChannelAdapter` via the message channel we created before.

   ```java
   class Demo {
       @ServiceActivator(inputChannel = INPUT_CHANNEL)
       public void messageReceiver(byte[] payload, @Header(AzureHeaders.CHECKPOINTER) Checkpointer checkpointer) {
           String message = new String(payload);
           LOGGER.info("New message received: '{}'", message);
           checkpointer.success()
                   .doOnSuccess(s -> LOGGER.info("Message '{}' successfully checkpointed", message))
                   .doOnError(e -> LOGGER.error("Error found", e))
                   .block();
       }
   }
   ```

#### Configure ServiceBusMessageConverter to customize objectMapper

`ServiceBusMessageConverter` is made as a configurable bean to allow users to customize `ObjectMapper`.

#### Service Bus message headers

For some Service Bus headers that can be mapped to multiple Spring header constants, the priority of different Spring headers is listed.

Mapping between Service Bus Headers and Spring Headers:

> [!div class="mx-tdBreakAll"]
> | Service Bus message headers and properties | Spring message header constants                          | Type                   | Configurable | Description                                                                                                                                                 |
> |--------------------------------------------|----------------------------------------------------------|------------------------|--------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------|
> | Content type                               | `MessageHeaders#CONTENT_TYPE`                            | String                 | Yes          | The RFC2045 Content-Type descriptor of the message.                                                                                                         |
> | Correlation ID                             | `ServiceBusMessageHeaders#CORRELATION_ID`                | String                 | Yes          | The correlation ID of the message                                                                                                                           |
> | Message ID                                 | `ServiceBusMessageHeaders#MESSAGE_ID`                    | String                 | Yes          | The message ID of the message, this header has higher priority than `MessageHeaders#ID`.                                                                    |
> | Message ID                                 | `MessageHeaders#ID`                                      | UUID                   | Yes          | The message ID of the message, this header has lower priority than `ServiceBusMessageHeaders#MESSAGE_ID`.                                                   |
> | Partition key                              | `ServiceBusMessageHeaders#PARTITION_KEY`                 | String                 | Yes          | The partition key for sending the message to a partitioned entity.                                                                                          |
> | Reply to                                   | `MessageHeaders#REPLY_CHANNEL`                           | String                 | Yes          | The address of an entity to send replies to.                                                                                                                |
> | Reply to session ID                        | `ServiceBusMessageHeaders#REPLY_TO_SESSION_ID`           | String                 | Yes          | The ReplyToGroupId property value of the message.                                                                                                           |
> | Scheduled enqueue time utc                 | `ServiceBusMessageHeaders#SCHEDULED_ENQUEUE_TIME`        | OffsetDateTime         | Yes          | The datetime at which the message should be enqueued in Service Bus, this header has higher priority than `AzureHeaders#SCHEDULED_ENQUEUE_MESSAGE`.         |
> | Scheduled enqueue time utc                 | `AzureHeaders#SCHEDULED_ENQUEUE_MESSAGE`                 | Integer                | Yes          | The datetime at which the message should be enqueued in Service Bus, this header has lower priority than `ServiceBusMessageHeaders#SCHEDULED_ENQUEUE_TIME`. |
> | Session ID                                 | `ServiceBusMessageHeaders#SESSION_ID`                    | String                 | Yes          | The session IDentifier for a session-aware entity.                                                                                                          |
> | Time to live                               | `ServiceBusMessageHeaders#TIME_TO_LIVE`                  | Duration               | Yes          | The duration of time before this message expires.                                                                                                           |
> | To                                         | `ServiceBusMessageHeaders#TO`                            | String                 | Yes          | The "to" address of the message, reserved for future use in routing scenarios and presently ignored by the broker itself.                                   |
> | Subject                                    | `ServiceBusMessageHeaders#SUBJECT`                       | String                 | Yes          | The subject for the message.                                                                                                                                |
> | Dead letter error description              | `ServiceBusMessageHeaders#DEAD_LETTER_ERROR_DESCRIPTION` | String                 | No           | The description for a message that has been dead-lettered.                                                                                                  |
> | Dead letter reason                         | `ServiceBusMessageHeaders#DEAD_LETTER_REASON`            | String                 | No           | The reason a message was dead-lettered.                                                                                                                     |
> | Dead letter source                         | `ServiceBusMessageHeaders#DEAD_LETTER_SOURCE`            | String                 | No           | The entity in which the message was dead-lettered.                                                                                                          |
> | Delivery count                             | `ServiceBusMessageHeaders#DELIVERY_COUNT`                | long                   | No           | The number of the times this message was delivered to clients.                                                                                              |
> | Enqueued sequence number                   | `ServiceBusMessageHeaders#ENQUEUED_SEQUENCE_NUMBER`      | long                   | No           | The enqueued sequence number assigned to a message by Service Bus.                                                                                          |
> | Enqueued time                              | `ServiceBusMessageHeaders#ENQUEUED_TIME`                 | OffsetDateTime         | No           | The datetime at which this message was enqueued in Service Bus.                                                                                             |
> | Expires at                                 | `ServiceBusMessageHeaders#EXPIRES_AT`                    | OffsetDateTime         | No           | The datetime at which this message will expire.                                                                                                             |
> | Lock token                                 | `ServiceBusMessageHeaders#LOCK_TOKEN`                    | String                 | No           | The lock token for the current message.                                                                                                                     |
> | Locked until                               | `ServiceBusMessageHeaders#LOCKED_UNTIL`                  | OffsetDateTime         | No           | The datetime at which the lock of this message expires.                                                                                                     |
> | Sequence number                            | `ServiceBusMessageHeaders#SEQUENCE_NUMBER`               | long                   | No           | The unique number assigned to a message by Service Bus.                                                                                                     |
> | State                                      | `ServiceBusMessageHeaders#STATE`                         | ServiceBusMessageState | No           | The state of the message, which can be Active, Deferred, or Scheduled.                                                                                      |

#### Partition key support

This starter supports [Service Bus partitioning](/azure/service-bus-messaging/service-bus-partitioning) by allowing setting partition key and session ID in the message header. This section introduces how to set partition key for messages.

Recommended: Use `ServiceBusMessageHeaders.PARTITION_KEY` as the key of the header.

```java
public class SampleController {
    @PostMapping("/messages")
    public ResponseEntity<String> sendMessage(@RequestParam String message) {
        LOGGER.info("Going to add message {} to Sinks.Many.", message);
        many.emitNext(MessageBuilder.withPayload(message)
                                    .setHeader(ServiceBusMessageHeaders.PARTITION_KEY, "Customize partition key")
                                    .build(), Sinks.EmitFailureHandler.FAIL_FAST);
        return ResponseEntity.ok("Sent!");
    }
}
```

Not recommended but currently supported: `AzureHeaders.PARTITION_KEY` as the key of the header.

```java
public class SampleController {
    @PostMapping("/messages")
    public ResponseEntity<String> sendMessage(@RequestParam String message) {
        LOGGER.info("Going to add message {} to Sinks.Many.", message);
        many.emitNext(MessageBuilder.withPayload(message)
                                    .setHeader(AzureHeaders.PARTITION_KEY, "Customize partition key")
                                    .build(), Sinks.EmitFailureHandler.FAIL_FAST);
        return ResponseEntity.ok("Sent!");
    }
}
```

> [!NOTE]
> When both `ServiceBusMessageHeaders.PARTITION_KEY` and `AzureHeaders.PARTITION_KEY` are set in the message headers,
`ServiceBusMessageHeaders.PARTITION_KEY` is preferred.

#### Session support

This example demonstrates how to manually set the session ID of a message in the application.

```java
public class SampleController {
    @PostMapping("/messages")
    public ResponseEntity<String> sendMessage(@RequestParam String message) {
        LOGGER.info("Going to add message {} to Sinks.Many.", message);
        many.emitNext(MessageBuilder.withPayload(message)
                                    .setHeader(ServiceBusMessageHeaders.SESSION_ID, "Customize session ID")
                                    .build(), Sinks.EmitFailureHandler.FAIL_FAST);
        return ResponseEntity.ok("Sent!");
    }
}
```

> [!NOTE]
> When the `ServiceBusMessageHeaders.SESSION_ID` is set in the message headers, and a different `ServiceBusMessageHeaders.PARTITION_KEY` header is also set, the value of the session ID will eventually be used to overwrite the value of the partition key.

#### Customize Service Bus client properties

Developers can use `AzureServiceClientBuilderCustomizer` to customize Service Bus Client properties. The following example customizes the `sessionIdleTimeout` property in `ServiceBusClientBuilder`:

```java
@Bean
public AzureServiceClientBuilderCustomizer<ServiceBusClientBuilder.ServiceBusSessionProcessorClientBuilder> customizeBuilder() {
    return builder -> builder.sessionIdleTimeout(Duration.ofSeconds(10));
}
```

### Samples

For more information, see the [azure-spring-boot-samples](https://github.com/Azure-Samples/azure-spring-boot-samples/tree/main/servicebus/spring-cloud-azure-starter-integration-servicebus) repository on GitHub.

## Spring Integration with Azure Storage Queue

### Key concepts

Azure Queue Storage is a service for storing large numbers of messages. You access messages from anywhere in the world via authenticated calls using HTTP or HTTPS. A queue message can be up to 64 KB in size. A queue may contain millions of messages, up to the total capacity limit of a storage account. Queues are commonly used to create a backlog of work to process asynchronously.

### Dependency setup

```xml
<dependency>
    <groupId>com.azure.spring</groupId>
    <artifactId>spring-cloud-azure-starter-integration-storage-queue</artifactId>
</dependency>
```

### Configuration

This starter provides the following configuration options:

#### Connection configuration properties

This section contains the configuration options used for connecting to Azure Storage Queue.

> [!NOTE]
> If you choose to use a security principal to authenticate and authorize with Microsoft Entra ID for accessing an Azure resource, see [Authorize access with Microsoft Entra ID](authentication.md#authorize-access-with-microsoft-entra-id) to make sure the security principal has been granted the sufficient permission to access the Azure resource.

Connection configurable properties of spring-cloud-azure-starter-integration-storage-queue:

> [!div class="mx-tdBreakAll"]
> | Property                                               | Type                | Description                                                |
> |--------------------------------------------------------|---------------------|------------------------------------------------------------|
> | **spring.cloud.azure.storage.queue**.enabled           | boolean             | Whether an Azure Storage Queue is enabled.                 |
> | **spring.cloud.azure.storage.queue**.connection-string | String              | Storage Queue Namespace connection string value.           |
> | **spring.cloud.azure.storage.queue**.accountName       | String              | Storage Queue account name.                                |
> | **spring.cloud.azure.storage.queue**.accountKey        | String              | Storage Queue account key.                                 |
> | **spring.cloud.azure.storage.queue**.endpoint          | String              | Storage Queue service endpoint.                            |
> | **spring.cloud.azure.storage.queue**.sasToken          | String              | Sas token credential                                       |
> | **spring.cloud.azure.storage.queue**.serviceVersion    | QueueServiceVersion | QueueServiceVersion that is used when making API requests. |
> | **spring.cloud.azure.storage.queue**.messageEncoding   | String              | Queue message encoding.                                    |

### Basic usage

#### Send messages to Azure Storage Queue

1. Fill the credential configuration options.

   * For credentials as connection string, configure the following properties in your **application.yml** file:

     ```yaml
     spring:
       cloud:
         azure:
           storage:
             queue:
               connection-string: ${AZURE_STORAGE_QUEUE_CONNECTION_STRING}
     ```

     [!INCLUDE [security-note](../includes/security-note.md)]

   * For credentials as managed identities, configure the following properties in your **application.yml** file:

     ```yaml
     spring:
       cloud:
         azure:
           credential:
             managed-identity-enabled: true
             client-id: ${AZURE_CLIENT_ID}
           profile:
             tenant-id: <tenant>
           storage:
             queue:
               account-name: ${AZURE_STORAGE_QUEUE_ACCOUNT_NAME}
     ```

> [!NOTE]
> The values allowed for `tenant-id` are: `common`, `organizations`, `consumers`, or the tenant ID. For more information about these values, see the [Used the wrong endpoint (personal and organization accounts)](/troubleshoot/azure/active-directory/error-code-aadsts50020-user-account-identity-provider-does-not-exist#cause-3-used-the-wrong-endpoint-personal-and-organization-accounts) section of [Error AADSTS50020 - User account from identity provider does not exist in tenant](/troubleshoot/azure/active-directory/error-code-aadsts50020-user-account-identity-provider-does-not-exist). For information on converting your single-tenant app, see [Convert single-tenant app to multitenant on Microsoft Entra ID](/entra/identity-platform/howto-convert-app-to-be-multi-tenant).

   * For credentials as service principal, configure the following properties in your **application.yml** file:

     ```yaml
     spring:
       cloud:
         azure:
           credential:
             client-id: ${AZURE_CLIENT_ID}
             client-secret: ${AZURE_CLIENT_SECRET}
           profile:
             tenant-id: <tenant>
           storage:
             queue:
               account-name: ${AZURE_STORAGE_QUEUE_ACCOUNT_NAME}
     ```

> [!NOTE]
> The values allowed for `tenant-id` are: `common`, `organizations`, `consumers`, or the tenant ID. For more information about these values, see the [Used the wrong endpoint (personal and organization accounts)](/troubleshoot/azure/active-directory/error-code-aadsts50020-user-account-identity-provider-does-not-exist#cause-3-used-the-wrong-endpoint-personal-and-organization-accounts) section of [Error AADSTS50020 - User account from identity provider does not exist in tenant](/troubleshoot/azure/active-directory/error-code-aadsts50020-user-account-identity-provider-does-not-exist). For information on converting your single-tenant app, see [Convert single-tenant app to multitenant on Microsoft Entra ID](/entra/identity-platform/howto-convert-app-to-be-multi-tenant).

1. Create `DefaultMessageHandler` with the `StorageQueueTemplate` bean to send messages to Storage Queue.

   ```java
   class Demo {
       private static final String STORAGE_QUEUE_NAME = "example";
       private static final String OUTPUT_CHANNEL = "output";

       @Bean
       @ServiceActivator(inputChannel = OUTPUT_CHANNEL)
       public MessageHandler messageSender(StorageQueueTemplate storageQueueTemplate) {
           DefaultMessageHandler handler = new DefaultMessageHandler(STORAGE_QUEUE_NAME, storageQueueTemplate);
           handler.setSendCallback(new ListenableFutureCallback<Void>() {
               @Override
               public void onSuccess(Void result) {
                   LOGGER.info("Message was sent successfully.");
               }

               @Override
               public void onFailure(Throwable ex) {
                   LOGGER.info("There was an error sending the message.");
               }
           });
           return handler;
       }
   }
   ```

1. Create a Message gateway binding with the above message handler via a message channel.

   ```java
   class Demo {
       @Autowired
       StorageQueueOutboundGateway storageQueueOutboundGateway;

       @MessagingGateway(defaultRequestChannel = OUTPUT_CHANNEL)
       public interface StorageQueueOutboundGateway {
           void send(String text);
       }
   }
   ```

1. Send messages using the gateway.

   ```java
   class Demo {
       public void demo() {
           this.storageQueueOutboundGateway.send(message);
       }
   }
   ```

#### Receive messages from Azure Storage Queue

1. Fill the credential configuration options.

1. Create a bean of message channel as the input channel.

   ```java
   class Demo {
       private static final String INPUT_CHANNEL = "input";

       @Bean
       public MessageChannel input() {
           return new DirectChannel();
       }
   }
   ```

1. Create `StorageQueueMessageSource` with the `StorageQueueTemplate` bean to receive messages to Storage Queue.

   ```java
   class Demo {
       private static final String STORAGE_QUEUE_NAME = "example";

       @Bean
       @InboundChannelAdapter(channel = INPUT_CHANNEL, poller = @Poller(fixedDelay = "1000"))
       public StorageQueueMessageSource storageQueueMessageSource(StorageQueueTemplate storageQueueTemplate) {
           return new StorageQueueMessageSource(STORAGE_QUEUE_NAME, storageQueueTemplate);
       }
   }
   ```

1. Create a message receiver binding with StorageQueueMessageSource created in the last step via the message channel we created before.

   ```java
   class Demo {
       @ServiceActivator(inputChannel = INPUT_CHANNEL)
       public void messageReceiver(byte[] payload, @Header(AzureHeaders.CHECKPOINTER) Checkpointer checkpointer) {
           String message = new String(payload);
           LOGGER.info("New message received: '{}'", message);
           checkpointer.success()
               .doOnError(Throwable::printStackTrace)
               .doOnSuccess(t -> LOGGER.info("Message '{}' successfully checkpointed", message))
               .block();
       }
   }
   ```

### Samples

For more information, see the [azure-spring-boot-samples](https://github.com/Azure-Samples/azure-spring-boot-samples/tree/main/storage/spring-cloud-azure-starter-integration-storage-queue) repository on GitHub.
