---
title: Azure Developer CLI commands overview
description: This article provides a conceptual overview of key concepts for Azure Developer CLI commands
ms.topic: conceptual
ms.date: 01/15/2025
---

# Azure Developer CLI commands overview

The Azure Developer CLI provides a set of commands such as and `azd provision` and `azd deploy` that map to common development workflow stages and streamline tasks such as provisioning, deployment, pipeline configuration, and management of applications on Azure. Some commands are also used to manage `azd` configurations and environment settings.

> [!NOTE]
> Explore a simple `azd` command workflow in more detail using the [Deploy an Azure Developer CLI template](/azure/developer/azure-developer-cli/get-started) quickstart.

Most `azd` commands also accept parameters you can use to customize their behavior. Visit the [Azure Developer CLI commands](/azure/developer/azure-developer-cli/reference) reference page for a complete list of `azd` commands, parameters and their functionality.

## Compare Azure Developer CLI commands to other tools

The emphasis on high-level development stages is what differentiates `azd` commands from other command-line tools such as the Azure CLI or Azure PowerShell. Whereas those tools provide numerous commands that focus on granular control over individual Azure resources and configurations, `azd` provides fewer, broader commands to automate development tasks such as provisioning an entire set of resources or deploying multiple services at once.

The following table highlights the differences between a sample `azd` command and other Azure command-line tools. Note that the `azd provision` command performs numerous tasks at once and does not have a direct equivalent in these other tools. Many Azure CLI or PowerShell commands would be required to accomplish the same task.

| Tool                | Sample Command                                                                 | Outcome                                                                                   |
|---------------------|------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------|
| Azure CLI           | `az webapp create --resource-group myResourceGroup --plan myAppServicePlan --name myWebApp` | Provisions a new web app in the specified resource group and app service plan.            |
| Azure PowerShell    | `New-AzWebApp -ResourceGroupName "myResourceGroup" -Name "myWebApp" -AppServicePlan "myAppServicePlan"` | Provisions a new web app in the specified resource group and app service plan.            |
| Azure Developer CLI | `azd provision`                                                               | Provisions multiple Azure resources required for an app based on project resources and configurations, such as an Azure resource group, an Azure App Service web app and app service plan, an Azure Storage account, and an Azure Key Vault. |

## The relationship between commands and templates

`azd` commands are able to perform broader workflow tasks due in-part to their integration with the `azd` template system. [Azure Developer CLI templates](/azure/developer/azure-developer-cli/azd-templates) are code projects that adhere to `azd` structural conventions and include sample application code, infrastructure files, and configuration files. Most `azd` templates include the following:

- **`.azure` folder** - Contains essential Azure configurations and environment variables, such as the location to deploy resources or other subscription information.
- **`infra` folder** - Contains all of the Bicep or Terraform infrastructure-as-code files for the `azd` template.
- **`src` folder** - Contains all of the deployable app source code.
- **`azure.yaml` file** - A configuration file that defines one or more services in your project and maps them to Azure resources defined in the `infra` folder for deployment.

:::image type="content" source="media/make-azd-compatible/azd-template-structure.png" alt-text="A screenshot showing an Azure Developer CLI template structure.":::

Without `azd` commands, these templates are just standard code repositories. Essentially, `azd` templates serve as foundational blueprints, while CLI commands act as the engine driving deployment, management, and monitoring of your applications:

- **Template Initialization**: `azd init` sets up a new or existing template with a predefined structure and configuration.
- **Infrastructure Provisioning**: `azd up` or `azd provision` uses infrastructure-as-code templates in the `infra` folder to automate the creation of Azure resources.
- **Code Deployment**: `azd up` or `azd deploy` handle the deployment of application code in the `src` folder (configurable) to the provisioned infrastructure.
- **Pipeline configuration**: `azd pipelie config` uses workflow configuration files in the `.github` or `.ado` folders to create a CI/CD pipeline for your app via GitHub Actions or Azure Pipelines with a single command.
- **Monitoring and Management**: `azd monitor` assists with monitoring the health and performance of the deployed application by hooking into Azure monitoring features.

> [!NOTE]
> `azd` can also create and manage some Azure resources without the need to define infrastructure-as-code templates manually using the new [`azd compose`](/azure/developer/azure-developer-cli/azd-compose) feature, which is currently in alpha.

## Next steps

> [!div class="nextstepaction"]
> [What are Azure Developer CLI templates?](./azd-templates.md)
