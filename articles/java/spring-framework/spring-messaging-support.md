---
title: Spring Cloud Azure support for Spring Messaging
description: Spring Cloud Azure support for Spring Messaging provides integration with Azure services such as Event Hubs, Service Bus, and Storage Queue.
ms.date: 04/07/2023
author: KarlErickson
ms.author: karler
ms.reviewer: seal
ms.topic: reference
ms.custom: devx-track-java, devx-track-extended-java
---

# Spring Cloud Azure support for Spring Messaging

**This article applies to:** ✅ Version 4.19.0 ✅ Version 5.20.1

This article describes how you can use Spring Cloud Azure and Spring Messaging together. The Spring Framework provides extensive support for integrating with messaging systems. Spring Messaging for Azure supports the following services:

* Azure Event Hubs, through `spring-messaging-azure-eventhubs` - for more information, see the [Spring Messaging Azure Event Hubs](#spring-messaging-azure-event-hubs) section.
* Azure Service Bus, through `spring-messaging-azure-servicebus` - for more information, see the [Spring Messaging Azure Service Bus](#spring-messaging-azure-service-bus) section.
* Azure Storage Queue, through `spring-messaging-azure-storage-queue` - for more information, see the [Spring Messaging Azure Storage Queue](#spring-messaging-azure-storage-queue) section.

## Spring Messaging Azure Event Hubs

### Key concepts

Azure Event Hubs is a native data-streaming service in the cloud that can stream millions of events per second, with low latency, from any source to any destination. The Spring Messaging for Azure Event Hubs project applies core Spring concepts to the development of event hubs-based messaging solutions. It provides a *template* as a high-level abstraction for sending messages. It also provides support for message-driven plain old Java objects (      ) with `@EventHubsListener` annotations and a *listener container*. These libraries promote the use of dependency injection and declarative configuration. In all of these cases, you can see similarities to the JMS support in the Spring Framework and RabbitMQ support in Spring AMQP.

### Dependency setup

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

### Configuration

The library provides the following configuration options for `EventHubsTemplate` and `@EventHubsListener`:

> [!div class="mx-tdBreakAll"]
> | Property                                                                   | Type    | Description                                                                                                        |
> |----------------------------------------------------------------------------|---------|--------------------------------------------------------------------------------------------------------------------|
> | **spring.cloud.azure.eventhubs**.enabled                                   | boolean | Whether an Azure Event Hubs is enabled.                                                                            |
> | **spring.cloud.azure.eventhubs**.connection-string                         | String  | Event Hubs Namespace connection string value.                                                                      |
> | **spring.cloud.azure.eventhubs**.namespace                                 | String  | Event Hubs Namespace value, which is the prefix of the FQDN. A FQDN should be composed of NamespaceName.DomainName |
> | **spring.cloud.azure.eventhubs.processor.checkpoint-store**.account-name   | String  | Name for the storage account.                                                                                      |
> | **spring.cloud.azure.eventhubs.processor.checkpoint-store**.account-key    | String  | Storage account access key.                                                                                        |
> | **spring.cloud.azure.eventhubs.processor.checkpoint-store**.container-name | String  | Storage container name.                                                                                            |

### Basic usage

#### Send messages to Azure Event Hubs

Use the following steps to send messages:

1. Fill in the credential configuration options using one of the following approaches:

   * For credentials as `DefaultAzureCredential`, configure the following properties in your **application.yml** file:

     ```yaml
     spring:
       cloud:
         azure:
           eventhubs:
             namespace: ${AZURE_EVENT_HUBS_NAMESPACE}
             processor:
               checkpoint-store:
                 container-name: ${CHECKPOINT-CONTAINER}
                 account-name: ${CHECKPOINT-STORAGE-ACCOUNT}
     ```

   * For credentials as connection string, configure the following properties in your **application.yml** file:

     ```yaml
     spring:
       cloud:
         azure:
           eventhubs:
             connection-string: ${AZURE_EVENT_HUBS_CONNECTION_STRING}
             processor:
               checkpoint-store:
                 container-name: ${CHECKPOINT-CONTAINER}
                 account-name: ${CHECKPOINT-STORAGE-ACCOUNT}
                 account-key: ${CHECKPOINT-ACCESS-KEY}
     ```

   * For credentials as managed identities, configure the following properties in your **application.yml** file:

     ```yaml
     spring:
       cloud:
         azure:
           credential:
             managed-identity-enabled: true
             client-id: ${AZURE_CLIENT_ID}
           eventhubs:
             namespace: ${AZURE_EVENT_HUBS_NAMESPACE}
             processor:
               checkpoint-store:
                 container-name: ${CONTAINER_NAME}
                 account-name: ${ACCOUNT_NAME}
     ```

   * For credentials as service principal, configure the following properties in your **application.yml** file:

     ```yaml
     spring:
       cloud:
         azure:
           credential:
             client-id: ${AZURE_CLIENT_ID}
             client-secret: ${AZURE_CLIENT_SECRET}
           profile:
             tenant-id: <tenant>
           eventhubs:
             namespace: ${AZURE_EVENT_HUBS_NAMESPACE}
             processor:
               checkpoint-store:
                 container-name: ${CONTAINER_NAME}
                 account-name: ${ACCOUNT_NAME}
     ```

> [!NOTE]
> The following values are allowed for `tenant-id`: `common`, `organizations`, `consumers`, or the tenant ID. For more information about these values, see the [Used the wrong endpoint (personal and organization accounts)](/troubleshoot/azure/active-directory/error-code-aadsts50020-user-account-identity-provider-does-not-exist#cause-3-used-the-wrong-endpoint-personal-and-organization-accounts) section of [Error AADSTS50020 - User account from identity provider does not exist in tenant](/troubleshoot/azure/active-directory/error-code-aadsts50020-user-account-identity-provider-does-not-exist). For information on converting your single-tenant app, see [Convert single-tenant app to multitenant on Microsoft Entra ID](/entra/identity-platform/howto-convert-app-to-be-multi-tenant).

1. `EventHubsTemplate` is autoconfigured, and you can autowire it directly into your own beans, as shown in the following example:

   ```java
   @Component
   public class MyBean {
   
       private final EventHubsTemplate eventHubsTemplate;
       
       public MyBean(EventHubsTemplate eventHubsTemplate) {
           this.eventHubsTemplate = eventHubsTemplate;
       }
   
       public void someMethod() {
           this.eventHubsTemplate.sendAsync('EVENT_HUB_NAME', MessageBuilder.withPayload("Hello world").build()).subscribe();
       }
   
   }
   ```

#### Receive messages from Azure Event Hubs

Use the following steps to receive messages:

1. Fill in the credential configuration options.

1. Add the `@EnableAzureMessaging` annotation, as shown in the following example. This annotation triggers the discovery of methods annotated with `@EventHubsListener`, creating the message listener container under the covers.

   ```java
   @SpringBootApplication
   @EnableAzureMessaging
   public class DemoApplication {
       public static void main(String[] args) {
           SpringApplication.run(DemoApplication.class, args);
       }
   }
   ```

1. When the Event Hubs infrastructure is present, you can annotate any bean with `@EventHubsListener` to create a listener endpoint. The following component creates a listener endpoint on the `EVENT_HUB_NAME` event hub and the `$Default` consumer group:

   ```java
   @Component
   public class MyBean {

       @EventHubsListener(destination = "EVENT_HUB_NAME", group = "$Default")
       public void processMessage(String content) {
           // ...
       }

   }
   ```

### Samples

For more information, see the [azure-spring-boot-samples](https://github.com/Azure-Samples/azure-spring-boot-samples/tree/main/eventhubs/spring-messaging-azure-eventhubs/eventhubs-spring-messaging) repository on GitHub.

## Spring Messaging Azure Service Bus

### Key concepts

Azure Service Bus is a fully managed enterprise message broker with message queues and publish-subscribe topics. The Spring Messaging for Azure Service Bus project applies core Spring concepts to the development of service bus-based messaging solutions. It provides a *template* as a high-level abstraction for sending messages. It also provides support for message-driven POJOs with `@ServiceBusListener` annotations and a *listener container*. These libraries promote the use of dependency injection and declarative configuration. In all of these cases, you can see similarities to the JMS support in the Spring Framework and RabbitMQ support in Spring AMQP.

### Dependency setup

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

### Configuration

The library provides the following configuration options for `ServiceBusTemplate` and `@ServiceBusListener`:

> [!div class="mx-tdBreakAll"]
> | Property                                            | Type    | Description                                                                                                         |
> |-----------------------------------------------------|---------|---------------------------------------------------------------------------------------------------------------------|
> | **spring.cloud.azure.servicebus**.enabled           | boolean | Whether an Azure Service Bus is enabled.                                                                            |
> | **spring.cloud.azure.servicebus**.connection-string | String  | Service Bus Namespace connection string value.                                                                      |
> | **spring.cloud.azure.servicebus**.custom-endpoint-address | String  | The custom endpoint address to use when connecting to Service Bus.                                                                      |
> | **spring.cloud.azure.servicebus**.namespace         | String  | Service Bus Namespace value, which is the prefix of the FQDN. A FQDN should be composed of NamespaceName.DomainName |
> | **spring.cloud.azure.servicebus**.entity-type       | String  | Entity type of an Azure Service Bus.                                                                                |

### Basic usage

#### Send messages to Azure Service Bus

Use the following steps to send messages:

1. Fill in the credential configuration options using one of the following approaches:

   * For credentials as `DefaultAzureCredential`, configure the following properties in your **application.yml** file:

     ```yaml
     spring:
       cloud:
         azure:
           servicebus:
             namespace: ${AZURE_SERVICE_BUS_NAMESPACE}
             entity-type: ${AZURE_SERVICE_BUS_ENTITY_TYPE}
     ```

   * For credentials as connection string, configure the following properties in your **application.yml** file:

     ```yaml
     spring:
       cloud:
         azure:
           servicebus:
             connection-string: ${AZURE_SERVICE_BUS_CONNECTION_STRING}
             entity-type: ${AZURE_SERVICE_BUS_ENTITY_TYPE}
     ```

   * For credentials as managed identities, configure the following properties in your **application.yml** file:

     ```yaml
     spring:
       cloud:
         azure:
           credential:
             managed-identity-enabled: true
             client-id: ${AZURE_CLIENT_ID}
           profile:
             tenant-id: <tenant>
           servicebus:
             namespace: ${AZURE_SERVICE_BUS_NAMESPACE}
             entity-type: ${AZURE_SERVICE_BUS_ENTITY_TYPE}
     ```

> [!NOTE]
> The following values are allowed for `tenant-id`: `common`, `organizations`, `consumers`, or the tenant ID. For more information about these values, see the [Used the wrong endpoint (personal and organization accounts)](/troubleshoot/azure/active-directory/error-code-aadsts50020-user-account-identity-provider-does-not-exist#cause-3-used-the-wrong-endpoint-personal-and-organization-accounts) section of [Error AADSTS50020 - User account from identity provider does not exist in tenant](/troubleshoot/azure/active-directory/error-code-aadsts50020-user-account-identity-provider-does-not-exist). For information on converting your single-tenant app, see [Convert single-tenant app to multitenant on Microsoft Entra ID](/entra/identity-platform/howto-convert-app-to-be-multi-tenant).

   * For credentials as service principal, configure the following properties in your **application.yml** file:

     ```yaml
     spring:
       cloud:
         azure:
           credential:
             client-id: ${AZURE_CLIENT_ID}
             client-secret: ${AZURE_CLIENT_SECRET}
           profile:
             tenant-id: <tenant>
           servicebus:
             namespace: ${AZURE_SERVICE_BUS_NAMESPACE}
             entity-type: ${AZURE_SERVICE_BUS_ENTITY_TYPE}
     ```

> [!NOTE]
> The following values are allowed for `tenant-id`: `common`, `organizations`, `consumers`, or the tenant ID. For more information about these values, see the [Used the wrong endpoint (personal and organization accounts)](/troubleshoot/azure/active-directory/error-code-aadsts50020-user-account-identity-provider-does-not-exist#cause-3-used-the-wrong-endpoint-personal-and-organization-accounts) section of [Error AADSTS50020 - User account from identity provider does not exist in tenant](/troubleshoot/azure/active-directory/error-code-aadsts50020-user-account-identity-provider-does-not-exist). For information on converting your single-tenant app, see [Convert single-tenant app to multitenant on Microsoft Entra ID](/entra/identity-platform/howto-convert-app-to-be-multi-tenant).

1. `ServiceBusTemplate` is autoconfigured, and you can autowire it directly into your own beans, as shown in the following example:

   ```java
   @Component
   public class MyBean {
   
       private final ServiceBusTemplate serviceBusTemplate;
       
       public MyBean(ServiceBusTemplate serviceBusTemplate) {
           this.serviceBusTemplate = serviceBusTemplate;
       }
   
       public void someMethod() {
           this.serviceBusTemplate.sendAsync('QUEUE_NAME', MessageBuilder.withPayload("Hello world").build()).subscribe();
       }
   
   }
   ```

#### Receive messages from Azure Service Bus

Use the following steps to receive messages:

1. Fill in the credential configuration options.

1. Add the `@EnableAzureMessaging` annotation, which triggers the discovery of methods annotated with `@ServiceBusListener`, creating the message listener container under the covers.

   ```java
   @SpringBootApplication
   @EnableAzureMessaging
   public class DemoApplication {
       public static void main(String[] args) {
           SpringApplication.run(DemoApplication.class, args);
       }
   }
   ```

1. When the ServiceBus infrastructure is present, you can annotate any bean with `@ServiceBusListener` to create a listener endpoint. The following component creates a listener endpoint on the `QUEUE_NAME` queue:

   ```java
   @Component
   public class MyBean {

       @ServiceBusListener(destination = "QUEUE_NAME")
       public void processMessage(String content) {
           // ...
       }

   }
   ```

#### Customize Service Bus client properties

Developers can use `AzureServiceClientBuilderCustomizer` to customize Service Bus Client properties. The following example customizes the `sessionIdleTimeout` property in `ServiceBusClientBuilder`:

```java
@Bean
public AzureServiceClientBuilderCustomizer<ServiceBusClientBuilder.ServiceBusSessionProcessorClientBuilder> customizeBuilder() {
    return builder -> builder.sessionIdleTimeout(Duration.ofSeconds(10));
}
```

### Samples

For more information, see the [azure-spring-boot-samples](https://github.com/Azure-Samples/azure-spring-boot-samples/tree/main/servicebus/spring-messaging-azure-servicebus/servicebus-spring-messaging) repository on GitHub.

## Spring Messaging Azure Storage Queue

### Key concepts

Azure Queue Storage is a service for storing large numbers of messages. You access messages from anywhere in the world via authenticated calls using HTTP or HTTPS. A queue message can be up to 64 KB in size. A queue can contain millions of messages, up to the total capacity limit of a storage account. Queues are commonly used to create a backlog of work to process asynchronously. The Spring Messaging for Azure Queue Storage project applies core Spring concepts to the development of service bus-based messaging solutions. It provides a *template* as a high-level abstraction for sending and receiving messages. These libraries promote the use of dependency injection and declarative configuration.

### Dependency setup

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

### Configuration

The library provides the following configuration options for `StorageQueueTemplate`:

> [!div class="mx-tdBreakAll"]
> | Property                                               | Type                | Description                                      |
> |--------------------------------------------------------|---------------------|--------------------------------------------------|
> | **spring.cloud.azure.storage.queue**.enabled           | boolean             | Whether an Azure Storage Queue is enabled.       |
> | **spring.cloud.azure.storage.queue**.connection-string | String              | Storage Queue Namespace connection string value. |
> | **spring.cloud.azure.storage.queue**.accountName       | String              | Storage Queue account name.                      |
> | **spring.cloud.azure.storage.queue**.accountKey        | String              | Storage Queue account key.                       |

### Basic usage

#### Send and receive messages to Azure Storage Queue

Use the following steps to send and receive messages:

1. Fill in the credential configuration options using one of the following approaches:

   * For credentials as `DefaultAzureCredential`, configure the following properties in your **application.yml** file:

     ```yaml
     spring:
       cloud:
         azure:
           storage:
             queue:
               account-name: ${AZURE_STORAGE_QUEUE_ACCOUNT_NAME}
     ```

   * For credentials as connection string, configure the following properties in your **application.yml** file:

     ```yaml
     spring:
       cloud:
         azure:
           storage:
             queue:
               connection-string: ${AZURE_STORAGE_QUEUE_CONNECTION_STRING}
     ```

   * For credentials as managed identities, configure the following properties in your **application.yml** file:

     ```yaml
     spring:
       cloud:
         azure:
           credential:
             managed-identity-enabled: true
             client-id: ${AZURE_CLIENT_ID}
           profile:
             tenant-id: <tenant>
           storage:
             queue:
               account-name: ${AZURE_STORAGE_QUEUE_ACCOUNT_NAME}
     ```

> [!NOTE]
> The following values are allowed for `tenant-id`: `common`, `organizations`, `consumers`, or the tenant ID. For more information about these values, see the [Used the wrong endpoint (personal and organization accounts)](/troubleshoot/azure/active-directory/error-code-aadsts50020-user-account-identity-provider-does-not-exist#cause-3-used-the-wrong-endpoint-personal-and-organization-accounts) section of [Error AADSTS50020 - User account from identity provider does not exist in tenant](/troubleshoot/azure/active-directory/error-code-aadsts50020-user-account-identity-provider-does-not-exist). For information on converting your single-tenant app, see [Convert single-tenant app to multitenant on Microsoft Entra ID](/entra/identity-platform/howto-convert-app-to-be-multi-tenant).

   * For credentials as service principal, configure the following properties in your **application.yml** file:

     ```yaml
     spring:
       cloud:
         azure:
           credential:
             client-id: ${AZURE_CLIENT_ID}
             client-secret: ${AZURE_CLIENT_SECRET}
           profile:
             tenant-id: <tenant>
           storage:
             queue:
               account-name: ${AZURE_STORAGE_QUEUE_ACCOUNT_NAME}
     ```

> [!NOTE]
> The following values are allowed for `tenant-id`: `common`, `organizations`, `consumers`, or the tenant ID. For more information about these values, see the [Used the wrong endpoint (personal and organization accounts)](/troubleshoot/azure/active-directory/error-code-aadsts50020-user-account-identity-provider-does-not-exist#cause-3-used-the-wrong-endpoint-personal-and-organization-accounts) section of [Error AADSTS50020 - User account from identity provider does not exist in tenant](/troubleshoot/azure/active-directory/error-code-aadsts50020-user-account-identity-provider-does-not-exist). For information on converting your single-tenant app, see [Convert single-tenant app to multitenant on Microsoft Entra ID](/entra/identity-platform/howto-convert-app-to-be-multi-tenant).

1. `StorageQueueTemplate` is autoconfigured. You can autowire it directly into your own beans to send or receive messages, as shown in the following example:

   ```java
   @Component
   public class MyBean {

       private final StorageQueueTemplate storageQueueTemplate;

       public MyBean(StorageQueueTemplate storageQueueTemplate) {
           this.storageQueueTemplate = storageQueueTemplate;
       }

       public void someMethod() {
           this.serviceBusTemplate.sendAsync('STORAGE_QUEUE_NAME', MessageBuilder.withPayload("Hello world").build()).subscribe();
       }

       public void processMessage() {
           Message<?> message = storageQueueTemplate.receiveAsync('STORAGE_QUEUE_NAME', Duration.ofSeconds(30)).block();
           // ...
       }

   }
   ```

### Samples

For more information, see the [azure-spring-boot-samples](https://github.com/Azure-Samples/azure-spring-boot-samples/tree/main/storage/spring-messaging-azure-storage-queue/storage-queue-spring-messaging) repository on GitHub.
