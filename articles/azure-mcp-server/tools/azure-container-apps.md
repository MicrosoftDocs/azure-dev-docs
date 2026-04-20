---

title: Azure MCP Server tools for Azure Container Apps
description: Use Azure MCP Server tools to manage containerized applications and serverless container instances in Azure Container Apps with natural language prompts from your IDE.
ms.date: 4/6/2026
ms.service: azure-mcp-server
ms.topic: concept-article
tool_count: 1
mcp-cli.version: 2.0.0-beta.39
reviewer: ArthurMa1978
author: diberry
ms.author: diberry
ai-usage: ai-generated
ms.custom: build-2025
content_well_notification:
  - AI-contribution
---

# Azure MCP Server tools for Azure Container Apps

The Azure MCP Server lets you manage containerized applications on Azure Container Apps, including: list, with natural language prompts.

Azure Container Apps is a fully managed serverless container platform for building and running microservices and containerized applications. For more information, see [Azure Container Apps documentation](/azure/container-apps/).

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]


## List container apps

<!-- @mcpcli containerapps list -->

This tool, part of the Model Context Protocol (MCP), lists Azure Container Apps in a subscription. You can optionally filter results by a resource group. Each returned container app includes the following properties: `name`, `location`, `resourceGroup`, `managedEnvironmentId`, and `provisioningState`. If no container apps are found, this tool returns an empty list of results, consistent with other list tools.

Example prompts include:

- "List all Azure Container Apps in my subscription."
- "Show me my Azure Container Apps."
- "List container apps in resource group 'rg-prod'."
- "Show me the container apps in resource group 'webapp-dev'."


[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure Container Apps documentation](/azure/container-apps/)
