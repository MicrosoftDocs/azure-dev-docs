---
title: Azure authentication with the Azure Identity module for Go
description: Learn to use the Azure Identity module for Go to authenticate to Azure.
ms.date: 05/17/2024
ms.topic: how-to
ms.custom: devx-track-go
---

# Azure authentication with the Azure Identity module for Go

In this tutorial, the [DefaultAzureCredential](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/azidentity#DefaultAzureCredential) type from the Azure Identity module for Go is used to authenticate to Azure. The Azure Identity module offers several credential types that focus on OAuth with Microsoft Entra ID.

`DefaultAzureCredential` simplifies authentication by combining commonly used credential types. It chains credential types used to authenticate Azure-deployed applications with credential types used to authenticate in a development environment.

## Prerequisites

[!INCLUDE [azure-subscription.md](includes/azure-subscription.md)]
- **Go installed**: Version 1.18 or [above](https://go.dev/dl/)

## 1. Install the Azure Identity module for Go

Run the following command to download the [azidentity](https://github.com/Azure/azure-sdk-for-go/tree/main/sdk/azidentity) module:

```bash
go get -u github.com/Azure/azure-sdk-for-go/sdk/azidentity
```

## 2. Authenticate with Azure

Use `DefaultAzureCredential` to authenticate to Azure with one of the following techniques:

- [Option 1: Define environment variables](#option-1-define-environment-variables)
- [Option 2: Use workload identity](#option-2-use-workload-identity)
- [Option 3: Use a managed identity](#option-3-use-a-managed-identity)
- [Option 4: Sign in with Azure CLI](#option-4-sign-in-with-azure-cli)
- [Option 5: Sign in with Azure Developer CLI](#option-5-sign-in-with-azure-developer-cli)

To learn more about the different credential types, see [credential types](./azure-sdk-authorization.md).

### Option 1: Define environment variables

The `DefaultAzureCredential` uses the `EnvironmentCredential` type to configure authentication using environment variables that supports three authentication types. Choose from the following authentication types and define the appropriate environment variables.

#### Service principal with a secret

|Variable name|Value
|-|-
|`AZURE_CLIENT_ID`|Application ID of an Azure service principal
|`AZURE_TENANT_ID`|ID of the application's Microsoft Entra tenant
|`AZURE_CLIENT_SECRET`|Password of the Azure service principal

# [Bash](#tab/bash)

```bash
export AZURE_TENANT_ID="<active_directory_tenant_id>"
export AZURE_CLIENT_ID="<service_principal_appid>"
export AZURE_CLIENT_SECRET="<service_principal_password>"
```

# [PowerShell](#tab/powershell)

```powershell
$env:AZURE_TENANT_ID="<active_directory_tenant_id>"
$env:AZURE_CLIENT_ID="<service_principal_appid>"
$env:AZURE_CLIENT_SECRET="<service_principal_password>"
```

---

#### Service principal with certificate

|Variable name|Value
|-|-
|`AZURE_CLIENT_ID`|ID of a Microsoft Entra application
|`AZURE_TENANT_ID`|ID of the application's Microsoft Entra tenant
|`AZURE_CLIENT_CERTIFICATE_PATH`|Path to a PEM or PKCS12 certificate file including private key
|`AZURE_CLIENT_CERTIFICATE_PASSWORD`|(optional) Password for the certificate file

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
|`AZURE_CLIENT_ID`|ID of a Microsoft Entra application
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

Configuration is attempted in the preceding order. For example, if values for a client secret and certificate are both present, the client secret is used. For an end-to-end tutorial about authenticating with service principals, see [Azure SDK for Go authentication with a service principal](./azure-sdk-authentication-service-principal.md).

### Option 2: Use Workload Identity

[Microsoft Entra Workload ID](/azure/aks/workload-identity-overview) enables pods in a Kubernetes cluster to use a Kubernetes identity (service account). A Kubernetes token is issued, and [OIDC federation](https://kubernetes.io/docs/reference/access-authn-authz/authentication/#openid-connect-tokens) enables Kubernetes applications to access Azure resources securely with Microsoft Entra ID.

If the required environment variables for `EnvironmentCredential` aren't present, `DefaultAzureCredential` attempts to authenticate using [WorkloadIdentityCredential](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/azidentity#WorkloadIdentityCredential). `WorkloadIdentityCredential` attempts to read the service principal configuration from environment variables set by the Workload Identity webhook.

### Option 3: Use a managed identity

[Managed identities](/azure/active-directory/managed-identities-azure-resources/overview) eliminate the need for developers to manage credentials. When connecting to resources that support Microsoft Entra authentication, applications hosted in Azure can use Microsoft Entra tokens instead of credentials. Managed Identities aren't supported in local development.

If the required environment variables for `WorkloadIdentityCredential` aren't present, `DefaultAzureCredential` attempts to authenticate using [ManagedIdentityCredential](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/azidentity#ManagedIdentityCredential).

If using a user-assigned managed identity, run the following command to set the `AZURE_CLIENT_ID` environment variable.

# [Bash](#tab/bash)

```bash
export AZURE_CLIENT_ID="<user_assigned_managed_identity_client_id>"
```

# [PowerShell](#tab/powershell)

```powershell
$env:AZURE_CLIENT_ID="<user_assigned_managed_identity_client_id>"
```

---

If the  `AZURE_CLIENT_ID` environment variable isn't set, `DefaultAzureCredentials` attempts to authenticate using the system-assigned managed identity if one is enabled on the hosting resource.

For an end-to-end tutorial about authenticating with managed identities in Azure-hosted apps, see [Authentication with the Azure SDK for Go using a managed identity](./azure-sdk-authentication-managed-identity.md).

### Option 4: Sign in with Azure CLI

To reduce friction in local development, `DefaultAzureCredential` can authenticate as the user signed into the Azure CLI.

Run the following command to sign into the Azure CLI:

```azurecli
az login
```

### Option 5: Sign in with Azure Developer CLI

In local development, if the user isn't signed in to the Azure CLI, `DefaultAzureCredential` can authenticate as the user signed into the Azure Developer CLI.

Run the following command to sign into the Azure Developer CLI:

```azdeveloper
azd auth login
```

Azure Developer CLI authentication isn't recommended for applications running in Azure.

## 3. Use DefaultAzureCredential to authenticate ResourceClient

Create a new sample Go module named `azure-auth` to test authenticating to Azure with `DefaultAzureCredential`:

1. Create a directory to test and run the sample Go code, then change into that directory.

1. Run [go mod init](https://go.dev/ref/mod#go-mod-init) to create a module:

    ```bash
    go mod init azure-auth
    ```

1. Run [go get](https://go.dev/ref/mod#go-get) to download, build, and install the necessary Azure SDK for Go modules:

    ```bash
    go get "github.com/Azure/azure-sdk-for-go/sdk/azidentity"
    go get "github.com/Azure/azure-sdk-for-go/sdk/resourcemanager/subscription/armsubscription"
    ```

1. Create a file named `main.go` and insert the following code:

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
      // Azure SDK Resource Management clients accept the credential as a parameter.
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

    Replace `<subscription ID>` with your subscription ID.

1. Run [`go run`](https://pkg.go.dev/cmd/go/internal/run) to build and run the application:

    ```bash
    go run .
    ```

    > [!NOTE]
    > To run as-is on your local system, you need to sign in to Azure using the Azure CLI or Azure Developer CLI.

## Authenticate to Azure with DefaultAzureCredential

Use the following code in your application to authenticate to Azure with the Azure Identity module using `DefaultAzureCredential`:

```go
// This credential type checks environment variables for configuration.
cred, err := azidentity.NewDefaultAzureCredential(nil)
if err != nil {
  // handle error
}

// Azure Resource Management clients accept the credential as a parameter
client, err := armresources.NewClient("<subscriptionId>", cred, nil)
if err != nil {
  // handle error
}
```

## Troubleshooting

For guidance on resolving errors from specific credential types, see the [troubleshooting guide](https://github.com/Azure/azure-sdk-for-go/blob/main/sdk/azidentity/TROUBLESHOOTING.md).

## Next steps

> [!div class="nextstepaction"]
> [Learn more about using the Azure SDK for Go](/azure/go)
