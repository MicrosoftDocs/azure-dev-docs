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
|**Local Machine**|**Not** in a container, dependencies are manually installed by you, and the project is run on your local machine.|You control all dependencies. You may already have some of the dependencies installed. You don't need Docker installed.|You have to manually install all dependencies.| Yes |
|**[DevContainer / VS Code Remote - Containers](https://code.visualstudio.com/docs/remote/containers)**|**Container** with all dependencies installed and run on your local machine.|Other than VS Code, Docker, and the Remote Containers VS Code extension, all dependencies are installed for you in the DevContainer.| You need to clone the repository. The container initialization can take a long time.| Yes |
|**[GitHub Codespaces](https://github.com/features/codespaces)** |**Container** with all dependencies installed and running on GitHub.com in the browser.|All dependencies are installed without cloning the code locally.| Run and debug that requires launching a web browser is currently not supported because of [known limitation with GitHub Codespaces](https://code.visualstudio.com/docs/remote/codespaces#_known-limitations-and-adaptations). | Yes |
|**[Cloud Shell](/azure/cloud-shell/overview)**|**Container** with all dependencies installed and run on a temporary host with the file system stored in an Azure Storage account.| All dependencies are installed for you. | The Azure Container Apps (ACA) templates will not deploy because [Cloud Shell does not support building Docker containers in the Cloud Shell session](/azure/cloud-shell/troubleshooting#you-cant-run-the-docker-daemon). CloudShell [may timeout during long deployments](/azure/cloud-shell/limitations#usage-limits), make sure the session does not become idle (this is a CloudShell limitation). Fewer developer features compared to a  typical development environment. | Yes |

## Supported Azure compute services (host)

Currently supported hosting platform for the app:

`azd` supports several services for hosting your app. Services marked as **alpha** are experimental and will need to be enabled manually with [`azd config`](./reference.md#azd-config). **beta** features may experience breaking changes. **stable** features are not expected to experience breaking changes. 

For more information about each feature stage, see [feature versioning and release strategy](./feature-versioning.md). For a list of all features and their stages, see [Alpha, Beta, and Stable Feature Stages](https://github.com/Azure/azure-dev/blob/main/cli/azd/docs/feature-stages.md).

| Azure compute service    | Feature Stage  |
| ------------------------ | -------------- |
| Azure App Service        | Stable         |
| Azure Static Web Apps    | Stable         |
| Azure Container Apps     | Beta           |
| Azure Functions          | Stable         |
| Azure Kubernetes Service | Beta (only for projects deployable via `kubectl apply -f`)    |
| Azure Spring Apps        | Alpha          |

## Supported programming languages

Currently supported/planned languages:

| Language | Feature Stage |
| -------- | -----------   |
| Node.js  | Stable        |
| Python   | Stable        |
| .NET     | Stable        |
| Java     | Stable        |

For more information about each feature stage, see [feature versioning and release strategy](./feature-versioning.md)

## Next Steps
- [Install the Azure Developer CLI](./install-azd.md).
- [Walk through the `azd` quickstart](./get-started.md) to see Azure Developer CLI in action.
  
