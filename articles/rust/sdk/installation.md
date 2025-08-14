---
title: Install Azure SDK Crates for Rust - Setup Guide
description: Learn how to install, update, and manage Azure SDK crates for Rust using Cargo. Get step-by-step instructions for specific versions and preview packages.
ms.date: 07/25/2025
ms.topic: how-to
ms.service: azure-rust
ms.custom: devx-track-rust
adobe-target: true
---

# Install Azure SDK crates for Rust

To access specific Azure services in your projects, install Azure SDK crates for Rust by using Cargo. The Azure SDK for Rust consists of many individual crates that you can install in standard Rust environments. This modular approach lets you install only the crates you need for your project.

[!INCLUDE [prerequisites](../includes/prerequisites.md)]

## Install the latest version of a crate

Get Azure SDK crates from [crates.io][Crates]. Install the individual crates that you need. These crates depend on [`azure_core`][Crate - core] for common functionality. You don't need to install `azure_core` directly, since it's a dependency of all Azure SDK crates.

```console
cargo add <crate_name>
```

Replace `<crate_name>` with the name of the Azure crate you want to install. For example, to install the Azure Identity and Key Vault secrets crates:

```console
cargo add azure_identity azure_security_keyvault_secrets
```

You can find available crate names in the [crate index for Azure](https://crates.io/users/azure-sdk?sort=recent-downloads).

## Install specific crate versions

Sometimes you need to install a particular [version of a crate](https://doc.rust-lang.org/cargo/reference/specifying-dependencies.html#version-requirement-syntax) for compatibility testing or to maintain consistency across environments. When you specify a version, you **pin** your dependency. Your project continues using that version and doesn't automatically receive major or minor updates, but it can still receive patch updates. While pinning can be useful in certain scenarios, we recommend using the latest version to benefit from ongoing improvements and security updates.

The following Azure services, prefixed with `azure_`, are currently supported:

| Service | Crate | Description |
|---------|---------|-------------|
| **Cosmos DB** | [`azure_data_cosmos`][Crate - cosmos] | NoSQL database operations |
| **Event Hubs** | [`azure_messaging_eventhubs`][Crate - event hubs] | Big data streaming platform |
| **Key Vault** | [`azure_security_keyvault_certificates`][Crate - key vault - certificates]<br>[`azure_security_keyvault_secrets`][Crate - key vault - secrets]<br>[`azure_security_keyvault_keys`][Crate - key vault - keys] | Manage secrets, keys, and certificates |
| **Storage** | [`azure_storage_blob`][Crate - storage] | Create and manage Azure Storage blobs and containers. |

Crates.io has other crates for Azure services that were established before the official Azure SDK crates listed above. These crates aren't associated with the Azure SDK and shouldn't be used for modern development.

```console
cargo add <crate_name>@<version_number>
```

For example:

```console
cargo add azure_storage_blob@0.20.0
```

You can also specify version requirements in your `Cargo.toml` file. For more information on version requirement syntax, see the [Rust documentation](https://doc.rust-lang.org/cargo/reference/specifying-dependencies.html).

## Update crates

To update all crates to their latest compatible versions, run:

```console
cargo update
```

To update a specific crate, run:

```console
cargo update <crate_name>
```

## Remove a crate

To remove a crate from your project, including the `Cargo.toml` file, run:

  ```console
  cargo remove <crate_name>
  ```
    
Build the project to update your `Cargo.lock` file:

  ```console
  cargo build
  ```

## Configure crate features

The [`azure_core`] crate provides features for all Azure SDK crates, such as:

- `reqwest`: HTTP client implementation.
- `tokio`: Async runtime support.

Enable SDK features when adding a crate:

```console
cargo add <crate_name> --features <feature_name_1>,<feature_name_2>
```

Or specify features in your `Cargo.toml`:

```toml
[dependencies]
<crate_name> = { version = "0.17", features = ["<feature_name_1>", "<feature_name_2>"] }
```

## Additional resources

[!INCLUDE [common resources](../includes/resources.md)]


[Crates]: https://crates.io/users/azure-sdk?sort=recent-downloads