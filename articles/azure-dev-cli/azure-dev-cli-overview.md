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

The azd offers the following features:

- Reduces the time required for a developer to be productive.
- Helps developers quickly onboard and understand core Azure development constructs.
- Demonstrates opinionated best practices for Azure development.

The following 2-minute video presents a high level overview of azd:

<a href="https://msit.microsoftstream.com/video/9e850840-98dc-b654-ecea-f1ecd7ca302a?referrer=https:%2F%2Fstatics.teams.cdn.office.net%2F"><img src="media/azure-dev-cli-overview/video.png" alt="Click to watch video"></a>

## Recommended azd workflow

The following steps are the recommended workflow to using azd:

1. Select an [Azure Developer CLI template](azure-dev-cli-templates.md).
1. Download (clone) the sample by running `azd up`.
1. Customize the cloned template to meet your needs.

The following image shows a graphical representation of the suggested workflow:

![The standard azd workflow](media/azure-dev-cli-overview/azd-dev-workflow.png)

## azd templates

The [azd templates](azure-dev-cli-templates.md) are sample repositories created using azd conventions. Each template includes the application code, tools, infrastructure code, and CI/CD pipelines that serve as a foundation. Once you download (clone) a template, you can customize the code to create your own solutions. In addition, you can use azd subcommands to manage cloud resources, configure CI/CD, and monitor application health.

## Azure Developer CLI vs Azure CLI

[Azure Developer CLI (azd)](/azure/developer/az-dev-cli) and [Azure CLI](/cli/azure/what-is-azure-cli) are both command-line tools.

However, they help you do different tasks.

The azd is a tool for developers to quickly clone apps (stored on GitHub as templates) that use Azure services. This local clone can then be configured on your GitHub account and customized to meet your needs.

Azure CLI is a control plane tool for creating Azure infrastructure such as virtual machines, virtual networks, and storage.

## Development environment options

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

## Azure Developer CLI (azd) templates

The quickest way to get started with Azure Developer CLI (azd) is to refer to the README in an Azure Developer CLI enabled template. This article lists all the templates grouped by Azure service. If you're using azd, select the template you want to use and reference it in the [Clone your first app](get-started.md) article.

### Host: Azure App Service

Each repository contains a complete sample ToDo application with a web frontend built in React.js and the backend API built using a specific azd supported language. Both frontend and backend applications are deployed to [Azure App Service](/azure/app-service/).

| Template      | Language (API layer) | Tech Stack	 | 
| ----------- | ----------| ----------- | 
| [ToDo NodeJs Mongo](https://github.com/azure-samples/todo-nodejs-mongo) | Node.js | Azure Cosmos DB API for Mongo, Azure Monitor |  
| [ToDo Python Mongo](https://github.com/azure-samples/todo-python-mongo) | Python (FastAPI) | Azure Cosmos DB API for Mongo, Azure Monitor  |  
| [ToDo C# Cosmo DB (SQL)](https://github.com/Azure-Samples/todo-csharp-cosmos-sql) | C# | Azure Cosmos DB SQL API, Azure Monitor | 

### Host: Azure Container Apps

Each repository contains a complete sample ToDo application with a web frontend built in React.js and the backend API built using a specific azd supported language. Both frontend and backend applications are deployed to [Azure Container Apps](/azure/container-apps/overview).

| Template      | Language (API layer) | Tech Stack	 | 
| ----------- | ----------| ----------- | 
| [ToDo NodeJs Mongo ACA](https://github.com/azure-samples/todo-nodejs-mongo-aca) | Node.js | Azure Cosmos DB API for Mongo, Azure Monitor |
| [ToDo Python Mongo ACA](https://github.com/azure-samples/todo-python-mongo-aca) | Python (FastAPI)|  Azure Cosmos DB API for Mongo, Azure Monitor |  

### Picking the right host

A template can deploy to two or more supported hosts. Today, each azd template is built for specific host (Azure compute service.) If you haven't finalized the Azure compute service for hosting your application, the following flowchart can help to choose the right sample to use as a base for your project:

!["Host Decision Tree"](media/azure-dev-cli-templates/host-decision-tree.png)

> [!NOTE]
> The perfect solution is dependent on your use case and team. You can refer to these additional recommended resources for guidance: [Choose an Azure compute service](/azure/architecture/guide/technology-choices/compute-decision-tree) and [Comparing Container Apps with other Azure container options](/azure/container-apps/compare-options).

## Next steps

> [!div class="nextstepaction"] 
> [Get started using Azure Developer CLI (azd)](get-started.md)
