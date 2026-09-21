---
title: Azure MCP Tools Management
description: Learn how to use the Azure MCP Server tools management capability to discover the tools available in the server through natural language prompts.
author: diberry
ms.author: diberry
ms.date: 08/11/2026
ms.topic: concept-article
ms.service: azure-mcp-server
ms.custom:
  - build-2025
ai-usage: ai-assisted
content_well_notification:
  - AI-contribution
---
# Azure MCP tools management for the Azure MCP Server overview

The Azure MCP Server includes a built-in tools management capability that you can use to discover which Azure tools the server exposes. Use this capability from any Model Context Protocol (MCP) client, such as GitHub Copilot in Visual Studio Code, to inventory the available tools with natural language prompts instead of memorizing command syntax. This article describes the example prompts you can use to list tools and explore the server's capabilities.

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## List tools

The Azure MCP Server can list all available tools and their capabilities. Listing tools helps you discover what Azure services and operations you can manage through the MCP server before you author a task-specific prompt.

**Example prompts** include:

- **List all tools**: "Show me all available Azure MCP tools"
- **Discover capabilities**: "What tools are available in the Azure MCP server?"
- **View tool inventory**: "List all Azure tools I can use"
- **Check available services**: "What Azure services can I manage with MCP?"
- **Find tools**: "Show me what Azure operations are available"

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
