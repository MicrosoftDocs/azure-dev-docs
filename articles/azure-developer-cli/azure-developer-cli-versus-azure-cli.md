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

The Azure Developer CLI (`azd`) is a developer-centric command-line interface designed to simplify the process of building, provisioning, deploying, and managing full-stack application resources on Azure. It provides opinionated workflows that integrate application templates, infrastructure provisioning, and CI/CD pipeline setup, enabling developers to focus on coding rather than managing cloud resources.

Key features of the Azure Developer CLI include:

- Simplified commands for end-to-end application lifecycle management
- Automated provisioning of Azure resources using Infrastructure as Code (IaC)
- Automated app deployment to various Azure hosting services
- Predefined templates for common application architectures
- Support for apps built in various development stacks or frameworks, including Python, .NET, JavaScript and Java
- Built-in support for CI/CD pipeline configuration

## What is the Azure CLI?

The Azure CLI (`az`) is a general-purpose command-line interface for Azure resource management and administration. It provides a comprehensive set of commands to interact with Azure services, allowing users to create, update, delete, and monitor resources programmatically or interactively.

Key features of the Azure CLI include:

- Fine-grained control over individual Azure resources.
- Support for scripting and automation of specific Azure tasks.
- Integration with a wide range of Azure services.
- Flexibility to manage resources across multiple subscriptions and environments.

## How are they different?

While both tools are command-line interfaces for Azure, they serve different purposes and audiences:

- **Azure Developer CLI**: Focuses on simplifying the developer experience by providing an opinionated workflow for building and deploying applications. It abstracts much of the complexity of resource management and is tailored for application-centric tasks.
- **Azure CLI**: Offers granular control over Azure resources and is designed for a broader audience, including IT administrators, DevOps engineers, and developers. It provides flexibility for managing individual resources but requires knowledge of specific Azure services.

The following table highlights the key differences between the Azure Developer CLI and the Azure CLI:

| Functionality         | Azure Developer CLI (`azd`)                              | Azure CLI (`az`)                                    |
|-------------------------|---------------------------------------------------------|----------------------------------------------------|
| **Primary audience**   | Developers building cloud native applications       | Developers, IT admins, and DevOps engineers        |
| **Primary use case**    | End-to-end "code to cloud" app lifecycle management        | Manage individual Azure resources          |
| **Type of tasks**       | Resource provisioning, app deployment, CI/CD setup   | Resource creation, updates, monitoring, and scripting |
| **Command behavior**    | Opinionated, high-level commands for common workflows   | Flexible, low-level commands for granular control  |
| **Template support**           | Includes predefined templates for common architectures | No templates; requires manual resource configuration |
| **IaC support** | Built-in support for IaC tools like Bicep and Terraform | Requires separate IaC setup and integration        |
| **CI/CD Integration**   | Automates pipeline setup for GitHub Actions or Azure DevOps | No built-in CI/CD automation                       |

### When to Use the Azure Developer CLI (`azd`)

The Azure Developer CLI is best suited for scenarios where you need a streamlined, end-to-end workflow for application development and deployment. Example use cases include:

- Building and deploying full-stack cloud-native applications.
- Quickly provisioning resources and deploying applications using predefined templates.
- Setting up CI/CD pipelines for GitHub Actions or Azure DevOps with minimal configuration.
- Managing the entire lifecycle of an application, from development to deployment.
- Working on projects where Infrastructure as Code (IaC) is already integrated into the workflow.
- Simplifying the deployment of applications across multiple environments (e.g., dev, staging, production).

### When to Use the Azure CLI (`az`)

The Azure CLI is ideal for scenarios that require granular control over individual Azure resources or advanced scripting capabilities. Example use cases include:

- Creating, updating, or deleting specific Azure resources (e.g., virtual machines, storage accounts, databases).
- Automating resource management tasks using custom scripts.
- Monitoring and troubleshooting Azure resources with detailed commands.
- Managing resources across multiple subscriptions or environments.
- Configuring advanced settings for Azure services that are not covered by `azd`.
- Integrating Azure resource management into broader DevOps workflows or custom automation pipelines.

By understanding these use cases, you can determine which tool is better suited for your specific needs or use both tools in combination to maximize efficiency.

## Conclusion

The Azure Developer CLI and Azure CLI are complementary tools that are intended for different audiences and use cases. The Azure Developer CLI is ideal for developers looking for a streamlined way to provision and deploy cloud native app resources, while the Azure CLI provides the flexibility and control needed for managing individual Azure resources. Depending on your role and requirements, you may use one or both tools to achieve your goals on Azure.
