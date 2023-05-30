---
title: Azure Service Bus JMS configuration properties
description: This reference doc contains all Azure Service Bus JMS configuration properties.
author: KarlErickson
ms.author: rujche
ms.date: 12/09/2022
ms.topic: reference
ms.custom: devx-track-java, spring-cloud-azure, devx-track-extended-java
---

# Azure Service Bus JMS configuration properties

> [!div class="mx-tdBreakAll"]
> | Property                                                     | Description                                                                                                                               |
> |--------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------|
> | spring.jms.servicebus.connection-string                      | Connection string to connect to a Service Bus namespace.                                                                                  |
> | spring.jms.servicebus.enabled                                | Whether to enable Servive Bus JMS autoconfiguration. The default value is `true`.                                                         |
> | spring.jms.servicebus.idle-timeout                           | Connection idle timeout duration, which indicates how long the client expects Service Bus to keep a connection alive when no messages are delivered. The default value is `2m`. |
> | spring.jms.servicebus.listener.phase                         | The phase in which this container should be started and stopped.                                                                          |
> | spring.jms.servicebus.listener.reply-pub-sub-domain          | Whether the reply destination type is topic. Only works for the `topicJmsListenerContainerFactory` bean.                                 |
> | spring.jms.servicebus.listener.reply-qos-settings            | The QosSettings to use when sending a reply.                                                                                              |
> | spring.jms.servicebus.listener.subscription-durable          | Whether to make the subscription durable. Only works for the `topicJmsListenerContainerFactory` bean. The default value is `true`.       |
> | spring.jms.servicebus.listener.subscription-shared           | Whether to make the subscription shared. Only works for the `topicJmsListenerContainerFactory` bean.                                     |
> | spring.jms.servicebus.pool.block-if-full                     | Whether to block when a connection is requested and the pool is full. Set it to `false` to throw a `JMSException` instead.                  |
> | spring.jms.servicebus.pool.block-if-full-timeout             | Blocking period before throwing an exception if the pool is still full.                                                                   |
> | spring.jms.servicebus.pool.enabled                           | Whether a `JmsPoolConnectionFactory` should be created, instead of a regular `ConnectionFactory`.                                             |
> | spring.jms.servicebus.pool.idle-timeout                      | Connection idle timeout.                                                                                                                  |
> | spring.jms.servicebus.pool.max-connections                   | Maximum number of pooled connections.                                                                                                     |
> | spring.jms.servicebus.pool.max-sessions-per-connection       | Maximum number of pooled sessions per connection in the pool.                                                                             |
> | spring.jms.servicebus.pool.time-between-expiration-check     | Time to sleep between runs of the idle connection eviction thread. When negative, no idle connection eviction thread runs.                |
> | spring.jms.servicebus.pool.use-anonymous-producers           | Whether to use only one anonymous `MessageProducer` instance. Set it to `false` to create one `MessageProducer` every time one is required. |
> | spring.jms.servicebus.prefetch-policy.all                    | Fallback value for prefetch option in this Service Bus namespace. The default value is `0`.                                               |
> | spring.jms.servicebus.prefetch-policy.durable-topic-prefetch | The number of prefetch for durable topic. The default value is `0`.                                                                       |
> | spring.jms.servicebus.prefetch-policy.queue-browser-prefetch | The number of prefetch for queue browser. The default value is `0`.                                                                       |
> | spring.jms.servicebus.prefetch-policy.queue-prefetch         | The number of prefetch for queue. The default value is `0`.                                                                               |
> | spring.jms.servicebus.prefetch-policy.topic-prefetch         | The number of prefetch for topic. The default value is `0`.                                                                               |
> | spring.jms.servicebus.pricing-tier                           | Pricing tier for a Service Bus namespace.                                                                                                 |
> | spring.jms.servicebus.topic-client-id                        | Service Bus topic client ID. Only works for the `topicJmsListenerContainerFactory` bean.                                                  |
