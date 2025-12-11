---
title: Azure Subscription Tools 
description: Learn how to use the Azure MCP Server with Azure Subscriptions.
keywords: azure mcp server, azmcp, subscription
author: diberry
ms.author: diberry
ms.date: 11/17/2025
content_well_notification: 
  - AI-contribution
ai-usage: ai-assisted
ms.topic: concept-article
ms.custom: build-2025
--- 
# Subscription tools for the Azure MCP Server overview

The Azure MCP Server allows you to manage Azure resources, including subscriptions, using natural language prompts. This server enables you to quickly list subscriptions without needing to remember complex syntax.

provide a way to organize and manage access to Azure resources. Subscriptions are the foundation for resource management, billing, and access control in Azure.

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## List subscriptions

<!-- subscription list -->

The Azure MCP Server can list all subscriptions.

Example prompts include:

- **List subscriptions**: "Show me all of my subscriptions."
- **Find subscriptions**: "List all subscriptions starting with `northeast`."

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [subscription list](../includes/tools/annotations/azure-subscription-list-annotations.md)]

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure Subscriptions](/azure/cost-management-billing/manage/cloud-subscription) 