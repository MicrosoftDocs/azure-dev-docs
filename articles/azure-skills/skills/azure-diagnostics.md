---
title: Azure skill for diagnostics
description: Debug Azure production issues on Azure using AppLens, Azure Monitor, resource health, and safe triage.
ms.topic: reference
ms.date: 4/2/2026
author: diberry
ms.author: diberry
ms.service: azure-mcp-server
ms.custom: skill-version-1.0.4
---

# Azure skill for diagnostics

Debug Azure production issues on Azure using AppLens, Azure Monitor, resource health, and safe triage.

**Skill:** `azure-diagnostics` | [Source code](https://github.com/microsoft/azure-skills/blob/main/skills/azure-diagnostics/SKILL.md)

## What it provides

This skill provides GitHub Copilot with specialized knowledge. Debug Azure production issues on Azure using AppLens, Azure Monitor, resource health, and safe triage.

## Prerequisites

- **Azure subscription**: [Create a free account](https://azure.microsoft.com/free/) if you don't have one.
- **AI assistant with Azure Skills**: [GitHub Copilot for Azure](/azure/developer/github-copilot-azure/get-started), Visual Studio Code with [Azure MCP extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azure-mcp-server), Claude Code, or another [compatible MCP client](../install.md).
- **Azure CLI** (v2.60.0+): [Install](/cli/azure/install-azure-cli) and sign in with `az login`.
- **Azure compute resources**: This skill supports Azure Container Apps, Azure Functions, Azure Kubernetes Service (AKS), and other Azure compute services.

## When to use this skill

Use this skill when you need to:

- Debug production issues in Azure
- Troubleshoot container apps in Azure
- Troubleshoot functions in Azure
- Troubleshoot AKS in Azure
- Work with kubectl can't connect, kube-system/CoreDNS failures, pod pending, and crashloop
- Work with node not ready
- Upgrade failures in Azure
- Analyze logs in Azure
- Work with insights, image pull failures, cold start issues, and health probe failures
- Work with resource health and root cause of errors

## Example prompts

Try these prompts to activate this skill:

- "Debug my Azure Container App"
- "Troubleshoot production issues in my container app"
- "Diagnose errors in my Azure service"
- "Help me troubleshoot container apps on Azure"
- "Analyze logs with KQL for my app"
- "How do I analyze application logs?"
- "View application logs for my container"
- "Fix image pull failures in Container Apps"
- "My container app has image pull errors"
- "Resolve cold start issues"

## Related content

- [Azure Model Context Protocol (MCP) Server overview](/azure/developer/azure-mcp-server/overview)
- [Skill source code](https://github.com/microsoft/azure-skills/blob/main/skills/azure-diagnostics/SKILL.md)

