---
title: 'Credential chains in the Azure Identity library for JavaScript'
description: 'This article describes the DefaultAzureCredential and ChainedTokenCredential classes in the Azure Identity library for JavaScript.'
ms.topic: concept-article
ms.date: 10/09/2025
ms.custom: devx-track-js
ai-usage: ai-generated
---

# Credential chains in the Azure Identity library for JavaScript

The Azure Identity library provides *credentials*&mdash;public classes that implement the Azure Core library's [TokenCredential](/javascript/api/@azure/identity/tokencredential) interface. A credential represents a distinct authentication flow for acquiring an access token from Microsoft Entra ID. These credentials can be chained together to form an ordered sequence of authentication mechanisms to be attempted.

## How a chained credential works

At runtime, a credential chain attempts to authenticate using the sequence's first credential. If that credential fails to acquire an access token, the next credential in the sequence is attempted, and so on, until an access token is successfully obtained. The following sequence diagram illustrates this behavior:

:::image type="content" source="../media/mermaidjs/chain-sequence.svg" alt-text="Diagram of a credential chain sequence showing authentication attempts progressing through multiple credentials until an access token is obtained.":::

## Why use credential chains

A chained credential can offer the following benefits:

- **Environment awareness**: Automatically selects the most appropriate credential based on the environment in which the app is running. Without it, you'd have to write code like this:

    ```javascript
    import { 
        ManagedIdentityCredential, 
        AzureCliCredential 
    } from "@azure/identity";

    let credential;
    if (process.env.NODE_ENV === "production") {
        credential = new ManagedIdentityCredential();
    } else {
        credential = new AzureCliCredential();
    }
    ```

- **Seamless transitions**: Your app can move from local development to your staging or production environment without changing authentication code.
- **Improved resiliency**: Includes a fallback mechanism that moves to the next credential when the prior fails to acquire an access token.

## How to choose a chained credential

There are two different approaches to credential chaining:

- **"Tear down" a chain**: Start with a preconfigured chain and exclude what you don't need. For this approach, see the [DefaultAzureCredential overview](#defaultazurecredential-overview) section.
- **"Build up" a chain**: Start with an empty chain and include only what you need. For this approach, see the [ChainedTokenCredential overview](#chainedtokencredential-overview) section.

## DefaultAzureCredential overview

[DefaultAzureCredential](/javascript/api/@azure/identity/defaultazurecredential) is an opinionated, preconfigured chain of credentials. It's designed to support many environments, along with the most common authentication flows and developer tools. In graphical form, the underlying chain looks like this:

:::image type="content" source="../media/mermaidjs/default-azure-credential-authentication-flow-inline.svg" alt-text="Diagram of a credential chain sequence showing authentication attempts progressing through multiple credentials until an access token is obtained." lightbox="../media/mermaidjs/default-azure-credential-authentication-flow-expanded.png":::

The order in which `DefaultAzureCredential` attempts credentials follows.

| Order | Credential          | Description | Enabled by default? |
|-------|---------------------|-------------|---------------------|
| 1     | [Environment][env-cred]         |Reads a collection of [environment variables][env-vars] to determine if an application service principal (application user) is configured for the app. If so, `DefaultAzureCredential` uses these values to authenticate the app to Azure. This method is most often used in server environments but can also be used when developing locally.             | Yes                 |
| 2     | [Workload Identity][wi-cred]   |If the app is deployed to an Azure host with Workload Identity enabled, authenticate that account.             | Yes                 |
| 3     | [Managed Identity][mi-cred]    |If the app is deployed to an Azure host with Managed Identity enabled, authenticate the app to Azure using that Managed Identity.             | Yes                 |
| 4     | [Visual Studio Code][vsc-cred] |If the developer authenticated via Visual Studio Code's [Azure Resources extension][vsc-ext] and the [@azure/identity-vscode package][vsc-plugin-pkg] is installed, authenticate that account.             | Yes |
| 5     | [Azure CLI][az-cred]           |If the developer authenticated to Azure using Azure CLI's `az login` command, authenticate the app to Azure using that same account.             | Yes                 |
| 6     | [Azure PowerShell][pwsh-cred]    |If the developer authenticated to Azure using Azure PowerShell's `Connect-AzAccount` cmdlet, authenticate the app to Azure using that same account.             | Yes                 |
| 7     | [Azure Developer CLI][azd-cred] |If the developer authenticated to Azure using Azure Developer CLI's `azd auth login` command, authenticate with that account.             | Yes                 |
| 8     | [Broker][broker-cred] |Authenticates using the default account logged into the OS via a broker. Requires that the [@azure/identity-broker package][broker-plugin-pkg] is installed. | Yes |

[env-cred]: /javascript/api/@azure/identity/environmentcredential
[wi-cred]: /javascript/api/@azure/identity/workloadidentitycredential
[mi-cred]: /javascript/api/@azure/identity/managedidentitycredential
[vsc-cred]: /javascript/api/@azure/identity/visualstudiocodecredential
[az-cred]: /javascript/api/@azure/identity/azureclicredential
[pwsh-cred]: /javascript/api/@azure/identity/azurepowershellcredential
[azd-cred]: /javascript/api/@azure/identity/azuredeveloperclicredential
[broker-cred]: /javascript/api/@azure/identity/interactivebrowsercredential
[vsc-ext]: https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azureresourcegroups
[vsc-plugin-pkg]: https://www.npmjs.com/package/@azure/identity-vscode
[broker-plugin-pkg]: https://www.npmjs.com/package/@azure/identity-broker

In its simplest form, you can use the parameterless version of `DefaultAzureCredential` as follows:

```javascript
import { DefaultAzureCredential } from "@azure/identity";
import { BlobServiceClient } from "@azure/storage-blob";

// Acquire a credential object
const credential = new DefaultAzureCredential();

const blobServiceClient = new BlobServiceClient(
    `https://${storageAccountName}.blob.core.windows.net`,
    credential
);
```

### How to customize DefaultAzureCredential

The following sections describe strategies for controlling which credentials are included in the chain.

#### Exclude a credential type category

To exclude all `Developer tool` or `Deployed service` credentials, set environment variable `AZURE_TOKEN_CREDENTIALS` to `prod` or `dev`, respectively. When a value of `prod` is used, the underlying credential chain looks as follows:

:::image type="content" source="../media/mermaidjs/default-azure-credential-environment-variable-production.svg" alt-text="Diagram of a credential chain sequence showing authentication attempts progressing through multiple credentials until an access token is obtained.":::

When a value of `dev` is used, the chain looks as follows:

:::image type="content" source="../media/mermaidjs/default-azure-credential-environment-variable-development.svg" alt-text="Diagram of DefaultAzureCredential chain with AZURE_TOKEN_CREDENTIALS set to 'dev', showing Developer tool credentials used for authentication.":::

To ensure the environment variable is defined and set to a supported string, set the [requiredEnvVars](/javascript/api/@azure/identity/defaultazurecredentialoptions#@azure-identity-defaultazurecredentialoptions-requiredenvvars) property to `AZURE_TOKEN_CREDENTIALS`:

```javascript
const credential = new DefaultAzureCredential({ 
    requiredEnvVars: [ "AZURE_TOKEN_CREDENTIALS" ]
});
```

#### Use a specific credential

To exclude all credentials except for one, set environment variable `AZURE_TOKEN_CREDENTIALS` to the credential name. For example, you can reduce the `DefaultAzureCredential` chain to `AzureCliCredential` by setting `AZURE_TOKEN_CREDENTIALS` to `AzureCliCredential`. The string comparison is performed in a case-insensitive manner. Valid string values for the environment variable include:

- `AzureCliCredential`
- `AzureDeveloperCliCredential`
- `AzurePowerShellCredential`
- `EnvironmentCredential`
- `ManagedIdentityCredential`
- `VisualStudioCodeCredential`
- `WorkloadIdentityCredential`

> [!IMPORTANT]
> The `AZURE_TOKEN_CREDENTIALS` environment variable supports individual credential names in `@azure/identity` package versions 4.11.0 and later.

To ensure the environment variable is defined and set to a supported string, set property [requiredEnvVars](/javascript/api/@azure/identity/defaultazurecredentialoptions#@azure-identity-defaultazurecredentialoptions-requiredenvvars) to `AZURE_TOKEN_CREDENTIALS`:

```javascript
const credential = new DefaultAzureCredential({ 
    requiredEnvVars: [ "AZURE_TOKEN_CREDENTIALS" ]
});
```

## ChainedTokenCredential overview

[ChainedTokenCredential](/javascript/api/@azure/identity/chainedtokencredential) is an empty chain to which you add credentials to suit your app's needs. For example:

```javascript
import { 
    ChainedTokenCredential, 
    AzureCliCredential, 
    VisualStudioCodeCredential 
} from "@azure/identity";

const credential = new ChainedTokenCredential(
    new AzureCliCredential(),
    new VisualStudioCodeCredential()
);

const blobServiceClient = new BlobServiceClient(
    `https://${storageAccountName}.blob.core.windows.net`,
    credential
);
```

The preceding code sample creates a tailored credential chain comprised of two development-time credentials. `AzureCliCredential` is attempted first, followed by `VisualStudioCodeCredential`, if necessary. In graphical form, the chain looks like this:

:::image type="content" source="../media/mermaidjs/chained-token-credential-authentication-developer-flow.svg" alt-text="Diagram of a credential chain showing AzureCliCredential as the first attempt and VisualStudioCodeCredential as the fallback.":::

> [!TIP]
> For improved performance, optimize credential ordering in `ChainedTokenCredential` from most to least used credential.

## Usage guidance for DefaultAzureCredential

`DefaultAzureCredential` is undoubtedly the easiest way to get started with the Azure Identity library, but with that convenience comes tradeoffs. Once you deploy your app to Azure, you should understand the app's authentication requirements. For that reason, replace `DefaultAzureCredential` with a specific `TokenCredential` implementation, such as `ManagedIdentityCredential`.

Here's why:

- **Debugging challenges**: When authentication fails, it can be challenging to debug and identify the offending credential. You must enable logging to see the progression from one credential to the next and the success/failure status of each. For more information, see [Debug a credential](#debug-a-credential).
- **Performance overhead**: The process of sequentially trying multiple credentials can introduce performance overhead. For example, when running on a local development machine, managed identity is unavailable. Consequently, `ManagedIdentityCredential` always fails in the local development environment.
- **Unpredictable behavior**: `DefaultAzureCredential` checks for the presence of certain [environment variables][env-vars]. It's possible that someone could add or modify these environment variables at the system level on the host machine. Those changes apply globally and therefore alter the behavior of `DefaultAzureCredential` at runtime in any app running on that machine.

## Debug a credential

To diagnose an unexpected issue or to understand what a credential is doing, [enable logging](../debug-client-libraries.md) in your app. For example:

```javascript
import { setLogLevel, AzureLogger } from "@azure/logger";
import { BlobServiceClient } from "@azure/storage-blob";
import { DefaultAzureCredential } from "@azure/identity";

// Constant for the Azure Identity log prefix
const AZURE_IDENTITY_LOG_PREFIX = "azure:identity";

// override logging to output to console.log (default location is stderr)
// only log messages that start with the Azure Identity log prefix
setLogLevel("verbose");
AzureLogger.log = (...args) => {
  const message = args[0];
  if (typeof message === 'string' && message.startsWith(AZURE_IDENTITY_LOG_PREFIX)) {
    console.log(...args);
  }
};

// Get storage account name from environment variable
const storageAccountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;

if (!storageAccountName) {
    throw new Error("AZURE_STORAGE_ACCOUNT_NAME environment variable is required");
}

const credential = new DefaultAzureCredential({ 
    requiredEnvVars: [ "AZURE_TOKEN_CREDENTIALS" ]
});


const blobServiceClient = new BlobServiceClient(
    `https://${storageAccountName}.blob.core.windows.net`,
    credential
);
```

```console
azure:identity:info EnvironmentCredential => Found the following environment variables: 
azure:identity:verbose EnvironmentCredential => AZURE_CLIENT_SEND_CERTIFICATE_CHAIN: undefined; sendCertificateChain: false
azure:identity:info WorkloadIdentityCredential => Found the following environment variables:
azure:identity:warning DefaultAzureCredential => Skipped createDefaultWorkloadIdentityCredential because of an error creating the credential: CredentialUnavailableError: WorkloadIdentityCredential: is unavailable. clientId is a required parameter. In DefaultAzureCredential and ManagedIdentityCredential, this can be provided as an environment variable - "AZURE_CLIENT_ID".
        See the troubleshooting guide for more information: https://aka.ms/azsdk/js/identity/workloadidentitycredential/troubleshoot
azure:identity:info ManagedIdentityCredential => Using DefaultToImds managed identity.
azure:identity:warning DefaultAzureCredential => Skipped createDefaultBrokerCredential because of an error creating the credential: Error: Broker for WAM was requested, but no plugin was configured or no authentication record was found. You must install the @azure/identity-broker plugin package (npm install --save @azure/identity-broker) and enable it by importing `useIdentityPlugin` from `@azure/identity` and calling useIdentityPlugin(nativeBrokerPlugin) before using enableBroker.
azure:identity:info DefaultAzureCredential => getToken() => Skipping createDefaultWorkloadIdentityCredential, reason: WorkloadIdentityCredential: is unavailable. clientId is a required parameter. In DefaultAzureCredential and ManagedIdentityCredential, this can be provided as an environment variable - "AZURE_CLIENT_ID".
        See the troubleshooting guide for more information: https://aka.ms/azsdk/js/identity/workloadidentitycredential/troubleshoot
azure:identity:info ManagedIdentityCredential => getToken() => Using the MSAL provider for Managed Identity.
azure:identity:info ManagedIdentityCredential - Token Exchange => ManagedIdentityCredential - Token Exchange: Unavailable. The environment variables needed are: AZURE_CLIENT_ID (or the client ID sent through the parameters), AZURE_TENANT_ID and AZURE_FEDERATED_TOKEN_FILE
azure:identity:info ManagedIdentityCredential => getToken() => MSAL Identity source: DefaultToImds
azure:identity:info ManagedIdentityCredential => getToken() => Using the IMDS endpoint to probe for availability.
azure:identity:info ManagedIdentityCredential - IMDS => ManagedIdentityCredential - IMDS: Pinging the Azure IMDS endpoint
azure:identity:verbose ManagedIdentityCredential - IMDS => ManagedIdentityCredential - IMDS: Caught error RestError: connect ENETUNREACH 169.254.169.254:80
azure:identity:info ManagedIdentityCredential - IMDS => ManagedIdentityCredential - IMDS: The Azure IMDS endpoint is unavailable
azure:identity:error ManagedIdentityCredential => getToken() => ERROR. Scopes: https://storage.azure.com/.default. Error message: Attempted to use the IMDS endpoint, but it is not available..
azure:identity:info AzureCliCredential => getToken() => Using the scope https://storage.azure.com/.default
azure:identity:info AzureCliCredential => getToken() => expires_on is available and is valid, using it
azure:identity:info AzureCliCredential => getToken() => SUCCESS. Scopes: https://storage.azure.com/.default.
```

In the preceding output, notice that:

- `createDefaultBrokerCredential` was skipped.
- The `DefaultAzureCredential` succeeded using `AzureCliCredential`.

<!-- LINKS -->
[env-vars]: https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/identity/identity/README.md#environment-variables