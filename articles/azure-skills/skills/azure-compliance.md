---
title: Azure skill for Azure Compliance
description: The azure-compliance skill helps you run Azure compliance and security audits, combining azqr assessments with Key Vault expiration checks. Use it to find expiring or expired certificates and secrets, detect orphaned resources, and surface policy and best-practice gaps before running azqr scans.
ms.topic: reference
ms.date: 06/15/2026
ms.reviewer: skaluvak 
author: diberry
ms.author: diberry
ms.service: azure-mcp-server
ms.custom: devx-track-copilot-skills
ms.skillversion: 1.1.1
ai-usage: ai-generated
---

# Azure skill for Azure Compliance

This skill helps you run Azure compliance and security audits, combining `azqr` assessments with Key Vault expiration checks. Use it to find expiring or expired certificates and secrets, detect orphaned resources, and surface policy and best-practice gaps before running `azqr` scans.

**Skill** `azure-compliance` | [Source code](https://github.com/microsoft/azure-skills/blob/main/skills/azure-compliance/SKILL.md)

## What it provides

Get a combined compliance and security audit that pairs `azqr` assessments with Key Vault expiration checks to reveal expiring or expired certificates and secrets. Identify orphaned resources and surface policy and best-practice gaps before running `azqr` scans so you can remediate risks and prioritize fixes.

## Prerequisites

- **Azure subscription**: [Create a free account](https://azure.microsoft.com/free/) if you don't have one.
- **AI assistant with Azure Skills**: [GitHub Copilot for Azure](/azure/developer/github-copilot-azure/get-started), Visual Studio Code with [Azure MCP extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azure-mcp-server), Claude Code, or another [compatible MCP client](../install.md).
- **Azure CLI** (v2.60.0+): [Install](/cli/azure/install-azure-cli) and sign in with `az login`.
- **[Azure Key Vault](/azure/key-vault/general/quick-create-portal)** (optional): Required only for key, secret, and certificate expiration audits.

## When to use this skill

Use this skill when you need to:

- Work with compliance scan and security audit
- Before running `azqr` (compliance cli tool)
- Work with Azure best practices, Key Vault expiration check, expired certificates, and expiring secrets
- Work with orphaned resources and compliance assessment

## Example prompts

Try these prompts to activate this skill:

- "Run a compliance scan"
- "Security audit my Azure resources"
- "Check for expired certificates in Key Vault"
- "Find expiring secrets"
- "Detect orphaned resources"
- "Run Azure best practices assessment"
- "Check compliance before running azqr"
- "Find resources missing required policies"

## Related content

- [Azure Model Context Protocol (MCP) Server overview](/azure/developer/azure-mcp-server/overview)
- [Skill source code](https://github.com/microsoft/azure-skills/blob/main/skills/azure-compliance/SKILL.md)
- [Azure compliance offerings](/azure/compliance/)
- [Azure Policy overview](/azure/governance/policy/overview)
- [Azure Policy reference](/azure/governance/policy/)
- [Azure security fundamentals](/azure/security/fundamentals/overview)
