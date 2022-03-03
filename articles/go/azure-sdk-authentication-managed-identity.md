---
title: Authentication with the Azure SDK for Go using a managed identity
description: In this tutorial, you'll use the Azure SDK for Go to authenticate to Azure with a managed identity.
ms.date: 09/15/2021
ms.topic: how-to
ms.custom: devx-track-go, devx-track-azurecli 
---

# Authentication with the Azure SDK for Go using a managed identity

In this tutorial, you'll configure an Azure virtual machine with a managed identity to authenticate to Azure using the Azure SDK for Go.

Managed identities eliminate the need for you to manage credentials by providing an identity directly to an Azure resource. Permissions assigned to the identity grant the resource access to other Azure resources that support managed identities. Removing the need for you to pass credentials to your application.

Follow this tutorial to assign a managed identity to a virtual machine and authenticate to Azure using a managed identity.

## Prerequisites

[!INCLUDE [azure-subscription.md](includes/azure-subscription.md)]
- **Go installed**: Version 1.16 or [above](https://golang.org/dl/)

## 1. Configure your environment

Before you begin, you'll need to configure your environment.

### Deploy a virtual machine

Deploy a virtual machine to Azure. You'll run the Go code to create a secret in Azure key vault from that virtual machine.

1. Create an Azure resource group.

    # [Azure CLI](#tab/azure-cli)

    ```azurecli
    az group create --name go-on-azure --location eastus
    ```

    Change the `--location` parameter to the appropriate value for your environment.

    # [PowerShell](#tab/powershell)

    ```azurepowershell
    New-AzResourceGroup -Name go-on-azure -location eastus
    ```

    Change the `--location` parameter to the appropriate value for your environment.

    ---

1. Create the Azure virtual machine.

    # [Azure CLI](#tab/azure-cli)

    ```azurecli
    az vm create \
    --resource-group go-on-azure \
    --name go-on-azure-vm \
    --image canonical:ubuntuserver:19.04:latest \
    --admin-username azureuser \
    --admin-password <password>
    ```

    Replace the `<password>` your password.

    # [PowerShell](#tab/powershell)

    ```azurepowershell
    $adminUsername = "azureuser"
    $adminPassword = ConvertTo-SecureString <password> -AsPlainText -Force
    $credential = New-Object System.Management.Automation.PSCredential ($adminUsername, $adminPassword);
    
    New-AzVM `
    -ResourceGroupName go-on-azure `
    -Location eastus `
    -Image canonical:ubuntuserver:19.04:latest `
    -Name go-on-azure-vm `
    -OpenPorts 22 `
    -Credential $credential
    ```

    Replace the `<password>` your password.

    ---

To learn more about other services that support managed identities, see [Services that support managed identities for Azure resources](/azure/active-directory/managed-identities-azure-resources/services-support-managed-identities).

### Deploy a key vault instance

Create a new Azure key vault instance by running the following command:

# [Azure CLI](#tab/azure-cli)
```azurecli
az keyvault create --location eastus --name `<keyVaultName>` --resource-group go-on-azure
```

Replace `<keyVaultName>` with a globally unique name.

# [PowerShell](#tab/powershell)

```powershell
New-AzKeyVault -ResourceGroupName go-on-azure -Name `<keyVaultName>` -Location eastus
```

Replace `<keyVaultName>` with a globally unique name.

---

## 2. Create a managed identity

Two types of managed identities are supported in Azure; system-assigned and user-assigned.

System-assigned identities are directly attached to an Azure resource and limited to only that resource. User-assigned identities are stand-alone resources that can be assigned to one or more Azure resources.

To learn more about the difference between system-assigned and user-assigned, check out [Managed identity types](/azure/active-directory/managed-identities-azure-resources/overview#managed-identity-types).

Choose one of the following options:

* [Option 1: Create a system-assigned identity](#create-system-assigned)
* [Option 2: Create a user-assigned identity](#create-user-assigned)

### <span id="create-system-assigned"/> Option 1: Create a system-assigned identity

Run the following commands to create a system-assigned managed identity:

# [Azure CLI](#tab/azure-cli)

```azurecli
az vm identity assign -g go-on-azure -n go-on-azure-vm
```

# [PowerShell](#tab/powershell)

```powershell
$vm = Get-AzVM -ResourceGroupName go-on-azure -Name go-on-azure-vm
Update-AzVM -ResourceGroupName go-on-azure -VM $vm -IdentityType SystemAssigned
```

---

### <span id="create-user-assigned"/> Option 2: Create a user-assigned identity

Run the following commands to create a user-assigned managed identity:

# [Azure CLI](#tab/azure-cli)

```azurecli
az identity create -g go-on-azure -n GoUserIdentity

az vm identity assign -g go-on-azure -n go-on-azure-vm --identities <UserIdentityId>
```

Replace `<UserIdentityId>` with the managed user identity's ID.

To learn more, check out [Configure managed identities for Azure resources on an Azure VM using Azure CLI](/azure/active-directory/managed-identities-azure-resources/qs-configure-cli-windows-vm).

# [PowerShell](#tab/powershell)

```powershell
$userIdentity = New-AzUserAssignedIdentity -ResourceGroupName go-on-azure -Name GoUserIdentity
$vm = Get-AzVM -ResourceGroupName go-on-azure -Name go-on-azure-vm
Update-AzVM -ResourceGroupName go-on-azure -VM $vm -IdentityType UserAssigned -IdentityID $userIdentity.Id
```

To learn more, check out [Manage user-assigned managed identities](/azure/active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities).

> [!IMPORTANT]
> If you receive the error `cmdlet New-AzUserAssignedIdentity` not found install the `Az.ManagedServiceIdentity` module with the following command.
> `Install-Module -Name Az.ManagedServiceIdentity -AllowPrerelease`

---

## 3. Assign a role to the managed identity

After a managed identity is created, you assign roles to grant the identity permissions to access other Azure resource. In this tutorial, you'll assign the built-in role of `Key Vault Contributor` to the managed identity so the Go application can create a secret within the key vault instance.

Choose one of the following options:

* [Option 1: Assign a role to a system-assigned identity](#add-role-system-assigned)
* [Option 2: Assign a role to a user-assigned identity](#add-role-user-assigned)

### <span id="add-role-system-assigned"/> Option 1: Assign a role to a system-assigned identity

Run the following commands to assign the `Key Vault Contributor` role to the system-assigned managed identity:

# [Azure CLI](#tab/azure-cli)
```azurecli
#output system identity principal ID
az vm identity show --name go-on-azure-vm --resource-group go-on-azure --query 'principalId' -o tsv

#output key vault ID
scope=$(az keyvault show --name go-on-azure-kv --query id -o tsv)

az role assignment create --assignee '<principalId>' --role 'Key Vault Contributor' --scope '<keyVaultId>'
```

# [PowerShell](#tab/powershell)

```powershell
$splat = @{
    ObjectId = (Get-AzVM -Name go-on-azure-vm).Identity.PrincipalId
    RoleDefinitionName = 'Key Vault Contributor'
    Scope = (Get-AzKeyVault -Name <keyVaultName>).ResourceId
}

New-AzRoleAssignment @splat
```

Replace `<KeyVaultName>` with the key vault name.

---

### <span id="add-role-user-assigned"/> Option 2: Assign a role to a user-assigned identity

Run the following commands to assign the `Key Vault Contributor` role to the user-assigned managed identity:

# [Azure CLI](#tab/azure-cli)
```azurecli
#output user identity principal ID
az identity show --resource-group go-on-azure --name GoUserIdentity --query 'principalId' -o tsv

#output key vault ID
az keyvault show --name go-on-azure-kv --query id -o tsv

az role assignment create --assignee '<principalId>' --role 'Key Vault Contributor' --scope '<keyVaultId>'
```
# [PowerShell](#tab/powershell)

```powershell
$splat = @{
    ObjectId = (Get-AzUserAssignedIdentity -Name GoUserIdentity -ResourceGroupName go-on-azure).Id
    RoleDefinitionName = 'Key Vault Contributor'
    Scope = (Get-AzKeyVault -Name <keyVaultName>).ResourceId
}

New-AzRoleAssignment @splat
```

Replace `<KeyVaultName>` with the key vault name.

---

To learn more about built-in roles, check out [Azure built-in roles](/azure/role-based-access-control/built-in-roles).

## 4. Create a key vault secret with Go

Next SSH into the Azure virtual machine, install Go, and built the Go package.

### Install Go on the Azure VM

1. Get the public Ip address of the Azure virtual machine.

    # [Azure CLI](#tab/azure-cli)

    ```azurecli
    az vm show -d -g go-on-azure -n go-on-azure-vm --query publicIps -o tsv
    ```

    # [PowerShell](#tab/powershell)

    ```azurepowershell
    (Get-AzVM -ResourceGroupName go-on-azure -VMName go-on-azure-vm | Get-AzPublicIpAddress).IpAddress
    ```

    ---

1. SSH into the Azure VM.

    ```azurecli
    ssh azureuser@<public-ip>
    ```

    Replace `<public-ip>` with the public IP address of the Azure VM.

1. Install Go

    ```azurecli
    sudo add-apt-repository ppa:longsleep/golang-backports;
    sudo apt update;
    sudo apt install golang-go -y
    ```

### Create the Go package

1. Make a new directory with the name `go-on-azure` in your home directory.

    ```azurecli
    mkidr ~/go-on-azure
    ```

1. Change to the `go-on-azure` directory.

    ```azurecli
    cd ~/go-on-azure
    ```

1. Run `go mod init` to create the `go.mod` file.

    ```azurecli
    go mod init go-on-azure
    ```

1. Run `go get` to install the required Go modules.

    ```azurecli
    go get "github.com/Azure/azure-sdk-for-go/sdk/azidentity"
    go get "github.com/Azure/azure-sdk-for-go/sdk/keyvault/azsecrets"
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
        "github.com/Azure/azure-sdk-for-go/sdk/keyvault/azsecrets"
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
    
        resp, err := client.SetSecret(context.TODO(), secretName, secretValue, nil)
        if err != nil {
            log.Fatalf("failed to create a secret: %v", err)
        }
    
        fmt.Printf("Name: %s, Value: %s\n", *resp.ID, *resp.Value)
    }
    
    func main() {
        createSecret()
    }

    ```

Before you run the code, create an environment variable named `KEY_VAULT_NAME`. Set the environment variable's value to the name of the Azure Key Vault created previously. Replace `<KeyVaultName>` with the name of your Azure Key Vault instance.

```azurecli
export KEY_VAULT_NAME=<KeyVaultName>
```

Next, run `go run` command to create a key vault secret.

```azurecli
go run main.go
```

Verify the key vault secret was created using Azure PowerShell, Azure CLI, or the Azure portal.

## Next steps

> [!div class="nextstepaction"]
> [Learn more about using the Azure SDK for Go](/azure/go)
