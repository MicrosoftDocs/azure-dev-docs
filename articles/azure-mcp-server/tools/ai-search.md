---
title: Azure AI Search Tools
description: Learn how to use Azure MCP Server tools to manage Azure AI Search resources, indexes, and queries with natural language prompts.
keywords: azure mcp server, azmcp, ai search, cognitive search, azure search
author: diberry
ms.author: diberry
ms.date: 10/15/2025
content_well_notification:
  - AI-contribution
ai-usage: ai-assisted
ms.topic: reference
ms.custom: build-2025
---
# Azure AI Search tools for the Azure MCP Server

<!-- azmcp ai-search service list -->

Use the Azure MCP Server to manage Azure AI Search resources, including search services, indexes, and [queries](/azure/search/query-simple-syntax) with natural language prompts. You don't need to remember specific command syntax.

[Azure AI Search](/azure/search/) (formerly Azure Cognitive Search) is a cloud search service that provides APIs and tools for building rich search experiences over private, heterogeneous content in web, mobile, and enterprise applications.

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## Index: Get index details

<!-- azmcp ai-search index get -->

Use the Azure MCP Server to retrieve detailed information about AI Search [indexes](/azure/search/search-what-is-an-index). You can view the index schema, fields, analyzers, scorers, and other index properties.

Example prompts include:

- **Get index details**: "Show me details of the 'products' index in my 'mysearchservice' service."
- **View index schema**: "What fields are in the 'users' index?"
- **Index structure**: "Describe the schema for 'documents' index in my search service"
- **Check index configuration**: "Show me the configuration of my 'content' index"
- **Index definition**: "What's the definition of my 'catalog' search index?"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Service** | Required | The name of the AI Search service. |
| **Index** | Optional | The name of the index to describe. |

## Index: Query index

<!-- azmcp ai-search index query -->

Use the Azure MCP Server to run [search queries](/azure/search/query-simple-syntax) against an AI Search index. This feature helps you find specific content using search terms.

Example prompts include:

- **Simple query**: "Search for 'machine learning' in the 'documents' index"
- **Filter query**: "Find all products with category 'electronics' in my product index"
- **Text search**: "Search my 'content' index for anything mentioning 'climate change'"
- **Query search**: "Look up 'azure functions' in my documentation index"
- **Search request**: "Search for 'security best practices' in my knowledge base index"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Service** | Required | The name of the AI Search service. |
| **Index** | Required | The name of the index to query. |
| **Query** | Required | The search query to run against the index. |

## Knowledge: Get knowledge base

<!-- `azmcp search knowledge base get` -->

Gets the details of Azure AI Search knowledge bases. Knowledge bases encapsulate retrieval and reasoning
capabilities over one or more knowledge sources or indexes. If a specific knowledge base name is not provided,
the command will return details for all knowledge bases within the specified service.


| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Service** |  Required | The name of the Azure AI Search service (for example, `my-search-service`). |
| **Knowledge base** |  Optional | The name of the knowledge base within the Azure AI Search service. |

## Knowledge: Retrieve knowledge base

<!-- `azmcp search knowledge base retrieve` -->

Execute a retrieval operation using a specific Azure AI Search knowledge base, effectively searching and querying the underlying data sources as needed to find relevant information. Provide either a query for single-turn retrieval or one or more conversational messages. Specifying both query and messages is not allowed.

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Service** |  Required | The name of the Azure AI Search service (for example, `my-search-service`). |
| **Knowledge base** |  Required | The name of the knowledge base within the Azure AI Search service. |
| **Query** |  Optional | Natural language query for retrieval when a conversational message history isn't provided. |
| **Messages** |  Optional | Conversation history messages passed to the knowledge base. Able to specify multiple messages entries. Each entry formatted as `role:content`, where role is `user` or `assistant` (for example, `user:How many docs?`). |

## Knowledge: Get source

<!-- `azmcp search knowledge source get` -->

Gets the details of Azure AI Search knowledge sources. A knowledge source may point directly at an
existing Azure AI Search index, or may represent external data (for example, a blob storage container) that has been
indexed in Azure AI Search internally. These knowledge sources are used by knowledge bases during retrieval.
If a specific knowledge source name is not provided, the command will return details for all knowledge sources
within the specified service.

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Service** |  Required | The name of the Azure AI Search service (for example, my-search-service). |
| **Knowledge source** |  Optional | The name of the knowledge source within the Azure AI Search service. |


## Service: List accounts

<!-- azmcp ai-search service list -->

Use the Azure MCP Server to list all AI Search accounts in a subscription. This command gives you a quick overview of your search services.

Example prompts include:

- **List accounts**: "List all my AI Search services in my subscription."
- **Show accounts**: "What AI Search accounts do I have?"
- **Find accounts**: "I need to see my Azure AI Search resources"
- **Query accounts**: "Show me all my search services"
- **Check accounts**: "AI Search services in subscription abc123"

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
