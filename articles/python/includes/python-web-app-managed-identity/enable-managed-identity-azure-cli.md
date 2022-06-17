---
author: jess-johnson-msft
ms.author: jejohn
ms.topic: include
ms.date: 06/01/2022
---

To enable managed identity for an Azure resource. use the [az webapp identity](/cli/azure/webapp/identity) command.

#### [bash](#tab/terminal-bash)

```azurecli
az webapp identity assign \
    --resource-group <resource-group-name> \
    --name <web-app-name>
```

#### [PowerShell terminal](#tab/terminal-powershell)

```azurecli
az webapp identity assign `
    --resource-group <resource-group-name> `
    --name <web-app-name>
```

---
