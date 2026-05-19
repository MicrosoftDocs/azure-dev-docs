---
title: Azure skill for cost optimization
description: "Unified Azure cost management: query historical costs, forecast future spending, and optimize to reduce waste."
ms.topic: reference
ms.date: 4/2/2026
author: diberry
ms.author: diberry
ms.service: azure-mcp-server
ms.custom: skill-version-1.1.0
---

# Azure skill for cost optimization

Analyze and optimize your Azure spending with historical cost queries, spending forecasts, and actionable cost-reduction recommendations.

**Skill:** `azure-cost` | [Source code](https://github.com/microsoft/azure-skills/blob/main/skills/azure-cost/SKILL.md)

## What it provides

This skill gives GitHub Copilot access to Azure Cost Management APIs and optimization best practices. It can analyze your current spending, project future costs, and suggest specific ways to reduce waste.

## Prerequisites

- **Azure subscription**: [Create a free account](https://azure.microsoft.com/free/) if you don't have one.
- **AI assistant with Azure Skills**: [GitHub Copilot for Azure](/azure/developer/github-copilot-azure/get-started), Visual Studio Code with [Azure MCP extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azure-mcp-server), Claude Code, or another [compatible MCP client](../install.md).
- **Azure CLI** (v2.60.0+): [Install](/cli/azure/install-azure-cli) and sign in with `az login`.
- **Azure roles**: Your account must have the [Cost Management Reader](/azure/role-based-access-control/built-in-roles#cost-management-reader), [Monitoring Reader](/azure/role-based-access-control/built-in-roles#monitoring-reader), and [Reader](/azure/role-based-access-control/built-in-roles#reader) roles on the target subscription or resource group.
- **[Azure Kubernetes Service](/azure/aks/learn/quick-kubernetes-deploy-portal)**: An AKS cluster for container orchestration.

### Related tools

| Tool | Command | Purpose |
|------|---------|---------|
| `azure__documentation` | Search Azure documentation | Search for relevant Azure documentation by keyword |
| `azure__extension_cli_generate` | Generate Azure CLI commands | Generate Azure CLI commands from a natural-language description |
| `azure__get_azure_bestpractices` | Get Azure best practices | Retrieve best practices for a specific optimization scenario |
| `azure__extension_azqr` | Run Azure Quick Review | Run a compliance scan against a subscription or resource group |
| `azure__aks` | Azure Kubernetes Service operations | Manage Azure Kubernetes Service clusters and workloads |

## When to use this skill

Use this skill when you need to:

- Analyze costs of your existing Azure resources and infrastructure.
- Review your Azure bill, costs broken down by service, and costs per resource.
- Compare monthly cost summaries, identify cost trends, and pinpoint top cost drivers.
- Calculate amortized costs and actual spending.
- Forecast future spending and project end-of-month costs.
- Plan budget forecasts based on historical data.
- Identify and implement cost optimization strategies.
- Find opportunities to reduce cloud spending.
- Discover cost-saving recommendations tailored to your infrastructure.

## Related content

- [Azure Model Context Protocol (MCP) Server overview](/azure/developer/azure-mcp-server/overview)
- [Skill source code](https://github.com/microsoft/azure-skills/blob/main/skills/azure-cost/SKILL.md)

