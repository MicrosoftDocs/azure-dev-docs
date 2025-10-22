---
title: Azure Event Hubs Tools
description: Learn to use Azure MCP Server tools to manage Event Hubs resources with natural language prompts. Create, update, and delete namespaces and consumer groups.
keywords: azure mcp server, azmcp, event hubs, azure services
author: diberry
ms.author: diberry
ms.date: 10/15/2025
content_well_notification:
  - AI-contribution
ai-usage: ai-assisted
ms.topic: reference
ms.custom: build-2025
---
# Azure Event Hubs tools for the Azure MCP Server

The Azure MCP Server lets you manage Azure Event Hubs resources with natural language prompts. You don't need to remember specific command syntax.

[Azure Event Hubs](/azure/event-hubs/event-hubs-about) is a native data-streaming service in the cloud that streams millions of events per second, with low latency, from any source to any destination. Event Hubs is compatible with Apache Kafka and lets you run existing Kafka workloads without any code changes.

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## Event Hub: Delete consumer group

Delete a consumer group from the specified Event Hub.

Example prompts include: 

- **Delete specific consumer group**: "Delete consumer group 'analytics-group' from Event Hub 'orders-hub' in namespace 'eventhub-prod'"
- **Remove consumer group**: "Remove the consumer group 'monitoring-consumers' from my Event Hub 'telemetry-events' in namespace 'prod-eventhubs'"
- **Clean up consumer group**: "Delete the consumer group 'test-group' from Event Hub 'user-events' in the 'development-eventhubs' namespace"


| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Namespace** |  Required | The name of the Event Hubs namespace. |
| **Event hub** |  Required | The name of the Event Hub within the namespace. |
| **Consumer group** |  Required | The name of the consumer group within the Event Hub. |

## Event Hub: Get consumer group

Get consumer groups from Azure Event Hubs. This tool can:

- List all consumer groups in an Event Hub
- Get a single consumer group by name

The event hub and namespace parameters are required for both get and list. You only need the consumer group parameter when getting a specific consumer group.

Example prompts include:

- **List all consumer groups**: "List all consumer groups in Event Hub 'orders-hub' in namespace 'eventhub-prod' in resource group 'production-resources'"
- **Get specific consumer group**: "Get details of consumer group 'analytics-group' from Event Hub 'orders-hub' in namespace 'eventhub-prod' in resource group 'production-resources'"
- **Show consumer group info**: "Show me the consumer group 'monitoring-consumers' from Event Hub 'telemetry-events'"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Namespace** |  Required | The name of the Event Hubs namespace. |
| **Event hub** |  Required | The name of the Event Hub within the namespace. |
| **Consumer group** |  Optional | The name of the consumer group within the Event Hub. |

## Event Hub: Create or update consumer group

Create or update a consumer group within the specified Event Hub. The tool creates a new consumer group or updates an existing one.

Example prompts include:

- **Create new consumer group**: "Create a new consumer group 'analytics-group' in Event Hub 'orders-hub' in namespace 'eventhub-prod' in resource group 'production-resources'"
- **Update existing consumer group**: "Update the consumer group 'analytics-group' in Event Hub 'orders-hub' in namespace 'eventhub-prod' in resource group 'production-resources' with user metadata 'Updated for Q4 analytics'"
- **Set up consumer group**: "Set up a consumer group 'monitoring-consumers' in Event Hub 'telemetry-events'"


| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Namespace** |  Required | The name of the Event Hubs namespace. |
| **Event hub** |  Required | The name of the Event Hub within the namespace. |
| **Consumer group** |  Required | The name of the consumer group within the Event Hub. |
| **User metadata** |  Optional | User metadata for the consumer group. |

## Event Hub: Delete Event Hub    

Delete an event hub from an Azure Event Hubs namespace. This action permanently deletes all messages and consumer groups in the Event Hub.

Example prompts include:

- **Delete specific Event Hub**: "Delete Event Hub 'orders-hub' from namespace 'eventhub-prod' in resource group 'production-resources'"
- **Remove Event Hub**: "Remove the Event Hub 'telemetry-events' from my 'prod-eventhubs' namespace in resource group 'production-resources'"
- **Clean up Event Hub**: "Delete the Event Hub 'test-events' from namespace 'dev-eventhubs'"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Namespace** |  Required | The name of the Event Hubs namespace. |
| **Event hub** |  Required | The name of the Event Hub within the namespace. |

## Event Hub: Get Event Hub

<!-- `azmcp eventhubs eventhub get` -->

Get event hubs from an Azure namespace. This tool:

- List all event hubs in a namespace
- Get a single event hub by name

When you retrieve a single event hub or list multiple event hubs, the command returns detailed information for all event hubs, including partition count, settings, and metadata.

Example prompts include:

- **List all Event Hubs**: "List all Event Hubs in my 'prod-eventhubs' namespace in resource group 'production-resources'"
- **Get specific Event Hub**: "Get the details of my Event Hub 'orders-hub' in namespace 'eventhub-prod' in resource group 'production-resources'"
- **Show Event Hub info**: "Show me the Event Hub 'telemetry-events' from namespace 'monitoring-hubs'"


| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Namespace** |  Required | The name of the Event Hubs namespace. |
| **Event hub** |  Optional | The name of the Event Hub within the namespace. |

## Namespace: Delete namespace

Delete an Event Hubs namespace. This operation is irreversible and permanently deletes all event hubs, consumer groups, and configurations within the namespace.

Example prompts include:

- **Delete specific namespace**: "Delete event hub namespace 'eventhub-prod' in resource group 'production-resources'"
- **Remove namespace**: "Remove the Event Hubs namespace 'test-eventhubs'"
- **Clean up namespace**: "Delete the namespace 'dev-eventhubs' permanently"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Namespace** |  Required | The name of the Event Hubs namespace. |


## Namespace: Get namespace

Get Event Hubs namespaces from Azure. The behavior depends on which parameters you provide. When you retrieve a single namespace, the tool returns detailed information including SKU, settings, and metadata. When you list namespaces, the tool returns the same detailed information for all namespaces in the specified scope.

Example prompts include:

- **List all namespaces**: "List all event hub namespaces in my subscription"
- **Get specific namespace**: "Get the details of my namespace 'eventhub-prod' in my resource group 'production-resources'"
- **Show namespace info**: "Show me the namespace 'monitoring-hubs' details"

| Parameter | Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group** | Optional | The name of the Azure resource group. When omitted, the system lists all namespaces in the subscription. When provided without namespace, the system lists all namespaces in the resource group. Required when getting a specific namespace. |
| **Namespace** | Optional | The name of the Event Hubs namespace to retrieve. When provided, returns detailed information for the specific namespace (requires resource group). When omitted, returns a list of namespaces. |

## Namespace: Create or update namespace

Create or update a namespace within the specified resource group. This tool creates a new namespace or updates an existing one. The tool might modify existing configurations and is considered destructive. This tool might take a long time.

When updating an existing namespace, provide only the properties you want to change. Unspecified properties keep their existing values. You must provide at least one update property.

Common update scenarios include:

- Scale up or down by changing the SKU tier or capacity
- Enable or disable auto-inflate and set the maximum throughput units
- Enable or disable Kafka support
- Modify tags for resource management
- Enable or disable zone redundancy (Premium SKU only)

Example prompts include:

- **Create new namespace**: "Create a new Event Hubs namespace 'production-events' in East US"
- **Update namespace capacity**: "Update my namespace 'eventhub-prod' to increase capacity to 10 throughput units"
- **Enable Kafka support**: "Enable Kafka on my Event Hubs namespace 'monitoring-hubs'"


| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Namespace** |  Required | The name of the Event Hubs namespace. |
| **Location** |  Optional | The Azure region where the namespace is located (for example, `eastus`, `westus2`). |
| **SKU name** |  Optional | The SKU name for the namespace. Valid values: `Basic`, `Standard`, `Premium`. |
| **SKU tier** |  Optional | The SKU tier for the namespace. Valid values: `Basic`, `Standard`, `Premium`. |
| **SKU capacity** |  Optional | The SKU capacity (throughput units) for the namespace. The valid range depends on the SKU. |
| **Is auto inflate enabled** |  Optional | Enable or disable auto-inflate for the namespace. |
| **Maximum throughput units** |  Optional | The maximum throughput units when auto-inflate is enabled. |
| **Kafka enabled** |  Optional | Enable or disable Kafka for the namespace. |
| **Zone redundant** |  Optional | Enable or disable zone redundancy for the namespace. |
| **Tags** |  Optional | Tags for the namespace in JSON format (for example, `{"key1":"value1","key2":"value2"}`). |

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure Event Hubs tools](/azure/event-hubs)