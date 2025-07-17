---
title: Use Azure MCP with SQL Database
description: This article shows how to use Azure MCP to interact with Azure SQL Database using natural language commands.
ms.topic: how-to
ms.date: July 17, 2025
author: mcp-author
ms.author: mcp-author
ms.reviewer: mcp-reviewer
ms.service: azure-mcp-server
---

# Use Azure MCP with Azure SQL Database

This article describes how to use Azure MCP to work with Azure SQL Database using natural language commands.

## Prerequisites

- [Azure subscription](https://azure.microsoft.com/free/)
- [Azure MCP Server](../install-mcp-server.md)
- At least one Azure SQL Database or server
- Appropriate permissions to query and manage SQL resources

## Overview

Azure MCP provides several commands to interact with Azure SQL Database, allowing you to:

1. Get detailed information about your databases
2. List Microsoft Entra ID administrators for your SQL servers
3. Query your databases using SQL commands

## SQL Database commands

### Get database details

Use the `azmcp-sql-db-show` command to retrieve detailed information about a specific Azure SQL Database.

#### Command syntax

```
azmcp-sql-db-show --subscription <subscriptionId> --resource-group <resourceGroupName> --server <serverName> --database <databaseName>
```

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| subscription | string | Yes | The Azure subscription ID or name |
| resource-group | string | Yes | The name of the resource group containing the SQL server |
| server | string | Yes | The Azure SQL Server name |
| database | string | Yes | The Azure SQL Database name |

#### Response

The command returns detailed database information including:

- SKU name and tier
- Status and state
- Storage configuration
- Collation settings
- Creation date
- Max size in bytes
- Zone redundancy settings
- Network access type
- Backup storage redundancy
- License type
- Storage account type

### List Microsoft Entra administrators

Use the `azmcp-sql-server-entraadmin-list` command to retrieve a list of all Microsoft Entra ID administrators configured for a specific SQL server.

#### Command syntax

```
azmcp-sql-server-entraadmin-list --subscription <subscriptionId> --resource-group <resourceGroupName> --server <serverName>
```

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| subscription | string | Yes | The Azure subscription ID or name |
| resource-group | string | Yes | The name of the resource group containing the SQL server |
| server | string | Yes | The Azure SQL Server name |

#### Response

The command returns an array of Microsoft Entra ID administrator objects with properties such as:

- Administrator type
- Administrator principal type
- Login
- SID
- Tenant ID
- Azure Active Directory only authentication setting

## Example prompts

Here are some example natural language prompts you can use with Azure MCP to interact with SQL Database:

- "Show me the details for my SQL database 'myDatabase' on server 'myServer'"
- "List all Microsoft Entra administrators for my SQL server 'myServer'"
- "Get information about my SQL database 'contosodb' in resource group 'rg-contoso'"
- "Check if Azure Active Directory authentication is enabled on my SQL server 'sqlserver123'"
- "Show me the storage capacity and tier for my SQL database 'salesdb'"
- "What's the backup redundancy setting for my database 'financedb'?"

## Best practices

When working with SQL Database in Azure MCP:

1. Always specify the full resource path (subscription, resource group, server, and database) for precise targeting
2. Use Microsoft Entra ID authentication when possible for enhanced security
3. Review database performance metrics periodically 
4. Ensure proper backup and redundancy settings for critical databases
5. Set up auditing on your SQL servers for security monitoring

## Next steps

- [Learn more about Azure SQL Database](https://learn.microsoft.com/en-us/azure/azure-sql/database/sql-database-paas-overview)
- [Secure your Azure SQL Database](https://learn.microsoft.com/en-us/azure/azure-sql/database/security-overview)
- [Monitor Azure SQL Database performance](https://learn.microsoft.com/en-us/azure/azure-sql/database/monitor-tune-overview)
- [Query data in Azure SQL Database](https://learn.microsoft.com/en-us/azure/azure-sql/database/connect-query-content-reference-guide)
