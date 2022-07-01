---
author: jess-johnson-msft
ms.author: jejohn
ms.topic: include
ms.date: 06/01/2022
---

#### [bash](#tab/terminal-bash)

```azurecli
az webapp identity assign \
    --resource-group <group-name> \
    --name <app-name> \
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
    --resource-group <group-name> `
    --name <app-name> `
    --output tsv `
    --query principalId
az ad sp show `
    --id <output-from-previous-command> `
    --output tsv `
    --query appId
```

---
