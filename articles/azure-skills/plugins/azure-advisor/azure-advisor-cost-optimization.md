---
title: Azure skill for Azure Advisor Cost Optimization
description: Find unused Azure resources, review Advisor savings estimates, and check deletion readiness with the azure-advisor-cost-optimization skill.
author: srnadimp22
ms.author: srnadimp
ms.date: 11/10/2026
ms.service: azure-mcp-server
ms.topic: reference
ms.custom: [devx-track-copilot-skills, skill-version-1.0.11]
ai-usage: ai-generated
---

# Azure skill for Azure Advisor cost optimization

The `azure-advisor-cost-optimization` skill helps you find resources that Azure Advisor identifies as unused and review their potential savings. It focuses on recommendations in the **Cost** category and **IdleResources** subcategory.

**Skill** `azure-advisor-cost-optimization` | [Source code](https://github.com/microsoft/azure-skills/blob/main/.github/plugins/azure-advisor/skills/azure-advisor-cost-optimization/SKILL.md)

## What it provides

The skill summarizes idle-resource recommendations, shows affected resources, and reports estimated savings across selected subscriptions or one service group. It also reports completed cleanup and updates recommendation status after your confirmation.

For deletion-readiness requests, it uses read-only prevalidation to identify resources that pass automated checks, need review, or are blocked. It doesn't delete resources, and passing automated checks doesn't authorize deletion.

Reports distinguish potential savings, accumulated cost, and realized savings. These are Advisor retail USD estimates, not billing data.

## Prerequisites

- **Azure Advisor plugin**: Install the plugin for your AI assistant. For host-specific setup, see [Install and configure Azure Skills](../../install.md) and [Azure plugins](../index.md#azure-advisor-plugin).
- **Azure access**: Read permissions for the selected scope and resources. Status updates require permission to change recommendations.
- **Azure CLI**: [Install](/cli/azure/install-azure-cli) and sign in with `az login`.

## When to use this skill

Use this skill when you need to:

- Find unused resources and review their potential savings.
- Compare idle-resource findings across subscriptions in the same tenant or within one service group.
- Report completed cleanup and estimated realized savings, including a specified reporting period.
- Check dependencies, locks, recent activity, and other available evidence before considering deletion.
- Postpone, dismiss, complete, or reactivate explicitly selected recommendations after confirmation.

For generic Cost recommendations, such as reservations and savings plans, use [Azure Advisor](azure-advisor.md). For broader cost analysis, estimation, and governance, see the [Azure Cost plugin](../index.md#azure-cost-plugin).

## Example prompts

- "What Azure resources am I paying for that are no longer being used?"
- "Find unused resources and potential savings across my accessible subscriptions."
- "Show idle-resource savings for service group \<service-group\>."
- "Show completed idle-resource cleanup and realized savings."
- "Check whether these selected idle disks are ready for deletion, and show any blockers or manual checks."

## Related content

- [Azure plugin catalog](../index.md#azure-advisor-plugin)
- [Azure MCP Server tools for Azure Advisor](../../../azure-mcp-server/tools/azure-advisor.md)
- [Azure skill for Azure Advisor](azure-advisor.md)
- [Azure skill for Azure Advisor Actionability](azure-advisor-actionability.md)
- [Azure Advisor documentation](/azure/advisor/)
