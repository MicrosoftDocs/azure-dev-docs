---
title: Authenticate Go apps to Azure services during local development using developer accounts
description: This article describes how to authenticate your application to Azure services when using the Azure SDK for Go during local development using developer accounts.
ms.date: 10/06/2025
ms.topic: how-to
ms.custom: devx-track-go, devx-track-azurecli
---

# Authenticate Go apps to Azure services during local development using developer accounts

During local development, applications need to authenticate to Azure to use different Azure services. Authenticate locally using one of these approaches:

- Use a developer account with one of the [developer tools supported by the Azure Identity library](#supported-developer-tools-for-authentication).
- Use a [service principal](local-development-service-principal.md).

This article explains how to authenticate using a developer account with tools supported by the Azure Identity library. In the sections ahead, you learn:

- How to use Microsoft Entra groups to efficiently manage permissions for multiple developer accounts.
- How to assign roles to developer accounts to scope permissions.
- How to sign-in to supported local development tools.
- How to authenticate using a developer account from your app code.

## Supported developer tools for authentication

For an app to authenticate to Azure during local development using the developer's Azure credentials, the developer must be signed-in to Azure from one of the following developer tools:

- Azure CLI
- Azure Developer CLI

The Azure Identity library can detect that the developer is signed-in from one of these tools. The library can then obtain the Microsoft Entra access token via the tool to authenticate the app to Azure as the signed-in user.

This approach takes advantage of the developer's existing Azure accounts to streamline the authentication process. However, a developer's account likely has more permissions than required by the app, therefore exceeding the permissions the app runs with in production. As an alternative, you can [create application service principals to use during local development](./local-development-service-principal.md), which can be scoped to have only the access needed by the app.

[!INCLUDE [auth-create-entra-group](/dotnet/azure/sdk/includes/auth-create-entra-group.md)]

[!INCLUDE [auth-assign-group-roles](/dotnet/azure/sdk/includes/auth-assign-group-roles.md)]

## Sign-in to Azure using developer tooling

Next, sign-in to Azure using one of several developer tools that can be used to perform authentication in your development environment. The account you authenticate should also exist in the Microsoft Entra group you created and configured earlier.

### [Azure CLI](#tab/sign-in-azure-cli)

Developers can use [Azure CLI](/cli/azure/what-is-azure-cli) to authenticate. Apps using [DefaultAzureCredential](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/azidentity#DefaultAzureCredential) or [AzureCLICredential](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/azidentity#AzureCLICredential) can then use this account to authenticate app requests.

To authenticate with the Azure CLI, run the `az login` command. On a system with a default web browser, the Azure CLI launches the browser to authenticate the user.

```azurecli
az login
```

For systems without a default web browser, the `az login` command uses the device code authentication flow. The user can also force the Azure CLI to use the device code flow rather than launching a browser by specifying the `--use-device-code` argument.

```azurecli
az login --use-device-code
```

### [Azure Developer CLI](#tab/sign-in-azure-developer-cli)

Developers can use [Azure Developer CLI](/azure/developer/azure-developer-cli/overview) to authenticate. Apps using [DefaultAzureCredential](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/azidentity#DefaultAzureCredential) or [AzureDeveloperCLICredential](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/azidentity#AzureDeveloperCLICredential) can then use this account to authenticate app requests.

To authenticate with the Azure Developer CLI, run the `azd auth login` command. On a system with a default web browser, the Azure Developer CLI launches the browser to authenticate the user.

```azdeveloper
azd auth login
```

For systems without a default web browser, the `azd auth login --use-device-code` uses the device code authentication flow. The user can also force the Azure Developer CLI to use the device code flow rather than launching a browser by specifying the `--use-device-code` argument.

```azdeveloper
azd auth login --use-device-code
```

---

## Authenticate to azure services from your app

The [azidentity](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/azidentity) package provides various *credentials* adapted to supporting different scenarios and Microsoft Entra authentication flows. The steps ahead demonstrate how to use [DefaultAzureCredential](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/azidentity#DefaultAzureCredential) when working with service principals locally and in production.

## Implement the code

To authenticate Azure SDK client objects to Azure, your application should use the [`DefaultAzureCredential`](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/azidentity#DefaultAzureCredential) class. In this scenario, `DefaultAzureCredential` will sequentially check to see if the developer has signed-in to Azure using the Azure CLI or Azure developer CLI. If the developer is signed-in to Azure using one of these tools, then the credentials used to sign into the tool will be used by the app to authenticate to Azure.

First, add the [`azidentity`](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/azidentity) package to your application.

```console
go get github.com/Azure/azure-sdk-for-go/sdk/azidentity
```

Next, for any Go code that creates an Azure SDK client object in your app, you'll want to:

1. Import the `azidentity` package.
1. Create an instance of `DefaultAzureCredential` type.
1. Pass the instance of `DefaultAzureCredential` type to the Azure SDK client constructor.

An example of these steps is shown in the following code segment.

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
