---
title: Azure Monitor Tools 
description: Learn how to use the Azure MCP Server with Azure Monitor.
keywords: azure mcp server, azmcp, azure monitor, log analytics
author: diberry
ms.author: diberry
ms.date: 5/12/2025
ms.topic: reference
ms.custom: build-2025
--- 
# Azure Monitor tools for the Azure MCP Server

The Azure MCP Server allows you to manage Azure Monitor resources, including querying Log Analytics workspaces for operational insights.

[Azure Monitor](/azure/azure-monitor/overview) helps you maximize the availability and performance of your applications and services. It delivers a comprehensive solution for collecting, analyzing, and acting on telemetry from your cloud and on-premises environments.

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## Use existing server

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

## Develop new server

### List workspaces

The Azure MCP Server can list all Log Analytics workspaces in a subscription.

#### Reference

| Name            | Description               |
|-----------------|--------------------------|
| azmcp monitor workspace list | List Log Analytics workspaces in a subscription.|

```console
azmcp monitor workspace list \
    --subscription <SUBSCRIPTION_ID>
```

##### Required parameters

`--subscription`: The ID of the subscription to list Log Analytics workspaces from.

##### Optional parameters

[!INCLUDE [common-parameters](../includes/tools/common-parameters.md)]

##### JSON response

[!INCLUDE [JSON response](../includes/tools/response-format.md)]

#### Examples

List all Log Analytics workspaces in the specified subscription.

```console
azmcp monitor workspace list \
    --subscription "my-subscription-id"
```

### List tables

The Azure MCP Server can list all tables in a Log Analytics workspace.

#### Reference

| Name            | Description               |
|-----------------|--------------------------|
| azmcp monitor table list | List tables in a Log Analytics workspace.|

```console
azmcp monitor table list \
    --subscription <SUBSCRIPTION_ID> \
    --workspace <WORKSPACE_NAME> \
    --resource-group <RESOURCE_GROUP> \
    --table-type <TABLE_TYPE>
```

##### Required parameters

`--subscription`: The ID of the subscription containing the Log Analytics workspace.<br>
`--workspace`: The name of the Log Analytics workspace.<br>
`--resource-group`: The name of the resource group containing the workspace.<br>
`--table-type`: The type of tables to list (e.g., 'CustomLog', 'AzureMetrics').

##### Optional parameters

[!INCLUDE [common-parameters](../includes/tools/common-parameters.md)]

##### JSON response

[!INCLUDE [JSON response](../includes/tools/response-format.md)]

#### Examples

List all custom log tables in the specified Log Analytics workspace.

```console
azmcp monitor table list \
    --subscription "my-subscription-id" \
    --workspace "centralmonitoring" \
    --resource-group "monitoring-rg" \
    --table-type "CustomLog"
```

### Query logs

The Azure MCP Server can execute Kusto Query Language (KQL) queries against a Log Analytics workspace.

#### Reference

| Name            | Description               |
|-----------------|--------------------------|
| azmcp monitor log query | Query a Log Analytics workspace.|

```console
azmcp monitor log query \
    --subscription <SUBSCRIPTION_ID> \
    --workspace <WORKSPACE_NAME> \
    --resource-group <RESOURCE_GROUP> \
    --table-name <TABLE_NAME> \
    --query <QUERY> \
    [--hours <HOURS>] \
    [--limit <LIMIT>]
```

##### Required parameters

`--subscription`: The ID of the subscription containing the Log Analytics workspace.<br>
`--workspace`: The name of the Log Analytics workspace.<br>
`--resource-group`: The name of the resource group containing the workspace.<br>
`--table-name`: The name of the table to query.<br>
`--query`: The KQL query to execute.

##### Optional parameters

`--hours`: The number of hours of data to query. Default is 24.<br>
`--limit`: The maximum number of results to return. Default is 20.

[!INCLUDE [common-parameters](../includes/tools/common-parameters.md)]

##### JSON response

[!INCLUDE [JSON response](../includes/tools/response-format.md)]

#### Examples

Execute a simple query to retrieve recent logs.

```console
azmcp monitor log query \
    --subscription "my-subscription-id" \
    --workspace "centralmonitoring" \
    --resource-group "monitoring-rg" \
    --table-name "AppEvents" \
    --query "recent"
```

Execute a custom query to find errors in the last hour.

```console
azmcp monitor log query \
    --subscription "my-subscription-id" \
    --workspace "centralmonitoring" \
    --resource-group "monitoring-rg" \
    --table-name "AppEvents" \
    --query "where TimeGenerated > ago(1h) and Level == 'Error'" \
    --hours 1 \
    --limit 100
```



