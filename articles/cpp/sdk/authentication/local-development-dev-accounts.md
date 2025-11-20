---
title: Authenticate C++ apps to Azure services during local development using developer accounts
description: This article describes how to authenticate your application to Azure services when using the Azure SDK for C++ during local development using developer accounts.
ms.date: 11/06/2025
ms.topic: how-to
ms.custom: devx-track-cpp, devx-track-azurecli
ai-usage: ai-assisted
---

# Authenticate C++ apps to Azure services during local development using developer accounts

During local development, applications need to authenticate to Azure to use different Azure services. Authenticate locally using one of these approaches:

- Use a developer account with one of the [developer tools supported by the Azure Identity library](#supported-developer-tools-for-authentication).
- Use a [service principal](local-development-service-principal.md).

This article explains how to authenticate using a developer account with tools supported by the Azure Identity library. In the sections ahead, you learn:

- How to use Microsoft Entra groups to efficiently manage permissions for multiple developer accounts.
- How to assign roles to developer accounts to scope permissions.
- How to sign-in to supported local development tools.
- How to authenticate using a developer account from your app code.

## Supported developer tools for authentication

For an app to authenticate to Azure during local development using the developer's Azure credentials, the developer must be signed-in to Azure using Azure CLI.

The Azure Identity library can detect that the developer is signed-in from the tool. The library can then obtain the Microsoft Entra access token via the tool to authenticate the app to Azure as the signed-in user.

This approach takes advantage of the developer's existing Azure accounts to streamline the authentication process. However, a developer's account likely has more permissions than required by the app, therefore exceeding the permissions the app runs with in production. As an alternative, you can [create application service principals to use during local development](./local-development-service-principal.md), which can be scoped to have only the access needed by the app.

[!INCLUDE [auth-create-entra-group](../../../includes/authentication/includes/auth-create-entra-group.md)]

[!INCLUDE [auth-assign-group-roles](../../../includes/authentication/includes/auth-assign-group-roles.md)]

## Sign-in to Azure using developer tooling

Sign-in to Azure using one of several developer tools that can be used to perform authentication in your development environment. The account you authenticate should also exist in the Microsoft Entra group you created and configured earlier.

### Azure CLI

Developers can use [Azure CLI](/cli/azure/what-is-azure-cli) to authenticate. Apps using [DefaultAzureCredential](https://github.com/Azure/azure-sdk-for-cpp/tree/main/sdk/identity/azure-identity) or [AzureCLICredential](https://github.com/Azure/azure-sdk-for-cpp/tree/main/sdk/identity/azure-identity) can then use this account to authenticate app requests.

To authenticate with the Azure CLI, run the `az login` command. On a system with a default web browser, the Azure CLI launches the browser to authenticate the user.

```azurecli
az login
```

For systems without a default web browser, the `az login` command uses the device code authentication flow. The user can also force the Azure CLI to use the device code flow rather than launching a browser by specifying the `--use-device-code` argument.

```azurecli
az login --use-device-code
```

## Authenticate to Azure services from your app

The [Azure Identity library for C++](https://github.com/Azure/azure-sdk-for-cpp/tree/main/sdk/identity/azure-identity) provides various *credentials* adapted to supporting different scenarios and Microsoft Entra authentication flows. The steps ahead demonstrate how to use `DefaultAzureCredential` when working with service principals locally.

## Implement the code

[DefaultAzureCredential](https://azure.github.io/azure-sdk-for-cpp/identity.html) class is an ordered sequence of mechanisms for authenticating to Microsoft Entra ID. Each authentication mechanism is a class derived from the `TokenCredential` class and is known as a *credential*. This credential is intended to be used at the early stages of development, to allow the developer some time to work with the other aspects of the SDK, and later to replace this credential with the exact credential that is the best fit for the application. It is not intended to be used in a production environment. In this scenario, `DefaultAzureCredential` sequentially checks to see if the developer has signed-in to Azure using the Azure CLI or Azure developer CLI. If the developer is signed-in to Azure using one of these tools, then the credentials used to sign into the tool will be used by the app to authenticate to Azure.

1. Add the [azure-identity-cpp](https://vcpkg.io/en/package/azure-identity-cpp) package to your application using [vcpkg](/vcpkg/).

    ```bash
    vcpkg add port azure-identity-cpp
    ```

1. Add the following in your CMake file:

    ```cmake
    find_package(azure-identity-cpp CONFIG REQUIRED)
    target_link_libraries(<your project name> PRIVATE Azure::azure-identity)
    ```

1. For any C++ code that creates an Azure SDK client object in your app, you'll want to:

    1. Include the `azure/identity.hpp` header.
    1. Create an instance of `DefaultAzureCredential`.
    1. Pass the instance of `DefaultAzureCredential` to the Azure SDK client constructor.

    An example of these steps is shown in the following code segment. The example creates an Azure Storage Blob client using `DefaultAzureCredential` to authenticate to Azure.

    ```cpp
    #include <azure/identity.hpp>
    #include <azure/storage/blobs.hpp>
    #include <iostream>
    #include <memory>

    int main() {
        try {
            // DefaultAzureCredential is intended for early stages of development.
            // For production, replace with the exact credential that is the best fit for the application.
            auto credential = std::make_shared<Azure::Identity::DefaultAzureCredential>();
            
            // Create a client for the specified storage account
            std::string accountUrl = "https://<replace_with_your_storage_account_name>.blob.core.windows.net/";
            Azure::Storage::Blobs::BlobServiceClient blobServiceClient(accountUrl, credential);
            
            // Get a reference to a container
            std::string containerName = "sample-container";
            auto containerClient = blobServiceClient.GetBlobContainerClient(containerName);
            
            // TODO: perform some action with the blob client
            // auto blobClient = containerClient.GetBlobClient("sample-blob");
            // auto downloadResult = blobClient.DownloadTo("path/to/local/file");
            
        } catch (const std::exception& ex) {
            std::cout << "Exception: " << ex.what() << std::endl;
            return 1;
        }
        
        return 0;
    }
    ```
