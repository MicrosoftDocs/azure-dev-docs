---
ms.date: 06/30/2022
author: KarlErickson
ms.author: v-yonghuiye
---

## Spring JMS support

To use Azure Service Bus by the JMS API integrated into the Spring JMS framework.
Azure Service Bus connection string have to be provided which is to be parsed into the login username, password and remote URI for the AMQP broker.

### Dependency setup

Adding the following dependencies if you want to migrate your Spring JMS application to use Azure Service Bus.

``` xml
<dependency>
    <groupId>com.azure.spring</groupId>
    <artifactId>spring-cloud-azure-starter-servicebus-jms</artifactId>
</dependency>
```

### Configuration

Configurable properties when using Spring JMS support:

> [!div class="mx-tdBreakAll"]
> | Property                                                         | Description                                                                                                                |
> |------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------|
> | **spring.jms.servicebus**.connection-string                      | Azure Service Bus connection string. Should be provided when want to provide the connection string directly.               |
> | **spring.jms.servicebus**.topic-client-id                        | JMS client ID. Only works for the bean of topicJmsListenerContainerFactory.                                                 |
> | **spring.jms.servicebus**.idle-timeout                           | The duration for idle.                                                                                                     |
> | **spring.jms.servicebus**.pricing-tier                           | The Azure Service Bus Price Tier.                                                                                          |
> | **spring.jms.servicebus**.listener.reply-pub-sub-domain          | Whether the reply destination type is topic.                                                                               |
> | **spring.jms.servicebus**.listener.phase                         | Specify the phase in which this container should be started and stopped.                                                   |
> | **spring.jms.servicebus**.listener.reply-qos-settings            | Configure the QosSettings to use when sending a reply.                                                                     |
> | **spring.jms.servicebus**.listener.subscription-durable          | Whether to make the subscription durable. Only works for the bean of topicJmsListenerContainerFactory.                     |
> | **spring.jms.servicebus**.listener.subscription-shared           | Whether to make the subscription shared. Only works for the bean of topicJmsListenerContainerFactory.                      |
> | **spring.jms.servicebus**.password                               | Login password of the AMQP broker                                                                                          |
> | **spring.jms.servicebus**.pool.block-if-full                     | Whether to block when a connection is requested and the pool is full. |
> | **spring.jms.servicebus**.pool.block-if-full-timeout             | Blocking period before throwing an exception if the pool is still full.                                                    |
> | **spring.jms.servicebus**.pool.enabled                           | Whether a JmsPoolConnectionFactory should be created, instead of a regularConnectionFactory.                               |
> | **spring.jms.servicebus**.pool.idle-timeout                      | Connection idle timeout.                                                                                                   |
> | **spring.jms.servicebus**.pool.max-connections                   | Maximum number of pooled connections.                                                                                      |
> | **spring.jms.servicebus**.pool.max-sessions-per-connection       | Maximum number of pooled sessions per connection in the pool.                                                              |
> | **spring.jms.servicebus**.pool.time-between-expiration-check     | Time to sleep between runs of the idle connection eviction thread.                                                         |
> | **spring.jms.servicebus**.pool.use-anonymous-producers           | Whether to use only one anonymous "MessageProducer" instance.                                                              |
> | **spring.jms.servicebus**.prefetch-policy.all                    | Fallback value for prefetch option in this Service Bus namespace.                                                          |
> | **spring.jms.servicebus**.prefetch-policy.durable-topic-prefetch | The number of prefetch for durable topic.                                                                                  |
> | **spring.jms.servicebus**.prefetch-policy.queue-browser-prefetch | The number of prefetch for queue browser.                                                                                  |
> | **spring.jms.servicebus**.prefetch-policy.queue-prefetch         | The number of prefetch for queue.                                                                                          |
> | **spring.jms.servicebus**.prefetch-policy.topic-prefetch         | The number of prefetch for topic.                                                                                          |
> | **spring.jms.servicebus**.remote-url                             | URL of the AMQP broker.                                                                                                    |
> | **spring.jms.servicebus**.username                               | Login user of the AMQP broker.                                                                                             |

> [!NOTE]
> Spring JMS general configuration is omitted for short.
See [Spring JMS Document](https://docs.spring.io/spring-framework/docs/3.2.x/spring-framework-reference/html/jms.html) for more details.

### Basic usage

#### Use Service Bus connection String

The simplest way to connect to Service Bus for Spring JMS application is with the connection string.

Add the following properties and you are good to go.

``` yaml
spring:
  jms:
    servicebus:
      connection-string: ${AZURE_SERVICEBUS_CONNECTION_STRING}
      pricing-tier: ${PRICING_TIER}
```

> [!NOTE]
> The default enabled `ConnectionFactory` is the `CachingConnectionFactory` which adds Session caching as well MessageProducer caching. If you want to activate the connection pooling featured one of JmsPoolConnectionFactory, the property of `spring.jms.servicebus.pool.enabled` should be specified `true`. You can find other pooling configuration options (properties with prefix `spring.jms.servicebus.pool.`) from the above [Configuration](#configuration) section.


### Samples

See [azure-spring-boot-samples](https://github.com/Azure-Samples/azure-spring-boot-samples/tree/spring-cloud-azure_4.3.0) for more details.
