---
title: Azure Redis Tools for Azure MCP Server
description: Learn how to manage Azure Redis instances using the Azure MCP Server with natural language prompts. Discover tools for creating and listing Redis resources.
keywords: azure mcp server, azmcp, managed redis, cache for redis, redis cache, redis cluster, redis enterprise
author: diberry
ms.author: diberry
ms.date: 11/17/2025
ms.topic: concept-article
ms.service: azure
ai-usage: ai-assisted
ms.custom: build-2025
---

# Azure Redis tools for Azure MCP Server overview

The Azure MCP Server lets you manage Azure Redis instances using natural language prompts. You can create new Redis resources and list existing Redis resources without remembering complex syntax or commands.

[Azure Redis](/azure/redis) provides an in-memory data store based on the Redis software. Redis improves the performance and scalability of applications that use backend data stores heavily. Redis processes large volumes of application requests by keeping frequently accessed data in server memory, which you can write to and read from quickly.

The Azure Redis tools support both [Azure Managed Redis](/azure/redis/overview) and [Azure Cache for Redis](/azure/azure-cache-for-redis/cache-overview).

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## Create a Redis resource

<!-- redis create -->

Create a new Azure Managed Redis resource in Azure. Use this command to provision a new Redis resource in your subscription.

Example prompts include:

- "Create a new Redis instance named 'my-redis' in resource group 'rg-backend' located in 'eastus'"
- "Set up a Redis cache called 'cache-prod' within resource group 'rg-production' at location 'westus2'"
- "I need to create Redis resource 'fastcache' in 'rg-apps' resource group with location 'centralus'"
- "Provision Redis named 'session-store' in resource group 'rg-sessions' located in 'northcentralus'"
- "Please create Redis resource 'redis-main' in resource group 'rg-main' at 'eastus2' location"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource** |  Required | The name of the Redis resource (for example, `my-redis`). |
| **Resource group** |  Required | The name of the Azure resource group. This is a logical container for Azure resources. |
| **SKU** |  Optional | The SKU for the Redis resource. (Default: `Balanced_B0`). |
| **Location** |  Required | The location for the Redis resource (for example `eastus`). |
| **Access keys authentication** |  Optional | Whether to enable access keys for authentication for the Redis resource. (Default: `false`). |
| **Modules** |  Optional | A list of modules to enable on the Azure Managed Redis resource (for example, `RedisBloom`, `RedisJSON`). |

[!INCLUDE [redis create](../includes/tools/annotations/azure-managed-redis-create-annotations.md)]

## List Redis resources

<!-- redis list -->

Lists all Redis resources in a subscription. Returns details of all Azure Managed Redis, Azure Cache for Redis, and Azure Redis Enterprise resources. Use this command to explore and view which Redis resources are available in your subscription.

Example prompts include:

- "Show me all Redis caches available in my Azure subscription"
- "List every Redis instance I have under tenant 'contoso.com'"
- "Get details for Redis cache 'redisCacheWestUS' in subscription 'ProductionSub'"
- "Can you retrieve information about Redis instance 'sales-redis-cache'?"
- "I want to see the Redis cache named 'inventory-redis' in my tenant 'contoso.com'"

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [redis list](../includes/tools/annotations/azure-managed-redis-list-annotations.md)]

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure Redis](/azure/redis/)
