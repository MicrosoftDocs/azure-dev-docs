---
title: Credential chains in the Azure Identity client library for JavaScript
description: This article describes the DefaultAzureCredential and ChainedTokenCredential classes in the Azure Identity client library.
ms.date: 09/10/2024
ms.topic: conceptual
ms.custom: devx-track-js
---

# Credential chains in the Azure Identity client library for JavaScript

The Azure Identity client library provides *credentials*&mdash;public classes that implement the Azure Core library's [TokenCredential](/javascript/api/@azure/ms-rest-js/topiccredentials) protocol. A credential represents a distinct authentication flow for acquiring an access token from Microsoft Entra ID. These credentials can be chained together to form an ordered sequence of authentication mechanisms to be attempted.

## How a chained credential works

At runtime, a credential chain attempts to authenticate using the sequence's first credential. If that credential fails to acquire an access token, the next credential in the sequence is attempted, and so on, until an access token is successfully obtained. The following sequence diagram illustrates this behavior:

TBD: IMAGE/Mermaid

## Why use credential chains

A chained credential can offer the following benefits:

- **Environment awareness**: Automatically selects the most appropriate credential based on the environment in which the app is running. 

    _Without it_, you have to detect the environment in your code like this:

    ```javascript
    const { ManagedIdentityCredential, AzureCliCredential } = require("@azure/identity");
    
    let credential;

    // Without chained credentials, you have to detect environment
    if (process.env.production) {
        credential = new ManagedIdentityCredential("<YOUR_CLIENT_ID>");
    } else {
        credential = new AzureCliCredential();
    }
    ```

- **Seamless transitions**: Your app can move from local development to your staging or production environment without changing authentication code.
- **Improved resiliency**: Includes a fallback mechanism that moves to the next credential when the prior fails to acquire an access token.

## How to choose a chained credential

In JavaScript, the philosophy for credential chaining is to **"build up" a chain**. Start with an empty chain and include only what you need. For this approach, see the [ChainedTokenCredential overview](#chainedtokencredential-overview) section.

## DefaultAzureCredential overview

[DefaultAzureCredential](/javascript/api/%40azure/identity/defaultazurecredential) is an opinionated, preconfigured chain of credentials. It's designed to support many environments, along with the most common authentication flows and developer tools. In graphical form, the underlying chain looks like this:

TBD: image

The order in which `DefaultAzureCredential` attempts credentials follows.

| Order | Credential          | Description | Enabled by default? |
|-------|---------------------|-------------|---------------------|
| 1     | [Environment][env-cred]         |Reads a collection of environment variables to determine if an application service principal (application user) is configured for the app. If so, `DefaultAzureCredential` uses these values to authenticate the app to Azure. This method is most often used in server environments but can also be used when developing locally.             | Yes                 |
| 2     | [Workload Identity][wi-cred]   |If the app is deployed to an Azure host with Workload Identity enabled, authenticate that account.             | Yes                 |
| 3     | [Managed Identity][mi-cred]    |If the app is deployed to an Azure host with Managed Identity enabled, authenticate the app to Azure using that Managed Identity.             | Yes                 |
| 4     | [Azure CLI][az-cred]           |If the developer authenticated to Azure using Azure CLI's `az login` command, authenticate the app to Azure using that same account.             | Yes                 |
| 5     | [Azure PowerShell][pwsh-cred]    |If the developer authenticated to Azure using Azure PowerShell's `Connect-AzAccount` cmdlet, authenticate the app to Azure using that same account.             | Yes                 |
| 6     | [Azure Developer CLI][azd-cred] |If the developer authenticated to Azure using Azure Developer CLI's `azd auth login` command, authenticate with that account.             | Yes                 |

[env-cred]: /javascript/api/@azure/identity/environmentcredential
[wi-cred]: /javascript/api/@azure/identity/workloadidentitycredential
[mi-cred]: /javascript/api/@azure/identity/managedidentitycredential
[az-cred]: /javascript/api/@azure/identity/azureclicredential
[pwsh-cred]: /javascript/api/@azure/identity/azurepowershellcredential
[azd-cred]: /javascript/api/@azure/identity/azuredeveloperclicredential

In its simplest form, you can use the parameterless version of `DefaultAzureCredential` as follows:

```javascript
const { DefaultAzureCredential } = require("@azure/identity");
const { BlobServiceClient } = require("@azure/storage-blob");

// Acquire a credential object
const credential = new DefaultAzureCredential();

const blobServiceClient = new BlobServiceClient(
    "https://<my_account_name>.blob.core.windows.net",
    credential
);
```

### How to customize DefaultAzureCredential

To specify the credential selected, when more than one is available in the chain, use the options parameter. The DefaultAzureCredential has three option types to choose from:

| Scenario | Options  |
|--|--|
| Multiple Entra clients such as **user-assigned managed identity** and **service principals** | [DefaultAzureCredentialClientIdOptions](/javascript/api/%40azure/identity/defaultazurecredentialclientidoptions) |
| Multiple Entra resources such as **system-assigned managed identity**        | [DefaultAzureCredentialResourceIdOptions](/javascript/api/%40azure/identity/defaultazurecredentialresourceidoptions) |
| Multiple tenants| [DefaultAzureCredentialOptions](/javascript/api/%40azure/identity/defaultazurecredentialoptions)   |

You can specify one specific item for that part of the chain. If you need to add more than 1 type of that credential type in the chain, you should use the [ChainedTokenCredential](#chained-token-credential)

### User-assigned managed identity

Use the following code to specify the user-assigned managed identity or service principal to be used by the **ManagedIdentityCredential**.

```javascript
const { DefaultAzureCredential } = require("@azure/identity");
const { BlobServiceClient } = require("@azure/storage-blob");

const credential = new DefaultAzureCredential({
    managedIdentityClientId: "YOUR_ENTRA_CLIENT_ID"
});

const blobServiceClient = new BlobServiceClient(
    "https://<my_account_name>.blob.core.windows.net",
    credential
);
```

Use the following code to specify the user-assigned managed identity or service principal to be used by the **WorkloadIdentityCredential**.

```javascript
const { DefaultAzureCredential } = require("@azure/identity");
const { BlobServiceClient } = require("@azure/storage-blob");

const credential = new DefaultAzureCredential({
    workloadIdentityClientId: "YOUR_ENTRA_CLIENT_ID"
});

const blobServiceClient = new BlobServiceClient(
    "https://<my_account_name>.blob.core.windows.net",
    credential
);
```

### System-assigned managed identity

Use the following code to specify the system-assigned managed identity to be used by the **ManagedIdentityCredential**. The resource ID specifies the Azure resource to manage.

```javascript
const { DefaultAzureCredential } = require("@azure/identity");
const { BlobServiceClient } = require("@azure/storage-blob");

const credential = new DefaultAzureCredential({
    managedIdentityResourceId: "YOUR_ENTRA_CLIENT_ID"
});

const blobServiceClient = new BlobServiceClient(
    "https://<my_account_name>.blob.core.windows.net",
    credential
);
```

### Tenants

Use the following code to specify the tenant to be used by the **ManagedIdentityCredential**. The resource ID specifies the Azure resource to such as Azure App Service or Azure Functions App.

```javascript
const { DefaultAzureCredential } = require("@azure/identity");
const { BlobServiceClient } = require("@azure/storage-blob");

const credential = new DefaultAzureCredential({
    managedIdentityResourceId: "YOUR_AZURE_RESOURCE_ID"
});

const blobServiceClient = new BlobServiceClient(
    "https://<my_account_name>.blob.core.windows.net",
    credential
);
```

## ChainedTokenCredential overview

[ChainedTokenCredential](/javascript/api/@azure/identity/chainedtokencredential) is an empty chain to which you add credentials to suit your app's needs. For example:

```javascript
const credential = ChainedTokenCredential(
    ManagedIdentityCredential("<YOUR_CLIENT_ID>"),
    AzureCliCredential()
)
```

The preceding code sample creates a tailored credential chain comprised of two credentials. The user-assigned managed identity variant of `ManagedIdentityCredential` is attempted first, followed by `AzureCliCredential`, if necessary. In graphical form, the chain looks like this:

:::image type="content" source="../media/mermaidjs/chained-token-credential-auth-flow.svg" alt-text="Diagram that shows authentication flow for a ChainedTokenCredential instance that is composed of managed identity credential and Azure CLI credential.":::

> [!TIP]
> For improved performance, optimize credential ordering in `ChainedTokenCredential` for your production environment. Credentials intended for use in the local development environment should be added last.

## Usage guidance for DefaultAzureCredential

`DefaultAzureCredential` is undoubtedly the easiest way to get started with the Azure Identity client library, but with that convenience comes tradeoffs. Once you deploy your app to Azure, you should understand the app's authentication requirements. For that reason, strongly consider moving from `DefaultAzureCredential` to one of the following solutions:

- A specific credential implementation, such as `ManagedIdentityCredential`.
- A pared-down `ChainedTokenCredential` implementation optimized for the Azure environment in which your app runs.

Here's why:

- **Debugging challenges**: When authentication fails, it can be challenging to debug and identify the offending credential. You must enable logging to see the progression from one credential to the next and the success/failure status of each. For more information, see [Debug a chained credential](#debug-a-chained-credential).
- **Performance overhead**: The process of sequentially trying multiple credentials can introduce performance overhead. For example, when running on a local development machine, managed identity is unavailable. Consequently, `ManagedIdentityCredential` always fails in the local development environment, unless explicitly disabled via its corresponding `exclude`-prefixed property.
- **Unpredictable behavior**: `DefaultAzureCredential` checks for the presence of certain [environment variables](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/identity/azure-identity#environment-variables). It's possible that someone could add or modify these environment variables at the system level on the host machine. Those changes apply globally and therefore alter the behavior of `DefaultAzureCredential` at runtime in any app running on that machine.

## Debug a chained credential

To diagnose an unexpected issue or to understand what a chained credential is doing, [enable logging](../azure-sdk-logging.md) in your app. Optionally, filter the logs to only those events emitted from the Azure Identity client library. For example:

```javascript
const { DefaultAzureCredential } = require("@azure/identity");
const winston = require("winston");

// Create a logger instance
const logger = winston.createLogger({
    level: 'debug',
    format: winston.format.simple(),
    transports: [
        new winston.transports.Console()
    ]
});

// Optional: Output logging levels to the console.
console.log(
    `Logger enabled for ERROR=${logger.isLevelEnabled('error')}, ` +
    `WARNING=${logger.isLevelEnabled('warn')}, ` +
    `INFO=${logger.isLevelEnabled('info')}, ` +
    `DEBUG=${logger.isLevelEnabled('debug')}`
);

// Acquire a credential object
const credential = new DefaultAzureCredential();
```

For illustration purposes, assume the parameterless form of `DefaultAzureCredential` is used to authenticate a request to a blob storage account. The app runs in the local development environment, and the developer authenticated to Azure using the Azure CLI. Assume also that the logging level is set to `logging.DEBUG`. When the app is run, the following pertinent entries appear in the output:

```output
Logger enabled for ERROR=True, WARNING=True, INFO=True, DEBUG=True
No environment configuration found.
ManagedIdentityCredential will use IMDS
EnvironmentCredential.get_token failed: EnvironmentCredential authentication unavailable. Environment variables are not fully configured.
Visit https://aka.ms/azsdk/js/identity/environmentcredential/troubleshoot to troubleshoot this issue.
ManagedIdentityCredential.get_token failed: ManagedIdentityCredential authentication unavailable, no response from the IMDS endpoint.     
SharedTokenCacheCredential.get_token failed: SharedTokenCacheCredential authentication unavailable. No accounts were found in the cache.
AzureCliCredential.get_token succeeded
[Authenticated account] Client ID: 00001111-aaaa-2222-bbbb-3333cccc4444. Tenant ID: aaaabbbb-0000-cccc-1111-dddd2222eeee. User Principal Name: unavailableUpn. Object ID (user): aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb
DefaultAzureCredential acquired a token from AzureCliCredential
```

In the preceding output, notice that:

- `EnvironmentCredential`, `ManagedIdentityCredential`, and `SharedTokenCacheCredential` each failed to acquire a Microsoft Entra access token, in that order.
- The `AzureCliCredential.get_token` call succeeds and the output also indicates that `DefaultAzureCredential` acquired a token from `AzureCliCredential`. Since `AzureCliCredential` succeeded, no credentials beyond it were tried.

> [!NOTE]
> In the preceding example, the logging level is set to `logging.DEBUG`. Be careful when using this logging level, as it can output sensitive information. For example, in this case, the client ID, tenant ID, and the object ID of the developer's user principal in Azure. All traceback information has been removed from the output for clarity.
