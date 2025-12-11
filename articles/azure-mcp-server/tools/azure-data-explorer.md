---
title: Azure Data Explorer 
description: "Learn how to use the Azure MCP Server with Azure Data Explorer. Query data, list clusters, and manage databases using natural language prompts. You can also include KQL syntax in your prompts if needed."
keywords: azure mcp server, azmcp, kusto, azure data explorer, adx
author: diberry
ms.author: diberry
ms.date: 12/05/2025
content_well_notification: 
  - AI-contribution
ai-usage: ai-assisted
ms.topic: reference
ms.custom: build-2025
#kusto
--- 
# Azure Data Explorer tools for the Azure MCP Server

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

- **List databases**: "Show me all databases in Azure Data Explorer cluster 'analytics-cluster'."
- **View databases**: "What databases do I have in my ADX cluster 'analytics-cluster'?"
- **Check databases**: "List all databases in Data Explorer cluster 'analytics-cluster'."
- **Query databases**: "Show databases in Azure Data Explorer cluster URI 'https://mycluster.westus.kusto.windows.net'."
- **Find databases**: "Get all databases from ADX cluster 'analytics-cluster'."

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

- **List tables**: "Show me all tables in the 'logs' database of Azure Data Explorer cluster 'analytics-cluster'."
- **View tables**: "What tables do I have in database 'telemetry' in ADX cluster 'analytics-cluster'?"
- **Check tables**: "List all tables in Azure Data Explorer database 'analytics' in cluster 'analytics-cluster'."
- **Query tables**: "Show tables in the 'metrics' database of Data Explorer cluster 'analytics-cluster'."
- **Find tables**: "Get all tables from 'events' database in Azure Data Explorer cluster 'analytics-cluster'."

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

- **View schema**: "Show me the schema of the 'Events' table in database 'logs' in Azure Data Explorer cluster 'analytics-cluster'."
- **Get structure**: "What columns does the 'Metrics' table have in database 'telemetry' in ADX cluster 'analytics-cluster'?"
- **Check schema**: "Describe the 'Logs' table in database 'logs' in Data Explorer cluster 'analytics-cluster'."
- **View columns**: "Show columns and types for 'Telemetry' table in database 'telemetry' in Azure Data Explorer cluster 'analytics-cluster'."
- **Examine table**: "Get the structure of 'Traces' table in database 'logs' in ADX cluster 'analytics-cluster'."

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

- **Get sample data**: "Show me a sample of data from the 'Events' table in database 'logs' in Azure Data Explorer cluster 'analytics-cluster'."
- **Preview table**: "Give me a preview of records from the 'Logs' table in database 'logs' in ADX cluster 'analytics-cluster'."
- **View data examples**: "Show sample rows from 'Metrics' table in database 'telemetry' in Data Explorer cluster 'analytics-cluster'."
- **Check data format**: "Get a few sample records from the 'Telemetry' table in database 'telemetry' in Azure Data Explorer cluster 'analytics-cluster' to see the data structure."
- **Data exploration**: "Return 10 sample rows from 'UserActivity' table in database 'logs' in ADX cluster 'analytics-cluster'."

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

- **Run query**: "Execute 'Logs | where Timestamp > ago(1h) | count' in database 'logs' in Azure Data Explorer cluster 'analytics-cluster'."
- **Query data**: "Run KQL query 'Logs | where Level == "Error" and Timestamp > ago(24h)' to find all errors in the last 24 hours in database 'logs' in ADX cluster 'analytics-cluster'."
- **Fetch data**: "Get recent events with query 'Events | take 100' from database 'logs' in Data Explorer cluster 'analytics-cluster'."
- **Extract insights**: "Query user activity patterns with 'UserActivity | summarize count() by UserId' from database 'logs' in Azure Data Explorer cluster 'analytics-cluster'."
- **Analyze logs**: "Execute KQL 'Metrics | summarize avg(Duration) by Service' to summarize performance metrics by service in database 'telemetry' in ADX cluster 'analytics-cluster'."

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