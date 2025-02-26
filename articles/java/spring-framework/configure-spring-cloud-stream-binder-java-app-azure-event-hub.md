---
title: Spring Cloud Stream with Azure Event Hubs
description: Learn how to configure a Java-based Spring Cloud Stream Binder application created with the Spring Boot Initializr with Azure Event Hubs.
author: KarlErickson
ms.author: karler
ms.reviewer: seal
ms.date: 04/06/2023
ms.topic: tutorial
ms.custom: devx-track-java, spring-cloud-azure, devx-track-extended-java
---

# Spring Cloud Stream with Azure Event Hubs

This tutorial demonstrates how to send and receive messages using Azure Event Hubs and Spring Cloud Stream Binder Eventhubs in a Spring Boot application.

## Prerequisites

- An Azure subscription - [create one for free](https://azure.microsoft.com/free/).

- [Java Development Kit (JDK)](/java/azure/jdk/) version 8 or higher.

- [Apache Maven](http://maven.apache.org/), version 3.2 or higher.

- [cURL](https://curl.se/) or a similar HTTP utility to test functionality.

- An Azure Event hub. If you don't have one, [create an event hub using Azure portal](/azure/event-hubs/event-hubs-create).

- An Azure Storage Account for Event hub checkpoints. If you don't have one, [create a storage account](/azure/storage/common/storage-account-create?tabs=azure-portal).

- A Spring Boot application. If you don't have one, create a Maven project with the [Spring Initializr](https://start.spring.io/). Be sure to select **Maven Project** and, under **Dependencies**, add the **Spring Web** and **Azure Support** dependencies, then select Java version 8 or higher.

> [!NOTE]
> To grant your account access to resources, in Azure Event Hubs, assign the `Azure Event Hubs Data Receiver` and `Azure Event Hubs Data Sender` role to the Microsoft Entra account you're currently using. Then, in the Azure Storage account, assign the `Storage Blob Data Contributor` role to the Microsoft Entra account you're currently using. For more information about granting access roles, see [Assign Azure roles using the Azure portal](/azure/role-based-access-control/role-assignments-portal) and [Authorize access to Event Hubs resources using Microsoft Entra ID](/azure/event-hubs/authorize-access-azure-active-directory).

> [!IMPORTANT]
> Spring Boot version 2.5 or higher is required to complete the steps in this tutorial.

## Send and receive messages from Azure Event Hubs

With an Azure Storage Account and an Azure Event hub, you can send and receive messages using Spring Cloud Azure Stream Binder Event Hubs.

To install the Spring Cloud Azure Stream Binder Event Hubs module, add the following dependencies to your **pom.xml** file:

- The Spring Cloud Azure Bill of Materials (BOM):

  ```xml
  <dependencyManagement>
    <dependencies>
      <dependency>
        <groupId>com.azure.spring</groupId>
        <artifactId>spring-cloud-azure-dependencies</artifactId>
        <version>5.20.0</version>
        <type>pom</type>
        <scope>import</scope>
      </dependency>
    </dependencies>
  </dependencyManagement>
  ```

  > [!NOTE]
  > If you're using Spring Boot 2.x, be sure to set the `spring-cloud-azure-dependencies` version to `4.19.0`.
  > This Bill of Material (BOM) should be configured in the `<dependencyManagement>` section of your **pom.xml** file. This ensures that all Spring Cloud Azure dependencies are using the same version.
  > For more information about the version used for this BOM, see [Which Version of Spring Cloud Azure Should I Use](https://github.com/Azure/azure-sdk-for-java/wiki/Spring-Versions-Mapping#which-version-of-spring-cloud-azure-should-i-use).

- The Spring Cloud Azure Stream Binder Event Hubs artifact:

   ```xml
   <dependency>
     <groupId>com.azure.spring</groupId>
     <artifactId>spring-cloud-azure-stream-binder-eventhubs</artifactId>
   </dependency>
   ```

### Code the application

Use the following steps to configure your application to produce and consume messages using Azure Event Hubs.

1. Configure the Event hub credentials by adding the following properties to your **application.properties** file.

   ```properties
    spring.cloud.azure.eventhubs.namespace=${AZURE_EVENTHUBS_NAMESPACE}
    spring.cloud.azure.eventhubs.processor.checkpoint-store.account-name=${AZURE_STORAGE_ACCOUNT_NAME}
    spring.cloud.azure.eventhubs.processor.checkpoint-store.container-name=${AZURE_STORAGE_CONTAINER_NAME}
    spring.cloud.stream.bindings.consume-in-0.destination=${AZURE_EVENTHUB_NAME}
    spring.cloud.stream.bindings.consume-in-0.group=${AZURE_EVENTHUB_CONSUMER_GROUP}
    spring.cloud.stream.bindings.supply-out-0.destination=${AZURE_EVENTHUB_NAME}
    spring.cloud.stream.eventhubs.bindings.consume-in-0.consumer.checkpoint.mode=MANUAL
    spring.cloud.function.definition=consume;supply;
    spring.cloud.stream.poller.initial-delay=0
    spring.cloud.stream.poller.fixed-delay=1000
   ```

   The following table describes the fields in the configuration:

   | Field                                                                          | Description                                                                                   |
   |--------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------|
   | `spring.cloud.azure.eventhubs.namespace`                                       | Specify the namespace you obtained in your event hub from the Azure portal.                   |
   | `spring.cloud.azure.eventhubs.processor.checkpoint-store.account-name`         | Specify the storage account you created in this tutorial.                                     |
   | `spring.cloud.azure.eventhubs.processor.checkpoint-store.container-name`       | Specify the container of your storage account.                                                |
   | `spring.cloud.stream.bindings.consume-in-0.destination`                        | Specify the event hub you used in this tutorial.                                              |
   | `spring.cloud.stream.bindings.consume-in-0.group`                              | Specify the Consumer groups in your Event Hubs Instance.                                      |
   | `spring.cloud.stream.bindings.supply-out-0.destination`                        | Specify the same event hub you used in this tutorial.                                         |
   | `spring.cloud.stream.eventhubs.bindings.consume-in-0.consumer.checkpoint.mode` | Specify `MANUAL`.                                                                             |
   | `spring.cloud.function.definition`                                             | Specify which functional bean to bind to the external destination(s) exposed by the bindings. |
   | `spring.cloud.stream.poller.initial-delay`                                     | Specify initial delay for periodic triggers. The default value is `0`.                        |
   | `spring.cloud.stream.poller.fixed-delay`                                       | Specify fixed delay for default poller in milliseconds. The default value is `1000 L`.        |

1. Edit the startup class file to show the following content.

    ```java
    import com.azure.spring.messaging.checkpoint.Checkpointer;
    import com.azure.spring.messaging.eventhubs.support.EventHubsHeaders;
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
    public class EventHubBinderApplication implements CommandLineRunner {
    
        private static final Logger LOGGER = LoggerFactory.getLogger(EventHubBinderApplication.class);
        private static final Sinks.Many<Message<String>> many = Sinks.many().unicast().onBackpressureBuffer();
    
        public static void main(String[] args) {
            SpringApplication.run(EventHubBinderApplication.class, args);
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
                LOGGER.info("New message received: '{}', partition key: {}, sequence number: {}, offset: {}, enqueued "
                        +"time: {}",
                    message.getPayload(),
                    message.getHeaders().get(EventHubsHeaders.PARTITION_KEY),
                    message.getHeaders().get(EventHubsHeaders.SEQUENCE_NUMBER),
                    message.getHeaders().get(EventHubsHeaders.OFFSET),
                    message.getHeaders().get(EventHubsHeaders.ENQUEUED_TIME)
                );
                checkpointer.success()
                            .doOnSuccess(success->LOGGER.info("Message '{}' successfully checkpointed",
                                message.getPayload()))
                            .doOnError(error->LOGGER.error("Exception found", error))
                            .block();
            };
        }
    
        @Override
        public void run(String... args) {
            LOGGER.info("Going to add message {} to sendMessage.", "Hello World");
            many.emitNext(MessageBuilder.withPayload("Hello World").build(), Sinks.EmitFailureHandler.FAIL_FAST);
        }
    
    }
    ```

   [!INCLUDE [spring-default-azure-credential-overview.md](includes/spring-default-azure-credential-overview.md)]

1. Start the application. Messages like this will be posted in your application log, as shown in the following example output:

   ```output
   New message received: 'Hello World', partition key: 107207233, sequence number: 458, offset: 94256, enqueued time: 2023-02-17T08:27:59.641Z
   Message 'Hello World!' successfully checkpointed
   ```

[!INCLUDE [deploy-to-azure-spring-apps](includes/deploy-to-azure-spring-apps.md)]

## Next steps

> [!div class="nextstepaction"]
> [Azure for Spring developers](../spring/index.yml)
> [Spring Cloud Azure Stream Binder Event Hubs Samples](https://github.com/Azure-Samples/azure-spring-boot-samples/tree/main/eventhubs)
