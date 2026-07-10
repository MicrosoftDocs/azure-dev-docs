---
title: Azure skill for python-appservice-deploy
description: Deploy Python apps to Azure App Service on Linux. Learn how to publish Flask, Django, and FastAPI code with automatic dependency handling. Start deploying now.
#customer intent: As a developer new to Azure, I want to understand the prerequisites for deploying Python apps to App Service with this skill, so that I can set up my environment correctly and deploying.
ms.topic: reference
ms.date: 06/26/2026
author: diberry
ms.author: diberry
ms.service: azure-mcp-server
ai-usage: ai-generated
ms.reviewer: glaming, @tmeschter
---

# Azure skill for python-appservice-deploy

Use this skill to deploy Flask, Django, and FastAPI apps to [Azure App Service](/azure/app-service) on Linux. You use this skill when you want a straightforward path from code to running App Service, not for containers, Functions, or infrastructure-as-code workflows. Use `python-appservice-deploy` when you need a straightforward, code-to-running deployment of a Python web app (Flask, Django, or FastAPI) to Azure App Service on Linux, rather than when you're targeting containers, Functions. Managing infrastructure with infrastructure as code (IaC) tools.

**Skill** `python-appservice-deploy` | [Source code](https://github.com/microsoft/azure-skills/blob/main/skills/python-appservice-deploy/SKILL.md)

## What it provides

Deploy your Flask, Django, or FastAPI app to Azure App Service on Linux. The deployment process handles Python version selection, dependency installation, and publishing your code so the app runs correctly. This skill is for app deployment only - not for Container Apps, Azure Functions, non-Python projects, or full infrastructure provisioning. For infrastructure tasks, use `azure-prepare`.

## Prerequisites

- **Azure authentication** - Sign in by using `az login` or use a service principal.
- **Azure subscription** - An active Azure subscription is required.
- **GitHub Copilot**
- **Shell** - one of the following:
  - **PowerShell** (v7.4+) - Install: `winget install Microsoft.PowerShell`
  - **Bash**
- **Deployment CLI** - one of the following:
  - **Azure CLI**
  - **Azure Developer CLI**

## When to use this skill

Use the **Python Appservice Deploy** skill when you need to:

- Manage and configure Flask App Service, Django App Service, and FastAPI App Service in Azure
- Deploy Python to App Service

### When not to use this skill

Don't use this skill for non-Linux workloads, Container Apps, Functions, non-Python projects, Terraform/Bicep/infrastructure as code (IaC), or full infrastructure. For these scenarios, use [azure-prepare](azure-prepare.md).

## Example prompts

Try these prompts to activate this skill:

- "I have a Flask sample app in this workspace. Use my current Azure subscription and the eastus2 region. Deploy this Flask app to Azure App Service."
- "Deploy this Django app to Azure App Service"
- "Deploy my Python app to Azure App Service"

## Related content

- [Azure Model Context Protocol (MCP) Server overview](/azure/developer/azure-mcp-server/overview)
- [Quickstart: Deploy a Python web app to Azure App Service](/azure/app-service/quickstart-python)
- [Quickstart: Deploy a Flask app to Azure App Service](/azure/app-service/quickstart-python?tabs=flask)
- [Quickstart: Deploy a Django app to Azure App Service](/azure/app-service/quickstart-python?tabs=django)
- [Tutorial: Deploy a Flask web app with PostgreSQL in Azure App Service](/azure/app-service/tutorial-python-postgresql-app-flask)
- [Tutorial: Deploy a Django web app with PostgreSQL in Azure App Service](/azure/app-service/tutorial-python-postgresql-app-django)
- [Tutorial: Deploy a FastAPI web app with PostgreSQL in Azure App Service](/azure/app-service/tutorial-python-postgresql-app-fastapi)
- [Configure Linux Python apps in Azure App Service](/azure/app-service/configure-language-python)
- [Skill source code](https://github.com/microsoft/azure-skills/blob/main/skills/python-appservice-deploy/SKILL.md)
