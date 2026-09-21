---
title: Azure MCP Server tools for Azure IoT Hub
description: Use Azure MCP Server tools to manage Azure IoT Hub resources with natural language prompts from your IDE.
ms.service: azure-mcp-server
ms.topic: concept-article
tool_count: 2
mcp-cli.version: 3.0.0-beta.36+b9f596ccb94e20ed8bacd41c2a9d666e6785b476
author: diberry
ms.author: diberry
ms.reviewer: rrao
ms.date: 08/21/2026
ai-usage: ai-generated
ms.custom: build-2025
content_well_notification:
  - AI-contribution
---

# Azure MCP Server tools for Azure IoT Hub

The Azure Model Context Protocol (MCP) Server lets you manage Azure IoT Hub resources with natural language prompts. You can list registered devices and get details about an IoT hub.

Azure IoT Hub enables secure, bidirectional communication between IoT devices and cloud backends. For more information, see [Azure IoT Hub documentation](/azure/iot-hub/).

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## Device: List

Lists device identity metadata in an Azure IoT Hub device registry without returning authentication keys. Use the max count parameter to limit results. The default and maximum value is `100`; larger values return an error. If more devices exist, the response sets `truncated=true`. Hub names and IDs are case-sensitive and must match exactly.

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp iothub device list \
  --hub-name <hub-name> \
  --resource-group <resource-group> \
  [--max-count <max-count>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `hub-name` | string | Yes | The name of the IoT Hub. |
| `resource-group` | string | Yes | The Azure resource group name. |
| `max-count` | string | No | The maximum number of items to return per page. Defaults to `100` when not specified. Values greater than `100` are rejected with an error. |

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli iothub device list -->

Example prompts include:

- "List devices in IoT Hub \<hub_name\> in resource group \<resource_group_name\>"
- "Show all devices registered to IoT Hub \<hub_name\>"
- "Get the device registry for IoT Hub \<hub_name\> in subscription \<subscription_id\>"

| Parameter | Required or optional | Description |
|-----------|----------------------|-------------|
| **Hub name** | Required | The name of the IoT Hub. |
| **Resource group** | Required | The name of the Azure resource group. This resource group is a logical container for Azure resources. |
| **Max count** | Optional | The maximum number of items to return per page. Defaults to `100` when not specified. Values greater than `100` are rejected with an error. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |

## Hub: Get

Retrieves details for an Azure IoT Hub by name in a resource group and subscription. Returns the IoT hub's `id`, `name`, `location`, `resourceGroup`, `subscriptionId`, `sku`, `capacity`, `state`, and `hostName`.

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp iothub hub get \
  --hub-name <hub-name> \
  --resource-group <resource-group>
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `hub-name` | string | Yes | The name of the IoT Hub. |
| `resource-group` | string | Yes | The Azure resource group name. |

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli iothub hub get -->

Example prompts include:

- "Get details for IoT Hub \<hub_name\> in resource group \<resource_group_name\>"
- "Show IoT Hub \<hub_name\> in resource group \<resource_group_name\> for subscription \<subscription_id\>"
- "Retrieve IoT Hub \<hub_name\> metadata from resource group \<resource_group_name\>"

| Parameter | Required or optional | Description |
|-----------|----------------------|-------------|
| **Hub name** | Required | The name of the IoT Hub. |
| **Resource group** | Required | The name of the Azure resource group. This resource group is a logical container for Azure resources. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
