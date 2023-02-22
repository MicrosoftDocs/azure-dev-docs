---
title: Spring Cloud Stream with Azure Service Bus
description: This article demonstrates how to use Spring Cloud Stream Binder to send messages to and receive messages from Azure Service Bus.
manager: kyliel
author: KarlErickson
ms.author: seal
ms.date: 01/18/2023
ms.topic: article
ms.custom: devx-track-java, spring-cloud-azure
---

# Spring Cloud Stream with Azure Service Bus

This article demonstrates how to use the Spring Cloud Stream Binder to send messages to and receive messages from Service Bus `queues` and `topics`.

[!INCLUDE [spring-boot-20-note.md](includes/spring-boot-20-note.md)]

Azure provides an asynchronous messaging platform called [Azure Service Bus](/azure/service-bus-messaging/service-bus-messaging-overview) ("Service Bus") that is based on the [Advanced Message Queueing Protocol 1.0](http://www.amqp.org/) ("AMQP 1.0") standard. Service Bus can be used across the range of supported Azure platforms.

## Prerequisites

- An Azure subscription; if you don't already have an Azure subscription, you can activate your [MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/credit-for-visual-studio-subscribers/) or sign up for a [free account](https://azure.microsoft.com/free/).

- A supported Java Development Kit (JDK), version 8 or later. For more information about the JDKs available for use when developing on Azure, see [Java support on Azure and Azure Stack](../fundamentals/java-support-on-azure.md).

- Apache's [Maven](http://maven.apache.org/), version 3.2 or later.

- If you already have a configured Service Bus queue or topic, ensure that the Service Bus namespace meets the following requirements:

  - Allows access from all networks.
  - Is Standard (or higher).
  - Has an access policy with read/write access for your queue and topic.

- If you don't have a configured Service Bus queue or topic, use the Azure portal to [create a Service Bus queue](/azure/service-bus-messaging/service-bus-quickstart-portal) or [create a Service Bus topic](/azure/service-bus-messaging/service-bus-quickstart-topics-subscriptions-portal). Ensure that the namespace meets the requirements specified in the previous step. Also, make note of the connection string in the namespace as you need it for this tutorial's test app.

- If you don't have a Spring Boot application, create a Maven project with the [Spring Initializr](https://start.spring.io/). Be sure to select **Maven Project** and, under **Dependencies**, add the **Web** dependency, and then select Java version 8 or 11.

> [!IMPORTANT]
> Spring Boot version 2.5 or higher is required to complete the steps in this article.

## Use the Spring Cloud Stream Binder starter

1. Locate the *pom.xml* file in the parent directory of your app; for example:

    *C:\SpringBoot\servicebus\pom.xml*

    -or-

    */users/example/home/servicebus/pom.xml*

1. Open the *pom.xml* file in a text editor.

1. Add the following code block under the `<dependencies>` element:

   ```xml
   <dependency>
       <groupId>com.azure.spring</groupId>
       <artifactId>spring-cloud-azure-stream-binder-servicebus</artifactId>
   </dependency>
   ```

   > [!NOTE]
   > For more information about how to manage Spring Cloud Azure library versions by using a bill of materials (BOM), see the [Getting started](developer-guide-overview.md#getting-started) section of the [Spring Cloud Azure developer guide](developer-guide-overview.md).

1. Save and close the *pom.xml* file.

## Configure the app for your service bus

You can configure your app based on either the connection string or service principal. This tutorial uses a connection string. For more information about using service principal, see the [Spring Cloud Azure Stream Binder for Service Bus queue Code Sample](https://github.com/Azure-Samples/azure-spring-boot-samples/tree/main/servicebus/spring-cloud-azure-stream-binder-servicebus/servicebus-queue-binder).

1. Add an *application.yaml* in the *resources* directory of your app; for example:

   *C:\SpringBoot\servicebus\src\main\resources\application.yaml*

   -or-

   */users/example/home/servicebus/src/main/resources/application.yaml*

1. Open the *application.yaml* file in a text editor, append the appropriate code to the end of the *application.yaml* file depending on whether you're using a Service Bus queue or topic. Use the [Field descriptions table](#fd) to replace the sample values with the appropriate properties for your service bus.

   **Service Bus queue**

   ```yaml
   spring:
     cloud:
       azure:
         servicebus:
           namespace: ${AZURE_SERVICEBUS_NAMESPACE}
       stream:
         bindings:
           consume-in-0:
             destination: ${AZURE_SERVICEBUS_QUEUE_NAME}
           supply-out-0:
             destination: ${AZURE_SERVICEBUS_QUEUE_NAME}
         servicebus:
           bindings:
             consume-in-0:
               consumer:
                 auto-complete: false
             supply-out-0:
               producer:
                 entity-type: queue
         function:
           definition: consume;supply;
         poller:
           fixed-delay: 1000
           initial-delay: 0
   ```

   **Service Bus topic**

   ```yaml
   spring:
     cloud:
       azure:
         servicebus:
           namespace: ${AZURE_SERVICEBUS_NAMESPACE}
       stream:
         bindings:
           consume-in-0:
             destination: ${AZURE_SERVICEBUS_TOPIC_NAME}
             group: ${AZURE_SERVICEBUS_TOPIC_SUBSCRIPTION_NAME}
           supply-out-0:
             destination: ${AZURE_SERVICEBUS_TOPIC_NAME}
         servicebus:
           bindings:
             consume-in-0:
               consumer:
                 auto-complete: false
             supply-out-0:
               producer:
                 entity-type: topic
         function:
           definition: consume;supply;
         poller:
           fixed-delay: 1000
           initial-delay: 0
   ```

   **<a name="fd">Field descriptions</a>**

   | Field                                                                         | Description                                                                                                                                                             |
   |-------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
   | `spring.cloud.azure.servicebus.namespace`                                     | Specify the namespace you obtained in your Service Bus from the Azure portal.                                                                                           |
   | `spring.cloud.stream.function.definition`                                     | Specify which functional bean to bind to the external destination(s) exposed by the bindings.                                                                           |
   | `spring.cloud.stream.poller.fixed-delay`                                      | Specify fixed delay for default poller in milliseconds, default 1000 L.                                                                                                 |
   | `spring.cloud.stream.poller.initial-delay`                                    | Specify initial delay for periodic triggers, default 0.                                                                                                                 |
   | `spring.cloud.stream.bindings.consume-in-0.destination`                       | Specify the Service Bus queue or Service Bus topic you used in this tutorial.                                                                                           |
   | `spring.cloud.stream.bindings.consume-in-0.group`                             | If you used a Service Bus topic, specify the topic subscription.                                                                                                        |
   | `spring.cloud.stream.bindings.supply-out-0.destination`                       | Specify the same value used for input destination.                                                                                                                      |
   | `spring.cloud.stream.servicebus.bindings.consume-in-0.consumer.auto-complete` | Specify whether to settle messages automatically. If set as *false*, a message header of `Checkpointer` will be added to enable developers to settle messages manually. |
   | `spring.cloud.stream.servicebus.bindings.supply-out-0.producer.entity-type`   | Specify the entity type for the output binding, can be `queue` or `topic`.                                                                                              |

1. Save and close the *application.yaml* file.

## Implement basic Service Bus functionality

In this section, you create the necessary Java classes for sending messages to your service bus.

### Modify the main application class

1. Locate the main application Java file in the package directory of your app; for example:

   `C:\SpringBoot\servicebus\src\main\java\com\example\servicebus\ServiceBusApplication.java`

   -or-

   `/users/example/home/servicebus/src/main/java/com/example/servicebus/ServiceBusApplication.java`

1. Open the main application Java file in a text editor.

1. Add the following code to the file:

   ```java
   package com.example.servicebus;

   import com.azure.spring.messaging.checkpoint.Checkpointer;
   import org.slf4j.Logger;
   import org.slf4j.LoggerFactory;
   import org.springframework.boot.SpringApplication;
   import org.springframework.boot.autoconfigure.SpringBootApplication;
   import org.springframework.context.annotation.Bean;
   import org.springframework.messaging.Message;

   import java.util.function.Consumer;

   import static com.azure.spring.messaging.AzureHeaders.CHECKPOINTER;

   @SpringBootApplication
   public class ServiceBusApplication {

       private static final Logger LOGGER = LoggerFactory.getLogger(ServiceBusApplication.class);

       public static void main(String[] args) {
           SpringApplication.run(ServiceBusApplication.class, args);
       }

       @Bean
       public Consumer<Message<String>> consume() {
           return message -> {
               Checkpointer checkpointer = (Checkpointer) message.getHeaders().get(CHECKPOINTER);
               LOGGER.info("New message received: '{}'", message.getPayload());
               checkpointer.success()
                           .doOnSuccess(s -> LOGGER.info("Message '{}' successfully checkpointed", message.getPayload()))
                           .doOnError(e -> LOGGER.error("Error found", e))
                           .block();
           };
       }
   }
   ```

1. Save and close the file.

### Create a new producer configuration class

1. Using a text editor, create a Java file named *ServiceProducerConfiguration.java* in the package directory of your app.

1. Add the following code to the new file:

   ```java
   package com.example.servicebus;

   import org.slf4j.Logger;
   import org.slf4j.LoggerFactory;
   import org.springframework.context.annotation.Bean;
   import org.springframework.context.annotation.Configuration;
   import org.springframework.messaging.Message;
   import reactor.core.publisher.Flux;
   import reactor.core.publisher.Sinks;

   import java.util.function.Supplier;

   @Configuration
   public class ServiceProducerConfiguration {

       private static final Logger LOGGER = LoggerFactory.getLogger(ServiceProducerConfiguration.class);

       @Bean
       public Sinks.Many<Message<String>> many() {
           return Sinks.many().unicast().onBackpressureBuffer();
       }

       @Bean
       public Supplier<Flux<Message<String>>> supply(Sinks.Many<Message<String>> many) {
           return () -> many.asFlux()
                            .doOnNext(m -> LOGGER.info("Manually sending message {}", m))
                            .doOnError(t -> LOGGER.error("Error encountered", t));
       }
   }
   ```

1. Save and close the *ServiceProducerConfiguration.java* file.

### Create a new controller class

1. Using a text editor, create a Java file named *ServiceProducerController.java* in the package directory of your app.

1. Add the following lines of code to the new file:

   ```java
   package com.example.servicebus;

   import org.slf4j.Logger;
   import org.slf4j.LoggerFactory;
   import org.springframework.beans.factory.annotation.Autowired;
   import org.springframework.http.ResponseEntity;
   import org.springframework.messaging.Message;
   import org.springframework.messaging.support.MessageBuilder;
   import org.springframework.web.bind.annotation.PostMapping;
   import org.springframework.web.bind.annotation.RequestParam;
   import org.springframework.web.bind.annotation.RestController;
   import reactor.core.publisher.Sinks;

   @RestController
   public class ServiceProducerController {

       private static final Logger LOGGER = LoggerFactory.getLogger(ServiceProducerController.class);

       @Autowired
       private Sinks.Many<Message<String>> many;

       @PostMapping("/messages")
       public ResponseEntity<String> sendMessage(@RequestParam String message) {
           LOGGER.info("Going to add message {} to Sinks.Many.", message);
           many.emitNext(MessageBuilder.withPayload(message).build(), Sinks.EmitFailureHandler.FAIL_FAST);
           return ResponseEntity.ok("Sent!");
       }
   }
   ```

1. Save and close the *ServiceProducerController.java* file.

## Build and test your application

1. Open a command prompt.

1. Change the directory to the location of your *pom.xml* file; for example:

   `cd C:\SpringBoot\servicebus`

   -or-

   `cd /users/example/home/servicebus`

1. Build your Spring Boot application with Maven and run it:

   ```shell
   mvn clean spring-boot:run
   ```

1. Once your application is running, you can use *curl* to test your application:

   ```shell
   curl -X POST localhost:8080/messages?message=hello
   ```

   You should see "hello" posted to your application's log:

   ```shell
   New message received: 'hello'
   Message 'hello' successfully checkpointed
   ```

## Clean up resources

When no longer needed, use the [Azure portal](https://portal.azure.com/) to delete the resources created in this article to avoid unexpected charges.

## Next steps

> [!div class="nextstepaction"]
> [Spring on Azure](/java/azure/spring-framework)