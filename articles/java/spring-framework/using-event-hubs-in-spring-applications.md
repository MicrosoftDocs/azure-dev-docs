---
title: Using Event Hubs in Spring applications
description: This article shows you how to use Azure Event Hubs in Java applications built with Spring framework.
author: KarlErickson
ms.author: karler
ms.reviewer: xiada
ms.date: 04/18/2025
ms.topic: how-to
ms.custom: devx-track-java, spring-cloud-azure, devx-track-extended-java
---

# Use Event Hubs in Spring applications

This article shows you how to use Azure Event Hubs in Java applications built with the [Spring Framework](https://spring.io/projects/spring-framework).

[Azure Event Hubs](/azure/event-hubs/event-hubs-about) is a big data streaming platform and event ingestion service. It can receive and process millions of events per second. Data sent to an event hub can be transformed and stored by using any real-time analytics provider or batching/storage adapters.

Spring Cloud Azure provides various modules for sending messages to and receiving messages from Event Hubs using Spring frameworks.

You can use the following modules independently or combine them for different use cases:

- [Spring Cloud Azure Event Hubs Starter](#use-spring-cloud-azure-event-hubs-starter) enables you to send and receive messages with Event Hubs Java SDK client library with Spring Boot features.

- [Spring Messaging Azure Event Hubs](#use-spring-messaging-azure-event-hubs) enables you to interact with Event Hubs via [Spring Messaging](https://docs.spring.io/spring-boot/docs/current/reference/html/messaging.html) API.

- [Spring Integration Azure Event Hubs](#use-spring-integration-azure-event-hubs) enables you to connect Spring Integration [Message Channels](https://docs.spring.io/spring-integration/reference/channel.html) with Event Hubs.

- [Spring Cloud Azure Stream Event Hubs Binder](#use-spring-cloud-azure-stream-event-hubs-binder) enables you to use Event Hubs as a messaging middleware in Spring Cloud Stream applications.

- [Spring Kafka with Azure Event Hubs](#use-spring-kafka-with-azure-event-hubs) enables you to use [Spring Kafka](https://docs.spring.io/spring-kafka/reference/index.html) to send messages to and receive messages from Event Hubs.

- [Spring Cloud Stream Kafka Binder with Azure Event Hubs](#use-spring-cloud-stream-kafka-binder-with-azure-event-hubs) enables you to send and receive message via Spring Cloud Stream Kafka Binder with Event Hubs.

[!INCLUDE [spring-data-prerequisites.md](includes/spring-data-prerequisites.md)]

- An Azure Event Hubs instance. For more information, see [Quickstart: Create an event hub using Azure portal](/azure/event-hubs/event-hubs-create).

- An Azure Storage Account for Event Hubs checkpoints. For more information, see [Create a storage account](/azure/storage/common/storage-account-create?tabs=azure-portal).

- A Spring Boot application. If you don't have one, create a **Maven project** with the [Spring Initializr](https://start.spring.io/). Remember to select **Maven Project** and, under **Dependencies**, add the **Spring Web** dependency, then select Java version 8 or higher.

> [!NOTE]
> To grant your account access to resources, in Azure Event Hubs, assign the `Azure Event Hubs Data Receiver` and `Azure Event Hubs Data Sender` role to the Microsoft Entra account you're currently using. Then, in the Azure Storage account, assign the `Storage Blob Data Contributor` role to the Microsoft Entra account you're currently using. For more information about granting access roles, see [Assign Azure roles using the Azure portal](/azure/role-based-access-control/role-assignments-portal) and [Authorize access to Event Hubs resources using Microsoft Entra ID](/azure/event-hubs/authorize-access-azure-active-directory).

> [!IMPORTANT]
> Spring Boot version 2.5 or higher is required to complete the steps in this tutorial.

[!INCLUDE [prepare-your-local-environment](includes/prepare-your-local-environment.md)]

## Use Spring Cloud Azure Event Hubs Starter

The [Spring Cloud Azure Event Hubs Starter](https://mvnrepository.com/artifact/com.azure.spring/spring-cloud-azure-starter-eventhubs) module imports the [Event Hubs Java client library](https://mvnrepository.com/artifact/com.azure/azure-messaging-eventhubs) with the Spring Boot framework. You can use Spring Cloud Azure and the Azure SDK together, in a non-mutually exclusive pattern. Thus, you can continue using the Event Hubs Java client API in your Spring application.

### Add dependencies

To install the Spring Cloud Azure Event Hubs Starter module, add the following dependencies to your **pom.xml** file:

- The Spring Cloud Azure Bill of Materials (BOM):

  ```xml
  <dependencyManagement>
     <dependencies>
       <dependency>
         <groupId>com.azure.spring</groupId>
         <artifactId>spring-cloud-azure-dependencies</artifactId>
         <version>5.22.0</version>
         <type>pom</type>
         <scope>import</scope>
         </dependency>
     </dependencies>
  </dependencyManagement>
  ```

  > [!NOTE]
  > If you're using Spring Boot 2.x, be sure to set the `spring-cloud-azure-dependencies` version to `4.20.0`.
  > This Bill of Material (BOM) should be configured in the `<dependencyManagement>` section of your **pom.xml** file. This ensures that all Spring Cloud Azure dependencies are using the same version.
  > For more information about the version used for this BOM, see [Which Version of Spring Cloud Azure Should I Use](https://github.com/Azure/azure-sdk-for-java/wiki/Spring-Versions-Mapping#which-version-of-spring-cloud-azure-should-i-use).

- The Spring Cloud Azure Event Hubs artifact:

  ```xml
  <dependency>
    <groupId>com.azure.spring</groupId>
    <artifactId>spring-cloud-azure-starter-eventhubs</artifactId>
  </dependency>
  ```

### Code the application to send and receive messages

This guide teaches you how to use the Event Hubs Java clients in the context of a Spring application. Here, we introduce the following two options:

- Use Spring Boot autoconfiguration and use out-of-the-box clients from the Spring context (recommended).
- Build the client programmatically.

The way of autowiring client beans from the Spring IoC container has the following advantages, which can provide you with a more flexible and efficient experience when developing with Event Hubs clients:

- It applies the [externalized configuration](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#features.external-config) so that you can work with the same application code in different environments.
- You can delegate to the Spring Boot framework the process of learning the builder pattern and registering this client to the application context. This delegation enables you to focus on how to use the clients with your own business requirement.
- You can use health indicator in an easy way to inspect the status and health of your application and internal components.

The following sections provide code examples that show you how to use `EventProcessorClient` and `EventHubProducerClient` with the two alternatives.

> [!NOTE]
> Azure Java SDK for Event Hubs provides multiple clients to interact with Event Hubs. The starter also provides autoconfiguration for all the Event Hubs clients as well as client builders. This article uses only `EventProcessorClient` and `EventHubProducerClient` as examples.

#### Use Spring Boot Autoconfiguration

To send messages to and receive messages from Event Hubs, configure the application by using the following steps:

1. Use the following property settings to configure your Event Hubs namespace and event hub name:

   ```properties
   spring.cloud.azure.eventhubs.namespace=<your event-hubs-namespace>
   spring.cloud.azure.eventhubs.event-hub-name=<your-event-hub-name>
   spring.cloud.azure.eventhubs.processor.checkpoint-store.account-name=<your-storage-account-name>
   spring.cloud.azure.eventhubs.processor.checkpoint-store.container-name=<your-storage-account-container-name>
   spring.cloud.azure.eventhubs.processor.consumer-group=$Default
   ```

1. Create a new `EventHubProcessorClientConfiguration` Java class as shown in the following example. This class is used to register the message and error handler for `EventProcessorClient`.

   ```java
   import com.azure.spring.cloud.service.eventhubs.consumer.EventHubsErrorHandler;
   import com.azure.spring.cloud.service.eventhubs.consumer.EventHubsRecordMessageListener;
   import org.slf4j.Logger;
   import org.slf4j.LoggerFactory;
   import org.springframework.context.annotation.Bean;
   import org.springframework.context.annotation.Configuration;

   @Configuration
   public class EventHubProcessorClientConfiguration {

       private static final Logger LOGGER = LoggerFactory.getLogger(EventHubProcessorClientConfiguration.class);

       @Bean
       EventHubsRecordMessageListener processEvent() {
           return eventContext->LOGGER.info("Processing event from partition {} with sequence number {} with body: {}",
               eventContext.getPartitionContext().getPartitionId(), eventContext.getEventData().getSequenceNumber(),
               eventContext.getEventData().getBodyAsString());
       }

       @Bean
       EventHubsErrorHandler processError() {
           return errorContext->LOGGER.info("Error occurred in partition processor for partition {}, {}",
               errorContext.getPartitionContext().getPartitionId(),
               errorContext.getThrowable());
       }

   }
   ```

1. Inject the `EventProcessorClient` and `EventHubProducerClient` in your Spring application, and call the related APIs to send and receive messages, as shown in the following example:

   ```java
   import com.azure.messaging.eventhubs.EventData;
   import com.azure.messaging.eventhubs.EventHubProducerClient;
   import com.azure.messaging.eventhubs.EventProcessorClient;
   import org.slf4j.Logger;
   import org.slf4j.LoggerFactory;
   import org.springframework.boot.CommandLineRunner;
   import org.springframework.boot.SpringApplication;
   import org.springframework.boot.autoconfigure.SpringBootApplication;

   import java.util.Collections;
   import java.util.concurrent.TimeUnit;

   @SpringBootApplication
   public class EventHubClientApplication implements CommandLineRunner {

       private static final Logger LOGGER = LoggerFactory.getLogger(EventHubClientApplication.class);
       private final EventHubProducerClient eventHubProducerClient;
       private final EventProcessorClient eventProcessorClient;

       public EventHubClientApplication(EventHubProducerClient eventHubProducerClient,
                                        EventProcessorClient eventProcessorClient) {
           this.eventHubProducerClient = eventHubProducerClient;
           this.eventProcessorClient = eventProcessorClient;
       }

       public static void main(String[] args) {
           SpringApplication.run(EventHubClientApplication.class, args);
       }

       @Override
       public void run(String... args) throws Exception {
           eventProcessorClient.start();
           // Wait for the processor client to be ready
           TimeUnit.SECONDS.sleep(10);

           eventHubProducerClient.send(Collections.singletonList(new EventData("Hello World")));
           LOGGER.info("Successfully sent a message to Event Hubs.");
           eventHubProducerClient.close();
           LOGGER.info("Skip stopping and closing the processor since the processor may not complete the receiving process yet.");
       }

   }
   ```

1. Start the application. You're shown logs similar to the following example:

   ```output
   Successfully sent a message to Event Hubs.
   ...
   Processing event from partition 0 with sequence number 0 with body: Hello World
   ...
   Stopping and closing the processor.
   ```

#### Build the client programmatically

You can build the client beans by yourself, but the process is complicated. In Spring Boot applications, you have to manage properties, learn the builder pattern, and register the client to your Spring application context. The following steps show you how to do that:

1. Create a new `EventHubClientConfiguration` Java class as shown in the following example. This class is used to declare the `EventProcessorClient` and `EventHubProducerClient` beans. Be sure to replace the `<your event-hubs-namespace>`, `<your-event-hub-name>`, `<your-storage-account-name>`, and `<your-storage-account-container-name>` placeholders with your actual values.

   ```java
   import com.azure.identity.DefaultAzureCredentialBuilder;
   import com.azure.messaging.eventhubs.EventHubClientBuilder;
   import com.azure.messaging.eventhubs.EventHubProducerClient;
   import com.azure.messaging.eventhubs.EventProcessorClient;
   import com.azure.messaging.eventhubs.EventProcessorClientBuilder;
   import com.azure.messaging.eventhubs.checkpointstore.blob.BlobCheckpointStore;
   import com.azure.messaging.eventhubs.models.ErrorContext;
   import com.azure.messaging.eventhubs.models.EventContext;
   import com.azure.storage.blob.BlobContainerAsyncClient;
   import com.azure.storage.blob.BlobContainerClientBuilder;
   import org.slf4j.Logger;
   import org.slf4j.LoggerFactory;
   import org.springframework.context.annotation.Bean;
   import org.springframework.context.annotation.Configuration;

   @Configuration
   public class EventHubClientConfiguration {

       private static final Logger LOGGER = LoggerFactory.getLogger(EventHubClientConfiguration.class);
       private static final String EVENT_HUB_FULLY_QUALIFIED_NAMESPACE = "<your event-hubs-namespace>.servicebus.windows.net";
       private static final String EVENT_HUB_NAME = "<your-event-hub-name>";
       private static final String CONSUMER_GROUP = "$Default";
       private static final String STORAGE_ACCOUNT_ENDPOINT = "https://<your-storage-account-name>.blob.core.windows.net";
       private static final String STORAGE_CONTAINER_NAME = "<your-storage-account-container-name>";

       @Bean
       EventHubClientBuilder eventHubClientBuilder() {
           return new EventHubClientBuilder().credential(EVENT_HUB_FULLY_QUALIFIED_NAMESPACE, EVENT_HUB_NAME,
               new DefaultAzureCredentialBuilder()
                   .build());
       }

       @Bean
       BlobContainerClientBuilder blobContainerClientBuilder() {
           return new BlobContainerClientBuilder().credential(new DefaultAzureCredentialBuilder()
                                                      .build())
                                                  .endpoint(STORAGE_ACCOUNT_ENDPOINT)
                                                  .containerName(STORAGE_CONTAINER_NAME);
       }

       @Bean
       BlobContainerAsyncClient blobContainerAsyncClient(BlobContainerClientBuilder blobContainerClientBuilder) {
           return blobContainerClientBuilder.buildAsyncClient();
       }

       @Bean
       EventProcessorClientBuilder eventProcessorClientBuilder(BlobContainerAsyncClient blobContainerAsyncClient) {
           return new EventProcessorClientBuilder().credential(EVENT_HUB_FULLY_QUALIFIED_NAMESPACE, EVENT_HUB_NAME,
                                                       new DefaultAzureCredentialBuilder()
                                                           .build())
                                                   .consumerGroup(CONSUMER_GROUP)
                                                   .checkpointStore(new BlobCheckpointStore(blobContainerAsyncClient))
                                                   .processEvent(EventHubClientConfiguration::processEvent)
                                                   .processError(EventHubClientConfiguration::processError);
       }

       @Bean
       EventHubProducerClient eventHubProducerClient(EventHubClientBuilder eventHubClientBuilder) {
           return eventHubClientBuilder.buildProducerClient();

       }

       @Bean
       EventProcessorClient eventProcessorClient(EventProcessorClientBuilder eventProcessorClientBuilder) {
           return eventProcessorClientBuilder.buildEventProcessorClient();
       }

       public static void processEvent(EventContext eventContext) {
           LOGGER.info("Processing event from partition {} with sequence number {} with body: {}",
               eventContext.getPartitionContext().getPartitionId(), eventContext.getEventData().getSequenceNumber(),
               eventContext.getEventData().getBodyAsString());
       }

       public static void processError(ErrorContext errorContext) {
           LOGGER.info("Error occurred in partition processor for partition {}, {}",
               errorContext.getPartitionContext().getPartitionId(),
               errorContext.getThrowable());
       }

   }
   ```

1. Inject the `EventProcessorClient` and `EventHubProducerClient` in your Spring application, as shown in the following example:

   ```java
   import com.azure.messaging.eventhubs.EventData;
   import com.azure.messaging.eventhubs.EventHubProducerClient;
   import com.azure.messaging.eventhubs.EventProcessorClient;
   import org.slf4j.Logger;
   import org.slf4j.LoggerFactory;
   import org.springframework.boot.CommandLineRunner;
   import org.springframework.boot.SpringApplication;
   import org.springframework.boot.autoconfigure.SpringBootApplication;

   import java.util.Collections;
   import java.util.concurrent.TimeUnit;

   @SpringBootApplication
   public class EventHubClientApplication implements CommandLineRunner {

       private static final Logger LOGGER = LoggerFactory.getLogger(EventHubClientApplication.class);
       private final EventHubProducerClient eventHubProducerClient;
       private final EventProcessorClient eventProcessorClient;

       public EventHubClientApplication(EventHubProducerClient eventHubProducerClient,
                                        EventProcessorClient eventProcessorClient) {
           this.eventHubProducerClient = eventHubProducerClient;
           this.eventProcessorClient = eventProcessorClient;
       }

       public static void main(String[] args) {
           SpringApplication.run(EventHubClientApplication.class, args);
       }

       @Override
       public void run(String... args) throws Exception {
           eventProcessorClient.start();
           // Wait for the processor client to be ready
           TimeUnit.SECONDS.sleep(10);

           eventHubProducerClient.send(Collections.singletonList(new EventData("Hello World")));
           LOGGER.info("Successfully sent a message to Event Hubs.");
           eventHubProducerClient.close();
           LOGGER.info("Stopping and closing the processor");
           eventProcessorClient.stop();
       }

   }
   ```

1. Start the application. You're shown logs similar to the following example:

   ```output
   Successfully sent a message to Event Hubs.
   ...
   Processing event from partition 0 with sequence number 0 with body: Hello World
   ...
   Stopping and closing the processor.
   ```

The following list shows some reasons why this code isn't flexible or graceful:

- The Event Hubs namespace and event hub name are hard coded.
- If you use `@Value` to get configurations from the Spring environment, you can't have IDE hints in your **application.properties** file.
- If you have a microservice scenario, you must duplicate the code in each project, and it's easy to make mistakes and hard to be consistent.

Fortunately, building the client beans by yourself isn't necessary with Spring Cloud Azure. Instead, you can directly inject them and use the configuration properties that you're already familiar with to configure Storage queue. For more information, see [Spring Cloud Azure configuration](configuration.md).

Spring Cloud Azure also provides the following global configurations for different scenarios. For more information, see the [Global configuration for Azure Service SDKs](configuration.md#global-configuration-for-azure-service-sdks) section of the [Spring Cloud Azure configuration](configuration.md).

- Proxy options.
- Retry options.
- AMQP transport client options.

You can also connect to different Azure clouds. For more information, see [Connect to different Azure clouds](https://devblogs.microsoft.com/azure-sdk/announcing-the-stable-release-of-spring-cloud-azure-version-4-4-0/#connect-to-different-azure-clouds).

## Use Spring Messaging Azure Event Hubs

The [Spring Messaging Azure Event Hubs](https://mvnrepository.com/artifact/com.azure.spring/spring-messaging-azure-eventhubs) module provides support for [Spring Messaging](https://docs.spring.io/spring-boot/docs/current/reference/html/messaging.html) framework with Event Hubs.

If you're using Spring Messaging Azure Event Hubs, then you can use the following features:

- `EventHubsTemplate`: Send messages to an Event Hubs asynchronously and synchronously.
- `@EventHubsListener`: Mark a method to be the target of an Event Hubs message listener on the destination.

This guide shows you how to use Spring Messaging Azure Event Hubs to send messages to and receive messages from Event Hubs.

### Add dependencies

To install the Spring Messaging Azure Event Hubs module, add the following dependencies to your **pom.xml** file:

- The Spring Cloud Azure Bill of Materials (BOM):

  ```xml
  <dependencyManagement>
     <dependencies>
       <dependency>
         <groupId>com.azure.spring</groupId>
         <artifactId>spring-cloud-azure-dependencies</artifactId>
         <version>5.22.0</version>
         <type>pom</type>
         <scope>import</scope>
         </dependency>
     </dependencies>
  </dependencyManagement>
  ```

  > [!NOTE]
  > If you're using Spring Boot 2.x, be sure to set the `spring-cloud-azure-dependencies` version to `4.20.0`.
  > This Bill of Material (BOM) should be configured in the `<dependencyManagement>` section of your **pom.xml** file. This ensures that all Spring Cloud Azure dependencies are using the same version.
  > For more information about the version used for this BOM, see [Which Version of Spring Cloud Azure Should I Use](https://github.com/Azure/azure-sdk-for-java/wiki/Spring-Versions-Mapping#which-version-of-spring-cloud-azure-should-i-use).

- The Spring Cloud Azure starter, Spring Messaging Event Hubs and Azure Event Hubs Checkpoint Store artifacts:

  ```xml
  <dependency>
    <groupId>com.azure.spring</groupId>
    <artifactId>spring-cloud-azure-starter</artifactId>
  </dependency>
  <dependency>
    <groupId>com.azure.spring</groupId>
    <artifactId>spring-messaging-azure-eventhubs</artifactId>
  </dependency>
  <dependency>
    <groupId>com.azure</groupId>
    <artifactId>azure-messaging-eventhubs-checkpointstore-blob</artifactId>
  </dependency>
  ```

### Code the application to send and receive messages

To send messages to and receive messages from Event Hubs, configure the application by using the following steps:

1. Use the following property settings to configure the Event Hubs namespace and Storage Blob:

   ```properties
   spring.cloud.azure.eventhubs.namespace=<your event-hubs-namespace>
   spring.cloud.azure.eventhubs.processor.checkpoint-store.account-name=<your-storage-account-name>
   spring.cloud.azure.eventhubs.processor.checkpoint-store.container-name=<your-storage-account-container-name>
   ```

1. Create a new `ConsumerService` Java class as shown in the following example. This class is used to define a message receiver. Be sure to replace the `<your-event-hub-name>` placeholder with your actual value.

   ```java
   import com.azure.spring.messaging.eventhubs.implementation.core.annotation.EventHubsListener;
   import org.springframework.stereotype.Service;

   @Service
   public class ConsumerService {

       private static final String EVENT_HUB_NAME = "<your-event-hub-name>";
       private static final String CONSUMER_GROUP = "$DEFAULT";

       @EventHubsListener(destination = EVENT_HUB_NAME, group = CONSUMER_GROUP)
       public void handleMessageFromEventHub(String message) {
           System.out.printf("New message received: %s%n", message);
       }

   }
   ```

1. Wire up a sender and a receiver to send and receive messages with Spring, as shown in the following example. Be sure to replace the `<your-event-hub-name>` placeholder with your actual value.

   ```java
   import com.azure.spring.messaging.eventhubs.core.EventHubsTemplate;
   import com.azure.spring.messaging.implementation.annotation.EnableAzureMessaging;
   import org.slf4j.Logger;
   import org.slf4j.LoggerFactory;
   import org.springframework.boot.SpringApplication;
   import org.springframework.boot.autoconfigure.SpringBootApplication;
   import org.springframework.context.ConfigurableApplicationContext;
   import org.springframework.messaging.support.MessageBuilder;

   @SpringBootApplication
   @EnableAzureMessaging
   public class EventHubMessagingApplication {

       private static final String EVENT_HUB_NAME = "<your-event-hub-name>";
       private static final Logger LOGGER = LoggerFactory.getLogger(EventHubMessagingApplication.class);

       public static void main(String[] args) {
           ConfigurableApplicationContext applicationContext = SpringApplication.run(EventHubMessagingApplication.class);
           EventHubsTemplate eventHubsTemplate = applicationContext.getBean(EventHubsTemplate.class);
           LOGGER.info("Sending a message to the Event Hubs.");
           eventHubsTemplate.sendAsync(EVENT_HUB_NAME, MessageBuilder.withPayload("Hello world").build()).subscribe();
       }

   }
   ```

   > [!TIP]
   > Remember to add the `@EnableAzureMessaging` annotation, which triggers the discovery of methods annotated with `@EventHubsListener`, creating the message listener container under the covers.

1. Start the application. You're shown logs similar to the following example:

   ```output
   Sending a message to the Event Hubs.
   New message received: Hello world
   ```

## Use Spring Integration Azure Event Hubs

The [Spring Integration Azure Event Hubs](https://mvnrepository.com/artifact/com.azure.spring/spring-integration-azure-eventhubs) module provides support for the [Spring Integration](https://docs.spring.io/spring-boot/docs/current/reference/html/messaging.html) framework with Event Hubs.

If your Spring application uses Spring Integration message channels, you can route messages between your message channels and Event Hubs using channel adapters.

An inbound channel adapter forwards messages from an event hub to a message channel.
An outbound channel adapter publishes messages from a message channel to an event hub.

This guide shows you how to use Spring Integration Azure Event Hubs to send messages to and receive messages from Event Hubs.

### Add dependencies

To install the Spring Cloud Azure Event Hubs Integration Starter module, add the following dependencies to your **pom.xml** file:

- The Spring Cloud Azure Bill of Materials (BOM):

  ```xml
  <dependencyManagement>
     <dependencies>
       <dependency>
         <groupId>com.azure.spring</groupId>
         <artifactId>spring-cloud-azure-dependencies</artifactId>
         <version>5.22.0</version>
         <type>pom</type>
         <scope>import</scope>
         </dependency>
     </dependencies>
  </dependencyManagement>
  ```

  > [!NOTE]
  > If you're using Spring Boot 2.x, be sure to set the `spring-cloud-azure-dependencies` version to `4.20.0`.
  > This Bill of Material (BOM) should be configured in the `<dependencyManagement>` section of your **pom.xml** file. This ensures that all Spring Cloud Azure dependencies are using the same version.
  > For more information about the version used for this BOM, see [Which Version of Spring Cloud Azure Should I Use](https://github.com/Azure/azure-sdk-for-java/wiki/Spring-Versions-Mapping#which-version-of-spring-cloud-azure-should-i-use).

- The Spring Cloud Azure Event Hubs Integration artifact:

  ```xml
  <dependency>
    <groupId>com.azure.spring</groupId>
    <artifactId>spring-cloud-azure-starter-integration-eventhubs</artifactId>
  </dependency>
  ```

### Code the application to send and receive messages

To send messages to and receive messages from Event Hubs, configure the application by using the following steps:

1. Use the following property settings to configure the Event Hubs namespace and Storage Blob:

   ```properties
   spring.cloud.azure.eventhubs.namespace=<your event-hubs-namespace>
   spring.cloud.azure.eventhubs.processor.checkpoint-store.account-name=<your-storage-account-name>
   spring.cloud.azure.eventhubs.processor.checkpoint-store.container-name=<your-storage-account-container-name>
   ```

1. Create a new `MessageReceiveConfiguration` Java class as shown in the following example. This class is used to define a message receiver. Be sure to replace the `<your-event-hub-name>` placeholder with your actual value.

   ```java
   import com.azure.spring.integration.eventhubs.inbound.EventHubsInboundChannelAdapter;
   import com.azure.spring.messaging.eventhubs.core.EventHubsProcessorFactory;
   import com.azure.spring.messaging.eventhubs.core.checkpoint.CheckpointConfig;
   import com.azure.spring.messaging.eventhubs.core.checkpoint.CheckpointMode;
   import com.azure.spring.messaging.eventhubs.core.listener.EventHubsMessageListenerContainer;
   import com.azure.spring.messaging.eventhubs.core.properties.EventHubsContainerProperties;
   import org.slf4j.Logger;
   import org.slf4j.LoggerFactory;
   import org.springframework.beans.factory.annotation.Qualifier;
   import org.springframework.context.annotation.Bean;
   import org.springframework.context.annotation.Configuration;
   import org.springframework.integration.annotation.ServiceActivator;
   import org.springframework.integration.channel.DirectChannel;
   import org.springframework.messaging.MessageChannel;

   @Configuration
   public class MessageReceiveConfiguration {

       private static final String INPUT_CHANNEL = "input";
       private static final String EVENT_HUB_NAME = "<your-event-hub-name>";
       private static final String CONSUMER_GROUP = "$Default";
       private static final Logger LOGGER = LoggerFactory.getLogger(MessageReceiveConfiguration.class);

       @ServiceActivator(inputChannel = INPUT_CHANNEL)
       public void messageReceiver(byte[] payload) {
           String message = new String(payload);
           LOGGER.info("New message received: {}", message);
       }

       @Bean
       public EventHubsMessageListenerContainer messageListenerContainer(EventHubsProcessorFactory processorFactory) {
           EventHubsContainerProperties containerProperties = new EventHubsContainerProperties();
           containerProperties.setEventHubName(EVENT_HUB_NAME);
           containerProperties.setConsumerGroup(CONSUMER_GROUP);
           containerProperties.setCheckpointConfig(new CheckpointConfig(CheckpointMode.MANUAL));
           return new EventHubsMessageListenerContainer(processorFactory, containerProperties);
       }

       @Bean
       public EventHubsInboundChannelAdapter messageChannelAdapter(@Qualifier(INPUT_CHANNEL) MessageChannel inputChannel,
                                                                   EventHubsMessageListenerContainer listenerContainer) {
           EventHubsInboundChannelAdapter adapter = new EventHubsInboundChannelAdapter(listenerContainer);
           adapter.setOutputChannel(inputChannel);
           return adapter;
       }

       @Bean
       public MessageChannel input() {
           return new DirectChannel();
       }

   }
   ```

1. Create a new `MessageSendConfiguration` Java class as shown in the following example. This class is used to define a message sender. Be sure to replace the `<your-event-hub-name>` placeholder with your actual value.

   ```java
   import com.azure.spring.integration.core.handler.DefaultMessageHandler;
   import com.azure.spring.messaging.eventhubs.core.EventHubsTemplate;
   import org.slf4j.Logger;
   import org.slf4j.LoggerFactory;
   import org.springframework.context.annotation.Bean;
   import org.springframework.context.annotation.Configuration;
   import org.springframework.integration.annotation.MessagingGateway;
   import org.springframework.integration.annotation.ServiceActivator;
   import org.springframework.messaging.MessageHandler;
   import org.springframework.util.concurrent.ListenableFutureCallback;

   @Configuration
   public class MessageSendConfiguration {

       private static final Logger LOGGER = LoggerFactory.getLogger(MessageSendConfiguration.class);
       private static final String OUTPUT_CHANNEL = "output";
       private static final String EVENT_HUB_NAME = "<your-event-hub-name>";

       @Bean
       @ServiceActivator(inputChannel = OUTPUT_CHANNEL)
       public MessageHandler messageSender(EventHubsTemplate eventHubsTemplate) {
           DefaultMessageHandler handler = new DefaultMessageHandler(EVENT_HUB_NAME, eventHubsTemplate);
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

       @MessagingGateway(defaultRequestChannel = OUTPUT_CHANNEL)
       public interface EventHubOutboundGateway {
           void send(String text);
       }

   }
   ```

1. Wire up a sender and a receiver to send and receive messages with Spring, as shown in the following example:

   ```java
   import org.springframework.boot.SpringApplication;
   import org.springframework.boot.autoconfigure.SpringBootApplication;
   import org.springframework.context.ConfigurableApplicationContext;
   import org.springframework.context.annotation.Configuration;
   import org.springframework.integration.config.EnableIntegration;

   @SpringBootApplication
   @EnableIntegration
   @Configuration(proxyBeanMethods = false)
   public class EventHubIntegrationApplication {

       public static void main(String[] args) {
           ConfigurableApplicationContext applicationContext = SpringApplication.run(EventHubIntegrationApplication.class, args);
           MessageSendConfiguration.EventHubOutboundGateway outboundGateway = applicationContext.getBean(MessageSendConfiguration.EventHubOutboundGateway.class);
           outboundGateway.send("Hello World");
       }
   }
   ```

   > [!TIP]
   > Remember to add the `@EnableIntegration` annotation, which enables the Spring Integration infrastructure.

1. Start the application. You're shown logs similar to the following example:

   ```output
   Message was sent successfully.
   New message received: Hello World
   ```

## Use Spring Cloud Azure Stream Event Hubs Binder

To call the Event Hubs API in a [Spring Cloud Stream](https://spring.io/projects/spring-cloud-stream) application, use the Spring Cloud Azure Event Hubs Stream Binder module.

This guide shows you how to use Spring Cloud Stream Event Hubs Binder to send messages to and receive messages from Event Hubs.

### Add dependencies

To install the Spring Cloud Azure Event Hubs Stream Binder module, add the following dependencies to your **pom.xml** file:

- The Spring Cloud Azure Bill of Materials (BOM):

  ```xml
  <dependencyManagement>
     <dependencies>
       <dependency>
         <groupId>com.azure.spring</groupId>
         <artifactId>spring-cloud-azure-dependencies</artifactId>
         <version>5.22.0</version>
         <type>pom</type>
         <scope>import</scope>
         </dependency>
     </dependencies>
  </dependencyManagement>
  ```

  > [!NOTE]
  > If you're using Spring Boot 2.x, be sure to set the `spring-cloud-azure-dependencies` version to `4.20.0`.
  > This Bill of Material (BOM) should be configured in the `<dependencyManagement>` section of your **pom.xml** file. This ensures that all Spring Cloud Azure dependencies are using the same version.
  > For more information about the version used for this BOM, see [Which Version of Spring Cloud Azure Should I Use](https://github.com/Azure/azure-sdk-for-java/wiki/Spring-Versions-Mapping#which-version-of-spring-cloud-azure-should-i-use).

- The Spring Cloud Azure Event Hubs Stream Binder artifact:

  ```xml
  <dependency>
    <groupId>com.azure.spring</groupId>
    <artifactId>spring-cloud-azure-stream-binder-eventhubs</artifactId>
  </dependency>
  ```

### Code the application to send and receive messages

To send messages to and receive messages from Event Hubs, configure the application by using the following steps:

1. Use the following property settings to configure the Event Hubs namespace and Storage Blob:

   ```properties
   spring.cloud.azure.eventhubs.namespace=<your event-hubs-namespace>
   spring.cloud.azure.eventhubs.processor.checkpoint-store.account-name=<your-storage-account-name>
   spring.cloud.azure.eventhubs.processor.checkpoint-store.container-name=<your-storage-account-container-name>
   ```

1. Create the message receiver.

   To use your application as an event sink, configure the input binder by completing the following tasks:

   - Declare a `Consumer` bean that defines message handling logic. For example, the following `Consumer` bean is named `consume`:

     ```java
      @Bean
      public Consumer<Message<String>> consume() {
          return message -> {
              System.out.printf("New message received: %s%n", message.getPayload());
          };
      }
      ```

   - Add the following configuration to specify the `Event Hub` name for consuming. Be sure to replace the `<your-event-hub-name>` placeholder with your actual value.

     ```properties
     # name for the above `Consumer` bean
     spring.cloud.stream.function.definition=consume
     spring.cloud.stream.bindings.consume-in-0.destination=<your-event-hub-name>
     spring.cloud.stream.bindings.consume-in-0.group=$Default
     spring.cloud.stream.eventhubs.bindings.consume-in-0.consumer.checkpoint.mode=MANUAL
     ```

1. Create the message sender.

   To use your application as an event source, configure the output binder by completing the following tasks:

   - Define a `Supplier` bean that defines where messages come from within your application, as shown in the following example:

     ```java
     @Bean
     public Supplier<Message<String>> supply() {
         return () -> {
             System.out.println("Sending a message.");
             return MessageBuilder.withPayload("Hello world").build();
         };
     }
     ```

   - Add the following configuration to specify the `Event Hub` name for sending. Be sure to replace the `<your-event-hub-name>` placeholder with your actual value.

     ```properties
     # "consume" is added from the above step
     spring.cloud.stream.function.definition=consume;supply
     spring.cloud.stream.bindings.supply-out-0.destination=<your-event-hub-name>
     ```

1. Start the application. You're shown logs similar to the following example:

   ```output
   Sending a message.
   New message received: Hello world.
   ```

## Use Spring Kafka with Azure Event Hubs

Event Hubs provides a Kafka endpoint that your existing Kafka based applications can use. This approach provides an alternative to running your own Kafka cluster. Event Hubs works with many of your existing Kafka applications. For more information, see [Event Hubs for Apache Kafka](/azure/event-hubs/azure-event-hubs-kafka-overview).

This guide shows you how to use Azure Event Hubs and [Spring Kafka](https://mvnrepository.com/artifact/org.springframework.kafka/spring-kafka) to send messages to and receive messages from Event Hubs.

### Add dependencies

To install the Spring Cloud Azure starter and Spring Kafka modules, adding the following dependencies to your **pom.xml** file:

- The Spring Cloud Azure Bill of Materials (BOM):

  ```xml
  <dependencyManagement>
     <dependencies>
       <dependency>
         <groupId>com.azure.spring</groupId>
         <artifactId>spring-cloud-azure-dependencies</artifactId>
         <version>5.22.0</version>
         <type>pom</type>
         <scope>import</scope>
         </dependency>
     </dependencies>
  </dependencyManagement>
  ```

  > [!NOTE]
  > If you're using Spring Boot 2.x, be sure to set the `spring-cloud-azure-dependencies` version to `4.20.0`.
  > This Bill of Material (BOM) should be configured in the `<dependencyManagement>` section of your **pom.xml** file. This ensures that all Spring Cloud Azure dependencies are using the same version.
  > For more information about the version used for this BOM, see [Which Version of Spring Cloud Azure Should I Use](https://github.com/Azure/azure-sdk-for-java/wiki/Spring-Versions-Mapping#which-version-of-spring-cloud-azure-should-i-use).

- The Spring Cloud Azure starter and Spring Kafka artifact:

  ```xml
  <dependency>
    <groupId>com.azure.spring</groupId>
    <artifactId>spring-cloud-azure-starter</artifactId>
  </dependency>
  <dependency>
    <groupId>org.springframework.kafka</groupId>
    <artifactId>spring-kafka</artifactId>
  </dependency>
  ```

### Code the application to send and receive messages

To send messages to and receive messages from Event Hubs, configure the application by using the following steps:

1. Use the following property setting to configure the Event Hubs namespace:

   ```properties
   spring.kafka.bootstrap-servers=<your event-hubs-namespace>.servicebus.windows.net:9093
   ```

1. Use `KafkaTemplate` to send messages and `@KafkaListener` to receive messages, as shown in the following example. Be sure to replace the `<your-event-hub-name>` placeholder with your actual value.

   ```java
   import org.slf4j.Logger;
   import org.slf4j.LoggerFactory;
   import org.springframework.boot.CommandLineRunner;
   import org.springframework.boot.SpringApplication;
   import org.springframework.boot.autoconfigure.SpringBootApplication;
   import org.springframework.kafka.annotation.KafkaListener;
   import org.springframework.kafka.core.KafkaTemplate;

   @SpringBootApplication
   public class EventHubKafkaApplication implements CommandLineRunner {

       private static final Logger LOGGER = LoggerFactory.getLogger(EventHubKafkaApplication.class);
       private static final String EVENT_HUB_NAME = "<your-event-hub-name>";
       private static final String CONSUMER_GROUP = "$Default";
       private final KafkaTemplate<String, String> kafkaTemplate;

       public EventHubKafkaApplication(KafkaTemplate<String, String> kafkaTemplate) {
           this.kafkaTemplate = kafkaTemplate;
       }

       public static void main(String[] args) {
           SpringApplication.run(EventHubKafkaApplication.class, args);
       }

       @Override
       public void run(String... args) {
           kafkaTemplate.send(EVENT_HUB_NAME, "Hello World");
           LOGGER.info("Message was sent successfully.");
       }

       @KafkaListener(topics = EVENT_HUB_NAME, groupId = CONSUMER_GROUP)
       public void receive(String message) {
           LOGGER.info("New message received: {}", message);
       }

   }
   ```

1. Start the application. You're shown logs similar to the following example:

   ```output
   Message was sent successfully.
   New message received: Hello world
   ```

## Use Spring Cloud Stream Kafka Binder with Azure Event Hubs

Spring Cloud Stream is a framework that enables application developers to write message-driven microservices. The bridge between a messaging system and Spring Cloud Stream is through the binder abstraction. Binders exist for several messaging systems, but one of the most commonly used binders is for Apache Kafka.

This guide shows you how to use Azure Event Hubs and [Spring Cloud Stream Kafka Binder](https://mvnrepository.com/artifact/org.springframework.cloud/spring-cloud-starter-stream-kafka) to send messages to and receive messages from Event Hubs.

### Add dependencies

To install the Spring Cloud Azure starter and Spring Cloud Stream binder Kafka modules, adding the following dependencies to your **pom.xml** file:

- The Spring Cloud Azure Bill of Materials (BOM):

  ```xml
  <dependencyManagement>
     <dependencies>
       <dependency>
         <groupId>com.azure.spring</groupId>
         <artifactId>spring-cloud-azure-dependencies</artifactId>
         <version>5.22.0</version>
         <type>pom</type>
         <scope>import</scope>
         </dependency>
     </dependencies>
  </dependencyManagement>
  ```

  > [!NOTE]
  > If you're using Spring Boot 2.x, be sure to set the `spring-cloud-azure-dependencies` version to `4.20.0`.
  > This Bill of Material (BOM) should be configured in the `<dependencyManagement>` section of your **pom.xml** file. This ensures that all Spring Cloud Azure dependencies are using the same version.
  > For more information about the version used for this BOM, see [Which Version of Spring Cloud Azure Should I Use](https://github.com/Azure/azure-sdk-for-java/wiki/Spring-Versions-Mapping#which-version-of-spring-cloud-azure-should-i-use).

- The Spring Cloud Azure starter artifact:

  ```xml
  <dependency>
    <groupId>com.azure.spring</groupId>
    <artifactId>spring-cloud-azure-starter</artifactId>
  </dependency>
  <dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-stream-binder-kafka</artifactId>
  </dependency>
  ```

### Code the application to send and receive messages

To send messages to and receive messages from Event Hubs, configure the application by using the following steps:

1. Use the following property setting to configure the Kafka broker:

   ```properties
   spring.cloud.stream.kafka.binder.brokers=<your event-hubs-namespace>.servicebus.windows.net:9093
   ```

1. Create the message receiver.

   To use your application as an event sink, configure the input binder by completing the following tasks:

   - Declare a `Consumer` bean that defines message handling logic. For example, the following `Consumer` bean is named `consume`:

     ```java
     @Bean
     public Consumer<Message<String>> consume() {
         return message -> {
             System.out.printf("New message received: %s%n", message.getPayload());
         };
     }
     ```

   - Add the following configuration to specify the `Event Hub` name for consuming. Be sure to replace the `<your-event-hub-name>` placeholder with your actual value.

     ```properties
     # name for the above `Consumer` bean
     spring.cloud.stream.function.definition=consume
     spring.cloud.stream.bindings.consume-in-0.destination=<your-event-hub-name>
     spring.cloud.stream.bindings.consume-in-0.group=$Default
     ```

1. Create the message sender.

   To use your application as an event source, configure the output binder by completing the following tasks:

   - Define a `Supplier` bean that defines where messages come from within your application, as shown in the following example:

     ```java
     @Bean
     public Supplier<Message<String>> supply() {
         return () -> {
             System.out.println("Sending a message.");
             return MessageBuilder.withPayload("Hello world").build();
         };
     }
     ```

   - Add the following configuration to specify the `Event Hub` name for sending. Be sure to replace the `<your-event-hub-name>` placeholder with your actual value.

     ```properties
     # "consume" is added from the above step
     spring.cloud.stream.function.definition=consume;supply
     spring.cloud.stream.bindings.supply-out-0.destination=<your-event-hub-name>
     ```

1. Start the application. You're shown logs similar to the following example:

   ```output
   Sending a message.
   New message received: Hello world.
   ```

[!INCLUDE [deploy-to-azure-spring-apps](includes/deploy-to-azure-spring-apps.md)]

## Next steps

> [!div class="nextstepaction"]
> [Azure for Spring developers](../spring/index.yml)
> [Spring Cloud Azure Event Hubs Samples](https://github.com/Azure-Samples/azure-spring-boot-samples/tree/main/eventhubs)

### See also

For more information about the other Spring Boot Starters that are available for Microsoft Azure, see [What is Spring Cloud Azure?](spring-cloud-azure-overview.md)
