---
title: What is Azure for JavaScript developers
description: Azure concepts for JavaScript, TypeScript, and Node.js developers. 
ms.topic: how-to
ms.date: 08/09/2022
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

* [Hosting](../how-to/deploy-web-app.md)
* Authentication and authorization
* Containers
* VMs
* [Databases](https://azure.microsoft.com/product-categories/databases/)
* Storage
* [Search](/azure/search/tutorial-javascript-overview)
* Cognitive services
* Metrics and logging
* DevOps

## 1. Create Azure services in the Quickstart Center

When you begin learning the Azure cloud,  [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F), then start in the [Quickstart Center](https://ms.portal.azure.com/#blade/Microsoft_Azure_Resources/QuickstartCenterBlade) in the Azure portal.

Each service's page on the Azure portal includes connection information you'll need to access your resource outside of the portal. 

### Pricing tiers

Pricing tiers are how your resource is billed. Use the [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator) to understand billing for your resource. 

### Free tier resources

When selecting the free (F0) pricing tier, it's important to understand limitations that come with that plan. When a free tier is offered:

* A subscription may be limited to one free resource of that service. If you can't create a free resource, that indicates the free resource already exists in your subscription.
* When you exceed the pricing tier quota, either in transactions per second (TPS), or transactions per month (TPM), your application receives an HTTP error with a message indicating you're out of quota. 

## 2. Prepare your development environment

Your development environment needs a few tools to have the best development experience:

* [Visual Studio Code](https://code.visualstudio.com/) and the [Azure Tools](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack) extension
* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/en/) - always use the Long-term support (LTS) version if possible. 
* If you need to synchronize your local development runtime with your Azure hosted runtime (such as Azure App Service, Azure Functions, or Azure Static Web apps), use a runtime version management solution such as:
  * [NVM](https://github.com/nvm-sh/nvm/blob/master/README.md) 
  * [Docker Containers](https://www.docker.com/)
* [Azure CLI](/cli/azure/install-azure-cli) to provide Azure resource creation and management. 
* Local development hosting CLIs such as: 
  * [Static web apps CLI](https://github.com/Azure/static-web-apps-cli)
  * [Azure Functions Core Tools](https://github.com/Azure/azure-functions-core-tools).

## 3. Use Azure SDK with JavaScript

To use Azure services programmatically with JavaScript, find the [npm package](../azure-sdk-library-package-index.md) specific to the service you'll use. Each npm package has service-specific connection information.

All Azure SDKs run with JavaScript without any other tooling. While most modern SDKs are written in TypeScript and provide the `*.d.ts` file for type checking, TypeScript isn't a requirement to use the Azure SDKs or the Azure cloud services. 

Your JavaScript code can use Azure services, regardless of where your code is hosted (local, hybrid, cloud). The recommended way to use Azure services programmatically with JavaScript is the Azure SDKs. These SDKs expect a minimum Node.js with Long-term support (LTS). 

## 4. Verify runtime for JavaScript apps hosted in Azure 

[!INCLUDE [Azure services Node.js minimum version](../includes/nodejs-runtime-for-azure-services.md)]

## 5. Try a JavaScript quickstart for your hosting scenario

Hosting options allow you to quickly use Azure for your application. The following hosting quickstarts and tutorials guide you to the most common Azure first day experience:

* **Front-end client with APIs** using [Azure Static Web apps](/azure/static-web-apps/)
    * [Vanilla JS](/azure/static-web-apps/getting-started?tabs=vanilla-javascript)
    * [React](/azure/static-web-apps/getting-started?tabs=react)
    * [Angular](/azure/static-web-apps/getting-started?tabs=angular)
    * [Vue](/azure/static-web-apps/getting-started?tabs=vue)
* **Serverless APIs** using [Azure Functions](/azure/azure-functions/)
* **Server application** using [Azure App Service](/azure/app-service/) 
    * [Deploy Express.js MongoDB app to App Service from Visual Studio Code](/azure/app-service/tutorial-nodejs-mongodb-app?tabs=azure-portal%2Cterminal-bash%2Cvscode-deploy%2Cdeploy-instructions-azportal%2Cdeploy-zip-linux-mac%2Cdeploy-instructions--zip-azcli)
* **Container** application using [Azure App Service](/azure/app-service/)
    * [Run a custom container in Azure](/azure/app-service/quickstart-custom-container?tabs=node&pivots=container-linux-vscode)
* **Linux Virtual machine** application using [Azure Virtual Machines](/azure/virtual-machines/)
    * [Create and deploy Linux virtual machine with Express.js app using Azure CLI and GitHub actions](/azure/developer/javascript/tutorial/run-nodejs-virtual-machine)

Learn more about [hosting options](../how-to/deploy-web-app.md).

## Next steps

* [Learn recommended tools for Azure JavaScript developers](../node-azure-tools.md)
