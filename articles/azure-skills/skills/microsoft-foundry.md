---
title: Azure skill for Microsoft Foundry
description: "Deploy, schedule, connect, evaluate, and manage Microsoft Foundry agents with Azure Developer CLI support, CI/CD, routines, Agent-to-Agent connections, and authentication guidance."
ms.topic: reference
ms.date: 07/18/2026
author: diberry
ms.author: diberry
ms.reviewer: anksinha, cearley, luechen, anchenyi, xiaofu.huang, jugonzales, vebudumu, swatdong
ms.service: azure-mcp-server
ms.custom: skill-version-1.1.97
ai-usage: ai-assisted
---

# Azure skill for Microsoft Foundry

This skill helps developers work with new and existing Microsoft Foundry projects and models. It covers model discovery and deployment, hosted and prompt agent development, routine scheduling, Agent-to-Agent (A2A) interoperability, evaluation workflows, production monitoring, and troubleshooting.

Deploy, schedule, connect, evaluate, and manage Microsoft Foundry agents end-to-end with Azure Developer CLI (`azd`) support, CI/CD, routines, A2A connections, and authentication guidance.

**Skill:** `microsoft-foundry` | [Source code](https://github.com/microsoft/azure-skills/blob/main/skills/microsoft-foundry/SKILL.md)

## What it provides

This skill provides GitHub Copilot with specialized knowledge for the Microsoft Foundry agent lifecycle. It covers model discovery and deployment, hosted and prompt agent development, routine scheduling, A2A interoperability, evaluation workflows, production monitoring, and troubleshooting.

## Prerequisites

- **Azure subscription**: [Create a free account](https://azure.microsoft.com/free/) if you don't have one.
- **Azure Developer CLI**: Install `azd` from [Install Azure Developer CLI](/azure/developer/azure-developer-cli/install-azd), then sign in with `azd auth login`.
- **Foundry `azd` extensions**: Install the required Foundry extensions for the workflow, such as `azure.ai.agents`, `azure.ai.projects`, `microsoft.foundry`, and `azure.ai.routines` for routines.
- **AI assistant with Azure Skills**: [GitHub Copilot for Azure](/azure/developer/github-copilot-azure/get-started), Visual Studio Code with [Azure MCP extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azure-mcp-server), Claude Code, or another [compatible MCP client](../install.md).

## When to use this skill

Use this skill when you need to:

- Create hosted agent applications by scaffolding from scratch, using an existing Foundry project or model, lifting existing agent code, or recovering from a failed quickstart (Microsoft Agent Framework, LangGraph, or custom frameworks in Python or C#).
- Create new hosted agent applications with Microsoft Agent Framework, LangGraph, or custom frameworks in Python or C#.
- Manage Foundry agents through `azd`, including scaffold, provision, deploy, run, invoke, and troubleshoot workflows.
- Deploy agents to Azure AI Foundry.
- Set up CI/CD deployment pipelines for hosted Foundry agents.
- Invoke and test agents (single-turn, multi-turn, or protocol-specific conversations).
- Schedule or event-trigger agents with routines (one-time timers, recurring cron schedules, GitHub issue triggers, custom external events, manual dispatch, enable or disable operations, and `azure.yaml` definitions).
- Build, deploy, and connect to hosted agents that support real-time voice and streaming.
- Expose a Foundry agent as an A2A endpoint so other agents can discover and call it.
- Create a remote A2A tool connection so one Foundry agent can call another A2A-compatible agent.
- Choose A2A authentication, including end-user Entra token pass-through with the `user-entra-token` auth type or the calling agent identity with the `agentic-identity` auth type.
- Evaluate agent performance (batch evaluation, continuous evaluation, prompt optimization, and CI/CD monitoring).
- Convert existing agents to optimization-ready versions for the Foundry Agent Optimization Service (FAOS).
- Fine-tune models on Azure AI Foundry, including dataset preparation and training runs.
- Create and manage evaluation datasets from production traces.
- Deploy models from the Foundry catalog with capacity discovery across regions.
- Set up Foundry infrastructure, including projects, resources, virtual network isolation, and AI Services provisioning.
- Manage RBAC permissions, quotas, and capacity for Foundry resources.
- Monitor agent performance in production (continuous evaluation and regression detection).
- Query traces, analyze latency and failures.
- Trace evaluation results back to the specific agent responses that caused them.
- Troubleshoot agent issues (view logs, query telemetry, diagnose failures).

## Example prompts

Try these prompts to activate this skill:

- "Deploy my agent to Azure AI Foundry."
- "Create a new hosted agent in Microsoft Foundry."
- "Set up a CI/CD pipeline for my Foundry hosted agent."
- "Schedule my Foundry agent to run every weekday morning."
- "Define a Foundry routine in azure.yaml."
- "Expose this hosted agent as an A2A endpoint."
- "Connect my hosted agent to another A2A-compatible agent."
- "Use end-user Entra token auth for an incoming A2A agent connection."
- "Evaluate agent performance using Foundry evaluators."
- "Optimize my agent instructions using FAOS."
- "Set up continuous evaluation monitoring for my agent."
- "Create an evaluation dataset from production traces."
- "Deploy a model from the Foundry catalog."
- "Set up a Foundry project with virtual network isolation."
- "Create an AI Services resource for my Foundry project."
- "Troubleshoot my hosted agent deployment failure."
- "How do I manage RBAC for my Foundry resources?"

## Related content

- [Azure Model Context Protocol (MCP) Server overview](/azure/developer/azure-mcp-server/overview)
- [Set up CI/CD for a hosted agent](/azure/ai-foundry/agents/quickstarts/set-up-cicd-hosted-agent?pivots=azd)
- [Agent-to-agent tool for Foundry agents](/azure/ai-foundry/agents/how-to/tools/agent-to-agent)
- [Skill source code](https://github.com/microsoft/azure-skills/blob/main/skills/microsoft-foundry/SKILL.md)
- [Microsoft Foundry](/azure/foundry/)
