---
title: Manage Azure App Service with Azure MCP Server
description: Learn how to use the Azure MCP Server to manage App Service resources and configure database connections through AI-powered natural language interactions.
author: diberry
ms.author: diberry
ms.service: azure-app-service
ms.topic: how-to
ms.date: 02/20/2026
content_well_notification: 
  - AI-contribution
ai-usage: ai-generated
ms.custom: build-2025

#customer intent: As an Azure App Service developer, I want to manage app services and configure database connections using natural language conversations so that I can quickly set up and verify configurations without navigating portals.

---

# Manage Azure App Service with Azure MCP Server

Manage web applications and configure database connections using natural language conversations with AI assistants through the Azure MCP Server.

[Azure App Service](/azure/app-service/overview) is a fully managed platform for building, deploying, and scaling web applications. It supports multiple programming languages and frameworks with integrated developer tools. While the Azure portal and Azure CLI are powerful, the Azure MCP Server provides a more intuitive way to interact with your App Service resources through conversational AI.

## What is the Azure MCP Server?

[!INCLUDE [mcp-introduction](../includes/mcp-introduction.md)]

For Azure App Service developers, this means you can:

- Add database connections to existing App Service resources using plain language
- Configure database settings for web applications conversationally
- Set up connections to SQL Server, PostgreSQL, MySQL, and other database types
- Verify database connection configurations across environments

## Prerequisites

To use the Azure MCP Server with Azure App Service, you need:

### Azure requirements

- **Azure subscription**: An active Azure subscription. [Create one for free](https://azure.microsoft.com/free/).
- **Azure App Service resources**: At least one App Service in your subscription, or permissions to create them.
- **Database resource**: An existing database resource to connect to your App Service.
- **Azure permissions**: Appropriate roles to perform the operations you want. See [Azure Built-in Roles](/azure/role-based-access-control/built-in-roles).

[!INCLUDE [mcp-prerequisites](../includes/mcp-prerequisites.md)]

## Where can you use Azure MCP Server?

[!INCLUDE [mcp-usage-contexts](../includes/mcp-usage-contexts.md)]

## Available tools for Azure App Service

The Azure MCP Server provides one tool specifically designed for Azure App Service operations, enabling you to configure database connections through natural language conversations.

### Add a database connection

Configure a database connection for an existing App Service, linking your web application to a database resource.

**Common scenarios**:

- Add a SQL Server database connection to a web application
- Configure PostgreSQL or MySQL database access for an App Service
- Set up database connections across development and production environments

For detailed information about each tool, including parameters and examples, see [Azure App Service tools for Azure MCP Server](../tools/azure-app-service.md).

## Get started

Ready to use Azure MCP Server with your Azure App Service resources?

1. **Set up your environment**: Choose an AI assistant or development tool that supports MCP. For setup and authentication instructions, see the links in the [Where can you use Azure MCP Server?](#where-can-you-use-azure-mcp-server) section above.

1. **Start exploring**: Ask your AI assistant questions about your App Service resources or request operations. Try prompts like:
   - "Add a database connection to 'myapp' with SQL Server 'mydb' and server 'mydbserver'"
   - "Configure database settings for 'prod-app' connecting to 'production-db' on 'prod-server'"
   - "Set up database access for 'dev-app' using MySQL named 'dev-db' from 'dev-server'"

1. **Learn more**: Review the [Azure App Service tools reference](../tools/azure-app-service.md) for all available capabilities and detailed parameter information.

## Best practices

When using Azure MCP Server with Azure App Service:

- **Use managed identities**: Use managed identities for secure database access without storing credentials in connection strings.
- **Specify resource details clearly**: Always include the exact App Service name, database name, and server name to avoid ambiguity.
- **Verify connections after setup**: Use your AI assistant to confirm that database connections are configured correctly after adding them.
- **Review connection settings regularly**: Ensure database connection strings are up-to-date and only include necessary permissions.
- **Combine with other tools**: Use Azure MCP Server for quick database connection setup and the Azure portal or Azure CLI for broader App Service configuration changes.

## Related content

* [Azure MCP Server overview](../overview.md)
* [Get started with Azure MCP Server](../get-started.md)
* [Azure App Service tools reference](../tools/azure-app-service.md)
* [Azure App Service documentation](/azure/app-service/overview)
* [App Service best practices](/azure/app-service/app-service-best-practices)
