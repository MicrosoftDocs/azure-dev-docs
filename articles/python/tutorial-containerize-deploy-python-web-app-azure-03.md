---
title: Build a containerized Python web app in Azure Container Registry
description: Build a containerized Python web app (Django or Flask) in Azure Container Registry, without the need to install Docker locally.
ms.topic: how-to
ms.date: 05/28/2026
ms.custom:
  - devx-track-python
  - py-fresh-zinc
  - devx-track-azurecli
  - sfi-image-nochange
---

# Build a containerized Python web app in Azure

This article is part 3 of a 5-part tutorial series about containerizing and deploying a Python web app to Azure App Service. In [part 2](tutorial-containerize-deploy-python-web-app-azure-02.md), you built and ran the container image locally. In this article, you build the same Python web app directly in [Azure Container Registry](/azure/container-registry/container-registry-intro) without installing Docker locally. Building the image in Azure is typically faster and easier than building locally and then pushing it to a registry. Cloud-based image building also eliminates the need for Docker to be running in your development environment.

Azure App Service lets you deploy and run containerized web apps using CI/CD pipelines from platforms like Docker Hub, Azure Container Registry, and Azure DevOps. Once the Docker image is in Azure Container Registry, you can deploy it to Azure App Service.

## Prerequisites

Before you begin, make sure you completed [part 2 of this tutorial series](tutorial-containerize-deploy-python-web-app-azure-02.md), which covers:

- Cloning the sample repository (Django or Flask).
- Creating a resource group for Azure resources.
- Running the containerized app locally to verify it works.

You also need:

- An active Azure subscription. If you don't have one, [create a free account](https://azure.microsoft.com/free/).
- [Azure CLI](/cli/azure/install-azure-cli) installed locally (for Azure CLI steps) or access to [Azure Cloud Shell](https://shell.azure.com/).
- [Visual Studio Code](https://code.visualstudio.com/) with the [Docker extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-docker) installed (for VS Code steps).

> [!IMPORTANT]
> The sample Dockerfile uses `python:3.8-slim` as the base image. **Python 3.8 reached end-of-life in October 2024** and no longer receives security updates. Update your Dockerfile to use `python:3.12-slim` or `python:3.13-slim` for production deployments.

This service diagram highlights the components covered in this article.

:::image type="content" source="./media/tutorial-container-web-app/containerization-of-python-apps-build-cloud.png" alt-text="A screenshot of the services using in the Tutorial - Containerized Python App on Azure with the build-in-cloud path highlighted." lightbox="./media/tutorial-container-web-app/containerization-of-python-apps-build-cloud.png":::

### [Azure CLI](#tab/azure-cli)

## Create an Azure Container Registry

If you already have an Azure Container Registry, skip this step and proceed to the next step. Otherwise, create a new Azure Container Registry by using the Azure CLI.

You can run Azure CLI commands in the [Azure Cloud Shell](https://shell.azure.com/) or in your local development environment with the [Azure CLI installed](/cli/azure/install-azure-cli).

> [!NOTE]
> Use the same names as in part 2 of this tutorial series.

1. Create an Azure container registry by using the [az acr create](/cli/azure/acr#az-acr-create) command.

    ### [Bash](#tab/bash)

    ```azurecli-interactive
    #!/bin/bash
    # Use the resource group that you created in part 2 of this tutorial series.
    RESOURCE_GROUP_NAME='msdocs-web-app-rg'
    # REGISTRY_NAME must be unique within Azure and contain 5-50 alphanumeric characters.
    # If the name is already taken, you'll receive an error. Choose a different name and retry.
    REGISTRY_NAME='msdocscontainerregistryname'

    echo "Creating Azure Container Registry $REGISTRY_NAME..."
    az acr create -g $RESOURCE_GROUP_NAME -n $REGISTRY_NAME --sku Standard
    ```

    ### [PowerShell](#tab/powershell)

    ```powershell-interactive
    # PowerShell syntax
    # Use the resource group that you created in part 2 of this tutorial series.
    $RESOURCE_GROUP_NAME='msdocs-web-app-rg'
    # REGISTRY_NAME must be unique within Azure and contain 5-50 alphanumeric characters.
    # If the name is already taken, you'll receive an error. Choose a different name and retry.
    $REGISTRY_NAME='msdocscontainerregistryname'

    Write-Output "Creating Azure Container Registry $REGISTRY_NAME..."
    az acr create -g $RESOURCE_GROUP_NAME -n $REGISTRY_NAME --sku Standard
    ```

    ---

    In the JSON output of the command, locate the `loginServer` value. This value represents the fully qualified registry name (all lowercase) and contains the registry name.

    **Example output:**

    ```json
    {
      "loginServer": "msdocscontainerregistryname.azurecr.io",
      "name": "msdocscontainerregistryname",
      ...
    }
    ```

1. If you're using the Azure CLI on your local machine, run the [az acr login](/cli/azure/acr#az-acr-login) command to sign in to the container registry.

    ```azurecli-interactive
    az acr login -n $REGISTRY_NAME
    ```

    The `-n` parameter accepts either the short registry name (for example, `msdocscontainerregistryname`) or the fully qualified registry name (`msdocscontainerregistryname.azurecr.io`). The command authenticates Docker with Azure Container Registry using your Azure CLI credentials.
    
    **Expected output:**
    
    ```output
    Login Succeeded
    ```

    > [!NOTE]
    > If you're using Azure Cloud Shell, you don't need to run the `az acr login` command because your Cloud Shell session automatically handles authentication.

## Build an image in Azure Container Registry

You can generate the container image directly in Azure through various approaches:

  * The Azure Cloud Shell enables you to construct the image entirely in the cloud, independent of your local environment.
  * Alternatively, you can use VS Code or the Azure CLI to create the image in Azure from your local setup, without needing Docker to be running locally.

You can run Azure CLI commands in your local development environment by using the [Azure CLI installed](/cli/azure/install-azure-cli) or in [Azure Cloud Shell](https://shell.azure.com/).

1. In the console, go to the root folder for your cloned repository from part 2 of this tutorial series.

1. Build the container image by using the [az acr build](/cli/azure/acr#az-acr-build) command.

    **Local development:**
    
    ```azurecli-interactive
    az acr build -r $REGISTRY_NAME -g $RESOURCE_GROUP_NAME -t msdocspythoncontainerwebapp:latest .
    ```

    **Azure Cloud Shell:**
    
    If you're using Azure Cloud Shell, specify the GitHub repository URL instead of the local path (`.`):
    
    ```azurecli-interactive
    # For Django sample:
    az acr build -r $REGISTRY_NAME -g $RESOURCE_GROUP_NAME -t msdocspythoncontainerwebapp:latest https://github.com/Azure-Samples/msdocs-python-django-container-web-app.git
    
    # For Flask sample:
    az acr build -r $REGISTRY_NAME -g $RESOURCE_GROUP_NAME -t msdocspythoncontainerwebapp:latest https://github.com/Azure-Samples/msdocs-python-flask-container-web-app.git
    ```

    The final argument (`.` or the Git URL) is the Docker build context—the directory containing the Dockerfile and application files that Docker uses to build the image.

1. Confirm the container image was created by using the [az acr repository list](/cli/azure/acr/repository#az-acr-repository-list) command.

    ```azurecli-interactive
    az acr repository list -n $REGISTRY_NAME
    ```

    **Expected output:**

    ```json
    [
      "msdocspythoncontainerwebapp"
    ]
    ```

### [VS Code](#tab/vscode-aztools)

## Create an Azure Container Registry

If you already have an Azure Container Registry, you can skip this step. Otherwise, create a new Azure Container Registry by using VS Code.

> [!IMPORTANT]
> The steps in this section assume that you previously completed the **VS Code** sections of part 2 of this tutorial series.

1. In the Docker extension in VS Code, go to **REGISTRIES** and select **Azure** to connect to the Azure Container Registry.
1. In VS Code, select **F1** or **CTRL+SHIFT+P** to open the command palette. Then type "registry" and select the **Azure Container Registry: Create Registry** task.

    Alternatively, in the Docker extension **REGISTRIES** section, right-click your subscription, and select **Create Registry**. This action starts the same create registry task.

1. Follow the prompts and enter the following values:

    * **Registry name**: Enter a unique name such as **msdocscontainerregistryname**. The registry name must be globally unique within Azure and contain 5-50 alphanumeric characters. If the name is already taken, choose a different name.

    * **SKU**: Select **Standard**.

    * **Resource group**: Use your existing resource group.

1. In the Docker extension, in the **REGISTRIES** section, find the registry you created, right-click, and select **View Properties**.

    In the output, locate the `loginServer` value - the fully qualified registry name (for example, `msdocscontainerregistryname.azurecr.io`).
    
    **Example output:**
    
    ```json
    {
      "loginServer": "msdocscontainerregistryname.azurecr.io",
      "name": "msdocscontainerregistryname",
      ...
    }
    ```

## Build an image in Azure Container Registry

You can generate the container image directly in Azure through various approaches:

  * The Azure Cloud Shell enables you to construct the image entirely in the cloud, independent of your local environment.
  * Alternatively, you can use VS Code or the Azure CLI to create the image in Azure from your local setup, without needing Docker to be running locally.

These steps require that VS Code is opened in the working folder of your web app.

1. In the Docker extension, click **REGISTRIES** and then click **Azure** to connect to the Azure Container Registry.

    :::image type="content" source="./media/tutorial-container-web-app/visual-studio-code-build-image-registries.png" lightbox="./media/tutorial-container-web-app/visual-studio-code-build-image-registries.png" alt-text="A screenshot showing how to check that Azure is signed into Docker Extension in Visual Studio Code." :::

1. Select **F1** or **CTRL+SHIFT+P** to open the command palette, type "registry", and select the **Azure Container Registry: Build Image in Azure** task.

    If you don't see the task, make sure that **Azure** appears under **REGISTRIES** in the Docker extension. You can also right-click the *Dockerfile* and select **Build Image in Azure** to run the task.

1. Input the following values and follow the prompts to create the image.

    * **Tag image**: Use the image name "msdocspythoncontainerwebapp:latest".
    * **Registry provider**: Select **Azure**.
    * **Subscription**: Select the subscription you used to create the Azure Container Registry.
    * **Registry**: Select the registry you created or one to which you have access.
    * **Base OS image**: Select **Linux**.

    Check the **OUTPUT** window for progress and information on the build. If you get a credentials error, right-click the registry in the **REGISTRIES** section of the Docker extension and select **Refresh**.

1. Confirm the image in the Azure Container Registry.

    1. In the Docker extension, in the **REGISTRIES** section, find the container image created. You might need to close and re-open VS Code to see the image.

    1. Confirm the name and tag **latest**.

    **CLI verification (optional):**
    
    Verify the image using the Azure CLI:

    ```azurecli-interactive
    az acr repository list -n $REGISTRY_NAME
    ```
    
    **Expected output:**
    
    ```json
    [
      "msdocspythoncontainerwebapp"
    ]
    ```

    :::image type="content" source="./media/tutorial-container-web-app/visual-studio-code-build-image-confirm.png" lightbox="./media/tutorial-container-web-app/visual-studio-code-build-image-confirm.png" alt-text="A screenshot showing how to confirm the  information to  build container in Azure in Visual Studio Code." :::

---

## Next step

> [!div class="nextstepaction"]
> [Deploy web app](tutorial-containerize-deploy-python-web-app-azure-04.md)
