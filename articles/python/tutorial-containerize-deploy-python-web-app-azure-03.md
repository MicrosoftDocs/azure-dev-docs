---
title: Build a containerized Python web app in Azure Container Registry
description: Build a containerized Python web app (Django or Flask) in Azure Container Registry, without the need for Docker installed locally.
ms.topic: conceptual
ms.date: 10/09/2023
ms.custom: devx-track-python, py-fresh-zinc, devx-track-azurecli
---

# Build a containerized Python web app in the cloud

This article is part of a tutorial about how to containerize and deploy a Python web app to Azure App Service. App Service enables you to run containerized web apps and deploy through continuous integration/continuous deployment (CI/CD) capabilities with Docker Hub, Azure Container Registry, and Visual Studio Team Services. In this part of the tutorial, you learn how to build the containerized Python web app in the cloud.

In the previous *optional* part of this tutorial, a container image was build and run locally. In contrast, in this part of the tutorial, you build (containerize) a Python web app into a Docker image directly in [Azure Container Registry](/azure/container-registry/container-registry-intro). Building the image in Azure is typically faster and easier than building locally and then pushing the image to a registry. Also, building in the cloud doesn't require Docker to be running in your dev environment.

Once the Docker image is in Azure Container Registry, it can be deployed to Azure App service.

The service diagram shown below highlights the components covered in this article.

:::image type="content" source="./media/tutorial-container-web-app/containerization-of-python-apps-build-cloud.png" alt-text="A screenshot of the services using in the Tutorial - Containerized Python App on Azure with the build-in-cloud path highlighted." lightbox="./media/tutorial-container-web-app/containerization-of-python-apps-build-cloud.png":::

## Create an Azure Container Registry

If you already have an Azure Container Registry you can use, go to the next step. If you don't, create one.

### [Azure CLI](#tab/azure-cli)

Azure CLI commands can be run in the [Azure Cloud Shell](https://shell.azure.com/) or on a workstation with the [Azure CLI installed](/cli/azure/install-azure-cli). When running in Cloud Shell, skip **Step 3**.

1. Create a resource group if needed with the [az group create](/cli/azure/group#az-group-create) command. If you've already set up an Azure Cosmos DB for MongoDB account in part **2. Build and test container locally** of this tutorial, set RESOURCE_GROUP_NAME to the name of the resource group you used for that account and move on to Step 2.

    ```azurecli
    RESOURCE_GROUP_NAME='msdocs-web-app-rg'
    LOCATION='eastus'
    
    az group create -n $RESOURCE_GROUP_NAME -l $LOCATION
    ```

    LOCATION should be an Azure location value. Choose a location near you. You can list Azure location values with the following command: `az account list-locations -o table`.

1. Create a container registry with the [az acr create](/cli/azure/acr#az-acr-create) command.

    ```azurecli
    REGISTRY_NAME='<your Azure Container Registry name>'
    
    az acr create -g $RESOURCE_GROUP_NAME -n $REGISTRY_NAME --sku Basic
    ```

    REGISTRY_NAME must be unique within Azure and contain 5-50 alphanumeric characters.

    In the JSON output of the command look for the `loginServer` value, which is the fully qualified registry name (all lowercase) and which should include the registry name you specified.

1. If you're running the Azure CLI locally, log in to the registry using the [az acr login](/cli/azure/acr#az-acr-login) command.

    ```azurecli
    az acr login -n $REGISTRY_NAME
    ```

    The command adds "azurecr.io" to the name to create the fully qualified registry name. If successful, you'll see the message "Login Succeeded".

    > [!NOTE]
    > The `az acr login` command isn't needed or supported in Cloud Shell.

[!INCLUDE [Include showing how create registry with Azure CLI](<./includes/tutorial-container-web-app/container-registry-create-cli.md>)]

### [VS Code](#tab/vscode-aztools)

These steps require the [Docker extension](https://code.visualstudio.com/docs/containers/overview) for VS Code.

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Include showing how to open command palette in VS Code](<./includes/tutorial-container-web-app/container-registry-create-vscode-1.md>)] | :::image type="content" source="./media/tutorial-container-web-app/visual-studio-code-registry-tasks-240px.png" lightbox="./media/tutorial-container-web-app/visual-studio-code-registry-tasks.png" alt-text="A screenshot showing how to search for show registries tasks in Visual Studio Code." ::: |
| [!INCLUDE [Include showing how to start create of registry in VS Code](<./includes/tutorial-container-web-app/container-registry-create-vscode-2.md>)] | :::image type="content" source="./media/tutorial-container-web-app/visual-studio-code-create-registry-240px.gif" lightbox="./media/tutorial-container-web-app/visual-studio-code-create-registry.gif" alt-text="An animated GIF showing how to create a registry in Visual Studio Code." ::: |
| [!INCLUDE [Include showing how to review and create registry in VS Code](<./includes/tutorial-container-web-app/container-registry-create-vscode-3.md>)] | :::image type="content" source="./media/tutorial-container-web-app/visual-studio-code-registry-get-properties-240px.png" lightbox="./media/tutorial-container-web-app/visual-studio-code-registry-get-properties.png" alt-text="A screenshot showing how to get the properties of a registry in Visual Studio Code." ::: |

### [Azure portal](#tab/azure-portal)

Sign in to the [Azure portal](https://portal.azure.com/) and follow these steps to create an Azure Container Registry.

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Include showing how to find container registries in Azure portal](<./includes/tutorial-container-web-app/container-registry-create-portal-1.md>)] | :::image type="content" source="./media/tutorial-container-web-app/portal-search-container-registries-240px.png" lightbox="./media/tutorial-container-web-app/portal-search-container-registries.png" alt-text="A screenshot showing how to search for container registries in Azure portal." :::  |
| [!INCLUDE [Include showing how to start create of registry in Azure portal](<./includes/tutorial-container-web-app/container-registry-create-portal-2.md>)] | :::image type="content" source="./media/tutorial-container-web-app/portal-create-new-registry-240px.png" lightbox="./media/tutorial-container-web-app/portal-create-new-registry.png" alt-text="A screenshot showing how to create a new registry in Azure portal." ::: |
| [!INCLUDE [Include showing how to review and create registry in Azure portal](<./includes/tutorial-container-web-app/container-registry-create-portal-3.md>)] | :::image type="content" source="./media/tutorial-container-web-app/portal-create-registry-form-240px.png" lightbox="./media/tutorial-container-web-app/portal-create-registry-form.png" alt-text="A screenshot showing how to specify a new registry in Azure portal." ::: |
| [!INCLUDE [Include showing how to get qualified name of registry in Azure portal](<./includes/tutorial-container-web-app/container-registry-create-portal-4.md>)] | :::image type="content" source="./media/tutorial-container-web-app/portal-create-registry-login-server-240px.png" lightbox="./media/tutorial-container-web-app/portal-create-registry-login-server.png" alt-text="A screenshot showing how to find the login server value  for a registry in Azure portal." :::|
| [!INCLUDE [Include showing how to enable admin user for the registry in Azure portal](<./includes/tutorial-container-web-app/container-registry-create-portal-5.md>)] | :::image type="content" source="./media/tutorial-container-web-app/portal-create-registry-enable-admin-user-240px.png" lightbox="./media/tutorial-container-web-app/portal-create-registry-enable-admin-user.png" alt-text="A screenshot showing how to enable the admin user for the registry in Azure portal." :::|

---

## Build an image in Azure Container Registry

You can build the container image directly in Azure in a few ways. First, you can use the Azure Cloud Shell, which builds the image without using your local environment at all. You can also build the container image in Azure from your local environment using VS Code or the Azure CLI. Building the image in the cloud doesn't require Docker to be running in your local environment. If you need to, you can follow the instructions in [Clone or download the sample app](tutorial-containerize-deploy-python-web-app-azure-02.md) in part 2 of this tutorial to get the sample Flask or Django web app.

### [Azure CLI](#tab/azure-cli)

Azure CLI commands can be run on a workstation with the [Azure CLI installed](/cli/azure/install-azure-cli) or in [Azure Cloud Shell](https://shell.azure.com/). When running in Cloud Shell, skip **Step 1**.

1. If you're running the Azure CLI locally, sign in to the registry if you haven't done so already with the [az acr login](/cli/azure/acr#az-acr-login) command.

    ```azurecli
    az acr login -n $REGISTRY_NAME
    ```

    If you're accessing the registry from a subscription different from the one in which the registry was created, use the `--suffix` switch.

    > [!NOTE]
    > The `az acr login` command isn't needed and isn't supported in Cloud Shell.

1. Build the image with the [az acr build](/cli/azure/acr#az-acr-build) command.

    ```azurecli
    az acr build -r $REGISTRY_NAME -g $RESOURCE_GROUP_NAME -t msdocspythoncontainerwebapp:latest .
    ```

    In this command:

    * The dot (".") at the end of the command indicates the location of the source code to build. If you aren't running this command in the sample app root directory, specify the path to the code.

       Rather than a path to the code in your environment, you can, optionally, specify a path to the sample GitHub repo: https://github.com/Azure-Samples/msdocs-python-django-container-web-app or https://github.com/Azure-Samples/msdocs-python-flask-container-web-app.

    * If you leave out the `-t` (same as `--image`) option, the command queues a local context build without pushing it to the registry. Building without pushing can be useful to check that the image builds.

1. Confirm the container image was created with the [az acr repository list](/cli/azure/acr/repository#az-acr-repository-list) command.

### [VS Code](#tab/vscode-aztools)

These steps require the [Docker extension](https://code.visualstudio.com/docs/containers/overview) for VS Code. VS Code needs to be opened in the working folder of your web app.

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Include showing how to check that Azure is connected to Docker extension in VS Code](<./includes/tutorial-container-web-app/container-image-build-in-azure-vscode-1.md>)] | :::image type="content" source="./media/tutorial-container-web-app/visual-studio-code-build-image-registries-240px.png" lightbox="./media/tutorial-container-web-app/visual-studio-code-build-image-registries.png" alt-text="A screenshot showing how to check that Azure is signed into Docker Extension in Visual Studio Code." ::: |
| [!INCLUDE [Include showing how to invoke the build container image in Azure task in VS Code](<./includes/tutorial-container-web-app/container-image-build-in-azure-vscode-2.md>)] | :::image type="content" source="./media/tutorial-container-web-app/visual-studio-code-build-image-task-240px.png" lightbox="./media/tutorial-container-web-app/visual-studio-code-build-image-task.png" alt-text="A screenshot showing how to invoke build container in Azure task in Visual Studio Code." ::: |
| [!INCLUDE [Include showing how to build the container image in Azure in VS Code](<./includes/tutorial-container-web-app/container-image-build-in-azure-vscode-3.md>)] | :::image type="content" source="./media/tutorial-container-web-app/visual-studio-code-build-image-prompts-240px.gif" lightbox="./media/tutorial-container-web-app/visual-studio-code-build-image-prompts.gif" alt-text="A screenshot showing how to provide information to  build container in Azure in Visual Studio Code." ::: |
| [!INCLUDE [Include showing how to confirm the container image in the registry in VS Code](<./includes/tutorial-container-web-app/container-image-build-in-azure-vscode-4.md>)] | :::image type="content" source="./media/tutorial-container-web-app/visual-studio-code-build-image-confirm-240px.png" lightbox="./media/tutorial-container-web-app/visual-studio-code-build-image-confirm.png" alt-text="A screenshot showing how to confirm the  information to  build container in Azure in Visual Studio Code." ::: |

### [Azure portal](#tab/azure-portal)

Sign in to the [Azure portal](https://portal.azure.com/) to complete these steps.

[!INCLUDE [Include showing how build an image in Azure with the Azure Cloud Shell](<./includes/tutorial-container-web-app/container-image-build-in-azure-cloud-shell.md>)]

---

## Next step

> [!div class="nextstepaction"]
> [Deploy web app](tutorial-containerize-deploy-python-web-app-azure-04.md)
