---
title: Authenticate Go apps to Azure services during local development using service principals
description: This article describes how to authenticate your application to Azure services when using the Azure SDK for Go during local development using dedicated application service principals.
ms.date: 10/06/2025
ms.topic: how-to
ms.custom:
  - devx-track-go
  - devx-track-azurecli
  - sfi-image-nochange
---

# Authenticate Go apps to Azure services during local development using service principals

During local development, applications need to authenticate to Azure to access various Azure services. Two common approaches for local authentication are to [use a developer account](local-development-dev-accounts.md) or a service principal. This article explains how to use an application service principal. In the sections ahead, you learn:

- How to register an application with Microsoft Entra to create a service principal
- How to use Microsoft Entra groups to efficiently manage permissions
- How to assign roles to scope permissions
- How to authenticate using a service principal from your app code

Using dedicated application service principals allows you to adhere to the principle of least privilege when accessing Azure resources. Permissions are limited to the specific requirements of the app during development, preventing accidental access to Azure resources intended for other apps or services. This approach also helps avoid issues when the app is moved to production by ensuring it isn't over-privileged in the development environment.

:::image type="content" source="../media/mermaidjs/local-service-principal-authentication.svg" alt-text="A diagram showing how a local Go app uses a service principal to connect to Azure resources.":::

When the app is registered in Azure, an application service principal is created. For local development:

- Create a separate app registration for each developer working on the app to ensure each developer has their own application service principal, avoiding the need to share credentials.
- Create a separate app registration for each app to limit the app's permissions to only what is necessary.

During local development, environment variables are set with the application service principal's identity. The Azure Identity library reads these environment variables to authenticate the app to the required Azure resources.


[!INCLUDE [create-app-registration](/dotnet/azure/sdk/includes/auth-create-app-registration.md)]

[!INCLUDE [create-entra-group](/dotnet/azure/sdk/includes/auth-create-entra-group.md)]

[!INCLUDE [auth-assign-group-roles](/dotnet/azure/sdk/includes/auth-assign-group-roles.md)]


## Set the app environment variables

The [`DefaultAzureCredential`](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/azidentity#DefaultAzureCredential) object will look for the service principal information in a set of environment variables at runtime. Since most developers work on multiple applications, it's recommended to use a package like `godotenv` to access environment from a `.env` file stored in the application's directory during development. This scopes the environment variables used to authenticate the application to Azure such that they can only be used by this application.

The `.env` file is never checked into source control since it contains the application secret key for Azure. The standard [.gitignore](https://github.com/github/gitignore/blob/main/Go.gitignore) file for Go automatically excludes the `.env` file from check-in.

To use the godotenv package, first install the package in your application.

```terminal
go get github.com/joho/godotenv
```

Then, create a `.env` file in your application root directory. Set the environment variable values with values obtained from the app registration process as follows:

- `AZURE_CLIENT_ID` &rarr; The app ID value.
- `AZURE_TENANT_ID` &rarr; The tenant ID value.
- `AZURE_CLIENT_SECRET` &rarr; The password/credential generated for the app.

```bash
AZURE_CLIENT_ID=00001111-aaaa-2222-bbbb-3333cccc4444
AZURE_TENANT_ID=aaaabbbb-0000-cccc-1111-dddd2222eeee
AZURE_CLIENT_SECRET=Ee5Ff~6Gg7.-Hh8Ii9Jj0Kk1Ll2Mm3_Nn4Oo5Pp6
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

## Implement DefaultAzureCredential in your application

To authenticate Azure SDK client objects to Azure, your application should use the `DefaultAzureCredential` class from the `azidentity` package. In this scenario, `DefaultAzureCredential` will detect the environment variables `AZURE_CLIENT_ID`, `AZURE_TENANT_ID`,  and `AZURE_CLIENT_SECRET` are set and read those variables to get the application service principal information to connect to Azure with.

First, add the [`azidentity`](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/azidentity) package to your application.

```console
go get github.com/Azure/azure-sdk-for-go/sdk/azidentity
```

Next, for any Go code that creates an Azure SDK client object in your app, you'll want to:

1. Import the `azidentity` package.
1. Create an instance of `DefaultAzureCredential` type.
1. Pass the instance of `DefaultAzureCredential` type to the Azure SDK client constructor.

An example of this is shown in the following code segment.

```go
import (
	"context"

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
	cred, err := azidentity.NewDefaultAzureCredential(nil)
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
