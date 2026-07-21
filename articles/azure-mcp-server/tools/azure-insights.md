---
title: Azure MCP Server tools for Azure Insights
description: Azure MCP Server tools help analyze deployed Azure resources and generate infrastructure insights with natural language prompts from your IDE.
author: diberry
ms.author: diberry
ms.reviewer: mren, arunrab
ms.date: 07/17/2026
ms.topic: concept-article
ms.custom:
  - build-2025
ai-usage: ai-generated
content_well_notification:
  - AI-contribution
mcp-cli.version: "3.0.0-beta.26+043b8decd3a0cd57c1fdb79b4c62915b297e9734"
---
# Azure MCP Server tools for Azure Insights

The Azure MCP Server insights tools help you analyze deployed Azure resources across a subscription or tenant. These tools aggregate Azure Resource Graph data and surface infrastructure patterns that can inform planning.

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## Get environment insights

Analyze an existing Azure environment to get insights about its infrastructure. The tool inspects resources deployed across a single subscription or an entire tenant. It aggregates them from Azure Resource Graph and identifies patterns, trends, and the overall composition of what's deployed.

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli insights get -->

Use this tool to tailor insights toward a scenario by providing a free-form query, or omit the query to return generic patterns. You can use this command only if the client supports MCP sampling.

Example prompts include:

- "Generate insights from my current subscription."
- "Summarize what's deployed across my Azure environment and highlight notable patterns."
- "Analyze my tenant and give me insights about the overall infrastructure."
- "What can you tell me about my existing Azure environment?"
- "Analyze subscription `<subscription-id>` for architectural patterns."
- "Analyze my Azure infrastructure and surface patterns to help me plan my next project."
- "Generate insights about my Azure environment to help me plan a new data analytics platform."
- "What insights can you derive about my subscription to help me plan a containerized microservices workload on AKS?"

| Parameter | Required or optional | Description |
|-----------|----------------------|-------------|
| **Query** | Optional | A free-form description of what the insights will be used for, such as the application or planning scenario. When provided, the tool tailors insights toward that scenario. When omitted, the tool returns generic patterns. |
| **No cache** | Optional | Bypass the cached aggregation and force a fresh Azure Resource Graph scan. The newly computed aggregation replaces the cached entry for the same scope. |
| **Scope** | Optional | Aggregation scope. Use `subscription` to scan one subscription, using the specified subscription or the default subscription. Use `tenant` to scan every accessible subscription in the tenant. |

#### [Azure MCP CLI](#tab/azure-mcp-cli)

```console
azmcp insights get \
  [--query <query>] \
  [--nocache <nocache>] \
  [--scope <scope>] \
  [--subscription <subscription>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--query` | string | No | A free-form description of what the insights are used for. When provided, the tool tailors insights toward this scenario. When omitted, the tool returns generic patterns. |
| `--nocache` | string | No | Bypass the cached aggregation and force a fresh Azure Resource Graph scan. The newly computed aggregation replaces the cached entry for the same scope. |
| `--scope` | string | No | Aggregation scope. Use `subscription` to scan a single subscription, or `tenant` to scan every accessible subscription in the tenant. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ✅ | ❌ |

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure Resource Graph documentation](/azure/governance/resource-graph/)
