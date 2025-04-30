---
title: Spring Cloud Azure support for Spring Messaging Azure Service Bus
description: Spring Cloud Azure support for Spring Messaging Azure Service Bus provides integration with Azure Service Bus.
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

# Spring Cloud Azure support for Spring Messaging Azure Service Bus

This article describes how you can use Spring Cloud Azure and Spring Messaging Azure Service Bus. The Spring Framework provides extensive support for integrating with messaging systems.

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
> | Property                                                         | Type    | Description                                                                                                         |
> |------------------------------------------------------------------|---------|---------------------------------------------------------------------------------------------------------------------|
> | **spring.cloud.azure**.message-converter.isolated-object-mapper  | boolean | Whether an isolated ObjectMapper bean is used for Service Bus message converter. Enabled by default.                |
> | **spring.cloud.azure.servicebus**.enabled                        | boolean | Whether an Azure Service Bus is enabled.                                                                            |
> | **spring.cloud.azure.servicebus**.connection-string              | String  | Service Bus Namespace connection string value.                                                                      |
> | **spring.cloud.azure.servicebus**.custom-endpoint-address        | String  | The custom endpoint address to use when connecting to Service Bus.                                                  |
> | **spring.cloud.azure.servicebus**.namespace                      | String  | Service Bus Namespace value, which is the prefix of the FQDN. A FQDN should be composed of NamespaceName.DomainName |
> | **spring.cloud.azure.servicebus**.entity-type                    | String  | Entity type of an Azure Service Bus.                                                                                |

### Basic usage

#### Custom Service Bus message converter

There are two ways to configure Service Bus message converter:

- Configure the following property to have the default Service Bus message converter use a `ObjectMapper` bean, which can be your custom `ObjectMapper` bean or one managed by Spring Boot:

  ```yaml
  spring:
    cloud:
      azure:
        message-converter:
          isolated-object-mapper: false
  ```

- Define the Service Bus message converter bean directly:

  ```java
  @Bean
  AzureMessageConverter<ServiceBusReceivedMessage, ServiceBusMessage> serviceBusMessageConverter() {
      JsonMapper jsonMapper = JsonMapper.builder().addModule(new JavaTimeModule()).build();
      return new ServiceBusMessageConverter(jsonMapper);
  }
  ```

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

   > [!NOTE]
   > To avoid repetition, since version `5.21.0`, Spring Cloud Azure Auto-configure enabled annotation `@EnableAzureMessaging` automatically.
   
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
