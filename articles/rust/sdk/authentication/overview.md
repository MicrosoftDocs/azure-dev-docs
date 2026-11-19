---
title: Authenticate Rust Apps to Azure Using the Azure Identity Crate
description: Authenticate Rust apps with Azure services using the Azure Identity crate for local development and production managed identities.
ms.date: 05/18/2026
ms.service: azure-rust
ms.topic: overview
ms.custom:
  - devx-track-rust
---

# Authenticate Rust apps to Azure using the Azure Identity crate

Apps use the Azure Identity crate to authenticate to Microsoft Entra ID and access Azure services. This article summarizes recommended authentication approaches for apps running on Azure, hosted on-premises, or in local development.

## Recommended token-based authentication

[!INCLUDE [Recommended token-based app authentication approach](<../../../includes/authentication/overview-recommend-authentication-rust.md>)]

### Advantages of token-based authentication

When building apps for Azure, we strongly recommend using token-based authentication instead of secrets like connection strings or keys.

[!INCLUDE [Advantages of token-based authentication](<../../../includes/authentication/overview-advantages.md>)]

## Authentication for Azure-hosted apps

When you host your app on Azure, it can use managed identities to authenticate to Azure resources without needing to manage any credentials. There are two types of managed identities: user-assigned and system-assigned.

#### Use a user-assigned managed identity

You create a user-assigned managed identity as a standalone Azure resource. You can assign it to one or more Azure resources, allowing those resources to share the same identity and permissions. To authenticate by using a user-assigned managed identity, create the identity, assign it to your Azure resource, and then configure your app to use this identity for authentication by specifying its client ID.

> [!div class="nextstepaction"]
> [Authenticate using a user-assigned managed identity](user-assigned-managed-identity.md)

#### Use a system-assigned managed identity

You enable a system-assigned managed identity directly on an Azure resource. The identity is tied to the lifecycle of that resource and is automatically deleted when the resource is deleted. To authenticate by using a system-assigned managed identity, enable the identity on your Azure resource and then configure your app to use this identity for authentication.

> [!div class="nextstepaction"]
> [Authenticate using a system-assigned managed identity](system-assigned-managed-identity.md)

## Authentication during local development

[!INCLUDE [Authentication during local development](<../../../includes/authentication/overview-local-environments.md>)]

During local development, authenticate to Azure resources by using your developer credentials or a service principal.

#### Use developer credentials

Use your own Azure credentials to authenticate to Azure resources during local development. Typically, use a development tool, such as Azure CLI, which can provide your app with the necessary tokens to access Azure services.

> [!div class="nextstepaction"]
> [Authenticate locally using developer credentials](local-development-dev-accounts.md)

#### Use a service principal

Use a service principal only when you need to test authentication with an application identity during local development.

> [!div class="nextstepaction"]
> [Authenticate locally using a service principal](local-development-service-principal.md)

## Authentication for apps hosted on-premises

For apps hosted on-premises, use a service principal to authenticate to Azure resources. This method involves creating a service principal in Microsoft Entra ID, assigning it the necessary permissions, and configuring your app to use its credentials.

> [!div class="nextstepaction"]
> [Authenticate your on-prem app using a service principal](on-premises-apps.md)

## Additional resources

- [Additional authentication methods](additional-methods.md) — client certificates, workload identity, Azure Pipelines, and federated identity credentials
- [Azure Identity crate on crates.io](https://crates.io/crates/azure_identity)
- [Azure Identity API reference on docs.rs](https://docs.rs/azure_identity/latest/azure_identity/)

[!INCLUDE [common resources](../../includes/resources.md)]
