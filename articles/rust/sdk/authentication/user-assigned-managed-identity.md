---
title: Authenticate Azure-hosted Rust apps to Azure resources by using a user-assigned managed identity
description: Learn how to authenticate Azure-hosted Rust apps to other Azure services using a user-assigned managed identity.
ms.date: 02/20/2026
ms.topic: how-to
ms.custom: devx-track-rust, devx-track-azurecli
ms.service: azure-rust
---

# Authenticate Azure-hosted Rust apps to Azure resources by using a user-assigned managed identity

The recommended approach to authenticate an Azure-hosted app to other Azure resources is to use a [managed identity](/entra/identity/managed-identities-azure-resources/overview). This approach is [supported for most Azure services](/entra/identity/managed-identities-azure-resources/managed-identities-status), including apps hosted on Azure App Service, Azure Container Apps, and Azure Virtual Machines. Discover more about different authentication techniques and approaches on the [authentication overview](overview.md) page. In the following sections, you learn about:

- Essential managed identity concepts
- How to create a user-assigned managed identity for your app
- How to assign roles to the user-assigned managed identity
- How to authenticate by using the user-assigned managed identity from your app code

[!INCLUDE [Managed identity concepts](../../../includes/authentication/managed-identity-concepts.md)]

The following sections describe the steps to enable and use a user-assigned managed identity for an Azure-hosted app. If you need to use a system-assigned managed identity, see the [system-assigned managed identities](system-assigned-managed-identity.md) article for more information.

[!INCLUDE [Language agnostic user assigned procedures](<../../../includes/authentication/user-assigned-managed-identity.md>)]

[!INCLUDE [Rust implement-managed-identity-concepts](../includes/implement-managed-identity-concepts.md)]

### Implement the code

Add the [azure_identity](https://crates.io/crates/azure_identity) crate.

In a terminal, go to the application project directory and run:

```console
cargo add azure_identity
```

Specialized clients from the various Azure SDK crates access Azure services. For any Rust code that instantiates an Azure SDK client in your app, you need to:

1. Import the `azure_identity` crate.
1. Create an instance of `ManagedIdentityCredential` with the identity of your user-assigned managed identity.
1. Pass the `ManagedIdentityCredential` instance to the Azure SDK client constructor.

The `ManagedIdentityCredentialOptions` struct accepts a [`UserAssignedId`](https://docs.rs/azure_identity/latest/azure_identity/enum.UserAssignedId.html) enum to specify which user-assigned identity to authenticate. You can identify the managed identity by using its client ID, object (principal) ID, or Azure resource ID.

## [Client ID](#tab/client-id)

The most common approach is to use the client ID of the user-assigned managed identity:

:::code language="rust" source="../../snippets/authentication/examples/user_assigned_identity.rs":::

## [Object ID](#tab/object-id)

You can also identify the managed identity by using its object (principal) ID:

:::code language="rust" source="../../snippets/authentication/examples/user_assigned_identity_object_id.rs":::

## [Resource ID](#tab/resource-id)

Alternatively, you can use the full Azure resource ID of the managed identity. Resource IDs aren't supported on Azure App Service — use a client ID or object ID instead.

:::code language="rust" source="../../snippets/authentication/examples/user_assigned_identity_resource_id.rs":::

---

> [!IMPORTANT]
> In production, use
> [`ManagedIdentityCredential`](https://docs.rs/azure_identity/latest/azure_identity/struct.ManagedIdentityCredential.html)
> to authenticate with the managed identity assigned to your app.

During local development, you can use [`DeveloperToolsCredential`](https://docs.rs/azure_identity/latest/azure_identity/struct.DeveloperToolsCredential.html) to authenticate by using your developer tools. For more information, see the [local development authentication](local-development-dev-accounts.md) article.
