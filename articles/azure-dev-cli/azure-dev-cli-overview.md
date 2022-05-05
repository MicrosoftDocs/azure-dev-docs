---
title: Use the Azure Developer CLI
description: Overview of the features and capabilities of the Azure Developer CLI that helps developers be more productive when building and deploying applications to Azure.
ms.date: 04/12/2021
ms.topic: conceptual
ms.custom: devx-track-azdev
ms.prod: azure
---
# What is the Azure Developer CLI

The Azure Developer CLI (**azure-dev**) is a developer-centric command-line interface (CLI) tool for cloud applications. `az dev` has several subcommands that allow developers to execute many actions (for example, manage developer workflows, cloud resources, interactions with continuous integration and delivery (CI/CD) system, etc.)

## Currently supported commands
Refer to [Azure Developer CLI Reference](azure-dev-cli-ref.md).

## Azure Dev-ified templates
[Azure dev enabled templates](azure-dev-cli-templates.md) (aka dev-ified templates) are end to end sample repositories created using the azure-dev conventions so that you can use `az dev cli` to easily get started with Azure. All templates have the same file structure:

```
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

TBA

## See also

TBA

