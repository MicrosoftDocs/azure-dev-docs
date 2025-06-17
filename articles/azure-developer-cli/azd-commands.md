---
title: Azure Developer CLI commands overview
description: This article provides a conceptual overview of key concepts for Azure Developer CLI commands
ms.topic: concept-article
ms.date: 01/15/2025
---

# Azure Developer CLI commands overview

The Azure Developer CLI (`azd`) is designed to streamline the end-to-end developer workflow on Azure. `azd` provides high-level commands that act as abstractions to simplify common developer tasks such as project initialization, infrastructure provisioning, code deployment, and monitoring. `azd` commands are available in the terminal, an integrated development environment (IDE), or through CI/CD (continuous integration/continuous deployment) pipelines. In this article, you'll learn about the following:

- Essential `azd` command concepts
- How `azd` commands compare to other tools
- The relationship between `azd` commands and templates
- Common `azd` commands and which development tasks they accelerate

> [!NOTE]
> Visit the [Deploy an Azure Developer CLI template](/azure/developer/azure-developer-cli/get-started) quickstart to explore a sample `azd` command workflow in more detail.

## Compare Azure Developer CLI commands

The emphasis on high-level development stages differentiates `azd` commands from other command-line tools such as the Azure CLI or Azure PowerShell. Whereas those tools provide numerous commands for granular control over individual Azure resources and configurations, `azd` provides fewer, broader commands to automate higher-level development tasks such as provisioning multiple resources or deploying multiple services at once.

The following table highlights the differences between a sample `azd` command and other Azure command-line tools. Note that the `azd provision` command performs numerous tasks at once, and does not have a direct equivalent in these other tools. Many Azure CLI or PowerShell commands would be required to accomplish the same task.

| Tool                | Sample Command                                                                 | Outcome                                                                                   |
|---------------------|------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------|
| Azure Developer CLI | `azd provision`                                                               | Provisions multiple Azure resources required for an app based on project resources and configurations, such as an Azure resource group, an Azure App Service web app and app service plan, an Azure Storage account, and an Azure Key Vault. |
| Azure CLI           | `az webapp create --resource-group myResourceGroup --plan myAppServicePlan --name myWebApp` | Provisions a new web app in the specified resource group and app service plan.            |
| Azure PowerShell    | `New-AzWebApp -ResourceGroupName "myResourceGroup" -Name "myWebApp" -AppServicePlan "myAppServicePlan"` | Provisions a new web app in the specified resource group and app service plan.            |

## Azure Developer CLI commands and templates

`azd` commands are able to perform broader workflow tasks due in-part to their integration with the `azd` template system. [Azure Developer CLI templates](/azure/developer/azure-developer-cli/azd-templates) are code projects that adhere to `azd` structural conventions and include sample application code, infrastructure files, and configuration files. Most `azd` templates include the following:

- **`.azure` folder** - Contains essential Azure configurations and environment variables, such as the location to deploy resources or other subscription information.
- **`infra` folder** - Contains all of the Bicep or Terraform infrastructure-as-code files for the `azd` template.
- **`src` folder** - Contains all of the deployable app source code.
- **`azure.yaml` file** - A configuration file that defines one or more services in your project and maps them to Azure resources defined in the `infra` folder for deployment.

:::image type="content" source="media/make-azd-compatible/azd-template-structure.png" alt-text="A screenshot showing an Azure Developer CLI template structure.":::

Without `azd` commands, these templates are just standard code repositories. Essentially, `azd` templates serve as foundational blueprints, while CLI commands act as the engine driving deployment, management, and monitoring of your applications. `azd` commands use the assets in these templates to perform various tasks.

Using the preceding template as an example:

- The `azd provision` command creates resources in Azure using the infrastructure-as-code files in the `infra` folder of a template.
- The `azd deploy` command deploys an app or service defined in the `src` folder.

> [!NOTE]
> `azd` can also create and manage some Azure resources without the need to define infrastructure-as-code templates manually using the new [`azd compose`](/azure/developer/azure-developer-cli/azd-compose) feature, which is currently in alpha.

## Explore common commands

The following sections provide an overview of some of the most common `azd` commands to provide examples of working with templates and different development tasks. 

> [!NOTE]
> For a complete list of `azd` commands and their parameters, visit the [Azure Developer CLI reference](/azure/developer/azure-developer-cli/reference) page.

### Initialize and run a template

- **`azd init`**: Initializes an existing `azd` template or creates and initializes a new template. This command essentially sets up the necessary files and directories to start working with `azd`.
- **`azd up`**: A convenience command to provision, package, and deploy all of your app resources in one command. This command is the equivalent of running `azd provision`, `azd package`, and `azd deploy` individually.

### Infrastructure Provisioning

- **`azd provision`**: Provisions the required Azure resources such as Azure Container App instances or Azure Storage accounts based on infrastructure-as-code templates or resources defined in `azure.yaml`.

### Code Deployment

- **`azd package`**: Packages the application's code to be deployed to Azure.
- **`azd deploy`**: Deploys your application code to the resources created by the `azd provision` command.

### Monitoring and Management

- **`azd monitor`**: Provides insights into the health and performance of the deployed application

### CI/CD Pipeline Configuration

- **`azd pipeline config`**: Configures a CI/CD pipeline for the project. This command sets up continuous integration and continuous deployment pipelines to automate the build and deployment processes.

### Environment Management

- **`azd env list`**: Lists all the different environments (e.g., development, staging, production) that have been set up for the template.
- **`azd env new`**: Creates a new environment with its own configuration and resources, allowing you to manage multiple environments for different stages of development.

### Resource Cleanup

- **`azd down`**: Deletes the Azure resources created by the template to clean up your environment and avoid unnecessary costs.

## Next steps

> [!div class="nextstepaction"]
> [What are Azure Developer CLI templates?](./azd-templates.md)
