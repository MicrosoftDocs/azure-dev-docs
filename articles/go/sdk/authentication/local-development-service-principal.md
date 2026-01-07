---
title: Authenticate Go apps to Azure services during local development using service principals
description: This article describes how to authenticate your application to Azure services when using the Azure SDK for Go during local development using dedicated application service principals.
#customer intent: As a Go developer, I want to use the Azure SDK for Go with service principals so that I can authenticate my app during local development using dedicated application service principals.
ms.date: 12/08/2025
ms.topic: how-to
ms.custom:
  - devx-track-go
  - devx-track-azurecli
  - sfi-image-nochange
---

# Authenticate Go apps to Azure services during local development by using service principals

During local development, applications need to authenticate to Azure to access various Azure services. Two common approaches for local authentication are to [use a developer account](local-development-dev-accounts.md) or a service principal. This article explains how to use an application service principal. In the following sections, you learn:

- How to register an application with Microsoft Entra to create a service principal
- How to use Microsoft Entra groups to efficiently manage permissions
- How to assign roles to scope permissions
- How to authenticate using a service principal from your app code

By using dedicated application service principals, you can adhere to the principle of least privilege when accessing Azure resources. Limit permissions to the specific requirements of the app during development, preventing accidental access to Azure resources intended for other apps or services. This approach also helps avoid issues when the app is moved to production by ensuring it isn't over-privileged in the development environment.

:::image type="content" source="../media/mermaidjs/local-service-principal-authentication.svg" alt-text="A diagram showing how a local Go app uses a service principal to connect to Azure resources.":::

When you register the app in Azure, you create an application service principal. For local development:

- Create a separate app registration for each developer working on the app so each developer has their own application service principal and doesn't need to share credentials.
- Create a separate app registration for each app to limit the app's permissions to only what is necessary.

During local development, set environment variables with the application service principal's identity. The Azure Identity library reads these environment variables to authenticate the app to the required Azure resources.


[!INCLUDE [create-app-registration](../../../includes/authentication/authentication-create-app-registration.md)]

[!INCLUDE [create-entra-group](../../../includes/authentication/authentication-create-entra-group.md)]

[!INCLUDE [authentication-assign-group-roles](../../../includes/authentication/authentication-assign-group-roles.md)]

## Set the app environment variables

At runtime, certain credentials from the Azure Identity library, such as [`DefaultAzureCredential`](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/azidentity#DefaultAzureCredential), `EnvironmentCredential`, and `ClientSecretCredential`, search for service principal information by convention in the environment variables. You can configure environment variables in multiple ways depending on your tooling and environment. You can create an `.env` file or use system environment variables to store these credentials locally during development. Since most developers work on multiple applications, use a package like `godotenv` to access environment variables from a `.env` file stored in the application's directory during development. This approach scopes the environment variables used to authenticate the application to Azure so that only this application can use them. Never check the `.env` file into source control since it contains the application secret key for Azure. The standard [.gitignore](https://github.com/github/gitignore/blob/main/Go.gitignore) file for Go automatically excludes the `.env` file from check-in.

To use the `godotenv` package, first install the package in your application.

```bash
go get github.com/joho/godotenv
```

Then, create a `.env` file in your application root directory. Set the environment variable values with values obtained from the app registration process for a service principal:

- `AZURE_CLIENT_ID`: Used to identify the registered app in Azure.
- `AZURE_TENANT_ID`: The ID of the Microsoft Entra tenant.
- `AZURE_CLIENT_SECRET`: The secret credential that was generated for the app.

```env
AZURE_CLIENT_ID=<your-client-id>
AZURE_TENANT_ID=<your-tenant-id>
AZURE_CLIENT_SECRET=<your-client-secret>
```

Finally, in the startup code for your application, use the `godotenv` library to read the environment variables from the `.env` file on startup.

```go
// Imports of fmt, log, and os omitted for brevity 
import "github.com/joho/godotenv"

environment := os.Getenv("ENVIRONMENT")

if environment == "development" {
	fmt.Println("Loading environment variables from .env file")

	// Load the .env file
	err := godotenv.Load(".env")
	if err != nil {
	    log.Fatalf("Error loading .env file: %v", err)
	}
}
```

If you prefer to set the environment variables in your system environment instead of using a `.env` file, you can do so in several ways depending on your operating system and shell. The following examples show how to set the environment variables in different shells:

# [Bash](#tab/bash)

```bash
export AZURE_CLIENT_ID=<your-client-id>
export AZURE_TENANT_ID=<your-tenant-id>
export AZURE_CLIENT_SECRET=<your-client-secret>
```

# [Windows command prompt](#tab/cmd)

You can set environment variables for Windows from the command line. However, all apps running on that operating system can access the values, which could cause conflicts. Use caution with this approach.

```cmd
set AZURE_CLIENT_ID=<your-client-id>
set AZURE_TENANT_ID=<your-tenant-id>
set AZURE_CLIENT_SECRET=<your-client-secret>
```

# [PowerShell](#tab/powershell)

```powershell
$env:AZURE_CLIENT_ID="<your-client-id>"
$env:AZURE_TENANT_ID="<your-tenant-id>"
$env:AZURE_CLIENT_SECRET="<your-client-secret>"
```

---

## Authenticate to Azure services from your app

The Azure Identity library provides different `TokenCredential` implementations for various scenarios and Microsoft Entra authentication flows. Use `EnvironmentCredential` when working with service principals locally and in production. In this scenario, `EnvironmentCredential` reads the environment variables `AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, and `AZURE_CLIENT_SECRET` to get the application service principal information to connect to Azure.

1. Add the [`azidentity`](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/azidentity) package to your application.

    ```bash
    go get github.com/Azure/azure-sdk-for-go/sdk/azidentity
    ```

1. For any Go code that creates an Azure SDK client object in your app, you want to:

    1. Import the `azidentity` package.
    1. Create an `EnvironmentCredential` instance.
    1. Pass the instance to the Azure SDK client constructor.

    The following code segment shows an example:

    ```go
    import (
    	"context"
    	"os"

    	"github.com/Azure/azure-sdk-for-go/sdk/azidentity"
    	"github.com/Azure/azure-sdk-for-go/sdk/storage/azblob"
    )
    
    const (
    	account       = "https://<replace_with_your_storage_account_name>.blob.core.windows.net/"
    	containerName = "sample-container"
    	blobName      = "sample-blob"
    	sampleFile    = "path/to/sample/file"
    )
    
    func main() {
    	// create a credential
    	cred, err := azidentity.NewEnvironmentCredential(nil)
    	if err != nil {
    	  // TODO: handle error
    	}
    
    	// create a client for the specified storage account
    	client, err := azblob.NewClient(account, cred, nil)
    	if err != nil {
    	  // TODO: handle error
    	}
    
    	// TODO: perform some action with the azblob Client
    	// _, err = client.DownloadFile(context.TODO(), <containerName>, <blobName>, <target_file>, <DownloadFileOptions>)
    }
    ```
