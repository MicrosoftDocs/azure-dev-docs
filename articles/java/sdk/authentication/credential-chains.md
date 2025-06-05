---
title: 'Credential chains in the Azure Identity library for Java'
description: 'This article describes the DefaultAzureCredential and ChainedTokenCredential classes in the Azure Identity library.'
ms.date: 06/02/2025
ms.topic: article
author: KarlErickson
ms.author: karler
ms.reviewer: scaddie
ms.custom: devx-track-java
---

# Credential chains in the Azure Identity library for Java

The Azure Identity library provides *credentials*&mdash;public classes that implement the Azure Core library's [TokenCredential](/java/api/com.azure.core.credential.tokencredential) interface. A credential represents a distinct authentication flow for acquiring an access token from Microsoft Entra ID. These credentials can be chained together to form an ordered sequence of authentication mechanisms to be attempted.

## How a chained credential works

At runtime, a credential chain attempts to authenticate using the sequence's first credential. If that credential fails to acquire an access token, the next credential in the sequence is attempted, and so on, until an access token is successfully obtained. The following sequence diagram illustrates this behavior:

:::image type="content" source="../media/mermaidjs/chain-sequence.svg" alt-text="Diagram that shows credential chain sequence.":::

## Why use credential chains

A chained credential can offer the following benefits:

- **Environment awareness**: Automatically selects the most appropriate credential based on the environment in which the app is running. Without it, you'd have to write code like this:

    ```java
    import com.azure.core.credential.TokenCredential;
    import com.azure.identity.AzureCliCredentialBuilder;
    import com.azure.identity.ManagedIdentityCredentialBuilder;

    // Code omitted for brevity

    TokenCredential credential = null;

    // Set up credential based on environment (Azure or local development)
    String environment = System.getenv("ENV");

    if (environment != null && environment.equals("production")) {
        credential = new ManagedIdentityCredentialBuilder()
            .clientId(userAssignedClientId)
            .build();
    } else {
        credential = new AzureCliCredentialBuilder()
            .build();
    }
    ```

- **Seamless transitions**: Your app can move from local development to your staging or production environment without changing authentication code.
- **Improved resiliency**: Includes a fallback mechanism that moves to the next credential when the prior fails to acquire an access token.

## How to choose a chained credential

There are two disparate philosophies to credential chaining:

- **Use a preconfigured chain**: Start with an opinionated, preconstructed chain that accommodates the most common authentication scenarios. For this approach, see the [DefaultAzureCredential overview](#defaultazurecredential-overview) section.
- **"Build up" a chain**: Start with an empty chain and include only what you need. For this approach, see the [ChainedTokenCredential overview](#chainedtokencredential-overview) section.

## DefaultAzureCredential overview

[DefaultAzureCredential](/java/api/com.azure.identity.defaultazurecredential) is an opinionated, preconfigured chain of credentials. It's designed to support many environments, along with the most common authentication flows and developer tools. In graphical form, the underlying chain looks like this:

:::image type="content" source="../media/mermaidjs/default-azure-credential-auth-flow-inline.svg" alt-text="Diagram that shows DefaultAzureCredential authentication flow." lightbox="../media/mermaidjs/default-azure-credential-auth-flow-expanded.png":::

The order in which `DefaultAzureCredential` attempts credentials follows.

| Order | Credential                      | Description                                                                                                                                                                                                                                                                                                                        |
|-------|---------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 1     | [Environment][env-cred]         | Reads a collection of [environment variables][env-vars] to determine if an application service principal (application user) is configured for the app. If so, `DefaultAzureCredential` uses these values to authenticate the app to Azure. This method is most often used in server environments but can also be used when developing locally. |
| 2     | [Workload Identity][wi-cred]    | If the app is deployed to an Azure host with Workload Identity enabled, authenticate that account.                                                                                                                                                                                                                                 |
| 3     | [Managed Identity][mi-cred]     | If the app is deployed to an Azure host with Managed Identity enabled, authenticate the app to Azure using that Managed Identity.                                                                                                                                                                                                  |
| 4     | [Shared Token Cache][stc-cred]  | If the developer authenticated to Azure by logging into Visual Studio, authenticate the app to Azure using that same account. (Windows only.)                                                                                                                                                                                      |
| 5     | [IntelliJ][ij-cred]             | If the developer authenticated via Azure Toolkit for IntelliJ, authenticate that account.                                                                                                                                                                                                                                          |
| 6     | [Azure CLI][az-cred]            | If the developer authenticated to Azure using Azure CLI's `az login` command, authenticate the app to Azure using that same account.                                                                                                                                                                                               |
| 7     | [Azure PowerShell][pwsh-cred]   | If the developer authenticated to Azure using Azure PowerShell's `Connect-AzAccount` cmdlet, authenticate the app to Azure using that same account.                                                                                                                                                                                |
| 8     | [Azure Developer CLI][azd-cred] | If the developer authenticated to Azure using Azure Developer CLI's `azd auth login` command, authenticate with that account.                                                                                                                                                                                                      |

[env-cred]: /java/api/com.azure.identity.environmentcredential
[wi-cred]: /java/api/com.azure.identity.workloadidentitycredential
[mi-cred]: /java/api/com.azure.identity.managedidentitycredential
[stc-cred]: /java/api/com.azure.identity.sharedtokencachecredential
[az-cred]: /java/api/com.azure.identity.azureclicredential
[pwsh-cred]: /java/api/com.azure.identity.azurepowershellcredential
[azd-cred]: /java/api/com.azure.identity.azuredeveloperclicredential
[ij-cred]: /java/api/com.azure.identity.intellijcredential

In its simplest form, you can use the parameterless version of `DefaultAzureCredential` as follows:

```java
import com.azure.identity.DefaultAzureCredential;
import com.azure.identity.DefaultAzureCredentialBuilder;

// Code omitted for brevity

DefaultAzureCredential credential = new DefaultAzureCredentialBuilder()
    .build();
```

### How to customize DefaultAzureCredential

To exclude all `Developer tool` or `Deployed service` credentials, set environment variable `AZURE_TOKEN_CREDENTIALS` to `prod` or `dev`, respectively. When a value of `prod` is used, the underlying credential chain looks as follows:

:::image type="content" source="../media/mermaidjs/default-azure-credential-env-var-prod.svg" alt-text="Diagram that shows DefaultAzureCredential with AZURE_TOKEN_CREDENTIALS set to 'prod'.":::

When a value of `dev` is used, the chain looks as follows:

:::image type="content" source="../media/mermaidjs/default-azure-credential-env-var-dev.svg" alt-text="Diagram that shows DefaultAzureCredential with AZURE_TOKEN_CREDENTIALS set to 'dev'.":::

> [!IMPORTANT]
> The `AZURE_TOKEN_CREDENTIALS` environment variable is supported in `azure-identity` package versions 1.16.1 and later.

## ChainedTokenCredential overview

[ChainedTokenCredential](/java/api/com.azure.identity.chainedtokencredential) is an empty chain to which you add credentials to suit your app's needs. For example:

```java
import com.azure.identity.AzureCliCredential;
import com.azure.identity.AzureCliCredentialBuilder;
import com.azure.identity.ChainedTokenCredential;
import com.azure.identity.ChainedTokenCredentialBuilder;
import com.azure.identity.IntelliJCredential;
import com.azure.identity.IntelliJCredentialBuilder;

// Code omitted for brevity

AzureCliCredential cliCredential = new AzureCliCredentialBuilder()
    .build();
IntelliJCredential ijCredential = new IntelliJCredentialBuilder()
    .build();

ChainedTokenCredential credential = new ChainedTokenCredentialBuilder()
    .addLast(cliCredential)
    .addLast(ijCredential)
    .build();
```

The preceding code sample creates a tailored credential chain comprised of two development-time credentials. `AzureCliCredential` is attempted first, followed by `IntelliJCredential`, if necessary. In graphical form, the chain looks like this:

:::image type="content" source="../media/mermaidjs/chained-token-credential-auth-flow.svg" alt-text="Diagram that shows authentication flow for a ChainedTokenCredential instance that is composed of the Azure CLI and IntelliJ credentials.":::

> [!TIP]
> For improved performance, optimize credential ordering in `ChainedTokenCredential` from most to least used credential.

## Usage guidance for DefaultAzureCredential

`DefaultAzureCredential` is undoubtedly the easiest way to get started with the Azure Identity library, but with that convenience comes tradeoffs. Once you deploy your app to Azure, you should understand the app's authentication requirements. For that reason, replace `DefaultAzureCredential` with a specific `TokenCredential` implementation, such as `ManagedIdentityCredential`.

Here's why:

- **Debugging challenges**: When authentication fails, it can be challenging to debug and identify the offending credential. You must enable logging to see the progression from one credential to the next and the success/failure status of each. For more information, see [Debug a chained credential](#debug-a-chained-credential).
- **Performance overhead**: The process of sequentially trying multiple credentials can introduce performance overhead. For example, when running on a local development machine, managed identity is unavailable. Consequently, `ManagedIdentityCredential` always fails in the local development environment.
- **Unpredictable behavior**: `DefaultAzureCredential` checks for the presence of certain [environment variables][env-vars]. It's possible that someone could add or modify these environment variables at the system level on the host machine. Those changes apply globally and therefore alter the behavior of `DefaultAzureCredential` at runtime in any app running on that machine.

## Debug a chained credential

To diagnose an unexpected issue or to understand what a chained credential is doing, [enable logging](../logging-overview.md) in your app.

For illustration purposes, assume the parameterless form of `DefaultAzureCredential` is used to authenticate a request to a Blob Storage account. The app runs in the local development environment, and the developer authenticated to Azure using the Azure CLI. When the app is run, the following pertinent entries appear in the output:

```output
[main] INFO com.azure.identity.ChainedTokenCredential - Azure Identity => Attempted credential EnvironmentCredential is unavailable.
[main] INFO com.azure.identity.ChainedTokenCredential - Azure Identity => Attempted credential WorkloadIdentityCredential is unavailable.
[ForkJoinPool.commonPool-worker-1] WARN com.microsoft.aad.msal4j.ConfidentialClientApplication - [Correlation ID: aaaa0000-bb11-2222-33cc-444444dddddd] Execution of class com.microsoft.aad.msal4j.AcquireTokenByClientCredentialSupplier failed: java.util.concurrent.ExecutionException: com.azure.identity.CredentialUnavailableException: ManagedIdentityCredential authentication unavailable. Connection to IMDS endpoint cannot be established.
[main] INFO com.azure.identity.ChainedTokenCredential - Azure Identity => Attempted credential ManagedIdentityCredential is unavailable.
[main] INFO com.azure.identity.ChainedTokenCredential - Azure Identity => Attempted credential SharedTokenCacheCredential is unavailable.
[main] INFO com.azure.identity.ChainedTokenCredential - Azure Identity => Attempted credential IntelliJCredential is unavailable.
[main] INFO com.azure.identity.ChainedTokenCredential - Azure Identity => Attempted credential AzureCliCredential returns a token
```

In the preceding output, notice that:

- `EnvironmentCredential`, `WorkloadIdentityCredential`, `ManagedIdentityCredential`, `SharedTokenCacheCredential`, and `IntelliJCredential` each failed to acquire a Microsoft Entra access token, in that order.
- The `AzureCliCredential.getToken` call succeeds, as indicated by the `returns a token`-suffixed entry. Since `AzureCliCredential` succeeded, no credentials beyond it were tried.

<!-- LINKS -->
[env-vars]: https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/identity/azure-identity/README.md#environment-variables
