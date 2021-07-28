---
title: Tool selection - JavaScript - Azure
description: Install individual tools for Node.js and JavaScript development on Azure
ms.topic: conceptual
ms.date: 07/28/2021
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
|[Azure Tools](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack)<br>![Azure tools](./media/node-azure-tools/azure-tools-icon.png)|A collection of extensions. Get web site hosting, SQL and MongoDB data, Docker Containers, Serverless Functions and more, all on Azure, all from VS Code, in this one extension from Microsoft.|

If you prefer to install individual extensions, this list includes the most popular Azure services:

| VS Code Extension | Description  |
|:---------:|---------|
| [Azure Account](https://marketplace.visualstudio.com/items?itemName=ms-vscode.azure-account)<br>![Azure Account](./media/node-azure-tools/icon-account.png)| Sign-In and Subscription management<br><br>Tutorial: [Deploy containers to Azure App Service](tutorial/tutorial-vscode-docker-node/tutorial-vscode-docker-node-01.md)|
| [Azure Resource Group](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azureresourcegroups)<br>![Resource groups](./media/node-azure-tools/icon-resource-group.png)|View and manage Azure resources.<br><br>* Tutorial: [Deploy Express.js MongoDB app to App Service from Visual Studio Code](tutorial/deploy-nodejs-mongodb-app-service-from-visual-studio-code.md)<br>* Tutorial: [Add Cognitive Search to a website](/azure/search/tutorial-javascript-overview)|
| [Azure Functions](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions "Link to Azure Functions extension")<br>![Azure Functions Tools](media/node-azure-tools/icon-azure-functions.png)| Create, manage, view, debug, and deploy functions<br><br>* Quickstart: [Create a JavaScript function in Azure using Visual Studio Code](/azure/azure-functions/create-first-function-vs-code-node)|
| [Azure App Service](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azureappservice "Link to Azure App Service extension")<br>![App Service Tools](media/node-azure-tools/icon-azure-app-service.png)| Browse sites and the Azure portal, create new sites and deploy to slots. <br><br>* Quickstart: [Create a Node.js web app in Azure](/azure/app-service/quickstart-nodejs?pivots=platform-linux)<br>* Quickstart: [Run a custom container in Azure](/azure/app-service/quickstart-custom-container?pivots=container-linux) |
| [Cosmos DB](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-cosmosdb "Link to Cosmos DB extension" )<br>![Cosmos DB Tools](media/node-azure-tools/icon-cosmos-db.png)| Create, browse, and update globally distributed, multi-model databases in Azure <br><br>* Quickstart: [Connect Azure Functions to Azure Cosmos DB using Visual Studio Code](/azure/azure-functions/functions-add-output-binding-cosmos-db-vs-code?pivots=programming-language-javascript)|
| [Docker](https://marketplace.visualstudio.com/items?itemName=formulahendry.docker-explorer)   <br> [![Docker](media/node-azure-tools/icon-docker.png)](https://marketplace.visualstudio.com/items?itemName=formulahendry.docker-explorer)| Manage Docker containers and images, Docker Hub, and Azure container registry<br><br>* Tutorial: [Deploy containers to Azure App Service](tutorial/tutorial-vscode-docker-node/tutorial-vscode-docker-node-01.md) |
|[Storage](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurestorage)<br>![Azure Storage](media/node-azure-tools/icon-storage.png)|Azure Storage including Blob Containers, File Shares, Tables, and Queues<br><br>* Quickstart: [Connect Azure Functions to Azure Storage using Visual Studio Code](/azure/azure-functions/functions-add-output-binding-storage-queue-vs-code?pivots=programming-language-javascript)|
|[Remote - Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)<br>![Remote-containers](media/node-azure-tools/remote-containers-icon.png)|Open any folder or repository inside a Docker container and take advantage of Visual Studio Code's full feature set.|
|[Remote - SSH](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-ssh)<br>![Remote - SSH](media/node-azure-tools/remote-ssh-icon.png)|Open any folder on a remote machine using SSH and take advantage of VS Code's full feature set.|
| [All Azure extensions](https://marketplace.visualstudio.com/search?term=azure&target=VSCode&category=All%20categories&sortBy=Relevance)||

## TypeScript

[TypeScript](https://www.typescriptlang.org/download) offers all of JavaScript’s features, and another layer on top of these: TypeScript’s type system. The main benefit of TypeScript is that it can highlight unexpected behavior in your code, lowering the chance of bugs.

## TypeScript and the Azure SDK client libraries

Azure SDK client library reference documentation is written for TypeScript because the client libraries are written with TypeScript. You don't have to use TypeScript to use the Azure SDK client libraries. 

Learn more about the [TypeScript guidelines for Azure SDK](https://azure.github.io/azure-sdk/typescript_introduction.html).

## Windows Terminal

[Windows Terminal](https://github.com/microsoft/terminal) allows you to access several different terminal types from the same Windows application including the Azure CLI and Ubuntu. Use this tool to develop and test CICD bash scripts before using those in GitHub Actions or another pipeline.

## Windows Subsystem for Linux

The [Windows Subsystem for Linux](/windows/wsl/) lets developers run a GNU/Linux environment, including most command-line tools, utilities, and applications, directly on Windows, unmodified, without the overhead of a traditional virtual machine or dual-boot setup.

## CICD tools

The following integration tools for building and deployment will significantly increase your productivity.

* [Git](https://git-scm.com/downloads) or [Git for Windows](https://gitforwindows.org/)
* [GitHub Actions](https://github.com/marketplace?type=actions&query=azure) 
* [Azure Pipelines](https://marketplace.visualstudio.com/search?term=azure&target=AzureDevOps&category=Azure%20Pipelines&certified=microsoft&sortBy=Relevance) integration

## Docker Containers

If you are looking for a Microsoft or Azure-specific Docker image, use the [Microsoft Container Registry](https://github.com/microsoft/containerregistry) (MRC) to [query for an image](https://mcr.microsoft.com/v2/_catalog). 

### Local development

If you typically use Docker containers locally in your development environment, consider using the [Remote - Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) extension. This extension allows you to find a relevant container for your current open folder in Visual Studio Code. There are several Node.js containers to select from or you can bring your own. Once you open the project in a container, you can set breakpoints and debug as if you were in your local environment. 

## Azure CLI
Azure CLI is optimized for managing Azure resources from the command line. 

Azure CLI provides the following use scenarios:

* [Azure CLI Local installation](/cli/azure/install-az-cli2)
* [Azure Cloud Shell](https://shell.azure.com/)
* [Docker container](/cli/azure/run-azure-cli-docker)

If you use the Azure portal, the Azure CLI is available in the portal from the top navigation bar.

:::image type="content" source="media/azure-tools/azure-portal-select-azure-cloud-shell.png" alt-text="If you use the Azure portal, the Azure CLI is available in the portal from the top navigation bar.":::

## Sample applications, code, and snippets

The GitHub organization, [Azure-Samples](https://github.com/azure-samples/), contains many samples across the products and services offered by Azure. Use the [Azure Samples browser](/samples/browse/?languages=javascript%2Cnodejs%2Ctypescript) to find a sample to meet your needs. 

Other samples include: 

* Azure SDK for JS [samples](https://github.com/Azure/azure-sdk-for-js/tree/main/samples)
* Microsoft Authentication Library for JS (MSAL.js) [samples](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/samples)
* JavaScript end-to-end [samples](https://review.docs.microsoft.com/en-us/azure/developer/javascript/how-to/common-javascript-tasks?branch=master#samples-supporting-these-tasks) 

## Playwright

[Playwright](https://playwright.dev/) is a Node.js library to automate Chromium, Firefox, and WebKit with a single API. Playwright is built to enable cross-browser web automation that is ever-green, capable, reliable, and fast.

## Rush

[Rush](https://rushjs.io/) is a scalable monorepo manager for the web.

## Azure JavaScript developers Tips and tricks

The following list includes tips and tricks Azure developers should know to be more productive:

* Develop a **naming schema** for your Azure resources.
* Group Azure resources into **resource groups**, which also use a naming schema.
* For each Azure resource, add **tags** that communicate the resource's purpose, project, and other vital information. These tags are visible on the Azure portal, for that resource, on the Overview page. Think of the tags as a way to document the resource. 
* Most resources have at least one **free version** per subscription. Use this type of resource.
* Some resources provide **two keys**, connection strings, or other securing devices. There are two so that **two different developers** can work on the project without sharing the key or connection string. Rotate these keys when a developer leaves the project.
* The latest npm packages for Azure start with `@azure` scope. 
* Most Azure npm packages can use the [DefaultAzureCredential](./core/node-sdk-azure-authenticate.md#authentication-with-azure-services-while-developing). While the setup looks complicated, the benefit of no longer having to manage your local _and_ remote authentication to the Azure platform is great for security and time savings. 

## Next steps

* [Set up your development environment](core/configure-local-development-environment.md)