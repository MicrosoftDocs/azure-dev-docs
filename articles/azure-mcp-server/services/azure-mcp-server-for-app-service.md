---
title: Manage Azure App Service with Azure MCP Server
description: Learn how to use the Azure MCP Server to manage App Service resources and configure database connections through AI-powered natural language interactions.
author: diberry
ms.author: diberry
ms.service: azure-app-service
ms.topic: how-to
ms.date: 03/05/2026
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

- Add a database connection for an App Service
- Retrieve detailed information about web app deployments
- Retrieve detailed information about web apps
- Retrieve application settings for an App Service web app
- Update application settings for an App Service web app

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

Azure MCP Server provides the following tools for Azure App Service operations:

| Tool | Description |
| --- | --- |
| `appservice database add` | Add a database connection for an app using a connection string. |
| `appservice webapp deployment get` | Retrieve detailed information about web app deployments. |
| `appservice webapp get` | Retrieve detailed information about Azure App Service web apps. |
| `appservice webapp settings get-appsettings` | Retrieve application settings for an App Service web app. |
| `appservice webapp settings update-appsettings` | Update application settings for an App Service web app. |

For detailed information about each tool, including parameters and examples, see [Azure App Service tools for Azure MCP Server](../tools/appservice.md).

## Get started

Ready to use Azure MCP Server with your Azure App Service resources?

1. **Set up your environment**: Choose an AI assistant or development tool that supports MCP. For setup and authentication instructions, see the links in the [Where can you use Azure MCP Server?](#where-can-you-use-azure-mcp-server) section above.

1. **Start exploring**: Ask your AI assistant questions about your App Service resources or request operations. Try prompts like:
   - "Add a database connection for 'myapp' to a SQL database named 'mydatabase' with Azure SQL server."
   - "Retrieve details for deployment ID '12345' for web app 'myapp'."
   - "Retrieve details for web app 'myapp'."
   - "Retrieve application settings for web app 'myapp'."
   - "Update app setting 'API_URL' for web app 'myapp' to 'https://api.example.com'."

1. **Learn more**: Review the [Azure App Service tools reference](../tools/azure-app-service.md) for all available capabilities and detailed parameter information.

## Best practices

When using Azure MCP Server with Azure App Service:

- **Use version control for settings**: Track changes to application settings to prevent configuration drift.
- **Verify settings before applying updates**: Use get-appsettings to confirm current settings before making changes.

## Related content

* [Azure MCP Server overview](../overview.md)
* [Get started with Azure MCP Server](../get-started.md)
* [Azure App Service tools reference](../tools/azure-app-service.md)
* [Azure App Service documentation](/azure/app-service/overview)
* [App Service best practices](/azure/app-service/app-service-best-practices)
