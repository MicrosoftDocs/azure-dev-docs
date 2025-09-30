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

The Azure Model Context Protocol (MCP) Server exposes many tools you can use from an existing [client](../get-started.md?tabs=one-click%2Cazure-cli&pivots=mcp-github-copilot) to interact with Azure services through natural language prompts. For example, you can use the Azure MCP Server to interact with Azure resources conversationally from GitHub Copilot agent mode in Visual Studio Code or other AI agents with commands like these:

- "Show me all my resource groups"
- "List blobs in my storage container named 'documents'"
- "What's the value of the 'ConnectionString' key in my app configuration?"
- "Query my log analytics workspace for errors in the last hour"
- "Show me all my Cosmos DB databases"

[!INCLUDE [supported-azure-services](../includes/tools/supported-azure-services.md)]

[!INCLUDE [server start options](../includes/tools/server-start-options.md)]

[!INCLUDE [global-params](../includes/tools/global-parameters-list.md)]

## User confirmation for sensitive data

[!INCLUDE [user-consent](../includes/tools/user-consent.md)]

## Related content

- [What is the Azure MCP Server?](../get-started.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure MCP Server repository](https://github.com/microsoft/mcp/tree/main/servers/Azure.Mcp.Server)
