---
title: Azure Redis Tools for Azure MCP Server
description: Learn how to manage Azure Redis instances using the Azure MCP Server with natural language prompts. Discover tools for Redis clusters, databases, caches, and access policies.
keywords: azure mcp server, azmcp, managed redis, cache for redis, redis cache, redis cluster, redis enterprise
author: diberry
ms.author: diberry
ms.date: 10/27/2025
ms.topic: reference
ms.service: azure
ai-usage: ai-assisted
ms.custom: build-2025
---

# Azure Redis tools for Azure MCP Server

The Azure MCP Server lets you manage Azure Redis instances using natural language prompts. You can quickly manage Redis caches, clusters, databases, and access policies without remembering complex syntax or commands.

[Azure Redis](/azure/redis) provides an in-memory data store based on the Redis software. Redis improves the performance and scalability of applications that use backend data stores heavily. Redis processes large volumes of application requests by keeping frequently accessed data in server memory, which you can write to and read from quickly.

The Azure Redis tools support both [Azure Managed Redis](/azure/redis/overview) and [Azure Cache for Redis](/azure/azure-cache-for-redis/cache-overview).

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## List Redis resources

<!-- redis list -->

Lists all Redis resources in a subscription. Returns details of all Azure Managed Redis, Azure Cache for Redis, and Azure Redis Enterprise resources. Use this command to explore and view which Redis resources are available in your subscription.

Example prompts include:

- `List all Redis resources in my subscription`
- `Show me my Redis caches`
- `Show me the Redis resources in my subscription`
- `Get Redis clusters`
- `What Redis caches do I have?`

[!INCLUDE [redis list](../includes/tools/annotations/azure-managed-redis-list-annotations.md)]

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure Redis](/azure/redis/)
