---
title: Use Spring Kafka with Azure Event Hubs for Kafka API
description: Shows you how to configure a Java-based Spring Cloud Stream Binder to use Apache Kafka with Azure Event Hubs.
author: KarlErickson
ms.author: karler
ms.reviewer: xiada
ms.date: 04/18/2025
ms.topic: how-to
ms.custom: devx-track-java, passwordless-java, spring-cloud-azure, devx-track-extended-java
---

# Use Spring Kafka with Azure Event Hubs for Kafka API

This tutorial shows you how to configure a Java-based Spring Cloud Stream Binder to use Azure Event Hubs for Kafka for sending and receiving messages with Azure Event Hubs. For more information, see [Use Azure Event Hubs from Apache Kafka applications](/azure/event-hubs/event-hubs-for-kafka-ecosystem-overview)

In this tutorial, we'll include two authentication methods: [Microsoft Entra authentication](/azure/event-hubs/authenticate-application) and [Shared Access Signatures (SAS) authentication](/azure/event-hubs/authenticate-shared-access-signature). The **Passwordless** tab shows the Microsoft Entra authentication and the **Connection string** tab shows the SAS authentication.

Microsoft Entra authentication is a mechanism for connecting to Azure Event Hubs for Kafka using identities defined in Microsoft Entra ID. With Microsoft Entra authentication, you can manage database user identities and other Microsoft services in a central location, which simplifies permission management.

SAS authentication uses the connection string of your Azure Event Hubs namespace for the delegated access to Event Hubs for Kafka. If you choose to use Shared Access Signatures as credentials, you need to manage the connection string by yourself.

## Prerequisites

- An Azure subscription - [create one for free](https://azure.microsoft.com/free/).

- [Java Development Kit (JDK)](/java/azure/jdk/) version 8 or higher.

- [Apache Maven](http://maven.apache.org/), version 3.2 or higher.

- [cURL](https://curl.se/) or a similar HTTP utility to test functionality.

- [Azure Cloud Shell](/azure/cloud-shell/quickstart) or [Azure CLI](/cli/azure/install-azure-cli) 2.37.0 or higher.

- An Azure Event hub. If you don't have one, [create an event hub using Azure portal](/azure/event-hubs/event-hubs-create).

- A Spring Boot application. If you don't have one, create a Maven project with the [Spring Initializr](https://start.spring.io/). Be sure to select **Maven Project** and, under **Dependencies**, add the **Spring Web**, **Spring for Apache Kafka**, and **Cloud Stream** dependencies, then select Java version 8 or higher.

> [!IMPORTANT]
> Spring Boot version 2.5 or higher is required to complete the steps in this tutorial.

### Prepare credentials

#### [Passwordless (Recommended)](#tab/passwordless)

Azure Event Hubs supports using Microsoft Entra ID to authorize requests to Event Hubs resources. With Microsoft Entra ID, you can use [Azure role-based access control (Azure RBAC)](/azure/role-based-access-control/overview) to grant permissions to a [security principal](/azure/active-directory/develop/app-objects-and-service-principals#service-principal-object), which may be a user or an application service principal.

If you want to run this sample locally with Microsoft Entra authentication, be sure your user account has authenticated via Azure Toolkit for IntelliJ, Visual Studio Code Azure Account plugin, or Azure CLI. Also, be sure the account has been granted sufficient permissions.

> [!NOTE]
> When using passwordless connections, you need to grant your account access to resources. In Azure Event Hubs, assign the `Azure Event Hubs Data Receiver` and `Azure Event Hubs Data Sender` role to the Microsoft Entra account you're currently using. For more information about granting access roles, see [Assign Azure roles using the Azure portal](/azure/role-based-access-control/role-assignments-portal) and [Authorize access to Event Hubs resources using Microsoft Entra ID](/azure/event-hubs/authorize-access-azure-active-directory).

#### [Connection string](#tab/connection-string)

To get the connection string for the event hub namespace, see [Get an Event Hubs connection string](/azure/event-hubs/event-hubs-get-connection-string) or run the following command.

```azurecli
az eventhubs namespace authorization-rule keys list \
    --resource-group <your_resource_group_name> \
    --namespace-name <your_eventhubs-namespace_name> \
    --name RootManageSharedAccessKey \
    --query "primaryConnectionString" \
    --output tsv
```

---

## Send and receive messages from Azure Event Hubs

With an Azure Event hub, you can send and receive messages using Spring Cloud Azure.

To install the Spring Cloud Azure Starter module, add the following dependencies to your **pom.xml** file:

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

- The Spring Cloud Azure Starter artifact:

   ```xml
   <dependency>
     <groupId>com.azure.spring</groupId>
     <artifactId>spring-cloud-azure-starter</artifactId>
   </dependency>
   ```

## Code the application

Use the following steps to configure your application to produce and consume messages using Azure Event Hubs.

1. Configure the Event hub credentials by adding the following properties to your **application.properties** file.

   #### [Passwordless (Recommended)](#tab/passwordless)

   ```properties
   spring.cloud.stream.kafka.binder.brokers=${AZ_EVENTHUBS_NAMESPACE_NAME}.servicebus.windows.net:9093
   spring.cloud.function.definition=consume;supply
   spring.cloud.stream.bindings.consume-in-0.destination=${AZ_EVENTHUB_NAME}
   spring.cloud.stream.bindings.consume-in-0.group=$Default
   spring.cloud.stream.bindings.supply-out-0.destination=${AZ_EVENTHUB_NAME}
   ```

   > [!TIP]
   > If you're using version `spring-cloud-azure-dependencies:4.3.0`, then you should add the property `spring.cloud.stream.binders.<kafka-binder-name>.environment.spring.main.sources` with the value `com.azure.spring.cloud.autoconfigure.kafka.AzureKafkaSpringCloudStreamConfiguration`.
   >
   > Since `4.4.0`, this property will be added automatically, so there's no need to add it manually.

   The following table describes the fields in the configuration:

   | Field                                                   | Description                                                                                                                                                                                  |
   |---------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
   | `spring.cloud.stream.kafka.binder.brokers`              | Specifies the Azure Event Hubs endpoint.                                                                                                                                                     |
   | `spring.cloud.stream.bindings.consume-in-0.destination` | Specifies the input destination event hub, which for this tutorial is the hub you created earlier.                                                                                           |
   | `spring.cloud.stream.bindings.consume-in-0.group `      | Specifies a Consumer Group from Azure Event Hubs, which you can set to `$Default` in order to use the basic consumer group that was created when you created your Azure Event Hubs instance. |
   | `spring.cloud.stream.bindings.supply-out-0.destination` | Specifies the output destination event hub, which for this tutorial is the same as the input destination.                                                                                    |

   #### [Connection string](#tab/connection-string)

   ```properties
   spring.cloud.azure.eventhubs.connection-string=${AZ_EVENTHUBS_CONNECTION_STRING}
   spring.cloud.function.definition=consume;supply
   spring.cloud.stream.bindings.consume-in-0.destination=${AZ_EVENTHUB_NAME}
   spring.cloud.stream.bindings.consume-in-0.group=$Default
   spring.cloud.stream.bindings.supply-out-0.destination=${AZ_EVENTHUB_NAME}
   spring.cloud.stream.binders.kafka.environment.spring.main.sources=com.azure.spring.cloud.autoconfigure.implementation.eventhubs.kafka.AzureEventHubsKafkaAutoConfiguration
   ```

   > [!TIP]
   > We recommend that you don't use connection strings to connect to Azure Event Hubs for Kafka in version 4.3.0 or higher. This functionality is being removed in the future, so you should consider using passwordless connections instead.
   > 
   > If you're using Spring Cloud Azure version 4.x, update the `spring.cloud.stream.binders.kafka.environment.spring.main.sources` property value to `com.azure.spring.cloud.autoconfigure.eventhubs.kafka.AzureEventHubsKafkaAutoConfiguration`.

   The following table describes the fields in the configuration:

   | Field                                                   | Description                                                                                                                                                                                  |
   |---------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
   | `spring.cloud.azure.eventhubs.connection-string`        | Specifies the connection string of your Azure Event Hubs namespace.                                                                                                                          |
   | `spring.cloud.stream.bindings.consume-in-0.destination` | Specifies the input destination event hub, which for this tutorial is the hub you created earlier.                                                                                           |
   | `spring.cloud.stream.bindings.consume-in-0.group `      | Specifies a Consumer Group from Azure Event Hubs, which you can set to `$Default` in order to use the basic consumer group that was created when you created your Azure Event Hubs instance. |
   | `spring.cloud.stream.bindings.supply-out-0.destination` | Specifies the output destination event hub, which for this tutorial is the same as the input destination.                                                                                    |

    <!-- NOTE: The tab-block end-delimiter here (the "---") needs a 4-space indentation or it will be rendered as a hard rule. -->
    ---

   > [!NOTE]
   > If you enable automatic topic creation, be sure to add the configuration item `spring.cloud.stream.kafka.binder.replicationFactor`, with the value set to at least `1`. For more information, see [Spring Cloud Stream Kafka Binder Reference Guide](https://docs.spring.io/spring-cloud-stream-binder-kafka/docs/3.1.2/reference/html/spring-cloud-stream-binder-kafka.html).

1. Edit the startup class file to show the following content.

   ```java
   import org.slf4j.Logger;
   import org.slf4j.LoggerFactory;
   import org.springframework.boot.CommandLineRunner;
   import org.springframework.boot.SpringApplication;
   import org.springframework.boot.autoconfigure.SpringBootApplication;
   import org.springframework.context.annotation.Bean;
   import org.springframework.messaging.Message;
   import org.springframework.messaging.support.GenericMessage;
   import reactor.core.publisher.Flux;
   import reactor.core.publisher.Sinks;
   import java.util.function.Consumer;
   import java.util.function.Supplier;

   @SpringBootApplication
   public class EventHubKafkaBinderApplication implements CommandLineRunner {

       private static final Logger LOGGER = LoggerFactory.getLogger(EventHubKafkaBinderApplication.class);

       private static final Sinks.Many<Message<String>> many = Sinks.many().unicast().onBackpressureBuffer();

       public static void main(String[] args) {
           SpringApplication.run(EventHubKafkaBinderApplication.class, args);
       }

       @Bean
       public Supplier<Flux<Message<String>>> supply() {
           return ()->many.asFlux()
                          .doOnNext(m->LOGGER.info("Manually sending message {}", m))
                          .doOnError(t->LOGGER.error("Error encountered", t));
       }

       @Bean
       public Consumer<Message<String>> consume() {
           return message->LOGGER.info("New message received: '{}'", message.getPayload());
       }

       @Override
       public void run(String... args) {
           many.emitNext(new GenericMessage<>("Hello World"), Sinks.EmitFailureHandler.FAIL_FAST);
       }

   }
   ```

   [!INCLUDE [spring-default-azure-credential-overview.md](includes/spring-default-azure-credential-overview.md)]

1. Start the application. Messages like the following example will be posted in your application log:

   ```output
   Kafka version: 3.0.1
   Kafka commitId: 62abe01bee039651
   Kafka startTimeMs: 1622616433956
   New message received: 'Hello World'
   ```

[!INCLUDE [deploy-to-azure-spring-apps](includes/deploy-to-azure-spring-apps.md)]

## Next steps

> [!div class="nextstepaction"]
> [Azure for Spring developers](../spring/index.yml)
> [Spring Cloud Azure Stream Binder Event Hubs Kafka Samples](https://github.com/Azure-Samples/azure-spring-boot-samples/tree/main/eventhubs)
