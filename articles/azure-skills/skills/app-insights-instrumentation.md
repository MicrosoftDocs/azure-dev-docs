---
title: Azure skill for App Insights Instrumentation
description: The app-insights-instrumentation skill helps you instrument web applications to send telemetry to Azure Application Insights and Azure Monitor. Use it to add SDKs, configure connection strings, set up custom events, and diagnose telemetry gaps.
ms.topic: reference
ms.date: 06/22/2026
author: diberry
ms.author: diberry
ms.reviewer: chuye
ms.service: azure-mcp-server
ms.custom: devx-track-copilot-skills
ms.skillversion: 1.0.2
ai-usage: ai-generated
---

# Azure skill for App Insights Instrumentation

The `app-insights-instrumentation` skill helps you instrument web applications to send telemetry to Azure Application Insights and Azure Monitor. Use it to add Application Insights SDKs, configure connection strings, set up custom events and metrics, and diagnose telemetry collection gaps.

**Skill** `appinsights-instrumentation` | [Source code](https://github.com/microsoft/azure-skills/blob/main/skills/appinsights-instrumentation/SKILL.md)

## What it provides

You get step-by-step instrumentation guidance for adding Application Insights SDKs to web applications, configuring connection strings and telemetry channels, setting up custom events and metrics, and ensuring telemetry flows correctly to Azure Monitor. Covers ASP.NET, Node.js, Python, and Java applications.

## Prerequisites

- **Azure subscription**: [Create a free account](https://azure.microsoft.com/free/) if you don't have one.
- **AI assistant with Azure Skills**: [GitHub Copilot for Azure](/azure/developer/github-copilot-azure/get-started), Visual Studio Code with [Azure MCP extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azure-mcp-server), Claude Code, or another [compatible MCP client](../install.md).
- **[PowerShell](/powershell/scripting/install/installing-powershell)** (v7.4+): Install with `winget install Microsoft.PowerShell`.
- **Azure CLI with Bicep** (v2.60.0+): [Install](/cli/azure/install-azure-cli), sign in with `az login`, then run `az bicep install`.
- Azure Application Insights resource, Azure Monitor workspace or application source code (ASP.NET, Node.js, Python, or Java).

## When to use this skill

Use this skill when you need to:

- Work with App Insights SDK, telemetry patterns, Application Insights guidance, and instrumentation examples
- Work with APM best practices

## Example prompts

Try these prompts to activate this skill:

- "How do I instrument my app with App Insights?"
- "Add the App Insights SDK to my project"
- "Show me telemetry patterns"
- "What is Application Insights?"
- "Application Insights guidance for my Node.js app"
- "Instrumentation examples for ASP.NET"
- "APM best practices for Azure Monitor"

## Related content

- [Azure Model Context Protocol (MCP) Server overview](/azure/developer/azure-mcp-server/overview)
- [Skill source code](https://github.com/microsoft/azure-skills/blob/main/skills/appinsights-instrumentation/SKILL.md)
- [Application Insights overview](/azure/azure-monitor/app/app-insights-overview)
- [Application Insights SDK instrumentation](/azure/azure-monitor/app/asp-net)
- [Creating and configuring Application Insights resources](/azure/azure-monitor/app/application-insights-faq#creating-and-configuring-application-insights-resources)
