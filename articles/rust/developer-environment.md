---
title: Configure your local Rust environment for Azure development
description: How to set up a local Rust dev environment for working with Azure, including an editor, the Azure SDK crates, optional tools, and the necessary credentials for library authentication.
ms.date: 08/07/2025
ms.topic: how-to
ms.custom: devx-track-rust, azure-sdk-rust
---

# Configure your Rust development environment for Azure

When you create cloud applications, developers typically prefer to test code on their local workstations before deploying that code to a cloud environment like Azure. Local development gives you the advantage of a wider variety of tools along with a familiar environment.

This article provides setup instructions to create and validate a local development environment that's suitable for Rust with Azure.

## One-time subscription creation

[Azure resources](/azure/cloud-adoption-framework/ready/azure-setup-guide/organize-resources?tabs=AzureManagementGroupsAndHierarchy) are created within a subscription and resource group. 

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

For Azure development with Rust on your local workstation, we suggest you install the following tools:

|Name/Installer|Description|
|--|--|
|[Rust](https://www.rust-lang.org/tools/install)|Install the Rust programming language via rustup, which includes the Rust compiler (rustc), package manager (cargo), and standard library.|
|[Visual Studio Code](https://code.visualstudio.com/)| Visual Studio Code gives you a great Rust integration and coding experience but it isn't required. You can use any code editor.|
|[rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)|The recommended VS Code extension for Rust language support, providing code completion, error checking, and more.|
|[Visual Studio Code extensions](https://marketplace.visualstudio.com/search?term=azure&target=VSCode&category=Azure&sortBy=Relevance)|Install any relevant extensions for Azure services you intend to use.|

### Azure hosting runtime 

When you use an Azure resource as the hosting environment for your application, such as Azure Container Apps, ensure your Rust application is built for the appropriate target platform.

### Recommended local installations

The following common local workstation installations are recommended to help with your local development tasks.

|Name|Description|
|--|--|
|[Azure CLI](/cli/azure/get-started-with-azure-cli)|Local or cloud-based CLI to create and use Azure resources.|
|[Azure Developer CLI](../../azure-developer-cli/overview.md?tabs=other)|Developer-centric command-line tool for building cloud apps in developer workflow.|
|[Visual Studio Code extensions for Azure](https://marketplace.visualstudio.com/search?term=azure&target=VSCode&category=Azure&sortBy=Relevance) |VS Code extensions to the IDE.|
|[Git](https://git-scm.com/downloads) or [Git for Windows](https://gitforwindows.org/)| Command-line tools for source control. You can use a different source control tool if you prefer. |
|Docker for [Windows](https://docs.docker.com/desktop/install/windows-install/) or [Mac](https://docs.docker.com/desktop/install/mac-install/)|Use [Development containers](https://containers.dev/) for consistent development environments.|
|[cargo-generate](https://github.com/cargo-generate/cargo-generate)|A cargo subcommand for generating Rust project templates.|

## Install Rust

Follow these steps to install Rust:

1. Go to [https://www.rust-lang.org/tools/install](https://www.rust-lang.org/tools/install)
2. Follow the instructions for your operating system to install rustup, the Rust toolchain installer
3. Verify your installation by running the following commands:

```bash
rustc --version
cargo --version
```

The Rust toolchain includes:
- `rustc`: The Rust compiler
- `cargo`: The Rust package manager
- `rustup`: The toolchain manager

For detailed installation guidance and troubleshooting, see the [Installation chapter](https://doc.rust-lang.org/book/ch01-01-installation.html) in The Rust Programming Language book. For development environment setup tips, including editor configuration, see the [Development Environment chapter](https://doc.rust-lang.org/book/ch01-02-hello-world.html) and the [official Rust development tools guide](https://www.rust-lang.org/tools).

## Configuration for authentication

For a consistent authentication experience across environments, you can use different authentication methods depending on your context:

- **Local development environment**: 
  - Use the Azure CLI credential after running `az login`
  - Use the Azure Developer CLI credential after running `azd auth login`

- **Production/hosted environment**: 
  - Use managed identity credentials when your application is hosted in Azure

This approach allows you to configure the appropriate authentication method for each environment. Learn more about [managed identity and passwordless connections](../../intro/passwordless-overview.md).

## Create a resource group for your project

[!INCLUDE [create resource group 3-tab](../../includes/create-resource-group.md)]

## Working with Azure and the Azure SDK crates for Rust

The Azure SDK crates for Rust are available through crates.io. Each library is provided individually for each service. You add each library as a dependency based on the Azure service you need to use.

Each new project using Azure should:

- Create Azure resources.
- Add Azure SDK crates from crates.io by including them in your `Cargo.toml` file.
- Use [managed identity](../../intro/passwordless-overview.md) to authenticate with the Azure SDK crates, then use configuration information to access specific services.

## Securing configuration information

You have several options to store configuration information:

- Azure [Key Vault](/azure/key-vault/) to create and maintain secrets, keys, and certificates that access cloud resources, which don't yet offer [managed identity access](../../intro/passwordless-overview.md).
- [dotenvy](https://crates.io/crates/dotenvy) is a popular Rust crate to read environment variables from a `.env` file. Make sure to add the `.env` file to the `.gitignore` file so the `.env` file isn't checked into source control.

### Create environment variables

To use the Azure settings needed by the Azure SDK libraries to access the Azure cloud, set the most common values to environment variables. The following commands set the environment variables for the local workstation. 

In the following examples, the client ID is the service principal ID and service principal secret.

# [bash](#tab/bash)

```bash
AZURE_SUBSCRIPTION_ID="<REPLACE-WITH-YOUR-AZURE-SUBSCRIPTION-ID>"
AZURE_TENANT_ID="<REPLACE-WITH-YOUR-AZURE-TENANT-ID>"
AZURE_CLIENT_ID="<REPLACE-WITH-YOUR-AZURE-CLIENT-ID>"
AZURE_CLIENT_SECRET="<REPLACE-WITH-YOUR-AZURE-CLIENT-SECRET>"
```

# [cmd](#tab/cmd)

```cmd
set AZURE_SUBSCRIPTION_ID="<REPLACE-WITH-YOUR-AZURE-SUBSCRIPTION-ID>"
set AZURE_TENANT_ID="<REPLACE-WITH-YOUR-AZURE-TENANT-ID>"
set AZURE_CLIENT_ID="<REPLACE-WITH-YOUR-AZURE-CLIENT-ID>"
set AZURE_CLIENT_SECRET="<REPLACE-WITH-YOUR-AZURE-CLIENT-SECRET>"
```

---

Replace the values in `<>` brackets in these commands with those of your specific environment variable.

### Create `.env` file 

Another common mechanism is to use the `dotenvy` crate to create a `.env` file for these settings. Add the crate to your `Cargo.toml` file:

```toml
[dependencies]
dotenvy = "0.15.0"
```

Then in your code, you can load the environment variables from the `.env` file:

```rust
use dotenvy::dotenv;
use std::env;

fn main() {
    dotenv().ok(); // Load environment variables from .env file
    
    let subscription_id = env::var("AZURE_SUBSCRIPTION_ID")
        .expect("AZURE_SUBSCRIPTION_ID not set");
}
```

If you plan to use a `.env` file, make sure to add it to the `.gitignore` file so you **don't check in** the file to source control.

## Create a new Rust project

For every project, we recommend that you always create a separate folder, and its own `Cargo.toml` file using the following steps:

1. Open a terminal, command prompt, or bash shell and create a new project using Cargo:

    ```console
    cargo new my-azure-project
    cd my-azure-project
    ```

    This command creates a new Rust project with the initial directory structure and a `Cargo.toml` file.

2. Add the Azure SDK crates to your `Cargo.toml` file. Here's an example adding the Azure Identity crate:

    ```toml
    [dependencies]
    azure_identity = "0.27.0"
    ```

3. Build your project to download and compile the dependencies:

    ```console
    cargo build
    ```

## Use source control with Visual Studio Code

We recommend that you get into the habit of creating a source control repository whenever you start a project. When using Cargo to create a new project, Git is already initialized for you. If you need to initialize it manually, you can do this from Visual Studio Code.

Visual Studio Code includes many built-in git features. For more information, see [Using Version Control in VS Code](https://code.visualstudio.com/docs/editor/versioncontrol).

## Sample Rust code for Azure

Here's a simple example of using the Azure SDK for Rust to list storage accounts using Azure CLI credential for local development:

```rust
use azure_identity::AzureCliCredential;
use azure_storage_mgmt::StorageManagementClient;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // For local development, use Azure CLI credential (requires az login)
    let credential = AzureCliCredential::default();
    
    // Create a storage management client
    let subscription_id = std::env::var("AZURE_SUBSCRIPTION_ID")?;
    let client = StorageManagementClient::new(credential, &subscription_id);
    
    // List storage accounts
    let accounts = client.storage_accounts.list().await?;
    
    // Print storage account names
    for account in accounts {
        println!("Storage account: {}", account.name);
    }
    
    Ok(())
}
```

For production environments, you would use a managed identity credential instead:

```rust
use azure_identity::ManagedIdentityCredential;
// ... rest of imports

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // For Azure-hosted environments, use Managed Identity
    let credential = ManagedIdentityCredential::default();
    
    // Rest of the code remains the same
    // ...
}
```

## Additional Rust learning resources

If you're new to Rust, these official resources will help you get up to speed:

- [The Rust Programming Language](https://doc.rust-lang.org/book/) - The official Rust book, covering everything from basics to advanced topics
- [Rust by Example](https://doc.rust-lang.org/rust-by-example/) - Learn Rust through hands-on examples
- [The Cargo Book](https://doc.rust-lang.org/cargo/) - Complete guide to Cargo, Rust's package manager and build system
- [Rustlings](https://github.com/rust-lang/rustlings) - Interactive exercises to learn Rust
- [Rust development tools](https://www.rust-lang.org/tools) - Official overview of IDEs, editors, and development tools

## Next steps

* [Create and use a service principal](/azure/developer/rust/sdk/authentication-local-development)
* [Azure SDK for Rust](https://github.com/Azure/azure-sdk-for-rust)