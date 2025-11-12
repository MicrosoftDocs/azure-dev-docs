---
title: Azure Managed Grafana Tools - Azure MCP Server
description: Learn how to use the Azure MCP Server with Azure Managed Grafana to monitor and visualize your metrics and logs.
keywords: azure mcp server, azmcp, azure managed grafana, monitoring, dashboards, visualization
ms.service: azure-mcp-server
ms.topic: reference
ms.date: 10/27/2025
content_well_notification: 
  - AI-contribution
ai-usage: ai-assisted
---

# Azure Managed Grafana tools for the Azure MCP Server

The Azure MCP Server allows you to manage Azure resources, including Azure Managed Grafana workspaces using natural language prompts. This enables you to quickly manage your monitoring and visualization resources without remembering complex syntax.

[Azure Managed Grafana](/azure/managed-grafana/) is a fully managed service that offers Grafana dashboards as a service. It enables you to analyze metrics, logs, and traces without having to worry about setting up, maintaining, or scaling the Grafana infrastructure.

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

[!INCLUDE [grafana list](../includes/tools/annotations/azure-managed-grafana-list-annotations.md)]

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure Managed Grafana documentation](/azure/managed-grafana/)
- [Azure Monitor overview](/azure/azure-monitor/overview)
- [Data visualization in Azure](/azure/architecture/best-practices/monitoring)
