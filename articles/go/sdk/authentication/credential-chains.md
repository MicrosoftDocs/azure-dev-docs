---
title: Credential chains in the Azure Identity library for Go
description: This article describes the DefaultAzureCredential and ChainedTokenCredential classes in the Azure Identity library for Go.
ms.date: 06/03/2025
ms.topic: article
ms.custom: devx-track-go
---

# Credential chains in the Azure Identity library for Go

The Azure Identity library provides *credentials*&mdash;public types that implement the Azure Core library's [TokenCredential](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/azcore#TokenCredential) interface. A credential represents a distinct authentication flow for acquiring an access token from Microsoft Entra ID. These credentials can be chained together to form an ordered sequence of authentication mechanisms to be attempted.

## How a chained credential works

At runtime, a credential chain attempts to authenticate using the sequence's first credential. If that credential fails to acquire an access token, the next credential in the sequence is attempted, and so on, until an access token is successfully obtained. The following sequence diagram illustrates this behavior:

:::image type="content" source="../media/mermaidjs/chain-sequence.svg" alt-text="Diagram that shows credential chain sequence.":::

## Why use credential chains

A chained credential can offer the following benefits:

- **Environment awareness**: Automatically selects the most appropriate credential based on the environment in which the app is running. Without it, you'd have to write code like this:

    ```go
    // Set up credential based on environment (Azure or local development)
    if os.Getenv("WEBSITE_HOSTNAME") != "" {
        clientID := azidentity.ClientID("abcd1234-...")
        opts := azidentity.ManagedIdentityCredentialOptions{ID: clientID}
        credential, err = azidentity.NewManagedIdentityCredential(&opts)
        
        if err != nil {
          // TODO: handle error
        }
    } else {
        // Use Azure CLI Credential
        credential, err = azidentity.NewAzureCLICredential(nil)

        if err != nil {
          // TODO: handle error
        }
    }
    ```

- **Seamless transitions**: Your app can move from local development to your staging or production environment without changing authentication code.
- **Improved resiliency**: Includes a fallback mechanism that moves to the next credential when the prior fails to acquire an access token.

## How to choose a chained credential

With Go, there are two choices for credential chaining:

- **Use a preconfigured chain**: Use the preconfigured chain implemented by the `DefaultAzureCredential` type. For this approach, see the [DefaultAzureCredential overview](#defaultazurecredential-overview) section.
- **Build a custom credential chain**: Start with an empty chain and include only what you need. For this approach, see the [ChainedTokenCredential overview](#chainedtokencredential-overview) section.

## DefaultAzureCredential overview

[DefaultAzureCredential](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/azidentity#DefaultAzureCredential) is an opinionated, preconfigured chain of credentials. It's designed to support many environments, along with the most common authentication flows and developer tools. In graphical form, the underlying chain looks like this:

:::image type="content" source="../media/mermaidjs/default-azure-credential-auth-flow-inline.svg" alt-text="Diagram that shows DefaultAzureCredential authentication flow." lightbox="../media/mermaidjs/default-azure-credential-auth-flow-expanded.png":::

The order in which `DefaultAzureCredential` attempts credentials follows.

| Order | Credential                      | Description                                                                                                                                                                                                                                                                                                                                    |
|-------|---------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 1     | [Environment][env-cred]         | Reads a collection of [environment variables][env-vars] to determine if an application service principal (application user) is configured for the app. If so, `DefaultAzureCredential` uses these values to authenticate the app to Azure. This method is most often used in server environments but can also be used when developing locally. |
| 2     | [Workload Identity][wi-cred]    | If the app is deployed to an Azure host with Workload Identity enabled, authenticate that account.                                                                                                                                                                                                                                             |
| 3     | [Managed Identity][mi-cred]     | If the app is deployed to an Azure host with Managed Identity enabled, authenticate the app to Azure using that Managed Identity.                                                                                                                                                                                                              |
| 4     | [Azure CLI][az-cred]            | If the developer authenticated to Azure using Azure CLI's `az login` command, authenticate the app to Azure using that same account.                                                                                                                                                                                                           |
| 5     | [Azure Developer CLI][azd-cred] | If the developer authenticated to Azure using Azure Developer CLI's `azd auth login` command, authenticate with that account.                                                                                                                                                                                                                  |

[env-cred]: https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/azidentity#EnvironmentCredential
[wi-cred]: https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/azidentity#WorkloadIdentityCredential
[mi-cred]: https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/azidentity#ManagedIdentityCredential
[az-cred]: https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/azidentity#AzureCLICredential
[azd-cred]: https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/azidentity#AzureDeveloperCLICredential

In its simplest form, you can use the parameterless version of `DefaultAzureCredential` as follows:

```go
import (
    "github.com/Azure/azure-sdk-for-go/sdk/azidentity"
    "github.com/Azure/azure-sdk-for-go/sdk/storage/azblob"
    )

// create a credential
credential, err := azidentity.NewDefaultAzureCredential(nil)
if err != nil {
    // TODO: handle error
}

// create a Blob service client 
accountURL := "https://<my_account_name>.blob.core.windows.net"
client, err := azblob.NewClient(accountURL, credential, nil)
if err != nil {
    // TODO: handle error
}
```

### How to customize DefaultAzureCredential

To exclude all `Developer tool` or `Deployed service` credentials, set environment variable `AZURE_TOKEN_CREDENTIALS` to `prod` or `dev`, respectively. When a value of `prod` is used, the underlying credential chain looks as follows:

:::image type="content" source="../media/mermaidjs/default-azure-credential-env-var-prod.svg" alt-text="Diagram that shows DefaultAzureCredential with AZURE_TOKEN_CREDENTIALS set to 'prod'.":::

When a value of `dev` is used, the chain looks as follows:

:::image type="content" source="../media/mermaidjs/default-azure-credential-env-var-dev.svg" alt-text="Diagram that shows DefaultAzureCredential with AZURE_TOKEN_CREDENTIALS set to 'dev'.":::

> [!IMPORTANT]
> The `AZURE_TOKEN_CREDENTIALS` environment variable is supported in `azidentity` module versions 1.10.0 and later.

## ChainedTokenCredential overview

[ChainedTokenCredential](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/azidentity#ChainedTokenCredential) is an empty chain to which you add credentials to suit your app's needs. For example:

```go
azCLI, err := azidentity.NewAzureCLICredential(nil)
if err != nil {
  // handle error
}

azdCLI, err := azidentity.NewAzureDeveloperCLICredential(nil)
if err != nil {
  // handle error
}

chain, err := azidentity.NewChainedTokenCredential([]azcore.TokenCredential{azCLI, azdCLI}, nil)
if err != nil {
  // handle error
}
```

The preceding code sample creates a tailored credential chain comprised of two credentials. `AzureCLICredential` is attempted first, followed by `AzureDeveloperCLICredential`, if necessary. In graphical form, the chain looks like this:

:::image type="content" source="../media/mermaidjs/chained-token-credential-auth-flow.svg" alt-text="Diagram that shows authentication flow for a ChainedTokenCredential instance that is composed of Azure CLI and Azure Developer CLI credentials.":::

> [!TIP]
> For improved performance, optimize credential ordering in `ChainedTokenCredential` from most to least used credential.

## Usage guidance for DefaultAzureCredential

`DefaultAzureCredential` is undoubtedly the easiest way to get started with the Azure Identity library, but with that convenience comes tradeoffs. Once you deploy your app to Azure, you should understand the app's authentication requirements. For that reason, replace `DefaultAzureCredential` with a specific `TokenCredential` implementation, such as `ManagedIdentityCredential`.

Here's why:

- **Debugging challenges**: When authentication fails, it can be challenging to debug and identify the offending credential. You must enable logging to see the progression from one credential to the next and the success/failure status of each. For more information, see [Debug a chained credential](#debug-a-chained-credential).
- **Performance overhead**: The process of sequentially trying multiple credentials can introduce performance overhead. For example, when running on a local development machine, managed identity is unavailable. Consequently, `ManagedIdentityCredential` always fails in the local development environment, unless explicitly disabled via its corresponding `exclude`-prefixed property.
- **Unpredictable behavior**: `DefaultAzureCredential` checks for the presence of certain [environment variables][env-vars]. It's possible that someone could add or modify these environment variables at the system level on the host machine. Those changes apply globally and therefore alter the behavior of `DefaultAzureCredential` at runtime in any app running on that machine.

## Debug a chained credential

To diagnose an unexpected issue or to understand what a chained credential is doing, [enable logging](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/azidentity#readme-logging) in your app. Optionally, filter the logs to only those events emitted from the Azure Identity client library. For example:

```go
import azlog "github.com/Azure/azure-sdk-for-go/sdk/azcore/log"
// print log output to stdout
azlog.SetListener(func(event azlog.Event, s string) {
    fmt.Println(s)
})
// include only azidentity credential logs
azlog.SetEvents(azidentity.EventAuthentication)
```

For guidance on resolving errors from specific credential types, see the [troubleshooting guide](https://github.com/Azure/azure-sdk-for-go/blob/main/sdk/azidentity/TROUBLESHOOTING.md).

<!-- LINKS -->
[env-vars]: https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/azidentity#readme-environment-variables
