---
title: Azure skill for Entra app registration
description: Guides Microsoft Entra ID app registration, OAuth 2.0 authentication, and MSAL integration.
ms.topic: reference
ms.date: 4/2/2026
author: diberry
ms.author: diberry
ms.service: azure-mcp-server
ms.custom: skill-version-1.0.1
---

# Azure skill for Entra app registration

Guides Microsoft Entra ID app registration, OAuth 2.0 authentication, and MSAL integration.

**Skill:** `entra-app-registration` | [Source code](https://github.com/microsoft/azure-skills/blob/main/skills/entra-app-registration/SKILL.md)

## What it provides

This skill provides GitHub Copilot with specialized knowledge. Guides Microsoft Entra ID app registration, OAuth 2.0 authentication, and MSAL integration.

## Prerequisites

- **Azure subscription**: [Create a free account](https://azure.microsoft.com/free/) if you don't have one.
- **AI assistant with Azure Skills**: [GitHub Copilot for Azure](/azure/developer/github-copilot-azure/get-started), Visual Studio Code with [Azure MCP extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azure-mcp-server), Claude Code, or another [compatible MCP client](../install.md).
- **Azure CLI with Bicep** (v2.60.0+): [Install](/cli/azure/install-azure-cli), sign in with `az login`, then run `az bicep install`.
- **[Azure Key Vault](/azure/key-vault/general/quick-create-portal)**: A key vault for secrets and certificate management.

## When to use this skill

Use this skill when you need to:

- Create a Microsoft Entra ID app registration for your application.
- Register your application with Microsoft Entra ID.
- Configure OAuth 2.0 authentication flows for your registered application.
- Set up authentication and authorization for your application.
- Add API permissions in Azure
- Work with generate service principal, MSAL example, console app auth, and Entra ID setup
- Work with Microsoft Entra ID authentication

## Example prompts

Try these prompts to activate this skill:

- "How do I create an app registration in Azure?"
- "Register a Microsoft Entra ID app for my web application"
- "Configure OAuth authentication for my application"
- "Set up authentication with Microsoft Entra ID"
- "Add API permissions to my Entra app registration"
- "Generate a service principal for Azure authentication"
- "Show me MSAL examples for Microsoft Entra ID authentication."
- "Create a console app with Microsoft Entra ID authentication"
- "Help me set up Entra ID authentication for my app"
- "Configure Microsoft Entra ID OAuth authentication for my API"

## Related content

- [Azure Model Context Protocol (MCP) Server overview](/azure/developer/azure-mcp-server/overview)
- [Skill source code](https://github.com/microsoft/azure-skills/blob/main/skills/entra-app-registration/SKILL.md)

