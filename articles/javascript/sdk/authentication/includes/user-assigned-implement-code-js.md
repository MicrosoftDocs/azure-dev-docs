---
ms.topic: include
ms.date: 08/15/2025
---
### Implement the code

In a JavaScript project, add the [@azure/identity](https://www.npmjs.com/package/@azure/identity) package. In a terminal of your choice, navigate to the application project directory and run the following commands:

```console
npm install @azure/identity
```

Azure services are accessed using specialized client classes from the various Azure SDK client libraries. In `index.js`, complete the following steps to configure token-based authentication:

1. Import the `@azure/identity` package.
1. Pass an appropriate `TokenCredential` instance to the client:
    - Use `DefaultAzureCredential` when your app is running locally.
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