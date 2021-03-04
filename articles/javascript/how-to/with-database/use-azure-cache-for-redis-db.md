---
title: Use JavaScript with Redis on Azure 
description: To create or move your Redis database to Azure, you need an Azure Cache for Redis resource. 
ms.topic: how-to
ms.date: 02/17/2021
ms.custom: devx-track-js
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

## Use ioredis SDK to connect to Redis database on Azure

To connect and use your Redis database on Azure with JavaScript and ioredis, use the following procedure.

1. Make sure Node.js and npm are installed.
1. Create a Node.js project in a new folder:

    ```bash
    mkdir DataDemo && \
        cd DataDemo && \
        npm init -y && \
        npm install ioredis && \
        touch index.js && \
        code .
    ```

    The command:
    * creates a project folder named `DataDemo`
    * changes the Bash terminal into that folder
    * initializes the project, which creates the `package.json` file
    * adds the ioredis npm SDK to the project
    * creates the `index.js` script file
    * opens the project in Visual Studio Code

1. Copy the following JavaScript code into `index.js`:

    ```nodejs
    const redis = require('ioredis');
    
    const config = {
        "HOST": "YOUR-RESOURCE-NAME.redis.cache.windows.net",
        "KEY": "YOUR-RESOURCE-PASSWORD",
        "TIMEOUT": 300,
        "KEY_PREFIX": "demoExample:"
    }
    
    // Create Redis config object
    const configuration = {
        host: config.HOST,
        port: 6380,
        password: config.KEY,
        timeout: config.TIMEOUT,
        tls: {
            servername: config.HOST
        },
        database: 0,
        keyPrefix: config.KEY_PREFIX
    }
    
    const connect = () => {
        return redis.createClient(configuration);
    }
    
    const set = async (client, key, expiresInSeconds=configuration.timeout, stringify=true, data) => {
        return await client.setex(key, expiresInSeconds, stringify? JSON.stringify(data): data);
    }
    
    const get = async (client, key, stringParse=true) => {
        const value = await client.get(key);
        return stringParse ? JSON.parse(value) : value;
    }
    
    const remove = async (client, key) => {
          return await client.del(key);
    }
    
    const disconnect = (client) => {
        client.disconnect();
    }
    
    const test = async () => {
        
        // connect
        const dbConnection = await connect();
        
        // set
        const setResult1 = await set(dbConnection, "r1", "1000000", false, "record 1");
        const setResult2 = await set(dbConnection, "r2", "1000000", false, "record 2");
        const setResult3 = await set(dbConnection, "r3", "1000000", false, "record 3");
    
        // get
        const val2 = await get(dbConnection, "r2", false);
        console.log(val2);
        
        // delete
        const remove2 = await remove(dbConnection, "r2");
        
        // get again = won't be there
        const val2Again = await get(dbConnection, "r2", false);
        console.log(val2Again);
        
        // done
        disconnect(dbConnection)
    }
    
    test()
    .then(() => console.log("done"))
    .catch(err => console.log(err))
    ```
 
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

1. In the Azure portal, view your resource's console with the command `SCAN 0 COUNT 1000 MATCH *`. 

    :::image type="content" source="../../media/howto-database/azure-cache-for-redis-azure-portal-console-scan.png" alt-text="In the Azure portal, view your resource's console with the command `SCAN 0 COUNT 1000 MATCH *`.":::

## Next steps

* How to [deploy a JavaScript web app](../deploy-web-app.md)
* [Azure Cache for Redis documentation](/azure/azure-cache-for-redis)
* [Azure Cache for Redis quickstart](/azure/azure-cache-for-redis/cache-nodejs-get-started)
* [Azure Architecture Center - Best practices with Caching](/azure/architecture/best-practices/caching)
* [Best practices with Azure Cache for Redis](/azure/azure-cache-for-redis/cache-best-practices#client-library-specific-guidance)