---
title: Azure skill for Cost Analysis
description: Analyze Azure spend, investigate bill changes, and review Azure Kubernetes Service and AI service costs with the Cost Analysis skill.
author: yunjchoi
ms.author: yunjchoi
ms.service: azure-mcp-server
ms.topic: reference
ms.date: 10/05/2026
ms.custom: [devx-track-copilot-skills, skill-version-1.1.1]
ai-usage: ai-generated
---

# Azure skill for Cost Analysis

The `cost-analysis` skill analyzes actual Azure spend, bill changes, and Azure Kubernetes Service (AKS) or AI service costs. Use it to query historical costs, investigate unexpected charges, and allocate costs across workloads.

**Skill** `cost-analysis` | [Source code](https://github.com/microsoft/azure-skills/blob/main/.github/plugins/azure-cost/skills/cost-analysis/SKILL.md)

## When to use this skill

Use this skill when you need to:

- Query historical spend by subscription, resource group, service, resource, or tag.
- Identify the most expensive resources or services.
- Investigate a cost spike or unexpected charge.
- Analyze AKS costs by cluster, namespace, or workload.
- Analyze costs for Microsoft Foundry models and other AI services.

Use [Cost Estimation](cost-estimation.md) for forecasts or hypothetical pricing. Use [Cost Optimization](cost-optimization.md) for rightsizing, idle resources, or commitment analysis.

## Example prompts

- "Show my Azure cost breakdown by service for the last 30 days."
- "Why did my Azure bill increase this month?"
- "Analyze this AKS cluster's costs by namespace."
- "Which Microsoft Foundry deployments cost the most?"

The skill reports measured costs separately from inferred causes and recommendations. It also identifies incomplete results and reports each currency separately.

## Related content

- [Azure plugin catalog](../index.md#azure-cost-plugin)
- [Skill source code](https://github.com/microsoft/azure-skills/blob/main/.github/plugins/azure-cost/skills/cost-analysis/SKILL.md)
