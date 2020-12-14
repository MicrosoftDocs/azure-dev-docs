---
title: What is Azure for JavaScript developers
description: Azure concepts for JavaScript, TypeScript, and Node.js developers. 
ms.topic: conceptual
ms.date: 12/14/2020
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

## Run JavaScript with hosted runtime 

* Azure [App service](/azure/app-service/) uses the Node.js runtime engine. To show all supported Node.js versions, run the following command in the [Cloud Shell](https://shell.azure.com):

    ```azurecli-interactive
    az webapp list-runtimes | grep node
    ```

* Azure [Functions supported Node.js versions](/azure/azure-functions/functions-reference-node?tabs=v2#node-version) are based on which version of Functions you use. 

* Custom runtimes - a custom runtime is supported in the following ways:

    * [Virtual machines](/azure/virtual-machines/)
    * Containers - [single](/azure/container-instances/), [web app](/azure/app-service/), [Kubernetes](/azure/aks/)
    * (serverless) Functions - use [custom handlers](/azure/azure-functions/functions-custom-handlers)

## Run JavaScript with Azure SDKs

All Azure SDKs run with JavaScript without any other tooling. While most modern SDKs are written in TypeScript and provide the `*.d.ts` file for type checking, TypeScript is not a requirement to use the Azure SDKs or the Azure cloud services. 

Your JavaScript code can use Azure services, regardless of where they are hosted (local, hybrid, cloud). The recommended way to use Azure services programmatically with JavaScript is the Azure SDKs. These SDKs expect a minimum Node.js runtime version of 8+. 

## Azure concepts and terminology

To get started with Azure, you need to:
* Create a [free subscription](https://azure.microsoft.com/en-us/free/)
* Create a resource, which includes:
    * Login to the [Azure portal](https://portal.azure.com/)
    * Create a resource group - to hold a logical collection of your Azure resources
    * Create a resource in your resource group
* Use resource, depending on resource, that can include:
    * With Azure portal
    * With Azure CLI
    * With PowerShell
    * With Azure SDKs

Learn more about [introductory Azure concepts and terminology](/azure/cloud-adoption-framework/ready/considerations/fundamental-concepts). 

Azure provides guidance on [naming conventions and resource tagging](/azure/cloud-adoption-framework/ready/azure-best-practices/naming-and-tagging), to help you find your resources. 

## Select development IDE and set up environment

Develop your JavaScript application with any Integrated development environment. We recommend **Visual Studio Code** for JavaScript development. 

Learn more about [recommended tools for JavaScript developers](../node-azure-tools.md). 

## Select Azure account, subscription, resource, and tag

* Your **Azure account** is tied, by your email address, to a subscription. You can have one or more Azure accounts.

* A **subscription** is an organizational and billing unit for your resources. You can have one or more subscriptions. Learn more about [creating your initial production subscriptions](/azure/cloud-adoption-framework/ready/azure-best-practices/initial-subscriptions).

* Your **resource group** is the next organization level down, inside a subscription. Create a new resource group for each project or group of Azure services you plan to use together. 

* When selecting a name for a **resource**, it is important to know when the resource name is used for your resource's URL endpoint. You can also assign a custom domain name to many resources after the resource is created. 

* A more fluid grouping of resources is to **tag a resource** with a property name and value. A common use for tags is to add your name or email as a project owner for every resource you create. A subscription administrator can easily find resource you own or determine ownership when usage or billing issues come up. 

A [systematic naming convention](/azure/cloud-adoption-framework/ready/azure-best-practices/resource-naming) is an important part of production-level Azure usage.

## Create Azure resources

The most common way to create resources for someone new to Azure, is to use the Azure portal. The creation steps show every choice you need to answer along with the recommended selection.

While most services offer a free-tier (F0), that tier may not be the recommended selection. When a free tier is offered, a subscription may be limited to one free resource of that service. Use the [Azure pricing calculator](https://azure.microsoft.com/en-us/pricing/calculator) to understand billing for your resource. 

Most resources take a few minutes to create but some may take a few minutes. The Azure portal notifications window lets you know when your resource is available to use along with a link to the resource. 

## Install Azure SDK for resources

The [**Azure SDKs**](../azure-sdk-library-package-index.md) are the recommended programmatic way to use your resources for JavaScript developers. 

Azure resources are also available from:
* [Azure CLI](/cli/azure/install-azure-cli) and [Azure Cloud Shell](https://shell.azure.com/)
* [Azure PowerShell](/powershell/azure/?view=azps-5.2.0&preserve-view=true)
* [REST APIs](/rest/api/azure/)

## Deploy web apps to hosting options

Hosting options allow you to quickly use Azure for your application. The following hosting quickstarts and tutorials guide you to the most common Azure first day experience:

* Client/static application
    * [Vanilla JS](/azure/static-web-apps/getting-started?tabs=vanilla-javascript)
    * [React](/azure/static-web-apps/getting-started?tabs=react)
    * [Angular](/azure/static-web-apps/getting-started?tabs=angular)
    * [Vue](/azure/static-web-apps/getting-started?tabs=vue)
* Server application 
    * [Deploy Express.js MongoDB app to App Service from Visual Studio Code](../tutorial/deploy-nodejs-mongodb-app-service-from-visual-studio-code.md)
* Container application 
    * [Deploy Express.js containerized app to App Service from private container registry using Visual Studio Code](../tutorial-vscode-docker-node-01.md?tabs=bash)
* Virtual machine application
    * [Create and deploy Linux virtual machine with Express.js app using Azure CLI and GitHub actions](../tutorial/nodejs-virtual-machine-vm/create-linux-virtual-machine-azure-cli.md)

Learn more about [hosting options](../how-to/deploy-web-app.md).

## Next steps

* [Install Node.js](install-nodejs-develop-azure-sdk-project.md)
* [Learn recommended tools for Azure JavaScript developers](../node-azure-tools.md)
