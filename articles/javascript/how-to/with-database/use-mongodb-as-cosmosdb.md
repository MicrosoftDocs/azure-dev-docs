---
title: Use JavaScript on Azure Cosmos DB with MongoDB
description: To create or move your mongoDB database to Azure, you need a Cosmos DB resource. 
ms.topic: how-to
ms.date: 07/30/2021
ms.custom: devx-track-js, devx-track-azurecli
---

# Develop a JavaScript application with MongoDB on Azure

To create, move, or use a mongoDB database to Azure, you need a Cosmos DB resource. Learn how to create the resource and use your database.

## Locally develop with the Azure Cosmos DB emulator

Learn more about the Azure Cosmos DB emulator:

* [Install and use the Azure Cosmos DB Emulator for local development and testing](/azure/cosmos-db/local-emulator)
* [Start the emulator from command prompt as an administrator](/azure/cosmos-db/local-emulator?tabs=cli%2Cssl-netstd21#azure-cosmos-dbs-api-for-mongodb)

## Create a Cosmos DB resource for a MongoDB database

You can create a resource with:

* Azure CLI
* [Azure portal](https://ms.portal.azure.com/#create/Microsoft.DocumentDB)
* Visual Studio Code [extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-cosmosdb)

[!INCLUDE [Azure CLI commands](../../includes/azure-cli-mongodb.md)]

## Create and use database with Azure portal 

1. Use the [Azure portal](https://ms.portal.azure.com/#create/Microsoft.DocumentDB) to create a Cosmos DB API for MongoDB. 
2. Once the resource is created, use the **Data Explorer** for your resource to create a new database and collection. 

    The Data Explorer user interface is shared between the portal and the emulator. 

## Create and use database with Azure CLI

While developing your mongoDB database with JavaScript, use [Cosmos explorer](https://cosmos.azure.com/) to work with your database. 

:::image type="content" source="../../media/howto-database/cosmos-explorer.png" alt-text="Use the Cosmos explorer, found at https://cosmos.azure.com/, to view and work with your mongoDB database.":::


The Cosmos explorer is also available in the Azure portal, for your resource, as the **Data Explorer**.


:::image type="content" source="../../media/howto-database/cosmos-explorer-azure-portal.png" alt-text="The Cosmos explorer is also available in the Azure portal, for your resource, as the `Data Explorer`.":::

## Create and use database with VS Code extension

Create a Cosmos resource first because this will take several minutes. 

1. In Visual Studio Code, select the **Azure** icon in the left-most menu, then select the **Databases** section. 

    If the **Databases** section isn't visible, make sure you have checked the section in the top Azure **...** menu. 

    :::image type="content" source="../media/tutorial-end-to-end-app-cosmos/vscode-azure-extension-select-database-section.png" alt-text="Partial screenshot of Visual Studio Code's remote container icon"::: 

1. In the **Databases** section of the Azure explorer, select your subscription with a right-click, then select **Create Server**.
1. In the **Create new Azure Database Server** Command Palette, select **Azure Cosmos DB for MongoDB API**. 
1. Follow the prompts using the following table to understand how your values are used. The database may take up to 15 minutes to create.

    |Property|Value|
    |--|--|
    |Enter a globally unique **Account name** name for the new resource.| Enter a value such as `cosmos-mongodb-YOUR-NAME`, for your resource. Replace `YOUR-NAME` with your name or unique ID. This unique name is also used as part of the URL to access the resource in a browser.|
    |Select or create a resource group.|Create a new resource group named `js-demo-mongodb-web-app-resource-group-YOUR-NAME-HERE`.|
    |Location|The location of the resource. For this tutorial, select a regional location close to you.|

    Creating the resource may take up to 15 minutes. You can move skip the next section if you are time-restricted but remember to back to finish this next section in a few minutes.

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