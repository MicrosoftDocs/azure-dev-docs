---
title: Azure Skill for Azure App Onboard
description: Use the Azure App Onboard skill to assess app readiness, choose Azure services, estimate costs, and scaffold deployment assets.
author: diberry
ms.author: diberry
ms.reviewer: vaibbavis
ms.date: 08/14/2026
ms.service: azure-mcp-server
ms.topic: reference
ms.custom: [devx-track-copilot-skills, skill-version-1.2.7]
ai-usage: ai-generated
ms.skillversion: "1.2.7"
---

# Azure skill for Azure App Onboard

The Azure App Onboard skill helps you move a new or existing app to Azure. It guides you through app-readiness checks, Azure service selection, cost estimation, infrastructure scaffolding, and deployment approval so you can go from idea or codebase to a deployable Azure plan.

**Skill** `azure-app-onboard` | [Source code](https://github.com/microsoft/azure-skills/blob/main/skills/azure-app-onboard/SKILL.md)

## What it provides

Azure App Onboard gives you an end-to-end workflow for getting an application ready for Azure. It helps you:

- Assess whether an existing app is ready for Azure deployment.
- Identify the Azure services that best fit your app's architecture, scale, and operating model.
- Build an onboarding plan with cost estimates and architecture rationale before you commit to infrastructure.
- Scaffold infrastructure and deployment assets after you approve the proposed plan.
- Use Azure MCP Server and the Bicep MCP server during scaffolding to generate and validate Bicep-based deployment assets.
- Move through approval gates before deployment starts.

## Prerequisites

- **Azure subscription**: [Create a free account](https://azure.microsoft.com/free/) if you don't have one.
- **AI assistant with Azure Skills**: [GitHub Copilot for Azure](/azure/developer/github-copilot-azure/get-started), Visual Studio Code with the [Azure MCP extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azure-mcp-server), Claude Code, or another [compatible MCP client](../install.md).
- **Azure CLI** (v2.60.0+): [Install](/cli/azure/install-azure-cli) and sign in with `az login`.
- **PowerShell** (v7.4+): Install from [PowerShell documentation](/powershell/scripting/install/installing-powershell).
- **Node.js** (LTS): Install from [Node.js](https://nodejs.org/).
- **Bash shell**: Use Git Bash, WSL, or another Bash-compatible shell.
- **An app idea or existing codebase**: Start with either a business idea, an existing app, or a repository that you want to onboard to Azure.

## When to use this skill

Use this skill when you need to:

- Bring a new app to Azure and want guidance on which services to use.
- Evaluate an existing codebase before deploying it to Azure.
- Plan an Azure deployment with cost estimates before committing to infrastructure.
- Move an existing app to Azure with minimal rewriting.
- Scaffold deployment assets after you approve the onboarding plan.
- Get guided Azure onboarding without already knowing the target service mix.

## When not to use this skill

| Scenario | Use instead |
|---|---|
| Run an existing deployment or execute `azd up` | [Azure Deploy](azure-deploy.md) |
| Optimize costs for resources that already run in Azure | [Azure Cost Optimization](azure-cost.md) |
| Run only a readiness scan for an existing repository | [Azure App Onboard Prereq](azure-app-onboard-prereq.md) |
| Generate infrastructure for a known target architecture | [Azure Prepare](azure-prepare.md) |
| Validate deployment files or preflight checks before go-live | [Azure Validate](azure-validate.md) |

## Example prompts

Try these prompts to activate this skill:

- "Help me bring my app to Azure"
- "What Azure services do I need for this app?"
- "Is my code ready to deploy to Azure?"
- "Estimate what this app will cost to run on Azure"
- "Plan my Azure deployment for this repository"
- "I have an app and want it on Azure"
- "Migrate this app to Azure with minimal changes"
- "Generate the infrastructure plan for my app"
- "Help me get started on Azure for this project"
- "Deploy my new app to Azure"

## Related content

- [Azure skill for Azure Prepare](azure-prepare.md)
- [Azure skill for Azure App Onboard Prereq](azure-app-onboard-prereq.md)
- [Azure skill for Azure Validate](azure-validate.md)
- [Azure skill for Azure Deploy](azure-deploy.md)
- [Azure Skills overview](../overview.md)
- [Azure Model Context Protocol (MCP) Server overview](../../azure-mcp-server/overview.md)
- [Skill source code](https://github.com/microsoft/azure-skills/blob/main/skills/azure-app-onboard/SKILL.md)
