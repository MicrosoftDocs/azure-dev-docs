---
title: Azure Resource Group Tools 
description: Learn how to use the Azure MCP Server with Azure Resource Groups.
keywords: azure mcp server, azmcp, resource group
author: diberry
ms.author: diberry
ms.date: 11/14/2025
content_well_notification: 
  - AI-contribution
ai-usage: ai-assisted
ms.topic: reference
ms.custom: build-2025
--- 
# Resource group tools for the Azure MCP Server

The Azure MCP Server allows you to manage Azure resource groups, providing foundational resource organization capabilities with natural language prompts. You can view your resource groups without needing to remember specific command syntax.

[Azure Resource Groups](/azure/azure-resource-manager/management/overview) are logical containers that help you organize and manage your Azure resources. Resource groups make it easier to administer your resources by deployment, billing, or natural affinity.

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## List resource groups

<!-- group list -->

The Azure MCP Server can list all resource groups in a subscription. This helps you see your organizational structure at a glance.

Example prompts include:

- **List groups**: "Show me all resource groups in my subscription."
- **View groups**: "What resource groups do I have available?"
- **Find groups**: "List all my resource groups"
- **Query groups**: "Show my resource group organization"
- **Check groups**: "Resource groups in subscription abc123"

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [group list](../includes/tools/annotations/azure-resource-group-list-annotations.md)]

## Related content

- [Subscription tools](subscription.md)
- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)