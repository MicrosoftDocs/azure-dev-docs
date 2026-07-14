---
title: Azure Skill for Azure Cost Management
description: The azure-cost skill helps you analyze Azure spending and find cost optimization opportunities. Use it to query actual and amortized costs, view cost forecasts, identify underutilized resources, and get cost visibility across namespaces and workloads.
author: diberry
ms.author: diberry
ms.reviewer: skaluvak
ms.date: 06/22/2026
ms.service: azure-mcp-server
ms.topic: reference
ms.custom:
  - devx-track-copilot-skills
ai-usage: ai-generated
ms.skillversion: "1.2.2"
---

# Azure skill for Azure Cost Management

The `azure-cost` skill helps you analyze Azure spending and find cost optimization opportunities. You get access to Azure cost data including actual and amortized costs, cost forecasts, and spending trends. Query costs by subscription, resource group, service, or tag. Identify underutilized resources, view reserved instance recommendations, and get AKS cost visibility across namespaces and workloads.

**Skill** `azure-cost` | [Source code](https://github.com/microsoft/azure-skills/blob/main/skills/azure-cost/SKILL.md)

## Prerequisites

- **Azure subscription**: [Create a free account](https://azure.microsoft.com/free/) if you don't have one.
- **AI assistant with Azure Skills**: [GitHub Copilot for Azure](/azure/developer/github-copilot-azure/get-started), Visual Studio Code with [Azure MCP extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azure-mcp-server), Claude Code, or another [compatible MCP client](../install.md).
- **Azure CLI** (v2.60.0+): [Install](/cli/azure/install-azure-cli) and sign in with `az login`.
- **Azure roles**: Your account must have the [Cost Management Reader](/azure/role-based-access-control/built-in-roles#cost-management-reader), [Monitoring Reader](/azure/role-based-access-control/built-in-roles#monitoring-reader), and [Reader](/azure/role-based-access-control/built-in-roles#reader) roles on the target subscription or resource group.

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

## Example prompts

Try these prompts to activate this skill:

- "How much am I spending on Azure?"
- "Show me my Azure cost breakdown by service."
- "What are my top cost drivers this month?"
- "Forecast my end-of-month Azure spending."
- "Find orphaned resources I can delete to save money."
- "Optimize my Azure costs and reduce waste."
- "Show cost trends for my subscription over the last 3 months."
- "Analyze my AKS cluster costs by namespace."

## Related content

- [Azure Model Context Protocol (MCP) Server overview](/azure/developer/azure-mcp-server/overview)
- [Skill source code](https://github.com/microsoft/azure-skills/blob/main/skills/azure-cost/SKILL.md)
- [Azure Cost Management overview](/azure/cost-management-billing/cost-management-billing-overview)
- [Analyze costs with cost analysis](/azure/cost-management-billing/costs/quick-acm-cost-analysis)
- [Azure Pricing Calculator](https://azure.microsoft.com/pricing/calculator/)
