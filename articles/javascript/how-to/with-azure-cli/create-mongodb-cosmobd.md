---
title: 
description: 
ms.topic: how-to
ms.date: 
ms.custom: seo-javascript-october2019, devx-track-js
---

# 

## Provisioning a MongoDB server

While you could configure a MongoDB server, or replica set, and manage that infrastructure yourself, Azure provides a solution called [Cosmos DB](https://azure.microsoft.com/services/documentdb/). Cosmos DB is a fully-managed, geo-replicable, high-performance, NoSQL database that provides a MongoDB-compatibility layer. As a result, you can point an existing MEAN app at it (or any MongoDB client/tool such as [Studio 3T](https://studio3t.com/)) without needing to change anything but the connection string. The following steps illustrate this capability:

1. From the Visual Studio Code terminal, run the following command to create a MongoDB-compatible instance of the Cosmos DB service. Replace the **<NAME** placeholder with a globally unique value (Cosmos DB uses this name to generate the database's server URL):

   ```azurecli
   COSMOSDB_NAME=<NAME>
   az cosmosdb create -n $COSMOSDB_NAME --kind MongoDB
   ```

1. Retrieve the MongoDB connection string for this instance:

   ```bash
   MONGODB_URL=$(az cosmosdb list-connection-strings -n $COSMOSDB_NAME -otsv --query "connectionStrings[0].connectionString")
   ```

1. Update your web app's **MONGODB_URL** environment variable so that it connects to the newly provisioned Cosmos DB instance instead of attempting to connect to a locally running MongoDB server (that doesn't exist!):

    ```azurecli
    az webapp config appsettings set --settings MONGODB_URL=$MONGODB_URL
    ```

1. Return to your browser and refresh it. Try adding and removing a to-do item to prove that the app now works without needing to change anything! Set the environment variable to the created Cosmos DB instance, which is fully emulating a MongoDB database.

    ![Demo app after connected to a database](../media/node-howto-e2e/finish-demo-walkthrough.png)

When needed, you can switch back to the Cosmos DB instance and scale up (or down) the reserved throughput that the MongoDB instance needs, and benefit from the added traffic without needing to manage any infrastructure manually.

Additionally, Cosmos DB automatically indexes every single document and property for you. That way, you don't need to profile slow queries or manually fine-tune your indexes. Just provision and scale as needed, and let Cosmos DB handle the rest.