---
title: What is the Azure Developer CLI (preview)?
description: Overview of the features and capabilities of the Azure Developer CLI that helps developers be more productive when building and deploying apps to Azure.
author: hhunter-ms
ms.author: hannahhunter
ms.date: 08/05/2022
ms.service: azure-dev-cli
ms.topic: conceptual
ms.custom: devx-track-azdevcli
---

# What is the Azure Developer CLI (preview)?

As a developer building, deploying, and securing your application, some questions you might ask are:

- Which cloud services should I use with my code?
- Which libraries do I need to use?
- How should I set up my local development environment?
- How do I provision the necessary infrastructure for my application?
- How do I know that what I’m doing incorporates security best practices?

Azure Developer CLI (`azd`) is an open-source tool that accelerates the process of building cloud apps on Azure. The CLI provides best practice, developer-friendly commands that map to key stages in your workflow: code, build, deploy, monitor, repeat.

With the Azure Developer CLI, you can work consistently across `azd` templates, DevOps workflows, and your integrated development environment (IDE). These [extensible templates](#azure-developer-cli-templates) include everything you need to get your application up and running in Azure.

## Azure Developer CLI vs Azure CLI

[Azure Developer CLI (azd)](./index.yml) and [Azure CLI](/cli/azure/what-is-azure-cli) are both command-line tools that help you perform different tasks.

**Azure Developer CLI** focuses on **the developer workflow**. Apart from provisioning/managing Azure resources, the CLI helps to stitch cloud components, local development configuration, and pipeline automation together into a complete solution.

**Azure CLI** is a control plane tool for creating and administering Azure infrastructure, such as virtual machines, virtual networks, and storage.

[Learn more about the differences between Azure Developer CLI and Azure CLI.](./azd-vs-azure-cli.md)

## Recommended `azd` workflow

The following steps are the recommended workflow to using `azd`:

:::image type="content" source="media/overview/workflow.png" alt-text="Diagram of the Azure Developer CLI workflow.":::

1. [Install Azure Developer CLI](./install-azd.md).
1. Select an [Azure Developer CLI template](./azd-templates.md#choose-a-template).
1. Get the code and deploy the template by [running `azd up`](./run-azd.md).
1. Customize the app to meet your needs.

## Azure Developer CLI templates

The Azure Developer CLI uses [idiomatic application templates](./azd-templates.md) that include the scaffolding for monitoring and CI/CD for your application. We provide `azd` templates in three supported languages. Each template includes:

- Best practices
- Application code
- Infra-as-code files (written in Bicep) needed to provision the Azure resources
- An `azure.yaml` file that describes your application.

Each template repository we provide contains a complete sample ToDo app with:

- A web frontend built in React.js
- A backend API built using a specific `azd` supported language

[Learn more about the `azd` templates we provide and which template you should select.](./azd-templates.md#choose-a-template)

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
- Walk through one of the quickstarts to see Azure Developer CLI in action:
  - [Node.js](./get-started-nodejs.md)
  - [Python](./get-started-python.md)
  - [C#](./get-started-csharp.md)