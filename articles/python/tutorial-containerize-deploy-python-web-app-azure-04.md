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

### [VS Code](#tab/vscode-aztools)


### [Azure CLI](#tab/azure-cli)

Azure CLI commands can be run in the [Azure Cloud Shell](https://shell.azure.com/) or on a workstation with the [Azure CLI installed](/cli/azure/install-azure-cli).

[!INCLUDE [Include showing how create web pp with Azure CLI](<./includes/tutorial-container-web-app/azure-cli-app-service-create.md>)]

---

## 2. Configure App Service to connect to MongoDB


## 3. Verify the deployment

## Next Steps

