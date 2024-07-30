---
title: Azure SDK for Go authentication with a service principal
description: In this tutorial, you use the Azure SDK for Go to authenticate to Azure with an Azure service principal using a secret or a certificate.
ms.date: 05/17/2024
ms.topic: how-to
ms.custom: devx-track-go, devx-track-azurepowershell
---

# Azure SDK for Go authentication with a service principal

In this tutorial, you use the Azure SDK for Go to authenticate to Azure with an Azure service principal using either a secret or a certificate.

Azure service principals define the access policy and permissions in a Microsoft Entra tenant, enabling core features such as authentication during sign-on and authorization during resource access. They remove the need to use personal accounts to access Azure resources. You can assign a service principal the exact permissions needed for your app and develop against those permissions, rather than using a personal account, which might have more privileges in your tenant than the app requires. You can also use service principals for apps that are hosted on-premises that need to use Azure resources. The Azure SDK for Go [Azure Identity](https://github.com/Azure/azure-sdk-for-go/tree/main/sdk/azidentity) module provides a convenient way to authenticate to Azure with a service principal using environment variables, and a secret or a certificate.

Follow this tutorial to create and authenticate with the Azure SDK for Go using a service principal.

## Prerequisites

[!INCLUDE [azure-subscription.md](includes/azure-subscription.md)]

- **Go installed**: Version 1.18 or [above](https://go.dev/dl/)

- If you want to use the Azure CLI to run the steps in this article:

  [!INCLUDE [Azure CLI prerequisites no header](~/../articles/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

- If you want to use Azure PowerShell to run the steps in this article:

  [!INCLUDE [Azure PowerShell prerequisites no header](~/../articles/reusable-content/azure-powershell/azure-powershell-requirements-no-header.md)]

## 1. Create Azure resources

Before you begin, create a new resource group and key vault instance.

# [Azure CLI](#tab/azure-cli)

```azurecli
az group create --name go-on-azure --location eastus

az keyvault create --location eastus --name <keyVaultName> --resource-group go-on-azure --enable-rbac-authorization
```

Replace `<keyVaultName>` with a globally unique name.

Note down the `id` property from the output of the `az keyvault create` command. You'll use it in the next section to define the scope of the authorization for the service principal. The `id` value has the following form: `/subscriptions/<subscriptionId>/resourceGroups/go-on-azure/providers/Microsoft.KeyVault/vaults/<keyVaultName>`.

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
New-AzResourceGroup -Name go-on-azure -Location eastus

New-AzKeyVault -ResourceGroupName go-on-azure -Name <keyVaultName> -Location eastus -EnableRbacAuthorization
```

Replace `<keyVaultName>` with a globally unique name.

Note down the `Resource ID` property from the output of the `New-AzKeyVault` command. You'll use it in the next section to define the scope of the authorization for the service principal. The `Resource ID` value has the following form:`/subscriptions/<subscriptionId>/resourceGroups/go-on-azure/providers/Microsoft.KeyVault/vaults/<keyVaultName>`.

---

## 2. Create an Azure service principal

Use one of the following techniques to create an Azure service principal and assign it the "Key Vault Secrets Officer" role on the key vault:

- [Option 1: Create an Azure service principal with a secret](#option-1-create-an-azure-service-principal-with-a-secret)
- [Option 2: Create an Azure service principal with a certificate](#option-2-authenticate-with-a-certificate)

To learn more Azure service principals, see [Service principal object](/azure/active-directory/develop/app-objects-and-service-principals#service-principal-object).

Assigning the "Key Vault Secrets Officer" role to the service principal, authorizes it to create, read, update, and delete secrets in the key vault. To learn more about built-in roles for Azure key vault, see [Provide access to Key Vault keys, certificates, and secrets with an Azure role-based access control](/azure/key-vault/general/rbac-guide). To learn more about built-in roles in Azure, see [Azure built-in roles](/azure/role-based-access-control/built-in-roles).

### Option 1: Create an Azure service principal with a secret

Run the following commands to create an Azure service principal and assign it the "Key Vault Secrets Officer" role on the key vault.

# [Azure CLI](#tab/azure-cli)

```azurecli
az ad sp create-for-rbac --name <servicePrincipalName> --role "Key Vault Secrets Officer" --scope <keyVaultId>
```

Replace `<servicePrincipalName>` and `<keyVaultId>` with the appropriate values.

Note down the `password`, `tenant`, and `appId` properties from the output. You need them in the next section. 

After creation, the service principal password can't be retrieved. If you forget the password, you can [reset the service principal credentials](/cli/azure/create-an-azure-service-principal-azure-cli#reset-credentials).

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
# Create an Azure service principal
$sp = New-AzADServicePrincipal -DisplayName '<servicePrincipalName>' -Role 'Key Vault Secrets Officer' -Scope <keyVaultId>

# Export the password for the service principal
$sp.PasswordCredentials.SecretText

# Export the service principal App ID
$sp.AppId

# Get the Tenant ID
(Get-AzTenant).Id

```

Replace `<servicePrincipalName>`, and `<keyVaultId>` with the appropriate value.

Note down the Password, App ID, and Tenant ID. You need them in the next section.

---

### Option 2: Create an Azure service principal with a certificate

Run the following commands to create an Azure service principal that uses a certificate and assign it the "Key Vault Secrets Officer" role on the key vault.

# [Azure CLI](#tab/azure-cli)

```azurecli
az ad sp create-for-rbac --name <servicePrincipalName> --create-cert --role "Key Vault Secrets Officer" --scope <keyVaultId>
```

Replace `<servicePrincipalName>` and `<keyVaultId>` with the appropriate values.

Note down the `fileWithCertAndPrivateKey`, `tenantId`, and `appId` properties from the output. You need them in the next section.

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
$certParams = @{
    CertStoreLocation = "Cert:\CurrentUser\My"
    Subject = "CN=<servicePrincipalName>"
    KeySpec = 'KeyExchange'
}
$cert = New-SelfSignedCertificate @certParams
$keyValue = [System.Convert]::ToBase64String($cert.GetRawCertData())

$spCertParams = @{
    CertValue = $keyValue
    EndDate = $cert.NotAfter
    StartDate = $cert.NotBefore
    DisplayName = '<servicePrincipalName>'
}
$sp = New-AzADServicePrincipal @spCertParams

$pftPwd = Read-Host -Prompt 'Enter pft password' -AsSecureString

$cert | Export-PfxCertificate -FilePath '<servicePrincipalName>.pfx' -Password $pftPwd

# assign role permissions to the service principal
$roleAssignmentParams = @{
    ObjectId = $sp.id
    RoleDefinitionName = 'Key Vault Secrets Officer'
    Scope = '<keyVaultId>'
}
New-AzRoleAssignment @roleAssignmentParams

# Export the service principal App ID
$sp.AppId

# Get the Tenant ID
(Get-AzTenant).Id

```

Replace `<servicePrincipalName>` and `<keyVaultId>` with the appropriate value.

Note down the App ID, Tenant ID, and the password you entered. You need them in the next section. You also need the full path of the certificate file, which you can find in the output of the `Export_PfxCertificate` cmdlet.

---

## 3. Authenticate to Azure with a service principal

By using `DefaultAzureCredential`, you can avoid writing environment-specific code to authenticate to Azure. With `DefaultAzureCredential`, you can configure your service principal credentials by defining environment variables.

Choose one of the following options to configure your service principal credentials:

- [Option 1: Authenticate with a secret](#option-1-authenticate-with-a-secret)
- [Option 2: Authenticate with a certificate](#option-2-authenticate-with-a-certificate)

To learn more about the `DefaultAzureCredential`, check out [Azure authentication with the Azure SDK for Go](./azure-sdk-authentication.md)

### Option 1: Authenticate with a secret

Define the following environment variables:

|Variable name|Value
|-|-
|`AZURE_CLIENT_ID`|Application ID of an Azure service principal
|`AZURE_TENANT_ID`|ID of the application's Microsoft Entra tenant
|`AZURE_CLIENT_SECRET`|Password of the Azure service principal

# [Bash](#tab/azure-cli)

```bash
export AZURE_TENANT_ID="<active_directory_tenant_id>"
export AZURE_CLIENT_ID="<service_principal_appid>"
export AZURE_CLIENT_SECRET="<service_principal_password>"
```

# [PowerShell](#tab/azure-powershell)

```powershell
$env:AZURE_TENANT_ID="<active_directory_tenant_id>"
$env:AZURE_CLIENT_ID="<service_principal_appid>"
$env:AZURE_CLIENT_SECRET="<service_principal_password>"
```

---

### Option 2: Authenticate with a certificate

|Variable name|Value
|-|-
|`AZURE_CLIENT_ID`|Application ID of an Azure service principal
|`AZURE_TENANT_ID`|ID of the application's Microsoft Entra tenant
|`AZURE_CLIENT_CERTIFICATE_PATH`|Path to a PEM or PKCS12 certificate file including private key. If you followed the steps for the Azure CLI, the file isn't password protected. If you followed the steps for Azure PowerShell, the file is password protected, and you'll also need to set the `AZURE_CLIENT_CERTIFICATE_PASSWORD` environment variable.
|`AZURE_CLIENT_CERTIFICATE_PASSWORD`|The password you entered when you created the service principal. Only needed if you followed the steps for Azure PowerShell.

# [Bash](#tab/azure-cli)

```bash
export AZURE_TENANT_ID="<active_directory_tenant_id>"
export AZURE_CLIENT_ID="<service_principal_appid>"
export AZURE_CLIENT_CERTIFICATE_PATH="<azure_client_certificate_path>"
```

# [PowerShell](#tab/azure-powershell)

```powershell
$env:AZURE_TENANT_ID="<active_directory_tenant_id>"
$env:AZURE_CLIENT_ID="<service_principal_appid>"
$env:AZURE_CLIENT_CERTIFICATE_PATH="<azure_client_certificate_path>"
$env:AZURE_CLIENT_CERTIFICATE_PASSWORD="<azure_client_certificate_password>"
```

---

### Use DefaultAzureCredential to authenticate a resource client

After you set the environment variables, you can use `DefaultAzureCredential` in the Azure Identity module to authenticate a resource client. The following code shows how to get an instance of `DefaultAzureCredential`.

```go
cred, err := azidentity.NewDefaultAzureCredential(nil)
if err != nil {
    log.Fatalf("failed to obtain a credential: %v", err)
}
```

## 4. Create a key vault secret with Go

Use the following code sample to verify that your service principal authenticates to Azure and has the appropriate permissions to the key vault.

1. Create a new directory called `go-on-azure` in your home directory.

    ```Console
    mkdir ~/go-on-azure
    ```

1. Change to the `go-on-azure` directory.

    ```Console
    cd ~/go-on-azure
    ```

1. Run `go mod init` to create the `go.mod` file.

    ```Console
    go mod init go-on-azure
    ```

1. Run `go get` to install the required Go modules.

    ```Console
    go get "github.com/Azure/azure-sdk-for-go/sdk/azidentity"
    go get "github.com/Azure/azure-sdk-for-go/sdk/security/keyvault/azsecrets"
    ```

1. Create a file named `main.go` and add the following code.

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
    
    func createSecret(name, value string) {
    	keyVaultName := os.Getenv("KEY_VAULT_NAME")
    	keyVaultUrl := fmt.Sprintf("https://%s.vault.azure.net/", keyVaultName)
    
    	cred, err := azidentity.NewDefaultAzureCredential(nil)
    	if err != nil {
    		log.Fatalf("failed to obtain a credential: %v", err)
    	}
    
    	client, err := azsecrets.NewClient(keyVaultUrl, cred, nil)
    	if err != nil {
    		log.Fatalf("failed to create a client: %v", err)
    	}
    
        params := azsecrets.SetSecretParameters{Value: &value}
        resp, err := client.SetSecret(context.TODO(), name, params, nil)
    	if err != nil {
    		log.Fatalf("failed to create a secret: %v", err)
    	}
    
    	fmt.Printf("Name: %s, Value: %s\n", *resp.ID, *resp.Value)
    }
    
    func main() {
    	createSecret("ExamplePassword", "hVFkk965BuUv")
    }

    ```

1. Create an environment variable named `KEY_VAULT_NAME`. Set the environment variable's value to the name of the Azure Key Vault created previously.

    # [Bash](#tab/azure-cli)

    ```bash
    export KEY_VAULT_NAME=<keyVaultName>
    ```

    Replace `<keyVaultName>` with the name of your Azure Key Vault instance.

    # [PowerShell](#tab/azure-powershell)

    ```powershell
    $env:KEY_VAULT_NAME="<keyVaultName>"
    ```

    Replace `<keyVaultName>` with the name of your Azure Key Vault instance.

    ---

1. Run the `go run` command to create the new key vault secret.

   ```Console
    go run main.go
    ```

    On success, the output is similar to the following:

    ```Output
    Name: https://<keyVaultName>.vault.azure.net/secrets/ExamplePassword/1e697f71d0014761a65641226f2f057b, Value: hVFkk965BuUv
    ```

## 5. Clean up resources

If you no longer want to use the Azure resources you created in this article, it's a good practice to delete them. Deleting unused resources helps you avoid incurring ongoing charges and keeps your subscription uncluttered. The easiest way to delete the resources you used in this tutorial is to delete the resource group.

# [Azure CLI](#tab/azure-cli)

```azurecli
az group delete --name go-on-azure --yes
```

The `--yes` argument tells the command not to ask for confirmation.

The preceding command performs a [soft delete](/azure/key-vault/general/soft-delete-overview) on the key vault in the resource group. To permanently remove it from your subscription, enter the following command:

```azurecli
az keyvault purge --name <keyVaultName> --no-wait
```

Replace `<keyVaultName>` with the name of your key vault.

Finally, you should remove the app registration and service principal.

```azurecli
az ad app delete --id <servicePrincipalAppId>
```

Replace `<servicePrincipalAppId>` with the App ID of your service principal.

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
Remove-AzResourceGroup -Name go-on-azure -Force
```

The `-Force` argument tells the cmdlet not to ask for confirmation.

The preceding command performs a [soft delete](/azure/key-vault/general/soft-delete-overview) on the key vault in the resource group. To permanently remove it from your subscription, enter the following command:

```azurepowershell
Remove-AzKeyVault -Name '<keyVaultName>' -Location eastus -InRemovedState -Force
```

Replace `<keyVaultName>` with the name of your key vault.

Finally, you should remove the app registration and service principal.

```azurepowershell
Remove-AzADApplication -DisplayName <servicePrincipalName>
```

Replace `<servicePrincipalName>` with the name you used for your service principal.

---

## Next steps

> [!div class="nextstepaction"]
> [Learn more about using the Azure SDK for Go](/azure/go)
