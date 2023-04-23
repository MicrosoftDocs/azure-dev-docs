---
title: Spring JMS troubleshooting guide
description: Describes how to troubleshoot known issues and common errors when using Spring JMS.
ms.date: 04/07/2023
author: KarlErickson
ms.author: v-yonghuiye
ms.topic: reference
---

# Spring JMS troubleshooting guide

This article describes how to troubleshoot known issues and common errors when using Spring JMS. The article also answers some frequently asked questions for `spring-cloud-azure-starter-servicebus-jms`.

## Connectivity issues

### The MessageProducer was closed due to an unrecoverable error

#### Problem description

When using `JmsTemplate` to send messages, `JmsTemplate` becomes unavailable during an idle interval between 10 to 15 minutes. Sending messages in that interval can get the exceptions shown in the following example output:

```output
2022-11-06 11:12:05.762  INFO 25944 --- [   scheduling-1] c.e.demo.ServiceBusJMSMessageProducer    : Sending message: 2022-11-06T11:12:05.762072 message 1
2022-11-06 11:12:05.772 ERROR 25944 --- [   scheduling-1] o.s.s.s.TaskUtils$LoggingErrorHandler    : Unexpected error occurred in scheduled task

org.springframework.jms.IllegalStateException: The MessageProducer was closed due to an unrecoverable error.; nested exception is javax.jms.IllegalStateException: The MessageProducer was closed due to an unrecoverable error.
    at org.springframework.jms.support.JmsUtils.convertJmsAccessException(JmsUtils.java:274) ~[spring-jms-5.3.23.jar:5.3.23]
  ...
Caused by: org.apache.qpid.jms.provider.ProviderException: The link 'G0:36906660:qpid-jms:sender:azure:5caf3ef4-9602-413c-964d-cf1292d6e1f5:1:1:1:t4' is force detached. Code: publisher(link376). Details: AmqpMessagePublisher.IdleTimerExpired: Idle timeout: 00:10:00. [condition = amqp:link:detach-forced]
    at org.apache.qpid.jms.provider.amqp.AmqpSupport.convertToNonFatalException(AmqpSupport.java:181) ~[qpid-jms-client-0.53.0.jar:na]
  ...
```

#### Cause analysis

The exceptions occur for [Azure Service Bus](/azure/service-bus-messaging/service-bus-amqp-troubleshoot) when the AMQP connection and link are active but no calls (for example, send or receive calls) are made using the link for 10 minutes. In this case, the link is closed. And when all links in the connection have been closed because there was no activity (idle) and a new link hasn't been created in 5 minutes, the connection is closed.

For the Service Bus JMS starter, the [CachingConnectionFactory](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/jms/connection/CachingConnectionFactory.html) is used by default, which caches the session, producer, and consumer. When the `JmsProducer` is idle for more than 10 minutes but less than 15, the link that the cached producer is occupying has been closed. Messages can't be sent out during this interval. Then, after another 5 minutes idle, the whole connection is closed. Thus, any sending operation after the 15 minute idle interval causes the `CachingConnectionFactory` to create a new connection to send. The sending operation becomes available after 15 minutes.

#### Workaround

Currently, the starter provides a workaround for the link-detach issue by applying the `JmsPoolConnectionFactory`, which pools `Connection`, `Session`, and `MessageProducer`, and manages the lifecycle of the pooled instances. This workaround can ensure that a producer is evicted after being unavailable and hence all sending operations are performed on active producers.

To use this workaround, add the following configuration:

```yaml
spring:
  jms:
    servicebus:
      pool:
        enabled: true
        max-connections: ${your-expected-max-connection-value}
```

### Usage of spring.jms.servicebus.idle-timeout

The idle-timeout properties configure the [idle timeout](http://docs.oasis-open.org/amqp/core/v1.0/os/amqp-core-transport-v1.0-os.html#doc-doc-idle-time-out) of an AMQP connection. The AMQP spec provides the following description:

> Connections are subject to an idle timeout threshold. The timeout is triggered by a local peer when no frames are received after a threshold value is exceeded. The idle timeout is measured in milliseconds, and starts from the time the last frame is received. If the threshold is exceeded, then a peer SHOULD try to gracefully close the connection using a close frame with an error explaining why. If the remote peer does not respond gracefully within a threshold to this, then the peer MAY close the TCP socket.

For a JMS client, when you configure this property, you control on the server side how long you expect the server to send an empty frame to keep a connection alive when no messages are delivered. This property controls the remote peer's behavior, and each peer can have its own, isolated value.

## JmsTemplate issues

### Scheduled messages

Azure Service Bus supports delayed message processing. For more information, see the [Scheduled messages](/azure/service-bus-messaging/message-sequencing#scheduled-messages) section of [Message sequencing and timestamps](/azure/service-bus-messaging/message-sequencing). For JMS, to schedule a message, set the `ScheduledEnqueueTimeUtc` property by using the message annotation header `x-opt-scheduled-enqueue-time`.

## JmsListener issues

### Too many requests are sent to Service Bus even though there are no messages in the server

#### Problem description

When using the `@JmsListener` API, in some cases you can see in the Azure portal that there are ongoing values for incoming requests sent to their queue or topics even if there are no messages in the server to receive.

#### Cause analysis

`@JmsListener` is a `polling listener`, which is built for repeated polling attempts.

The listener sits on an ongoing polling loop. Each loop calls the JMS `MessageConsumer.receive()` method to poll the local consumer for messages to consume. By default, for each poll operation, the local consumer sends pull requests to the message broker to ask for messages and then blocks for a certain period of time. The concrete polling process is decided by several properties, including `receiveTimeout`, `prefetchSize`, and `receiveLocalOnly` or `receiveNoWaitLocalOnly`. The `receiveNoWaitLocalOnly` method is used only when you set `receiveTimeout` to a negative value.

When this problem happens to your application, check the following configuration settings:

- Determine whether your prefetch policy is 0, which is also the default option. 0-prefetch means a pull consumer that sends pull requests to the Service Bus for each poll.

- If you've configured non-zero prefetch, determine whether your `receiveLocalOnly` or `receiveNoWaitLocalOnly` property is set to `false`, which is the default option. A `false` value here still results in sending pull requests to the server because it doesn't only poll the local consumer.

- The `receiveTimeout` configuration determines how long it blocks for each pull request, so it can affect the frequency of pull requests sending to the server. The default value is 1 second.

For a complete analysis, see the [discussion in the GitHub issue](https://github.com/Azure/azure-sdk-for-java/issues/30192#issuecomment-1362458734).

#### Solutions

The following sections describe two solutions for dealing with this issue

##### Solution 1. Change to push consumer and local-check only

By changing the mode to `push`, the consumer becomes an [Asynchronous Notification](http://docs.oasis-open.org/amqp/core/v1.0/os/amqp-core-transport-v1.0-os.html#doc-idp424576) consumer that doesn't pull messages from the broker, but maintains a target amount of link credit. The amount is decided by a prefetch property. As the Service Bus (sender) pushes messages, the sender’s link-credit decreases, and when the sender’s link-credit falls below a threshold, the client (receiver) sends a request to the server to increase the sender’s link-credit back to the desired target amount.

To accomplish this solution, add the following configuration:

First, configure the `prefetch` number as non-zero, which configures the consumer as non-pull. The following table shows several prefetch properties, each of which controls different Service Bus entities. Set the properties that apply to your case.

| Property                                                | Description                                                              |
|---------------------------------------------------------|--------------------------------------------------------------------------|
| `spring.jms.servicebus.prefetch.all`                    | The fallback value for the prefetch option in this Service Bus namespace |
| `spring.jms.servicebus.prefetch.queue-prefetch`         | The prefetch number for the queue.                                       |
| `spring.jms.servicebus.prefetch.queue-browser-prefetch` | The prefetch number for the queue browser.                               |
| `spring.jms.servicebus.prefetch.topic-prefetch`         | The prefetch number for the topic.                                       |
| `spring.jms.servicebus.prefetch.durable-topic-prefetch` | The prefetch number for the durable topic.                               |

Second, configure the `non-local-check` by adding a configuration class for the factory customizer, as shown in the following example:

```java
@Configuration(proxyBeanMethods = false)
public class CustomJmsConfiguration {

    @Bean
    ServiceBusJmsConnectionFactoryCustomizer customizer() {
        return factory -> {
            factory.setReceiveLocalOnly(true);
            // Configure the below ReceiveNoWaitLocalOnly instead if you have specified the property 
            // spring.jms.listener.receive-timeout with negative value. Otherwise, configure the above `ReceiveLocalOnly`.
            //factory.setReceiveNoWaitLocalOnly(true);
        };
    }
}
```

The prefetch value can affect how fast messages are dispatched to the consumer's local buffer. You should adjust the value according to your consuming performance and message volumes. A suitable value can speed up the consuming process, while a value that's too large can cause the locally buffered messages to become outdated and dispatched again. For low message volumes, where each message takes a long time to process, set the prefetch to 1. This value ensures that a consumer is only processing one message at a time.

##### Solution 2. Increase the receive timeout to decrease the pull frequency

The receive timeout property determines the strategy for how long the consumer blocks to wait for a pull result. So, by extending the timeout, you can reduce the pulling frequency, then reduce the number of pull requests when you choose pull mode. In extreme cases, you can set the strategy for waiting indefinitely until a message arrives, which means the consumer only pulls after consuming a message. In this case, when there are no messages in the server, it will block for waiting.

To accomplish this solution, configure the `spring.jms.listener.receive-timeout` property. This property is of type `java.time.Duration` and has a default value of 1 second. The following list explains the effect of various values:

- Setting the receive-timeout to 0 means that the pull blocks indefinite until a message is dispatched.
- Setting the receive-timeout to a positive value means that the pull blocks up to the timeout amount of time.
- Setting the receive-timeout to a negative value means that the pull is a no-wait receive, which means it returns a message immediately, or `null` if no messages are available.

> [!NOTE]
> A high timeout value can bring some side effects. For example, a high timeout value will also extend the time that the main thread is in a block status. This status means the container will be less responsive to `stop()` calls, and can only stop between `receive()` calls.

Also, the container can only send requests after the `receive-timeout` interval has passed. If the interval is longer than 10 minutes, Service Bus will close the link and prevent the listener from sending or receiving. For more information, see the [Link is closed](/azure/service-bus-messaging/service-bus-amqp-troubleshoot#link-is-closed) section of [AMQP errors in Azure Service Bus](/azure/service-bus-messaging/service-bus-amqp-troubleshoot). By default, the listener uses a [CachingConnectionFactory](https://github.com/Azure/azure-sdk-for-java/blob/spring-cloud-azure-starter-servicebus-jms_4.5.0/sdk/spring/spring-cloud-azure-autoconfigure/src/main/java/com/azure/spring/cloud/autoconfigure/implementation/jms/ServiceBusJmsConnectionFactoryConfiguration.java#L51).

If you require a high receive-timeout, be sure to use the [JmsPoolConnectionFactory](https://github.com/Azure/azure-sdk-for-java/blob/spring-cloud-azure-starter-servicebus-jms_4.5.0/sdk/spring/spring-cloud-azure-autoconfigure/src/main/java/com/azure/spring/cloud/autoconfigure/jms/ServiceBusJmsConnectionFactoryConfiguration.java).

For more information about the link-close issue and how to use `JmsPoolConnectionFactory`, see this [section](#the-messageproducer-was-closed-due-to-an-unrecoverable-error).

### Prefetch issue

#### Problem description

An unsuitable prefetch policy can cause the following problems:

- The same messages are repeatedly consumed.
- Messages are put in the dead letter queue after `MaxDeliveryCountExceeded`, even when messages are processed without error or exception.

#### Cause analysis

This issue usually happens when the [prefetch](/azure/service-bus-messaging/service-bus-prefetch?tabs=java) value is higher than the actual consuming capacity and cause that too many messages are prefetched to the local buffer waiting to be consumed. However, the prefetched messages are viewed as dispatched in a [peek-lock](/azure/service-bus-messaging/message-transfers-locks-settlement#peeklock) mode from the Service Bus side. Each dispatched message has a [max-delivery-count](/azure/service-bus-messaging/service-bus-dead-letter-queues#maximum-delivery-count) and lock-duration attributes. In the peek-lock receive mode, messages fetched into the prefetch buffer are acquired into the buffer in a locked state. They have the timeout clock for the lock ticking. If the prefetch buffer is large, and processing takes so long that message locks expire while staying in the prefetch buffer, the message is treated as abandoned and is again made available for retrieval from the queue.

It might cause the message to be fetched into the prefetch buffer and placed at the end. If the prefetch buffer can't usually be worked through during the message expiration, messages are repeatedly prefetched but never effectively delivered in a usable (validly locked) state. Then when those outdated copies are dequeued, the application then consumes the same message repeatedly and isn't able to complete them. In another case, repeated messages are all expired in the buffer before being consumed, then the message in Service Bus will be eventually moved to the dead-letter queue once the maximum delivery count is exceeded.

For more details, check the doc [Why is Prefetch not the default option](/azure/service-bus-messaging/service-bus-prefetch?tabs=dotnet#why-is-prefetch-not-the-default-option).

#### Solution

Configuration of the prefetch should be careful and fits with the consuming capability. The maximum prefetch count and the lock duration configured on the queue or subscription need to be balanced such that the lock timeout at least exceeds the cumulative expected message processing time for the maximum size of the prefetch buffer, plus one message. At the same time, the lock timeout shouldn't be so long that messages can exceed their maximum time to live when they're accidentally dropped, and so requiring their lock to expire before being redelivered.

To configure the prefetch attribute(default as zero), use one(s) of the below properties:

| Property                                                | Description                                                               |
|---------------------------------------------------------|---------------------------------------------------------------------------|
| `spring.jms.servicebus.prefetch.all`                    | The fallback value for the prefetch option in this Service Bus namespace. |
| `spring.jms.servicebus.prefetch.queue-prefetch`         | The prefetch number for the queue.                                        |
| `spring.jms.servicebus.prefetch.queue-browser-prefetch` | The prefetch number for the queue browser.                                |
| `spring.jms.servicebus.prefetch.topic-prefetch`         | The prefetch number for the topic.                                        |
| `spring.jms.servicebus.prefetch.durable-topic-prefetch` | The prefetch number for the durable topic.                                |

### How to perform AMQP disposition to Service Bus?

JMS supports five AMQP disposition types when acknowledging messages to the messaging broker, which are `ACCEPTED`, `REJECTED`, `RELEASED`, `MODIFIED_FAILED` and `MODIFIED_FAILED_UNDELIVERABLE`. The mapping relationship between AMQP disposition and Service Bus operations can be referred to [here](/azure/service-bus-messaging/service-bus-java-how-to-use-jms-api-amqp#amqp-disposition-and-service-bus-operation-mapping).

So, to manually complete/abandon/dead-letter/defer/release a message in `JmsListener`, use the following steps:

1. Disable session-transacted and use CLIENT ack mode.

   To accomplish this, either declare your own [JmsListenerContainerFactory](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/jms/config/JmsListenerContainerFactory.html) bean and then set the properties or post process the `JmsListenerContainerFactory` defined in the [starter](https://github.com/Azure/azure-sdk-for-java/blob/spring-cloud-azure-starter-servicebus-jms_4.5.0/sdk/spring/spring-cloud-azure-autoconfigure/src/main/java/com/azure/spring/cloud/autoconfigure/jms/ServiceBusJmsContainerConfiguration.java). Here we take the example of declaring another bean:

   ```java
   @Configuration(proxyBeanMethods = false)
   public class CustomJmsConfiguration {
   
       @Bean
       public JmsListenerContainerFactory<?> customQueueJmsListenerContainerFactory(
               DefaultJmsListenerContainerFactoryConfigurer configurer, ConnectionFactory connectionFactory) {
           DefaultJmsListenerContainerFactory jmsListenerContainerFactory = new DefaultJmsListenerContainerFactory();
           configurer.configure(jmsListenerContainerFactory, connectionFactory);
           jmsListenerContainerFactory.setPubSubDomain(Boolean.FALSE);
           jmsListenerContainerFactory.setSessionTransacted(Boolean.FALSE);
           jmsListenerContainerFactory.setSessionAcknowledgeMode(Session.CLIENT_ACKNOWLEDGE);
           return jmsListenerContainerFactory;
       }
   }
   ```

1. In your message handler, explicitly complete or abandon messages.

   ```java
   @JmsListener(destination = "QUEUE_NAME", containerFactory = "customQueueJmsListenerContainerFactory")
   public void receiveMessage(JmsTextMessage message) throws Exception {
       String event = message.getBody(String.class);
       try {
           logger.info("Received event: {}", event);
           logger.info("Received message: {}", message);
           // by default complete the message
           message.acknowledge();
       } catch (Exception e) {
           logger.error("Exception while processing re-source event: " + event, e);
           JmsAcknowledgeCallback acknowledgeCallback = message.getAcknowledgeCallback();
           // explicitly abandon the message
           acknowledgeCallback.setAckType(MODIFIED_FAILED);
           message.setAcknowledgeCallback(acknowledgeCallback);
           message.acknowledge();
           throw e;
       }
   }
   ```

## Configuration issues

### Disable Service Bus JMS autoconfiguration

#### Problem description

For some users, they import some Spring Cloud Azure Starter for the autoconfiguration of a certain Azure service rather than Service Bus JMS. And they also use Spring JMS framework without the need of Service Bus JMS. So when the application tries to start, there are following exceptions thrown out:

```output
Caused by: java.lang.IllegalArgumentException: 'spring.jms.servicebus.connection-string' should be provided
    at com.azure.spring.cloud.autoconfigure.jms.properties.AzureServiceBusJmsProperties.afterPropertiesSet(AzureServiceBusJmsProperties.java:210)
    at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.invokeInitMethods(AbstractAutowireCapableBeanFactory.java:1863)
    at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.initializeBean(AbstractAutowireCapableBeanFactory.java:1800)
    ... 98 more
```

#### Cause analysis

This is because all of the Spring Cloud Azure autoconfiguration classes are placed into the same module so that any Spring Cloud Azure Starter actually imports all of those autoconfiguration, which also includes Service Bus JMS. And when the application uses Spring JMS api, it meets the condition of [Service Bus JMS autoconfiguration](https://github.com/Azure/azure-sdk-for-java/blob/spring-cloud-azure-starter-servicebus-jms_4.5.0/sdk/spring/spring-cloud-azure-autoconfigure/src/main/java/com/azure/spring/cloud/autoconfigure/jms/ServiceBusJmsAutoConfiguration.java) and triggers it. Then for users who don't intend to use `spring-cloud-azure-starter-servicebus-jms`, the property conditions won't be met since there's no reason for them to configure Service Bus for JMS. Then the above exceptions are thrown out.

#### Solution

Spring Cloud Azure for Service Bus JMS provides a property to switch on/off its autoconfiguration. So users can choose to disable such function on their need.

```properties
spring.jms.servicebus.enabled=false
```

### Configure message attributes

#### How to set the content type of outbound messages?

To configure the content type, users should customize the Message Converter to modify the content-type attribute when converting messages. The below code takes byte messages as an example.

First, customize the message converter to be used in JmsTemplate:

```java
public class CustomMappingJackson2MessageConverter extends MappingJackson2MessageConverter {

    public static final String CONTENT_TYPE = "application/json";

    public CustomMappingJackson2MessageConverter() {
        this.setTargetType(MessageType.BYTES);
    }

    @Override
    protected BytesMessage mapToBytesMessage(Object object, Session session, ObjectWriter objectWriter)
            throws JMSException, IOException {
        final BytesMessage message = super.mapToBytesMessage(object, session, objectWriter);
        JmsBytesMessage msg = (JmsBytesMessage) message;
        AmqpJmsMessageFacade facade = (AmqpJmsMessageFacade) msg.getFacade();
        facade.setContentType(Symbol.valueOf(CONTENT_TYPE));
        return msg;
    }
}
```

Then, declare your customized message converter bean:

```java
@Configuration(proxyBeanMethods = false)
public class CustomJmsConfiguration {

    @Bean
    public MessageConverter messageConverter() {
        return new CustomMappingJackson2MessageConverter();
    }
}
```

#### How to set type ID property name for MappingJackson2MessageConverter?

The attribute of `type-id-property-name` is to help the `MappingJackson2MessageConverter` deal with which class to deserialize the message payload to. When serializing each Java object to a Spring Message payload, it stores the payload type into a message property with the property name recorded by type-id-property-name. Then when deserializing the message, the converter reads the type ID from the message and conduct deserialization.

To set the `type-id-property-name`, users need to declare their own `MappingJackson2MessageConverter` bean and configure that property.

```java
@Configuration(proxyBeanMethods = false)
public class CustomJmsConfiguration {

    @Bean
    public MessageConverter jacksonJmsMessageConverter()
    {
        MappingJackson2MessageConverter converter = new MappingJackson2MessageConverter();
        converter.setTypeIdPropertyName("your-custom-type-id-property-name");
        return converter;
    }
}
```

## Duplicate detection

Azure Service Bus supports [duplicate detection](/azure/service-bus-messaging/duplicate-detection) that apply the `MessageId` property to uniquely identify messages and discarded the repeated ones, which are newly sent to Service Bus.

However, for JMS api, to set the JMS message ID isn't recommended and even regarded as [illegal](https://docs.oracle.com/javaee/7/api/javax/jms/Message.html#setJMSMessageID-java.lang.String-) in JMS specs. So currently this feature isn't supported for Spring Cloud Azure Service Bus JMS Starter.

Any further update of this feature will be recorded in the [issue](https://github.com/Azure/azure-sdk-for-java/issues/30058).

## Enable AMQP transport logging

For more information, see the [enable AMQP transport logging](https://github.com/Azure/azure-sdk-for-java/blob/spring-cloud-azure-starter-servicebus-jms_4.5.0/sdk/servicebus/azure-messaging-servicebus/TROUBLESHOOTING.md#L87).

## Get additional help

Additional information on ways to reach out for support can be found in the [SUPPORT.md](https://github.com/Azure/azure-sdk-for-java/blob/main/SUPPORT.md) at the repo's root.

### Resources for Spring Cloud Azure Service Bus JMS starter

- [Reference documentation](spring-jms-support.md)
- [Quick Start](configure-spring-boot-starter-java-app-with-azure-service-bus.md)
- [Migration Guide](migration-guide-for-4.0.md#sdk-configuration-changes-4)
- [Sample](https://github.com/Azure-Samples/azure-spring-boot-samples/tree/main/servicebus/spring-cloud-azure-starter-servicebus-jms)

### Filing GitHub issues

When filing GitHub issues, the following details are requested:

- Service Bus configuration / Namespace environment
  - What tier is the namespace (standard / premium)?
  - What type of messaging entity is being used (queue/topic)? and its configuration.
  - What is the average size of each Message?
- What is the traffic pattern like? (i.e. # messages/minute and if the Client is always busy or has slow traffic periods.)
- Repro code and steps
  - This is important as we often can't reproduce the issue in our environment.
- Logs.
