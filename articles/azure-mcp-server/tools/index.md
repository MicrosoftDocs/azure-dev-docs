---
title: Azure MCP Server tools
description: Learn how to use the Azure MCP Server tools for consuming servers.
keywords: azure mcp server, azmcp
author: diberry
ms.author: diberry
ms.date: 05/14/2025
ms.topic: overview
content_well_notification: 
  - AI-contribution
ai-usage: ai-assisted
ms.custom: build-2025
---
# What are the Azure MCP Server tools?

The Azure Model Context Protocol (MCP) Server enables interaction with Azure services through natural language tools. This article provides an overview of tools supported by the Azure MCP Server and explains how to use them.

## Supported services

[!INCLUDE [supported-azure-services](../includes/tools/supported-azure-services.md)]

### Use MCP servers

Use the Azure MCP Server from an existing client, such as GitHub Copilot agent mode in Visual Studio Code.

This approach uses prebuilt servers to perform specific tasks. For example, you can use the Azure MCP Server to list Azure storage accounts or run KQL queries on Azure databases. This scenario is ideal for developers who want to quickly use AI functionality without building servers from scratch.

The Azure MCP Server accepts natural language prompts, allowing you to interact with Azure resources conversationally:

- "Show me all my resource groups"
- "List blobs in my storage container named 'documents'"
- "What's the value of the 'ConnectionString' key in my app configuration?"
- "Query my log analytics workspace for errors in the last hour"
- "Show me all my Cosmos DB databases"

## Related content

- Learn about [Azure MCP Server](../get-started.md)
- Explore [Using MCP Server tools with App Configuration tools](app-configuration.md)
