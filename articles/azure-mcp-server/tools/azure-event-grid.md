---
title: Azure Event Grid tools for the Azure MCP Server overview
description: Learn about the tools in Azure Event Grid for managing topics, subscriptions, and events as part of the Azure MCP Server.
ms.reviewer: anannyapatra
ms.date: 05/29/2026
ai-usage: ai-assisted
ms.service: azure-mcp-server
ms.topic: concept-article
ms.custom: build-2025
tool_count: 3
mcp-cli.version: 3.0.0-beta.14
---

# Azure Event Grid tools for the Azure MCP Server overview

The Azure MCP Server lets you manage Azure Event Grid resources by using natural language prompts. You can publish events to topics, list subscriptions, and discover topics without remembering complex syntax.

[Azure Event Grid](/azure/event-grid/overview) is a highly scalable, serverless event broker that you can use to integrate applications using events. Events are delivered by Event Grid to subscriber destinations such as applications, Azure services, or any endpoint to which Event Grid has network access. The source of those events can be other applications, SaaS services, and Azure services.

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## Events: publish

<!-- @mcpcli eventgrid events publish -->

Publish custom events to Event Grid topics for event-driven architectures. This tool sends structured event data to Event Grid topics with schema validation and delivery guarantees for downstream subscribers. Returns the publish operation status.

Example prompts include:

- "Publish an event to Event Grid topic `payment-events` using CloudEvents schema with data `{\"orderId\": \"12345\", \"amount\": 99.99}`."

- "Publish an event to my Event Grid topic `user-signups` with data `{\"userId\": \"user123\", \"email\": \"user@example.com\"}`."

- "Send an event to Event Grid topic `analytics-events` in resource group `data-processing` with data `{\"eventType\": \"click\", \"timestamp\": \"2025-12-05T10:00:00Z\"}`."

| Parameter | Required or optional | Description |
|-----------|----------------------|-------------|
| **Topic** | Required | The name of the Event Grid topic. |
| **Data** | Required | The event data as a JSON string to publish to the Event Grid topic. |
| **Schema** | Optional | The event schema type: `CloudEvents`, `EventGrid`, or `Custom`. Defaults to `EventGrid`. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ❌ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

## Subscription: list

<!-- @mcpcli eventgrid subscription list -->

List Event Grid subscriptions with optional topic filtering. This tool displays active event subscriptions, including webhook endpoints, event filters, and delivery retry policies. If you provide only a topic name without a subscription, the tool searches all accessible subscriptions for that topic. You can apply resource group and location filters only when you also specify a subscription or topic.

Example prompts include:

- "List Event Grid subscriptions for topic `payment-events`."

- "Show all Event Grid subscriptions in my subscription."

- "Show Event Grid subscriptions in resource group `notification-services`."

- "List Event Grid subscriptions for topic `analytics-events` in resource group `data-processing`."

- "List Event Grid subscriptions in location `eastus`."

| Parameter | Required or optional | Description |
|-----------|----------------------|-------------|
| **Topic** | Optional | The name of the Event Grid topic to filter subscriptions. |
| **Location** | Optional | The Azure region to filter resources by (for example, `eastus` or `westus2`). |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Topic: list

<!-- @mcpcli eventgrid topic list -->

List Event Grid topics in an Azure subscription or resource group. Returns topic names, endpoints, locations, and provisioning status.

Example prompts include:

- "Show me all the Event Grid topics in my subscription."

- "List Event Grid topics in resource group `event-processing`."

- "What Event Grid topics do I have in my `westus2` region?"

- "Show me the endpoints for all my Event Grid topics."

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure Event Grid documentation](/azure/event-grid/overview)
