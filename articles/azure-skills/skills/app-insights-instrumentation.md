---
title: Azure skill for App Insights instrumentation
description: Guidance for instrumenting webapps with Azure Application Insights. Provides telemetry patterns, SDK setup, and configuration references.
ms.topic: reference
ms.date: 4/2/2026
author: diberry
ms.author: diberry
ms.service: azure-mcp-server
ms.custom: skill-version-1.0.2
---

# Azure skill for App Insights instrumentation

Guidance for instrumenting webapps with Azure Application Insights. Provides telemetry patterns, SDK setup, and configuration references.

**Skill:** `appinsights-instrumentation` | [Source code](https://github.com/microsoft/azure-skills/blob/main/skills/appinsights-instrumentation/SKILL.md)

## What it provides

This skill provides GitHub Copilot with specialized knowledge. Guidance for instrumenting webapps with Azure Application Insights. Provides telemetry patterns, SDK setup, and configuration references.

## Prerequisites

- **Azure subscription**: [Create a free account](https://azure.microsoft.com/free/) if you don't have one.
- **AI assistant with Azure Skills**: [GitHub Copilot for Azure](/azure/developer/github-copilot-azure/get-started), Visual Studio Code with [Azure MCP extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azure-mcp-server), Claude Code, or another [compatible MCP client](../install.md).
- **[PowerShell](/powershell/scripting/install/installing-powershell)** (v7.4+): Install with `winget install Microsoft.PowerShell`.
- **Azure CLI with Bicep** (v2.60.0+): [Install](/cli/azure/install-azure-cli), sign in with `az login`, then run `az bicep install`.

## When to use this skill

Use this skill when you need to:

- Work with App Insights SDK, telemetry patterns, Application Insights guidance, and instrumentation examples
- Work with Apm best practices

## Example prompts

Try these prompts to activate this skill:

- "Instrument my webapp to send telemetry to App Insights"
- "How do I instrument my app with Azure App Insights?"
- "Add AppInsights instrumentation to my web application"
- "Add App Insights instrumentation to my Node.js app"
- "Configure Application Insights for my Python webapp"
- "Set up telemetry monitoring in Azure"
- "Instrument my application to send data to App Insights"
- "Add observability to my Azure web application"
- "How to enable App Insights autoinstrumentation?"
- "Configure telemetry for my Azure App Service"

## Related content

- [Azure Model Context Protocol (MCP) Server overview](/azure/developer/azure-mcp-server/overview)
- [Skill source code](https://github.com/microsoft/azure-skills/blob/main/skills/appinsights-instrumentation/SKILL.md)

