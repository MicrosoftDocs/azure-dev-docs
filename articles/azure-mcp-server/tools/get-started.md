---
title: Azure MCP Server tools
description: Learn how to use the Azure MCP Server tools for consuming and developing servers.
keywords: azure mcp server, azmcp
author: diberry
ms.author: diberry
ms.date: 05/14/2025
ms.topic: get-started
content_well_notification: 
  - AI-contribution
ai-usage: ai-assisted
ms.custom: build-2025
---
# Getting started with Azure MCP Server tools

The Azure Model Context Protocol (MCP) Server enables interaction with Azure services through natural language tools. This article provides an overview of tools supported by the Azure MCP Server and explains how to use them in two key development scenarios: [consuming existing servers](#consume-existing-mcp-servers) and [developing new servers](#develop-your-own-mcp-server).

## Supported services

[!INCLUDE [supported-azure-services](../includes/tools/supported-azure-services.md)]

## Developer scenarios

Developers can use the Azure MCP Server in two main ways:

### Consume existing MCP servers

Most developers use existing MCP servers, like the Azure MCP Server, to build intelligent apps.

This approach focuses on using prebuilt servers to perform specific tasks within your broader system. For example, you can use the Azure MCP Server to list Azure storage accounts or run KQL queries on Azure databases. This scenario is ideal for developers who want to quickly add AI functionality without building servers from scratch.

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

### Develop your own MCP server

Some developers create their own MCP servers to offer custom tools, resources, and prompts for specific needs. This scenario is more advanced and needs a deeper understanding of the MCP protocol.

This approach involves using frameworks, client libraries, tools, and services to define detailed server behaviors and interactions. This scenario works best for developers who need custom server features not available in existing solutions.

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

#### Available services and frameworks for MCP server development

The following services and frameworks enable you to build custom MCP servers that can integrate with Azure resources:

- [Azure OpenAI Assistants](/azure/ai-services/openai/concepts/assistants)
- [Azure AI Agents Service](/azure/ai-services/agents/overview)
- [Azure OpenAI Service](/azure/ai-services/openai/)
- [Semantic Kernel](/semantic-kernel/overview/)
- [LangChain](https://www.langchain.com/)
- [LlamaIndex](https://docs.llamaindex.ai/)

#### Common technical details

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
