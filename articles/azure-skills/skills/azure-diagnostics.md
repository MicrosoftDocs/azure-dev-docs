---
title: Azure skill for diagnostics
description: Debug Azure production issues on Azure using AppLens, Azure Monitor, resource health, and safe triage. Also covers App Service, Azure Functions, and Azure Messaging services including Event Hubs and Service Bus.
ms.topic: reference
ms.date: 5/26/2026
author: diberry
ms.author: diberry
ms.service: azure-mcp-server
ms.custom: skill-version-1.1.6
---

# Azure skill for diagnostics

Debug Azure production issues on Azure using AppLens, Azure Monitor, resource health, and safe triage. Also covers App Service, Azure Functions, and Azure Messaging services including Event Hubs and Service Bus.

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
- Troubleshoot App Service issues such as high CPU, deployment failures, crashes, slow responses, TLS, or custom domain problems
- Troubleshoot Azure Function Apps including invocation failures, timeouts, or binding errors
- Find the Application Insights or Log Analytics workspace linked to a Function App
- Troubleshoot Azure Messaging SDK issues such as Event Hubs or Service Bus connection failures, AMQP errors, or message lock issues

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
- "Troubleshoot App Service high CPU"
- "My App Service deployment is failing"
- "Troubleshoot my Azure Function App invocation failures"
- "My function app is timing out"
- "Find the App Insights workspace for my Function App"
- "My Event Hubs connection is failing"
- "Troubleshoot Service Bus dead letter queue"
- "I'm getting AMQP connection errors in my messaging SDK"

## Related content

- [Azure Model Context Protocol (MCP) Server overview](/azure/developer/azure-mcp-server/overview)
- [Skill source code](https://github.com/microsoft/azure-skills/blob/main/skills/azure-diagnostics/SKILL.md)

