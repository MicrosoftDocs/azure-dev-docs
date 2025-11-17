---
title: Azure AI Search Tools
description: Learn how to use Azure MCP Server tools to manage Azure AI Search resources, indexes, and queries with natural language prompts.
keywords: azure mcp server, azmcp, ai search, cognitive search, azure search, rag
author: diberry
ms.author: diberry
ms.date: 11/14/2025
content_well_notification:
  - AI-contribution
ai-usage: ai-assisted
ms.topic: reference
ms.custom: build-2025
---
# Azure AI Search tools for the Azure MCP Server

<!-- ai-search service list -->

Use the Azure MCP Server to manage Azure AI Search resources, including search services, indexes, and [queries](/azure/search/query-simple-syntax) with natural language prompts. You don't need to remember specific command syntax.

[Azure AI Search](/azure/search/) (formerly Azure Cognitive Search) is a cloud search service that provides APIs and tools for building applications and agents that follow the Retrieval Augmented Generation (RAG) pattern to connect AI models with external data, as well as for more traditional scenarios such as catalog and document search. It can play the role of a vector database or of a comprehensive retrieval system with vector and keyword retrieval, reranking, and most recently agentic retrieval support.

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## Index: Get index details

<!-- ai-search index get -->

Use the Azure MCP Server to retrieve detailed information about AI Search [indexes](/azure/search/search-what-is-an-index). You can view the index schema, fields, analyzers, scoring profiles, and other index properties. 

Example prompts include:

- **Get index details**: "Show me details of the 'products' index in my 'mysearchservice' service."
- **View index schema**: "What fields are in the 'users' index?"
- **Index structure**: "Describe the schema for 'documents' index in my search service."

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Service** | Required | The name of the Azure AI Search service (for example, `my-search-service`). |
| **Index** | Optional | The name of the search index within the Azure AI Search service. Will list all indexes if not specified. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [search index get](../includes/tools/annotations/azure-ai-search-index-get-annotations.md)]

## Index: Query index

<!-- ai-search index query -->

Use the Azure MCP Server to run [search queries](/azure/search/query-simple-syntax) against an AI Search index. This feature helps you find specific content using search terms.

Example prompts include:

- **Simple query**: "Search for 'machine learning' in the 'documents' index of my 'my-search-service' service."
- **Sampling query**: "Sample data talking about 'ML' or 'AI' or 'data science' in index 'documents' and tell me what they talk about."
- **Text search**: "Search my 'content' index in 'my-search-service' for anything mentioning 'climate change'."

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Service** | Required | The name of the Azure AI Search service (for example, `my-search-service`). |
| **Index** | Required | The name of the search index within the Azure AI Search service. |
| **Query** | Required | The search query to execute against the Azure AI Search index. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [search index query](../includes/tools/annotations/azure-ai-search-index-query-annotations.md)]

## Knowledge: Get knowledge base

<!-- search knowledge base get -->

Gets the details of Azure AI Search knowledge bases. Knowledge bases encapsulate retrieval and reasoning capabilities over one or more knowledge sources or indexes. If a specific knowledge base name isn't provided, the command returns details for all knowledge bases within the specified service.

Example prompts include:

- **Get knowledge base details**: "Show me details of the 'support' knowledge base in my search service."
- **View all knowledge bases**: "List all knowledge bases in my AI Search service."
- **Knowledge base info**: "What knowledge bases are available in 'my-search-service'?"


| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Service** |  Required | The name of the Azure AI Search service (for example, `my-search-service`). |
| **Knowledge base** |  Optional | The name of the knowledge base within the Azure AI Search service. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [search knowledge base get](../includes/tools/annotations/azure-ai-search-knowledge-base-get-annotations.md)]

## Knowledge: Retrieve from a knowledge base

<!-- search knowledge base retrieve -->

Execute a retrieval operation using a specific Azure AI Search knowledge base, effectively searching and querying the underlying data sources as needed to find relevant information. Provide either a query for single-turn retrieval or one or more conversational messages. Specifying both query and messages isn't allowed.

Example prompts include:

- **Retrieve with query**: "Search the 'support' knowledge base in service 'my-search-service' for information about troubleshooting."
- **Conversational retrieval**: "Ask the 'docs' knowledge base in 'help-search-service': How do I configure authentication?"
- **Knowledge base search**: "Query the 'products' knowledge base in 'retail-search-service' for pricing information."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Service** |  Required | The name of the Azure AI Search service (for example, `my-search-service`). |
| **Knowledge base** |  Required | The name of the knowledge base within the Azure AI Search service. |
| **Query** |  Optional | Natural language query for retrieval when a conversational message history isn't provided. |
| **Messages** |  Optional | Conversation history messages passed to the knowledge base. Able to specify multiple messages entries. Each entry formatted as `role:content`, where role is `user` or `assistant` (for example, `user:How many docs?`). |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [search knowledge base retrieve](../includes/tools/annotations/azure-ai-search-knowledge-base-retrieve-annotations.md)]

## Knowledge: Get source

<!-- search knowledge source get -->

Gets the details of Azure AI Search knowledge sources. A knowledge source can point directly at an existing Azure AI Search index, or can represent external data (for example, a blob storage container) that Azure AI Search has indexed internally. These knowledge sources are used by knowledge bases during retrieval. If a specific knowledge source name isn't provided, the command returns details for all knowledge sources within the specified service.

Example prompts include:

- **Get source details**: "Show me details of the 'documents' knowledge source in my search service."
- **View all sources**: "List all knowledge sources in my AI Search service."
- **Source information**: "What knowledge sources are configured in 'my-search-service'?"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Service** |  Required | The name of the Azure AI Search service (for example, `my-search-service`). |
| **Knowledge source** |  Optional | The name of the knowledge source within the Azure AI Search service. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [search knowledge source get](../includes/tools/annotations/azure-ai-search-knowledge-source-get-annotations.md)]

## Service: List services

<!-- search service list -->

Use the Azure MCP Server to list all AI Search services in a subscription. This command gives you a quick overview of your search services.

Example prompts include:

- **List services**: "List all my AI Search services in my subscription."
- **Show services**: "What AI Search services do I have?"
- **Find services**: "I need to see my Azure AI Search resources"

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [search service list](../includes/tools/annotations/azure-ai-search-service-list-annotations.md)]

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure AI Search](/azure/search/) 