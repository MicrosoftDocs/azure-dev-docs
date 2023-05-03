---
title: Supported languages and environments
description: Details about the Azure Developer CLI's template structure and supported development environments, hosts, and programming languages.
author: gkulin
ms.author: gracekulin
ms.date: 4/27/2023
ms.service: azure-dev-cli
ms.topic: conceptual
ms.custom: devx-track-azdevcli, devx-track-azurecli
---

# Supported languages and environments

## Supported development environments

You can run any `azd` template, in one of the following supported development environments:

|Environment|Description|Pros|Cons|Supported?|
|---|---|---|---|---|
|**Bare Metal**|**Not** in a container, dependencies are manually installed by you, and the project is run on your local machine.|You control all dependencies. You may already have some of the dependencies installed. You don't need Docker installed.|You have to manually install all dependencies.| Yes |
|**[DevContainer / VS Code Remote - Containers](https://code.visualstudio.com/docs/remote/containers)**|**Container** with all dependencies installed and run on your local machine.|Other than VS Code, Docker, and the Remote Containers VS Code extension, all dependencies are installed for you in the DevContainer.| You need to clone the repository. The container initialization can take a long time.| Yes |
|**[GitHub Codespaces](https://github.com/features/codespaces)** |**Container** with all dependencies installed and running on GitHub.com in the browser.|All dependencies are installed without cloning the code locally.| Run and debug that requires launching a web browser is currently not supported because of [known limitation with GitHub Codespaces](https://code.visualstudio.com/docs/remote/codespaces#_known-limitations-and-adaptations). | Yes |

## Supported Azure compute services (host)

Currently supported/planned hosting platform for the app:

| Azure compute service    | Supported?     |
| ------------------------ | -------------- |
| Azure App Service        | Yes            |
| Function                 | Yes            |
| Azure Container Apps     | Yes            |
| Azure Static Web Apps    | Yes            |
| Azure Kubernetes Service | Preview (only for projects deployable via `kubectl apply -f`)    |

## Supported programming languages

Currently supported/planned languages:

| Language | Supported?  |
| -------- | ----------- |
| Node.js  | Yes         |
| Python   | Yes         |
| .NET     | Yes         |
| Java     | Yes         |

## Next Steps
- Get started by [installing Azure Developer CLI](./install-azd.md).
- [Walk through our quickstart](./get-started.md) to see Azure Developer CLI in action.
  