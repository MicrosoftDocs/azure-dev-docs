---
title: Azure skill for Cost Optimization
description: Find Azure waste, rightsizing opportunities, and commitment recommendations with the Cost Optimization skill.
author: yunjchoi
ms.author: yunjchoi
ms.service: azure-mcp-server
ms.topic: reference
ms.date: 10/05/2026
ms.custom: [devx-track-copilot-skills, skill-version-1.0.1]
ai-usage: ai-generated
---

# Azure skill for Cost Optimization

The `cost-optimization` skill identifies waste, rightsizing opportunities, and potential commitment savings for existing Azure resources. It provides recommendations but doesn't delete, resize, purchase, or deploy resources.

**Skill** `cost-optimization` | [Source code](https://github.com/microsoft/azure-skills/blob/main/.github/plugins/azure-cost/skills/cost-optimization/SKILL.md)

## When to use this skill

Use this skill when you need to:

- Find idle or underused Azure resources.
- Identify orphaned disks, public IP addresses, or other continuing charges.
- Review rightsizing opportunities.
- Analyze reservation utilization.
- Review Savings Plan coverage or commitment recommendations.

Use [Cost Analysis](cost-analysis.md) for cost spikes and bill investigations. Use [Cost Estimation](cost-estimation.md) for forecasts or planned-resource pricing.

## Example prompts

- "Find idle Azure resources that I can optimize."
- "Why am I still paying for resources from a deleted VM?"
- "Review my reservation utilization."
- "Recommend Savings Plan coverage for this subscription."

The skill separates measured cost, reported savings, and qualitative opportunities so you can evaluate recommendations before making changes.

## Related content

- [Azure plugin catalog](../index.md#azure-cost-plugin)
- [Skill source code](https://github.com/microsoft/azure-skills/blob/main/.github/plugins/azure-cost/skills/cost-optimization/SKILL.md)
