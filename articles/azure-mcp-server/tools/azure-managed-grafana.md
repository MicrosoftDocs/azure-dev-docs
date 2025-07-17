---
title: Use Azure Managed Grafana with Azure MCP Server
titleSuffix: Azure MCP Server
description: Send natural language commands to Azure Managed Grafana to manage your visualization dashboards from Azure MCP Server.
ms.service: azure-mcp
ms.author: meburns
author: maggiesMSFT
ms.date: 07/17/2025
ms.topic: how-to
---

# Use Azure Managed Grafana with Azure MCP Server

This article describes how to use [Azure Managed Grafana](/azure/managed-grafana/overview) features from Azure MCP Server. Azure MCP Server supports managing your Grafana workspaces through natural language prompts.

## Prerequisites

* An Azure account with an active subscription.
* Azure MCP Server connected to your Azure subscriptions.
* Existing Azure Managed Grafana workspaces in your Azure subscription or permissions to list Grafana workspaces.

## Commands

### List Grafana workspaces

<!-- azmcp grafana list --subscription <subscription> -->

List all Azure Managed Grafana workspaces in a specified Azure subscription.

**Parameters:**

| Parameter | Required | Description |
|-----------|----------|-------------|
| `subscription` | Yes | The Azure subscription ID or name |

**Example prompts:**

- **List all workspaces**: "List all my Grafana workspaces in my subscription."
- **Find visualization environments**: "Show me the available Grafana instances in my Azure account."
- **View Grafana inventory**: "Show me an inventory of all Azure Managed Grafana workspaces I have access to."
- **Find Grafana by subscription**: "List the Grafana workspaces in my 'development' subscription."

## Next steps

- [Learn more about Azure Managed Grafana](/azure/managed-grafana/overview)
- [Create a dashboard in Azure Managed Grafana](/azure/managed-grafana/how-to-create-dashboard)
- [Configure Grafana settings](/azure/managed-grafana/grafana-settings)
