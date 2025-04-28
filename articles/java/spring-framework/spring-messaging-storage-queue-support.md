---
title: Spring Cloud Azure support for Spring Messaging Azure Storage Queue
description: Spring Cloud Azure support for Spring Messaging Azure Storage Queue provides integration with Azure Storage Queue.
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

# Spring Cloud Azure support for Spring Messaging Azure Storage Queue

This article describes how you can use Spring Cloud Azure and Spring Messaging Azure Storage Queue. The Spring Framework provides extensive support for integrating with messaging systems.

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
> | Property                                                         | Type      | Description                                                                                             |
> |------------------------------------------------------------------|-----------|---------------------------------------------------------------------------------------------------------|
> | **spring.cloud.azure**.message-converter.isolated-object-mapper  | boolean   | Whether an isolated ObjectMapper bean is used for Storage Queue message converter. Enabled by default.  |
> | **spring.cloud.azure.storage.queue**.enabled                     | boolean   | Whether an Azure Storage Queue is enabled.                                                              |
> | **spring.cloud.azure.storage.queue**.connection-string           | String    | Storage Queue Namespace connection string value.                                                        |
> | **spring.cloud.azure.storage.queue**.accountName                 | String    | Storage Queue account name.                                                                             |
> | **spring.cloud.azure.storage.queue**.accountKey                  | String    | Storage Queue account key.                                                                              |

### Basic usage

#### Custom Storage Queue message converter

There are two ways to configure Storage Queue message converter:

- Configure the following property to have the default Storage Queue message converter use a `ObjectMapper` bean, which can be your custom `ObjectMapper` bean or one managed by Spring Boot:

  ```yaml
  spring:
    cloud:
      azure:
        message-converter:
          isolated-object-mapper: false
  ```

- Define the Storage Queue message converter bean directly:

  ```java
  @Bean
  AzureMessageConverter<QueueMessageItem, QueueMessageItem> storageQueueMessageConverter() {
      JsonMapper jsonMapper = JsonMapper.builder().addModule(new JavaTimeModule()).build();
      return new ServiceBusMessageConverter(jsonMapper);
  }
  ```

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
