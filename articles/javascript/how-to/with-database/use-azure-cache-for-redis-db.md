---
title: Use JavaScript with Redis on Azure 
description: To create or move your Redis database to Azure, you need an Azure Cache for Redis resource. 
ms.topic: how-to
ms.date: 03/04/2021
ms.custom: devx-track-js, devx-track-azurecli
---

# Develop a JavaScript application with Azure Cache for Redis


To create, move, or use a Redis database to Azure, you need an **Azure Cache for Redis** resource. Learn how to create the resource and use your database.

## Create a resource for a Redis database

You can create a resource with:

* Azure CLI
* [Azure portal](https://ms.portal.azure.com/#create/Microsoft.Cache)

[!INCLUDE [Azure CLI commands](../../includes/azure-cli-cache-for-redis-db.md)]

## View and use your Redis database

While developing your Redis database with JavaScript, use the [Redis console](/azure/azure-cache-for-redis/cache-configure#redis-console) from the Azure portal to work with your database.

:::image type="content" source="../../media/howto-database/azure-cache-for-redis-console-button.png" alt-text="While developing your Redis database with JavaScript, use the Redis console from the Azure portal to work with your database.":::

This console provides [Redis CLI](https://redis.io/topics/rediscli) functionality. Be aware [some commands are not supported](/azure/azure-cache-for-redis/cache-configure#redis-commands-not-supported-in-azure-cache-for-redis).

Once you have your resource created, [import your data](/azure/azure-cache-for-redis/cache-how-to-import-export-data) into your Redis resource from Azure Storage using the Azure portal. 

## Use native SDK packages to connect to Redis on Azure

The Redis database uses npm packages such as:

* [redis](https://www.npmjs.com/package/redis)
* [ioredis](https://www.npmjs.com/package/ioredis)

## Install ioredis SDK 

Use the following procedure to install the `ioredis` package and initialize your project.

1. Make sure Node.js and npm are installed.
1. Create a Node.js project in a new folder:

    ```bash
    mkdir DataDemo && \
        cd DataDemo && \
        npm init -y && \
        npm install ioredis \
        code .
    ```

    The command:
    * Creates a project folder named `DataDemo`
    * Changes the Bash terminal into that folder
    * Initializes the project, which creates the `package.json` file
    * Adds the ioredis npm SDK to the project
    * Opens the project in Visual Studio Code

## Create JavaScript file to bulk insert data into Redis

1. In Visual Studio Code, create a `bulk_insert.js` file.

1. Download the [MOCK_DATA.csv](https://github.com/Azure-Samples/js-e2e/blob/main/database/redis/MOCK_DATA.csv) file and place it in the same directory as `bulk_insert.js`.

1. Copy the following JavaScript code into `bulk_insert.js`:

    :::code language="JavaScript" source="~/../js-e2e/database/redis/bulk-insert.js" :::

1. Replace the following in the script with your Redis resource information:

    * YOUR-RESOURCE-NAME
    * YOUR-AZURE-REDIS-RESOURCE-KEY

1. Run the script.

    ```bash
    node bulk_insert.js
    ```
    
## Create JavaScript code to use Redis

1. In Visual Studio Code, create a `index.js` file.


1. Copy the following JavaScript code into `index.js`:

    :::code language="JavaScript" source="~/../js-e2e/database/redis/get-set.js"  :::
 
1. Replace the following in the script with your Redis resource information:

    * YOUR-RESOURCE-NAME
    * YOUR-RESOURCE-PASSWORD

1. Run the script.

    ```bash
    node index.js
    ```
    
    The script inserts 3 keys then deletes the middle key. The console results are:

    ```console
    record 2
    null
    done
    ```

## Use Redis console in Azure portal to view data

In the Azure portal, view your resource's console with the command `SCAN 0 COUNT 1000 MATCH *`. 

:::image type="content" source="../../media/howto-database/azure-cache-for-redis-azure-portal-console-scan.png" alt-text="In the Azure portal, view your resource's console with the command `SCAN 0 COUNT 1000 MATCH *`.":::

## Next steps

* How to [deploy a JavaScript web app](../deploy-web-app.md)
* [Azure Cache for Redis documentation](/azure/azure-cache-for-redis)
* [Azure Cache for Redis quickstart](/azure/azure-cache-for-redis/cache-nodejs-get-started)
* [Azure Architecture Center - Best practices with Caching](/azure/architecture/best-practices/caching)
* [Best practices with Azure Cache for Redis](/azure/azure-cache-for-redis/cache-best-practices#client-library-specific-guidance)