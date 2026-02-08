---
title: Azure Migrate tools for the Azure MCP Server overview
description: Learn about the tools available in Azure Migrate for managing migration planning and request handling as part of the Azure MCP Server.
ms.date: 02/08/2026
ms.reviewer: akrohill
keywords: Azure, MCP Server, Azure Migrate, migration, planning, tools
ms.service: azure-mcp-server
ms.topic: concept-article
tool_count: 2
---

# Azure Migrate tools for the Azure MCP Server overview

The Azure MCP Server lets you manage migration planning, guidance retrieval, and request submissions with natural language prompts.

Azure Migrate provides a centralized hub for assessing and migrating on-premises workloads to Azure. For more information, see [Azure Migrate documentation](/azure/migrate/).

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## Get guidance for landing zone

<!-- @mcpcli azuremigrate platformlandingzone getguidance -->

Get how-to guidance for modifying, configuring, or customizing an existing Platform Landing Zone. 

**Example prompts:**
- "How do I turn off Bastion in my Platform Landing Zone?"
- "Get guidance on changing resource naming prefixes for my Landing Zone."
- "Show me how to enable DDoS protection for my Platform Landing Zone."
- "I need instructions to adjust CIDR ranges in my Platform Landing Zone."
- "What steps do I take to disable the Azure Monitoring Agent in my Platform Landing Zone?"

| Parameter | Required or optional | Description |
|-----------|----------------------|-------------|
| **Scenario** | Required | The modification scenario key. Use a valid value that matches your request, like `resource-names` or `ddos`. The system recognizes these values in your prompt and maps them to the right guidance. Valid values include: `resource-names`, `management-groups`, `ddos`, `bastion`, `dns`, `gateways`, `regions`, `ip-addresses`, `policy-enforcement`, `policy-assignment`, `ama`, `amba`, `defender`, `zero-trust`, `slz`. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ✅ | Idempotent: ✅ | Open World: ✅ | Read Only: ❌ | Secret: ❌ | Local Required: ✅

## Create platform landing zone request

<!-- @mcpcli azuremigrate platformlandingzone request -->

Generate and download platform landing zone configurations for Azure Migrate projects. You can update parameters, check existing landing zones, and view the status of parameters.

**Example prompts:**
- "Check if a platform landing zone exists for resource group 'rg-prod' and project name 'migrateProject1'."
- "I want to update parameters for the project 'migrateProject1' in resource group 'rg-dev'."
- "Generate a platform landing zone in resource group 'rg-prod' for project 'migrateProject1'."
- "Download the generated files for 'migrateProject1' located in resource group 'rg-prod'."
- "View the parameter status for resource group 'rg-test' and project name 'migrateProject2'."

| Parameter                    | Required or Optional | Description |
|------------------------------|----------------------|-------------|
| **Resource group**           | Required             | The name of the Azure resource group, which acts as a logical container for Azure resources. |
| **Action**                   | Required             | The action to perform. Valid actions are: update to set parameters, check to check an existing platform landing zone, generate to create a platform landing zone, download to retrieve download instructions, or status to view parameter status. |
| **Migrate project name**     | Required             | The name of the Azure Migrate project used for Platform Landing Zone generation context. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ✅ | Idempotent: ✅ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ✅

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure Migrate documentation](/azure/migrate/)