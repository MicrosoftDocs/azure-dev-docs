---
title: Authentication Best Practices With The Azure Identity Library For JavaScript
description: This article describes authentication best practices to follow when using the Azure Identity library for JavaScript.
ms.topic: concept-article
ms.date: 05/01/2025
---

# Authentication best practices with the Azure Identity library for JavaScript

This article offers guidelines to help you maximize the performance and reliability of your JavaScript and TypeScript apps when authenticating to Azure services. To make the most of the Azure Identity library for JavaScript, it's important to understand potential issues and mitigation techniques.

## Use deterministic credentials in production environments

[`DefaultAzureCredential`](/javascript/api/@azure/identity/defaultazurecredential) is the most approachable way to get started with the Azure Identity library, but that convenience also introduces certain tradeoffs. Most notably, the specific credential in the chain that will succeed and be used for request authentication can't be guaranteed ahead of time. In a production environment, this unpredictability can introduce significant and sometimes subtle problems.

For example, consider the following hypothetical sequence of events:

1. An organization's security team mandates all apps use managed identity to authenticate to Azure resources.
1. For months, a JavaScript app hosted on an Azure Virtual Machine (VM) successfully uses `DefaultAzureCredential` to authenticate via managed identity.
1. Without telling the support team, a developer installs the Azure CLI on that VM and runs the `az login` command to authenticate to Azure.
1. Due to a separate configuration change in the Azure environment, authentication via the original managed identity unexpectedly begins to fail silently.
1. `DefaultAzureCredential` skips the failed `ManagedIdentityCredential` and searches for the next available credential, which is `AzureCliCredential`.
1. The application starts utilizing the Azure CLI credentials rather than the managed identity, which may fail or result in unexpected elevation or reduction of privileges.

To prevent these types of subtle issues or silent failures in production apps, replace `DefaultAzureCredential` with a specific `TokenCredential` implementation, such as `ManagedIdentityCredential`. See the [Identity client library documentation](/javascript/api/@azure/identity) for available options.

For example, consider the following `DefaultAzureCredential` configuration in an Express.js project:

```javascript
import { DefaultAzureCredential } from "@azure/identity";
import { SecretClient } from "@azure/keyvault-secrets";

const credential = new DefaultAzureCredential();
const secretClient = new SecretClient("https://myvault.vault.azure.net", credential);
```

Modify the preceding code to select a credential based on the environment in which the app is running:

```javascript
import { DefaultAzureCredential, ManagedIdentityCredential, ChainedTokenCredential, 
         EnvironmentCredential, AzureCliCredential } from "@azure/identity";
import { SecretClient } from "@azure/keyvault-secrets";

let credential;

// In production, use only ManagedIdentityCredential
if (process.env.NODE_ENV === 'production') {
  // For user-assigned managed identity, provide the client ID
  credential = new ManagedIdentityCredential(process.env.AZURE_CLIENT_ID);
}
// In development, use a chain of credentials appropriate for local work
else {
  credential = new ChainedTokenCredential(
    new EnvironmentCredential(),
    new AzureCliCredential()
  );
}

const secretClient = new SecretClient("https://myvault.vault.azure.net", credential);
```

In this example, only `ManagedIdentityCredential` is used in production. The local development environment's authentication needs are then serviced by the sequence of credentials defined in the `else` clause.

## Reuse credential instances

Reuse credential instances when possible to improve app resilience and reduce the number of access token requests issued to Microsoft Entra ID. When a credential is reused, an attempt is made to fetch a token from the app token cache managed by the underlying MSAL dependency.

> [!IMPORTANT]
> A high-volume app that doesn't reuse credentials may encounter HTTP 429 throttling responses from Microsoft Entra ID, which can lead to app outages.

The recommended credential reuse strategy differs by application framework.

# [JavaScript](#tab/javascript)

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
const secretClient = new SecretClient("https://myvault.vault.azure.net", credential);
const blobServiceClient = new BlobServiceClient(
  "https://mystorageaccount.blob.core.windows.net",
  credential
);
```

In Express.js applications, you can store the credential in app settings and access it in your route handlers:

```javascript
import express from "express";
import { DefaultAzureCredential, ManagedIdentityCredential } from "@azure/identity";
import { SecretClient } from "@azure/keyvault-secrets";

const app = express();

// Create a single credential instance at app startup
app.locals.credential = process.env.NODE_ENV === 'production'
  ? new ManagedIdentityCredential(process.env.AZURE_CLIENT_ID)
  : new DefaultAzureCredential();

// Reuse the credential in route handlers
app.get('/api/secrets/:secretName', async (req, res) => {
  const secretClient = new SecretClient(
    "https://myvault.vault.azure.net", 
    req.app.locals.credential
  );
  
  try {
    const secret = await secretClient.getSecret(req.params.secretName);
    res.json({ name: secret.name, value: secret.value });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

# [TypeScript](#tab/typescript)

For TypeScript applications, implementing credential reuse follows similar patterns with the benefit of type safety:

```typescript
import { DefaultAzureCredential, ManagedIdentityCredential, TokenCredential } from "@azure/identity";
import { SecretClient } from "@azure/keyvault-secrets";
import { BlobServiceClient } from "@azure/storage-blob";

// Create a single credential instance
let credential: TokenCredential;

if (process.env.NODE_ENV === 'production') {
  credential = new ManagedIdentityCredential(process.env.AZURE_CLIENT_ID);
} else {
  credential = new DefaultAzureCredential();
}

// Reuse the credential across different client objects
const secretClient = new SecretClient("https://myvault.vault.azure.net", credential);
const blobServiceClient = new BlobServiceClient(
  "https://mystorageaccount.blob.core.windows.net",
  credential
);
```

For a Next.js application, you can create a singleton credential in a utility file:

```typescript
// utils/azure-auth.ts
import { DefaultAzureCredential, ManagedIdentityCredential, TokenCredential } from "@azure/identity";

let credential: TokenCredential | null = null;

export function getAzureCredential(): TokenCredential {
  if (!credential) {
    credential = process.env.NODE_ENV === 'production'
      ? new ManagedIdentityCredential(process.env.AZURE_CLIENT_ID as string)
      : new DefaultAzureCredential();
  }

  return credential;
}
```

Then reuse this credential across your API routes:

```typescript
// pages/api/secrets/[name].ts
import { SecretClient } from "@azure/keyvault-secrets";
import { getAzureCredential } from '../../../utils/azure-auth';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { name } = req.query;
  
  const secretClient = new SecretClient(
    "https://myvault.vault.azure.net", 
    getAzureCredential()
  );
  
  try {
    const secret = await secretClient.getSecret(name as string);
    res.status(200).json({ name: secret.name, value: secret.value });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}
```

---

## Understand when token lifetime and caching logic is needed

If you use an Azure Identity library credential outside the context of an Azure SDK client library, it becomes your responsibility to manage [token lifetime](/entra/identity-platform/access-tokens#token-lifetime) and caching behavior in your app.

The Azure Identity library for JavaScript uses an in-memory token cache by default, which helps reduce the number of authentication requests made to Microsoft Entra ID. The token cache maintains tokens based on their expiration time, and each credential will automatically attempt to refresh tokens when needed.

When using Azure SDK clients, token acquisition, renewal, and caching are handled for you. However, if you're manually requesting tokens using the `getToken` method, you should implement caching logic to avoid excessive token requests.

```typescript
import { DefaultAzureCredential } from "@azure/identity";

// Token cache is used automatically behind the scenes
const credential = new DefaultAzureCredential();

// When used with an Azure SDK client, token management is handled for you
const secretClient = new SecretClient(vaultUrl, credential);

// When requesting tokens manually, implement your own caching logic
let cachedToken: AccessToken | null = null;
let tokenExpiresOnTimestamp: number | null = null;

async function getAuthToken(): Promise<string> {
  const currentTimestamp = Date.now();
  
  // Check if we have a valid cached token
  if (cachedToken && tokenExpiresOnTimestamp && currentTimestamp < tokenExpiresOnTimestamp) {
    return cachedToken.token;
  }
  
  // If not, request a new token
  cachedToken = await credential.getToken("https://management.azure.com/.default");
  // Set expiration time with a 5-minute buffer for safety
  tokenExpiresOnTimestamp = new Date(cachedToken.expiresOnTimestamp).getTime() - (5 * 60 * 1000);
  
  return cachedToken.token;
}
```

## Understand the managed identity retry strategy

The Azure Identity library for JavaScript allows you to authenticate via managed identity with `ManagedIdentityCredential`. The way in which you use `ManagedIdentityCredential` impacts the applied retry strategy:

- When used via `DefaultAzureCredential`, no retries are attempted when the initial token acquisition attempt fails or times out after a short duration. This is the least resilient option because it's optimized to "fail fast" for an efficient development inner loop.
- When used directly with `ManagedIdentityCredential` or as part of a `ChainedTokenCredential`, the credential will use the default retry policy, which is more resilient but may introduce delays during development.
- You can customize the retry behavior by providing options when creating the credential:

# [JavaScript](#tab/javascript)

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

# [TypeScript](#tab/typescript)

```typescript
import { ManagedIdentityCredential, ManagedIdentityCredentialOptions } from "@azure/identity";

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

For more information on customizing retry policies in Azure SDK for JavaScript, see the [Azure Identity client library documentation](/javascript/api/@azure/identity/managedidentitycredentialoptions).