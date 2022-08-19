---
title: What is the Azure Developer CLI (preview)?
description: Overview of the features and capabilities of the Azure Developer CLI that helps developers be more productive when building and deploying apps to Azure.
author: hhunter-ms
ms.author: hannahhunter
ms.date: 08/19/2022
ms.service: azure-dev-cli
ms.topic: conceptual
ms.custom: devx-track-azdevcli
---

# What is the Azure Developer CLI (preview)?

Azure Developer CLI (`azd`) is an open-source tool that accelerates the process of building cloud apps on Azure. The CLI provides best practice, developer-friendly commands that map to key stages in your workflow: code, build, deploy, monitor. 

`azd` commands remain consistent regardless of context, whether you’re working in the terminal, your editor or integrated development environment (IDE), or your DevOps workflows.

Azure Developer CLI relies on [extensible azd templates](#azure-developer-cli-templates) that include everything you need to get an application up and running in Azure. These templates include application code, and reusable infrastructure as code assets.

## Typical `azd` workflow

Once you've [installed Azure Developer CLI](./install-azd.md), the following steps are the typical workflow to using `azd`:

:::image type="content" source="media/overview/workflow.png" alt-text="Diagram of the Azure Developer CLI workflow.":::

1. Select an [Azure Developer CLI template](./azd-templates.md#choose-a-template).
1. Get the code and deploy the template by [running `azd up`](./get-started.md).
1. Customize the app to meet your needs.

## Azure Developer CLI templates

The Azure Developer CLI relies on [idiomatic application templates](./azd-templates.md) that include the scaffolding for monitoring and CI/CD for your application. We provide `azd` templates in three supported languages. Each template uses best practices and includes:

- Application code
- Infra-as-code files (written in Bicep) needed to provision the Azure resources
- An `azure.yaml` file that describes your application.

[Learn more about the `azd` templates we provide and which template you should select.](./azd-templates.md#choose-a-template)

## Azure Developer CLI vs Azure CLI

`azd` builds upon the experience and foundations of the [Azure CLI](/cli/azure/what-is-azure-cli). You can use both tools together, as needed, to support your Azure workflow.

## Supported development environments

You can run any `azd` template, in one of the following supported development environments:

|Environment|Description|Pros|Cons|Supported?|
|---|---|---|---|---|
|**Bare Metal**|**Not** in a container, dependencies are manually installed by you, and the project is run on your local machine.|You control all dependencies. You may already have some of the dependencies installed. You don't need Docker installed.|You have to manually install all dependencies.| Yes |
|**[DevContainer / VS Code Remote - Containers](https://code.visualstudio.com/docs/remote/containers)**|**Container** with all dependencies installed and run on your local machine.|Other than VS Code, Docker, and the Remote Containers VS Code extension, all dependencies are installed for you in the DevContainer.| You need to clone the repository. The container initialization can take a long time.| Yes |
|**[GitHub Codespaces](https://github.com/features/codespaces)** |**Container** with all dependencies installed and run on GitHub.com in the browser.|All dependencies installed and you don't need to clone the code locally.| Some features and functionality may not be supported. The container initialization can take a long time.| Coming soon |

## Supported Azure compute services (host)

Currently supported/planned hosting platform for the app:

| Azure compute service    | Supported?     |
| ------------------------ | -------------- |
| Azure App Service        | Yes            |
| Function                 | Yes            |
| Azure Container Apps     | Yes            |
| Azure Static Web Apps    | Yes            |
| Azure Kubernetes Service | Coming soon    |

## Supported programming languages

Currently supported/planned languages:

| Language | Supported?  |
| -------- | ----------- |
| Node.js  | Yes         |
| Python   | Yes         |
| .NET     | Yes         |
| Java     | Coming soon |

## Next steps

- Get started by [installing Azure Developer CLI](./install-azd.md).
- [Walk through our quickstart](./get-started.md) to see Azure Developer CLI in action.