---
ms.topic: include
ms.date: 06/01/2022
ms.service: azure-app-service
ms.role: developer
ms.devlang: python
ms.azure.devx-azure-tooling: ['vscode-azure-tools']
ms.custom: devx-track-python
---

Delete the resource group by using the [az group delete](/cli/azure/group#az_group_delete) command.

#### [bash](#tab/terminal-bash)

```azurecli
az group delete \
    --name $RESOURCE_GROUP_NAME 
```

#### [PowerShell terminal](#tab/terminal-powershell)

```azurecli
az group delete `
    --name $RESOURCE_GROUP_NAME 
```

---

You can optionally add the `--no-wait` argument to allow the command to return before the operation is complete.
