---
title: Authenticate Azure-hosted Go apps to Azure resources using a user-assigned managed identity
description: Learn how to authenticate Azure-hosted Go apps to other Azure services using a user-assigned managed identity.
ms.topic: how-to
ms.custom: devx-track-go, engagement-fy23, devx-track-azurecli
ms.date: 12/04/2025
---

# Authenticate Azure-hosted Go apps to Azure resources using a user-assigned managed identity

The recommended approach to authenticate an Azure-hosted app to other Azure resources is to use a [managed identity](/entra/identity/managed-identities-azure-resources/overview). This approach is [supported for most Azure services](/entra/identity/managed-identities-azure-resources/managed-identities-status), including apps hosted on Azure App Service, Azure Container Apps, and Azure Virtual Machines. Discover more about different authentication techniques and approaches on the [authentication overview](authentication-overview.md) page. In the sections ahead, you'll learn:

- Essential managed identity concepts
- How to create a user-assigned managed identity for your app
- How to assign roles to the user-assigned managed identity
- How to authenticate using the user-assigned managed identity from your app code

[!INCLUDE [Managed identity concepts](../../../includes/authentication/managed-identity-concepts.md)]

The following sections describe the steps to enable and use a user-assigned managed identity for an Azure-hosted app. If you need to use a system-assigned managed identity, visit the [system-assigned managed identities](system-assigned-managed-identity.md) article for more information.

[!INCLUDE [Language agnostic user assigned procedures](<../../../includes/authentication/user-assigned-managed-identity.md>)]

[!INCLUDE [Go implement-managed-identity-concepts](../includes/implement-managed-identity-concepts.md)]

## Implement the code

Add the [azidentity](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/azidentity) module.

In a terminal of your choice, navigate to the application project directory and run the following commands:

```console
go get github.com/Azure/azure-sdk-for-go/sdk/azidentity
```


Azure services are accessed using specialized clients from the various Azure SDK client libraries. For any Go code that instantiates an Azure SDK client in your app, you need to:

1. Import the `azidentity` package.
1. Create an instance of `DefaultAzureCredential` type.
1. Pass the instance of `DefaultAzureCredential` type to the Azure SDK client constructor.
1. Set the environment variable `AZURE_CLIENT_ID` to the client ID of your user-assigned identity
1. Set the `AZURE_TOKEN_CREDENTIAL` environment variable to `ManagedIdentityCredential` to ensure that `DefaultAzureCredential` uses the managed identity credential. This practice makes authentication more predictable and easier to debug when deployed to Azure. For more information, see [Use a specific credential](credential-chains.md#use-a-specific-credential). 

An example of these steps is shown in the following code segment with an Azure Storage Blob client.

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

As discussed in the [Azure SDK for Go authentication overview](./authentication-overview.md) article, `DefaultAzureCredential` supports multiple authentication methods and determines the authentication method being used at runtime. The benefit of this approach is that your app can use different authentication methods in different environments without implementing environment-specific code. When the preceding code is run on your workstation during local development, `DefaultAzureCredential` uses either an application service principal, as determined by environment settings, or developer tool credentials to authenticate with other Azure resources. Thus, the same code can be used to authenticate your app to Azure resources during both local development and when deployed to Azure.

> [!IMPORTANT]
> `DefaultAzureCredential` simplifies authentication while developing applications that deploy to Azure by combining credentials used in Azure hosting environments and credentials used in local development. In production, it's better to use a specific credential type so authentication is more predictable and easier to debug.


An alternative to `DefaultAzureCredential` is to use [`ManagedIdentityCredential`](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/azidentity#ManagedIdentityCredential). The steps for using `ManagedIdentityCredential` are the same as for using the `DefaultAzureCredential` type.

An example of these steps is shown in the following code segment with an Azure Storage Blob client.

```go
import (
	"context"

	"github.com/Azure/azure-sdk-for-go/sdk/azidentity"
	"github.com/Azure/azure-sdk-for-go/sdk/storage/azblob"
)

const (
	// Replace placeholder text with your storage account name
	account       = "https://<replace_with_your_storage_account_name>.blob.core.windows.net/"
	containerName = "sample-container"
	blobName      = "sample-blob"
	sampleFile    = "path/to/sample/file"
)

func main() {
	// create a credential
	clientID := azidentity.ClientID("abcd1234-...")
	opts := azidentity.ManagedIdentityCredentialOptions{ID: clientID}
	cred, err := azidentity.NewManagedIdentityCredential(&opts)
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
