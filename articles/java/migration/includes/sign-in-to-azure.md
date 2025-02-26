---
author: KarlErickson
ms.author: karler
ms.reviewer: haiche
ms.date: 04/27/2023
---

### Sign in to Azure

If you haven't done so already, sign in to your Azure subscription by using the [az login](/cli/azure/reference-index) command and follow the on-screen directions.

```azurecli
az login
```

> [!NOTE]
> If multiple Azure tenants are associated with your Azure credentials, you must specify which tenant you want to sign in to. You can do this by using the `--tenant` option. For example: `az login --tenant contoso.onmicrosoft.com`.
