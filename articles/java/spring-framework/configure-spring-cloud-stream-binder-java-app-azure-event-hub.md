---
title: How to create a Spring Cloud Stream Binder application with Azure Event Hubs
description: Learn how to configure a Java-based Spring Cloud Stream Binder application created with the Spring Boot Initializr with Azure Event Hubs.
services: event-hubs
documentationcenter: java
ms.date: 02/08/2021
ms.service: event-hubs
ms.tgt_pltfrm: na
ms.topic: article
ms.custom: devx-track-java
---

# How to create a Spring Cloud Stream Binder application with Azure Event Hubs

This article demonstrates how to configure a Java-based Spring Cloud Stream Binder application created with the Spring Boot Initializer with Azure Event Hubs.

## Prerequisites

* An Azure subscription; if you don't already have an Azure subscription, you can activate your [MSDN subscriber benefits] or sign up for a [free Azure account].
* A supported Java Development Kit (JDK). For more information about the JDKs available for use when developing on Azure, see <https://aka.ms/azure-jdks>.
* [Apache Maven](http://maven.apache.org/), version 3.0 or later.

> [!IMPORTANT]
> Spring Boot version 2.2 or 2.3 is required to complete the steps in this article.

## Create an Azure Event Hub using the Azure portal

The following procedure creates an Azure event hub.

### Create an Azure Event Hub Namespace

1. Browse to the Azure portal at <https://portal.azure.com/> and sign in.

1. Select **+ Create a resource**, then search for *Event Hubs*.

1. Select **Create**.

   >[!div class="mx-imgBorder"]
   >![Create Azure Event Hub Namespace][IMG01]

1. On the **Create Namespace** page, enter the following information:

   * Choose the **Subscription** you want to use for your namespace.
   * Specify whether to create a new **Resource group** for your namespace, or choose an existing resource group.
   * Enter a unique **Namespace name**, which will become part of the URI for your event hub namespace. For example: if you entered *wingtiptoys-space* for the **Namespace name**, the URI would be `wingtiptoys-space.servicebus.windows.net`.
   * Specify the **Location** for your event hub namespace.
   * Pricing tier.
   * You can also specify the **Throughput units** for the namespace.
   
   >[!div class="mx-imgBorder"]
   >![Specify Azure Event Hub Namespace options][IMG02]

1. When you have specified the options listed above, select **Review + Create**, review the specifications and select **Create** to create your namespace.

## Create an Azure Event Hub in your namespace

After your namespace is deployed, select **Go to resource** to open the **Event Hubs Namespace** page, where you can create an event hub in the namespace.

1. Navigate to the namespace created in the previous section.

1. Select **+ Event Hubs** in top menu bar.

1. Name the event hub.

1. Select **Create**.

   >[!div class="mx-imgBorder"]
   >![Create Event Hub][IMG05]

### Create an Azure Storage Account for your Event Hub checkpoints

The following procedure creates a storage account for event hub checkpoints.

1. Browse to the Azure portal at <https://portal.azure.com/>.

1. Select **+Create a resource**, select **Storage**, and then select **Storage Account**.

1. On the **Create storage account** page, enter the following information:

   * Choose the **Subscription** you want to use for your storage account.
   * Specify whether to create a new **Resource group** for your storage account, or choose an existing resource group.
   * Enter a unique **Name** for the storage account.
   * Specify the **Location** for your storage account.

   >[!div class="mx-imgBorder"]
   >![Specify Azure Storage Account options][IMG08]

1. When you have specified the options listed above, select **Review + create** to create your storage account.

1. Review the specifications and select **Create**.  The deployment will take several minutes.

## Create a simple Spring Boot application with the Spring Initializr

The following procedure creates a Spring boot application.

1. Browse to <https://start.spring.io/>.

1. Specify the following options:

   * Generate a **Maven** project with **Java**.
   * Specify a **Spring Boot** version that is equal to **2.4.6**.
   * Specify the **Group** and **Artifact** names for your application.
   * Select **8** for the Java version.
   * Add the *Web* dependency.

   >[!div class="mx-imgBorder"]
   >![Basic Spring Initializr options][SI01]

   > [!NOTE]
   > The Spring Initializr uses the **Group** and **Artifact** names to create the package name; for example: *com.contoso.eventhubs.sample*.

1. When you have specified the options listed above, select **GENERATE**.

1. When prompted, download the project to a path on your local computer.

1. After you have extracted the files on your local system, your simple Spring Boot application will be ready for editing.

## Configure your Spring Boot app to use the Azure Event Hub starter

1. Locate the *pom.xml* file in the root directory of your app; for example:

   *C:\SpringBoot\eventhubs-sample\pom.xml*

   -or-

   */users/example/home/eventhubs-sample/pom.xml*

1. Open the *pom.xml* file in a text editor, and add the Spring Cloud Azure Event Hub Stream Binder starter to the list of `<dependencies>`:

   ```xml
   <dependency>
     <groupId>com.azure.spring</groupId>
     <artifactId>azure-spring-cloud-stream-binder-eventhubs</artifactId>
     <version>2.5.0</version>
   </dependency>
   ```

1. Save and close the *pom.xml* file.

## Configure your Spring Boot app to use your Azure Event Hub

1. Add an *application.yaml* in the *resources* directory of your app; for example:

   *C:\SpringBoot\eventhubs-sample\src\main\resources\application.yaml*

   -or-

   */users/example/home/eventhubs-sample/src/main/resources/application.yaml*

2. Open the *application.yaml* file in a text editor, add the following lines, and then replace the sample values with the appropriate properties for your event hub:

   ```yaml
    spring:
      cloud:
        azure:
          eventhub:
            connection-string: [eventhub-namespace-connection-string]
            checkpoint-storage-account: wingtiptoysstorage
            checkpoint-access-key: [checkpoint-access-key]
            checkpoint-container: wingtiptoyscontainer
            
        stream:
          bindings:
            consume-in-0:
              destination: wingtiptoyshub
              group: $Default
            supply-out-0:
              destination: wingtiptoyshub
   
          eventhub:
            bindings:
              consume-in-0:
                consumer:
                  checkpoint-mode: MANUAL
          function:
            definition: consume;supply;
          poller:
            initial-delay: 0
            fixed-delay: 1000
   ```

   Where:

   |                          Field                           |                                                                                   Description                                                                                    |
   |----------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
   |               `spring.cloud.azure.eventhub.connection-string`                |                                        Specify the connection string you obtained in your Event Hub namespace from the Azure portal.                                   |
   |               `spring.cloud.azure.function.definition`                |                                        Specify which functional bean to bind to the external destination(s) exposed by the bindings.                                   |
   |               `spring.cloud.azure.poller.fixed-delay`                |                                        Specify fixed delay for default poller in milliseconds, default 1000L.                                   |
   |               `spring.cloud.azure.poller.initial-delay`                |                                       Specify initial delay for periodic triggers, default 0.                                   |
   |               `spring.cloud.stream.bindings.consume-in-0.destination`                 |                            Specify the Event Hub you used in this tutorial.                         |
   |               `spring.cloud.stream.bindings.consume-in-0.group`                    |                               Specify the Consumer groups in your Event Hubs Instance  .                                |
   |               `spring.cloud.stream.bindings.supply-out-0.destination`                |                             Specify the same Event Hub you used in this tutorial.                        |
   | `spring.cloud.stream.eventhub.bindings.consume-in-0.consumer.checkpoint-mode` |                                                       Specify `MANUAL`.                                                   |
   |               `spring.cloud.stream.eventhub.checkpoint-access-key` |                                                      Specify the access-key of your storage account.                                                   |
   |               `spring.cloud.stream.eventhub.checkpoint-container` |                                                       Specify the container of your storage account.                                                   |
   |               `spring.cloud.stream.eventhub.checkpoint-storage-account` |                                                 Specify the storage account you created in this tutorial.                                               |

3. Save and close the *application.yaml* file.

## Add sample code to implement basic event hub functionality

In this section, you create the necessary Java classes for sending events to your event hub.

### Modify the main application class

1. Add the main application Java file in the package directory of your app; for example:

   *C:\SpringBoot\eventhubs-sample\src\main\java\com\contoso\eventhubs\sample\EventhubSampleApplication.java*

   -or-

   */users/example/home/eventhubs-sample/src/main/java/com/contoso/eventhubs/sample/EventhubSampleApplication.java*

1. Open the main application Java file in a text editor, and add the following lines to the file:

   ```java
   package com.contoso.eventhubs.sample;
   
   import com.azure.spring.integration.core.EventHubHeaders;
   import com.azure.spring.integration.core.api.reactor.Checkpointer;
   import org.slf4j.Logger;
   import org.slf4j.LoggerFactory;
   import org.springframework.boot.SpringApplication;
   import org.springframework.boot.autoconfigure.SpringBootApplication;
   import org.springframework.context.annotation.Bean;
   import org.springframework.messaging.Message;
   
   import java.util.function.Consumer;
   
   import static com.azure.spring.integration.core.AzureHeaders.CHECKPOINTER;
   
   @SpringBootApplication
   public class EventhubSampleApplication {
   
       public static final Logger LOGGER = LoggerFactory.getLogger(EventhubSampleApplication.class);
   
       public static void main(String[] args) {
           SpringApplication.run(EventhubSampleApplication.class, args);
       }
   
       @Bean
       public Consumer<Message<String>> consume() {
           return message -> {
               Checkpointer checkpointer = (Checkpointer) message.getHeaders().get(CHECKPOINTER);
               LOGGER.info("New message received: '{}', partition key: {}, sequence number: {}, offset: {}, enqueued time: {}",
                   message.getPayload(),
                   message.getHeaders().get(EventHubHeaders.PARTITION_KEY),
                   message.getHeaders().get(EventHubHeaders.SEQUENCE_NUMBER),
                   message.getHeaders().get(EventHubHeaders.OFFSET),
                   message.getHeaders().get(EventHubHeaders.ENQUEUED_TIME)
               );
               checkpointer.success()
                           .doOnSuccess(success -> LOGGER.info("Message '{}' successfully checkpointed", message.getPayload()))
                           .doOnError(error -> LOGGER.error("Exception found", error))
                           .subscribe();
           };
       }
   }
   ```

1. Save and close the main application Java file.

### Create a new configuration class

1. Create a new Java file named *EventProducerConfiguration.java* in the package directory of your app, then open the file in a text editor and add the following lines:

   ```java
   package com.contoso.eventhubs.sample;
   
   import org.slf4j.Logger;
   import org.slf4j.LoggerFactory;
   import org.springframework.context.annotation.Bean;
   import org.springframework.context.annotation.Configuration;
   import org.springframework.messaging.Message;
   import reactor.core.publisher.Flux;
   import reactor.core.publisher.Sinks;
   
   import java.util.function.Supplier;
   
   @Configuration
   public class EventProducerConfiguration {
   
       private static final Logger LOGGER = LoggerFactory.getLogger(EventProducerConfiguration.class);
   
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
   
1. Save and close the *EventProducerConfiguration.java* file.

### Create a new controller class

1. Create a new Java file named *EventProducerController.java* in the package directory of your app, then open the file in a text editor and add the following lines:

   ```java
   package com.contoso.eventhubs.sample;
   
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
   public class EventProducerController {
   
       public static final Logger LOGGER = LoggerFactory.getLogger(EventProducerController.class);
   
       @Autowired
       private Sinks.Many<Message<String>> many;
   
       @PostMapping("/messages")
       public ResponseEntity<String> sendMessage(@RequestParam String message) {
           LOGGER.info("Going to add message {} to sendMessage.", message);
           many.emitNext(MessageBuilder.withPayload(message).build(), Sinks.EmitFailureHandler.FAIL_FAST);
           return ResponseEntity.ok(message);
       }
   }
   ```

1. Save and close the *EventProducerController.java* file.

## Build and test your application

Use the following procedures to build and test your application.

1. Open a command prompt and change directory to the folder where your *pom.xml* file is located; for example:

   ```cmd
    cd C:\SpringBoot\eventhubs-sample
   ```
   -or-

   ```bash
   cd /users/example/home/eventhubs-sample
   ```

1. Build your Spring Boot application with Maven and run it; for example:

   ```bash
   mvn clean package -Dmaven.test.skip=true
   mvn spring-boot:run
   ```

1. Once your application is running, you can use `curl` to test your application; for example:

   ```bash
   curl -X POST http://localhost:8080/messages?message=hello
   ```
   You should see "hello" posted to your application's logs. For example:

   ```output
   New message received: 'hello', partition key: 2002572479, sequence number: 4, offset: 768, enqueued time: 2021-06-03T01:47:36.859Z
   Message 'hello' successfully checkpointed
   ```

## Next steps

To learn more about Spring and Azure, continue to the Spring on Azure documentation center.

> [!div class="nextstepaction"]
> [Spring on Azure](./index.yml)

### Additional Resources

For more information about Azure support for Event Hub Stream Binder, see the following articles:

* [What is Azure Event Hubs?](/azure/event-hubs/event-hubs-about)

* [Create an Event Hubs namespace and an event hub using the Azure portal](/azure/event-hubs/event-hubs-create)

* [How to use the Spring Boot Starter for Apache Kafka with Azure Event Hubs](configure-spring-cloud-stream-binder-java-app-kafka-azure-event-hub.md)

For more information about using Azure with Java, see the [Azure for Java Developers] and the [Working with Azure DevOps and Java].

The **[Spring Framework]** is an open-source solution that helps Java developers create enterprise-level applications. One of the more-popular projects that is built on top of that platform is [Spring Boot], which provides a simplified approach for creating stand-alone Java applications. To help developers get started with Spring Boot, several sample Spring Boot packages are available at <https://github.com/spring-guides/>. In addition to choosing from the list of basic Spring Boot projects, the **[Spring Initializr]** helps developers get started with creating custom Spring Boot applications.

<!-- URL List -->

[free Azure account]: https://azure.microsoft.com/pricing/free-trial/
[Azure for Java Developers]: ../index.yml
[Working with Azure DevOps and Java]: /azure/devops/
[MSDN subscriber benefits]: https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/
[Spring Boot]: http://projects.spring.io/spring-boot/
[Spring Initializr]: https://start.spring.io/
[Spring Framework]: https://spring.io/

<!-- IMG List -->

[IMG01]: media/configure-spring-cloud-stream-binder-java-app-azure-event-hub/create-event-hub-01.png
[IMG02]: media/configure-spring-cloud-stream-binder-java-app-azure-event-hub/create-event-hub-02.png
[IMG05]: media/configure-spring-cloud-stream-binder-java-app-azure-event-hub/create-event-hub-05.png
[IMG08]: media/configure-spring-cloud-stream-binder-java-app-azure-event-hub/create-event-hub-08.png
[SI01]: media/configure-spring-cloud-stream-binder-java-app-azure-event-hub/create-project-01.png
