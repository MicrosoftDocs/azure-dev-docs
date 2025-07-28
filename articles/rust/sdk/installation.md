---
title: Install Azure SDK Crates for Rust - Setup Guide
description: Learn how to install, update, and manage Azure SDK crates for Rust using Cargo. Get step-by-step instructions for specific versions and preview packages.
ms.date: 07/25/2025
ms.topic: how-to
ms.service: azure-rust
ms.custom: devx-track-rust
adobe-target: true
---

# Install Azure crates for Rust

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

Sometimes you might need to install a particular [version of a crate](https://doc.rust-lang.org/cargo/reference/specifying-dependencies.html#version-requirement-syntax) for compatibility testing or to maintain consistency across environments. When you specify a version, you're **pinning** your dependency, which means your project continues using that version and won't automatically receive updates. While pinning can be useful in certain scenarios, we generally recommend using the latest version to benefit from ongoing improvements and security updates.

```console
cargo add <crate-name>@<version-number>
```

For example:

```console
cargo add azure_storage_blob@0.20.0
```

You can also specify version requirements in your `Cargo.toml` file:

```toml
[dependencies]
azure_storage_blob = "0.20.0"           # Exact version
azure_identity = "0.17"                  # Caret range (^0.17.0, allows 0.17.x)
azure_security_keyvault_secrets = "~0.16.2"  # Tilde range (allows >=0.16.2, <0.17.0)
```

## Install preview packages

Azure SDK crates might have preview versions available that provide early access to new features. Preview versions are typically marked with pre-release identifiers.

To install a preview version, specify the exact prerelease version:

```console
cargo add azure_storage_blob@0.21.0-beta.1
```

You can also add prerelease versions directly to your `Cargo.toml`:

```toml
[dependencies]
azure_storage_blob = "0.21.0-beta.1"
```

Preview packages provide early access to new functionality but might not be as stable as general releases and shouldn't be used in production environments.

## Configure crate features

Azure SDK crates provide optional crate features that you can enable based on your needs such as:

- `debug`: Enables additional debugging information
- `reqwest`: HTTP client implementation (often enabled by default)
- `tokio`: Async runtime support
- `xml`: XML serialization support

Enable features when adding a crate:

```console
cargo add azure_identity --features tokio,debug
```

Or specify features in your `Cargo.toml`:

```toml
[dependencies]
azure_identity = { version = "0.17", features = ["tokio", "debug"] }
```

## Verify crate installation

After installation, you can verify that the correct version of a crate is installed.

```console
cargo tree | grep azure
```

This command shows all Azure-related crates in your dependency tree with their versions. The following output is an example:

```console
├── azure_core v0.26.0
├── azure_data_cosmos v0.24.0
│   ├── azure_core v0.25.0
├── azure_identity v0.26.0
│   ├── azure_core v0.26.0 (*)
├── azure_messaging_eventhubs v0.5.0
│   ├── azure_core v0.26.0 (*)
│   ├── azure_core_amqp v0.5.0
│   │   ├── azure_core v0.26.0 (*)
├── azure_security_keyvault_secrets v0.5.0
│   ├── azure_core v0.26.0 (*)
├── azure_storage_blob v0.3.0
│   ├── azure_core v0.26.0 (*)
```


You can also check your `Cargo.toml` file to see the crates you've explicitly added:

```console
cat Cargo.toml
```

To see all dependencies including transitive ones:

```console
cargo tree
```

## Update crates

To update all crates to their latest compatible versions:

```console
cargo update
```

To update a specific crate:

```console
cargo update <crate-name>
```

To update to the latest version regardless of semantic versioning constraints:

```console
cargo upgrade
```

> [!NOTE]
>The `cargo upgrade` command requires the `cargo-edit` plugin. Install it with `cargo install cargo-edit`.

## Remove a crate

1. To remove a crate from your project, including the `Cargo.toml` file:

    ```console
    cargo remove <crate-name>
    ```
    
1. Build the project to update your `Cargo.lock` file:

    ```console
    cargo build
    ```

## Troubleshooting

### Common installation issues

- **Compilation errors**: Ensure you're using Rust 1.85 or later. Check your Rust version with `rustc --version`.
- **Network issues**: Verify your internet connection and proxy settings if crate downloads are failing.
- **Version conflicts**: Use `cargo tree` to identify conflicting dependencies and consider updating or pinning specific versions.
- **Feature conflicts**: Check that enabled features are compatible with each other and your target platform.

### Build failures

If you encounter build failures after adding Azure crates:

1. **Clear the build cache**:
   ```console
   cargo clean
   ```

2. **Update your Rust toolchain**:
   ```console
   rustup update
   ```

3. **Check for platform-specific issues**: Some features might not be available on all platforms.

### SSL/TLS issues

If you encounter SSL/TLS-related errors:

- Ensure your system has up-to-date certificates
- Consider using the `rustls` feature instead of `native-tls`:

  ```console
  cargo add azure_identity --features rustls
  ```

## Additional resources

[!INCLUDE [common resources](../includes/resources.md)]