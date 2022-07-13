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

This article is part of a tutorial about how to containerize and deploy a Python web app to Azure App Service. App Service enables you to run containerized web apps and deploy through continuous integration/continuous deployment (CI/CD) capabilities with Docker Hub, Azure Container Registry, and Visual Studio Team Services. 

In this part of the tutorial, you learn how to deploy the containerized Python web app to App Service using the [App Service Web App for Containers](https://azure.microsoft.com/services/app-service/containers/), which allows you to focus on composing your containers without worrying about managing and maintaining an underlying container orchestrator.

Following the steps here, you'll end up with an App Service website using a Docker container image. The App Service pulls the initial image from Azure Container Registry using managed identity for authentication.
## 1. Create the Azure App Service

### [Azure portal](#tab/azure-portal)

Sign in to the [Azure portal](https://portal.azure.com/) and follow these steps to create the App Service.

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Include showing how to start create process of app service in Azure portal](<./includes/tutorial-container-web-app/app-service-create-azure-portal-1.md>)] | :::image type="content" source="./media/tutorial-container-web-app/azure-portal-create-web-app-start-create-240px.png" lightbox="./media/tutorial-container-web-app/azure-portal-create-web-app-start-create.png" alt-text="A screenshot showing how to start the creation of a web app in the Azure portal." ::: |
| [!INCLUDE [Include showing how to specify basics of app service in Azure portal](<./includes/tutorial-container-web-app/app-service-create-azure-portal-2.md>)] | :::image type="content" source="./media/tutorial-container-web-app/azure-portal-create-web-app-basics-240px.png" lightbox="./media/tutorial-container-web-app/azure-portal-create-web-app-basics.png" alt-text="A screenshot showing how to fill out the basic deployment information about a web app in the Azure portal." ::: |
| [!INCLUDE [Include showing how to specify Docker container of app service info in Azure portal](<./includes/tutorial-container-web-app/app-service-create-azure-portal-3.md>)] | :::image type="content" source="./media/tutorial-container-web-app/azure-portal-create-web-app-docker-240px.png" lightbox="./media/tutorial-container-web-app/azure-portal-create-web-app-docker.png" alt-text="A screenshot showing how to fill out the Docker deployment information about a web app in the Azure portal." ::: |
| [!INCLUDE [Include showing how to finish the create process of app service in Azure portal](<./includes/tutorial-container-web-app/app-service-create-azure-portal-4.md>)] |  |

### [VS Code](#tab/vscode-aztools)

These steps require the [Docker extension](https://code.visualstudio.com/docs/containers/overview) for VS Code.

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Include showing how refresh registries in Docker extension in VS Code](<./includes/tutorial-container-web-app/app-service-create-visual-studio-code-1.md>)] | :::image type="content" source="./media/tutorial-container-web-app/visual-studio-code-refresh-registries-240px.png" lightbox="./media/tutorial-container-web-app/visual-studio-code-refresh-registries.png" alt-text="A screenshot showing how to fresh registries in the Docker extension for Visual Studio Code." ::: |
| [!INCLUDE [Include showing how call up deploy image command in VS Code](<./includes/tutorial-container-web-app/app-service-create-visual-studio-code-2.md>)] |  :::image type="content" source="./media/tutorial-container-web-app/visual-studio-code-docker-registries-build-command-240px.png" lightbox="./media/tutorial-container-web-app/visual-studio-code-docker-registries-build-command.png" alt-text="A screenshot showing how to find the deploy Docker image to App Service task in Visual Studio Code." ::: |
| [!INCLUDE [Include showing how to specify the deployment in VS Code](<./includes/tutorial-container-web-app/app-service-create-visual-studio-code-3.md>)] |  :::image type="content" source="./media/tutorial-container-web-app/visual-studio-code-deploy-task-prompts-240px.gif" lightbox="./media/tutorial-container-web-app/visual-studio-code-deploy-task-prompts.gif" alt-text="A screenshot showing how to specify the information to deploy Docker image to App Service in Visual Studio Code." ::: |
| [!INCLUDE [Include showing how to verify the deployment in VS Code](<./includes/tutorial-container-web-app/app-service-create-visual-studio-code-4.md>)] |  :::image type="content" source="./media/tutorial-container-web-app/visual-studio-code-site-deployed-240px.png" lightbox="./media/tutorial-container-web-app/visual-studio-code-site-deployed.png" alt-text="A screenshot showing prompt when Docker image is deployed App Service in Visual Studio Code." ::: |


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

To specify the environment variables needed to connect to MongoDB.

### [Azure portal](#tab/azure-portal)

Add configuration setting.

### [VS Code](#tab/vscode-aztools)

Add configuration setting.

### [Azure CLI](#tab/azure-cli)

Add configuration setting.

---

## 4. Verify the deployment

## Next Steps

