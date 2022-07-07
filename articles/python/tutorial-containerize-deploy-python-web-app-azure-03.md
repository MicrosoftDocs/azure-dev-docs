---
title: 'Tutorial: Containerized Python web apps on Azure: build image in Azure Container Registry'
description: Build a containerized Python web app in the cloud.
ms.topic: conceptual
ms.date: 07/07/2022
ms.custom: devx-track-python
ms.prod: azure-python
author: jess-johnson-msft
ms.author: jejohn
---

# Build and test a containerized Python web app in the cloud

This article is part of a tutorial about containerizing and deploy a Python web app to Azure App Service. App Service enables you to run containerized web apps and deploy through continuous integration/continuous deployment (CI/CD) capabilities with Docker Hub, Azure Container Registry, and Visual Studio Team Services. In this part of the tutorial, you learn how to build and run the containerized Python web app locally.

In the previous part of this tutorial, a container image was build and run locally. In this part of the tutorial, you will build (containerize) a Python web app into a Docker image in the cloud, in [Azure Container Registry](/azure/container-registry/container-registry-intro). Building in the close which has the advantage of typically being faster and easier.

Before you can deploy a Docker image, the image must be uploaded to a container registry. In this tutorial, you'll work with Azure Container Registry (ACR), bu or another registry. 

## 1. Create an Azure Container Registry

If you have an Azure Container Registry, go to the next step.

### [Azure portal](#tab/azure-portal)

Sign in to the [Azure portal](https://portal.azure.com/) and follow these steps to create your Azure Container Registry.

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Include showing how to find container registries in Azure portal](<./includes/tutorial-container-web-app/container-registry-create-portal-1.md>)] |  |
| [!INCLUDE [Include showing how to start create of registry in Azure portal](<./includes/tutorial-container-web-app/container-registry-create-portal-2.md>)] | |
| [!INCLUDE [Include showing how to review and create registry in Azure portal](<./includes/tutorial-container-web-app/container-registry-create-portal-3.md>)] | |
| [!INCLUDE [Include showing how to get qualified name of registry in Azure portal](<./includes/tutorial-container-web-app/container-registry-create-portal-4.md>)] | |
 
### [VS Code](#tab/vscode-aztools)

Requires Azure and Docker extensions.

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Include showing how to open command palette in VS Code](<./includes/tutorial-container-web-app/container-registry-create-vscode-1.md>)] |  |
| [!INCLUDE [Include showing how to start create of registry in VS Code](<./includes/tutorial-container-web-app/container-registry-create-vscode-2.md>)] | |
| [!INCLUDE [Include showing how to review and create registry in VS Code](<./includes/tutorial-container-web-app/container-registry-create-vscode-3.md>)] | |

### [Azure CLI](#tab/azure-cli)

Step 1. Create a resource group.

Step 2. Create a container registry.

Step 3. Log in to the registry

---

## 2. Build an image in Azure Container Registry

You can't build an image in the portal.

### [VS Code](#tab/vscode-aztools-build)

1. In the Docker extension, go to **REGISTRIES** and connect a registry.

### [Azure CLI](#tab/azure-cli-build)

1. Log into registry if you haven't done so already.  Use `az acr login --name \<registry-name>
1. Build with `az acr build -t 
---


## 3. Get details of the image

### [Azure portal](#tab/azure-portal)

1. List container images | one image showing portal

### [VS Code](#tab/vscode-aztools)

1. Expand the **REPOSITORIES** node of the Docker exensio and find Azure registory.
1. Expand subnodes until you see the *latest* image.

### [Azure CLI](#tab/azure-cli)

1. List container images with `az acr repository list --name <registry-name> --output table`.

---
