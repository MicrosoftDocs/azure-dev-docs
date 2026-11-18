---
title: Azure MCP Server tools for Azure Advisor
description: Use Azure MCP Server tools with natural language prompts or Azure MCP CLI commands to manage Azure Advisor recommendations and optimizations.
ms.date: 11/18/2026
ms.service: azure-mcp-server
ms.topic: concept-article
tool_count: 9
mcp-cli.version: 4.0.0-beta.6+27da21a85a72ff62a30e30d016a800d7cc136677
author: sandeep-sen
ms.author: sandeepsen
ms.reviewer: ankiga 
ai-usage: ai-generated
ms.custom: build-2025
content_well_notification:
  - AI-contribution
---

# Azure MCP Server tools for Azure Advisor

The Azure MCP Server helps you work with Azure Advisor through natural language prompts. You can list, summarize, prioritize, and update recommendations, review idle-resource savings and deletion readiness, explore recommendation metadata, view pre-aggregated insight KPIs, get remediation guidance, and check the status of service groups.

Azure Advisor analyzes your Azure resources and delivers personalized, actionable recommendations to optimize cost, performance, reliability, and security. For more information, see [Azure Advisor documentation](/azure/advisor/).

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## Insight: List

This tool lists pre-aggregated Azure Advisor insights for a service group, a subscription, or all accessible service groups and subscriptions in the selected tenant. Use this tool to view idle resource counts and potential savings in USD, zonal resiliency coverage percentages, and service retirement exposure. Service retirement insights include Day 1 baseline exposure, current remaining exposure, and exposure reduction percentage. Only service retirement insights apply to subscriptions; idle resource and zonal resiliency insights apply to service groups.

Each insight returns its name, domain, scope type and ID, last updated time, and typed KPI values. USD amounts include a unit. Results include an `areResultsTruncated` flag that indicates whether the result set is incomplete.

This tool returns pre-aggregated KPIs, not individual resources or recommendations. For recommendation counts, totals, rankings, and grouped analysis, use [Recommendation: Summary](#recommendation-summary). For individual recommendations and affected resources, use [Recommendation: List](#recommendation-list).

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp advisor insight list \
  [--service-group <service-group>] \
  [--subscription <subscription>] \
  [--insight-name <insight-name>] \
  [--top <top>] \
  [--tenant <tenant>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `service-group` | string | No | The service group name, such as `commerce`, not its full ARM resource ID. Specify either a service group or a subscription, not both. If you omit both, the tool returns insights across all accessible service groups and subscriptions in the selected tenant. |
| `subscription` | string | No | The Azure subscription ID or name. Returns insights for that subscription; only service retirement insights apply. Mutually exclusive with `service-group`. No default subscription is applied. |
| `insight-name` | string | No | Filter by insight name: `IdleResources`, `ZonalResiliency`, or `ServiceRetirement`. Case-insensitive exact match. If you omit this parameter, the tool returns all insight types available for the scope. |
| `top` | integer | No | Maximum number of insights to return, from 1 to 500. Defaults to 50. |
| `tenant` | string | No | The Microsoft Entra tenant ID or display name. Required when multiple tenants are accessible and you don't specify a subscription. |

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli advisor insight list -->

Example prompts include:

- "List Azure Advisor insights across all accessible service groups and subscriptions in tenant '\<tenant-id\>'."
- "Show idle resource counts and potential savings in USD for service group 'commerce' in tenant '\<tenant-id\>'."
- "Show zonal resiliency coverage percentages for service group 'commerce' in tenant '\<tenant-id\>'."
- "Get the service retirement insight for subscription '\<subscription-id\>', including Day 1 baseline exposure, current remaining exposure, and exposure reduction percentage."
- "List up to 100 ServiceRetirement insights across all accessible service groups and subscriptions in tenant '\<tenant-id\>'."

| Parameter | Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Service group** | Optional | The service group name, such as `commerce`, not its full ARM resource ID. Specify either a service group or a subscription, not both. If you omit both, the tool returns insights across all accessible service groups and subscriptions in the selected tenant. |
| **Subscription** | Optional | The Azure subscription ID or name. Returns insights for that subscription; only service retirement insights apply. Mutually exclusive with service group. No default subscription is applied. |
| **Insight name** | Optional | Filter by insight name: `IdleResources`, `ZonalResiliency`, or `ServiceRetirement`. Case-insensitive exact match. If you omit this parameter, the tool returns all insight types available for the scope. |
| **Top** | Optional | Maximum number of insights to return, from 1 to 500. Defaults to 50. |
| **Tenant** | Optional | The Microsoft Entra tenant ID or display name. Required when multiple tenants are accessible and you don't specify a subscription. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## Metadata: Get

Gets Azure Advisor metadata for a specific recommendation type. Returns the recommendation type's display name, category, subcategory, impact, supported resource type, description, potential benefits, and a learn-more documentation link. Use the metadata to understand what a recommendation means and assess its impact.

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp advisor metadata get \
  --recommendation-type-id <recommendation-type-id> \
  [--language <language>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `recommendation-type-id` | string | Yes | The stable Advisor recommendation type id (properties.recommendationTypeId) to look up in the global recommendation-metadata catalog. This is the join key shared with individual recommendations. Required. |
| `language` | string | No | Catalog locale to filter on (properties.language). Defaults to 'en'. Case-insensitive. Supported values: en, cs, de, es, fr, hu, id, it, ja, ko, nl, pl, pt-br, pt-pt, ru, sv, tr, zh-hans, zh-hant. Region-qualified tags such as 'en-US' are accepted and mapped to the base language ('en'). |

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli advisor metadata get -->

Example prompts include:

- "Get the Advisor metadata for recommendation type ID \<recommendation-type-id\>."
- "What does Advisor recommendation type \<recommendation-type-id\> mean?"
- "Show me the catalog details for Advisor recommendation type \<recommendation-type-id\>."
- "Get the German (de) metadata for Advisor recommendation type \<recommendation-type-id\>."
- "What is the impact and category of Advisor recommendation type \<recommendation-type-id\>?"
- "Show the learn-more link for Advisor recommendation type \<recommendation-type-id\>."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Recommendation type ID** |  Required | The stable Advisor recommendation type ID (properties.recommendationTypeId) to look up in the global recommendation-metadata catalog. This is the join key shared with individual recommendations. Required. |
| **Language** |  Optional | Catalog locale to filter on (properties.language). Defaults to 'en'. Case-insensitive. Supported values: en, cs, de, es, fr, hu, ID, it, ja, ko, nl, pl, pt-br, pt-pt, ru, sv, tr, zh-hans, zh-hant. Region-qualified tags such as 'en-US' are accepted and mapped to the base language ('en'). |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## Metadata: List

Lists the global Azure Advisor recommendation metadata catalog, also known as recommendation types. Helps you discover what recommendations Azure Advisor can produce before you deploy resources such as virtual machines, even when no active recommendations exist. Shows Advisor service retirements that occur on, before, or after a specified retirement date, and finds service-retirement metadata by Service Health tracking ID. Supports greenfield discovery with the global Azure Resource Graph catalog and resource-type filtering for brownfield onboarding. Returns localized type IDs, names, categories, subcategories, impact, priority, descriptions, benefits, actions, scope, source query, and service-retirement details. Orders results by impact from High to Medium to Low, then by display name. To get current recommendations or affected resources, use [Recommendation: List](#recommendation-list) instead.

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
  [--retirement-date <retirement-date>] \
  [--continuation-token <continuation-token>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `language` | string | No | Language for localized recommendation metadata. Defaults to English ('en'). Supported catalog languages are en, cs, de, es, fr, hu, id, it, ja, ko, nl, pl, pt-BR, pt-PT, ru, sv, tr, zh-Hans, and zh-Hant. Regional variants map to a supported base language when available, such as en-US to en and fr-CA to fr; locale-specific catalog languages remain distinct. |
| `continuation-token` | string | No | Token returned by the preceding page. Pass it unchanged with the same filters and language. Omit it for the first page. |
| `resource-type` | string | No | Optional exact Azure resource type filter, such as 'microsoft.compute/virtualmachines'. Use it during brownfield onboarding to discover recommendation types applicable to that resource type. Matched case-insensitively. |
| `impact` | string | No | Optional recommendation impact filter. Allowed values are High, Medium, or Low. Matched case-insensitively; unfiltered results are ordered High, Medium, then Low. |
| `category` | string | No | Optional exact Advisor category filter. Allowed values are Cost, HighAvailability, Security, Performance, and OperationalExcellence. Matched case-insensitively. |
| `sub-category` | string | No | Optional exact recommendation subcategory filter, matched case-insensitively. Known catalog values include ComputeOptimization, DataPerformance, DataProtectionAndRecovery, EfficiencyOptimization, FailureMitigation, GovernanceAndCompliance, MonitoringAndAlerting, NetworkOptimization, Other, Personalized, RegionalResiliency, Reservations, SafeAndSecureDeployment, SavingsPlan, Scalability, ServiceUpgradeAndRetirement, StorageOptimization, UsageOptimization, and ZoneResiliency. The catalog can add values over time, so other subcategories are accepted. |
| `tracking-id` | string | No | Optional exact Service Health tracking ID filter, such as QNY1-HB8. Matched case-insensitively within ServiceUpgradeAndRetirement metadata. --sub-category may be omitted but cannot specify a different value. |
| `retirement-date` | string | No | Optional service-retirement date filter in `<operator>:<yyyy-MM-dd>` format, for example `ge:2026-03-31`. Supported operators are `eq`, `lt`, `le`, `gt`, and `ge`. Applies only to the ServiceUpgradeAndRetirement subcategory; `--sub-category` may be omitted but cannot specify a different value. |

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli advisor metadata list -->

Example prompts include:

- "List the Advisor recommendation metadata catalog"
- "Show Advisor service retirements on or after March 31, 2026"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Language** |  Optional | Language for localized recommendation metadata. Defaults to English ('en'). Supported catalog languages are en, cs, de, es, fr, hu, ID, it, ja, ko, nl, pl, pt-BR, pt-PT, ru, sv, tr, zh-Hans, and zh-Hant. Regional variants map to a supported base language when available, such as en-US to en and fr-CA to fr; locale-specific catalog languages remain distinct. |
| **Continuation token** | Optional | Token returned by the preceding page. Pass it unchanged with the same filters and language. Omit it for the first page. |
| **Resource type** |  Optional | Optional exact Azure resource type filter, such as 'microsoft.compute/virtualmachines'. Use it during brownfield onboarding to discover recommendation types applicable to that resource type. Matched case-insensitively. |
| **Impact** |  Optional | Optional recommendation impact filter. Allowed values are High, Medium, or Low. Matched case-insensitively; unfiltered results are ordered High, Medium, then Low. |
| **Category** |  Optional | Optional exact Advisor category filter. Allowed values are Cost, HighAvailability, Security, Performance, and OperationalExcellence. Matched case-insensitively. |
| **Sub category** |  Optional | Optional exact recommendation subcategory filter, matched case-insensitively. Known catalog values include ComputeOptimization, DataPerformance, DataProtectionAndRecovery, EfficiencyOptimization, FailureMitigation, GovernanceAndCompliance, MonitoringAndAlerting, NetworkOptimization, Other, Personalized, RegionalResiliency, Reservations, SafeAndSecureDeployment, SavingsPlan, Scalability, ServiceUpgradeAndRetirement, StorageOptimization, UsageOptimization, and ZoneResiliency. The catalog can add values over time, so other subcategories are accepted. |
| **Tracking ID** |  Optional | Optional exact Service Health tracking ID filter, such as QNY1-HB8. Matched case-insensitively within ServiceUpgradeAndRetirement metadata. `--sub-category` may be omitted but cannot specify a different value. |
| **Retirement date** |  Optional | Optional service-retirement date filter in '&lt;operator&gt;:&lt;`yyyy-MM-dd`&gt;' format, for example 'ge:2026-03-31'. Supported operators are eq, lt, le, gt, and ge. Applies only to the ServiceUpgradeAndRetirement subcategory; `--sub-category` may be omitted but cannot specify a different value. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## Recommendation: List

Lists individual Azure Advisor recommendations and their affected-resource details across selected subscriptions or one service group. Supports filters for category, subcategory, impact, status, recommendation type IDs, affected resource, resource types, product family, minimum savings, free text, Service Health tracking IDs, and retirement date. Returns recommendations in Azure Resource Manager (ARM) resource shape, truncation information, and a continuation token when more results are available. Each recommendation's `name` is its recommendation ID.

Use this tool to view individual recommendations. For counts, totals, rankings, or grouped analysis, use [Recommendation: Summary](#recommendation-summary) instead. To find the top or most critical recommendations across types, start with a prioritized summary, and then use this tool with the selected recommendation type ID and `prioritized` set to `true` to order its individual recommendations.

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp advisor recommendation list \
  [--subscriptions <subscription1> <subscription2>] \
  [--service-group <service-group>] \
  [--resource-group <resource-group>] \
  [--category <category>] \
  [--impact <impact>] \
  [--status <status>] \
  [--recommendation-type-ids <type-id1> <type-id2>] \
  [--resource-types <resource-type1> <resource-type2>] \
  [--product-family <product-family>] \
  [--resource <resource>] \
  [--search <search>] \
  [--sub-category <sub-category>] \
  [--tracking-ids <tracking-id1> <tracking-id2>] \
  [--retirement-date <retirement-date>] \
  [--minimum-savings <minimum-savings>] \
  [--top <top>] \
  [--continuation-token <continuation-token>] \
  [--prioritized <true|false>] \
  [--show-prioritization-signals <true|false>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `subscriptions` | array of strings | No | Subscription names or IDs in the same tenant. Pass a one-element array for one subscription. Can't be combined with `service-group`. If you omit both, the configured default subscription is used. |
| `service-group` | string | No | One service group name, identifier, or full ARM resource ID. Can't be combined with `subscriptions` or `resource-group`. |
| `resource-group` | string | No | The Azure resource group name. Applies only to subscription scope. |
| `category` | string | No | Filter recommendations by category: `Cost`, `HighAvailability`, `Security`, `Performance`, or `OperationalExcellence`. Case-insensitive exact match. |
| `impact` | string | No | Filter recommendations by business impact: `High`, `Medium`, or `Low`. Case-insensitive exact match. |
| `status` | string | No | Filter recommendations by status: `New`, `Postponed`, `Dismissed`, or `Completed`. Defaults to `New`. |
| `recommendation-type-ids` | array of strings | No | Recommendation type GUIDs. Matches any supplied value, case-insensitively. Pass a one-element array for one type. |
| `resource-types` | array of strings | No | Impacted resource types, such as `Microsoft.Storage/storageAccounts`. Matches any supplied value against supported metadata resource types and the affected resource ID, case-insensitively. |
| `product-family` | string | No | Case-insensitive exact match against the recommendation metadata's Azure product family. |
| `resource` | string | No | Filter recommendations by impacted resource name or full ARM resource ID. Case-insensitive substring match. |
| `search` | string | No | Free-text filter on the recommendation problem text, such as `encryption` or `right-size`. Case-insensitive substring match. Prefer a structured filter when one fits the request. |
| `sub-category` | string | No | Filter recommendations by subcategory, such as `ServiceUpgradeAndRetirement` or `ZoneResiliency`. Case-insensitive. |
| `tracking-ids` | array of strings | No | Filter recommendations by one or more Service Health tracking IDs, such as `QNY1-HB8`. Pass several IDs as space-separated values. Applies within the `ServiceUpgradeAndRetirement` subcategory. |
| `retirement-date` | string | No | Filter recommendations by service-retirement date in `<operator>:<yyyy-MM-dd>` format, for example `ge:2026-03-31`. Supported operators are `eq`, `lt`, `le`, `gt`, and `ge`. Applies within the `ServiceUpgradeAndRetirement` subcategory. |
| `top` | integer | No | Maximum number of recommendation records to return. Defaults to 50, with a range of 1 through 100. |
| `minimum-savings` | decimal | No | Minimum annualized retail potential savings in USD, zero or greater. Requires category `Cost` and subcategory `IdleResources`. Missing pricing doesn't satisfy the threshold. |
| `continuation-token` | string | No | Token returned by the preceding page. Keep scope, tenant, filters, ordering, and `top` unchanged. |
| `prioritized` | boolean | No | Orders individual records. Requires exactly one distinct `recommendation-type-ids` value. Cost/IdleResources uses yearly potential savings for New, Postponed, or Dismissed, and realized savings for Completed. Other Cost types use annual savings; other categories use criticality. Defaults to `false`. |
| `show-prioritization-signals` | boolean | No | Includes the prioritization signals for each recommendation when available. Requires `prioritized` set to `true`. Defaults to `false`. |

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli advisor recommendation list -->

Example prompts include:

- "List all Advisor recommendations in subscription \<subscription\>."
- "Show me high-impact Security recommendations in subscription \<subscription\>."
- "List Cost recommendations for storage accounts in subscription \<subscription\>."
- "List idle-resource recommendations across subscriptions \<subscription1\> and \<subscription2\>."
- "Show postponed Advisor recommendations in subscription \<subscription\>."
- "List Advisor recommendations for service group \<service-group\>."
- "Which resources are affected by service retirement tracking ID QNY1-HB8 in subscription \<subscription\>?"
- "List the most critical resources for recommendation type \<recommendation-type-id\> in subscription \<subscription\>."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Subscriptions** | Optional | Array of subscription names or IDs in the same tenant, including a one-element array for one subscription. Can't be combined with **Service group**. If you omit both, the configured default subscription is used. |
| **Service group** | Optional | One service group name, identifier, or full ARM resource ID. Can't be combined with **Subscriptions** or **Resource group**. |
| **Resource group** |  Optional | The Azure resource group name. Applies only to subscription scope. |
| **Category** |  Optional | Filter recommendations by category: `Cost`, `HighAvailability`, `Security`, `Performance`, or `OperationalExcellence`. Case-insensitive exact match. |
| **Impact** |  Optional | Filter recommendations by business impact: `High`, `Medium`, or `Low`. Case-insensitive exact match. |
| **Status** |  Optional | Filter recommendations by status: `New`, `Postponed`, `Dismissed`, or `Completed`. Defaults to `New`. |
| **Recommendation type IDs** | Optional | Array of recommendation type GUIDs. Matches any supplied value, case-insensitively. |
| **Resource types** | Optional | Array of impacted resource types. Matches any supplied value against supported metadata resource types and the affected resource ID, case-insensitively. |
| **Product family** | Optional | Case-insensitive exact match against the recommendation metadata's Azure product family. |
| **Resource** |  Optional | Filter recommendations by impacted resource name or full ARM resource ID. Case-insensitive substring match. |
| **Search** |  Optional | Free-text filter on the recommendation problem text, such as `encryption` or `right-size`. Case-insensitive substring match. Prefer a structured filter when one fits the request. |
| **Sub-category** |  Optional | Filter recommendations by subcategory, such as `ServiceUpgradeAndRetirement` or `ZoneResiliency`. Case-insensitive. |
| **Tracking IDs** |  Optional | Filter recommendations by one or more Service Health tracking IDs, such as `QNY1-HB8`. Applies within the `ServiceUpgradeAndRetirement` subcategory. |
| **Retirement date** |  Optional | Filter recommendations by service-retirement date in `<operator>:<yyyy-MM-dd>` format, for example `ge:2026-03-31`. Supported operators are `eq`, `lt`, `le`, `gt`, and `ge`. Applies within the `ServiceUpgradeAndRetirement` subcategory. |
| **Top** |  Optional | Maximum number of recommendation records to return. Defaults to 50, with a range of 1 through 100. |
| **Minimum savings** | Optional | Minimum annualized retail potential savings in USD, zero or greater. Requires category `Cost` and subcategory `IdleResources`. Missing pricing doesn't satisfy the threshold. |
| **Continuation token** | Optional | Token returned by the preceding page. Keep scope, tenant, filters, ordering, and **Top** unchanged. |
| **Prioritized** | Optional | Orders individual records. Requires exactly one distinct **Recommendation type IDs** value. Cost/IdleResources uses yearly potential savings for New, Postponed, or Dismissed, and realized savings for Completed. Other Cost types use annual savings; other categories use criticality. Defaults to `false`. |
| **Show prioritization signals** |  Optional | Includes the prioritization signals for each recommendation when available. Requires **Prioritized** set to `true`. Defaults to `false`. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## Recommendation: Summary

Summarizes Azure Advisor recommendations across selected subscriptions or one service group with server-side counts, totals, rankings, and distributions. Use it for questions such as how many, breakdowns, most common, or which resource types have the most recommendations. Group results by `recommendation-type`, `category`, `impact`, `resource-type`, `status`, `sub-category`, or `retirement-date`. The default grouping is `category`. Without a lifecycle or historical override for Cost/IdleResources, status grouping includes all states and other groupings include only `New` recommendations.

Set `prioritized` to `true` to rank recommendation types by priority, for requests such as top recommendations, most critical, or what to fix first. Each ranked type includes its affected-resource count and the signals that explain its rank. To see the individual recommendations for a ranked type, use [Recommendation: List](#recommendation-list) with its recommendation type ID.

`TotalRecommendations` always reflects the complete filtered population, even when `top` limits the groups returned. Non-prioritized counts represent recommendation records. With `prioritized` set to `true`, counts represent distinct affected resources per type, and the total sums those counts across types.

With `category` set to `Cost` and `sub-category` set to `IdleResources`, `summary.cost` includes yearly potential savings, accumulated cost, realized savings, and pricing availability for the complete filtered population, independent of `top`. Savings are retail USD estimates, not billing data, and accumulated cost isn't monthly spend. Missing pricing remains unavailable.

Use `status` to select a lifecycle state. Historical inputs default to `Completed` unless you supply another status. `as-of` controls the savings cutoff; `from` and `to` filter deletion dates. Historical calculations apply to summary totals, not the current details returned by recommendation list.

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp advisor recommendation summary \
  [--subscriptions <subscription1> <subscription2>] \
  [--service-group <service-group>] \
  [--resource-group <resource-group>] \
  [--group-by <group-by>] \
  [--prioritized <true|false>] \
  [--category <category>] \
  [--impact <impact>] \
  [--status <status>] \
  [--recommendation-type-ids <type-id1> <type-id2>] \
  [--resource-types <resource-type1> <resource-type2>] \
  [--product-family <product-family>] \
  [--resource <resource>] \
  [--search <search>] \
  [--sub-category <sub-category>] \
  [--retirement-date <retirement-date>] \
  [--minimum-savings <minimum-savings>] \
  [--as-of <utc-timestamp>] \
  [--from <utc-timestamp>] \
  [--to <utc-timestamp>] \
  [--top <top>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `subscriptions` | array of strings | No | Subscription names or IDs in the same tenant. Pass a one-element array for one subscription. Can't be combined with `service-group`. If you omit both, the configured default subscription is used. |
| `service-group` | string | No | One service group name, identifier, or full ARM resource ID. Can't be combined with `subscriptions` or `resource-group`. |
| `resource-group` | string | No | The Azure resource group name. Applies only to subscription scope. |
| `group-by` | string | No | Field to group the summary by: `recommendation-type`, `category`, `impact`, `resource-type`, `status`, `sub-category`, or `retirement-date`. Defaults to `category`. Omit it when `prioritized` is `true`, because prioritized summaries always group by recommendation type. |
| `prioritized` | boolean | No | Ranks recommendation types by priority instead of frequency. Ranking considers priority, savings, criticality, retirement date, and affected-resource count. Cost/IdleResources supports lifecycle overrides and uses realized savings for Completed. Defaults to `false`. |
| `category` | string | No | Filter recommendations by category: `Cost`, `HighAvailability`, `Security`, `Performance`, or `OperationalExcellence`. Case-insensitive. |
| `impact` | string | No | Filter recommendations by business impact: `High`, `Medium`, or `Low`. Case-insensitive. |
| `status` | string | No | Lifecycle filter: `New`, `Postponed`, `Dismissed`, or `Completed`. Supported only with category `Cost` and subcategory `IdleResources`. Explicit status takes precedence over defaults. |
| `recommendation-type-ids` | array of strings | No | Recommendation type GUIDs. Matches any supplied value, case-insensitively. |
| `resource-types` | array of strings | No | Impacted resource types. Matches any supplied value against `properties.impactedField`, case-insensitively. |
| `product-family` | string | No | Case-insensitive exact match against the recommendation metadata's Azure product family. |
| `resource` | string | No | Filter recommendations by impacted resource name or full ARM resource ID. Case-insensitive substring match. |
| `search` | string | No | Free-text filter on the recommendation problem text, such as `encryption` or `right-size`. Case-insensitive substring match. Prefer a structured filter when one fits the request. |
| `sub-category` | string | No | Filter recommendations by subcategory, such as `ServiceUpgradeAndRetirement`, `ZoneResiliency`, or `RegionalResiliency`. Case-insensitive exact match. |
| `retirement-date` | string | No | Filter recommendations by service-retirement date in `<operator>:<yyyy-MM-dd>` format, for example `le:2026-12-31`. Supported operators are `eq`, `lt`, `le`, `gt`, and `ge`. The `le` and `lt` operators include overdue retirements that are still active. |
| `top` | integer | No | Maximum number of groups to return, from 1 through 100. Defaults to all groups, or to 10 when `prioritized` is `true`. |
| `minimum-savings` | decimal | No | Minimum annualized retail potential savings in USD, zero or greater. Requires category `Cost` and subcategory `IdleResources`. Missing pricing doesn't satisfy the threshold. |
| `as-of` | timestamp | No | Savings cutoff in ISO 8601 UTC format. Can't be in the future. Requires Cost/IdleResources and defaults status to `Completed` unless explicitly supplied. |
| `from` | timestamp | No | Include completed recommendations deleted on or after this UTC timestamp. Requires Cost/IdleResources and defaults status to `Completed` unless explicitly supplied. |
| `to` | timestamp | No | Include completed recommendations deleted on or before this UTC timestamp. Requires Cost/IdleResources and defaults status to `Completed` unless explicitly supplied. When both bounds are supplied, `from` must not be later than `to`. |

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli advisor recommendation summary -->

Example prompts include:

- "Summarize the key themes from my Advisor recommendations in subscription \<subscription\>."
- "Group Advisor recommendations by impact in subscription \<subscription\>."
- "Which resource types have the most high-impact recommendations in subscription \<subscription\>?"
- "How many Advisor recommendations are New, Postponed, Dismissed, or Completed in subscription \<subscription\>?"
- "How many overdue service-retirement recommendations are still active in subscription \<subscription\>?"
- "What are my top 5 Advisor recommendations to fix first in subscription \<subscription\>?"
- "Summarize Advisor recommendations by category for service group \<service-group\>."
- "Summarize unused-resource savings across subscriptions \<subscription1\> and \<subscription2\>."
- "Show realized savings for completed idle-resource cleanup in subscription \<subscription\>."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Subscriptions** | Optional | Array of subscription names or IDs in the same tenant, including a one-element array for one subscription. Can't be combined with **Service group**. If you omit both, the configured default subscription is used. |
| **Service group** | Optional | One service group name, identifier, or full ARM resource ID. Can't be combined with **Subscriptions** or **Resource group**. |
| **Resource group** |  Optional | The Azure resource group name. Applies only to subscription scope. |
| **Group by** |  Optional | Field to group the summary by: `recommendation-type`, `category`, `impact`, `resource-type`, `status`, `sub-category`, or `retirement-date`. Defaults to `category`. Omit it when **Prioritized** is `true`, because prioritized summaries always group by recommendation type. |
| **Prioritized** | Optional | Ranks recommendation types by priority instead of frequency. Ranking considers priority, savings, criticality, retirement date, and affected-resource count. Cost/IdleResources supports lifecycle overrides and uses realized savings for Completed. Defaults to `false`. |
| **Category** |  Optional | Filter recommendations by category: `Cost`, `HighAvailability`, `Security`, `Performance`, or `OperationalExcellence`. Case-insensitive. |
| **Impact** |  Optional | Filter recommendations by business impact: `High`, `Medium`, or `Low`. Case-insensitive. |
| **Status** | Optional | Lifecycle filter: `New`, `Postponed`, `Dismissed`, or `Completed`. Supported only with category `Cost` and subcategory `IdleResources`. Explicit status takes precedence over defaults. |
| **Recommendation type IDs** | Optional | Array of recommendation type GUIDs. Matches any supplied value, case-insensitively. |
| **Resource types** | Optional | Array of impacted resource types. Matches any supplied value against `properties.impactedField`, case-insensitively. |
| **Product family** | Optional | Case-insensitive exact match against the recommendation metadata's Azure product family. |
| **Resource** |  Optional | Filter recommendations by impacted resource name or full ARM resource ID. Case-insensitive substring match. |
| **Search** |  Optional | Free-text filter on the recommendation problem text, such as `encryption` or `right-size`. Case-insensitive substring match. Prefer a structured filter when one fits the request. |
| **Sub-category** |  Optional | Filter recommendations by subcategory, such as `ServiceUpgradeAndRetirement`, `ZoneResiliency`, or `RegionalResiliency`. Case-insensitive exact match. |
| **Retirement date** |  Optional | Filter recommendations by service-retirement date in `<operator>:<yyyy-MM-dd>` format, for example `le:2026-12-31`. Supported operators are `eq`, `lt`, `le`, `gt`, and `ge`. The `le` and `lt` operators include overdue retirements that are still active. |
| **Top** |  Optional | Maximum number of groups to return, from 1 through 100. Defaults to all groups, or to 10 when **Prioritized** is `true`. |
| **Minimum savings** | Optional | Minimum annualized retail potential savings in USD, zero or greater. Requires category `Cost` and subcategory `IdleResources`. Missing pricing doesn't satisfy the threshold. |
| **As of** | Optional | Savings cutoff in ISO 8601 UTC format. Can't be in the future. Requires Cost/IdleResources and defaults status to `Completed` unless explicitly supplied. |
| **From** | Optional | Include completed recommendations deleted on or after this UTC timestamp. Requires Cost/IdleResources and defaults status to `Completed` unless explicitly supplied. |
| **To** | Optional | Include completed recommendations deleted on or before this UTC timestamp. Requires Cost/IdleResources and defaults status to `Completed` unless explicitly supplied. When both bounds are supplied, **From** must not be later than **To**. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## Recommendation: Prevalidate

Checks deletion readiness for affected resources in one selected Cost/IdleResources recommendation type. The tool uses current `New` recommendations and supports only onboarded deletion recommendation types. It rechecks detection, minimum unused age, management locks, resource-specific risks, and visible dependencies using read-only evidence.

Returns `safe`, `needsReview`, and `blocked` resources with supporting checks, outstanding manual checks, and retail USD savings. Reports unmatched selections and incomplete coverage.

Passing automated checks doesn't authorize deletion. The tool never deletes resources, executes scripts, or changes recommendation state.

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp advisor recommendation prevalidate \
  --recommendation-type-id <recommendation-type-id> \
  [--subscriptions <subscription1> <subscription2>] \
  [--service-group <service-group>] \
  [--resource-group <resource-group>] \
  [--resources <resource-arm-id1> <resource-arm-id2>] \
  [--minimum-unused-days <minimum-unused-days>] \
  [--top <top>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `recommendation-type-id` | string | Yes | Exact recommendation type GUID selected from existing Cost/IdleResources findings. Only onboarded deletion recommendation types are supported. |
| `subscriptions` | array of strings | No | Subscription names or IDs in the same tenant. Pass a one-element array for one subscription. Can't be combined with `service-group`. If you omit both, the configured default subscription is used. |
| `service-group` | string | No | One service group name, identifier, or full ARM resource ID. Can't be combined with `subscriptions` or `resource-group`. |
| `resource-group` | string | No | Resource group name. Applies only to subscription scope. |
| `resources` | array of strings | No | Exact full affected-resource ARM IDs from recommendation list, not resource names or recommendation instance IDs. Omit to validate the selected recommendation type across the scope. Unmatched selections are reported. |
| `minimum-unused-days` | integer | No | Minimum unused age, from 1 through 365 days. Defaults to 30. Recent activity, missing signals, or insufficient history require review and never override a confirmed blocker. |
| `top` | integer | No | Positive maximum number of affected resources to validate after selection. Omit to validate all matches. An explicit cap or incomplete discovery is reported as truncated coverage. |

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli advisor recommendation prevalidate -->

Example prompts include:

- "Check deletion readiness for idle-resource recommendation type \<recommendation-type-id\> in subscription \<subscription\>, including blockers and outstanding manual checks."
- "Prevalidate all affected resources for idle-resource recommendation type \<recommendation-type-id\> in service group \<service-group\>."
- "Prevalidate unused resources for recommendation type \<recommendation-type-id\> using a minimum unused age of 60 days."

| Parameter | Required or optional | Description |
|-----------|----------------------|-------------|
| **Recommendation type ID** | Required | Exact recommendation type GUID selected from existing Cost/IdleResources findings. Only onboarded deletion recommendation types are supported. |
| **Subscriptions** | Optional | Array of subscription names or IDs in the same tenant, including a one-element array for one subscription. Can't be combined with **Service group**. If you omit both, the configured default subscription is used. |
| **Service group** | Optional | One service group name, identifier, or full ARM resource ID. Can't be combined with **Subscriptions** or **Resource group**. |
| **Resource group** | Optional | Resource group name. Applies only to subscription scope. |
| **Resources** | Optional | Array of exact full affected-resource ARM IDs from recommendation list, not resource names or recommendation instance IDs. Omit to validate the selected recommendation type across the scope. Unmatched selections are reported. |
| **Minimum unused days** | Optional | Minimum unused age, from 1 through 365 days. Defaults to 30. Recent activity, missing signals, or insufficient history require review and never override a confirmed blocker. |
| **Top** | Optional | Positive maximum number of affected resources to validate after selection. Omit to validate all matches. An explicit cap or incomplete discovery is reported as truncated coverage. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## Recommendation: Update

Updates the state of one Azure Advisor recommendation or an explicit batch in one subscription or service group. Mark recommendations as completed, dismiss them, postpone (snooze) them until a future date and time, or reactivate them by setting the state to `New`. You can't update Security recommendations or recommendations that the platform resolves.

Specify either `recommendation-id` or `recommendation-ids`, not both. A batch shares one scope, tenant, status, and date or reason. Each item returns its own outcome; the batch isn't atomic. A single-item update returns the updated recommendation in ARM resource shape. A status change doesn't delete a resource or prove cleanup occurred.

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp advisor recommendation update \
  [--recommendation-id <recommendation-id>] \
  [--recommendation-ids <recommendation-id1> <recommendation-id2>] \
  --recommendation-status <recommendation-status> \
  [--subscription <subscription>] \
  [--service-group <service-group>] \
  [--postponed-until-date-time <postponed-until-date-time>] \
  [--recommendation-dismiss-reason <recommendation-dismiss-reason>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `recommendation-id` | string | Conditional | One stable recommendation ID. Required unless you supply `recommendation-ids`. |
| `recommendation-ids` | array of strings | Conditional | Explicit stable recommendation IDs to update independently. Required unless you supply `recommendation-id`. Can't span multiple subscription or service-group scopes. |
| `subscription` | string | No | One subscription name or ID. Can't be combined with `service-group`. If you omit both, the configured default subscription is used. |
| `recommendation-status` | string | Yes | The new recommendation state: `New`, `Postponed`, `Dismissed`, or `Completed`. Use `New` to reactivate a postponed, dismissed, or completed recommendation. |
| `service-group` | string | No | One service group name, identifier, or full ARM resource ID. Can't be combined with `subscription`. |
| `postponed-until-date-time` | string | No | The future date and time until which the recommendation is postponed, in ISO 8601 format with a time zone offset. Required when `recommendation-status` is `Postponed`. |
| `recommendation-dismiss-reason` | string | No | The reason for dismissing the recommendation: `ExcessiveCostInvestmentRequired`, `ImplementationStepsAreUnclear`, `IncompatibleWithTheCurrentConfiguration`, `RiskIsAcceptable`, `TooComplexOrImpracticalToImplement`, `AnAlternativeSolutionIsAlreadyInPlace`, or `Other`. Defaults to `Other` when omitted. |

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli advisor recommendation update -->

Example prompts include:

- "Mark Advisor recommendation \<recommendation-id\> as completed in subscription \<subscription\>."
- "Dismiss Advisor recommendation \<recommendation-id\> in subscription \<subscription\> because the risk is acceptable."
- "Postpone Advisor recommendation \<recommendation-id\> in subscription \<subscription\> until 2026-12-31T00:00:00Z."
- "Reactivate Advisor recommendation \<recommendation-id\> in service group \<service-group\>."
- "Dismiss Advisor recommendations \<recommendation-id1\> and \<recommendation-id2\> in subscription \<subscription\> because the risk is acceptable."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Recommendation ID** | Conditional | One stable recommendation ID. Required unless you supply **Recommendation IDs**. |
| **Recommendation IDs** | Conditional | Array of explicit stable recommendation IDs to update independently. Required unless you supply **Recommendation ID**. Can't span multiple subscription or service-group scopes. |
| **Subscription** | Optional | One subscription name or ID. Can't be combined with **Service group**. If you omit both, the configured default subscription is used. |
| **Recommendation status** |  Required | The new recommendation state: `New`, `Postponed`, `Dismissed`, or `Completed`. Use `New` to reactivate a postponed, dismissed, or completed recommendation. |
| **Service group** | Optional | One service group name, identifier, or full ARM resource ID. Can't be combined with **Subscription**. |
| **Postponed until date time** |  Optional | The future date and time until which the recommendation is postponed, in ISO 8601 format with a time zone offset. Required when **Recommendation status** is `Postponed`. |
| **Recommendation dismiss reason** |  Optional | The reason for dismissing the recommendation: `ExcessiveCostInvestmentRequired`, `ImplementationStepsAreUnclear`, `IncompatibleWithTheCurrentConfiguration`, `RiskIsAcceptable`, `TooComplexOrImpracticalToImplement`, `AnAlternativeSolutionIsAlreadyInPlace`, or `Other`. Defaults to `Other` when omitted. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |

## Remediation: Get

Gets the remediation package for an Azure Advisor recommendation type, which explains how to fix it. Depending on the recommendation, the package contains step-by-step manual guidance, ready-to-run artifacts in Azure CLI, PowerShell, Bicep, ARM template, and Terraform formats, or both. It also includes ordered steps, parameters, verification, and characteristics such as whether the remediation is destructive or reversible, its confidence, and its effort.

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp advisor remediation get \
  --recommendation-type-id <recommendation-type-id>
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `recommendation-type-id` | string | Yes | The Advisor recommendation type ID (GUID) to get the remediation package for, in the form `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`. |

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli advisor remediation get -->

Example prompts include:

- "How do I fix Advisor recommendation type \<recommendation-type-id\>?"
- "Get the remediation steps for Advisor recommendation type \<recommendation-type-id\>."
- "Show the Azure CLI and Bicep artifacts to remediate Advisor recommendation type \<recommendation-type-id\>."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Recommendation type ID** |  Required | The Advisor recommendation type ID (GUID) to get the remediation package for, in the form `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## Service group intelligence: Get

Gets the current Azure Advisor status and criticality of one service group, or of all accessible service groups when you don't specify one. Status values are `On Track`, `Attention Needed`, `At Risk`, `Critical`, and `Unavailable`. Each result includes the service group name and ID, criticality, status, status description, where to focus, the goal when set, and the last updated time. The response also explains how the status is calculated. If you have access to several tenants, specify the tenant.

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp advisor servicegroupintelligence get \
  [--service-group <service-group>] \
  [--criticality <criticality>] \
  [--status <status>] \
  [--top <top>] \
  [--continuation-token <continuation-token>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `service-group` | string | No | The service group name, such as `commerce`, not its full ARM resource ID. If you omit it, the tool returns all accessible service groups. |
| `criticality` | string | No | Filter by criticality tier: `MissionCritical` (Tier 0), `BusinessCritical` (Tier 1), `BusinessOperational` (Tier 2), `Administrative` (Tier 3), or `NotApplicable`. Case-insensitive. `Tier0` through `Tier3` and `0` through `3` are also accepted. |
| `status` | string | No | Filter by status: `On Track`, `Attention Needed`, `At Risk`, `Critical`, or `Unavailable`. Case-insensitive, and spaces are optional. |
| `top` | integer | No | Maximum number of service groups to return, from 1 through 500. Defaults to 50. |
| `continuation-token` | string | No | Token returned by the preceding page. Keep service group, tenant, filters, and `top` unchanged. |

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli advisor servicegroupintelligence get -->

Example prompts include:

- "What is the Advisor status of service group \<service-group\>?"
- "Show the Advisor status of all my service groups."
- "Which mission-critical service groups need attention?"
- "List service groups that are at risk or critical."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Service group** |  Optional | The service group name, such as `commerce`, not its full ARM resource ID. If you omit it, the tool returns all accessible service groups. |
| **Criticality** |  Optional | Filter by criticality tier: `MissionCritical` (Tier 0), `BusinessCritical` (Tier 1), `BusinessOperational` (Tier 2), `Administrative` (Tier 3), or `NotApplicable`. Case-insensitive. `Tier0` through `Tier3` and `0` through `3` are also accepted. |
| **Status** |  Optional | Filter by status: `On Track`, `Attention Needed`, `At Risk`, `Critical`, or `Unavailable`. Case-insensitive, and spaces are optional. |
| **Top** |  Optional | Maximum number of service groups to return, from 1 through 500. Defaults to 50. |
| **Continuation token** | Optional | Token returned by the preceding page. Keep service group, tenant, filters, and **Top** unchanged. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## Related content

- [Azure skill for Azure Advisor Cost Optimization](../../azure-skills/plugins/azure-advisor/azure-advisor-cost-optimization.md)
- [What are the Azure MCP Server tools?](index.md)
- [Get started by using Azure MCP Server](../get-started.md)
- [Azure Advisor documentation](/azure/advisor/)
