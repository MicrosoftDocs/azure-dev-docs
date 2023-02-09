---
ms.custom: devx-track-js, devx-track-azurecli
ms.topic: include
ms.date: 08/08/2022
---

<a name="get-the-cosmos-db-keys-for-your-resource"></a>

### Get the Azure Cosmos DB keys for your resource

Retrieve the keys for this instance with the [az cosmosdb keys list](/cli/azure/cosmosdb/keys#az-cosmosdb-keys-list) command:

```azurecli
az cosmosdb keys list \
    --subscription YOUR-SUBSCRIPTION-ID-OR-NAME \
    --resource-group YOUR-RESOURCE-GROUP \
    --name YOUR-RESOURCE-NAME
```

This returns 4 keys, 2 read-write and 2 read-only. There are two so that you can give 2 different systems or developers a key to use and recycle individually. 
