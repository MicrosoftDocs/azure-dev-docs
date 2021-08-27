---
title: Azure SDK for Go authentication with a service principal
description: In this tutorial, you'll use the Azure SDK for Go to authenticate to Azure with an Azure service principal using a secret or a certificate.
ms.date: 08/21/2021
ms.topic: how-to
ms.custom: devx-track-go
---

# Azure SDK for Go authentication with a service principal

In this tutorial, you'll use the Azure SDK for Go to authenticate to Azure with an Azure service principal using either a secret or a certificate.

The [Azure Identity](https://github.com/Azure/azure-sdk-for-go/tree/main/sdk/azidentity) module for Go has two credential types that support the use of an Azure service principal for authentication; ClientSecretCredential, and CertificateCredential. You can use either of these credential types to authenticate to Azure or the DefaultAzureCredential which is a chained credential that uses the ClientSecretCredential and CertificateCredential.

By the end of this tutorial you'll have created an Azure service principal and authenticated to Azure with Azure SDK for Go using the authentication method of your choice.

## Prerequisites

[!INCLUDE [azure-subscription.md](includes/azure-subscription.md)]
- **Go installed**: Version 1.13 or [above](https://golang.org/dl/)

## 1. Create an Azure resource group

Before you begin, create a new resource group in Azure.

# [Azure CLI](#tab/azure-cli)
```azurecli
az group create --name go-on-azure --location eastus
```

Take note the `Id` from the output, you'll use it for the scope of the service account.

# [PowerShell](#tab/powershell)

```powershell
New-AzResourceGroup -Name go-on-azure -location eastus
```

Take note the `ResourceId` from the output, you'll use it for the scope of the service account.

---

## 2. Create an Azure service principal

Azure service principals defines the access policy and permissions for your applications in Azure AD and you authenticate the service principal with either a secret or a certificate.

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

```output
{
  "appId": "*****************",
  "displayName": "servicePrincipalName",
  "name": "http://servicePrincipalName",
  "password": "*****************",
  "tenant": "*****************"
}
```

You'll find the secret for service principal listed in the output as `password`.

Make sure you copy this value - it can't be retrieved. If you forget the password, [reset the service principal credentials](/cli/azure/create-an-azure-service-principal-azure-cli#reset-credentials).

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

```output
ServicePrincipalNames : {****************, http://servicePrincipalName}
ApplicationId         : *****************
ObjectType            : ServicePrincipal
DisplayName           : servicePrincipalName
Id                    : ****************
Type                  : 
```

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

## Authenticate with Azure



* [Option 1: Authenticate with DefaultAzureCredential](#DefaultAzureCredential)
* [Option 2: Authenticate with ClientSecretCredential](#managed-identity)
* [Option 3: Authenticate with CertificateCredential](#azureCLI)

### <span id="DefaultAzureCredential"/> Option 1: Authenticate with DefaultAzureCredential

|Variable name|Value
|-|-
|`AZURE_CLIENT_ID`|ID of an Azure AD application
|`AZURE_TENANT_ID`|ID of the application's Azure AD tenant
|`AZURE_CLIENT_SECRET`|One of the application's client secrets

# [Bash](#tab/bash)

```bash
export AZURE_SUBSCRIPTION_ID="<azure_subscription_id>"
export AZURE_TENANT_ID="<active_directory_tenant_id"
export AZURE_CLIENT_ID="<service_principal_appid>"
export AZURE_CLIENT_SECRET="<service_principal_password>"
```

# [PowerShell](#tab/powershell)

```powershell
$env:AZURE_SUBSCRIPTION_ID="<azure_subscription_id>"
$env:AZURE_TENANT_ID="<active_directory_tenant_id"
$env:AZURE_CLIENT_ID="<service_principal_appid>"
$env:AZURE_CLIENT_SECRET="<service_principal_password>"
```

---

#### Service principal with certificate

|Variable name|Value
|-|-
|`AZURE_CLIENT_ID`|ID of an Azure AD application
|`AZURE_TENANT_ID`|ID of the application's Azure AD tenant
|`AZURE_CLIENT_CERTIFICATE_PATH`|Path to a PEM-encoded certificate file including private key (without password protection)

# [Bash](#tab/bash)

```bash
export AZURE_SUBSCRIPTION_ID="<azure_subscription_id>"
export AZURE_TENANT_ID="<active_directory_tenant_id"
export AZURE_CLIENT_ID="<service_principal_appid>"
export AZURE_CLIENT_CERTIFICATE_PATH="<azure_client_certificate_path>"
```

# [PowerShell](#tab/powershell)

```powershell
$env:AZURE_SUBSCRIPTION_ID="<azure_subscription_id>"
$env:AZURE_TENANT_ID="<active_directory_tenant_id"
$env:AZURE_CLIENT_ID="<service_principal_appid>"
$env:AZURE_CLIENT_CERTIFICATE_PATH="<azure_client_certificate_path>"
```

---



## Authenticate a service principal within stored variables