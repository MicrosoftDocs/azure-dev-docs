---
title: Azure App Lens Tools - Azure MCP Server
description: "Learn how to use Azure MCP Server with Azure App Lens to manage application performance and insights. Get started with natural language prompts."
keywords: azure mcp server, azmcp, azure app lens, application performance, insights
ai-usage: ai-assisted
content_well_notification: 
  - AI-contribution
author: diberry
ms.author: diberry
ms.service: azure-mcp-server
ms.topic: concept-article
ms.date: 11/17/2025
---

# Azure App Lens tools for the Azure MCP Server overview

The Azure MCP Server helps you manage Azure resources, including Azure App Lens, using natural language prompts. This feature enables you to quickly manage your application performance and insights without needing to remember complex syntax.

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## Resource: Diagnose

<!-- applens resource diagnose -->

Diagnose Azure resource performance issues, slowness, failures, and availability problems. This tool returns a list of insights and solutions to the user question.

Example prompts include:

- **Diagnose app issues**: "Please help me diagnose issues with my app 'mywebapp' in resource group 'my-resource-group' using app lens for resource type 'WebApp'"
- **Check app slowness**: "Use app lens to check why my app 'orders-api' in resource group 'my-resource-group' is slow for resource type 'API'"
- **Service health**: "What does app lens say is wrong with my service 'inventory-service' in resource group 'my-resource-group' for resource type 'ServiceFabric'?"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group** |  Required | The name of the Azure resource group. This is a logical container for Azure resources. |
| **Question** |  Required | User question. |
| **Resource** |  Required | The name of the resource to investigate or diagnose. |
| **Resource Type** |  Required | Resource type.  |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [applens resource diagnose](../includes/tools/annotations/azure-app-lens-resource-diagnose-annotations.md)]

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)