---
ms.author: tarcher
ms.topic: include
ms.date: 05/18/2022
ms.custom: devx-track-ansible
---

#### [Azure CLI](#tab/azure-cli)

1. Run [az group delete](/cli/azure/group#az-group-delete) to delete the resource group. All resources within the resource group will be deleted.

    ```azurecli
    az group delete --name <resource_group>
    ```

1. Verify that the resource group was deleted by using [az group show](/cli/azure/group#az-group-show).

    ```azurecli
    az group show --name <resource_group>
    ```

#### [Azure PowerShell](#tab/azure-powershell)

1. Run [Remove-AzResourceGroup](/powershell/module/az.resources/Remove-AzResourceGroup) to delete the resource group. All resources within the resource group will be deleted.

    ```azurepowershell
    Remove-AzResourceGroup -Name <resource_group>
    ```

1. Verify that the resource group was deleted by using [Get-AzResourceGroup](/powershell/module/az.resources/Get-AzResourceGroup).

    ```azurepowershell
    Get-AzResourceGroup -Name <resource_group>
    ```

---
