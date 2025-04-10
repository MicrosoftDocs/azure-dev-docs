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

Azure provides multiple command-line tools to help users interact with its cloud services. Two of the most commonly used tools are the Azure Developer CLI (`azd`) and the Azure CLI (`az`). While both tools enable users to manage and deploy resources on Azure, they are designed and intended for different audiences and use cases. This document provides an overview of each tool, highlights their differences, and offers a comparison to help you choose the right tool for your needs.

## What is the Azure Developer CLI?

The Azure Developer CLI (`azd`) is a developer-centric command-line interface designed to simplify the process of building, deploying, and managing full-stack applications on Azure. It provides opinionated workflows that integrates application templates, infrastructure provisioning, and CI/CD pipeline setup, enabling developers to focus on coding rather than managing cloud resources.

Key features of the Azure Developer CLI include:

- Simplified commands for end-to-end application lifecycle management
- Automated provisioning of Azure resources using Infrastructure as Code (IaC)
- Automated app deployment to various Azure hosting services
- Predefined templates for common application architectures
- Supports apps built in various development frameworks, including Python, .NET, JavaScript and Java
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

## Feature and Audience Comparisons

The following table highlights the key differences between the Azure Developer CLI and the Azure CLI:

| Functionality         | Azure Developer CLI (`azd`)                              | Azure CLI (`az`)                                    |
|-------------------------|---------------------------------------------------------|----------------------------------------------------|
| **Intended Audience**   | Developers building cloud native applications       | Developers, IT admins, and DevOps engineers        |
| **Primary Use Case**    | End-to-end "code to cloud" app lifecycle management        | Manage individual Azure resources          |
| **Type of Tasks**       | Resource provisioning, app deployment, CI/CD setup   | Resource creation, updates, monitoring, and scripting |
| **Command Behavior**    | Opinionated, high-level commands for common workflows   | Flexible, low-level commands for granular control  |
| **Templates**           | Includes predefined templates for common architectures | No templates; requires manual resource configuration |
| **Infrastructure as Code** | Built-in support for IaC tools like Bicep and Terraform | Requires separate IaC setup and integration        |
| **CI/CD Integration**   | Automates pipeline setup for GitHub Actions or Azure DevOps | No built-in CI/CD automation                       |

## Example Workflow Comparisons

To better understand how the Azure Developer CLI (`azd`) and Azure CLI (`az`) are used in real-world scenarios, here's an example of a common use case: deploying a web application with a database.

### Use the Azure Developer CLI

1. Initialize an `azd` app template. Many starter app templates are available in the `azd` template galleries for common app architectures, or you can create your own template.

    ```bash
    azd init --template todo-nodejs-mongo
    ```

    This command clones an app GitHub repository that is structured as an `azd` template. The template includes the application code, infrastructure as code (IaC) files, and CI/CD pipeline configuration. It also initializes the template with some key `azd` environment variables and configuration files.

1. Provision and deploy the app resources using the `azd up` command. `azd` uses the Bicep or Terraform infrastructure-as-code (IaS) files defined in the template and the app hosting configurations defined in the template `azure.yaml` file.

    ```bash
    azd up
    ```

### Use the Azure CLI

1. Create a resource group for the app resources:

    ```azurecli
    az group create --name myResourceGroup --location eastus
    ```

1. Create an App Service to host the web application:

    ```azurecli
    az webapp create --resource-group myResourceGroup --plan myAppServicePlan --name myWebApp --runtime "NODE|14-lts"
    ```

1. Create an Azure Cosmos DB for MongoDB database:

    ```azurecli
    az cosmosdb create --name myCosmosDB --resource-group myResourceGroup --kind MongoDB
    ```

1. Use a deployment method like ZIP deployment to upload your application code:

    ```azurecli
    az webapp deployment source config-zip --resource-group myResourceGroup --name myWebApp --src myApp.zip
    ```

## Conclusion

The Azure Developer CLI and Azure CLI are complementary tools that are intended for different audiences and use cases. The Azure Developer CLI is ideal for developers looking for a streamlined way to provision and deploy cloud native app resources, while the Azure CLI provides the flexibility and control needed for managing individual Azure resources. Depending on your role and requirements, you may use one or both tools to achieve your goals on Azure.
