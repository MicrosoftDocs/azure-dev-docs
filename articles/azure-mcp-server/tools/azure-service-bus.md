---
title: Azure Service Bus Tools 
description: "Learn how to use Azure MCP Server with Azure Service Bus to manage queues, topics, and peek at messages with natural language prompts."
keywords: azure mcp server, azmcp, service bus, queue, topic
author: diberry
ms.author: diberry
ms.date: 12/05/2025
content_well_notification: 
  - AI-contribution
ai-usage: ai-assisted
ms.topic: concept-article
ms.custom: build-2025
--- 
# Azure Service Bus tools for the Azure MCP Server overview

The Azure MCP Server lets you to manage Azure Service Bus resources, including queues and topics with natural language prompts. You can peek at messages and view message details without specialized knowledge of messaging protocols.

[Azure Service Bus](/azure/service-bus-messaging/service-bus-messaging-overview) is a fully managed enterprise message broker with message queues and publish-subscribe topics. Service Bus decouples applications and services from each other.

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## Get queue runtime details

<!-- servicebus queue details -->

The Azure MCP Server can retrieve runtime details about a Service Bus queue, including its message count and status.

Example prompts include:

- **Details queue**: "Show me details about the 'orders' queue in my 'app-messaging' namespace."
- **Queue info**: "What's the status of queue 'notifications' in namespace 'messaging-hub'?"
- **Check queue**: "Get details for queue 'user-events' in namespace 'app-messaging'"
- **Queue status**: "Show me message count for queue 'orders' in namespace 'retail-messaging'"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Namespace** | Required | The fully qualified Service Bus namespace host name. |
| **Queue name** | Required | The queue name. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [servicebus queue details](../includes/tools/annotations/azure-service-bus-queue-details-annotations.md)]

## Get topic runtime details

<!-- servicebus topic details -->

The Azure MCP Server can retrieve runtime details about a Service Bus topic, including its subscription count and status.

Example prompts include:

- **Details topic**: "Show me runtime details about the 'product-events' topic in my 'retail-messaging' namespace."
- **Topic info**: "What's the runtime status of topic 'system-updates' in namespace 'app-messaging'?"
- **Check topic**: "Get details for topic 'notifications' in namespace 'messaging-hub'"
- **Topic status**: "Show me subscription count for topic 'events' in namespace 'app-messaging'"
- **View topic**: "Tell me about topic 'broadcast-topic' in namespace 'retail-messaging'"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Namespace** | Required | The fully qualified Service Bus namespace host name. |
| **Topic name** | Required | The name of the topic. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [servicebus topic details](../includes/tools/annotations/azure-service-bus-topic-details-annotations.md)]

## Get topic subscription runtime details

<!-- servicebus topic subscription details -->

The Azure MCP Server can retrieve runtime details about a subscription within a Service Bus topic, including message counts.

Example prompts include:

- **Details subscription**: "Show me details about subscription 'mobile-app' in topic 'notifications' in namespace 'app-messaging'."
- **Subscription info**: "What's the status of subscription 'admin' in topic 'system-updates' in namespace 'messaging-hub'?"
- **Check subscription**: "Get message count for subscription 'premium-users' in topic 'offers' in namespace 'retail-messaging'"
- **Subscription status**: "Show me details for subscription 'email-service' in topic 'notifications' in namespace 'app-messaging'"
- **View subscription**: "Tell me about subscription 'analytics' in topic 'events' in namespace 'data-messaging'"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Namespace** | Required | The fully qualified Service Bus namespace host name. |
| **Topic name** | Required | The name of the topic containing the subscription. |
| **Topic subscription name** | Required | The name of the topic subscription. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [servicebus topic subscription details](../includes/tools/annotations/azure-service-bus-topic-subscription-details-annotations.md)]

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure Service Bus](/azure/service-bus-messaging/service-bus-messaging-overview)