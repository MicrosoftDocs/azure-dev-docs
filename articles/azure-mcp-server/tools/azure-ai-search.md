---
title: Azure MCP Server tools for Azure AI Search
description: Use Azure MCP Server tools to manage search services, indexes, knowledge sources, and knowledge bases with natural language prompts from your IDE.
author: diberry
ms.author: diberry
ms.service: azure-mcp-server
ms.topic: concept-article
ms.date: 03/27/2026
content_well_notification:
  - AI-contribution
ai-usage: ai-assisted
reviewer: pablocastro
tool_count: 6
mcp-cli.version: 2.0.0-beta.33
---

# Azure MCP Server tools for Azure AI Search

The Azure Model Context Protocol (MCP) Server lets you manage Azure AI Search resources, including search services, indexes, knowledge sources, and knowledge bases with natural language prompts.

[Azure AI Search](/azure/search/) (formerly Azure Cognitive Search) is a cloud search service that provides APIs and tools for building applications and agents that follow the Retrieval Augmented Generation (RAG) pattern. It supports vector and keyword retrieval, reranking, and agentic retrieval; for more information, see [Azure AI Search documentation](/azure/search/).

> [!NOTE]
> Each Azure AI Search knowledge base exposes a native MCP endpoint for direct retrieval. For more information, see [Call the MCP endpoint](/azure/search/agentic-retrieval-how-to-retrieve#call-the-mcp-endpoint).

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## Get search index

<!-- @mcpcli search index get -->

This tool retrieves detailed information about Azure AI Search indexes, including index schema, fields, analyzers, scoring profiles, and other index properties. When you provide an index name, it returns properties for that index; without an index name, it returns all indexes in the specified service.

Example prompts include:

- "Show me the details of index 'products-index' in Azure AI Search service 'my-search-service'."
- "List all indexes in the Azure AI Search service 'enterprise-search'."
- "What fields are in the 'users' index in service 'contoso-search'?"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Service** |  Required | The name of the Azure AI Search service (for example, `my-search-service`). |
| **Index** |  Optional | The name of the search index within the Azure AI Search service. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Query search index

<!-- @mcpcli search index query -->

This tool runs a search query against an Azure AI Search index and returns the matching documents and relevance metadata. Results typically include document fields, a relevance score, and any text highlights that match the query.

Example prompts include:

- "Search for 'machine learning' in the 'documents' index of my 'contoso-search' service."
- "Query index 'products' for 'noise-canceling headphones' in Azure AI Search service 'fabrikam-search'."
- "Search my 'content' index in 'my-search-service' for anything mentioning 'climate change'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Service** |  Required | The name of the Azure AI Search service (for example, `my-search-service`). |
| **Index** |  Required | The name of the search index within the Azure AI Search service. |
| **Query** |  Required | The search query to execute against the Azure AI Search index. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Get knowledge base

<!-- @mcpcli search knowledge base get -->

This tool gets details for Azure AI Search knowledge bases. Knowledge bases encapsulate retrieval and reasoning capabilities over one or more knowledge sources or indexes. If you don't provide a knowledge base name, it returns details for all knowledge bases within the specified service.

Example prompts include:

- "List all knowledge bases in the Azure AI Search service 'my-search-service'."
- "Show me the knowledge bases in service 'contoso-search'."
- "Get the details of knowledge base 'support-agent' in Azure AI Search service 'enterprise-search'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Service** |  Required | The name of the Azure AI Search service (for example, `my-search-service`). |
| **Knowledge base** |  Optional | The name of the knowledge base within the Azure AI Search service. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Retrieve from knowledge base

<!-- @mcpcli search knowledge base retrieve -->

This tool executes a retrieval operation against an Azure AI Search knowledge base to find relevant information from its data sources. Provide either a single-turn query for retrieval or one or more conversational messages in `role:content` format. Specifying both query and messages isn't allowed.

Example prompts include:

- "Run a retrieval with knowledge base 'support-agent' in Azure AI Search service 'my-search-service' for the query 'password reset steps'."
- "Ask knowledge base 'product-docs' in search service 'contoso-search' to retrieve information about 'API rate limits'."
- "Query knowledge base 'hr-policies' in search service 'hr-search' about 'vacation accrual policy'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Service** |  Required | The name of the Azure AI Search service (for example, `my-search-service`). |
| **Knowledge base** |  Required | The name of the knowledge base within the Azure AI Search service. |
| **Query** |  Optional | Natural language query for retrieval when a conversational message history isn't provided. |
| **Messages** |  Optional | Conversation history messages passed to the knowledge base. Each entry formatted as `role:content`, where role is `user` or `assistant` (for example, `user:What policies apply to archived invoices?`). |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ✅ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Get knowledge source

<!-- @mcpcli search knowledge source get -->

This tool gets details of Azure AI Search knowledge sources. A knowledge source can point at an existing Azure AI Search index or represent external data (for example, a blob storage container) that Azure AI Search has indexed. Knowledge sources are used by knowledge bases during retrieval. If you don't provide a knowledge source name, it returns details for all knowledge sources in the specified service.

Example prompts include:

- "List all knowledge sources in the Azure AI Search service 'my-search-service'."
- "Show me the knowledge sources in the Azure AI Search service 'contoso-search'."
- "Get the details of knowledge source 'product-index' in search service 'enterprise-search'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Service** |  Required | The name of the Azure AI Search service (for example, `my-search-service`). |
| **Knowledge source** |  Optional | The name of the knowledge source within the Azure AI Search service. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## List search services

<!-- @mcpcli search service list -->

This tool lists Azure AI Search services in a subscription and returns details for each service, including name, location, SKU, provisioning state, and endpoint.

Example prompts include:

- "List Azure AI Search services in my subscription."
- "What AI Search services do I have?"
- "Show me my Azure AI Search resources."

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure AI Search documentation](/azure/search/)
