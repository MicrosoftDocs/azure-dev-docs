---
title: Azure skill for role-based access control (RBAC)
description: Helps users find the right Azure RBAC role for an identity with least privilege access, then generate CLI commands and Bicep code to assign it. Also provides guidance on permissions required to grant roles.
ms.topic: reference
ms.date: 4/2/2026
author: diberry
ms.author: diberry
ms.service: azure-mcp-server
ms.custom: skill-version-1.0.2
---

# Azure skill for role-based access control (RBAC)

Helps users find the right Azure RBAC role for an identity with least privilege access, then generate CLI commands and Bicep code to assign it. Also provides guidance on permissions required to grant roles.

**Skill:** `azure-rbac` | [Source code](https://github.com/microsoft/azure-skills/blob/main/skills/azure-rbac/SKILL.md)

## What it provides

This skill gives GitHub Copilot expertise in Azure role-based access control so it can guide you through secure role assignments. Specifically, it provides:

- **Least-privilege role recommendations**: Searches built-in Azure roles to find the minimal role definition that matches the permissions your identity needs.
- **Custom role definitions**: When no built-in role fits, generates a custom role definition scoped to exactly the permissions you require.
- **Role assignment commands**: Produces ready-to-run Azure CLI commands and Bicep code snippets for assigning roles to managed identities, service principals, or users.
- **Granting permissions guidance**: Explains what permissions you need (such as `Microsoft.Authorization/roleAssignments/write`) to assign roles, and which built-in roles like User Access Administrator or Owner provide them.

## Prerequisites

- **Azure subscription**: [Create a free account](https://azure.microsoft.com/free/) if you don't have one.
- **AI assistant with Azure Skills**: [GitHub Copilot for Azure](/azure/developer/github-copilot-azure/get-started), Visual Studio Code with [Azure MCP extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azure-mcp-server), Claude Code, or another [compatible MCP client](../install.md).
- **Azure CLI** (v2.60.0+): [Install](/cli/azure/install-azure-cli) and sign in with `az login`.
- **Azure role**: Your account must have `Microsoft.Authorization/roleAssignments/write` permission, such as [User Access Administrator](/azure/role-based-access-control/built-in-roles#user-access-administrator) or [Owner](/azure/role-based-access-control/built-in-roles#owner).

## When to use this skill

Use this skill when you need to:

- Work with bicep for role assignment, least privilege role, RBAC role for, and role to read blobs
- Work with role for managed identity and custom role definition
- Assign role to identity
- Work with permissions to assign roles

## Example prompts

Try these prompts to activate this skill:

- "What Azure RBAC role should I assign to my managed identity?"
- "Which Azure role gives least privilege access to read blobs from storage?"
- "What role do I need for my identity to access Azure Key Vault secrets?"
- "Help me find the right Azure role for container registry access"
- "I need a custom role definition for my Azure storage account"
- "What Azure role should I use to give my function app access to Service Bus?"
- "Assign an Azure RBAC role to my identity for Cosmos DB read access"
- "What is the least privilege role for reading from a storage queue?"
- "I need to assign a role to my app service managed identity for database access"
- "Generate Bicep code for assigning a role to my function app"

## Related content

- [Azure Model Context Protocol (MCP) Server overview](/azure/developer/azure-mcp-server/overview)
- [Skill source code](https://github.com/microsoft/azure-skills/blob/main/skills/azure-rbac/SKILL.md)

