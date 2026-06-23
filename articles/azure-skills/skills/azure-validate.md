---
title: Azure skill for Azure Validate
description: The azure-validate skill helps you run pre-deployment validation for Azure Bicep and Terraform templates. Use it to check ARM template syntax, validate RBAC permissions, verify service quotas, and confirm policy compliance before deploying.
ms.topic: reference
ms.date: 06/22/2026
author: diberry
ms.author: diberry
ms.reviewer: tomescht
ms.service: azure-mcp-server
ms.custom: devx-track-copilot-skills
ms.skillversion: 1.0.4
ai-usage: ai-generated
---

# Azure skill for Azure Validate

The `azure-validate` skill helps you run pre-deployment validation for Azure Bicep and Terraform templates. Use it to check ARM template syntax, validate RBAC permissions, verify service quotas, and confirm policy compliance before deploying.

**Skill** `azure-validate` | [Source code](https://github.com/microsoft/azure-skills/blob/main/skills/azure-validate/SKILL.md)

## What it provides

You get pre-deployment validation for Bicep and Terraform templates, including ARM template syntax checks, what-if analysis, RBAC permission verification, service quota checks, and Azure Policy compliance validation — all before any resources are deployed.

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

- "Validate my app"
- "Check deployment readiness"
- "Run preflight checks"
- "Verify my configuration"
- "Check if I'm ready to deploy"
- "Validate my azure.yaml"
- "Validate my Bicep template"
- "Test before deploying"
- "Troubleshoot deployment errors"
- "Validate my Azure Functions app"

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
- [ARM template validation](/azure/azure-resource-manager/templates/template-syntax)
- [Bicep linter](/azure/azure-resource-manager/bicep/linter)
- [ARM deployment best practices](/azure/azure-resource-manager/templates/best-practices)
