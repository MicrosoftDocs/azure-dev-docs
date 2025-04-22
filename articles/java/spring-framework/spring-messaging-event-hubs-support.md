---
title: Spring Cloud Azure support for Spring Messaging Azure Event Hubs
description: Spring Cloud Azure support for Spring Messaging Azure Event Hubs provides integration with Azure Event Hubs.
ms.date: 04/07/2023
author: KarlErickson
ms.author: karler
ms.reviewer: seal
ms.topic: reference
ms.custom: devx-track-java, devx-track-extended-java
appliesto:
- ✅ Version 4.20.0
- ✅ Version 5.22.0
---

# Spring Cloud Azure support for Spring Messaging Azure Event Hubs

This article describes how you can use Spring Cloud Azure and Spring Messaging Azure Event Hubs. The Spring Framework provides extensive support for integrating with messaging systems.

## Spring Messaging Azure Event Hubs

### Key concepts

Azure Event Hubs is a native data-streaming service in the cloud that can stream millions of events per second, with low latency, from any source to any destination. The Spring Messaging for Azure Event Hubs project applies core Spring concepts to the development of event hubs-based messaging solutions. It provides a *template* as a high-level abstraction for sending messages. It also provides support for message-driven plain old Java objects (POJOs) with `@EventHubsListener` annotations and a *listener container*. These libraries promote the use of dependency injection and declarative configuration. In all of these cases, you can see similarities to the JMS support in the Spring Framework and RabbitMQ support in Spring AMQP.

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
> | **spring.cloud.azure**.message-converter.isolated-object-mapper            | boolean | Whether an isolated ObjectMapper bean is used for Event Hubs message converter. Enabled by default.                |
> | **spring.cloud.azure.eventhubs**.enabled                                   | boolean | Whether an Azure Event Hubs is enabled.                                                                            |
> | **spring.cloud.azure.eventhubs**.connection-string                         | String  | Event Hubs Namespace connection string value.                                                                      |
> | **spring.cloud.azure.eventhubs**.namespace                                 | String  | Event Hubs Namespace value, which is the prefix of the FQDN. A FQDN should be composed of NamespaceName.DomainName |
> | **spring.cloud.azure.eventhubs.processor.checkpoint-store**.account-name   | String  | Name for the storage account.                                                                                      |
> | **spring.cloud.azure.eventhubs.processor.checkpoint-store**.account-key    | String  | Storage account access key.                                                                                        |
> | **spring.cloud.azure.eventhubs.processor.checkpoint-store**.container-name | String  | Storage container name.                                                                                            |

### Basic usage

#### Custom Event Hubs message converter

There are two ways to configure Event Hubs message converter:

- Configure the following property to have the default Event Hubs message converter use a `ObjectMapper` bean, which can be your custom `ObjectMapper` bean or one managed by Spring Boot:

  ```yaml
  spring:
    cloud:
      azure:
        message-converter:
          isolated-object-mapper: false
  ```

- Define the Event Hubs message converter bean directly:

  ```java
  @Bean
  AzureMessageConverter<EventData, EventData> eventHubsMessageConverter() {
      JsonMapper jsonMapper = JsonMapper.builder().addModule(new JavaTimeModule()).build();
      return new EventHubsMessageConverter(jsonMapper);
  }
  ```

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

   > [!NOTE]
   > To avoid repetition, since version `5.21.0`, Spring Cloud Azure Auto-configure enabled annotation `@EnableAzureMessaging` automatically.

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
