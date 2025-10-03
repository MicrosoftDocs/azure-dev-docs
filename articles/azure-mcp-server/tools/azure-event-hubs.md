---
title: Azure Event Hubs Tools
description: Learn to use the Azure MCP Server with Azure Event Hubs.
keywords: azure mcp server, azmcp, event hubs, azure services
author: diberry
ms.author: diberry
ms.date: 10/01/2025
content_well_notification:
  - AI-contribution
ai-usage: ai-assisted
ms.topic: reference
ms.custom: build-2025
---
# Azure Event Hubs tools for the Azure MCP Server

Use the Azure MCP Server to manage Azure Event Hubs resources with natural language prompts. You don't need to remember specific command syntax.

[Azure Event Hubs](/azure/event-hubs/event-hubs-about) is a native data-streaming service in the cloud that can stream millions of events per second, with low latency, from any source to any destination. Event Hubs is compatible with Apache Kafka. It enables you to run existing Kafka workloads without any code changes.

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## Namespace: Get

Get Event Hubs namespaces from Azure. The behavior depends on which parameters you provide. When you retrieve a single namespace, the system returns detailed information including SKU, settings, and metadata. When you list namespaces, the system returns the same detailed information for all namespaces in the specified scope.

Example prompts include:

- **List all namespaces**: "List all Event Hubs namespaces in my subscription"
- **Get specific namespace**: "Get the details of my namespace 'eventhub-prod' in my resource group 'production-resources'"

| Parameter | Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group** | Optional | The name of the Azure resource group. When omitted, the system lists all namespaces in the subscription. When provided without namespace, the system lists all namespaces in the resource group. Required when getting a specific namespace. |
| **Namespace** | Optional | The name of the Event Hubs namespace to retrieve. When provided, returns detailed information for the specific namespace (requires resource group). When omitted, returns a list of namespaces. |

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure Event Hubs tools](/azure/event-hubs)