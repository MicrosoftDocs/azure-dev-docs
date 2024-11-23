---
title: Credential chains in the Azure Identity client library for Go
description: This article describes the DefaultAzureCredential and ChainedTokenCredential classes in the Azure Identity client library for Go.
ms.date: 11/22/2024
ms.topic: conceptual
ms.custom: devx-track-go
---

# Credential chains in the Azure Identity client library for Go

The Azure Identity client library provides *credentials*&mdash;public classes that implement the azcore library's [TokenCredential](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/azcore#TokenCredential) interface. A credential represents a distinct authentication flow for acquiring an access token from Microsoft Entra ID. These credentials can be chained together to form an ordered sequence of authentication mechanisms to be attempted.

## How a chained credential works

At runtime, a credential chain attempts to authenticate using the sequence's first credential. If that credential fails to acquire an access token, the next credential in the sequence is attempted, and so on, until an access token is successfully obtained. The following sequence diagram illustrates this behavior:

:::image type="content" source="../media/mermaidjs/chain-sequence.svg" alt-text="Diagram that shows Credential chain sequence.":::

## Why use credential chains

A chained credential can offer the following benefits:

- **Environment awareness**: Automatically selects the most appropriate credential based on the environment in which the app is running. Without it, you'd have to write code like this:

    ```go
    // Set up credential based on environment (Azure or local development)
    if os.Getenv("WEBSITE_HOSTNAME") != "" {
        clientID := azidentity.ClientID("abcd1234-...")
        opts := azidentity.ManagedIdentityCredentialOptions{ID: clientID}
        cred, err := azidentity.NewManagedIdentityCredential(&opts)
        
        if err != nil {
          // TODO: handle error
        }
    }
    else {
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

There are two disparate philosophies to credential chaining:

- **"Tear down" a chain**: Start with a preconfigured chain and exclude what you don't need. For this approach, see the [DefaultAzureCredential overview](#defaultazurecredential-overview) section.
- **"Build up" a chain**: Start with an empty chain and include only what you need. For this approach, see the [ChainedTokenCredential overview](#chainedtokencredential-overview) section.

## DefaultAzureCredential overview

[DefaultAzureCredential](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/azidentity#DefaultAzureCredential) is an opinionated, preconfigured chain of credentials. It's designed to support many environments, along with the most common authentication flows and developer tools. In graphical form, the underlying chain looks like this:

:::image type="content" source="../media/mermaidjs/default-azure-credential-auth-flow.svg" alt-text="Diagram that shows DefaultAzureCredential authentication flow." lightbox="../media/mermaidjs/default-azure-credential-auth-flow-big.png":::

The order in which `DefaultAzureCredential` attempts credentials follows.

| Order | Credential          | Description | Enabled by default? |
|-------|---------------------|-------------|---------------------|
| 1     | [Environment][env-cred]         |Reads a collection of [environment variables][env-vars] to determine if an application service principal (application user) is configured for the app. If so, `DefaultAzureCredential` uses these values to authenticate the app to Azure. This method is most often used in server environments but can also be used when developing locally.             | Yes                 |
| 2     | [Workload Identity][wi-cred]   |If the app is deployed to an Azure host with Workload Identity enabled, authenticate that account.             | Yes                 |
| 3     | [Managed Identity][mi-cred]    |If the app is deployed to an Azure host with Managed Identity enabled, authenticate the app to Azure using that Managed Identity.             | Yes                 |
| 4     | [Azure CLI][az-cred]           |If the developer authenticated to Azure using Azure CLI's `az login` command, authenticate the app to Azure using that same account.             | Yes                 |
| 5     | [Azure Developer CLI][azd-cred] |If the developer authenticated to Azure using Azure Developer CLI's `azd auth login` command, authenticate with that account.             | Yes                 |

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

To remove a credential from `DefaultAzureCredential`, use the corresponding `exclude`-prefixed [keyword parameter](/python/api/azure-identity/azure.identity.defaultazurecredential#keyword-only-parameters). For example:

```python
credential = DefaultAzureCredential(
    exclude_environment_credential=True, 
    exclude_workload_identity_credential=True,
    managed_identity_client_id=user_assigned_client_id
)
```

In the preceding code sample, `EnvironmentCredential` and `WorkloadIdentityCredential` are removed from the credential chain. As a result, the first credential to be attempted is `ManagedIdentityCredential`. The modified chain looks like this:

:::image type="content" source="../media/mermaidjs/default-azure-credential-excludes.svg" alt-text="Diagram that shows authentication flow for a DefaultAzureCredential instance after using exclude-prefixed keyword parameters in the constructor to remove environment credential and workload identity credential.":::

As more `exclude`-prefixed keyword parameters are set to `True` (credential exclusions are configured), the advantages of using `DefaultAzureCredential` diminish. In such cases, `ChainedTokenCredential` is a better choice and requires less code. To illustrate, these two code samples behave the same way:

### [DefaultAzureCredential](#tab/dac)

```python
credential = DefaultAzureCredential(
    exclude_environment_credential=True,
    exclude_workload_identity_credential=True,
    exclude_shared_token_cache_credential=True,
    exclude_azure_powershell_credential=True,
    exclude_azure_developer_cli_credential=True,
    managed_identity_client_id=user_assigned_client_id
)
```

### [ChainedTokenCredential](#tab/ctc)

```python
credential = ChainedTokenCredential(
    ManagedIdentityCredential(client_id=user_assigned_client_id),
    AzureCliCredential()
)
```

---

## ChainedTokenCredential overview

[ChainedTokenCredential](/python/api/azure-identity/azure.identity.chainedtokencredential) is an empty chain to which you add credentials to suit your app's needs. For example:

```python
credential = ChainedTokenCredential(
    ManagedIdentityCredential(client_id=user_assigned_client_id),
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
- **Unpredictable behavior**: `DefaultAzureCredential` checks for the presence of certain [environment variables][env-vars]. It's possible that someone could add or modify these environment variables at the system level on the host machine. Those changes apply globally and therefore alter the behavior of `DefaultAzureCredential` at runtime in any app running on that machine.

## Debug a chained credential

To diagnose an unexpected issue or to understand what a chained credential is doing, [enable logging](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/azcore#hdr-Built_in_Logging) in your app. Optionally, filter the logs to only those events emitted from the Azure Identity client library. For example:

```python
import logging
from azure.identity import DefaultAzureCredential

# Set the logging level for the Azure Identity library
logger = logging.getLogger("azure.identity")
logger.setLevel(logging.DEBUG)

# Direct logging output to stdout. Without adding a handler,
# no logging output is visible.
handler = logging.StreamHandler(stream=sys.stdout)
logger.addHandler(handler)

# Optional: Output logging levels to the console.
print(
    f"Logger enabled for ERROR={logger.isEnabledFor(logging.ERROR)}, "
    f"WARNING={logger.isEnabledFor(logging.WARNING)}, "
    f"INFO={logger.isEnabledFor(logging.INFO)}, "
    f"DEBUG={logger.isEnabledFor(logging.DEBUG)}"
)
```

For illustration purposes, assume the parameterless form of `DefaultAzureCredential` is used to authenticate a request to a blob storage account. The app runs in the local development environment, and the developer authenticated to Azure using the Azure CLI. Assume also that the logging level is set to `logging.DEBUG`. When the app is run, the following pertinent entries appear in the output:

```output
Logger enabled for ERROR=True, WARNING=True, INFO=True, DEBUG=True
No environment configuration found.
ManagedIdentityCredential will use IMDS
EnvironmentCredential.get_token failed: EnvironmentCredential authentication unavailable. Environment variables are not fully configured.
Visit https://aka.ms/azsdk/python/identity/environmentcredential/troubleshoot to troubleshoot this issue.
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


<!-- LINKS -->
[env-vars]: https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/identity/azure-identity#environment-variables