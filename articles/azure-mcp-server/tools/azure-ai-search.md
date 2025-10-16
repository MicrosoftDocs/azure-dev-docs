---
title: Azure AI Search Tools
description: Learn how to use Azure MCP Server tools to manage Azure AI Search resources, indexes, and queries with natural language prompts.
keywords: azure mcp server, azmcp, ai search, cognitive search, azure search
author: diberry
ms.author: diberry
ms.date: 10/16/2025
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

Use the Azure MCP Server to retrieve detailed information about AI Search [indexes](/azure/search/search-what-is-an-index). You can view the index schema, fields, analyzers, scoring profiles, and other index properties.

Example prompts include:

- **Get index details**: "Show me details of the 'products' index in my 'mysearchservice' service."
- **View index schema**: "What fields are in the 'users' index?"
- **Index structure**: "Describe the schema for 'documents' index in my search service."

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Service** | Required | The name of the Azure AI Search service (for example, `my-search-service`). |
| **Index** | Optional | The name of the search index within the Azure AI Search service. |

## Index: Query index

<!-- azmcp ai-search index query -->

Use the Azure MCP Server to run [search queries](/azure/search/query-simple-syntax) against an AI Search index. This feature helps you find specific content using search terms.

Example prompts include:

- **Simple query**: "Search for 'machine learning' in the 'documents' index."
- **Filter query**: "Find all products with category 'electronics' in my product index."
- **Text search**: "Search my 'content' index for anything mentioning 'climate change'."

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Subscription** | Optional | Specifies the Azure subscription to use. Accepts either a subscription ID (GUID) or display name. If not specified, the `AZURE_SUBSCRIPTION_ID` environment variable will be used instead. |
| **Service** | Required | The name of the Azure AI Search service (for example, `my-search-service`). |
| **Index** | Required | The name of the search index within the Azure AI Search service. |
| **Query** | Required | The search query to execute against the Azure AI Search index. |

## Knowledge: Get knowledge base

<!-- azmcp search knowledge base get -->

Gets the details of Azure AI Search knowledge bases. Knowledge bases encapsulate retrieval and reasoning capabilities over one or more knowledge sources or indexes. If a specific knowledge base name isn't provided, the command returns details for all knowledge bases within the specified service.

Example prompts include:

- **Get knowledge base details**: "Show me details of the 'support' knowledge base in my search service."
- **View all knowledge bases**: "List all knowledge bases in my AI Search service."
- **Knowledge base info**: "What knowledge bases are available in 'my-search-service'?"


| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Service** |  Required | The name of the Azure AI Search service (for example, `my-search-service`). |
| **Knowledge base** |  Optional | The name of the knowledge base within the Azure AI Search service. |

## Knowledge: Retrieve knowledge base

<!-- azmcp search knowledge base retrieve -->

Execute a retrieval operation using a specific Azure AI Search knowledge base, effectively searching and querying the underlying data sources as needed to find relevant information. Provide either a query for single-turn retrieval or one or more conversational messages. Specifying both query and messages isn't allowed.

Example prompts include:

- **Retrieve with query**: "Search the 'support' knowledge base for information about troubleshooting."
- **Conversational retrieval**: "Ask the 'docs' knowledge base: How do I configure authentication?"
- **Knowledge base search**: "Query the 'products' knowledge base for pricing information."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Service** |  Required | The name of the Azure AI Search service (for example, `my-search-service`). |
| **Knowledge base** |  Required | The name of the knowledge base within the Azure AI Search service. |
| **Query** |  Optional | Natural language query for retrieval when a conversational message history isn't provided. |
| **Messages** |  Optional | Conversation history messages passed to the knowledge base. Able to specify multiple messages entries. Each entry formatted as `role:content`, where role is `user` or `assistant` (for example, `user:How many docs?`). |

## Knowledge: Get source

<!-- azmcp search knowledge source get -->

Gets the details of Azure AI Search knowledge sources. A knowledge source can point directly at an existing Azure AI Search index, or can represent external data (for example, a blob storage container) that Azure AI Search has indexed internally. These knowledge sources are used by knowledge bases during retrieval. If a specific knowledge source name isn't provided, the command returns details for all knowledge sources within the specified service.

Example prompts include:

- **Get source details**: "Show me details of the 'documents' knowledge source in my search service."
- **View all sources**: "List all knowledge sources in my AI Search service."
- **Source information**: "What knowledge sources are configured in 'my-search-service'?"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Service** |  Required | The name of the Azure AI Search service (for example, `my-search-service`). |
| **Knowledge source** |  Optional | The name of the knowledge source within the Azure AI Search service. |


## Service: List services

<!-- azmcp search service list -->

Use the Azure MCP Server to list all AI Search services in a subscription. This command gives you a quick overview of your search services.

Example prompts include:

- **List services**: "List all my AI Search services in my subscription."
- **Show services**: "What AI Search services do I have?"
- **Find services**: "I need to see my Azure AI Search resources"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Subscription** | Optional | Specifies the Azure subscription to use. Accepts either a subscription ID (GUID) or display name. If not specified, the `AZURE_SUBSCRIPTION_ID` environment variable will be used instead. |

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure AI Search](/azure/search/) 