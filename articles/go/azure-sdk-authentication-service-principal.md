---
title: Azure SDK for Go authentication with a service principal
description: In this tutorial, you'll use the Azure SDK for Go to authenticate to Azure with an Azure service principal using a secret or a certificate.
ms.date: 08/21/2021
ms.topic: how-to
ms.custom: devx-track-go
---

# Azure SDK for Go authentication with a service principal

In this tutorial, you'll use the Azure SDK for Go to authenticate to Azure with an Azure service principal using either a secret or a certificate.

Azure service principals define the access policy and permissions in an Azure AD tenant. Enabling core features such as authentication during sign-on and authorization during resource access. Removing the need to use personal accounts to access Azure resources. The Azure SDK for Go's [Azure Identity](https://github.com/Azure/azure-sdk-for-go/tree/main/sdk/azidentity) module provides a convenient way to authenticate with Azure using a service principal using environment variables, a secret, or a certificate

Follow this tutorial to create and authenticate with the Azure SDK for Go using a service principal.

## Prerequisites

[!INCLUDE [azure-subscription.md](includes/azure-subscription.md)]
- **Go installed**: Version 1.16 or [above](https://golang.org/dl/)

## 1. Create an Azure resource group

Before you begin, create a new resource group in Azure.

# [Azure CLI](#tab/azure-cli)
```azurecli
az group create --name go-on-azure --location eastus
```

Take note of the `Id` from the output, you'll use it for the scope of the service account.

# [PowerShell](#tab/powershell)

```powershell
New-AzResourceGroup -Name go-on-azure -location eastus
```

Take note the `ResourceId` from the output, you'll use it for the scope of the service account.

---

## 2. Create an Azure service principal

Use one of the following techniques to create an Azure service principal:

* [Option 1: Create an Azure service principal with a secret](#service-principal-secret)
* [Option 2: Create an Azure service principal with a certificate](#service-principal-certificate)

To learn more Azure service principals, see [Service principal object](/azure/active-directory/develop/app-objects-and-service-principals#service-principal-object).

### <span id="service-principal-secret"/> Option 1: Create an Azure service principal with a secret

Run the following commands to create an Azure service principal.

# [Azure CLI](#tab/azure-cli)
```azurecli
az ad sp create-for-rbac --name `<servicePrincipalName>` --role Contributor --scope <resourceGroupId>
```

Replace `<servicePrincipalName>` and `<resourceGroupId>` with the appropriate values.

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
    RoleDefinitionName = 'Contributor';
    Scope = "<resourceGroupId>"
}

New-AzRoleAssignment @roleAssignmentSplat
```

Replace `<Password>`, `<servicePrincipalName>`, and `<resourceGroupId>` with the appropriate value.

---

### <span id="service-principal-certificate"/> Option 2: Create an Azure service principal with a certificate

# [Azure CLI](#tab/azure-cli)
```azurecli
az ad sp create-for-rbac --name <servicePrincipal> --create-cert --role Contributor --scope <resourceGroupId>
```

Replace `<servicePrincipalName>` and `<resourceGroupId>` with the appropriate values.

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
```

Replace `<pftPassword>` and `<servicePrincipalName>` with the appropriate value.

---

## 3. Authenticate to Azure with a service principal

By using the `DefaultAzureCredential`, you can avoid writing environment-specific code to authenticate to Azure.

Use the `DefaultAzureCredential` to configure your service principal credentials by defining environment variables.

Choosing one of the following options to configure your service principal credentials:

* [Option 1: Authenticate with a secret](#authenticate-with-a-secret)
* [Option 2: Authenticate with a certificate](#authenticate-with-a-certificate)

To learn more about the `DefaultAzureCredential`, check out [Azure authentication with the Azure SDK for Go](/azure/developer/go/azure-sdk-authentication)

### <span id="authenticate-with-a-secret"/> Option 1: Authenticate with a secret

Define the following environment variables:

|Variable name|Value
|-|-
|`AZURE_CLIENT_ID`|Application Id of an Azure service principal
|`AZURE_TENANT_ID`|Id of the application's Azure AD tenant
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

### <span id="authenticate-with-a-certificate"/> Option 2: Authenticate with a certificate

|Variable name|Value
|-|-
|`AZURE_CLIENT_ID`|Application Id of an Azure service principal
|`AZURE_TENANT_ID`|ID of the application's Azure AD tenant
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

### Use DefaultAzureCredential to authenticate ResourceClient

Use the `NewDefaultAzureCredential` function of the Azure Identity module to authenticate a ResourceClient.

```go
// The default credential checks environment variables for configuration.
cred, err := azidentity.NewDefaultAzureCredential(nil)
if err != nil {
  // handle error
}

// Azure SDK Azure Resource Management clients accept the credential as a parameter
client := armresources.NewResourcesClient(armcore.NewDefaultConnection(cred, nil), "<subscriptionId>")
```

Replace `<subscriptionId>` with the subscription ID of the subscription you want to authenticate with.

**Key points**:

- You can authenticate a service principal without using environment variables. To learn more, check out [Authenticating a service principal with a client secret](https://github.com/Azure/azure-sdk-for-go/wiki/Azure-Identity-Examples#authenticating-a-service-principal-with-a-client-secret) or [Authenticating a service principal with a client certificate](https://github.com/Azure/azure-sdk-for-go/wiki/Azure-Identity-Examples#authenticating-a-service-principal-with-a-client-certificate).

## 4. Create a resource group tag (sample)

Use the following code sample to verify that your service principal authenticates to Azure and has the appropriate permissions to the resource group.

1. Create a file named `main.go` and add the following code:

	```go
	package main

	// Import key modules.
	import (
	"context"
		"log"

		"github.com/Azure/azure-sdk-for-go/sdk/armcore"
		"github.com/Azure/azure-sdk-for-go/sdk/azcore"
		"github.com/Azure/azure-sdk-for-go/sdk/azidentity"
		"github.com/Azure/azure-sdk-for-go/sdk/resources/armresources"
	)

	// Define key global variables.
	var (
		ctx               = context.Background()
		subscriptionId    = "<subscriptionId>"
		resourceGroupName = "go-on-azure" // !! IMPORTANT: Change this to a unique name in your subscription.
	)

	func addResourceGroupTag(ctx, connection *armcore.Connection) (armresources.ResourceGroupResponse, error) {
		rgClient := armresources.NewResourceGroupsClient(connection, subscriptionId)

		update := armresources.ResourceGroupPatchable{
			Tags: map[string]*string{
				"new": to.StringPtr("tag"),
			},
		}
		return rgClient.Update(ctx, resourceGroupName, update, nil)
	}

	// Define the standard 'main' function for an app that is called from the command line.
	func main() {

		// Create a credentials object.
		cred, err := azidentity.NewDefaultAzureCredential(nil)
		if err != nil {
			log.Fatalf("Authentication failure: %+v", err)
		}

		// Establish a connection with the Azure subscription.
		conn := armcore.NewDefaultConnection(cred, &armcore.ConnectionOptions{
			Logging: azcore.LogOptions{
				IncludeBody: true,
			},
		})

		// Call your function to add a tag to your new resource group.
		updatedRG, err := addResourceGroupTag(ctx, conn)
		if err != nil {
			log.Fatalf("Update of resource group failed: %+v", err)
		}
		log.Printf("Resource Group %s updated", *updatedRG.ResourceGroup.ID)

	}
	```

	Replace `<subscriptionId>` with the subscription ID of the subscription you want to authenticate with.

2. Apply the new tag to the resource group.

	```bash
	go run main.go
	```

3. Verify the tag was added:

	# [Azure CLI](#tab/azure-cli)
	```azurecli-interactive
	az group show --resource-group go-on-azure --query 'tags'
	```

	# [PowerShell](#tab/powershell)

	```powershell-interactive
	(Get-AzResourceGroup -Name go-on-azure).Tags
	```

	---

## Next steps

> [!div class="nextstepaction"]
> [Learn more about using the Azure SDK for Go](/azure/go)
