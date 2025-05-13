---
title: Azure MCP Server tools
description: Learn how to use the Azure MCP Server tools for consuming and developing servers.
keywords: azure mcp server, azmcp
author: diberry
ms.author: diberry
ms.date: 05/12/2025
ms.topic: get-started
ms.custom: build-2025
---
# Getting started with Azure MCP Server tools

The Azure Model Context Protocol (MCP) Server enables interaction with Azure services through natural language tools. This article provides an overview of tools supported by the Azure MCP Server and explains how to use them in two key development scenarios: [consuming existing servers](#consuming-servers) and [developing new servers](#developing-servers).

## Supported services

[!INCLUDE [supported-azure-services](../includes/tools/supported-azure-services.md)]

## Consuming servers

As a developer, you can use existing server to integrate autonomous callable systems with memory into your applications. This approach focuses on using pre-built servers to perform specific tasks within your broader system.

**When to use this scenario:**
- You need to integrate ready-to-use server capabilities
- You want to quickly add AI functionality without building servers from scratch
- Your application needs to perform specific Azure service operations through natural language

The Azure MCP Server accepts natural language prompts, allowing you to interact with Azure resources conversationally:

- "Show me all my resource groups"
- "List blobs in my storage container named 'documents'"
- "What's the value of the 'ConnectionString' key in my app configuration?"
- "Query my log analytics workspace for errors in the last hour"
- "Show me all my Cosmos DB databases"

## Developing servers

As a developer, you can create new servers that perform specific functions and integrating them into larger systems. This approach involves using frameworks, client libraries, tools, and services to define detailed server behaviors and interactions.

**When to use this scenario:**
- You need custom server functionality not available in existing solutions
- Your application requires deep integration with multiple Azure services
- You want to create specialized capabilities tailored to your domain expertise
- You need fine-grained control over how AI interacts with your data and services
- You're building advanced solutions that require custom reasoning or domain-specific knowledge

Developing an MCP server gives you greater flexibility in creating specialized servers that can perform complex tasks across multiple Azure services.

**Integration syntax**

When developing your own servers, use the structured command syntax to integrate with existing Azure MCP servers:

```console
# List resource groups
azmcp group list --subscription "my-subscription-id"

# Query log analytics
azmcp monitor log-query --subscription "my-subscription-id" --workspace "my-workspace" --resource-group "my-rg" --table-name "AppEvents" --query "where TimeGenerated > ago(1h)"

# Execute an Azure CLI command
azmcp extension az --command "group list"
```

[!INCLUDE [tip-about-parameters](../includes/tools/parameter-consideration.md)]

### Available services and frameworks for MCP server development

The following services and frameworks enable you to build custom MCP servers that can integrate with Azure resources:

- [Azure OpenAI Assistants](/azure/ai-services/openai/concepts/assistants)
- [Azure AI Agents Service](/azure/ai-services/agents/overview)
- [Azure OpenAI Service](/azure/ai-services/openai/)
- [Semantic Kernel](/semantic-kernel/overview/)
- [LangChain](https://www.langchain.com/)
- [LlamaIndex](https://docs.llamaindex.ai/)

### Common technical details

The following sections describe technical aspects that apply to all Azure MCP Server tools.

#### Optional parameters common to all tools

[!INCLUDE [common-parameters](../includes//tools/common-parameters.md)]

#### Response format common to all tools

[!INCLUDE [json-response-from-tool](../includes/tools/response-format.md)]

#### Tool error handling

[!INCLUDE [response-error-handling](../includes/tools/error-handling.md)]

## Next steps

- Learn about [Azure MCP Server](../get-started.md)
- Explore [Consuming agents with App Configuration tools](app-configuration.md)
- Discover [Developing agents with Azure Monitor logs](monitor.md)
- Read about [MCP tools for Azure Storage resources](storage.md)

