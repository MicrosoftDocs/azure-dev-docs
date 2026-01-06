---
ms.topic: include
ms.date: 01/05/2026
---

## Implement the code

Add the `@azure/identity` package:

```bash
npm install @azure/identity
```

Azure services are accessed using specialized client classes from the various Azure SDK client libraries. For any JavaScript code that creates an Azure SDK client object in your app, follow these steps:

1. Import the [`ClientSecretCredential`](/javascript/api/@azure/identity/clientsecretcredential?view=azure-node-latest&preserve-view=true) class from the `@azure/identity` module.
1. Create a `ClientSecretCredential` object with the `tenantId`, `clientId`, and `clientSecret`.
1. Pass the `ClientSecretCredential` instance to the Azure SDK client object constructor.

An example of this approach is shown in the following code segment:

```javascript
import { BlobServiceClient } from '@azure/storage-blob';
import { ClientSecretCredential } from '@azure/identity';

// Authentication
const tenantId = process.env.AZURE_TENANT_ID;
const clientId = process.env.AZURE_CLIENT_ID;
const clientSecret = process.env.AZURE_CLIENT_SECRET;

// Azure Storage account name
const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;

if (!tenantId || !clientId || !clientSecret || !accountName) {
  throw Error('Required environment variables not found');
}

const credential = new ClientSecretCredential(tenantId, clientId, clientSecret);

const blobServiceClient = new BlobServiceClient(
  `https://${accountName}.blob.core.windows.net`,
  credential
);
```

An alternative approach is to pass the `ClientSecretCredential` object directly to the Azure SDK client constructor:

```javascript
const blobServiceClient = new BlobServiceClient(
  `https://${accountName}.blob.core.windows.net`,
  new ClientSecretCredential(tenantId, clientId, clientSecret)
);
```
