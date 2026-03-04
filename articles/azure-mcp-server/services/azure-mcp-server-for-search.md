---
title: Use Azure MCP Server with Azure AI Search
description: Learn how to use Azure Model Context Protocol (MCP) Server to interact with Azure AI Search using natural language commands through AI assistants.
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

- Query existing Azure AI Search indexes to retrieve information.
- List all Azure AI Search services in your subscription.
- Get detailed information about knowledge bases and their sources.
- Execute retrieval operations using specific knowledge bases.

## Prerequisites

To use the Azure MCP Server with Azure Functions, you need:

### Azure requirements

Before using Azure MCP Server with Azure AI Search, ensure you have:

- **Azure subscription**: An active Azure subscription. [Create one for free](https://azure.microsoft.com/free/).
- **Azure AI Search service**: You need to have at least one Azure AI Search service provisioned to use its features.
- **Azure permissions**: Appropriate roles like Search Service Contributor or Search Index Data Reader to perform the operations you want. See [Connect to Azure AI Search using roles](/azure/search/search-security-rbac?tabs=roles-portal-admin).

[!INCLUDE [mcp-prerequisites](../includes/mcp-prerequisites.md)]

## Where can you use Azure MCP Server?

[!INCLUDE [mcp-usage-contexts](../includes/mcp-usage-contexts.md)]

## Available tools for Azure AI Search

Azure MCP Server provides the following tools for Azure AI Search:

- Retrieve details of a search index
- Get and retrieve knowledge base information
- Execute a retrieval operation with a knowledge base
- Query a search index for products

For detailed parameter information and usage examples, see the [Azure AI Search MCP tools reference](../tools/azure-ai-search.md).

## Get started

Ready to use Azure MCP Server with your Azure AI Search resources?

1. **Set up your environment**: Choose an AI assistant or development tool that supports MCP. For setup and authentication instructions, see the links in the [Where can you use Azure MCP Server?](#where-can-you-use-azure-mcp-server) section above.
2. **Start exploring**: Ask your AI assistant questions about your search resources. Try prompts like:
  - "Get details of the search index named 'products'."
  - "Query the search index 'products' for items with 'laptop' in the title."
  - "Retrieve information from knowledge base 'faq-kb' with the question 'What are the return policies?'."

3. **Learn more**: Review the [Azure AI Search tools reference](../tools/azure-ai-search.md) for all available capabilities and detailed parameter information.


## Authentication and permissions

To use Azure AI Search through Azure MCP Server, ensure your Azure identity has appropriate permissions:

**Required Azure RBAC roles:**

- **Search Service Contributor** - Allows management actions on Azure AI Search services.
- **Search Index Data Reader** - Grants read access to search index data for querying.

**Additional authentication notes:**

Ensure that you have the necessary access rights for the Azure AI Search service and associated knowledge bases.

## Best practices

- **Organize your indexes for optimal retrieval**: Group related fields together to enhance query efficiency and relevance.
- **Regularly update your knowledge sources**: Keep knowledge sources current to provide accurate responses to queries.
- **Utilize query filters**: Apply filters to refine search results and reduce unnecessary data retrieval.
- **Implement data security measures**: Leverage role-based access control to restrict data access appropriately.
- **Monitor performance and usage**: Regularly review query performance to optimize resource usage and cost.

## Related content

- [Azure MCP Server documentation](/azure/developer/azure-mcp-server)
- [Azure AI Search MCP tools reference](../tools/azure-ai-search.md)
- [Azure AI Search documentation](/azure/search/)
- [Get started with Azure AI Search](/azure/search/search-get-started-rbac)
