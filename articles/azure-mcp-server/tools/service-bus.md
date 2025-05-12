---
title: Azure Service Bus Tools
description: Learn how to use the Azure MCP Server with Azure Service Bus.
keywords:  azure mcp server, azmcp, service bus
author: diberry
ms.author: diberry
ms.date: 5/05/2025
ms.topic: reference
ms.custom: build-2025
---

# Azure Service Bus tools for the Azure MCP Server

The Azure MCP Server allows you to manage Azure resources, including Azure Service Bus queues, topics, and subscriptions.

[Azure Service Bus](/azure/service-bus-messaging/service-bus-messaging-overview) is a fully managed enterprise message broker with [message queues and publish-subscribe topics](/azure/service-bus-messaging/service-bus-queues-topics-subscriptions). It's used for decoupling applications and services, load balancing across multiple services, and providing reliable message delivery between components of distributed systems.

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## Get queue details

The Azure MCP Server can retrieve detailed information about a [Service Bus queue](/azure/service-bus-messaging/service-bus-messaging-overview), including its configuration and runtime metrics. This functionality is useful for monitoring queue health and performance.

### Example prompts

- **Get queue details**: "Show me the details of my 'orders' queue in the 'retail' Service Bus namespace."
- **View queue metrics**: "What's the current message count in my Service Bus queue?"
- **Check queue status**: "I need to see the status and configuration of my 'events' queue"
- **Queue information**: "Get me the runtime details of the 'notifications' queue"
- **Queue configuration**: "Show me the settings for my Service Bus queue"

### Reference

| Name            | Description               |
|-----------------|--------------------------|
| azmcp servicebus queue details | Get details about a Service Bus queue, including message counts and status.|

```console
azmcp servicebus queue details \
    --subscription <SUBSCRIPTION_ID> \
    --namespace <SERVICE_BUS_NAMESPACE> \
    --queue-name <QUEUE_NAME>
```

#### Required parameters

`--subscription`: The ID of the subscription containing the Service Bus namespace.<br>
`--namespace`: The name of the Service Bus namespace containing the queue.<br>
`--queue-name`: The name of the queue to get details for.

#### Optional parameters

[!INCLUDE [common-parameters](../includes/tools/common-parameters.md)]

### JSON response

[!INCLUDE [JSON response](../includes/tools/response-format.md)]

#### Examples

Get detailed information about the specified Service Bus queue.

```console
azmcp servicebus queue details \
    --subscription "my-subscription-id" \
    --namespace "retail-service-bus" \
    --queue-name "orders"
```

## Get topic details

The Azure MCP Server can retrieve detailed information about a [Service Bus topic](/azure/service-bus-messaging/service-bus-messaging-overview), including its configuration and runtime metrics. This is useful for monitoring topic health and performance.

### Example prompts

- **Get topic details**: "Show me the details of my 'notifications' topic in the 'marketing' Service Bus namespace."
- **View topic metrics**: "What's the current message count in my Service Bus topic?"
- **Check topic status**: "I need to see the status and configuration of my 'events' topic"
- **Topic information**: "Get me the runtime details of the 'alerts' topic"
- **Topic configuration**: "Show me the settings for my Service Bus topic"

### Reference

| Name            | Description               |
|-----------------|--------------------------|
| azmcp servicebus topic details | Get details about a Service Bus topic, including status and configuration.|

```console
azmcp servicebus topic details \
    --subscription <SUBSCRIPTION_ID> \
    --namespace <SERVICE_BUS_NAMESPACE> \
    --topic-name <TOPIC_NAME>
```

#### Required parameters

`--subscription`: The ID of the subscription containing the Service Bus namespace.<br>
`--namespace`: The name of the Service Bus namespace containing the topic.<br>
`--topic-name`: The name of the topic to get details for.

#### Optional parameters

[!INCLUDE [common-parameters](../includes/tools/common-parameters.md)]

### JSON response

[!INCLUDE [JSON response](../includes/tools/response-format.md)]

#### Examples

Get detailed information about the specified Service Bus topic.

```console
azmcp servicebus topic details \
    --subscription "my-subscription-id" \
    --namespace "marketing-service-bus" \
    --topic-name "notifications"
```


## Get topic subscription details

The Azure MCP Server can retrieve detailed information about a [Service Bus topic subscription](/azure/service-bus-messaging/service-bus-messaging-overview), including its configuration and runtime metrics. This functionality is useful for monitoring subscription health and performance.

### Example prompts

- **Get subscription details**: "Show me the details of the 'mobile-app' subscription to my 'notifications' topic."
- **View subscription metrics**: "What's the current message count in my Service Bus topic subscription?"
- **Check subscription status**: "I need to see the status of my 'email-alerts' subscription"
- **Subscription information**: "Get me the runtime details of the 'high-priority' subscription"
- **Subscription configuration**: "Show me the settings for my Service Bus topic subscription"

### Reference

| Name            | Description               |
|-----------------|--------------------------|
| azmcp servicebus topic subscription details | Get details about a Service Bus topic subscription, including message counts and status.|

```console
azmcp servicebus topic subscription details \
    --subscription <SUBSCRIPTION_ID> \
    --namespace <SERVICE_BUS_NAMESPACE> \
    --topic-name <TOPIC_NAME> \
    --subscription-name <SUBSCRIPTION_NAME>
```

#### Required parameters

`--subscription`: The ID of the Azure subscription containing the Service Bus namespace.<br>
`--namespace`: The name of the Service Bus namespace containing the topic.<br>
`--topic-name`: The name of the topic containing the subscription.<br>
`--subscription-name`: The name of the topic subscription to get details for.

#### Optional parameters

[!INCLUDE [common-parameters](../includes/tools/common-parameters.md)]

### JSON response

[!INCLUDE [JSON response](../includes/tools/response-format.md)]

#### Examples

Get detailed information about the specified Service Bus topic subscription.

```console
azmcp servicebus topic subscription details \
    --subscription "my-subscription-id" \
    --namespace "marketing-service-bus" \
    --topic-name "notifications" \
    --subscription-name "mobile-app"
```

## Peek at queue messages

The Azure MCP Server can peek at messages in an [Azure Service Bus queue](/azure/service-bus-messaging/service-bus-messaging-overview) without removing them. This functionality is useful for monitoring and debugging your message-based applications.

### Example prompts

Example prompts for using the Azure MCP Server to peek at Service Bus queue messages.

- **Peek messages**: "Show me the messages in my 'orders' queue in the 'retail' Service Bus namespace."
- **View queue content**: "What messages are waiting in my Service Bus queue?"
- **Check messages**: "I need to see the content of messages in my 'events' queue"
- **Preview queue**: "Peek at the first 5 messages in my 'notifications' queue"
- **Inspect queue**: "Let me see what's in the message queue without consuming the messages"

### Reference

The Azure MCP Server has tools to inspect Service Bus queue messages. Advanced users and automation tools use these tools.

| Name            | Description               |
|-----------------|--------------------------|
| azmcp servicebus queue peek | Peek at messages in a Service Bus queue without removing them.|

```console
azmcp servicebus queue peek \
    --subscription <SUBSCRIPTION_ID> \
    --namespace <SERVICE_BUS_NAMESPACE> \
    --queue-name <QUEUE_NAME> \
    [--max-messages <NUMBER_OF_MESSAGES>]
```

#### Required parameters

`--subscription`: The ID of the subscription containing the Service Bus namespace.<br>
`--namespace`: The name of the Service Bus namespace containing the queue.<br>
`--queue-name`: The name of the queue to peek messages from.
 
#### Optional parameters

`--max-messages`: The maximum number of messages to peek. Default is typically 1.

[!INCLUDE [common-parameters](../includes/tools/common-parameters.md)]

### JSON response

[!INCLUDE [JSON response](../includes/tools/response-format.md)]

#### Examples

Peek at the first message in the specified Service Bus queue.

```console
azmcp servicebus queue peek \
    --subscription "my-subscription-id" \
    --namespace "retail-service-bus" \
    --queue-name "orders"
```

Peek at multiple messages in the specified Service Bus queue.

```console
azmcp servicebus queue peek \
    --subscription "my-subscription-id" \
    --namespace "retail-service-bus" \
    --queue-name "orders" \
    --max-messages 5
```


## Peek at topic subscription messages

The Azure MCP Server can peek at messages in an Azure [Service Bus topic subscription](/azure/service-bus-messaging/service-bus-messaging-overview) without removing them. This functionality is useful for monitoring and debugging publish-subscribe scenarios.

### Example prompts

- **Peek subscription messages**: "Show me the messages in the 'mobile-app' subscription to my 'notifications' topic."
- **View subscription content**: "What messages are waiting in my Service Bus topic subscription?"
- **Check subscription messages**: "I need to see the content of messages in my 'email-alerts' subscription"
- **Preview subscription**: "Peek at the first 5 messages in my 'high-priority' subscription"
- **Inspect subscription**: "Let me see what's in the subscription without consuming the messages"

### Reference

| Name            | Description               |
|-----------------|--------------------------|
| azmcp servicebus topic subscription peek | Peek at messages in a Service Bus topic subscription without removing them.|

```console
azmcp servicebus topic subscription peek \
    --subscription <SUBSCRIPTION_ID> \
    --namespace <SERVICE_BUS_NAMESPACE> \
    --topic-name <TOPIC_NAME> \
    --subscription-name <SUBSCRIPTION_NAME> \
    [--max-messages <NUMBER_OF_MESSAGES>]
```

#### Required parameters

`--subscription`: The ID of the Azure subscription containing the Service Bus namespace.<br>
`--namespace`: The name of the Service Bus namespace containing the topic.<br>
`--topic-name`: The name of the topic containing the subscription.<br>
`--subscription-name`: The name of the topic subscription to peek messages from.

#### Optional parameters

`--max-messages`: The maximum number of messages to peek. Default is typically 1.

[!INCLUDE [common-parameters](../includes/tools/common-parameters.md)]

### JSON response

[!INCLUDE [JSON response](../includes/tools/response-format.md)]

#### Examples

Peek at the first message in the specified Service Bus topic subscription.

```console
azmcp servicebus topic subscription peek \
    --subscription "my-subscription-id" \
    --namespace "marketing-service-bus" \
    --topic-name "notifications" \
    --subscription-name "mobile-app"
```

Peek at multiple messages in the specified Service Bus topic subscription.

```console
azmcp servicebus topic subscription peek \
    --subscription "my-subscription-id" \
    --namespace "marketing-service-bus" \
    --topic-name "notifications" \
    --subscription-name "mobile-app" \
    --max-messages 5
```
