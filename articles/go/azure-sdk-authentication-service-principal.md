---
title: Azure SDK for Go authentication with a service principal
description: In this tutorial, you'll use the Azure SDK for Go to authenticate to Azure with an Azure service principal using a secret or a certificate.
ms.date: 05/10/2024
ms.topic: how-to
ms.custom: devx-track-go
---

# Azure SDK for Go authentication with a service principal

In this tutorial, you'll use the Azure SDK for Go to authenticate to Azure with an Azure service principal using either a secret or a certificate.

Azure service principals define the access policy and permissions in a Microsoft Entra tenant, enabling core features such as authentication during sign-on and authorization during resource access. They remove the need to use personal accounts to access Azure resources. The Azure SDK for Go [Azure Identity](https://github.com/Azure/azure-sdk-for-go/tree/main/sdk/azidentity) module provides a convenient way to authenticate to Azure with a service principal using environment variables, and a secret or a certificate.

Follow this tutorial to create and authenticate with the Azure SDK for Go using a service principal.

## Prerequisites

[!INCLUDE [azure-subscription.md](includes/azure-subscription.md)]
- **Go installed**: Version 1.18 or [above](https://go.dev/dl/)

## 1. Configure your environment

Before you begin, create a new resource group and key vault instance.

# [Azure CLI](#tab/azure-cli)

```azurecli
az group create --name go-on-azure --location eastus

az keyvault create --location eastus --name `<keyVaultName>` --resource-group go-on-azure --enable-rbac-authorization
```

Replace `<keyVaultName>` with a globally unique name. Also, note down the `id` property from the output of the `az keyvault create` command. You'll use it in the next section to define the scope of the authorization for the service prinicpal.

# [PowerShell](#tab/powershell)

```powershell
New-AzResourceGroup -Name go-on-azure -location eastus

New-AzKeyVault -ResourceGroupName go-on-azure -Name `<keyVaultName>` -Location eastus -EnableRbacAuthorization
```

Replace `<keyVaultName>` with a globally unique name. Also, note down the `ResourceId` property from the output of the `New-AzKeyVault` command. You'll use it in the next section to define the scope of the authorization for the service prinicpal.

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
az ad sp create-for-rbac --name `<servicePrincipalName>` --role "Key Vault Secrets Officer" --scope <keyVaultId>
```

Replace `<servicePrincipalName>` and `<keyVaultId>` with the appropriate values.

Make sure you copy the **password** value - it can't be retrieved. If you forget the password, [reset the service principal credentials](/cli/azure/create-an-azure-service-principal-azure-cli#reset-credentials).

# [PowerShell](#tab/powershell)

```powershell
# Create an Azure service principal
$password = '<Password>'

$credentials = New-Object Microsoft.Azure.Commands.ActiveDirectory.PSADPasswordCredential `
-Property @{ StartDate=Get-Date; EndDate=Get-Date -Year 2024; Password=$password}

$spSplat = @{
    DisplayName = '<servicePrincipalName>'
    PasswordCredential = $credentials
}

$sp = New-AzAdServicePrincipal @spSplat

# assign role permissions to the service principal
$roleAssignmentSplat = @{
    ObjectId = $sp.id;
    RoleDefinitionName = 'Key Vault Secrets Officer';
    Scope = "<keyVaultId>"
}

New-AzRoleAssignment @roleAssignmentSplat
```

Replace `<Password>`, `<servicePrincipalName>`, and `<keyVaultId>` with the appropriate value.

---

### Option 2: Create an Azure service principal with a certificate

Run the following commands to create an Azure service principal that uses a certificate and assign it the "Key Vault Secrets Officer" role on the key vault.

# [Azure CLI](#tab/azure-cli)
```azurecli
az ad sp create-for-rbac --name <servicePrincipal> --create-cert --role "Key Vault Secrets Officer" --scope <keyVaultId>
```

Replace `<servicePrincipalName>` and `<keyVaultId>` with the appropriate values.

# [PowerShell](#tab/powershell)

```powershell
$cert = New-SelfSignedCertificate -CertStoreLocation "cert:\CurrentUser\My" `
  -Subject "CN=<servicePrincipal>" `
  -KeySpec KeyExchange
$keyValue = [System.Convert]::ToBase64String($cert.GetRawCertData())

$sp = New-AzADServicePrincipal -DisplayName <servicePrincipal> `
  -CertValue $keyValue `
  -EndDate $cert.NotAfter `
  -StartDate $cert.NotBefore

$pftPwd = ConvertTo-SecureString -String "<pftPassword>" -Force -AsPlainText

$cert | Export-PfxCertificate -FilePath "<servicePrincipal>.pfx" -Password

# assign role permissions to the service principal
$roleAssignmentSplat = @{
    ObjectId = $sp.id;
    RoleDefinitionName = 'Key Vault Secrets Officer';
    Scope = "<keyVaultId>"
}

New-AzRoleAssignment @roleAssignmentSplat
```

Replace `<pftPassword>`, `<servicePrincipalName>`, and `<keyVaultId>` with the appropriate value.

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
export AZURE_TENANT_ID="<active_directory_tenant_id"
export AZURE_CLIENT_ID="<service_principal_appid>"
export AZURE_CLIENT_SECRET="<service_principal_password>"
```

# [PowerShell](#tab/powershell)

```powershell
$env:AZURE_TENANT_ID="<active_directory_tenant_id"
$env:AZURE_CLIENT_ID="<service_principal_appid>"
$env:AZURE_CLIENT_SECRET="<service_principal_password>"
```

---

### Option 2: Authenticate with a certificate

|Variable name|Value
|-|-
|`AZURE_CLIENT_ID`|Application ID of an Azure service principal
|`AZURE_TENANT_ID`|ID of the application's Microsoft Entra tenant
|`AZURE_CLIENT_CERTIFICATE_PATH`|Path to a certificate file including private key (without password protection)

# [Bash](#tab/azure-cli)

```bash
export AZURE_TENANT_ID="<active_directory_tenant_id"
export AZURE_CLIENT_ID="<service_principal_appid>"
export AZURE_CLIENT_CERTIFICATE_PATH="<azure_client_certificate_path>"
```

# [PowerShell](#tab/powershell)

```powershell
$env:AZURE_TENANT_ID="<active_directory_tenant_id"
$env:AZURE_CLIENT_ID="<service_principal_appid>"
$env:AZURE_CLIENT_CERTIFICATE_PATH="<azure_client_certificate_path>"
```

---

### Use DefaultAzureCredential to authenticate a resource client

Use the `NewDefaultAzureCredential` function of the Azure Identity module to authenticate a resource client.

```go
cred, err := azidentity.NewDefaultAzureCredential(nil)
if err != nil {
    log.Fatalf("failed to obtain a credential: %v", err)
}
```

## 4. Sample code

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

    # [PowerShell](#tab/powershell)

    ```powershell
    $env:KEY_VAULT_NAME="<keyVaultName>"
    ```

    Replace `<keyVaultName>` with the name of your Azure Key Vault instance.

    ---

1. Run the `go run` command to create the new key vault secret.

   ```Console
    go run main.go
    ```

    On success, the output will be similar to the following:

    ```Output
    Name: https://<keyVaultName>.vault.azure.net/secrets/ExamplePassword/1e697f71d0014761a65641226f2f057b, Value: hVFkk965BuUv
    ```

## Next steps

> [!div class="nextstepaction"]
> [Learn more about using the Azure SDK for Go](/azure/go)
