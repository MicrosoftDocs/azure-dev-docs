---
title: Azure Data Explorer 
description: Learn how to use the Azure MCP Server with Azure Data Explorer.
keywords: azure mcp server, azmcp, kusto, azure data explorer, adx
author: diberry
ms.author: diberry
ms.date: 05/20/2025
content_well_notification: 
  - AI-contribution
ai-usage: ai-assisted
ms.topic: reference
ms.custom: build-2025
--- 
# Azure Data Explorer tools for the Azure MCP Server

The Azure MCP Server allows you to manage Azure Data Explorer resources using natural language prompts. You can list clusters, view databases, query data, and more without remembering complex Kusto Query Language (KQL) syntax.

[Azure Data Explorer](/azure/data-explorer/data-explorer-overview) is a fast, fully managed data analytics service for real-time analysis on large volumes of data streaming from applications, websites, IoT devices, and more. Azure Data Explorer helps you analyze large volumes of diverse data from any data source, such as websites, applications, IoT devices, and more.

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## Conditional parameters

Some of the Azure Data Explorer tools require **one** of the following parameter sets within the conversation context:

- **Option 1**: Cluster URI
- **Option 2**: Both cluster name **and** subscription

Don't provide all three parameters (cluster URI, cluster name, and subscription) together, because this creates conflicting inputs.

## List clusters

The Azure MCP Server can list all Azure Data Explorer clusters in a subscription.

Example prompts include:

- **List clusters**: "Show me all Azure Data Explorer clusters in my subscription."
- **View clusters**: "What Azure Data Explorer clusters do I have available?"
- **Check clusters**: "List all my Azure Data Explorer clusters."
- **Query clusters**: "Show my Azure Data Explorer cluster organization."
- **Find clusters**: "Get all ADX clusters in my Azure subscription."

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Subscription** | Required | The Azure subscription ID or name. |

## Get cluster details

The Azure MCP Server can get details for a specific Azure Data Explorer cluster.

Example prompts include:

- **Get details**: "Show me details of my Azure Data Explorer cluster 'analytics-cluster'."
- **View cluster**: "Give me information about my ADX cluster 'logs-prod'."
- **Cluster info**: "What are the details of Azure Data Explorer cluster 'data-explorer-dev'?"
- **Check configuration**: "Get configuration details of my ADX cluster 'telemetry-cluster'."
- **Cluster properties**: "Show properties of my Azure Data Explorer cluster in subscription 'my-sub'."

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Subscription** | Required | The Azure subscription ID or name. |
| **Cluster name** | Required | The name of the Azure Data Explorer cluster. |

## List databases

The Azure MCP Server can list all databases in an Azure Data Explorer cluster.

Example prompts include:

- **List databases**: "Show me all databases in my Azure Data Explorer cluster."
- **View databases**: "What databases do I have in my ADX cluster 'analytics-cluster'?"
- **Check databases**: "List all databases in my Data Explorer cluster."
- **Query databases**: "Show databases in Azure Data Explorer cluster URI 'https://mycluster.westus.kusto.windows.net'."
- **Find databases**: "Get all databases from my ADX instance."

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Cluster URI** | [Conditionally](#conditional-parameters) required | The URI of the Azure Data Explorer cluster. |
| **Subscription** | [Conditionally](#conditional-parameters) required | The Azure subscription ID or name. |
| **Cluster name** | [Conditionally](#conditional-parameters) required | The name of the Azure Data Explorer cluster. |


## List tables

The Azure MCP Server can list all tables in a specific Azure Data Explorer database.

Example prompts include:

- **List tables**: "Show me all tables in the 'logs' database of my Azure Data Explorer cluster."
- **View tables**: "What tables do I have in database 'telemetry' in my ADX cluster?"
- **Check tables**: "List all tables in Azure Data Explorer database 'analytics'."
- **Query tables**: "Show tables in the 'metrics' database of my Data Explorer cluster."
- **Find tables**: "Get all tables from 'events' database in my Azure Data Explorer instance."

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Cluster URI** | [Conditionally](#conditional-parameters) required | The URI of the Azure Data Explorer cluster. |
| **Subscription** | [Conditionally](#conditional-parameters) required | The Azure subscription ID or name. |
| **Cluster name** | [Conditionally](#conditional-parameters) required | The name of the Azure Data Explorer cluster. |
| **Database name** | Required | The name of the Azure Data Explorer database. |

## Get table schema

The Azure MCP Server can get the schema of a specific table in an Azure Data Explorer database.

Example prompts include:

- **View schema**: "Show me the schema of the 'Events' table in my Azure Data Explorer database."
- **Get structure**: "What columns does the 'Metrics' table have in my ADX database?"
- **Check schema**: "Describe the 'Logs' table in my Data Explorer database."
- **View columns**: "Show columns and types for 'Telemetry' table in Azure Data Explorer."
- **Examine table**: "Get the structure of 'Traces' table in my ADX database."

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Cluster URI** | [Conditionally](#conditional-parameters) required | The URI of the Azure Data Explorer cluster. |
| **Subscription** | [Conditionally](#conditional-parameters) required | The Azure subscription ID or name. |
| **Cluster name** | [Conditionally](#conditional-parameters) required | The name of the Azure Data Explorer cluster. |
| **Database name** | Required | The name of the Azure Data Explorer database. |
| **Table name** | Required | The name of the table. |

## Execute query

The Azure MCP Server can execute a KQL query against an Azure Data Explorer database.

Example prompts include:

- **Run query**: "Execute 'Logs | where Timestamp > ago(1h) | count' in my Azure Data Explorer database."
- **Query data**: "Run KQL query to find all errors in the last 24 hours in my ADX database."
- **Fetch data**: "Get recent events from my Data Explorer database with query."
- **Extract insights**: "Query user activity patterns from my Azure Data Explorer database."
- **Analyze logs**: "Execute KQL to summarize performance metrics by service in my ADX database."

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Cluster URI** | [Conditionally](#conditional-parameters) required | The URI of the Azure Data Explorer cluster. |
| **Subscription** | [Conditionally](#conditional-parameters) required | The Azure subscription ID or name. |
| **Cluster name** | [Conditionally](#conditional-parameters) required | The name of the Azure Data Explorer cluster. |
| **Database name** | Required | The name of the Azure Data Explorer database. |
| **Query** | Required | The KQL query to execute. |

## Sample table data

The Azure MCP Server can retrieve a sample of data from a specified Azure Data Explorer table.

Example prompts include:

- **Get sample data**: "Show me a sample of data from the 'Events' table in my Azure Data Explorer database."
- **Preview table**: "Give me a preview of records from the 'Logs' table in my ADX database."
- **View data examples**: "Show sample rows from 'Metrics' table in my Data Explorer database."
- **Check data format**: "Get a few sample records from the 'Telemetry' table in Azure Data Explorer to see the data structure."
- **Data exploration**: "Return 10 sample rows from 'UserActivity' table in my ADX cluster."

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Cluster URI** | [Conditionally](#conditional-parameters) required | The URI of the Azure Data Explorer cluster. |
| **Subscription** | [Conditionally](#conditional-parameters) required | The Azure subscription ID or name. |
| **Cluster name** | [Conditionally](#conditional-parameters) required | The name of the Azure Data Explorer cluster. |
| **Database name** | Required | The name of the Azure Data Explorer database. |
| **Table name** | Required | The name of the table to sample data from. |
| **Limit** | Optional | The maximum number of rows to return in the sample. |

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
