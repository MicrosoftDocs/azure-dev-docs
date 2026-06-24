---
title: Supported languages and environments
description: Details about the Azure Developer CLI's template structure and supported development environments, hosts, and programming languages.
author: alexwolfmsft
ms.author: alexwolf
ms.date: 06/24/2026
ms.service: azure-dev-cli
ms.topic: concept-article
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

| Azure compute service | Feature Stage |
| --- | --- |
| Azure App Service | Stable |
| Azure Static Web Apps | Stable |
| Azure Container Apps (including Container App Jobs) | Stable |
| Azure Functions | Stable |
| Azure Kubernetes Service | Beta (only for projects deployable via `kubectl apply -f`) |

## Supported languages and frameworks

Currently supported languages and frameworks:

| Language | Feature Stage |
| -------- | -----------   |
| Node.js  | Stable        |
| Python   | Stable        |
| .NET     | Stable        |
| Java     | Stable        |
| Go       | Preview (Azure Functions only) |

For more information about each feature stage, see [feature versioning and release strategy](./feature-versioning.md)

### Go on Azure Functions (Preview)

`azd` supports deploying Go apps to [Azure Functions](/azure/azure-functions/) on the [Flex Consumption](/azure/azure-functions/flex-consumption-plan) plan. This support builds on the [Azure Functions Go worker](https://github.com/Azure/azure-functions-golang-worker), which is currently in public preview.

To use Go with `azd`, set the service `language` to `go` and the `host` to `function` in your *azure.yaml* file:

```yaml
services:
  api:
    project: .
    host: function
    language: go
```

Keep the following points in mind when targeting Azure Functions with Go:

- Go requires version **1.24 or later**.
- The function app is compiled locally into a static binary and packaged for deployment. [Remote build](./remote-builds.md) (Oryx) isn't supported for Go function apps, so don't set `remoteBuild: true`.
- You define functions directly in Go code by using the worker's options API (for example, `app.HTTP(...)`); you don't need *function.json* files.

For end-to-end samples - including HTTP, timer, queue, blob, Cosmos DB, and other triggers - see the [samples directory](https://github.com/Azure/azure-functions-golang-worker/tree/main/samples) in the Azure Functions Go worker repository.

## Next Steps
- [Install the Azure Developer CLI](./install-azd.md).
- [Walk through the `azd` quickstart](./get-started.md) to see Azure Developer CLI in action.
