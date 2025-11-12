---
title: Azure SQL Tools - Azure MCP Server
description: "Learn how to use Azure MCP Server with Azure SQL Database to manage databases, servers, and firewall rules. Complete reference guide with examples."
keywords: azure mcp server, azmcp, azure sql, sql database, sql server
ai-usage: ai-assisted
content_well_notification: 
  - AI-contribution
author: diberry
ms.author: diberry
ms.service: azure-mcp-server
ms.topic: reference
ms.date: 10/27/2025
---

# Azure SQL tools for the Azure MCP Server

The Azure MCP Server lets you manage Azure SQL Database resources by using natural language prompts. This Azure SQL tools reference provides comprehensive commands for managing databases, servers, firewall rules, and elastic pools without complex syntax.

[Azure SQL Database](/azure/azure-sql/database) is a fully managed platform as a service (PaaS) database engine that handles most database management functions such as upgrading, patching, backups, and monitoring without user involvement.

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## Database: Create database

<!-- sql db create -->

Create a new database on an existing Azure SQL Server. This command creates a database with configurable performance tiers, size limits, and other settings.

Example prompts include:

- **Create database**: "Create a new SQL database named 'sales-data' in server 'prod-sql-server'"
- **Specify tier**: "Create a SQL database 'inventory' with Basic tier in server 'eastus-sql'"
- **Resource group**: "Create a new database called 'customer-info' on SQL server 'analytics-sql' in resource group 'data-services'"


| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Server** |  Required | The Azure SQL Server name. |
| **Database** |  Required | The Azure SQL Database name. |
| **SKU name** |  Optional | The SKU name for the database (for example, `Basic`, `S0`, `P1`, `GP_Gen5_2`). |
| **SKU tier** |  Optional | The SKU tier for the database (for example, `Basic`, `Standard`, `Premium`, `GeneralPurpose`). |
| **SKU capacity** |  Optional | The SKU capacity (DTU or vCore count) for the database. |
| **Collation** |  Optional | The collation for the database (for example, `SQL_Latin1_General_CP1_CI_AS`). |
| **Max size bytes** |  Optional | The maximum size of the database in bytes. |
| **Elastic pool name** |  Optional | The name of the elastic pool to assign the database to. |
| **Zone redundant** |  Optional | Whether the database should be zone redundant. |
| **Read scale** |  Optional | Read scale option for the database (`Enabled` or `Disabled`). |

[Tool annotation hints](index.md#tool-annotation-hints):

[!INCLUDE [sql db create](../includes/tools/annotations/azure-sql-database-db-create-annotations.md)]

## Database: Delete database

<!-- sql db delete -->

Delete a SQL database.

Example prompts include:

- **Delete database**: "Delete the SQL database 'sales-data' from server 'prod-sql-server'"
- **Remove from resource group**: "Remove database 'inventory' from SQL server 'eastus-sql' in resource group 'data-services'"
- **Delete by name**: "Delete the database called 'customer-info' on server 'analytics-sql'"


| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Server** |  Required | The Azure SQL Server name. |
| **Database** |  Required | The Azure SQL Database name. |

[Tool annotation hints](index.md#tool-annotation-hints):

[!INCLUDE [sql db delete](../includes/tools/annotations/azure-sql-database-db-delete-annotations.md)]

## Database: List databases

<!-- sql db list -->

Lists all databases in your cloud resource with their configuration, status, SKU, and performance details. Use when you need to: view database inventory, check database status, compare database configurations, or find databases for management operations.

Example prompts include:

- **List databases**: "Show me all databases on my 'eastus-sql' server"
- **Database inventory**: "List databases in resource group 'data' and subscription 'corp-main' and 'eastus-sql' server"
- **Check database status**: "What databases are currently active on my 'eastus-sql' server?"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Server** |  Required |The name of the resource. |

[Tool annotation hints](index.md#tool-annotation-hints):

[!INCLUDE [sql db list](../includes/tools/annotations/azure-sql-database-db-list-annotations.md)]

## Database: Rename database

<!-- sql db rename -->

Rename an existing database to a new name within the same Azure SQL server.

Example prompts include:

- **Rename database**: "Rename the SQL database 'sales-data' on server 'prod-sql-server' to 'sales-archive'"
- **Rename with explicit server**: "Rename my Azure SQL database 'inventory' to 'inventory-2025' on server 'eastus-sql'"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Server** |  Required | The Azure SQL Server name. |
| **Database** |  Required | The Azure SQL Database name. |
| **New database name** |  Required | The new name for the Azure SQL Database. |

[Tool annotation hints](index.md#tool-annotation-hints):

[!INCLUDE [sql db rename](../includes/tools/annotations/azure-sql-database-db-rename-annotations.md)]

## Database: Show database details

<!-- sql db show -->

Retrieves detailed information about a specific database. Use this command to check the configuration, performance tier, size, and other characteristics of your database.

Example prompts include:

- **View database details**: "Show me details for the 'inventory' database on my 'eastus-sql' server"
- **Check database configuration**: "Can you tell me the specifications and current state of my customer-db database on server 'prod-sql-server'?"
- **Check performance tier**: "What service tier for server 'prod-sql-server' is my analytics database using?"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Server** | Required | The name of the resource. |
| **Database** | Required | The name of the database on the resource. |

[Tool annotation hints](index.md#tool-annotation-hints):

[!INCLUDE [sql db show](../includes/tools/annotations/azure-sql-database-db-show-annotations.md)]

## Database: Update database

<!-- sql db update -->

Update configuration settings for an existing Azure SQL Database. 

Example prompts include:

- **Update performance tier**: "Update the performance tier of SQL database 'sales-data' on server 'prod-sql-server'"
- **Scale database SKU**: "Scale SQL database 'inventory' on server 'eastus-sql' to use S3 SKU"
- **Change database settings**: "Update the Azure SQL database 'analytics' to use Premium tier on server 'eastus-sql'"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Server** |  Required | The Azure SQL Server name. |
| **Database** |  Required | The Azure SQL Database name. |
| **SKU name** |  Optional | The SKU name for the database (for example, `Basic`, `S0`, `P1`, `GP_Gen5_2`). |
| **SKU tier** |  Optional | The SKU tier for the database (for example, `Basic`, `Standard`, `Premium`, `GeneralPurpose`). |
| **SKU capacity** |  Optional | The SKU capacity (DTU or vCore count) for the database. |
| **Collation** |  Optional | The collation for the database (for example, `SQL_Latin1_General_CP1_CI_AS`). |
| **Max size bytes** |  Optional | The maximum size of the database in bytes. |
| **Elastic pool name** |  Optional | The name of the elastic pool to assign the database to. |
| **Zone redundant** |  Optional | Whether the database should be zone redundant. |
| **Read scale** |  Optional | Read scale option for the database (`Enabled` or `Disabled`). |

[Tool annotation hints](index.md#tool-annotation-hints):

[!INCLUDE [sql db update](../includes/tools/annotations/azure-sql-database-db-update-annotations.md)]

## Server authentication: List Microsoft Entra administrators

<!-- sql server entra-admin list -->

Lists Microsoft Entra ID administrators configured for an Azure SQL server. Use this command to manage and audit identity-based access to your resource.

Example prompts include:

- **Check admin users**: "Show me all Microsoft Entra administrators for my 'prod-sql' server"
- **Identity access**: "List Microsoft Entra admins for SQL server 'finance-db' in resource group 'data'"
- **Security check**: "Who has admin access to server 'prod-sql-server'?"


| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Server** | Required | The name of the Azure SQL Server resource. |

[Tool annotation hints](index.md#tool-annotation-hints):

[!INCLUDE [sql server entra-admin list](../includes/tools/annotations/azure-sql-database-server-entra-admin-list-annotations.md)]

## Server: Create server

<!-- sql server create -->

Creates a new Azure SQL server in the specified resource group and location.

Example prompts include:

- **Create SQL server**: "Create a new Azure SQL server named 'prod-sql-server' in resource group 'data-services' with admin user 'sqladmin' and password 'MyStr0ngP@ssw0rd!' in East US"
- **Specify admin user**: "Create an Azure SQL server with name 'eastus-sql' in location 'East US' with admin user 'sqladmin' and password 'SecureP@ss123!'"
- **Set up server in resource group**: "Set up a new SQL server called 'analytics-sql' for admin user 'sqladmin' with password 'Analytics2024!' in West US 2 in my resource group 'analytics-group' with public network access enabled"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Server** |  Required | The name of the Azure SQL Server resource. |
| **Administrator user** |  Required | The administrator login name for the SQL server. |
| **Administrator password** |  Required | The administrator password for the SQL server. |
| **Location** |  Required | The Azure region location where the SQL server is created. |
| **Version** |  Optional | The version of SQL Server to create (for example, `12.0`). |
| **Public network access** |  Optional | Whether public network access is enabled for the SQL server (`Enabled` or `Disabled`). |

[Tool annotation hints](index.md#tool-annotation-hints):

[!INCLUDE [sql server create](../includes/tools/annotations/azure-sql-database-server-create-annotations.md)]

## Server: Delete server

<!-- sql server delete -->

Deletes an Azure SQL server and all of its databases from the specified resource group.

Example prompts include:

- **Delete SQL server**: "Delete the Azure SQL server 'prod-sql-server' from resource group 'data-services'"
- **Remove from subscription**: "Remove the SQL server 'test-sql-server' from my subscription"
- **Permanent delete**: "Delete SQL server 'analytics-sql' permanently"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Server** |  Required | The name of the Azure SQL Server resource. |
| **Force** |  Optional | Force delete the server without confirmation prompts. |

[Tool annotation hints](index.md#tool-annotation-hints):

[!INCLUDE [sql server delete](../includes/tools/annotations/azure-sql-database-server-delete-annotations.md)]

## Server: List servers

<!-- sql server list -->

Lists Azure SQL servers within a resource group. 

Example prompts include:

- **List SQL servers**: "List all Azure SQL servers in resource group 'data-services'"
- **Show all servers**: "Show me every SQL server available in resource group 'analytics-group'"
- **Server inventory**: "What SQL servers do I have in my subscription?"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Resource group** | Optional | The resource group to filter servers by. |

[Tool annotation hints](index.md#tool-annotation-hints):

[!INCLUDE [sql server list](../includes/tools/annotations/azure-sql-database-server-list-annotations.md)]

## Server: Show server details

<!-- sql server show -->

Retrieves detailed information about an Azure SQL server including its configuration,
status, and properties such as the fully qualified domain name, version,
administrator login, and network access settings.

Example prompts include:

- **Show server details**: "Show me the details of Azure SQL server 'prod-sql-server' in resource group 'data-services'"
- **Get configuration**: "Get the configuration details for SQL server 'analytics-sql'"
- **Display properties**: "Display the properties of SQL server 'eastus-sql'"


| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Server** |  Required | The name of the Azure SQL Server resource. |

[Tool annotation hints](index.md#tool-annotation-hints):

[!INCLUDE [sql server show](../includes/tools/annotations/azure-sql-database-server-show-annotations.md)]

## Server firewall: List rules

<!-- sql firewall-rule list -->

Lists all firewall rules for a specific resource. Use this command to manage and review the network access settings for your resource.

Example prompts include:

- **View firewall settings**: "Show me all firewall rules for my 'prod-sql-server' in resource group 'data'"
- **Check access controls**: "Are there any firewall rules for my analytics-db SQL server?"
- **Security audit**: "List the firewall rules for our finance-db server in resource group accounting"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Server** | Required | The name of the Azure SQL Server resource. |

[Tool annotation hints](index.md#tool-annotation-hints):

[!INCLUDE [sql server firewall-rule list](../includes/tools/annotations/azure-sql-database-server-firewall-rule-list-annotations.md)]

## Server firewall: Create rule

<!-- sql server firewall-rule create -->

Creates a firewall rule for a resource. Firewall rules control which IP addresses 
are allowed to connect to the resource. You can specify either a single IP address 
(by setting start and end IP to the same value) or a range of IP addresses. 

Example prompts include:

- **Add firewall rule**: "Create a firewall rule named 'office-access' for my 'prod-sql' server allowing IP range 192.168.1.1 to 192.168.1.100"
- **Set access range**: "I need to set a 'test' firewall rule on my 'analytics-sql' server to allow access from IP range 10.0.0.1 to 10.0.0.255"
- **Allow single IP**: "Create a firewall rule 'allow-single-ip' to allow access from IP address 203.0.113.5 to my 'production-uswest' SQL server"


| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Server** |  Required | The name of the Azure SQL Server resource. |
| **Firewall rule** |  Required | The name of the firewall rule. |
| **Start ip address** |  Required | The start IP address of the firewall rule range. |
| **End ip address** |  Required | The end IP address of the firewall rule range. |

[Tool annotation hints](index.md#tool-annotation-hints):

[!INCLUDE [sql server firewall-rule create](../includes/tools/annotations/azure-sql-database-server-firewall-rule-create-annotations.md)]

## Server firewall: Delete rule

<!-- sql server firewall-rule delete -->

Deletes a firewall rule from a resource. This operation removes the specified firewall rule, potentially restricting access for the IP addresses that were previously allowed by this rule. If the rule doesn't exist, no error is returned.

Example prompts include:

- **Remove firewall rule**: "Delete the firewall rule named 'office-access' from my 'prod-sql' server"
- **Revoke access**: "Revoke the firewall rule 'temp-access' on my 'test-sql' server"
- **Delete access rule**: "Remove the firewall rule 'guest-access' from our development SQL server"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Server** |  Required | The name of the Azure SQL Server resource. |
| **Firewall rule** |  Required | The name of the firewall rule. |

[Tool annotation hints](index.md#tool-annotation-hints):

[!INCLUDE [sql server firewall-rule delete](../includes/tools/annotations/azure-sql-database-server-firewall-rule-delete-annotations.md)]

## Elastic pools: List elastic pools

<!-- sql elastic-pool list -->

Lists all elastic pools for a specific resource. Elastic pools are a resource allocation solution that lets you manage and scale multiple databases with varying resource demands.

Example prompts include:

- **View resource pools**: "Show me all elastic pools on my 'main-sql' server"
- **Check elasticity**: "List any elastic pools we have running on our customer-db SQL server"
- **Pool inventory**: "What elastic pools are deployed on our SQL servers in the dev-subscription?"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Server** | Required | The name of the Azure SQL Server resource. |

[Tool annotation hints](index.md#tool-annotation-hints):

[!INCLUDE [sql elastic-pool list](../includes/tools/annotations/azure-sql-database-elastic-pool-list-annotations.md)]

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure SQL Database documentation](/azure/azure-sql/database/)

