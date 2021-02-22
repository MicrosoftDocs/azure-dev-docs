---
title: Use JavaScript with Redis on Azure 
description: To create or move your Redis database to Azure, you need a Azure Cache for Redis resource. 
ms.topic: how-to
ms.date: 02/17/2021
ms.custom: devx-track-js
---

# Develop a JavaScript application with Redis on Azure


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

:::image type="content" source="../../media/howto-database/.png" alt-text="":::


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
    // install ioredis SDK
    // run at command line
    // npm install ioredis

    const cassandra = require('ioredis');
    
    const config = {
      username: 'YOUR-USERNAME', // Your Cassandra user name is the resource name 
      password:
        'YOUR-PASSWORD',
      contactPoint: 'YOUR-RESOURCE-NAME.cassandra.cosmos.azure.com',
    };
    
    let client = null;
    
    const callCassandra = async () => {

      // authentication 
      const authProvider = new cassandra.auth.PlainTextAuthProvider(
        config.username,
        config.password
      );
    
      // create client
      client = new cassandra.Client({
        contactPoints: [`${config.contactPoint}:10350`],
        authProvider: authProvider,
        localDataCenter: 'Central US',
        sslOptions: {
          secureProtocol: 'TLSv1_2_method',
          rejectUnauthorized: false,
        },
      });
    
      await client.connect();
      console.log("connected");
      
      // create keyspace
      let query =
        "CREATE KEYSPACE IF NOT EXISTS uprofile WITH replication = {\'class\': \'NetworkTopologyStrategy\', \'datacenter\' : \'1\' }";
      await client.execute(query);
      console.log('created keyspace');
    
      // create table
      query =
        'CREATE TABLE IF NOT EXISTS uprofile.user (name text, alias text, region text Primary Key)';
      await client.execute(query);
      console.log('created table');
    
      // insert 3 rows
      console.log('insert');
      const arr = [
        "INSERT INTO uprofile.user (name, alias , region) VALUES ('Tim Jones', 'TJones', 'centralus')",
        "INSERT INTO uprofile.user (name, alias , region) VALUES ('Joan Smith', 'JSmith', 'northus')",
        "INSERT INTO uprofile.user (name, alias , region) VALUES ('Bob Wright', 'BWright', 'westus')"
      ];
      for (const element of arr) {
        await client.execute(element);
      }
    
      // get all rows
      query = 'SELECT * FROM uprofile.user';
      const resultSelect = await client.execute(query);
    
      for (const row of resultSelect.rows) {
        console.log(
          'Obtained row: %s | %s | %s ',
          row.name,
          row.alias,
          row.region
        );
      }
    
      // get filtered row
      console.log('Getting by region');
      query = 'SELECT * FROM uprofile.user where region=\'westus\'';
      const resultSelectWhere = await client.execute(query);
    
      for (const row of resultSelectWhere.rows) {
        console.log(
          'Obtained row: %s | %s | %s ',
          row.name,
          row.alias,
          row.region
        );
      }
    
      client.shutdown();
    };
    
    callCassandra()
      .then(() => {
        console.log('done');
      })
      .catch((err) => {
        if (client) {
          client.shutdown();
        }
        console.log(err);
      });

    ```
 
1. Replace the following in the script with your Cosmos DB Cassandra connection information:

    * YOUR-RESOURCE-NAME
    * YOUR-USERNAME - replace with YOUR-RESOURCE-NAME
    * YOUR-PASSWORD

1. Run the script.

    ```bash
    node index.js
    ```

    The results are:

    ```console
    connected
    created keyspace
    created table
    insert
    Obtained row: Joan Smith | JSmith | northus 
    Obtained row: Tim Jones | TJones | centralus 
    Obtained row: Bob Wright | BWright | westus
    Getting by region
    Obtained row: Bob Wright | BWright | westus 
    done
    ```