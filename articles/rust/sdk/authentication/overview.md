---
title: How to Authenticate Rust Apps with Azure Services Using Azure Identity
description: Authenticate Rust applications with Azure services using the Azure Identity crate. Learn recommended approaches for local development and managed identities.
ms.date: 08/13/2025
ms.topic: overview
ms.custom:
  - devx-track-rust
---

# Authenticate Rust apps to Azure services by using the Azure Identity crate

Rust applications must authenticate to Azure services such as Storage, Key Vault, or Cosmos DB. This article explains how to use the Azure Identity SDK crate to securely authenticate Rust apps in local development and server environments, improving security and simplifying credential management.

## Recommended token-based authentication

[!INCLUDE [Recommended token-based app authentication approach](<../../../includes/authentication/overview-recommend-authentication-rust.md>)]

### Advantages of token-based authentication

When building apps for Azure, we strongly recommend using token-based authentication instead of secrets like connection strings or keys.

[!INCLUDE [Advantages of token-based authentication](<../../../includes/authentication/overview-advantages.md>)]

Use the following Azure SDK crate: 

* [azure_identity](https://crates.io/crates/azure_identity)

## Authenticate during local development

[!INCLUDE [Authentication during local development](<../../../includes/authentication/overview-local-environments.md>)]


### Authenticate with Azure CLI credential

The Azure CLI credential uses the authentication state of the Azure CLI to authenticate your Rust application. This credential is ideal for local development when you're already signed in with `az login`.

:::code language="rust" source="~/azure-sdk-for-rust-docs/examples/authenticate_azure_cli.rs":::

### Authenticate with Azure Developer CLI credential

The Azure Developer CLI credential uses the authentication state of the Azure Developer CLI (`azd`) to authenticate your application. This credential is useful when working with azd templates and workflows.

:::code language="rust" source="~/azure-sdk-for-rust-docs/examples/authenticate_azure_developer_cli.rs":::

## Authenticate in server environments

In server environments, use **managed identities** for secure, passwordless authentication. [Managed identities](/entra/identity/managed-identities-azure-resources/overview) are automatically created and managed by Azure, so your application can authenticate without needing to store credentials.

When hosting in a server environment, assign a unique application identity to each application for each environment. In Azure, an app identity is represented by a service principal, a special type of security principal that identifies and authenticates apps to Azure. The type of service principal you use for your app depends on where your app runs.

:::code language="rust" source="~/azure-sdk-for-rust-docs/examples/authenticate_server.rs":::
