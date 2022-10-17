---
author: jessmjohnson
ms.author: jejohn
ms.topic: include
ms.date: 06/01/2022
---

#### [bash](#tab/terminal-bash)

```azurecli
az storage container create \
    --name photos \
    --public-access blob \
    --account-name $STORAGE_ACCOUNT_NAME
```

#### [PowerShell terminal](#tab/terminal-powershell)

```azurecli
az storage container create `
    --name photos `
    --public-access blob `
    --account-name $STORAGE_ACCOUNT_NAME
```

---
