---
title: Azure Database for MySQL Tools for Azure MCP Server
description: Learn how to manage Azure Database for MySQL with Azure MCP Server using natural language prompts.
keywords: azure mcp server, azmcp, mysql
author: diberry
ms.author: diberry
ms.date: 11/17/2025
content_well_notification: 
  - AI-contribution
ai-usage: ai-assisted
ms.topic: concept-article
ms.custom: build-2025
--- 

# Azure Database for MySQL tools for Azure MCP Server overview

Azure MCP Server enables you to manage Azure Database for MySQL servers, databases, and tables using natural language prompts. Simplify MySQL resource management without complex syntax.

[Azure Database for MySQL](/azure/mysql/) is a fully managed relational database service powered by the MySQL community edition. Use it to host a MySQL database in Azure. It handles mission-critical workloads with predictable performance and dynamic scalability.

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]


## Database: list all databases

<!-- mysql database list -->

List all databases available on the specified Azure Database for MySQL Flexible Server instance. This command provides visibility into the database structure and helps you identify databases for connection and querying operations.

Example prompts include:

- **List databases**: "List all databases on server 'my-mysql-server' in resource group 'my-resource-group'"
- **Show databases**: "Show all databases on MySQL server 'my-mysql-server' in resource group 'my-resource-group'"
- **Filter by name**: "List databases on 'my-mysql-server' in resource group 'my-resource-group' that start with 'test'"
- **List in resource group**: "List databases on server 'my-mysql-server' in resource group 'my-resource-group'"
- **Show databases accessible by user**: "List databases accessible by user 'dbadmin' on server 'my-mysql-server' in resource group 'my-resource-group'"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group** |  Required | The name of the Azure resource group. This is a logical container for Azure resources. |
| **User** |  Required | The user name to access the MySQL server. |
| **Server** |  Required | The MySQL server to be accessed. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [mysql database list](../includes/tools/annotations/azure-database-for-mysql-database-list-annotations.md)]

## Database: query

<!-- mysql database query -->

Execute a safe, read-only SQL SELECT query against a database on an Azure Database for MySQL Flexible Server. Use this tool to explore or retrieve table data without modifying it.

**Best practices:**  
- List only the needed columns (avoid `SELECT *`).  
- Add WHERE filters to narrow results.  
- Use LIMIT/OFFSET for paging.  
- Use ORDER BY for deterministic results.  
- Avoid returning unnecessary sensitive data.

**Allowed:**  
- Only single SELECT statements are allowed.  

**Not allowed:**  
- Non-SELECT statements (INSERT, UPDATE, DELETE, REPLACE, MERGE, TRUNCATE, ALTER, CREATE, DROP).  
- Multi-statements.  
- Comments that hide write operations.  
- Transaction control statements (BEGIN, COMMIT, ROLLBACK).  
- INTO OUTFILE and other destructive keywords.


**Example:**  
`SELECT ID, name, status FROM customers WHERE status = 'Active' ORDER BY name LIMIT 50;`

Example prompts include:

- **Run a query**: "Run SELECT id, name FROM customers WHERE status = 'Active' ORDER BY name LIMIT 50 on database 'salesdb' on server 'my-mysql-server' in resource group 'my-resource-group'"
- **Count rows**: "Run SELECT COUNT(*) FROM orders WHERE status = 'completed' on database 'salesdb' on server 'my-mysql-server' in resource group 'my-resource-group'"
- **Filtered query**: "Run SELECT name FROM users WHERE created_at > '2025-01-01' ORDER BY created_at LIMIT 25 on database 'appdb' on server 'my-mysql-server' in resource group 'my-resource-group'"
- **Top products**: "Run SELECT product_id, SUM(quantity) AS total FROM sales WHERE sale_date >= '2025-01-01' GROUP BY product_id ORDER BY total DESC LIMIT 10 on database 'analytics' on server 'my-mysql-server' in resource group 'my-resource-group'"
- **Distinct values**: "Run SELECT DISTINCT category FROM products LIMIT 20 on database 'inventory' on server 'my-mysql-server' in resource group 'my-resource-group'"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group** |  Required | The name of the Azure resource group. This is a logical container for Azure resources. |
| **User** |  Required | The user name to access the MySQL server. |
| **Server** |  Required | The MySQL server to be accessed. |
| **Database** |  Required | The MySQL database to be accessed. |
| **Query** |  Required | The SQL query to execute against a MySQL database. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [mysql database query](../includes/tools/annotations/azure-database-for-mysql-database-query-annotations.md)]

## Server: config get

<!-- mysql server config get -->

Retrieves comprehensive configuration details for the specified Azure Database for MySQL Flexible Server instance. This command provides insights into server settings, performance parameters, security configurations, and operational characteristics essential for database administration and optimization. It returns configuration data in JSON format, including `ServerName`, `Location`, `Version`, `SKU`, `StorageSizeGB`, `BackupRetentionDays`, and `GeoRedundantBackup` properties.

Example prompts include:

- **Get server config**: "Get configuration details for server 'my-mysql-server' in resource group 'my-resource-group'"
- **Show version and SKU**: "Show the MySQL engine version and SKU for server 'my-mysql-server' in resource group 'my-resource-group'"
- **Get backup retention**: "What is the backup retention period for server 'my-mysql-server' in resource group 'my-resource-group'?"
- **Show storage allocation**: "Show storage allocation for server 'my-mysql-server' in resource group 'my-resource-group'"
- **Get full configuration**: "Get full configuration for server 'my-mysql-server' in resource group 'my-resource-group'"


| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group** |  Required | The name of the Azure resource group. This is a logical container for Azure resources. |
| **User** |  Required | The user name to access the MySQL server. |
| **Server** |  Required | The MySQL server to be accessed. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [mysql server config get](../includes/tools/annotations/azure-database-for-mysql-server-config-get-annotations.md)]

## Server: list all instances in resource group

<!-- mysql server list -->

List all Azure Database for MySQL Flexible Server instances within the specified resource group. This command provides an inventory of available MySQL server resources, including their names and current status, so you can efficiently manage servers and plan resources.

Example prompts include:

- **List servers**: "List all MySQL Flexible Server instances in resource group 'my-resource-group'"
- **List servers in resource group**: "List MySQL servers in resource group 'my-resource-group'"
- **Filter by region**: "Show MySQL servers in region 'eastus' in resource group 'my-resource-group'"
- **Show server statuses**: "List servers along with their current status in resource group 'my-resource-group'"
- **Find server by name**: "Find server named 'my-mysql-server' in resource group 'my-resource-group'"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group** |  Required | The name of the Azure resource group. This is a logical container for Azure resources. |
| **User** |  Required | The user name to access the MySQL server. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [mysql server list](../includes/tools/annotations/azure-database-for-mysql-server-list-annotations.md)]

## Server: get parameter

<!-- mysql server param get -->

Retrieve the current value of a single server configuration parameter on an Azure Database for MySQL Flexible Server. Use this server command to inspect a setting, such as `max_connections`, `wait_timeout`, or `slow_query_log`, before changing it.

Example prompts include:

- **Get parameter value**: "Get the value of `max_connections` for server `my-mysql-server` in resource group 'my-resource-group'"
- **Check slow_query_log**: "Is `slow_query_log` enabled on server `my-mysql-server` in resource group 'my-resource-group'?"
- **Get wait_timeout**: "Show the `wait_timeout` value for server `my-mysql-server` in resource group 'my-resource-group'"
- **Show buffer pool size**: "Get `innodb_buffer_pool_size` for server `my-mysql-server` in resource group 'my-resource-group'"
- **Retrieve parameter before change**: "Retrieve `max_allowed_packet` on server `my-mysql-server` in resource group 'my-resource-group' before update"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group** |  Required | The name of the Azure resource group. This is a logical container for Azure resources. |
| **User** |  Required | The user name to access the MySQL server. |
| **Server** |  Required | The MySQL server to be accessed. |
| **Parameter** |  Required | The MySQL parameter to be accessed. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [mysql server param get](../includes/tools/annotations/azure-database-for-mysql-server-param-get-annotations.md)]

## Server: set parameter

<!-- mysql server param set -->

Sets or updates a MySQL server configuration parameter to a new value. Use this command to optimize performance, security, or operational behavior. This command enables fine-tuned configuration management with validation to ensure parameter changes are compatible with the server's current state and constraints.

Example prompts include:

- **Set parameter**: "Set `max_connections` to 500 on server `my-mysql-server` in resource group 'my-resource-group'"
- **Enable slow query log**: "Enable `slow_query_log` on server `my-mysql-server` in resource group 'my-resource-group'"
- **Adjust timeout**: "Set `wait_timeout` to 300 on server `my-mysql-server` in resource group 'my-resource-group'"
- **Increase buffer pool**: "Set `innodb_buffer_pool_size` to `2G` on server `my-mysql-server` in resource group 'my-resource-group'"
- **Change max allowed packet**: "Set `max_allowed_packet` to `64M` on server `my-mysql-server` in resource group 'my-resource-group'"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group** |  Required | The name of the Azure resource group. This is a logical container for Azure resources. |
| **User** |  Required | The user name to access MySQL server. |
| **Server** |  Required | The MySQL server to be accessed. |
| **Parameter** |  Required | The MySQL parameter to be accessed. |
| **Value** |  Required | The value to set for the MySQL parameter. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [mysql server param set](../includes/tools/annotations/azure-database-for-mysql-server-param-set-annotations.md)]

## Table: list all tables in database

<!-- mysql table list -->

Enumerate all tables within a specified database on an Azure Database for MySQL Flexible Server instance. This command provides a complete inventory of table objects, facilitating database exploration, schema analysis, and data architecture understanding for development tasks.

Example prompts include:

- **List tables**: "List all tables in database 'salesdb' on server 'my-mysql-server' in resource group 'my-resource-group'"
- **Show tables**: "What tables exist in database 'inventory' on server 'my-mysql-server' in resource group 'my-resource-group'?"
- **Filter tables**: "List tables starting with 'tmp_' in database 'appdb' on server 'my-mysql-server' in resource group 'my-resource-group'"
- **Count tables**: "How many tables are in database 'analytics' on server 'my-mysql-server' in resource group 'my-resource-group'?"
- **Find table**: "Find table named 'orders' in database 'salesdb' on server 'my-mysql-server' in resource group 'my-resource-group'"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group** |  Required | The name of the Azure resource group. This is a logical container for Azure resources. |
| **User** |  Required | The user name to access the MySQL server. |
| **Server** |  Required | The MySQL server to be accessed. |
| **Database** |  Required | The MySQL database to be accessed. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [mysql table list](../includes/tools/annotations/azure-database-for-mysql-table-list-annotations.md)]

## Table: get table schema 

<!-- mysql table schema get -->

Retrieve detailed schema information for a specific table within an Azure Database for MySQL Flexible Server database. This command provides comprehensive metadata including column definitions, data types, constraints, indexes, and relationships. This information is essential for understanding table structure and supporting application development.

Example prompts include:

- **Get table schema**: "Show schema for table 'orders' in database 'salesdb' on server 'my-mysql-server' in resource group 'my-resource-group'"
- **Get column list**: "List columns and data types for 'customers' in database 'crm' on server 'my-mysql-server' in resource group 'my-resource-group'"
- **Show index information**: "Show indexes for table 'transactions' in database 'billing' on server 'my-mysql-server' in resource group 'my-resource-group'"
- **Find primary key**: "What is the primary key for table 'users' in database 'auth' on server 'my-mysql-server' in resource group 'my-resource-group'?"
- **Show full definition**: "Get full table definition for 'inventory_items' in database 'inventory' on server 'my-mysql-server' in resource group 'my-resource-group'"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group** |  Required | The name of the Azure resource group. This is a logical container for Azure resources. |
| **User** |  Required | The user name to access the MySQL server. |
| **Server** |  Required | The MySQL server to be accessed. |
| **Database** |  Required | The MySQL database to be accessed. |
| **Table** |  Required | The MySQL table to be accessed. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [mysql table schema get](../includes/tools/annotations/azure-database-for-mysql-table-schema-get-annotations.md)]

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure Database for MySQL](/azure/mysql/)