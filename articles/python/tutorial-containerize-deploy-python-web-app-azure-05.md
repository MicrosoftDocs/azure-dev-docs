---
title: Clean up Azure resources used in Python container tutorial
description: How to clean up resources used in a tutorial showing how to containerize a Python web app (Django or Flask) and deploy it to App Service.
ms.devlang: python
ms.topic: tutorial
ms.date: 04/14/2025
ms.custom: devx-track-python
---

# Containerize tutorial cleanup and next steps

In this part of the tutorial series, you learn how to clean up resources used in Azure so you don't incur other charges and help keep your Azure subscription uncluttered.

## Clean up resources

At the end of a tutorial or project, it's important to clean up any Azure resources you no longer need. This helps you:

* Avoid unnecessary charges – Resources left running can continue to accrue costs.
* Keep your Azure subscription organized – Removing unused resources makes it easier to manage and navigate your subscription.

In this tutorial, all the Azure resources were created in the same resource group. Removing the resource group removes all resources in the resource group and is the fastest way to remove all Azure resources used for your app.

> [!TIP]
> If you plan to continue development or testing, you can leave the resources running. Just be aware of potential costs.

### [Azure CLI](#tab/azure-cli)

Azure CLI commands can be run in the [Azure Cloud Shell](https://shell.azure.com) or on a workstation with the [Azure CLI installed](/cli/azure/install-azure-cli).

Delete the resource group by using the [az group delete](/cli/azure/group#az-group-delete) command.

### [Bash](#tab/bash)

```azurecli-interactive
#!/bin/bash
RESOURCE_GROUP_NAME='msdocs-web-app-rg'
az group delete --name $RESOURCE_GROUP_NAME 
```

### [Powershell](#tab/powershell)

```powershell-interactive
# PowerShell syntax
$RESOURCE_GROUP_NAME='msdocs-web-app-rg'
az group delete --name $RESOURCE_GROUP_NAME 
```

---

You can optionally add the `--no-wait` argument to allow the command to return before the operation is complete.

### [VS Code](#tab/vscode-aztools)

To work with Azure resources in VS Code, you must have the [Azure Tools extension pack](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack) installed and be signed into Azure from VS Code.

1. In the Azure view in VS Code (from the Azure Tools extension), expand **RESOURCES** and find your subscription.

1. Make sure the view is set to **Group by Resource Group**.

1. Locate the resource group you want to delete.

1. Right-click the resource group and select **Delete Resource Group**.

1. In the confirmation dialog, enter the exact name of the resource group.

1. Press **ENTER** to confirm and delete the resource group..

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
