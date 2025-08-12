---
title: Azure Cache for Redis Tools for Azure MCP Server
description: Learn how to manage Azure Cache for Redis instances using the Azure MCP Server with natural language prompts. Discover tools for Redis clusters, databases, caches, and access policies.
keywords: azure mcp server, azmcp, cache for redis, redis cache, redis cluster, redis enterprise
author: diberry
ms.author: diberry
ms.date: 07/01/2025
ms.topic: reference
ms.service: azure
ai-usage: ai-assisted
ms.custom: build-2025
---

# Azure Cache for Redis tools for Azure MCP Server

The Azure MCP Server allows you to manage Azure Cache for Redis instances using natural language prompts. You can quickly manage Redis caches, clusters, databases, and access policies without remembering complex syntax or commands.

[Azure Cache for Redis](/azure/azure-cache-for-redis/cache-overview) provides an in-memory data store based on the Redis software. Redis improves the performance and scalability of applications that use backend data stores heavily. It's able to process large volumes of application requests by keeping frequently accessed data in server memory, which can be written to and read from quickly.

Azure Cache for Redis offers both Redis open-source (OSS Redis) and Redis Enterprise as managed services. The service supports multiple tiers including Basic, Standard, Premium, Enterprise, and Enterprise Flash, each offering different levels of performance, features, and availability.

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## List Redis clusters

The Azure MCP Server can list Redis clusters in Azure Cache for Redis Enterprise services. This allows you to view all your Redis Enterprise clusters across your subscription.

Example prompts include:

- **List clusters:** "Show me all Redis clusters in my subscription."
- **Find clusters:** "What Redis Enterprise clusters do I have?"
- **Query clusters:** "List all my Redis clusters"
- **Check cluster status:** "Show Redis clusters in subscription abc123"
- **View cluster inventory:** "Get all Redis Enterprise clusters"

| Parameter | Required | Description |
| --- | --- | --- |
| Subscription | Required | The ID of the subscription containing the Redis clusters. |

## List cluster databases

The Azure MCP Server can list databases in an Azure Redis cluster. Redis Enterprise supports multiple databases within a single cluster, allowing you to organize and isolate your data.

Example prompts include:

- **List databases:** "Show me all databases in my 'redis-cluster-prod' cluster."
- **View cluster databases:** "What databases are in the Redis cluster in resource group 'my-rg'?"
- **Check database inventory:** "List databases for cluster 'enterprise-cache'"
- **Query databases:** "Show databases in Redis cluster 'main-cluster'"
- **Database overview:** "Get all databases from my Redis Enterprise cluster"

| Parameter | Required | Description |
| --- | --- | --- |
| Subscription | Required | The ID of the subscription containing the Redis cluster. |
| Resource group | Required | The name of the Azure resource group containing the cluster. |
| Cluster | Required | The name of the Redis cluster. |

## List Redis caches

The Azure MCP Server can list Redis caches in the Azure Cache for Redis service. This includes Basic, Standard, and Premium tier caches that provide traditional Redis functionality.

Example prompts include:

- **List caches:** "Show me all Redis caches in my subscription."
- **Find caches:** "What Azure Cache for Redis instances do I have?"
- **View cache inventory:** "List all my Redis caches"
- **Check cache status:** "Show Redis caches in subscription abc123"
- **Query caches:** "Get all my Azure Cache for Redis instances"

| Parameter | Required | Description |
| --- | --- | --- |
| Subscription | Required | The ID of the subscription containing the Redis caches. |

## List cache access policies

The Azure MCP Server can list access policy assignments in an Azure Redis cache. Azure Cache for Redis provides role-based access control (RBAC) to manage user permissions and enforce authentication and authorization rules.

Example prompts include:

- **List access policies:** "Show me access policies for my 'prod-cache' Redis cache."
- **View permissions:** "What access policies are assigned to Redis cache 'main-cache'?"
- **Check RBAC:** "List access policy assignments for cache in resource group 'production'"
- **Query policies:** "Show access control policies for 'enterprise-redis'"
- **Permission audit:** "Get all access policies for Redis cache 'secure-cache'"

| Parameter | Required | Description |
| --- | --- | --- |
| Subscription | Required | The ID of the subscription containing the Redis cache. |
| Resource group | Required | The name of the Azure resource group containing the cache. |
| Cache | Required | The name of the Redis cache. |

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure Cache for Redis documentation](/azure/azure-cache-for-redis/)
