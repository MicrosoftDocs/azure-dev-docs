---
title: Azure best practices tools - Azure MCP Server
description: Use the Azure best practices tools in Azure MCP Server to get guidance on Azure Functions development, deployment, and Azure SDK usage.
keywords: azure mcp server, azmcp, best practices
ms.service: azure-mcp-server
content_well_notification: 
  - AI-contribution
ai-usage: ai-assisted
ms.topic: reference
ms.date: 10/27/2025
author: diberry
ms.author: diberry
---

# Azure best practices tools

This article describes the best practices tools in Azure MCP Server that provide guidance on Azure service usage, development, and deployment.

Azure best practices tools offer recommendations for Azure service implementation patterns to help you build robust, secure, and efficient Azure applications.

## Get best practices

<!-- bestpractices get -->

Returns best practices for secure, production-grade Azure SDK usage. Use this tool to get guidance on implementing Azure services in your applications.

Example prompts include:

- **General best practices**: "What are the best practices for using Azure SDKs?"
- **Implementation guidance**: "Show me guidance on implementing Azure services in my application"
- **Authentication handling**: "How should I handle authentication with Azure SDKs?"
- **Connection management**: "What's the recommended way to manage connections with Azure services?"
- **Secure implementation**: "I need help implementing Azure services securely in my application"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Resource** | Required | The type of Azure resource to get best practices for. Options include: 'general' (general Azure best practices), 'azurefunctions' (Azure Functions specific best practices), or 'static-web-app' (Azure Static Web Apps specific best practices). |
| **Action** | Required | The action to perform. Options include: 'all' (best practices for both code generation and deployment, only for static-web-app), 'code-generation' (best practices for code generation, for general and azurefunctions), or 'deployment' (best practices for deployment, for general and azurefunctions). |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [get bestpractices get](../includes/tools/annotations/azure-get-best-practices-get-annotations.md)]

## Related resources

- [Azure Functions documentation](/azure/azure-functions/)
- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)