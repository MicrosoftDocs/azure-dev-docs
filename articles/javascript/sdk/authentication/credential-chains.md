---
title: "Credential chains in the Azure library for JavaScript"
description: This article describes the DefaultAzureCredential and ChainedTokenCredential classes in the Azure Identity client library for JavaScript.
ms.date: 10/07/2025
ms.topic: concept-article
ms.custom: devx-track-js
#customer intent: As a JavaScript developer new to Azure, I want understand credential chains so that select the appropriate chain and understand how to configure and debug it.
---

# Credential chains in the Azure Identity client library for JavaScript

The Azure Identity library provides *credentials*&mdash;public classes that implement the Azure Core library's [TokenCredential](/javascript/api/@azure/identity/tokencredential) interface. A credential represents a distinct authentication flow for acquiring an access token from Microsoft Entra ID. These credentials can be chained together to form an ordered sequence of authentication mechanisms to be attempted.


## How a chained credential works

At runtime, a credential chain attempts to authenticate using the sequence's first credential. If that credential fails to acquire an access token, the next credential in the sequence is attempted, and so on, until an access token is successfully obtained. The following sequence diagram illustrates this behavior:

:::image type="content" source="../media/mermaidjs/chain-sequence.svg" alt-text="Diagram showing Azure Identity credential sequence flow.":::


## Why use credential chains

A chained credential can offer the following benefits:

- **Environment awareness**: Automatically selects the most appropriate credential based on the environment in which the app is running. Without it, you'd have to write code like this:

```javascript
import { ManagedIdentityCredential, VisualStudioCodeCredential } from "@azure/identity";

let credential;

if (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "staging") {
    credential = new ManagedIdentityCredential({
        clientId: userAssignedClientId
    });
} else {
    // local development environment
    credential = new VisualStudioCodeCredential();
}
```

- **Seamless transitions**: Your app can move from local development to your staging or production environment without changing authentication code.
- **Improved resiliency**: Includes a fallback mechanism that moves to the next credential when the prior fails to acquire an access token.

## How to choose a chained credential

There are two disparate philosophies to credential chaining:

- **"Tear down" a chain**: Start with a preconfigured chain and exclude what you don't need. For this approach, see the [DefaultAzureCredential overview](#defaultazurecredential-overview) section.
- **"Build up" a chain**: Start with an empty chain and include only what you need. For this approach, see the [ChainedTokenCredential overview](#chainedtokencredential-overview) section.

## DefaultAzureCredential overview

[DefaultAzureCredential](/javascript/api/%40azure/identity/defaultazurecredential) is an opinionated, preconfigured chain of credentials. It's designed to support many environments, along with the most common authentication flows and developer tools. In graphical form, the underlying chain looks like this:

:::image type="content" source="../media/mermaidjs/default-azure-credential-authentication-flow-inline.svg" alt-text="Diagram that shows DefaultAzureCredential authentication flow." lightbox="../media/mermaidjs/default-azure-credential-authentication-flow-expanded.png":::

The order in which `DefaultAzureCredential` attempts credentials follows.

| Order | Credential          | Description |
|-------|---------------------|-------------|
| 1     | [Environment][env-cred]         |Reads a collection of [environment variables][env-vars] to determine if an application service principal (application user) is configured for the app. If so, `DefaultAzureCredential` uses these values to authenticate the app to Azure. This method is most often used in server environments but can also be used when developing locally.             |
| 2     | [Workload Identity][wi-cred]   |If the app is deployed to an Azure host with Workload Identity enabled, authenticate that account.             |
| 3     | [Managed Identity][mi-cred]    |If the app is deployed to an Azure host with Managed Identity enabled, authenticate the app to Azure using that Managed Identity.             |
| 4     | [Visual Studio Code][vsc-cred] |If the developer authenticated via Visual Studio Code's [Azure Resources extension][vsc-ext] and the [@azure/identity-vscode package][vsc-plugin-pkg] is installed, authenticate that account.             |
| 5     | [Azure CLI][az-cred]           |If the developer authenticated to Azure using Azure CLI's `az login` command, authenticate the app to Azure using that same account.             |
| 6     | [Azure PowerShell][pwsh-cred]    |If the developer authenticated to Azure using Azure PowerShell's `Connect-AzAccount` cmdlet, authenticate the app to Azure using that same account.             |
| 7     | [Azure Developer CLI][azd-cred] |If the developer authenticated to Azure using Azure Developer CLI's `azd auth login` command, authenticate with that account.             |
| 8     | [Broker][broker-cred] |Authenticates using the default account logged into the OS via a broker. Requires that the [@azure/identity-broker package][broker-plugin-pkg] is installed.             |

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
    "https://<my_account_name>.blob.core.windows.net",
    credential
);
```

### How to customize DefaultAzureCredential

The following sections describe strategies for controlling which credentials are included in the chain.

#### Exclude an individual credential

To exclude an individual credential from `DefaultAzureCredential`, use the corresponding all `Developer tool` or `Deployed service` credentials, set environment variable `AZURE_TOKEN_CREDENTIALS` to `prod` or `dev`, respectively. When a value of `prod` is used, the underlying credential chain looks as follows:

:::image type="content" source="../media/mermaidjs/default-azure-credential-environment-variable-production.svg" alt-text="Diagram that shows DefaultAzureCredential with AZURE_TOKEN_CREDENTIALS set to 'prod'.":::

In the preceding code sample, `EnvironmentCredential`, `ManagedIdentityCredential`, and `WorkloadIdentityCredential` are removed from the credential chain. As a result, the first credential to be attempted is XYZ`. The modified chain contains only development-time credentials and looks like this:

TBD


> [!NOTE]
> `InteractiveBrowserCredential` is excluded by default and therefore isn't shown in the preceding diagram. To include `InteractiveBrowserCredential`, either pass `true` to constructor ABC or set property GHI to `false`.

As more `Exclude`-prefixed properties are set to `true` (credential exclusions are configured), the advantages of using `DefaultAzureCredential` diminish. In such cases, `ChainedTokenCredential` is a better choice and requires less code. To illustrate, these two code samples behave the same way:

### [DefaultAzureCredential](#tab/dac)

TBD

### [ChainedTokenCredential](#tab/ctc)

TBD

---


#### Exclude a credential type category

To exclude all `Developer tool` or `Deployed service` credentials, set environment variable `AZURE_TOKEN_CREDENTIALS` to `prod` or `dev`, respectively. When a value of `prod` is used, the underlying credential chain looks as follows:

TBD

When a value of `dev` is used, the chain looks as follows:

TBD

To ensure the environment variable is defined and set to a supported string, use TBD.

#### Use a specific credential

To exclude all credentials except for one, set environment variable `AZURE_TOKEN_CREDENTIALS` to the credential name. For example, you can reduce the `DefaultAzureCredential` chain to `VisualStudioCodeCredential` by setting `AZURE_TOKEN_CREDENTIALS` to `VisualStudioCodeCredential`. The string comparison is performed in a case-insensitive manner. Valid string values for the environment variable include:

- `AzureCliCredential`
- `AzureDeveloperCliCredential`
- `AzurePowerShellCredential`
- `BrokerCredential`
- `EnvironmentCredential`
- `InteractiveBrowserCredential`
- `ManagedIdentityCredential`
- `VisualStudioCodeCredential`
- `WorkloadIdentityCredential`

> [!IMPORTANT]
> The `AZURE_TOKEN_CREDENTIALS` environment variable supports individual credential names in `@azure/identity` package versions TBD and later.

To ensure the environment variable is defined and set to a supported string, use TBD.

## ChainedTokenCredential overview

[ChainedTokenCredential]() is an empty chain to which you add credentials to suit your app's needs. For example:

TBD

The preceding code sample creates a tailored credential chain comprised of TBD credentials. `ABC` is attempted first, followed by `XYZ`, if necessary. In graphical form, the chain looks like this:

:::image type="content" source="../media/mermaidjs/chained-token-credential-authentication-flow.svg" alt-text="ChainedTokenCredential":::

> [!TIP]
> For improved performance, optimize credential ordering in `ChainedTokenCredential` from most to least used credential.

## Usage guidance for DefaultAzureCredential

`DefaultAzureCredential` is undoubtedly the easiest way to get started with the Azure Identity library, but with that convenience comes tradeoffs. Once you deploy your app to Azure, you should understand the app's authentication requirements. For that reason, replace `DefaultAzureCredential` with a specific `TokenCredential` implementation, such as `ManagedIdentityCredential`. See the [**ABC** list]() for options.

Here's why:

- **Debugging challenges**: When authentication fails, it can be challenging to debug and identify the offending credential. You must enable logging to see the progression from one credential to the next and the success/failure status of each. For more information, see [Debug a chained credential](#debug-a-chained-credential).
- **Performance overhead**: The process of sequentially trying multiple credentials can introduce performance overhead. For example, when running on a local development machine, managed identity is unavailable. Consequently, `ManagedIdentityCredential` always fails in the local development environment, unless explicitly disabled via its corresponding `Exclude`-prefixed property.
- **Unpredictable behavior**: `DefaultAzureCredential` checks for the presence of certain [environment variables][env-vars]. It's possible that someone could add or modify these environment variables at the system level on the host machine. Those changes apply globally and therefore alter the behavior of `DefaultAzureCredential` at runtime in any app running on that machine. For more information on unpredictability, see [Use deterministic credentials in production environments](best-practices.md#use-deterministic-credentials-in-production-environments).

## Debug a chained credential

To diagnose an unexpected issue or to understand what a chained credential is doing, [enable logging](../logging.md) in your app. Optionally, filter the logs to only those events emitted from the Azure Identity library. For example:

TBD

For illustration purposes, assume the parameterless form of `DefaultAzureCredential` was used to authenticate a request to a Log Analytics workspace. The app ran in the local development environment, and Visual Studio Code was authenticated to an Azure account. The next time the app ran, the following pertinent entries appeared in the output:

TBD

In the preceding output, notice that:

- `EnvironmentCredential`, `WorkloadIdentityCredential`, and `ManagedIdentityCredential` each failed to acquire a Microsoft Entra access token, in that order.
- The `DefaultAzureCredential credential selected:`-prefixed entry indicates the credential that was selected&mdash;`VisualStudioCodeCredential` in this case. Since `VisualStudioCodeCredential` succeeded, no credentials beyond it were used.



<!-- 

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

## Use ChainedTokenCredential for granularity

[ChainedTokenCredential](/javascript/api/@azure/identity/chainedtokencredential) is an empty chain to which you add credentials to suit your app's needs. For example, the following example adds a `ManagedIdentityCredential` instance, then an `AzureCliCredential` instance.

```javascript
import { 
    ChainedTokenCredential, 
    ManagedIdentityCredential, 
    AzureCliCredential 
} from "@azure/identity";

const credential = new ChainedTokenCredential(
    new ManagedIdentityCredential({ clientId: "<YOUR_CLIENT_ID>" }),
    new AzureCliCredential()
);
```

The preceding code sample creates a tailored credential chain comprised of two credentials. The user-assigned managed identity variant of `ManagedIdentityCredential` is attempted first, followed by `AzureCliCredential`, if necessary. In graphical form, the chain looks like this:

:::image type="content" source="../media/mermaidjs/chained-token-credential-authentication-flow.svg" alt-text="Diagram showing Azure Identity credential chain for managed identity and Azure CLI.":::

> [!TIP]
> For improved performance, optimize credential ordering for your **production environment**. Credentials intended for use in the local development environment should be added last.

## Debug a chained credential

To debug a credential chain, enable [Azure SDK logging](../debug-client-libraries.md).

## More resources

- [Azure CLI](/cli/azure/install-azure-cli-windows) -->


<!-- LINKS -->
[env-vars]: https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/identity/identity#environment-variables
