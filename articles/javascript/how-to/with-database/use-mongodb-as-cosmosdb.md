---
title: Use JavaScript on Azure Cosmos DB with MongoDB
description: To create or move your mongoDB database to Azure, you need a Cosmos DB resource. 
ms.topic: how-to
ms.date: 05/24/2021
ms.custom: devx-track-js, devx-track-azurecli
---

# Develop a JavaScript application with MongoDB on Azure

To create, move, or use a mongoDB database to Azure, you need a Cosmos DB resource. Learn how to create the resource and use your database.

## Locally develop with the CosmosDB emulator

Learn how to install the [CosmosDB emulator](/azure/cosmos-db/local-emulator) and [start the emulator for MongoDB development](/azure/cosmos-db/local-emulator?tabs=cli%2Cssl-netstd21#azure-cosmos-dbs-api-for-mongodb). 

## Create a Cosmos DB resource for a MongoDB database

You can create a resource with:

* Azure CLI
* [Azure portal](https://portal.azure.com)
* Visual Studio Code [extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-cosmosdb)

[!INCLUDE [Azure CLI commands](../../includes/azure-cli-mongodb.md)]

## View and use your mongoDB on Azure Cosmos DB

While developing your mongoDB database with JavaScript, use [Cosmos explorer](https://cosmos.azure.com/) to work with your database. 

:::image type="content" source="../../media/howto-database/cosmos-explorer.png" alt-text="Use the Cosmos explorer, found at https://cosmos.azure.com/, to view and work with your mongoDB database.":::


The Cosmos explorer is also available in the Azure portal, for your resource, as the **Data Explorer**.


:::image type="content" source="../../media/howto-database/cosmos-explorer-azure-portal.png" alt-text="The Cosmos explorer is also available in the Azure portal, for your resource, as the `Data Explorer`.":::

## Use native SDK packages to connect to MongoDB on Azure

The mongoDB database on Cosmos DB uses npm packages already available, such as:

* [mongodb](https://www.npmjs.com/package/mongodb)
* [mongoose](https://www.npmjs.com/package/mongoose)

# [MongoDB](#tab/mongodb)

[!INCLUDE [Javascript MongoDB](../../includes/javascript-mongodb.md)]

# [Mongoose](#tab/mongoose)

[!INCLUDE [Javascript Mongoose](../../includes/javascript-mongoose.md)]


## Next steps

* How to [deploy a JavaScript web app](../deploy-web-app.md)
* [Cosmos DB for mongoDB documentation](/azure/cosmos-db/mongodb-introduction)
* [Cosmos DB for mongoDB quickstart](/azure/cosmos-db/create-mongodb-nodejs)
* [Migration guide to move to Cosmos DB for mongoDB](/azure/cosmos-db/mongodb-pre-migration)