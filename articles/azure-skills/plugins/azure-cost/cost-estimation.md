---
title: Azure skill for Cost Estimation
description: Forecast Azure spend and estimate pricing for planned Azure resources with the Cost Estimation skill.
author: yunjchoi
ms.author: yunjchoi
ms.service: azure-mcp-server
ms.topic: reference
ms.date: 10/05/2026
ms.custom: [devx-track-copilot-skills, skill-version-1.1.1]
ai-usage: ai-generated
---

# Azure skill for Cost Estimation

The `cost-estimation` skill forecasts Azure spend and estimates prices for planned resources or workloads. Use it to project costs, compare regions or service tiers, and review public or negotiated prices.

**Skill** `cost-estimation` | [Source code](https://github.com/microsoft/azure-skills/blob/main/.github/plugins/azure-cost/skills/cost-estimation/SKILL.md)

## When to use this skill

Use this skill when you need to:

- Forecast future costs for an existing Azure scope.
- Estimate the price of a planned workload.
- Compare service tiers, SKUs, or Azure regions.
- Retrieve public retail prices.
- Review Enterprise Agreement or Microsoft Customer Agreement prices.

Use [Cost Analysis](cost-analysis.md) to explain historical spend. Use [Cost Governance](cost-governance.md) to review configured budgets and alerts.

## Example prompts

- "Forecast my Azure spending for next month."
- "Estimate the monthly cost of three Linux VMs in East US."
- "Compare the price of these storage tiers."
- "Use my negotiated price sheet to estimate this workload."

The skill distinguishes forecasts based on historical usage from hypothetical pricing estimates and labels the assumptions behind each result.

## Related content

- [Azure plugin catalog](../index.md#azure-cost-plugin)
- [Skill source code](https://github.com/microsoft/azure-skills/blob/main/.github/plugins/azure-cost/skills/cost-estimation/SKILL.md)
