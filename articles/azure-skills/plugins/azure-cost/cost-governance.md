---
title: Azure skill for Cost Governance
description: Review budgets, alerts, tags, and Azure Policy cost guardrails with the Cost Governance skill.
author: yunjchoi
ms.author: yunjchoi
ms.service: azure-mcp-server
ms.topic: reference
ms.date: 10/05/2026
ms.custom: [devx-track-copilot-skills, skill-version-1.0.1]
ai-usage: ai-generated
---

# Azure skill for Cost Governance

The `cost-governance` skill helps govern Azure costs with budgets, alerts, tags, and policy restrictions. Use it to assess budget coverage, configure a budget, and identify missing cost guardrails.

**Skill** `cost-governance` | [Source code](https://github.com/microsoft/azure-skills/blob/main/.github/plugins/azure-cost/skills/cost-governance/SKILL.md)

## When to use this skill

Use this skill when you need to:

- Review budget health and configured alert thresholds.
- Find scopes that don't have budget coverage.
- Create an Azure budget after confirming its scope, amount, thresholds, and recipients.
- Identify missing cost-allocation tags.
- Review policies that restrict allowed SKUs or Azure regions.

Use [Cost Estimation](cost-estimation.md) for planning forecasts. Use [Cost Analysis](cost-analysis.md) to investigate bills or cost spikes.

## Example prompts

- "Show the health of my Azure budgets."
- "Which subscriptions don't have a budget?"
- "Create a monthly budget for this resource group."
- "Find resources missing the CostCenter tag."
- "Would this VM SKU be denied by policy?"

The skill distinguishes missing access from empty results and doesn't imply that a budget caps or blocks Azure spending.

## Related content

- [Azure plugin catalog](../index.md#azure-cost-plugin)
- [Skill source code](https://github.com/microsoft/azure-skills/blob/main/.github/plugins/azure-cost/skills/cost-governance/SKILL.md)
