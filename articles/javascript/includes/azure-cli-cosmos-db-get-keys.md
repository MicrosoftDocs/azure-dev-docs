---
ms.custom: devx-track-js
ms.topic: include
ms.date: 02/08/2021
---

## Get the Cosmos DB keys for your resource

Retrieve the keys for this instance with the [az cosmosdb keys list](/cli/azure/cosmosdb/keys#az_cosmosdb_keys_list) command:

```azurecli
az cosmosdb keys list \
    --subscription YOUR-SUBSCRIPTION-ID-OR-NAME \
    --resource-group YOUR-RESOURCE-GROUP \
    --name YOUR-RESOURCE-NAME
```

This returns 4 keys, 2 read-write and 2 read-only. There are two so that you can give 2 different systems or developers a key to use and recycle individually. 