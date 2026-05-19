---
title: Azure MCP Server tools for Azure Resource Group
description: Use Azure MCP Server tools to manage Azure resource groups and their resources with natural language prompts from your IDE.
ms.date: 03/27/2026
ms.service: azure-mcp-server
ms.topic: concept-article
tool_count: 2
mcp-cli.version: 2.0.0-beta.33+8fab340d1e64d47701d891b7e81b5def64bbc9f6
author: diberry
ms.author: diberry
ai-usage: ai-generated
ms.custom: build-2025
content_well_notification:
  - AI-contribution
---

# Azure MCP Server tools for Azure Resource Group

The Azure MCP Server lets you manage resource groups and the resources they contain, including: listing resource groups in a subscription and listing resources within a group, with natural language prompts.

Azure Resource Group is the Azure service for organizing and managing related resources as a single lifecycle and access boundary. For more information, see [Azure Resource Group documentation](/azure/azure-resource-manager/management/manage-resource-groups-portal).

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## List resource groups

<!-- @mcpcli group list -->

List all resource groups in a subscription. The tool returns resource group names and IDs as a JSON array, which you can use to inventory or audit resources and to drive follow-up automation.

Example prompts include:

- "List resource groups in my subscription."
- "Show my resource groups."
- "Display resource groups in my subscription."

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## List group resources

<!-- @mcpcli group resource list -->

List all resources in a resource group. The tool retrieves each resource's name, ID, type, and location from Azure Resource Manager and returns a JSON object with a `resources` array containing those fields.

Example prompts include:

- "List all resources in resource group 'my-rg'."
- "Show me what resources are in resource group 'webapp-dev'."
- "What resources exist in resource group 'rg-production'?"

| Parameter | Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group name** | Required | The name of the Azure resource group. A resource group is a logical container for Azure resources. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure Resource Group documentation](/azure/azure-resource-manager/management/manage-resource-groups-portal)
