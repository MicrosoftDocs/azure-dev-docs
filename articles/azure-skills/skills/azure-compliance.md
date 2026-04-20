---
title: Azure skill for compliance
description: Run Azure compliance and security audits with azqr plus Key Vault expiration checks. Covers best-practice assessment, resource review, policy/compliance validation, and security posture checks.
ms.topic: reference
ms.date: 4/2/2026
author: diberry
ms.author: diberry
ms.service: azure-mcp-server
ms.custom: skill-version-1.0.3
---

# Azure skill for compliance

Run Azure compliance and security audits with `azqr` plus Key Vault expiration checks. Covers best-practice assessment, resource review, policy/compliance validation, and security posture checks.

**Skill:** `azure-compliance` | [Source code](https://github.com/microsoft/azure-skills/blob/main/skills/azure-compliance/SKILL.md)

## What it provides

This skill provides GitHub Copilot with specialized knowledge. Run Azure compliance and security audits with `azqr` plus Key Vault expiration checks. Covers best-practice assessment, resource review, policy/compliance validation, and security posture checks.

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

- "Run `azqr` to check Azure compliance"
- "Check my Azure subscription for compliance issues"
- "Perform compliance assessment using Azure Quick Review"
- "Assess my Azure resources against best practices"
- "Review my Azure security posture"
- "Run compliance scan on my Azure subscription"
- "Identify orphaned resources in Azure"
- "Find resources that don't comply with best practices"
- "Show me expired certificates in my Key Vault"
- "Check what secrets are expiring in the next 30 days"

## Related content

- [Azure Model Context Protocol (MCP) Server overview](/azure/developer/azure-mcp-server/overview)
- [Skill source code](https://github.com/microsoft/azure-skills/blob/main/skills/azure-compliance/SKILL.md)

