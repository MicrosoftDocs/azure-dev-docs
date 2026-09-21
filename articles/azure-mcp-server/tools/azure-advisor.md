---

title: Azure MCP Server tools for Azure Advisor
description: Use Azure MCP Server tools with natural language prompts or Azure MCP CLI commands to manage Azure Advisor recommendations and optimizations.
ms.date: 08/24/2026
ms.service: azure-mcp-server
ms.topic: concept-article
tool_count: 5
mcp-cli.version: 3.0.0-beta.36+b9f596ccb94e20ed8bacd41c2a9d666e6785b476
author: diberry
ms.author: diberry
ms.reviewer: ankiga 
ai-usage: ai-generated
content_well_notification:
  - AI-contribution
---

# Azure MCP Server tools for Azure Advisor

The Azure MCP Server helps you manage Azure Advisor resources, including applying recommendations, getting details, listing recommendations, and providing summaries, all through natural language prompts.

Azure Advisor analyzes your Azure resources and delivers personalized, actionable recommendations to optimize cost, performance, reliability, and security. For more information, see [Azure Advisor documentation](/azure/advisor/).

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]


## Metadata: Get

Gets Azure Advisor metadata for a specific recommendation type. Returns the recommendation type's display name, category, subcategory, impact, supported resource types, description, potential benefits, and remediation actions. Use the metadata to understand the recommendation, assess its impact, and plan remediation steps.

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp advisor metadata get \
  --recommendation-type-id <recommendation-type-id> \
  [--language <language>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `recommendation-type-id` | string | Yes | The stable Advisor recommendation type ID (`properties.recommendationTypeId`) to look up in the global recommendation-metadata catalog. This ID is the join key shared with individual recommendations. |
| `language` | string | No | Catalog locale to filter on (`properties.language`). Defaults to `en`. Case-insensitive. Supported values: `en`, `cs`, `de`, `es`, `fr`, `hu`, `id`, `it`, `ja`, `ko`, `nl`, `pl`, `pt-br`, `pt-pt`, `ru`, `sv`, `tr`, `zh-hans`, `zh-hant`. Advisor accepts region-qualified tags such as `en-US` and maps them to the base language (`en`). |

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli advisor metadata get -->

Example prompts include:

- "Get the Advisor metadata for recommendation type ID \<recommendation-type-id\>."
- "What does Advisor recommendation type \<recommendation-type-id\> mean?"
- "Show me the catalog details for Advisor recommendation type \<recommendation-type-id\>."
- "Get the German (de) metadata for Advisor recommendation type \<recommendation-type-id\>."
- "What is the impact and category of Advisor recommendation type \<recommendation-type-id\>?"
- "Show the remediation actions for Advisor recommendation type \<recommendation-type-id\>."
- "When does Advisor recommendation type \<recommendation-type-id\> retire?"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Recommendation type ID** |  Required | The stable Advisor recommendation type ID (`properties.recommendationTypeId`) to look up in the global recommendation-metadata catalog. This ID is the join key shared with individual recommendations. |
| **Language** |  Optional | Catalog locale to filter on (`properties.language`). Defaults to `en`. Case-insensitive. Supported values: `en`, `cs`, `de`, `es`, `fr`, `hu`, `id`, `it`, `ja`, `ko`, `nl`, `pl`, `pt-br`, `pt-pt`, `ru`, `sv`, `tr`, `zh-hans`, `zh-hant`. Advisor accepts region-qualified tags such as `en-US` and maps them to the base language (`en`). |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## Metadata: List

Lists Azure Advisor recommendation metadata, also known as recommendation types. Helps you discover what recommendations Azure Advisor can produce before you deploy resources such as virtual machines, even when no active recommendations exist. Shows Advisor service retirements that occur on, before, or after a specified retirement date, and finds service-retirement metadata by Service Health tracking ID. Supports greenfield discovery with the global Azure Resource Graph catalog and resource-type filtering for brownfield onboarding. Accepts optional filters for language, resource type, impact, category, subcategory, tracking ID, and retirement date. Returns localized type IDs, names, categories, subcategories, impact, priority, descriptions, benefits, actions, scope, source query, and service-retirement details. Orders results by impact from High to Medium to Low, then by display name.

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp advisor metadata list \
  [--language <language>] \
  [--resource-type <resource-type>] \
  [--impact <impact>] \
  [--category <category>] \
  [--sub-category <sub-category>] \
  [--tracking-id <tracking-id>] \
  [--retirement-date <retirement-date>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `language` | string | No | Language for localized recommendation metadata. Defaults to English (`en`). Supported catalog languages are `en`, `cs`, `de`, `es`, `fr`, `hu`, `id`, `it`, `ja`, `ko`, `nl`, `pl`, `pt-BR`, `pt-PT`, `ru`, `sv`, `tr`, `zh-Hans`, and `zh-Hant`. Regional variants map to a supported base language when available, such as `en-US` to `en` and `fr-CA` to `fr`; locale-specific catalog languages remain distinct. |
| `resource-type` | string | No | Optional exact Azure resource type filter, such as `microsoft.compute/virtualmachines`. Use it during brownfield onboarding to discover recommendation types applicable to that resource type. The filter is case-insensitive. |
| `impact` | string | No | Optional recommendation impact filter. Allowed values are `High`, `Medium`, or `Low`. The filter is case-insensitive. By default, results appear in `High`, `Medium`, then `Low` order. |
| `category` | string | No | Optional exact Advisor category filter. Allowed values are `Cost`, `HighAvailability`, `Security`, `Performance`, and `OperationalExcellence`. The filter is case-insensitive. |
| `sub-category` | string | No | Optional exact recommendation subcategory filter. The filter is case-insensitive. Known catalog values include `ComputeOptimization`, `DataPerformance`, `DataProtectionAndRecovery`, `EfficiencyOptimization`, `FailureMitigation`, `GovernanceAndCompliance`, `MonitoringAndAlerting`, `NetworkOptimization`, `Other`, `Personalized`, `RegionalResiliency`, `Reservations`, `SafeAndSecureDeployment`, `SavingsPlan`, `Scalability`, `ServiceUpgradeAndRetirement`, `StorageOptimization`, `UsageOptimization`, and `ZoneResiliency`. The catalog can add values over time, so the tool accepts other subcategories. |
| `tracking-id` | string | No | Optional exact Service Health tracking ID filter, such as `QNY1-HB8`. The filter is case-insensitive and applies within `ServiceUpgradeAndRetirement` metadata. You can omit `--sub-category`, but you can't specify a different value. |
| `retirement-date` | string | No | Optional service-retirement date filter in `<operator>:<yyyy-MM-dd>` format, for example `ge:2026-03-31`. Supported operators are `eq`, `lt`, `le`, `gt`, and `ge`. Applies only to the `ServiceUpgradeAndRetirement` subcategory. You can omit `--sub-category`, but you can't specify a different value. |

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli advisor metadata list -->

Example prompts include:

- "List the Advisor recommendation metadata catalog."
- "Before I deploy any virtual machines, what kinds of recommendations could Advisor produce for them?"
- "List high-impact Advisor metadata for microsoft.sql/servers/databases."
- "Show the German metadata catalog for Advisor recommendations."
- "Which Advisor recommendation types include service-retirement details?"
- "List Advisor metadata in the ServiceUpgradeAndRetirement subcategory."
- "Find the Advisor service-retirement metadata with tracking ID QNY1-HB8."
- "Show Advisor service retirements on or after March 31, 2026."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Language** |  Optional | Language for localized recommendation metadata. Defaults to English (`en`). Supported catalog languages are `en`, `cs`, `de`, `es`, `fr`, `hu`, `id`, `it`, `ja`, `ko`, `nl`, `pl`, `pt-BR`, `pt-PT`, `ru`, `sv`, `tr`, `zh-Hans`, and `zh-Hant`. Regional variants map to a supported base language when available, such as `en-US` to `en` and `fr-CA` to `fr`; locale-specific catalog languages remain distinct. |
| **Resource type** |  Optional | Optional exact Azure resource type filter, such as `microsoft.compute/virtualmachines`. Use it during brownfield onboarding to discover recommendation types applicable to that resource type. The filter is case-insensitive. |
| **Impact** |  Optional | Optional recommendation impact filter. Allowed values are `High`, `Medium`, or `Low`. The filter is case-insensitive. By default, results appear in `High`, `Medium`, then `Low` order. |
| **Category** |  Optional | Optional exact Advisor category filter. Allowed values are `Cost`, `HighAvailability`, `Security`, `Performance`, and `OperationalExcellence`. The filter is case-insensitive. |
| **Sub-category** |  Optional | Optional exact recommendation subcategory filter. The filter is case-insensitive. Known catalog values include `ComputeOptimization`, `DataPerformance`, `DataProtectionAndRecovery`, `EfficiencyOptimization`, `FailureMitigation`, `GovernanceAndCompliance`, `MonitoringAndAlerting`, `NetworkOptimization`, `Other`, `Personalized`, `RegionalResiliency`, `Reservations`, `SafeAndSecureDeployment`, `SavingsPlan`, `Scalability`, `ServiceUpgradeAndRetirement`, `StorageOptimization`, `UsageOptimization`, and `ZoneResiliency`. The catalog can add values over time, so the tool accepts other subcategories. |
| **Tracking ID** |  Optional | Optional exact Service Health tracking ID filter, such as `QNY1-HB8`. The filter is case-insensitive and applies within `ServiceUpgradeAndRetirement` metadata. You can omit `--sub-category`, but you can't specify a different value. |
| **Retirement date** |  Optional | Optional service-retirement date filter in `<operator>:<yyyy-MM-dd>` format, for example `ge:2026-03-31`. Supported operators are `eq`, `lt`, `le`, `gt`, and `ge`. Applies only to the `ServiceUpgradeAndRetirement` subcategory. You can omit `--sub-category`, but you can't specify a different value. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## Recommendation: Apply

Helps you apply Azure Advisor recommendations to infrastructure-as-code (IaC) files, such as Azure Resource Manager (ARM) templates and Terraform configurations. It returns rules to apply to the IaC file.

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp advisor recommendation apply \
  --resource <resource>
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `resource` | string | Yes | The Azure resource type to get IaC file rules for. Available options: `aad_domainservices`, `apimanagement_service`, `cognitiveservices_accounts`, `compute_virtualmachines`, `compute_virtualmachinescalesets`, `containerregistry_registries`, `containerservice_managedclusters`, `dbforpostgresql_flexibleservers`, `documentdb_databaseaccounts`, `keyvault_vaults`, `kubernetes_connectedclusters`, `kubernetesconfiguration_extensions`, `netapp_volumes`, `network_applicationgatewaywebapplicationfirewallpolicies`, `network_expressrouteports`, `network_frontdoorwebapplicationfirewallpolicies`, `sql_managedinstances`, `storage_storageaccounts`, `web_serverfarms`, `web_staticsites` |

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli advisor recommendation apply -->

Example prompts include:

- "Apply Advisor recommendations to this ARM template."
- "Apply Advisor recommendations to this Terraform file for Storage Account."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource** |  Required | The Azure resource type to get IaC file rules for. Available options: `aad_domainservices`, `apimanagement_service`, `cognitiveservices_accounts`, `compute_virtualmachines`, `compute_virtualmachinescalesets`, `containerregistry_registries`, `containerservice_managedclusters`, `dbforpostgresql_flexibleservers`, `documentdb_databaseaccounts`, `keyvault_vaults`, `kubernetes_connectedclusters`, `kubernetesconfiguration_extensions`, `netapp_volumes`, `network_applicationgatewaywebapplicationfirewallpolicies`, `network_expressrouteports`, `network_frontdoorwebapplicationfirewallpolicies`, `sql_managedinstances`, `storage_storageaccounts`, `web_serverfarms`, `web_staticsites`. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## Recommendation: List

Lists individual Azure Advisor recommendations for a subscription, returning one record per recommendation. Use this command only to view recommendation contents and details. For aggregate, ranking, comparison, or count questions, use `advisor recommendation summary` instead. Returns only active recommendations with status `New` and excludes dismissed and postponed recommendations. Supports optional filters for category, impact, resource type, resource, and free-text search. A `top` parameter caps returned items, with a default of 50 and a maximum of 100. Because the command returns at most 100 records, using its results for aggregate calculations might undercount the total.

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp advisor recommendation list \
  [--category <category>] \
  [--impact <impact>] \
  [--resource-type <resource-type>] \
  [--resource <resource>] \
  [--search <search>] \
  [--top <top>] \
  [--resource-group <resource-group>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `category` | string | No | Filter recommendations by category (for example, `Security`, `Cost`, `Performance`, `HighAvailability`, `OperationalExcellence`). Case-insensitive exact match. |
| `impact` | string | No | Filter recommendations by business impact (`High`, `Medium`, or `Low`). Case-insensitive exact match. |
| `resource-type` | string | No | Filter recommendations by impacted Azure resource type (for example, `Microsoft.Storage/storageAccounts`). Case-insensitive exact match. |
| `resource` | string | No | Filter recommendations by impacted resource name or full ARM resource ID. Case-insensitive substring match. |
| `search` | string | No | Applies a free-text filter to the recommendation problem text (case-insensitive substring match). Use this whenever a request includes a topical phrase such as `related to Microsoft Foundry`, `about encryption`, `mentioning right-size`, or `for Key Vault`. Extract the salient nouns from the phrase (for example, `Foundry`, `encrypt`, `right-size`, `Key Vault`) and pass them here. |
| `top` | string | No | Maximum number of items to return. For `list`: defaults to 50 with a server-side range of 1-100. For `summary`: optional display cap on the number of buckets returned (defaults to all). `TotalRecommendations` always reflects the complete filtered population regardless of `--top`. |
| `resource-group` | string | No | The Azure resource group name. |

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli advisor recommendation list -->

Example prompts include:

- "List all recommendations in my subscription."
- "Show me Advisor recommendations in the subscription \<subscription\>."
- "List all Advisor recommendations in the subscription \<subscription\>."
- "Show me high-impact Security recommendations in subscription \<subscription\>."
- "List Cost recommendations for storage accounts in subscription \<subscription\>."
- "Find Advisor recommendations mentioning `right-size` in subscription \<subscription\>."
- "Show me the top 10 Advisor recommendations in subscription \<subscription\>."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Category** |  Optional | Filter recommendations by category (for example, `Security`, `Cost`, `Performance`, `HighAvailability`, `OperationalExcellence`). Case-insensitive exact match. |
| **Impact** |  Optional | Filter recommendations by business impact (`High`, `Medium`, or `Low`). Case-insensitive exact match. |
| **Resource type** |  Optional | Filter recommendations by impacted Azure resource type (for example, `Microsoft.Storage/storageAccounts`). Case-insensitive exact match. |
| **Resource** |  Optional | Filter recommendations by impacted resource name or full ARM resource ID. Case-insensitive substring match. |
| **Search** |  Optional | Applies a free-text filter to the recommendation problem text (case-insensitive substring match). Use this whenever a request includes a topical phrase such as `related to Microsoft Foundry`, `about encryption`, `mentioning right-size`, or `for Key Vault`. Extract the salient nouns from the phrase (for example, `Foundry`, `encrypt`, `right-size`, `Key Vault`) and pass them here. |
| **Top** |  Optional | Maximum number of items to return. For `list`: defaults to 50 with a server-side range of 1-100. For `summary`: optional display cap on the number of buckets returned (defaults to all). `TotalRecommendations` always reflects the complete filtered population regardless of `--top`. |
| **Resource group** |  Optional | The name of the Azure resource group. This name is a logical container for Azure resources. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## Recommendation: Summary

This command aggregates active Azure Advisor recommendations with status `New` and returns per-bucket counts plus an accurate total. Use this command for aggregate, ranking, comparison, and count questions. Filters apply before aggregation. Group results by `recommendation-type`, `category`, `impact`, or `resource-type`. The default grouping is `category`, which surfaces high-level themes such as Cost, Security, and Reliability. The `top` parameter limits the displayed buckets, but `TotalRecommendations` always reflects the full filtered population. The command preserves the `Unknown` bucket as the final result; include it as the final row when you display groups in a table.

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp advisor recommendation summary \
  [--group-by <group-by>] \
  [--category <category>] \
  [--impact <impact>] \
  [--resource-type <resource-type>] \
  [--resource <resource>] \
  [--search <search>] \
  [--top <top>] \
  [--resource-group <resource-group>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `group-by` | string | No | Field to group the summary by. One of: `recommendation-type`, `category`, `impact`, `resource-type`. Defaults to `category`, which surfaces the high-level themes (Cost, Security, Reliability, and more) so prompts like `summarize the key themes from my Advisor recommendations` work without naming a field. |
| `category` | string | No | Filter recommendations by category (for example, `Security`, `Cost`, `Performance`, `HighAvailability`, `OperationalExcellence`). Case-insensitive exact match. |
| `impact` | string | No | Filter recommendations by business impact (`High`, `Medium`, or `Low`). Case-insensitive exact match. |
| `resource-type` | string | No | Filter recommendations by impacted Azure resource type (for example, `Microsoft.Storage/storageAccounts`). Case-insensitive exact match. |
| `resource` | string | No | Filter recommendations by impacted resource name or full ARM resource ID. Case-insensitive substring match. |
| `search` | string | No | Free-text filter applied to the recommendation problem text (case-insensitive substring match). Use this filter whenever your request includes a topical phrase such as `related to Microsoft Foundry`, `about encryption`, `mentioning right-size`, or `for Key Vault`. Extract the salient nouns from the phrase (for example, `Foundry`, `encrypt`, `right-size`, `Key Vault`) and pass them here. |
| `top` | string | No | Maximum number of items to return. For `list`: defaults to 50, clamped to 1-100 (server-side limit). For `summary`: optional display cap on the number of buckets returned (defaults to all). `TotalRecommendations` always reflects the complete filtered population regardless of `--top`. |
| `resource-group` | string | No | The Azure resource group name. |

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli advisor recommendation summary -->

Example prompts include:

- "Summarize the key themes from my Advisor recommendations in subscription \<subscription\>."
- "Summarize Advisor recommendations in subscription \<subscription\> by category."
- "Show the top 10 most common Advisor recommendations in subscription \<subscription\>."
- "Group Advisor recommendations by impact in subscription \<subscription\>."
- "Which resource types have the most high-impact recommendations in subscription \<subscription\>?"
- "Summarize high-impact Security recommendations by resource-type in subscription \<subscription\>."
- "Group Cost recommendations for storage accounts by impact in subscription \<subscription\>."
- "Summarize Advisor recommendations mentioning `encryption` by category in subscription \<subscription\>."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Group by** |  Optional | Field to group the summary by. One of: `recommendation-type`, `category`, `impact`, `resource-type`. Defaults to `category`, which surfaces the high-level themes (Cost, Security, Reliability, and more) so prompts like `summarize the key themes from my Advisor recommendations` work without naming a field. |
| **Category** |  Optional | Filter recommendations by category (for example, `Security`, `Cost`, `Performance`, `HighAvailability`, `OperationalExcellence`). Case-insensitive exact match. |
| **Impact** |  Optional | Filter recommendations by business impact (`High`, `Medium`, or `Low`). Case-insensitive exact match. |
| **Resource type** |  Optional | Filter recommendations by impacted Azure resource type (for example, `Microsoft.Storage/storageAccounts`). Case-insensitive exact match. |
| **Resource** |  Optional | Filter recommendations by impacted resource name or full ARM resource ID. Case-insensitive substring match. |
| **Search** |  Optional | Free-text filter applied to the recommendation problem text (case-insensitive substring match). Use this filter whenever your request includes a topical phrase such as `related to Microsoft Foundry`, `about encryption`, `mentioning right-size`, or `for Key Vault`. Extract the salient nouns from the phrase (for example, `Foundry`, `encrypt`, `right-size`, `Key Vault`) and pass them here. |
| **Top** |  Optional | Maximum number of items to return. For `list`: defaults to 50, clamped to 1-100 (server-side limit). For `summary`: optional display cap on the number of buckets returned (defaults to all). `TotalRecommendations` always reflects the complete filtered population regardless of `--top`. |
| **Resource group** |  Optional | The name of the Azure resource group. This name is a logical container for Azure resources. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started by using Azure MCP Server](../get-started.md)
- [Azure Advisor documentation](/azure/advisor/)
