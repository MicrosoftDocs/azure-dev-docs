---
title: Azure MCP Server tools for Azure Well-Architected Framework
description: Use Azure MCP Server tools to get Azure Well-Architected Framework guidance, best practices, and recommendations for Azure services with natural language prompts from your IDE.
author: diberry
ms.author: diberry
ms.service: azure-mcp-server
ms.topic: concept-article
ms.date: 03/27/2026
reviewer: skakara
content_well_notification:
  - AI-contribution
ai-usage: ai-assisted
tool_count: 1
mcp-cli.version: 2.0.0-beta.33
---

# Azure MCP Server tools for Azure Well-Architected Framework

The Azure Model Context Protocol (MCP) Server lets you get Azure Well-Architected Framework guidance, best practices, and recommendations for Azure services with natural language prompts.

Azure Well-Architected Framework is a set of guiding tenets that help you design, build, and optimize workloads across five pillars: reliability, security, cost optimization, operational excellence, and performance efficiency; for more information, see [Azure Well-Architected Framework documentation](/azure/architecture/framework/).

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## Get Well-Architected Framework service guide

<!-- @mcpcli wellarchitectedframework serviceguide get -->

This tool retrieves Azure Well-Architected Framework guidance for a specific Azure service, or lists all supported services when no service is specified. When you provide a service, the tool returns architectural best practices, design patterns, and recommendations across the five pillars: reliability, security, cost optimization, operational excellence, and performance efficiency.

Example prompts include:

- "Show all services with Well-Architected Framework guidance."
- "Which services have architectural guidance under the Well-Architected Framework?"
- "Retrieve Well-Architected Framework guidance for service 'App Service'."
- "What's the WAF guidance for service 'Cosmos DB'?"
- "Show the architectural guidance for 'Azure Functions'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Service** |  Optional | A single Azure service name. The value is case-insensitive and accepts hyphens, underscores, and spaces. If the name contains spaces, enclose it in double quotes. Examples: `cosmos-db`, `Cosmos_DB`, `Cosmos DB`, `cosmosdb`, `cosmos-database`. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure Well-Architected Framework documentation](/azure/architecture/framework/)