---
title: Azure Skill for Azure Prepare
description: The azure-prepare skill helps you prepare Azure environments for app deployment. Use it to generate Bicep or Terraform templates and a deployment plan that define resource groups, app settings, and services for Container Apps, App Service, Functions, and related services.
author: diberry
ms.author: diberry
ms.reviewer: tomescht
ms.date: 06/29/2026
ms.service: azure-mcp-server
ms.topic: reference
ms.custom:
  - devx-track-copilot-skills
ai-usage: ai-generated
ms.skillversion: "1.2.14"
---

# Azure skill for Azure Prepare

The `azure-prepare` skill helps you prepare Azure environments for app deployment. Use it to generate Bicep or Terraform templates and a deployment plan that define resource groups, app settings, and services for Container Apps, App Service, Functions, and related services. After you generate and approve the deployment plan, the skill suggests a handoff to the [azure-validate](azure-validate.md) skill.

**Skill** `azure-prepare` | [Source code](https://github.com/microsoft/azure-skills/blob/main/skills/azure-prepare/SKILL.md)

## What it provides

You get guided setup for Azure app deployment. The skill generates the infrastructure as code and a deployment plan that define resource groups, app settings, managed identity, and services, using Bicep or Terraform templates for Container Apps, App Service, Functions, Key Vault, and other services.

## Prerequisites

- **Azure subscription**: [Create a free account](https://azure.microsoft.com/free/) if you don't have one.
- **AI assistant with Azure Skills**: [GitHub Copilot for Azure](/azure/developer/github-copilot-azure/get-started), Visual Studio Code with [Azure MCP extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azure-mcp-server), Claude Code, or another [compatible MCP client](../install.md).
- **Azure CLI with Bicep** (v2.60.0+): [Install](/cli/azure/install-azure-cli), sign in with `az login`, then run `az bicep install`.
- **[Terraform](https://developer.hashicorp.com/terraform/install)** (v1.5+).

## When to use this skill

Use this skill when you need to:

- Create app in Azure
- Build web app in Azure
- Create API in Azure
- Create serverless HTTP API
- Create front end in Azure
- Create back end in Azure
- Build a service in Azure
- Work with modernize application
- Update application in Azure
- Add authentication in Azure

## Example prompts

Try these prompts to activate this skill:

- "Create an app"
- "Build a web app"
- "Create an API"
- "Create a serverless HTTP API"
- "Host my app on Azure"
- "Deploy to Azure Container Apps"
- "Deploy to Azure App Service using Terraform"
- "Generate Bicep for my app"
- "Create a function app with a timer trigger"
- "Prepare my Azure application to use Key Vault"

## Deployment workflow

This skill is the first step in the deployment workflow:

1. **azure-prepare** (this skill) — generates infrastructure files and `.azure/deployment-plan.md`
1. [**azure-validate**](azure-validate.md) — validates the deployment plan and infrastructure before deploying
1. [**azure-deploy**](azure-deploy.md) — executes the deployment

## Related content

- [Azure skill for validate](azure-validate.md)
- [Azure skill for deploy](azure-deploy.md)
- [Azure Model Context Protocol (MCP) Server overview](/azure/developer/azure-mcp-server/overview)
- [Skill source code](https://github.com/microsoft/azure-skills/blob/main/skills/azure-prepare/SKILL.md)
- [Azure Container Apps overview](/azure/container-apps/overview)
- [Azure App Service documentation](/azure/app-service/)
