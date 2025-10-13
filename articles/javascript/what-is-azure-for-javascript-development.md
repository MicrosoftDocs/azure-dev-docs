---
title: What is Azure for JavaScript developers
description: Azure concepts for JavaScript, TypeScript, and Node.js developers. 
ms.topic: overview
ms.date: 07/16/2025
ms.custom: devx-track-js, devx-track-ts
---

# What is Azure for JavaScript developers

Azure is a cloud platform that provides a full range of hosting options and cloud-based services. If you're new to cloud development, learn more about Azure:

* [Azure Architecture Center](/azure/architecture/) 
* [Azure terminology](/azure/cloud-adoption-framework/ready/considerations/fundamental-concepts)
* [Ten design principles for Azure applications](/azure/architecture/guide/design-principles/)
* [Cloud design patterns](/azure/architecture/patterns/)

## JavaScript, TypeScript, and the modern JavaScript ecosystem

Azure fully supports modern JavaScript development, including:

* **TypeScript** - First-class support with typed SDKs and DevOps tooling
* **ECMAScript modules** - All Azure SDKs support both CommonJS and ESM formats
* **Modern frameworks** - React, Angular, Vue, Next.js, Nuxt, Remix, and other modern frameworks
* **Deno and Bun** - Emerging JavaScript runtimes with experimental Azure SDK support
* **Server-side rendering (SSR)** and **Static Site Generation (SSG)** - Fully supported on Azure hosting platforms

Azure runtime support for JavaScript also supports TypeScript or any other language that transpiles to JavaScript. The Azure SDK for JavaScript is written in TypeScript and includes type definitions to provide excellent IDE support and type safety.

## Azure services for JavaScript developers

Azure cloud-based services provide a wide variety of features that you can use independently or as a collection.

Top service categories for JavaScript developers include:

* **Hosting and Compute**
  * [Azure Static Web Apps](../intro/hosting-apps-on-azure.md) - Ideal for modern web applications
  * [Azure Functions](/azure/azure-functions/functions-reference-node) - Serverless compute with native JavaScript support
  * [Azure Container Apps](/azure/container-apps) - Kubernetes-based serverless container hosting
  * [Azure App Service](/azure/app-service/quickstart-nodejs) - Managed hosting for web applications

* **Data and Storage**
  * [Azure Cosmos DB](/azure/cosmos-db/nosql/quickstart-nodejs) - NoSQL database with native JavaScript APIs
  * [Azure Database for PostgreSQL](/azure/postgresql/) - Managed PostgreSQL service
  * [Azure Storage](/azure/storage/blobs/storage-quickstart-blobs-nodejs) - Scalable cloud storage
  * [Azure Cache for Redis](/azure/azure-cache-for-redis/cache-nodejs-get-started) - In-memory data store

* **AI and Cognitive Services**
  * [Azure OpenAI Service](/azure/ai-services/openai/quickstart?tabs=javascript) - Advanced AI models for applications
  * [Azure AI Services](/azure/ai-services/multi-service-resource?tabs=nodejs) - Pre-built AI capabilities

* **Developer Tools**
  * [GitHub Actions with Azure](/azure/developer/github/github-actions) - CI/CD integration
  * [Azure Developer CLI](/azure/developer/azure-developer-cli/overview) - Streamlined developer experience

## Create Azure services in the Quickstart Center

When you start learning the Azure cloud,  [create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn), then go to the [Quickstart Center](https://portal.azure.com/#blade/Microsoft_Azure_Resources/QuickstartCenterBlade) in the Azure portal.

Each service's page on the Azure portal includes connection information you need to access your resource outside of the portal. 

### Pricing tiers

Pricing tiers determine how you pay for your resource. Use the [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator) to understand billing for your resource. 

### Free tier resources

When you select the free (F0) pricing tier, understand the limitations that come with that plan. When a free tier is offered:

* A subscription might be limited to one free resource of that service. If you can't create a free resource, the free resource might already exist in your subscription.
* A pricing tier determines transactions per second (TPS), or transactions per month (TPM). When you exceed the pricing tier quota, your application receives an HTTP error with a message indicating you're out of quota. If you anticipate this issue for your application and Azure services, create several resources and host them behind a single endpoint. 

## Prepare your development environment

For the best development experience, set up your development environment with the following tools:

* [Visual Studio Code](https://code.visualstudio.com/) and the [Azure Tools](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack) extension
* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/en/) - always use the Long-term support (LTS) version if possible. 
* If you need to synchronize your local development runtime with your Azure hosted runtime (such as Azure App Service, Azure Functions, or Azure Static Web apps), use a runtime version management solution such as:
* [**Development Containers**](https://containers.dev/): Use a container with a specific Node.js version. You can manage the version of Node.js across several environments using containers. Visual Studio Code's [Remote - Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) simplifies this process.
* [Azure CLI](/cli/azure/install-azure-cli) to provide Azure resource creation and management. 
* Local development hosting CLIs such as: 
  * [Static web apps CLI](https://github.com/Azure/static-web-apps-cli)
  * [Azure Functions Core Tools](https://github.com/Azure/azure-functions-core-tools).

## Use Azure client libraries with JavaScript

To use Azure services programmatically with JavaScript, find the [npm package](azure-sdk-library-package-index.md) specific to the service you want to use. Each npm package has service-specific connection information.

All Azure client libraries run with JavaScript without any other tooling. While most modern SDKs are written in TypeScript and provide the `*.d.ts` file for type checking, TypeScript isn't a requirement to use the Azure client libraries or the Azure cloud services. 

Your JavaScript code can use Azure services, regardless of where your code is hosted (local, hybrid, cloud). The recommended way to use Azure services programmatically with JavaScript is the Azure client libraries. These libraries expect a minimum Node.js with Long-term support (LTS).

## Azure SDK for JavaScript

The [Azure SDK for JavaScript](https://github.com/Azure/azure-sdk-for-js) provides libraries that make it easy to consume and manage Azure services. Browse the complete [Azure SDK library package index](azure-sdk-library-package-index.md) to find the packages you need.

Key features include:
* Modular npm packages for each Azure service
* First-class TypeScript support with comprehensive type definitions
* Modern async patterns with Promise-based APIs
* Browser and Node.js compatibility for many services

## Node.js support in Azure

Azure services regularly update their Node.js runtime support. Always use Long-Term Support (LTS) versions of Node.js for production applications. 

For current Node.js version support across Azure services and best practices for Node.js deployment, see:
* [Azure SDK client libraries support policy](https://github.com/Azure/azure-sdk-for-js/blob/main/SUPPORT.md#microsoft-support-policy)
* [Node.js versions in Azure App Service](/azure/app-service/configure-language-nodejs)
* [Node.js in Azure Functions](/azure/azure-functions/functions-reference-node)
* [Container-based deployments](../intro/hosting-apps-on-azure.md) for custom Node.js versions

Best practices include pinning your Node.js version, using LTS versions, and monitoring for security vulnerabilities.

[!INCLUDE [Azure services Node.js minimum version](includes/nodejs-runtime-for-azure-services.md)]

## Try a JavaScript quickstart for your hosting scenario

Hosting options allow you to quickly use Azure for your application. The following hosting quickstarts and tutorials guide you to the most common Azure first day experience:

* **Front-end client with APIs** using [Azure Static Web apps](/azure/static-web-apps/)
    * [Vanilla JS](/azure/static-web-apps/getting-started?tabs=vanilla-javascript)
    * [React](/azure/static-web-apps/getting-started?tabs=react)
    * [Angular](/azure/static-web-apps/getting-started?tabs=angular)
    * [Vue](/azure/static-web-apps/getting-started?tabs=vue)
* **Serverless APIs** using [Azure Functions](/azure/azure-functions/)
* **Server application** using [Azure App Service](/azure/app-service/) 
    * [Deploy Express.js MongoDB app to App Service from Visual Studio Code](/azure/app-service/tutorial-nodejs-mongodb-app?tabs=azure-portal%2Cterminal-bash%2Cvscode-deploy%2Cdeploy-instructions-azportal%2Cdeploy-zip-linux-mac%2Cdeploy-instructions--zip-azcli)
* **Container** application using [Azure Container Apps](/azure/container-apps/quickstart-code-to-cloud?tabs=bash%2Cjavascript&pivots=with-dockerfile)

## Next steps

* [Learn recommended tools for Azure JavaScript developers](node-azure-tools.md)
[!INCLUDE [javascript-new-releases](includes/javascript-at-microsoft/bullet.md)]