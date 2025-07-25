---
title: Use Azure SDK crates for Rust
description: Get started with Azure SDK crates for Rust. Learn authentication, explore supported services like Storage and Key Vault, and follow best practices with code examples.
ms.date: 07/17/2025
ms.topic: concept-article
ms.service: azure
ms.custom: devx-track-rust
---

# Use Azure SDK crates for Rust 

The Azure SDK crates for Rust provide a collection of client libraries that make it easy to interact with Azure services from Rust applications. These crates follow Azure client library design guidelines to provide a consistent, idiomatic experience that's natural for Rust developers.

[Source code] | [Crates (crates.io)] | [API reference documentation] | [REST API documentation] | [Product documentation]

## Azure SDK crate concepts

- **Idiomatic Rust**: Built with Rust best practices and conventions.
- **Async/await support**: Fully async APIs with pluggable runtime support (defaulting to tokio).
- **Type safety**: Uses Rust's type system for compile-time safety.
- **Thread safety**: All client instance methods are thread-safe and independent of each other.
- **Memory safety**: Zero-cost abstractions with no garbage collection overhead.
- **Modular design**: Use only the crates you need.
- **Unified configuration**: Configure service clients, logging, and retries with `ClientOptions`.
- **Consistent error handling**: Handle errors consistently across services with `azure_core::Error`.
- **Response handling**: Access detailed HTTP response data with `Response<T>`.
- **Pagination support**: Work with paginated APIs by using `Pager<T>` for async streams.
- **Authentication abstractions**: Standardized credential management via `TokenCredential`.

## Differences between crates and REST APIs

Use the following information to understand when to use each type of access.

* The Azure SDK crates are the preferred method for accessing your Azure service. These crates abstract away the boilerplate code required to manage cloud-based Azure platform REST requests such as authentication, retries, and logging.
* Azure REST APIs are the preferred method if you are:
  * Working with preview services that don't have Azure crates available yet. Consider your code as preview, which should be updated when the service is generally available with crates.
  * Wanting to make REST calls directly because you don't want to use the entire crate to use a single REST API or you want deeper control over the HTTP requests.


## Rust version

The Azure SDK crates for Rust are currently in **beta**. While the APIs are stabilizing and the crates are suitable for development and testing, some breaking changes may occur before the 1.0 release. These crates support the most commonly used Azure services with more being added regularly based on community feedback and demand.

## Prerequisites to develop with crates

- Rust 1.85 or later. The version is specified in the Azure SDK crate for Rust [Cargo.toml](https://github.com/Azure/azure-sdk-for-rust/blob/main/Cargo.toml).
- An Azure subscription. You can [create one for free](https://azure.microsoft.com/free/).
- [Azure CLI](/cli/azure)
- [Azure Developer CLI](/azure/developer/azure-developer-cli)

> [!TIP]
> For the best development experience, ensure you have the latest stable version of Rust installed. 

### Install Azure SDK crates

Get Azure SDK crates from [crates.io](https://crates.io). Install the individual crates that you need. 

```console
cargo add azure_identity azure_security_keyvault_secrets azure_storage_blob
```

These crates depend on [azure_core](https://crates.io/crates/azure_core) for common functionality. You don't need to install `azure_core` directly, as it's a dependency of all Azure SDK crates.

## Supported Azure services

The following Azure services, prefixed with `azure_`, are currently supported:

| Service | Crate | Description |
|---------|---------|-------------|
| **Cosmos DB** | [azure_data_cosmos](https://crates.io/crates/azure_data_cosmos) | NoSQL database operations |
| **Event Hubs** | [azure_messaging_eventhubs](https://crates.io/crates/azure_messaging_eventhubs) | Big data streaming platform |
| **Key Vault** | [azure_security_keyvault_certificates](https://crates.io/crates/azure_security_keyvault_certificates)<br>[azure_security_keyvault_secrets](https://crates.io/crates/azure_security_keyvault_secrets)<br>[azure_security_keyvault_keys](https://crates.io/crates/azure_security_keyvault_keys) | Manage secrets, keys, and certificates |
| **Storage** | [azure_storage_blob](https://crates.io/crates/azure_storage_blob) | Create and manage Azure Storage blobs and containers. |

Crates.io has other crates for Azure services that were established before the official Azure SDK crates listed above. These crates aren't associated with the Azure SDK and shouldn't be used for modern development.

## Crate Cargo.toml features

Each crate defines its features in its Cargo.toml file. For example, see the features for the Azure Identity crate in the [`azure_identity` Cargo.toml](https://github.com/Azure/azure-sdk-for-rust/blob/a5e6ae390021eb95fca3f01bc4bfadc83f076246/sdk/identity/azure_identity/Cargo.toml). Use these features to depend on additional functionality.

* `debug`: enables extra information for developers, including emitting all fields in std::fmt::Debug implementation.
* `hmac_openssl`: configures HMAC using OpenSSL.
* `hmac_rust`: configures HMAC using pure Rust.
* `reqwest` (default): enables and sets reqwest as the default HttpClient. Enables reqwest's native-tls feature.
* `reqwest_deflate` (default): enables deflate compression for reqwest.
* `reqwest_gzip` (default): enables gzip compression for reqwest.
* `reqwest_rustls`: enables reqwest's rustls-tls-native-roots-no-provider feature.
* `tokio`: enables and sets tokio as the default async runtime.
* `xml`: enables XML support.

An example `Cargo.toml` configuration for an Azure SDK for Rust feature might look like the following:

```toml
[dependencies]
azure_security_keyvault_certificates = { features = ["debug", "hmac_openssl"] }
```

## Provide authentication credentials

The Azure SDK crates need credentials to authenticate to Microsoft Entra ID. Azure services provide different authentication methods for connection. We recommend using the [azure_identity](https://crates.io/crates/azure_identity) crate for authentication, which provides a set of credential structures that you can use across multiple Azure services. `azure_identity` offers several benefits over keys or connection strings:

* Fast onboarding
* Most secure method
* Separation of the authentication mechanism from the code. This separation allows you to use the same code locally and on the Azure platform while the credentials are different.
* Chained authentication so several mechanisms can be available.


## Creating secure clients with proper authentication

After creating a credential, pass it to your Azure SDK client along with any necessary configuration. The client might need additional information such as a service endpoint, or container name, which you can find in the Azure portal for your resource.

### Security best practices

- **Never hardcode credentials** in your source code
- Use **Managed Identity** when running in Azure
- Store sensitive configuration in **Azure Key Vault**
- Enable **logging** for security monitoring
- Regularly **rotate credentials**

### Client initialization example

```rust
use azure_identity::DefaultAzureCredential;
use azure_security_keyvault_secrets::SecretClient;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // ✅ DO: Use DefaultAzureCredential for automatic authentication
    let credential = DefaultAzureCredential::new()?;

    // Create the client with endpoint, credential, and options
    let client = SecretClient::new(
        "https://<your-key-vault-name>.vault.azure.net/",
        credential.clone(),
        None,
    )?;

    // ❌ DON'T: Hardcode credentials like this:
    // let bad_credential = ClientSecretCredential::new(
    //     "hardcoded-tenant-id",
    //     "hardcoded-client-id", 
    //     "hardcoded-secret",
    //     None,
    // );

    Ok(())
}
```

`DefaultAzureCredential` automatically finds and uses the authentication token stored locally by checking a series of credentials based on the environment. This approach provides flexibility when running your code in different environments.

:::image type="content" source="./media/mermaidjs/default-azure-credential-authentication-flow.svg" alt-text="Default Azure Credential Authentication Flow for Rust showing the first choice of Azure CLI and the second choice of Azure Developer CLI.":::


### Connection pooling and reuse

The Azure SDK automatically manages connection pooling for optimal performance. The default configuration:

- Reuses connections when possible
- Implements keep-alive for connection persistence
- Pools connections to improve throughput for multiple requests to the same endpoint

For high-volume workloads, you can adjust the connection timeout and pool size through client options.

For more details on performance optimization and connection handling, refer to the [Azure crates for Rust HTTP client documentation](https://github.com/Azure/azure-sdk-for-rust/tree/main/sdk/core/azure_core#http-clients).



## Error handling

When a service call fails, the returned result contains an error. The error type provides a `status` property with an HTTP status code and an `error_code` property with a service-specific error code.

```rust
use azure_core::{error::{ErrorKind, HttpError}, http::{Response, StatusCode}};
use azure_identity::DefaultAzureCredential;
use azure_security_keyvault_secrets::SecretClient;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // create a client
    let credential = DefaultAzureCredential::new()?;
    let client = SecretClient::new(
        "https://<your-key-vault-name>.vault.azure.net/",
        credential.clone(),
        None,
    )?;

    match client.get_secret("secret-name", "", None).await {
        Ok(secret) => println!("Secret: {:?}", secret.into_body().await?.value),
        Err(e) => match e.kind() {
            ErrorKind::HttpResponse { status, error_code, .. } if *status == StatusCode::NotFound => {
                // handle not found error
                if let Some(code) = error_code {
                    println!("ErrorCode: {}", code);
                } else {
                    println!("Secret not found, but no error code provided.");
                }
            },
            _ => println!("An error occurred: {e:?}"),
        },
    }

    Ok(())
}
```

## Pagination: Get all items

If a service call returns multiple values in pages, it returns `Result<Pager<T>>` as a result. You can iterate all items from all pages. This feature is useful for operations with small to medium result sets.

```rust
use azure_identity::DefaultAzureCredential;
use azure_security_keyvault_secrets::{ResourceExt, SecretClient};
use futures::TryStreamExt;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // create a client
    let credential = DefaultAzureCredential::new()?;
    let client = SecretClient::new(
        "https://<your-key-vault-name>.vault.azure.net/",
        credential.clone(),
        None,
    )?;

    // get a stream of items
    let mut pager = client.list_secret_properties(None)?;

    // poll the pager until there are no more SecretListResults
    while let Some(secret) = pager.try_next().await? {
        // get the secret name from the ID
        let name = secret.resource_id()?.name;
        println!("Found secret with name: {}", name);
    }

    Ok(())
}
```

## Pagination: Process each page of items

When you want to iterate through all items in a paginated response, use the `into_pages()` method on the returned `Pager<T>`. This method returns an async stream of pages, allowing you to process each page as it becomes available. This feature is useful for operations with large result sets.


```rust
use azure_identity::DefaultAzureCredential;
use azure_security_keyvault_secrets::{ResourceExt, SecretClient};
use futures::TryStreamExt;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // create a client
    let credential = DefaultAzureCredential::new()?;
    let client = SecretClient::new(
        "https://<your-key-vault-name>.vault.azure.net/",
        credential.clone(),
        None,
    )?;

    // get a stream of pages
    let mut pager = client.list_secret_properties(None)?.into_pages();

    // poll the pager until there are no more SecretListResults
    while let Some(secrets) = pager.try_next().await? {
        let secrets = secrets.into_body().await?.value;
        // loop through secrets in SecretsListResults
        for secret in secrets {
            // get the secret name from the ID
            let name = secret.resource_id()?.name;
            println!("Found secret with name: {}", name);
        }
    }

    Ok(())
}
```

## Secure logging

When you're working with sensitive information, the client libraries implement secure logging practices, by default, to avoid exposing secrets in logs.


### Rust feature for debug logging

To help protect end users from accidental exposure of personal data in logs or traces, models' default implementation of `core::fmt::Debug` formats as a non-exhaustive structure tuple.

```rust
use azure_identity::DefaultAzureCredential;
use azure_security_keyvault_secrets::{ResourceExt, SecretClient};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // create a client
    let credential = DefaultAzureCredential::new()?;
    let client = SecretClient::new(
        "https://<your-key-vault-name>.vault.azure.net/",
        credential.clone(),
        None,
    )?;

    // get a secret
    let secret = client.get_secret("secret-name", "", None)
        .await?
        .into_body()
        .await?;

    println!("{secret:#?}");

    Ok(())
}
```

By default, this implementation prints: 

```console
Secret { .. }
```

Though not recommended for production, you can enable normal `core::fmt::Debug` formatting, which includes field names and values, by enabling the debug feature of `azure_core`.

```console
cargo add azure_core -F debug
```

### Environment variable for debug logging

To log tracing information to the terminal, add the `RUST_LOG` environment variable using the [same format supported by `env_logger`](https://docs.rs/env_logger/latest/env_logger/#enabling-logging).

The targets are the crate names if you want to trace more or less for specific targets. For example, use `RUST_LOG=info,azure_core=trace` to trace information messages by default but detailed traces for the `azure_core` crate.


## Next steps

- [docs.rs][API reference documentation]
- [Azure SDK design guidelines](https://azure.github.io/azure-sdk/general_introduction.html) - Language-agnostic design principles and patterns
- [Azure SDK for Rust design guidelines](https://azure.github.io/azure-sdk/rust_introduction.html) - Language-specific design principles and patterns
- [Azure SDK for Rust GitHub repository](https://github.com/Azure/azure-sdk-for-rust) - Source code and latest updates


[cargo]: https://dev-doc.rust-lang.org/stable/cargo/commands/cargo.html
[API reference documentation]: https://docs.rs/releases/search?query=azure_
[Crates]: https://crates.io/users/azure-sdk?sort=recent-downloads
[Source code]: https://github.com/Azure/azure-sdk-for-rust/tree/main/sdk/
[REST API documentation]: /rest/api/
[Product documentation]: /azure/
