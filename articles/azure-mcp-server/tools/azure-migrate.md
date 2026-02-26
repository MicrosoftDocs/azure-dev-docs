---
title: Azure Migrate tools for the Azure MCP Server overview
description: Learn about the tools available in Azure Migrate for managing migration planning and request handling as part of the Azure MCP Server.
ms.date: 02/25/2026
ms.reviewer: akrohill
keywords: Azure, MCP Server, Azure Migrate, migration, planning, tools
ms.service: azure-mcp-server
ms.topic: concept-article
tool_count: 2
mcp-cli.version: 2.0.0-beta.22+b6fc38c7fd6e025a7fd1dff42e49516225cae21b
---

# Azure Migrate tools for the Azure MCP Server overview

The Azure MCP Server lets you manage migration planning, guidance retrieval, and request submissions with natural language prompts.

Azure Migrate provides a centralized hub for assessing and migrating on-premises workloads to Azure. For more information, see [Azure Migrate documentation](/azure/migrate/).

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## Get guidance for landing zone

<!-- @mcpcli azuremigrate platformlandingzone getguidance -->

Get how-to guidance for modifying, configuring, or customizing an existing Platform Landing Zone. 

Example prompts include:

- "How do I turn off Bastion in my Platform Landing Zone?"
- "Get guidance on changing resource naming prefixes for my Landing Zone."
- "Show me how to enable DDoS protection for my Platform Landing Zone."
- "I need instructions to adjust CIDR ranges in my Platform Landing Zone."
- "What steps do I take to disable the Azure Monitoring Agent in my Platform Landing Zone?"

| Parameter | Required or optional | Description |
|-----------|----------------------|-------------|
| **Scenario** | Required | The modification scenario key. |
| **Policy name** | Optional | The policy assignment name to look up (for example, `Enable-DDoS-VNET`). Used with `policy-enforcement` or `policy-assignment` scenarios. |
| **List policies** | Optional | Set to true to list all available policies organized by archetype. Useful for finding the exact policy name. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ✅ | Idempotent: ✅ | Open World: ✅ | Read Only: ❌ | Secret: ❌ | Local Required: ✅


## Request platform landing zone

<!-- @mcpcli azuremigrate platformlandingzone request -->

Generate and download platform landing zone configurations for Azure Migrate projects, update parameters, check existing landing zones, review parameter statuses and create a new Azure Migrate project if one doesn't exist.

Example prompts include:

- "Check if a platform landing zone exists for Azure Migrate project 'migrate-project-1' in resource group 'rg-prod'."
- "Update the parameters for the platform landing zone related to 'migrate-project-1' in resource group 'rg-dev'."
- "Generate the platform landing zone for Azure Migrate project 'migrate-project-2' located in resource group 'rg-test'."
- "Download the landing zone files for Azure Migrate project 'migrate-project-3' in resource group 'rg-production'."
- "What is the current status of parameters for Azure Migrate project 'migrate-project-4' in resource group 'rg-staging'?"

| Parameter                     | Required or Optional | Description                                                                                             |
|-------------------------------|----------------------|---------------------------------------------------------------------------------------------------------|
| **Resource group**            | Required             | The name of the Azure resource group. This is a logical container for Azure resources.                  |
| **Migrate project name**      | Required             | The Azure Migrate project name for Platform Landing Zone generation context.                                           |
| **Action**                    | Required             | The action to perform: `update` (set parameters), `check` (check existing platform landing zone), `generate` (generate platform landing zone), `download` (get download instructions), `status` (view parameter status), `createmigrateproject` (create a new Azure Migrate project if one doesn't exist, requires location parameter). |
| **Region type**               | Optional             | The region type for the Platform Landing Zone. Allowed values: `single`, `multi`. |
| **Firewall type**             | Optional             | The firewall type for the Platform Landing Zone. Allowed values: `azurefirewall`, `nva`. |
| **Network architecture**      | Optional             | The network architecture for the Platform Landing Zone. Allowed values: `hubspoke`, `vwan`. |
| **Identity subscription ID**   | Optional             | The Azure subscription ID for the identity management group in the Platform Landing Zone (GUID format). |
| **Management subscription ID** | Optional             | The Azure subscription ID for the management group in the Platform Landing Zone (GUID format). |
| **Connectivity subscription ID** | Optional           | The Azure subscription ID for the connectivity group in the Platform Landing Zone (GUID format). |
| **Regions**                   | Optional             | Comma-separated list of Azure regions for the Platform Landing Zone (for example, `eastus,westus2`). |
| **Environment name**          | Optional             | The environment name for the Platform Landing Zone. |
| **Version control system**     | Optional             | The version control system for the Platform Landing Zone. Allowed values: `local`, `github`, `azuredevops`. |
| **Organization name**         | Optional             | The organization name for the Platform Landing Zone. |
| **Migrate project resource ID** | Optional           | The full resource ID of the Azure Migrate project for the Platform Landing Zone (alternative to `subscription/resourceGroup/migrateProjectName`).  |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):
Destructive: ✅ | Idempotent: ✅ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ✅

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure Migrate documentation](/azure/migrate/)