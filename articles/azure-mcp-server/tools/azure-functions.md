---
title: Azure Functions app tools in Azure MCP Server
description: Learn how to use the Azure MCP Server to manage your function app resources in Azure.
keywords: azure mcp server, azmcp, function apps
author: diberry
ms.author: diberry
ms.date: 11/17/2025
content_well_notification: 
  - AI-contribution
ai-usage: ai-assisted
ms.topic: concept-article
ms.custom: build-2025
--- 

# Azure Functions tools for the Azure MCP Server overview

The Azure MCP Server enables you to manage Azure resources, including function apps, by using natural language prompts. With this approach, you can quickly list your apps without needing to remember complex syntax.

[Azure Functions](/azure/azure-functions/) is a serverless compute service that enables you to integrate code execution into your Azure services with less code and by using popular development tools. Instead of worrying about deploying and maintaining servers, you can spend time developing your applications.

## Get 

<!-- functionapp get -->

Get details for a specific function app or list all function apps in your subscription. Returns information including name, location, status, and app service plan.

Example prompts include:

- "List all Function Apps in my subscription"
- "Show me all Function Apps in resource group 'rg-production'"
- "Retrieve details for the Function App named 'HealthMonitor' in resource group 'rg-production'"
- "Can you get the configuration of Function App 'DataProcessor' within resource group 'rg-analytics'?"


| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Function app** |  Optional | The name of the function app. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [functionapp get](../includes/tools/annotations/azure-functions-get-annotations.md)]

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure Functions](/azure/azure-functions/)