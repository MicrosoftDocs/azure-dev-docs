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

Azure Developer CLI (`azd`) is an open-source tool that accelerates the process of building cloud apps on Azure. The CLI provides best practice, developer-friendly commands that map to key stages in your workflow, whether you’re working in the terminal, your editor or integrated development environment (IDE), or DevOps.

You can use the `azd` with [extensible azd templates](#azure-developer-cli-templates) that include everything you need to get an application up and running in Azure. These templates include application code, and reusable infrastructure as code assets.

The new `azd` builds upon the experience and foundations of the [Azure CLI](#azure-developer-cli-vs-azure-cli). You can use both tools together, as needed, to support your Azure workflow.

## Typical `azd` workflow

Once you've [installed Azure Developer CLI](./install-azd.md), the following steps are the typical workflow to using `azd`:

1. Select an [Azure Developer CLI template](./azd-templates.md#choose-a-template).
1. Get the code and initialize the project by [running `azd init`](./get-started.md)
1. Deploy the template by [running `azd up`](./get-started.md).
1. Customize the app to meet your needs.

## Introductory video

> [!VIDEO https://www.youtube.com/embed/VTk-FhJyo7s]

## Azure Developer CLI templates

The Azure Developer CLI works alongside [idiomatic application templates](./azd-templates.md) that include the scaffolding for monitoring and CI/CD for your application. We provide `azd` templates in four supported languages. Each template uses best practices and includes:

- Application code
- Infra-as-code files (Bicep or Terraform) needed to provision the Azure resources
- An `azure.yaml` file that describes your application.

[Learn more about the `azd` templates we provide and which template you should select.](./azd-templates.md#choose-a-template)

## Azure Developer CLI vs Azure CLI

[Azure Developer CLI (azd)](./index.yml) and [Azure CLI](/cli/azure/what-is-azure-cli) are both command-line tools.

However, they help you do different tasks.

The `azd` focuses on the developer workflow. Apart from provisioning/managing Azure resources, the CLI helps to stitch cloud components, local development configuration, and pipeline automation together into a complete solution.

Azure CLI is a control plane tool for creating and administering Azure infrastructure such as virtual machines, virtual networks, and storage.

## Supported development environments

You can run any `azd` template, in one of the following supported development environments:

|Environment|Description|Pros|Cons|Supported?|
|---|---|---|---|---|
|**Bare Metal**|**Not** in a container, dependencies are manually installed by you, and the project is run on your local machine.|You control all dependencies. You may already have some of the dependencies installed. You don't need Docker installed.|You have to manually install all dependencies.| Yes |
|**[DevContainer / VS Code Remote - Containers](https://code.visualstudio.com/docs/remote/containers)**|**Container** with all dependencies installed and run on your local machine.|Other than VS Code, Docker, and the Remote Containers VS Code extension, all dependencies are installed for you in the DevContainer.| You need to clone the repository. The container initialization can take a long time.| Yes |
|**[GitHub Codespaces](https://github.com/features/codespaces)** |**Container** with all dependencies installed and running on GitHub.com in the browser.|All dependencies are installed without cloning the code locally.| Run and debug that requires launching a web browser is currently not supported because of [known limitation with GitHub Codespaces](https://code.visualstudio.com/docs/remote/codespaces#_known-limitations-and-adaptations). | Yes |

## Supported Azure compute services (host)

Currently supported hosting platform for the app:

`azd` supports several services for hosting your app. Services marked as **alpha** are experimental and will need to be enabled manually with [`azd config`](./reference#azd-config). **beta** features may experience breaking changes. **stable** features are not expected to experience breaking changes. 

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

## Next steps

- Get started by [installing Azure Developer CLI](./install-azd.md).
- [Walk through our quickstart](./get-started.md) to see Azure Developer CLI in action.
