---
title: Azure SQL Tools - Azure MCP Server
description: Learn how to use the Azure MCP Server with Azure SQL to manage your databases, servers, and other SQL resources.
keywords: azure mcp server, azmcp, azure sql, sql database, sql server
ms.service: azure-mcp-server
ms.topic: reference
---

# Azure SQL tools for the Azure MCP Server

The Azure MCP Server allows you to manage Azure resources, including Azure SQL databases and servers using natural language prompts. This enables you to quickly manage your database resources without remembering complex syntax.

[Azure SQL](/azure/azure-sql/) is a family of managed, secure, and intelligent products that use the SQL Server database engine in the Azure cloud. Azure SQL includes Azure SQL Database, Azure SQL Managed Instance, and SQL Server on Azure VMs, providing flexible options for migrating, modernizing, and developing applications.

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## Server


### List Microsoft Entra administrators

<!-- 
azmcp sql server entra-admin list --subscription
-->

Lists Microsoft Entra ID (formerly Azure Active Directory) administrators configured for an Azure SQL server. This command helps you manage and audit identity-based access to your SQL servers.

Example prompts include:

- **Check admin users**: "Show me all Microsoft Entra administrators for my 'prod-sql' server"
- **Identity access**: "List the Microsoft Entra admins for SQL server 'finance-db' in resource group 'data'"
- **Security check**: "Who has admin access to my SQL server through Microsoft Entra ID?"
- **Administrator review**: "Show me the Microsoft Entra administrators for SQL server in 'prod-rg'"
- **Access audit**: "List all Microsoft Entra ID admins on my 'eastus-sql' server"


| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| Subscription | Required | The ID or name of the subscription containing the SQL server. |
| Resource group | Required | The resource group containing the SQL server. |
| Server name | Required | The name of the SQL server to list Microsoft Entra administrators for. |

## Database 

### Show database details

<!-- 
azmcp sql db show --subscription
-->

Retrieves detailed information about a specific Azure SQL database. This command allows you to examine the configuration, performance tier, size, and other characteristics of your database.

Example prompts include:

- **View database details**: "Show me details for the 'inventory' database on my 'eastus-sql' server"
- **Check database configuration**: "What are the specs of my 'customer-db' database in resource group 'prod-dbs'?"
- **Database information**: "Show me the details of the SQL database 'financial-data' in subscription 'dev'"
- **Check performance tier**: "What service tier is my 'analytics' database using?"
- **Database properties**: "Get details for SQL database 'orders' on server 'commerce-sql-01'"
## List firewall rules

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| Subscription | Required | The ID or name of the subscription containing the SQL database. |
| Resource group | Required | The resource group containing the SQL server and database. |
| Server name | Required | The name of the SQL server hosting the database. |
| Database name | Required | The name of the database to retrieve details for. |


## Firewall rules

### List firewall rules

<!-- 
azmcp sql firewall-rule list --subscription
-->

Lists all firewall rules for a specific Azure SQL server. This command helps you manage and review the network access settings for your SQL server.

Example prompts include:

- **View firewall settings**: "Show me all firewall rules for my 'prod-sql-server' in resource group 'data'"
- **Check access controls**: "List the firewall rules for SQL server 'analytics-db' in my subscription"
- **Review security**: "What IP addresses are allowed to connect to my SQL server 'eastus-sql-01'?"
- **Network access**: "Show me who can access my SQL server in the production resource group"
- **Security audit**: "List all IP ranges with access to SQL server 'finance-db'"
## List elastic pools

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| Subscription | Required | The ID or name of the subscription containing the SQL server. |
| Resource group | Required | The resource group containing the SQL server. |
| Server name | Required | The name of the SQL server to list firewall rules for. |

## Elastic pools

### List elastic pools

<!-- 
azmcp sql elastic-pool list --subscription
-->

Lists all elastic pools for a specific Azure SQL server. Elastic pools are a resource allocation solution that helps you manage and scale multiple databases with varying resource demands.

Example prompts include:

- **View resource pools**: "Show me all elastic pools on my 'main-sql' server"
- **Check elasticity**: "List the elastic pools for SQL server 'customer-db' in resource group 'prod'"
- **Resource management**: "What elastic pools do I have on my SQL server in the east US region?"
- **Pool inventory**: "Show me all SQL elastic pools in subscription 'dev-subscription'"
- **Database scaling**: "List elastic pools and their configurations on server 'analytics-sql'"
## List Microsoft Entra administrators

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| Subscription | Required | The ID or name of the subscription containing the SQL server. |
| Resource group | Required | The resource group containing the SQL server. |
| Server name | Required | The name of the SQL server to list elastic pools for. |



## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure SQL Database documentation](/azure/azure-sql/database/)
