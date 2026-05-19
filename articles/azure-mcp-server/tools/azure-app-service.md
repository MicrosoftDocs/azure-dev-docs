---
title: Azure MCP Server tools for Azure App Service
description: Use Azure MCP Server tools to manage Azure App Service resources, including web apps and APIs, with natural language prompts from your IDE.
author: diberry
ms.author: diberry
ms.service: azure-mcp-server
ms.topic: concept-article
ms.date: 03/19/2026
content_well_notification:
  - AI-contribution
ai-usage: ai-assisted
tool_count: 7
mcp-cli.version: 2.0.0-beta.29+a69a87b82c6e5ae613659f0dfa7dda63fa2c15fa
---

# Azure MCP Server tools for Azure App Service

The Azure Model Context Protocol (MCP) Server lets you manage Azure App Service resources with natural language prompts. You can deploy and update web apps and APIs, configure app settings, diagnose runtime issues, and list or retrieve app details.

Azure App Service is a fully managed platform for building, deploying, and scaling web apps and APIs; for more information, see [Azure App Service documentation](/azure/app-service/).

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## Add database connection

<!-- @mcpcli appservice database add -->

This tool adds a database connection to an Azure App Service by using the connection string for an existing database. It configures the App Service's connection settings so the app can access the specified database and database server. If you don't provide a connection string, the tool generates a default connection string. 

Example prompts include:

- "Add database 'ordersdb' of database type 'SqlServer' with database server 'contoso-sql.database.windows.net' to app 'webapp-prod' in resource group 'rg-prod'."
- "Configure database 'userdb' database type 'MySQL' on database server 'contoso-mysql.mysql.database.azure.com' for app 'api-staging' in resource group 'rg-staging'."
- "Connect database 'appdata' database type 'PostgreSQL' with database server 'pgserver.postgres.database.azure.com' to app 'backend-app' in resource group 'rg-backend'."
- "Add CosmosDB database 'catalogdb' database type 'CosmosDB' with database server 'contoso-cosmos.documents.azure.com' to app 'ecommerce-app' in resource group 'rg-ecommerce'."
- "Add database 'inventory' of database type 'SqlServer' on database server 'adventure-works-sql.database.windows.net' to app 'inventory-service' in resource group 'rg-inventory'."
- "Configure database 'analytics' database type 'PostgreSQL' on database server 'contoso-pg.postgres.database.azure.com' for app 'analytics-api' in resource group 'rg-analytics' using connection string 'Server=tcp:contoso-pg.postgres.database.azure.com;Database=analytics;User Id=\<your-username\>;Password=\<your-password\>'."
- "Add database 'customers' database type 'MySQL' with database server 'adventure-works-mysql.mysql.database.azure.com' to app 'crm-web' in resource group 'rg-crm' using connection string 'Server=adventure-works-mysql.mysql.database.azure.com;Database=customers;Uid=\<your-username\>;Pwd=\<your-password\>'."
- "Connect database 'sessiondb' database type 'CosmosDB' on database server 'fabrikam-cosmos.documents.azure.com' to app 'session-service' in resource group 'rg-session'."
- "Set up database 'orders' database type 'SqlServer' on database server 'fabrikam-sql.database.windows.net' for app 'order-processor' in resource group 'rg-orders'."
- "Configure database 'logs' database type 'PostgreSQL' on database server 'fabrikam-pg.postgres.database.azure.com' for app 'logger-app' in resource group 'rg-logging' with connection string 'Host=fabrikam-pg.postgres.database.azure.com;Database=logs;Username=\<your-username\>;Password=\<your-password\>'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **App** |  Required | The name of the Azure App Service (for example, `my-webapp`). |
| **Database** |  Required | The name of the database to connect to (for example, mydb). |
| **Database server** |  Required | The server name or endpoint for the database (for example, contoso-server.database.windows.net). |
| **Database type** |  Required | The type of database:`SqlServer`, `MySQL`, `PostgreSQL`, and `Cosmos DB`. |
| **Resource group** |  Required | The name of the Azure resource group. This resource group is a logical container for Azure resources. |
| **Connection string** |  Optional | The connection string for the database. If not provided, a default is generated. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ❌ | Open World: ✅ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

## Diagnose web app

<!-- @mcpcli appservice webapp diagnostic diagnose -->

This tool runs a specified detector on an Azure App Service web app and returns the detector's diagnostic results. The output includes the detector results and related diagnostic data to help you investigate app health and behavior.

Example prompts include:

- "Diagnose web app 'webapp-prod' in resource group 'rg-prod' with detector 'Availability'."
- "Diagnose web app 'my-webapp' in resource group 'webapp-dev' with detector 'CpuAnalysis' between '2025-03-01T00:00:00Z' and '2025-03-01T01:00:00Z' with interval 'PT5M'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **App** |  Required | The name of the Azure App Service (for example, `my-webapp`). |
| **Detector name** |  Required | The name of the diagnostic detector to run (for example, `Availability`, `CpuAnalysis`, `MemoryAnalysis`). |
| **Resource group** |  Required | The name of the Azure resource group. This resource group is a logical container for Azure resources. |
| **End time** |  Optional | The end time in ISO format (for example, `2023-01-01T00:00:00Z`). |
| **Interval** |  Optional | The time interval (for example, `PT1H` for 1 hour, `PT5M` for 5 minutes). |
| **Start time** |  Optional | The start time in ISO format (for example, `2023-01-01T00:00:00Z`). |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Get deployment details

<!-- @mcpcli appservice webapp deployment get -->

This tool retrieves detailed information about deployments in an Azure App Service web app. It returns metadata such as deployment name, whether the deployment is active, start and end times, who authored and performed the deployment, and the deployment type. 

Example prompts include:

- "List the deployments for web app 'webapp-prod' in resource group 'rg-prod'."
- "Get the deployment 'd4f8c9a2-1b3e-4c5d-9f7a-123456abcdef' for web app 'webapp-prod' in resource group 'rg-prod'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **App** |  Required | The name of the Azure App Service (for example, `my-webapp`). |
| **Resource group** |  Required | The name of the Azure resource group. This resource group is a logical container for Azure resources. |
| **Deployment ID** |  Optional | The ID of the deployment. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Get web app details

<!-- @mcpcli appservice webapp get -->

Retrieves detailed information about Azure App Service web apps, including app name, resource group, location, runtime stack, state, and hostnames. 

Example prompts include:

- "List the web apps in my subscription."
- "Show me the web apps in resource group 'rg-prod'."
- "Get the details for web app 'api-staging' in resource group 'rg-staging'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **App** |  Optional | The name of the Azure App Service web app (for example, `contoso-webapp`). This tool returns details for a specific web app when you provide the `App` name; if you don't provide an `App`, it returns information for all web apps in the subscription or for the specified `resource group` and `subscription`. |
| **Resource group** |  Optional | The name of the Azure resource group. This resource group is a logical container for Azure resources. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Get app settings

<!-- @mcpcli appservice webapp settings get-appsettings -->

This tool retrieves the application settings for an Azure App Service web app and returns key-value pairs for each setting. App settings can include connection strings and other sensitive values, so treat returned values as secrets and limit their exposure.

Example prompts include:

- "List the application settings for web app 'my-webapp' in resource group 'rg-prod'."
- "Get the application settings for web app 'orders-api' in resource group 'rg-staging'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **App** |  Required | The name of the Azure App Service web app (for example, `my-webapp`). |
| **Resource group** |  Required | The name of the Azure resource group that contains the web app (for example, prod-rg). |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ✅ | Local Required: ❌

## List diagnostic detectors

<!-- @mcpcli appservice webapp diagnostic list -->

This tool retrieves detailed information about detectors for a specified Azure App Service web app. For each detector, it returns the detector name, detector type, description, category, and analysis types. The results help you investigate issues and understand the diagnostics available for the web app.

Example prompts include:

- "List the diagnostic detectors for web app 'my-webapp' in resource group 'rg-prod'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **App** |  Required | The name of the Azure App Service (for example, `my-webapp`). |
| **Resource group** |  Required | The name of the Azure resource group. This resource group is a logical container for Azure resources. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Update app settings

<!-- @mcpcli appservice webapp settings update-appsettings -->

This tool updates an application setting for an App Service web app. You can choose one of three update types: `add`, `set`, or `delete`.

- `add`: Creates a new application setting with the specified name and value. If the application setting already exists, the operation fails and returns an error.
- `set`: Creates or updates the value of an application setting. If the application setting doesn't exist, `set` behaves like `add`. If it exists, the value is overwritten.
- `delete`: Removes the specified application setting. If the application setting doesn't exist, no action is taken.

For the `add` and `set` update types, both the application setting name and value are required. For the `delete` update type, only the application setting name is required.

Example prompts include:

- "Add application setting name 'feature-flag' with value 'true' to app 'my-webapp' in resource group 'rg-prod' with setting update type 'add'."
- "Set application setting name 'db-connection-string' with value 'Server=tcp:contoso-sql.database.windows.net;Initial Catalog=orders' on app 'orders-webapp' in resource group 'rg-orders' with setting update type 'set'."
- "Delete application setting name 'old-api-key' from app 'legacy-service' in resource group 'rg-archive' with setting update type 'delete'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **App** |  Required | The name of the Azure App Service (for example, `my-webapp`). |
| **Resource group** |  Required | The name of the Azure resource group that contains the web app. |
| **Setting name** |  Required | The name of the application setting. |
| **Setting update type** |  Required | The type of update to perform on the application setting. Valid values: `add`, `set`, `delete`. |
| **Setting value** |  Optional | The value of the application setting. Required for `add` and `set` update types. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ✅ | Idempotent: ❌ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure App Service documentation](/azure/app-service/)