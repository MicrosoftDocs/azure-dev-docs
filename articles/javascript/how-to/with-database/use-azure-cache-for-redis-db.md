---
title: Use JavaScript with Redis on Azure 
description: To create or move your Redis database to Azure, you need a Azure Cache for Redis resource. 
ms.topic: how-to
ms.date: 02/17/2021
ms.custom: devx-track-js
---

# Develop a JavaScript application with Redis on Azure


To create, move, or use a Redis database to Azure, you need an **Azure Cache for Redis** resource. Learn how to create the resource and use your database.

## Create a Cosmos DB resource for a Cassandra DB database

You can create a resource with:

* Azure CLI
* [Azure portal](https://ms.portal.azure.com/#create/Microsoft.Cache)

[!INCLUDE [Azure CLI commands](../../includes/azure-cli-cache-for-redis-db.md)]

## View and use your Redis database

While developing your Redis database with JavaScript, use the [Redis console](/azure/azure-cache-for-redis/cache-configure#redis-console) from the Azure portal to work with your database.

:::image type="content" source="../../media/howto-database/azure-cache-for-redis-console-button.png" alt-text="While developing your Redis database with JavaScript, use the Redis console from the Azure portal to work with your database.":::

This console provides [Redis CLI](https://redis.io/topics/rediscli) functionality. Be aware [some commands are not supported](/azure/azure-cache-for-redis/cache-configure#redis-commands-not-supported-in-azure-cache-for-redis).

