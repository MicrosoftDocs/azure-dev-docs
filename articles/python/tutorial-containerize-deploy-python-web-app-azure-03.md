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

# Build a containerized Python web app in the cloud

This article is part of a tutorial about how to containerize and deploy a Python web app to Azure App Service. App Service enables you to run containerized web apps and deploy through continuous integration/continuous deployment (CI/CD) capabilities with Docker Hub, Azure Container Registry, and Visual Studio Team Services. In this part of the tutorial, you learn how to build the containerized Python web app in the cloud.

In the previous *optional* part of this tutorial, a container image was build and run locally. In this part of the tutorial, you'll build (containerize) a Python web app into a Docker image directly in [Azure Container Registry](/azure/container-registry/container-registry-intro). Building the image in Azure is typically faster and easier than building locally and then pushing the image to a registry. Also, building in the cloud doesn't require Docker to be running in your dev environment.

Once the Docker image is Azure Container Registry, it can be deployed to Azure App service. 

## 1. Create an Azure Container Registry

If you already have an Azure Container Registry you can use, go to the next step. If you don't, create one.

### [Azure portal](#tab/azure-portal)

Sign in to the [Azure portal](https://portal.azure.com/) and follow these steps to create an Azure Container Registry.

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Include showing how to find container registries in Azure portal](<./includes/tutorial-container-web-app/container-registry-create-portal-1.md>)] | :::image type="content" source="./media/tutorial-container-web-app/portal-search-container-registries-240px.png" lightbox="./media/tutorial-container-web-app/portal-search-container-registries.png" alt-text="A screenshot showing how to search for container registries in Azure portal." :::  |
| [!INCLUDE [Include showing how to start create of registry in Azure portal](<./includes/tutorial-container-web-app/container-registry-create-portal-2.md>)] | :::image type="content" source="./media/tutorial-container-web-app/portal-create-new-registry-240px.png" lightbox="./media/tutorial-container-web-app/portal-create-new-registry.png" alt-text="A screenshot showing how to create a new registry in Azure portal." ::: |
| [!INCLUDE [Include showing how to review and create registry in Azure portal](<./includes/tutorial-container-web-app/container-registry-create-portal-3.md>)] | :::image type="content" source="./media/tutorial-container-web-app/portal-create-registry-form-240px.png" lightbox="./media/tutorial-container-web-app/portal-create-registry-form.png" alt-text="A screenshot showing how to specify a new registry in Azure portal." ::: |
| [!INCLUDE [Include showing how to get qualified name of registry in Azure portal](<./includes/tutorial-container-web-app/container-registry-create-portal-4.md>)] | :::image type="content" source="./media/tutorial-container-web-app/portal-create-registry-login-server-240px.png" lightbox="./media/tutorial-container-web-app/portal-create-registry-login-server.png" alt-text="A screenshot showing how to find the log in server value a registry in Azure portal." :::|
 
### [VS Code](#tab/vscode-aztools)

These steps require the [Docker extension](https://code.visualstudio.com/docs/containers/overview) for VS Code.

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Include showing how to open command palette in VS Code](<./includes/tutorial-container-web-app/container-registry-create-vscode-1.md>)] | :::image type="content" source="./media/tutorial-container-web-app/visual-studio-code-registry-tasks-240px.png" lightbox="./media/tutorial-container-web-app/visual-studio-code-registry-tasks.png" alt-text="A screenshot showing how to search for show registries tasks in Visual Studio Code." ::: |
| [!INCLUDE [Include showing how to start create of registry in VS Code](<./includes/tutorial-container-web-app/container-registry-create-vscode-2.md>)] | :::image type="content" source="./media/tutorial-container-web-app/visual-studio-code-create-registry-240px.gif" lightbox="./media/tutorial-container-web-app/visual-studio-code-create-registry.gif" alt-text="An animated GIF showing how to create a registry in Visual Studio Code." ::: |
| [!INCLUDE [Include showing how to review and create registry in VS Code](<./includes/tutorial-container-web-app/container-registry-create-vscode-3.md>)] | :::image type="content" source="./media/tutorial-container-web-app/visual-studio-code-registry-get-properties-240px.png" lightbox="./media/tutorial-container-web-app/visual-studio-code-registry-get-properties.png" alt-text="A screenshot showing how to get the properties of a registry in Visual Studio Code." ::: |

### [Azure CLI](#tab/azure-cli)

Azure CLI commands can be run in the [Azure Cloud Shell](https://shell.azure.com/) or on a workstation with the [Azure CLI installed](/cli/azure/install-azure-cli).

[!INCLUDE [Include showing how create registry with Azure CLI](<./includes/tutorial-container-web-app/container-registry-create-cli.md>)]

---

## 2. Build an image in Azure Container Registry

Building in the cloud doesn't require Docker to be running in your dev environment.

### [VS Code](#tab/vscode-aztools-build)

Step 1. In the Docker extension, go to **REGISTRIES** and make sure you're connected to Azure.

Step 2: Select **F1** or **CTRL+SHIFT+P** to open the command palette.

* Type "registries".

* Select the task **Azure Container Registry: Build Image in Azure...**

Step 3: Fill out the information.

* Tag image  &rarr; Use the fully qualified name **\<registry-name>.azurecr.io**.
* Registry &rarr; Select the registry you created, that is **\<registry-name>**.
* Base OS image &rarr; Select **Linux**

Check the **OUTPUT** window for progress and information on the build.

### [Azure CLI](#tab/azure-cli-build)

**Step 1.** Log into registry if you haven't done so already with the [az acr login](/cli/azure/acr#az-acr-login) command.

```azurecli
az acr login --name <registry-name>
```

**Step 2**. Build with the [az acr build]() command.

```azurecli
az acr build -t
```

---


## 3. Get details of the image

### [Azure portal](#tab/azure-portal)

1. List container images | one image showing portal

### [VS Code](#tab/vscode-aztools)

1. Expand the **REPOSITORIES** node of the Docker extension and find Azure registry.
1. Expand subnodes until you see the *latest* image.

### [Azure CLI](#tab/azure-cli)

1. List container images with `az acr repository list --name <registry-name> --output table`.

---
