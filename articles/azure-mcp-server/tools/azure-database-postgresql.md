---
title: Azure Database for PostgreSQL Tools 
description: Learn how to use the Azure MCP Server to manage Azure Database for PostgreSQL resources with natural language prompts. Query databases, list tables, and retrieve schemas easily.
keywords: azure mcp server, azmcp, postgresql, database
author: diberry
ms.author: diberry
ms.date: 11/17/2025
content_well_notification: 
  - AI-contribution
ai-usage: ai-assisted
ms.topic: concept-article
ms.custom: build-2025
--- 
# Azure Database for PostgreSQL tools for the Azure MCP Server overview

The Azure MCP Server allows you to manage Azure Database for PostgreSQL resources using natural language prompts. You can query databases, list tables, retrieve schemas, and more without remembering complex query syntax.

[Azure Database for PostgreSQL](/azure/postgresql/) is a fully managed, intelligent, and scalable PostgreSQL database service in the cloud. It lets you focus on application development, not database management.

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## Database: List databases

<!-- postgres database list -->

The Azure MCP Server can list all databases in a PostgreSQL server.

Example prompts include:

- **List databases**: "Show me all databases in my PostgreSQL server 'my-pg-server' in resource group 'my-resource-group'"
- **View databases**: "What databases do I have in my PostgreSQL server 'my-pg-server' in resource group 'my-resource-group'?"
- **Check databases**: "Check that I have a database named 'xyz' in server 'my-pg-server' in resource group 'my-resource-group'"
- **Query databases**: "Show databases in PostgreSQL server 'my-pg-server' in resource group 'my-resource-group'"
- **Find databases**: "Get all databases from my PostgreSQL instance 'my-pg-server' in resource group 'my-resource-group'"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Resource group** |  Required | The name of the Azure resource group. This is a logical container for Azure resources. |
| **User** | Required | The user name to access PostgreSQL server. |
| **Server** | Required | The PostgreSQL server to be accessed. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [postgres database list](../includes/tools/annotations/azure-database-for-postgresql-database-list-annotations.md)]

## Database: Execute database query

<!-- postgres database query -->

The Azure MCP Server can execute a query on a PostgreSQL database.

Example prompts include:

- **Run query**: "Execute 'SELECT * FROM users LIMIT 10' in my PostgreSQL database 'my-db' on server 'my-pg-server' in resource group 'my-resource-group'"
- **Query data**: "Run a query to get recent orders from PostgreSQL database 'my-db' on server 'my-pg-server' in resource group 'my-resource-group'"
- **Fetch data**: "Get user information from my PostgreSQL database 'my-db' on server 'my-pg-server' in resource group 'my-resource-group' with query"
- **Extract data**: "Query customer data from my PostgreSQL server 'my-pg-server' in resource group 'my-resource-group'"
- **Retrieve records**: "Select top sales records from PostgreSQL database 'my-db' on server 'my-pg-server' in resource group 'my-resource-group'"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Resource group** |  Required | The name of the Azure resource group. This is a logical container for Azure resources. |
| **User** | Required | The user name to access PostgreSQL server. |
| **Server** | Required | The PostgreSQL server to be accessed. |
| **Database** | Required | The PostgreSQL database to be accessed. |
| **Query** | Required | Query to be executed against a PostgreSQL database. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [postgres database query](../includes/tools/annotations/azure-database-for-postgresql-database-query-annotations.md)]

## Table: List tables

<!-- postgres table list -->

The Azure MCP Server can list all tables in a PostgreSQL database.

Example prompts include:

- **List tables**: "Show me all tables in my PostgreSQL database 'my-db' on server 'my-pg-server' in resource group 'my-resource-group'"
- **View tables**: "What tables do I have in my PostgreSQL database 'my-db' on server 'my-pg-server' in resource group 'my-resource-group'?"
- **Check tables**: "Check that I have a table named 'xyz' in PostgreSQL database 'my-db' on server 'my-pg-server' in resource group 'my-resource-group'"
- **Query tables**: "Show tables in PostgreSQL database 'my-db' on server 'my-pg-server' in resource group 'my-resource-group'"
- **Find tables**: "Get all tables from my PostgreSQL database 'my-db' on server 'my-pg-server' in resource group 'my-resource-group'"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Resource group** |  Required | The name of the Azure resource group. This is a logical container for Azure resources. |
| **User** | Required | The user name to access PostgreSQL server. |
| **Server** | Required | The PostgreSQL server to be accessed. |
| **Database** | Required | The PostgreSQL database to be accessed. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [postgres table list](../includes/tools/annotations/azure-database-for-postgresql-table-list-annotations.md)]

## Table: Get table schema

<!-- postgres table schema get -->

The Azure MCP Server can get the schema of a specific table in a PostgreSQL database.

Example prompts include:

- **View schema**: "Show me the schema of the 'users' table in my PostgreSQL database 'my-db' on server 'my-pg-server' in resource group 'my-resource-group'"
- **Get structure**: "What columns does the 'products' table have in my PostgreSQL database 'my-db' on server 'my-pg-server' in resource group 'my-resource-group'?"
- **Check schema**: "Check if my schema has a not null constraint on the id column in database 'my-db' on server 'my-pg-server' in resource group 'my-resource-group'"
- **View columns**: "Show columns and types for 'customers' table in PostgreSQL database 'my-db' on server 'my-pg-server' in resource group 'my-resource-group'"
- **Examine table**: "Get the structure of 'transactions' table in my PostgreSQL database 'my-db' on server 'my-pg-server' in resource group 'my-resource-group'"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Resource group** |  Required | The name of the Azure resource group. This is a logical container for Azure resources. |
| **User** | Required | The user name to access PostgreSQL server. |
| **Server** | Required | The PostgreSQL server to be accessed. |
| **Database** | Required | The PostgreSQL database to be accessed. |
| **Table** | Required | The PostgreSQL table to be accessed. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [postgres table schema get](../includes/tools/annotations/azure-database-for-postgresql-table-schema-get-annotations.md)]

## Server: List servers

<!-- postgres server list -->

The Azure MCP Server can list all PostgreSQL servers in a subscription and resource group.

Example prompts include:

- **List servers**: "Show me all PostgreSQL servers in resource group 'my-resource-group'"
- **View servers**: "What PostgreSQL servers do I have in resource group 'my-resource-group'?"
- **Check servers**: "Check if resource group 'my-resource-group' has a server named 'xyz'"
- **Query servers**: "Show PostgreSQL servers in resource group 'my-resource-group'"
- **Find servers**: "Get all PostgreSQL instances in resource group 'my-resource-group'"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Resource group** |  Required | The name of the Azure resource group. This is a logical container for Azure resources. |
| **User** | Required | The user name to access PostgreSQL server. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [postgres server list](../includes/tools/annotations/azure-database-for-postgresql-server-list-annotations.md)]

## Server: Get server configuration

<!-- postgres server config get -->

The Azure MCP Server can retrieve the configuration of a PostgreSQL server.

Example prompts include:

- **View configuration**: "Show me the configuration of my PostgreSQL server 'my-pg-server' in resource group 'my-resource-group'"
- **Get settings**: "What are the settings of my PostgreSQL server 'pg-prod' in resource group 'my-resource-group'?"
- **Check config**: "Check if my server 'my-pg-server' in resource group 'my-resource-group' configuration 'x' is set to 'y'"
- **View server params**: "Show me all configuration parameters of my PostgreSQL server 'my-pg-server' in resource group 'my-resource-group'"
- **Get server setup**: "What is the configuration of my PostgreSQL instance 'my-pg-server' in resource group 'my-resource-group'?"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Resource group** |  Required | The name of the Azure resource group. This is a logical container for Azure resources. |
| **User** | Required | The user name to access PostgreSQL server. |
| **Server** | Required | The PostgreSQL server to be accessed. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [postgres server config get](../includes/tools/annotations/azure-database-for-postgresql-server-config-get-annotations.md)]

## Server: Get server parameter

<!-- postgres server param get -->

The Azure MCP Server can retrieve a specific parameter of a PostgreSQL server.

Example prompts include:

- **View parameter**: "Show me the 'max_connections' parameter of my PostgreSQL server 'my-pg-server' in resource group 'my-resource-group'"
- **Get setting**: "What is the value of 'shared_buffers' in my PostgreSQL server 'my-pg-server' in resource group 'my-resource-group'?"
- **Check parameter**: "Check if my server 'my-pg-server' in resource group 'my-resource-group' parameter 'x' is set to 'y'"
- **View server param**: "Show me the 'work_mem' parameter value in my PostgreSQL server 'my-pg-server' in resource group 'my-resource-group'"
- **Get configuration value**: "What is the 'maintenance_work_mem' set to in my PostgreSQL instance 'my-pg-server' in resource group 'my-resource-group'?"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Resource group** |  Required | The name of the Azure resource group. This is a logical container for Azure resources. |
| **User** | Required | The user name to access PostgreSQL server. |
| **Server** | Required | The PostgreSQL server to be accessed. |
| **Param** | Required | The PostgreSQL parameter to be accessed. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [postgres server param get](../includes/tools/annotations/azure-database-for-postgresql-server-param-get-annotations.md)]

## Server: Set server parameter

<!-- postgres server param set -->

The Azure MCP Server can set or update a specific parameter on a PostgreSQL server. This allows you to configure server settings, optimize performance, and adjust database behavior according to your application requirements.

Example prompts include:

- **Update connection setting**: "Set the 'max_connections' parameter to '200' on my 'prod-postgres-server' in resource group 'my-resource-group'"
- **Configure memory**: "Update the 'shared_buffers' parameter to '256MB' on server 'database-server-east' in resource group 'my-resource-group'"
- **Adjust timeout**: "Set 'statement_timeout' to '30000' on my PostgreSQL server 'my-pg-server' in resource group 'my-resource-group'"
- **Configure logging**: "Update the 'log_statement' parameter to 'all' on server 'dev-postgres' in resource group 'my-resource-group'"
- **Set maintenance parameter**: "Configure 'maintenance_work_mem' to '64MB' on my database server 'my-pg-server' in resource group 'my-resource-group'"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Resource group** |  Required | The name of the Azure resource group. This is a logical container for Azure resources. |
| **User** | Required | The user name to access the PostgreSQL server. |
| **Server** | Required | The PostgreSQL server name to configure. |
| **Param** | Required | The PostgreSQL parameter to be set. |
| **Value** | Required | The value to set for the parameter. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [postgres server param set](../includes/tools/annotations/azure-database-for-postgresql-server-param-set-annotations.md)]

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure Database for PostgreSQL](/azure/postgresql/)
