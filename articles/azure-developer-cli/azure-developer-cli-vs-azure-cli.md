---
title: Azure Developer CLI vs Azure CLI Overview
description: Understand the differences between the Azure Developer CLI and the Azure CLI
author: alexwolfmsft
ms.author: alexwolf
ms.date: 04/10/2025
ms.service: azure-dev-cli
ms.topic: conceptual
ms.custom: devx-track-azdevcli
---

# Azure Developer CLI vs Azure CLI overview

Azure provides multiple command-line tools to help users interact with cloud services. Two of the most commonly used tools are the [Azure Developer CLI](/azure/developer/azure-developer-cli/overview) and the [Azure CLI (`az`)](/cli/azure/what-is-azure-cli). While both options enable users to manage and deploy resources on Azure, they are designed for different audiences and use cases. The following sections provide an overview of each tool, highlight their differences, and offer comparisons to help you select the best tool for different situations.

## What is the Azure Developer CLI?

The Azure Developer CLI (`azd`) is a developer-focused command-line tool designed to streamline the process of building, provisioning, deploying, and managing full-stack apps on Azure. Key features of the Azure Developer CLI include:

- Simplified commands oriented around app lifecycle stages, such as provisioning and deployment
- A template system to define infrastructure as code and deployment configurations for your app
- Automated provisioning and deployment of app resources
- Built-in CI/CD pipeline setup for GitHub Actions or Azure Pipelines
- Galleries of starter app templates for common app architectures

## What is the Azure CLI?

The Azure CLI (`az`) is a general-purpose command-line interface for managing Azure resources. It provides a comprehensive set of commands to create, configure, delete, and monitor resources programmatically or interactively.

Key features of the Azure CLI include:

- Granular administrative control over Azure resources
- Support for scripting and task automation
- Integration with a wide range of Azure services and tools
- Manage resources across many tenants, subscriptions and environments

## How are the tools different?

While both the Azure Developer CLI and Azure CLI provide command-line interfaces for Azure, they serve different purposes and audiences:

- **Azure Developer CLI**: Focuses on simplifying the developer experience by providing an opinionated workflow for building and deploying applications. It abstracts much of the complexity of resource management and is tailored for application-centric tasks.
- **Azure CLI**: Offers granular control over Azure resources and is designed for a broader audience, including IT administrators, DevOps engineers, and developers. It provides flexibility for managing individual resources but requires knowledge of specific Azure services.

The following table highlights the key differences between the Azure Developer CLI and the Azure CLI in more detail:

| Functionality         | Azure Developer CLI (`azd`)                              | Azure CLI (`az`)                                    |
|-------------------------|---------------------------------------------------------|----------------------------------------------------|
| **Primary audience**   | Developers focused on building cloud-native apps       | Developers, IT admins, and DevOps engineers        |
| **Primary use case**    | End-to-end app lifecycle management        | Azure resource administration & management  |
| **Type of tasks**       | Provisioning and deploying app resources, CI/CD pipeline setup  | Resource administration and scripting |
| **Command behavior**    | Opinionated, high-level commands for common workflows   | Flexible, low-level commands for granular control  |
| **Template support**     | Includes predefined templates for common architectures | No templates; requires manual resource configuration |
| **IaC support** | Native support for IaC tools like Bicep and Terraform | Requires separate IaC setup and integration        |
| **CI/CD Integration**   | Automates pipeline setup for GitHub Actions or Azure DevOps | No built-in CI/CD automation                       |

### When to Use the Azure Developer CLI

The Azure Developer CLI is best suited for scenarios where you need to manage the end-to-end workflow for application development and deployment. Example use cases include:

- Packaging, provisioning and deploying full-stack cloud-native apps in a portable, repeatable way
- Quickly provisioning sample app architectures using predefined templates for rapid prototyping
- Setting up CI/CD pipelines for GitHub Actions or Azure Pipelines with minimal effort

### When to Use the Azure CLI

The Azure CLI is ideal for scenarios that require granular control over individual Azure resources or advanced scripting capabilities. Example use cases include:

- Creating, configuring, or deleting Azure resources
- Automating resource management using custom scripts
- Monitoring and troubleshooting Azure resources
- Integrating resource management into broader DevOps workflows

By understanding these use cases, you can determine which tool is better suited for your specific needs or use both tools in combination to maximize efficiency.

## Conclusion

The Azure Developer CLI and Azure CLI are complementary tools designed for different audiences and use cases. The Azure Developer CLI simplifies app packaging, provisioning and deployment for developers, while the Azure CLI provides granular control for administrative tasks and managing resources. Depending on your role and requirements, you may use one or both tools to achieve your goals on Azure.
