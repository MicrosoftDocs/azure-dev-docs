---
title: Getting started with Azure Databases 
description: Learn the common tasks to use any database hosted on Azure.  
ms.topic: how-to
ms.date: 10/05/2021
ms.custom: devx-track-js, devx-graphql
---

# Getting started with databases on Azure

The Azure cloud platform allows you to use any of the Azure databases (as services) or bring your own database. Once your server and database are set up, your existing code will only need to change the connection settings. 

When you do use a database on Azure, there are several common tasks you need to accomplish to use the database from your JavaScript app. Learn more about getting and using your database on Azure. 

## Select a database to use on Azure

Microsoft provides managed services for the following databases:

|Database|Azure Service|
|--|--|
|[Cassandra](#cassandra)|[Azure Cosmos DB](/azure/cosmos-db/)|
|Gremlin|[Azure Cosmos DB](/azure/cosmos-db/)|
|[MongoDB](#mongodb)|[Azure Cosmos DB](/azure/cosmos-db/)|
|MariaDB/MySQL|[Azure Database for MariaDB](/azure/mariadb/)|
|[PostgreSQL](#postgresql)|[Azure Database for PostgreSQL](/azure/postgresql/)|
|[Redis](#redis)|[Azure Cache for Redis](/azure/azure-cache-for-redis/)|
|[No-SQL](No SQL)|[Azure Cosmos DB](/azure/cosmos-db/)|
|Tables|[Azure Cosmos DB](/azure/cosmos-db/)|

**Need help with choosing?** 
* Select your database based on [what you want to do](https://azure.microsoft.com/product-categories/databases/)
* Use the [Azure Database Migration Service](/azure/dms/) to move to Azure. 

**Didn't find your database?**
Bring your database as either a container or a virtual machine. You can bring any database type with these services and have high-availability and security to your other Azure resources. The trade-off is that you have to manage the infrastructure (container or VM) yourself. The rest of this document may help you with your container or VM but is more helpful when choosing an Azure database service. 

## Create the server

Creating a server is completed by creating a resource for the specific Azure service on your subscription where your database is hosted. 

Creating a resource is accomplished with:

|Tool|Purpose|
|--|--|
|Azure portal|Use for first or infrequently used database is the Azure portal.|
|Azure CLI|Use for repeatable/scriptable scenarios.|
|Visual Studio Code extension (for that service)|Use to stay within the development IDE.|
|npm ARM library (for that service)|Use to stay within the JavaScript language.| 

Once you create the server, depending on the service, you may still need to:

* Configure security settings such as firewall and SSL enforcement
* Get your connection information
* Create the database

## Configure security settings for your database

Common security settings to configure for your service include:

* Opening the firewall for your client IP address
* Configuring SSL enforcement
* Accepting public requests or requiring all requests to come from another Azure service

## Create a database on the Azure server

You can get your connection information using the same tool as you created your server. Use the connection information to access your server. You still need to create your database specific to your application. 

Access your server: 

* Use a tool specific to that database type such as pgAdmin, SQL Server Management Studio, and MySQL Workbench. 
* Continue to use Microsoft tools
    * [Azure Cloud Shell](https://shell.azure.com) includes many database CLIs such as psql and mysql.
    * Visual Studio Code extensions
    * npm packages for JavaScript
    * Azure portal

## Programmatically access the server and database with JavaScript

Once you have your connection information, you can access your server with industry-standard npm packages and JavaScript. 

After you create or migrate a database, only your connection information to the new server and database should need to change. 

## Configure an Azure web app's connection to database

If your Azure web app connects to your database, you need to change the App setting for the connection information. 

## Database-agnostic query languages

Data query languages, agnostic of a specific database, allow you to use the query languages features with your data. Database-agnostic query languages can be used on Azure and require you to bring the translation layer.

## GraphQL data layer

GraphQL is a database-agnostic query language. It allows a client to describe the data schema along with the data requested from the data source.

|Summary|
|--|
|GraphQL is a query language for APIs and a runtime for fulfilling those queries with your existing data. GraphQL provides a complete and understandable description of the data in your API, gives clients the power to ask for exactly what they need and nothing more, makes it easier to evolve APIs over time, and enables powerful developer tools.
|

Learn more about developing GraphQL for [Azure Functions](../with-web-app/graphql/azure-function-hello-world.md).

## Cassandra on Azure

To create, move, or use a Cassandra DB database to Azure, you need an Azure Cosmos DB resource. Learn how to create the resource and use your database.

<a name="locally-develop-with-the-cosmosdb-emulator"></a>

### Locally develop with the Azure Cosmos DB emulator

Learn how to install the [Azure Cosmos DB emulator](/azure/cosmos-db/local-emulator) and [start the emulator for Cassandra development](/azure/cosmos-db/local-emulator?tabs=cli%2Cssl-netstd21#cassandra-api). 

### Create an Azure Cosmos DB resource for a Cassandra DB database

You can create a resource with:

* Azure CLI
* [Azure portal](https://portal.azure.com)
* Visual Studio Code [extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-cosmosdb)

[!INCLUDE [Azure CLI commands](../../includes/azure-cli-cassandra-db.md)]

### View and use your Cassandra DB on Azure Cosmos DB

While developing your Cassandra DB database with JavaScript, use [Azure Cosmos DB explorer](https://cosmos.azure.com/) to work with your database.

:::image type="content" source="../../media/howto-database/cosmos-explorer-cassandra-add-table-row.png" alt-text="Use the Azure Cosmos DB explorer, found at `https://cosmos.azure.com/`, to view and work with your Cassandra DB database.":::

The Azure Cosmos DB explorer is also available in the Azure portal, for your resource, as the **Data Explorer**.

:::image type="content" source="../../media/howto-database/cosmos-explorer-azure-portal.png" alt-text="The Azure Cosmos DB explorer is also available in the Azure portal, for your resource, as the `Data Explorer`.":::

### Use native SDK packages to connect to Cassandra DB on Azure

The Cassandra DB database on Azure Cosmos DB uses npm packages already available, such as:

* [cassandra-driver](https://www.npmjs.com/package/cassandra-driver)

**localDataCenter** using cassandra-driver:

* V3, use the default of `dataCenter1`
* V4, you must specify the data center, such as `Central US` in the following code block.

```javascript
  let client = new cassandra.Client({
    contactPoints: [`${config.contactPoint}:10350`],
    authProvider: authProvider,
    localDataCenter: 'Central US',
    sslOptions: {
      secureProtocol: 'TLSv1_2_method',
      rejectUnauthorized: false,
    },
  });
```

If you are unsure of your localDataCenter, remove the property, run the sample code, and the value of the property is returned in the error text. 

```text
NoHostAvailableError: All host(s) tried for query failed. First host tried, xxx.xxx.xxx.xxx:10350: ArgumentError: localDataCenter was configured as 'dataCenter1', but only found hosts in data centers: [Central US]
```

### Use cassandra-driver SDK to connect to Cassandra DB on Azure

To connect and use your Cassandra DB on Azure Cosmos DB with JavaScript and cassandra-driver, use the following procedure.

1. Make sure Node.js and npm are installed.
1. Create a Node.js project in a new folder:

    ```bash
    mkdir DataDemo && \
        cd DataDemo && \
        npm init -y && \
        npm install cassandra-driver && \
        touch index.js && \
        code .
    ```

    The command:
    * creates a project folder named `DataDemo`
    * changes the Bash terminal into that folder
    * initializes the project, which creates the `package.json` file
    * adds the cassandra-driver npm SDK to the project
    * creates the `index.js` script file
    * opens the project in Visual Studio Code

1. Copy the following JavaScript code into `index.js`:

    :::code language="JavaScript" source="~/../js-e2e/database/cassandra/index.js" :::

1. Replace the following in the script with your Azure Cosmos DB for Apache Cassandra connection information:

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

### Cassandra resources

* How to [deploy a JavaScript web app](../deploy-web-app.md)
* [Azure Cosmos DB for Apache Cassandra documentation](/azure/cosmos-db/cassandra-introduction)
* [Azure Cosmos DB for Apache Cassandra quickstart](/azure/cosmos-db/create-cassandra-nodejs)
* [Migration guide to move to Azure Cosmos DB for Apache Cassandra](/azure/cosmos-db/cassandra-migrate-cosmos-db-databricks)

## MariaDB and MySQL on Azure

MariaDB and MySQL share a common ancestry and maintain compatibility via the MySQL protocol. MySQL clients can connect to MariaDB and vice versa.

To create, move, or use a MySQL or MariaDB database, you need an **Azure** resource. Learn how to create the resource and use your database.

# [MySQL](#tab/MySQL)

[!INCLUDE [MySQL](includes/use-mysql-db.md)]

# [MariaDB](#tab/MariaDB)

[!INCLUDE [MariaDB](includes/use-mariadb.md)]

---

## MongoDB on Azure

To create, move, or use a mongoDB database to Azure, you need an Azure Cosmos DB resource. Learn how to create the resource and use your database.

#### [VS Code extension](#tab/vscode)

To Use the VSCode extension for Azure Cosmos DB, install the following:

* [Azure Databases](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-cosmosdb)

[!INCLUDE [VSCode extension for Azure Cosmos DB databases](../../includes/vscode-extension-mongodb.md)]

#### [Azure CLI](#tab/azure-cli)

[!INCLUDE [Azure CLI commands](../../includes/azure-cli-mongodb.md)]

#### [Azure portal](#tab/azure-portal)

[!INCLUDE [Azure portal](../../includes/azure-portal-mongodb.md)]

---

<a name="locally-develop-with-the-cosmosdb-emulator"></a>

### Use the Azure Cosmos DB emulator for local development

Learn more about the Azure Cosmos DB emulator:

* [Install and use the Azure Cosmos DB Emulator for local development and testing](/azure/cosmos-db/local-emulator)
* [Start the emulator from command prompt as an administrator](/azure/cosmos-db/local-emulator?tabs=cli%2Cssl-netstd21#azure-cosmos-dbs-api-for-mongodb)

### Use native SDK packages to connect to MongoDB on Azure

The mongoDB database on Azure Cosmos DB uses npm packages already available, such as:

* [mongodb](https://www.npmjs.com/package/mongodb)
* [mongoose](https://www.npmjs.com/package/mongoose)

# [MongoDB](#tab/mongodb)

[!INCLUDE [JavaScript MongoDB](../../includes/javascript-mongodb.md)]

# [Mongoose](#tab/mongoose)

[!INCLUDE [JavaScript Mongoose](../../includes/javascript-mongoose.md)]

---

### Mongo DB resources

* How to [deploy a JavaScript web app](../deploy-web-app.md)
* [Azure Cosmos DB for MongoDB documentation](/azure/cosmos-db/mongodb-introduction)
* [Azure Cosmos DB for MongoDB quickstart](/azure/cosmos-db/create-mongodb-nodejs)
* [Migration guide to move to Azure Cosmos DB for MongoDB](/azure/cosmos-db/mongodb-pre-migration)
* 
* [Tutorial: Build a Node.js and MongoDB app in Azure](/azure/app-service/tutorial-nodejs-mongodb-app?pivots=platform-windows)
* Learn about MongoDB versions:
   * [4.0](/azure/cosmos-db/mongodb-feature-support-40) 
   * [3.6](/azure/cosmos-db/mongodb-feature-support-36)
   * [3.2](/azure/cosmos-db/mongodb-feature-support)

## NoSQL on Azure

To create or use Azure Cosmos DB for NoSQL, create an Azure Cosmos DB resource. Learn how to create the Azure Cosmos DB resource and use your database.

<a name="locally-develop-with-the-cosmosdb-emulator"></a>

### Locally develop with the Azure Cosmos DB emulator

Learn how to install the [Azure Cosmos DB emulator](/azure/cosmos-db/local-emulator) and [start the emulator for Azure Cosmos DB for NoSQL development](/azure/cosmos-db/local-emulator?tabs=cli%2Cssl-netstd21#sql-api).

### Create a resource for an Azure Cosmos DB for NoSQL database

You can create a resource with:

* Azure CLI
* [Azure portal](https://portal.azure.com)
* Visual Studio Code extension - [Azure Databases](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-cosmosdb)

[!INCLUDE [Azure CLI commands](../../includes/azure-cli-cosmos-db-sql-api.md)]

### View and use your Azure Cosmos DB for NoSQL database

While developing your Azure Cosmos DB for NoSQL database with JavaScript, use [Azure Cosmos DB explorer](https://cosmos.azure.com/) to work with your database.

:::image type="content" source="../../media/howto-database/cosmos-explorer-sql-api.png" alt-text="Use the Azure Cosmos DB explorer, found at `https://cosmos.azure.com/`, to view and work with your database.":::

The Azure Cosmos DB explorer is also available in the Azure portal, for your resource, as the **Data Explorer**.

### Use @azure/cosmos SDK to connect to database

Connect to your Azure Cosmos DB for NoSQL database using the following Azure SDK:

* [@azure/cosmos](https://www.npmjs.com/package/@azure/cosmos)

To connect and use your Azure Cosmos DB for NoSQL database with JavaScript, use the following procedure.

1. Make sure Node.js and npm are installed.
1. Create a Node.js project in a new folder:

    ```bash
    mkdir dataDemo && \
        cd dataDemo && \
        npm init -y && \
        npm install @azure/cosmos && \
        touch index.js && \
        code .
    ```

    The command:
    * creates a project folder named `dataDemo`
    * changes the Bash terminal into that folder
    * initializes the project, which creates the `package.json` file
    * creates the `index.js` script file
    * opens the project in Visual Studio Code

1. Copy the following JavaScript code into `index.js`:

    ```javascript
    const CosmosClient = require("@azure/cosmos").CosmosClient;

    // CHANGE THESE VALUES
    const COSMOS_DB_RESOURCE_NAME = "YOUR-RESOURCE-NAME";
    const COSMOS_DB_RESOURCE_KEY = "YOUR-RESOURCE-KEY";

    let client = null;      // Azure Cosmos DB connection object
    let db = null;          // DB object
    let container = null;   // Container object

    // data
    const DATABASE_DOCS = [
        { name: "Joe", job: "banking" },
        { name: "Jack", job: "security" },
        { name: "Jill", job: "pilot" }];
        
    const ALL_DOCS = null;

    // Azure Cosmos DB config
    const config = {
        COSMOSDB_SQL_API_URI: `https://${COSMOS_DB_RESOURCE_NAME}.documents.azure.com:443/`,
        COSMOSDB_SQL_API_KEY: COSMOS_DB_RESOURCE_KEY,
        COSMOSDB_SQL_API_DATABASE_NAME: "DemoDb",
        COSMOSDB_SQL_API_CONTAINER_NAME: "DemoContainer"
    }

    // Unique Id = Guid
    const newGuid = () => {
        const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        return `${s4() + s4()}-${s4()}-${s4()}-${s4()}-${s4() + s4() + s4()}`;
    }

    // insert array
    const insert = async (newItems) => {

        const results = [];
        for (const item of newItems) {

            item.id = newGuid();
            const result = await container.items.create(item);
            results.push(result.item);
        }
        return results;
    };
    // find all or by id
    const find = async (query) => {

        if (query == null) {
            query = "SELECT * from c"
        } else {
            query = `SELECT * from c where c.id = ${query}`
        }

        const result = await container.items
            .query(query)
            .fetchAll();

        return result && result.resources ? result.resources : [];
    }
    // remove all or by id
    const remove = async (id) => {

        // remove 1
        if (id) {
            await container.item(id).delete();
        } else {

            // get all items
            const items = await find();

            // remove all
            for await (const item of items) {
                await container.item(item.id).delete();
            }
        }

        return;
    }
    // connection with SDK
    const connect = () => {
        try {

            const connectToCosmosDB = {
                endpoint: config.COSMOSDB_SQL_API_URI,
                key: config.COSMOSDB_SQL_API_KEY
            }

            return new CosmosClient(connectToCosmosDB);

        } catch (err) {
            console.log('Azure Cosmos DB - can\'t connect - err');
            console.log(err);
        }
    }
    const connectToDatabase = async () => {

        client = connect();

        if (client) {

            // get DB
            const databaseResult = await client.databases.createIfNotExists({ id: config.COSMOSDB_SQL_API_DATABASE_NAME });
            db = databaseResult.database;

            if (db) {
                // get Container
                const containerResult = await db.containers.createIfNotExists({ id: config.COSMOSDB_SQL_API_CONTAINER_NAME });
                container = containerResult.container;
                return !!db;
            }
        } else {
            throw new Error("can't connect to database");
        }


    }

    // use Database
    const dbProcess = async (docs) => {

        // connect
        const db = await connectToDatabase();
        if (!db) throw Error("db not working")
        console.log("connected to " + config.COSMOSDB_SQL_API_DATABASE_NAME + "/" + config.COSMOSDB_SQL_API_CONTAINER_NAME)
        
        // insert new docs
        const insertResult = await insert(docs);
        console.log("inserted " + insertResult.length)

        // get all docs
        const findResult = await find(ALL_DOCS);
        console.log("found " + findResult.length);

        // remove all then make sure they are gone
        await remove(ALL_DOCS);
        const findResult3 = await find(ALL_DOCS);
        console.log("removed all, now have " + findResult3.length);

        return;

    }

    dbProcess(DATABASE_DOCS)
    .then(() => {
        console.log("done")
    }).catch(err => {
        console.log(err)
    })
    ```

1. Replace the following variables in the script:
    * `YOUR-RESOURCE-NAME` - the name you used when creating your Azure Cosmos DB resource
    * `YOUR-RESOURCE-KEY` - one of the read/write keys for your resource

1. Run the script.

    ```bash
    node index.js
    ```

    The results are:

    ```console
    connected to DemoDb/DemoContainer4
    inserted 3
    found 3
    removed all, now have 0
    done
    ```

### NoSQL resources

* How to [deploy a JavaScript web app](../deploy-web-app.md)
* [Azure Cosmos DB for NoSQL documentation](/azure/cosmos-db)
* [Azure Cosmos DB for NoSQL quickstart](/azure/cosmos-db/create-sql-api-nodejs)


## PostgreSQL on Azure

To create, move, or use a PostgreSQL database to Azure, you need an **Azure Database for PostgreSQL server** resource. Learn how to create the resource and use your database.

### Create an Azure Database for PostgreSQL resource 

Create a resource with:

* [Azure CLI command](/cli/azure/postgres/server#az-postgres-server-create) = `az postgres server create`
* [Visual Studio Code](../with-visual-studio-code/create-azure-database.md#create-a-postgresql-server-for-cosmos-db)
* [Azure portal](https://ms.portal.azure.com/#create/Microsoft.PostgreSQLServer)
* [@azure/arm-postgresql](https://www.npmjs.com/package/@azure/arm-postgresql)


[!INCLUDE [Azure CLI commands](../../includes/azure-cli-postgresql-db.md)]

### View and use your PostgreSQL server on Azure
While developing your PostgreSQL database with JavaScript, use one of the following tools:

* [Azure Cloud Shell](https://shell.azure.com/) - psql CLI is available
* [pgAdmin](https://www.pgadmin.org/)
* Visual Studio Code [extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-cosmosdb)

### Use SDK packages to develop your PostgreSQL server on Azure

The Azure PostgreSQL uses npm packages already available, such as:

* [pg](https://www.npmjs.com/package/pg)

### Use pg SDK to connect to PostgreSQL on Azure

To connect and use your PostgreSQL on Azure with JavaScript, use the following procedure.

1. Make sure Node.js and npm are installed.
1. Create a Node.js project in a new folder:

    ```bash
    mkdir DbDemo && \
        cd DbDemo && \
        npm init -y && \
        npm install pg && \
        touch index.js && \
        code .
    ```

    The command:
    * Creates a project folder named `DbDemo`
    * Changes the Bash terminal into that folder
    * Initializes the project, which creates the `package.json` file
    * Installs the pg npm package - to use async/await
    * Creates the `index.js` script file
    * Opens the project in Visual Studio Code

1. Copy the following JavaScript code into `index.js`:

    :::code language="JavaScript" source="~/../js-e2e/database/postgresql/index.js" :::

1. Replace the `YOUR-ADMIN-USER`, `YOURRESOURCENAME`, and `YOUR-PASSWORD` with your values in the script for your connection string. 

1. Run the script to connect to the `postgres` server and see the base tables and users.

    ```bash
    node index.js
    ```

1. View the results. 

    ```bash
    [
      { table_name: 'pg_statistic' },
      { table_name: 'pg_type' },
      { table_name: 'pg_authid' },
      { table_name: 'pg_user_mapping' },
      ...removed for brevity
      { table_name: 'sql_languages' },
      { table_name: 'sql_packages' },
      { table_name: 'sql_parts' },
      { table_name: 'sql_sizing' },
      { table_name: 'sql_sizing_profiles' }
    ]
    [ { usename: 'azure_superuser' }, { usename: 'YOUR-ADMIN-USER' } ]
    done
    ```

### PostgreSQL resources

* How to [deploy a JavaScript web app](../deploy-web-app.md)
* [Azure Database for PostgreSQL server](/azure/postgresql/)

## Redis on Azure

To create, move, or use a Redis database to Azure, you need an **Azure Cache for Redis** resource. Learn how to create the resource and use your database.

### Create a resource for a Redis database

You can create a resource with:

* Azure CLI
* [Azure portal](https://ms.portal.azure.com/#create/Microsoft.Cache)

[!INCLUDE [Azure CLI commands](../../includes/azure-cli-cache-for-redis-db.md)]

### View and use your Redis database

While developing your Redis database with JavaScript, use the [Redis console](/azure/azure-cache-for-redis/cache-configure#redis-console) from the Azure portal to work with your database.

:::image type="content" source="../../media/howto-database/azure-cache-for-redis-console-button.png" alt-text="While developing your Redis database with JavaScript, use the Redis console from the Azure portal to work with your database.":::

This console provides [Redis CLI](https://redis.io/topics/rediscli) functionality. Be aware [some commands are not supported](/azure/azure-cache-for-redis/cache-configure#redis-commands-not-supported-in-azure-cache-for-redis).

Once you have your resource created, [import your data](/azure/azure-cache-for-redis/cache-how-to-import-export-data) into your Redis resource from Azure Storage using the Azure portal. 

### Use native SDK packages to connect to Redis on Azure

The Redis database uses npm packages such as:

* [redis](https://www.npmjs.com/package/redis)
* [ioredis](https://www.npmjs.com/package/ioredis)

### Install ioredis SDK 

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

### Create JavaScript file to bulk insert data into Redis

1. In Visual Studio Code, create a `bulk_insert.js` file.

1. Download the [MOCK_DATA.csv](https://github.com/Azure-Samples/js-e2e/blob/main/database/redis/MOCK_DATA.csv) file and place it in the same directory as `bulk_insert.js`.

1. Copy the following JavaScript code into `bulk_insert.js`:

    :::code language="JavaScript" source="~/../js-e2e/database/redis/bulk_insert.js" :::

1. Replace the following in the script with your Redis resource information:

    * YOUR-RESOURCE-NAME
    * YOUR-AZURE-REDIS-RESOURCE-KEY

1. Run the script.

    ```bash
    node bulk_insert.js
    ```
    
### Create JavaScript code to use Redis

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

### Use Redis console in Azure portal to view data

In the Azure portal, view your resource's console with the command `SCAN 0 COUNT 1000 MATCH *`. 

:::image type="content" source="../../media/howto-database/azure-cache-for-redis-azure-portal-console-scan.png" alt-text="In the Azure portal, view your resource's console with the command `SCAN 0 COUNT 1000 MATCH *`.":::

### Redis resources

* How to [deploy a JavaScript web app](../deploy-web-app.md)
* [Azure Cache for Redis documentation](/azure/azure-cache-for-redis)
* [Azure Cache for Redis quickstart](/azure/azure-cache-for-redis/cache-nodejs-get-started)
* [Azure Architecture Center - Best practices with Caching](/azure/architecture/best-practices/caching)
* [Best practices with Azure Cache for Redis](/azure/azure-cache-for-redis/cache-best-practices#client-library-specific-guidance)

## Next steps

* [Develop a JavaScript application with MongoDB on Azure](use-mongodb-as-cosmosdb.md)