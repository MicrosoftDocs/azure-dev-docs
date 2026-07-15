---
title: Azure Skill for Azure Resource Visualizer
description: The azure-resource-visualizer skill helps you generate Mermaid architecture diagrams from Azure resource groups. Use it to visualize resource topology, discover dependencies, assess deployment impact, and understand your Azure architecture.
author: diberry
ms.author: diberry
ms.reviewer: tomescht
ms.date: 06/15/2026
ms.service: azure-mcp-server
ms.topic: reference
ms.custom:
  - devx-track-copilot-skills
ai-usage: ai-generated
ms.skillversion: "1.1.2"
---

# Azure skill for Azure Resource Visualizer

The `azure-resource-visualizer` skill helps you generate Mermaid architecture diagrams from Azure resource groups. Use it to visualize resource topology, discover dependencies, assess deployment change impact, and understand your current Azure architecture.

**Skill** `azure-resource-visualizer` | [Source code](https://github.com/microsoft/azure-skills/blob/main/skills/azure-resource-visualizer/SKILL.md)

## What it provides

You get Mermaid diagram generation for Azure resource groups, showing resource topology, network connections, and service dependencies. Visualize how resources relate, assess the impact of planned changes, and produce architecture diagrams for documentation or review.

## Prerequisites

- **Azure subscription**: [Create a free account](https://azure.microsoft.com/free/) if you don't have one.
- **AI assistant with Azure Skills**: [GitHub Copilot for Azure](/azure/developer/github-copilot-azure/get-started), Visual Studio Code with [Azure MCP extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azure-mcp-server), Claude Code, or another [compatible MCP client](../install.md).
- **Azure CLI** (v2.60.0+): [Install](/cli/azure/install-azure-cli) and sign in with `az login`.

## When to use this skill

Use this skill when you need to:

- Resource Group Discovery: List available resource groups when not specified
- Deep Resource Analysis: Examine all resources, their configurations, and interdependencies
- Relationship Mapping: Identify and document all connections between resources
- Diagram Generation: Create detailed, accurate Mermaid diagrams
- Resource Documentation Creation: Produce clear markdown files with embedded diagrams

## Example prompts

Try these prompts to activate this skill:

- "Create an architecture diagram"
- "Visualize my Azure resources"
- "Show resource relationships"
- "Generate a Mermaid diagram for my resource group"
- "Analyze my resource group"
- "Diagram my resources"
- "Show resource topology"
- "Map my Azure infrastructure"

## Related content

- [Azure Model Context Protocol (MCP) Server overview](/azure/developer/azure-mcp-server/overview)
- [Skill source code](https://github.com/microsoft/azure-skills/blob/main/skills/azure-resource-visualizer/SKILL.md)
- [Azure Resource Graph Explorer](/azure/governance/resource-graph/first-query-portal)
- [Visualize Azure resources](/azure/azure-resource-manager/management/resource-graph-samples)
- [Azure topology visualization](/azure/network-watcher/network-insights-topology)
