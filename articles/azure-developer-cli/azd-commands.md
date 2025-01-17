---
title: Understanding Azure Developer CLI Commands
description: This article provides an in-depth conceptual overview of Azure Developer CLI commands, explores commonly used commands, and explains their relationship with Azure Developer CLI templates.
ms.topic: conceptual
ms.date: 01/15/2025
---

# Explore Azure Developer CLI commands overview

Azure Developer CLI (`azd`) commands are a set of tools designed to simplify and streamline the development, deployment, and management of applications on Azure. These commands provide developers with a powerful and flexible way to interact with Azure services directly from the command line, enabling automation and integration into various development workflows. In this article you'll learn about the following:

- Key concepts about `azd` commands
- How `azd` commands and templates are related
- Commonly used `azd` commands

## What are Azure Developer CLI commands?

The Azure Developer CLI provides a set of commands such as `azd up` and `azd init` that leverage the `azd` template system and perform other tasks. Conceptually, Azure Developer CLI commands are designed to abstract away the complexities of managing Azure resources and services. They streamline the end-to-end developer workflow and provide high-level commands that map to common developer tasks or workflow stages.

This emphasis on high level development stages differentiates `azd` commands from other tools such as the Azure CLI or Azure PowerShell. Whereas those tools offer commands that focus on granular control over Azure resources and specific configurations, `azd` commands automate broader development tasks such as provisioning an entire set of services at once, or deploying an entire app. `azd` commands are able to perform these broader tasks due to their integration with the `azd` template system, which is covered in the next section. THe following table highlights the differences between `azd` commands and similar Azure command line tools:

| Tool                | Sample Command                                                                 | Outcome                                                                                   |
|---------------------|------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------|
| Azure CLI           | `az webapp create --resource-group myResourceGroup --plan myAppServicePlan --name myWebApp` | Provisions a new web app in the specified resource group and app service plan.            |
| Azure PowerShell    | `New-AzWebApp -ResourceGroupName "myResourceGroup" -Name "myWebApp" -AppServicePlan "myAppServicePlan"` | Provisions a new web app in the specified resource group and app service plan.            |
| Azure Developer CLI | `azd provision`                                                               | Provisions the necessary Azure infrastructure, including a web app, based on the project configuration. |

`azd` aims to enhance the developer experience by reducing the complexity of managing Azure resources. It abstracts away many of the low-level details, allowing developers to focus more on creating and deploying app features rather than managing infrastructure.

## The relationship between Azure Developer CLI commands and templates

[Azure Developer CLI templates](/azure/developer/azure-developer-cli/azd-templates) are code projects that adhere to structural `azd` conventions and include sample application code, infrastructure files, as well as `azd` configuration files. Most `azd` templates include the following:

- **`infra` folder** - Contains all of the Bicep or Terraform infrastructure as code files for the `azd` template.
- **`azure.yaml` file** - A configuration file that defines one or more services in your project and maps them to Azure resources defined in the `infra` folder for deployment. 
- **`.azure` folder** - Contains essential Azure configurations and environment variables, such as the location to deploy resources or other subscription information.
- **`src` folder** - Contains all of the deployable app source code.

:::image type="content" source="media/make-azd-compatible/azd-template-structure.png" alt-text="A screenshot showing an Azure Developer CLI template structure.":::

Without `azd` commands, these templates are just standard code repositories. In essence, Azure Developer CLI templates serve as foundational blueprints, while CLI commands act as the engine driving deployment, management, and monitoring of your applications. For example, `azd` commands leverage the conventional structure of these templates to perform actions and handle the following concerns:

- **Project Initialization**: `azd init` sets up a new or existing project with a predefined structure and configuration.
- **Infrastructure Provisioning**: `azd up` or `azd provision` uses infrastructure-as-code templates in the `infra` folder to automate the creation of Azure resources.
- **Code Deployment**: `azd up` or `azd deploy` handle the deployment of application code in the `src` folder (configurable) to the provisioned infrastructure.
- **Pipeline configuration**: `azd pipelie config` uses workflow configuration files in the `.github` or `.ado` folders to create a CI/CD pipeline for your app via GitHub Actions or Azure Pipelines with a single command.
- **Monitoring and Management**: `azd monitor` assists with monitoring the health and performance of the deployed application by hooking into Azure monitoring features.

## Commonly used commands

`azd` commands provide a wide variety of features and functionality. Visit the [Azure Developer CLI commands](/azure/developer/azure-developer-cli/reference) reference page for a complete list of `azd` commands, parameters and their functionality. Some of the most commonly used commands include:

- **`azd init`**: Initializes a new Azure Developer CLI project with a predefined structure and configuration. This command sets up the necessary files and directories to start a new project.
- **`azd up`**: Provisions the necessary Azure resources and deploys the application in one step. This command combines the provisioning and deployment processes to quickly get your application running on Azure.
- **`azd provision`**: Provisions the required Azure infrastructure based on infrastructure-as-code templates. This command creates the necessary Azure resources such as VMs, databases, and storage accounts.
- **`azd deploy`**: Deploys the application code to the provisioned Azure infrastructure. This command handles the deployment of your application code to the resources created by the `azd provision` command.
- **`azd monitor`**: Monitors the health and performance of the deployed application. This command provides insights into the application's performance and helps identify any issues.
- **`azd pipeline config`**: Configures a CI/CD pipeline for the project. This command sets up continuous integration and continuous deployment pipelines to automate the build and deployment processes.
- **`azd down`**: De-provisions the Azure resources created by the project. This command removes the Azure resources that were provisioned, helping to clean up and avoid unnecessary costs.
- **`azd env list`**: Lists all the environments for the project. This command shows all the different environments (e.g., development, staging, production) that have been set up for the project.
- **`azd env new`**: Creates a new environment for the project. This command sets up a new environment with its own configuration and resources, allowing you to manage multiple environments for different stages of development.
- **`azd config list`**: Lists the configuration settings for the project. This command shows all the configuration settings that have been applied to the project.
- **`azd config set`**: Sets a configuration setting for the project. This command allows you to update or add a new configuration setting.
- **`azd config get`**: Gets the value of a configuration setting for the project. This command retrieves the current value of a specific configuration setting.

## Next steps

> [!div class="nextstepaction"]
> [What are Azure Developer CLI templates?](./azd-templates.md)
