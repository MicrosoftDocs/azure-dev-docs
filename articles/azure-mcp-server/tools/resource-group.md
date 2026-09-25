---
title: Azure MCP Server tools for Azure resource groups
description: Use Azure MCP Server tools to list Azure resource groups and their resources with natural language prompts from your IDE.
author: diberry
ms.author: diberry
ms.date: 09/25/2026
ms.service: azure-mcp-server
ms.topic: concept-article
ms.custom:
  - build-2025
ai-usage: ai-generated
content_well_notification:
  - AI-contribution
tool_count: 2
mcp-cli.version: "3.0.0-beta.47+bd724faf47e86348c7163a429b584aabfd714876"
---

# Azure MCP Server tools for Azure resource groups

The Azure MCP Server `group` namespace contains tools that list resource groups in a subscription and list resources in a resource group by using natural language prompts.

A resource group is a container that holds related resources for an Azure solution. For more information, see [Manage Azure resource groups](/azure/azure-resource-manager/management/manage-resource-groups-portal).

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## List resource groups

The `group_list` tool lists all resource groups in a subscription. It returns a JSON object with a `groups` array. Each entry contains the resource group's name, ID, and location. You can use the results to inventory or audit resources and drive follow-up automation.

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp group list
```

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli group list -->

Example prompts include:

- "List resource groups in my subscription."
- "Show my resource groups."
- "Display resource groups in my subscription."

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## List group resources

The `group_resource_list` tool lists all resources in a resource group. It retrieves each resource's name, ID, type, and location from Azure Resource Manager and returns a JSON object with a `resources` array containing those fields.

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp group resource list \
  --resource-group <resource-group>
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `resource-group` | string | Yes | The Azure resource group name. |

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli group resource list -->

Example prompts include:

- "List all resources in resource group 'my-rg'."
- "Show me what resources are in resource group 'webapp-dev'."
- "What resources exist in resource group 'rg-production'?"

| Parameter | Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group name** | Required | The name of the Azure resource group. A resource group is a logical container for Azure resources. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Manage Azure resource groups](/azure/azure-resource-manager/management/manage-resource-groups-portal)
