---
title: Azure Monitor Tools 
description: Learn how to use the Azure MCP Server with Azure Monitor.
keywords: azure mcp server, azmcp, azure monitor, log analytics
author: diberry
ms.author: diberry
ms.date: 05/14/2025
content_well_notification: 
  - AI-contribution
ai-usage: ai-assisted
ms.topic: reference
ms.custom: build-2025
--- 
# Azure Monitor tools for the Azure MCP Server

The Azure MCP Server allows you to manage Azure Monitor resources, including querying Log Analytics workspaces for operational insights.

[Azure Monitor](/azure/azure-monitor/overview) helps you maximize the availability and performance of your applications and services. It delivers a comprehensive solution for collecting, analyzing, and acting on telemetry from your cloud and on-premises environments.

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## Use MCP server for Azure Monitor

This section explains how to interact with Azure Monitor services using natural language prompts with the Azure MCP Server. You can query Log Analytics workspaces, analyze operational data, and gain insights into your Azure resources without needing to know complex KQL syntax.

### List workspaces

The Azure MCP Server can list all Log Analytics workspaces in a subscription. This provides an overview of your monitoring resources.

**Example prompts** include:

- **List workspaces**: "Show me all Log Analytics workspaces in my subscription."
- **View workspaces**: "What Log Analytics workspaces do I have?"
- **Find workspaces**: "List my monitoring workspaces"
- **Query workspaces**: "Show all Log Analytics workspaces"
- **Check workspaces**: "Get all monitoring workspaces in subscription abc123"

### List tables

The Azure MCP Server can list all tables in a Log Analytics workspace. This helps you understand the data available for querying.

**Example prompts** include:

- **List tables**: "Show me all tables in my 'centralmonitoring' Log Analytics workspace."
- **View tables**: "What tables do I have in Log Analytics workspace 'app-monitoring'?"
- **Find tables**: "List all tables in my workspace 'security-logs'"
- **Query tables**: "Show available tables in my Log Analytics workspace"
- **Check tables**: "Get all log tables in my 'operations' workspace"

### Query logs

The Azure MCP Server can execute Kusto Query Language (KQL) queries against a Log Analytics workspace. This powerful feature allows you to analyze your operational data.

**Example prompts** include:

- **Simple query**: "Query all error events from the last hour in my 'centralmonitoring' workspace"
- **Filter query**: "Find all failed login attempts in the SecurityEvent table"
- **Complex query**: "Show me the CPU usage trend for my web servers over the last 24 hours"
- **Join query**: "Query errors and correlate them with performance metrics"
- **Aggregation query**: "Count errors by application in my monitoring workspace"
