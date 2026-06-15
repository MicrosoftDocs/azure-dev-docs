---
title: Azure Advisor tools for the Azure MCP Server overview
description: Learn about the tools in Azure Advisor for managing resource optimization and recommendations as part of the Azure MCP Server.
#customer intent: As an Azure admin, I want to learn how to use Azure Advisor tools so I can optimize resource performance and costs in the Azure MCP Server.
ms.date: 05/29/2026
ms.reviewer: ankiga
ms.service: azure-mcp-server
ms.topic: concept-article
ai-usage: ai-assisted
tool_count: 2
mcp-cli.version: 3.0.0-beta.14
---

# Azure Advisor tools for the Azure MCP Server overview

The Azure MCP Server lets you manage resource optimization, cost recommendations, and performance improvements with natural language prompts.

Azure Advisor is a service that gives you actionable insights to help you optimize your Azure resources and improve performance. For more about Advisor, see [Azure Advisor documentation](/azure/advisor/).

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## Apply recommendations

<!-- @mcpcli advisor recommendation apply -->

Apply Azure Advisor recommendations to infrastructure-as-code (IaC) files, such as ARM templates or Terraform configurations. This tool returns the rules that you can apply to a given Azure resource to bring it in line with Advisor guidance. Use it to review and incorporate Advisor suggestions directly into your IaC workflows.

Example prompts include:

- "Apply Advisor recommendations to my ARM template for virtual machines."

- "Apply Advisor recommendations to all IaC files in my workspace."

| Parameter | Required or optional | Description |
|-----------|----------------------|-------------|
| **Resource type** | Required | The Azure resource type for which to return applicable Advisor recommendation rules. Available options include: `aad_domainservices`, `apimanagement_service`, `cognitiveservices_accounts`, `compute_virtualmachines`, `compute_virtualmachinescalesets`, `containerregistry_registries`, `containerservice_managedclusters`, `dbforpostgresql_flexibleservers`, `documentdb_databaseaccounts`, `keyvault_vaults`, `kubernetes_connectedclusters`, `kubernetesconfiguration_extensions`, `netapp_volumes`, `network_applicationgatewaywebapplicationfirewallpolicies`, `network_expressrouteports`, `network_frontdoorwebapplicationfirewallpolicies`, `sql_managedinstances`, `storage_storageaccounts`, `web_serverfarms`, `web_staticsites`. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## List recommendations

<!-- @mcpcli advisor recommendation list -->

List Azure Advisor recommendations in a subscription. Use this tool to view actionable insights for optimizing cost, performance, reliability, security, and operational excellence across your Azure resources.

Example prompts include:

- "Show Azure Advisor recommendations for my subscription."

- "What are the current Advisor recommendations for my subscription?"

- "Show me all Azure Advisor recommendations."

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure Advisor documentation](/azure/advisor/)
