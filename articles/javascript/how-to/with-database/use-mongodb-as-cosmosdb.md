---
title: Use JavaScript on Azure Cosmos DB with MongoDB
description: To create or move your mongoDB database to Azure, you need a Cosmos DB resource. 
ms.topic: how-to
ms.date: 08/02/2021
ms.custom: devx-track-js, devx-track-azurecli
---

# Develop a JavaScript application with MongoDB on Azure

To create, move, or use a mongoDB database to Azure, you need a Cosmos DB resource. Learn how to create the resource and use your database.


# [VS Code extension](#tab/vscode)

[!INCLUDE [VSCode extension for Cosmos DB databases](../../includes/vscode-extension-mongodb.md)]

# [Azure CLI](#tab/azure-cli)

[!INCLUDE [Azure CLI commands](../../includes/azure-cli-mongodb.md)]

# [Azure Portal](#tab/azure-portal)

[!INCLUDE [Azure portal](../../includes/azure-portal-mongodb.md)]

---

<a name="locally-develop-with-the-cosmosdb-emulator"></a>

## Use the Azure Cosmos DB emulator for local development

Learn more about the Azure Cosmos DB emulator:

* [Install and use the Azure Cosmos DB Emulator for local development and testing](/azure/cosmos-db/local-emulator)
* [Start the emulator from command prompt as an administrator](/azure/cosmos-db/local-emulator?tabs=cli%2Cssl-netstd21#azure-cosmos-dbs-api-for-mongodb)

## Use native SDK packages to connect to MongoDB on Azure

The mongoDB database on Cosmos DB uses npm packages already available, such as:

* [mongodb](https://www.npmjs.com/package/mongodb)
* [mongoose](https://www.npmjs.com/package/mongoose)

# [MongoDB](#tab/mongodb)

[!INCLUDE [JavaScript MongoDB](../../includes/javascript-mongodb.md)]

# [Mongoose](#tab/mongoose)

[!INCLUDE [JavaScript Mongoose](../../includes/javascript-mongoose.md)]

---

## Next steps

* How to [deploy a JavaScript web app](../deploy-web-app.md)
* [Cosmos DB for mongoDB documentation](/azure/cosmos-db/mongodb-introduction)
* [Cosmos DB for mongoDB quickstart](/azure/cosmos-db/create-mongodb-nodejs)
* [Migration guide to move to Cosmos DB for mongoDB](/azure/cosmos-db/mongodb-pre-migration)
* Learn about MongoDB versions:
   * [4.0](/azure/cosmos-db/mongodb-feature-support-40) 
   * [3.6](/azure/cosmos-db/mongodb-feature-support-36)
   * [3.2](/azure/cosmos-db/mongodb-feature-support)