---
title: Spring Cloud Stream with Azure Service Bus
description: This article demonstrates how to use Spring Cloud Stream Binder to send messages to and receive messages from Azure Service Bus.
author: KarlErickson
ms.author: karler
ms.reviewer: seal
ms.date: 08/28/2024
ms.topic: how-to
ms.custom: devx-track-java, spring-cloud-azure, devx-track-extended-java
---

# Spring Cloud Stream with Azure Service Bus

This article demonstrates how to use the Spring Cloud Stream Binder to send messages to and receive messages from Service Bus `queues` and `topics`.

Azure provides an asynchronous messaging platform called [Azure Service Bus](/azure/service-bus-messaging/service-bus-messaging-overview) ("Service Bus") that is based on the [Advanced Message Queueing Protocol 1.0](http://www.amqp.org/) ("AMQP 1.0") standard. Service Bus can be used across the range of supported Azure platforms.

## Prerequisites

- An Azure subscription - [create one for free](https://azure.microsoft.com/free/).

- [Java Development Kit (JDK)](/java/azure/jdk/) version 8 or higher.

- [Apache Maven](http://maven.apache.org/), version 3.2 or higher.

- [cURL](https://curl.se/) or a similar HTTP utility to test functionality.

- A queue or topic for Azure Service Bus. If you don't have one, [create a Service Bus queue](/azure/service-bus-messaging/service-bus-quickstart-portal) or [create a Service Bus topic](/azure/service-bus-messaging/service-bus-quickstart-topics-subscriptions-portal).

- A Spring Boot application. If you don't have one, create a Maven project with the [Spring Initializr](https://start.spring.io/). Be sure to select **Maven Project** and, under **Dependencies**, add the **Spring Web** and **Azure Support** dependencies, then select Java version 8 or higher.

> [!NOTE]
> To grant your account access to your Azure Service Bus resources, assign the `Azure Service Bus Data Sender` and `Azure Service Bus Data Receiver` role to the Microsoft Entra account you're currently using. For more information about granting access roles, see [Assign Azure roles using the Azure portal](/azure/role-based-access-control/role-assignments-portal) and [Authenticate and authorize an application with Microsoft Entra ID to access Azure Service Bus entities](/azure/service-bus-messaging/authenticate-application).

> [!IMPORTANT]
> Spring Boot version 2.5 or higher is required to complete the steps in this article.

## Send and receive messages from Azure Service Bus

With a queue or topic for Azure Service Bus, you can send and receive messages using Spring Cloud Azure Stream Binder Service Bus.

To install the Spring Cloud Azure Stream Binder Service Bus module, add the following dependencies to your **pom.xml** file:

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

- The Spring Cloud Azure Stream Binder Service Bus artifact:

   ```xml
   <dependency>
       <groupId>com.azure.spring</groupId>
       <artifactId>spring-cloud-azure-stream-binder-servicebus</artifactId>
   </dependency>
   ```

### Code the application

Use the following steps to configure your application to use a Service Bus queue or topic to send and receive messages.

1. Configure the Service Bus credentials in the configuration file `application.properties`.

   #### [Use a Service Bus queue](#tab/use-a-service-bus-queue)

   ```properties
    spring.cloud.azure.servicebus.namespace=${AZURE_SERVICEBUS_NAMESPACE}
    spring.cloud.stream.bindings.consume-in-0.destination=${AZURE_SERVICEBUS_QUEUE_NAME}
    spring.cloud.stream.bindings.supply-out-0.destination=${AZURE_SERVICEBUS_QUEUE_NAME}
    spring.cloud.stream.servicebus.bindings.consume-in-0.consumer.auto-complete=false
    spring.cloud.stream.servicebus.bindings.supply-out-0.producer.entity-type=queue
    spring.cloud.function.definition=consume;supply;
    spring.cloud.stream.poller.fixed-delay=60000 
    spring.cloud.stream.poller.initial-delay=0
   ```

   The following table describes the fields in the configuration:

   | Field                                                                         | Description                                                                                                                                                             |
   |-------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
   | `spring.cloud.azure.servicebus.namespace`                                     | Specify the namespace you obtained in your Service Bus from the Azure portal.                                                                                           |
   | `spring.cloud.stream.bindings.consume-in-0.destination`                       | Specify the Service Bus queue or Service Bus topic you used in this tutorial.                                                                                           |
   | `spring.cloud.stream.bindings.supply-out-0.destination`                       | Specify the same value used for input destination.                                                                                                                      |
   | `spring.cloud.stream.servicebus.bindings.consume-in-0.consumer.auto-complete` | Specify whether to settle messages automatically. If set as `false`, a message header of `Checkpointer` will be added to enable developers to settle messages manually. |
   | `spring.cloud.stream.servicebus.bindings.supply-out-0.producer.entity-type`   | Specify the entity type for the output binding, can be `queue` or `topic`.                                                                                              |
   | `spring.cloud.function.definition`                                            | Specify which functional bean to bind to the external destination(s) exposed by the bindings.                                                                           |
   | `spring.cloud.stream.poller.fixed-delay`                                      | Specify fixed delay for default poller in milliseconds. The default value is `1000 L`. The recommended value is `60000`.                                                                                 |
   | `spring.cloud.stream.poller.initial-delay`                                    | Specify initial delay for periodic triggers. The default value is `0`.                                                                                                  |

   #### [Use a Service Bus topic](#tab/use-a-service-bus-topic)

   ```properties
    spring.cloud.azure.servicebus.namespace=${AZURE_SERVICEBUS_NAMESPACE}
    spring.cloud.stream.bindings.consume-in-0.destination=${AZURE_SERVICEBUS_TOPIC_NAME}
    spring.cloud.stream.bindings.consume-in-0.group=${AZURE_SERVICEBUS_TOPIC_SUBSCRIPTION_NAME}
    spring.cloud.stream.bindings.supply-out-0.destination=${AZURE_SERVICEBUS_TOPIC_NAME}
    spring.cloud.stream.servicebus.bindings.consume-in-0.consumer.auto-complete=false
    spring.cloud.stream.servicebus.bindings.supply-out-0.producer.entity-type=topic
    spring.cloud.function.definition=consume;supply;
    spring.cloud.stream.poller.fixed-delay=60000 
    spring.cloud.stream.poller.initial-delay=0
   ```

   The following table describes the fields in the configuration:

   | Field                                                                         | Description                                                                                                                                                             |
   |-------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
   | `spring.cloud.azure.servicebus.namespace`                                     | Specify the namespace you obtained in your Service Bus from the Azure portal.                                                                                           |
   | `spring.cloud.stream.bindings.consume-in-0.destination`                       | Specify the Service Bus queue or Service Bus topic you used in this tutorial.                                                                                           |
   | `spring.cloud.stream.bindings.consume-in-0.group`                             | If you used a Service Bus topic, specify the topic subscription.                                                                                                        |
   | `spring.cloud.stream.bindings.supply-out-0.destination`                       | Specify the same value used for input destination.                                                                                                                      |
   | `spring.cloud.stream.servicebus.bindings.consume-in-0.consumer.auto-complete` | Specify whether to settle messages automatically. If set as `false`, a message header of `Checkpointer` will be added to enable developers to settle messages manually. |
   | `spring.cloud.stream.servicebus.bindings.supply-out-0.producer.entity-type`   | Specify the entity type for the output binding, can be `queue` or `topic`.                                                                                              |
   | `spring.cloud.function.definition`                                            | Specify which functional bean to bind to the external destination(s) exposed by the bindings.                                                                           |
   | `spring.cloud.stream.poller.fixed-delay`                                      | Specify fixed delay for default poller in milliseconds. The default value is `1000 L`. The recommended value is `60000`.                                                                                 |
   | `spring.cloud.stream.poller.initial-delay`                                    | Specify initial delay for periodic triggers. The default value is `0`.                                                                                                  |

    <!-- NOTE: The tab-block end-delimiter here (the "---") needs a 4-space indentation or it will be rendered as a hard rule. -->
    ---

1. Edit the startup class file to show the following content.

    ```java
    import com.azure.spring.messaging.checkpoint.Checkpointer;
    import org.slf4j.Logger;
    import org.slf4j.LoggerFactory;
    import org.springframework.boot.CommandLineRunner;
    import org.springframework.boot.SpringApplication;
    import org.springframework.boot.autoconfigure.SpringBootApplication;
    import org.springframework.context.annotation.Bean;
    import org.springframework.messaging.Message;
    import org.springframework.messaging.support.MessageBuilder;
    import reactor.core.publisher.Flux;
    import reactor.core.publisher.Sinks;
    import java.util.function.Consumer;
    import java.util.function.Supplier;
    import static com.azure.spring.messaging.AzureHeaders.CHECKPOINTER;
    
    @SpringBootApplication
    public class ServiceBusQueueBinderApplication implements CommandLineRunner {
    
        private static final Logger LOGGER = LoggerFactory.getLogger(ServiceBusQueueBinderApplication.class);
        private static final Sinks.Many<Message<String>> many = Sinks.many().unicast().onBackpressureBuffer();
    
        public static void main(String[] args) {
            SpringApplication.run(ServiceBusQueueBinderApplication.class, args);
        }
    
        @Bean
        public Supplier<Flux<Message<String>>> supply() {
            return ()->many.asFlux()
                           .doOnNext(m->LOGGER.info("Manually sending message {}", m))
                           .doOnError(t->LOGGER.error("Error encountered", t));
        }
    
        @Bean
        public Consumer<Message<String>> consume() {
            return message->{
                Checkpointer checkpointer = (Checkpointer) message.getHeaders().get(CHECKPOINTER);
                LOGGER.info("New message received: '{}'", message.getPayload());
                checkpointer.success()
                            .doOnSuccess(s->LOGGER.info("Message '{}' successfully checkpointed", message.getPayload()))
                            .doOnError(e->LOGGER.error("Error found", e))
                            .block();
            };
        }
    
        @Override
        public void run(String... args) {
            LOGGER.info("Going to add message {} to Sinks.Many.", "Hello World");
            many.emitNext(MessageBuilder.withPayload("Hello World").build(), Sinks.EmitFailureHandler.FAIL_FAST);
        }
    
    }
    ```

   [!INCLUDE [spring-default-azure-credential-overview.md](includes/spring-default-azure-credential-overview.md)]

1. Start the application. Messages like the following example will be posted in your application log:

   ```output
   New message received: 'Hello World'
   Message 'Hello World' successfully checkpointed
   ```

## Next steps

> [!div class="nextstepaction"]
> [Azure for Spring developers](../spring/index.yml)
> [Spring Cloud Azure Stream Binder Service Bus Samples](https://github.com/Azure-Samples/azure-spring-boot-samples/tree/main/servicebus)
