---
title: Clean up Azure resources used in Python container tutorial
description: How to clean up resources used in a tutorial showing how to containerize a Python web app (Django or Flask) and deploy it to App Service.
ms.devlang: python
ms.topic: tutorial
ms.date: 08/24/2022
ms.custom: devx-track-python
---

# Containerize tutorial cleanup and next steps

This article is part of a tutorial about how to containerize and deploy a Python web app to Azure App Service. In this article, you'll clean up resources used in Azure so you don't incur other charges and help keep your Azure subscription uncluttered. You can leave the Azure resources running if you want to use them for further development work. 

## 1. Clean up resources

In this tutorial, all the Azure resources were created in the same resource group. Removing the resource group removes all resources in the resource group and is the fastest way to remove all Azure resources used for your app.

### [Azure portal](#tab/azure-portal)

Sign in to the [Azure portal](https://portal.azure.com/) and follow these steps to delete a resource group.

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Remove resource group Azure portal 1](<./includes/general-clean-up-steps/remove-resource-group-azure-portal-1.md>)] | :::image type="content" source="./media/general-clean-up-steps/remove-resource-group-azure-portal-1-240px.png" lightbox="./media/general-clean-up-steps/remove-resource-group-azure-portal-1.png" alt-text="A screenshot showing how to find resource group in the Azure portal." ::: |
| [!INCLUDE [Remove resource group Azure portal 2](<./includes/general-clean-up-steps/remove-resource-group-azure-portal-2.md>)] | :::image type="content" source="./media/general-clean-up-steps/remove-resource-group-azure-portal-2-240px.png" lightbox="./media/general-clean-up-steps/remove-resource-group-azure-portal-2.png" alt-text="A screenshot showing how to delete a resource group in the Azure portal." ::: |
| [!INCLUDE [Remove resource group Azure portal 3](<./includes/general-clean-up-steps/remove-resource-group-azure-portal-3.md>)] | |

### [VS Code](#tab/vscode-aztools)

To work with Azure resources in VS Code, you must have the [Azure Tools extension pack](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack) installed and be signed into Azure from VS Code.

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Remove resource group Visual Studio Code 1](<./includes/general-clean-up-steps/remove-resource-group-visual-studio-code-1.md>)] | :::image type="content" source="./media/general-clean-up-steps/remove-resource-group-visual-studio-code-1-240px.png" lightbox="./media/general-clean-up-steps/remove-resource-group-visual-studio-code-1.png" alt-text="A screenshot showing how to delete a resource group in Visual Studio Code." ::: |

### [Azure CLI](#tab/azure-cli)

Azure CLI commands can be run in the [Azure Cloud Shell](https://shell.azure.com) or on a workstation with the [Azure CLI installed](/cli/azure/install-azure-cli).

[!INCLUDE [Clean up resources CLI](<./includes/general-clean-up-steps/clean-up-resources-cli.md>)]

----

## 2. Next steps

After completing this tutorial, here are some next steps you can take to build upon what you learned and move the tutorial code and deployment closer to production ready:

* [Deploy a web app from a geo-replicated Azure container registry](/azure/container-registry/container-registry-tutorial-deploy-app)

* [Review Security in Azure Cosmos DB](/azure/cosmos-db/database-security)

* Map a custom DNS name to your app, see [Tutorial: Map custom DNS name to your app](/azure/app-service/app-service-web-tutorial-custom-domain).

* Monitor App Service for availability, performance, and operation, see [Monitoring App Service](/azure/app-service/monitor-app-service) and [Set up Azure Monitor for your Python application](/azure/azure-monitor/app/opencensus-python).

* Enable continuous deployment to Azure App Service, see [Continuous deployment to Azure App Service](/azure/app-service/deploy-continuous-deployment), [Use CI/CD to deploy a Python web app to Azure App Service on Linux](/azure/devops/pipelines/ecosystems/python-webapp), and [Design a CI/CD pipeline using Azure DevOps](/azure/architecture/example-scenario/apps/devops-dotnet-webapp).

* Create reusable infrastructure as code with [Azure Developer CLI (azd)](../azure-developer-cli/overview.md). 

## 3. Related Learn modules

The following are some Learn modules that explore the technologies and themes covered in this tutorial:

* [Introduction to Python](/training/modules/intro-to-python/)

* [Get started with Django](/training/modules/django-get-started/)

* [Create views and templates in Django](/training/modules/django-views-templates/)

* [Create data-driven websites by using the Python framework Django](/training/paths/django-create-data-driven-websites/)

* [Deploy a Django application to Azure by using PostgreSQL](/training/modules/django-deployment/)

* [Get Started with the MongoDB API in Azure Cosmos DB](/training/modules/get-started-mongodb-api-azure-cosmos-db/)

* [Migrate on-premises MongoDB databases to Azure Cosmos DB](/training/modules/migrate-on-premises-mongodb-databases-azure-database-mongodb/)

* [Build a containerized web application with Docker](/training/modules/intro-to-containers/)
