---
title: Authentication Best Practices With The Azure Identity Library For JavaScript
description: This article describes authentication best practices to follow when using the Azure Identity library for JavaScript.
ms.topic: concept-article
ms.date: 05/01/2025
---

# Authentication best practices with the Azure Identity library for JavaScript

This article offers guidelines to help you maximize the performance and reliability of your JavaScript and TypeScript apps when authenticating to Azure services. To make the most of the Azure Identity library for JavaScript, it's important to understand potential issues and mitigation techniques.

## Use deterministic credentials in production environments

[`DefaultAzureCredential`](/javascript/api/%40azure/identity/defaultazurecredential) is the most approachable way to get started with the Azure Identity library, but that convenience also introduces certain tradeoffs. Most notably, the specific credential in the chain that will succeed and be used for request authentication can't be guaranteed ahead of time. In a production environment, this unpredictability can introduce significant and sometimes subtle problems.

For example, consider the following hypothetical sequence of events:

1. An organization's security team mandates all apps use managed identity to authenticate to Azure resources.
1. For months, a JavaScript app hosted on an Azure Virtual Machine (VM) successfully uses `DefaultAzureCredential` to authenticate via managed identity.
1. Without telling the support team, a developer installs the Azure CLI on that VM and runs the `az login` command to authenticate to Azure.
1. Due to this new separate configuration change in the Azure environment, authentication via the original managed identity unexpectedly begins to fail silently.
1. `DefaultAzureCredential` skips the failed `ManagedIdentityCredential` and searches for the next available credential, which is `AzureCliCredential`.
1. The application starts utilizing the Azure CLI credentials rather than the managed identity, which may fail or result in unexpected elevation or reduction of privileges.

To prevent these types of subtle issues or silent failures in production apps, replace `DefaultAzureCredential` with a specific `TokenCredential` implementation, such as `ManagedIdentityCredential`. See the [Identity client library documentation](/javascript/api/%40azure/identity/defaultazurecredential) for available options.

For example, consider the following `DefaultAzureCredential` configuration in an Express.js project:

#### [JavaScript](#tab/javascript)

```javascript
import { DefaultAzureCredential } from "@azure/identity";
import { SecretClient } from "@azure/keyvault-secrets";
import { BlobServiceClient } from "@azure/storage-blob";

const credential = new DefaultAzureCredential();

const secretClient = new SecretClient("https://keyVaultName.vault.azure.net", credential);
const blobServiceClient = new BlobServiceClient(
  "https://storageAccountName.blob.core.windows.net",
  credential
);
```

Modify the preceding code to select a credential based on the environment in which the app is running:

```javascript
import { AzureDeveloperCliCredential, ManagedIdentityCredential, ChainedTokenCredential, 
         AzureCliCredential } from "@azure/identity";
import { SecretClient } from "@azure/keyvault-secrets";
import { BlobServiceClient } from "@azure/storage-blob";

let credential;

// In production, use only ManagedIdentityCredential
if (process.env.NODE_ENV === 'production') {
  // For user-assigned managed identity, provide the client ID
  credential = new ManagedIdentityCredential(process.env.AZURE_CLIENT_ID);
}
// In development, use a chain of credentials appropriate for local work
else {
  credential = new ChainedTokenCredential(
    new AzureCliCredential(),
    new AzureDeveloperCliCredential()
  );
}

// Initialize Key Vault client
const secretClient = new SecretClient("https://keyVaultName.vault.azure.net", credential);

// Initialize Blob Storage client
const blobServiceClient = new BlobServiceClient(
  "https://storageAccountName.blob.core.windows.net",
  credential
);
```

#### [TypeScript](#tab/typescript)

```typescript
import { DefaultAzureCredential } from "@azure/identity";
import { SecretClient } from "@azure/keyvault-secrets";
import { BlobServiceClient } from "@azure/storage-blob";

const credential = new DefaultAzureCredential();
const secretClient = new SecretClient("https://keyVaultName.vault.azure.net", credential);
const blobServiceClient = new BlobServiceClient(
  "https://storageAccountName.blob.core.windows.net",
  credential
);
```

Modify the preceding code to select a credential based on the environment in which the app is running:

```typescript
import { AzureDeveloperCliCredential, ManagedIdentityCredential, ChainedTokenCredential, 
         AzureCliCredential } from "@azure/identity";
import { SecretClient } from "@azure/keyvault-secrets";
import { BlobServiceClient } from "@azure/storage-blob";

let credential;

// In production, use only ManagedIdentityCredential
if (process.env.NODE_ENV === 'production') {
  // For user-assigned managed identity, provide the client ID
  credential = new ManagedIdentityCredential(process.env.AZURE_CLIENT_ID);
}
// In development, use a chain of credentials appropriate for local work
else {
  credential = new ChainedTokenCredential(
    new AzureCliCredential(),
    new AzureDeveloperCliCredential()
  );
}

// Initialize Key Vault client
const secretClient = new SecretClient("https://keyVaultName.vault.azure.net", credential);

// Initialize Blob Storage client
const blobServiceClient = new BlobServiceClient(
  "https://storageAccountName.blob.core.windows.net",
  credential
);
```

---

In this example, only `ManagedIdentityCredential` is used in production. The local development environment's authentication needs are then serviced by the sequence of credentials defined in the `else` clause.

## Reuse credential instances

Reuse credential instances when possible to improve app resilience and reduce the number of access token requests issued to Microsoft Entra ID. When a credential is reused, an attempt is made to fetch a token from the app token cache managed by the underlying MSAL dependency. For more information, see [Token caching in the Azure Identity client library](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/identity/identity/TOKEN_CACHING.md).

> [!IMPORTANT]
> A high-volume app that doesn't reuse credentials may encounter HTTP 429 throttling responses from Microsoft Entra ID, which can lead to app outages.

The recommended credential reuse strategy differs by application framework.

#### [JavaScript](#tab/javascript)

To implement credential reuse in JavaScript applications, create a single credential instance and reuse it across all client objects:

```javascript
import { DefaultAzureCredential, ManagedIdentityCredential } from "@azure/identity";
import { SecretClient } from "@azure/keyvault-secrets";
import { BlobServiceClient } from "@azure/storage-blob";

// Create a single credential instance
const credential = process.env.NODE_ENV === 'production'
  ? new ManagedIdentityCredential(process.env.AZURE_CLIENT_ID)
  : new DefaultAzureCredential();

// Reuse the credential across different client objects
const secretClient = new SecretClient("https://keyVaultName.vault.azure.net", credential);
const blobServiceClient = new BlobServiceClient(
  "https://storageAccountName.blob.core.windows.net",
  credential
);
```

In Express.js applications, you can store the credential in app settings and access it in your route handlers:

```javascript
import express from "express";
import { DefaultAzureCredential, ManagedIdentityCredential } from "@azure/identity";
import { SecretClient } from "@azure/keyvault-secrets";
import { BlobServiceClient } from "@azure/storage-blob";

const app = express();

// Create a single credential instance at app startup
app.locals.credential = process.env.NODE_ENV === 'production'
  ? new ManagedIdentityCredential(process.env.AZURE_CLIENT_ID)
  : new DefaultAzureCredential();

// Reuse the credential in route handlers
app.get('/api/secrets/:secretName', async (req, res) => {
  const secretClient = new SecretClient(
    "https://keyVaultName.vault.azure.net", 
    req.app.locals.credential
  );
  
  try {
    const secret = await secretClient.getSecret(req.params.secretName);
    res.json({ name: secret.name, value: secret.value });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add this route to the existing Express app
app.get('/api/blobs/:containerName', async (req, res) => {
  const blobServiceClient = new BlobServiceClient(
    "https://storageAccountName.blob.core.windows.net", 
    req.app.locals.credential
  );
  
  try {
    // Get reference to a container
    const containerClient = blobServiceClient.getContainerClient(req.params.containerName);
    
    // List all blobs in the container
    const blobs = [];
    for await (const blob of containerClient.listBlobsFlat()) {
      blobs.push({
        name: blob.name,
        contentType: blob.properties.contentType,
        size: blob.properties.contentLength,
        lastModified: blob.properties.lastModified
      });
    }
    
    res.json({ containerName: req.params.containerName, blobs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

#### [TypeScript](#tab/typescript)


In Express.js applications, you can store the credential in app settings and access it in your route handlers:

```typescript
import express from "express";
import { DefaultAzureCredential, ManagedIdentityCredential } from "@azure/identity";
import { SecretClient } from "@azure/keyvault-secrets";
import { BlobServiceClient } from "@azure/storage-blob";

const app = express();

// Create a single credential instance at app startup
app.locals.credential = process.env.NODE_ENV === 'production'
  ? new ManagedIdentityCredential(process.env.AZURE_CLIENT_ID)
  : new DefaultAzureCredential();

// Reuse the credential in route handlers
app.get('/api/secrets/:secretName', async (req, res) => {
  const secretClient = new SecretClient(
    "https://keyVaultName.vault.azure.net", 
    req.app.locals.credential
  );
  
  try {
    const secret = await secretClient.getSecret(req.params.secretName);
    res.json({ name: secret.name, value: secret.value });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add this route to the existing Express app
app.get('/api/blobs/:containerName', async (req, res) => {
  const blobServiceClient = new BlobServiceClient(
    "https://storageAccountName.blob.core.windows.net", 
    req.app.locals.credential
  );
  
  try {
    // Get reference to a container
    const containerClient = blobServiceClient.getContainerClient(req.params.containerName);
    
    // List all blobs in the container
    const blobs = [];
    for await (const blob of containerClient.listBlobsFlat()) {
      blobs.push({
        name: blob.name,
        contentType: blob.properties.contentType,
        size: blob.properties.contentLength,
        lastModified: blob.properties.lastModified
      });
    }
    
    res.json({ containerName: req.params.containerName, blobs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

---

## Understand when token lifetime and caching logic is needed

If you use an Azure Identity library credential outside the context of an Azure SDK client library, it becomes your responsibility to manage [token lifetime](/entra/identity-platform/access-tokens#token-lifetime) and caching behavior in your app.

The `refreshAfterTimestamp` property on [AccessToken](/javascript/api/@azure/identity/accesstoken), which provides a hint to consumers as to when token refresh can be attempted, will be automatically used by Azure SDK client libraries that depend on the Azure Core library to refresh the token. For direct usage of Azure Identity library credentials that support token caching, the underlying MSAL cache automatically refreshes proactively when the `refreshAfterTimestamp` time occurs. This design allows the client code to call [TokenCredential.getToken()](/javascript/api/@azure/identity/tokencredential#@azure-identity-tokencredential-gettoken) each time a token is needed and delegate the refresh to the library.

To only call `TokenCredential.getToken()` when necessary, observe the `refreshAfterTimestamp` date and proactively attempt to refresh the token after that time. The specific implementation is up to the customer.

## Understand the managed identity retry strategy

The Azure Identity library for JavaScript allows you to authenticate via managed identity with `ManagedIdentityCredential`. The way in which you use `ManagedIdentityCredential` impacts the applied retry strategy:

- When used via `DefaultAzureCredential`, no retries are attempted when the initial token acquisition attempt fails or times out after a short duration. This is the least resilient option because it's optimized to "fail fast" for an efficient development inner loop.
- Any other approach, such as ChainedTokenCredential or ManagedIdentityCredential directly:
  - The time interval between retries starts at 0.8 seconds, and a maximum of five retries are attempted, by default. This option is optimized for resilience but introduces potentially unwanted delays in the development inner loop.
  - To change any of the default retry settings, use the [retryOptions](/javascript/api/%40azure/core-rest-pipeline/pipelineretryoptions) property on options parameter. For example, retry a maximum of three times, with a starting interval of 0.5 seconds:

#### [JavaScript](#tab/javascript)

```javascript
import { ManagedIdentityCredential } from "@azure/identity";

const credential = new ManagedIdentityCredential(
  process.env.AZURE_CLIENT_ID, // For user-assigned managed identity
  {
    retryOptions: {
      maxRetries: 3,           // Maximum number of retry attempts
      retryDelayInMs: 500,     // Initial delay between retries (in milliseconds)
      maxRetryDelayInMs: 5000  // Maximum delay between retries
    }
  }
);
```

#### [TypeScript](#tab/typescript)

```typescript
import { ManagedIdentityCredential } from "@azure/identity";
import type { ManagedIdentityCredentialOptions } from "@azure/identity";

const options: ManagedIdentityCredentialOptions = {
  retryOptions: {
    maxRetries: 3,           // Maximum number of retry attempts
    retryDelayInMs: 500,     // Initial delay between retries (in milliseconds)
    maxRetryDelayInMs: 5000  // Maximum delay between retries
  }
};

const credential = new ManagedIdentityCredential(
  process.env.AZURE_CLIENT_ID as string, // For user-assigned managed identity
  options
);
```

---

For more information on customizing retry policies in Azure SDK for JavaScript, see one of the following options objects:
* [ManagedIdentityCredentialClientIdOptions](/javascript/api/%40azure/identity/managedidentitycredentialclientidoptions)
* [ManagedIdentityCredentialObjectIdOptions](/javascript/api/@azure/identity/managedidentitycredentialobjectidoptions)
* [ManagedIdentityCredentialResourceIdOptions](/javascript/api/@azure/identity/managedidentitycredentialresourceidoptions)