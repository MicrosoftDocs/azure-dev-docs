---
title: Azure Functions app tools in Azure MCP Server
description: Learn how to use the Azure MCP Server to manage your function app resources in Azure.
keywords: azure mcp server, azmcp, function apps
author: diberry
ms.author: diberry
ms.date: 10/27/2025
content_well_notification: 
  - AI-contribution
ai-usage: ai-assisted
ms.topic: reference
ms.custom: build-2025
--- 

# Azure Functions tools for the Azure MCP Server

The Azure MCP Server enables you to manage Azure resources, including function apps, by using natural language prompts. With this approach, you can quickly list your apps without needing to remember complex syntax.

[Azure Functions](/azure/azure-functions/) is a serverless compute service that enables you to integrate code execution into your Azure services with less code and by using popular development tools. Instead of worrying about deploying and maintaining servers, you can spend time developing your applications.

## Get 

<!-- functionapp get -->

Get the Azure function app details.


Example prompts include:

- **Get function app details**: "Get details for my function app 'my-function-app' in resource group 'my-resource-group'."
- **Get specific function app**: "Show me the function app 'my-function-app' in resource group 'my-resource-group'."
- **Get function app settings**: "Show the settings for function app 'my-function-app' in resource group 'my-resource-group'."
- **Get function app status**: "Get the current status of function app 'my-function-app' in resource group 'my-resource-group'."
- **Get function app hostnames**: "List the hostnames for function app 'my-function-app' in resource group 'my-resource-group'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Function app** |  Required | The name of the function app. |

[Tool annotation hints](index.md#tool-annotation-hints):

[!INCLUDE [functionapp get](../includes/tools/annotations/azure-functions-get-annotations.md)]

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure Functions](/azure/azure-functions/)