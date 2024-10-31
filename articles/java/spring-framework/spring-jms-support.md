---
title: Use Azure Service Bus with JMS
description: This article describes how to use Spring Cloud Azure and Spring JMS together.
ms.date: 08/17/2023
author: KarlErickson
ms.author: hangwan
ms.topic: reference
ms.custom: devx-track-java, devx-track-extended-java
---

# Use Azure Service Bus with JMS

**This article applies to:** ✔️ Version 4.19.0 ✔️ Version 5.17.0

This article describes how to use Azure Service Bus with the JMS API integrated into the Spring JMS framework.

## Core features

### Passwordless connection

Passwordless connection uses Microsoft Entra authentication for connecting to Azure services without storing any credentials in the application, its configuration files, or in environment variables. Microsoft Entra authentication is a mechanism for connecting to Azure Service Bus using identities defined in Microsoft Entra ID. With Microsoft Entra authentication, you can manage Service Bus and other Microsoft services in a central location, which simplifies permission management.

## How it works

Spring Cloud Azure first builds one of the following types of credentials depending on the application authentication configuration:

- `ClientSecretCredential`
- `ClientCertificateCredential`
- `UsernamePasswordCredential`
- `ManagedIdentityCredential`

If none of these types of credentials are found, the credential chain via `DefaultTokenCredential` is used to obtain credentials from application properties, environment variables, managed identity, or IDEs. For more information, see [Spring Cloud Azure authentication](authentication.md).

## Dependency setup

Add the following dependencies if you want to migrate your Spring JMS application to use Azure Service Bus.

```xml
<dependency>
    <groupId>com.azure.spring</groupId>
    <artifactId>spring-cloud-azure-starter-servicebus-jms</artifactId>
</dependency>
```

## Configuration

The following table describes the configurable properties when using the Spring JMS support:

> [!div class="mx-tdBreakAll"]
> | Property                                                         | Description                                                                                                                                                                       |
> |------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
> | **spring.jms.servicebus**.connection-string                      | The Azure Service Bus connection string, for when you want to provide the connection string directly.                                                                             |
> | **spring.jms.servicebus**.topic-client-id                        | The JMS client ID. Only works for the `topicJmsListenerContainerFactory` bean.                                                                                                    |
> | **spring.jms.servicebus**.enabled                                | A value that indicates whether to enable Servive Bus JMS autoconfiguration. The default value is `true`.                                                                          |
> | **spring.jms.servicebus**.idle-timeout                           | The connection idle timeout duration that indicates how long the client expects Service Bus to keep a connection alive when no messages are delivered. The default value is `2m`. |
> | **spring.jms.servicebus**.passwordless-enabled                   | Whether to enable passwordless for Azure Servive Bus JMS. The default value is `false`. |
> | **spring.jms.servicebus**.pricing-tier                           | The Azure Service Bus Price Tier. Supported values are *premium* and *standard*. Premium tier uses Java Message Service (JMS) 2.0, while standard tier use JMS 1.1 to interact with Azure Service Bus. |
> | **spring.jms.servicebus**.listener.reply-pub-sub-domain          | A value that indicates whether the reply destination type is a topic. Only works for the `topicJmsListenerContainerFactory` bean.                                                 |
> | **spring.jms.servicebus**.listener.phase                         | The phase in which this container should be started and stopped.                                                                                                                  |
> | **spring.jms.servicebus**.listener.reply-qos-settings            | Configures the `QosSettings` to use when sending a reply.                                                                                                                         |
> | **spring.jms.servicebus**.listener.subscription-durable          | A value that indicates whether to make the subscription durable. Only works for the `topicJmsListenerContainerFactory` bean. The default value is `true`.                         |
> | **spring.jms.servicebus**.listener.subscription-shared           | A value that indicates whether to make the subscription shared. Only works for the `topicJmsListenerContainerFactory` bean.                                                       |
> | **spring.jms.servicebus**.pool.block-if-full                     | A value that indicates whether to block when a connection is requested and the pool is full. Set it to false to throw a `JMSException` instead.                                   |
> | **spring.jms.servicebus**.pool.block-if-full-timeout             | The blocking period before throwing an exception if the pool is still full.                                                                                                       |
> | **spring.jms.servicebus**.pool.enabled                           | A value that indicates whether a `JmsPoolConnectionFactory` should be created, instead of a regular `ConnectionFactory`.                                                          |
> | **spring.jms.servicebus**.pool.idle-timeout                      | The connection pool idle timeout.                                                                                                                                                 |
> | **spring.jms.servicebus**.pool.max-connections                   | The maximum number of pooled connections.                                                                                                                                         |
> | **spring.jms.servicebus**.pool.max-sessions-per-connection       | The maximum number of pooled sessions per connection in the pool.                                                                                                                 |
> | **spring.jms.servicebus**.pool.time-between-expiration-check     | The time to sleep between runs of the idle connection eviction thread. When negative, no idle connection eviction thread runs.                                                    |
> | **spring.jms.servicebus**.pool.use-anonymous-producers           | A value that indicates whether to use only one anonymous `MessageProducer` instance. Set it to `false` to create one `MessageProducer` every time one is required.                |
> | **spring.jms.servicebus**.prefetch-policy.all                    | The fallback value for the prefetch option in this Service Bus namespace. The default value is `0`.                                                                               |
> | **spring.jms.servicebus**.prefetch-policy.durable-topic-prefetch | The number of prefetch for durable topic. The default value is `0`.                                                                                                               |
> | **spring.jms.servicebus**.prefetch-policy.queue-browser-prefetch | The number of prefetch for queue browser. The default value is `0`.                                                                                                               |
> | **spring.jms.servicebus**.prefetch-policy.queue-prefetch         | The number of prefetch for queue. The default value is `0`.                                                                                                                       |
> | **spring.jms.servicebus**.prefetch-policy.topic-prefetch         | The number of prefetch for topic. The default value is `0`.                                                                                                                       |

> [!NOTE]
> Spring JMS general configuration is omitted for short.

For more information, see [Spring JMS Document](https://docs.spring.io/spring-framework/docs/3.2.x/spring-framework-reference/html/jms.html).

## Basic usage

### Connect to Azure Service Bus JMS using passwordless

Configure the following properties in your *application.yml* file:

```yaml
spring:
  jms:
    servicebus:
      namespace: ${AZURE_SERVICEBUS_NAMESPACE}
      pricing-tier: ${PRICING_TIER}
      passwordless-enabled: true
```

> [!IMPORTANT]
> Azure Service Bus JMS supports using Microsoft Entra ID to authorize requests to Service Bus resources. With Microsoft Entra ID, ensure that you've assigned the **Azure Service Bus Data Owner** role to the Microsoft Entra account you're currently using. For more information, see [Assign Azure roles using the Azure portal](/azure/role-based-access-control/role-assignments-portal).

### Connect to Azure Service Bus with JMS use Managed Identity

1. To use the managed identity, enable the managed identity for your service and assign the `Azure Service Bus Data Owner` role. For more information, see [Authenticate a managed identity with Microsoft Entra ID to access Azure Service Bus resources](/azure/service-bus-messaging/service-bus-managed-service-identity).

1. Configure the following properties in your *application.yml* file:

   ```yaml
   spring:
     cloud:
       azure:
         credential:
           managed-identity-enabled: true
     jms:
       servicebus:
         namespace: ${AZURE_SERVICEBUS_NAMESPACE}
         pricing-tier: ${PRICING_TIER}
         passwordless-enabled: true
   ```

   > [!IMPORTANT]
   > If you're using user-assigned managed identity, also need to add the property `spring.cloud.azure.credential.client-id` with your user-assigned managed identity client ID.

### Connect to Azure Service Bus JMS using connection string

Add the following properties and you're good to go.

```yaml
spring:
  jms:
    servicebus:
      connection-string: ${AZURE_SERVICEBUS_CONNECTION_STRING}
      pricing-tier: ${PRICING_TIER}
```

## Supported Connection Modes
Spring Cloud Azure offers three connection modes for connecting to Azure Service Bus JMS:

1. **Pooled Connection Mode**: set `spring.jms.servicebus.pool.enabled=true`. 
  This mode configures a `JmsPoolConnectionFactory`, which maintains a pool of connections with customizable settings such as: 
    - `max-connections`: Limits the total connections in the pool. 
    - `idle-timeout`: Sets the duration after which idle connections are evicted from the pool. 
  Additional pooling configuration options (prefixed with spring.jms.servicebus.pool.) are available in the [Configuration](#configuration) section. This setup leverages Azure Service Bus's load-balancing capability, distributing traffic across multiple endpoints for improved performance.

2. **Caching Connection Mode**: set `spring.jms.cache.enabled=true`. 
  This mode uses a `CachingConnectionFactory`, which efficiently reuses a single connection for all calls to `JmsTemplate`. This approach minimizes the cost of establishing connections, making it ideal for lower-traffic scenarios.

3. **Single Connection Mode**: set `spring.jms.servicebus.pool.enabled=false` and `spring.jms.cache.enabled=false`.
    This mode uses a `ServiceBusJmsConnectionFactory ` directly, with no pooling or caching, meaning each call to `JmsTemplate` creates a new connection. This can be highly resource-intensive.

For optimal performance and load distribution, we recommend **Pooled Connection Mode** by setting `spring.jms.servicebus.pool.enabled=true`. Avoid wrapping a `JmsPoolConnectionFactory` with a `CachingConnectionFactory` or `ServiceBusJmsConnectionFactory`, as this can negate pooling benefits and may result in holding inactive connections after they’re evicted from the pool.

> [!NOTE]
> Starting with Spring Cloud Azure 5.18.0, the default `ConnectionFactory` has been updated to `JmsPoolConnectionFactory` to better utilize Service Bus server load balancing. If you prefer to continue using the `CachingConnectionFactory` for caching both Session and MessageProducer, simply set `spring.jms.cache.enabled` to true.

## Samples

For more information, see the [azure-spring-boot-samples](https://github.com/Azure-Samples/azure-spring-boot-samples/tree/main) repository on GitHub.
