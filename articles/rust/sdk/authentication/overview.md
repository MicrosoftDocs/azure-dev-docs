---
title: Authenticate Rust Apps to Azure Services by Using the Azure Identity Crate
description: Authenticate Rust applications with Azure services using the Azure Identity crate. Discover secure approaches for local development and managed identities. Start integrating with Azure today.
ms.date: 09/02/2025
ms.topic: overview
ms.service: azure-rust
ms.custom:
  - devx-track-rust
---

# Authenticate Rust apps to Azure services

Rust applications must authenticate to Azure services such as Storage, Key Vault, or Cosmos DB. This article explains how to use the Azure Identity crate to securely authenticate Rust apps in local development and server environments, improving security and simplifying credential management.

## Recommended token-based authentication

[!INCLUDE [Recommended token-based app authentication approach](<../../../includes/authentication/overview-recommend-authentication-rust.md>)]

### Advantages of token-based authentication

When building apps for Azure, we strongly recommend using token-based authentication instead of secrets like connection strings or keys.

[!INCLUDE [Advantages of token-based authentication](<../../../includes/authentication/overview-advantages.md>)]

## Authenticate during local development

[!INCLUDE [Authentication during local development](<../../../includes/authentication/overview-local-environments.md>)]


### Authenticate with Azure CLI credential

The Azure CLI credential uses the authentication state of the Azure CLI to authenticate your Rust application. This credential is ideal for local development when you're already signed in with `az login`.

:::code language="rust" source="~/../azure-sdk-for-rust-docs/examples/authenticate_azure_cli.rs":::

### Authenticate with Azure Developer CLI credential

The Azure Developer CLI credential uses the authentication state of the Azure Developer CLI (`azd`) to authenticate your application. This credential is useful when working with azd templates and workflows.

:::code language="rust" source="~/../azure-sdk-for-rust-docs/examples/authenticate_azure_dev_cli.rs":::

## Authenticate in server environments

In server environments, use **managed identities** for secure, passwordless authentication. [Managed identities](/entra/identity/managed-identities-azure-resources/overview) are automatically created and managed by Azure, so your application can authenticate without needing to store credentials.

When hosting in a server environment, assign a unique application identity to each application for each environment. In Azure, an app identity is represented by a service principal, a special type of security principal that identifies and authenticates apps to Azure. The type of service principal you use for your app depends on where your app runs.

:::code language="rust" source="~/../azure-sdk-for-rust-docs/examples/authenticate_server.rs":::

## Sample code

The code shown in this article is available on <https://github.com/Azure/azure-sdk-for-rust-docs/>.

## Additional resources

[!INCLUDE [common resources](../../includes/resources.md)]