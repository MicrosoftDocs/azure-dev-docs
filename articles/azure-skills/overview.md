---
title: What is Azure Skills?
description: Learn how the Azure Skills marketplace combines a core Azure plugin with specialized plugins for focused Azure scenarios.
author: yunjchoi
ms.author: yunjchoi
ms.service: azure-mcp-server
ms.topic: overview
ms.date: 10/05/2026
ai-usage: ai-generated

#customer intent: As a developer, I want to understand the Azure Skills plugin model so that I can install the capabilities that match my Azure tasks.

---

# What is Azure Skills?

Azure Skills are agent skills that extend your AI coding assistant with Azure-specific domain knowledge and workflows. The [Azure Skills repository](https://github.com/microsoft/azure-skills) is a plugin marketplace that includes the core Azure Skills plugin and specialized plugins for focused scenarios.

## Azure Skills in Visual Studio Code

The following demonstration shows Azure Skills in action inside Visual Studio Code. A developer uses natural language in the Copilot chat panel to interact with Azure services — no portal, no CLI commands, no context switching.

:::image type="content" source="media/azure-skills-visual-studio-code-demonstration.gif" alt-text="Animated demonstration of Azure Skills running in Visual Studio Code, showing a developer using natural language to interact with Azure services through the Copilot chat panel." lightbox="media/azure-skills-visual-studio-code-demonstration.gif":::

Azure Skills give your AI assistant the ability to manage resources, deploy applications, and monitor services directly from your development environment.

Work with Azure without switching between tools, context windows, or documentation tabs. Ask your AI assistant to build, validate, deploy, troubleshoot, or optimize, and it applies the installed skills and tools to the task.

## How the plugin model works

The Azure Skills marketplace separates broad Azure capabilities from focused scenario packages:

| Component | Purpose |
| --- | --- |
| **Azure Skills marketplace** | The `microsoft/azure-skills` repository that compatible hosts register to find Azure plugins. |
| **Azure Skills plugin (core)** | The `azure` plugin, which provides broad Azure workflows, Azure MCP integration, and skill discovery. |
| **Specialized plugins** | Independently installable plugins for focused scenarios, such as Azure cost management, Azure Local, Kusto graph analysis, and Foundry IQ. |
| **Skills** | Workflow instructions and guardrails packaged inside a plugin. |
| **MCP servers and tools** | Execution capabilities that let a plugin inspect or change supported services and resources. |

The core plugin uses the [Azure MCP Server](../azure-mcp-server/overview.md) to interact with Azure services. Specialized plugins can include their own skills, MCP configuration, prerequisites, and safety requirements.

## Choose discovery or direct installation

Start with the core `azure` plugin when you work across Azure scenarios or don't know which skill you need. Its `discover-azure-skills` skill searches the Azure Skills catalog, matches your task to relevant skills, and provides installation guidance for their owning plugins.

Install a specialized plugin directly when you already know the scenario you need or want its capabilities available without relying on discovery. For example, install `azure-cost` for cost analysis and optimization workflows.

Installing the core plugin doesn't install every specialized plugin. You control which focused capabilities are available in your environment. For the current plugin list and installation commands, see the [Azure plugin catalog](plugins/index.md).

## The prepare, validate, and deploy workflow

The core Azure Skills plugin includes a three-step workflow designed to prevent errors and support safe deployments.

When you ask your AI assistant to prepare an application for Azure, it:

1. Analyzes your codebase.
1. Creates a detailed deployment plan.
1. Generates infrastructure as code.
1. Validates the setup.
1. Deploys your app to Azure.

All without you leaving your editor.

| Step | Skill | What happens |
|------|-------|--------------|
| **Plan** | `azure-prepare` | Your assistant analyzes your app, creates `.azure/plan.md` with deployment strategy, and waits for your approval before proceeding. |
| **Check** | `azure-validate` | Validates the plan before deployment. Runs configuration checks, permission verification, and infrastructure validation. |
| **Deploy** | `azure-deploy` | Executes the deployment. Runs provisioning, infrastructure deployment, and application setup. |

This structured approach keeps deployments safe and auditable. You always review the plan before anything happens in Azure.

## Related content

- [Install and configure Azure Skills](install.md) - Set up the marketplace, install plugins, and configure authentication.
- [Azure plugin catalog](plugins/index.md) - Compare the core and specialized plugins.
- [Get started with Azure Skills](quickstart.md) - Complete a prepare, validate, and deploy workflow.
- [Azure MCP Server](../azure-mcp-server/overview.md) - Learn about the tools that support Azure resource operations.
