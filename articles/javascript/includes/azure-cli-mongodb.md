---
ms.custom: devx-track-js
ms.topic: include
ms.date: 02/02/2021
---


## Create a Cosmos DB resource for MongoDB

Use the following Azure CLI [az cosmosdb create](/cli/azure/cosmosdb#az_cosmosdb_create) command in the [Azure Cloud Shell](https://shell.azure.com) to create a new CosmosDB resource for a mongoDB database. 

```azurecli
az cosmosdb create \
    --subscription YOUR-SUBSCRIPTION-ID-OR-NAME \
    --resource-group YOUR-RESOURCE-GROUP \
    --name YOUR-RESOURCE_NAME \
    --enable-public-network true \
    --locations regionName=eastus \
    --kind MongoDB
```

This command may take a couple of minutes to complete and creates a publicly available resource in the `eastus` region. 

## Get the MongoDB connection string for your resource

Retrieve the MongoDB connection string for this instance with the [az cosmosdb keys list](/cli/azure/cosmosdb/keys#az_cosmosdb_keys_list) command:

```azurecli
az cosmosdb keys list \
    --subscription YOUR-SUBSCRIPTION-ID-OR-NAME \
    --resource-group YOUR-RESOURCE-GROUP \
    --name YOUR-RESOURCE-NAME \
    --type connection-strings 
```

This returns 4 connection strings, 2 read-write and 2 read-only. There are two so that you can give 2 different systems or developers a connection string to use individually. 

Connect to the mongoDB database with a connection string. Make sure your service is available with one of the following:

* publicly available
* firewall settings for your client's IP address

## Configure your Azure web app with the connection string

Add a Azure web app **MONGODB_URL** environment variable with the [az webapp config appsettings set](/cli/azure/webapp/config/appsettings#az_webapp_config_appsettings_set) so the web app connects to the Cosmos DB resource:

```azurecli
az webapp config appsettings set \
    --subscription YOUR-SUBSCRIPTION-ID-OR-NAME \
    --resource-group YOUR-RESOURCE-GROUP \
    --name YOUR-RESOURCE_NAME \
    --settings MONGODB_URL=YOUR-CONNECTION-STRING
```
