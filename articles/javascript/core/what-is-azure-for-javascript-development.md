---
title: What is Azure for JavaScript developers
description: Azure concepts for JavaScript, TypeScript, and Node.js developers. 
ms.topic: overview
ms.date: 08/26/2024
ms.custom: devx-track-js, devx-track-ts
---

# What is Azure for JavaScript developers

Azure is a cloud platform providing a full range of hosting options and cloud-based services. If you're new to cloud development, learn more about Azure:

* [Azure Architecture Center](/azure/architecture/) 
* [Azure terminology](/azure/cloud-adoption-framework/ready/considerations/fundamental-concepts)
* [Ten design principles for Azure applications](/azure/architecture/guide/design-principles/)
* [Cloud design patterns](/azure/architecture/patterns/)

## JavaScript, TypeScript, and other languages

Azure runtime support for JavaScript also supports TypeScript or any other flavor that transpiles down to JavaScript.

## Azure services

Azure cloud-based services provide a huge variety of features. These services can be used independently or as a collection.

Top service types for JavaScript developers include:

* [Hosting](../../intro/hosting-apps-on-azure.md)
* [Authentication and authorization](/azure/?product=identity)
* [Containers](/azure/?product=containers)
* [Databases](/azure/?product=databases)
* [Storage](/azure/?product=storage)
* [Search](/azure/search/tutorial-javascript-overview)
* [AI and Cognitive services](/azure/?product=ai-machine-learning)
* [Security](/azure/?product=security)
* [DevOps](/azure/?product=devops)

## Create Azure services in the Quickstart Center

When you begin learning the Azure cloud,  [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F), then start in the [Quickstart Center](https://portal.azure.com/#blade/Microsoft_Azure_Resources/QuickstartCenterBlade) in the Azure portal.

Each service's page on the Azure portal includes connection information you'll need to access your resource outside of the portal. 

### Pricing tiers

Pricing tiers are how your resource is billed. Use the [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator) to understand billing for your resource. 

### Free tier resources

When selecting the free (F0) pricing tier, it's important to understand limitations that come with that plan. When a free tier is offered:

* A subscription may be limited to one free resource of that service. If you can't create a free resource, this may indicate the free resource already exists in your subscription.
* A pricing tier determines transactions per second (TPS), or transactions per month (TPM). When you exceed the pricing tier quota, your application receives an HTTP error with a message indicating you're out of quota. If you anticipate this issue for your application and Azure services, create several resources and host them behind a single endpoint. 

## Prepare your development environment

Your development environment needs a few tools to have the best development experience:

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

To use Azure services programmatically with JavaScript, find the [npm package](../azure-sdk-library-package-index.md) specific to the service you'll use. Each npm package has service-specific connection information.

All Azure client libraries run with JavaScript without any other tooling. While most modern SDKs are written in TypeScript and provide the `*.d.ts` file for type checking, TypeScript isn't a requirement to use the Azure client libraries or the Azure cloud services. 

Your JavaScript code can use Azure services, regardless of where your code is hosted (local, hybrid, cloud). The recommended way to use Azure services programmatically with JavaScript is the Azure client libraries. These libraries expect a minimum Node.js with Long-term support (LTS). 

## Verify runtime for JavaScript apps hosted in Azure 

[!INCLUDE [Azure services Node.js minimum version](../includes/nodejs-runtime-for-azure-services.md)]

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

* [Learn recommended tools for Azure JavaScript developers](../node-azure-tools.md)
