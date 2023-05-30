---
ms.custom: devx-track-js
ms.topic: include
ms.date: 08/08/2022
---

### Add firewall rule for your client IP address

If you need to add a client IP address to your resource after it's created so your client connection to the server with JavaScript is successful, use this procedure. Use the [az cosmosdb update](/cli/azure/cosmosdb#az-cosmosdb-update) command to update the firewall rules.


```azurecli
az cosmosdb update \
    --subscription YOUR-SUBSCRIPTION-ID-OR-NAME \
    --resource-group YOUR-RESOURCE-GROUP \
    --name YOUR-RESOURCE_NAME \
    --ip-range-filter 123.123.123.123
```

To configure multiple IP addresses, use a comma-separated list.

```azurecli
az cosmosdb update \
    --subscription YOUR-SUBSCRIPTION-ID-OR-NAME \
    --resource-group YOUR-RESOURCE-GROUP \
    --name YOUR-RESOURCE_NAME \
    --ip-range-filter 123.123.123.123,456.456.456.456
```
