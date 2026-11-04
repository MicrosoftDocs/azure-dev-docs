---
title: Azure Cost plugin
description: Use the Azure Cost plugin for Azure cost analysis, estimation, optimization, and governance workflows.
author: yunjchoi
ms.author: yunjchoi
ms.reviewer: skaluvak
ms.date: 10/05/2026
ms.service: azure-mcp-server
ms.topic: reference
ms.custom:
  - devx-track-copilot-skills
ai-usage: ai-generated
---

# Azure Cost plugin

The `azure-cost` plugin provides skills for Azure cost analysis, estimation, optimization, and governance. Install it independently from the core Azure Skills plugin when you need focused cost-management workflows.

**Plugin** `azure-cost` | [Source code](https://github.com/microsoft/azure-skills/tree/main/.github/plugins/azure-cost)

## Included skills

| Skill | Workflows |
| --- | --- |
| [`cost-analysis`](../plugins/azure-cost/cost-analysis.md) | Query and investigate costs, including Azure Kubernetes Service (AKS) cost analysis. |
| [`cost-estimation`](../plugins/azure-cost/cost-estimation.md) | Forecast costs and estimate Azure retail pricing. |
| [`cost-optimization`](../plugins/azure-cost/cost-optimization.md) | Identify optimization opportunities and evaluate commitment options. |
| [`cost-governance`](../plugins/azure-cost/cost-governance.md) | Review budget health, configure budgets, and apply cost guardrails. |

## Prerequisites

- **Azure subscription**: [Create a free account](https://azure.microsoft.com/free/) if you don't have one.
- **Azure CLI** (v2.60.0+): [Install](/cli/azure/install-azure-cli) and sign in with `az login`.
- **Azure roles**: Your account must have the [Cost Management Reader](/azure/role-based-access-control/built-in-roles#cost-management-reader), [Monitoring Reader](/azure/role-based-access-control/built-in-roles#monitoring-reader), and [Reader](/azure/role-based-access-control/built-in-roles#reader) roles on the target subscription or resource group.

## When to use this plugin

Use this plugin when you need to:

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

Try these prompts to activate the relevant cost skill:

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
- [Azure plugin catalog](../plugins/index.md)
- [Azure Cost plugin source code](https://github.com/microsoft/azure-skills/tree/main/.github/plugins/azure-cost)
- [Azure Cost Management overview](/azure/cost-management-billing/cost-management-billing-overview)
- [Analyze costs with cost analysis](/azure/cost-management-billing/costs/quick-acm-cost-analysis)
- [Azure Pricing Calculator](https://azure.microsoft.com/pricing/calculator/)
