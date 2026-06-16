---
title: Azure skill for Azure Quotas
description: The azure-quotas skill helps you check, request, and manage Azure service quotas and limits. Use it to view current usage, request quota increases, compare regional capacity, and plan for scaling across subscriptions.
ms.topic: reference
ms.date: 06/15/2026
author: diberry
ms.author: diberry
ms.reviewer: rakal-dyh
ms.service: azure-mcp-server
ms.custom: devx-track-copilot-skills
ms.skillversion: 1.1.2
ai-usage: ai-generated
---

# Azure skill for Azure Quotas

The `azure-quotas` skill helps you check, request, and manage Azure service quotas and limits. Use it to view current usage and limits, submit quota increase requests, compare regional capacity, and plan for scaling before deployment.

**Skill** `azure-quotas` | [Source code](https://github.com/microsoft/azure-skills/blob/main/skills/azure-quotas/SKILL.md)

## What it provides

You get visibility into Azure service quotas and limits across subscriptions and regions. Check current usage against limits, submit quota increase requests, compare capacity across regions, and plan for VM, vCPU, storage, and networking quota needs before scaling.

> [!NOTE]
> This skill always uses the Azure CLI (`az quota`) for quota lookups. 

## Prerequisites

- **Azure subscription and region**: [Create a free account](https://azure.microsoft.com/free/) if you don't have one. Both a subscription and a target region are needed to check quotas.
- **AI assistant with Azure Skills**: [GitHub Copilot for Azure](/azure/developer/github-copilot-azure/get-started), Visual Studio Code with [Azure MCP extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azure-mcp-server), Claude Code, or another [compatible MCP client](../install.md).
- **Azure CLI** (v2.60.0+): [Install](/cli/azure/install-azure-cli) and sign in with `az login`.
- **Azure CLI `quota` extension**: Install with `az extension add --name quota`. The skill relies on `az quota` commands.

## When to use this skill

Use this skill when you need to:

- Plan a new deployment and validate capacity before you deploy.
- Select an Azure region by comparing quota availability across regions.
- Troubleshoot quota-exceeded errors by checking current usage against limits.
- Request quota increases through the Azure CLI or Azure portal.
- Compare regional capacity to find regions with available quota.
- Validate provisioning limits to ensure a deployment doesn't exceed quotas.

## Example prompts

Try these prompts to activate this skill:

- "Check my Azure quotas."
- "What are my service limits?"
- "Show current usage."
- "Request a quota increase."
- "I'm getting a quota exceeded error."
- "Validate capacity for my deployment."
- "Check regional availability."
- "What are my provisioning limits?"
- "Check my vCPU limit."
- "How many vCPUs are available in my subscription?"

## Related content

- [Azure Model Context Protocol (MCP) Server overview](/azure/developer/azure-mcp-server/overview)
- [Skill source code](https://github.com/microsoft/azure-skills/blob/main/skills/azure-quotas/SKILL.md)
- [Azure Quotas overview](/azure/quotas/quotas-overview)
- [Azure subscription and service limits](/azure/azure-resource-manager/management/azure-subscription-service-limits)
- [Request quota increases](/azure/quotas/quickstart-increase-quota-portal)
- [Azure region capacity](/azure/virtual-machines/availability)
