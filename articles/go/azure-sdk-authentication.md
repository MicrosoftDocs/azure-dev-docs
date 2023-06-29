---
title: Azure authentication with the Azure SDK for Go
description: In this tutorial, you'll use the Azure SDK for Go to authenticate to Azure with environment variables, a managed identity, or the Azure CLI.
ms.date: 04/20/2022
ms.topic: how-to
ms.custom: devx-track-go, devx-track-azurecli
---

# Azure authentication with the Azure SDK for Go

In this tutorial, you'll use the Default Azure Credential type from the Azure SDK for Go to authenticate to Azure with environment variables, a managed identity, or the Azure CLI.

The Azure Identity module for Go offers several different credential types that focus on OAuth with Azure Active Directory (Azure AD).

The `DefaultAzureCredential` type simplifies authentication by combining commonly used credentials types. It chains together type used to authenticate deployed Azure applications with credentials used to authenticate in a development environment.

![default azure credential workflow](./media\azure-sdk-authentication/default-azure-credential-workflow.png)

## Prerequisites

[!INCLUDE [azure-subscription.md](includes/azure-subscription.md)]
- **Go installed**: Version 1.18 or [above](https://go.dev/dl/)

## 1. Install the Azure Identity module for Go

The Azure Identity module is used to authenticate to Azure.

Run the following command to download the [azidentity](https://github.com/Azure/azure-sdk-for-go/tree/main/sdk/azidentity) module:

```bash
go get -u github.com/Azure/azure-sdk-for-go/sdk/azidentity
```

## 2. Authenticate with Azure

Use the `DefaultAzureCredential` to authenticate to Azure with one of the following techniques:

* [Option 1: Define environment variables](#environment-variables)
* [Option 2: Use a managed identity](#managed-identity)
* [Option 3: Sign in with Azure CLI](#azureCLI)

To learn more about the different credential types, see [credential types](./azure-sdk-authorization.md).

### <span id="environment-variables"/> Option 1: Define environment variables

The `DefaultAzureCredential` uses the `EnvironmentCredential` type to configure authentication using environment variables that supports three authentication types. Choose from the following authentication types and define the appropriate environment variables.

#### Service principal with a secret

|Variable name|Value
|-|-
|`AZURE_CLIENT_ID`|Application ID of an Azure service principal
|`AZURE_TENANT_ID`|ID of the application's Azure AD tenant
|`AZURE_CLIENT_SECRET`|Password of the Azure service principal

# [Bash](#tab/bash)

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

#### Service principal with certificate

|Variable name|Value
|-|-
|`AZURE_CLIENT_ID`|ID of an Azure AD application
|`AZURE_TENANT_ID`|ID of the application's Azure AD tenant
|`AZURE_CLIENT_CERTIFICATE_PATH`|Path to a certificate file including private key (without password protection)

# [Bash](#tab/bash)

```bash
export AZURE_TENANT_ID="<active_directory_tenant_id>"
export AZURE_CLIENT_ID="<service_principal_appid>"
export AZURE_CLIENT_CERTIFICATE_PATH="<azure_client_certificate_path>"
```

# [PowerShell](#tab/powershell)

```powershell
$env:AZURE_TENANT_ID="<active_directory_tenant_id>"
$env:AZURE_CLIENT_ID="<service_principal_appid>"
$env:AZURE_CLIENT_CERTIFICATE_PATH="<azure_client_certificate_path>"
```

---

#### Username and password

|Variable name|Value
|-|-
|`AZURE_CLIENT_ID`|ID of an Azure AD application
|`AZURE_USERNAME`|A username (usually an email address)
|`AZURE_PASSWORD`|That user's password

# [Bash](#tab/bash)

```bash
export AZURE_CLIENT_ID="<service_principal_appid>"
export AZURE_USERNAME="<azure_username>"
export AZURE_PASSWORD="<azure_user_password>"
```

# [PowerShell](#tab/powershell)

```powershell
$env:AZURE_CLIENT_ID="<service_principal_appid>"
$env:AZURE_USERNAME="<azure_username>"
$env:AZURE_PASSWORD="<azure_user_password>"
```

---

Configuration is attempted in the above order. For example, if values for a client secret and certificate are both present, the client secret will be used.

### <span id="managed-identity"/> Option 2: Use a managed identity

[Managed identities](/azure/active-directory/managed-identities-azure-resources/overview) eliminate the need for developers to manage credentials. By connecting to resources that support Azure AD authentication, applications can use Azure AD tokens instead of credentials.

If the required environment variables for the `EnvironmentCredential` credential type aren't present, the `DefaultAzureCredential` will attempt to authenticate using the `ManagedIdentityCredential` type.

If using a user assigned managed identity, run the following command to set the `AZURE_CLIENT_ID` environment variable.

# [Bash](#tab/bash)

```bash
export AZURE_CLIENT_ID="<user_assigned_managed_identity_client_id>"
```

# [PowerShell](#tab/powershell)

```powershell
$env:AZURE_CLIENT_ID="<user_assigned_managed_identity_client_id>"
```

> [!NOTE]
> To use a system assigned managed identity, make sure the `AZURE_CLIENT_ID` is not set.

---

### <span id="azureCLI"/> Option 3: Sign in with Azure CLI

To support local development, the `DefaultAzureCredential` can authenticate as the user signed into the Azure CLI.

Run the following command to sign into the Azure CLI.

```azurecli
az login
```

The `azidentity` module supports authenticating through developer tools to simplify local development. Azure CLI authentication isn't recommended for applications running in Azure.

## 3. Use DefaultAzureCredential to authenticate ResourceClient

Create a new sample Go module named `azure-auth` to test authenticating to Azure with the `DefaultAzureCredential`.

1. Create a directory to test and run the sample Go code, then change into that directory.

1. Run [go mod init](https://go.dev/ref/mod#go-mod-init) to create a module.

    ```bash
    go mod init azure-auth
    ```

1. Run [go get](https://go.dev/ref/mod#go-get) to download, build, and install the necessary Azure SDK for Go modules.

    ```bash
    go get "github.com/Azure/azure-sdk-for-go/sdk/azidentity"
    go get "github.com/Azure/azure-sdk-for-go/sdk/resourcemanager/resources/armresources"
    ```

1. Create a file named `main.go` and insert the following code.

    ```go
    package main

    import (
      "context"

      "github.com/Azure/azure-sdk-for-go/sdk/azidentity"
      "github.com/Azure/azure-sdk-for-go/sdk/resourcemanager/subscription/armsubscription"
    )

    const subscriptionID = "<subscription ID>"

    func main() {
      cred, err := azidentity.NewDefaultAzureCredential(nil)
      if err != nil {
        // TODO: handle error
      }
      // Azure SDK Azure Resource Management clients accept the credential as a parameter.
      // The client will authenticate with the credential as necessary.
      client, err := armsubscription.NewSubscriptionsClient(cred, nil)
      if err != nil {
        // TODO: handle error
      }
      _, err = client.Get(context.TODO(), subscriptionID, nil)
      if err != nil {
        // TODO: handle error
      }
    }   
    ```

    Replace `<subscriptionId>` with your subscription ID.

1. Run [`go run`](https://pkg.go.dev/cmd/go/internal/run) to build and run the app.

    ```bash
    go run .
    ```

## Authenticate to Azure with DefaultAzureCredential

Use the following code in your applications to authenticate to Azure with the Azure Identity Go module using the `DefaultAzureCredential` credential type.

```go
// The default credential checks environment variables for configuration.
cred, err := azidentity.NewDefaultAzureCredential(nil)
if err != nil {
  // handle error
}

// Azure SDK Azure Resource Management clients accept the credential as a parameter
client, err := armresources.NewClient("<subscription ID>", cred, nil)
if err != nil {
  // handle error
}
```

<!-- TODO: Uncomment after manage resource groups with GO sdk is merged -->
<!-- [!INCLUDE [troubleshooting.md](includes/troubleshooting.md)] -->

## Next steps

> [!div class="nextstepaction"]
> [Learn more about using the Azure SDK for Go](/azure/go)
