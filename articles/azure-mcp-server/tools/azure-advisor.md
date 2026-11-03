---

title: Azure MCP Server tools for Azure Advisor
description: Use Azure MCP Server tools with natural language prompts or Azure MCP CLI commands to manage Azure Advisor recommendations and optimizations.
ms.date: 11/02/2026
ms.service: azure-mcp-server
ms.topic: concept-article
tool_count: 7
mcp-cli.version: 4.0.0-beta.4+fab10c6884593b2b17a1135279c2fb79bdb65016
author: sandeep-sen
ms.author: sandeepsen
ms.reviewer: ankiga 
ai-usage: ai-generated
content_well_notification:
  - AI-contribution
---

# Azure MCP Server tools for Azure Advisor

The Azure MCP Server helps you work with Azure Advisor through natural language prompts. You can list, summarize, prioritize, and update recommendations, explore recommendation metadata, get remediation guidance, and check the status of service groups.

Azure Advisor analyzes your Azure resources and delivers personalized, actionable recommendations to optimize cost, performance, reliability, and security. For more information, see [Azure Advisor documentation](/azure/advisor/).

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]


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
- "Show the learn-more link for Advisor recommendation type \<recommendation-type-id\>."

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

## Recommendation: List

Lists individual Azure Advisor recommendations and their affected-resource details in a subscription or service group. Supports filters for category, subcategory, impact, status, recommendation type ID, affected resource, resource type, free text, Service Health tracking IDs, and retirement date. Returns recommendations in Azure Resource Manager (ARM) resource shape, plus an indicator that shows whether results were truncated. Each recommendation's `name` is its recommendation ID.

Use this tool to view individual recommendations. For counts, totals, rankings, or grouped analysis, use [Recommendation: Summary](#recommendation-summary) instead. To find the top or most critical recommendations across types, start with a prioritized summary, and then use this tool with the selected recommendation type ID and `prioritized` set to `true` to order its individual recommendations.

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp advisor recommendation list \
  [--service-group <service-group>] \
  [--resource-group <resource-group>] \
  [--category <category>] \
  [--impact <impact>] \
  [--status <status>] \
  [--recommendation-type-id <recommendation-type-id>] \
  [--resource-type <resource-type>] \
  [--resource <resource>] \
  [--search <search>] \
  [--sub-category <sub-category>] \
  [--tracking-ids <tracking-id1> <tracking-id2>] \
  [--retirement-date <retirement-date>] \
  [--top <top>] \
  [--prioritized <true|false>] \
  [--show-prioritization-signals <true|false>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `service-group` | string | No | The Azure service group to list recommendations for, provided as the name segment of its ARM resource ID. Specify either a service group or a subscription, not both. If you omit both, the tool uses the configured default subscription. |
| `resource-group` | string | No | The Azure resource group name. Applies only to subscription scope. |
| `category` | string | No | Filter recommendations by category: `Cost`, `HighAvailability`, `Security`, `Performance`, or `OperationalExcellence`. Case-insensitive exact match. |
| `impact` | string | No | Filter recommendations by business impact: `High`, `Medium`, or `Low`. Case-insensitive exact match. |
| `status` | string | No | Filter recommendations by status: `New`, `Postponed`, `Dismissed`, or `Completed`. Defaults to `New`. |
| `recommendation-type-id` | string | No | Filter recommendations by recommendation type ID (GUID). Case-insensitive exact match. |
| `resource-type` | string | No | Filter recommendations by impacted Azure resource type, such as `Microsoft.Storage/storageAccounts`. Case-insensitive exact match. |
| `resource` | string | No | Filter recommendations by impacted resource name or full ARM resource ID. Case-insensitive substring match. |
| `search` | string | No | Free-text filter on the recommendation problem text, such as `encryption` or `right-size`. Case-insensitive substring match. Prefer a structured filter when one fits the request. |
| `sub-category` | string | No | Filter recommendations by subcategory, such as `ServiceUpgradeAndRetirement` or `ZoneResiliency`. Case-insensitive. |
| `tracking-ids` | array of strings | No | Filter recommendations by one or more Service Health tracking IDs, such as `QNY1-HB8`. Pass several IDs as space-separated values. Applies within the `ServiceUpgradeAndRetirement` subcategory. |
| `retirement-date` | string | No | Filter recommendations by service-retirement date in `<operator>:<yyyy-MM-dd>` format, for example `ge:2026-03-31`. Supported operators are `eq`, `lt`, `le`, `gt`, and `ge`. Applies within the `ServiceUpgradeAndRetirement` subcategory. |
| `top` | integer | No | Maximum number of recommendation records to return. Defaults to 50, with a range of 1 through 100. |
| `prioritized` | boolean | No | Orders the matching recommendations by priority. Requires `recommendation-type-id`. Cost recommendations are ordered by annual savings; other categories are ordered by criticality score. Defaults to `false`. |
| `show-prioritization-signals` | boolean | No | Includes the prioritization signals for each recommendation when available. Requires `prioritized` set to `true`. Defaults to `false`. |

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli advisor recommendation list -->

Example prompts include:

- "List all Advisor recommendations in subscription \<subscription\>."
- "Show me high-impact Security recommendations in subscription \<subscription\>."
- "List Cost recommendations for storage accounts in subscription \<subscription\>."
- "Show postponed Advisor recommendations in subscription \<subscription\>."
- "List Advisor recommendations for service group \<service-group\>."
- "Which resources are affected by service retirement tracking ID QNY1-HB8 in subscription \<subscription\>?"
- "List the most critical resources for recommendation type \<recommendation-type-id\> in subscription \<subscription\>."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Service group** |  Optional | The Azure service group to list recommendations for, provided as the name segment of its ARM resource ID. Specify either a service group or a subscription, not both. If you omit both, the tool uses the configured default subscription. |
| **Resource group** |  Optional | The Azure resource group name. Applies only to subscription scope. |
| **Category** |  Optional | Filter recommendations by category: `Cost`, `HighAvailability`, `Security`, `Performance`, or `OperationalExcellence`. Case-insensitive exact match. |
| **Impact** |  Optional | Filter recommendations by business impact: `High`, `Medium`, or `Low`. Case-insensitive exact match. |
| **Status** |  Optional | Filter recommendations by status: `New`, `Postponed`, `Dismissed`, or `Completed`. Defaults to `New`. |
| **Recommendation type ID** |  Optional | Filter recommendations by recommendation type ID (GUID). Case-insensitive exact match. |
| **Resource type** |  Optional | Filter recommendations by impacted Azure resource type, such as `Microsoft.Storage/storageAccounts`. Case-insensitive exact match. |
| **Resource** |  Optional | Filter recommendations by impacted resource name or full ARM resource ID. Case-insensitive substring match. |
| **Search** |  Optional | Free-text filter on the recommendation problem text, such as `encryption` or `right-size`. Case-insensitive substring match. Prefer a structured filter when one fits the request. |
| **Sub-category** |  Optional | Filter recommendations by subcategory, such as `ServiceUpgradeAndRetirement` or `ZoneResiliency`. Case-insensitive. |
| **Tracking IDs** |  Optional | Filter recommendations by one or more Service Health tracking IDs, such as `QNY1-HB8`. Applies within the `ServiceUpgradeAndRetirement` subcategory. |
| **Retirement date** |  Optional | Filter recommendations by service-retirement date in `<operator>:<yyyy-MM-dd>` format, for example `ge:2026-03-31`. Supported operators are `eq`, `lt`, `le`, `gt`, and `ge`. Applies within the `ServiceUpgradeAndRetirement` subcategory. |
| **Top** |  Optional | Maximum number of recommendation records to return. Defaults to 50, with a range of 1 through 100. |
| **Prioritized** |  Optional | Orders the matching recommendations by priority. Requires a recommendation type ID. Cost recommendations are ordered by annual savings; other categories are ordered by criticality score. Defaults to `false`. |
| **Show prioritization signals** |  Optional | Includes the prioritization signals for each recommendation when available. Requires **Prioritized** set to `true`. Defaults to `false`. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## Recommendation: Summary

Summarizes Azure Advisor recommendations in a subscription or service group with server-side counts, totals, rankings, and distributions. Use it for questions such as how many, breakdowns, most common, or which resource types have the most recommendations. Group results by `recommendation-type`, `category`, `impact`, `resource-type`, `status`, `sub-category`, or `retirement-date`. The default grouping is `category`. All groupings except `status` include only active recommendations with status `New`.

Set `prioritized` to `true` to rank active recommendation types by priority, for requests such as top recommendations, most critical, or what to fix first. Each ranked type includes its affected-resource count and the signals that explain its rank. To see the individual recommendations for a ranked type, use [Recommendation: List](#recommendation-list) with its recommendation type ID.

`TotalRecommendations` always reflects the complete filtered population, even when `top` limits the groups returned.

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp advisor recommendation summary \
  [--service-group <service-group>] \
  [--resource-group <resource-group>] \
  [--group-by <group-by>] \
  [--prioritized <true|false>] \
  [--category <category>] \
  [--impact <impact>] \
  [--recommendation-type-id <recommendation-type-id>] \
  [--resource-type <resource-type>] \
  [--resource <resource>] \
  [--search <search>] \
  [--sub-category <sub-category>] \
  [--retirement-date <retirement-date>] \
  [--top <top>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `service-group` | string | No | The Azure service group to summarize, provided as the name segment of its ARM resource ID. Specify either a service group or a subscription, not both. If you omit both, the tool uses the configured default subscription. |
| `resource-group` | string | No | The Azure resource group name. Applies only to subscription scope. |
| `group-by` | string | No | Field to group the summary by: `recommendation-type`, `category`, `impact`, `resource-type`, `status`, `sub-category`, or `retirement-date`. Defaults to `category`. Omit it when `prioritized` is `true`, because prioritized summaries always group by recommendation type. |
| `prioritized` | boolean | No | Ranks active recommendation types by priority instead of counting them. Ranking considers priority score, annual savings, criticality, retirement date, and affected-resource count. Defaults to `false`. |
| `category` | string | No | Filter recommendations by category: `Cost`, `HighAvailability`, `Security`, `Performance`, or `OperationalExcellence`. Case-insensitive. |
| `impact` | string | No | Filter recommendations by business impact: `High`, `Medium`, or `Low`. Case-insensitive. |
| `recommendation-type-id` | string | No | Filter recommendations by recommendation type ID (GUID). Case-insensitive exact match. |
| `resource-type` | string | No | Filter recommendations by impacted Azure resource type, such as `Microsoft.Storage/storageAccounts`. Case-insensitive exact match. |
| `resource` | string | No | Filter recommendations by impacted resource name or full ARM resource ID. Case-insensitive substring match. |
| `search` | string | No | Free-text filter on the recommendation problem text, such as `encryption` or `right-size`. Case-insensitive substring match. Prefer a structured filter when one fits the request. |
| `sub-category` | string | No | Filter recommendations by subcategory, such as `ServiceUpgradeAndRetirement`, `ZoneResiliency`, or `RegionalResiliency`. Case-insensitive exact match. |
| `retirement-date` | string | No | Filter recommendations by service-retirement date in `<operator>:<yyyy-MM-dd>` format, for example `le:2026-12-31`. Supported operators are `eq`, `lt`, `le`, `gt`, and `ge`. The `le` and `lt` operators include overdue retirements that are still active. |
| `top` | integer | No | Maximum number of groups to return, from 1 through 100. Defaults to all groups, or to 10 when `prioritized` is `true`. |

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

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Service group** |  Optional | The Azure service group to summarize, provided as the name segment of its ARM resource ID. Specify either a service group or a subscription, not both. If you omit both, the tool uses the configured default subscription. |
| **Resource group** |  Optional | The Azure resource group name. Applies only to subscription scope. |
| **Group by** |  Optional | Field to group the summary by: `recommendation-type`, `category`, `impact`, `resource-type`, `status`, `sub-category`, or `retirement-date`. Defaults to `category`. Omit it when **Prioritized** is `true`, because prioritized summaries always group by recommendation type. |
| **Prioritized** |  Optional | Ranks active recommendation types by priority instead of counting them. Ranking considers priority score, annual savings, criticality, retirement date, and affected-resource count. Defaults to `false`. |
| **Category** |  Optional | Filter recommendations by category: `Cost`, `HighAvailability`, `Security`, `Performance`, or `OperationalExcellence`. Case-insensitive. |
| **Impact** |  Optional | Filter recommendations by business impact: `High`, `Medium`, or `Low`. Case-insensitive. |
| **Recommendation type ID** |  Optional | Filter recommendations by recommendation type ID (GUID). Case-insensitive exact match. |
| **Resource type** |  Optional | Filter recommendations by impacted Azure resource type, such as `Microsoft.Storage/storageAccounts`. Case-insensitive exact match. |
| **Resource** |  Optional | Filter recommendations by impacted resource name or full ARM resource ID. Case-insensitive substring match. |
| **Search** |  Optional | Free-text filter on the recommendation problem text, such as `encryption` or `right-size`. Case-insensitive substring match. Prefer a structured filter when one fits the request. |
| **Sub-category** |  Optional | Filter recommendations by subcategory, such as `ServiceUpgradeAndRetirement`, `ZoneResiliency`, or `RegionalResiliency`. Case-insensitive exact match. |
| **Retirement date** |  Optional | Filter recommendations by service-retirement date in `<operator>:<yyyy-MM-dd>` format, for example `le:2026-12-31`. Supported operators are `eq`, `lt`, `le`, `gt`, and `ge`. The `le` and `lt` operators include overdue retirements that are still active. |
| **Top** |  Optional | Maximum number of groups to return, from 1 through 100. Defaults to all groups, or to 10 when **Prioritized** is `true`. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## Recommendation: Update

Updates the state of one Azure Advisor recommendation in a subscription or service group. Mark a recommendation as completed, dismiss it, postpone (snooze) it until a future date and time, or reactivate it by setting it to `New`. Returns the updated recommendation in ARM resource shape. You can't update Security recommendations or recommendations that the platform resolves.

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp advisor recommendation update \
  --recommendation-id <recommendation-id> \
  --recommendation-status <recommendation-status> \
  [--service-group <service-group>] \
  [--postponed-until-date-time <postponed-until-date-time>] \
  [--recommendation-dismiss-reason <recommendation-dismiss-reason>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `recommendation-id` | string | Yes | The stable ID of the Advisor recommendation to update. |
| `recommendation-status` | string | Yes | The new recommendation state: `New`, `Postponed`, `Dismissed`, or `Completed`. Use `New` to reactivate a postponed, dismissed, or completed recommendation. |
| `service-group` | string | No | The Azure service group that contains the recommendation, provided as the name segment of its ARM resource ID. Specify either a service group or a subscription, not both. If you omit both, the tool uses the configured default subscription. |
| `postponed-until-date-time` | string | No | The future date and time until which the recommendation is postponed, in ISO 8601 format with a time zone offset. Required when `recommendation-status` is `Postponed`. |
| `recommendation-dismiss-reason` | string | No | The reason for dismissing the recommendation: `ExcessiveCostInvestmentRequired`, `ImplementationStepsAreUnclear`, `IncompatibleWithTheCurrentConfiguration`, `RiskIsAcceptable`, `TooComplexOrImpracticalToImplement`, `AnAlternativeSolutionIsAlreadyInPlace`, or `Other`. Defaults to `Other` when omitted. |

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli advisor recommendation update -->

Example prompts include:

- "Mark Advisor recommendation \<recommendation-id\> as completed in subscription \<subscription\>."
- "Dismiss Advisor recommendation \<recommendation-id\> in subscription \<subscription\> because the risk is acceptable."
- "Postpone Advisor recommendation \<recommendation-id\> in subscription \<subscription\> until 2026-12-31T00:00:00Z."
- "Reactivate Advisor recommendation \<recommendation-id\> in service group \<service-group\>."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Recommendation ID** |  Required | The stable ID of the Advisor recommendation to update. |
| **Recommendation status** |  Required | The new recommendation state: `New`, `Postponed`, `Dismissed`, or `Completed`. Use `New` to reactivate a postponed, dismissed, or completed recommendation. |
| **Service group** |  Optional | The Azure service group that contains the recommendation, provided as the name segment of its ARM resource ID. Specify either a service group or a subscription, not both. If you omit both, the tool uses the configured default subscription. |
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
  [--top <top>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `service-group` | string | No | The service group name, such as `commerce`, not its full ARM resource ID. If you omit it, the tool returns all accessible service groups. |
| `criticality` | string | No | Filter by criticality tier: `MissionCritical` (Tier 0), `BusinessCritical` (Tier 1), `BusinessOperational` (Tier 2), `Administrative` (Tier 3), or `NotApplicable`. Case-insensitive. `Tier0` through `Tier3` and `0` through `3` are also accepted. |
| `status` | string | No | Filter by status: `On Track`, `Attention Needed`, `At Risk`, `Critical`, or `Unavailable`. Case-insensitive, and spaces are optional. |
| `top` | integer | No | Maximum number of service groups to return, from 1 through 500. Defaults to 50. |

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

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started by using Azure MCP Server](../get-started.md)
- [Azure Advisor documentation](/azure/advisor/)
