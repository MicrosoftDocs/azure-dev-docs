---
title: Azure skill for Azure Advisor Actionability
description: Use the azure-advisor-actionability skill to get resource-specific remediation guidance for an Azure Advisor recommendation.
author: ravigupta99
ms.author: guptaravi
ms.date: 11/02/2026
ms.service: azure-mcp-server
ms.topic: reference
ms.custom: [devx-track-copilot-skills, skill-version-1.0.1]
ai-usage: ai-generated
---

# Azure skill for Azure Advisor Actionability

The `azure-advisor-actionability` skill helps you fix one Azure Advisor recommendation. It gets the remediation for the recommendation type and fills in details for the affected resource, so you get guidance that's ready to review and run.

**Skill** `azure-advisor-actionability` | [Source code](https://github.com/microsoft/azure-skills/blob/main/.github/plugins/azure-advisor/skills/azure-advisor-actionability/SKILL.md)

## What it provides

The skill retrieves the Azure Advisor remediation for a recommendation type, and then substitutes values such as the subscription, resource group, and resource name from the affected resource. Remediation can include manual steps and commands or templates, such as Azure CLI and PowerShell. When Advisor has no usable remediation, the skill uses public Microsoft Learn documentation instead. Each response states whether the guidance comes from Azure Advisor or Microsoft Learn.

The skill presents remediation for you to run. It doesn't run commands without your explicit confirmation.

## Prerequisites

- **Azure Advisor plugin**: Install it with `/plugin install azure-advisor@azure-skills`. For more information, see [Azure plugins](../index.md#azure-advisor-plugin).
- **Recommendation details**: Know the recommendation and the affected resource. If you don't, use the [Azure Advisor](azure-advisor.md) skill to find them.
- **Azure CLI**: [Install](/cli/azure/install-azure-cli) and sign in with `az login`.

## When to use this skill

Use this skill when you need to:

- Get steps to fix a specific Advisor recommendation.
- Get commands or templates to remediate an affected resource.
- Find documented guidance when Advisor doesn't provide remediation.

## Example prompts

- "How do I fix this Advisor recommendation for my virtual machine?"
- "Give me the Azure CLI commands to remediate this recommendation on my storage account."
- "Fix Advisor recommendation type \<recommendation-type-id\> for resource \<resource-id\>."

## Related content

- [Azure plugin catalog](../index.md#azure-advisor-plugin)
- [Azure skill for Azure Advisor](azure-advisor.md)
- [Azure Advisor documentation](/azure/advisor/)
- [Skill source code](https://github.com/microsoft/azure-skills/blob/main/.github/plugins/azure-advisor/skills/azure-advisor-actionability/SKILL.md)
