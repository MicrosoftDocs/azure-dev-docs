---
title: Azure authentication with the Azure SDK for Go
description: In this article, you learn how to authenticate to the Azure SDK with Go.
ms.date: 08/16/2021
ms.topic: how-to
ms.custom: devx-track-go
---

# Azure authentication with the Go SDK

In this how-to, you will use the Azure SDK's Go module [azidentity](https://github.com/Azure/azure-sdk-for-go/tree/main/sdk/azidentity) to authenticate to Azure.

## Prerequisites

[!INCLUDE [azure-subscription.md](includes/azure-subscription.md)]
- [Go](https://golang.org/dl/) 1.13 or above

## 1. Install the Azure Identity Go module

The Azure Identity module (`azidentity`) is used to authenticate to Azure.

Run the following `go get` command to download the `azidentity` module:

```bash
go get -u github.com/Azure/azure-sdk-for-go/sdk/azidentity
```

## 2. Authenticating with Azure

Azure's Go SDK identity module offers a variety of credential types that focus on OAuth with Azure Active Directory (AAD).

The `DefaultAzureCredential` type simplifies authentication by combining commonly used credentials types. It chains together types used to authenticate deployed Azure applications with credentials used to authenticate in a development environment.

![Copy the Azure AD Object ID.](./media\azure-sdk-authentication/default-azure-credential-workflow.png)

Use the `DefaultAzureCredential` to authenticate to Azure with one of the following techniques:

* [Option 1: Define environment variables](#environment-variables)
* [Option 2: Use a managed identity](#managed-identity)
* [Option 3: Sign in with AzureCLI](#azureCLI)

 To learn more about the different credential types, see [credential types](/azure/developer/go/azure-sdk-authorization).

### <span id="environment-variables"/> Option 1: Define environment variables

The `DefaultAzureCredential` uses the `EnvironmentCredential` type to configure authentication using environment variables that supports three authentication types.

Choose from the following authentication types and define the appropriate environment variables.

#### Service principal with a secret
|variable name|value
|-|-
|`AZURE_CLIENT_ID`|id of an Azure Active Directory application
|`AZURE_TENANT_ID`|id of the application's Azure Active Directory tenant
|`AZURE_CLIENT_SECRET`|one of the application's client secrets

# [Bash](#tab/bash)
```bash
export ARM_SUBSCRIPTION_ID="<azure_subscription_id>"
export ARM_TENANT_ID="<active_directory_tenant_id"
export ARM_CLIENT_ID="<service_principal_appid>"
export ARM_CLIENT_SECRET="<service_principal_password>"
```

# [PowerShell](#tab/powershell)

```powershell
$env:ARM_SUBSCRIPTION_ID="<azure_subscription_id>"
$env:ARM_TENANT_ID="<active_directory_tenant_id"
$env:ARM_CLIENT_ID="<service_principal_appid>"
$env:ARM_CLIENT_SECRET="<service_principal_password>"
```

---

#### Service principal with certificate
|variable name|value
|-|-
|`AZURE_CLIENT_ID`|id of an Azure Active Directory application
|`AZURE_TENANT_ID`|id of the application's Azure Active Directory tenant
|`AZURE_CLIENT_CERTIFICATE_PATH`|path to a PEM-encoded certificate file including private key (without password protection)

# [Bash](#tab/bash)
```bash
export ARM_SUBSCRIPTION_ID="<azure_subscription_id>"
export ARM_TENANT_ID="<active_directory_tenant_id"
export ARM_CLIENT_ID="<service_principal_appid>"
export AZURE_CLIENT_CERTIFICATE_PATH="<azure_client_certificate_path>"
```

# [PowerShell](#tab/powershell)

```powershell
$env:ARM_SUBSCRIPTION_ID="<azure_subscription_id>"
$env:ARM_TENANT_ID="<active_directory_tenant_id"
$env:ARM_CLIENT_ID="<service_principal_appid>"
$env:AZURE_CLIENT_CERTIFICATE_PATH="<azure_client_certificate_path>"
```

---

#### Username and password
|variable name|value
|-|-
|`AZURE_CLIENT_ID`|id of an Azure Active Directory application
|`AZURE_USERNAME`|a username (usually an email address)
|`AZURE_PASSWORD`|that user's password

# [Bash](#tab/bash)
```bash
export AZURE_CLIENT_ID="<service_principal_appid>"
export AZURE_USERNAME="<azure_username"
export AZURE_PASSWORD="<azure_user_password>"
```

# [PowerShell](#tab/powershell)

```powershell
$env:AZURE_CLIENT_ID="<service_principal_appid>"
$env:AZURE_USERNAME="<azure_username"
$env:AZURE_PASSWORD="<azure_user_password>"
```

---

**Key points**:
* Configuration is attempted in the above order. For example, if values for a client secret and certificate are both present, the client secret will be used.

### <span id="managed-identity"/> Option 2: Use a Managed Identity

Managed identities eliminate the need for developers to manage credentials. By connecting to resources that support Azure Active Directory (Azure AD) authentication application can use Azure AD tokens instead of credentials.

If the required environment variables for the `EnvironmentCredential` credential type aren't present, the `DefaultAzureCredential` will attempt to authenticate using the `ManagedIdentityCredential` type.

Run the following command to set the `AZURE_CLIENT_ID` environment variable.

# [Bash](#tab/bash)

```bash
export AZURE_CLIENT_ID="<service_principal_appid>"
```

# [PowerShell](#tab/powershell)

```powershell
$env:AZURE_CLIENT_ID="<service_principal_appid>"
```

<!-- TODO: Add link to new Azure Go SDK authentication with a service principal article -->
To learn more about using managed identities, check out [Azure Go SDK authentication with a service principal]().

---

**Key points**:
* The `DefaultAzureCredential` uses the user assigned managed identity assigned through an environment variable called AZURE_CLIENT_ID.

### <span id="azureCLI"/> Option 3: Sign in with AzureCLI

To support local development, the `DefaultAzureCredential` can authenticate as the user signed into Azure CLI.

Run the following command to sign into the Azure CLI.

```bash
az login
```

**Key points**:
- The `azidentity` module supports authenticating through developer tools to simplify local development. Azure CLI authentication is not recommended for applications running in Azure.

## 3. Use DefaultAzureCredential to authenticate ResourceClient

Create a new sample Go module named `azure-auth` to test authenticating to Azure with the `DefaultAzureCredential`

1. Create a directory to test and run the sample Go code, then change into that directory.

1. Run [go mod init](https://golang.org/ref/mod#go-mod-init) to create a module.

    ```bash
    go mod init azure-auth
    ```

1. Run [go get](https://golang.org/ref/mod#go-get) to download, build, and install the necessary Azure SDK for Go modules.

    ```bash
    go get github.com/Azure/azure-sdk-for-go/sdk/armcore
    go get github.com/Azure/azure-sdk-for-go/sdk/azidentity
    go get github.com/Azure/azure-sdk-for-go/sdk/resources/armresources
    ```

1. Create a file named `main.go` and insert the following code.

    ```go
    package main

    // Import key modules.
    import (
      "context"
      "log"

      "github.com/Azure/azure-sdk-for-go/sdk/armcore"
      "github.com/Azure/azure-sdk-for-go/sdk/azidentity"
      "github.com/Azure/azure-sdk-for-go/sdk/resources/armresources"
    )

    // Define key global variables.
    var (
      subscriptionId    = "<subscriptionId>"
    )

    // Define the function to create a resource group.

    func main() {
      // The default credential checks environment variables for configuration.
      cred, err := azidentity.NewDefaultAzureCredential(nil)
      if err != nil {
        log.Fatalf("Authentication failure: %+v", err)
      }

      // Azure SDK Azure Resource Management clients accept the credential as a parameter
      client := armresources.NewResourcesClient(armcore.NewDefaultConnection(cred, nil), subscriptionId)

      log.Printf("Authenticated to subscription", client)
    }
    ```

    Replace `<subscriptionId>` with your subscription Id.

1. Run [`go run`](https://pkg.go.dev/cmd/go/internal/run) to build and run the app.

    ```bash
    go run .
    ```

## Authenticate to Azure with DefaultAzureCredential

Use the following code in your applications to authenticate to Azure with the Azure identity Go module using the `DefaultAzureCredential` credential type.

```go
// The default credential checks environment variables for configuration.
cred, err := azidentity.NewDefaultAzureCredential(nil)
if err != nil {
  // handle error
}

// Azure SDK Azure Resource Management clients accept the credential as a parameter
client := armresources.NewResourcesClient(armcore.NewDefaultConnection(cred, nil), "<subscription ID>")
```

<!-- TODO: Uncomment after manage resource groups with GO sdk is merged -->
<!-- [!INCLUDE [troubleshooting.md](includes/troubleshooting.md)] -->

## Next steps

> [!div class="nextstepaction"]
> [Learn more about using the Azure SDK for Go](/azure/go)
