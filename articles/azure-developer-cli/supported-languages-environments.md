---
title: Supported languages and environments
description: Details about the Azure Developer CLI's template structure and supported development environments, hosts, and programming languages.
author: gkulin
ms.author: gracekulin
ms.date: 9/13/2024
ms.service: azure-dev-cli
ms.topic: article
ms.custom: devx-track-azdevcli
---

# Supported languages and environments

## Supported development environments

You can run any `azd` template, in one of the following supported development environments:

|Environment|Description|Pros|Cons|Feature Stage|
|---|---|---|---|---|
|**Local Machine via CLI**|**Not** in a container, dependencies are manually installed by you, and the project is run on your local machine.|You control all dependencies. You may already have some of the dependencies installed. You don't need Docker installed.|You have to manually install all dependencies.|Stable|
|**Visual Studio Code**| [Run and debug `azd` templates](/azure/developer/azure-developer-cli/debug?pivots=ide-vs-code) using the [Visual Studio Code extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.azure-dev). | You can work with `azd` using a code editor and extension system you may already be comfortable with. | Requires installing an extension. |Beta|
|**Visual Studio**| [Run and debug `azd` templates](/azure/developer/azure-developer-cli/debug?pivots=ide-vs) using [Visual Studio (preview)](https://visualstudio.microsoft.com/vs/preview/).  | You can work with `azd` using an IDE you may already be comfortable with. | Requires installing a separate preview version of Visual Studio. |Alpha|
|**[DevContainer / VS Code Remote - Containers](https://code.visualstudio.com/docs/remote/containers)**|**Container** with all dependencies installed and run on your local machine.|Other than VS Code, Docker, and the Remote Containers VS Code extension, all dependencies are installed for you in the DevContainer.| You need to clone the repository. The container initialization can take a long time.|Beta|
|**[GitHub Codespaces](https://github.com/features/codespaces)** |**Container** with all dependencies installed and running on GitHub.com in the browser.|All dependencies are installed without cloning the code locally.| Run and debug that requires launching a web browser is currently not supported because of [known limitation with GitHub Codespaces](https://code.visualstudio.com/docs/remote/codespaces#_known-limitations-and-adaptations). |Beta|

## Supported Azure compute services (host)

`azd` supports several services for hosting your app. Services marked as **alpha** are experimental and need to be enabled manually with [`azd config`](./reference.md#azd-config) to use them. **beta** features may experience breaking changes. **stable** features are not expected to experience breaking changes.

For more information about each feature stage, see [feature versioning and release strategy](./feature-versioning.md). For a list of all features and their stages, see [Alpha, Beta, and Stable Feature Stages](https://github.com/Azure/azure-dev/blob/main/cli/azd/docs/feature-stages.md).

| Azure compute service    | Feature Stage  |
| ------------------------ | -------------- |
| Azure App Service        | Stable         |
| Azure Static Web Apps    | Stable         |
| Azure Container Apps     | Beta           |
| Azure Functions          | Stable         |
| Azure Kubernetes Service | Beta (only for projects deployable via `kubectl apply -f`)    |
| Azure Spring Apps        | Beta           |

## Supported languages and frameworks

Currently supported languages and frameworks:

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
