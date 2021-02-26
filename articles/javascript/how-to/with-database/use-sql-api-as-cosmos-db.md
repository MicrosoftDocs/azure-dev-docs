---
title: Use JavaScript on Azure Cosmos DB with SQL API
description: To create a SQL database to Azure, you need a Cosmos DB resource. 
ms.topic: how-to
ms.date: 02/24/2021
ms.custom: devx-track-js
---

# Develop a JavaScript application for Cosmos DB with SQL API 

To create or use Cosmos DB with the SQL API use a Cosmos DB resource. Learn how to create the Cosmos resource and use your database.

## Create a Cosmos DB resource for a SQL API database

You can create a resource with:

* Azure CLI
* [Azure portal](https://portal.azure.com)
* Visual Studio Code [extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-cosmosdb)

[!INCLUDE [Azure CLI commands](../../includes/azure-cli-cosmos-db-sql-api.md)]

## View and use your SQL API database on Azure Cosmos DB

While developing your SQL API database with JavaScript, use [Cosmos explorer](https://cosmos.azure.com/) to work with your database. 

:::image type="content" source="../../media/howto-database/.png" alt-text="Use the Cosmos explorer, found at https://cosmos.azure.com/, to view and work with your database.":::

The Cosmos explorer is also available in the Azure portal, for your resource, as the **Data Explorer**.

:::image type="content" source="../../media/howto-database/" alt-text="The Cosmos explorer is also available in the Azure portal, for your resource, as the `Data Explorer`.":::

## Use the Azure SDK package to connect to your Cosmos DB SQL API database

* [@azure/cosmos](https://www.npmjs.com/package/@azure/cosmos)

## Use @azure/cosmos SDK to connect to SQL API database on Azure

To connect and use your SQL API on Azure Cosmos DB with JavaScript, use the following procedure.

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

    let client = null;      // Cosmos DB SQL API connection object
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
            console.log('Cosmos DB SQL API - can\'t connected - err');
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
    * `YOUR-RESOURCE-NAME` - the name you used when creating your Cosmos DB resource
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

## Next steps

* How to [deploy a JavaScript web app](../deploy-web-app.md)
* [Cosmos DB for SQL API documentation](/azure/cosmos-db)
* [Cosmos DB for SQL API quickstart](/azure/cosmos-db/create-sql-api-nodejs)