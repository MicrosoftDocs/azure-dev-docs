---
title: Azure Skill for Azure Resource Lookup
description: The azure-resource-lookup skill helps you list, find, and inspect Azure resources across subscriptions, resource groups, and regions. Use it to discover resource properties, check configurations, and inventory deployed services.
author: diberry
ms.author: diberry
ms.reviewer: chuye
ms.date: 06/29/2026
ms.service: azure-mcp-server
ms.topic: reference
ms.custom:
  - devx-track-copilot-skills
ai-usage: ai-generated
ms.skillversion: "1.1.3"
---

# Azure skill for Azure Resource Lookup

The `azure-resource-lookup` skill helps you list, find, and inspect Azure resources across subscriptions, resource groups, and regions. Use it to discover resource properties, check configurations, and inventory all deployed services. Find resources by tag, tag analysis, orphaned resource discovery, unattached disks, count resources by type, cross-subscription lookup, and Azure Resource Graph queries.

**Skill** `azure-resource-lookup` | [Source code](https://github.com/microsoft/azure-skills/blob/main/skills/azure-resource-lookup/SKILL.md)

## Prerequisites

- **Azure subscription**: [Create a free account](https://azure.microsoft.com/free/) if you don't have one.
- **AI assistant with Azure Skills**: [GitHub Copilot for Azure](/azure/developer/github-copilot-azure/get-started), Visual Studio Code with [Azure MCP extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azure-mcp-server), Claude Code, or another [compatible MCP client](../install.md).
- **Azure CLI** (v2.60.0+): [Install](/cli/azure/install-azure-cli) and sign in with `az login`.


## When to use this skill

Use this skill when you need to:

- **List resources** of any type (VMs, web apps, storage accounts, container apps, databases, and more).
- **Show resources** in a specific subscription or resource group.
- Query resources **across multiple subscriptions** or resource types.
- Find **orphaned resources** (unattached disks, unused NICs, idle IPs).
- Discover resources **missing required tags** or configurations.
- Get a **resource inventory** spanning multiple types.
- Find resources in a **specific state** (unhealthy, failed provisioning, stopped).
- Answer "**what resources do I have?**" or "**show me my Azure resources**".
- **List web apps, websites, or App Services**.

## When not to use this skill

- Deploying or modifying resources (use `azure-deploy` or `azure-prepare`).
- Analyzing resource costs (use `azure-cost`).

## Example prompts

Try these prompts to activate this skill:

- "List the websites in my subscription"
- "List my web apps"
- "Show my app services"
- "List virtual machines"
- "Show storage accounts"
- "Find container apps"
- "What resources do I have?"
- "Find resources by tag"
- "Show orphaned resources"
- "Count resources by type"

## Related content

- [Azure Model Context Protocol (MCP) Server overview](/azure/developer/azure-mcp-server/overview)
- [Skill source code](https://github.com/microsoft/azure-skills/blob/main/skills/azure-resource-lookup/SKILL.md)
- [Azure Resource Manager overview](/azure/azure-resource-manager/management/overview)
- [Naming and tagging Azure resources](/azure/cloud-adoption-framework/ready/azure-best-practices/resource-naming)
- [Organize Azure resources](/azure/cloud-adoption-framework/ready/azure-setup-guide/organize-resources)
- [Azure resource providers](/azure/azure-resource-manager/management/azure-services-resource-providers)
