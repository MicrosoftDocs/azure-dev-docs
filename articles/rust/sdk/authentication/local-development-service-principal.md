---
title: Authenticate Rust apps to Azure services during local development using service principals
description: Learn how to authenticate your Rust application to Azure services when using the Azure SDK for Rust during local development using dedicated application service principals.
ms.date: 02/20/2026
ms.topic: how-to
ms.custom: devx-track-rust, devx-track-azurecli
ms.service: azure-rust
#customer intent: As a Rust developer, I want to use the Azure SDK for Rust with service principals so that I can authenticate my app during local development.
---

# Authenticate Rust apps to Azure services during local development by using service principals

Use [`DeveloperToolsCredential`](local-development-dev-accounts.md) for most local
development. This article explains when to test application identity with a
service principal. In the following sections, you learn:

- How to register an application with Microsoft Entra to create a service principal
- How to use Microsoft Entra groups to efficiently manage permissions
- How to assign roles to scope permissions
- How to authenticate using a service principal from your app code

By using dedicated application service principals, you can follow the principle of least privilege when accessing Azure resources. Limit permissions to the specific requirements of the app during development, preventing accidental access to Azure resources intended for other apps or services. This approach also helps avoid issues when the app is moved to production by ensuring it isn't over-privileged in the development environment.

When you register the app in Azure, you create an application service principal. For local development:

- Create a separate app registration for each developer working on the app so each developer has their own application service principal and doesn't need to share credentials.
- Create a separate app registration for each app to limit the app's permissions to only what is necessary.

During local development, set environment variables with the application service principal's identity. The Azure Identity library reads these environment variables to authenticate the app to the required Azure resources.

[!INCLUDE [create-app-registration](../../../includes/authentication/create-app-registration.md)]

[!INCLUDE [create-entra-group](../../../includes/authentication/create-entra-group.md)]

[!INCLUDE [assign-group-roles](../../../includes/authentication/assign-group-roles.md)]

## Set the app environment variables

[!INCLUDE [set-environment-variables-rust](../../../includes/authentication/set-environment-variables-rust.md)]

## Authenticate to Azure services from your app

The Azure Identity library provides different `TokenCredential` implementations for various scenarios and Microsoft Entra authentication flows.

1. Add the `azure_identity` crate to your project.

    ```console
    cargo add azure_identity
    ```

1. For any Rust code that creates an Azure SDK client object, you want to:

    1. Import the `azure_identity` crate.
    1. Create a `ClientSecretCredential` instance by using the tenant ID, client ID, and client secret.
    1. Pass the credential instance to the Azure SDK client constructor.

The following code segment shows an example using a Key Vault `SecretClient`:

:::code language="rust" source="../../snippets/authentication/examples/local_dev_service_principal.rs":::
