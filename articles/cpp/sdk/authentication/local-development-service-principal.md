---
title: Authenticate C++ apps to Azure services during local development using service principals
description: This article describes how to authenticate your application to Azure services when using the Azure SDK for C++ during local development using dedicated application service principals.
ms.date: 11/06/2025
ms.topic: how-to
ms.custom:
  - devx-track-cpp
  - devx-track-azurecli
  - sfi-image-nochange
ai-usage: ai-assisted
---

# Authenticate C++ apps to Azure services during local development using service principals

During local development, applications need to authenticate to Azure to access various Azure services. Two common approaches for local authentication are to [use a developer account](local-development-dev-accounts.md) or a service principal. This article explains how to use an application service principal. In the sections ahead, you learn:

- How to register an application with Microsoft Entra to create a service principal
- How to use Microsoft Entra groups to efficiently manage permissions
- How to assign roles to scope permissions
- How to authenticate using a service principal from your app code

Using dedicated application service principals allows you to adhere to the principle of least privilege when accessing Azure resources. Permissions are limited to the specific requirements of the app during development, preventing accidental access to Azure resources intended for other apps or services. This approach also helps avoid issues when the app is moved to production by ensuring it isn't over-privileged in the development environment.

:::image type="content" source="../media/mermaidjs/local-service-principal-authentication.svg" alt-text="A diagram showing how a local C++ app uses a service principal to connect to Azure resources.":::

When the app is registered in Azure, an application service principal is created. For local development:

- Create a separate app registration for each developer working on the app to ensure each developer has their own application service principal, avoiding the need to share credentials.
- Create a separate app registration for each app to limit the app's permissions to only what is necessary.

During local development, environment variables are set with the application service principal's identity. The Azure Identity library reads these environment variables to authenticate the app to the required Azure resources.


[!INCLUDE [create-app-registration](../../../includes/authentication/includes/auth-create-app-registration.md)]

[!INCLUDE [create-entra-group](../../../includes/authentication/includes/auth-create-entra-group.md)]

[!INCLUDE [auth-assign-group-roles](../../../includes/authentication/includes/auth-assign-group-roles.md)]


## Set the app environment variables

The [DefaultAzureCredential](https://azure.github.io/azure-sdk-for-cpp/identity.html) object looks for the service principal information in a set of environment variables at runtime. Since most developers work on multiple applications, it's recommended to create a `.env` file or use system environment variables to store these credentials locally during development. This scopes the environment variables used to authenticate the application to Azure such that they can only be used by this application.

Set the environment variable values with values obtained from the app registration process as follows:

- `AZURE_CLIENT_ID`: The app ID value.
- `AZURE_TENANT_ID`: The tenant ID value.
- `AZURE_CLIENT_SECRET`: The password/credential generated for the app.

For C++ applications, you can set these environment variables in several ways. You can load them from a `.env` file in your code, or you can set them in your system environment. Below are examples of how to set these environment variables in different shells.:

# [Bash](#tab/bash)

```bash
export AZURE_CLIENT_ID=00001111-aaaa-2222-bbbb-3333cccc4444
export AZURE_TENANT_ID=aaaabbbb-0000-cccc-1111-dddd2222eeee
export AZURE_CLIENT_SECRET=Ee5Ff~6Gg7.-Hh8Ii9Jj0Kk1Ll2Mm3_Nn4Oo5Pp6
```

# [Command prompt](#tab/cmd)

```cmd
set AZURE_CLIENT_ID=00001111-aaaa-2222-bbbb-3333cccc4444
set AZURE_TENANT_ID=aaaabbbb-0000-cccc-1111-dddd2222eeee
set AZURE_CLIENT_SECRET=Ee5Ff~6Gg7.-Hh8Ii9Jj0Kk1Ll2Mm3_Nn4Oo5Pp6
```

# [PowerShell](#tab/powershell)

```powershell
$env:AZURE_CLIENT_ID="00001111-aaaa-2222-bbbb-3333cccc4444"
$env:AZURE_TENANT_ID="aaaabbbb-0000-cccc-1111-dddd2222eeee"
$env:AZURE_CLIENT_SECRET="Ee5Ff~6Gg7.-Hh8Ii9Jj0Kk1Ll2Mm3_Nn4Oo5Pp6"
```

---

## Use DefaultAzureCredential in your application

To authenticate Azure SDK client objects to Azure, use the `DefaultAzureCredential` class from the Azure Identity library for C++. In this scenario, `DefaultAzureCredential` reads the environment variables `AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, and `AZURE_CLIENT_SECRET` to get the application service principal information to connect to Azure.

1. Add the [azure-identity-cpp](https://github.com/Azure/azure-sdk-for-cpp/tree/main/sdk/identity/azure-identity) package to your application using [vcpkg](/vcpkg/).

    ```bash
    vcpkg add port azure-identity-cpp
    ```

1. Add the following in your CMake file:

    ```cmake
    find_package(azure-identity-cpp CONFIG REQUIRED)
    target_link_libraries(<your project name> PRIVATE Azure::azure-identity)
    ```

1. For any C++ code that creates an Azure SDK client object in your app:

    1. Include the `azure/identity.hpp` header.
    1. Create an instance of `DefaultAzureCredential`.
    1. Pass the instance of `DefaultAzureCredential` to the Azure SDK client constructor.

    An example is shown in the following code segment:

    ```cpp
    #include <azure/identity.hpp>
    #include <azure/storage/blobs.hpp>
    #include <iostream>
    #include <memory>

    int main() {
        try {
            // Create a credential - this will automatically read the environment variables
            // AZURE_CLIENT_ID, AZURE_TENANT_ID, and AZURE_CLIENT_SECRET
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
