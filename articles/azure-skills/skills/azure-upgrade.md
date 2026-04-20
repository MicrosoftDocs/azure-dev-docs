---
title: Azure skill for upgrade
description: Assess and upgrade Azure workloads between plans, tiers, or SKUs within Azure. Generates assessment reports and automates upgrade steps.
ms.topic: reference
ms.date: 4/2/2026
author: diberry
ms.author: diberry
ms.service: azure-mcp-server
ms.custom: skill-version-1.0.0
---

# Azure skill for upgrade

Assess and upgrade Azure workloads between plans, tiers, or SKUs within Azure. Generates assessment reports and automates upgrade steps.

**Skill:** `azure-upgrade` | [Source code](https://github.com/microsoft/azure-skills/blob/main/skills/azure-upgrade/SKILL.md)

## What it provides

This skill provides GitHub Copilot with specialized knowledge. Assess and upgrade Azure workloads between plans, tiers, or SKUs within Azure. Generates assessment reports and automates upgrade steps.

## Prerequisites

- **Azure subscription**: [Create a free account](https://azure.microsoft.com/free/) if you don't have one.
- **AI assistant with Azure Skills**: [GitHub Copilot for Azure](/azure/developer/github-copilot-azure/get-started), Visual Studio Code with [Azure MCP extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azure-mcp-server), Claude Code, or another [compatible MCP client](../install.md).
- **Azure CLI** (v2.60.0+): [Install](/cli/azure/install-azure-cli) and sign in with `az login`.

## When to use this skill

Use this skill when you need to:

- Upgrade Consumption to Flex Consumption
- Upgrade Azure Functions plan
- Migrate hosting plan in Azure
- Upgrade Functions SKU in Azure
- Move to Flex Consumption
- Upgrade Azure service tier
- Work with change hosting plan
- Upgrade function app plan
- Migrate App Service to Container Apps

## Example prompts

Try these prompts to activate this skill:

- "Upgrade my function app from Consumption to Flex Consumption"
- "Move my function app to a better plan"
- "Is my function app ready for Flex Consumption?"
- "Automate the steps to upgrade my Functions plan"
- "Upgrade my Azure Functions SKU"
- "Change my function app hosting plan"
- "Migrate my Azure Functions from Consumption to Flex Consumption"
- "Assess my function app for upgrade readiness"

## Related content

- [Azure Model Context Protocol (MCP) Server overview](/azure/developer/azure-mcp-server/overview)
- [Skill source code](https://github.com/microsoft/azure-skills/blob/main/skills/azure-upgrade/SKILL.md)

