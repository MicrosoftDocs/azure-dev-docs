---
author: jess-johnson-msft
ms.author: jejohn
ms.topic: include
ms.date: 06/01/2022
---

#### [bash](#tab/terminal-bash)

```azurecli
az role assignment create \
    --assignee "<managed-identity-id>" \
    --resource-group "<resource-group-name>" \
    --role "<role-name>" 
```

#### [PowerShell terminal](#tab/terminal-powershell)

```azurecli
az role assignment create `
    --assignee "<managed-identity-id>" `
    --resource-group "<resource-group-name>" `
    --role "<role-name>" 
```

---
