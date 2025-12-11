---
title: Azure Data Explorer 
description: "Learn how to use the Azure MCP Server with Azure Data Explorer. Query data, list clusters, and manage databases using natural language prompts. You can also include KQL syntax in your prompts if needed."
keywords: azure mcp server, azmcp, kusto, azure data explorer, adx
author: diberry
ms.author: diberry
ms.date: 11/17/2025
content_well_notification: 
  - AI-contribution
ai-usage: ai-assisted
ms.topic: concept-article
ms.custom: build-2025
#kusto
--- 
# Azure Data Explorer tools for the Azure MCP Server overview

The Azure MCP Server allows you to manage Azure Data Explorer resources using natural language prompts. You can list clusters, view databases, query data with natural language. You can also use specific KQL queries for targeted responses.

[Azure Data Explorer](/azure/data-explorer/data-explorer-overview) is a fast, fully managed data analytics service for real-time analysis on large volumes of data streaming from applications, websites, IoT devices, and more. Azure Data Explorer helps you analyze large volumes of diverse data from any data source, such as websites, applications, IoT devices, and more.

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## Conditional parameters

Some of the Azure Data Explorer tools require **one** of the following parameter sets within the conversation context:

- **Option 1**: Cluster URI
- **Option 2**: Both cluster name **and** subscription

Don't provide all three parameters (cluster URI, cluster name, and subscription) together, because this creates conflicting inputs.

## Cluster: List clusters

<!-- kusto cluster list -->

The Azure MCP Server lists all Azure Data Explorer clusters in a subscription.

Example prompts include:

- **List clusters**: "Show me all Azure Data Explorer clusters in my subscription."
- **View clusters**: "What Azure Data Explorer clusters do I have available?"
- **Check clusters**: "List all my Azure Data Explorer clusters."
- **Query clusters**: "Show my Azure Data Explorer cluster organization."
- **Find clusters**: "Get all ADX clusters in my Azure subscription."

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [kusto cluster list](../includes/tools/annotations/azure-data-explorer-cluster-list-annotations.md)]

## Cluster: Get cluster details

<!-- kusto cluster get -->

The Azure MCP Server gets details for a specific Azure Data Explorer cluster.

Example prompts include:

- **Get details**: "Show me details of my Azure Data Explorer cluster 'analytics-cluster'."
- **View cluster**: "Give me information about my ADX cluster 'logs-prod'."
- **Cluster info**: "What are the details of Azure Data Explorer cluster 'data-explorer-dev'?"
- **Check configuration**: "Get configuration details of my ADX cluster 'telemetry-cluster'."
- **Cluster properties**: "Show properties of my Azure Data Explorer cluster in subscription 'my-sub'."

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Cluster** | Required | The name of the Azure Data Explorer cluster. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [kusto cluster get](../includes/tools/annotations/azure-data-explorer-cluster-get-annotations.md)]

## Database: List databases

<!-- kusto database list -->

The Azure MCP Server lists all databases in an Azure Data Explorer cluster.

Example prompts include:

- **List databases**: "Show me all databases in my Azure Data Explorer cluster."
- **View databases**: "What databases do I have in my ADX cluster 'analytics-cluster'?"
- **Check databases**: "List all databases in my Data Explorer cluster."
- **Query databases**: "Show databases in Azure Data Explorer cluster URI 'https://mycluster.westus.kusto.windows.net'."
- **Find databases**: "Get all databases from my ADX instance."

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Cluster URI** | [Conditionally](#conditional-parameters) required | The URI of the Azure Data Explorer cluster. |
| **Cluster** | [Conditionally](#conditional-parameters) required | The name of the Azure Data Explorer cluster. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [kusto database list](../includes/tools/annotations/azure-data-explorer-database-list-annotations.md)]

## Table: List tables

<!-- kusto table list -->

The Azure MCP Server lists all tables in a specific Azure Data Explorer database.

Example prompts include:

- **List tables**: "Show me all tables in the 'logs' database of my Azure Data Explorer cluster."
- **View tables**: "What tables do I have in database 'telemetry' in my ADX cluster?"
- **Check tables**: "List all tables in Azure Data Explorer database 'analytics'."
- **Query tables**: "Show tables in the 'metrics' database of my Data Explorer cluster."
- **Find tables**: "Get all tables from 'events' database in my Azure Data Explorer instance."

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Cluster URI** | [Conditionally](#conditional-parameters) required | The URI of the Azure Data Explorer cluster. |
| **Cluster** | [Conditionally](#conditional-parameters) required | The name of the Azure Data Explorer cluster. |
| **Database** | Required | The name of the Azure Data Explorer database. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [kusto table list](../includes/tools/annotations/azure-data-explorer-table-list-annotations.md)]

## Table: Get table schema

<!-- kusto table schema -->

The Azure MCP Server gets the schema of a specific table in an Azure Data Explorer database.

Example prompts include:

- **View schema**: "Show me the schema of the 'Events' table in my Azure Data Explorer database."
- **Get structure**: "What columns does the 'Metrics' table have in my ADX database?"
- **Check schema**: "Describe the 'Logs' table in my Data Explorer database."
- **View columns**: "Show columns and types for 'Telemetry' table in Azure Data Explorer."
- **Examine table**: "Get the structure of 'Traces' table in my ADX database."

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Cluster URI** | [Conditionally](#conditional-parameters) required | The URI of the Azure Data Explorer cluster. |
| **Cluster** | [Conditionally](#conditional-parameters) required | The name of the Azure Data Explorer cluster. |
| **Database** | Required | The name of the Azure Data Explorer database. |
| **Table** | Required | The name of the table. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [kusto table schema](../includes/tools/annotations/azure-data-explorer-table-schema-annotations.md)]

## Sample data

<!-- kusto sample -->

The Azure MCP Server retrieves a sample of data from a specified Azure Data Explorer table.

Example prompts include:

- **Get sample data**: "Show me a sample of data from the 'Events' table in my Azure Data Explorer database."
- **Preview table**: "Give me a preview of records from the 'Logs' table in my ADX database."
- **View data examples**: "Show sample rows from 'Metrics' table in my Data Explorer database."
- **Check data format**: "Get a few sample records from the 'Telemetry' table in Azure Data Explorer to see the data structure."
- **Data exploration**: "Return 10 sample rows from 'UserActivity' table in my ADX cluster."

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Cluster URI** | [Conditionally](#conditional-parameters) required | The URI of the Azure Data Explorer cluster. |
| **Cluster** | [Conditionally](#conditional-parameters) required | The name of the Azure Data Explorer cluster. |
| **Database** | Required | The name of the Azure Data Explorer database. |
| **Table** | Required | The name of the table to sample data from. |
| **Limit** | Optional | The maximum number of rows to return in the sample. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [kusto sample](../includes/tools/annotations/azure-data-explorer-sample-annotations.md)]

## Query

<!-- kusto query -->

The Azure MCP Server executes a KQL query against an Azure Data Explorer database.

Example prompts include:

- **Run query**: "Execute 'Logs | where Timestamp > ago(1h) | count' in my Azure Data Explorer database."
- **Query data**: "Run KQL query to find all errors in the last 24 hours in my ADX database."
- **Fetch data**: "Get recent events from my Data Explorer database with query."
- **Extract insights**: "Query user activity patterns from my Azure Data Explorer database."
- **Analyze logs**: "Execute KQL to summarize performance metrics by service in my ADX database."

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Cluster URI** | [Conditionally](#conditional-parameters) required | The URI of the Azure Data Explorer cluster. |
| **Cluster** | [Conditionally](#conditional-parameters) required | The name of the Azure Data Explorer cluster. |
| **Database** | Required | The name of the Azure Data Explorer database. |
| **Query** | Required | The KQL query to execute. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [kusto query](../includes/tools/annotations/azure-data-explorer-query-annotations.md)]

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure Data Explorer](/azure/data-explorer/data-explorer-overview)