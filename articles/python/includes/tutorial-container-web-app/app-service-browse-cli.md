---
ms.topic: include
ms.date: 10/09/2023
---

If you're running the Azure CLI locally, you can use the [az webapp browse](/cli/azure/webapp#az-webapp-browse) command to browse to the web site. If you're using Cloud Shell, open a browser window and navigate to the website URL.

```azurecli
az webapp browse  --name $APP_SERVICE_NAME --resource-group $RESOURCE_GROUP_NAME 
```

> [!NOTE]
> The `az webapp browse` command isn't supported in Cloud Shell. Open a browser window and navigate to the website URL instead.
