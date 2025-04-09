---
title: Clean up Azure resources used in Python container tutorial
description: How to clean up resources used in a tutorial showing how to containerize a Python web app (Django or Flask) and deploy it to App Service.
ms.devlang: python
ms.topic: tutorial
ms.date: 12/27/2024
ms.custom: devx-track-python
---

# Containerize tutorial cleanup and next steps

This article is part of a tutorial about how to containerize and deploy a Python web app to Azure App Service. In this article, you'll clean up resources used in Azure so you don't incur other charges and help keep your Azure subscription uncluttered. You can leave the Azure resources running if you want to use them for further development work.

## Clean up resources

In this tutorial, all the Azure resources were created in the same resource group. Removing the resource group removes all resources in the resource group and is the fastest way to remove all Azure resources used for your app.

### [Azure CLI](#tab/azure-cli)

Azure CLI commands can be run in the [Azure Cloud Shell](https://shell.azure.com) or on a workstation with the [Azure CLI installed](/cli/azure/install-azure-cli).

Delete the resource group by using the [az group delete](/cli/azure/group#az-group-delete) command.

```azurecli
az group delete \
    --name $RESOURCE_GROUP_NAME 
```

You can optionally add the `--no-wait` argument to allow the command to return before the operation is complete.

### [VS Code](#tab/vscode-aztools)

To work with Azure resources in VS Code, you must have the [Azure Tools extension pack](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack) installed and be signed into Azure from VS Code.

1. In the Azure Tools extension for Visual Studio Code, expand **RESOURCES** and find your subscription.

1. Make sure you're filtering by **Group by Resource Group**

1. Find your resource group, right-click, and select **Delete Resource Group**.

    :::image type="content" source="./media/tutorial-container-web-app/remove-resource-group-visual-studio-code.png" lightbox="./media/tutorial-container-web-app/remove-resource-group-visual-studio-code.png" alt-text="A screenshot that shows how to delete a resource group in Visual Studio Code." :::

1. Enter the name of the resource group in the dialog box to confirm deletion.

### [Azure portal](#tab/azure-portal)

1. Navigate to your resource group in the [Azure portal](https://portal.azure.com/). For example, you can search for the name of your resource group and select it under **Resource Groups** in the results.

1. Select **Overview** on the **service menu**, then select **Delete Resource Group** in the top menu.

1. In the **Delete a resource group** confirmation dialog, enter the name of your resource group to confirm deletion, then select **Delete**.

----

## Next steps

After completing this tutorial, here are some next steps you can take to build upon what you learned and move the tutorial code and deployment closer to production ready:

* [Deploy a web app from a geo-replicated Azure container registry](/azure/container-registry/container-registry-tutorial-deploy-app)

* [Review Security in Azure Cosmos DB](/azure/cosmos-db/database-security)

* Map a custom DNS name to your app, see [Tutorial: Map custom DNS name to your app](/azure/app-service/app-service-web-tutorial-custom-domain).

* Monitor App Service for availability, performance, and operation, see [Monitoring App Service](/azure/app-service/monitor-app-service) and [Set up Azure Monitor for your Python application](/azure/azure-monitor/app/opencensus-python).

* Enable continuous deployment to Azure App Service, see [Continuous deployment to Azure App Service](/azure/app-service/deploy-continuous-deployment), [Use CI/CD to deploy a Python web app to Azure App Service on Linux](/azure/devops/pipelines/ecosystems/python-webapp), and [Design a CI/CD pipeline using Azure DevOps](/azure/devops/pipelines/architectures/devops-pipelines-baseline-architecture).

* Create reusable infrastructure as code with [Azure Developer CLI (azd)](../azure-developer-cli/overview.md). 

## Related Learn modules

The following are some Learn modules that explore the technologies and themes covered in this tutorial:

* [Introduction to Python](/training/modules/intro-to-python/)

* [Get started with Django](/training/modules/django-get-started/)

* [Create views and templates in Django](/training/modules/django-views-templates/)

* [Create data-driven websites by using the Python framework Django](/training/paths/django-create-data-driven-websites/)

* [Deploy a Django application to Azure by using PostgreSQL](/training/modules/django-deployment/)

* [Get Started with the MongoDB API in Azure Cosmos DB](/training/modules/get-started-mongodb-api-azure-cosmos-db/)

* [Migrate on-premises MongoDB databases to Azure Cosmos DB](/training/modules/migrate-on-premises-mongodb-databases-azure-database-mongodb/)

* [Build a containerized web application with Docker](/training/modules/intro-to-containers/)
