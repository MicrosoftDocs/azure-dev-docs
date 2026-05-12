---
title: Azure skill for Entra Agent ID
description: Provisions Microsoft Entra Agent Identity Blueprints, BlueprintPrincipals, and per-instance Agent Identities via Microsoft Graph, and configures OAuth 2.0 token exchange.
ms.topic: reference
ms.date: 05/05/2026
author: diberry
ms.author: diberry
ms.service: azure-mcp-server
ms.custom: skill-version-1.0.1
---

# Azure skill for Entra Agent ID

Provisions Microsoft Entra Agent Identity Blueprints, BlueprintPrincipals, and per-instance Agent Identities via Microsoft Graph, and configures OAuth 2.0 token exchange.

**Skill:** `entra-agent-id` | [Source code](https://github.com/microsoft/skills/blob/main/.github/skills/entra-agent-id/SKILL.md)

> [!IMPORTANT]
> **Preview API** — All Agent Identity endpoints are under Microsoft Graph `/beta` only. They are not available in `/v1.0`. Verify API parameters match current preview behavior before production use.

## What it provides

This skill provides GitHub Copilot with specialized knowledge for creating and managing OAuth 2.0-capable identities for AI agents using Microsoft Graph. Every agent instance gets a distinct identity, audit trail, and independently scoped permission grants. The skill covers the Agent Identity object model (Blueprint → BlueprintPrincipal → Agent Identity), runtime token exchange flows, and the Microsoft Entra SDK for AgentID sidecar.

For the latest Agent ID documentation, use the [microsoft-docs skill](https://github.com/microsoft/skills/blob/main/.github/skills/microsoft-docs/SKILL.md) which queries the Microsoft Learn MCP Server (`learn.microsoft.com/api/mcp`) for current API parameters and behavior.

## Prerequisites

- **Azure subscription**: [Create a free account](https://azure.microsoft.com/free/) if you don't have one.
- **AI assistant with Azure Skills**: [GitHub Copilot for Azure](/azure/developer/github-copilot-azure/get-started), Visual Studio Code with [Azure MCP extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azure-mcp-server), Claude Code, or another [compatible MCP client](../install.md).
- **Microsoft Entra role**: Agent Identity Developer, Agent Identity Administrator, or Application Administrator.
- **Microsoft Graph access**: PowerShell (`Microsoft.Graph.Applications`) or Python (`azure-identity`, `requests`).
- **OData-Version header**: Include `OData-Version: 4.0` on every Graph request to Agent Identity endpoints.

## When to use this skill

Use this skill when you need to:

- Provision a new Agent Identity Blueprint and BlueprintPrincipal.
- Create per-instance Agent Identities under a Blueprint.
- Configure credentials (Federated Identity Credential, Managed Identity, or client secret) on the Blueprint.
- Implement the two-step `fmi_path` runtime token exchange (autonomous or OBO).
- Set up cross-tenant agent token flows.
- Deploy the Microsoft Entra SDK for AgentID sidecar for polyglot agents (Python, Node, Go, Java).
- Grant per-Agent-Identity application or delegated permissions.
- Diagnose Agent ID errors such as `AADSTS82001`, `AADSTS700211`, or `PropertyNotCompatibleWithAgentIdentity`.

### When not to use this skill

- Standard Entra app registration — use [entra-app-registration](entra-app-registration.md).
- Azure RBAC — use [azure-rbac](azure-rbac.md).
- Microsoft Foundry agent authoring — use [microsoft-foundry](microsoft-foundry.md).

## Suggested workflow

The skill follows a core provisioning workflow:

1. **Create Agent Identity Blueprint**: Define the agent type/class as an application object.
1. **Create BlueprintPrincipal**: Explicitly create the service principal. This step is mandatory — creating a Blueprint does NOT auto-create its service principal. Without this step, Agent Identity creation fails with `400: The Agent Blueprint Principal for the Agent Blueprint does not exist.`
1. **Create Agent Identities**: Provision per-instance identities under the Blueprint. Sponsors are required and must be User objects — ServicePrincipals and Groups are rejected.
1. **Configure credentials**: Set up authentication on the Blueprint (Workload Identity Federation for production, client secret for dev).
1. **Grant permissions**: Assign application or delegated permissions per Agent Identity.
1. **Configure runtime exchange**: Implement the two-step `fmi_path` token exchange for autonomous or OBO flows.

> [!IMPORTANT]
> `DefaultAzureCredential` is not supported for Agent Identity APIs. Azure CLI tokens carry `Directory.AccessAsUser.All`, which Agent Identity APIs reject with 403. You MUST use a dedicated app registration with `client_credentials` flow, or connect via `Connect-MgGraph` with explicit delegated scopes.

## Required permissions

Agent Identity APIs use 18 specific Microsoft Graph application permissions. Discover them with:

```azurecli
az ad sp show --id 00000003-0000-0000-c000-000000000000 \
  --query "appRoles[?contains(value, 'AgentIdentity')].{id:id, value:value}" -o json
```

Key permissions include:

| Permission | Purpose |
|-----------|---------|
| `Application.ReadWrite.All` | Blueprint CRUD (application objects) |
| `AgentIdentityBlueprint.Create` | Create new Blueprints |
| `AgentIdentityBlueprint.ReadWrite.All` | Manage Blueprint lifecycle |
| `AgentIdentity.Create.All` | Create per-instance identities |
| `AgentIdentity.ReadWrite.All` | Manage Agent Identity lifecycle |

## Example prompts

Try these prompts to activate this skill:

- "Set up an Agent Identity Blueprint for my AI agent"
- "Create a BlueprintPrincipal for my agent"
- "Provision agent identities for my AI agents"
- "Configure OAuth for agent identity"
- "Set up fmi_path token exchange for my agent"
- "Configure agent OBO flow"
- "Set up Workload Identity Federation for agents"
- "Deploy the Microsoft Entra SDK for AgentID sidecar"
- "Configure polyglot agent authentication"

## Related content

- [Microsoft Entra Agent ID AI-guided setup](/entra/agent-id/identity-platform/agent-id-ai-guided-setup)
- [Microsoft Entra SDK for AgentID](/entra/msidweb/agent-id-sdk/overview)
- [Azure Model Context Protocol (MCP) Server overview](/azure/developer/azure-mcp-server/overview)
- [Skill source code](https://github.com/microsoft/skills/blob/main/.github/skills/entra-agent-id/SKILL.md)

> [!NOTE]
> The [skill source](https://github.com/microsoft/skills/blob/main/.github/skills/entra-agent-id/SKILL.md) is an AI instruction file that tells GitHub Copilot when and how to use this capability. For official developer documentation, see the [Microsoft Entra Agent ID AI-guided setup](/entra/agent-id/identity-platform/agent-id-ai-guided-setup).
