---
ms.author: tarcher
ms.topic: include
ms.date: 09/21/2023
ms.custom: devx-track-terraform
---

Create a Linux VM.

#### [Azure CLI](#tab/azure-cli)

1. Run [az group create](/cli/azure/group#az-group-create) to create an Azure resource group.

    ```azurecli
    az group create --name myResourceGroup --location eastus
    ```

2. Run [az vm create](/cli/azure/vm#az-vm-create) to create the virtual machine.

    ```azurecli
    az vm create \
      --resource-group myResourceGroup \
      --name myVM \
      --image Debian11 \
      --admin-username azureadmin \
      --generate-ssh-keys \
      --public-ip-sku Standard
    ```

#### [Azure PowerShell](#tab/azure-powershell)

1. Run [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup) to create an Azure resource group.

    ```azurepowershell
    New-AzResourceGroup -Name 'myResourceGroup' -Location 'EastUS'
    ```

2. Run [New-AzVM](/powershell/module/az.compute/new-azvm) to create the virtual machine.

    ```azurepowershell
    New-AzVm `
        -ResourceGroupName 'myResourceGroup' `
        -Name 'myVM' `
        -Location 'East US' `
        -Image Debian11 `
        -size Standard_B2s `
        -PublicIpAddressName myPubIP `
        -OpenPorts 80 `
        -GenerateSshKey `
        -SshKeyName mySSHKey
    ```

---
