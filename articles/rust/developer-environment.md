---
title: Configure Your Local Rust Environment for Azure Development
description: Set up your local Rust development environment for Azure with installation suggestions, SDK crates, authentication methods, and essential tools. Start building cloud applications today.
ms.date: 08/07/2025
ms.topic: getting-started
ms.custom: devx-track-rust, azure-sdk-rust
---

# Configure your Rust development environment for Azure

Configure your local Rust development environment for Azure to build cloud applications efficiently on your workstation before deployment. Local development gives you access to a wider variety of tools and a familiar environment for faster iteration.

This article provides suggestions to set up and validate a local Rust development environment that integrates seamlessly with Azure services.

## One-time subscription creation

You create [Azure resources](/azure/cloud-adoption-framework/ready/azure-setup-guide/organize-resources?tabs=AzureManagementGroupsAndHierarchy) within a subscription and resource group. 

:::row:::
    :::column span="1":::
        **Type**
    :::column-end:::
    :::column span="2":::
        **Description**
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="1":::
        Trial subscription
    :::column-end:::
    :::column span="2":::
        Create a _free_ [trial subscription](https://azure.microsoft.com/free/).
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="1":::
        Existing subscription
    :::column-end:::
    :::column span="2":::
        If you already have a subscription, access your existing subscription with:

        * [Azure portal](https://portal.azure.com)
        * [Azure CLI](/cli/azure/install-azure-cli)
        * [Azure SDK for Rust](https://github.com/Azure/azure-sdk-for-rust)
        * [Visual Studio Code extensions](https://marketplace.visualstudio.com/search?term=azure&target=VSCode&category=Azure&sortBy=Relevance)
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="1":::
        Across multiple subscriptions
    :::column-end:::
    :::column span="2":::
        If you need to manage multiple subscriptions, learn how to create a management group using the Azure CLI or Azure portal.
    :::column-end:::
:::row-end:::

## One-time software installation

For Azure development with Rust on your local workstation, install the following tools:

|Name/Installer|Description|
|--|--|
|[Rust](https://www.rust-lang.org/tools/install)|Install the Rust programming language via rustup, which includes the Rust compiler (rustc), package manager (cargo), and standard library.|
|[Visual Studio Code](https://code.visualstudio.com/)|Visual Studio Code gives you a great Rust integration and coding experience but it isn't required. You can use any code editor.|
|[rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)|The recommended VS Code extension for Rust language support, providing code completion, error checking, and more.|
|[Visual Studio Code extensions](https://marketplace.visualstudio.com/search?term=azure&target=VSCode&category=Azure&sortBy=Relevance)|Install any relevant extensions for Azure services you intend to use.|

The following common local workstation installations help with your local development tasks.

|Name|Description|
|--|--|
|[Azure CLI](/cli/azure/get-started-with-azure-cli)|Local or cloud-based CLI to create and use Azure resources.|
|[Azure Developer CLI](../../azure-developer-cli/overview.md?tabs=other)|Developer-centric command-line tool for building cloud apps in developer workflow.|
|[Visual Studio Code extensions for Azure](https://marketplace.visualstudio.com/search?term=azure&target=VSCode&category=Azure&sortBy=Relevance) |VS Code extensions to the IDE.|
|[Git](https://git-scm.com/downloads) or [Git for Windows](https://gitforwindows.org/)| Command-line tools for source control. You can use a different source control tool if you prefer. |
|Docker for [Windows](https://docs.docker.com/desktop/install/windows-install/) or [Mac](https://docs.docker.com/desktop/install/mac-install/)|Use [Development containers](https://containers.dev/) for consistent development environments and [test containers](https://testcontainers.com/) for testing without mocks or Cloud resources.|
|[cargo-generate](https://github.com/cargo-generate/cargo-generate)|A cargo subcommand for generating Rust project templates.|

## How to install Rust

Follow these steps to install Rust:

1. Go to [https://www.rust-lang.org/tools/install](https://www.rust-lang.org/tools/install)
1. Follow the instructions for your operating system to install rustup, the Rust toolchain installer
1. Verify your installation by running the following commands:

    ```console
    rustc --version
    cargo --version
    ```

The Rust toolchain includes:
- `rustc`: The Rust compiler
- `cargo`: The Rust package manager
- `rustup`: The toolchain manager

For detailed installation guidance and troubleshooting, see the [Installation chapter](https://doc.rust-lang.org/book/ch01-01-installation.html) in The Rust Programming Language book. For development environment setup tips, including editor configuration, see the [Development Environment chapter](https://doc.rust-lang.org/book/ch01-02-hello-world.html) and the [official Rust development tools guide](https://www.rust-lang.org/tools).

## Create an Azure resource group for your project

[!INCLUDE [create resource group 3-tab](../../includes/create-resource-group.md)]

## Add Azure SDK crates to your Rust project
You can get the Azure SDK crates for Rust from [crates.io](https://crates.io/). To learn more, see [Azure SDK for Rust](./sdk/overview.md).


## Authenticate to Azure

For a consistent authentication experience across environments, use different authentication methods depending on your context:

- **Local development environment**: 
  - Use the Azure CLI credential after running `az login`
  - Use the Azure Developer CLI credential after running `azd auth login`

- **Production/hosted environment**: 
  - Use managed identity credentials when your application is hosted in Azure

This approach lets you configure the appropriate authentication method for each environment. Learn more about [managed identity and passwordless connections](../../intro/passwordless-overview.md).


## Secure secrets and configuration settings

You have several options to store secrets:

- Azure [Key Vault](/azure/key-vault/) to create and maintain secrets, keys, and certificates that access cloud resources, which don't yet offer [managed identity access](../../intro/passwordless-overview.md).
- Azure [App Configuration](/azure/azure-app-configuration/) to manage application settings and feature flags.


## Additional Rust resources

If you're new to Rust, these official resources can help you get up to speed:

- [The Rust Programming Language](https://doc.rust-lang.org/book/) - The official Rust book, covering everything from basics to advanced topics
- [Rust by Example](https://doc.rust-lang.org/rust-by-example/) - Learn Rust through hands-on examples
- [The Cargo Book](https://doc.rust-lang.org/cargo/) - Complete guide to Cargo, Rust's package manager and build system
- [Rustlings](https://github.com/rust-lang/rustlings) - Interactive exercises to learn Rust
- [Rust development tools](https://www.rust-lang.org/tools) - Official overview of IDEs, editors, and development tools

## Next steps

* [Azure SDK for Rust](https://github.com/Azure/azure-sdk-for-rust)