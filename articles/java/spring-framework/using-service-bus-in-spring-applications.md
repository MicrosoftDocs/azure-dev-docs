---
title: Use Azure Service Bus in Spring applications
description: Shows you how to use Azure Service Bus in Java applications built with the Spring framework.
author: KarlErickson
ms.author: karler
ms.reviewer: xiada
ms.date: 04/18/2025
ms.topic: how-to
ms.custom: devx-track-java, spring-cloud-azure, devx-track-extended-java
---

# Use Azure Service Bus in Spring applications

This article shows you how to use Azure Service Bus in Java applications built with [Spring Framework](https://spring.io/projects/spring-framework).

Azure provides an asynchronous messaging platform called [Azure Service Bus](/azure/service-bus-messaging/service-bus-messaging-overview) (Service Bus), which is based on the [Advanced Message Queueing Protocol 1.0](http://www.amqp.org/) (AMQP 1.0) standard. You can use Service Bus across the range of supported Azure platforms.

Spring Cloud Azure provides various modules for sending messages to and receiving messages from Service Bus *queues* and *topics*/*subscriptions* using Spring frameworks.

You can use the following modules independently or combine them for different use cases:

- [Spring Cloud Azure Service Bus Starter](#use-the-spring-cloud-azure-service-bus-starter) enables you to send and receive messages with the Service Bus Java SDK client library with Spring Boot features.

- [Spring Cloud Azure Service Bus JMS Starter](#use-the-spring-cloud-azure-service-bus-jms-starter) enables you to use the JMS API to send and receive messages with Service Bus queues and topics/subscriptions.

- [Spring Messaging Azure Service Bus](#use-spring-messaging-azure-service-bus) enables you to interact with Service Bus via the [Spring Messaging](https://docs.spring.io/spring-boot/docs/current/reference/html/messaging.html) API.

- [Spring Integration Azure Service Bus](#use-spring-integration-azure-service-bus) enables you to connect Spring Integration [Message Channels](https://docs.spring.io/spring-integration/reference/channel.html) with Service Bus.

- [Spring Cloud Stream Binder for Service Bus](#use-spring-cloud-stream-service-bus-binder) enables you to use Service Bus as a messaging middleware in Spring Cloud Stream applications.

## Prerequisites

- An Azure subscription - [create one for free](https://azure.microsoft.com/free/).
- [Java Development Kit (JDK)](/java/azure/jdk/) version 8 or higher.
- [Apache Maven](http://maven.apache.org/), version 3.0 or higher.
- An Azure Service Bus and queue or topic/subscription. If you don't have one, create a Service Bus queue or topic. For more information, see [Use Azure portal to create a Service Bus namespace and a queue](/azure/service-bus-messaging/service-bus-quickstart-portal) or [Use the Azure portal to create a Service Bus topic and subscriptions to the topic](/azure/service-bus-messaging/service-bus-quickstart-topics-subscriptions-portal).
- If you don't have a Spring Boot application, create a Maven project with the [Spring Initializr](https://start.spring.io/). Be sure to select **Maven Project** and, under **Dependencies**, add the **Spring Web** dependency, and then select Java version 8 or higher.

> [!NOTE]
> To grant your account access to your Service Bus resources, in your newly created Azure Service Bus namespace, assign the [Azure Service Bus Data Sender](/azure/role-based-access-control/built-in-roles#azure-service-bus-data-sender) and [Azure Service Bus Data Receiver](/azure/role-based-access-control/built-in-roles#azure-service-bus-data-receiver) roles to the Microsoft Entra account you're currently using. For more information, see [Assign Azure roles using the Azure portal](/azure/role-based-access-control/role-assignments-portal).

> [!IMPORTANT]
> Spring Boot version 2.5 or higher is required to complete the steps in this tutorial.

[!INCLUDE [prepare-your-local-environment](includes/prepare-your-local-environment.md)]

> [!NOTE]
> Azure Service Bus for JMS API currently doesn't support `DefaultAzureCredential`. If you're using Spring JMS with Service Bus, ignore this step.

## Use the Spring Cloud Azure Service Bus Starter

The [Spring Cloud Azure Service Bus Starter](https://mvnrepository.com/artifact/com.azure.spring/spring-cloud-azure-starter-servicebus) module imports [Service Bus Java client library](https://mvnrepository.com/artifact/com.azure/azure-messaging-servicebus) with Spring Boot framework. You can use Spring Cloud Azure and the Azure SDK together, in a non-mutually-exclusive pattern. Thus, you can continue using the Service Bus Java client API in your Spring application.

### Add the Service Bus dependency

To install the Spring Cloud Azure Service Bus Starter module, add the following dependencies to your **pom.xml** file:

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

- The Spring Cloud Azure Service Bus artifact:

  ```xml
  <dependency>
    <groupId>com.azure.spring</groupId>
    <artifactId>spring-cloud-azure-starter-servicebus</artifactId>
  </dependency>
  ```

### Code the application to send and receive messages

This guide teaches you how to use the Service Bus Java clients in the context of a Spring application. Here we introduce two alternatives. The recommended way is to use Spring Boot Autoconfiguration and use out-of-the-box clients from the Spring context. The alternative way is to build clients on your own programmatically.

The first way, which involves auto wiring the client beans from the Spring IoC container, has the following advantages when compared with the second way. These benefits give you a more flexible and efficient experience when developing with Service Bus clients.

- You can use [externalized configuration](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#features.external-config) so that you can work with the same application code in different environments.

- You can delegate the process of learning the builder pattern and registering this client to the application context to the Spring Boot framework. This delegation enables you to focus on how to use the clients with your own business requirements.

- You can use health indicator in an easy way to inspect the status and health of your application and internal components.

The following code example shows you how to use `ServiceBusSenderClient` and `ServiceBusProcessorClient` with these two alternatives.

> [!NOTE]
> Azure Java SDK for Service Bus provides multiple clients to interact with Service Bus. The starter also provides autoconfiguration for all the Service Bus clients and client builders. Here we use only `ServiceBusSenderClient` and `ServiceBusProcessorClient` as examples.

#### Use Spring Boot Autoconfiguration

To send messages to and receive messages from Service Bus, configure the application by using the following steps:

1. Configure your Service Bus namespace and queue, as shown in the following example:

   ```properties
   spring.cloud.azure.servicebus.namespace=<your-servicebus-namespace-name>
   spring.cloud.azure.servicebus.entity-name=<your-servicebus-queue-name>
   spring.cloud.azure.servicebus.entity-type=queue
   ```

   > [!TIP]
   > Here we use Service Bus queue as an example. To use topic/subscription, you need to add the `spring.cloud.azure.servicebus.processor.subscription-name` property and change the `entity-type` value to `topic`.

1. Create a new `ServiceBusProcessorClientConfiguration` Java class as shown in the following example. This class is used to register the message and error handler of `ServiceBusProcessorClient`.

   ```java
   @Configuration(proxyBeanMethods = false)
   public class ServiceBusProcessorClientConfiguration {

       @Bean
       ServiceBusRecordMessageListener processMessage() {
           return context -> {
               ServiceBusReceivedMessage message = context.getMessage();
               System.out.printf("Processing message. Id: %s, Sequence #: %s. Contents: %s%n", message.getMessageId(),
                       message.getSequenceNumber(), message.getBody());
           };
       }

       @Bean
       ServiceBusErrorHandler processError() {
           return context -> {
               System.out.printf("Error when receiving messages from namespace: '%s'. Entity: '%s'%n",
                       context.getFullyQualifiedNamespace(), context.getEntityPath());
           };
       }
   }
   ```

1. Inject the `ServiceBusSenderClient` in your Spring application, and call the related APIs to send messages, as shown in the following example:

   ```java
   @SpringBootApplication
   public class ServiceBusQueueApplication implements CommandLineRunner {

       private final ServiceBusSenderClient senderClient;

       public ServiceBusQueueApplication(ServiceBusSenderClient senderClient) {
           this.senderClient = senderClient;
       }

       public static void main(String[] args) {
           SpringApplication.run(ServiceBusQueueApplication.class, args);
       }

       @Override
       public void run(String... args) throws Exception {
           // send one message to the queue
           senderClient.sendMessage(new ServiceBusMessage("Hello, World!"));
           System.out.printf("Sent a message to the queue");
           senderClient.close();

           // wait the processor client to consume messages
           TimeUnit.SECONDS.sleep(10);
       }

   }
   ```

   > [!Note]
   > By default, the lifecycle of the autowired `ServiceBusProcessorClient` bean is managed by the Spring context. The processor is automatically started when the Spring Application Context starts, and stopped when the Spring Application Context stops. To disable this feature, configure `spring.cloud.azure.servicebus.processor.auto-startup=false`.

1. Start the application. You're shown logs similar to the following example:

   ```output
   Sent a message to the queue
   Processing message. Id: 6f405435200047069a3caf80893a80bc, Sequence #: 1. Contents: Hello, World!
   ```

#### Build Service Bus clients programmatically

You can build those client beans by yourself, but the process is complicated. In Spring Boot applications, you have to manage properties, learn the builder pattern, and register the client to your Spring application context. The following code example shows how to do that:

1. Create a new `ServiceBusClientConfiguration` Java class as shown in the following example. This class is used to declare the `ServiceBusSenderClient` and `ServiceBusProcessorClient` beans.

   ```java
   @Configuration(proxyBeanMethods = false)
   public class ServiceBusClientConfiguration {

       private static final String SERVICE_BUS_FQDN = "<service-bus-fully-qualified-namespace>";
       private static final String QUEUE_NAME = "<service-bus-queue-name>";

       @Bean
       ServiceBusClientBuilder serviceBusClientBuilder() {
           return new ServiceBusClientBuilder()
                      .fullyQualifiedNamespace(SERVICE_BUS_FQDN)
                      .credential(new DefaultAzureCredentialBuilder().build());
       }

       @Bean
       ServiceBusSenderClient serviceBusSenderClient(ServiceBusClientBuilder builder) {
           return builder
                  .sender()
                  .queueName(QUEUE_NAME)
                  .buildClient();
       }

       @Bean
       ServiceBusProcessorClient serviceBusProcessorClient(ServiceBusClientBuilder builder) {
           return builder.processor()
                         .queueName(QUEUE_NAME)
                         .processMessage(ServiceBusClientConfiguration::processMessage)
                         .processError(ServiceBusClientConfiguration::processError)
                         .buildProcessorClient();
       }

       private static void processMessage(ServiceBusReceivedMessageContext context) {
           ServiceBusReceivedMessage message = context.getMessage();
           System.out.printf("Processing message. Id: %s, Sequence #: %s. Contents: %s%n",
               message.getMessageId(), message.getSequenceNumber(), message.getBody());
       }

       private static void processError(ServiceBusErrorContext context) {
           System.out.printf("Error when receiving messages from namespace: '%s'. Entity: '%s'%n",
                   context.getFullyQualifiedNamespace(), context.getEntityPath());
       }
   }
   ```

   > [!NOTE]
   > Be sure to replace the `<service-bus-fully-qualified-namespace>` placeholder with your Service Bus host name from the Azure portal. Replace the `<service-bus-queue-name>` placeholder with your own queue name configured in your Service Bus namespace.

1. Inject the client beans to your application, as shown in the following example:

   ```java
   @SpringBootApplication
   public class ServiceBusQueueApplication implements CommandLineRunner {

       private final ServiceBusSenderClient senderClient;

       private final ServiceBusProcessorClient processorClient;

       public ServiceBusQueueApplication(ServiceBusSenderClient senderClient, ServiceBusProcessorClient processorClient) {
           this.senderClient = senderClient;
           this.processorClient = processorClient;
       }

       public static void main(String[] args) {
           SpringApplication.run(ServiceBusQueueApplication.class, args);
       }

       @Override
       public void run(String... args) throws Exception {
           // send one message to the queue
           senderClient.sendMessage(new ServiceBusMessage("Hello, World!"));
           System.out.printf("Sent a message to the queue");
           senderClient.close();

           System.out.printf("Starting the processor");
           processorClient.start();
           TimeUnit.SECONDS.sleep(10);
           System.out.printf("Stopping and closing the processor");
           processorClient.close();
       }

   }
   ```

1. Start the application. You're shown logs similar to the following example:

   ```output
   Sent a message to the queue
   Starting the processor
   ...
   Processing message. Id: 6f405435200047069a3caf80893a80bc, Sequence #: 1. Contents: Hello, World!
   Stopping and closing the processor
   ```

The following list shows reasons why this code isn't flexible or graceful:

- The namespace and queue/topic/subscription names are hard coded.
- If you use `@Value` to get configurations from the Spring environment, you can't have IDE hints in your **application.properties** file.
- If you have a microservice scenario, you must duplicate the code in each project, and it's easy to make mistakes and hard to be consistent.

Fortunately, building the client beans by yourself isn't necessary with Spring Cloud Azure. Instead, you can directly inject the beans and use the [configuration properties](spring-cloud-azure.md?tabs=maven#configuration-properties) that you're already familiar with to configure Service Bus.

Spring Cloud Azure also provides the following global configurations for different scenarios. For more information, see the [Global configuration for Azure Service SDKs](configuration.md#global-configuration-for-azure-service-sdks) section of the [Spring Cloud Azure configuration](configuration.md).

- Proxy options.
- Retry options.
- AMQP transport client options.

You can also connect to different Azure clouds. For more information, see [Connect to different Azure clouds](https://devblogs.microsoft.com/azure-sdk/announcing-the-stable-release-of-spring-cloud-azure-version-4-4-0/#connect-to-different-azure-clouds).

## Use the Spring Cloud Azure Service Bus JMS Starter

The [Spring Cloud Azure Service Bus JMS Starter](https://mvnrepository.com/artifact/com.azure.spring/spring-cloud-azure-starter-servicebus-jms) module provides [Spring JMS](https://docs.spring.io/spring-framework/docs/current/reference/html/integration.html#jms) integration with Service Bus. The following video describes how to integrate Spring JMS applications with Azure Service Bus using JMS 2.0.

<br>

> [!VIDEO https://www.youtube.com/embed/9O3CALyoZHE?list=PLPeZXlCR7ew8LlhnSH63KcM0XhMKxT1k_]

This guide shows you how to use Spring Cloud Azure Service Bus Starter for JMS API to send messages to and receive messages from Service Bus.

### Add the Service Bus dependency

To install the Spring Cloud Azure Service Bus JMS Starter module, add the following dependencies to your **pom.xml** file:

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

- The Spring Cloud Azure Service Bus JMS artifact:

  ```xml
  <dependency>
    <groupId>com.azure.spring</groupId>
    <artifactId>spring-cloud-azure-starter-servicebus-jms</artifactId>
  </dependency>
  ```

### Code the application to send and receive messages

1. Configure the connection string and pricing tier for your Service Bus, as shown in the following example:

   ```properties
   spring.jms.servicebus.connection-string=<service-bus-namespace-connection-string>
   spring.jms.servicebus.pricing-tier=<service-bus-pricing-tier>
   ```

1. Create the message receiver.

   Spring provides the means to publish messages to any POJO (Plain Old Java Object). First, define a generic `User` class that stores and retrieves user's name, as shown in the following example:

   ```java
   public class User implements Serializable {

       private static final long serialVersionUID = -295422703255886286L;

       private String name;

       public User() {
       }

       public User(String name) {
           setName(name);
       }

       public String getName() {
           return name;
       }

       public void setName(String name) {
           this.name = name;
       }
   }
   ```

   > [!TIP]
   > `Serializable` is implemented to use the `send` method in `JmsTemplate` in the Spring framework. Otherwise, you should define a customized `MessageConverter` bean to serialize the content to JSON in text format. For more information about `MessageConverter`, see the official [Spring JMS starter project](https://spring.io/guides/gs/messaging-jms/).

1. From here, you can create a new `QueueReceiveService` Java class as shown in the following example. This class is used to define a message receiver.

   ```java
   @Component
   public class QueueReceiveService {

       private static final String QUEUE_NAME = "<service-bus-queue-name>";

       @JmsListener(destination = QUEUE_NAME, containerFactory = "jmsListenerContainerFactory")
       public void receiveMessage(User user) {
           System.out.printf("Received a message from %s.", user.getName());
       }
   }
   ```

   > [!NOTE]
   > Be sure to replace the `<service-bus-queue-name>` placeholder with your own queue name configured in your Service Bus namespace.
   >
   > If you're using a topic/subscription, change the `destination` parameter as the topic name, and the `containerFactory` should be `topicJmsListenerContainerFactory`. Also, add the `subscription` parameter to describe the subscription name.

1. Wire up a sender and a receiver to send and receive messages with Spring, as shown in the following example:

   ```java
   @SpringBootApplication
   @EnableJms
   public class ServiceBusJmsStarterApplication {

       private static final String QUEUE_NAME = "<service-bus-queue-name>";

       public static void main(String[] args) {
           ConfigurableApplicationContext context = SpringApplication.run(ServiceBusJMSQueueApplication.class, args);
           JmsTemplate jmsTemplate = context.getBean(JmsTemplate.class);

           // Send a message with a POJO - the template reuse the message converter
           System.out.println("Sending a user message.");
           jmsTemplate.convertAndSend(QUEUE_NAME, new User("Tom"));
       }
   }
   ```

   > [!NOTE]
   > Be sure to replace the `<service-bus-queue-name>` placeholder with your own queue name configured in your Service Bus namespace.

   > [!TIP]
   > Be sure to add the `@EnableIntegration` annotation, which triggers the discovery of methods annotated with `@JmsListener`, creating the message listener container under the covers.

1. Start the application. You're shown logs similar to the following example:

   ```output
   Sending a user message.
   Received a message from Tom.
   ```

### Other information

For more information, see [How to use JMS API with Service Bus and AMQP 1.0](/azure/service-bus-messaging/service-bus-java-how-to-use-jms-api-amqp).

## Use Spring Messaging Azure Service Bus

The [Spring Messaging Azure Service Bus](https://mvnrepository.com/artifact/com.azure.spring/spring-messaging-azure-servicebus) module provides support for [Spring Messaging](https://docs.spring.io/spring-boot/docs/current/reference/html/messaging.html) framework with Service Bus.

If you're using Spring Messaging Azure Service Bus, then you can use the following features:

- `ServiceBusTemplate`: send messages to Service Bus queues and topics asynchronously and synchronously.
- `@ServiceBusListener`: mark a method to be the target of a Service Bus message listener on the destination.

This guide shows you how to use Spring Messaging Azure Service Bus to send messages to and receive messages from Service Bus.

### Add the Service Bus dependency

To install the Spring Messaging Azure Service Bus module, add the following dependencies to your **pom.xml** file:

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

- The Spring Messaging Service Bus and Spring Cloud Azure starter artifacts:

  ```xml
  <dependency>
    <groupId>com.azure.spring</groupId>
    <artifactId>spring-cloud-azure-starter</artifactId>
  </dependency>
  <dependency>
    <groupId>com.azure.spring</groupId>
    <artifactId>spring-messaging-azure-servicebus</artifactId>
  </dependency>
  ```

### Code the application to send and receive messages

1. Configure the namespace and queue type for your Service Bus, as shown in the following example:

   ```properties
   spring.cloud.azure.servicebus.namespace=<service-bus-namespace-name>
   spring.cloud.azure.servicebus.entity-type=queue
   ```

   > [!Note]
   > If you're using a topic/subscription, change the `spring.cloud.azure.servicebus.entity-type` value to `topic`.

1. Create a new `ConsumerService` Java class as shown in the following example. This class is used to define a message receiver.

   ```java
   @Service
   public class ConsumerService {

       private static final String QUEUE_NAME = "<service-bus-queue-name>";

       @ServiceBusListener(destination = QUEUE_NAME)
       public void handleMessageFromServiceBus(String message) {
           System.out.printf("Consume message: %s%n", message);
       }

   }
   ```

   > [!Note]
   > If you're using a topic/subscription, change the annotation parameter of `destination` as the topic name, and add the `group` parameter to describe the subscription name.

1. Wire up a sender and a receiver to send and receive messages with Spring, as shown in the following example:

   ```java
   @SpringBootApplication
   @EnableAzureMessaging
   public class Application {

       private static final String QUEUE_NAME = "<service-bus-queue-name>";

       public static void main(String[] args) {
           ConfigurableApplicationContext applicationContext = SpringApplication.run(Application.class);
           ServiceBusTemplate serviceBusTemplate = applicationContext.getBean(ServiceBusTemplate.class);
           System.out.println("Sending a message to the queue.");
           serviceBusTemplate.sendAsync(QUEUE_NAME, MessageBuilder.withPayload("Hello world").build()).subscribe();
       }
   }
   ```

   > [!TIP]
   > Be sure to add the `@EnableAzureMessaging` annotation, which triggers the discovery of methods annotated with `@ServiceBusListener`, creating the message listener container under the covers.

1. Start the application. You're shown logs similar to the following example:

   ```output
   Sending a message to the queue.
   Consume message: Hello world.
   ```

## Use Spring Integration Azure Service Bus

The [Spring Integration Azure Service Bus](https://mvnrepository.com/artifact/com.azure.spring/spring-integration-azure-servicebus) module provides support for the [Spring Integration](https://docs.spring.io/spring-boot/docs/current/reference/html/messaging.html) framework with Service Bus.

If your Spring application uses Spring Integration message channels, you can route messages between your message channels and Service Bus using channel adapters.

An inbound channel adapter forwards messages from a Service Bus queue or subscription to a message channel. An outbound channel adapter publishes messages from a message channel to a Service Bus queue and topic.

This guide shows you how to use Spring Integration Azure Service Bus to send messages to and receive messages from Service Bus.

### Add the Service Bus dependency

To install the Spring Cloud Azure Service Bus Integration Starter module, add the following dependencies to your **pom.xml** file:

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

- The Spring Cloud Azure Service Bus Integration artifact:

  ```xml
  <dependency>
    <groupId>com.azure.spring</groupId>
    <artifactId>spring-cloud-azure-starter-integration-servicebus</artifactId>
  </dependency>
  ```

### Code the application to send and receive messages

1. Configure the namespace of your Service Bus, as shown in the following example:

   ```properties
   spring.cloud.azure.servicebus.namespace=<your-servicebus-namespace-name>
   ```

1. Create a new `QueueReceiveConfiguration` Java class as shown in the following example. This class is used to define a message receiver.

   ```java
   @Configuration
   public class QueueReceiveConfiguration {

       private static final String INPUT_CHANNEL = "queue.input";
       private static final String QUEUE_NAME = "<your-servicebus-queue-name>";
       private static final String SERVICE_BUS_MESSAGE_LISTENER_CONTAINER = "queue-listener-container";

       /**
        * This message receiver binding with {@link ServiceBusInboundChannelAdapter}
        * via {@link MessageChannel} has name {@value INPUT_CHANNEL}
        */
       @ServiceActivator(inputChannel = INPUT_CHANNEL)
       public void messageReceiver(byte[] payload) {
           String message = new String(payload);
           System.out.printf("New message received: '%s'%n", message);
       }

       @Bean(SERVICE_BUS_MESSAGE_LISTENER_CONTAINER)
       public ServiceBusMessageListenerContainer messageListenerContainer(ServiceBusProcessorFactory processorFactory) {
           ServiceBusContainerProperties containerProperties = new ServiceBusContainerProperties();
           containerProperties.setEntityName(QUEUE_NAME);
           return new ServiceBusMessageListenerContainer(processorFactory, containerProperties);
       }

       @Bean
       public ServiceBusInboundChannelAdapter queueMessageChannelAdapter(
           @Qualifier(INPUT_CHANNEL) MessageChannel inputChannel,
           @Qualifier(SERVICE_BUS_MESSAGE_LISTENER_CONTAINER) ServiceBusMessageListenerContainer listenerContainer) {
           ServiceBusInboundChannelAdapter adapter = new ServiceBusInboundChannelAdapter(listenerContainer);
           adapter.setOutputChannel(inputChannel);
           return adapter;
       }

       @Bean(name = INPUT_CHANNEL)
       public MessageChannel input() {
           return new DirectChannel();
       }
   }
   ```

1. Create a new `QueueSendConfiguration` Java class as shown in the following example. This class is used to define a message sender.

   ```java
   @Configuration
   public class QueueSendConfiguration {

       private static final String OUTPUT_CHANNEL = "queue.output";
       private static final String QUEUE_NAME = "<your-servicebus-queue-name>";

       @Bean
       @ServiceActivator(inputChannel = OUTPUT_CHANNEL)
       public MessageHandler queueMessageSender(ServiceBusTemplate serviceBusTemplate) {
           serviceBusTemplate.setDefaultEntityType(ServiceBusEntityType.QUEUE);
           DefaultMessageHandler handler = new DefaultMessageHandler(QUEUE_NAME, serviceBusTemplate);
           handler.setSendCallback(new ListenableFutureCallback<Void>() {
               @Override
               public void onSuccess(Void result) {
                   System.out.println("Message was sent successfully.");
               }

               @Override
               public void onFailure(Throwable ex) {
                   System.out.println("There was an error sending the message.");
               }
           });

           return handler;
       }

       /**
        * Message gateway binding with {@link MessageHandler}
        * via {@link MessageChannel} has name {@value OUTPUT_CHANNEL}
        */
       @MessagingGateway(defaultRequestChannel = OUTPUT_CHANNEL)
       public interface QueueOutboundGateway {
           void send(String text);
       }
   }
   ```

1. Wire up a sender and a receiver to send and receive messages with Spring, as shown in the following example:

   ```java
   @SpringBootApplication
   @EnableIntegration
   @Configuration(proxyBeanMethods = false)
   public class ServiceBusIntegrationApplication {

       public static void main(String[] args) {
           ConfigurableApplicationContext applicationContext = SpringApplication.run(ServiceBusIntegrationApplication.class, args);
           QueueSendConfiguration.QueueOutboundGateway outboundGateway = applicationContext.getBean(QueueSendConfiguration.QueueOutboundGateway.class);
           System.out.println("Sending a message to the queue");
           outboundGateway.send("Hello World");
       }

   }
   ```

   > [!TIP]
   > Be sure to add the `@EnableIntegration` annotation, which enables the Spring Integration infrastructure.

1. Start the application. You're shown logs similar to the following example:

   ```output
   Message was sent successfully.
   New message received: 'Hello World'
   ```

## Use Spring Cloud Stream Service Bus Binder

To call the Service Bus API in a [Spring Cloud Stream](https://spring.io/projects/spring-cloud-stream) application, use the Spring Cloud Azure Service Bus Stream Binder module.

This guide shows you how to use Spring Cloud Stream Service Bus Binder to send messages to and receive messages from Service Bus.

### Add the Service Bus dependency

To install the Spring Cloud Azure Service Bus Stream Binder module, add the following dependencies to your **pom.xml** file:

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

- The Spring Cloud Azure Service Bus Integration artifact:

  ```xml
  <dependency>
    <groupId>com.azure.spring</groupId>
    <artifactId>spring-cloud-azure-stream-binder-servicebus</artifactId>
  </dependency>
  ```

### Code the application to send and receive messages

1. Configure the namespace of your Service Bus, as shown in the following example:

   ```properties
   spring.cloud.azure.servicebus.namespace=<service-bus-namespace-name>
   ```

1. Create the message receiver.

   To use your application as an event sink, configure the input binder by specifying the following information:

   - Declare a `Consumer` bean that defines message handling logic. For example, the following `Consumer` bean is named `consume`:

     ```java
     @Bean
     public Consumer<Message<String>> consume() {
         return message -> {
             System.out.printf("New message received: '%s'.%n", message.getPayload());
         };
     }
     ```

   - Add the configuration to specify the `queue` name for consuming by replacing the `<service-bus-queue-name>` placeholder, as shown in the following example:

     ```properties
      # name for the `Consumer` bean
      spring.cloud.function.definition=consume
      spring.cloud.stream.bindings.consume-in-0.destination=<service-bus-queue-name>
     ```

     > [!NOTE]
     > To consume from a Service Bus subscription, be sure to change the `consume-in-0` binding properties as shown in the following example:
     >
     > ```properties
     > spring.cloud.stream.bindings.consume-in-0.destination=<service-bus-topic-name>
     > spring.cloud.stream.bindings.consume-in-0.group=<service-bus-subscription-name>
     > ```

1. Create the message sender.

   To use your application as an event source, configure the output binder by specifying the following information:

   - Define a `Supplier` bean that defines where messages come from within your application.

     ```java
     @Bean
     return () -> {
             System.out.println("Sending a message.");
             return MessageBuilder.withPayload("Hello world").build();
         };
     }
     ```

   - Add the configuration to specify the `queue` name for sending by replacing the `<your-servicebus-queue-name>` placeholder in the following example:

     ```properties
     # "consume" is added from the previous step
     spring.cloud.function.definition=consume;supply
     spring.cloud.stream.bindings.supply-out-0.destination=<your-servicebus-queue-name>
     spring.cloud.stream.servicebus.bindings.supply-out-0.producer.entity-type=queue
     ```

     > [!NOTE]
     > To send to a Service Bus topic, be sure to change the `entity-type` to `topic`.

1. Start the application. You're shown see logs similar to the following example:

   ```output
   Sending a message.
   New message received: 'Hello world'.
   ```

[!INCLUDE [deploy-to-azure-spring-apps](includes/deploy-to-azure-spring-apps.md)]

## Next steps

> [!div class="nextstepaction"]
> [Azure for Spring developers](../spring/index.yml)
> [Spring Cloud Azure Service Bus Samples](https://github.com/Azure-Samples/azure-spring-boot-samples/tree/main/servicebus)

### See also

For more information about more Spring Boot Starters available for Microsoft Azure, see [What is Spring Cloud Azure?](spring-cloud-azure-overview.md)
