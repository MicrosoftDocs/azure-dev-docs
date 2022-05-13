---
title: Use the Azure Developer CLI
description: Overview of the features and capabilities of the Azure Developer CLI that helps developers be more productive when building and deploying applications to Azure.
author: puicchan
ms.author: puichan
ms.date: 04/12/2021
ms.topic: conceptual
ms.custom: devx-track-azdev
ms.prod: azure
---
# What is the Azure Developer CLI

The Azure Developer CLI (**azd**) is a developer-centric command-line tool for cloud applications. `azd` has subcommands that allow developers to execute actions for setting up the entire end to end engineering system. You can use `azd` to manage developer workflows and cloud resources; configure continuous integration and delivery (CI/CD); and monitor cloud resources and application health.

The Azure Developer CLI is designed to:
- reduce the time required for a developer to be productive
- demonstrate opinionated best practices for Azure development
- help developers understand core Azure development constructs

## Introductory video

Watch this 3-min video to get a high level overview of `azd`:

!["Introductory video"](media/azure-dev-cli-overview/video.png)

## Azure Developer CLI enabled templates
[Azure Developer CLI enabled templates](azure-dev-cli-templates.md) are sample repositories created using the Azure Developer CLI conventions so that you can use `azd` to easily get started with Azure. 

All templates have the same file structure:

```txt
├── .devcontainer              [ For DevContainer ]
├── .github                    [ Configure GitHub workflow ]
├── .vscode                    [ VS Code workspace ]
├── assets                     [ Assets used by README.MD ]
├── infra                      [ Creates and configures Azure resources ]
│   ├── main.bicep             [ Main infrastructure file ]
│   ├── main.parameters.json   [ Parameters file ]
│   └── resources.bicep        [ Resources file ]
├── src                        [ Contains folder(s) for the application code ]
└── azure.yaml                 [ Describes the application and type of Azure resources]
```

## Try out

* Explore the list of [Azure Developer CLI enabled templates](azure-dev-cli-templates.md) and follow the README in the repository to get started.
* [Understand your developer environment options](get-started.md) and get started with the developer environment of choice: 
    * [DevContainer](get-started-devcontainer.md)
    * [bare metal setup](get-started-bare-metal.md)
    * [Windows Subsystem for Linux](get-started-with-wsl.md)
* Learn how to [Azure Developer CLI enable your own project](how-to-devify-a-project.md) so that you can use `azd` as part of your engineering workflows.

## See also

- For full list of supported commands, see [Azure Developer CLI Reference](https://github.com/Azure/azure-dev-pr/wiki/Azure-Developer-CLI-Overview).
- For currently supported host and languages, see [langue and host (Azure compute service) list](azure-dev-cli-lang-and-service-list.md)

