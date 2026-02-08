---
title: Azure advisor tools for the Azure MCP Server overview
description: Learn about the tools in Azure advisor for managing resource optimization and recommendations as part of the Azure MCP Server.
#customer intent: As an Azure admin, I want to learn how to use Azure Advisor tools so I can optimize resource performance and costs in the Azure MCP Server.
ms.date: 02/08/2026
ms.reviewer: ankiga
keywords: Azure, MCP Server, advisor, resource optimization, recommendations, management
ms.service: azure-mcp-server
ms.topic: concept-article
tool_count: 1
ai-usage: ai-generated
---

# Azure advisor tools for the Azure MCP Server overview

The Azure MCP Server lets you manage resource optimization, cost recommendations, and performance improvements with natural language prompts.

Advisor is a service that gives you actionable insights to help you optimize your Azure resources and improve performance. For more about Advisor, see [Azure advisor documentation](/azure/advisor/).

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## Get recommendation list

<!-- @mcpcli advisor recommendation list -->

Show Azure Advisor recommendations for a subscription.

### Example prompts:

- "Show Azure Advisor recommendations for subscription 'MySubscription'."
- "What are the current Advisor recommendations for my subscription 'MySubscription'?" 
- "Show me all Azure Advisor recommendations under subscription 'MySubscription'."
- "Get details for the Advisor recommendation 'PerformanceOptimize' in subscription 'MySubscription'."
- "Retrieve the Advisor recommendation named 'SecurityEnhance' from subscription 'MySubscription'."

<!-- No parameters for this tool -->

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure Advisor documentation](/azure/advisor/)