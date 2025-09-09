---
title: Azure SQL Tools - Azure MCP Server
description: Learn how to use the Azure MCP Server with Azure SQL to manage your databases, servers, and other SQL resources.
keywords: azure mcp server, azmcp, azure sql, sql database, sql server
ai-usage: ai-assisted
content_well_notification: 
  - AI-contribution
author: diberry
ms.author: diberry
ms.service: azure-mcp-server
ms.topic: reference
ms.date: 09/03/2025
monikerRange: "= azuresql || = azuresql-db"
---

# Azure SQL tools for the Azure MCP Server

The Azure MCP Server lets you manage Azure resources, including Azure SQL databases and servers, using natural language prompts. This feature lets you quickly manage your database resources without remembering complex syntax.

[Azure SQL](/azure/azure-sql/) is a family of managed, secure, and intelligent products that use the SQL Server database engine in the Azure cloud. 

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]


## Database: List databases

<!-- `azmcp sql db list` -->

Lists all databases in your cloud resource with their configuration, status, SKU, and performance details. Use when you need to: view database inventory, check database status, compare database configurations, or find databases for management operations.

Example prompts include:
- **List databases**: "Show me all databases on my 'eastus-sql' server"
- **Database inventory**: "List databases in resource group 'data' and subscription 'corp-main'"
- **Check database status**: "What databases are currently active on my SQL server?"
- **Database overview**: "I need a quick overview of all databases hosted on our production SQL server for the upcoming team meeting"
- **Database configurations**: "Can you provide a detailed list of all databases on the 'analytics-sql' server, including their performance tiers, sizes, and current operational status?"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Server** |  Required |The name of the resource. |


## Database: Show database details

<!-- 
azmcp sql db show --subscription
-->

Retrieves detailed information about a specific database. Use this command to check the configuration, performance tier, size, and other characteristics of your database.

Example prompts include:

- **View database details**: "Show me details for the 'inventory' database on my 'eastus-sql' server"
- **Check database configuration**: "Can you tell me the specifications and current state of my customer-db database in the prod-dbs resource group and finance subscription?"
- **Database information**: "Database details... financial-data... need info now"
- **Check performance tier**: "What service tier is my analytics database using? And is it properly sized for our workload?"
- **Database properties**: "I want to see all performance metrics, sizing options, and configuration settings for the orders database hosted on commerce-sql-01 in the west-europe region"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Server** | Required | The name of the resource. |
| **Database** | Required | The name of the database on the resource. |

## Server: List Microsoft Entra administrators

<!-- 
azmcp sql server entra-admin list --subscription
-->

Lists Microsoft Entra ID administrators configured for a resource. Use this command to manage and audit identity-based access to your resource.

Example prompts include:

- **Check admin users**: "Show me all Microsoft Entra administrators for my 'prod-sql' server"
- **Identity access**: "List Microsoft Entra admins for SQL server 'finance-db' in resource group 'data' and subscription 'corp-main'"
- **Security check**: "Who has admin access to my SQL servers?"
- **Administrator review**: "Need to verify Entra ID admins on SQL server now"
- **Access audit**: "Could you please provide a comprehensive breakdown of all Microsoft Entra administrators assigned to my eastus-sql-02 server in the development environment for security compliance documentation?"


| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Server** | Required | The name of the resource. |

## Server: List firewall rules

<!-- 
azmcp sql firewall-rule list --subscription
-->

Lists all firewall rules for a specific resource. Use this command to manage and review the network access settings for your resource.

Example prompts include:

- **View firewall settings**: "Show me all firewall rules for my 'prod-sql-server' in resource group 'data'"
- **Check access controls**: "Are there any firewall rules for my analytics-db SQL server in the eastus region?"
- **Review security**: "IP addresses... SQL server eastus-sql-01... security review"
- **Network access**: "I need to immediately identify all network access points and IP address ranges that have been granted permissions to connect to our production SQL server environment for the compliance audit happening tomorrow"
- **Security audit**: "List the firewall rules for our finance-db server in resource group accounting and subscription finance-prod"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Server** | Required | The name of the resource. |


## Server: Create firewall rule

<!-- `azmcp sql server firewall-rule create` -->

Creates a firewall rule for a resource. Firewall rules control which IP addresses 
are allowed to connect to the resource. You can specify either a single IP address 
(by setting start and end IP to the same value) or a range of IP addresses. 

Example prompts include:
- **Add firewall rule**: "Create a firewall rule named 'office-access' for my 'prod-sql' server allowing IP range 192.168.1.1 to 192.168.1.100"
- **Set access range**: "I need to set a firewall rule on my 'analytics-sql' server to allow access from the IP range 10.0.0.1 to 10.0.0.255"


| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Server** |  Required | The name of the resource. |
| **Firewall rule** |  Required | The name of the firewall rule. |
| **Start ip address** |  Required | The start IP address of the firewall rule range. |
| **End ip address** |  Required | The end IP address of the firewall rule range. |



## Server: Delete firewall rule

<!-- `azmcp sql server firewall-rule delete` -->

Deletes a firewall rule from a resource. This operation removes the specified 
firewall rule, potentially restricting access for the IP addresses that were 
previously allowed by this rule. If the rule 
doesn't exist, no error is returned.

Example prompts include:
- **Remove firewall rule**: "Delete the firewall rule named 'office-access' from my 'prod-sql' server"
- **Revoke access**: "Revoke the firewall rule 'office-access' on my 'prod-sql' server"
- **Delete access rule**: "I need to delete the firewall rule named 'temp-access' from our 'test-sql' server to tighten security"
- **Security update**: "Please remove the firewall rule 'guest-access' from our development SQL server immediately to prevent unauthorized access"
- **Access control**: "Can you delete the firewall rule 'external-access' on our 'marketing-sql' server in the westus region?"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Server** |  Required | The name of the resource. |
| **Firewall rule** |  Required | The name of the firewall rule. |

## Elastic pools: List elastic pools

<!-- 
azmcp sql elastic-pool list --subscription
-->

Lists all elastic pools for a specific resource. Elastic pools are a resource allocation solution that lets you manage and scale multiple databases with varying resource demands.

Example prompts include:

- **View resource pools**: "Show me all elastic pools on my 'main-sql' server"
- **Check elasticity**: "Could you list any elastic pools we have running on our customer-db SQL server in the production environment?"
- **Resource management**: "Elastic pools... SQL server... need status report"
- **Pool inventory**: "I need a complete inventory of every single elastic pool deployed across all our SQL servers in the dev-subscription, including their DTU allocation, storage limits, and current database count"
- **Database scaling**: "What's the current configuration and available capacity in the analytics elastic pool on our main SQL server in resource group data-services?"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Server** | Required | The name of the resource. |

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure SQL Database documentation](/azure/azure-sql/database/)

