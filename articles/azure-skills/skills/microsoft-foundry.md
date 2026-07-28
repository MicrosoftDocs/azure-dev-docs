---
title: Azure Skill for Microsoft Foundry
description: "Build, deploy, evaluate, and fine-tune AI agents on Microsoft Foundry. Supports the full agent lifecycle: creation, testing, optimization, model fine-tuning, and infrastructure management."
author: diberry
ms.author: diberry
ms.date: 7/13/2026
ms.service: azure-mcp-server
ms.topic: reference
ms.custom:
  - "skill-version-1.1.82"
ai-usage: ai-assisted
ms.reviewer: anksinha, cearley, luechen, anchenyi, xiaofhua, jugonzales, vebudumu 
---

# Azure skill for Microsoft Foundry

This skill helps developers work with new and existing Microsoft Foundry projects and models. It covers model discovery and deployment, the complete development lifecycle of AI agents, evaluation workflows, and troubleshooting.

**Skill:** `microsoft-foundry` | [Source code](https://github.com/microsoft/azure-skills/blob/main/skills/microsoft-foundry/SKILL.md)

## Prerequisites

- **Azure subscription**: [Create a free account](https://azure.microsoft.com/free/) if you don't have one.
- **AI assistant with Azure Skills**: [GitHub Copilot for Azure](/azure/developer/github-copilot-azure/get-started), Visual Studio Code with [Azure MCP extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azure-mcp-server), Claude Code, or another [compatible MCP client](../install.md).

## When to use this skill

Use this skill when you need to:

- Create hosted agent applications by scaffolding from scratch, using an existing Foundry project or model, lifting existing agent code, or recovering from a failed quickstart (Microsoft Agent Framework, LangGraph, or custom frameworks in Python or C#).
- Deploy agents to Azure AI Foundry.
- Invoke and test agents (single or multistep conversations).
- Schedule or event-trigger agents with routines (timer, recurring cron schedule, GitHub issue, or custom event).
- Build, deploy, and connect to hosted agents that support real-time voice and streaming.
- Evaluate agent performance (batch eval, continuous eval, prompt optimization).
- Convert existing agents to optimization-ready versions for the Foundry Agent Optimization Service (FAOS).
- Fine-tune models on Azure AI Foundry, including dataset preparation and training runs.
- Create and manage evaluation datasets from production traces.
- Deploy models from the Foundry catalog with capacity discovery across regions.
- Set up Foundry infrastructure (projects, resources, VNet isolation, AI Services provisioning).
- Manage RBAC permissions, quotas, and capacity for Foundry resources.
- Monitor agent performance in production (continuous evaluation and regression detection).
- Query traces, analyze latency and failures.
- Trace evaluation results back to the specific agent responses that caused them.
- Troubleshoot agent issues (view logs, query telemetry, diagnose failures).

## Example prompts

Try these prompts to activate this skill:

- "Deploy my agent to Azure AI Foundry"
- "Create a new hosted agent in Microsoft Foundry"
- "Evaluate agent performance using Foundry evaluators"
- "Schedule my agent to run on a timer"
- "Create a routine to trigger my agent from GitHub issues"
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
- [Microsoft Foundry](/azure/foundry/)
