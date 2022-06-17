---
author: jess-johnson-msft
ms.author: jejohn
ms.topic: include
ms.date: 06/01/2022
---

#### [bash](#tab/terminal-bash)

```azurecli
az role definition list \
    --query "sort_by([].{roleName:roleName, description:description}, &roleName)" \
    --output table
```

#### [PowerShell terminal](#tab/terminal-powershell)

```azurecli
az role definition list `
    --query "sort_by([].{roleName:roleName, description:description}, &roleName)" `
    --output table
```

---
