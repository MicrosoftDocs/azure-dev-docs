---
title: Azure Database for PostgreSQL Tools 
description: Learn how to use the Azure MCP Server with Azure Database for PostgreSQL.
keywords: azure mcp server, azmcp, postgresql, database
author: diberry
ms.author: diberry
ms.date: 07/01/2025
content_well_notification: 
  - AI-contribution
ai-usage: ai-assisted
ms.topic: reference
ms.custom: build-2025
--- 
# Azure Database for PostgreSQL tools for the Azure MCP Server

The Azure MCP Server allows you to manage Azure Database for PostgreSQL resources using natural language prompts. You can query databases, list tables, retrieve schemas, and more without remembering complex query syntax.

[Azure Database for PostgreSQL](/azure/postgresql/) is a fully managed, intelligent, and scalable PostgreSQL database service in the cloud. It enables you to focus on application development, not database management.

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## Database: list databases

The Azure MCP Server can list all databases in a PostgreSQL server.

Example prompts include:

- **List databases**: "Show me all databases in my PostgreSQL server."
- **View databases**: "What databases do I have in my PostgreSQL server?"
- **Check databases**: "Check that I have a database named 'xyz' in server 'my-pg-server'."
- **Query databases**: "Show databases in PostgreSQL server in resource group 'my-rg'."
- **Find databases**: "Get all databases from my PostgreSQL instance."

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Subscription** | Required | The Azure subscription ID or name. |
| **Resource group** | Required | The name of the Azure resource group. |
| **User name** | Required | The user name to access PostgreSQL server. |
| **Server** | Required | The PostgreSQL server to be accessed. |

## Database: execute database query

The Azure MCP Server can execute a query on a PostgreSQL database.

Example prompts include:

- **Run query**: "Execute 'SELECT * FROM users LIMIT 10' in my PostgreSQL database."
- **Query data**: "Run a query to get recent orders from PostgreSQL database."
- **Fetch data**: "Get user information from my PostgreSQL database with query."
- **Extract data**: "Query customer data from my PostgreSQL server."
- **Retrieve records**: "Select top sales records from PostgreSQL database."

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Subscription** | Required | The Azure subscription ID or name. |
| **Resource group** | Required | The name of the Azure resource group. |
| **User name** | Required | The user name to access PostgreSQL server. |
| **Server** | Required | The PostgreSQL server to be accessed. |
| **Database** | Required | The PostgreSQL database to be accessed. |
| **Query** | Required | Query to be executed against a PostgreSQL database. |

## Table: list tables

The Azure MCP Server can list all tables in a PostgreSQL database.

Example prompts include:

- **List tables**: "Show me all tables in my PostgreSQL database."
- **View tables**: "What tables do I have in my PostgreSQL database?"
- **Check tables**: "Check that I have a table named 'xyz' in PostgreSQL database 'my-db'."
- **Query tables**: "Show tables in PostgreSQL database in server 'my-pg-server'."
- **Find tables**: "Get all tables from my PostgreSQL database."

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Subscription** | Required | The Azure subscription ID or name. |
| **Resource group** | Required | The name of the Azure resource group. |
| **User name** | Required | The user name to access PostgreSQL server. |
| **Server** | Required | The PostgreSQL server to be accessed. |
| **Database** | Required | The PostgreSQL database to be accessed. |

## Table: get table schema

The Azure MCP Server can get the schema of a specific table in a PostgreSQL database.

Example prompts include:

- **View schema**: "Show me the schema of the 'users' table in my PostgreSQL database."
- **Get structure**: "What columns does the 'products' table have in my PostgreSQL database?"
- **Check schema**: "Check if my schema has a not null constraint on the id column."
- **View columns**: "Show columns and types for 'customers' table in PostgreSQL."
- **Examine table**: "Get the structure of 'transactions' table in my PostgreSQL database."

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Subscription** | Required | The Azure subscription ID or name. |
| **Resource group** | Required | The name of the Azure resource group. |
| **User name** | Required | The user name to access PostgreSQL server. |
| **Server** | Required | The PostgreSQL server to be accessed. |
| **Database** | Required | The PostgreSQL database to be accessed. |
| **Table** | Required | The PostgreSQL table to be accessed. |

## Server: list servers

The Azure MCP Server can list all PostgreSQL servers in a subscription and resource group.

Example prompts include:

- **List servers**: "Show me all PostgreSQL servers in my resource group."
- **View servers**: "What PostgreSQL servers do I have in resource group 'my-rg'?"
- **Check servers**: "Check if my subscription has a server named 'xyz'"
- **Query servers**: "Show PostgreSQL servers in resource group 'dev-resources'."
- **Find servers**: "Get all PostgreSQL instances in my environment."

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Subscription** | Required | The Azure subscription ID or name. |
| **Resource group** | Required | The name of the Azure resource group. |
| **User name** | Required | The user name to access PostgreSQL server. |

## Server: get server configuration

The Azure MCP Server can retrieve the configuration of a PostgreSQL server.

Example prompts include:

- **View configuration**: "Show me the configuration of my PostgreSQL server."
- **Get settings**: "What are the settings of my PostgreSQL server 'pg-prod'?"
- **Check config**: "Check if my server configuration 'x' is set to 'y'"
- **View server params**: "Show me all configuration parameters of my PostgreSQL server."
- **Get server setup**: "What is the configuration of my PostgreSQL instance?"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Subscription** | Required | The Azure subscription ID or name. |
| **Resource group** | Required | The name of the Azure resource group. |
| **User name** | Required | The user name to access PostgreSQL server. |
| **Server** | Required | The PostgreSQL server to be accessed. |

## Server: get server parameter

The Azure MCP Server can retrieve a specific parameter of a PostgreSQL server.

Example prompts include:

- **View parameter**: "Show me the 'max_connections' parameter of my PostgreSQL server."
- **Get setting**: "What is the value of 'shared_buffers' in my PostgreSQL server?"
- **Check parameter**: "Check if my server parameter 'x' is set to 'y'"
- **View server param**: "Show me the 'work_mem' parameter value in my PostgreSQL server."
- **Get configuration value**: "What is the 'maintenance_work_mem' set to in my PostgreSQL instance?"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Subscription** | Required | The Azure subscription ID or name. |
| **Resource group** | Required | The name of the Azure resource group. |
| **User name** | Required | The user name to access PostgreSQL server. |
| **Server** | Required | The PostgreSQL server to be accessed. |
| **Param** | Required | The PostgreSQL parameter to be accessed. |

## Server: set server parameter

The Azure MCP Server can set or update a specific parameter on a PostgreSQL server. This allows you to configure server settings, optimize performance, and adjust database behavior according to your application requirements.

Example prompts include:

- **Update connection setting**: "Set the 'max_connections' parameter to '200' on my 'prod-postgres-server'"
- **Configure memory**: "Update the 'shared_buffers' parameter to '256MB' on server 'database-server-east'"
- **Adjust timeout**: "Set 'statement_timeout' to '30000' on my PostgreSQL server"
- **Configure logging**: "Update the 'log_statement' parameter to 'all' on server 'dev-postgres'"
- **Set maintenance parameter**: "Configure 'maintenance_work_mem' to '64MB' on my database server"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Subscription** | Required | The Azure subscription ID or name. |
| **Resource group** | Required | The name of the resource group containing the PostgreSQL server. |
| **User name** | Required | The user name to access the PostgreSQL server. |
| **Server** | Required | The PostgreSQL server name to configure. |
| **Param** | Required | The PostgreSQL parameter to be set. |
| **Value** | Required | The value to set for the parameter. |


## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
