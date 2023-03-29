---
ms.topic: include
ms.custom: devx-track-azurecli
ms.date: 06/01/2022
---

To enable managed identity for an Azure resource. use the [az webapp identity](/cli/azure/webapp/identity) command.

#### [bash](#tab/terminal-bash)

```azurecli
APP_SERVICE_NAME='<web-app-name>'

az webapp identity assign \
    --resource-group $RESOURCE_GROUP_NAME \
    --name $APP_SERVICE_NAME
```

#### [PowerShell terminal](#tab/terminal-powershell)

```azurecli
$APP_SERVICE_NAME='<web-app-name>'

az webapp identity assign `
    --resource-group $RESOURCE_GROUP_NAME `
    --name $APP_SERVICE_NAME
```

---
