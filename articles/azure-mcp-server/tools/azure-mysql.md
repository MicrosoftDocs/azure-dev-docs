---
title: Azure Database for MySQL Tools for Azure MCP Server
description: Learn how to manage Azure Database for MySQL with Azure MCP Server using natural language prompts.
keywords: azure mcp server, azmcp, mysql
author: diberry
ms.author: diberry
ms.date: 12/05/2025
content_well_notification: 
  - AI-contribution
ai-usage: ai-assisted
ms.topic: reference
ms.custom: 
  - build-2025
  - references_regions
--- 

# Azure Database for MySQL tools for Azure MCP Server overview

Azure MCP Server enables you to manage Azure Database for MySQL servers, databases, and tables using natural language prompts. Simplify MySQL resource management without complex syntax.

[Azure Database for MySQL](/azure/mysql/) is a fully managed relational database service powered by the MySQL community edition. Use it to host a MySQL database in Azure. It handles mission-critical workloads with predictable performance and dynamic scalability.

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]


## Database: list all databases

<!-- mysql database list -->

List all databases available on the specified Azure Database for MySQL Flexible Server instance. This command provides visibility into the database structure and helps you identify databases for connection and querying operations.

Example prompts include:

- **List databases**: "List all databases on server 'my-mysql-server' in resource group 'database-rg' with user 'dbadmin'"
- **Show databases**: "Show all databases on MySQL server 'prod-mysql-server' in resource group 'prod-rg' with user 'appuser'"
- **Filter by name**: "List databases on server 'dev-mysql-server' in resource group 'dev-rg' with user 'developer' that start with 'test'"
- **List in resource group**: "List databases on server 'analytics-mysql-server' in resource group 'analytics-rg' with user 'analyst'"
- **Show databases accessible by user**: "List databases accessible by user 'readonly' on server 'report-mysql-server' in resource group 'reporting-rg'"

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

- **Run a query**: "Run query 'SELECT id, name FROM customers WHERE status = 'Active' ORDER BY name LIMIT 50' on database 'salesdb' on server 'prod-mysql-server' in resource group 'sales-rg' with user 'appuser'"
- **Count rows**: "Run query SELECT COUNT(*) FROM orders WHERE status = 'completed' on database 'salesdb' on server 'prod-mysql-server' in resource group 'sales-rg' with user 'analyst'"
- **Filtered query**: "Run query 'SELECT name FROM users WHERE created_at > '2025-01-01' ORDER BY created_at LIMIT 25' on database 'appdb' on server 'app-mysql-server' in resource group 'app-rg' with user 'developer'"
- **Top products**: "Run query 'SELECT product_id, SUM(quantity) AS total FROM sales WHERE sale_date >= '2025-01-01' GROUP BY product_id ORDER BY total DESC LIMIT 10' on database 'analytics' on server 'analytics-mysql-server' in resource group 'analytics-rg' with user 'analyst'"
- **Distinct values**: "Run query 'SELECT DISTINCT category FROM products LIMIT 20' on database 'inventory' on server 'inventory-mysql-server' in resource group 'inventory-rg' with user 'readonly'"

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

- **Get server config**: "Get configuration details for server 'prod-mysql-server' in resource group 'database-rg' with user 'dbadmin'"
- **Show version and SKU**: "Show the MySQL engine version and SKU for server 'app-mysql-server' in resource group 'app-rg' with user 'developer'"
- **Get backup retention**: "What is the backup retention period for server 'backup-mysql-server' in resource group 'backup-rg' with user 'backup-admin'?"
- **Show storage allocation**: "Show storage allocation for server 'analytics-mysql-server' in resource group 'analytics-rg' with user 'analyst'"
- **Get full configuration**: "Get full configuration for server 'prod-mysql-server' in resource group 'prod-rg' with user 'sysadmin'"


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

- **List servers**: "List all MySQL Flexible Server instances in resource group 'database-rg' with user 'dbadmin'"
- **List servers in resource group**: "List MySQL servers in resource group 'prod-rg' with user 'sysadmin'"
- **Filter by region**: "Show MySQL servers in region 'eastus' in resource group 'eastus-rg' with user 'operator'"
- **Show server statuses**: "List servers along with their current status in resource group 'monitoring-rg' with user 'monitor'"
- **Find server by name**: "Find server named 'prod-mysql-server' in resource group 'prod-rg' with user 'developer'"

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

- **Get parameter value**: "Get the value of parameter 'max_connections' for server 'prod-mysql-server' in resource group 'database-rg' with user 'dbadmin'"
- **Check slow_query_log**: "Get parameter 'slow_query_log' on server 'analytics-mysql-server' in resource group 'analytics-rg' with user 'analyst'"
- **Get wait_timeout**: "Show the parameter 'wait_timeout' value for server 'app-mysql-server' in resource group 'app-rg' with user 'developer'"
- **Show buffer pool size**: "Get parameter 'innodb_buffer_pool_size' for server 'prod-mysql-server' in resource group 'prod-rg' with user 'sysadmin'"
- **Retrieve parameter before change**: "Retrieve parameter 'max_allowed_packet' on server 'perf-mysql-server' in resource group 'performance-rg' with user 'dba' before update"

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

- **Set parameter**: "Set parameter 'max_connections' to value '500' on server 'prod-mysql-server' in resource group 'database-rg' with user 'dbadmin'"
- **Enable slow query log**: "Set parameter 'slow_query_log' to value 'ON' on server 'analytics-mysql-server' in resource group 'analytics-rg' with user 'dba'"
- **Adjust timeout**: "Set parameter 'wait_timeout' to value '300' on server 'app-mysql-server' in resource group 'app-rg' with user 'sysadmin'"
- **Increase buffer pool**: "Set parameter 'innodb_buffer_pool_size' to value '2G' on server 'prod-mysql-server' in resource group 'prod-rg' with user 'dba'"
- **Change max allowed packet**: "Set parameter 'max_allowed_packet' to value '64M' on server 'perf-mysql-server' in resource group 'performance-rg' with user 'dbadmin'"

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

- **List tables**: "List all tables in database 'salesdb' on server 'prod-mysql-server' in resource group 'sales-rg' with user 'appuser'"
- **Show tables**: "What tables exist in database 'inventory' on server 'inventory-mysql-server' in resource group 'inventory-rg' with user 'developer'?"
- **Filter tables**: "List tables starting with 'tmp_' in database 'appdb' on server 'app-mysql-server' in resource group 'app-rg' with user 'developer'"
- **Count tables**: "How many tables are in database 'analytics' on server 'analytics-mysql-server' in resource group 'analytics-rg' with user 'analyst'?"
- **Find table**: "Find table 'orders' in database 'salesdb' on server 'sales-mysql-server' in resource group 'sales-rg' with user 'readonly'"

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

- **Get table schema**: "Show schema for table 'orders' in database 'salesdb' on server 'sales-mysql-server' in resource group 'sales-rg' with user 'developer'"
- **Get column list**: "List columns and data types for table 'customers' in database 'crm' on server 'crm-mysql-server' in resource group 'crm-rg' with user 'appuser'"
- **Show index information**: "Show indexes for table 'transactions' in database 'billing' on server 'billing-mysql-server' in resource group 'billing-rg' with user 'analyst'"
- **Find primary key**: "What is the primary key for table 'users' in database 'auth' on server 'auth-mysql-server' in resource group 'auth-rg' with user 'developer'?"
- **Show full definition**: "Get full table definition for table 'inventory_items' in database 'inventory' on server 'inventory-mysql-server' in resource group 'inventory-rg' with user 'readonly'"

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