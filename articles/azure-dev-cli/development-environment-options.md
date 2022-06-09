---
title: Azure Developer CLI (azd) supported environments and Azure services
description: Learn the different environment choices for Azure Developer CLI
author: puicchan
ms.author: puichan
ms.date: 06/09/2022
ms.topic: conceptual
ms.custom: devx-track-azdevcli
ms.prod: azure
---

# Azure Developer CLI supported environments and Azure services

In this article, you'll learn what development environment choices, Azure compute services, and programming languages are supported (or planned) with Azure Developer CLI (azd).

In this article, you'll:

> [!div class="checklist"]

> * See the list of azd development environment options
> * See the list of supported and planned Azure compute services
> * See the list of supported and planned programming languages

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

## Next steps

> [!div class="nextstepaction"] 
> [Azure Developer CLI (azd) templates](azure-dev-cli-templates.md)
