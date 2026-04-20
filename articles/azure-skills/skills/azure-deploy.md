---
title: Azure skill for deploy
description: Execute Azure deployments for already-prepared applications that have existing .azure/deployment-plan.md and infrastructure files.
ms.topic: reference
ms.date: 4/2/2026
author: diberry
ms.author: diberry
ms.service: azure-mcp-server
ms.custom: skill-version-1.0.19
---

# Azure skill for deploy

Execute Azure deployments for already-prepared applications that have existing .azure/deployment-plan.md and infrastructure files.

**Skill:** `azure-deploy` | [Source code](https://github.com/microsoft/azure-skills/blob/main/skills/azure-deploy/SKILL.md)

## What it provides

This skill enables GitHub Copilot to execute production deployments using your prepared infrastructure-as-code files. You get automated provisioning, reliable updates to deployed resources, and safe infrastructure deployments without manual CLI commands.

## Prerequisites

- **Prepared deployment plan**: Run the [azure-prepare](azure-prepare.md) skill first to generate your `.azure/deployment-plan.md` and infrastructure files. Then run the [azure-validate](azure-validate.md) skill to verify readiness.
- **Azure subscription**: [Create a free account](https://azure.microsoft.com/free/) if you don't have one.
- **AI assistant with Azure Skills**: [GitHub Copilot for Azure](/azure/developer/github-copilot-azure/get-started), Visual Studio Code with [Azure MCP extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azure-mcp-server), Claude Code, or another [compatible MCP client](../install.md).
- **Azure CLI** (v2.60.0+): [Install](/cli/azure/install-azure-cli) and sign in with `az login`.

## When to use this skill

Use this skill when you need to:

- Provision and deploy resources to Azure using the `azd up` command
- Update deployed resources using the `azd deploy` command
- Execute deployments with Azure Developer CLI or your infrastructure-as-code tool
- Work with push to production, push to cloud, go live, and ship it
- Work with bicep deploy, terraform apply, publish to Azure, and launch on Azure

## Example prompts

Try these prompts to activate this skill:

- "Execute deployment to Azure production"
- "Deploy and provision my Azure infrastructure"
- "Push my deploy to Azure production"
- "Ship and deploy my Azure app"
- "Run the Azure deployment now"
- "Deploy my Azure Functions app to cloud using the Azure Developer CLI."
- "Deploy my serverless function app to Azure"
- "Deploy Azure Functions to production"
- "Deploy my app and verify the role-based access control (RBAC) roles are assigned correctly"
- "Run deployment and check live role assignments on Azure"

## Deployment workflow

This skill is the final step in the deployment workflow:

1. [**azure-prepare**](azure-prepare.md) — generates infrastructure files and `.azure/deployment-plan.md`
1. [**azure-validate**](azure-validate.md) — validates the deployment plan and infrastructure before deploying
1. **azure-deploy** (this skill) — executes the deployment

## Related content

- [Azure skill for prepare](azure-prepare.md)
- [Azure skill for validate](azure-validate.md)
- [Azure Model Context Protocol (MCP) Server overview](/azure/developer/azure-mcp-server/overview)
- [Skill source code](https://github.com/microsoft/azure-skills/blob/main/skills/azure-deploy/SKILL.md)
