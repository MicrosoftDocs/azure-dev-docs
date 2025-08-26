---
title: Azure Database for MySQL tools
description: Learn how to use the Azure MCP Server with Azure Database for MySQL.
keywords: azure mcp server, azmcp, mysql
author: diberry
ms.author: diberry
ms.date: 08/26/2025
content_well_notification: 
  - AI-contribution
ai-usage: ai-assisted
ms.topic: reference
ms.custom: build-2025
--- 

# Azure Database for MySQL tools for the Azure MCP Server

Azure MCP Server helps you manage Azure resources, including Azure Database for MySQL servers, databases, and tables, using natural language prompts. It lets you manage MySQL resources quickly without remembering complex syntax.

[Azure Database for MySQL](/azure/mysql/) is a fully managed relational database service powered by the MySQL community edition. Use it to host a MySQL database in Azure. It handles mission-critical workloads with predictable performance and dynamic scalability.

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]


## Database: list

List all databases available on the specified Azure Database for MySQL Flexible Server instance. This command provides visibility into the database structure and helps you identify databases for connection and querying operations.

- **List databases**: "List all databases on server 'my-mysql-server'."
- **Show databases**: "Show all databases on MySQL server 'my-mysql-server'."
- **Filter by name**: "List databases on 'my-mysql-server' that start with 'test'."
- **List in resource group**: "List databases on server 'my-mysql-server' in resource group 'my-resource-group'."
- **Show databases accessible by user**: "List databases accessible by user 'dbadmin' on server 'my-mysql-server'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **User** |  Required | The user name to access the MySQL server. |
| **Server** |  Required | The MySQL server to be accessed. |

## Database: query

Execute a safe, read-only SQL SELECT query against a database on an Azure Database for MySQL Flexible Server. Use this tool to explore or retrieve table data without modifying it.

**Restrictions:**  
- Only single SELECT statements are allowed.  
- Non-SELECT statements (INSERT, UPDATE, DELETE, REPLACE, MERGE, TRUNCATE, ALTER, CREATE, DROP) are rejected.  
- Multi-statements are not permitted.  
- Comments that hide write operations are not allowed.  
- Transaction control statements (BEGIN, COMMIT, ROLLBACK) are rejected.  
- INTO OUTFILE and other destructive keywords are not permitted.

**Best practices:**  
- List only the needed columns (avoid `SELECT *`).  
- Add WHERE filters to narrow results.  
- Use LIMIT/OFFSET for paging.  
- Use ORDER BY for deterministic results.  
- Avoid returning unnecessary sensitive data.

**Example:**  
`SELECT ID, name, status FROM customers WHERE status = 'Active' ORDER BY name LIMIT 50;`
Example prompts include:

- **Run a query**: "Run SELECT id, name FROM customers WHERE status = 'Active' ORDER BY name LIMIT 50 on database 'salesdb' on server 'my-mysql-server'."
- **Count rows**: "Run SELECT COUNT(*) FROM orders WHERE status = 'completed' on database 'salesdb' on server 'my-mysql-server'."
- **Filtered query**: "Run SELECT name, email FROM users WHERE created_at > '2025-01-01' LIMIT 25 on database 'appdb' on server 'my-mysql-server'."
- **Top products**: "Run SELECT product_id, SUM(quantity) AS total FROM sales GROUP BY product_id ORDER BY total DESC LIMIT 10 on database 'analytics' on server 'my-mysql-server'."
- **Distinct values**: "Run SELECT DISTINCT category FROM products LIMIT 20 on database 'inventory' on server 'my-mysql-server'."


#### Parameters with Natural Language Names

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **User** |  Required | The user name to access the MySQL server. |
| **Server** |  Required | The MySQL server to be accessed. |
| **Database** |  Required | The MySQL database to be accessed. |
| **Query** |  Required | The SQL query to execute against a MySQL database. |

## Server: config get

Retrieves comprehensive configuration details for the specified Azure Database for MySQL Flexible Server instance. This command provides insights into server settings, performance parameters, security configurations, and operational characteristics essential for database administration and optimization. It returns configuration data in JSON format, including ServerName, Location, Version, SKU, StorageSizeGB, BackupRetentionDays, and GeoRedundantBackup properties.

Example prompts include:

- **Get server config**: "Get configuration details for server 'my-mysql-server'."
- **Show version and SKU**: "Show the MySQL engine version and SKU for server 'my-mysql-server'."
- **Get backup retention**: "What is the backup retention period for server 'my-mysql-server'?"
- **Show storage allocation**: "Show storage allocation for server 'my-mysql-server'."
- **Get full configuration**: "Get full configuration for server 'my-mysql-server'."


| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **User** |  Required | The user name to access the MySQL server. |
| **Server** |  Required | The MySQL server to be accessed. |

## Server: list all instances in resource group

List all Azure Database for MySQL Flexible Server instances within the specified resource group. This command provides an inventory of available MySQL server resources, including their names and current status, enabling efficient server management and resource planning.

Example prompts include:

- **List servers**: "List all MySQL Flexible Server instances in my subscription."
- **List servers in resource group**: "List MySQL servers in resource group 'prod-rg'."
- **Filter by region**: "Show MySQL servers in region 'eastus'."
- **Show server statuses**: "List servers along with their current status."
- **Find server by name**: "Find server named 'my-mysql-server'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **User** |  Required | The user name to access the MySQL server. |

## Server: get parameter

Retrieve the current value of a single server configuration parameter on an Azure Database for MySQL Flexible Server. Use this to inspect a setting (for example, max_connections, wait_timeout, slow_query_log) before changing it.

Example prompts include:

- **Get parameter value**: "Get the value of 'max_connections' for server 'my-mysql-server'."
- **Check slow_query_log**: "Is slow_query_log enabled on server 'my-mysql-server'?"
- **Get wait_timeout**: "Show the wait_timeout value for server 'my-mysql-server'."
- **Show buffer pool size**: "Get innodb_buffer_pool_size for server 'my-mysql-server'."
- **Retrieve parameter before change**: "Retrieve max_allowed_packet on server 'my-mysql-server' before update."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **User** |  Required | The user name to access the MySQL server. |
| **Server** |  Required | The MySQL server to be accessed. |
| **Parameter** |  Required | The MySQL parameter to be accessed. |


## Server: set parameter

Sets or updates a MySQL server configuration parameter to a new value to optimize performance, security, or operational behavior. This command enables fine-tuned configuration management with validation to ensure parameter changes are compatible with the server's current state and constraints.

Example prompts include:

- **Set parameter**: "Set max_connections to 500 on server 'my-mysql-server'."
- **Enable slow query log**: "Enable slow_query_log on server 'my-mysql-server'."
- **Adjust timeout**: "Set wait_timeout to 300 on server 'my-mysql-server'."
- **Increase buffer pool**: "Set innodb_buffer_pool_size to '2G' on server 'my-mysql-server'."
- **Change max allowed packet**: "Set max_allowed_packet to '64M' on server 'my-mysql-server'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **User** |  Required | The user name to access the MySQL server. |
| **Server** |  Required | The MySQL server to be accessed. |
| **Parameter** |  Required | The MySQL parameter to be accessed. |
| **Value** |  Required | The value to set for the MySQL parameter. |


## Table: list all tables in database

Enumerate all tables within a specified database on an Azure Database for MySQL Flexible Server instance. This command provides a complete inventory of table objects, facilitating database exploration, schema analysis, and data architecture understanding for development tasks.

Example prompts include:

- **List tables**: "List all tables in database 'salesdb'."
- **Show tables**: "What tables exist in database 'inventory'?"
- **Filter tables**: "List tables starting with 'tmp_' in database 'appdb'."
- **Count tables**: "How many tables are in database 'analytics'?"
- **Find table**: "Find table named 'orders' in database 'salesdb'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **User** |  Required | The user name to access the MySQL server. |
| **Server** |  Required | The MySQL server to be accessed. |
| **Database** |  Required | The MySQL database to be accessed. |

## Table: get schema 

Retrieve detailed schema information for a specific table within an Azure Database for MySQL Flexible Server database. This command provides comprehensive metadata including column definitions, data types, constraints, indexes, and relationships, essential for understanding table structure and supporting application development.

Example prompts include:

- **Get table schema**: "Show schema for table 'orders' in database 'salesdb'."
- **Get column list**: "List columns and data types for 'customers' in database 'crm'."
- **Show index information**: "Show indexes for table 'transactions' in database 'billing'."
- **Find primary key**: "What is the primary key for table 'users' in database 'auth'?"
- **Show full definition**: "Get full table definition for 'inventory_items' in database 'inventory'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **User** |  Required | The user name to access the MySQL server. |
| **Server** |  Required | The MySQL server to be accessed. |
| **Database** |  Required | The MySQL database to be accessed. |
| **Table** |  Required | The MySQL table to be accessed. |

