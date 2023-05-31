---
ms.topic: include
ms.custom:
ms.date: 06/01/2022
---

#### [bash](#tab/terminal-bash)

```azurecli
principalId=$(az webapp identity assign \
    --resource-group $RESOURCE_GROUP_NAME \
    --name $APP_SERVICE_NAME \
    --output tsv \
    --query principalId)
appId=$(az ad sp show \
    --id $principalId \
    --output tsv \
    --query appId)
```

#### [PowerShell terminal](#tab/terminal-powershell)

```azurecli
$principalId=$(az webapp identity assign `
    --resource-group $RESOURCE_GROUP_NAME `
    --name $APP_SERVICE_NAME `
    --output tsv `
    --query principalId)
$appId=$(az ad sp show `
    --id $principalId `
    --output tsv `
    --query appId)
```

---
