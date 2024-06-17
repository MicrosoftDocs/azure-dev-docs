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

The Azure Developer CLI (`azd`) is designed around a [template system](azd-templates.md) to provision and deploy app resources to the cloud. Developers add support for `azd` commands and features by converting their applications to templates. In this article, you explore the different options for building `azd` templates.

> [!NOTE]
> This article assumes a general understanding of `azd` templates. Visit the [template overview](azd-templates) doc for more information about templates.

## Template creation concepts

Creating an `azd` template requires adding specific configuration and infrastructure assets to your existing code base, or starting a new app with those same assets. All `azd` templates share the a similar file structure based around `azd` conventions. The following diagram gives a quick overview of the process to create an `azd` template:

:::image type="content" source="media/make-azd-compatible/workflow.png" alt-text="Diagram of Azure Developer CLI template workflow.":::

Every `azd` template requires the following minimum resources:

- An `infra` folder that holds the infrastructure as code (Bicep or Terraform) files.
- An `azure.yaml` configuration file that maps your application services to the provisioned infrastructure resources.

Other optional directories are often included as well, such as a `.github` folder with assets to create a CI/CD pipeline. Visit the [template overview](azd-templates) doc for more information about templates.

Consider the following sample app repository:

:::image type="content" source="media/make-azd-compatible/sample-app-structure.png" alt-text="A screenshot showing the structure of the sample app.":::

After converting this sample app to an `azd` template, the same app resembles the following:

:::image type="content" source="media/make-azd-compatible/azd-template-structure-complete.png" alt-text="A screenshot showing the completed structure of the azd template.":::

The original app resources are unchanged, but new assets were added that `azd` depends on for commands such as `azd up`:

- An `infra` folder was added that includes Bicep files to create Azure resources.
- An `azure.yaml` configuration file was added to map the app code in the `src` directory to the provision Azure resources.
- An `.azure` folder was created to hold `azd` environment variables.
- A `.github` folder (optional) was added to support CI/CD through GitHub actions.

## Template creation workflows

There are two primary workflows to create an `azd` template. The `azd init` command is used to initialize your application for provisioning and deploying the app resources on Azure. This command prompts you to choose between two different workflows to initialize a template that are outlined in the following sections.

### Use code in the current directory

This option instructs `azd` to analyze the code in your directory to identity which technologies it uses, such as the programming language, framework and database system. `azd` automatically generates template assets for you, such as the `azure.yaml` service definition file and the `infra` folder with infrastructure-as-code files. The generated assets are a starting point for additional modifications.

Visit the [Use your app code to create a template]() tutorial for details on how to implement this approach.

### Use an existing template

Select this option to use an existing template as a starting point. By default, `azd` allows you to browse templates from the Awesome AZD gallery, but you can also configure your own template galleries. When you select a template, the assets of that template will be added to your existing project directory to use as a starting point. Some starter templates include sample app code that you can replace with your own, while some are infrastructure only.  You may need to replace the source code directory with your own.

You can also use the `azd init` command to pull down an existing template to an empty directory and use it as a starting point for your own app. If the template includes app source code, you can either build off of that code or replace the source code directory with your own.

Visit the [Use an existing template]() tutorial for details on how to implement this approach.

## See also

- [Create Bicep files with Visual Studio Code](/azure/azure-resource-manager/bicep/quickstart-create-bicep-use-visual-studio-code?tabs=CLI) for an introduction to working with Bicep files.
- [Bicep Samples](/samples/browse/?languages=bicep)
- [How to decompile Azure Resource Manager templates (ARM templates) to Bicep](/azure/azure-resource-manager/bicep/decompile?tabs=azure-cli)
- [Azure Developer CLI's azure.yaml schema](./azd-schema.md)

[!INCLUDE [request-help](includes/request-help.md)]

## Next steps

> [!div class="nextstepaction"]
> [Azure Developer CLI FAQ](./faq.yml)
