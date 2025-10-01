---
title: Azure Event Hubs Tools
description: Learn how to use the Azure MCP Server with Azure Event Hubs.
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

Get Event Hubs namespaces from Azure. This command supports three modes of operation:
- List all Event Hubs namespaces in a subscription (when no --resource-group is provided)
- List all Event Hubs namespaces in a specific resource group (when only --resource-group is provided)
- Get a single namespace by name (using --namespace with --resource-group)

When retrieving a single namespace, detailed information including SKU, settings, and metadata 
is returned. When listing namespaces, the same detailed information is returned for all 
namespaces in the specified scope.

The [resource group parameter](index.md#tool-parameters) is optional for listing operations but required when getting a specific namespace.

Example prompts include:

- **List all namespaces**: "List all Event Hubs namespaces in my subscription"
- **Get specific namespace**: "Get the details of my namespace 'eventhub-prod' in my resource group 'production-resources'"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group** |  Optional | The name of the Azure resource group. This is a logical container for Azure resources. |
| **Namespace** |  Optional | The name of the Event Hubs namespace to retrieve. Must be used with --resource-group option. |