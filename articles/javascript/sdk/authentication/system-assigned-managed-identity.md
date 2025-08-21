---
title: Authenticate Azure-hosted JavaScript apps to Azure resources using a system-assigned managed identity
description: Learn how to authenticate Azure-hosted JavaScript apps to other Azure services using a system-assigned managed identity.
ms.date: 08/15/2025
ms.topic: how-to
ms.custom: devx-track-js, devx-track-azurecli
zone_pivot_group_filename: developer/javascript/javascript-zone-pivot-groups.json
zone_pivot_groups: js-ts
---

# Authenticate Azure-hosted JavaScript apps to Azure resources using a system-assigned managed identity

The recommended approach to authenticate an Azure-hosted app to other Azure resources is to use a [managed identity](/entra/identity/managed-identities-azure-resources/overview). This approach is [supported for most Azure services](/entra/identity/managed-identities-azure-resources/managed-identities-status), including apps hosted on Azure App Service, Azure Container Apps, and Azure Virtual Machines. Discover more about different authentication techniques and approaches on the [authentication overview](overview.md) page. In the sections ahead, you'll learn:

- Essential managed identity concepts
- How to create a system-assigned managed identity for your app
- How to assign roles to the system-assigned managed identity
- How to authenticate using the system-assigned managed identity from your app code

[!INCLUDE [Implement user-assigned managed identity](<../../../includes/authentication/managed-identity-concepts.md>)]

The following sections describe the steps to enable and use a system-assigned managed identity for an Azure-hosted app. If you need to use a user-assigned managed identity, visit the [user-assigned managed identities](user-assigned-managed-identity.md) article for more information.

[!INCLUDE [Language agnostic system assigned procedures](<../../../includes/authentication/system-assigned-managed-identity.md>)]

[!INCLUDE [JavaScript implement-managed-identity-concepts](includes/implement-managed-identity-concepts.md)]


::: zone pivot="js"

### Implement the code

In a JavaScript project, add the [@azure/identity](https://www.npmjs.com/package/@azure/identity) package. In a terminal of your choice, navigate to the application project directory and run the following commands:

```console
npm install @azure/identity
```

Azure services are accessed using specialized client classes from the various Azure SDK client libraries. In `index.js`, complete the following steps to configure token-based authentication:

1. Import the `@azure/identity` package.
1. Pass an appropriate `TokenCredential` instance to the client:
    - Use `DefaultAzureCredential` when your app is running locally
    - Use `ManagedIdentityCredential` when your app is running in Azure and configure either the client ID, resource ID, or object ID.

    ```javascript
    import { BlobServiceClient } from '@azure/storage-blob';
    import { ManagedIdentityCredential, DefaultAzureCredential } from '@azure/identity';
    
    function createBlobServiceClient() {
        const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
        if (!accountName) throw Error('Azure Storage accountName not found');
    
        const url = `https://${accountName}.blob.core.windows.net`;
    
        if (process.env.NODE_ENV === "production") {
            return new BlobServiceClient(url, new ManagedIdentityCredential());
        } else {
            return new BlobServiceClient(url, new DefaultAzureCredential());
        }
    }
    
    async function main() {
        try {
            const blobServiceClient = createBlobServiceClient();
            const containerClient = blobServiceClient.getContainerClient(process.env.AZURE_STORAGE_CONTAINER_NAME);
            const properties = await containerClient.getProperties();
    
            console.log(properties);
        } catch (err) {
            const error = err;
            console.error("Error retrieving container properties:", error.message);
            throw error;
        }
    }
    
    main().catch((err) => {
        console.error("Error running sample:", err.message);
        process.exit(1);
    });
    ```

::: zone-end

::: zone pivot="ts"

### Implement the code

In a JavaScript project, add the [@azure/identity](https://www.npmjs.com/package/@azure/identity) package. In a terminal of your choice, navigate to the application project directory and run the following commands:

```console
npm install @azure/identity @types/node
```

Azure services are accessed using specialized client classes from the various Azure SDK client libraries. In `index.js`, complete the following steps to configure token-based authentication:

1. Import the `@azure/identity` package.
1. Pass an appropriate `TokenCredential` instance to the client:
    - Use `DefaultAzureCredential` when your app is running locally
    - Use `ManagedIdentityCredential` when your app is running in Azure and configure either the client ID, resource ID, or object ID.

    ```typescript
    import { BlobServiceClient } from '@azure/storage-blob';
    import { ManagedIdentityCredential, DefaultAzureCredential } from '@azure/identity';
    
    function createBlobServiceClient(): BlobServiceClient {
        const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
        
        if (!accountName) throw Error('Azure Storage accountName not found');
    
        const url = `https://${accountName}.blob.core.windows.net`;
    
        if (process.env.NODE_ENV === "production") {
            return new BlobServiceClient(url, new ManagedIdentityCredential());
        } else {
            return new BlobServiceClient(url, new DefaultAzureCredential());
        }
    }
    
    async function main(): Promise<void> {
        try {
            const blobServiceClient = createBlobServiceClient();
            const containerClient = blobServiceClient.getContainerClient(process.env.AZURE_STORAGE_CONTAINER_NAME!);
            const properties = await containerClient.getProperties();
    
            console.log(properties);
        } catch (err) {
            const error = err as Error;
            console.error("Error retrieving container properties:", error.message);
            throw error;
        }
    }
    
    main().catch((err: Error) => {
        console.error("Error running sample:", err.message);
        process.exit(1);
    });
    ```

::: zone-end

The preceding code behaves differently depending on the environment where it's running:

- On your local development workstation, `DefaultAzureCredential` looks in the environment variables for an application service principal or at locally installed developer tools, such as Visual Studio Code, for a set of developer credentials.
- When deployed to Azure, `ManagedIdentityCredential` discovers your managed identity configurations to authenticate to other services automatically.