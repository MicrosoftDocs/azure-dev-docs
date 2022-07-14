---
author: jess-johnson-msft
ms.author: jejohn
ms.topic: include
ms.date: 07/12/2022
---

**Step 1.** Set the service to use managed identity.

#### [bash](#tab/terminal-bash)

```azurecli
az webapp config set \
  --resource-group $RESOURCE_GROUP_NAME \
  --name $APP_SERVICE_NAME \
  --generic-configurations '{"acrUseManagedIdentityCreds": true}'
```

#### [PowerShell terminal](#tab/terminal-powershell)

```azurecli
az webapp config set `
  --resource-group $RESOURCE_GROUP_NAME `
  --name $APP_SERVICE_NAME `
  --generic-configurations '{"acrUseManagedIdentityCreds": true}'
```

---

**Step 2.** Confirm setting.

#### [bash](#tab/terminal-bash)

```azurecli
az webapp config show \
  --resource-group $RESOURCE_GROUP_NAME \
  --name $APP_SERVICE_NAME 
```

#### [PowerShell terminal](#tab/terminal-powershell)

```azurecli
az webapp config show `
  --resource-group $RESOURCE_GROUP_NAME `
  --name $APP_SERVICE_NAME 
```

---
