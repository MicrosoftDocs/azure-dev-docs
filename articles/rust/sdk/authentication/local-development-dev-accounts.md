---
title: Authenticate Rust apps to Azure services during local development by using developer accounts
description: Learn how to authenticate your Rust application to Azure services when using the Azure SDK for Rust during local development using developer accounts.
ms.date: 02/20/2026
ms.topic: how-to
ms.custom: devx-track-rust, devx-track-azurecli
ms.service: azure-rust
#customer intent: As a Rust developer, I want to sign in to Azure using developer tools so that I can authenticate my app during development.
---

# Authenticate Rust apps to Azure services during local development by using developer accounts

During local development, applications need to authenticate to Azure to use different Azure services. Authenticate locally by using one of these approaches:

- Use a developer account with one of the [developer tools supported by the Azure Identity library](#supported-developer-tools-for-authentication).
- Use a [service principal](local-development-service-principal.md).

This article explains how to authenticate by using a developer account with tools supported by the Azure Identity library. In the following sections, you learn:

- How to use Microsoft Entra groups to efficiently manage permissions for multiple developer accounts.
- How to assign roles to developer accounts to scope permissions.
- How to sign in to supported local development tools.
- How to authenticate by using a developer account from your app code.

## Supported developer tools for authentication

For an app to authenticate to Azure during local development by using the developer's Azure credentials, the developer must be signed in to Azure from one of the following developer tools:

- Azure CLI
- Azure Developer CLI

The Azure Identity library can detect that the developer is signed in from one of these tools. The library can then obtain the Microsoft Entra access token via the tool to authenticate the app to Azure as the signed-in user.

This approach takes advantage of the developer's existing Azure accounts to streamline the authentication process. However, a developer's account likely has more permissions than required by the app, therefore exceeding the permissions the app runs with in production. As an alternative, you can [create application service principals to use during local development](./local-development-service-principal.md), which can be scoped to have only the access needed by the app.

[!INCLUDE [create-entra-group](../../../includes/authentication/create-entra-group.md)]

[!INCLUDE [assign-group-roles](../../../includes/authentication/assign-group-roles.md)]

## Sign in to Azure by using developer tooling

Next, sign in to Azure by using one of the developer tools that you can use to perform authentication in your development environment. The account you authenticate should also exist in the Microsoft Entra group you created and configured earlier.

### [Azure CLI](#tab/sign-in-azure-cli)

[!INCLUDE [sign-in-azure-cli](../../../includes/authentication/sign-in-azure-cli.md)]

### [Azure Developer CLI](#tab/sign-in-azure-developer-cli)

[!INCLUDE [sign-in-azure-developer-cli](../../../includes/authentication/sign-in-azure-developer-cli.md)]

---

## Authenticate to Azure services from your app

The [azure_identity](https://crates.io/crates/azure_identity) crate provides various *credentials* adapted to support different scenarios and Microsoft Entra authentication flows. The following steps demonstrate how to use `DeveloperToolsCredential` or specific tool credentials when working locally.

### Implement the code

To authenticate Azure SDK client objects to Azure, your application should use a credential from the [`azure_identity`](https://crates.io/crates/azure_identity) crate. [`DeveloperToolsCredential`](https://docs.rs/azure_identity/latest/azure_identity/struct.DeveloperToolsCredential.html) attempts to authenticate by using a series of developer tools such as the Azure CLI, and stops when one succeeds.

1. Add the `azure_identity` crate to your project.

    ```console
    cargo add azure_identity
    ```

1. For any Rust code that creates an Azure SDK client object, you want to:

    1. Import the `azure_identity` crate.
    1. Create an instance of `DeveloperToolsCredential` or a specific tool credential.
    1. Pass the credential instance to the Azure SDK client constructor.

    - To use `DeveloperToolsCredential`, which tries Azure CLI and Azure Developer CLI in sequence:

        :::code language="rust" source="../../snippets/authentication/examples/local_dev_accounts_developer_tools.rs":::

    - Or use a specific credential such as `AzureCliCredential` or `AzureDeveloperCliCredential`:

        :::code language="rust" source="../../snippets/authentication/examples/local_dev_accounts_cli.rs":::

The following example demonstrates authenticating a Key Vault `SecretClient` by using `DeveloperToolsCredential`:

:::code language="rust" source="../../snippets/authentication/examples/local_dev_accounts.rs":::
