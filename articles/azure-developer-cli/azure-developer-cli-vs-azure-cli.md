---
title: Azure Developer CLI vs Azure CLI Overview
description: Understand the differences between the Azure Developer CLI and the Azure CLI
author: alexwolfmsft
ms.author: alexwolf
ms.date: 04/10/2025
ms.service: azure-dev-cli
ms.topic: concept-article
ms.custom: devx-track-azdevcli
---

# Azure Developer CLI vs Azure CLI overview

Azure provides multiple command-line tools to help users interact with cloud services. Two of the most commonly used tools are the [Azure Developer CLI](/azure/developer/azure-developer-cli/overview) and the [Azure CLI](/cli/azure/what-is-azure-cli). While both options enable users to manage and deploy resources on Azure, they're designed for different audiences and use cases. The following sections provide an overview of each tool, highlight their differences, and offer comparisons to help you select the best tool for different situations.

## What is the Azure Developer CLI?

The Azure Developer CLI (`azd`) is a developer-focused command-line tool designed to streamline the process of building, provisioning, deploying, and managing full-stack apps on Azure. Key features include:

- High-level commands oriented around app lifecycle stages, such as provisioning and deployment
- A template system to define infrastructure as code and deployment configurations for your app
- Automated provisioning and deployment of app resources
- Built-in CI/CD pipeline setup for GitHub Actions or Azure Pipelines
- Galleries of starter app templates for common app architectures

## What is the Azure CLI?

The Azure CLI (`az`) is a general-purpose command-line interface for managing Azure resources. It provides a comprehensive set of commands to create, configure, delete, and monitor resources programmatically or interactively. Key features include:

- Granular administrative control over Azure resources
- Support for scripting and task automation
- Integration with a wide range of Azure services and tools
- Resource management across many tenants, subscriptions, and environments

## How are the tools different?

While both the Azure Developer CLI and Azure CLI provide command-line interfaces for Azure, they serve different purposes and audiences:

- **Azure Developer CLI**: Focuses on simplifying the developer experience by providing an opinionated workflow for building and deploying applications. It abstracts much of the complexity of resource management and is tailored for application-centric tasks.
- **Azure CLI**: Offers granular control over Azure resources and is designed for a broader audience, including IT administrators, DevOps engineers, and developers. It provides flexibility for managing individual resources but requires knowledge of specific Azure services.

### Compare commands

You can print the available commands for both CLI tools to visualize these differences. For example, run the Azure Developer CLI command `azd help` to view information about the tool and available commands:

```output
Usage
  azd [command]

Commands
  Configure and develop your app
    auth        : Authenticate with Azure.
    config      : Manage azd configurations (ex: default Azure subscription, location).
    hooks       : Develop, test and run hooks for an application. (Beta)
    init        : Initialize a new application.
    restore     : Restores the application's dependencies. (Beta)
    template    : Find and view template details. (Beta)

  Manage Azure resources and app deployments
    deploy      : Deploy the application's code to Azure.
    down        : Delete Azure resources for an application.
    env         : Manage environments.
    package     : Packages the application's code to be deployed to Azure. (Beta)
    provision   : Provision the Azure resources for an application.
    up          : Provision Azure resources, and deploy your project with a single command.

  Monitor, test and release your app
    monitor     : Monitor a deployed application. (Beta)
    pipeline    : Manage and configure your deployment pipelines. (Beta)
    show        : Display information about your app and its resources.
```

The commands in the preceding output map to high level development workflow concerns, such as managing app deployments, app configuration, and monitoring.

However, if you run the `az help` command for the Azure CLI, you see output that resembles the following output:

```output
Group
    az

Subgroups:
    account                       : Manage Azure subscription information.
    acr                           : Manage private registries with Azure Container Registries.
    ad                            : Manage Microsoft Entra ID (formerly known as Azure Active
                                    Directory, Azure AD, AAD) entities needed for Azure role-based
                                    access control (Azure RBAC) through Microsoft Graph API.
    advisor                       : Manage Azure Advisor.
    afd                           : Manage Azure Front Door Standard/Premium.
    aks                           : Manage Azure Kubernetes Services.
    ams                           : Manage Azure Media Services resources.
    apim                          : Manage Azure API Management services.
    appconfig                     : Manage App Configurations.
    appservice                    : Manage App Service plans.
    aro                           : Manage Azure Red Hat OpenShift clusters.
    backup                        : Manage Azure Backups.
    batch                         : Manage Azure Batch.
    bicep                         : Bicep CLI command group.
    billing                       : Manage Azure Billing.
    bot                           : Manage Microsoft Azure Bot Service.
    cache                         : Commands to manage CLI objects cached using the `--defer`
    
    (omitted for brevity...)
```

In the preceding output, all of the commands focus on managing configurations for specific Azure resources, such as Azure Container Registries or Azure Billing services.

### Compare features

The following table highlights the key differences between the Azure Developer CLI and the Azure CLI in more detail:

| Functionality         | Azure Developer CLI (`azd`)                   | Azure CLI (`az`)                                    |
|-------------------------|---------------------------------------------------------|----------------------------------------------------|
| **Primary audience**   | Developers focused on building cloud-native apps       | Developers, IT admins, and DevOps engineers        |
| **Primary use case**    | End-to-end app lifecycle management        | Azure resource administration & management  |
| **Type of tasks**       | Provisioning and deploying app resources, CI/CD pipeline setup  | Resource administration and scripting |
| **Command behavior**    | Opinionated, high-level commands for common workflows   | Flexible, low-level commands for granular control  |
| **Template support**     | Includes predefined templates for common architectures | No templates; requires manual resource configuration |
| **IaC support** | Native support for IaC tools like Bicep and Terraform | Requires separate IaC setup and integration        |
| **CI/CD Integration**   | Automates pipeline setup for GitHub Actions or Azure Pipelines | No built-in CI/CD automation                       |

### Compare use cases

Choosing the right tool depends on your specific needs and the tasks you want to accomplish. Below are examples of scenarios where each tool excels to help you decide which one to use for your workflow.

#### When to Use the Azure Developer CLI

The Azure Developer CLI is best suited for scenarios where you need to manage the end-to-end workflow for application development and deployment. Example use cases include:

- Packaging, provisioning and deploying full-stack cloud-native apps in a portable, repeatable way
- Quickly provisioning sample app architectures using predefined templates for rapid prototyping
- Setting up CI/CD pipelines for GitHub Actions or Azure Pipelines with minimal effort

#### When to Use the Azure CLI

The Azure CLI is ideal for scenarios that require granular control over individual Azure resources or advanced scripting capabilities. Example use cases include:

- Creating, configuring, or deleting Azure resources
- Automating resource management using custom scripts
- Monitoring and troubleshooting Azure resources
- Integrating resource management into broader DevOps workflows

By understanding these use cases, you can determine which tool is better suited for your specific needs or use both tools in combination to maximize efficiency.

## Conclusion

The Azure Developer CLI and Azure CLI are complementary tools designed for different audiences and use cases. The Azure Developer CLI simplifies app packaging, provisioning, and deployment for developers, while the Azure CLI provides granular control for administrative tasks. Depending on your role and requirements, you can use one or both tools to achieve your goals on Azure.
