---
title: Azure skill for Azure Upgrade
description: Assess and upgrade Azure workloads between plans, tiers, or SKUs, or modernize Azure SDK dependencies in source code.
ms.topic: reference
ms.date: 5/12/2026
author: diberry
ms.author: diberry
ms.service: azure-mcp-server
ms.custom: skill-version-1.1.3
ai-usage: ai-assisted
---

# Azure skill for Azure Upgrade

Assess and upgrade Azure workloads between plans, tiers, or SKUs, or modernize Azure SDK dependencies in source code.

**Skill** `azure-upgrade` | [Source code](https://github.com/microsoft/azure-skills/blob/main/skills/azure-upgrade/SKILL.md)

## What it provides

The Azure Upgrade skill gives GitHub Copilot specialized knowledge about Azure upgrade scenarios. Use this skill to get Azure best practices for the target service, look up Azure documentation for upgrade scenarios, query app service and functions plan details, and verify monitoring configuration.

## Prerequisites

- **Azure subscription**: [Create a free account](https://azure.microsoft.com/free/) if you don't have one.
- **AI assistant with Azure Skills**: [GitHub Copilot for Azure](/azure/developer/github-copilot-azure/get-started), Visual Studio Code with [Azure MCP extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azure-mcp-server), Claude Code, or another [compatible MCP client](../install.md).
- **Azure CLI** (v2.60.0+): [Install](/cli/azure/install-azure-cli) and sign in with `az login`.

## When to use this skill

Use the **Azure Upgrade** skill when you need to:

- Upgrade Consumption to Flex Consumption
- Upgrade Azure Functions plan
- Manage and configure change hosting plan and function app SKU in Azure
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

## Related content

- [Azure Functions hosting options](/azure/azure-functions/functions-scale)
- [Migrate to Flex Consumption plan](/azure/azure-functions/flex-consumption-plan)
- [Azure Cache for Redis migration guide](/azure/azure-cache-for-redis/cache-overview)
- [Azure MCP Server overview](/azure/developer/azure-mcp-server/overview)
- [Skill source code](https://github.com/microsoft/azure-skills/blob/main/skills/azure-upgrade/SKILL.md)

