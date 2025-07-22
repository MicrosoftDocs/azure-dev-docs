---
title: Azure SQL Tools - Azure MCP Server
description: Learn how to use the Azure MCP Server with Azure SQL to manage your databases, servers, and other SQL resources.
keywords: azure mcp server, azmcp, azure sql, sql database, sql server
ms.service: azure-mcp-server
ms.topic: reference
---

# Azure SQL tools for the Azure MCP Server

The Azure MCP Server lets you manage Azure resources, including Azure SQL databases and servers, using natural language prompts. This lets you quickly manage your database resources without remembering complex syntax.

[Azure SQL](/azure/azure-sql/) is a family of managed, secure, and intelligent products that use the SQL Server database engine in the Azure cloud. Azure SQL includes Azure SQL Database, Azure SQL Managed Instance, and SQL Server on Azure VMs, providing flexible options for migrating, modernizing, and developing applications.

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## Server


### List Microsoft Entra administrators

<!-- 
azmcp sql server entra-admin list --subscription
-->

Lists Microsoft Entra ID administrators configured for an Azure SQL server. Use this command to manage and audit identity-based access to your SQL servers.

Example prompts include:

- **Check admin users**: "Show me all Microsoft Entra administrators for my 'prod-sql' server"
- **Identity access**: "List Microsoft Entra admins for SQL server 'finance-db' in resource group 'data' and subscription 'corp-main'"
- **Security check**: "Who has admin access to my SQL servers?"
- **Administrator review**: "Need to verify Entra ID admins... SQL server... urgent"
- **Access audit**: "Could you please provide a comprehensive breakdown of all Microsoft Entra administrators assigned to my eastus-sql-02 server in the development environment for security compliance documentation?"


| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| Subscription | Required | The ID or name of your Azure subscription containing the SQL server. |
| Resource group | Required | The resource group containing the SQL server. |
| Server name | Required | The name of the SQL server to list Microsoft Entra administrators for. |

## Database 

### Show database details

<!-- 
azmcp sql db show --subscription
-->

Retrieves detailed information about a specific Azure SQL database. Use this command to examine the configuration, performance tier, size, and other characteristics of your database.

Example prompts include:

- **View database details**: "Show me details for the 'inventory' database on my 'eastus-sql' server"
- **Check database configuration**: "Can you tell me the specifications and current state of my customer-db database in the prod-dbs resource group and finance subscription?"
- **Database information**: "Database details... financial-data... need info now"
- **Check performance tier**: "What service tier is my analytics database using? And is it properly sized for our workload?"
- **Database properties**: "I want to see all performance metrics, sizing options, and configuration settings for the orders database hosted on commerce-sql-01 in the west-europe region"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| Subscription | Required | The ID or name of your Azure subscription containing the SQL database. |
| Resource group | Required | The resource group containing the SQL server and database. |
| Server name | Required | The name of the SQL server hosting the database. |
| Database name | Required | The name of the database to retrieve details for. |


## Firewall rules

### List firewall rules

<!-- 
azmcp sql firewall-rule list --subscription
-->

Lists all firewall rules for a specific Azure SQL server. Use this command to manage and review the network access settings for your SQL server.

Example prompts include:

- **View firewall settings**: "Show me all firewall rules for my 'prod-sql-server' in resource group 'data'"
- **Check access controls**: "Are there any firewall rules for my analytics-db SQL server in the eastus region?"
- **Review security**: "IP addresses... SQL server eastus-sql-01... security review"
- **Network access**: "I need to immediately identify all network access points and IP address ranges that have been granted permissions to connect to our production SQL server environment for the compliance audit happening tomorrow"
- **Security audit**: "List the firewall rules for our finance-db server in resource group accounting and subscription finance-prod"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| Subscription | Required | The ID or name of your Azure subscription containing the SQL server. |
| Resource group | Required | The resource group containing the SQL server. |
| Server name | Required | The name of the SQL server to list firewall rules for. |

## Elastic pools

### List elastic pools

<!-- 
azmcp sql elastic-pool list --subscription
-->

Lists all elastic pools for a specific Azure SQL server. Elastic pools are a resource allocation solution that let you manage and scale multiple databases with varying resource demands.

Example prompts include:

- **View resource pools**: "Show me all elastic pools on my 'main-sql' server"
- **Check elasticity**: "Could you list any elastic pools we have running on our customer-db SQL server in the production environment?"
- **Resource management**: "Elastic pools... SQL server... need status report"
- **Pool inventory**: "I need a complete inventory of every single elastic pool deployed across all our SQL servers in the dev-subscription, including their DTU allocation, storage limits, and current database count"
- **Database scaling**: "What's the current configuration and available capacity in the analytics elastic pool on our main SQL server in resource group data-services?"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| Subscription | Required | The ID or name of your Azure subscription containing the SQL server. |
| Resource group | Required | The resource group containing the SQL server. |
| Server name | Required | The name of the SQL server to list elastic pools for. |

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure SQL Database documentation](/azure/azure-sql/database/)
