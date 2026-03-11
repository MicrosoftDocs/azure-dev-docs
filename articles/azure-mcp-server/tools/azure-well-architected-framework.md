---
title: Azure Well-Architected Framework tools for architecture guidance
description: Use Azure MCP Server tools to get Azure Well-Architected Framework guidance, best practices, and recommendations for Azure services from your IDE.
#customer intent: As a developer, I want to get Well-Architected Framework guidance for Azure services so I can follow architectural best practices.
ms.date: 03/11/2026
ms.service: azure-mcp-server
ms.topic: concept-article
ms.reviewer: conniey
tool_count: 1
---

# Azure Well-Architected Framework tools for the Azure MCP Server overview

The MCP Server lets you get Azure Well-Architected Framework guidance, best practices, and recommendations for Azure services with natural language prompts.

Azure Well-Architected Framework is a set of guiding tenets that enable you to optimize your workloads across five pillars: reliability, security, cost optimization, operational excellence, and performance efficiency. For more information, see [Azure Well-Architected Framework documentation](/azure/architecture/framework/).

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## Get service guide

<!-- @mcpcli wellarchitectedframework serviceguide get -->

Get Azure Well-Architected Framework guidance for a specific Azure service. This tool returns architectural best practices, design patterns, and recommendations based on the five pillars: reliability, security, cost optimization, operational excellence, and performance efficiency. Specify an Azure service name such as `App Service`, `SQL Database`, or `Cosmos DB`.

Example prompts include:
- "Get Well-Architected Framework guidance for `SQL Database`."
- "What is the WAF guidance for `App Service`?"
- "Show me the best practices for `Storage Accounts`."
- "What is the architectural guidance for `Azure Functions`?"

| Parameter | Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Service** | Required | The Azure service name (case-insensitive; spaces and hyphens are normalized). For example, `App Service`, `app-service`, `SQL Database`, `sql-database`, `Cosmos DB`, or `cosmos-db`. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):
Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure Well-Architected Framework documentation](/azure/architecture/framework/)
