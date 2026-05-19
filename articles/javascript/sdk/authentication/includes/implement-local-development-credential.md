---
author: diberry
ms.service: azure-javascript
ms.topic: include
ms.date: 01/21/2026
ms.author: diberry
---

## Authenticate to Azure services from your app

The [Azure Identity library](/javascript/api/overview/azure/identity-readme) provides implementations of [TokenCredential](/javascript/api/@azure/core-auth/tokencredential) that support various scenarios and Microsoft Entra authentication flows. The following steps demonstrate how to use [DefaultAzureCredential](/azure/developer/javascript/sdk/authentication/credential-chains#use-defaultazurecredential-for-flexibility) or a specific development tool credential when working with user accounts locally.

> [!TIP]
> When your team uses multiple development tools to authenticate with Azure, prefer a local development-optimized instance of `DefaultAzureCredential` over tool-specific credentials.

### Implement the code

1. Add the [@azure/identity](https://www.npmjs.com/package/@azure/identity) package to your application.

    ```console
    npm install @azure/identity
    ```

    > [!NOTE]
    > If you want to use `VisualStudioCodeCredential`, you must also install the [@azure/identity-vscode](https://www.npmjs.com/package/@azure/identity-vscode) plugin package. Then explicitly load the credential. For an example, see the [@azure/identity-vscode README](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/identity/identity-vscode/README.md#examples).

1. Choose _one_ of the credential implementations based on your scenario.

    - [Use a credential specific to your development tool](#use-a-credential-specific-to-your-development-tool): this option is best for single person or single tool scenarios.
    - [Use a credential available for use in any development tool](#use-a-credential-available-for-use-in-any-development-tool): this option is best for open source projects and diverse tool teams.

#### Use a credential specific to your development tool

Pass a `TokenCredential` instance corresponding to a specific development tool to the Azure service client constructor, such as `AzureCliCredential`.

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

Use a `DefaultAzureCredential` instance optimized for all local development tools. This example requires the environment variable `AZURE_TOKEN_CREDENTIALS` set to `dev`. For more information, see [Exclude a credential type category](/azure/developer/javascript/sdk/authentication/credential-chains#exclude-a-credential-type-category).

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
