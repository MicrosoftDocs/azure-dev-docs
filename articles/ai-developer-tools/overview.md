---
title: Azure AI developer tools overview
description: The Azure AI developer tools help you build, deploy, and manage Azure applications with natural language through GitHub Copilot for Azure, Azure MCP Server, and Azure Skills.
author: diberry
ms.author: diberry
ms.date: 04/02/2026
ms.topic: overview
ms.collection: ce-skilling-ai-copilot
ms.custom: build-2025
---

# Azure AI developer tools overview

The Azure AI developer tools are a collection of AI-powered tools that help you manage, deploy, and troubleshoot Azure resources by using natural language. The toolset includes GitHub Copilot for Azure, the Azure MCP Server, and Azure Skills. These tools work together across IDEs, terminals, and CI/CD pipelines.

## Why use Azure AI developer tools?

Building on Azure typically requires navigating portal UIs, reading documentation across multiple services, writing infrastructure-as-code templates, and debugging deployment issues. These tasks add friction before you write your first line of application code. This friction slows teams down and creates a steep learning curve, especially for developers new to Azure.

The Azure AI developer tools eliminate this friction by bringing Azure directly into your development workflow:

- **Reduce context switching** - Ask questions about Azure services, manage resources, and deploy applications without leaving your IDE or terminal.
- **Accelerate onboarding** - New team members can discover and use Azure services through natural language. They don't need to memorize CLI commands, portal navigation, or ARM/Bicep syntax.
- **Enforce best practices automatically** - Azure Skills embed guardrails and proven patterns into every workflow. Deployments follow organizational standards without manual review checklists.
- **Work where you already are** - Whether you use VS Code, Visual Studio, Cursor, IntelliJ, or a CLI, the Azure AI developer tools meet you in your existing environment.

## Key tools

| Tool | What it does | Best for |
|---|---|---|
| [GitHub Copilot for Azure](../github-copilot-azure/introduction.md) | Extension that surfaces Azure tools and skills through GitHub Copilot | Integrated IDE experience in VS Code or Visual Studio |
| [Azure MCP Server](../azure-mcp-server/overview.md) | Standalone MCP server with 270+ tools across 50+ Azure services and Microsoft Entra ID authentication | Azure tools in any MCP-compatible client |
| [Azure Skills](../azure-skills/overview.md) | Knowledge modules that provide end-to-end workflows with guardrails | Guided, best-practice Azure workflows |

## Choose the right tool

Use the following decision flow to determine which tool best fits your scenario.

1. **Are you using VS Code or Visual Studio?**
   - Yes → **[GitHub Copilot for Azure](../github-copilot-azure/introduction.md)** — Includes Azure MCP Server built-in.
   - No → Continue to step 2.

1. **Using another IDE (Cursor, IntelliJ, Windsurf)?**
   - Yes → **[Azure MCP Server](../azure-mcp-server/overview.md)** — Install the standalone MCP server.
   - No → Continue to step 3.

1. **Want end-to-end workflows with guardrails?**
   - Yes → **[Azure Skills](../azure-skills/overview.md)** — Available across multiple hosts including GitHub Copilot CLI, Claude Code, and VS Code.

## Supported development environments

| Environment | GitHub Copilot for Azure | Azure MCP Server | Azure Skills |
|---|---|---|---|
| VS Code | ✅ Extension + MCP Server | ✅ | ✅ |
| Visual Studio 2022 | ✅ Built-in (with Azure Workload) | ✅ | ❌ |
| Visual Studio 2026 | ✅ Built-in (with Azure Workload) | ✅ | ❌ |
| Cursor | ❌ | ✅ | ✅ |
| Windsurf | ❌ | ✅ | ✅ |
| IntelliJ | ❌ | ✅ | ✅ |
| GitHub Copilot CLI | ❌ | ✅ (via `/mcp add`) | ✅ |
| Claude Code | ❌ | ✅ | ✅ |

## Primary scenarios

All three tools — GitHub Copilot for Azure, Azure MCP Server, and Azure Skills — support most Azure development scenarios. The following table shows the recommended starting point for each scenario, but you can use any tool for any task.

| Scenario | Example prompts |
|---|---|
| Learn about Azure services | "What Azure services should I use with my app?" |
| Manage Azure resources | "List all my storage accounts" |
| Deploy an application | "Deploy my app to Azure" |
| Troubleshoot a failing app | "Why is my app returning 500 errors?" |
| Query resources across subscriptions | "Show me all VMs across my subscriptions" |
| Set up end-to-end deployment pipeline | "Prepare and deploy my Node.js app to Azure" |

## Related content

- [GitHub Copilot for Azure documentation](../github-copilot-azure/introduction.md)
- [Azure MCP Server documentation](../azure-mcp-server/overview.md)
- [Azure Skills documentation](../azure-skills/overview.md)
