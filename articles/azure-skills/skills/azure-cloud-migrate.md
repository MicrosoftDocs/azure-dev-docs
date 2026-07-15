---
title: Azure Skill for Azure Cloud Migrate
description: The azure-cloud-migrate skill helps you migrate workloads from AWS, GCP, and Heroku to Azure. Use it to get migration guidance for containers, VMs, and application code including Spring Boot and containerized apps.
author: diberry
ms.author: diberry
ms.reviewer: skaluvak, mabhar
ms.date: 06/29/2026
ms.service: azure-mcp-server
ms.topic: reference
ms.custom:
  - devx-track-copilot-skills
ai-usage: ai-generated
ms.skillversion: "1.2.1"
---

# Azure skill for Azure Cloud Migrate

The azure-cloud-migrate skill helps you migrate workloads from AWS, GCP, and Heroku to Azure. Use it to get migration guidance for hosting scenarios and containerized apps.

**Skill** `azure-cloud-migrate` | [Source code](https://github.com/microsoft/azure-skills/blob/main/skills/azure-cloud-migrate/SKILL.md)

## Prerequisites

- **Azure subscription**: [Create a free account](https://azure.microsoft.com/free/) if you don't have one.
- **AI assistant with Azure Skills**: [GitHub Copilot for Azure](/azure/developer/github-copilot-azure/get-started), Visual Studio Code with [Azure MCP extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azure-mcp-server), Claude Code, or another [compatible MCP client](../install.md).
- **Azure CLI** (v2.60.0+): [Install](/cli/azure/install-azure-cli) and sign in with `az login`.

## When to use this skill

This skill covers the following migration scenarios:

| Source | Target | 
|--------|--------|
| AWS Lambda | [Azure Functions](/azure/azure-functions/) |
| AWS Elastic Beanstalk | [Azure App Service](/azure/app-service/) |
| Heroku | [Azure App Service](/azure/app-service/) |
| Google App Engine | [Azure App Service](/azure/app-service/) |
| AWS Fargate (ECS) | [Azure Container Apps](/azure/container-apps/) |
| Kubernetes (GKE/EKS/Self-hosted) | [Azure Container Apps](/azure/container-apps/) |
| GCP Cloud Run | [Azure Container Apps](/azure/container-apps/) |
| Spring Boot (Azure Spring Apps/VMs) | [Azure Container Apps](/azure/container-apps/) |


## Example prompts

Try these prompts to activate this skill:

- "Migrate my Lambda functions to Azure Functions"
- "Migrate from AWS to Azure"
- "Migrate my Beanstalk app"
- "Migrate from Heroku to Azure"
- "Migrate my App Engine app"
- "Migrate Cloud Run to Azure"
- "Migrate Fargate to Azure Container Apps"
- "Migrate EKS to Container Apps"
- "Migrate Spring Boot to Container Apps"
- "Cross-cloud migration"

## Related content

- [Azure Model Context Protocol (MCP) Server overview](/azure/developer/azure-mcp-server/overview)
- [Skill source code](https://github.com/microsoft/azure-skills/blob/main/skills/azure-cloud-migrate/SKILL.md)
- [Azure Migrate overview](/azure/migrate/migrate-services-overview)
- [Cloud migration strategies](/azure/cloud-adoption-framework/migrate/)
- [Azure migration best practices](/azure/cloud-adoption-framework/migrate/azure-best-practices/)
- [Azure Functions](/azure/azure-functions/)
- [Azure App Service](/azure/app-service/)
- [Azure Container Apps](/azure/container-apps/)
