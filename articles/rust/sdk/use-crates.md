---
title: Use Azure SDK crates for Rust to access Azure services
description: Get started with Azure SDK crates for Rust. Learn authentication, explore supported Azure services, and follow best practices with code examples. Build secure Azure applications in Rust—start now.
ms.date: 07/17/2025
ms.topic: concept-article
ms.service: azure
ms.custom: devx-track-rust
---

# Use Azure SDK crates for Rust to access Azure services

The Azure SDK crates for Rust help you access Azure services from Rust applications. This article explains how to use these crates, including authentication, supported services, and best practices.

[Crates] | [API reference documentation] | [Source code]

## Prerequisites to develop with crates

- Rust 1.85 or later. The version is specified in the Azure SDK crate for Rust [Cargo.toml][Azure SDK main Cargo.toml].
- An Azure subscription. You can [create one for free][Free Subscription].
- [Azure CLI]
- [Azure Developer CLI]
- [Azure SDK crates for Rust](./installation.md)

> [!TIP]
> For the best development experience, ensure you have the latest stable version of Rust installed. 


## Provide authentication credentials

The Azure SDK crates need credentials to authenticate to Microsoft Entra ID. Azure services provide different authentication methods for connection. We recommend using the [`azure_identity`][Crate - identity] crate for authentication. Learn more about [authentication for Azure SDK for Rust].

## Client objects

You use client objects to interact with Azure services. Each client object, from a service's crate, corresponds to a specific Azure service and provides methods to perform operations on that service. For example, [`azure_security_keyvault_secrets::SecretClient`][Ref doc - secret - SecretClient] is used to interact with Azure Key Vault secrets.

When you create the client objects, you can provide a [`ClientOptions`][Ref doc - core - ClientOptions] parameter for customizing the interactions with the service. Use `ClientOptions` to set things like timeouts, retry policies, and other configurations.

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
_Service methods_ return a shared `azure_core` type [`Response<T>`][Ref doc - core - Response], where `T` is either a `Model` type or a `ResponseBody` that represents a raw stream of bytes.
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

When a service call fails, the returned result contains an error. The error type provides a [`status`][Ref doc - core - error status] property with an HTTP status code and an [`error_code`][Ref doc - core - error_code] property with a service-specific error code.

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

## Pagination to get all items

If a service call returns multiple values in pages, it returns `Result<Pager<T>>` as a [`Result`][Ref doc - core - Result] of [`Pager`][Ref doc - core - Pager]. You can iterate all items from all pages. This feature is useful for operations with small to medium result sets.

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

## Pagination to process each page of items

To iterate through all items in a paginated response, use the [`into_pages()`][Ref doc - core - into_pages] method on the returned [`Pager`][Ref doc - core - Pager]. This method returns an async stream of pages as a [`PageIterator`][Ref doc - core - PageIterator], so you can process each page as it becomes available. This feature is useful for operations with large result sets.


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

[Ref doc - secret - SecretClient]: https://docs.rs/azure_security_keyvault_secrets/latest/azure_security_keyvault_secrets/struct.SecretClient.html
[Ref doc - core - ClientOptions]:https://docs.rs/azure_core/latest/azure_core/http/struct.ClientOptions.html
[Ref doc - core - Error]: https://docs.rs/azure_core/latest/azure_core/struct.Error.html
[Ref doc - core - error_code]: https://docs.rs/azure_core/latest/azure_core/error/struct.HttpError.html#method.error_code
[Ref doc - core - Result]: https://docs.rs/azure_core/latest/azure_core/type.Result.html
[Ref doc - core - Response]: https://docs.rs/azure_core/latest/azure_core/http/struct.Response.html
[Ref doc - core - Pager]: https://docs.rs/azure_core/latest/azure_core/http/type.Pager.html
[Ref doc - core - into_pages]: https://docs.rs/azure_core/latest/azure_core/http/struct.ItemIterator.html#method.into_pages
[Ref doc - core - PageIterator]: https://docs.rs/azure_core/latest/azure_core/http/struct.PageIterator.html
[Ref doc - core - TokenCredential]: https://docs.rs/azure_core/latest/azure_core/credentials/trait.TokenCredential.html
[Ref doc - core - error status]: https://docs.rs/azure_core/latest/azure_core/error/struct.HttpError.html#method.status

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

[authentication for Azure SDK for Rust]: ./authentication/overview.md