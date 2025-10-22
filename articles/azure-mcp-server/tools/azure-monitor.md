---
title: Azure Monitor Tools 
description: "Use the Azure MCP Server with Azure Monitor to query Log Analytics workspaces, analyze metrics, and manage workbooks using natural language prompts."
keywords: azure mcp server, azmcp, azure monitor, log analytics
author: diberry
ms.author: diberry
ms.date: 10/16/2025
content_well_notification: 
  - AI-contribution
ai-usage: ai-assisted
ms.topic: reference
ms.custom: build-2025
--- 
# Azure Monitor tools for the Azure MCP Server

The Azure MCP Server allows you to manage Azure Monitor resources using natural language prompts. You can query Log Analytics workspaces, analyze operational data, monitor resource health, retrieve performance metrics, and manage Azure Monitor workbooks without needing to know complex KQL syntax.

[Azure Monitor](/azure/azure-monitor/overview) helps you maximize the availability and performance of your applications and services. It provides a comprehensive solution for collecting, analyzing, and acting on telemetry from your cloud and on-premises environments.

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]


## Log Analytics: List workspaces

The Azure MCP Server lists all Log Analytics workspaces in a subscription. This provides an overview of your monitoring resources.

Example prompts include:

- **List workspaces**: "Show me all Log Analytics workspaces in my subscription."
- **View workspaces**: "What workspaces do I have?"
- **Find workspaces**: "List monitoring workspaces."

## Log Analytics: List table types

Lists available table types in a Log Analytics workspace. 

Example prompts include:

- **List table types**: "Show me table types in the centralmonitoring workspace."
- **View available types**: "What table types are available in my Log Analytics workspace?"
- **Find table categories**: "List table types for security-logs workspace."

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Workspace** | Required | The Log Analytics workspace ID or name. This can be either the unique identifier (GUID) or the display name of your workspace. |

## Log Analytics: List tables

The Azure MCP Server lists all tables in a Log Analytics workspace. This helps you understand the data available for querying.

Example prompts include:

- **List tables**: "Show tables in centralmonitoring workspace."
- **View tables**: "What tables are in workspace app-monitoring?"
- **Find tables**: "List tables in security-logs workspace."

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Workspace** | Required | The Log Analytics workspace ID or name. |

## Log Analytics: Query workspace logs

The Azure MCP Server can execute Kusto Query Language (KQL) queries against a Log Analytics workspace. This powerful feature allows you to analyze your operational data.

Example prompts include:

- **Simple query**: "Query errors from last hour."
- **Filter query**: "Find failed login attempts in SecurityEvent table."
- **Complex query**: "Show CPU usage trend for web servers last 24 hours."

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Workspace** | Required | The Log Analytics workspace ID or name. |
| **Table** | Required | The name of the table to query. |
| **Query** | Required | The KQL query to execute against the Log Analytics workspace. |
| **Hours** | Optional | The number of hours to query back from now. |
| **Limit** | Optional | The maximum number of results to return. |

## Log Analytics: Query resource logs

Queries diagnostic and activity logs for a specific Azure resource in a Log Analytics workspace using Kusto Query Language (KQL). 

Example prompts include:

- **Query recent logs**: "Show recent logs for resource /subscriptions/abc123/resourceGroups/prod/providers/Microsoft.Web/sites/myapp."
- **Find errors**: "Query errors for my web app resource in the last 4 hours."
- **Resource diagnostics**: "Show diagnostic logs for storage account resource with limit 100."

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Resource ID** | Required | The Azure Resource ID to query logs. Example: `/subscriptions/<YOUR-SUBSCRIPTION-ID>/resourceGroups/<YOUR-RESOURCE-GROUP>/providers/Microsoft.OperationalInsights/workspaces/<YOUR-WORKSPACE>`. |
| **Table** | Required | The name of the table to query. This is the specific table within the workspace. |
| **Query** | Required | The KQL query to execute against the Log Analytics workspace. You can use predefined queries by name such as `recent` which shows most recent logs ordered by TimeGenerated and `errors` which shows error-level logs ordered by TimeGenerated. Otherwise, provide a custom KQL query. |
| **Hours** | Optional | The number of hours to query back from now. |
| **Limit** | Optional | The maximum number of results to return. |


## Health: Get entity health

The Azure MCP Server gets the health status of an entity using Azure Monitor health models. This provides comprehensive health information and monitoring status for Azure resources and applications.

Example prompts include:

- **Check entity health**: "Get health for app-prod-001 with webapp-health model."
- **Monitor resource health**: "What's the health of web-app-prod using application-model?"
- **Check system status**: "Get health info for sql-prod database entity."

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Model** | Required | The name of the health model. |
| **Entity** | Required | The entity ID to get health for. |

## Metrics: Query metrics

The Azure MCP Server queries Azure Monitor metrics for resources. This allows you to retrieve performance metrics, usage statistics, and monitoring data for your Azure resources over specified time periods.

Example prompts include:

- **Query VM metrics**: "Get CPU and memory for prod-vm01 from January 1 to January 2."
- **Query storage metrics**: "Show transaction metrics for mystorageaccount in storage group."
- **Query app metrics**: "Get response time for mywebapp last 24 hours."


| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Resource** | Required | The name of the resource to query metrics for. |
| **Metric namespace** | Required | The metric namespace. |
| **Metrics** | Required | The metric names to query. |
| **Resource type** | Optional | The type of the resource. |
| **Start time** | Optional | The start time for the query. |
| **End time** | Optional | The end time for the query. |
| **Interval** | Optional | The interval for aggregation. |
| **Aggregation** | Optional | The aggregation method. |
| **Filter** | Optional | Filter for the metrics query. |
| **Max buckets** | Optional | Maximum number of buckets. |

## Metrics: List metric definitions

The Azure MCP Server lists available metric definitions for a resource. This helps you discover what metrics are available for monitoring before querying specific metric data.

Example prompts include:

- **List storage metrics**: "Show metrics for mystorageaccount."
- **Find transaction metrics**: "Find transaction metrics for storageacct."
- **List VM metrics**: "List metrics for prod-vm in production group."

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Resource name** | Required | The name of the resource. |
| **Resource type** | Optional | The type of the resource. |
| **Metric namespace** | Optional | The metric namespace. |
| **Search string** | Optional | Search string to filter metrics. |
| **Limit** | Optional | Maximum number of results to return. |

## Workbooks: List workbooks

The Azure MCP Server lists Azure Monitor workbooks in a resource group. This helps you discover and manage your monitoring dashboards and interactive reports.

Example prompts include:

- **List workbooks**: "Show workbooks in monitoring group."
- **List by category**: "List workbooks in Insights category."
- **List shared workbooks**: "Show shared workbooks in monitoring."

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Resource group** | Required | The name of the Azure resource group. |
| **Category** | Optional | The category to filter workbooks by. |
| **Kind** | Optional | The kind of workbook (such as `shared`, `user`). |
| **Source ID** | Optional | The source resource ID to filter workbooks by. |

## Workbooks: Show workbook details

The Azure MCP Server shows details of a specific Azure Monitor workbook by its resource ID. This provides comprehensive information about the workbook's configuration and content.

Example prompts include:

- **Show workbook**: "Show workbook details for /subscriptions/abc123/resourceGroups/monitoring/providers/Microsoft.Insights/workbooks/workbook-guid."
- **Get workbook info**: "Get info about workbook /subscriptions/xyz/resourceGroups/rg/providers/Microsoft.Insights/workbooks/my-workbook."
- **View workbook**: "Display workbook details for my performance workbook."

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Workbook ID** | Required | The full Azure resource ID of the workbook to retrieve. |

## Workbooks: Create workbook

The Azure MCP Server can create a new Azure Monitor workbook. This allows you to programmatically create monitoring dashboards and interactive reports.

Example prompts include:

- **Create workbook**: "Create workbook Performance Dashboard in monitoring group."
- **Create with source**: "Create workbook App Insights Analysis linked to my Application Insights."
- **Create monitoring workbook**: "Create new workbook Infrastructure Overview."

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Display** | Required | The display name for the new workbook. |
| **Serialized content** | Required | The JSON content defining the workbook structure and queries. |
| **Source ID** | Optional | The source resource ID to associate with the workbook. |

## Workbooks: Update workbook

The Azure MCP Server updates an existing Azure Monitor workbook. This allows you to modify workbook properties and content programmatically.

Example prompts include:

- **Update name**: "Update workbook /subscriptions/abc/resourceGroups/rg/providers/Microsoft.Insights/workbooks/wb1 name to Updated Dashboard."
- **Update content**: "Update workbook content for /subscriptions/xyz/resourceGroups/monitoring/providers/Microsoft.Insights/workbooks/dashboard."
- **Modify workbook**: "Change name and content for workbook /subscriptions/123/resourceGroups/prod/providers/Microsoft.Insights/workbooks/analytics."

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Workbook ID** | Required | The full Azure resource ID of the workbook to update. |
| **Display** | Optional | The new display name for the workbook. |
| **Serialized content** | Optional | The updated JSON content for the workbook. |

## Workbooks: Delete workbooks

The Azure MCP Server deletes an Azure Monitor workbook. This permanently removes the workbook and all its associated content.

Example prompts include:

- **Delete workbook**: "Delete workbook /subscriptions/abc123/resourceGroups/monitoring/providers/Microsoft.Insights/workbooks/old-dashboard."
- **Remove workbook**: "Remove workbook /subscriptions/xyz/resourceGroups/rg/providers/Microsoft.Insights/workbooks/unused-workbook."
- **Clean up**: "Remove workbook at /subscriptions/123/resourceGroups/prod/providers/Microsoft.Insights/workbooks/deprecated."

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Workbook ID** | Required | The full Azure resource ID of the workbook to delete. |


## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure Monitor](/azure/azure-monitor/overview)
- [Application Insights](/azure/azure-monitor/app/app-insights-overview)
- [Workbooks in Azure Monitor](/azure/azure-monitor/visualize/workbooks-overview)
- [Metrics in Azure Monitor](/azure/azure-monitor/platform/tutorial-metrics)
