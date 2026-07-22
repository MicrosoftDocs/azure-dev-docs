---
title: Azure Skill for Azure Hosted Copilot SDK
description: The azure-hosted-copilot-sdk skill helps you build and deploy GitHub Copilot SDK (@github/copilot-sdk) apps to Azure. Use it to configure CopilotClient, set up BYOM (Bring Your Own Model) with Azure OpenAI, and deploy to Azure Container Apps or App Service.
author: diberry
ms.author: diberry
ms.reviewer: tomescht
ms.date: 06/22/2026
ms.service: azure-mcp-server
ms.topic: reference
ms.custom:
  - devx-track-copilot-skills
ai-usage: ai-generated
ms.skillversion: "1.0.6"
---

# Azure skill for Azure Hosted Copilot SDK

The azure-hosted-copilot-sdk skill helps you build and deploy GitHub Copilot SDK (@github/copilot-sdk) apps to Azure. Use it to configure CopilotClient, set up BYOM with Azure OpenAI, deploy to Container Apps or App Service, and integrate with azure-prepare for environment setup.

**Skill** `azure-hosted-copilot-sdk` | [Source code](https://github.com/microsoft/azure-skills/blob/main/skills/azure-hosted-copilot-sdk/SKILL.md)

## What it provides

You get guidance on building Copilot SDK apps with @github/copilot-sdk, configuring CopilotClient, and implementing createSession and sendAndWait workflows. Also covers BYOM (Bring Your Own Model) integration with Azure OpenAI and deployment patterns for Azure Container Apps and App Service.

## Prerequisites

- **Azure subscription**: [Create a free account](https://azure.microsoft.com/free/) if you don't have one.
- **AI assistant with Azure Skills**: [GitHub Copilot for Azure](/azure/developer/github-copilot-azure/get-started), Visual Studio Code with [Azure MCP extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azure-mcp-server), Claude Code, or another [compatible MCP client](../install.md).
- **Azure CLI** (v2.60.0+): [Install](/cli/azure/install-azure-cli) and sign in with `az login`.

## When to use this skill

Use this skill when you need to:

- Build custom copilot applications on Azure infrastructure.
- Create and configure copilot applications.
- Use the GitHub Copilot SDK to scaffold and build copilot-powered applications.
- Deploy your copilot application to Azure infrastructure.
- Host applications on Azure using Azure OpenAI models or bring your own model (BYOM).
- Integrate your own large language model (LLM) with the Copilot SDK.
- Configure Azure OpenAI models, managed identity authentication, and the Copilot SDK service.
- Build chat applications using the Copilot SDK service template and the `CopilotClient` library.
- Implement session management and message handling using the GitHub Models API.

### When not to use this skill

- General Azure app deployment without Copilot SDK (use `azure-prepare` + `azure-deploy`).
- GitHub Actions or CI/CD pipeline setup (use workflow-specific skills).
- Azure OpenAI configuration without Copilot SDK integration.

## Example prompts

Try these prompts to activate this skill:

- "Build a copilot-powered app"
- "Set up @github/copilot-sdk in my project"
- "Add a feature to my copilot app"
- "Configure CopilotClient"
- "Set up createSession and sendAndWait"
- "Bring your own model with Azure OpenAI"
- "Run azd init copilot"
- "Prepare my copilot app for deployment"
- "Modify my copilot app to use BYOM"

## Automatic activation

This skill activates automatically when GitHub Copilot detects you're working in a GitHub Copilot SDK project (project contains `@github/copilot-sdk` dependency). You don't need to explicitly invoke it — Copilot recognizes the SDK context and applies skill guidance automatically.

## Related content

- [Azure Model Context Protocol (MCP) Server overview](/azure/developer/azure-mcp-server/overview)
- [Skill source code](https://github.com/microsoft/azure-skills/blob/main/skills/azure-hosted-copilot-sdk/SKILL.md)
- [GitHub Copilot SDK documentation](https://docs.github.com/copilot)
- [Azure Container Apps overview](/azure/container-apps/overview)
- [Azure App Service overview](/azure/app-service/overview)
