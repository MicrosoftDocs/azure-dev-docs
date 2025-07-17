---
title: Use Azure SDK for Rust client libraries
description: Get started with Azure SDK for Rust client libraries. Learn authentication, explore supported services like Storage and Key Vault, and follow best practices with code examples.
ms.date: 07/17/2025
ms.topic: concept-article
ms.service: azure
ms.subservice: developer-tools
ms.custom: devx-track-rust
---

# Use Azure SDK for Rust client libraries

The Azure SDK for Rust provides a collection of client libraries that make it easy to interact with Azure services from Rust applications. This SDK follows Azure SDK design guidelines to provide a consistent, idiomatic experience that's natural for Rust developers.

[Source code] | [Package (crates.io)] | [API reference documentation] | [REST API documentation] | [Product documentation]


## Key features

- **Idiomatic Rust**: Built with Rust best practices and conventions
- **Async/await support**: Fully async APIs using Tokio runtime
- **Type safety**: Uses Rust's type system for compile-time safety
- **Memory safety**: Zero-cost abstractions with no garbage collection overhead
- **Modular design**: Use only the client libraries you need

## Differences between client libraries and REST APIs

Use the following information to understand when to use each type of access.

* The Azure client libraries are the preferred method of accessing your Azure service. These libraries abstract away the boilerplate code required to manage cloud-based Azure platform REST requests such as authentication, retries, and logging.
* Azure REST APIs are the preferred method if you are:
  * Working with preview services that don't have Azure client libraries available. Consider your code as preview, which should be updated when the service is generally available with client libraries.
  * Wanting to make REST calls directly because you don't want the entire SDK to use a single REST API or you want deeper control over the HTTP requests.


## Current status

The Azure SDK for Rust is currently in **beta**. While the APIs are stabilizing and the SDK is suitable for development and testing, some breaking changes might occur before the 1.0 release. The SDK supports the most commonly used Azure services with more being added regularly based on community feedback and demand.

## Supported Azure services

The following Azure services are currently supported:

| Service | Package | Description |
|---------|---------|-------------|
| **Storage** | `azure_storage_blob` | Create and manage Azure Storage blobs and containers. |
| **Key Vault** | `azure_key_vault_certificates`<br>`azure_key_vault_secrets`<br>`azure_key_vault_keys` | Manage secrets, keys, and certificates |
| **Cosmos DB** | `azure_data_cosmos` | NoSQL database operations |
| **Event Hubs** | `azure_messaging_eventhubs` | Big data streaming platform |
| **Identity** | `azure_identity` | Authentication and credential management |
| **Core** | `azure_core` | Shared functionality and HTTP pipeline |

## Get started with Azure SDK for Rust

### Prerequisites

- Rust 1.85 or later. The version is specified in the Azure SDK for Rust [Cargo.toml](https://github.com/Azure/azure-sdk-for-rust/blob/main/Cargo.toml)
- An Azure subscription ([create one for free](https://azure.microsoft.com/free/))
- Azure CLI (for local development authentication)

> [!TIP]
> For the best development experience, ensure you have the latest stable version of Rust installed. 

### Install Azure client libraries

Get Azure client libraries from [crates.io](https://crates.io). Install the individual SDKs you need.

Add the required Azure SDK packages to your `Cargo.toml`. Start with the core packages you need:

```toml
[dependencies]
azure_identity = "0.20"
tokio = { version = "1.0", features = ["full"] }
```

For other services, add the corresponding packages:

```toml
# Additional services
azure_key_vault = "0.20"
azure_storage_blobs = "0.20"
azure_service_bus = "0.20" 
azure_cosmos = "0.20"
```

## Provide authentication credentials

The Azure client libraries need credentials to authenticate to the Azure platform. [Credential structures](https://docs.rs/azure_identity/latest/azure_identity/#credential-structures) from [azure_identity](https://crates.io/crates/azure_identity) offer several benefits:


* Fast onboarding
* Most secure method
* Separation of the authentication mechanism from the code. This separation allows you to use the same code locally and on the Azure platform while the credentials are different.
* Chained authentication so several mechanisms can be available.

## Create an SDK client and call methods

After you create a credential programmatically, pass the credential to your Azure client. The client might need extra information such as a subscription ID or service endpoint. You can find these values in the Azure portal for your resource.

```rust
use azure_storage_blob::{BlobClient, BlobClientOptions};
use azure_identity::DefaultAzureCredential;    

    let storage_account = std::env::var("AZURE_STORAGE_ACCOUNT").map_err(|_| "AZURE_STORAGE_ACCOUNT environment variable is required")?;
    let container_name = std::env::var("AZURE_STORAGE_CONTAINER").map_err(|_| "AZURE_STORAGE_CONTAINER environment variable is required")?;
    let blob_name = std::env::var("AZURE_STORAGE_BLOB").map_err(|_| "AZURE_STORAGE_BLOB environment variable is required")?;

let credential = DefaultAzureCredential::default();

let blob_client = BlobClient::new(
        &endpoint,                                               // endpoint
        container_name.clone(),                                  // container name
        blob_name,                                               // blob name
        credential,                                              // credential
        Some(BlobClientOptions::default()),                      // BlobClient options
    )?;
```

The `DefaultAzureCredential` automatically finds and uses the authentication token stored locally by checking a series of credentials based on the environment.

TBD - image from Scott Addie


## Best practices

### Error handling

Always handle errors appropriately using Rust's `Result` type:

```rust
use azure_core::{error::{ErrorKind}, http::{RequestContent, StatusCode}};

println!("🔄 Attempting to upload blob...");
let data = b"hello world";

match blob_client
    .upload(
        RequestContent::from(data.to_vec()), // data
        true,                                // overwrite (changed to true)
        u64::try_from(data.len())?,          // content length
        None,                                // upload options
    )
    .await 
{
    Ok(_) => {
        println!("✅ Blob uploaded successfully!");
    }
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
```

### Resource management

Use RAII (Resource Acquisition Is Initialization) patterns:

```rust
struct MyAzureService {
    client: BlobServiceClient,
}

impl MyAzureService {
    pub fn new() -> azure_core::Result<Self> {
        let credential = DefaultAzureCredential::default();
        let storage_credentials = StorageCredentials::token_credential(credential);
        
        let client = BlobServiceClient::new(
            "https://mystorageaccount.blob.core.windows.net",
            storage_credentials,
        );
        
        Ok(Self { client })
    }
}
```

### Async considerations

Use appropriate concurrency patterns:

```rust
use tokio::task::JoinSet;

async fn upload_multiple_blobs(files: Vec<(&str, Vec<u8>)>) -> azure_core::Result<()> {
    let mut join_set = JoinSet::new();
    
    for (name, data) in files {
        let client = container_client.blob_client(name);
        join_set.spawn(async move {
            client.put_block_blob(data).await
        });
    }
    
    while let Some(result) = join_set.join_next().await {
        result??; // Handle both join and Azure errors
    }
    
    Ok(())
}
```


### Security considerations

- **Never hardcode credentials** in your source code.
- Use **Managed Identity** when running in Azure.
- Store sensitive configuration in **Azure Key Vault**.
- Enable **logging** for security monitoring.
- Regularly **rotate credentials**.

```rust
// ❌ DON'T: Hardcode credentials
let bad_credential = ClientSecretCredential::new(
    "hardcoded-tenant-id",
    "hardcoded-client-id", 
    "hardcoded-secret",
    None,
);

// ✅ DO: Use environment variables or Managed Identity
let good_credential = DefaultAzureCredential::default();
```

## Enable logging

To log tracing information to the terminal, add the `RUST_LOG` environment variable using the [same format supported by `env_logger`](https://docs.rs/env_logger/latest/env_logger/#enabling-logging).

The targets are the crate names if you want to trace more or less for specific targets, such as this example `RUST_LOG=info,azure_core=trace`, to trace information messages by default but detailed traces for the `azure_core` crate.

## Test Azure SDK applications

The Azure SDK for Rust supports several testing approaches: integration testing with real Azure services, unit testing with dependency injection for testable code structure, and local development testing using emulator such as Azurite.

### Integration testing with test containers

For comprehensive testing, use real Azure services with test containers or emulators:

```rust
#[cfg(test)]
mod tests {
    use super::*;
    use azure_identity::DefaultAzureCredential;
    use azure_storage_blob::BlobServiceClient;
    
    #[tokio::test]
    #[ignore] // Run with --ignored for integration tests
    async fn test_blob_operations() -> azure_core::Result<()> {
        let credential = DefaultAzureCredential::default();
        let client = BlobServiceClient::new(
            "https://teststorageaccount.blob.core.windows.net",
            credential,
        );
        
        let container = client.container_client("test-container");
        let blob = container.blob_client("test-blob.txt");
        
        // Upload test data
        let data = "Hello, test!".as_bytes();
        blob.put_block_blob(data).await?;
        
        // Verify upload
        let downloaded = blob.get_content().await?;
        assert_eq!(downloaded, data);
        
        // Cleanup
        blob.delete().await?;
        
        Ok(())
    }
}
```

### Unit testing with dependency injection

Structure your code to accept client dependencies for easier testing:

```rust
pub struct BlobService {
    client: BlobServiceClient,
}

impl BlobService {
    pub fn new(client: BlobServiceClient) -> Self {
        Self { client }
    }
    
    pub async fn upload_text(&self, container: &str, name: &str, content: &str) -> azure_core::Result<()> {
        self.client
            .container_client(container)
            .blob_client(name)
            .put_block_blob(content.as_bytes())
            .await?;
        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    
    // Create test doubles or use test credentials
    fn create_test_client() -> BlobServiceClient {
        // Use test storage account or emulator
        let credential = DefaultAzureCredential::default();
        BlobServiceClient::new("https://127.0.0.1:10000/devstoreaccount1", credential)
    }
    
    #[tokio::test]
    async fn test_upload_text() {
        let client = create_test_client();
        let service = BlobService::new(client);
        
        // Test with actual Azure Storage Emulator (Azurite)
        let result = service.upload_text("test", "file.txt", "content").await;
        assert!(result.is_ok());
    }
}
```

### Testing with an emulator

Add to your test dependencies in `Cargo.toml`:

```toml
[dev-dependencies]
tokio-test = "0.4"
azure_identity = "0.20"
azure_storage_blob = "0.20"
```

Run the Azure Storage emulator, Azurite, for local testing:

```bash
# Install Azurite
npm install -g azurite

# Start Azurite
azurite --silent --location ./azurite-data --debug ./azurite-debug.log
```

## Performance optimizations with connection pooling

The Azure SDK for Rust automatically manages HTTP connections and connection pooling. You can configure the HTTP client for optimal performance:

```rust
use azure_core::ClientOptions;
use std::time::Duration;

let client_options = ClientOptions::default()
    .timeout(Duration::from_secs(30))
    .retry_policy(RetryPolicy::exponential(ExponentialRetryOptions::default()));
```

## Next steps

- [docs.rs][API reference documentation]
- [Azure SDK design guidelines](https://azure.github.io/azure-sdk/general_introduction.html) - Design principles and patterns
- [Azure SDK for Rust GitHub repository](https://github.com/Azure/azure-sdk-for-rust) - Source code and latest updates


[cargo]: https://dev-doc.rust-lang.org/stable/cargo/commands/cargo.html
[API reference documentation]: https://docs.rs/releases/search?query=azure_
[Package (crates.io)]: https://crates.io/search?q=azure_
[Source code]: https://github.com/Azure/azure-sdk-for-rust/tree/main/sdk/
[REST API documentation]: /rest/api/
[Product documentation]: /azure/
