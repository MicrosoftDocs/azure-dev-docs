---
title: Use Azure MCP Server with Azure AI Search
description: Learn how to use Azure Model Context Protocol (MCP) Server to interact with Azure AI Search using natural-language commands through AI assistants.
ms.date: 02/20/2026
author: diberry
content_well_notification:
  - AI-contribution
ai-usage: ai-assisted
ms.topic: how-to
ms.custom: mcp-integration, devx-track-ai
mcp-version: 2.0.0-beta.21+5fab1ed6588bc5e128601746ab9b7d58ec108a38
---

# Use Azure MCP Server with Azure AI Search

Azure Model Context Protocol (MCP) Server enables AI assistants like GitHub Copilot, Claude Desktop, and others to interact with Azure AI Search through natural language commands. This integration allows you to manage search resources and query both indexed and remote data without writing code or remembering complex CLI syntax.

## Overview

Azure AI Search is a cloud-based search service that supports full-text, vector, and hybrid search over scattered enterprise content. You can load and query an index for classic search scenarios, or you can use a knowledge base for agentic retrieval over indexed and remote data.

With Azure MCP Server integration, you can use natural language to:

- List Azure AI Search services in your subscription.
- View index schemas, fields, and configurations.
- Query indexes to find relevant content.
- View knowledge base and knowledge source details.
- Retrieve from knowledge bases using queries or conversational messages.

## Prerequisites

To use the Azure MCP Server with Azure Functions, you need:

### Azure requirements

Before using Azure MCP Server with Azure AI Search, ensure you have:

- **Azure subscription**: An active Azure subscription. [Create one for free](https://azure.microsoft.com/free/).
- **Azure AI Search service**: You need to have at least one Azure AI Search service provisioned to use its features.
- **Azure permissions**: Appropriate roles to perform the operations you want:
  - Search Service Contributor - Required to list services and get details of indexes and knowledge bases.
  - Search Index Data Reader - Required for querying indexes and retrieving information from knowledge bases.

[!INCLUDE [mcp-prerequisites](../includes/mcp-prerequisites.md)]

## Where can you use Azure MCP Server?

[!INCLUDE [mcp-usage-contexts](../includes/mcp-usage-contexts.md)]

## Available tools for Azure AI Search

Azure MCP Server provides the following tools for Azure AI Search operations:

| Tool | Description |
| --- | --- |
| `search index get` | Retrieve details of Azure AI Search indexes and their properties. |
| `search index query` | Query an Azure AI Search index for relevant results. |
| `search knowledge base get` | Get details of Azure AI Search knowledge bases and their sources. |
| `search knowledge base retrieve` | Retrieve information using a specific Azure AI Search knowledge base. |
| `search knowledge source get` | Get details of knowledge sources utilized in Azure AI Search. |
| `search service list` | List all Azure AI Search services available in the subscription. |

For detailed information about each tool, including parameters and examples, see [Azure AI Search tools for Azure MCP Server](../tools/azure-ai-search.md).

## Get started

Ready to use Azure MCP Server with your Azure AI Search resources?

1. **Set up your environment**: Choose an AI assistant or development tool that supports MCP. For setup and authentication instructions, see the links in the [Where can you use Azure MCP Server?](#where-can-you-use-azure-mcp-server) section above.
2. **Start exploring**: Ask your AI assistant questions about your search resources. Try prompts like:
  - "Get details of the search index named 'products'."
  - "Query the search index 'products' for items with 'laptop' in the title."
  - "Retrieve information from knowledge base 'faq-kb' with the question 'What are the return policies?'."

3. **Learn more**: Review the [Azure AI Search tools reference](../tools/azure-ai-search.md) for all available capabilities and detailed parameter information.

## Best practices

- **Use detailed queries during retrieval**: When using the search index query tool, specify precise index and parameters to narrow results effectively.
- **Check index structures before querying**: Use the search index get command to understand index fields and optimize query performance.
- **Regularly review knowledge base settings**: Periodically retrieve knowledge base details to ensure configurations meet current needs.

## Related content

- [Azure MCP Server documentation](/azure/developer/azure-mcp-server)
- [Azure AI Search MCP tools reference](../tools/azure-ai-search.md)
- [Azure AI Search documentation](/azure/search/)
