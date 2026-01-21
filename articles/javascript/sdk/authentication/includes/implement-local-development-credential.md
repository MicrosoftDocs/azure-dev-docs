---
author: diberry
ms.service: azure-javascript
ms.topic: include
ms.date: 09/22/2025
ms.author: diberry
---

## Authenticate to Azure services from your app

The [Azure Identity library](/javascript/api/overview/azure/identity-readme) provides implementations of [TokenCredential](/javascript/api/@azure/core-auth/tokencredential) that support various scenarios and Microsoft Entra authentication flows. The steps ahead demonstrate how to use [DefaultAzureCredential](/azure/developer/javascript/sdk/authentication/credential-chains#use-defaultazurecredential-for-flexibility) or a specific development tool credential when working with user accounts locally.

> [!TIP]
> When your team uses multiple development tools to authenticate with Azure, prefer a local development-optimized instance of `DefaultAzureCredential` over tool-specific credentials.

### Implement the code

Add the [@azure/identity](https://www.npmjs.com/package/@azure/identity) package to your application then choose _one_ of the options to provide a credential. 

- [Use a credential specific to your development tool](#use-a-credential-specific-to-your-development-tool)
- [Use a credential available for use in any development tool](#use-a-credential-available-for-use-in-any-development-tool)

```console
npm install @azure/identity
```

#### Use a credential specific to your development tool

Pass a `TokenCredential` instance corresponding to a specific development tool to the Azure service client constructor such as `AzureCliCredential`.

```typescript
import { AzureCliCredential } from "@azure/identity";
import { BlobServiceClient } from "@azure/storage-blob";

const credential = new AzureCliCredential();

const client = new BlobServiceClient(
    "https://<storage-account-name>.blob.core.windows.net",
    credential
);
```

#### Use a credential available for use in any development tool

A `DefaultAzureCredential` instance optimized for all local development tools. This example requires the environment variable `AZURE_TOKEN_CREDENTIALS` set to `dev`. For more information, see [Exclude a credential type category](/azure/developer/javascript/sdk/authentication/credential-chains#exclude-a-credential-type-category).

```typescript
import { DefaultAzureCredential } from "@azure/identity";
import { BlobServiceClient } from "@azure/storage-blob";

// Set environment variable AZURE_TOKEN_CREDENTIALS to "dev"
const credential = new DefaultAzureCredential({
    requiredEnvVars: ["AZURE_TOKEN_CREDENTIALS"]
});

const client = new BlobServiceClient(
    "https://<storage-account-name>.blob.core.windows.net",
    credential
);
```
