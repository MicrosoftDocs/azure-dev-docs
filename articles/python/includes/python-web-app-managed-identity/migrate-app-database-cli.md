---
author: jess-johnson-msft
ms.author: jejohn
ms.topic: include
ms.date: 06/01/2022
---


Run `az webpp ssh` to open an SSH session to the web app:

#### [bash](#tab/terminal-bash)

```azurecli
az webapp ssh --resource-group $RESOURCE_GROUP_NAME \
              --name $APP_SERVICE_NAME
```

#### [PowerShell terminal](#tab/terminal-powershell)

```azurecli
az webapp ssh --resource-group $RESOURCE_GROUP_NAME `
              --name $APP_SERVICE_NAME
```

---
