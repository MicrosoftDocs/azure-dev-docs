---
title: Azure Terminology Cheat Sheet
description: An short list of the most important terms and concepts that you need to know when working with Microsoft Azure.
ms.date: 12/07/2020
ms.topic: conceptual
ms.custom: devx-track-python
---

# Azure Terminology In Brief

| Term | Short description |
| --- | --- |
| [Account and Subscriptions](#account-and-subscriptions) | The billing information and basic organizational structure for managing resources on Azure. [More...](#account-and-subscriptions)
| [Resource](#resource) | The general name of any specific allocation of capabilities within an Azure data center. [More...](#resource) |
| [Resource group](#resource-group) | A logical container for other resources that you can then manage as a unit. [More...](#resource-group) |
| [Region](#region-location) | A reference to a specific Azure data center in which resources are allocated. [More...](#region-location) |
| [Azure App Service](#azure-app-service) | Azure's managed hosting service for web applications. [More...](#azure-app-service) |
| [App Service Plan](#app-service-plan) | A resource that defines the virtual machine used by Azure App Service. [More...](#app-service-plan) |
| [Azure portal](#azure-portal) | The web-based UI for creating and managing Azure resources. [More...](#azure-portal) |
| [Azure CLI](#azure-command-line-interface-cli) | A set of text-based commands used to create and manage Azure resources. [More...](#azure-command-line-interface-cli) |
| [az webapp, az webapp up](#az-webapp-az-webapp-up) | The Azure CLI commands to work with Azure App Service. [More....](#az-webapp-az-webapp-up) |

## Account and Subscriptions

An **Azure account** contains your basic contact information (phone number, email address) and billing information (a credit card).

Within a single billing account you can organize your activities into one or more **subscriptions**. Each subscription has its own permissions, allowing you to create separate  subscriptions for individuals or departments that all remain under the same account. An individual can have access to any number of subscriptions.

Creating any resource on Azure is always done within the context of a subscription. You can [move resources between subscriptions](/azure/azure-resource-manager/management/move-resource-group-and-subscription) but not between accounts.

## Resource

A **resource** is the general name of any specific allocation of capabilities within an Azure data center. A resource could be a virtual machine, a virtual network, various levels of storage, a database, a machine learning model, an IoT ingestion hub, and so on.

Because a resource allocates real computing capabilities, each resource potentially has an ongoing cost depending on the level of performance you need. For development and testing, many resource can be created with a free cost tier. For more information, see the [Pricing calculator](https://azure.microsoft.com/pricing/calculator/).

## Resource group

Within a subscription, a *resource group* is a logical container for other resources that you can then manage as a unit.

A resource group typically relates to a specific project, and you must always specify a resource group when provisioning a resource. The first step with a new project is usually to create an appropriate resource group.

Deleting a resource group de-allocates and deletes all of its contained resources, which is more convenient than deleting each resource individually.

## Region (location)

A **region** identifies the specific location of the Azure data center in which a resource is provisioned.

Different resources can always communicate across regions, but do so more efficiently when resources are located in the same region.

Applications that serve global customers can have Azure automatically replicate resources across multiple regions to improve overall application responsiveness and performance.

## Azure App Service

**App Service** is Azure's managed hosting service for web applications. Azure manages all the underlying hardware and server infrastructure; you provide the code and configuration.

With App Service, you provision the host, called an App Service **web app**, and upload your code. You also configure various characteristics of the host, such as load balancing, scaling, server-side environment variables, and more.

The direct URL for an App Service web app is always `<web-app-name>.azurewebsites.net`. You can also configure the web app to use a custom domain.

## App Service Plan

An **App Service Plan** is a resource that defines the virtual machine used by Azure App Service, which then determines the core cost of hosting your application. You define an App Service Plan as part of provisioning App Service prior to deploying your code.

## Azure portal

The [Azure portal](https://portal.azure.com) is the web-based user interface through which you can work with your Azure account, subscriptions, and resources.

## Azure command-line interface (CLI)

The [Azure CLI](/cli/azure/what-is-azure-cli) is a set of commands used to create and manage Azure resources, which is especially helpful for automation. The Azure CLI is available on all operating systems and works across most Azure services.

If you prefer using PowerShell, you can alternately use the [Azure PowerShell module](/powershell/azure).

## az webapp, az webapp up

The **az webapp** command is how you interact with all aspects of Azure App Service through the Azure CLI.

The **az webapp up** command, specifically, simplifies deployment of web applications. This single command can provision a resource group, an App Service Plan, and the App Service web app, and then upload your code, all in one pass.

## Next step

> [!div class="nextstepaction"]
> [Cloud Development Overview >>>](cloud-development-overview.md)
