---
title: Azure Skill for Azure Kusto Graph
description: Use the azure-kusto-graph skill to build and query Azure Data Explorer graphs with KQL operators for patterns, paths, components, and persistent models.
author: diberry
ms.author: diberry
ms.reviewer: skaluvak
ms.date: 09/02/2026
ms.service: azure-mcp-server
ms.topic: reference
ms.custom: [devx-track-copilot-skills, skill-version-1.2.0]
ai-usage: ai-generated
ms.skillversion: "1.2"
---

# Azure skill for Azure Kusto Graph

The `azure-kusto-graph` skill helps you build and query graphs from tabular data in Azure Data Explorer. Use it to turn source and target columns into graph relationships, analyze graph patterns and paths with Kusto Query Language (KQL), and choose between transient and persistent graph models.

**Skill** `azure-kusto-graph` | [Source code](https://github.com/microsoft/GitHub-Copilot-for-Azure/blob/main/plugins/azure-kusto-graph-skills/skills/azure-kusto-graph/SKILL.md)

This skill isn't a general natural-language-to-KQL converter. Use it with an existing KQL query or a request that maps directly to a known table and obvious columns.

## What it provides

You get guidance for the edges-first graph construction pattern and KQL graph operators, including `make-graph`, `graph-match`, `graph-shortest-paths`, `graph-mark-components`, and `graph-to-table`. The skill also explains persistent graph models and snapshots for reusable graph workloads.

## Prerequisites

- **Azure subscription**: [Create a free account](https://azure.microsoft.com/free/) if you don't have one.
- **AI assistant with Azure Skills**: [GitHub Copilot for Azure](/azure/developer/github-copilot-azure/get-started), Visual Studio Code with [Azure MCP extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azure-mcp-server), Claude Code, or another [compatible MCP client](../../install.md).
- **Azure Data Explorer access**: You need access to a cluster, database, and the tables you want to analyze.
- **Azure CLI** (v2.60.0+): [Install](/cli/azure/install-azure-cli) and sign in with `az login`.

## When to use this skill

Use this skill when you need to:

- Build a transient graph from tabular data with `make-graph`.
- Find relationship patterns with `graph-match`.
- Find shortest paths or connected components in a graph.
- Export graph nodes and edges back to tabular results.
- Create or query persistent graph models and snapshots.
- Convert an existing KQL result into an edges-first graph structure.

## Example prompts

Try these prompts to activate this skill:

- "Build a graph from this KQL query."
- "Find the shortest path between these two nodes."
- "Show connected components in my network data."
- "Match users that authenticated to the same host."
- "Export this graph's nodes and edges as tables."
- "Should I use a transient or persistent graph for this workload?"

## Related content

- [Azure skill for Azure Kusto (Data Explorer)](../../skills/azure-kusto.md)
- [Azure skill for Azure Kusto IRQL](azure-kusto-irql.md)
- [Azure skill for Azure Kusto IRQL Graph](azure-kusto-irql-graph.md)
- [Azure Data Explorer graph semantics overview](/kusto/query/graph-semantics-overview)
- [Azure Model Context Protocol (MCP) Server overview](/azure/developer/azure-mcp-server/overview)
- [Skill source code](https://github.com/microsoft/GitHub-Copilot-for-Azure/blob/main/plugins/azure-kusto-graph-skills/skills/azure-kusto-graph/SKILL.md)
