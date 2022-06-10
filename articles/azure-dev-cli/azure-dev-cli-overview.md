---
title: What is the Azure Developer CLI?
description: Overview of the features and capabilities of the Azure Developer CLI that helps developers be more productive when building and deploying applications to Azure.
author: puicchan
ms.author: puichan
ms.date: 06/09/2022
ms.topic: conceptual
ms.custom: devx-track-azdevcli
ms.prod: azure
---

# What is the Azure Developer CLI?

The Azure Developer CLI (azd) is a developer-centric command-line tool for building cloud applications. The azd is a set of commands that allows you to work consistently across azd templates, DevOps workflows, and your IDE (intergrated development environment).

[Watch a 2-min introductory video](https://msit.microsoftstream.com/video/9e850840-98dc-b654-ecea-f1ecd7ca302a?referrer=https:%2F%2Fstatics.teams.cdn.office.net%2F).

## Recommended azd workflow

The following steps are the recommended workflow to using azd:

1. Select an [Azure Developer CLI template](#list-of-azd-templates).
1. Get the code and deploy the sample by running `azd up`.
1. Customize the app to meet your needs.

The following image shows a graphical representation of the suggested workflow:

![The standard azd workflow](media/azure-dev-cli-overview/azd-dev-workflow.png)

## Azure Developer CLI templates

**Azure Developer CLI templates** are sample repositories created using the Azure Developer CLI conventions so that you can use `azd`. Each template includes application code, tools, infrstructure code, and configure continuous integration and delivery (CI/CD) pipelines that serve as a foundation from which you can build upon and customize to create your own solutions.

The quickest way to get started with azd is to refer to the README in an Azure Developer CLI enabled template. 

This list is grouped by supported language. Each repository contains a complete sample ToDo application with a web frontend built in React.js and the backend API built using a specific azd supported language. 

### [Node.js](#tab/nodejs)

| Template      | App host | Tech Stack	 | 
| ----------- | ----------| ----------- | 
| [ToDo NodeJs Mongo](https://github.com/azure-samples/todo-nodejs-mongo) | [Azure App Service](/azure/app-service/) | Azure Cosmos DB API for Mongo, Azure Monitor |  
| [ToDo NodeJs Mongo ACA](https://github.com/azure-samples/todo-nodejs-mongo-aca) | [Azure Container Apps](/azure/container-apps/overview) | Azure Cosmos DB API for Mongo, Azure Monitor |


### [Python](#tab/python)

| Template      | App host | Tech Stack	 | 
| ----------- | ----------| ----------- | 
| [ToDo Python Mongo](https://github.com/azure-samples/todo-python-mongo) | [Azure App Service](/azure/app-service/) | Azure Cosmos DB API for Mongo, Azure Monitor  |  
| [ToDo Python Mongo ACA](https://github.com/azure-samples/todo-python-mongo-aca) | [Azure Container Apps](/azure/container-apps/overview) |  Azure Cosmos DB API for Mongo, Azure Monitor |  

### [C#](#tab/csharp)

| Template      | App host | Tech Stack	 | 
| ----------- | ----------| ----------- | 
| [Todo C# Cosmo DB (SQL)](https://github.com/Azure-Samples/todo-csharp-cosmos-sql) | [Azure App Service](/azure/app-service/) | Azure Cosmos DB SQL API, Azure Monitor | 

---

## Azure Developer CLI vs Azure CLI

[Azure Developer CLI (azd)](/azure/developer/az-dev-cli) and [Azure CLI](/cli/azure/what-is-azure-cli) are both command-line tools.

However, they help you do different tasks.

The azd focuses on the developer workflow. Apart from provisioning/managing Azure resources, the CLI helps to stitch cloud components, local development configuration and pipeline automation together into a complete solution. 

Azure CLI is a control plane tool for creating and administering Azure infrastructure such as virtual machines, virtual networks, and storage.

## Supported development environments

To run any sample template, the first thing you need to do decide is where you want your development environment to be hosted.

|Environment|Description|Pros|Cons|Supported?|
|---|---|---|---|---|
|**Bare Metal**|**Not** in a container, dependencies are manually installed by you, and the project is run on your local machine.|You control all dependencies. You may already have some of the dependencies installed. You don't need Docker installed.|You have to manually install all dependencies.| Yes |
|**[DevContainer / VS Code Remote - Containers](https://code.visualstudio.com/docs/remote/containers)**|Container with all dependencies installed and run on your local machine.|Other than VS Code, Docker, and the Remote Containers VS Code extension, all dependencies are installed for you in the DevContainer.| You need to clone the repository. The container initialization can take a long time.| Coming soon |
|**[GitHub Codespaces](https://github.com/features/codespaces)** |Container with all dependencies installed and run on GitHub.com in the browser.|All dependencies installed and you don't need to clone the code locally.| Some features and functionality may not be supported. The container initialization can take a long time.| Coming soon |

## Supported Azure compute services (host)

Currently supported/planned hosting platform for the application:

| Azure compute service      | Supported? |
| ----------- | ----------- |
| Azure App Service | Yes  |
| Function  | Yes |
| Azure Container Apps    | Yes |
| Azure Static Web Apps  | Coming soon |
| Azure Kubernetes Service | Coming soon |

## Supported programming languages

Currently supported/planned languages:

| Language      | Supported? |
| ----------- | ----------- |
| Node.js | Yes  |
| Python    | Yes |
| .NET | Yes |
| Java | Coming soon |

## Next steps

> [!div class="nextstepaction"] 
> [Get started using Azure Developer CLI (azd)](get-started.md)
