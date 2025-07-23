---
title: Azure Monitor Tools 
description: Learn how to use the Azure MCP Server with Azure Monitor.
keywords: azure mcp server, azmcp, azure monitor, log analytics
author: diberry
ms.author: diberry
ms.date: 07/01/2025
content_well_notification: 
  - AI-contribution
ai-usage: ai-assisted
ms.topic: reference
ms.custom: build-2025
--- 
# Azure Monitor tools for the Azure MCP Server

The Azure MCP Server allows you to manage Azure Monitor resources using natural language prompts. You can query Log Analytics workspaces, analyze operational data, monitor resource health, retrieve performance metrics, and manage Azure Monitor workbooks without needing to know complex KQL syntax.

[Azure Monitor](/azure/azure-monitor/overview) helps you maximize the availability and performance of your applications and services. It delivers a comprehensive solution for collecting, analyzing, and acting on telemetry from your cloud and on-premises environments.

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## Log analytics: list workspaces

The Azure MCP Server can list all Log Analytics workspaces in a subscription. This provides an overview of your monitoring resources.

Example prompts include:

- **List workspaces**: "Show me all Log Analytics workspaces in my subscription."
- **View workspaces**: "what workspaces do i have"
- **Find workspaces**: "List monitoring workspaces"
- **Query workspaces**: "Show workspaces"
- **Check workspaces**: "Get all monitoring workspaces in subscription abc123 please"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Subscription** | Required | The Azure subscription ID or name. |

## Log analytics: list tables

The Azure MCP Server can list all tables in a Log Analytics workspace. This helps you understand the data available for querying.

Example prompts include:

- **List tables**: "show tables in centralmonitoring workspace"
- **View tables**: "What tables in workspace app-monitoring?"
- **Find tables**: "List tables in security-logs"
- **Query tables**: "Show tables in my workspace"
- **Check tables**: "Get all log tables in operations workspace please"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Subscription** | Required | The Azure subscription ID or name. |
| **Workspace** | Required | The Log Analytics workspace ID or name. |
| **Resource group** | Required | The name of the Azure resource group. |

## Log analytics: query logs

The Azure MCP Server can execute Kusto Query Language (KQL) queries against a Log Analytics workspace. This powerful feature allows you to analyze your operational data.

Example prompts include:

- **Simple query**: "query errors from last hour"
- **Filter query**: "Find failed login attempts in SecurityEvent table please"
- **Complex query**: "Show CPU usage trend for web servers last 24 hours"
- **Join query**: "query errors and performance metrics"
- **Aggregation query**: "Count errors by application in monitoring workspace"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Subscription** | Required | The Azure subscription ID or name. |
| **Workspace** | Required | The Log Analytics workspace ID or name. |
| **Table name** | Required | The name of the table to query. |
| **Query** | Required | The KQL query to execute against the Log Analytics workspace. |
| **Hours** | Optional | The number of hours to query back from now. |
| **Limit** | Optional | The maximum number of results to return. |

## Health: get entity health

The Azure MCP Server can get the health status of an entity using Azure Monitor health models. This provides comprehensive health information and monitoring status for Azure resources and applications.

Example prompts include:

- **Check entity health**: "get health for app-prod-001 with webapp-health model"
- **Monitor resource health**: "What's the health of web-app-prod using application-model?"
- **Check system status**: "Get health info for sql-prod database entity"
- **Monitor service health**: "show health status of api-service"
- **Check application status**: "Get health data for production-workload with workload-health model please"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Subscription** | Required | The Azure subscription ID or name. |
| **Resource group** | Required | The name of the Azure resource group. |
| **Model name** | Required | The name of the health model. |
| **Entity** | Required | The entity ID to get health for. |

## Metrics: query metrics

The Azure MCP Server can query Azure Monitor metrics for resources. This allows you to retrieve performance metrics, usage statistics, and monitoring data for your Azure resources over specified time periods.

Example prompts include:

- **Query VM metrics**: "get cpu and memory for prod-vm01 from jan 1 to jan 2"
- **Query storage metrics**: "Show transaction metrics for mystorageaccount in storage group"
- **Query app metrics**: "Get response time for mywebapp last 24 hours"
- **Query with filtering**: "show cpu metrics for prod-vm high usage only"
- **Query performance**: "Get CPU and memory for vm-prod-001 from yesterday hourly"


| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Subscription** | Required | The Azure subscription ID or name. |
| **Resource name** | Required | The name of the resource to query metrics for. |
| **Metric namespace** | Required | The metric namespace. |
| **Metric names** | Required | The metric names to query. |
| **Resource group** | Optional | The name of the Azure resource group. |
| **Resource type** | Optional | The type of the resource. |
| **Start time** | Optional | The start time for the query. |
| **End time** | Optional | The end time for the query. |
| **Interval** | Optional | The interval for aggregation. |
| **Aggregation** | Optional | The aggregation method. |
| **Filter** | Optional | Filter for the metrics query. |
| **Max buckets** | Optional | Maximum number of buckets. |

## Metrics: list metric definitions

The Azure MCP Server can list available metric definitions for a resource. This helps you discover what metrics are available for monitoring before querying specific metric data.

Example prompts include:

- **List storage metrics**: "show metrics for mystorageaccount"
- **Find transaction metrics**: "find transaction metrics for storageacct"
- **List VM metrics**: "List metrics for prod-vm in production group"
- **Search by keyword**: "Show mywebapp metrics with response word, limit 50"
- **List database metrics**: "show metrics for proddb in database group"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Subscription** | Required | The Azure subscription ID or name. |
| **Resource name** | Required | The name of the resource. |
| **Resource group** | Optional | The name of the Azure resource group. |
| **Resource type** | Optional | The type of the resource. |
| **Metric namespace** | Optional | The metric namespace. |
| **Search string** | Optional | Search string to filter metrics. |
| **Limit** | Optional | Maximum number of results to return. |

## Workbooks

### List workbooks

The Azure MCP Server can list Azure Monitor workbooks in a resource group. This helps you discover and manage your monitoring dashboards and interactive reports.

**Example prompts** include:

- **List workbooks**: "Show workbooks in monitoring group"
- **List by category**: "list workbooks in Insights category"
- **List shared workbooks**: "Show shared workbooks in monitoring"
- **List with source**: "find workbooks linked to Application Insights"
- **Query workbooks**: "List monitoring workbooks please"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Subscription** | Required | The Azure subscription ID or name. |
| **Resource group** | Required | The name of the Azure resource group. |
| **Category** | Optional | The category to filter workbooks by. |
| **Kind** | Optional | The kind of workbook (e.g., 'shared', 'user'). |
| **Source ID** | Optional | The source resource ID to filter workbooks by. |

### Show workbook details

The Azure MCP Server can show details of a specific Azure Monitor workbook by its resource ID. This provides comprehensive information about the workbook's configuration and content.

**Example prompts** include:

- **Show workbook**: "show workbook details for /subscriptions/abc123/resourceGroups/monitoring/providers/Microsoft.Insights/workbooks/workbook-guid"
- **Get workbook info**: "Get info about workbook /subscriptions/xyz/resourceGroups/rg/providers/Microsoft.Insights/workbooks/my-workbook"
- **View workbook**: "display workbook details"
- **Check workbook**: "show config for workbook /subscriptions/123/resourceGroups/prod/providers/Microsoft.Insights/workbooks/analytics"
- **Retrieve workbook**: "get workbook /subscriptions/456/resourceGroups/monitoring/providers/Microsoft.Insights/workbooks/performance"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Workbook ID** | Required | The full Azure resource ID of the workbook to retrieve. |

### Create workbook

The Azure MCP Server can create a new Azure Monitor workbook. This allows you to programmatically create monitoring dashboards and interactive reports.

**Example prompts** include:

- **Create workbook**: "create workbook Performance Dashboard in monitoring group"
- **Create with source**: "Create workbook App Insights Analysis linked to my Application Insights"
- **Create monitoring workbook**: "create new workbook Infrastructure Overview"
- **Create dashboard**: "Create Security Dashboard with custom JSON"
- **Create analytics workbook**: "create Cost Analysis workbook in finance group please"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Subscription** | Required | The Azure subscription ID or name. |
| **Resource group** | Required | The name of the Azure resource group. |
| **Display name** | Required | The display name for the new workbook. |
| **Serialized content** | Required | The JSON content defining the workbook structure and queries. |
| **Source ID** | Optional | The source resource ID to associate with the workbook. |

### Update workbook

The Azure MCP Server can update an existing Azure Monitor workbook. This allows you to modify workbook properties and content programmatically.

**Example prompts** include:

- **Update name**: "update workbook /subscriptions/abc/resourceGroups/rg/providers/Microsoft.Insights/workbooks/wb1 name to Updated Dashboard"
- **Update content**: "Update workbook content for /subscriptions/xyz/resourceGroups/monitoring/providers/Microsoft.Insights/workbooks/dashboard"
- **Modify workbook**: "change name and content for workbook /subscriptions/123/resourceGroups/prod/providers/Microsoft.Insights/workbooks/analytics"
- **Update dashboard**: "update workbook with new performance metrics"
- **Refresh workbook**: "update content for workbook /subscriptions/789/resourceGroups/ops/providers/Microsoft.Insights/workbooks/operations please"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Workbook ID** | Required | The full Azure resource ID of the workbook to update. |
| **Display name** | Optional | The new display name for the workbook. |
| **Serialized content** | Optional | The updated JSON content for the workbook. |

### Delete workbook

The Azure MCP Server can delete an Azure Monitor workbook. This permanently removes the workbook and all its associated content.

**Example prompts** include:

- **Delete workbook**: "delete workbook /subscriptions/abc123/resourceGroups/monitoring/providers/Microsoft.Insights/workbooks/old-dashboard"
- **Remove workbook**: "Remove workbook /subscriptions/xyz/resourceGroups/rg/providers/Microsoft.Insights/workbooks/unused-workbook"
- **Clean up**: "remove workbook at /subscriptions/123/resourceGroups/prod/providers/Microsoft.Insights/workbooks/deprecated"
- **Delete dashboard**: "delete monitoring workbook please"
- **Remove unused**: "Delete /subscriptions/789/resourceGroups/test/providers/Microsoft.Insights/workbooks/test-dashboard"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Workbook ID** | Required | The full Azure resource ID of the workbook to delete. |


## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)