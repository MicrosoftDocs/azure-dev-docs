---
title: Spring JMS support
description: This article describes how Spring Cloud Azure and Spring JMS can be used together.
ms.date: 04/06/2023
author: KarlErickson
ms.author: v-yeyonghui
ms.topic: reference
ms.custom: devx-track-java, devx-track-extended-java
---

# Spring JMS support

**This article applies to:** ✔️ Version 4.8.0 ✔️ Version 5.1.0

This article describes how to to use Azure Service Bus by the JMS API integrated into the Spring JMS framework.

You have to provide an Azure Service Bus connection string, which is parsed into the login username, password, and remote URI for the AMQP broker.

## Dependency setup

Add the following dependencies if you want to migrate your Spring JMS application to use Azure Service Bus.

```xml
<dependency>
    <groupId>com.azure.spring</groupId>
    <artifactId>spring-cloud-azure-starter-servicebus-jms</artifactId>
</dependency>
```

## Configuration

The following table describes the configurable properties when using Spring JMS support:

> [!div class="mx-tdBreakAll"]
> | Property                                                         | Description                                                                                                                |
> |------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------|
> | **spring.jms.servicebus**.connection-string                      | Azure Service Bus connection string. Should be provided when want to provide the connection string directly.               |
> | **spring.jms.servicebus**.topic-client-id                        | JMS client ID. Only works for the `topicJmsListenerContainerFactory` bean.                                                |
> | **spring.jms.servicebus**.enabled                                | Whether to enable Servive Bus JMS autoconfiguration. The default value is `true`.                                            |
> | **spring.jms.servicebus**.idle-timeout                           | Connection idle timeout duration that how long the client expects Service Bus to keep a connection alive when no messages delivered. The default value is `2m`. |
> | **spring.jms.servicebus**.pricing-tier                           | The Azure Service Bus Price Tier.                                                                                          |
> | **spring.jms.servicebus**.listener.reply-pub-sub-domain          | Whether the reply destination type is topic. Only works for the `topicJmsListenerContainerFactory` bean.                  |
> | **spring.jms.servicebus**.listener.phase                         | The phase in which this container should be started and stopped.                                                           |
> | **spring.jms.servicebus**.listener.reply-qos-settings            | Configure the QosSettings to use when sending a reply.                                                                     |
> | **spring.jms.servicebus**.listener.subscription-durable          | Whether to make the subscription durable. Only works for the `topicJmsListenerContainerFactory` bean. The default value is `true`. |
> | **spring.jms.servicebus**.listener.subscription-shared           | Whether to make the subscription shared. Only works for the `topicJmsListenerContainerFactory` bean.                      |
> | **spring.jms.servicebus**.pool.block-if-full                     | Whether to block when a connection is requested and the pool is full. Set it to false to throw a `JMSException` instead.   |
> | **spring.jms.servicebus**.pool.block-if-full-timeout             | Blocking period before throwing an exception if the pool is still full.                                                    |
> | **spring.jms.servicebus**.pool.enabled                           | Whether a JmsPoolConnectionFactory should be created, instead of a regularConnectionFactory.                               |
> | **spring.jms.servicebus**.pool.idle-timeout                      | Connection pool idle timeout.                                                                                              |
> | **spring.jms.servicebus**.pool.max-connections                   | Maximum number of pooled connections.                                                                                      |
> | **spring.jms.servicebus**.pool.max-sessions-per-connection       | Maximum number of pooled sessions per connection in the pool.                                                              |
> | **spring.jms.servicebus**.pool.time-between-expiration-check     | Time to sleep between runs of the idle connection eviction thread. When negative, no idle connection eviction thread runs. |
> | **spring.jms.servicebus**.pool.use-anonymous-producers           | Whether to use only one anonymous 'MessageProducer' instance. Set it to false to create one 'MessageProducer' every time one is required. |
> | **spring.jms.servicebus**.prefetch-policy.all                    | Fallback value for prefetch option in this Service Bus namespace. The default value is `0`.                                |
> | **spring.jms.servicebus**.prefetch-policy.durable-topic-prefetch | The number of prefetch for durable topic. The default value is `0`.                                                        |
> | **spring.jms.servicebus**.prefetch-policy.queue-browser-prefetch | The number of prefetch for queue browser. The default value is `0`.                                                        |
> | **spring.jms.servicebus**.prefetch-policy.queue-prefetch         | The number of prefetch for queue. The default value is `0`.                                                                |
> | **spring.jms.servicebus**.prefetch-policy.topic-prefetch         | The number of prefetch for topic. The default value is `0`.                                                                |

> [!NOTE]
> Spring JMS general configuration is omitted for short.

For more information, see [Spring JMS Document](https://docs.spring.io/spring-framework/docs/3.2.x/spring-framework-reference/html/jms.html).

## Basic usage

### Use Service Bus connection String

The simplest way to connect to Service Bus for Spring JMS application is with the connection string.

Add the following properties and you're good to go.

```yaml
spring:
  jms:
    servicebus:
      connection-string: ${AZURE_SERVICEBUS_CONNECTION_STRING}
      pricing-tier: ${PRICING_TIER}
```

> [!NOTE]
> The default enabled `ConnectionFactory` is the `CachingConnectionFactory` which adds Session caching as well MessageProducer caching. If you want to activate the connection pooling featured one of JmsPoolConnectionFactory, the property of `spring.jms.servicebus.pool.enabled` should be specified `true`. You can find other pooling configuration options (properties with prefix `spring.jms.servicebus.pool.`) from the above [Configuration](#configuration) section.

### Optional Service Bus functionality

You can use a customized `MessageConverter` bean to convert between Java objects and JMS messages.

#### Set the content-type of messages

The following code example sets the `BytesMessage` content-type to `application/json`. For more information, see [Messages, payloads, and serialization](/azure/service-bus-messaging/service-bus-messages-payloads).

```java
import com.fasterxml.jackson.databind.ObjectWriter;
import org.apache.qpid.jms.message.JmsBytesMessage;
import org.apache.qpid.jms.provider.amqp.message.AmqpJmsMessageFacade;
import org.apache.qpid.proton.amqp.Symbol;
import org.springframework.jms.support.converter.MappingJackson2MessageConverter;
import org.springframework.jms.support.converter.MessageType;
import org.springframework.stereotype.Component;

import javax.jms.BytesMessage;
import javax.jms.JMSException;
import javax.jms.Session;
import java.io.IOException;

@Component
public class CustomMessageConverter extends MappingJackson2MessageConverter {

    private static final String TYPE_ID_PROPERTY = "_type";
    private static final Symbol CONTENT_TYPE = Symbol.valueOf("application/json");

    public CustomMessageConverter() {
        this.setTargetType(MessageType.BYTES);
        this.setTypeIdPropertyName(TYPE_ID_PROPERTY);
    }

    @Override
    protected BytesMessage mapToBytesMessage(Object object, Session session, ObjectWriter objectWriter)
        throws JMSException, IOException {
        final BytesMessage bytesMessage = super.mapToBytesMessage(object, session, objectWriter);
        JmsBytesMessage jmsBytesMessage = (JmsBytesMessage) bytesMessage;
        AmqpJmsMessageFacade facade = (AmqpJmsMessageFacade) jmsBytesMessage.getFacade();
        facade.setContentType(CONTENT_TYPE);
        return jmsBytesMessage;
    }
}
```

For more information about `MessageConverter`, see the official [Spring JMS guide](https://spring.io/guides/gs/messaging-jms/).

## Samples

For more information, see the [azure-spring-boot-samples](https://github.com/Azure-Samples/azure-spring-boot-samples/tree/main) repository on GitHub.
