---
title: Azure skill for Kusto (Azure Data Explorer)
description: This skill queries and analyzes data in Azure Data Explorer (also called Kusto or ADX) using Kusto Query Language (KQL) to support log analytics, telemetry monitoring, and time-series analysis.
ms.topic: reference
ms.date: 4/2/2026
author: diberry
ms.author: diberry
ms.service: azure-mcp-server
ms.custom: skill-version-1.0.1
---

# Azure skill for Kusto (Data Explorer)

This skill queries and analyzes data in Azure Data Explorer (also called Kusto or ADX) using Kusto Query Language (KQL) to support log analytics, telemetry monitoring, and time-series analysis.

**Skill:** `azure-kusto` | [Source code](https://github.com/microsoft/azure-skills/blob/main/skills/azure-kusto/SKILL.md)

## What it provides

This skill provides GitHub Copilot with specialized knowledge. This skill queries and analyzes data in Azure Data Explorer (also called Kusto or ADX) using Kusto Query Language (KQL) to support log analytics, telemetry monitoring, and time-series analysis.

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

- "Query my Kusto database for events in the last hour"
- "Write a KQL query to analyze telemetry data from my ADX cluster"
- "Show me the schema for tables in my Azure Data Explorer cluster"
- "Analyze IoT sensor data for anomalies in the last 24 hours"
- "Create a time series chart of application logs from my Kusto database"
- "What tables are available in my Azure Data Explorer cluster?"
- "Aggregate request latency metrics by service using KQL"

## Related content

- [Azure Model Context Protocol (MCP) Server overview](/azure/developer/azure-mcp-server/overview)
- [Skill source code](https://github.com/microsoft/azure-skills/blob/main/skills/azure-kusto/SKILL.md)

