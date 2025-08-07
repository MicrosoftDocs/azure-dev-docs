---
title: How to Authenticate Rust Apps with Azure Services
description: Learn how to authenticate Rust applications with Azure services using the Azure Identity crate. Includes code examples for local development and server environments with managed identities.
ms.date: 08/07/2025
ms.topic: overview
ms.custom:
  - devx-track-rust
---

## How to authenticate Rust apps to Azure services using the Azure Identity crate

[!INCLUDE [Create app registration step 1](<../../../includes/authentication/overview-para-1.md>)] This article describes the recommended approaches to authenticate an app to Azure when using the Azure SDK for JavaScript.

## Recommended app authentication approach

[!INCLUDE [Recommended app authentication approach](<../../../includes/authentication/overview-recommend-authentication-rust.md>)]

TBD - image from Scott Addie


### Advantages of token-based authentication

[!INCLUDE [Advantages of token-based authentication](<../../../includes/authentication/defaultazurecredential-overview-javascript.md>)]

[!INCLUDE [Advantages of token-based authentication](<../../../includes/authentication/overview-advantages.md>)]

Use the following Azure SDK crate: 

* [azure_identity](https://crates.io/crates/azure_identity)


## Authentication in server environments

[!INCLUDE [Authentication in server environments](<../../../includes/authentication/overview-server-environments.md>)]

## Authentication during local development

[!INCLUDE [Authentication during local development](<../../../includes/authentication/overview-local-environments.md>)]


### Authenticate with Azure CLI credential

The Azure CLI credential uses the authentication state of the Azure CLI to authenticate your Rust application. This is ideal for local development when you're already signed in with `az login`.

```rust
use azure_identity::AzureCliCredential;
use azure_security_keyvault_secrets::{SecretClient, SecretClientOptions};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {

    let key_vault_name = std::env::var("AZURE_KEYVAULT_NAME")
        .map_err(|_| "AZURE_KEYVAULT_NAME environment variable is required")?;

    let credential = AzureCliCredential::new(None)?;

    let key_vault_options = SecretClientOptions::default();

    let client = SecretClient::new(
        key_vault_name.as_str(),
        credential,
        Some(key_vault_options),
    )?;

    Ok(())
}
```

### Authenticate with Azure Developer CLI credential

The Azure Developer CLI credential uses the authentication state of the Azure Developer CLI (`azd`) to authenticate your application. This is useful when working with azd templates and workflows.

```rust
use azure_identity::AzureDeveloperCliCredential;
use azure_security_keyvault_secrets::{SecretClient, SecretClientOptions};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {

    let key_vault_name = std::env::var("AZURE_KEYVAULT_NAME")
        .map_err(|_| "AZURE_KEYVAULT_NAME environment variable is required")?;

    let credential = AzureDeveloperCliCredential::new(None)?;

    let key_vault_options = SecretClientOptions::default();

    let client = SecretClient::new(
        key_vault_name.as_str(),
        credential,
        Some(key_vault_options),
    )?;

    Ok(())
}
```

## Authenticate in server environments

In server environments, use **managed identities** for secure, passwordless authentication. [Managed identities](/entra/identity/managed-identities-azure-resources/overview) are automatically created and managed by Azure, allowing your application to authenticate without needing to store credentials.

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
    let credential_options = ManagedIdentityCredentialOptions {
        user_assigned_id,
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