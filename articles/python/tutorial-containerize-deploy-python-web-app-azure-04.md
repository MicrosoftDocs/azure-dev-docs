---
title: 'Deploy a Python web app to Azure with managed identity: deploy the container image to App Service'
description: How to deploy a containerized Python (Django or Flask) to App Service.
author: jess-johnson-msft
ms.author: jejohn
ms.devlang: python
ms.topic: tutorial
ms.date: 07/07/2022
ms.prod: azure-python
ms.custom: devx-track-python, devx-track-azurecli
---

# Deploy a containerized Python app to App Service

This article is part of a tutorial about how to containerize and deploy a Python web app to Azure App Service. App Service enables you to run containerized web apps and deploy through continuous integration/continuous deployment (CI/CD) capabilities with Docker Hub, Azure Container Registry, and Visual Studio Team Services. In this part of the tutorial, you learn how to deploy the containerized Python web app to App Service using the [App Service Web App for Containers](https://azure.microsoft.com/services/app-service/containers/), which allows you to focus on composing your containers without worrying about managing and maintaining an underlying container orchestrator.

Notes:

* Managed identity is set up automatically as way of App Service to authorize to Registry.

* Webhook is automatically created for you. you can view webhooks in the Azure Container Registry. Or list them with "az acr webhook" command.

## 1. Create the Azure App Service

### [Azure portal](#tab/azure-portal)


| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Include showing how to start create process of app service in Azure portal](<./includes/tutorial-container-web-app/app-service-create-azure-portal-1.md>)] |  |
| [!INCLUDE [Include showing how to specify basics of app service in Azure portal](<./includes/tutorial-container-web-app/app-service-create-azure-portal-2.md>)] |  |
| [!INCLUDE [Include showing how to specify Docker container of app service info in Azure portal](<./includes/tutorial-container-web-app/app-service-create-azure-portal-3.md>)] |  |
| [!INCLUDE [Include showing how to finish the create process of app service in Azure portal](<./includes/tutorial-container-web-app/app-service-create-azure-portal-4.md>)] |  |

### [VS Code](#tab/vscode-aztools)

**Step 1.** Refresh the Azure Container Registry in the Docker extension.

Confirm that the registry and repo you want to use appears. What appears there will be what choices the task shows.

**Step 2.** Command palette bring up and use **Docker Registries: Deploy Image to Azure App Service...**

**Step 3.** Follow prompts:

* Azure as provider
* Select registry name.
* Select repository name. (If you don't see your repo, refresh the Docker extension **REGISTRIES** section.)
* Select tag "latest"
* Enter a globally unique name for the web app.
* Others?

**Step 4.** When the prompt shows the deployment finishes.

### [Azure CLI](#tab/azure-cli)

Azure CLI commands can be run in the [Azure Cloud Shell](https://shell.azure.com/) or on a workstation with the [Azure CLI installed](/cli/azure/install-azure-cli).

[!INCLUDE [Include showing how create web app with Azure CLI](<./includes/tutorial-container-web-app/app-service-create-cli.md>)]

---

## 2. Configure managed identity

### [Azure portal](#tab/azure-portal)


| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Include showing how to start create process of app service in Azure portal](<./includes/tutorial-container-web-app/app-service-create-azure-portal-5.md>)] |  |
| [!INCLUDE [Include showing how to specify basics of app service in Azure portal](<./includes/tutorial-container-web-app/app-service-create-azure-portal-6.md>)] |  |
| [!INCLUDE [Include showing how to specify Docker container of app service info in Azure portal](<./includes/tutorial-container-web-app/app-service-create-azure-portal-7.md>)] |  |


### [VS Code](#tab/vscode-aztools)

No further steps needed.

### [Azure CLI](#tab/azure-cli)

[!INCLUDE [Include showing how set managed identity for container deployment with Azure CLI](<./includes/tutorial-container-web-app/app-service-nanaged-id-cli.md>)]

---

## 3. Configure App Service to connect to MongoDB


## 3. Verify the deployment

## Next Steps

