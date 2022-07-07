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

## 1. Add an Azure Container Registry

If you have an Azure Container Registry, go to the next step.

### [Azure portal](#tab/azure-portal)

 1. Search for "container registries" in the portal search and go to the **Container registries** service.

 1. Select **+ Create** to start the create process.

 1. Enter values for Resource group and Registry name. The registry name must be unique within Azure, and contain 5-50 alphanumeric characters. For this tutorial create a new resource group in the West US location named myResourceGroup, and for SKU, select 'Basic'.

 1. Select **Review + create**.

 1. After deployment, note the Login server. It should be a fully qualified name with "azurecr.io".
 
### [VS Code](#tab/vscode-aztools)

Requires Azure and Docker extensions.

1. In VS Code, select **F1** or **CTRL+SHIFT+P** to open the command palette.

1. Enter "registry" in the search box. From the results, select **Azure Container Registry: Create Registry...**

1. Enter values ....

1. Open **Docker* Explorer. Ensure that the registry endpoint you just set up is visible under **Registries**.


### [Azure CLI](#tab/azure-cli)

Step 1. Create a resource group.

Step 2. Create a container registry.

Step 3. Log in to the registry

---

## 2. Build image in Azure

You can't build an 

### [VS Code](#tab/vscode-aztools-build)

1. In the Docker extension, go to **REGISTRIES** and connect a registry.

### [Azure CLI](#tab/azure-cli-build)

1. Log into registry if you haven't done so already.  Use `az acr login --name \<registry-name>
1. Build with `az acr build -t 
---


## 3. Confirm the image in the registry

### [Azure portal](#tab/azure-portal)

1. List container images | one image showing portal

### [VS Code](#tab/vscode-aztools)

1. Expand the **REPOSITORIES** node of the Docker exensio and find Azure registory.
1. Expand subnodes until you see the *latest* image.

### [Azure CLI](#tab/azure-cli)

1. List container images with `az acr repository list --name <registry-name> --output table`.

---
