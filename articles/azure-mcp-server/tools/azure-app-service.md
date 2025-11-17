---
title: Azure App Service tools - Azure MCP Server
description: Use the Azure App Service tools in Azure MCP Server to get guidance on Azure Functions development, deployment, and Azure SDK usage.
keywords: azure mcp server, azmcp, app service
ms.service: azure-mcp-server
content_well_notification: 
  - AI-contribution
ai-usage: ai-assisted
ms.topic: reference
ms.date: 11/14/2025
author: diberry
ms.author: diberry
---

# Azure App Service tools for Azure MCP Server

The Azure MCP Server lets you manage Azure resources, including Azure App Service instances, using natural language prompts. This feature enables you to quickly manage your web applications without needing to remember complex syntax.

[Azure App Service](/azure/app-service/) is a managed platform for building, deploying, and scaling web apps. It offers built-in support for popular programming languages and frameworks, as well as features like autoscaling, custom domains, and SSL certificates. With Azure App Service, you can focus on application development rather than infrastructure management.

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]


## Database: Add connection

<!-- appservice database add -->

Add a [database connection](/azure/app-service/tutorial-connect-overview) to an App Service. This command configures database connection
settings for the specified App Service, allowing it to connect to a database server.

Example prompts include:

- **Add database connection**: "Add a database connection to my app service 'webapp-prod' in resource group 'production-rg'"
- **Configure SQL Server database**: "Configure a SQL Server database for app service 'webapp-prod'"
- **Add MySQL database**: "Add a MySQL database to app service 'webapp-prod'"
- **Add PostgreSQL database**: "Add a PostgreSQL database to app service 'webapp-prod'"
- **Add CosmosDB database**: "Add a Cosmos database to app service 'webapp-prod'"
- **Add specific database and server**: "Add database 'orders-db' on server 'orders-sql-server' to app service 'webapp-prod'"
- **Set connection string**: "Set connection string for database 'orders-db' in app service 'webapp-prod'"
- **Configure tenant for database**: "Configure tenant 'contoso' for database 'orders-db' in app service 'webapp-prod'"
- **Add database with retry policy**: "Add database 'orders-db' with retry policy to app service 'webapp-prod'"


| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **App** |  Required | The name of the Azure App Service (for example, my-webapp). |
| **Database type** |  Required | The type of database (for example, SqlServer, MySQL, PostgreSQL, Cosmos DB). |
| **Database server** |  Required | The server name or endpoint for the database (for example, myserver.database.windows.net). |
| **Database** |  Required | The name of the database to connect to (for example, mydb). |
| **Connection string** |  Optional | The connection string for the database. If not provided, a default is generated. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [appservice database add](../includes/tools/annotations/azure-app-service-database-add-annotations.md)]

## Related resources

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)