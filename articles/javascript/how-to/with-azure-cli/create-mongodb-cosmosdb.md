---
title: Create and use MongoDB on Azure
description: Create a Cosmos DB resource and use for your MongoDB database. 
ms.topic: how-to
ms.date: 01/28/2021
ms.custom: seo-javascript-october2019, devx-track-js
---

# Create and use MongoDB on Azure with Cosmos DB

A Cosmos DB resource provides you with a MongoDB to use with MongoDB provider packages found on npm. 

Cosmos DB is a fully-managed, geo-replicable, high-performance, NoSQL database that provides a MongoDB-compatibility layer. You can point an existing JavaScript app at it (or any MongoDB client/tool) without needing to change anything but the connection string. 

## Create a Cosmos DB resource for MongoDB

Use the following [az cosmosdb create](/cli/azure/cosmosdb#az_cosmosdb_create) command. Replace the **YOUR-RESOURCE_NAME** placeholder with a globally unique value. Cosmos DB uses this name to generate the database's server URL.

```azurecli
az cosmosdb create \
    --resource-group YOUR-RESOURCE-GROUP \
    --name YOUR-RESOURCE_NAME \
    --enable-public-network true \
    --locations westus \
    --kind MongoDB
```

## Get the MongoDB connection string for your resource

Retrieve the MongoDB connection string for this instance with the [az cosmosdb list-connection-strings](/cli/azure/cosmosdb#az_cosmosdb_list_connection_strings) command:

```azurecli
az cosmosdb list-connection-strings \
--resource-group YOUR-RESOURCE-GROUP \
--name YOUR-RESOURCE_NAME \
-otsv --query "connectionStrings[0].connectionString"
```

## Configure your web app with the connection string

Add a Azure web app **MONGODB_URL** environment variable with the [az webapp config appsettings set](/cli/azure/webapp/config/appsettings#az_webapp_config_appsettings_set) so the web app connects to the Cosmos DB resource:

```azurecli
az webapp config appsettings set \
    --settings MONGODB_URL=YOUR-CONNECTION-STRING
```

## Next steps

* [Configure web app settings](../configure-web-app-settings.md)

