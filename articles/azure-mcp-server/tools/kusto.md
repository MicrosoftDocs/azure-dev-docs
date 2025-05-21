---
title: Azure Data Explorer with Kusto Tools 
description: Learn how to use the Azure MCP Server with Azure Data Explorer (Kusto).
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
# zure Data Explorer with Kusto tools for the Azure MCP Server

The Azure MCP Server allows you to manage Azure Data Explorer resources using natural language prompts. You can list clusters, view databases, query data, and more without remembering complex Kusto Query Language (KQL) syntax.

[Azure Data Explorer](/azure/data-explorer/data-explorer-overview) is a fast, fully managed data analytics service for real-time analysis on large volumes of data streaming from applications, websites, IoT devices, and more. Azure Data Explorer helps you analyze large volumes of diverse data from any data source, such as websites, applications, IoT devices, and more.

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## List clusters

The Azure MCP Server can list all Kusto clusters in a subscription.

**Example prompts** include:

- **List clusters**: "Show me all Kusto clusters in my subscription."
- **View clusters**: "What Azure Data Explorer clusters do I have available?"
- **Check clusters**: "List all my Kusto clusters."
- **Query clusters**: "Show my Kusto cluster organization."
- **Find clusters**: "Get all ADX clusters in my Azure subscription."

| Parameter | Required/Optional | Description |
|-----------|-------------------|-------------|
| **Subscription** | Required | The Azure subscription ID or name. |

## Get cluster details

The Azure MCP Server can get details for a specific Kusto cluster.

**Example prompts** include:

- **Get details**: "Show me details of my Kusto cluster 'analytics-cluster'."
- **View cluster**: "Give me information about my ADX cluster 'logs-prod'."
- **Cluster info**: "What are the details of Kusto cluster 'data-explorer-dev'?"
- **Check configuration**: "Get configuration details of my ADX cluster 'telemetry-cluster'."
- **Cluster properties**: "Show properties of my Kusto cluster in subscription 'my-sub'."

| Parameter | Required/Optional | Description |
|-----------|-------------------|-------------|
| **Subscription** | Required | The Azure subscription ID or name. |
| **Cluster name** | Required | The name of the Kusto cluster. |

## List databases

The Azure MCP Server can list all databases in a Kusto cluster.

**Example prompts** include:

- **List databases**: "Show me all databases in my Kusto cluster."
- **View databases**: "What databases do I have in my ADX cluster 'analytics-cluster'?"
- **Check databases**: "List all databases in my Data Explorer cluster."
- **Query databases**: "Show databases in Kusto cluster URI 'https://mycluster.westus.kusto.windows.net'."
- **Find databases**: "Get all databases from my ADX instance."

| Parameter | Required/Optional (Group) | Description |
|-----------|-------------------|-------------|
| **Cluster URI** | Required (Group 1) | The URI of the Kusto cluster. |
| **Subscription** | Required (Group 2) | The Azure subscription ID or name. |
| **Cluster name** | Required (Group 2) | The name of the Kusto cluster. |

Note: Either Group 1 OR Group 2 parameters must be provided.

## List tables

The Azure MCP Server can list all tables in a specific Kusto database.

**Example prompts** include:

- **List tables**: "Show me all tables in the 'logs' database of my Kusto cluster."
- **View tables**: "What tables do I have in database 'telemetry' in my ADX cluster?"
- **Check tables**: "List all tables in Kusto database 'analytics'."
- **Query tables**: "Show tables in the 'metrics' database of my Data Explorer cluster."
- **Find tables**: "Get all tables from 'events' database in my Kusto instance."

| Parameter | Required/Optional (Group) | Description |
|-----------|-------------------|-------------|
| **Cluster URI** | Required (Group 1) | The URI of the Kusto cluster. |
| **Subscription** | Required (Group 2) | The Azure subscription ID or name. |
| **Cluster name** | Required (Group 2) | The name of the Kusto cluster. |
| **Database name** | Required | The name of the Kusto database. |

Note: Either Group 1 OR Group 2 parameters must be provided.

## Get table schema

The Azure MCP Server can get the schema of a specific table in a Kusto database.

**Example prompts** include:

- **View schema**: "Show me the schema of the 'Events' table in my Kusto database."
- **Get structure**: "What columns does the 'Metrics' table have in my ADX database?"
- **Check schema**: "Describe the 'Logs' table in my Data Explorer database."
- **View columns**: "Show columns and types for 'Telemetry' table in Kusto."
- **Examine table**: "Get the structure of 'Traces' table in my ADX database."

| Parameter | Required/Optional (Group) | Description |
|-----------|-------------------|-------------|
| **Cluster URI** | Required (Group 1) | The URI of the Kusto cluster. |
| **Subscription** | Required (Group 2) | The Azure subscription ID or name. |
| **Cluster name** | Required (Group 2) | The name of the Kusto cluster. |
| **Database name** | Required | The name of the Kusto database. |
| **Table name** | Required | The name of the table. |

Note: Either Group 1 OR Group 2 parameters must be provided.

## Execute query

The Azure MCP Server can execute a KQL query against a Kusto database.

**Example prompts** include:

- **Run query**: "Execute 'Logs | where Timestamp > ago(1h) | count' in my Kusto database."
- **Query data**: "Run KQL query to find all errors in the last 24 hours in my ADX database."
- **Fetch data**: "Get recent events from my Data Explorer database with query."
- **Extract insights**: "Query user activity patterns from my Kusto database."
- **Analyze logs**: "Execute KQL to summarize performance metrics by service in my ADX database."

| Parameter | Required/Optional (Group) | Description |
|-----------|-------------------|-------------|
| **Cluster URI** | Required (Group 1) | The URI of the Kusto cluster. |
| **Subscription** | Required (Group 2) | The Azure subscription ID or name. |
| **Cluster name** | Required (Group 2) | The name of the Kusto cluster. |
| **Database name** | Required | The name of the Kusto database. |
| **Query** | Required | The KQL query to execute. |

Note: Either Group 1 OR Group 2 parameters must be provided.

## Sample table data

The Azure MCP Server can retrieve a sample of data from a specified Kusto table.

**Example prompts** include:

- **Get sample data**: "Show me a sample of data from the 'Events' table in my Kusto database."
- **Preview table**: "Give me a preview of records from the 'Logs' table in my ADX database."
- **View data examples**: "Show sample rows from 'Metrics' table in my Data Explorer database."
- **Check data format**: "Get a few sample records from the 'Telemetry' table in Kusto to see the data structure."
- **Data exploration**: "Return 10 sample rows from 'UserActivity' table in my ADX cluster."

| Parameter | Required/Optional (Group) | Description |
|-----------|-------------------|-------------|
| **Cluster URI** | Required (Group 1) | The URI of the Kusto cluster. |
| **Subscription** | Required (Group 2) | The Azure subscription ID or name. |
| **Cluster name** | Required (Group 2) | The name of the Kusto cluster. |
| **Database name** | Required | The name of the Kusto database. |
| **Table name** | Required | The name of the table to sample data from. |
| **Limit** | Optional | The maximum number of rows to return in the sample. |

Note: Either Group 1 OR Group 2 parameters must be provided.

[!INCLUDE [global-params](../includes/tools/global-parameters-link.md)]
