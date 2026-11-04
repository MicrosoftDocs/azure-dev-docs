---
title: Azure MCP Server tools for Azure Managed Grafana
description: Use Azure MCP Server tools to list your Azure Managed Grafana workspaces with natural language prompts from your IDE.
ms.date: 11/03/2026
ms.service: azure-mcp-server
ms.topic: concept-article
ms.custom:
  - build-2025
ai-usage: ai-assisted
content_well_notification:
  - AI-contribution
tool_count: 1
mcp-cli.version: "3.0.0-beta.47+bd724faf47e86348c7163a429b584aabfd714876"
---

# Azure MCP Server tools for Azure Managed Grafana

Use the Azure MCP Server to manage Azure Managed Grafana workspaces with natural language prompts. You can list the Grafana workspaces in your subscription without remembering complex syntax.

[Azure Managed Grafana](/azure/managed-grafana/) is a fully managed service that offers Grafana dashboards as a service. You can analyze metrics, logs, and traces without setting up, maintaining, or scaling the Grafana infrastructure yourself.

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## List Grafana workspaces

<!-- grafana list -->

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp grafana list \
  [--resource-group <resource-group>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `resource-group` | string | No | Limit workspaces to this resource group. Omit it to list Grafana workspaces across the subscription. |

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli grafana list -->

Example prompts include:

- **Show all workspaces**: "Show me all Grafana workspaces in my subscription"
- **List monitoring resources**: "What Grafana workspaces do I have available?"
- **Find visualization dashboards**: "List all my Azure Managed Grafana resources"
- **Check workspace status**: "Are there any Grafana workspaces in my dev subscription?"
- **Dashboard inventory**: "I need to see all Grafana workspace resources in my account"

| Parameter | Required or optional | Description |
|-----------|----------------------|-------------|
| **Resource group** | Optional | Limit workspaces to this resource group. Omit it to list Grafana workspaces across the subscription. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure Managed Grafana documentation](/azure/managed-grafana/)
- [Azure Monitor overview](/azure/azure-monitor/overview)
- [Data visualization in Azure](/azure/architecture/best-practices/monitoring)
