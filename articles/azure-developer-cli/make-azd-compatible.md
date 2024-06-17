---
title: Make your project compatible with Azure Developer CLI
description: How to convert an app to an Azure developer enabled template.
author: alexwolfmsft
ms.author: alexwolf
ms.date: 12/05/2022
ms.service: azure-dev-cli
ms.topic: how-to
ms.custom: devx-track-azdevcli, devx-track-bicep, build-2023
---

# Make your project compatible with Azure Developer CLI

Azure Developer CLI (`azd`) enables developers to scaffold their applications for the cloud using [templates](./azd-templates.md) hosted on GitHub. Microsoft provides [several templates](./azd-templates.md#start-with-an-existing-template) to get you started. In this article, you learn how to make your own application `azd` compatible.

## Understand the template architecture

The following diagram gives a quick overview of the process to create an `azd` template:

:::image type="content" source="media/make-azd-compatible/workflow.png" alt-text="Diagram of Azure Developer CLI template workflow.":::

All `azd` templates have the same file structure, based on `azd` conventions. The following hierarchy shows the directory structure you'll build in this tutorial. 

```txt
├── .azdo                                        [ Configures an Azure Pipeline ]
├── .devcontainer                                [ For DevContainer ]
├── .github                                      [ Configures a GitHub workflow ]
├── .vscode                                      [ VS Code workspace configurations ]
├── .azure                                       [ Stores Azure configurations and environment variables ]
├── infra                                        [ Contains infrastructure as code files ]
│   ├── main.bicep/main.tf                       [ Main infrastructure file ]
│   ├── main.parameters.json/main.tfvars.json    [ Parameters file ]
│   └── core/modules                             [ Contains reusable Bicep/Terraform modules ]
└── azure.yaml                                   [ Describes the app and type of Azure resources]
```

## Initialize the template

The `azd init` command is used to initialize your application for provisioning and deploying the app resources on Azure. This command prompts you to choose between two different workflows to initialize a template that are outlined in the following sections.

* **Use code in the current directory**: Select this option to instruct `azd` to analyze the code in your directory to identity which technologies it uses, such as the programming language, framework and database system. `azd` will then automatically generate template assets for you, such as the `azure.yaml` service definition file and the `infra` folder with infrastructure-as-code files.

* **Select a template**: Select this option to use an existing template as a starting point. By default, `azd` allows you to browse templates from the [Awesome AZD](https://azure.github.io/awesome-azd) gallery, but you can also configure your own template galleries. When you select a template, the assets of that template will be added to your existing project directory.

The details of each of these workflows are outlined in the sections below.

# [Use code in directory](#tab/use-code)

[!INCLUDE [convert-azd-use-code](includes/convert-azd-use-code.md)]

# [Use a template](#tab/use-template)

[!INCLUDE [convert-azd-use-template](includes/convert-azd-use-template.md)]

---

## Configure the CI/CD pipeline

If your template includes support for GitHub Actions or Azure Pipelines, you can configure a CI/CD pipeline using the following steps:

1. Run the following command to push updates to the repository. The GitHub Actions workflow is triggered because of the update.

    ```bash
    azd pipeline config    
    ```

1. Using your browser, go to the GitHub repository for your project.

1. Select **Actions** to see the workflow running.

## Clean up resources

When you no longer need the resources created in this article, run the following command:

``` azdeveloper
azd down
```

## See also

- [Create Bicep files with Visual Studio Code](/azure/azure-resource-manager/bicep/quickstart-create-bicep-use-visual-studio-code?tabs=CLI) for an introduction to working with Bicep files.
- [Bicep Samples](/samples/browse/?languages=bicep)
- [How to decompile Azure Resource Manager templates (ARM templates) to Bicep](/azure/azure-resource-manager/bicep/decompile?tabs=azure-cli)
- [Azure Developer CLI's azure.yaml schema](./azd-schema.md)

[!INCLUDE [request-help](includes/request-help.md)]

## Next steps

> [!div class="nextstepaction"]
> [Azure Developer CLI FAQ](./faq.yml)
