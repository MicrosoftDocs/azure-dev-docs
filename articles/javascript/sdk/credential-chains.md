---
title: Credential chains in the Azure Identity client library for JavaScript
description: This article describes the DefaultAzureCredential and ChainedTokenCredential classes in the Azure Identity client library for JavaScript.
ms.date: 09/10/2024
ms.topic: conceptual
ms.custom: devx-track-js
---

# Credential chains in the Azure Identity client library for JavaScript

The Azure Identity client library provides *credentials*&mdash;public classes that implement the Azure Core library's [TokenCredential](/javascript/api/@azure/identity/tokencredential) interface. A credential represents a distinct authentication flow for acquiring an access token from Microsoft Entra ID. These credentials can be chained together to form an ordered sequence of authentication mechanisms to be attempted.

## How a chained credential works

At runtime, a credential chain attempts to authenticate using the sequence's first credential. If that credential fails to acquire an access token, the next credential in the sequence is attempted, and so on, until an access token is successfully obtained. The following sequence diagram illustrates this behavior:

:::image type="content" source="/azure/developer/python/sdk/media/mermaidjs/chain-sequence.svg" alt-text="Diagram showing Azure Identity credential sequence flow.":::

## Why use credential chains

A chained credential can offer the following benefits:

- **Environment awareness**: Automatically selects the most appropriate credential based on the environment in which the app is running. 

    _Without it_, you have to detect the environment in your code like this:

<<<<<<< HEAD
    ```javascript
    import { ManagedIdentityCredential, AzureCliCredential } from "@azure/identity";
=======
    ```nodejs
    const { ManagedIdentityCredential, AzureCliCredential } = require("@azure/identity");
>>>>>>> 57ebb2df3a3ec0fcc38b447b1afc555f447fafc9
    
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

In JavaScript, the philosophy for credential chaining is to **"build up" a chain**. Start with an empty chain and include only what you need. For this approach, see the [ChainedTokenCredential overview](#use-chainedtokencredential-for-granular-credential-control) section.

## DefaultAzureCredential overview

[DefaultAzureCredential](/javascript/api/%40azure/identity/defaultazurecredential) is an opinionated, preconfigured chain of credentials. It's designed to support many environments, along with the most common authentication flows and developer tools. In graphical form, the underlying chain looks like this:

:::image type="content" source="https://raw.githubusercontent.com/Azure/azure-sdk-for-js/main/sdk/identity/identity/images/mermaidjs/DefaultAzureCredentialAuthFlow.svg" alt-text="Diagram of Azure Identity default credential chain flow.":::

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
import { DefaultAzureCredential } from "@azure/identity";
import { BlobServiceClient } from "@azure/storage-blob";

// Acquire a credential object
const credential = new DefaultAzureCredential();

const blobServiceClient = new BlobServiceClient(
    "https://<my_account_name>.blob.core.windows.net",
    credential
);
```

<<<<<<< HEAD
### How to customize DefaultAzureCredential

To specify the credential selected, when more than one is available in the chain, use the options parameter. The DefaultAzureCredential has three option types to choose from:

| Scenario | Options  |
|--|--|
| [Specify user-assigned managed identity]() | [DefaultAzureCredentialClientIdOptions](/javascript/api/%40azure/identity/defaultazurecredentialclientidoptions) |
| [Specify system-assigned managed identity]()| [DefaultAzureCredentialResourceIdOptions](/javascript/api/%40azure/identity/defaultazurecredentialresourceidoptions) |
| [Specify tenant](#customize-for-tenant)| [DefaultAzureCredentialOptions](/javascript/api/%40azure/identity/defaultazurecredentialoptions)   |

You can specify one specific item for that part of the chain. If you need to add more than 1 type of that credential type in the chain, you should use the [ChainedTokenCredential](#use-chainedtokencredential-for-granular-credential-control)

### Customize for user-assigned managed identity

Use the following code to specify the user-assigned managed identity or service principal to be used by the **ManagedIdentityCredential**.

```javascript
import { DefaultAzureCredential } from "@azure/identity";
import { BlobServiceClient } from "@azure/storage-blob";

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
import { DefaultAzureCredential } from "@azure/identity";
import { BlobServiceClient } from "@azure/storage-blob";

const credential = new DefaultAzureCredential({
    workloadIdentityClientId: "YOUR_ENTRA_CLIENT_ID"
});

const blobServiceClient = new BlobServiceClient(
    "https://<my_account_name>.blob.core.windows.net",
    credential
);
```

### Customize system-assigned managed identity

Use the following code to specify the system-assigned managed identity to be used by the **ManagedIdentityCredential**. The resource ID specifies the Azure resource to manage.

```javascript
import { DefaultAzureCredential } from "@azure/identity";
import { BlobServiceClient } from "@azure/storage-blob";

const credential = new DefaultAzureCredential({
    managedIdentityResourceId: "YOUR_RESOURCE_ID"
});

const blobServiceClient = new BlobServiceClient(
    "https://<my_account_name>.blob.core.windows.net",
    credential
);
```

### Customize for tenant

Use the following code to specify the tenant to be used by the **ManagedIdentityCredential**. The resource ID specifies the Azure resource to such as Azure App Service or Azure Functions App.

```javascript
import { DefaultAzureCredential } from "@azure/identity";
import { BlobServiceClient } from "@azure/storage-blob";

const credential = new DefaultAzureCredential({
    tenantId: "YOUR_TENANT_ID"
});

const blobServiceClient = new BlobServiceClient(
    "https://<my_account_name>.blob.core.windows.net",
    credential
);
```

=======
>>>>>>> 57ebb2df3a3ec0fcc38b447b1afc555f447fafc9
## Usage guidance for DefaultAzureCredential

`DefaultAzureCredential` is undoubtedly the easiest way to get started with the Azure Identity client library, but with that convenience comes tradeoffs. Once you deploy your app to Azure, you should understand the app's authentication requirements. For that reason, strongly consider moving from `DefaultAzureCredential` to one of the following solutions:

- A specific credential implementation, such as `ManagedIdentityCredential`.
- A pared-down `ChainedTokenCredential` implementation optimized for the Azure environment in which your app runs.

Here's why:

- **Debugging challenges**: When authentication fails, it can be challenging to debug and identify the offending credential. You must enable logging to see the progression from one credential to the next and the success/failure status of each. For more information, see [Debug a chained credential](#debug-a-chained-credential).
- **Performance overhead**: The process of sequentially trying multiple credentials can introduce performance overhead. For example, when running on a local development machine, managed identity is unavailable. Consequently, `ManagedIdentityCredential` always fails in the local development environment.
- **Unpredictable behavior**: `DefaultAzureCredential` checks for the presence of certain [environment variables](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/identity/azure-identity#environment-variables). It's possible that someone could add or modify these environment variables at the system level on the host machine. Those changes apply globally and therefore alter the behavior of `DefaultAzureCredential` at runtime in any app running on that machine.


## Use ChainedTokenCredential for granular credential control

[ChainedTokenCredential](/javascript/api/@azure/identity/chainedtokencredential) is an empty chain to which you add credentials to suit your app's needs. For example, the following example adds a `ManagedIdentityCredential` instance, then an `AzureCliCredential` instance. 

```javascript
import { 
    ChainedTokenCredential, 
    ManagedIdentityCredential, 
    AzureCliCredential 
} from "@azure/identity";

const credential = ChainedTokenCredential(
    ManagedIdentityCredential("<YOUR_CLIENT_ID>"),
    AzureCliCredential()
)
```

The preceding code sample creates a tailored credential chain comprised of two credentials. The user-assigned managed identity variant of `ManagedIdentityCredential` is attempted first, followed by `AzureCliCredential`, if necessary. In graphical form, the chain looks like this:

:::image type="content" source="/azure/developer/python/sdk/media/mermaidjs/chained-token-credential-auth-flow.svg" alt-text="Diagram showing Azure Identity chain credential of managed identity and Azure CLI.":::

> [!TIP]
> For improved performance, optimize credential ordering in `ChainedTokenCredential` for your production environment. Credentials intended for use in the local development environment should be added last.

## Debug a chained credential

To diagnose an unexpected issue or to understand what a chained credential is doing, [enable logging](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/core#logging) in your app. 

1. Create `index.js` with the following code:

    ```javascript
    import { 
        ChainedTokenCredential, 
        ManagedIdentityCredential, 
        AzureCliCredential 
    } from "@azure/identity";
    import { BlobServiceClient } from "@azure/storage-blob";
    
    const credential = new ChainedTokenCredential(
        new ManagedIdentityCredential(),
        new AzureCliCredential()
    );
    
    const blobServiceClient = new BlobServiceClient(
        "https://dinaberrystor.blob.core.windows.net",
        credential
    );
    
    const containerName = "my-data";
    
    // get container properties
    const containerClient = blobServiceClient.getContainerClient(containerName);
    
    async function main(){
        const properties = await containerClient.getProperties();
        console.log(properties);
    }
    
    main().catch((err) => {
        console.error("Error running sample:", err.message);
    });
    ```

2. Install the npm dependencies.

    ```bash
    npm instal @azure/identity @azure/storage-blob
    ```

3. Sign into your Azure subscription in your local environment with Azure CLI:

    ```azurecli
    az login
    ```
    

4. Run the app in that same environment with the following command:

    ```bash
    AZURE_LOG_LEVEL=verbose node index.js
    ```
    

When the app is run, the following pertinent entries appear in the output:

```output
azure:core-client:warning The baseUri option for SDK Clients has been deprecated, please use endpoint instead.
azure:core-client:warning The baseUri option for SDK Clients has been deprecated, please use endpoint instead.
azure:storage-blob:info RetryPolicy: =====> Try=1 Primary
azure:identity:info ManagedIdentityCredential(MSAL) => getToken() => Using the MSAL provider for Managed Identity.
azure:identity:info ManagedIdentityCredential - Token Exchange => ManagedIdentityCredential - Token Exchange: Unavailable. The environment v
ariables needed are: AZURE_CLIENT_ID (or the client ID sent through the parameters), AZURE_TENANT_ID and AZURE_FEDERATED_TOKEN_FILE
azure:identity:info ManagedIdentityCredential(MSAL) => getToken() => Using the IMDS endpoint to probe for availability.
azure:identity:info ManagedIdentityCredential - IMDS => ManagedIdentityCredential - IMDS: Pinging the Azure IMDS endpoint
azure:core-rest-pipeline retryPolicy:info Retry 0: Attempting to send request 3941fc44-d241-4efa-8e41-86b9760bb825
azure:core-rest-pipeline:info Request: {
  "url": "http://169.254.169.254/metadata/identity/oauth2/token",
  "headers": {
    "accept": "application/json",
    "accept-encoding": "gzip,deflate",
    "user-agent": "azsdk-js-identity/4.4.1 core-rest-pipeline/1.17.0 Node/20.13.1 OS/(x64-Windows_NT-10.0.26100)",
    "x-ms-client-request-id": "3941fc44-d241-4efa-8e41-86b9760bb825"
  },
  "method": "GET",
  "timeout": 1000,
  "disableKeepAlive": false,
  "withCredentials": false,
  "tracingOptions": {
    "tracingContext": {
      "_contextMap": {}
    }
  },
  "requestId": "3941fc44-d241-4efa-8e41-86b9760bb825",
  "allowInsecureConnection": true,
  "enableBrowserStreams": false
}
azure:core-rest-pipeline retryPolicy:error Retry 0: Received an error from request 3941fc44-d241-4efa-8e41-86b9760bb825
azure:core-rest-pipeline retryPolicy:info Retry 0: Maximum retries reached. Returning the last received response, or throwing the last recei
ved error.
azure:identity:verbose ManagedIdentityCredential - IMDS => ManagedIdentityCredential - IMDS: Caught error RestError: connect ENETUNREACH 169
.254.169.254:80
azure:identity:info ManagedIdentityCredential - IMDS => ManagedIdentityCredential - IMDS: The Azure IMDS endpoint is unavailable
azure:identity:error ManagedIdentityCredential(MSAL) => getToken() => ERROR. Scopes: https://storage.azure.com/.default. Error message: Mana
gedIdentityCredential: The managed identity endpoint is not available..
azure:identity:info AzureCliCredential => getToken() => Using the scope https://storage.azure.com/.default
azure:identity:info AzureCliCredential => getToken() => expires_on is available and is valid, using it
azure:identity:info AzureCliCredential => getToken() => SUCCESS. Scopes: https://storage.azure.com/.default.
azure:identity:info ChainedTokenCredential => getToken() => Result for AzureCliCredential: SUCCESS. Scopes: https://storage.azure.com/.defau
lt.
```

## More resources

* [Azure CLI](/cli/azure/install-azure-cli-windows)