---
title: Azure skill for validate
description: Pre-deployment validation for Azure readiness. Run deep checks on configuration, infrastructure (Bicep or Terraform), RBAC role assignments, managed identity permissions, and prerequisites before deploying.
ms.topic: reference
ms.date: 4/2/2026
author: diberry
ms.author: diberry
ms.service: azure-mcp-server
ms.custom: skill-version-1.0.4
---

# Azure skill for validate

Pre-deployment validation for Azure readiness. Run deep checks on configuration, infrastructure (Bicep or Terraform), role-based access control (RBAC) role assignments, managed identity permissions, and prerequisites before deploying.

**Skill:** `azure-validate` | [Source code](https://github.com/microsoft/azure-skills/blob/main/skills/azure-validate/SKILL.md)

## What it provides

This skill provides GitHub Copilot with specialized knowledge. Pre-deployment validation for Azure readiness. Run deep checks on configuration, infrastructure (Bicep or Terraform), RBAC role assignments, managed identity permissions, and prerequisites before deploying.

## Prerequisites

- **Azure subscription**: [Create a free account](https://azure.microsoft.com/free/) if you don't have one.
- **AI assistant with Azure Skills**: [GitHub Copilot for Azure](/azure/developer/github-copilot-azure/get-started), Visual Studio Code with [Azure MCP extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azure-mcp-server), Claude Code, or another [compatible MCP client](../install.md).
- **Azure CLI** (v2.60.0+): [Install](/cli/azure/install-azure-cli) and sign in with `az login`.

## When to use this skill

Use this skill when you need to:

- Validate my app in Azure
- Check deployment readiness in Azure
- Run preflight checks in Azure
- Verify configuration in Azure
- Check if ready to deploy
- Validate azure.yaml
- Validate Bicep in Azure
- Test before deploying in Azure
- Troubleshoot deployment errors in Azure
- Validate Azure Functions

## Example prompts

Try these prompts to activate this skill:

- "Check if my app is ready to deploy to Azure"
- "Validate my azure.yaml configuration"
- "Run preflight checks before Azure deployment"
- "Troubleshoot deployment errors"
- "Verify my infrastructure configuration before deploying"
- "Is my app ready for Azure deployment?"
- "Validate my Bicep configuration"
- "Validate my Bicep template before deploying to Azure"
- "Check my deployment permissions before running `azd` up"
- "Verify my Bicep files are valid before provisioning"

## Deployment workflow

This skill is the second step in the deployment workflow:

1. [**azure-prepare**](azure-prepare.md) — generates infrastructure files and `.azure/deployment-plan.md`
1. **azure-validate** (this skill) — validates the deployment plan and infrastructure before deploying
1. [**azure-deploy**](azure-deploy.md) — executes the deployment

## Related content

- [Azure skill for prepare](azure-prepare.md)
- [Azure skill for deploy](azure-deploy.md)
- [Azure Model Context Protocol (MCP) Server overview](/azure/developer/azure-mcp-server/overview)
- [Skill source code](https://github.com/microsoft/azure-skills/blob/main/skills/azure-validate/SKILL.md)

