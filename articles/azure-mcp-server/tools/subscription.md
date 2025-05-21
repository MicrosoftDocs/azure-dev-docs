---
title: Azure Subscription Tools 
description: Learn how to use the Azure MCP Server with Azure Subscriptions.
keywords: azure mcp server, azmcp, subscription
author: diberry
ms.author: diberry
ms.date: 05/20/2025
content_well_notification: 
  - AI-contribution
ai-usage: ai-assisted
ms.topic: reference
ms.custom: build-2025
--- 
# Subscription tools for the Azure MCP Server

The Azure MCP Server allows you to manage Azure resources, including subscriptions, using natural language prompts. This server enables you to quickly list subscriptions without needing to remember complex syntax.

[Azure Subscriptions](/azure/cost-management-billing/manage/cloud-subscription) provide a way to organize and manage access to Azure resources. Subscriptions are the foundation for resource management, billing, and access control in Azure.

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## List subscriptions

The Azure MCP Server can list all subscriptions.

**Example prompts** include:

- **List subscriptions**: "Show me all of my subscriptions."
- **Find subscriptions**: "List all subscriptions starting with `northeast`."

| Parameter       | Required or optional | Description                                                                 |
|-----------------|-------------------|-----------------------------------------------------------------------------|
| **Subscription** | Required          | The name or ID of the user subscription.            |
