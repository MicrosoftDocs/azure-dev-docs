---
title: Azure Data Explorer
description: Learn how to use the Azure MCP Server with Azure Data Explorer. Query data, list clusters, and manage databases using natural language prompts. You can also include KQL syntax in your prompts if needed.
author: sandeep-sen
ms.author: sandeepsen
ms.date: 11/03/2026
ms.topic: concept-article
ms.reviewer: diberry
ms.custom:
  - build-2025
ai-usage: ai-assisted
content_well_notification:
  - AI-contribution
tool_count: 7
mcp-cli.version: "3.0.0-beta.47+bd724faf47e86348c7163a429b584aabfd714876"
---
# Azure MCP Server tools for Azure Data Explorer

The Azure MCP Server enables you to manage Azure Data Explorer resources by using natural language prompts. You can list clusters, view databases, and query data by using natural language. You can also use specific KQL queries for targeted responses.

[Azure Data Explorer](/azure/data-explorer/data-explorer-overview) is a fast, fully managed data analytics service for real-time analysis on large volumes of data streaming from applications, websites, IoT devices, and more. Azure Data Explorer helps you analyze large volumes of diverse data from any data source, such as websites, applications, IoT devices, and more.

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## Conditional parameters

Some of the Azure Data Explorer tools require **one** of the following parameter sets within the conversation context:

- **Option 1**: Cluster URI
- **Option 2**: Both cluster name **and** subscription

The subscription can resolve from your configured Azure context when you provide a cluster name. If you provide a cluster URI, the tool uses that URI; a cluster name and subscription aren't required. A resource group isn't required for these data-plane tools.

## Cluster: List clusters

<!-- kusto cluster list -->

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp kusto cluster list \
  [--resource-group <resource-group>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `resource-group` | string | No | Limit clusters to this resource group. Omit it to list clusters across the subscription. |

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli kusto cluster list -->

Example prompts include:

- **List clusters**: "Show me all Azure Data Explorer clusters in my subscription."
- **View clusters**: "What Azure Data Explorer clusters do I have available?"
- **Check clusters**: "List all my Azure Data Explorer clusters."
- **Query clusters**: "Show my Azure Data Explorer cluster organization."
- **Find clusters**: "Get all ADX clusters in my Azure subscription."

| Parameter | Required or optional | Description |
|-----------|----------------------|-------------|
| **Resource group** | Optional | Limit clusters to this resource group. Omit it to list clusters across the subscription. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## Cluster: Get cluster details

<!-- kusto cluster get -->

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp kusto cluster get \
  --cluster <cluster>
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `cluster` | string | Yes | The name of the Azure Data Explorer cluster. |

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli kusto cluster get -->

Example prompts include:

- **Get details**: "Show me details of my Azure Data Explorer cluster 'analytics-cluster'."
- **View cluster**: "Give me information about my ADX cluster 'logs-prod'."
- **Cluster info**: "What are the details of Azure Data Explorer cluster 'data-explorer-dev'?"
- **Check configuration**: "Get configuration details of my ADX cluster 'telemetry-cluster'."
- **Cluster properties**: "Show properties of my Azure Data Explorer cluster 'analytics-cluster' in subscription 'my-sub'."

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Cluster** | Required | The name of the Azure Data Explorer cluster. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## Database: List databases

<!-- kusto database list -->

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp kusto database list \
  [--cluster-uri <cluster-uri>] \
  [--cluster <cluster>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `cluster-uri` | string | No | The URI of the Azure Data Explorer cluster. |
| `cluster` | string | No | The name of the Azure Data Explorer cluster. |

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli kusto database list -->

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

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## Table: List tables

<!-- kusto table list -->

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp kusto table list \
  --database <database> \
  [--cluster-uri <cluster-uri>] \
  [--cluster <cluster>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `database` | string | Yes | The name of the Azure Data Explorer database. |
| `cluster-uri` | string | No | The URI of the Azure Data Explorer cluster. |
| `cluster` | string | No | The name of the Azure Data Explorer cluster. |

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli kusto table list -->

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

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## Table: Get table schema

<!-- kusto table schema -->

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp kusto table schema \
  --table <table> \
  --database <database> \
  [--cluster-uri <cluster-uri>] \
  [--cluster <cluster>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `table` | string | Yes | The name of the Azure Data Explorer table. |
| `database` | string | Yes | The name of the Azure Data Explorer database. |
| `cluster-uri` | string | No | The URI of the Azure Data Explorer cluster. |
| `cluster` | string | No | The name of the Azure Data Explorer cluster. |

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli kusto table schema -->

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

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## Sample data

<!-- kusto sample -->

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp kusto sample \
  --table <table> \
  --database <database> \
  [--limit <limit>] \
  [--cluster-uri <cluster-uri>] \
  [--cluster <cluster>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `table` | string | Yes | The name of the Azure Data Explorer table. |
| `database` | string | Yes | The name of the Azure Data Explorer database. |
| `limit` | string | No | The maximum number of results to return. Must be a positive integer between 1 and 10000. Default is 10. |
| `cluster-uri` | string | No | The URI of the Azure Data Explorer cluster. |
| `cluster` | string | No | The name of the Azure Data Explorer cluster. |

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli kusto sample -->

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

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## Query

<!-- kusto query -->

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp kusto query \
  --query <query> \
  --database <database> \
  [--cluster-uri <cluster-uri>] \
  [--cluster <cluster>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `query` | string | Yes | The Kusto Query Language (KQL) query to execute. |
| `database` | string | Yes | The name of the Azure Data Explorer database. |
| `cluster-uri` | string | No | The URI of the Azure Data Explorer cluster. |
| `cluster` | string | No | The name of the Azure Data Explorer cluster. |

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli kusto query -->

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

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure Data Explorer](/azure/data-explorer/data-explorer-overview)
