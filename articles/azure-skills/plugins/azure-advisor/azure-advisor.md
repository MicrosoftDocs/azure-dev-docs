---
title: Azure skill for Azure Advisor
description: Use the azure-advisor skill to review, summarize, and prioritize Azure Advisor recommendations, find service retirements, and update recommendation status.
author: ravigupta99
ms.author: guptaravi
ms.date: 11/02/2026
ms.service: azure-mcp-server
ms.topic: reference
ms.custom: [devx-track-copilot-skills, skill-version-1.0.1]
ai-usage: ai-generated
---

# Azure skill for Azure Advisor

The `azure-advisor` skill helps you work with Azure Advisor recommendations. Use it to summarize and prioritize recommendations, find affected resources and service retirements, explore recommendation types, and update recommendation status.

**Skill** `azure-advisor` | [Source code](https://github.com/microsoft/azure-skills/blob/main/.github/plugins/azure-advisor/skills/azure-advisor/SKILL.md)

## What it provides

The skill uses the [Azure MCP Server tools for Azure Advisor](../../../azure-mcp-server/tools/azure-advisor.md) to answer recommendation questions in a subscription or service group. It uses summaries for counts and rankings and lists for individual recommendations, so totals aren't based on partial results. It asks you to confirm before it changes a recommendation's status.

## Prerequisites

- **Azure Advisor plugin**: Install it with `/plugin install azure-advisor@azure-skills`. For more information, see [Azure plugins](../index.md#azure-advisor-plugin).
- **Azure subscription**: You need access to the subscriptions or service groups that you want to review.
- **Azure CLI**: [Install](/cli/azure/install-azure-cli) and sign in with `az login`.

## When to use this skill

Use this skill when you need to:

- Summarize recommendations by category, impact, resource type, or status.
- Find the top recommendations to fix first.
- List individual recommendations and affected resources.
- Find resources affected by service retirements.
- Explore recommendation types, including before you deploy resources.
- Complete, dismiss, postpone, or reactivate a recommendation.

To fix a specific recommendation, use [Azure Advisor Actionability](azure-advisor-actionability.md).

## Example prompts

- "Summarize my Advisor recommendations by category."
- "What are my top five Advisor recommendations to fix first?"
- "Which of my resources are affected by upcoming service retirements?"
- "Show high-impact cost recommendations for my storage accounts."
- "Postpone this Advisor recommendation until the end of the quarter."

## Related content

- [Azure plugin catalog](../index.md#azure-advisor-plugin)
- [Azure skill for Azure Advisor Actionability](azure-advisor-actionability.md)
- [Azure Advisor documentation](/azure/advisor/)
- [Skill source code](https://github.com/microsoft/azure-skills/blob/main/.github/plugins/azure-advisor/skills/azure-advisor/SKILL.md)
