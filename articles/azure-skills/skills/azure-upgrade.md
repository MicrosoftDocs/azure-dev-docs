---
title: Azure Skill for Azure Upgrade
description: Assess and upgrade Azure workloads between plans, tiers, or SKUs, or modernize Azure SDK dependencies in source code.
author: diberry
ms.author: diberry
ms.reviewer: skaluvak, mabha
ms.date: 06/29/2026
ms.service: azure-mcp-server
ms.topic: reference
ms.custom:
  - "skill-version-1.1.4"
ai-usage: ai-assisted
---

# Azure skill for Azure Upgrade

This skill handles assessment and automated upgrades of existing Azure workloads from one Azure service, hosting plan, or SKU to another — all within Azure. This includes plan/tier upgrades, cross-service migrations, and SKU changes. This skill also covers Azure SDK for Java source-code modernization. This skill doesn't handle cross-cloud migration.

**Skill** `azure-upgrade` | [Source code](https://github.com/microsoft/azure-skills/blob/main/skills/azure-upgrade/SKILL.md)

## What it provides

The Azure Upgrade skill gives GitHub Copilot specialized knowledge about Azure upgrade scenarios. Use this skill to assess upgrade readiness, plan migrations between Azure service tiers and plans (including Azure Functions hosting plan upgrades with monitoring verification), modernize legacy Azure Java SDK dependencies, and migrate Azure Cache for Redis to Azure Managed Redis.

## Prerequisites

- **Azure subscription**: [Create a free account](https://azure.microsoft.com/free/) if you don't have one.
- **AI assistant with Azure Skills**: [GitHub Copilot for Azure](/azure/developer/github-copilot-azure/get-started), Visual Studio Code with [Azure MCP extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azure-mcp-server), Claude Code, or another [compatible MCP client](../install.md).
- **Azure CLI** (v2.60.0+): [Install](/cli/azure/install-azure-cli) and sign in with `az login`.

## When to use this skill

Use the **Azure Upgrade** skill when you need to:

- Upgrade Consumption to Flex Consumption
- Upgrade Azure Functions plan
- Change hosting plans and configure function app SKUs
- Migrate App Service to Container Apps
- Modernize legacy Azure Java SDKs (com.microsoft.azure to com.azure)
- Migrate Azure Cache for Redis (ACR/ACRE) to Azure Managed Redis (AMR)

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
- "Migrate legacy Azure SDKs for Java"
- "Upgrade my Java project from com.microsoft.azure to com.azure"
- "Modernize my legacy Azure Java SDK dependencies"
- "Migrate my Azure Cache for Redis to Azure Managed Redis"
- "Help me migrate from ACR to AMR"
- "Upgrade my Premium Redis cache to Azure Managed Redis"

## Related content

- [Azure Functions hosting options](/azure/azure-functions/functions-scale)
- [Migrate to Flex Consumption plan](/azure/azure-functions/flex-consumption-plan)
- [Azure Cache for Redis migration guide](/azure/azure-cache-for-redis/cache-overview)
- [Azure Managed Redis overview](/azure/azure-cache-for-redis/managed-redis/managed-redis-overview)
- [Azure MCP Server overview](/azure/developer/azure-mcp-server/overview)
- [Skill source code](https://github.com/microsoft/azure-skills/blob/main/skills/azure-upgrade/SKILL.md)
