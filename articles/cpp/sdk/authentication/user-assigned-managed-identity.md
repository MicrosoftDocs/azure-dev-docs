---
title: Authenticate Azure-hosted C++ apps to Azure resources using a user-assigned managed identity
description: Learn how to authenticate Azure-hosted C++ apps to other Azure services using a user-assigned managed identity.
ms.topic: how-to
ms.custom: devx-track-cpp, engagement-fy23, devx-track-azurecli
ms.date: 11/06/2025
ai-usage: ai-assisted
---

# Authenticate Azure-hosted C++ apps to Azure resources using a user-assigned managed identity

The recommended approach to authenticate an Azure-hosted app to other Azure resources is to use a [managed identity](/entra/identity/managed-identities-azure-resources/overview). This approach is [supported for most Azure services](/entra/identity/managed-identities-azure-resources/managed-identities-status), including apps hosted on Azure App Service, Azure Container Apps, and Azure Virtual Machines. Discover more about different authentication techniques and approaches on the [authentication overview](overview.md) page. In the sections ahead, you'll learn:

- Essential managed identity concepts
- How to create a user-assigned managed identity for your app
- How to assign roles to the user-assigned managed identity
- How to authenticate using the user-assigned managed identity from your app code

[!INCLUDE [Managed identity concepts](../../../includes/authentication/managed-identity-concepts.md)]

The following sections describe the steps to enable and use a user-assigned managed identity for an Azure-hosted app. If you need to use a system-assigned managed identity, visit the [system-assigned managed identities](system-assigned-managed-identity.md) article for more information.

[!INCLUDE [Language agnostic user assigned procedures](<../../../includes/authentication/user-assigned-managed-identity.md>)]



## Implement the code

Add the [azure-identity-cpp](https://github.com/Azure/azure-sdk-for-cpp/tree/main/sdk/identity/azure-identity) package to your application using [vcpkg](/vcpkg/).

In a terminal of your choice, navigate to the application project directory and run the following commands:

```bash
vcpkg add port azure-identity-cpp
```

Then, add the following in your CMake file:

```cmake
find_package(azure-identity-cpp CONFIG REQUIRED)
target_link_libraries(<your project name> PRIVATE Azure::azure-identity)
```

Azure services are accessed using specialized clients from the various Azure SDK client libraries. For any C++ code that instantiates an Azure SDK client in your app, you need to:

1. Include the `azure/identity.hpp` header.
1. Create an instance of `DefaultAzureCredential`.
1. Pass the instance of `DefaultAzureCredential` to the Azure SDK client constructor.
1. Set the environment variable `AZURE_CLIENT_ID` to the client ID of your user-assigned identity.

An example of these steps is shown in the following code segment with an Azure Storage Blob client.

```cpp
#include <azure/identity.hpp>
#include <azure/storage/blobs.hpp>
#include <iostream>
#include <memory>
#include <cstdlib>

int main() {
    try {
        // Set the AZURE_CLIENT_ID environment variable to your user-assigned managed identity client ID
        // This can be done in your deployment environment or in code (shown below for demonstration)
        // std::putenv("AZURE_CLIENT_ID=your-user-assigned-identity-client-id");
        
        // Create a credential - DefaultAzureCredential will use the AZURE_CLIENT_ID environment variable
        auto credential = std::make_shared<Azure::Identity::DefaultAzureCredential>();
        
        // Create a client for the specified storage account
        std::string accountUrl = "https://<replace_with_your_storage_account_name>.blob.core.windows.net/";
        Azure::Storage::Blobs::BlobServiceClient blobServiceClient(accountUrl, credential);
        
        // Get a reference to a container
        std::string containerName = "sample-container";
        auto containerClient = blobServiceClient.GetBlobContainerClient(containerName);
        
        // Get a reference to a blob
        std::string blobName = "sample-blob";
        auto blobClient = containerClient.GetBlobClient(blobName);
        
        // TODO: perform some action with the blob client
        // auto downloadResult = blobClient.DownloadTo("path/to/local/file");
        
        std::cout << "Successfully authenticated using user-assigned managed identity." << std::endl;
        
    } catch (const std::exception& ex) {
        std::cout << "Exception: " << ex.what() << std::endl;
        return 1;
    }
    
    return 0;
}
```

As discussed in the [Azure SDK for C++ authentication overview](./overview.md) article, `DefaultAzureCredential` supports multiple authentication methods and determines the authentication method being used at runtime. The benefit of this approach is that your app can use different authentication methods in different environments without implementing environment-specific code. When the preceding code is run on your workstation during local development, `DefaultAzureCredential` uses either an application service principal, as determined by environment settings, or developer tool credentials to authenticate with other Azure resources. Thus, the same code can be used to authenticate your app to Azure resources during both local development and when deployed to Azure.

> [!IMPORTANT]
> `DefaultAzureCredential` simplifies authentication while developing applications that deploy to Azure by combining credentials used in Azure hosting environments and credentials used in local development. In production, it's better to use a specific credential type so authentication is more predictable and easier to debug.


An alternative to `DefaultAzureCredential` is to use [`ManagedIdentityCredential`](https://github.com/Azure/azure-sdk-for-cpp/tree/main/sdk/identity/azure-identity). The steps for using `ManagedIdentityCredential` are the same as for using the `DefaultAzureCredential` type.

An example of these steps is shown in the following code segment with an Azure Storage Blob client.

```cpp
#include <azure/identity.hpp>
#include <azure/storage/blobs.hpp>
#include <iostream>
#include <memory>

int main() {
    try {
        // Create a user-assigned managed identity credential with the client ID
        Azure::Identity::ManagedIdentityCredentialOptions options;
        options.ClientId = "abcd1234-..."; // Replace with your user-assigned managed identity client ID
        auto credential = std::make_shared<Azure::Identity::ManagedIdentityCredential>(options);
        
        // Create a client for the specified storage account
        std::string accountUrl = "https://<replace_with_your_storage_account_name>.blob.core.windows.net/";
        Azure::Storage::Blobs::BlobServiceClient blobServiceClient(accountUrl, credential);
        
        // Get a reference to a container
        std::string containerName = "sample-container";
        auto containerClient = blobServiceClient.GetBlobContainerClient(containerName);
        
        // Get a reference to a blob
        std::string blobName = "sample-blob";
        auto blobClient = containerClient.GetBlobClient(blobName);
        
        // TODO: perform some action with the blob client
        // auto downloadResult = blobClient.DownloadTo("path/to/local/file");
        
        std::cout << "Successfully authenticated using user-assigned managed identity." << std::endl;
        
    } catch (const std::exception& ex) {
        std::cout << "Exception: " << ex.what() << std::endl;
        return 1;
    }
    
    return 0;
}
```

The preceding code behaves differently depending on the environment where it's running:

- On your local development workstation, `DefaultAzureCredential` looks in the environment variables for an application service principal or at locally installed developer tools, such as Azure CLI, for a set of developer credentials.
- When deployed to Azure, `ManagedIdentityCredential` discovers your managed identity configurations to authenticate to other services automatically.