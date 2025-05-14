---
title: Azure Service Bus Tools 
description: Learn how to use the Azure MCP Server with Azure Service Bus.
keywords: azure mcp server, azmcp, service bus, queue, topic
author: diberry
ms.author: diberry
ms.date: 05/14/2025
content_well_notification: 
  - AI-contribution
ai-usage: ai-assisted
ms.topic: reference
ms.custom: build-2025
--- 
# Service Bus tools for the Azure MCP Server

The Azure MCP Server allows you to manage Azure Service Bus resources, including queues and topics.

[Azure Service Bus](/azure/service-bus-messaging/service-bus-messaging-overview) is a fully managed enterprise message broker with message queues and publish-subscribe topics. Service Bus is used to decouple applications and services from each other.

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## Use existing MCP server for Service Bus

This section explains how to interact with Azure Service Bus using natural language prompts with the Azure MCP Server. You can manage messaging components like queues, topics, and subscriptions to facilitate reliable communication between distributed applications without specialized knowledge of messaging protocols.

### Get queue runtime details

The Azure MCP Server can retrieve runtime details about a Service Bus queue, including its message count and status.

**Example prompts** include:

- **Details queue**: "Show me details about the 'orders' queue in my 'app-messaging' namespace."
- **Queue info**: "What's the status of queue 'notifications' in namespace 'messaging-hub'?"
- **Check queue**: "Get details for my 'user-events' queue"
- **Queue status**: "Show me message count for the orders queue"
- **View queue**: "Tell me about the processing-queue in my service bus"

### Get topic runtime details

The Azure MCP Server can retrieve runtime details about a Service Bus topic, including its subscription count and status.

**Example prompts** include:

- **Details topic**: "Show me runtime details about the 'product-events' topic in my 'retail-messaging' namespace."
- **Topic info**: "What's the runtime status of topic 'system-updates' in namespace 'app-messaging'?"
- **Check topic**: "Get details for my 'notifications' topic"
- **Topic status**: "Show me subscription count for the events topic"
- **View topic**: "Tell me about the broadcast-topic runtime in my service bus"

### Get topic subscription runtime details

The Azure MCP Server can retrieve runtime details about a subscription within a Service Bus topic, including message counts.

**Example prompts** include:

- **Details subscription**: "Show me details about the 'mobile-app' subscription in topic 'notifications'."
- **Subscription info**: "What's the status of subscription 'admin' in topic 'system-updates'?"
- **Check subscription**: "Get message count for my 'premium-users' subscription in the 'offers' topic"
- **Subscription status**: "Show me details for the email-service subscription"
- **View subscription**: "Tell me about the analytics subscription in my events topic"

### Peek at queue messages

The Azure MCP Server can peek at messages in a Service Bus queue without removing them.

**Example prompts** include:

- **Peek queue**: "Show me messages in the 'orders' queue in my 'app-messaging' namespace."
- **View messages**: "What messages are in queue 'notifications' right now?"
- **Check messages**: "Let me see the first 5 messages in my 'user-events' queue"
- **Preview queue**: "Show me what's in the processing queue without removing messages"
- **Read queue**: "Look at messages in my orders queue"

### Peek at topic subscription messages

The Azure MCP Server can peek at messages in a subscription within a Service Bus topic without removing them.

**Example prompts** include:

- **Peek subscription**: "Show me messages in the 'mobile-app' subscription of topic 'notifications'."
- **View subscription messages**: "What messages are in subscription 'admin' of topic 'system-updates'?"
- **Check subscription messages**: "Let me see the messages in my 'premium-users' subscription"
- **Preview subscription**: "Show me what's in the email-service subscription without removing messages"
- **Read subscription**: "Look at messages in my analytics subscription"

## Develop new MCP server for Service Bus

This section provides implementation details for adding Azure Service Bus capabilities to your MCP server. The APIs below enable programmatic management of enterprise messaging infrastructure through structured commands for reliable message exchange between applications.

### Get queue runtime details

The Azure MCP Server can retrieve runtime and details about a Service Bus queue.

```console
azmcp servicebus queue details \
    --subscription <SUBSCRIPTION_ID> \
    --namespace <SERVICE_BUS_NAMESPACE> \
    --queue-name <QUEUE_NAME>
```

View the [structured JSON output](get-started.md#response-format-common-to-all-tools) common to all tools.

##### Required parameters

`--subscription`: The ID of the subscription containing the Service Bus namespace.<br>
`--namespace`: The name of the Service Bus namespace.<br>
`--queue-name`: The name of the queue to get details for.

##### Optional parameters

View the [optional parameters](get-started.md#optional-parameters-common-to-all-tools) common to all tools.

#### Examples

Get details about a specific queue in a Service Bus namespace.

```console
azmcp servicebus queue details \
    --subscription "my-subscription-id" \
    --namespace "app-messaging" \
    --queue-name "orders"
```

### Get topic runtime details

The Azure MCP Server can retrieve details about a Service Bus topic.

```console
azmcp servicebus topic details \
    --subscription <SUBSCRIPTION_ID> \
    --namespace <SERVICE_BUS_NAMESPACE> \
    --topic-name <TOPIC_NAME>
```

View the [structured JSON output](get-started.md#response-format-common-to-all-tools) common to all tools.

##### Required parameters

`--subscription`: The ID of the subscription containing the Service Bus namespace.<br>
`--namespace`: The name of the Service Bus namespace.<br>
`--topic-name`: The name of the topic to get details for.

##### Optional parameters

View the [optional parameters](get-started.md#optional-parameters-common-to-all-tools) common to all tools.

#### Examples

Get details about a specific topic in a Service Bus namespace.

```console
azmcp servicebus topic details \
    --subscription "my-subscription-id" \
    --namespace "app-messaging" \
    --topic-name "system-updates"
```

### Get topic subscription runtime details

The Azure MCP Server can retrieve details about a subscription within a Service Bus topic.

```console
azmcp servicebus topic subscription details \
    --subscription <SUBSCRIPTION_ID> \
    --namespace <SERVICE_BUS_NAMESPACE> \
    --topic-name <TOPIC_NAME> \
    --subscription-name <SUBSCRIPTION_NAME>
```

View the [structured JSON output](get-started.md#response-format-common-to-all-tools) common to all tools.

##### Required parameters

`--subscription`: The ID of the subscription containing the Service Bus namespace.<br>
`--namespace`: The name of the Service Bus namespace.<br>
`--topic-name`: The name of the topic.<br>
`--subscription-name`: The name of the subscription to get details for.

##### Optional parameters

View the [optional parameters](get-started.md#optional-parameters-common-to-all-tools) common to all tools.

#### Examples

Get details about a specific subscription in a Service Bus topic.

```console
azmcp servicebus topic subscription details \
    --subscription "my-subscription-id" \
    --namespace "app-messaging" \
    --topic-name "system-updates" \
    --subscription-name "admin-alerts"
```

### Peek at queue messages

The Azure MCP Server can peek at messages in a Service Bus queue without removing them.

```console
azmcp servicebus queue peek \
    --subscription <SUBSCRIPTION_ID> \
    --namespace <SERVICE_BUS_NAMESPACE> \
    --queue-name <QUEUE_NAME> \
    [--max-messages <MAX_MESSAGES>]
```

View the [structured JSON output](get-started.md#response-format-common-to-all-tools) common to all tools.

##### Required parameters

`--subscription`: The ID of the subscription containing the Service Bus namespace.<br>
`--namespace`: The name of the Service Bus namespace.<br>
`--queue-name`: The name of the queue to peek messages from.

##### Optional parameters

`--max-messages`: The maximum number of messages to peek. Default is 1.

View the [optional parameters](get-started.md#optional-parameters-common-to-all-tools) common to all tools.

#### Examples

Peek at a message in a Service Bus queue.

```console
azmcp servicebus queue peek \
    --subscription "my-subscription-id" \
    --namespace "app-messaging" \
    --queue-name "orders"
```

Peek at multiple messages in a Service Bus queue.

```console
azmcp servicebus queue peek \
    --subscription "my-subscription-id" \
    --namespace "app-messaging" \
    --queue-name "notifications" \
    --max-messages 5
```

### Peek at topic subscription messages

The Azure MCP Server can peek at messages in a subscription within a Service Bus topic without removing them.

```console
azmcp servicebus topic subscription peek \
    --subscription <SUBSCRIPTION_ID> \
    --namespace <SERVICE_BUS_NAMESPACE> \
    --topic-name <TOPIC_NAME> \
    --subscription-name <SUBSCRIPTION_NAME> \
    [--max-messages <MAX_MESSAGES>]
```

View the [structured JSON output](get-started.md#response-format-common-to-all-tools) common to all tools.

##### Required parameters

`--subscription`: The ID of the subscription containing the Service Bus namespace.<br>
`--namespace`: The name of the Service Bus namespace.<br>
`--topic-name`: The name of the topic.<br>
`--subscription-name`: The name of the subscription to peek messages from.

##### Optional parameters

`--max-messages`: The maximum number of messages to peek. Default is 1.

View the [optional parameters](get-started.md#optional-parameters-common-to-all-tools) common to all tools.

#### Examples

Peek at a message in a Service Bus topic subscription.

```console
azmcp servicebus topic subscription peek \
    --subscription "my-subscription-id" \
    --namespace "app-messaging" \
    --topic-name "system-updates" \
    --subscription-name "admin-alerts"
```

Peek at multiple messages in a Service Bus topic subscription.

```console
azmcp servicebus topic subscription peek \
    --subscription "my-subscription-id" \
    --namespace "app-messaging" \
    --topic-name "product-events" \
    --subscription-name "inventory-service" \
    --max-messages 10
```
