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

Azure provides multiple command-line tools to help users interact with cloud services. Two of the most commonly used tools are the Azure Developer CLI (`azd`) and the Azure CLI (`az`). While both tools enable users to manage and deploy resources on Azure, they are designed for different audiences and use cases. The following sections provides an overview of each tool, highlights their differences, and offers comparisons to help you select the right tool for different situations.

## What is the Azure Developer CLI?

The Azure Developer CLI (`azd`) is a developer-centric command-line interface designed to streamline the process of building, provisioning, deploying, and managing full-stack application resources on Azure. It provides opinionated workflows that integrate application templates, infrastructure provisioning, and CI/CD pipeline configurations.

Key features of the Azure Developer CLI include:

- Simplified commands oriented around end-to-end application lifecycle management
- Automated provisioning and deployment of app resources
- A template system that lets you include provisioning and deployment configurations and resources in your app repository
- Galleries of predefined templates for common application architectures
- Built-in support for CI/CD pipeline configuration

## What is the Azure CLI?

The Azure CLI (`az`) is a general-purpose command-line interface for managing Azure resources. It provides a comprehensive set of commands to create, configure, delete, and monitor resources programmatically or interactively.

Key features of the Azure CLI include:

- Fine-grained administrative control over one or more Azure resources
- Support for scripting and automation of specific Azure tasks
- Integration with a wide range of Azure services and tools
- Flexibility to manage resources across multiple subscriptions and environments

## How are they different?

While both tools are command-line interfaces for Azure, they serve different purposes and audiences:

- **Azure Developer CLI**: Focuses on simplifying the developer experience by providing an opinionated workflow for building and deploying applications. It abstracts much of the complexity of resource management and is tailored for application-centric tasks.
- **Azure CLI**: Offers granular control over Azure resources and is designed for a broader audience, including IT administrators, DevOps engineers, and developers. It provides flexibility for managing individual resources but requires knowledge of specific Azure services.

The following table highlights the key differences between the Azure Developer CLI and the Azure CLI:

| Functionality         | Azure Developer CLI (`azd`)                              | Azure CLI (`az`)                                    |
|-------------------------|---------------------------------------------------------|----------------------------------------------------|
| **Primary audience**   | Developers building cloud native applications       | Developers, IT admins, and DevOps engineers        |
| **Primary use case**    | End-to-end, "code to cloud" app lifecycle management        | Azure resource administration & management  |
| **Type of tasks**       | Provisioning and deploying app resources, setting up CI/CD pipelines  | Resource administration and scripting |
| **Command behavior**    | Opinionated, high-level commands for common workflows   | Flexible, low-level commands for granular control  |
| **Template support**     | Includes predefined templates for common architectures | No templates; requires manual resource configuration |
| **IaC support** | Built-in support for IaC tools like Bicep and Terraform | Requires separate IaC setup and integration        |
| **CI/CD Integration**   | Automates pipeline setup for GitHub Actions or Azure DevOps | No built-in CI/CD automation                       |

### When to Use the Azure Developer CLI (`azd`)

The Azure Developer CLI is best suited for scenarios where you need a streamlined, end-to-end workflow for application development and deployment. Example use cases include:

- Packaging, provisioning and deploying full-stack cloud-native applications in a portable, repeatable way
- Quickly provisioning starter or sample app architectures using predefined templates
- Setting up CI/CD pipelines with minimal configuration

### When to Use the Azure CLI (`az`)

The Azure CLI is ideal for scenarios that require granular control over individual Azure resources or advanced scripting capabilities. Example use cases include:

- Creating, updating, or deleting specific Azure resources
- Automating resource management tasks using custom scripts
- Monitoring and troubleshooting Azure resources with detailed commands
- Integrating Azure resource management into broader DevOps workflows or custom automation pipelines

By understanding these use cases, you can determine which tool is better suited for your specific needs or use both tools in combination to maximize efficiency.

## Conclusion

The Azure Developer CLI and Azure CLI are complementary tools that are intended for different audiences and use cases. The Azure Developer CLI is ideal for developers looking for a streamlined way to provision and deploy cloud native app resources, while the Azure CLI provides the flexibility and control needed for managing individual Azure resources. Depending on your role and requirements, you may use one or both tools to achieve your goals on Azure.
