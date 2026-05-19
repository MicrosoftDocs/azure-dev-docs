---
title: Azure MCP Server tools for Azure SQL Database
description: "Use Azure MCP Server tools to manage Azure SQL databases, servers, elastic pools, and firewall rules with natural language prompts from your IDE."
ai-usage: ai-assisted
content_well_notification: 
  - AI-contribution
author: diberry
ms.author: diberry
reviewer: akromm
ms.service: azure-mcp-server
ms.topic: concept-article
ms.date: 04/09/2026
tool_count: 13
mcp-cli.version: 2.0.0-beta.31
---

# Azure MCP Server tools for Azure SQL Database

The Azure MCP Server lets you manage Azure SQL Database resources, including creating, deleting, updating, and listing databases, with natural language prompts.

Azure SQL Database is a relational database service in the Microsoft Azure cloud that provides high availability, scalability, and security. For more information, see [Azure SQL Database documentation](/azure/sql-database/).

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## Create SQL Database

<!-- @mcpcli sql db create -->

Create a new Azure SQL Database on an existing SQL Server. Create a database with configurable performance tiers, size limits, and other settings. It returns the newly created database information, including configuration details.

Example prompts include:
- "Create a SQL database named 'my-database' with SKU tier Premium in server 'my-sql-server'."
- "Create a new SQL database called 'products-db' in resource group 'my-resource-group' on server 'my-sql-server'."
- "Create a SQL database 'reports-db' with a maximum size of 2GB in server 'my-sql-server'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Database name** |  Required | The Azure SQL Database name. |
| **Resource group** |  Required | The name of the Azure resource group. This is a logical container for Azure resources. |
| **Server name** |  Required | The Azure SQL Server name. |
| **Collation** |  Optional | The collation for the database (for example, `SQL_Latin1_General_CP1_CI_AS`). |
| **Elastic pool name** |  Optional | The name of the elastic pool to assign the database to. |
| **Max size bytes** |  Optional | The maximum size of the database in bytes. |
| **Read scale** |  Optional | Read scale option for the database (Enabled or Disabled). |
| **SKU capacity** |  Optional | The SKU capacity (DTU or vCore count) for the database. |
| **SKU name** |  Optional | The SKU name for the database (for example, `Basic`, `S0`, `P1`, `GP_Gen5_2`). |
| **SKU tier** |  Optional | The SKU tier for the database (for example, `Basic`, `Standard`, `Premium`, `GeneralPurpose`). |
| **Zone redundant** |  Optional | Indicates whether the database should be zone redundant. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ✅ | Idempotent: ❌ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

## Create SQL Server

<!-- @mcpcli sql server create -->

Create a new Azure SQL server in the specified resource group and location. The server is configured with the provided administrator credentials and optional settings. The command returns the created server along with its properties, including the fully qualified domain name.

Example prompts include:
- "Create an Azure SQL server named 'my-sql-server' in location 'eastus' with admin login 'sqladmin'."
- "Set up a new SQL server called 'prod-sql-server' in resource group 'my-resource-group' with your administrator password."
- "Create a SQL server with name 'dev-sql-server' in resource group 'dev-resource-group' located in 'westus2'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Administrator login** |  Required | The administrator login name for the SQL server. |
| **Administrator password** |  Required | The administrator password for the SQL server. |
| **Location** |  Required | The Azure region where the SQL server will be created. |
| **Resource group** |  Required | The name of the Azure resource group, which is a logical container for Azure resources. |
| **Server name** |  Required | The Azure SQL Server name. |
| **Public network access** |  Optional | Whether public network access is enabled for the SQL server (`Enabled` or `Disabled`). |
| **Version** |  Optional | The version of SQL Server to create (currently only `12.0` is supported). |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ✅ | Idempotent: ❌ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

## Create SQL Server firewall rule

<!-- @mcpcli sql server firewall-rule create -->

Creates a firewall rule for an Azure SQL Server. Firewall rules control which IP addresses are allowed to connect to the SQL Server. You can specify either a single IP address (by setting the start and end IP to the same value) or a range of IP addresses. This command returns the created firewall rule with its properties.

Example prompts include:
- "Create a firewall rule named 'allow-office-ip' for SQL Server 'my-sql-server' in resource group 'my-resource-group'."
- "Add a firewall rule for SQL Server 'my-sql-server' allowing IP range '203.0.113.0' to '203.0.113.255'."
- "Create a new firewall rule for Azure SQL Server 'prod-sql-server' with IP limits from '198.51.100.0' to '198.51.100.255'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **End IP address** |  Required | The end IP address of the firewall rule range. |
| **Firewall rule name** |  Required | The name of the firewall rule. |
| **Resource group** |  Required | The name of the Azure resource group. This is a logical container for Azure resources. |
| **Server name** |  Required | The Azure SQL Server name. |
| **Start IP address** |  Required | The start IP address of the firewall rule range. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ✅ | Idempotent: ❌ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

## Delete SQL Database

<!-- @mcpcli sql db delete -->

Deletes a database from an Azure SQL Server. This idempotent operation removes the specified database from the server, returning `Deleted = false` if the database doesn't exist or `Deleted = true` if it was successfully removed.

Example prompts include:
- "Delete the SQL database 'my-database' from server 'my-sql-server'."
- "Remove the database 'old-database' from resource group 'my-resource-group' on server 'my-sql-server'."
- "Delete the database 'test-database' from SQL server 'dev-sql-server'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Database name** |  Required | The Azure SQL Database name. |
| **Resource group** |  Required | The name of the Azure resource group. This is a logical container for Azure resources. |
| **Server name** |  Required | The Azure SQL Server name. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ✅ | Idempotent: ✅ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

## Delete SQL Server

<!-- @mcpcli sql server delete -->

Remove the specified Azure SQL server from your Azure subscription, including all associated databases. This operation permanently deletes all server data and cannot be reversed. Use `force` to bypass confirmation.

Example prompts include:
- "Delete SQL server 'my-sql-server' in resource group 'my-resource-group'."
- "Remove the Azure SQL server 'old-sql-server' from my resource group."
- "Permanently delete SQL server 'test-sql-server' without confirmation."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group** |  Required | The name of the Azure resource group. This is a logical container for Azure resources. |
| **Server name** |  Required | The Azure SQL Server name. |
| **Force** |  Optional | Force delete the server without confirmation prompts. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ✅ | Idempotent: ✅ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

## Delete SQL Server firewall rule

<!-- @mcpcli sql server firewall-rule delete -->

Delete a firewall rule from an Azure SQL Server. This operation removes the specified firewall rule, which may restrict access for the IP addresses that were previously allowed by this rule. The operation is idempotent; if the rule does not exist, no error is returned.

Example prompts include:
- "Delete the firewall rule 'allow-office-ip' from resource group 'my-resource-group' in SQL server 'my-sql-server'."
- "Remove firewall rule 'temp-access-rule' for SQL server 'my-sql-server' in resource group 'my-resource-group'."
- "Delete firewall rule 'old-firewall-rule' from my SQL server 'dev-sql-server'."

| Parameter | Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Firewall rule name** | Required | The name of the firewall rule. |
| **Resource group** | Required | The name of the Azure resource group. This is a logical container for Azure resources. |
| **Server name** | Required | The Azure SQL Server name. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ✅ | Idempotent: ✅ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

## Get Azure SQL Database details

<!-- @mcpcli sql db get -->

Retrieve information about Azure SQL databases in a SQL Server. You can show details for a specific Azure SQL database by name or list all Azure SQL databases within the specified SQL Server. This tool provides database information, including configuration details and current status.

Example prompts include:
- "List all databases in resource group 'my-rg' for server 'my-server'."
- "Get details for the Azure SQL database 'my-database' in resource group 'my-rg' and server 'my-server'."
- "Show all Azure SQL databases in resource group 'my-rg' within server 'my-server'."
- "Retrieve the Azure SQL database 'my-database' from resource group 'my-rg' in server 'my-server'."

| Parameter | Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group** | Required | The name of the Azure resource group. This is a logical container for Azure resources. |
| **Server name** | Required | The Azure SQL Server name. |
| **Database name** | Optional | The Azure SQL Database name. |


[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Get elastic pool list

<!-- @mcpcli sql elastic-pool list -->

Lists all SQL elastic pools in an Azure SQL Server, including their SKU, capacity, state, and database limits. You can view the elastic pool inventory, check pool utilization, compare pool configurations, or find available pools for database placement. The tool returns a JSON array of elastic pools with complete configuration details.

Example prompts include:
- "List all elastic pools in resource group 'my-resource-group' for SQL server 'my-sql-server'."
- "Show me the elastic pools in resource group 'prod-resource-group' for SQL server 'prod-sql-server'."
- "What elastic pools exist in my SQL server 'dev-sql-server' under resource group 'dev-resource-group'?"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group** |  Required | The name of the Azure resource group. This is a logical container for Azure resources. |
| **Server name** |  Required | The Azure SQL Server name. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Get firewall rule list

<!-- @mcpcli sql server firewall-rule list -->

Retrieve a list of firewall rules for an Azure SQL Server. This command retrieves all firewall rules configured for the specified SQL server, including their IP address ranges and rule names. It returns an array of firewall rule objects with their properties.

Example prompts include:
- "List all firewall rules in resource group 'my-resource-group' for SQL server 'my-sql-server'."
- "Show me the firewall rules in resource group 'prod-resource-group' for SQL server 'prod-sql-server'."
- "What firewall rules are set for SQL server 'dev-sql-server' in resource group 'dev-resource-group'?"

| Parameter       | Required or optional | Description                                                                        |
|------------------|----------------------|------------------------------------------------------------------------------------|
| **Resource group** | Required             | The name of the Azure resource group. This is a logical container for Azure resources. |
| **Server name**        | Required             | The name of the Azure SQL Server.                                                  |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Get SQL server information

<!-- @mcpcli sql server get -->

Retrieve details about Azure SQL servers in a resource group. Display information for a specific Azure SQL server by name or list all Azure SQL servers within the specified resource group. It returns comprehensive server information, including configuration details and the current state.

Example prompts include:
- "List all Azure SQL servers in resource group 'my-resource-group'."
- "Show me every Azure SQL server in resource group 'prod-resource-group'."
- "Show me the details of Azure SQL server 'my-sql-server'."
- "Get information for Azure SQL server 'prod-sql-server'."
- "Display the properties of Azure SQL server 'dev-sql-server'."

| Parameter         | Required or optional | Description |
|-------------------|----------------------|-------------|
| **Resource group** | Required             | The name of the Azure resource group. This is a logical container for Azure resources. |
| **Server name**        | Optional             | The Azure SQL server name. |


[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## List Microsoft Entra ID administrators

<!-- @mcpcli sql server entra-admin list -->

List the Microsoft Entra ID administrators configured for a SQL server. This command retrieves all Entra ID administrators, including their display names, object IDs, and tenant information.

Example prompts include:

- "List Microsoft Entra ID administrators for SQL server 'prod-sql-server' in resource group 'prod-resource-group'."
- "Show me the Entra ID administrators configured for SQL server 'dev-sql-server' in resource group 'dev-resource-group'."
- "What Microsoft Entra ID administrators are set up for my SQL server 'analytics-sql-server' in resource group 'data-resource-group'?"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Resource group** | Required | The name of the Azure resource group. |
| **Server name** | Required | The Azure SQL Server name (for example, `prod-sql-server`). |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Rename SQL Database

<!-- @mcpcli sql db rename -->

Renames an existing Azure SQL Database to a new name within the same SQL Server. This command changes the database resource's identifier while preserving its configuration and data. It returns the updated database information with the new name.

Example prompts include:
- "Rename the database 'my-database' on server 'my-sql-server' to 'my-database-v2' in resource group 'my-resource-group'."
- "Rename my SQL database 'old-database' to 'new-database' on server 'prod-sql-server'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Database name** |  Required | The Azure SQL Database name. |
| **New database name** |  Required | The new name for the Azure SQL Database. |
| **Resource group** |  Required | The name of the Azure resource group. This is a logical container for Azure resources. |
| **Server name** |  Required | The Azure SQL Server name. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ✅ | Idempotent: ❌ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

## Update SQL Database

<!-- @mcpcli sql db update -->

Scale and configure Azure SQL Database performance settings. Update an existing database's SKU, compute tier, storage capacity, or redundancy options to meet changing performance requirements. This command returns the updated database configuration, including applied scaling changes.

Example prompts include:
- "Change the collation of SQL database 'my-database' on server 'my-sql-server' in resource group 'my-resource-group'."
- "Update SQL database 'my-database' on server 'my-sql-server' to have a maximum size of 2GB."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Database name** |  Required | The Azure SQL Database name. |
| **Resource group** |  Required | The name of the Azure resource group. This is a logical container for Azure resources. |
| **Server name** |  Required | The Azure SQL Server name. |
| **Collation** |  Optional | The collation for the database (for example, `SQL_Latin1_General_CP1_CI_AS`). |
| **Elastic pool name** |  Optional | The name of the elastic pool to assign the database to. |
| **Max size bytes** |  Optional | The maximum size of the database in bytes. |
| **Read scale** |  Optional | Read scale option for the database (Enabled or Disabled). |
| **SKU capacity** |  Optional | The SKU capacity (DTU or vCore count) for the database. |
| **SKU name** |  Optional | The SKU name for the database (for example, `Basic`, `S0`, `P1`, `GP_Gen5_2`). |
| **SKU tier** |  Optional | The SKU tier for the database (for example, `Basic`, `Standard`, `Premium`, `GeneralPurpose`). |
| **Zone redundant** |  Optional | Whether the database should be zone redundant. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ✅ | Idempotent: ✅ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure SQL Database documentation](/azure/sql-database/)