---
title: Azure skill for prepare
description: Prepare Azure apps for deployment (infra Bicep/Terraform, azure.yaml, Dockerfiles).
ms.topic: reference
ms.date: 4/2/2026
author: diberry
ms.author: diberry
ms.service: azure-mcp-server
ms.custom: skill-version-1.1.15
---

# Azure skill for prepare

Prepare Azure apps for deployment (infra Bicep/Terraform, azure.yaml, Dockerfiles).

**Skill:** `azure-prepare` | [Source code](https://github.com/microsoft/azure-skills/blob/main/skills/azure-prepare/SKILL.md)

## What it provides

This skill provides GitHub Copilot with specialized knowledge. Prepare Azure apps for deployment (infra Bicep/Terraform, azure.yaml, Dockerfiles).

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

- "Create a dad joke generator and deploy to Azure"
- "Build a web app and host it on Azure"
- "I want to deploy my application to Azure"
- "Set up Azure infrastructure for my project"
- "Prepare my app for Azure deployment"
- "Create an API and run it on Azure"
- "Migrate my application to Azure"
- "Configure Azure hosting for my app"
- "Create a serverless HTTP API using Azure Functions and deploy to Azure"
- "Create an event-driven function app to process messages and deploy to Azure Functions"

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

