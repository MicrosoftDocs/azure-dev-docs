---
author: jess-johnson-msft
ms.author: jejohn
ms.topic: include
ms.date: 06/01/2022
---

#### [bash](#tab/terminal-bash)

```azurecli
az webapp identity assign \
    --resource-group $RESOURCE_GROUP_NAME \
    --name $APP_SERVICE_NAME \
    --output tsv \
    --query principalId
az ad sp show \
    --id <output-from-previous-command> \
    --output tsv \
    --query appId
```

#### [PowerShell terminal](#tab/terminal-powershell)

```azurecli
az webapp identity assign `
    --resource-group $RESOURCE_GROUP_NAME `
    --name APP_SERVICE_NAME `
    --output tsv `
    --query principalId
az ad sp show `
    --id <output-from-previous-command> `
    --output tsv `
    --query appId
```

---
