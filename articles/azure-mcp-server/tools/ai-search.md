---
title: Azure AI Search Tools
description: Learn how to use the Azure MCP Server with Azure AI Search.
keywords: azure mcp server, azmcp, ai search, cognitive search, azure search
author: diberry
ms.author: diberry
ms.date: 09/23/2025
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
