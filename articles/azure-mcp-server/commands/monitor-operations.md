---
title: Azure Monitor Operations
description: Learn how to use the Azure MCP Server with Azure Monitor.
keywords:  azure mcp server, azmcp, monitor
author: diberry
ms.author: diberry
ms.date: 5/05/2025
ms.topic: reference
ms.custom: build-2025
---
<!-- This is the proposed command article template for the Azure MCP Server documentation -->
<!-- H1 will be <SERVICE-NAME> operations -->
# Azure Monitor operations

The Azure MCP Server allows you to manage Azure resources, including Azure Monitor logs and metrics.

<!-- Brief description of the service with link to the official documentation. -->

[Azure Monitor](/azure/azure-monitor/overview) helps you maximize the availability and performance of your applications and services. It delivers a comprehensive solution for collecting, analyzing, and acting on telemetry from your cloud and on-premises environments. Azure Monitor helps you understand how your applications are performing and proactively identifies issues affecting them and the resources they depend on.

[!INCLUDE [tip-about-params](./includes/commands/parameter-consideration.md)]

## List Log Analytics workspaces

The Azure MCP Server can list Log Analytics workspaces in a subscription. This is useful for quickly checking your monitoring resources.

<!-- the next subsection is for example prompts that would give the LLM a hint fort  -->
### Example prompts

Example prompts for using the Azure MCP Server with Azure Monitor.

<!-- create several examples for the reader that capture the intent -->
- **List workspaces**: "List all Log Analytics workspaces in my subscription."
- **Show workspaces**: "What Log Analytics workspaces do I have?"
- **Find workspaces**: "I need to see my Log Analytics resources"
- **Query workspaces**: "Can you show me all my monitoring workspaces?"
- **Check workspaces**: "Log Analytics workspaces in subscription abc123"

<!-- The command reference is for the tool command that will run by the MCP Server -->
### Command reference

The Azure MCP Server has commands to list Azure Monitor resources. Advanced users and automation tools use these commands.

| Name            | Description               |
|-----------------|--------------------------|
| azmcp monitor workspace list | List Log Analytics workspaces in a subscription.|

```console
azmcp monitor workspace list \
    --subscription <SUBSCRIPTION_ID>

```

#### Required parameters

- `--subscription`: The ID of the subscription to list Log Analytics workspaces from. This parameter is required.
 
#### Optional parameters

None

#### Examples

List all Log Analytics workspaces in the specified subscription.

```console
azmcp monitor workspace list \
    --subscription "my-subscription-id"
```

## List Log Analytics workspaces tables

List tables in a Log Analytics workspace.

### Example prompts

- **List tables**: "Show me all tables in my analytics workspace"
- **View tables**: "What tables are available in my Log Analytics workspace?"
- **Get table names**: "List tables in my monitoring workspace in the production resource group"
- **Check tables**: "Show me the tables in my security-logs workspace"
- **Find tables**: "What data tables does my application-insights workspace contain?"

### Command reference

The Azure MCP Server has commands to list Azure Monitor tables. 

| Name            | Description               |
|-----------------|--------------------------|
| azmcp monitor table list | List tables in a Log Analytics workspace.|

```console
azmcp monitor table list \
    --subscription <SUBSCRIPTION_ID> \
    --workspace <WORKSPACE> \
    --resource-group <RESOURCE_GROUP>
```

### Required parameters

- `--subscription`: The ID of the subscription to list Log Analytics workspaces from. This parameter is required.
- `--workspace`: The ID of the workspace.
- `--resource-group`: The name of the resource group.

#### Optional parameters

None

## Query log with Kusto Query Language (KQL)

The Azure MCP Server can run analytics queries on logs in a Log Analytics workspace. This allows you to analyze your application's telemetry data.

### Example prompts

- **Run query**: "Run this Kusto query 'Heartbeat | where TimeGenerated > ago(1h)' in my 'myworkspace' Log Analytics workspace."
- **Execute query**: "Execute 'AppRequests | where TimeGenerated > ago(1d) | where Success == false' in my workspace"
- **Get error logs**: "Find all errors in the 'AppEvents' table over the last 24 hours"
- **Query app logs**: "Query the 'AppTraces' table for traces with severity level 'Error' in the last hour"
- **Analyze logs**: "Analyze 'SigninLogs | where TimeGenerated > ago(7d) | where ResultType != 0' in contoso-workspace"

### Command reference

| Name            | Description               |
|-----------------|--------------------------|
| azmcp monitor logs query | Run a Kusto query on logs in a Log Analytics workspace.|

```console
azmcp monitor logs query \
    --subscription <SUBSCRIPTION_ID> \
    --workspace-name <WORKSPACE_NAME> \
    --table-name <TABLE_NAME> \
    --query <KQL_QUERY_STRING> \
    [--hours <HOURS>] \
    [--limit <LIMIT>]
```

#### Required parameters

- `--subscription`: The ID of the subscription containing the Log Analytics workspace.
- `--workspace-name`: The name of the Log Analytics workspace.
- `--table-name`: The Kusto table name.
- `--query`: The Kusto query to run.

#### Optional parameters

- `--hours`: The hours for which to query data.
- `--limit`: The maximum limit of records to return.

#### Examples

Run a query to check for heartbeats in the last hour.

```console
azmcp monitor logs query \
    --subscription "my-subscription-id" \
    --workspace-name "myworkspace" \
    --table "Heartbeat" \
    --query "| order by TimeGenerated desc" \
    --hours "1
```

Run a query to find failed requests in the last day.

```console
azmcp monitor logs query \
    --subscription "my-subscription-id" \
    --workspace-name "myworkspace" \
    --table "AppRequests" \
    --query "| order by TimeGenerated desc" \
    --hours "1"
    --limit "5"
```



