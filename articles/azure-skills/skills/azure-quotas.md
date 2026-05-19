---
title: Azure skill for quotas
description: Check/manage Azure quotas and usage across providers. For deployment planning, capacity validation, region selection.
ms.topic: reference
ms.date: 4/2/2026
author: diberry
ms.author: diberry
ms.service: azure-mcp-server
ms.custom: skill-version-1.0.6
---

# Azure skill for quotas

Check/manage Azure quotas and usage across providers. For deployment planning, capacity validation, region selection.

**Skill:** `azure-quotas` | [Source code](https://github.com/microsoft/azure-skills/blob/main/skills/azure-quotas/SKILL.md)

## What it provides

This skill provides GitHub Copilot with specialized knowledge. Check/manage Azure quotas and usage across providers. For deployment planning, capacity validation, region selection.

## Prerequisites

- **Azure subscription and region**: [Create a free account](https://azure.microsoft.com/free/) if you don't have one. Both a subscription and a target region are needed to check quotas.
- **AI assistant with Azure Skills**: [GitHub Copilot for Azure](/azure/developer/github-copilot-azure/get-started), Visual Studio Code with [Azure MCP extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azure-mcp-server), Claude Code, or another [compatible MCP client](../install.md).
- **Azure CLI** (v2.60.0+): [Install](/cli/azure/install-azure-cli) and sign in with `az login`.

## When to use this skill

Use this skill when you need to:

- Check quotas in Azure
- Work with service limits and current usage
- Request quota increase in Azure
- Work with quota exceeded
- Validate capacity in Azure
- Work with regional availability
- Provisioning limits in Azure
- Work with vCPU limit

## Example prompts

Try these prompts to activate this skill:

- "How do I check my Azure quota limits?"
- "What are the service limits for my Azure subscription?"
- "Check current usage for my compute quota"
- "I need to request a quota increase for VMs in East US"
- "My deployment failed with a quota exceeded error"
- "How do I validate deployment capacity before provisioning?"
- "Help me select a region based on quota availability"
- "Compare quotas across regions for Standard_D4s_v3"
- "What is the provisioning limit for public IP addresses?"
- "Check regional capacity for Container Apps"

## Related content

- [Azure Model Context Protocol (MCP) Server overview](/azure/developer/azure-mcp-server/overview)
- [Skill source code](https://github.com/microsoft/azure-skills/blob/main/skills/azure-quotas/SKILL.md)

