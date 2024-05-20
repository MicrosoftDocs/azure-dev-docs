---
title: Authentication with the Azure SDK for Go using a managed identity
description: In this tutorial, you use the Azure SDK for Go to authenticate to Azure with a managed identity.
ms.date: 05/17/2024
ms.topic: how-to
ms.custom: devx-track-go, devx-track-azurecli, devx-track-azurepowershell
---

# Authentication with the Azure SDK for Go using a managed identity

In this tutorial, you configure an Azure virtual machine with a managed identity to authenticate to Azure using the Azure SDK for Go.

Managed identities eliminate the need for you to manage credentials by providing an identity directly to an Azure resource. Permissions assigned to the identity grant the resource access to other Azure resources that support managed identities, removing the need for you to pass credentials in your application. You can use managed identities to authenticate and authorize Azure-hosted apps with other Azure resources.

Follow this tutorial to assign a managed identity to a virtual machine and authenticate to Azure using a managed identity.

## Prerequisites

[!INCLUDE [azure-subscription.md](includes/azure-subscription.md)]

- If you want to use the Azure CLI to run the steps in this article:

  [!INCLUDE [Azure CLI prerequisites no header](~/../articles/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

- If you want to use Azure PowerShell to run the steps in this article:

  [!INCLUDE [Azure PowerShell prerequisites no header](~/../articles/reusable-content/azure-powershell/azure-powershell-requirements-no-header.md)]

## 1. Create Azure resources

Before you begin, you need to create a new resource group, virtual machine, and  key vault instance.

### Deploy a virtual machine

Deploy a virtual machine to Azure. You run the Go code to create a secret in Azure key vault from that virtual machine.

1. Create an Azure resource group.

    # [Azure CLI](#tab/azure-cli)

    ```azurecli
    az group create --name go-on-azure --location eastus
    ```

    Change the `--location` parameter to the appropriate value for your environment.

    # [Azure PowerShell](#tab/azure-powershell)

    ```azurepowershell
    New-AzResourceGroup -Name go-on-azure -Location eastus
    ```

    Change the `-Location` parameter to the appropriate value for your environment.

    ---

1. Create the Azure virtual machine.

    # [Azure CLI](#tab/azure-cli)

    ```azurecli
    az vm create \
    --resource-group go-on-azure \
    --name go-on-azure-vm \
    --image canonical:0001-com-ubuntu-server-jammy:22_04-lts:latest \
    --admin-username azureuser \
    --admin-password <password>
    ```

    Replace the `<password>` your password.

    # [Azure PowerShell](#tab/azure-powershell)

    ```azurepowershell
    $adminUsername = 'azureuser'
    $adminPassword = Read-Host -Prompt 'Enter a Password' -AsSecureString
    $credParams = @{
        TypeName = 'System.Management.Automation.PSCredential'
        ArgumentList = $adminUsername, $adminPassword
    }
    $credential = New-Object @credParams


    $vmParams = @{
        ResourceGroupName = 'go-on-azure'
        Location = 'eastus'
        Image = 'canonical:0001-com-ubuntu-server-jammy:22_04-lts:latest'
        Name = 'go-on-azure-vm'
        PublicIpAddressName = 'go-on-azure-vm'
        OpenPorts = 22
        Credential = $credential
    }
    New-AzVM @vmParams
    ```

    ---

To learn more about other services that support managed identities, see [Services that support managed identities for Azure resources](/azure/active-directory/managed-identities-azure-resources/services-support-managed-identities).

### Deploy a key vault instance

Create a new Azure key vault instance by running the following command:

# [Azure CLI](#tab/azure-cli)
```azurecli
az keyvault create --location eastus --name <keyVaultName> --resource-group go-on-azure --enable-rbac-authorization
```

Replace `<keyVaultName>` with a globally unique name.

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
New-AzKeyVault -ResourceGroupName go-on-azure -Name <keyVaultName> -Location eastus -EnableRbacAuthorization

```

Replace `<keyVaultName>` with a globally unique name.

---

## 2. Create a managed identity

Two types of managed identities are supported in Azure; system-assigned and user-assigned.

System-assigned identities are directly attached to an Azure resource and limited to only that resource. User-assigned identities are stand-alone resources that can be assigned to one or more Azure resources.

To learn more about the difference between system-assigned and user-assigned, check out [Managed identity types](/azure/active-directory/managed-identities-azure-resources/overview#managed-identity-types).

Choose one of the following options:

- [Option 1: Create a system-assigned identity](#option-1-create-a-system-assigned-identity)
- [Option 2: Create a user-assigned identity](#option-2-create-a-user-assigned-identity)

### Option 1: Create a system-assigned identity

Run the following commands to create a system-assigned managed identity:

# [Azure CLI](#tab/azure-cli)

```azurecli
az vm identity assign -g go-on-azure -n go-on-azure-vm
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
$vm = Get-AzVM -ResourceGroupName go-on-azure -Name go-on-azure-vm
Update-AzVM -ResourceGroupName go-on-azure -VM $vm -IdentityType SystemAssigned
```

---

### Option 2: Create a user-assigned identity

Run the following commands to create a user-assigned managed identity:

# [Azure CLI](#tab/azure-cli)

```azurecli
az identity create -g go-on-azure -n GoUserIdentity

az vm identity assign -g go-on-azure -n go-on-azure-vm --identities GoUserIdentity
```

To learn more, check out [Configure managed identities for Azure resources on an Azure VM using Azure CLI](/azure/active-directory/managed-identities-azure-resources/qs-configure-cli-windows-vm).

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
$userIdentity = New-AzUserAssignedIdentity -ResourceGroupName go-on-azure -Name GoUserIdentity -Location eastus
$vm = Get-AzVM -ResourceGroupName go-on-azure -Name go-on-azure-vm
Update-AzVM -ResourceGroupName go-on-azure -VM $vm -IdentityType UserAssigned -IdentityId $userIdentity.Id
```

To learn more, check out [Manage user-assigned managed identities](/azure/active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities).

> [!IMPORTANT]
> If you receive the error `cmdlet New-AzUserAssignedIdentity` not found install the `Az.ManagedServiceIdentity` module with the following command.
> `Install-Module -Name Az.ManagedServiceIdentity -AllowPrerelease`

---

## 3. Assign a role to the managed identity

After a managed identity is created, you assign roles to grant the identity permissions to access other Azure resource. In this tutorial, you assign the built-in role of `Key Vault Secrets Officer` to the managed identity so the Go application can create a secret within the key vault instance.

Choose one of the following options:

- [Option 1: Assign a role to a system-assigned identity](#option-1-assign-a-role-to-a-system-assigned-identity)
- [Option 2: Assign a role to a user-assigned identity](#option-2-assign-a-role-to-a-user-assigned-identity)

### Option 1: Assign a role to a system-assigned identity

Run the following commands to assign the `Key Vault Secrets Officer` role to the system-assigned managed identity:

# [Azure CLI](#tab/azure-cli)

```azurecli
#output system identity principal ID
az vm identity show --name go-on-azure-vm --resource-group go-on-azure --query principalId -o tsv

#output key vault ID
az keyvault show --name <keyVaultName> --query id -o tsv

az role assignment create --assignee <principalId> --role "Key Vault Secrets Officer" --scope <keyVaultId>
```

In the second command, replace `<keyVaultName>` with the name of your key vault. In the last command, replace `<principalId>` and `<keyVaultId>` with the output from the first two commands.

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
$systemIdentityParams = @{
    ObjectId = (Get-AzVM -Name go-on-azure-vm).Identity.PrincipalId
    RoleDefinitionName = 'Key Vault Secrets Officer'
    Scope = (Get-AzKeyVault -Name <keyVaultName>).ResourceId
}
New-AzRoleAssignment @systemIdentityParams
```

Replace `<KeyVaultName>` with the key vault name.

---

### Option 2: Assign a role to a user-assigned identity

Run the following commands to assign the `Key Vault Secrets Officer` role to the user-assigned managed identity:

# [Azure CLI](#tab/azure-cli)

```azurecli
#output user identity principal ID
az identity show --resource-group go-on-azure --name GoUserIdentity --query principalId -o tsv

#output key vault ID
az keyvault show --name <keyVaultName> --query id -o tsv

az role assignment create --assignee <principalId> --role "Key Vault Secrets Officer" --scope <keyVaultId>
```

In the second command, replace `<keyVaultName>` with the name of your key vault. In the last command, replace `<principalId>` and `<keyVaultId>` with the output from the first two commands.

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
$userIdentityParams = @{
    ObjectId = (Get-AzUserAssignedIdentity -Name GoUserIdentity -ResourceGroupName go-on-azure).PrincipalId
    RoleDefinitionName = 'Key Vault Secrets Officer'
    Scope = (Get-AzKeyVault -Name <keyVaultName>).ResourceId
}
New-AzRoleAssignment @userIdentityParams
```

Replace `<keyVaultName>` with the key vault name.

---

To learn more about built-in roles in Azure key vault, see [Provide access to Key Vault keys, certificates, and secrets with an Azure role-based access control](/azure/key-vault/general/rbac-guide). To learn more about built-in roles in Azure, see [Azure built-in roles](/azure/role-based-access-control/built-in-roles).

## 4. Create a key vault secret with Go

Next SSH into the Azure virtual machine, install Go, and built the Go package.

### Install Go on the Azure VM

1. Get the public IP address of the Azure virtual machine.

    # [Azure CLI](#tab/azure-cli)

    ```azurecli
    az vm show -d -g go-on-azure -n go-on-azure-vm --query publicIps -o tsv
    ```

    # [Azure PowerShell](#tab/azure-powershell)

    ```azurepowershell
    (Get-AzVM -ResourceGroupName go-on-azure -VMName go-on-azure-vm | Get-AzPublicIpAddress).IpAddress
    ```

    ---

1. SSH into the Azure VM.

    ```console
    ssh azureuser@<public-ip>
    ```

    Replace `<public-ip>` with the public IP address of the Azure VM.

1. Install Go

    ```bash
    sudo add-apt-repository ppa:longsleep/golang-backports;
    sudo apt update;
    sudo apt install golang-go -y
    ```

### Create the Go package

1. Make a new directory with the name `go-on-azure` in your home directory.

    ```bash
    mkdir ~/go-on-azure
    ```

1. Change to the `go-on-azure` directory.

    ```bash
    cd ~/go-on-azure
    ```

1. Run `go mod init` to create the `go.mod` file.

    ```bash
    go mod init go-on-azure
    ```

1. Run `go get` to install the required Go modules.

    ```bash
    go get "github.com/Azure/azure-sdk-for-go/sdk/azidentity"
    go get "github.com/Azure/azure-sdk-for-go/sdk/security/keyvault/azsecrets"
    ```

1. Create a `main.go` file and copy the following code into it.

    ```go
    package main
    
    import (
        "context"
        "fmt"
        "log"
        "os"
    
        "github.com/Azure/azure-sdk-for-go/sdk/azidentity"
        "github.com/Azure/azure-sdk-for-go/sdk/security/keyvault/azsecrets"
    )
    
    func createSecret() {
        keyVaultName := os.Getenv("KEY_VAULT_NAME")
        secretName := "quickstart-secret"
        secretValue := "createdWithGO"
        keyVaultUrl := fmt.Sprintf("https://%s.vault.azure.net/", keyVaultName)
    
        cred, err := azidentity.NewDefaultAzureCredential(nil)
        if err != nil {
            log.Fatalf("failed to obtain a credential: %v", err)
        }
    
        client, err := azsecrets.NewClient(keyVaultUrl, cred, nil)
        if err != nil {
            log.Fatalf("failed to create a client: %v", err)
        }
    
        params := azsecrets.SetSecretParameters{Value: &secretValue}
        resp, err := client.SetSecret(context.TODO(), secretName, params, nil)
        if err != nil {
            log.Fatalf("failed to create a secret: %v", err)
        }
    
        fmt.Printf("Name: %s, Value: %s\n", *resp.ID, *resp.Value)
    }
    
    func main() {
        createSecret()
    }

    ```

1. Create an environment variable named `KEY_VAULT_NAME`. Replace `<keyVaultName>` with the name of your Azure key vault instance.

    ```bash
    export KEY_VAULT_NAME=<keyVaultName>
    ```

1. Run `go run` command to create a key vault secret.

    ```bash
    go run main.go
    ```

    On success, the output is similar to the following:

    ```Output
    Name: https://<keyVaultName>.vault.azure.net/secrets/quickstart-secret/0e0b941824c4493bb3b83045a31b2bf7, Value: createdWithGO
    ```

You can verify the key vault secret was created using Azure PowerShell, Azure CLI, or the Azure portal.

> [!NOTE]
> If you use the Azure CLI or Azure PowerShell, you need to make sure that your Azure user account is assigned a role that permits it to read secrets in the key vault like "Key Vault Secrets Officer" or "Key Vault Secrets User".

## 5. Clean up resources

If you no longer want to use the Azure resources you created in this article, it's a good practice to delete them. Deleting unused resources helps you avoid incurring ongoing charges and keeps your subscription uncluttered. The easiest way to delete the resources you used in this tutorial is to delete the resource group.

# [Azure CLI](#tab/azure-cli)

```azurecli
az group delete --name go-on-azure --force-deletion-types Microsoft.Compute/virtualMachines --yes
```

The `force-deletion-type` argument tells the command to force deletion of VMs in the resource group. The `--yes` argument tells the command not to ask for confirmation.

The preceding command performs a [soft delete](/azure/key-vault/general/soft-delete-overview) on the key vault in the resource group. To permanently remove it from your subscription, enter the following command:

```azurecli
az keyvault purge --name <keyVaultName> --no-wait
```

Replace `<keyVaultName>` with the name of your key vault.

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
Remove-AzResourceGroup -Name go-on-azure -Force
```

The `-Force` argument tells the cmdlet not to ask for confirmation.

The preceding command performs a [soft delete](/azure/key-vault/general/soft-delete-overview) on the key vault in the resource group. To permanently remove it from your subscription, enter the following command:

```azurepowershell
Remove-AzKeyVault -Name '<keyVaultName>' -InRemovedState -Force
```

Replace `<keyVaultName>` with the name of your key vault.

---

## Next steps

> [!div class="nextstepaction"]
> [Learn more about using the Azure SDK for Go](/azure/go)
