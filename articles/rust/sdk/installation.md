---
title: Install and manage Azure SDK for Rust crates
description: Install, update, and manage Azure SDK for Rust crates using Cargo. Learn how to keep your Rust projects up to date with Azure services.
ms.date: 07/25/2025
ms.topic: how-to
ms.service: azure-rust
ms.custom: devx-track-rust
adobe-target: true
---

# Install Azure SDK for Rust crates

The Azure SDK for Rust lets you access Azure services in your Rust projects by installing individual SDK crates with Cargo. This article shows how to install, update, and manage Azure SDK for Rust crates, so you can add only the features you need and keep your projects up to date.

[!INCLUDE [prerequisites](../includes/prerequisites.md)]

## Install the latest Azure SDK crate version

Get Azure SDK crates from [crates.io][Crates]. Install the individual crates that you need. These crates depend on [`azure_core`][Crate - core] for common functionality. You don't need to install `azure_core` directly, since it's a dependency of all Azure SDK crates.

```console
cargo add <crate_name>
```

Replace `<crate_name>` with the name of the Azure crate you want to install. For example, to install the Azure Identity and Key Vault secrets crates:

```console
cargo add azure_identity azure_security_keyvault_secrets
```

You can find available crate names in the [crate index for Azure][Crates].

## Install a specific Azure SDK crate version

Sometimes you need to install a particular [version of a crate][Rust docs - crate version syntax] for compatibility testing or to maintain consistency across environments. When you specify a version, you **pin** your dependency. Your project continues using that version and doesn't automatically receive major or minor updates, but it can still receive patch updates. While pinning can be useful in certain scenarios, we recommend using the latest version to benefit from ongoing improvements and security updates.

The following Azure services, prefixed with `azure_`, are currently supported:

| Service | Crate | Description |
|---------|---------|-------------|
| **Cosmos DB** | [`azure_data_cosmos`][Crate - cosmos] | NoSQL database operations |
| **Event Hubs** | [`azure_messaging_eventhubs`][Crate - event hubs] | Big data streaming platform |
| **Key Vault** | [`azure_security_keyvault_certificates`][Crate - key vault - certificates]<br>[`azure_security_keyvault_secrets`][Crate - key vault - secrets]<br>[`azure_security_keyvault_keys`][Crate - key vault - keys] | Manage secrets, keys, and certificates |
| **Storage** | [`azure_storage_blob`][Crate - storage] | Create and manage Azure Storage blobs and containers. |

Crates.io has other crates for Azure services that were established before the official Azure SDK crates listed above. These crates aren't associated with the Azure SDK for Rust and shouldn't be used for modern development.

```console
cargo add <crate_name>@<version_number>
```

For example:

```console
cargo add azure_storage_blob@0.20.0
```

You can also specify version requirements in your `Cargo.toml` file. For more information on version requirement syntax, see the [Rust documentation][Rust docs - dependency].

## Update Azure SDK crates

To update all crates to their latest compatible versions, run:

```console
cargo update
```

To update a specific crate, run:

```console
cargo update <crate_name>
```

## Remove a specific Azure SDK crate

To remove a crate from your project, including the `Cargo.toml` file, run:

  ```console
  cargo remove <crate_name>
  ```
    
Build the project to update your `Cargo.lock` file:

  ```console
  cargo build
  ```

## Configure Azure SDK crate features

The [`azure_core`][Crate - core] crate provides features for all Azure SDK crates, such as:

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

[Rust docs - dependency]: https://doc.rust-lang.org/cargo/reference/specifying-dependencies.html
[Rust docs - crate version syntax]: https://doc.rust-lang.org/cargo/reference/specifying-dependencies.html#version-requirement-syntax

[Crates]: https://crates.io/users/azure-sdk?sort=recent-downloads
[Crate - identity]: https://crates.io/crates/azure_identity
[Crate - core]: https://crates.io/crates/azure_core
[Crate - cosmos]: https://crates.io/crates/azure_data_cosmos
[Crate - event hubs]: https://crates.io/crates/azure_messaging_eventhubs
[Crate - key vault - secrets]: https://crates.io/crates/azure_security_keyvault_secrets
[Crate - key vault - certificates]: https://crates.io/crates/azure_security_keyvault_certificates
[Crate - key vault - keys]: https://crates.io/crates/azure_security_keyvault_keys
[Crate - storage]: https://crates.io/crates/azure_storage

