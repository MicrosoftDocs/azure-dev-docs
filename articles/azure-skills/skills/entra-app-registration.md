---
title: Azure Skill for Microsoft Entra App Registration
description: The entra-app-registration skill guides you through Microsoft Entra ID app registration and OAuth 2.0 authentication, and shows MSAL (Microsoft Authentication Library) integration patterns. It's for when you create app registrations, configure OAuth flows, add API permissions, or generate service principals for console apps and server-side auth.
author: diberry
ms.author: diberry
ms.reviewer: chuye
ms.date: 06/15/2026
ms.service: azure-mcp-server
ms.topic: reference
ms.custom:
  - devx-track-copilot-skills
ai-usage: ai-generated
ms.skillversion: "1.1.1"
---

# Azure skill for Microsoft Entra app registration

This skill guides you through Microsoft Entra ID app registration and OAuth 2.0 authentication, and shows MSAL (Microsoft Authentication Library) integration patterns. It's for when you create app registrations, configure OAuth flows, add API permissions, or generate service principals for console apps and server-side auth.

**Skill** `entra-app-registration` | [Source code](https://github.com/microsoft/azure-skills/blob/main/skills/entra-app-registration/SKILL.md)

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

### When not to use this skill

- Azure role-based access control (RBAC) or role assignments (use `azure-rbac`)
- Key Vault secrets (use `azure-keyvault-expiration-audit`)
- General Azure resource security guidance

## Example prompts

Try these prompts to activate this skill:

- "Create an app registration"
- "Register an Azure AD app"
- "Configure OAuth for my app"
- "Set up authentication"
- "Add API permissions to my app registration"
- "Generate a service principal"
- "MSAL example for console app auth"
- "Set up Entra ID authentication"

## Related content

- [Azure Model Context Protocol (MCP) Server overview](/azure/developer/azure-mcp-server/overview)
- [Skill source code](https://github.com/microsoft/azure-skills/blob/main/skills/entra-app-registration/SKILL.md)
- [Microsoft Entra ID overview](/entra/identity-platform/)
- [App registration quickstart](/entra/identity-platform/quickstart-register-app)
- [Authentication vs authorization](/entra/identity-platform/authentication-vs-authorization)
- [Security best practices for app registrations](/entra/identity-platform/security-best-practices-for-app-registration)
