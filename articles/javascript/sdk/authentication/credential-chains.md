---
title: "Credential chains in the Azure library for JavaScript"
description: This article describes the DefaultAzureCredential and ChainedTokenCredential classes in the Azure Identity client library for JavaScript.
ms.date: 10/02/2025
ms.topic: concept-article
ms.custom: devx-track-js
#customer intent: As a JavaScript developer new to Azure, I want understand credential chains so that select the appropriate chain and understand how to configure and debug it.
---

# Credential chains in the Azure Identity client library for JavaScript

The Azure Identity client library provides *credentials* which are public classes that implement the Azure Core library's [TokenCredential](/javascript/api/@azure/identity/tokencredential) interface. A credential represents a distinct authentication flow for acquiring an access token from Microsoft Entra ID. These credentials can be selected individually or chained together to form an ordered sequence of authentication mechanisms to be attempted.

- **Individual credentials** provide speed and certainty. If they fail, you know the credential wasn't authenticated.
- **Chains** provide fallbacks. When the credential fails to authenticate, the next credential in the chain is attempted. 

## Design your authentication flows

When you use Azure SDK client libraries, the first step is to authenticate to Azure. There are many options of how to authenticate to consider, such as tools and IDEs used in the development team, automation workflows such as testing and CI/CD, and hosting platforms such as Azure App Service.

Choose from the following common progressions for your authentication flow:

- Use the `DefaultAzureCredential` for **teams whose developers use various IDEs and CLIs to authenticate to Azure**. This allows the greatest flexibility. This flexibility is provided at the cost of performance to validate the credentials in the chain until one succeeds. 

  - The fallback from credential to credential is selected on your behalf based on the detected environment.
  - To determine which credential was selected, turn on [debugging](#debug-a-chained-credential). 

- Use the `ChainedTokenCredential` for **teams which have a strict and scoped selection of tools**. For example, they all authenticate in and use the same IDE or CLI. This allows the team to select the exact credentials and the order which still provides flexibility but at a reduced performance cost.

  - You select the fallback path from credential to credential regardless of the environment it's run in.
  - To determine which credential was selected, turn on [debugging](#debug-a-chained-credential).

- For **teams with certainty of credentials** in all the environments, a control flow statement such as if/else, allows you to know which credential was chosen in each environment.

  - There's no fallback to another credential type.
  - You don't need to debug to determine which credential was chosen because it was specified. 

## How a chained credential works

At runtime, a credential chain attempts to authenticate using the sequence's first credential. If that credential fails to acquire an access token, the next credential in the sequence is attempted, and so on, until an access token is successfully obtained. The following sequence diagram illustrates this behavior:

:::image type="content" source="../media/mermaidjs/chain-sequence.svg" alt-text="Diagram showing Azure Identity credential sequence flow.":::

## Use DefaultAzureCredential for flexibility

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

### Credentials are global to the environment

`DefaultAzureCredential` checks for the presence of certain [environment variables][env-vars]. It's possible that someone could add or modify these environment variables at the system level on the host machine. Those changes apply globally and therefore alter the behavior of `DefaultAzureCredential` at runtime in any app running on that machine.

### How to customize DefaultAzureCredential

The following sections describe strategies for controlling which credentials are included in the chain.

#### Exclude a credential type category

To exclude all `Developer tool` or `Deployed service` credentials, set environment variable `AZURE_TOKEN_CREDENTIALS` to `prod` or `dev`, respectively. When a value of `prod` is used, the underlying credential chain looks as follows:

:::image type="content" source="../media/mermaidjs/default-azure-credential-environment-variable-production.svg" alt-text="Diagram that shows DefaultAzureCredential with AZURE_TOKEN_CREDENTIALS set to 'prod'.":::

When a value of `dev` is used, the chain looks as follows:

:::image type="content" source="../media/mermaidjs/default-azure-credential-environment-variable-development.svg" alt-text="Diagram that shows DefaultAzureCredential with AZURE_TOKEN_CREDENTIALS set to 'dev'.":::

> [!IMPORTANT]
> The `AZURE_TOKEN_CREDENTIALS` environment variable is supported in `@azure/identity` package versions 4.10.0 and later.

To ensure the environment variable is defined and set to a supported string, set property [requiredEnvVars](/javascript/api/@azure/identity/defaultazurecredentialoptions?view=azure-node-latest#@azure-identity-defaultazurecredentialoptions-requiredenvvars) to `AZURE_TOKEN_CREDENTIALS`:

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

To ensure the environment variable is defined and set to a supported string, set property [requiredEnvVars](/javascript/api/@azure/identity/defaultazurecredentialoptions?view=azure-node-latest#@azure-identity-defaultazurecredentialoptions-requiredenvvars) to `AZURE_TOKEN_CREDENTIALS`:

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

- [Azure CLI](/cli/azure/install-azure-cli-windows)


<!-- LINKS -->
[env-vars]: https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/identity/identity#environment-variables
