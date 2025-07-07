# What is Azure for Rust developers?

Azure is a cloud platform that offers a full range of hosting options and services to build, deploy, and manage your Rust applications. This article introduces Azure concepts specifically for Rust developers.

If you're new to cloud development, explore these resources to get familiar with Azure:

- [Azure Architecture Center](https://learn.microsoft.com/azure/architecture/)
- [Azure terminology](https://learn.microsoft.com/azure/cloud-adoption-framework/ready/considerations/fundamental-concepts)
- [Ten design principles for Azure applications](https://learn.microsoft.com/azure/architecture/guide/design-principles/)
- [Cloud design patterns](https://learn.microsoft.com/azure/architecture/patterns/)

## Rust in the cloud ecosystem

Rust is gaining momentum for cloud applications thanks to its performance, reliability, and safety guarantees. While cloud platforms traditionally focused on JavaScript, Python, Java, and .NET, Rust offers compelling advantages:

- **Performance with safety**: Zero-cost abstractions and memory safety make Rust ideal for high-performance cloud services
- **Low resource usage**: Minimal runtime overhead and efficient memory management reduce cloud costs
- **Cross-platform compatibility**: Write once, deploy anywhere capabilities work seamlessly with cloud-native approaches
- **Growing ecosystem**: Robust libraries for web servers, async I/O, serialization, and more

Azure provides multiple integration points for Rust applications through both the [Azure SDK for Rust](https://github.com/Azure/azure-sdk-for-rust) and standard protocols like HTTP for REST APIs. Use Azure services with your Rust applications regardless of where they're hosted.

> [!NOTE]
> The Azure SDK for Rust requires Rust edition 2021 or later and supports Rust 1.67.0 or newer versions.

## Rust and other languages

Azure supports many programming languages for cloud development. While Rust is still emerging in the Azure ecosystem, it brings unique advantages:

- Memory safety without garbage collection
- Thread safety and powerful concurrency
- High performance with low resource usage
- Strong type system and ownership model
- Cross-platform compatibility

Access Azure services from your Rust applications through the Azure SDK for Rust, REST APIs, or custom handlers for specific services.

## Azure services

Azure offers a vast range of cloud services that you can use independently or together in your Rust applications.

Key service categories for Rust developers include:

- [Hosting](https://learn.microsoft.com/azure/developer/intro/hosting-apps-on-azure)
- [Authentication and authorization](https://learn.microsoft.com/azure/?product=identity)
- [Containers](https://learn.microsoft.com/azure/?product=containers)
- [Databases](https://learn.microsoft.com/azure/?product=databases)
- [Storage](https://learn.microsoft.com/azure/?product=storage)
- [Search](https://learn.microsoft.com/azure/search/)
- [AI and Cognitive services](https://learn.microsoft.com/azure/?product=ai-machine-learning)
- [Security](https://learn.microsoft.com/azure/?product=security)
- [DevOps](https://learn.microsoft.com/azure/?product=devops)

## Create Azure services in the Quickstart Center

Start your Azure journey by [creating a free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F), then visit the [Quickstart Center](https://portal.azure.com/#blade/Microsoft_Azure_Resources/QuickstartCenterBlade) in the Azure portal.

Find connection information on each service's page in the Azure portal to access your resources from your code.

### Pricing tiers

Pricing tiers determine how your resource is billed. Use the [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator) to estimate costs for your resources.

### Free tier resources

When using the free (F0) pricing tier, keep these limitations in mind:

- Your subscription may allow only one free resource per service. If you can't create a free resource, you may already have one in your subscription
- Free tiers have limits on transactions per second (TPS) or transactions per month (TPM)
- Exceeding these limits results in HTTP errors with quota-exceeded messages
- For higher-volume applications, create multiple resources and use a single endpoint to distribute traffic

## Set up your development environment

Set up these tools for the best Rust on Azure development experience:

- [Visual Studio Code](https://code.visualstudio.com/) with the [Azure Tools](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack) extension
- [Git](https://git-scm.com/)
- [Rust toolchain](https://www.rust-lang.org/tools/install) - use the latest stable release
- [Azure CLI](https://learn.microsoft.com/cli/azure/install-azure-cli) for Azure resource management
- Local development tools:
  - [Azure Functions Core Tools](https://github.com/Azure/azure-functions-core-tools) for local Functions development
  - [Docker](https://www.docker.com/) for container development and testing

## Use Azure client libraries with Rust

Access Azure services programmatically with the [Azure SDK for Rust](https://github.com/Azure/azure-sdk-for-rust), where each crate provides service-specific connection capabilities.

The SDK offers an idiomatic Rust API following the [Azure SDK Guidelines](https://azure.github.io/azure-sdk/rust_introduction.html) with features like:

- Authentication with Microsoft Entra ID (formerly Azure AD)
- Automatic retries with exponential back-off
- Logging and distributed tracing
- Cancellation support
- Full async/await support

Run your Rust code anywhere—locally, in hybrid environments, or in the cloud—while interacting with Azure services through the SDK.

## Deploy Rust apps to Azure

When hosting Rust applications on Azure, choose between two main approaches:

1. **Compile to binaries**: Build your Rust application into native binaries and deploy directly to appropriate hosting services

2. **Containerization**: Package your application in containers for deployment to container-based Azure services

Choose from these hosting options based on your application needs:

| Service | Deployment approach | Best suited for |
|---------|---------------------|----------------|
| [Azure App Service](https://learn.microsoft.com/azure/app-service/) | Custom container | Web applications, APIs |
| [Azure Functions](https://learn.microsoft.com/azure/azure-functions/) | [Custom handlers](https://learn.microsoft.com/azure/azure-functions/functions-custom-handlers) | Event-driven, serverless workloads |
| [Azure Container Apps](https://learn.microsoft.com/azure/container-apps/) | Container | Microservices, containerized applications |
| [Azure Kubernetes Service](https://learn.microsoft.com/azure/aks/) | Container in Kubernetes | Complex applications, high-scale workloads |
| [Azure Virtual Machines](https://learn.microsoft.com/azure/virtual-machines/) | Direct VM deployment | Applications with specific OS or hardware requirements |

For practical examples of deploying Rust applications to Azure, see the [Quickstart: Deploy Rust applications to Azure](./quickstart-deploy-rust-apps.md).

## Try a Rust quickstart

Get started with Rust on Azure using these quickstarts and tutorials:

- [Create a Rust function with Visual Studio Code](https://learn.microsoft.com/azure/azure-functions/create-first-function-vs-code-other?tabs=rust)
- [Deploy a containerized app to Azure Container Apps](https://learn.microsoft.com/azure/container-apps/quickstart-code-to-cloud?tabs=bash&pivots=with-dockerfile)
- [Access Azure Storage with Rust](./quickstart-storage-sdk.md)

## Next steps

- [Learn about the Azure SDK for Rust](sdk-overview.md)
- [Install the Azure SDK for Rust](sdk-installation.md)
- [Explore Rust crates for Azure](https://crates.io/search?q=azure_)
- [Azure SDK for Rust GitHub repository](https://github.com/Azure/azure-sdk-for-rust)
