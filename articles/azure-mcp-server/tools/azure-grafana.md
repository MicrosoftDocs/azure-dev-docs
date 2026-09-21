---
title: Azure MCP Server tools for Azure Managed Grafana
description: Use Azure MCP Server tools to list your Azure Managed Grafana workspaces with natural language prompts from your IDE.
ms.date: 08/11/2026
ms.service: azure-mcp-server
ms.topic: concept-article
ai-usage: ai-assisted
content_well_notification:
  - AI-contribution
---

# Azure MCP Server tools for Azure Managed Grafana

Use the Azure MCP Server to manage Azure Managed Grafana workspaces with natural language prompts. You can list the Grafana workspaces in your subscription without remembering complex syntax.

[Azure Managed Grafana](/azure/managed-grafana/) is a fully managed service that offers Grafana dashboards as a service. You can analyze metrics, logs, and traces without setting up, maintaining, or scaling the Grafana infrastructure yourself.

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## List Grafana workspaces

<!-- grafana list -->

Lists all Azure Managed Grafana workspaces in your subscription. This command helps you view and manage your Grafana workspace resources across your Azure environment.

Example prompts include:

- **Show all workspaces**: "Show me all Grafana workspaces in my subscription"
- **List monitoring resources**: "What Grafana workspaces do I have available?"
- **Find visualization dashboards**: "List all my Azure Managed Grafana resources"
- **Check workspace status**: "Are there any Grafana workspaces in my dev subscription?"
- **Dashboard inventory**: "I need to see all Grafana workspace resources in my account"

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
