---
title: Azure MCP Server tools for Azure Optimization
description: Azure MCP Server tools help you manage Azure Optimization resources with natural language prompts from your IDE.
ms.service: azure-mcp-server
ms.topic: concept-article
tool_count: 3
mcp-cli.version: 3.0.0-beta.47+bd724faf47e86348c7163a429b584aabfd714876
author: diberry
ms.author: diberry
ms.reviewer: smanojkumar
ms.date: 11/03/2026
ai-usage: ai-generated
ms.custom: build-2025
content_well_notification:
  - AI-contribution
---

# Azure MCP Server tools for Azure Optimization

Azure Model Context Protocol (MCP) Server tools help you manage Azure Optimization resources with natural language prompts. You can get recommendations, compare alternatives, and explain recommendations.

Azure Optimization uses [Azure Advisor](/azure/advisor/advisor-overview) recommendations to help you identify cost-saving opportunities and compare compute resize options.

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]


## Alternatives recommendation

Retrieves alternative compute resize recommendations—other SKUs, series, or sizes beyond the primary recommendation—for an Azure virtual machine (VM) or virtual machine scale set (VMSS). Use optional inclusion and exclusion filters to narrow proposed SKUs, VM series, and processor types. Provide the full Azure Resource Manager resource ID. If you only have the resource name, look up the resource ID before running the tool. Provide a subscription name or ID. The tool resolves a subscription name to its ID. Returns a markdown comparison table and parsed alternatives. Presents alternatives as an ordered comparison table and explains tradeoffs among estimated savings, cores, SKU, VM series, and processor. The output doesn't include raw JSON.

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp optimization recommendation alternatives \
  --resource-id <resource-id> \
  [--new-skus <new-skus>] \
  [--new-vm-series <new-vm-series>] \
  [--new-processor-types <new-processor-types>] \
  [--exclude-skus <exclude-skus>] \
  [--exclude-vm-series <exclude-vm-series>] \
  [--exclude-processor-types <exclude-processor-types>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `resource-id` | string | Yes | Full Azure ARM resource ID of the VM or VM Scale Set, for example, `/subscriptions/&lt;subId&gt;/resourceGroups/&lt;rg&gt;/providers/Microsoft.Compute/virtualMachines/&lt;name&gt;`. You can pass either the impacted resource ID or the Advisor recommendation ID (the `/providers/Microsoft.Advisor/...` suffix is stripped automatically). Use the `resourceId` or `id` field from the `list` tool output. |
| `new-skus` | string | No | Only include proposals whose new SKU matches any of these (comma or semicolon separated, for example, `Standard_D4s_v5, Standard_E4s_v5`). |
| `new-vm-series` | string | No | Only include proposals whose new VM series matches any of these (comma or semicolon separated, for example, `Dsv5, Esv5`). |
| `new-processor-types` | string | No | Only include proposals whose new processor type matches any of these (for example, `Intel, AMD`). |
| `exclude-skus` | string | No | Exclude proposals whose new SKU matches any of these. |
| `exclude-vm-series` | string | No | Exclude proposals whose new VM series matches any of these. |
| `exclude-processor-types` | string | No | Exclude proposals whose new processor type matches any of these. |

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli optimization recommendation alternatives -->

Example prompts include:

- "Show me alternative resize options for the VM \<resource_id\>"
- "What other SKUs could I resize \<resource_id\> to, excluding AMD processors?"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource ID** |  Required | Full Azure ARM resource ID of the VM or VM Scale Set, for example `/subscriptions/&lt;subId&gt;/resourceGroups/&lt;rg&gt;/providers/Microsoft.Compute/virtualMachines/&lt;name&gt;`. You can pass either the impacted resource ID or the Advisor recommendation ID (the `/providers/Microsoft.Advisor/...` suffix is stripped automatically). Use the `resourceId` or `ID` field from the `list` tool output. |
| **New SKUs** |  Optional | Only include proposals whose new SKU matches any of these (comma or semicolon separated, for example `Standard_D4s_v5, Standard_E4s_v5`). |
| **New VM series** |  Optional | Only include proposals whose new VM series matches any of these (comma or semicolon separated, for example `Dsv5, Esv5`). |
| **New processor types** |  Optional | Only include proposals whose new processor type matches any of these (for example `Intel, AMD`). |
| **Exclude SKUs** |  Optional | Exclude proposals whose new SKU matches any of these. |
| **Exclude VM series** |  Optional | Exclude proposals whose new VM series matches any of these. |
| **Exclude processor types** |  Optional | Exclude proposals whose new processor type matches any of these. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## Explain recommendation

Explains a specific Azure Advisor cost and right-size recommendation for a resource, and returns its utilization time series that a client can render as an inline chart. Common prompts include "explain recommendation N", "explain this recommendation", "tell me more about recommendation N", "why is this recommended", and "go deeper on" a recommendation after listing recommendations with the `list` tool. Provide the resource ID from the corresponding row returned by the `list` tool. Provide the subscription name or ID; names resolve to IDs automatically.

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp optimization recommendation explain \
  --resource-id <resource-id> \
  [--target-sku <target-sku>] \
  [--view <view>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `resource-id` | string | Yes | Full Azure ARM resource ID of the VM or VM Scale Set, for example, `/subscriptions/<subId>/resourceGroups/<rg>/providers/Microsoft.Compute/virtualMachines/<name>`. You can pass either the impacted resource ID or the Advisor recommendation ID (the `/providers/Microsoft.Advisor/...` suffix is stripped automatically). Use the `resourceId` or `id` field from the `list` tool output. |
| `target-sku` | string | No | Optional target Azure VM SKU to compare against the current SKU, for example, `Standard_E2as_v5`. When omitted, only the current utilization is returned (no target configuration or projected target series). Set this parameter only when you explicitly name a SKU to project against. |
| `view` | string | No | Which utilization views to return: `Detail` (default, 7-day / 30-minute maximum), `Trend` (7-day / 6-hour), or `Both`. Only set `Trend` or `Both` when you explicitly request longer-term data. |

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli optimization recommendation explain -->

Example prompts include:

- "Explain the recommendation \<recommendation_type_id\> for resource \<resource_id\> and show its utilization"
- "Why is \<resource_id\> recommended for resizing to \<target_sku\>?"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource ID** |  Required | Full Azure ARM resource ID of the VM or VM Scale Set, for example `/subscriptions/<subId>/resourceGroups/<rg>/providers/Microsoft.Compute/virtualMachines/<name>`. You can pass either the impacted resource ID or the Advisor recommendation ID (the `/providers/Microsoft.Advisor/...` suffix is stripped automatically). Use the `resourceId` or `ID` field from the `list` tool output. |
| **Target SKU** |  Optional | Optional target Azure VM SKU to compare against the current SKU, for example `Standard_E2as_v5`. When omitted, only the current utilization is returned (no target configuration or projected target series). Set this parameter only when the user explicitly names a SKU to project against. |
| **View** |  Optional | Which utilization views to return: `Detail` (default, 7-day / 30-minute maximum), `Trend` (7-day / 6-hour), or `Both`. Only set `Trend` or `Both` when you explicitly request longer-term data. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## Get recommendations

Gets Azure cost-saving and cost-optimization recommendations for a subscription. Ranks recommendations by impact and by currency-normalized annual savings. Runs a curated Azure Resource Graph query over Azure Advisor cost recommendations.

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp optimization recommendation list \
  [--top <top>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `top` | string | No | Maximum number of cost-saving recommendations to return (1-1000, default 100). Results are ranked by impact then currency-normalized annual savings. |

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli optimization recommendation list -->

Example prompts include:

- "Show me the top cost-saving recommendations for my subscription"
- "What are my cost optimization recommendations?"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Top** |  Optional | Maximum number of cost-saving recommendations to return (1-1000, default 100). Results are ranked by impact then currency-normalized annual savings. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
