---
title: What is Azure for JavaScript developers
description: Azure concepts for JavaScript, TypeScript, and Node.js developers. 
ms.topic: conceptual
ms.date: 04/01/2021
ms.custom: devx-track-js
---

# What is Azure for JavaScript developers

Azure is a cloud platform providing a full range of hosting options and cloud-based services. If you are new to cloud development, learn more about Azure:

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
* [Databases](../how-to/with-database/getting-started.md)
* Storage
* [Search](../azure/search/tutorial-javascript-overview)
* Cognitive services
* Metrics and logging
* DevOps

## 1. Create Azure services in the Quickstart Center

When you begin learning the Azure cloud,  [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F), then start in the [Quickstart Center](https://ms.portal.azure.com/#blade/Microsoft_Azure_Resources/QuickstartCenterBlade) in the Azure portal.

Each service's page on the Azure portal includes connection information you will need to access your resource outside of the portal. 

### Pricing tiers

Pricing tiers are how your resource is billed. Use the [Azure pricing calculator](https://azure.microsoft.com/en-us/pricing/calculator) to understand billing for your resource. 

### Free tier resources

When selecting the free (F0) pricing tier, it is important to understand limitations that come with that plan. When a free tier is offered:

* A subscription may be limited to one free resource of that service. If you can't create a free resource, that indicates the free resource already exists in your subscription.
* When you exceed the pricing tier quota, either in transactions per second (TPS), or transactions per month (TPS), your application will receive an HTTP error with a message indicating you are out of quota. 

## 2. Prepare your development environment

Your development environment needs a few tools to have the best development experience:

* [VS Code](https://code.visualstudio.com/) and the [Azure Tools](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack) extension
* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/en/) - always use the Long-term support (LTS) version if possible. 
* Runtime version management such as [NVM](https://github.com/nvm-sh/nvm/blob/master/README.md) or [Docker Containers](https://www.docker.com/) if you need to synchronize your local development runtime with your Azure hosted runtime using Azure App Service, Azure Functions, or Azure Static Web apps.
* [Azure CLI](/cli/azure/install-azure-cli) to provide Azure resource creation and management. 

## 3. Use Azure SDK with JavaScript

To use Azure services programmatically with JavaScript, find the [service-specific npm package](azure-sdk-library-package-index.md). Each npm package has service-specific connection information.

All Azure SDKs run with JavaScript without any other tooling. While most modern SDKs are written in TypeScript and provide the `*.d.ts` file for type checking, TypeScript is not a requirement to use the Azure SDKs or the Azure cloud services. 

Your JavaScript code can use Azure services, regardless of where they are hosted (local, hybrid, cloud). The recommended way to use Azure services programmatically with JavaScript is the Azure SDKs. These SDKs expect a minimum Node.js runtime version of 8+. 

## 4. Verify runtime for JavaScript apps hosted in Azure 

In order to host your JavaScript apps in Azure, make sure your local development environment Node.js runtime mimics the Azure hosting runtime your intend to use. 

* Azure [App service](/azure/app-service/) uses the Node.js runtime engine. To show all supported Node.js versions, run the following command in the [Cloud Shell](https://shell.azure.com):

    ```azurecli-interactive
    az webapp list-runtimes | grep node
    ```

* Azure [Functions supported Node.js versions](/azure/azure-functions/functions-reference-node?tabs=v2#node-version) are based on which version of Functions you use. 

* Custom runtimes - a custom runtime is supported in the following ways:

    * [Virtual machines](/azure/virtual-machines/)
    * Containers - [single](/azure/container-instances/), [web app](/azure/app-service/), [Kubernetes](/azure/aks/)
    * (serverless) Functions - use [custom handlers](/azure/azure-functions/functions-custom-handlers)

## 5. Try a JavaScript quickstart for your hosting scenario

Hosting options allow you to quickly use Azure for your application. The following hosting quickstarts and tutorials guide you to the most common Azure first day experience:

* **Front-end client with APIs** using Azure Static Web apps
    * [Vanilla JS](/azure/static-web-apps/getting-started?tabs=vanilla-javascript)
    * [React](/azure/static-web-apps/getting-started?tabs=react)
    * [Angular](/azure/static-web-apps/getting-started?tabs=angular)
    * [Vue](/azure/static-web-apps/getting-started?tabs=vue)
* **Server application** using Azure App Service 
    * [Deploy Express.js MongoDB app to App Service from Visual Studio Code](../tutorial/deploy-nodejs-mongodb-app-service-from-visual-studio-code.md)
* **Container** application using Azure App Service
    * [Deploy Express.js containerized app to App Service from private container registry using Visual Studio Code](../tutorial/tutorial-vscode-docker-node/tutorial-vscode-docker-node-01.md?tabs=bash)
* **Linux Virtual machine** application using Azure Virtual Machines
    * [Create and deploy Linux virtual machine with Express.js app using Azure CLI and GitHub actions](../tutorial/nodejs-virtual-machine-vm/create-linux-virtual-machine-azure-cli.md)

Learn more about [hosting options](../how-to/deploy-web-app.md).

## Next steps

* [Install Node.js](install-nodejs-develop-azure-sdk-project.md)
* [Learn recommended tools for Azure JavaScript developers](../node-azure-tools.md)
