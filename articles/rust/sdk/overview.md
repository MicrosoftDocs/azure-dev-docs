---
title: Use Azure SDK crates for Rust to access Azure services
description: Get started with Azure SDK crates for Rust. Learn authentication, explore supported services, and follow best practices with code examples. Start building secure Azure apps in Rust today.
ms.date: 07/17/2025
ms.topic: concept-article
ms.service: azure
ms.custom: devx-track-rust
---

# Use Azure SDK crates for Rust 

The Azure SDK crates for Rust are client libraries that help you interact with Azure services from Rust applications. These crates follow Azure client library design guidelines to provide a consistent, idiomatic experience for Rust developers.

[Crates] | [API reference documentation] | [Source code] 

## Azure SDK crate concepts

- **Idiomatic Rust**: Built with Rust best practices and conventions.
- **Async support**: Fully async APIs with pluggable runtime support (defaulting to tokio).
- **Type safety**: Uses Rust's type system for compile-time safety.
- **Thread safety**: All client instance methods are thread-safe and independent of each other.
- **Memory safety**: Zero-cost abstractions with no garbage collection overhead.
- **Modular design**: Use only the crates you need.
- **Unified configuration**: Configure service clients, logging, and retries with [`ClientOptions`][Ref doc - core - ClientOptions].
- **Consistent error handling**: Handle errors consistently across services with [`azure_core::Error`][Ref doc - core - Error].
- **Response handling**: Access detailed HTTP response data with [`Response<T>`][Ref doc - core - Response].
- **Pagination support**: Work with paginated APIs by using [`Pager<T>`][Ref doc - core - Pager] for async streams.
- **Authentication abstractions**: Standardized credential management via [`TokenCredential`][Ref doc - core - TokenCredential].

## Differences between crates and REST APIs

Use the following information to understand when to use each type of access.

* The Azure SDK crates are the preferred method for accessing your Azure service. These crates abstract away the boilerplate code required to manage cloud-based Azure platform REST requests such as authentication, retries, and logging.
* Azure REST APIs are the preferred method if you are:
  * Working with preview services that don't have Azure crates available yet. Consider your code as preview, which should be updated when the service is generally available with crates.
  * Wanting to make REST calls directly because you don't want to use the entire crate to use a single REST API or you want deeper control over the HTTP requests.


## Rust version

The Azure SDK crates for Rust are currently in **beta**. While the APIs are stabilizing and the crates are suitable for development and testing, some breaking changes might occur before the 1.0 release. These crates support the most commonly used Azure services, and we regularly add more based on community feedback and demand.

## Prerequisites to develop with crates

- Rust 1.85 or later. The version is specified in the Azure SDK crate for Rust [Cargo.toml][Azure SDK main Cargo.toml].
- An Azure subscription. You can [create one for free][Free Subscription].
- [Azure CLI]
- [Azure Developer CLI]

> [!TIP]
> For the best development experience, ensure you have the latest stable version of Rust installed. 

### Install Azure SDK crates

Get Azure SDK crates from [crates.io][Crates]. Install the individual crates that you need. 

```console
cargo add azure_identity azure_security_keyvault_secrets azure_storage_blob
```

These crates depend on [`azure_core`][Crate - core] for common functionality. You don't need to install `azure_core` directly, since it's a dependency of all Azure SDK crates.

## Supported Azure services

The following Azure services, prefixed with `azure_`, are currently supported:

| Service | Crate | Description |
|---------|---------|-------------|
| **Cosmos DB** | [`azure_data_cosmos`][Crate - cosmos] | NoSQL database operations |
| **Event Hubs** | [`azure_messaging_eventhubs`][Crate - event hubs] | Big data streaming platform |
| **Key Vault** | [`azure_security_keyvault_certificates`][Crate - key vault - certificates]<br>[`azure_security_keyvault_secrets`][Crate - key vault - secrets]<br>[`azure_security_keyvault_keys`][Crate - key vault - keys] | Manage secrets, keys, and certificates |
| **Storage** | [`azure_storage_blob`][Crate - storage] | Create and manage Azure Storage blobs and containers. |

Crates.io has other crates for Azure services that were established before the official Azure SDK crates listed above. These crates aren't associated with the Azure SDK and shouldn't be used for modern development.

## Crate Cargo.toml features

Each crate defines its features in its Cargo.toml file. For example, see the features for the Azure Core crate in the [`azure_core`][Crate - core] Cargo.toml. Use these features to depend on additional functionality.

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
azure_security_keyvault_certificates = { features = ["hmac_openssl"] }
```

## Provide authentication credentials

The Azure SDK crates need credentials to authenticate to Microsoft Entra ID. Azure services provide different authentication methods for connection. We recommend using the [`azure_identity`][Crate - identity] crate for authentication, which provides a set of credential structures that you can use across multiple Azure services. `azure_identity` offers several benefits over keys or connection strings:

* Fast onboarding
* Most secure method
* Separation of the authentication mechanism from the code. This separation allows you to use the same code locally and on the Azure platform while the credentials are different.
* Chained authentication so several mechanisms can be available.


## Create secure clients with proper authentication

After creating a credential, pass it to your Azure SDK client along with any necessary configuration. The client might need extra information such as a service endpoint or container name, which you can find in the Azure portal for your resource.

### Security best practices

- **Never hardcode credentials** in your source code
- Use **Managed Identity** when running in Azure
- Store sensitive configuration in **Azure Key Vault**
- Regularly **rotate credentials**

## Client objects

You use client objects to interact with Azure services. Each client object, from a service's crate, corresponds to a specific Azure service and provides methods to perform operations on that service. For example, [`azure_security_keyvault_secrets::SecretClient`][Secret client] is used to interact with Azure Key Vault secrets.

When you create the client objects, you can provide a [`ClientOptions`][Client Options Docs] parameter for customizing the interactions with the service. Use `ClientOptions` to set things like timeouts, retry policies, and other configurations.

```rust
use azure_identity::{
    ManagedIdentityCredential,
    ManagedIdentityCredentialOptions,
    UserAssignedId
};
use azure_security_keyvault_secrets::{
    SecretClient, 
    SecretClientOptions
};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {

    // Get environment variables
    let key_vault_name = std::env::var("AZURE_KEYVAULT_NAME")
        .map_err(|_| "AZURE_KEYVAULT_NAME environment variable is required")?;

    let user_assigned_id: Option<UserAssignedId> = std::env::var("AZURE_USER_ASSIGNED_IDENTITY")
        .ok()
        .map(|id| UserAssignedId::ClientId(id.clone()));

    // Set up authentication 
    let options = SecretClientOptions {
        api_version: "7.5".to_string(),
        ..Default::default()
    };

    let credential = ManagedIdentityCredential::new(Some(credential_options))?;

    // Create a Key Vault client for secrets
     let client = SecretClient::new(
        key_vault_name.as_str(),
        credential,
        Some(SecretClientOptions::default()),
    )?;

    Ok(())
}
```

## Access HTTP response details by using `Response<T>`

_Service clients_ include methods you use to call Azure services. We call these client methods _service methods_.
_Service methods_ return a shared `azure_core` type `Response<T>`, where `T` is either a `Model` type or a `ResponseBody` that represents a raw stream of bytes.
This type provides access to both the deserialized result of the service call and the details of the HTTP response returned from the server.

```rust no_run
use azure_core::http::Response;
use azure_identity::DeveloperToolsCredential;
use azure_security_keyvault_secrets::{models::Secret, SecretClient};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // create a client
    let credential = DeveloperToolsCredential::new(None)?;
    let client = SecretClient::new(
        "https://<your-key-vault-name>.vault.azure.net/",
        credential.clone(),
        None,
    )?;

    // call a service method, which returns Response<T>
    let response = client.get_secret("secret-name", "", None).await?;

    // Response<T> has two main accessors:
    // 1. The `into_body()` function consumes self to deserialize into a model type
    let secret = response.into_body().await?;

    // get response again because it was moved in above statement
    let response: Response<Secret> = client.get_secret("secret-name", "", None).await?;

    // 2. The deconstruct() method for accessing all the details of the HTTP response
    let (status, headers, body) = response.deconstruct();

    // for example, you can access HTTP status
    println!("Status: {}", status);

    // or the headers
    for (header_name, header_value) in headers.iter() {
        println!("{}: {}", header_name.as_str(), header_value.as_str());
    }

    Ok(())
}
```

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

To iterate through all items in a paginated response, use the `into_pages()` method on the returned `Pager<T>`. This method returns an async stream of pages, so you can process each page as it becomes available. This feature is useful for operations with large result sets.


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


## Next steps

[!INCLUDE [common resources](../includes/resources.md)]

[cargo]: https://dev-doc.rust-lang.org/stable/cargo/commands/cargo.html
[API reference documentation]: https://docs.rs/releases/search?query=azure_
[Crates]: https://crates.io/users/azure-sdk?sort=recent-downloads
[Source code]: https://github.com/Azure/azure-sdk-for-rust/tree/main/sdk/
[REST API documentation]: /rest/api/
[Product documentation]: /azure/

[Azure SDK main Cargo.toml]: https://github.com/Azure/azure-sdk-for-rust/blob/main/Cargo.toml

[Ref doc - core - ClientOptions]:https://docs.rs/azure_core/latest/azure_core/http/struct.ClientOptions.html
[Ref doc - core - Error]: https://docs.rs/azure_core/latest/azure_core/struct.Error.html
[Ref doc - core - Response]: https://docs.rs/azure_core/latest/azure_core/http/struct.Response.html
[Ref doc - core - Pager]: https://docs.rs/azure_core/latest/azure_core/http/type.Pager.html
[Ref doc - core - TokenCredential]: https://docs.rs/azure_core/latest/azure_core/credentials/trait.TokenCredential.html

[Crate - identity]: https://crates.io/crates/azure_identity
[Crate - core]: https://crates.io/crates/azure_core
[Crate - cosmos]: https://crates.io/crates/azure_data_cosmos
[Crate - event hubs]: https://crates.io/crates/azure_messaging_eventhubs
[Crate - key vault - secrets]: https://crates.io/crates/azure_security_keyvault_secrets
[Crate - key vault - certificates]: https://crates.io/crates/azure_security_keyvault_certificates
[Crate - key vault - keys]: https://crates.io/crates/azure_security_keyvault_keys
[Crate - storage]: https://crates.io/crates/azure_storage

[Free Subscription]: https://azure.microsoft.com/free/

[Azure Developer CLI]: /azure/developer/azure-developer-cli
[Azure CLI]: /cli/azure/
