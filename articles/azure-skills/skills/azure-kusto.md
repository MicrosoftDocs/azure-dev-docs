---
title: Azure Skill for Azure Kusto (Data Explorer)
description: The azure-kusto skill helps you write and optimize Kusto Query Language (KQL) queries for Azure Data Explorer (ADX) and Azure Monitor Log Analytics. Use it to analyze telemetry, build KQL queries, and manage ADX clusters.
author: diberry
ms.author: diberry
ms.reviewer: skaluvak
ms.date: 06/29/2026
ms.service: azure-mcp-server
ms.topic: reference
ms.custom:
  - devx-track-copilot-skills
ai-usage: ai-generated
ms.skillversion: "1.1.1"
---

# Azure skill for Azure Kusto (Data Explorer)

The `azure-kusto` skill helps you write and optimize KQL queries for Azure Data Explorer (ADX) and Azure Monitor Log Analytics. Use it to analyze telemetry, build complex queries with joins and aggregations, manage ADX clusters, and configure ingestion pipelines.

**Skill** `azure-kusto` | [Source code](https://github.com/microsoft/azure-skills/blob/main/skills/azure-kusto/SKILL.md)

## Prerequisites

- **Azure subscription**: [Create a free account](https://azure.microsoft.com/free/) if you don't have one.
- **AI assistant with Azure Skills**: [GitHub Copilot for Azure](/azure/developer/github-copilot-azure/get-started), Visual Studio Code with [Azure MCP extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azure-mcp-server), Claude Code, or another [compatible MCP client](../install.md).
- **Azure CLI** (v2.60.0+): [Install](/cli/azure/install-azure-cli) and sign in with `az login`.

## When to use this skill

Use this skill when you need to:

- Write KQL queries to analyze logs, telemetry data, and time-series information in Azure Data Explorer clusters.
- Perform log analytics, analyze time-series data from IoT devices, and detect anomalies.

## Example prompts

Try these prompts to activate this skill:

- "Query my Kusto database for [data pattern]."
- "Show me events in the last hour from Azure Data Explorer."
- "Analyze logs in my ADX cluster."
- "Run a KQL query on [database]."
- "What tables are in my Kusto database?"
- "Show me the schema for [table]."
- "List my Azure Data Explorer clusters."
- "Aggregate telemetry data by [dimension]."
- "Create a time series chart from my logs."

## Related content

- [Azure Model Context Protocol (MCP) Server overview](/azure/developer/azure-mcp-server/overview)
- [Skill source code](https://github.com/microsoft/azure-skills/blob/main/skills/azure-kusto/SKILL.md)
- [KQL quick reference](/azure/data-explorer/kusto/query/kql-quick-reference)
- [Azure Data Explorer overview](/azure/data-explorer/data-explorer-overview)
- [Azure Data Explorer pricing](https://azure.microsoft.com/pricing/details/data-explorer/)
- [Log Analytics tutorial](/azure/azure-monitor/logs/log-analytics-tutorial)
