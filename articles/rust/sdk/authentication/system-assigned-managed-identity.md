---
title: Authenticate Azure-hosted Rust apps to Azure resources by using a system-assigned managed identity
description: Learn how to authenticate Azure-hosted Rust apps to other Azure services using a system-assigned managed identity.
ms.date: 02/20/2026
ms.topic: how-to
ms.custom: devx-track-rust, devx-track-azurecli
ms.service: azure-rust
---

# Authenticate Azure-hosted Rust apps to Azure resources by using a system-assigned managed identity

The recommended approach to authenticate an Azure-hosted app to other Azure resources is to use a [managed identity](/entra/identity/managed-identities-azure-resources/overview). This approach is [supported for most Azure services](/entra/identity/managed-identities-azure-resources/managed-identities-status), including apps hosted on Azure App Service, Azure Container Apps, and Azure Virtual Machines. Discover more about different authentication techniques and approaches on the [authentication overview](overview.md) page. In the following sections, you learn about:

- Essential managed identity concepts
- How to create a system-assigned managed identity for your app
- How to assign roles to the system-assigned managed identity
- How to authenticate by using the system-assigned managed identity from your app code

[!INCLUDE [Managed identity concepts](<../../../includes/authentication/managed-identity-concepts.md>)]

The following sections describe the steps to enable and use a system-assigned managed identity for an Azure-hosted app. If you need to use a user-assigned managed identity, visit the [user-assigned managed identities](user-assigned-managed-identity.md) article for more information.

[!INCLUDE [Language agnostic system assigned procedures](<../../../includes/authentication/system-assigned-managed-identity.md>)]

[!INCLUDE [Rust implement-managed-identity-concepts](../includes/implement-managed-identity-concepts.md)]

### Implement the code

Add the [azure_identity](https://crates.io/crates/azure_identity) crate.

In a terminal, go to the application project directory and run:

```console
cargo add azure_identity
```

Azure services are accessed by using specialized clients from the various Azure SDK crates. For any Rust code that instantiates an Azure SDK client in your app, you need to:

1. Import the `azure_identity` crate.
1. Create an instance of `ManagedIdentityCredential`.
1. Pass the `ManagedIdentityCredential` instance to the Azure SDK client constructor.

An example of these steps is shown in the following code segment with an Azure Key Vault Secrets client.

:::code language="rust" source="../../snippets/authentication/examples/system_assigned_identity.rs":::

> [!IMPORTANT]
> In production, use
> [`ManagedIdentityCredential`](https://docs.rs/azure_identity/latest/azure_identity/struct.ManagedIdentityCredential.html)
> to authenticate with the managed identity assigned to your app.

During local development, you can use [`DeveloperToolsCredential`](https://docs.rs/azure_identity/latest/azure_identity/struct.DeveloperToolsCredential.html) to authenticate by using your developer tools. For more information, see the [local development authentication](local-development-dev-accounts.md) article.
