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

The Azure Model Context Protocol (MCP) Server enables interaction with Azure services through natural language tools. This article provides an overview of tools supported by the Azure MCP Server and explains how to use them in two key development scenarios: consuming existing servers and developing new servers.

## Key development scenarios

Azure MCP Server supports two primary development scenarios:

### Consuming servers

As a developer, you can use existing server to integrate autonomous callable systems with memory into your applications. This approach focuses on leveraging pre-built servers to perform specific tasks within your broader system.

**When to use this scenario:**
- You need to integrate ready-to-use server capabilities
- You want to quickly add AI functionality without building servers from scratch
- Your application needs to perform specific Azure service operations through natural language

### Developing servers

As a developer, you can create new servers as part of your workflow. This includes building modular servers that perform specific functions and integrating them into larger systems. This approach involves using frameworks, SDKs, tools, and services to define detailed server behaviors and interactions.

**Available tools for server development:**
- Azure OpenAI Assistants API
- Azure AI Agents Service SDK
- Azure OpenAI Service SDKs
- Semantic Kernel
- LangChain
- LlamaIndex


## Supported services

[!INCLUDE [supported-azure-services](../includes/tools/supported-azure-services.md)]

## Use existing servers with natural language prompts

The Azure MCP Server accepts natural language prompts, allowing you to interact with Azure resources conversationally:

- "Show me all my resource groups"
- "List blobs in my storage container named 'documents'"
- "What's the value of the 'ConnectionString' key in my app configuration?"
- "Query my log analytics workspace for errors in the last hour"
- "Show me all my Cosmos DB databases"

## Developing new servers

This approach gives you greater flexibility in creating specialized servers that can perform complex tasks across multiple Azure services.

Use the structured syntax when integrating your new server with existing Azure MCP servers. Examples of this syntax include:

```console
# List resource groups
azmcp group list --subscription "my-subscription-id"

# Query log analytics
azmcp monitor log-query --subscription "my-subscription-id" --workspace "my-workspace" --resource-group "my-rg" --table-name "AppEvents" --query "where TimeGenerated > ago(1h)"

# Execute an Azure CLI command
azmcp extension az --command "group list"
```

[!INCLUDE [tip-about-parameters](../includes/tools/parameter-consideration.md)]

### Optional parameters common to all tools

[!INCLUDE [common-parameters](../includes//tools/common-parameters.md)]

### Response format common to all tools

[!INCLUDE [json-response-from-tool](../includes/tools/response-format.md)]

### Tool error handling

[!INCLUDE [response-error-handling](../includes/tools/error-handling.md)]

## Next steps

- Learn about [Azure MCP Server](../get-started.md)
- Explore [Consuming agents with App Configuration tools](app-configuration.md)
- Discover [Developing agents with Azure Monitor logs](monitor.md)
- Read about [MCP tools for Azure Storage resources](storage.md)

