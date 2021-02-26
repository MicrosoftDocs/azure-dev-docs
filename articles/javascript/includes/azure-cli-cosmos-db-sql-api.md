---
ms.custom: devx-track-js
ms.topic: include
ms.date: 02/08/2021
---


## Create a Cosmos DB resource for SQL API

Use the following Azure CLI [az cosmosdb create](/cli/azure/cosmosdb#az_cosmosdb_create) command in the [Azure Cloud Shell](https://shell.azure.com) to create a new Cosmos DB resource. 

```azurecli
az cosmosdb create \
--subscription YOUR-SUBSCRIPTION-ID-OR-NAME \
--resource-group YOUR-RESOURCE-GROUP \
--name YOUR-RESOURCE-NAME \
--kind GlobalDocumentDB \
--ip-range-filter YOUR-CLIENT-IP

```

Replace `123.123.123.123` with your own client IP or remove the parameter entirely. 

This command may take a couple of minutes to complete. 

[!INCLUDE [Azure CLI command - Cosmos DB Update - firewall IP range](../../includes/azure-cli-cosmos-db-update-with-firewall.md)]

## Get the Cosmos DB keys for your resource

Retrieve the keys for this instance with the [az cosmosdb keys list](/cli/azure/cosmosdb/keys#az_cosmosdb_keys_list) command:

```azurecli
az cosmosdb keys list \
    --subscription YOUR-SUBSCRIPTION-ID-OR-NAME \
    --resource-group YOUR-RESOURCE-GROUP \
    --name YOUR-RESOURCE-NAME
```

This returns 4 keys, 2 read-write and 2 read-only. There are two so that you can give 2 different systems or developers a key to use and recycle individually. 