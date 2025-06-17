---
title: Use Azure Storage Queue in Spring applications
description: This article demonstrates how to use Azure Storage Queue in Java applications built with Spring framework.
author: KarlErickson
ms.author: karler
ms.reviewer: seal
ms.date: 08/28/2024
ms.topic: how-to
ms.custom: devx-track-java, spring-cloud-azure, passwordless-java, devx-track-extended-java
---

# Use Azure Storage Queue in Spring applications

This article demonstrates how to use [Azure Storage Queue](/azure/storage/queues/storage-queues-introduction) in Java applications built with [Spring Framework](https://spring.io/projects/spring-framework).

Azure Storage Queue implements cloud-based queues to enable communication between components of a distributed application. Each queue maintains a list of messages that can be added by a sender component and processed by a receiver component. With a queue, your application can scale immediately to meet demand.

Spring Cloud Azure provides various modules for using Spring frameworks to send messages to, and receiving messages from, Azure Storage Queues. You can use these modules independently or combine them for different use cases, as described in the following list:

- [Spring Cloud Azure Storage Queue Starter](#use-spring-cloud-azure-storage-queue-starter) lets you send and receive messages with Storage Queues Java SDK client library with Spring Boot features.

- [Spring Messaging Azure Storage Queue](#use-spring-messaging-azure-storage-queue) lets you interact with Storage Queues via the [Spring Messaging](https://docs.spring.io/spring-boot/docs/current/reference/html/messaging.html) API.

- [Spring Integration Azure Storage Queue](#use-spring-integration-azure-storage-queue) lets you connect Spring Integration [Message Channels](https://docs.spring.io/spring-integration/reference/channel.html) with Storage Queues.

[!INCLUDE [spring-data-prerequisites.md](includes/spring-data-prerequisites.md)]

- An Azure Storage account and Azure Queues. If you don't have these resources, first create a storage account, then create a queue. For more information, see [Create a storage account](/azure/storage/common/storage-account-create?tabs=azure-portal) and the [Create a queue](/azure/storage/queues/storage-quickstart-queues-portal#create-a-queue) section of [Quickstart: Create a queue and add a message with the Azure portal](/azure/storage/queues/storage-quickstart-queues-portal).

- A Spring Boot application. If you don't have one, create a Maven project with the [Spring Initializr](https://start.spring.io/). Be sure to select **Maven Project** and, under **Dependencies**, add the **Spring Web** dependency, and then select Java version 8 or higher.

> [!NOTE]
> To grant your account access to resources, in your newly created Azure Storage account, assign the `Storage Queue Data Contributor` role to the Microsoft Entra account you're currently using. For more information, see [Assign Azure roles using the Azure portal](/azure/role-based-access-control/role-assignments-portal).

> [!IMPORTANT]
> Spring Boot version 2.5 or higher is required to complete the steps in this tutorial.

[!INCLUDE [prepare-your-local-environment](includes/prepare-your-local-environment.md)]

## Use Spring Cloud Azure Storage Queue Starter

The Spring Cloud Azure Storage Queue Starter module imports [Azure Storage Queue client library for Java](/java/api/overview/azure/storage-queue-readme) with the Spring Boot framework. You can use Spring Cloud Azure and the Azure SDK together, in a non-mutually-exclusive pattern. Thus, you can continue using the Storage Queue Java client API in your Spring application.

### Add dependencies

To install the Spring Cloud Azure Storage Queue Starter module, add the following dependencies to your **pom.xml** file:

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

- The Spring Cloud Azure Queue Storage Queue artifact:

  ```xml
  <dependency>
    <groupId>com.azure.spring</groupId>
    <artifactId>spring-cloud-azure-starter-storage-queue</artifactId>
  </dependency>
  ```

### Code your application to send and receive messages

This section shows you how to use the Azure Queue Storage clients in the context of a Spring application. You have the following two options:

- Use Spring Boot autoconfiguration and use out-of-the-box clients from the Spring context (recommended).
- Build the client programmatically.

With autoconfiguration, you autowire client beans from the Spring inversion-of-control (IoC) container. This approach provides you with a more flexible and efficient experience when developing with Storage Queue clients. Autoconfiguration has the following advantages:

- Autoconfiguration uses [externalized configuration](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#features.external-config) so that you can work with the same application code in different environments.

- You can delegate to the Spring Boot framework the process of learning the builder pattern and registering the clients to the application context. You focus only on how to use the clients with your own business requirements.

- You can use health indicator to inspect the status and health of your application and internal components.

The code examples in the following sections show you how to use `QueueClient` with the two alternatives described.

> [!TIP]
> Azure Java SDK for Storage Queue provides multiple clients to interact with Storage Queue. The starter also provides autoconfiguration for all the Storage Queue clients and client builders. This article uses only `QueueClient` as an example.

#### Use Spring Boot autoconfiguration

To send messages to and receive messages from Azure Storage queues, use the following steps to configure the application:

1. Configure your storage account name and queue name, as shown in the following example:

   ```properties
   spring.cloud.azure.storage.queue.account-name=<your-storage-account-name>
   spring.cloud.azure.storage.queue.queue-name=<your-storage-queue-name>
   ```

1. Inject the `QueueClient` in your Spring application and call the related APIs to send messages, as shown in the following example:

   ```java
   import com.azure.storage.queue.QueueClient;
   import com.azure.storage.queue.models.QueueMessageItem;
   import com.azure.storage.queue.models.SendMessageResult;
   import org.slf4j.Logger;
   import org.slf4j.LoggerFactory;
   import org.springframework.beans.factory.annotation.Autowired;
   import org.springframework.boot.CommandLineRunner;
   import org.springframework.boot.SpringApplication;
   import org.springframework.boot.autoconfigure.SpringBootApplication;

   @SpringBootApplication
   public class StorageQueueClientApplication implements CommandLineRunner {

       private final static Logger logger = LoggerFactory.getLogger(StorageQueueClientApplication.class);

       @Autowired
       private QueueClient queueClient;

       public static void main(String[] args) {
           SpringApplication.run(StorageQueueClientApplication.class, args);
       }

       @Override
       public void run(String... args) {
        // Using the QueueClient object, call the create method to create the queue in your storage account.
           queueClient.create();
           SendMessageResult sendMessageResult = queueClient.sendMessage("Hello world");
           logger.info("Send message id: {}", sendMessageResult.getMessageId());

           QueueMessageItem queueMessageItem = queueClient.receiveMessage();
           logger.info("Received message: {}", new String(queueMessageItem.getBody().toBytes()));
       }

   }
   ```

1. Start the application. After launch, the application produces logs similar to the following example:

   ```output
   Send message id: ...
   Received message: Hello world
   ```

#### Build the client programmatically

You can build the client beans by yourself, but the process is complicated. In Spring Boot applications, you have to manage properties, learn the builder pattern, and register the clients to your Spring application context. The following steps show you how to do that.

1. Build the client programmatically in your Spring application, as shown in the following example. Be sure to replace the `<storage-account-name>` placeholder with your own value.

   ```java
   import com.azure.identity.DefaultAzureCredentialBuilder;
   import com.azure.storage.queue.QueueClient;
   import com.azure.storage.queue.QueueClientBuilder;
   import com.azure.storage.queue.models.QueueMessageItem;
   import com.azure.storage.queue.models.SendMessageResult;
   import org.slf4j.Logger;
   import org.slf4j.LoggerFactory;
   import org.springframework.boot.CommandLineRunner;
   import org.springframework.boot.SpringApplication;
   import org.springframework.boot.autoconfigure.SpringBootApplication;

   @SpringBootApplication
   public class StorageQueueClientApplication implements CommandLineRunner {

       private final static String queueName = "test-queue";
       private final static String endpoint = "https://<storage-account-name>.queue.core.windows.net/";
       private final static Logger logger = LoggerFactory.getLogger(StorageQueueClientApplication.class);

       QueueClient queueClient = new QueueClientBuilder()
           .endpoint(endpoint)
           .queueName(queueName)
           .credential(new DefaultAzureCredentialBuilder().build())
           .buildClient();

       public static void main(String[] args) {
           SpringApplication.run(StorageQueueClientApplication.class, args);
       }

       @Override
       public void run(String... args) {
        // Using the QueueClient object, call the create method to create the queue in your storage account.
           queueClient.create();
           SendMessageResult sendMessageResult = queueClient.sendMessage("Hello world");
           logger.info("Send message id: {}", sendMessageResult.getMessageId());

           QueueMessageItem queueMessageItem = queueClient.receiveMessage();
           logger.info("Received message: {}", new String(queueMessageItem.getBody().toBytes()));
       }

   }
   ```

1. Start the application. After launch, the application produces logs similar to the following example:

   ```output
   Send message id: ...
   Received message: Hello world
   ```

The following list shows reasons why this code isn't flexible or graceful:

- The storage account and queue names are hard coded.
- If you use `@Value` to get configurations from the Spring environment, you can't have IDE hints in your **application.properties** file.
- If you have a microservice scenario, you must duplicate the code in each project, and it's easy to make mistakes and hard to be consistent.

Fortunately, building the client beans by yourself isn't necessary with Spring Cloud Azure. Instead, you can directly inject them and use the configuration properties that you're already familiar with to configure the storage queue. For more information, see [Spring Cloud Azure configuration properties](configuration-properties-all.md).

Spring Cloud Azure also provides the following global configurations for different scenarios. For more information, see [Spring Cloud Azure global configuration properties](configuration-properties-global.md).

- Proxy options.
- Retry options.

You can also connect to different Azure clouds. For more information, see [Connect to different Azure clouds](https://devblogs.microsoft.com/azure-sdk/announcing-the-stable-release-of-spring-cloud-azure-version-4-4-0/#connect-to-different-azure-clouds).

## Use Spring Messaging Azure Storage Queue

The [Spring Messaging Azure Storage Queue](https://mvnrepository.com/artifact/com.azure.spring/spring-messaging-azure-storage-queue) module provides support for the Spring [Messaging](https://docs.spring.io/spring-boot/docs/current/reference/html/messaging.html) framework with Azure Queue Storage.

If you're using Spring Messaging Azure Storage Queue, then you can use the `StorageQueueTemplate` feature to send messages to storage queues asynchronously and synchronously.

The following sections show you how to use Spring Messaging Azure Storage Queue to send messages to and receive messages from storage queues.

### Add dependencies

To install the Spring Messaging Azure Storage Queue module, add the following dependencies to your **pom.xml** file:

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

- The Spring Cloud Azure starter and Spring Messaging Storage Queue artifacts:

  ```xml
  <dependency>
    <groupId>com.azure.spring</groupId>
    <artifactId>spring-cloud-azure-starter</artifactId>
  </dependency>
  <dependency>
    <groupId>com.azure.spring</groupId>
    <artifactId>spring-messaging-azure-storage-queue</artifactId>
  </dependency>
  ```

### Code your application to send and receive messages

Use the following steps to configure and code your application:

1. Configure the Azure Storage account name for your storage queues, as shown in the following example:

   ```properties
   spring.cloud.azure.storage.queue.account-name=<your-storage-account-name>
   ```

1. Wire up a sender and a receiver to send and receive messages with Spring, as shown in the following example. Be sure to replace the `<storage-queue-name>` placeholder with your own value.

   ```java
   import com.azure.spring.messaging.AzureHeaders;
   import com.azure.spring.messaging.checkpoint.Checkpointer;
   import com.azure.spring.messaging.storage.queue.core.StorageQueueTemplate;
   import org.slf4j.Logger;
   import org.slf4j.LoggerFactory;
   import org.springframework.beans.factory.annotation.Autowired;
   import org.springframework.boot.CommandLineRunner;
   import org.springframework.boot.SpringApplication;
   import org.springframework.boot.autoconfigure.SpringBootApplication;
   import org.springframework.messaging.Message;
   import org.springframework.messaging.support.MessageBuilder;
   import java.time.Duration;

   @SpringBootApplication
   public class StorageQueueMessagingApplication implements CommandLineRunner {

       private static final Logger LOGGER = LoggerFactory.getLogger(StorageQueueMessagingApplication.class);
       private static final String STORAGE_QUEUE_NAME = "<storage-queue-name>";

       @Autowired
       StorageQueueTemplate storageQueueTemplate;

       public static void main(String[] args) {
           SpringApplication.run(StorageQueueMessagingApplication.class, args);
       }

       @Override
       public void run(String... args) {
           storageQueueTemplate
               .sendAsync(STORAGE_QUEUE_NAME, MessageBuilder.withPayload("Hello world").build())
               .subscribe();
           LOGGER.info("Message was sent successfully.");

           Message<?> message = storageQueueTemplate.receiveAsync(STORAGE_QUEUE_NAME, Duration.ofSeconds(30)).block();
           LOGGER.info("Received message: {}", new String((byte[]) message.getPayload()));
       }

   }
   ```

1. Start the application. After launch, the application produces logs similar to the following example:

   ```output
   Message was sent successfully.
   ...
   Received message: Hello World
   ```

## Use Spring Integration Azure Storage Queue

The [Spring Integration Azure Storage Queue](https://mvnrepository.com/artifact/com.azure.spring/spring-integration-azure-storage-queue) module provides support for the [Spring Integration](https://docs.spring.io/spring-boot/docs/current/reference/html/messaging.html#messaging.spring-integration) framework with storage queues.

If your Spring application uses Spring Integration message channels, you can route messages between your message channels and storage queue using channel adapters. An inbound channel adapter forwards messages from a storage queue to a message channel. An outbound channel adapter publishes messages from a message channel to a storage queue.

The following sections show you how to use Spring Integration Azure Storage Queue to send and receive messages to and from storage queues.

### Add dependencies

To install the Spring Integration Azure Storage Queue module, add the following dependencies to your **pom.xml** file:

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

- The Spring Integration Azure Storage Queue artifacts:

  ```xml
  <dependency>
    <groupId>com.azure.spring</groupId>
    <artifactId>spring-cloud-azure-starter-integration-storage-queue</artifactId>
  </dependency>
  ```

### Code your application to send and receive messages

Use the following steps to configure and code your application:

1. Configure the Azure Storage account name for your storage queues.

   ```properties
   spring.cloud.azure.storage.queue.account-name=<your-storage-account-name>
   ```

1. Create a new `QueueReceiveConfiguration` Java class as shown in the following example. This class is used to define a message receiver. Be sure to replace the `<storage-queue-name>` placeholder with your own value.

   ```java
   import com.azure.spring.integration.storage.queue.inbound.StorageQueueMessageSource;
   import com.azure.spring.messaging.AzureHeaders;
   import com.azure.spring.messaging.checkpoint.Checkpointer;
   import com.azure.spring.messaging.storage.queue.core.StorageQueueTemplate;
   import org.slf4j.Logger;
   import org.slf4j.LoggerFactory;
   import org.springframework.context.annotation.Bean;
   import org.springframework.context.annotation.Configuration;
   import org.springframework.integration.annotation.InboundChannelAdapter;
   import org.springframework.integration.annotation.Poller;
   import org.springframework.integration.annotation.ServiceActivator;
   import org.springframework.messaging.handler.annotation.Header;

   @Configuration
   public class QueueReceiveConfiguration {

       private static final Logger LOGGER = LoggerFactory.getLogger(QueueReceiveConfiguration.class);
       private static final String STORAGE_QUEUE_NAME = "<storage-queue-name>";
       private static final String INPUT_CHANNEL = "input";

       @Bean
       @InboundChannelAdapter(channel = INPUT_CHANNEL, poller = @Poller(fixedDelay = "1000"))
       public StorageQueueMessageSource storageQueueMessageSource(StorageQueueTemplate storageQueueTemplate) {
           return new StorageQueueMessageSource(STORAGE_QUEUE_NAME, storageQueueTemplate);
       }

       @ServiceActivator(inputChannel = INPUT_CHANNEL)
       public void messageReceiver(byte[] payload, @Header(AzureHeaders.CHECKPOINTER) Checkpointer checkpointer) {
           String message = new String(payload);
           LOGGER.info("Received message: {}", message);
       }

   }
   ```

1. Create a new `QueueSendConfiguration` Java class as shown in the following example. This class is used to define a message sender. Be sure to replace the `<storage-queue-name>` placeholder with your own value.

   ```java
   import com.azure.spring.integration.core.handler.DefaultMessageHandler;
   import com.azure.spring.messaging.storage.queue.core.StorageQueueTemplate;
   import org.slf4j.Logger;
   import org.slf4j.LoggerFactory;
   import org.springframework.context.annotation.Bean;
   import org.springframework.context.annotation.Configuration;
   import org.springframework.integration.annotation.MessagingGateway;
   import org.springframework.integration.annotation.ServiceActivator;
   import org.springframework.messaging.MessageHandler;
   import org.springframework.util.concurrent.ListenableFutureCallback;

   @Configuration
   public class QueueSendConfiguration {

       private static final Logger LOGGER = LoggerFactory.getLogger(QueueSendConfiguration.class);
       private static final String STORAGE_QUEUE_NAME = "<storage-queue-name>";
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

       @MessagingGateway(defaultRequestChannel = OUTPUT_CHANNEL)
       public interface StorageQueueOutboundGateway {
           void send(String text);
       }

   }
   ```

1. Wire up a sender and a receiver to send and receive messages with Spring.

   ```java
   import org.springframework.boot.SpringApplication;
   import org.springframework.boot.autoconfigure.SpringBootApplication;
   import org.springframework.context.ConfigurableApplicationContext;
   import org.springframework.context.annotation.Configuration;
   import org.springframework.integration.config.EnableIntegration;

   @SpringBootApplication
   @EnableIntegration
   @Configuration(proxyBeanMethods = false)
   public class StorageQueueIntegrationApplication {

       public static void main(String[] args) {
           ConfigurableApplicationContext applicationContext = SpringApplication.run(StorageQueueIntegrationApplication.class, args);
           QueueSendConfiguration.StorageQueueOutboundGateway storageQueueOutboundGateway = applicationContext.getBeanQueueSendConfiguration.StorageQueueOutboundGateway.class);
           storageQueueOutboundGateway.send("Hello World");
       }

   }
   ```

   > [!TIP]
   > Remember to add the `@EnableIntegration` annotation, which enables the Spring Integration infrastructure.

1. Start the application. After launch, the application produces logs similar to the following example:

   ```output
   Message was sent successfully.
   Received message: Hello World
   ```

[!INCLUDE [deploy-to-azure-spring-apps](includes/deploy-to-azure-spring-apps.md)]

## Next steps

> [!div class="nextstepaction"]
> [Azure for Spring developers](../spring/index.yml)
> [Spring Cloud Azure Storage Queue Samples](https://github.com/Azure-Samples/azure-spring-boot-samples/tree/main/storage)

### See also

For more information about the Spring Boot Starters available for Microsoft Azure, see [What is Spring Cloud Azure?](spring-cloud-azure-overview.md)
