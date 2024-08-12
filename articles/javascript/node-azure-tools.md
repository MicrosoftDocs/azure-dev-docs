---
title: Tool selection - JavaScript - Azure
description: Install individual tools for Node.js and JavaScript development on Azure
ms.topic: how-to
ms.date: 08/12/2024
ms.custom: devx-track-js, devx-track-azurecli, linux-related-content, devx-track-ts
---

# Tools for JavaScript developers on Azure 

JavaScript is an ecosystem of many tools. This article is a selection of tools built and maintained by Microsoft for JavaScript developers. You don't need to use these tools to use Azure, it just makes the experience better, both in functionality and support. 

## Azure portal

The [Azure portal](https://portal.azure.com/) gives you access to all subscriptions and resources for your account. 

## Visual Studio Code

[Visual Studio Code](https://code.visualstudio.com) is the preferred IDE for JavaScript development for Azure. The interface, features, and extensions work together to shorten development time and reduce development frustration. 

Create a project workspace at the root of your local development project then add all relevant configurations, settings, and extensions. Check in the workspace file with the project so every team member has access to the settings and tools they need for the project.

You get several benefits using Visual Studio Code:

* Visual Studio Code displays the Azure reference documentation inline
* Visual Studio Code provides statement completion
* Few ambiguous types or objects

Visual Studio Code provides of wealth of documentation for [JavaScript project use](https://code.visualstudio.com/docs/nodejs/working-with-javascript). 

<a name="visual-studio-code-extensions"></a>

## Tools for Azure services

Use the following free extensions to use Azure services directly in Visual Studio Code.

|Service| Tools| Description  |
|:---------:|:---------:|---------|
|Top services|[Visual Studio Code extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack)|A collection of extensions. Get all the top Azure services in this one extension from Microsoft.|
|Azure Resource Group|[Visual Studio Code extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azureresourcegroups)<br><br>[Azure CLI](/cli/azure/group)|View and manage Azure resources.<br><br>Tutorial: [Deploy Express.js MongoDB app to App Service from Visual Studio Code](/azure/app-service/tutorial-nodejs-mongodb-app?tabs=azure-portal%2Cterminal-bash%2Cvscode-deploy%2Cdeploy-instructions-azportal%2Cdeploy-zip-linux-mac%2Cdeploy-instructions--zip-azcli)<br>Tutorial: [Add Cognitive Search to a website](/azure/search/tutorial-javascript-overview)|
|Azure Static web apps|[Visual Studio Code extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurestaticwebapps)<br><br>[SWA CLI](/azure/static-web-apps/static-web-apps-cli-overview) |Create and manage Azure Static Web Apps using the VS Code extension or the Static Web Apps CLI (SWA CLI). The VS Code extension integrates with the editor, while the SWA CLI simulates Azure services locally.|
|Azure Functions| [Visual Studio Code extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions "Link to Azure Functions extension")<br><br>[Azure CLI](/cli/azure/functionapp)<br><br>[npm package](https://github.com/Azure/azure-functions-core-tools)| Create, manage, view, debug, and deploy functions<br><br>Quickstart: [Create a JavaScript function in Azure using Visual Studio Code](/azure/azure-functions/create-first-function-vs-code-node)|
|Azure Container Apps|[Visual Studio Code extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurecontainerapps)<br><br>[Azure CLI containerapp](/cli/azure/containerapp)| Azure Container Apps allows you to run microservices and containerized applications on a serverless platform. Manage your container apps, deploy new versions, and monitor performance. <br><br> Quickstart: [Create a container app in Azure](/azure/container-apps/quickstart-create-container-app)<br><br>Quickstart: [Deploy a container app using the Azure CLI](/azure/container-apps/quickstart-deploy-container-app-cli)
|Azure Cosmos DB| [Visual Studio Code Extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-cosmosdb "Link to Azure Cosmos DB extension" )<br><br>[Azure CLI](/cli/azure/service-page/azure%20cosmos%20db)| Create, browse, and update globally distributed, multi-model databases in Azure.<br><br>Quickstart: [Connect Azure Functions to Azure Cosmos DB using Visual Studio Code](/azure/azure-functions/functions-add-output-binding-cosmos-db-vs-code?pivots=programming-language-javascript)|
|Storage|[Visual Studio Code extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurestorage)<br><br>[Azure CLI](/cli/azure/service-page/azure%20storage)<br><br>[Storage Emulator - Azurite](https://github.com/Azure/Azurite)|Azure Storage including Blob Containers, File Shares, Tables, and Queues<br><br>Quickstart: [Connect Azure Functions to Azure Storage using Visual Studio Code](/azure/azure-functions/functions-add-output-binding-storage-queue-vs-code?pivots=programming-language-javascript)|

To see all Azure extensions, use this link:

* [All Azure extensions](https://marketplace.visualstudio.com/search?term=azure&target=VSCode&category=All%20categories&sortBy=Relevance)

## TypeScript

[TypeScript](https://www.typescriptlang.org/download) offers all of JavaScript's features, and provides a strong but flexible type system. 

## TypeScript and the Azure SDK client libraries

Azure SDK client library reference documentation is written for TypeScript because the client libraries are written with TypeScript. You don't have to use TypeScript to use the Azure SDK client libraries. 

Learn more about the [TypeScript guidelines for Azure SDK](https://azure.github.io/azure-sdk/typescript_introduction.html).

## Deployment

The premier deployment tool for Azure is [**Azure Development CLI**](/azure/developer/azure-developer-cli/). This tool allows you to create and configure your Azure services with [Bicep](/azure/azure-resource-manager/bicep/) or [Terraform](/azure/developer/terraform/overview), then deploy your source code. 

Use [Awesome AZD](https://azure.github.io/awesome-azd/) to find deployable samples to understand the end-to-end solutions for Azure. 

## Continuous integration and testing (CICD) tools

The following integration tools for building and deployment increase your pipeline productivity.

* [Git](https://git-scm.com/downloads) or [Git for Windows](https://gitforwindows.org/)
* [GitHub Actions](https://github.com/marketplace?type=actions&query=azure) 
* [Azure Pipelines](https://marketplace.visualstudio.com/search?term=azure&target=AzureDevOps&category=Azure%20Pipelines&certified=microsoft&sortBy=Relevance) integration

## Containers

If you're looking for a Microsoft or Azure-specific Docker image, use the [Microsoft Container Registry](https://github.com/microsoft/containerregistry) (MRC) to [query for an image](https://mcr.microsoft.com/v2/_catalog). 

### Tools for containers

* [Docker](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-docker)
* [Remote - Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
* [Remote - SSH](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-ssh)

### Tools for Development containers

* [Development containers](https://containers.dev/)
* [Dev containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) 

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
* JavaScript end-to-end [samples](./core/use-azure-sdk.md) 

## Playwright

[Playwright](https://playwright.dev/) is a Node.js library to automate Chromium, Firefox, and WebKit with a single API. Playwright is built to enable cross-browser web automation that is ever-green, capable, reliable, and fast.

## Rush

[Rush](https://rushjs.io/) is a scalable monorepo manager for the web.

## Windows Terminal

[Windows Terminal](https://github.com/microsoft/terminal) allows you to access several different terminal types from the same Windows application including the Azure CLI and Ubuntu. Use this tool to develop and test CICD bash scripts before using those scripts in GitHub Actions or another pipeline.

## Windows Subsystem for Linux

The [Windows Subsystem for Linux](/windows/wsl/) lets developers run a GNU/Linux environment, including most command-line tools, utilities, and applications, directly on Windows, unmodified, without the overhead of a traditional virtual machine or dual-boot setup.

## Azure JavaScript developers Tips and tricks

The following list includes tips and tricks Azure developers should know to be more productive:

* Develop a **naming schema** for your Azure resources.
* Group Azure resources into **resource groups**, which also use a naming schema.
* For each Azure resource, add **tags** that communicate the resource's purpose, project, and other vital information. These tags are visible on the Azure portal, for that resource, on the Overview page. Think of the tags as a way to document the resource. 
* Most resources have at least one **free version** per subscription. Use this type of resource while learning how to use it.
* For "secure by default" solutions, learn how to [create resources without connection strings or passwords](/azure/developer/intro/passwordless-overview). This security allows you to use the same code in all environments, without having to manage connection strings or rotate keys. 
* The latest npm packages for Azure start with `@azure` scope. 
* Most Azure npm packages can use the [DefaultAzureCredential](/javascript/api/overview/azure/identity-readme#defaultazurecredential). While the setup looks complicated, the benefit of no longer having to manage your local _and_ remote authentication to the Azure platform is great for security and time savings. 
* All Azure JavaScript SDKs include TypeScript types. This functionality allows you to adopt strong types for your solutions easily and know they won't become out of sync with the SDK. 

## Next steps

* [Set up your development environment](core/configure-local-development-environment.md)
