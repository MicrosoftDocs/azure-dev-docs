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

The Azure MCP Server allows you to manage Azure Monitor resources, including querying Log Analytics workspaces for operational insights natural language prompts. You can query Log Analytics workspaces, analyze operational data, and gain insights into your Azure resources without needing to know complex KQL syntax.

[Azure Monitor](/azure/azure-monitor/overview) helps you maximize the availability and performance of your applications and services. It delivers a comprehensive solution for collecting, analyzing, and acting on telemetry from your cloud and on-premises environments.

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## Log analytics: list workspaces

The Azure MCP Server can list all Log Analytics workspaces in a subscription. This provides an overview of your monitoring resources.

Example prompts include:

- **List workspaces**: "Show me all Log Analytics workspaces in my subscription."
- **View workspaces**: "What Log Analytics workspaces do I have?"
- **Find workspaces**: "List my monitoring workspaces"
- **Query workspaces**: "Show all Log Analytics workspaces"
- **Check workspaces**: "Get all monitoring workspaces in subscription abc123"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Subscription** | Required | The Azure subscription ID or name. |

## Log analytics: list tables

The Azure MCP Server can list all tables in a Log Analytics workspace. This helps you understand the data available for querying.

Example prompts include:

- **List tables**: "Show me all tables in my 'centralmonitoring' Log Analytics workspace."
- **View tables**: "What tables do I have in Log Analytics workspace 'app-monitoring'?"
- **Find tables**: "List all tables in my workspace 'security-logs'"
- **Query tables**: "Show available tables in my Log Analytics workspace"
- **Check tables**: "Get all log tables in my 'operations' workspace"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Subscription** | Required | The Azure subscription ID or name. |
| **Workspace** | Required | The Log Analytics workspace ID or name. |
| **Resource group** | Required | The name of the Azure resource group. |

## Log analytics: query logs

The Azure MCP Server can execute Kusto Query Language (KQL) queries against a Log Analytics workspace. This powerful feature allows you to analyze your operational data.

Example prompts include:

- **Simple query**: "Query all error events from the last hour in my 'centralmonitoring' workspace"
- **Filter query**: "Find all failed login attempts in the SecurityEvent table"
- **Complex query**: "Show me the CPU usage trend for my web servers over the last 24 hours"
- **Join query**: "Query errors and correlate them with performance metrics"
- **Aggregation query**: "Count errors by application in my monitoring workspace"

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

- **Check entity health**: "Get the health status for my application entity with model 'webapp-health' and entity 'app-prod-001'"
- **Monitor resource health**: "What is the current health of entity 'web-app-prod' using health model 'application-model'?"
- **Check system status**: "Get health information for my database entity 'sql-prod' with model 'database-health'"
- **Monitor service health**: "Show me the health status of entity 'api-service' using model 'service-monitoring'"
- **Check application status**: "Get the health model data for entity 'production-workload' with model 'workload-health'"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Subscription** | Required | The Azure subscription ID or name. |
| **Resource group** | Required | The name of the Azure resource group. |
| **Model name** | Required | The name of the health model. |
| **Entity** | Required | The entity ID to get health for. |

## Metrics: query metrics

The Azure MCP Server can query Azure Monitor metrics for resources. This allows you to retrieve performance metrics, usage statistics, and monitoring data for your Azure resources over specified time periods.

Example prompts include:

- **Query VM metrics with time range**: "Get CPU percentage and available memory for my VM 'prod-vm01' in the production resource group from January 1st 2024 to January 2nd 2024, aggregated hourly with average values"
- **Query storage metrics with specific type**: "Show me transaction metrics for storage account 'mystorageaccount' in the storage resource group"
- **Query app service metrics over time**: "Get response time and request count for my web app 'mywebapp' over the last 24 hours with hourly intervals"
- **Query with filtering**: "Show me CPU metrics for virtual machine 'prod-vm' but only include high usage periods and limit to 1000 data points"
- **Query multiple performance metrics**: "Get both CPU percentage and available memory for my server 'vm-prod-001' from yesterday with hourly breakdowns"


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

- **List all metrics for a storage account**: "Show me all available metrics for my storage account 'mystorageaccount'"
- **Find transaction-related metrics**: "Find all metrics related to transactions for my storage account 'storageacct'"
- **List VM metrics with filtering**: "List available metrics for my virtual machine 'prod-vm' in the production resource group"
- **Search metrics by keyword**: "Show me metrics for my App Service 'mywebapp' that contain the word 'response', limited to 50 results"
- **List database metrics with namespace**: "Show all available metrics for my SQL database 'proddb' in the database resource group"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Subscription** | Required | The Azure subscription ID or name. |
| **Resource name** | Required | The name of the resource. |
| **Resource group** | Optional | The name of the Azure resource group. |
| **Resource type** | Optional | The type of the resource. |
| **Metric namespace** | Optional | The metric namespace. |
| **Search string** | Optional | Search string to filter metrics. |
| **Limit** | Optional | Maximum number of results to return. |


## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)