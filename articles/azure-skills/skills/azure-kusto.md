---
title: Azure skill for Kusto (Azure Data Explorer)
description: Query and analyze data in Azure Data Explorer (Kusto/ADX) using KQL for log analytics, telemetry, and time series analysis.
ms.topic: reference
ms.date: 5/6/2026
author: diberry
ms.author: diberry
ms.service: azure-mcp-server
ms.custom: skill-version-1.1.1
ai-usage: ai-assisted
---

# Azure skill for Kusto (Data Explorer)

Execute KQL queries and manage Azure Data Explorer resources for fast, scalable big data analytics on log, telemetry, and time series data.

**Skill:** `azure-kusto` | [Source code](https://github.com/microsoft/azure-skills/blob/main/skills/azure-kusto/SKILL.md)

## What it provides

This skill provides GitHub Copilot with the ability to query and manage Azure Data Explorer (Kusto) resources. Key capabilities include:

- **Query execution**: Run KQL queries against massive datasets.
- **Schema exploration**: Discover tables, columns, and data types.
- **Resource management**: List clusters and databases.
- **Analytics**: Aggregations, time series, anomaly detection, machine learning.

## Prerequisites

- **Azure subscription**: [Create a free account](https://azure.microsoft.com/free/) if you don't have one.
- **AI assistant with Azure Skills**: [GitHub Copilot for Azure](/azure/developer/github-copilot-azure/get-started), Visual Studio Code with [Azure MCP extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azure-mcp-server), Claude Code, or another [compatible MCP client](../install.md).
- **Azure CLI** (v2.60.0+): [Install](/cli/azure/install-azure-cli) and sign in with `az login`.

## When to use this skill

Use this skill when you need to:

- Query data in Azure Data Explorer using KQL.
- Explore schemas and discover tables in a Kusto database.
- List Azure Data Explorer clusters and databases in your subscription.
- Analyze logs, telemetry, time series data, or IoT data.
- Perform aggregations, anomaly detection, or security analytics.

## MCP tools

This skill uses the following MCP tools:

| Tool | Purpose |
|------|---------|
| `kusto_cluster_list` | List all Azure Data Explorer clusters in a subscription. |
| `kusto_database_list` | List all databases in a specific Kusto cluster. |
| `kusto_query` | Execute KQL queries against a Kusto database. |
| `kusto_table_schema_get` | Retrieve schema information for a specific table. |

## Example prompts

Try these prompts to activate this skill:

- "Query my Kusto database for events in the last hour"
- "Show me events in the last hour from Azure Data Explorer"
- "Analyze logs in my ADX cluster"
- "Run a KQL query on my database"
- "What tables are in my Kusto database?"
- "Show me the schema for my events table"
- "List my Azure Data Explorer clusters"
- "Aggregate telemetry data by service"
- "Create a time series chart from my logs"

## Related content

- [Azure Model Context Protocol (MCP) Server overview](/azure/developer/azure-mcp-server/overview)
- [Skill source code](https://github.com/microsoft/azure-skills/blob/main/skills/azure-kusto/SKILL.md)

