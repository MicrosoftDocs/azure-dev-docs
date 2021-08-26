---
title: Azure SDK for Go authentication with a service principal
description: In this tutorial, you'll use the Azure SDK for Go to authenticate to Azure with an Azure service principal using a secret or a certificate.
ms.date: 08/21/2021
ms.topic: how-to
ms.custom: devx-track-go
---

# Azure SDK for Go authentication with a service principal

In this tutorial, you'll use the Azure SDK for Go to authenticate to Azure with an Azure service principal using either a secret or a certificate.

The [Azure Identity](https://github.com/Azure/azure-sdk-for-go/tree/main/sdk/azidentity) module for Go has four credential types that support the use of an Azure service principal for authentication are; DefaultAzureCredential, EnvironmentCredential, ClientSecretCredential, and CertificateCredential.

By the end of this tutorial you'll have created an Azure service principal and authenticated to Azure using the various credential types for the Azure SDK for Go.

## Prerequisites

[!INCLUDE [azure-subscription.md](includes/azure-subscription.md)]
- **Go installed**: Version 1.13 or [above](https://golang.org/dl/)

## 1. Create an Azure service principal

Azure service principals defines the access policy and permissions for your applications in Azure AD and you authenticate the service principal with either a secret or a certificate.

Use one of the following techniques to create an Azure service principal:

* [Option 1: Create an Azure service principal with a secret](#service-principal-secret)
* [Option 2: Create an Azure service principal with a certificate](#service-principal-certificate)

To learn more Azure service principals, see [Service principal object](/azure/active-directory/develop/app-objects-and-service-principals#service-principal-object).

### <span id="service-principal-secret"/> Option 1: Create an Azure service principal with a secret

Run the following commands to create an Azure service principal.

# [Azure CLI](#tab/azure-cli)
```azurecli
az ad sp create-for-rbac --name <servicePrincipalName>
```

Replace `<servicePrincipalName>` with the name of your service principal.

```output
{
  "appId": "*****************",
  "displayName": "servicePrincipalName",
  "name": "http://servicePrincipalName",
  "password": "*****************",
  "tenant": "*****************"
}
```

The output includes the generated service principal `password`.

Make sure you copy this value - it can't be retrieved. If you forget the password, [reset the service principal credentials](/cli/azure/create-an-azure-service-principal-azure-cli#reset-credentials).

# [PowerShell](#tab/powershell)

```powershell
$password = '<Password>'

$credentials = New-Object Microsoft.Azure.Commands.ActiveDirectory.PSADPasswordCredential `
-Property @{ StartDate=Get-Date; EndDate=Get-Date -Year 2024; Password=$password}

$spSplat = @{
    DisplayName = '<servicePrincipalName>'
    PasswordCredential = $credentials
}

New-AzAdServicePrincipal @spSplat
```

Replace `<Password>` and `<servicePrincipalName>` with the appropriate value.

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
az ad sp create-for-rbac --name <ServicePrincipalName> --create-cert
```

Replace `<servicePrincipalName>` with the name of your service principal.

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

$pftPwd = ConvertTo-SecureString -String "<password>" -Force -AsPlainText

$cert | Export-PfxCertificate -FilePath "<servicePrincipal>.pfx" -Password $pftPwd
```

Replace `<Password>` and `<servicePrincipalName>` with the appropriate value.

---

## Authenticate a service principal with a secret


## Authenticate a service principal with a certificate