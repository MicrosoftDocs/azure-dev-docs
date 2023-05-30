---
title: Use JMS in Spring to access Azure Service Bus
description: This tutorial demonstrates how to use the Spring JMS Starter to send messages to and receive messages from Azure Service Bus.
manager: kyliel
author: KarlErickson
ms.author: seal
ms.date: 04/06/2023
ms.topic: tutorial
ms.custom: devx-track-java, spring-cloud-azure, devx-track-extended-java
---

# Use JMS in Spring to access Azure Service Bus

This tutorial demonstrates how to use Spring Boot Starter for Azure Service Bus JMS to send messages to and receive messages from Service Bus `queues` and `topics`.

Azure provides an asynchronous messaging platform called [Azure Service Bus](/azure/service-bus-messaging/service-bus-messaging-overview) ("Service Bus") that is based on the [Advanced Message Queueing Protocol 1.0](http://www.amqp.org/) ("AMQP 1.0") standard. You can use Service Bus across the range of supported Azure platforms.

The Spring Boot Starter for Azure Service Bus JMS provides Spring JMS integration with Service Bus.

The following video describes how to integrate Spring JMS applications with Azure Service Bus using JMS 2.0.

<br>

> [!VIDEO https://www.youtube.com/embed/9O3CALyoZHE?list=PLPeZXlCR7ew8LlhnSH63KcM0XhMKxT1k_]

## Prerequisites

- An Azure subscription - [create one for free](https://azure.microsoft.com/free/).

- [Java Development Kit (JDK)](/java/azure/jdk/) version 8 or higher.

- [Apache Maven](http://maven.apache.org/), version 3.2 or higher.

- [cURL](https://curl.se/) or a similar HTTP utility to test functionality.

- A queue or topic for Azure Service Bus. If you don't have one, see [Use Azure portal to create a Service Bus namespace and a queue](/azure/service-bus-messaging/service-bus-quickstart-portal) or [Use the Azure portal to create a Service Bus topic and subscriptions to the topic](/azure/service-bus-messaging/service-bus-quickstart-topics-subscriptions-portal).

- A Spring Boot application. If you don't have one, create a Maven project with the [Spring Initializr](https://start.spring.io/). Be sure to select **Maven Project** and, under **Dependencies**, add the **Spring Web** dependency, then select Java version 8 or higher.

> [!IMPORTANT]
> Spring Boot version 2.5 or higher is required to complete the steps in this tutorial.

## Send and receive messages from Azure Service Bus

With a queue or topic for Azure Service Bus, you can send and receive messages using Spring Cloud Azure Service Bus JMS.

To install the Spring Cloud Azure Service Bus JMS Starter module, add the following dependencies to your *pom.xml* file:

- The Spring Cloud Azure Bill of Materials (BOM):

  ```xml
  <dependencyManagement>
    <dependencies>
      <dependency>
        <groupId>com.azure.spring</groupId>
        <artifactId>spring-cloud-azure-dependencies</artifactId>
        <version>4.8.0</version>
        <type>pom</type>
        <scope>import</scope>
      </dependency>
    </dependencies>
  </dependencyManagement>
  ```

  > [!NOTE]
  > If you're using Spring Boot 3.x, be sure to set the `spring-cloud-azure-dependencies` version to `5.1.0`.
  > For more information about the `spring-cloud-azure-dependencies` version, see [Which Version of Spring Cloud Azure Should I Use](https://github.com/Azure/azure-sdk-for-java/wiki/Spring-Versions-Mapping#which-version-of-spring-cloud-azure-should-i-use).

- The Spring Cloud Azure Service Bus JMS Starter artifact:

  ```xml
  <dependency>
    <groupId>com.azure.spring</groupId>
    <artifactId>spring-cloud-azure-starter-servicebus-jms</artifactId>
  </dependency>
  ```

### Code the application

Use the following steps to configure your application to use a Service Bus queue or topic to send and receive messages.

1. Configure the Service Bus credentials by adding the following properties to your *application.properties* file.

   #### [Use a Service Bus queue](#tab/use-a-service-bus-queue)

   ```properties
   spring.jms.servicebus.connection-string=<ServiceBusNamespaceConnectionString>
   spring.jms.servicebus.pricing-tier=<ServiceBusPricingTier>
   ```

   The following table describes the fields in the configuration:

   | Field                                     | Description                                                                                     |
   |-------------------------------------------|-------------------------------------------------------------------------------------------------|
   | `spring.jms.servicebus.connection-string` | Specify the connection string you obtained in your Service Bus namespace from the Azure portal. |
   | `spring.jms.servicebus.pricing-tier`      | Specify the pricing tier of your service bus. Supported values are *premium*, *standard*, and *basic*. Premium uses Java Message Service (JMS) 2.0, while standard and basic use JMS 1.0 to interact with Azure Service Bus. |

   #### [Use a Service Bus topic](#tab/use-a-service-bus-topic)

   ```properties
   spring.jms.servicebus.connection-string=<ServiceBusNamespaceConnectionString>
   spring.jms.servicebus.topic-client-id=<ServiceBusSubscriptionID>
   spring.jms.servicebus.pricing-tier=<ServiceBusPricingTier>
   ```

   The following table describes the fields in the configuration:

   | Field                                     | Description                                                                                     |
   |-------------------------------------------|-------------------------------------------------------------------------------------------------|
   | `spring.jms.servicebus.connection-string` | Specify the connection string you obtained in your Service Bus namespace from the Azure portal. |
   | `spring.jms.servicebus.pricing-tier`      | Specify the pricing tier of your service bus. Supported values are *premium*, *standard*, and *basic*. Premium uses Java Message Service (JMS) 2.0, while standard and basic use JMS 1.0 to interact with Azure Service Bus. |
   | `spring.jms.servicebus.topic-client-id`   | Specify the JMS client ID, which is your Service Bus Subscription ID in the Azure portal.       |

    <!-- NOTE: The tab-block end-delimiter here (the "---") needs a 4-space indentation or it will be rendered as a hard rule. -->
    ---

1. Add `@EnableJms` to enable support for JMS listener annotated endpoints. Use `JmsTemplate` to send messages and `@JmsListener` to receive messages, as shown in the following example:

   #### [Use a Service Bus queue](#tab/use-a-service-bus-queue)

   ```java
   import org.slf4j.Logger;
   import org.slf4j.LoggerFactory;
   import org.springframework.beans.factory.annotation.Autowired;
   import org.springframework.boot.SpringApplication;
   import org.springframework.boot.autoconfigure.SpringBootApplication;
   import org.springframework.jms.annotation.EnableJms;
   import org.springframework.boot.CommandLineRunner;
   import org.springframework.jms.annotation.JmsListener;
   import org.springframework.jms.core.JmsTemplate;

   @SpringBootApplication
   @EnableJms
   public class ServiceBusJMSQueueApplication implements CommandLineRunner {

       private static final Logger LOGGER = LoggerFactory.getLogger(ServiceBusJMSQueueApplication.class);
       private static final String QUEUE_NAME = "<QueueName>";

       @Autowired
       private JmsTemplate jmsTemplate;

       public static void main(String[] args) {
           SpringApplication.run(ServiceBusJMSQueueApplication.class, args);
       }

       @Override
       public void run(String... args) {
           LOGGER.info("Sending message");
           jmsTemplate.convertAndSend(QUEUE_NAME, "Hello Word");
       }

       @JmsListener(destination = QUEUE_NAME, containerFactory = "jmsListenerContainerFactory")
       public void receiveMessage(String message) {
           LOGGER.info("Message received: {}", message);
       }

   }
   ```

   Replace `<QueueName>` with your own queue name configured in your Service Bus namespace.

   #### [Use a Service Bus topic](#tab/use-a-service-bus-topic)

   ```java
   import org.slf4j.Logger;
   import org.slf4j.LoggerFactory;
   import org.springframework.beans.factory.annotation.Autowired;
   import org.springframework.boot.CommandLineRunner;
   import org.springframework.boot.SpringApplication;
   import org.springframework.boot.autoconfigure.SpringBootApplication;
   import org.springframework.jms.annotation.EnableJms;
   import org.springframework.jms.annotation.JmsListener;
   import org.springframework.jms.core.JmsTemplate;

   @SpringBootApplication
   @EnableJms
   public class ServiceBusJMSTopicApplication implements CommandLineRunner {

       private static final Logger LOGGER = LoggerFactory.getLogger(ServiceBusJMSTopicApplication.class);
       private static final String TOPIC_NAME = "<TopicName>";
       private static final String SUBSCRIPTION_NAME = "<SubscriptionName>";

       @Autowired
       private JmsTemplate jmsTemplate;

       public static void main(String[] args) {
           SpringApplication.run(ServiceBusJMSTopicApplication.class, args);
       }

       @Override
       public void run(String... args) {
           LOGGER.info("Sending message");
           jmsTemplate.convertAndSend(TOPIC_NAME, "Hello Word");
       }

       @JmsListener(destination = TOPIC_NAME, containerFactory = "topicJmsListenerContainerFactory",
           subscription = SUBSCRIPTION_NAME)
       public void receiveMessage(String message) {
           LOGGER.info("Message received: {}", message);
       }

   }
   ```

   Replace the `<TopicName>` placeholder with your own topic name configured in your Service Bus namespace. Replace the `<SubscriptionName>` placeholder with your own subscription name for your Service Bus topic.

    <!-- NOTE: The tab-block end-delimiter here (the "---") needs a 4-space indentation or it will be rendered as a hard rule. -->
    ---

   [!INCLUDE [spring-default-azure-credential-overview.md](includes/spring-default-azure-credential-overview.md)]

1. Start the application. You should see `Sending message` and `Hello Word` posted to your application log, as shown in the following example output:

   ```output
   Sending message
   Message received: Hello Word
   ```

---

[!INCLUDE [deploy-to-azure-spring-apps](includes/deploy-to-azure-spring-apps.md)]

## Next steps

> [!div class="nextstepaction"]
> [Azure for Spring developers](../spring/index.yml)
> [Spring Cloud Azure Service Bus JMS Samples](https://github.com/Azure-Samples/azure-spring-boot-samples/tree/main/servicebus)
