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

The Azure MCP Server allows you to manage Azure Service Bus resources, including queues and topics with natural language prompts. You can peek at messages and view message details without specialized knowledge of messaging protocols.

[Azure Service Bus](/azure/service-bus-messaging/service-bus-messaging-overview) is a fully managed enterprise message broker with message queues and publish-subscribe topics. Service Bus is used to decouple applications and services from each other.

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## Get queue runtime details

The Azure MCP Server can retrieve runtime details about a Service Bus queue, including its message count and status.

**Example prompts** include:

- **Details queue**: "Show me details about the 'orders' queue in my 'app-messaging' namespace."
- **Queue info**: "What's the status of queue 'notifications' in namespace 'messaging-hub'?"
- **Check queue**: "Get details for my 'user-events' queue"
- **Queue status**: "Show me message count for the orders queue"

| Required/Optional | Parameter | Description |
|-------------------|-----------|-------------|
| Required | **Subscription** | The Azure subscription ID or name. |
| Required | **Namespace** | The fully qualified Service Bus namespace host name. |
| Required | **Queue name** | The queue name to get details for. |


## Get topic runtime details

The Azure MCP Server can retrieve runtime details about a Service Bus topic, including its subscription count and status.

**Example prompts** include:

- **Details topic**: "Show me runtime details about the 'product-events' topic in my 'retail-messaging' namespace."
- **Topic info**: "What's the runtime status of topic 'system-updates' in namespace 'app-messaging'?"
- **Check topic**: "Get details for my 'notifications' topic"
- **Topic status**: "Show me subscription count for the events topic"
- **View topic**: "Tell me about the broadcast-topic runtime in my service bus"

| Required/Optional | Parameter | Description |
|-------------------|-----------|-------------|
| Required | **Subscription** | The Azure subscription ID or name. |
| Required | **Namespace** | The fully qualified Service Bus namespace host name. |
| Required | **Topic name** | The name of the topic to get information about. |

## Get topic subscription runtime details

The Azure MCP Server can retrieve runtime details about a subscription within a Service Bus topic, including message counts.

**Example prompts** include:

- **Details subscription**: "Show me details about the 'mobile-app' subscription in topic 'notifications'."
- **Subscription info**: "What's the status of subscription 'admin' in topic 'system-updates'?"
- **Check subscription**: "Get message count for my 'premium-users' subscription in the 'offers' topic"
- **Subscription status**: "Show me details for the email-service subscription"
- **View subscription**: "Tell me about the analytics subscription in my events topic"

| Required/Optional | Parameter | Description |
|-------------------|-----------|-------------|
| Required | **Subscription** | The Azure subscription ID or name. |
| Required | **Namespace** | The fully qualified Service Bus namespace host name. |
| Required | **Topic name** | The name of the topic containing the subscription. |
| Required | **Topic subscription name** | The name of the opic subscription to get details for. |

## Peek at queue messages

The Azure MCP Server can peek at messages in a Service Bus queue without removing them.

**Example prompts** include:

- **Peek queue**: "Show me messages in the 'orders' queue in my 'app-messaging' namespace."
- **View messages**: "What messages are in queue 'notifications' right now?"
- **Check messages**: "Let me see the first 5 messages in my 'user-events' queue"
- **Preview queue**: "Show me what's in the processing queue without removing messages"
- **Read queue**: "Look at messages in my orders queue"

| Required/Optional | Parameter | Description |
|-------------------|-----------|-------------|
| Required | **Subscription** | The Azure subscription ID or name. |
| Required | **Namespace** | The fully qualified Service Bus namespace host name. |
| Required | **Queue name** | The queue name to peek messages from. |
| Optional | **Max messages** | The maximum number of messages to retrieve. |

## Peek at topic subscription messages

The Azure MCP Server can peek at messages in a subscription within a Service Bus topic without removing them.

**Example prompts** include:

- **Peek subscription**: "Show me messages in the 'mobile-app' subscription of topic 'notifications'."
- **View subscription messages**: "What messages are in subscription 'admin' of topic 'system-updates'?"
- **Check subscription messages**: "Let me see the messages in my 'premium-users' subscription"
- **Preview subscription**: "Show me what's in the email-service subscription without removing messages"
- **Read subscription**: "Look at messages in my analytics subscription"

| Required/Optional | Parameter | Description |
|-------------------|-----------|-------------|
| Required | **Subscription** | The Azure subscription ID or name. |
| Required | **Namespace** | The fully qualified Service Bus namespace host name. |
| Required | **Topic name** | The name of the topic containing the subscription. |
| Required | **Topic subscription name** | The name of topic subscription to peek messages from. |
| Optional | **Max messages** | The maximum number of messages to retrieve. |

[!INCLUDE [global-params](../includes/tools/global-parameters-list.md)]