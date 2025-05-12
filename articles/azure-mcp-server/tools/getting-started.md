---
title: Azure MCP Server tools
description: Learn how to use the Azure MCP Server tools.
keywords:  azure mcp server, azmcp
author: diberry
ms.author: diberry
ms.date: 04/22/2025
ms.topic: getting-started
ms.custom: build-2025
---
# Getting started with Azure MCP Server tools

The Azure Model Context Protocol (MCP) Server enables interaction with Azure services through natural language tools. This article provides an overview of tools supported by the Azure MCP Server and links to detailed documentation for each service.

## How Azure MCP Server tools work

Azure MCP Server tools follow a consistent pattern across all supported Azure services:

1. **Natural language prompts**: You can use conversational language to perform operations on Azure resources.
2. **Direct tools**: For automation and scripting, you can use the command-line interface with specific parameters.
3. **Authentication and authorization**: Azure MCP Server uses your Azure credentials to authenticate and authorize operations based on your permissions.

[!INCLUDE [tip-about-parameters](../includes/tools/parameter-consideration.md)]

## Supported services

[!INCLUDE [supported-azure-services](../includes/tools/supported-azure-services.md)]

## Example usage patterns

Azure MCP Server tools can be accessed in two primary ways: through natural language prompts in conversational interfaces, or through structured command-line parameters for automation and scripting. Both approaches provide access to the same Azure services and operations, letting you choose the interaction method that best fits your workflow or development scenario.

### Natural language tool examples

The Azure MCP Server accepts natural language prompts, allowing you to interact with Azure resources conversationally:

- "Show me all my resource groups"
- "List blobs in my storage container named 'documents'"
- "What's the value of the 'ConnectionString' key in my app configuration?"
- "Query my log analytics workspace for errors in the last hour"
- "Show me all my Cosmos DB databases"

### Tools 



#### Tool usage examples

For scripting and automation, you can use the command-line syntax:

```console
# List resource groups
azmcp group list --subscription "my-subscription-id"

# Query log analytics
azmcp monitor log-query --subscription "my-subscription-id" --workspace "my-workspace" --resource-group "my-rg" --table-name "AppEvents" --query "where TimeGenerated > ago(1h)"

# Execute an Azure CLI command
azmcp extension az --command "group list"
```

#### Tool JSON response

[!INCLUDE [json-response-from-tool](../includes/tools/response-format.md)]

#### Tool error handling

[!INCLUDE [response-error-handling](../includes/tools/error-handling.md)]


## Next steps

- Learn about [Azure MCP Server](../get-started.md)
- Explore supported [App Configuration tools](app-configuration.md)
- Discover how to [Query Azure Monitor logs](monitor.md)
- Read about [MCP tools for Azure Storage resources](storage.md)

