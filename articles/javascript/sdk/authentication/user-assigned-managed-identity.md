---
title: Authenticate Azure-hosted JavaScript apps to Azure resources using a user-assigned managed identity
description: Learn how to authenticate Azure-hosted JavaScript apps to other Azure services using a user-assigned managed identity.
ms.topic: how-to
ms.custom: devx-track-js, engagement-fy23, devx-track-azurecli
ms.date: 08/15/2025
zone_pivot_group_filename: developer/javascript/javascript-zone-pivot-groups.json
zone_pivot_groups: js-ts
---

# Authenticate Azure-hosted JavaScript apps to Azure resources using a user-assigned managed identity

The recommended approach to authenticate an Azure-hosted app to other Azure resources is to use a [managed identity](/entra/identity/managed-identities-azure-resources/overview). This approach is [supported for most Azure services](/entra/identity/managed-identities-azure-resources/managed-identities-status), including apps hosted on Azure App Service, Azure Container Apps, and Azure Virtual Machines. Discover more about different authentication techniques and approaches on the [authentication overview](overview.md) page. In the sections ahead, you'll learn:

- Essential managed identity concepts
- How to create a user-assigned managed identity for your app
- How to assign roles to the user-assigned managed identity
- How to authenticate using the user-assigned managed identity from your app code

[!INCLUDE [managed-identity-concepts](../../../includes/authentication/managed-identity-concepts.md)]

The following sections describe the steps to enable and use a user-assigned managed identity for an Azure-hosted app. If you need to use a system-assigned managed identity, visit the [system-assigned managed identities](system-assigned-managed-identity.md) article for more information.

[!INCLUDE [Language agnostic user assigned procedures](<../../../includes/authentication/user-assigned-managed-identity.md>)]

[!INCLUDE [JavaScript implement-managed-identity-concepts](includes/implement-managed-identity-concepts.md)]

### Implement the code

In a JavaScript project, add the [@azure/identity] package. In a terminal of your choice, navigate to the application project directory and run the following commands:

```console
npm install @azure/identity
```

Azure services are accessed using specialized client classes from the various Azure SDK client libraries. In `index.js`, complete the following steps to configure token-based authentication:

1. Import the `@azure/identity` package.
1. Pass an appropriate `TokenCredential` instance to the client:
    - Use `DefaultAzureCredential` when your app is running locally
    - Use `ManagedIdentityCredential` when your app is running in Azure and configure either the client ID, resource ID, or object ID.

## [Client ID](#tab/client-id)

The client ID is used to identify a managed identity when configuring applications or services that need to authenticate using that identity.

1. Retrieve the client ID assigned to a user-assigned managed identity using the following command:

    ```azurecli
    az identity show \
        --resource-group <resource-group-name> \
        --name <identity-name> \
        --query 'clientId'
    ```

1. Configure `ManagedIdentityCredential` with the client ID:

    ```javascript
    import { BlobServiceClient } from '@azure/storage-blob';
    import { ManagedIdentityCredential, DefaultAzureCredential } from '@azure/identity';
    
    console.log(process.env);
    
    function createBlobServiceClient() {
        const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
        if (!accountName) throw Error('Azure Storage accountName not found');
        const url = `https://${accountName}.blob.core.windows.net`;
    
        if (process.env.NODE_ENV === "production") {
            const clientId = process.env.AZURE_CLIENT_ID;
            if (!clientId) throw Error('AZURE_CLIENT_ID not found for Managed Identity');
            return new BlobServiceClient(url, new ManagedIdentityCredential(clientId));
        } else {
            return new BlobServiceClient(url, new DefaultAzureCredential());
        }
    }
    
    async function main() {
        try {
            const blobServiceClient = createBlobServiceClient();

            const containerClient = blobServiceClient.getContainerClient(process.env.AZURE_STORAGE_CONTAINER_NAME);

            // do something with client
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

## [Resource ID](#tab/resource-id)

The resource ID uniquely identifies the managed identity resource within your Azure subscription using the following structure:

`/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ManagedIdentity/userAssignedIdentities/{identityName}`

Resource IDs can be built by convention, which makes them more convenient when working with a large number of user-assigned managed identities in your environment.

1. Retrieve the resource ID for a user-assigned managed identity using the following command:

    ```azurecli
    az identity show \
        --resource-group <resource-group-name> \
        --name <identity-name> \
        --query 'id'
    ```

1. Configure `ManagedIdentityCredential` with the resource ID:

    ```javascript
    import { BlobServiceClient } from '@azure/storage-blob';
    import { ManagedIdentityCredential, DefaultAzureCredential } from '@azure/identity';
    
    console.log(process.env);
    
    function createBlobServiceClient() {
        const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
        if (!accountName) throw Error('Azure Storage accountName not found');
        const url = `https://${accountName}.blob.core.windows.net`;
    
        if (process.env.NODE_ENV === "production") {
            const resourceId = process.env.AZURE_RESOURCE_ID;
            if (!resourceId) throw Error('AZURE_RESOURCE_ID not found for Managed Identity');
            return new BlobServiceClient(url, new ManagedIdentityCredential(resourceId));
        } else {
            return new BlobServiceClient(url, new DefaultAzureCredential());
        }
    }
    

    async function main() {
        try {
            const blobServiceClient = createBlobServiceClient();

            const containerClient = blobServiceClient.getContainerClient(process.env.AZURE_STORAGE_CONTAINER_NAME);

            // do something with client
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

## [Object ID](#tab/object-id)

A principal ID is another name for an object ID.

1. Retrieve the object ID for a user-assigned managed identity using the following command:

    ```azurecli
    az identity show \
        --resource-group <resource-group-name> \
        --name <identity-name> \
        --query 'principalId'
    ```

1. Configure `ManagedIdentityCredential` with the object ID:

    ```javascript
    import { BlobServiceClient } from '@azure/storage-blob';
    import { ManagedIdentityCredential, DefaultAzureCredential } from '@azure/identity';
    
    console.log(process.env);
    
    function createBlobServiceClient() {
        const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
        if (!accountName) throw Error('Azure Storage accountName not found');
        const url = `https://${accountName}.blob.core.windows.net`;
    
        if (process.env.NODE_ENV === "production") {
            const objectId = process.env.AZURE_OBJECT_ID;
            if (!objectId) throw Error('AZURE_OBJECT_ID not found for Managed Identity');
            return new BlobServiceClient(url, new ManagedIdentityCredential(objectId));
        } else {
            return new BlobServiceClient(url, new DefaultAzureCredential());
        }
    }
    
    async function main() {
        try {
            const blobServiceClient = createBlobServiceClient();
            
            const containerClient = blobServiceClient.getContainerClient(process.env.AZURE_STORAGE_CONTAINER_NAME);

            // do something with client
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

---

The preceding code behaves differently depending on the environment where it's running:

- On your local development workstation, `DefaultAzureCredential` looks in the environment variables for an application service principal or at locally installed developer tools, such as Visual Studio, for a set of developer credentials.
- When deployed to Azure, `ManagedIdentityCredential` discovers your managed identity configurations to authenticate to other services automatically.