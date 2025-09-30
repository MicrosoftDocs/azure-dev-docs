---
title: Azure Developer CLI Extension Tools
description: Learn how to use the Azure MCP Server with the Azure Developer CLI Extension.
keywords: azure mcp server, azmcp, azure developer cli extension, azd
author: diberry
ms.author: diberry
ms.date: 07/22/2025
content_well_notification: 
  - AI-contribution
ai-usage: ai-assisted
ms.topic: reference
ms.custom: build-2025
--- 
# Azure Developer CLI extension tools for the Azure MCP Server

The Azure MCP Server allows you to execute any Azure Developer CLI command using natural language prompts. You can perform application development, deployment, and management operations without needing to remember specific command syntax, parameters, or formatting.

[Azure Developer CLI (azd)](/azure/developer/azure-developer-cli/) is a developer-centric command-line interface (CLI) tool for creating Azure applications. It provides a set of developer-friendly commands that map to key stages in your workflow, from initializing a new project to deploying to Azure. For a complete list of Azure Developer CLI commands this tool can execute, see the [Azure Developer CLI reference documentation](/azure/developer/azure-developer-cli/reference).

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## Execute Azure Developer CLI command

The Azure MCP Server can execute Azure Developer CLI commands. This provides complete access to Azure application development and deployment operations through familiar command-line syntax.

**Example prompts** include:

- **Initialize a new project**: "Create a sample todo list app with NodeJS and MongoDB"
- **Deploy application**: "Deploy my application to Azure"
- **Manage environments**: "Show me my azd environments"
- **Monitor application**: "Check the status of my deployed application"
- **Template operations**: "List available azd templates"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Command** | Required | The Azure Developer CLI command to execute (without the 'azd' prefix). For a complete list of Azure Developer CLI commands, see the [Azure Developer CLI reference documentation](/azure/developer/azure-developer-cli/reference). |

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure Developer CLI reference documentation](/azure/developer/azure-developer-cli/reference)
- [Azure Developer CLI overview](/azure/developer/azure-developer-cli/overview)