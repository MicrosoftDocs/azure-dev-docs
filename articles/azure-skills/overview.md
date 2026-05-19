---
title: What is Azure Skills?
description: Connect your AI assistant to Azure to manage resources, deploy apps, and monitor services without leaving your editor.
author: diberry
ms.author: diberry
ms.service: azure-mcp-server
ms.topic: overview
ms.date: 03/16/2026

#customer intent: As a developer, I want to use AI to manage Azure resources from my editor so that I can deploy and monitor applications without context switching.

---

# What is Azure Skills?

Azure Skills are agent skills that extend your AI coding assistant with Azure-specific domain knowledge and specialized workflows. They give your assistant the ability to manage resources, deploy applications, and monitor services directly from your development environment.

## Azure Skills in Visual Studio Code

The following demonstration shows Azure Skills in action inside Visual Studio Code. A developer uses natural language in the Copilot chat panel to interact with Azure services — no portal, no CLI commands, no context switching.

:::image type="content" source="media/azure-skills-visual-studio-code-demonstration.gif" alt-text="Animated demonstration of Azure Skills running in Visual Studio Code, showing a developer using natural language to interact with Azure services through the Copilot chat panel." lightbox="media/azure-skills-visual-studio-code-demonstration.gif":::

**Azure Skills** are agent skills that extend Azure-specific domain knowledge and specialized workflows for your coding agent. Azure Skills gives your AI assistant the ability to manage resources, deploy applications, and monitor services directly from your development environment.

Work with Azure without switching between tools, context windows, or documentation tabs. Ask your AI assistant to build, validate, and deploy, and it handles the Azure operations for you. Azure Skills uses the [Azure MCP Server](../azure-mcp-server/overview.md) to provide your AI assistant with tools to interact with 40+ Azure services. Skills layer high-level workflows on top of those tools.

Traditional Azure workflows require context-switching between your editor, the Azure portal, and documentation while learning CLI commands and running validation steps manually. **Azure Skills** eliminates this friction. Your AI assistant becomes a full Azure development partner, understanding your application architecture and executing Azure operations at your direction.

## The prepare, validate, and deploy workflow

Azure Skills follow a three-step workflow designed to prevent errors and ensure safe deployments.

When you ask your AI assistant to prepare an application for Azure, it:
1. Analyzes your codebase
2. Creates a detailed deployment plan
3. Generates infrastructure-as-code
4. Validates the setup
5. Deploys your app to Azure

All without you leaving your editor.

| Step | Skill | What happens |
|------|-------|--------------|
| **Plan** | `azure-prepare` | Your assistant analyzes your app, creates `.azure/plan.md` with deployment strategy, and waits for your approval before proceeding. |
| **Check** | `azure-validate` | Validates the plan before deployment. Runs configuration checks, permission verification, and infrastructure validation. |
| **Deploy** | `azure-deploy` | Executes the deployment. Runs provisioning, infrastructure deployment, and application setup. |

This structured approach keeps deployments safe and auditable. You always review the plan before anything happens in Azure.

## Related content

- [Install and configure Azure Skills](install.md) — Detailed setup instructions and authentication options.
- [Get started with Azure Skills](quickstart.md) — Hands-on walkthrough for your first deployment.
- [Azure Skills reference](skills/azure-deploy.md) — Full documentation of all skills and their capabilities.
- [Azure MCP Server](../azure-mcp-server/overview.md) — Technical documentation for the underlying Azure integration.
