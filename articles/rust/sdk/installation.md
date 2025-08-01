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

When you install a crate without specifying a version, Cargo retrieves the latest version available from [crates.io](https://crates.io). 

```console
cargo add <crate-name>
```

Replace `<crate-name>` with the name of the Azure crate you want to install. For example, to install the Azure Identity and Key Vault secrets crates:

```console
cargo add azure_identity azure_security_keyvault_secrets
```

You can find available crate names in the [crate index for Azure](https://crates.io/users/azure-sdk?sort=recent-downloads).

## Install specific crate versions

Sometimes you need to install a particular [version of a crate](https://doc.rust-lang.org/cargo/reference/specifying-dependencies.html#version-requirement-syntax) for compatibility testing or to maintain consistency across environments. When you specify a version, you **pin** your dependency. Your project continues using that version and doesn't automatically receive major or minor updates, but it can still receive patch updates. While pinning can be useful in certain scenarios, we recommend using the latest version to benefit from ongoing improvements and security updates.

```console
cargo add <crate-name>@<version-number>
```

For example:

```console
cargo add azure_storage_blob@0.20.0
```

You can also specify version requirements in your `Cargo.toml` file. For more information on version requirement syntax, see the [Rust documentation](https://doc.rust-lang.org/cargo/reference/specifying-dependencies.html).


```toml
[dependencies]
azure_storage_blob = "0.20.0"           # Exact version
azure_identity = "0.17"                # Allows compatible versions (e.g., 0.17.x)
azure_security_keyvault_secrets = "~0.16.2"  # Allows patch updates (>=0.16.2, <0.17.0)
```

## Update crates

To update all crates to their latest compatible versions, run:

```console
cargo update
```

To update a specific crate, run:

```console
cargo update <crate-name>
```

## Remove a crate

To remove a crate from your project, including the `Cargo.toml` file, run:

  ```console
  cargo remove <crate-name>
  ```
    
Build the project to update your `Cargo.lock` file:

  ```console
  cargo build
  ```



## Configure crate features

Azure SDK crates provide features such as:

- `debug`: Enable additional debugging information.
- `reqwest`: HTTP client implementation.
- `tokio`: Async runtime support.
- `xml`: XML serialization support.

Enable SDK features when adding a crate:

```console
cargo add <crate-name> --features <feature1>,<feature2>
```

Or specify features in your `Cargo.toml`:

```toml
[dependencies]
<crate-name> = { version = "0.17", features = ["feature1", "feature2"] }<feature1>,<feature2>
```

## Additional resources

[!INCLUDE [common resources](../includes/resources.md)]