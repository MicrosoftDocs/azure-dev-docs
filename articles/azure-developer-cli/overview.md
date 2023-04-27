---
title: What is the Azure Developer CLI (preview)?
description: Overview of the features and capabilities of the Azure Developer CLI that helps developers be more productive when building and deploying apps to Azure.
author: alexwolfmsft
ms.author: alexwolf
ms.date: 10/21/2022
ms.service: azure-dev-cli
ms.topic: conceptual
ms.custom: devx-track-azdevcli, devx-track-azurecli
---

# What is the Azure Developer CLI (preview)?

Azure Developer CLI (`azd`) is an open-source tool that accelerates the time it takes for you to get started on Azure. The CLI provides best practice, developer-friendly commands that map to key stages in your workflow, whether you’re working in the terminal, your editor or integrated development environment (IDE), or DevOps.

You can use `azd` with [extensible azd templates](#azure-developer-cli-templates) that include everything you need to get an application up and running in Azure. These templates include reusable infrastructure as code assets and application code that can be ripped out and replaced with your own app code.

## Typical `azd` workflow

Once you've [installed Azure Developer CLI](./install-azd.md), you can get your app onto Azure in just a few steps.

1. Select an [Azure Developer CLI template](./azd-templates.md#choose-a-template).
2. Get the code and initialize the project by [running `azd init`](./get-started.md)
3. Deploy the template by [running `azd up`](./get-started.md).
4. Customize the app to meet your needs.

From there, you can pull out or modify the application code to leverage the infrastructure as code assets (IaC) provided in the template and customize the app to fit your needs.

## Introductory video

> [!VIDEO https://www.youtube.com/embed/VTk-FhJyo7s]

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

## Next steps

- Get started by [installing Azure Developer CLI](./install-azd.md).
- [Walk through our quickstart](./get-started.md) to see Azure Developer CLI in action.
