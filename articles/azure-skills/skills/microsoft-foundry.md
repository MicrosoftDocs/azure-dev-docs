---
title: Azure skill for Microsoft Foundry
description: "Deploy, evaluate, and manage Foundry agents end-to-end: Docker build, ACR push, hosted/prompt agent create, container start, batch eval, continuous eval, prompt optimizer workflows, agent.yaml, dataset curation from traces."
ms.topic: reference
ms.date: 5/15/2026
author: diberry
ms.author: diberry
ms.service: azure-mcp-server
ms.custom: skill-version-1.1.13
ai-usage: ai-assisted
---

# Azure skill for Microsoft Foundry

Deploy, evaluate, and manage Foundry agents end-to-end: Docker build, ACR push, hosted/prompt agent create, container start, batch eval, continuous eval, prompt optimizer workflows, agent.yaml, dataset curation from traces.

**Skill:** `microsoft-foundry` | [Source code](https://github.com/microsoft/azure-skills/blob/main/skills/microsoft-foundry/SKILL.md)

## What it provides

This skill provides GitHub Copilot with specialized knowledge for the complete Microsoft Foundry agent lifecycle — covering model discovery and deployment, complete dev lifecycle of AI agents, evaluation workflows, and troubleshooting. The skill requires the Azure MCP `foundry` tool as its entry point for all Foundry-related MCP operations.

## Prerequisites

- **Azure subscription**: [Create a free account](https://azure.microsoft.com/free/) if you don't have one.
- **AI assistant with Azure Skills**: [GitHub Copilot for Azure](/azure/developer/github-copilot-azure/get-started), Visual Studio Code with [Azure MCP extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azure-mcp-server), Claude Code, or another [compatible MCP client](../install.md).
- **Azure MCP `foundry` tool**: Required entry point for Foundry-related MCP operations.

## When to use this skill

Use this skill when you need to:

- Create new hosted agent applications (Microsoft Agent Framework, LangGraph, or custom frameworks in Python or C#).
- Deploy agents to Azure AI Foundry (Docker build, ACR push, container start).
- Invoke and test agents (single or multi-turn conversations).
- Evaluate agent performance (batch eval, continuous eval, prompt optimization).
- Convert existing agents to optimization-ready versions for the Foundry Agent Optimization Service (FAOS).
- Create and manage evaluation datasets from production traces, including dataset versioning and eval trending.
- Deploy models from the Foundry catalog with capacity discovery across regions.
- Set up Foundry infrastructure (projects, resources, VNet isolation, AI Services provisioning).
- Manage RBAC permissions, quotas, and capacity for Foundry resources.
- Monitor agent performance in production (continuous evaluation and regression detection).
- Query traces, analyze latency and failures.
- Troubleshoot agent issues (view logs, query telemetry, diagnose failures).

## Example prompts

Try these prompts to activate this skill:

- "Deploy my agent to Azure AI Foundry"
- "Create a new hosted agent in Microsoft Foundry"
- "Evaluate agent performance using Foundry evaluators"
- "Optimize my agent instructions using FAOS"
- "Set up continuous evaluation monitoring for my agent"
- "Create an evaluation dataset from production traces"
- "Deploy a model from the Foundry catalog"
- "Set up a Foundry project with VNet isolation"
- "Create an AI Services resource for my Foundry project"
- "Troubleshoot my hosted agent deployment failure"
- "How do I manage RBAC for my Foundry resources?"

## Related content

- [Azure Model Context Protocol (MCP) Server overview](/azure/developer/azure-mcp-server/overview)
- [Skill source code](https://github.com/microsoft/azure-skills/blob/main/skills/microsoft-foundry/SKILL.md)

