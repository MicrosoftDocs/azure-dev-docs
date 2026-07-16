---
title: Azure MCP Server tools for Azure Advisor
description: Azure MCP Server tools manage Azure Advisor recommendations and optimizations with natural language prompts from your IDE.
ms.date: 07/14/2026
ms.service: azure-mcp-server
ms.topic: concept-article
tool_count: 4
mcp-cli.version: "3.0.0-beta.21+76f73ff9c7a9a9cf5012710e1d2c1007b87724bb"
author: diberry
ms.author: diberry
ms.reviewer: ankiga 
ai-usage: ai-generated
ms.custom: build-2025
content_well_notification:
  - AI-contribution
---

# Azure MCP Server tools for Azure Advisor

The Azure MCP Server helps you manage Azure Advisor recommendations by using natural language prompts. You can apply, list, and summarize recommendations.

Azure Advisor is an Azure service that provides recommendations to help you optimize reliability, security, performance, operational excellence, and cost. For more information, see [Azure Advisor documentation](/azure/advisor/).

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]


## Recommendation: apply

Apply Azure Advisor recommendations to infrastructure-as-code (IaC) files, such as Azure Resource Manager templates and Terraform configurations. You provide an Azure resource type with `--resource`, and the tool returns the Advisor rules that you can apply to your IaC file to improve cost, performance, reliability, or security.

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp advisor recommendation apply \
  --resource <resource>
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `resource` | string | Yes | The Azure resource type for which to get rules to apply to an IaC file. Available options: `aad_domainservices`, `apimanagement_service`, `cognitiveservices_accounts`, `compute_virtualmachines`, `compute_virtualmachinescalesets`, `containerregistry_registries`, `containerservice_managedclusters`, `dbforpostgresql_flexibleservers`, `documentdb_databaseaccounts`, `keyvault_vaults`, `kubernetes_connectedclusters`, `kubernetesconfiguration_extensions`, `netapp_volumes`, `network_applicationgatewaywebapplicationfirewallpolicies`, `network_expressrouteports`, `network_frontdoorwebapplicationfirewallpolicies`, `sql_managedinstances`, `storage_storageaccounts`, `web_serverfarms`, `web_staticsites` |

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli advisor recommendation apply -->

Example prompts include:

- "Apply Advisor recommendations to this ARM template for resource `compute_virtualmachines`."
- "Apply Advisor recommendations to this Terraform file for Storage Account `storage_storageaccounts`."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource name** |  Required | The Azure resource type for which to get rules to apply to an IaC file. Available options: `aad_domainservices`, `apimanagement_service`, `cognitiveservices_accounts`, `compute_virtualmachines`, `compute_virtualmachinescalesets`, `containerregistry_registries`, `containerservice_managedclusters`, `dbforpostgresql_flexibleservers`, `documentdb_databaseaccounts`, `keyvault_vaults`, `kubernetes_connectedclusters`, `kubernetesconfiguration_extensions`, `netapp_volumes`, `network_applicationgatewaywebapplicationfirewallpolicies`, `network_expressrouteports`, `network_frontdoorwebapplicationfirewallpolicies`, `sql_managedinstances`, `storage_storageaccounts`, `web_serverfarms`, `web_staticsites`. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## Recommendation: list

Retrieve individual Azure Advisor recommendation records, one row per recommendation, for a subscription. You receive only active recommendations with status `New`. Dismissed and postponed recommendations are excluded. Use filters for category, impact, resource type, resource, and search to narrow results. The top parameter caps the number of returned items; it defaults to 50 and has a maximum of 100. Results are capped at 100 items and might undercount when you need full-population aggregates or counts.

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp advisor recommendation list \
  [--resource-group <resource-group>] \
  [--category <category>] \
  [--impact <impact>] \
  [--resource-type <resource-type>] \
  [--resource <resource>] \
  [--search <search>] \
  [--top <top>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `category` | string | No | Filter recommendations by category (for example, `Security`, `Cost`, `Performance`, `HighAvailability`, `OperationalExcellence`). Case-insensitive exact match. |
| `impact` | string | No | Filter recommendations by business impact (`High`, `Medium`, or `Low`). Case-insensitive exact match. |
| `resource` | string | No | Filter recommendations by impacted resource name or full ARM resource ID. Case-insensitive substring match. |
| `resource-type` | string | No | Filter recommendations by impacted Azure resource type (for example, `Microsoft.Storage/storageAccounts`). Case-insensitive exact match. |
| `search` | string | No | Free-text filter applied to the recommendation problem text (case-insensitive substring match). Use this whenever the user's request includes a topical phrase such as 'related to Microsoft Foundry', 'about encryption', 'mentioning right-size', or 'for Key Vault'. Extract the salient noun(s) from the phrase (for example, `Foundry`, `encrypt`, `right-size`, `Key Vault`) and pass them here. |
| `top` | string | No | Maximum number of items to return. For `list`: defaults to 50, clamped to 1-100 (server-side limit). For `summary`: optional display cap on the number of buckets returned (defaults to all). TotalRecommendations always reflects the complete filtered population regardless of top. |
| `resource-group` | string | No | The name of the Azure resource group. The resource group is a logical container for Azure resources. |

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli advisor recommendation list -->

Example prompts include:

- "List all Advisor recommendations in subscription `my-subscription`."
- "Show me Advisor recommendations in subscription `prod-subscription`."
- "List all Advisor recommendations in subscription `contoso-subscription`."
- "Show me category `Security` recommendations with impact `High` in subscription `security-subscription`."
- "List category `Cost` recommendations for resource type `Microsoft.Storage/storageAccounts` in subscription `billing-subscription`."
- "Find Advisor recommendations with search `right-size` in subscription `ops-subscription`."
- "Show me the top `10` Advisor recommendations in subscription `priority-subscription`."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Category** |  Optional | Filter recommendations by category (for example, `Security`, `Cost`, `Performance`, `HighAvailability`, `OperationalExcellence`). Case-insensitive exact match. |
| **Impact** |  Optional | Filter recommendations by business impact (`High`, `Medium`, or `Low`). Case-insensitive exact match. |
| **Resource name** |  Optional | Filter recommendations by impacted resource name or full ARM resource ID. Case-insensitive substring match. |
| **Resource type** |  Optional | Filter recommendations by impacted Azure resource type (for example, `Microsoft.Storage/storageAccounts`). Case-insensitive exact match. |
| **Search** |  Optional | Free-text filter applied to the recommendation problem text (case-insensitive substring match). Use this whenever the user's request includes a topical phrase such as 'related to Microsoft Foundry', 'about encryption', 'mentioning right-size', or 'for Key Vault'. Extract the salient noun(s) from the phrase (for example, `Foundry`, `encrypt`, `right-size`, `Key Vault`) and pass them here. |
| **Top** |  Optional | Maximum number of items to return. For `list`: defaults to 50, clamped to 1-100 (server-side limit). For `summary`: optional display cap on the number of buckets returned (defaults to all). TotalRecommendations always reflects the complete filtered population regardless of `top`. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## Recommendation: summary

Aggregates Azure Advisor recommendations and returns per-bucket counts and a true total. The tool answers count, ranking, and distribution questions over your active recommendations, such as "how many", "top N", "which X has the most", "breakdown by field", "distribution of", and "count of" queries.

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp advisor recommendation summary \
  [--resource-group <resource-group>] \
  [--group-by <group-by>] \
  [--top <top>] \
  [--category <category>] \
  [--impact <impact>] \
  [--resource-type <resource-type>] \
  [--resource <resource>] \
  [--search <search>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `category` | string | No | Filter recommendations by category (for example, `Security`, `Cost`, `Performance`, `HighAvailability`, `OperationalExcellence`). Case-insensitive exact match. |
| `group-by` | string | No | Optional field to group the summary by. One of: `recommendation-type`, `category`, `impact`, `resource-type`. Defaults to `category` when omitted, which surfaces the high-level themes (Cost, Security, Reliability, and more) so prompts like 'summarize the key themes from my Advisor recommendations' work without naming a field. |
| `impact` | string | No | Filter recommendations by business impact (`High`, `Medium`, or `Low`). Case-insensitive exact match. |
| `resource` | string | No | Filter recommendations by impacted resource name or full ARM resource ID. Case-insensitive substring match. |
| `resource-type` | string | No | Filter recommendations by impacted Azure resource type (for example, `Microsoft.Storage/storageAccounts`). Case-insensitive exact match. |
| `search` | string | No | Free-text filter applied to the recommendation problem text (case-insensitive substring match). Use this whenever the user's request includes a topical phrase such as 'related to Microsoft Foundry', 'about encryption', 'mentioning right-size', or 'for Key Vault'. Extract the salient noun(s) from the phrase (for example, `Foundry`, `encrypt`, `right-size`, `Key Vault`) and pass them here. |
| `top` | string | No | Maximum number of items to return. For `list`: defaults to 50, clamped to 1-100 (server-side limit). For `summary`: optional display cap on the number of buckets returned (defaults to all). TotalRecommendations always reflects the complete filtered population regardless of top. |
| `resource-group` | string | No | The name of the Azure resource group. The resource group is a logical container for Azure resources. |

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli advisor recommendation summary -->

Example prompts include:

- "Summarize the key themes from my Advisor recommendations in subscription `my-subscription`."
- "Summarize Advisor recommendations in subscription `my-subscription` grouped by `category`."
- "Show the top `10` most common Advisor recommendations in subscription `my-subscription`."
- "Group Advisor recommendations by `impact` in subscription `my-subscription`."
- "Which resource types have the most recommendations with impact `High` in subscription `my-subscription`?"
- "Summarize recommendations in category `Security` with impact `High` grouped by `resource-type` in subscription `my-subscription`."
- "Group recommendations in category `Cost` for resource-type `Microsoft.Storage/storageAccounts` by `impact` in subscription `my-subscription`."
- "Summarize Advisor recommendations matching search `encryption` grouped by `category` in subscription `my-subscription`."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Category** |  Optional | Filter recommendations by category (for example, `Security`, `Cost`, `Performance`, `HighAvailability`, `OperationalExcellence`). Case-insensitive exact match. |
| **Group by** |  Optional | Optional field to group the summary by. One of: `recommendation-type`, `category`, `impact`, `resource-type`. Defaults to `category` when omitted, which surfaces the high-level themes (Cost, Security, Reliability, and more) so prompts like 'summarize the key themes from my Advisor recommendations' work without naming a field. |
| **Impact** |  Optional | Filter recommendations by business impact (`High`, `Medium`, or `Low`). Case-insensitive exact match. |
| **Resource name** |  Optional | Filter recommendations by impacted resource name or full ARM resource ID. Case-insensitive substring match. |
| **Resource type** |  Optional | Filter recommendations by impacted Azure resource type (for example, `Microsoft.Storage/storageAccounts`). Case-insensitive exact match. |
| **Search** |  Optional | Free-text filter applied to the recommendation problem text (case-insensitive substring match). Use this whenever the user's request includes a topical phrase such as 'related to Microsoft Foundry', 'about encryption', 'mentioning right-size', or 'for Key Vault'. Extract the salient noun(s) from the phrase (for example, `Foundry`, `encrypt`, `right-size`, `Key Vault`) and pass them here. |
| **Top** |  Optional | Maximum number of items to return. For `list`: defaults to 50, clamped to 1-100 (server-side limit). For `summary`: optional display cap on the number of buckets returned (defaults to all). TotalRecommendations always reflects the complete filtered population regardless of `top`. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## Recommendation type: list

List the catalog of Azure Advisor recommendation types. Results include the recommendation category, impact, targeted resource type, and subcategory. Results sort by impact (`High`, `Medium`, `Low`), so the most important recommendations appear first.

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp advisor recommendation-type list \
  [--resource-type <resource-type>] \
  [--impact <impact>] \
  [--category <category>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `category` | string | No | Optional Advisor category filter. Typical values: `Cost`, `HighAvailability`, `Security`, `Performance`, `OperationalExcellence` (case-insensitive). New categories to be supported by Advisor in the future will still match. |
| `impact` | string | No | Optional impact level filter. Allowed values: `High`, `Medium`, `Low` (case-insensitive). When omitted, results contain all impact levels but are still sorted High, Medium, Low. |
| `resource-type` | string | No | Optional Azure resource type to narrow results to (for example, `microsoft.compute/virtualmachines`, `microsoft.sql/servers`). Matched case-insensitively against the `supportedResourceType` field on each recommendation type. Use this parameter when onboarding a new resource type to see only the recommendations Advisor generates for it. |

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli advisor recommendation-type list -->

Example prompts include:

- "Show the catalog of Advisor recommendation types available in my tenant."
- "Before I deploy virtual machines, what kinds of recommendations could Advisor produce for them?"
- "What recommendation types does Advisor have for resource type `microsoft.sql/servers/databases`, filtered to impact `High`?"
- "Show the catalog of recommendations in category `Cost` that Advisor can generate for storage accounts."
- "My tenant is brand new and has no Advisor recommendations yet; what kinds of recommendations could Advisor make?"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Category** |  Optional | Optional Advisor category filter. Typical values: `Cost`, `HighAvailability`, `Security`, `Performance`, `OperationalExcellence` (case-insensitive). New categories to be supported by Advisor in the future will still match. |
| **Impact** |  Optional | Optional impact level filter. Allowed values: `High`, `Medium`, `Low` (case-insensitive). When omitted, results contain all impact levels but are still sorted High, Medium, Low. |
| **Resource type** |  Optional | Optional Azure resource type to narrow results to (for example `microsoft.compute/virtualmachines`, `microsoft.sql/servers`). Matched case-insensitively against the `supportedResourceType` field on each recommendation type. Use this parameter when onboarding a new resource type to see only the recommendations Advisor generates for it. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure Advisor documentation](/azure/advisor/)
