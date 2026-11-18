---
title: Authenticate to Azure resources from Rust apps hosted on-premises
description: Learn how to authenticate your Rust application to Azure services when using the Azure SDK for Rust in on-premises hosted applications.
ms.date: 02/20/2026
ms.topic: how-to
ms.custom: devx-track-rust
ms.service: azure-rust
---

# Authenticate to Azure resources from Rust apps hosted on-premises

Apps hosted outside Azure, such as on-premises servers or data centers, should use an application service principal to authenticate to Azure resources. Register your app in Azure to create the service principal. When you create one, Azure generates a client ID and client secret. Store the client ID, client secret, and tenant ID in environment variables so your app can pass them to `ClientSecretCredential` at runtime.

Create a different app registration for each environment where you host the app. This setup lets you configure environment-specific resource permissions for each service principal and ensures that an app deployed to one environment doesn't access Azure resources in another environment.

[!INCLUDE [authentication-create-app-registration](../../../includes/authentication/create-app-registration.md)]

[!INCLUDE [authentication-assign-service-principal-roles](../../../includes/authentication/assign-service-principal-roles.md)]

## Set environment variable

[!INCLUDE [set-environment-variables-rust](../../../includes/authentication/set-environment-variables-rust.md)]

## Implement the code

To authenticate Azure SDK client objects to Azure, your application should use the [`ClientSecretCredential`](https://docs.rs/azure_identity/latest/azure_identity/struct.ClientSecretCredential.html) type from the [`azure_identity`](https://crates.io/crates/azure_identity) crate.

Start by adding the `azure_identity` crate to your application:

```console
cargo add azure_identity
```

Next, for any Rust code that instantiates an Azure SDK client in your app, follow these steps:

1. Import the `azure_identity` crate.
1. Create an instance of `ClientSecretCredential`.
1. Pass the instance to the Azure SDK client constructor.

The following code segment shows an example:

:::code language="rust" source="../../snippets/authentication/examples/on_premises_apps.rs":::

The example reads the `AZURE_TENANT_ID`, `AZURE_CLIENT_ID`, and
`AZURE_CLIENT_SECRET` environment variables, then passes their values to
`ClientSecretCredential`.
