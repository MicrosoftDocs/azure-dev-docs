---
title: Configure Your Local Rust Environment for Azure Development
description: Set up your local Rust development environment for Azure with installation suggestions, SDK crates, authentication methods, and essential tools. Start building cloud applications today.
ms.date: 08/12/2025
ms.topic: get-started
ms.service: azure-rust
ms.custom: devx-track-rust, azure-sdk-rust
---

# Configure your Rust development environment for Azure

Configure your local Rust development environment for Azure to build cloud applications efficiently on your workstation before deployment. Local development gives you access to a wider variety of tools and a familiar environment for faster iteration.

This article provides suggestions to set up and validate a local Rust development environment that integrates seamlessly with Azure services.

## One-time subscription creation

You create [Azure resources](/azure/cloud-adoption-framework/ready/azure-setup-guide/organize-resources?tabs=AzureManagementGroupsAndHierarchy) within a subscription and resource group. If you don't have a subscription, create a _free_ [trial subscription][trial subscription].

If you already have a subscription, access your existing subscription with:

* [Azure portal][Azure portal]
* [Azure CLI][Azure CLI]
* [Azure SDK crates for Rust][Azure crates]
* [Visual Studio Code extensions][Visual Studio Code extensions]

## One-time software installation

For Azure development with Rust on your local workstation, install the following tools:

|Name/Installer|Description|
|--|--|
|[Rust]|Install the Rust programming language via rustup, which includes the Rust compiler (rustc), package manager (cargo), and standard library.|
|[Visual Studio Code][Visual Studio Code]|Visual Studio Code gives you a great Rust integration and coding experience but it isn't required. You can use any code editor.|
|[Visual Studio Code extensions][Visual Studio Code extensions]|Install any relevant extensions for Azure services you intend to use.|
|[rust-analyzer extension][rust-analyzer-extension]|The recommended VS Code extension for Rust language support, providing code completion, error checking, and more.|

## How to install Rust

Follow these steps to install Rust:

1. Go to <https://www.rust-lang.org/tools/install>.
1. Follow the instructions for your operating system to install **rustup**, the Rust toolchain installer.
1. Verify your installation by running the following commands:

    ```console
    rustc --version
    cargo --version
    ```

The Rust toolchain includes:

For detailed installation guidance and troubleshooting, see the [Installation chapter][The Rust Book installation chapter] in The Rust Programming Language book. For development environment setup tips, including editor configuration, see the [Development Environment chapter][The Rust Book development environment chapter] and the [official Rust development tools guide][official Rust development tools guide].

## Create an Azure resource group for your project

[!INCLUDE [create resource group 3-tab](../includes/create-resource-group.md)]

## Add Azure SDK crates to your Rust project

You can get the Azure SDK for Rust crates from [crates.io][Azure crates]. To learn more, see [Azure SDK for Rust](./sdk/overview.md).

## Authenticate to Azure

To authenticate to Azure from your Rust application, use the [Azure Identity SDK crate][Azure Identity rust crate]. This library provides a set of credential types that you can use to authenticate to Azure services.

## Additional Rust resources

If you're new to Rust, these official resources can help you get up to speed:

- [The Rust Programming Language][The Rust Programming Language] - The official Rust book, covering everything from basics to advanced topics
- [Rust by Example][Rust by Example] - Learn Rust through hands-on examples
- [The Cargo Book][The Cargo Book] - Complete guide to Cargo, Rust's package manager and build system
- [Rustlings][Rustlings] - Interactive exercises to learn Rust
- [Rust development tools][official Rust development tools guide] - Official overview of IDEs, editors, and development tools


<!-- Reference links for Rust resources -->
[Azure portal]: https://portal.azure.com/
[Azure CLI]: /cli/azure/
[Azure crates]: https://crates.io/users/azure-sdk?sort=recent-downloads
[Crates.io]: https://crates.io/
[official Rust development tools guide]: https://www.rust-lang.org/tools
[Rust by Example]: https://doc.rust-lang.org/rust-by-example/
[rust-analyzer-extension]: https://marketplace.visualstudio.com/items?itemName=matklad.rust-analyzer
[Rust]: https://www.rust-lang.org/
[Rustlings]: https://github.com/rust-lang/rustlings
[The Cargo Book]: https://doc.rust-lang.org/cargo/
[The Rust Book development environment chapter]: https://doc.rust-lang.org/book/ch01-02-hello-world.html
[The Rust Book installation chapter]: https://doc.rust-lang.org/book/ch01-01-installation.html
[The Rust Programming Language]: https://doc.rust-lang.org/book/
[trial subscription]: https://azure.microsoft.com/free/
[Visual Studio Code extensions]: https://marketplace.visualstudio.com/search?term=rust&target=VSCode&category=All%20categories&sortBy=Relevance
[Visual Studio Code]: https://code.visualstudio.com/
[Azure Identity rust crate]: https://crates.io/crates/azure_identity