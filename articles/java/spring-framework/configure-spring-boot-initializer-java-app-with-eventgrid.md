---
title: Use Azure EventGrid in Spring
description: Configure a Spring Boot application created with the Spring Initializr to use the Azure EventGrid.
services: event-grid
documentationcenter: java
ms.date: 09/01/2023
ms.service: event-grid
ms.topic: article
ms.custom: devx-track-java, spring-cloud-azure, devx-track-extended-java
---

# Use Azure EventGrid in Spring

[Azure EventGrid Service](/azure/event-grid/) is a highly scalable, fully managed Pub Sub message distribution service that offers flexible message consumption patterns using the MQTT and HTTP protocols.

This tutorial demonstrates how to use Azure EventGrid to send EventGridEvent to a topic and use Service Bus Queue as [Event Handler](/azure/event-grid/event-handlers) to receive in a Spring Boot application.

## Prerequisites

- An Azure subscription - [create one for free](https://azure.microsoft.com/free/).

- [Java Development Kit (JDK)](/java/azure/jdk/) version 8 or higher.

- [Apache Maven](http://maven.apache.org/), version 3.0 or higher.

- An Event Grid Topic instance. If you don't have one, see [Create a custom topic or a domain in Azure Event Grid](/azure/event-grid/create-custom-topic).

- A Service Bus Queue instance. If you don't have one, see [Create a queue in the Azure portal](/azure/service-bus-messaging/service-bus-quickstart-portal).

- A Spring Boot application. If you don't have one, create a Maven project with the [Spring Initializr](https://start.spring.io/). Be sure to select **Maven Project** and select Java version 8 or higher.

## Send EventGridEvent by Azure EventGrid and receive by Azure Service Bus Queue

With an Azure Event Grid resource, you can send an event using Spring Cloud Azure Event Grid. With an Azure Service Bus Queue resource as an event handler, you can receive the event using Spring Cloud Azure Stream Binder for Service Bus.

To install the Spring Cloud Azure EventGrid Starter module and the Spring Cloud Azure Stream Binder Service Bus module, add the following dependencies to your *pom.xml* file:

- The Spring Cloud Azure Bill of Materials (BOM):

  ```xml
  <dependencyManagement>
    <dependencies>
      <dependency>
        <groupId>com.azure.spring</groupId>
        <artifactId>spring-cloud-azure-dependencies</artifactId>
        <version>4.11.0</version>
        <type>pom</type>
        <scope>import</scope>
      </dependency>
    </dependencies>
  </dependencyManagement>
  ```

  > [!NOTE]
  > If you're using Spring Boot 3.x, be sure to set the `spring-cloud-azure-dependencies` version to `5.5.0`.
  > For more information about the `spring-cloud-azure-dependencies` version, see [Which Version of Spring Cloud Azure Should I Use](https://github.com/Azure/azure-sdk-for-java/wiki/Spring-Versions-Mapping#which-version-of-spring-cloud-azure-should-i-use).

- The Spring Cloud Azure EventGrid Starter artifact:

  ```xml
  <dependency>
    <groupId>com.azure.spring</groupId>
    <artifactId>spring-cloud-azure-starter-eventgrid</artifactId>
  </dependency>
  ```

- The Spring Cloud Azure Stream Binder Service Bus artifact:

  ```xml
  <dependency>
    <groupId>com.azure.spring</groupId>
    <artifactId>spring-cloud-azure-stream-binder-servicebus</artifactId>
  </dependency>
  ```

## Code the application

Use the following steps to configure your application to send EventGridEvent by using EventGrid and receive by using Service Bus Queue.

1. Configure Azure Event Grid and Service Bus credentials in the *application.properties* configuration file, as shown in the following example.

   ```properties
   spring:
     cloud:
       azure:
         eventgrid:
           endpoint: ${AZURE_EVENTGRID_ENDPOINT}
           key: ${AZURE_EVENTGRID_KEY}
         servicebus:
           connection-string: ${AZURE_SERVICEBUS_CONNECTION_STRING}
       function:
         definition: consume
       stream:
         bindings:
           consume-in-0:
             destination: ${AZURE_SERVICEBUS_QUEUE_NAME}
         servicebus:
           bindings:
             consume-in-0:
               consumer:
                 auto-complete: false
   ```

1. Edit the startup class file to show the following content. This code generate completions.

   ```java
   import com.azure.core.util.BinaryData;
   import com.azure.messaging.eventgrid.EventGridEvent;
   import com.azure.messaging.eventgrid.EventGridPublisherClient;
   import org.slf4j.Logger;
   import org.slf4j.LoggerFactory;
   import org.springframework.beans.factory.annotation.Autowired;
   import org.springframework.boot.CommandLineRunner;
   import org.springframework.boot.SpringApplication;
   import org.springframework.boot.autoconfigure.SpringBootApplication;
   import org.springframework.context.annotation.Bean;
   import org.springframework.messaging.Message;

   import java.util.List;
   import java.util.function.Consumer;

   @SpringBootApplication
   public class EventGridSampleApplication implements CommandLineRunner {

       private static final Logger LOGGER = LoggerFactory.getLogger(EventGridSampleApplication.class);

       @Autowired
       EventGridPublisherClient<EventGridEvent> client;

       public static void main(String[] args) {
           SpringApplication.run(EventGridSampleApplication.class, args);
       }

       @Bean
       public Consumer<Message<String>> consume() {
           return message -> {
               List<EventGridEvent> eventData = EventGridEvent.fromString(message.getPayload());
               eventData.forEach(event -> {
                   LOGGER.info("New event received: '{}'", event.getData());
               });
           };
       }

       @Override
       public void run(String... args) throws Exception {
           String str = "FirstName: John, LastName: James";
           EventGridEvent event = new EventGridEvent("A user is created", "User.Created.Text", BinaryData.fromObject(str), "0.1");

           client.sendEvent(event);
           LOGGER.info("New event published: '{}'", event.getData());
       }
   }

   ```

1. Start the application. After launch, the application produces logs similar to the following example:

   ```output
   New event published: '"FirstName: John, LastName: James"'
   ...
   New event received: '"FirstName: John, LastName: James"'
   ```

[!INCLUDE [deploy-to-azure-spring-apps](includes/deploy-to-azure-spring-apps.md)]

## Next steps

To learn more about Spring and Azure, continue to the Spring on Azure documentation center.

> [!div class="nextstepaction"]
> [Azure for Spring developers](../spring/index.yml)
> [Spring Cloud Azure EventGrid samples](https://github.com/Azure-Samples/azure-spring-boot-samples/tree/main/eventgrid)