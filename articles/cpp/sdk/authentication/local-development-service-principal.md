---
title: Authenticate C++ apps to Azure services during local development using service principals
description: This article describes how to authenticate your application to Azure services when using the Azure SDK for C++ during local development using dedicated application service principals.
#customer intent: As a C++ developer, I want to use the Azure SDK for C++ with service principals so that I can authenticate my app during local development using dedicated application service principals.
ms.date: 12/03/2025
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


[!INCLUDE [create-app-registration](../../../includes/authentication/authentication-create-app-registration.md)]

[!INCLUDE [create-entra-group](../../../includes/authentication/authentication-create-entra-group.md)]

[!INCLUDE [authentication-assign-group-roles](../../../includes/authentication/authentication-assign-group-roles.md)]


## Set the app environment variables

At runtime, certain credentials from the Azure Identity library, such as `DefaultAzureCredential`, `EnvironmentCredential`, and `ClientSecretCredential`, search for service principal information by convention in the environment variables. There are multiple ways to configure environment variables depending on your tooling and environment. You can create an `.env` file or use system environment variables to store these credentials locally during development.

Regardless of the approach you choose, set the following environment variables for a service principal:

- `AZURE_CLIENT_ID`: Used to identify the registered app in Azure.
- `AZURE_TENANT_ID`: The ID of the Microsoft Entra tenant.
- `AZURE_CLIENT_SECRET`: The secret credential that was generated for the app.

For C++ applications, you can set these environment variables in several ways. You can load them from a `.env` file in your code, or you can set them in your system environment. The following examples show how to set the environment variables in different shells:

# [Bash](#tab/bash)

```bash
export AZURE_CLIENT_ID=<your-client-id>
export AZURE_TENANT_ID=<your-tenant-id>
export AZURE_CLIENT_SECRET=<your-client-secret>
```

# [Windows command prompt](#tab/cmd)

You can set environment variables for Windows from the command line. However, the values are accessible to all apps running on that operating system and could cause conflicts, so use caution with this approach.

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

The Azure Identity library provides various credentials—implementations of TokenCredential adapted to supporting different scenarios and Microsoft Entra authentication flows. Use the `ClientSecretCredential` class when working with service principals locally and in production. In this scenario, `ClientSecretCredential` reads the environment variables `AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, and `AZURE_CLIENT_SECRET` to get the application service principal information to connect to Azure.

1. Add the [azure-identity-cpp](https://github.com/Azure/azure-sdk-for-cpp/tree/main/sdk/identity/azure-identity) package to your application using [vcpkg](/vcpkg/).

    ```bash
    vcpkg add port azure-identity-cpp
    ```

1. Add the following lines in your CMake file:

    ```cmake
    find_package(azure-identity-cpp CONFIG REQUIRED)
    target_link_libraries(<your project name> PRIVATE Azure::azure-identity)
    ```

1. For any C++ code that creates an Azure SDK client object in your app:

    1. Include the `azure/identity.hpp` header.
    1. Create an instance of `ClientSecretCredential`.
    1. Pass the instance of `ClientSecretCredential` to the Azure SDK client constructor.

    An example is shown in the following code segment:

    ```cpp
    #include <azure/identity.hpp>
    #include <azure/storage/blobs.hpp>
    #include <iostream>
    #include <memory>

    // The following environment variables must be set before running the sample.
    // * AZURE_TENANT_ID: Tenant ID for the Azure account.
    // * AZURE_CLIENT_ID: The Client ID to authenticate the request.
    // * AZURE_CLIENT_SECRET: The client secret.
    std::string GetTenantId() { return std::getenv("AZURE_TENANT_ID"); }
    std::string GetClientId() { return std::getenv("AZURE_CLIENT_ID"); }
    std::string GetClientSecret() { return std::getenv("AZURE_CLIENT_SECRET"); }

    int main() {
        try {
            // Create a credential - this will automatically read the environment variables
            // AZURE_CLIENT_ID, AZURE_TENANT_ID, and AZURE_CLIENT_SECRET
            auto credential = std::make_shared<Azure::Identity::ClientSecretCredential>(GetTenantId(), GetClientId(), GetClientSecret());
            
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
