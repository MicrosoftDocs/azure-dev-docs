---

title: Azure MCP Server tools for Azure Database for MySQL
description: Use Azure MCP Server tools to manage Azure Database for MySQL Flexible Server resources with natural language prompts from your IDE.
ms.date: 04/07/2026
ms.service: azure-mcp-server
ms.topic: concept-article
tool_count: 6
mcp-cli.version: 2.0.0-beta.39
author: diberry
ms.author: diberry
reviewer: mattkohnms 
ai-usage: ai-generated
ms.custom: build-2025
content_well_notification:
  - AI-contribution
---

# Azure MCP Server tools for Azure Database for MySQL

The Azure MCP Server tools help you manage Azure Database for MySQL servers, databases, configuration settings, and schemas. You can use the tools to get and list servers and databases, query table schemas and data, and set server parameters by using natural language prompts.

Azure Database for MySQL is a managed relational database service based on the MySQL community edition. For more information, see [Azure Database for MySQL documentation](/azure/mysql/).

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]


## Get MySQL servers databases

<!-- @mcpcli mysql list -->

List Azure Database for MySQL servers, databases, or tables in your subscription. By default, this tool returns all servers. Specify the `server` parameter to list databases on a server, or specify both the `server` and `database` parameters to list tables in a database.

Example prompts include:

- "List all MySQL servers in resource group 'rg-prod' with user name 'dbadmin'."
- "Show me my MySQL servers for resource group 'web-rg' using user name 'mysqluser'."
- "What MySQL servers are in resource group 'rg-staging' for user name 'adminuser'?"
- "List all MySQL databases in server 'mysql-server-01' within resource group 'rg-prod' using user name 'dbadmin'."
- "Show me the MySQL databases on server 'mysql-dbserver' for resource group 'rg-dev' with user name 'mysqluser'."
- "List all tables in MySQL database 'salesdb' on server 'mysql-server-01' in resource group 'rg-prod' using user name 'dbadmin'."
- "Show me the tables in database 'inventory' on server 'mysql-dbserver' for resource group 'rg-test' with user name 'mysqluser'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group** |  Required | The name of the Azure resource group that contains the resources. |
| **User name** |  Required | The user name to access the Azure Database for MySQL server. |
| **Database name** |  Optional | The name of the Azure Database for MySQL database to list tables from. Requires the Server name parameter. |
| **Server name** |  Optional | The name of the Azure Database for MySQL server to list databases from. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

Examples

- List all Azure Database for MySQL servers in subscription 'contoso-subscription' and resource group 'prod-rg'.
- List databases on server 'mysql-prod-01' in resource group 'prod-rg'.
- List tables in database 'salesdb' on server 'mysql-prod-01' in resource group 'prod-rg'.

## Query MySQL database

<!-- @mcpcli mysql database query -->

The Model Context Protocol (MCP) tool runs a safe, read-only SQL `SELECT` query against an Azure Database for MySQL Flexible Server database. Use this tool to retrieve or inspect table data without modifying it. The tool rejects non-`SELECT` statements such as `INSERT`, `UPDATE`, `DELETE`, `REPLACE`, `MERGE`, `TRUNCATE`, `ALTER`, `CREATE`, and `DROP`. It also rejects multistatements, comments that hide writes, transaction control (`BEGIN`/`COMMIT`/`ROLLBACK`), `INTO OUTFILE`, and other destructive keywords. This tool executes only a single `SELECT` statement to ensure data integrity.

For best results, list the columns you need instead of using `SELECT *`. Add `WHERE` filters, use `LIMIT`/`OFFSET` for paging, and add `ORDER BY` for deterministic results. Avoid returning unnecessary sensitive data.

Example prompts include:

- "Execute query 'SELECT id, name, email FROM customers WHERE id > 100 ORDER BY name LIMIT 50' on database 'ecommerce_db' in resource group 'rg-prod' on server 'mysql-prod-server' as user 'readonlyuser'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Database name** |  Required | The MySQL database to access. |
| **Query** |  Required | Query to execute against a MySQL database. |
| **Resource group** |  Required | The name of the Azure resource group. This resource group is a logical container for Azure resources. |
| **Server name** |  Required | The MySQL server to access. |
| **User name** |  Required | The user name to access MySQL server. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Get server config

<!-- @mcpcli mysql server config get -->

This tool is part of the Model Context Protocol (MCP) tools. It retrieves comprehensive configuration details for a specified Azure Database for MySQL Flexible Server instance. The tool returns server settings, performance parameters, security configurations, and operational characteristics that help you manage and optimize the database. Output is JSON and includes ServerName, Location, Version, SKU, StorageSizeGB, BackupRetentionDays, and GeoRedundantBackup.

Example prompts include:

- "Show me the configuration of MySQL server 'mysql-prod' in resource group 'rg-prod' with user 'dbadmin'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group** |  Required | The name of the Azure resource group that contains the server. |
| **Server name** |  Required | The name of the Azure Database for MySQL Flexible Server instance. |
| **User name** |  Required | The user name to authenticate to the server. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌


## Get server parameter

<!-- @mcpcli mysql server param get -->

This Model Context Protocol (MCP) tool retrieves the current value of a single server configuration parameter on Azure Database for MySQL Flexible Server. Use this tool to inspect a setting, such as `max_connections`, `wait_timeout`, or `slow_query_log`, before you change it. This tool requires a user account with sufficient privileges to read server parameters.

Example prompts include:

- "Show me the value of parameter 'connection_timeout' in resource group 'rg-prod' for MySQL server 'my-mysql-server' with user name 'dbadmin'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Parameter** |  Required | The MySQL parameter to access. |
| **Resource group** |  Required | The name of the Azure resource group. This resource group is a logical container for Azure resources. |
| **Server name** |  Required | The MySQL server to access. |
| **User name** |  Required | The user name to access MySQL server. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Update server parameter

<!-- @mcpcli mysql server param set -->

This tool, part of the Model Context Protocol (MCP), updates a single configuration setting on an Azure Database for MySQL server. You specify the resource group, server name, user name, and the value to set.

Example prompts include:

- "Set parameter 'connection_timeout' to value '20' on server name 'mysql-prod' in resource group 'rg-prod' with user name 'dbadmin'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Parameter** |  Required | The MySQL parameter to access. |
| **Resource group** |  Required | The name of the Azure resource group. This resource group is a logical container for Azure resources. |
| **Server name** |  Required | The MySQL server to access. |
| **User name** |  Required | The user name to access MySQL server. |
| **Value** |  Required | The value to set for the MySQL parameter. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ✅ | Idempotent: ✅ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

Examples

- Set `autocommit` to 'ON' for server 'my-mysql-server' in resource group 'prod-rg' using user 'dbadmin'.
- Set `slow_query_log` to 'ON' for server 'analytics-db' in resource group 'analytics-rg' using user 'monitor'.
- Set `max_connections` to '200' for server 'web-db-server' in resource group 'web-rg' using user 'dbadmin'.

## Get table schema

<!-- @mcpcli mysql table schema get -->

This Model Context Protocol (MCP) tool retrieves detailed schema information for a specific table in an Azure Database for MySQL Flexible Server instance. It returns comprehensive metadata, including column definitions, data types, constraints, indexes, and relationships. This metadata helps you understand table structure and supports application development.

Example prompts include:

- "Show the schema of table 'orders' in database 'salesdb' on server 'mysql-prod' within resource group 'rg-db-prod' as user 'dbadmin'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Database name** |  Required | The MySQL database to access. |
| **Resource group** |  Required | The name of the Azure resource group that contains the server. |
| **Server name** |  Required | The MySQL server that hosts the database. |
| **Table name** |  Required | The table to retrieve schema information for. |
| **User name** |  Required | The user name to authenticate to the MySQL server. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure Database for MySQL documentation](/azure/mysql/)
