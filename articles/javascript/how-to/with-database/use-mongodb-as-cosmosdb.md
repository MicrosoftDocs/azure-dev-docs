---
title: Use JavaScript with MongoDB as Azure Cosmos DB
description: 
ms.topic: how-to
ms.date: 02/01/2021
ms.custom: devx-track-js
---

# Develop a JavaScript application with MongoDB on Azure

## Cosmos DB provides MongoDB databases on Azure

## Create a Cosmos DB resource for a MongoDB database

You can create a resource with:

* Azure CLI
* [Azure portal](portal.azure.com)
* Visual Studio Code [extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-cosmosdb)

### Create a CosmosDB for MongoDB resource with Azure CLI

Use the following Azure CLI [az cosmosdb create](/cli/azure/cosmosdb?view=azure-cli-latest#az_cosmosdb_create) command in the [Azure cloud shell](https://shell.azure.com.) to create a new CosmosDB resource for a mongoDB database. 

```dotnetcli
az cosmosdb create 
    --name YOUR-RESOURCE-NAME \
    --subscription YOUR-SUBSCRIPTION-ID-OR-NAME \
    --resource-group YOUR-RESOURCE-GROUP \
    --enable-public-network true \
    --kind MongoDB \
    --locations regionName=eastus
```

This command created a publicly available resource in the `eastus` region. 

## Tools to view and query your mongoDB on Azure CosmosDB

When you view your resource in the [Azure portal](/azure/cosmos-db/create-cosmosdb-resources-portal), 

## Use native SDK packages to connect to MongoDB on Azure

## View and interact with MongoDB databases on Azure

## Add JavaScript to interact with MongoDB

## Next steps