---
title: Azure skill for Azure App Onboard Prereq
description: Use the Azure App Onboard Prereq skill to assess build health, app completeness, and Azure deployment readiness.
ms.topic: reference
ms.date: 08/14/2026
author: diberry
ms.author: diberry
ms.reviewer: vaibbavis
ms.custom: [skill-version-1.2.7]
ai-usage: ai-generated
ms.skillversion: "1.2.7"
ms.service: azure-mcp-server
---

# Azure skill for Azure App Onboard Prereq

Assess whether source code is ready to deploy to Azure. Evaluates build health, app completeness, dependencies and local services, stack compatibility, and deployment feasibility. Answers questions about what your app needs before it can be deployed — frameworks, dependencies, and configuration.

**Skill:** `azure-app-onboard-prereq` | [Source code](https://github.com/microsoft/azure-skills/blob/main/skills/azure-app-onboard-prereq/SKILL.md)

## What it provides

The Azure App Onboard Prereq skill evaluates a user's repository for build health, app completeness, and Azure deployment feasibility. It produces per-component verdicts that are consumed by downstream phases in the Azure App Onboard pipeline. The skill performs static-only verification and read-only evaluation during normal prereq checks, and it only runs build or test commands in the limited consent-based cases defined by the skill.

## Prerequisites

- **Azure authentication**—Sign in with `az login` or use a service principal.
- **Azure subscription**—An active Azure subscription is required.
- **Azure CLI**—Install the latest version from [https://aka.ms/cli](https://aka.ms/cli).
- **Azure Developer CLI (azd)**—Install from [https://aka.ms/azd](https://aka.ms/azd).

## When to use this skill

Use the **Azure App Onboard Prereq** skill when you need to:

- Evaluate your repository for deployment readiness
- Check if your app is ready to deploy to Azure
- Determine what your app needs before deployment
- Identify deployment blockers and framework compatibility
- Verify build health and app completeness
- Check dependency compatibility
- Assess stack compatibility with Azure

### When not to use this skill

- **Validate infrastructure (Bicep/Terraform/azure.yaml)** — Use **azure-validate**
- **Generate infrastructure as code (IaC)** — Use **azure-prepare**
- **End-to-end idea-to-production deployment** — Use **azure-app-onboard**
- **Run `azd up` or deploy to Azure** — Use **azure-deploy**

## Example prompts

Try these prompts to activate this skill:

- "Evaluate my repo"
- "Is my app ready to deploy?"
- "What does my app need to deploy?"
- "What do I need before deploying?"
- "Does my app need a Dockerfile?"
- "What's blocking my deployment?"
- "Are my dependencies compatible?"
- "Does Azure support my framework?"
- "Can I ship this to Azure?"
- "Scan my repo for issues"
- "Is this app deployable?"
- "Check if my app is ready for Azure"
- "Are there any blockers?"
- "What needs to change before deploying?"
- "Check my app configuration"

## Related skills

- [azure-app-onboard](azure-app-onboard.md)
- [azure-validate](azure-validate.md)
- [azure-prepare](azure-prepare.md)
- [azure-deploy](azure-deploy.md)
- [azure-cloud-migrate](azure-cloud-migrate.md)

## Related content

- [Azure Model Context Protocol (MCP) Server overview](../../azure-mcp-server/overview.md)
- [Skill source code](https://github.com/microsoft/azure-skills/blob/main/skills/azure-app-onboard-prereq/SKILL.md)
