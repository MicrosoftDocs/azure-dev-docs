---
ms.custom: devx-track-js, devx-track-azurecli
ms.topic: include
ms.date: 02/08/2021
---


## Create a Cosmos DB resource for SQL API

Use the following Azure CLI [az cosmosdb create](/cli/azure/cosmosdb#az_cosmosdb_create) command in the [Azure Cloud Shell](https://shell.azure.com) to create a new Cosmos DB resource. This command may take a couple of minutes to complete. 

```azurecli
az cosmosdb create \
--subscription YOUR-SUBSCRIPTION-ID-OR-NAME \
--resource-group YOUR-RESOURCE-GROUP \
--name YOUR-RESOURCE-NAME \
--kind YOUR-DB-KIND \
--ip-range-filter YOUR-CLIENT-IP
```

To enable firewall access from your local computer to your resource, replace `123.123.123.123` with your own client IP. To configure multiple IP addresses, use a comma-separated list.

[!INCLUDE [Azure CLI command - Cosmos DB Update - firewall IP range](azure-cli-cosmos-db-update-with-firewall.md)]

[!INCLUDE [Azure CLI command - Cosmos DB - get keys](azure-cli-cosmos-db-get-keys.md)]
