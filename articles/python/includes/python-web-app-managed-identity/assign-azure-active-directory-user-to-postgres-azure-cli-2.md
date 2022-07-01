---
author: jess-johnson-msft
ms.author: jejohn
ms.topic: include
ms.date: 06/01/2022
---

#### [bash](#tab/terminal-bash)

```azurecli
az postgres server ad-admin create \
    --resource-group <group-name> \
    --server-name <server-name> \
    --display-name $USERPRINCIPALNAME \
    --object-id $azureaduser
```

#### [PowerShell terminal](#tab/terminal-powershell)

```azurecli
az postgres server ad-admin create `
    --resource-group <group-name> `
    --server-name <server-name> `
    --display-name $USERPRINCIPALNAME `
    --object-id $azureaduser
```

---
