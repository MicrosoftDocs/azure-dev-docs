---
title: Azure Skill for Azure Validate
description: The azure-validate skill helps you run pre-deployment validation for Azure Bicep and Terraform templates. Use it to check ARM template syntax, validate RBAC permissions, verify service quotas, and confirm policy compliance before deploying.
author: diberry
ms.author: diberry
ms.reviewer: tomescht
ms.date: 08/06/2026
ms.service: azure-mcp-server
ms.topic: reference
ms.custom:
  - devx-track-copilot-skills
ai-usage: ai-generated
ms.skillversion: "1.2.10"
---

# Azure skill for Azure Validate

The `azure-validate` skill helps you run script-driven predeployment validation for Azure apps and infrastructure. Use it after [azure-prepare](azure-prepare.md) to verify configuration, infrastructure, roles, and deployment prerequisites before you continue to [azure-deploy](azure-deploy.md).

**Skill** `azure-validate` | [Source code](https://github.com/microsoft/azure-skills/blob/main/skills/azure-validate/SKILL.md)

## What it provides

You get pre-deployment validation for Bicep and Terraform templates, including ARM template syntax checks, what-if analysis, RBAC permission verification, service quota checks, and Azure Policy compliance validation — all before any resources are deployed.

## Prerequisites

- **Prepared deployment plan**: Run [azure-prepare](azure-prepare.md) first, and make sure `.azure/deployment-plan.md` exists with an **Approved** status or later.
- **Azure subscription**: [Create a free account](https://azure.microsoft.com/free/) if you don't have one.
- **AI assistant with Azure Skills**: [GitHub Copilot for Azure](/azure/developer/github-copilot-azure/get-started), Visual Studio Code with [Azure MCP extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azure-mcp-server), Claude Code, or another [compatible MCP client](../install.md).
- **Azure CLI** (v2.60.0+): [Install](/cli/azure/install-azure-cli) and sign in with `az login`.
- **PowerShell 7 or Bash**: Use PowerShell on Windows or Bash on macOS and Linux to run the workflow script.

## When to use this skill

Use this skill when you need to:

- Validate a prepared Azure deployment before any resources are created or updated.
- Check whether your `azure.yaml`, Bicep files, Terraform files, and deployment settings are ready.
- Verify RBAC assignments, managed identity permissions, and other deployment prerequisites.
- Run the official scripted validation flow for Azure Functions, Container Apps, App Service, and related Azure scenarios.
- Troubleshoot failed readiness checks before you hand off to deployment.

## Example prompts

Try these prompts to activate this skill:

- "Validate my app"
- "Check deployment readiness"
- "Run preflight checks"
- "Verify my configuration"
- "Check if I'm ready to deploy"
- "Validate my azure.yaml"
- "Validate my Bicep template"
- "Run the azure-validate workflow script"
- "Troubleshoot deployment errors"
- "Validate my Azure Functions app"

## Validation workflow

This skill is the second step in the deployment workflow:

1. [**azure-prepare**](azure-prepare.md) — generates infrastructure files and `.azure/deployment-plan.md`
1. **azure-validate** (this skill) — runs the validation workflow script, records progress in `.azure/validate-status.json`, and verifies readiness
1. [**azure-deploy**](azure-deploy.md) — executes the deployment

## Related content

- [Azure skill for prepare](azure-prepare.md)
- [Azure skill for deploy](azure-deploy.md)
- [Azure Model Context Protocol (MCP) Server overview](/azure/developer/azure-mcp-server/overview)
- [Skill source code](https://github.com/microsoft/azure-skills/blob/main/skills/azure-validate/SKILL.md)
- [Azure deployment workflow with Azure Developer CLI](/azure/developer/azure-developer-cli/overview)
- [ARM template validation](/azure/azure-resource-manager/templates/template-syntax)
- [Bicep linter](/azure/azure-resource-manager/bicep/linter)
