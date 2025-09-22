---
title: Azure Event Grid
description: Learn how to use the Azure MCP Server with Azure Event Grid.
keywords: azure mcp server, azmcp, kusto, azure event grid
author: diberry
ms.author: diberry
ms.date: 05/20/2025
content_well_notification: 
  - AI-contribution
ai-usage: ai-assisted
ms.topic: reference
ms.custom: build-2025
--- 
# Azure Event Grid tools for the Azure MCP Server

The Azure MCP Server allows you to manage Azure Event Grid resources using natural language prompts. You can list topics, view subscriptions, and more without remembering complex syntax.

[Azure Event Grid](/azure/event-grid/overview) is a highly scalable, serverless event broker that you can use to integrate applications using events. Events are delivered by Event Grid to subscriber destinations such as applications, Azure services, or any endpoint to which Event Grid has network access. The source of those events can be other applications, SaaS services, and Azure services.

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## Subscription: list

<!-- `azmcp eventgrid subscription list` -->

List Event Grid subscriptions with filtering and endpoint configuration. This tool shows all active 
subscriptions including webhook endpoints, event filters, and delivery retry policies. 

Example prompts include:

- **Topic in subscription**: "List Event Grid subscriptions for topic 'payment-events' in subscription"
- **View all subscriptions**: "Show all Event Grid subscriptions in my subscription"
- **Complete inventory**: "List all Event Grid subscriptions in subscription"
- **Resource group filter**: "Show Event Grid subscriptions in resource group 'notification-services' in subscription"
- **Resource group context**: "List Event Grid subscriptions for topic 'analytics-events' in resource group 'data-processing'"
- **Filter by topic**: "Show me all Event Grid subscriptions for topic 'user-signups'"
- **Location-based**: "List Event Grid subscriptions for subscription in location 'eastus'"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Topic** |  Optional | The name of the Event Grid topic. |
| **Region** |  Optional | The Azure region to filter resources by (for example, `eastus`, `westus2`). |

## Topic: list

List all Event Grid topics in an Event Grid subscription with configuration and status information. This tool retrieves
topic details including endpoints, access keys, and subscription information for event publishing and management.

Example prompts include:

- **List topics**: "Show me all the Event Grid topics in my subscription."
- **View topic details**: "List Event Grid topics in resource group 'event-processing'"
- **Check available topics**: "What Event Grid topics do I have in my 'westus2' region?"
- **Topic inventory**: "I need a list of all my Event Grid resources"
- **Find endpoints**: "Show me the endpoints for all my Event Grid topics"

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure Event Grid documentation](/event-grid/overview)