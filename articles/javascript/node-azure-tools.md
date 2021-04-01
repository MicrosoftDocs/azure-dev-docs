---
title: Tool selection - JavaScript - Azure
description: Install individual tools for Node.js and JavaScript development on Azure
ms.topic: conceptual
ms.date: 04/01/2021
ms.custom: seo-javascript-september2019, seo-javascript-october2019, devx-track-js
---

# Tools for JavaScript developers on Azure 

JavaScript is an ecosystem of many tools. This article is a selection of tools built and maintained by Microsoft for JavaScript developers. You don't need to use these tools to use Azure, it just makes the experience much better, both in functionality and support. 

## Azure portal

The [Azure portal](https://portal.azure.com/) gives you access to all subscriptions and resources for your account. 

## Visual Studio Code

[Visual Studio Code](https://code.visualstudio.com) is the preferred IDE for JavaScript development for Azure. The interface, features, and extensions work together to shorten development time and reduce development frustration. 

Create a project workspace at the root of your local development project then add all relevant configurations, settings, and extensions. Check in the workspace file with the project so every team member has access to the settings and tools they need for the project.

You get several benefits using Visual Studio Code:

* Visual Studio Code displays the Azure reference documentation inline
* Visual Studio Code provides statement completion
* Few ambiguous types or objects

Visual Studio code provides of wealth of documentation for [JavaScript project use](https://code.visualstudio.com/docs/nodejs/working-with-javascript). 

## Visual Studio Code Extensions

Use the following free extensions to use Azure services directly in Visual Studio Code.

| VS Code Extension | Description  |
|:---------:|---------|
|[Azure Tools](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack)|A collection of extensions. Get web site hosting, SQL and MongoDB data, Docker Containers, Serverless Functions and more, all on Azure, all from VS Code, in this one extension from Microsoft.|

If you prefer to install individual extensions, this list includes the most popular Azure services:

| VS Code Extension | Description  |
|:---------:|---------|
| [Azure Account](https://marketplace.visualstudio.com/items?itemName=ms-vscode.azure-account)<br>![Azure Account](./media/node-azure-tools/icon-account.png)| Sign-In and Subscription management<br><br>Tutorial: [Deploy containers to Azure App Service](tutorial/tutorial-vscode-docker-node/tutorial-vscode-docker-node-01.md)|
| [Azure Resource Group](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azureresourcegroups)<br>![Resource groups](./media/node-azure-tools/icon-resource-group.png)|View and manage Azure resources.<br><br>* Tutorial: [Deploy Express.js MongoDB app to App Service from Visual Studio Code](tutorial/deploy-nodejs-mongodb-app-service-from-visual-studio-code.md)<br>* Tutorial: [Add Cognitive Search to a website](/azure/search/tutorial-javascript-overview)|
| [Azure Functions](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions "Link to Azure Functions extension")<br>![Azure Functions Tools](media/node-azure-tools/icon-azure-functions.png)| Create, manage, view, debug, and deploy functions<br><br>* Quickstart: [Create a JavaScript function in Azure using Visual Studio Code](/azure/azure-functions/create-first-function-vs-code-node)|
| [Azure App Service](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azureappservice "Link to Azure App Service extension")<br>![App Service Tools](media/node-azure-tools/icon-azure-app-service.png)| Browse sites and the Azure portal, create new sites and deploy to slots. <br><br>* Quickstart: [Create a Node.js web app in Azure](/azure/app-service/quickstart-nodejs?pivots=platform-linux)<br>* Quickstart: [Run a custom container in Azure](/azure/app-service/quickstart-custom-container?pivots=container-linux) |
| [Cosmos DB](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-cosmosdb "Link to Cosmos DB extension" )<br>![Cosmos DB Tools](media/node-azure-tools/icon-cosmos-db.png)| Create, browse, and update globally distributed, multi-model databases in Azure <br><br>* Quickstart: [Connect Azure Functions to Azure Cosmos DB using Visual Studio Code](/azure/azure-functions/functions-add-output-binding-cosmos-db-vs-code?pivots=programming-language-javascript)|
| [Docker](https://marketplace.visualstudio.com/items?itemName=formulahendry.docker-explorer)   <br> [![Docker](media/node-azure-tools/icon-docker.png)](https://marketplace.visualstudio.com/items?itemName=formulahendry.docker-explorer)| Manage Docker containers and images, Docker Hub, and Azure container registry<br><br>* Tutorial: [Deploy containers to Azure App Service](tutorial/tutorial-vscode-docker-node/tutorial-vscode-docker-node-01.md) |
|[Storage](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurestorage)<br>![Azure Storage](media/node-azure-tools/icon-storage.png)|Azure Storage including Blob Containers, File Shares, Tables and Queues<br><br>* Quickstart: [Connect Azure Functions to Azure Storage using Visual Studio Code](/azure/azure-functions/functions-add-output-binding-storage-queue-vs-code?pivots=programming-language-javascript)|
| [All Azure extensions](https://marketplace.visualstudio.com/search?term=azure&target=VSCode&category=All%20categories&sortBy=Relevance)||

## TypeScript

[TypeScript](https://www.typescriptlang.org/download) offers all of JavaScript’s features, and an additional layer on top of these: TypeScript’s type system. Your existing working JavaScript code is also TypeScript code. The main benefit of TypeScript is that it can highlight unexpected behavior in your code, lowering the chance of bugs.

## TypeScript and the Azure SDK client libraries

Azure SDK client library reference documentation is written for TypeScript because the client libraries are written with TypeScript. You don't have to use TypeScript to use the Azure SDK client libraries. 

Learn more about the [TypeScript guidelines for Azure SDK](https://azure.github.io/azure-sdk/typescript_introduction.html).


## Azure CLI
Azure CLI is optimized for managing Azure resources from the command line. 

Azure CLI provides the following use scenarios:

* [Azure CLI Local installation](/cli/azure/install-az-cli2)
* [Azure Cloud Shell](https://shell.azure.com/)
* [Docker container](/cli/azure/run-azure-cli-docker)

If you use the Azure portal, the Azure CLI is available in the portal from the top navigation bar.

:::image type="content" source="media/azure-tools/azure-portal-select-azure-cloud-shell.png" alt-text="If you use the Azure portal, the Azure CLI is available in the portal from the top navigation bar.":::

