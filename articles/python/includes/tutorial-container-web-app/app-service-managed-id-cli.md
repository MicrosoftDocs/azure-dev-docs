---
author: jess-johnson-msft
ms.author: jejohn
ms.topic: include
ms.date: 07/12/2022
---

**Step 1.** Configure the web app to use managed identity.

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

**Step 2.** Confirm that managed identity is enabled.

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

Look for `"acrUseManagedIdentityCreds": true` in the output of the command.