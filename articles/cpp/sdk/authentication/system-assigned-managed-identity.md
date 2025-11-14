---
title: Authenticate Azure-hosted C++ apps to Azure resources using a system-assigned managed identity
description: Learn how to authenticate Azure-hosted C++ apps to other Azure services using a system-assigned managed identity.
ms.date: 11/06/2025
ms.topic: how-to
ms.custom: devx-track-cpp devx-track-azurecli
ai-usage: ai-assisted
---

# Authenticate Azure-hosted C++ apps to Azure resources using a system-assigned managed identity

The recommended approach to authenticate an Azure-hosted app to other Azure resources is to use a [managed identity](/entra/identity/managed-identities-azure-resources/overview). This approach is [supported for most Azure services](/entra/identity/managed-identities-azure-resources/managed-identities-status), including apps hosted on Azure App Service, Azure Container Apps, and Azure Virtual Machines. Discover more about different authentication techniques and approaches on the [authentication overview](overview.md) page. In the sections ahead, you'll learn:

- Essential managed identity concepts
- How to create a system-assigned managed identity for your app
- How to assign roles to the system-assigned managed identity
- How to authenticate using the system-assigned managed identity from your app code

[!INCLUDE [Managed identity concepts](<../../../includes/authentication/managed-identity-concepts.md>)]

The following sections describe the steps to enable and use a system-assigned managed identity for an Azure-hosted app. If you need to use a user-assigned managed identity, visit the [user-assigned managed identities](user-assigned-managed-identity.md) article for more information.

[!INCLUDE [Language agnostic system assigned procedures](<../../../includes/authentication/system-assigned-managed-identity.md>)]

## Implement the code

1. Add the [azure-identity-cpp](https://github.com/Azure/azure-sdk-for-cpp/tree/main/sdk/identity/azure-identity) package to your application using [vcpkg](/vcpkg/).

    In a terminal of your choice, navigate to the application project directory and run the following commands:

    ```bash
    vcpkg add port azure-identity-cpp
    ```

1. Add the following in your CMake file:

    ```cmake
    find_package(azure-identity-cpp CONFIG REQUIRED)
    target_link_libraries(<your project name> PRIVATE Azure::azure-identity)
    ```

1. Azure services are accessed using specialized clients from the various Azure SDK client libraries. For any C++ code that instantiates an Azure SDK client in your app, you need to:

    1. Include the `azure/identity.hpp` header.
    1. Create an instance of `DefaultAzureCredential`.
    1. Pass the instance of `DefaultAzureCredential` to the Azure SDK client constructor.

    An example of these steps is shown in the following code segment with an Azure Storage Blob client.

    ```cpp
    #include <azure/identity.hpp>
    #include <azure/storage/blobs.hpp>
    #include <iostream>
    #include <memory>

    int main() {
        try {
            // Create a credential
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
            
            std::cout << "Successfully authenticated and created Azure clients." << std::endl;
            
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

An alternative to `DefaultAzureCredential` is to use [`ManagedIdentityCredential`](https://azuresdkdocs.z19.web.core.windows.net/cpp/azure-identity/latest/class_azure_1_1_identity_1_1_managed_identity_credential.html). The steps for using `ManagedIdentityCredential` are the same as for using the `DefaultAzureCredential` type.

An example of these steps is shown in the following code segment with an Azure Storage Blob client.

```cpp
#include <azure/identity.hpp>
#include <azure/storage/blobs.hpp>
#include <iostream>
#include <memory>

int main() {
    try {
        // Create a system-assigned managed identity credential
        auto credential = std::make_shared<Azure::Identity::ManagedIdentityCredential>();
        
        // When using User Assigned Managed Identity, specify the client ID
        // Azure::Identity::ManagedIdentityCredentialOptions options;
        // options.ClientId = "abcd1234-...";
        // auto credential = std::make_shared<Azure::Identity::ManagedIdentityCredential>(options);
        
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
        
        std::cout << "Successfully authenticated using managed identity." << std::endl;
        
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