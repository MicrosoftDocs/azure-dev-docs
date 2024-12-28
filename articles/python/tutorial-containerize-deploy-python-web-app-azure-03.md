---
title: Build a containerized Python web app in Azure Container Registry
description: Build a containerized Python web app (Django or Flask) in Azure Container Registry, without the need for Docker installed locally.
ms.topic: conceptual
ms.date: 10/09/2023
ms.custom: devx-track-python, py-fresh-zinc, devx-track-azurecli
---

# Build a containerized Python web app in the cloud

This article is part of a tutorial about how to containerize and deploy a Python web app to Azure App Service. App Service enables you to run containerized web apps and deploy through continuous integration/continuous deployment (CI/CD) capabilities with Docker Hub, Azure Container Registry, and Visual Studio Team Services. In this part of the tutorial, you learn how to build the containerized Python web app in the cloud.

In the previous *optional* part of this tutorial, a container image was built and run locally. In contrast, in this part of the tutorial, you build (containerize) a Python web app into a Docker image directly in [Azure Container Registry](/azure/container-registry/container-registry-intro). Building the image in Azure is typically faster and easier than building locally and then pushing the image to a registry. Also, building in the cloud doesn't require Docker to be running in your dev environment.

Once the Docker image is in Azure Container Registry, it can be deployed to Azure App service.

This service diagram highlights the components covered in this article.

:::image type="content" source="./media/tutorial-container-web-app/containerization-of-python-apps-build-cloud.png" alt-text="A screenshot of the services using in the Tutorial - Containerized Python App on Azure with the build-in-cloud path highlighted." lightbox="./media/tutorial-container-web-app/containerization-of-python-apps-build-cloud.png":::

## Create an Azure Container Registry

If you already have an Azure Container Registry you can use, go to the next step. If you don't, create one.

### [Azure CLI](#tab/azure-cli)

Azure CLI commands can be run in the [Azure Cloud Shell](https://shell.azure.com/) or on a workstation with the [Azure CLI installed](/cli/azure/install-azure-cli). When running in Cloud Shell, skip **Step 3**.

1. Create a resource group if needed with the [az group create](/cli/azure/group#az-group-create) command. If you've already set up an Azure Cosmos DB for MongoDB account in part **2. Build and test container locally** of this tutorial, set the RESOURCE_GROUP_NAME environment variable to the name of the resource group you used for that account and move on to the next step.

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

### [VS Code](#tab/vscode-aztools)

These steps require the [Docker extension](https://code.visualstudio.com/docs/containers/overview) for VS Code.

1. Select **F1** or **CTRL+SHIFT+P** to open the command palette. Then type "registry" and select the **Azure Container Registry: Create Registry** task.

    Alternatively, in the Docker extension **REGISTRIES** section, right-click your subscription, and select **Create Registry**. This UI action starts the same create registry task.

1. Follow the prompts and enter the following values:

    * **Registry name**: The registry name must be unique within Azure, and contain 5-50 alphanumeric characters.

    * **SKU**: Select **Standard**.

    * **Resource group**: Use an existing group or create a new one.

    * **Location**: If you're using an existing resource group, select the location to match. Otherwise, the location is where the resource group is created that contains the registry.

    :::image type="content" source="./media/tutorial-container-web-app/visual-studio-code-create-registry.gif" lightbox="./media/tutorial-container-web-app/visual-studio-code-create-registry.gif" alt-text="An animated GIF showing how to create a registry in Visual Studio Code." :::

1. In the Docker extension, in the **REGISTRIES** section, find the registry you created, right-click, and select **View Properties**.

    Look for the `loginServer` key value pair in the output. The value is the fully qualified name of the registry.

    :::image type="content" source="./media/tutorial-container-web-app/visual-studio-code-registry-get-properties.png" lightbox="./media/tutorial-container-web-app/visual-studio-code-registry-get-properties.png" alt-text="A screenshot showing how to get the properties of a registry in Visual Studio Code." :::

### [Azure portal](#tab/azure-portal)

Sign in to the [Azure portal](https://portal.azure.com/) and follow these steps to create an Azure Container Registry.

1. Search for "container registry" and select **Container Registry** under **Marketplace** in the results.

1. Under the **Basics** tab on the **Create container registry** form, enter the following values:

    * **Resource group**: Use an existing group or create a new one.
    * **Registry name**: The registry name must be unique within Azure, and contain 5-50 alphanumeric characters.
    * **Location**: If you are using an existing resource group, select the location to match. Otherwise, the location is where the resource group is created that contains the registry.
    * **SKU**: Select **Standard**.

    :::image type="content" source="./media/tutorial-container-web-app/portal-create-registry-form.png" lightbox="./media/tutorial-container-web-app/portal-create-registry-form.png" alt-text="A screenshot showing how to specify a new registry in Azure portal." :::

    When you're finished, select **Review + create**. After the validation is complete, select **Create**.

1. After the deployment completes, go to the new registry, and find the fully qualified name.

    1. On the **service menu**, select **Overview**.
    1. Copy the **Login server** value. It should be a fully qualified name with "azurecr.io".

    :::image type="content" source="./media/tutorial-container-web-app/portal-create-registry-login-server.png" lightbox="./media/tutorial-container-web-app/portal-create-registry-login-server.png" alt-text="A screenshot that shows how to find the login server value for the registry in Azure portal." :::

1. The admin account is required to deploy a container image from a registry to Azure Web Apps for Containers.

    1. On the **service menu**, select **Access Keys**.
    1. Select **Enabled** for the **Admin User**.

    :::image type="content" source="./media/tutorial-container-web-app/portal-create-registry-enable-admin-user.png" lightbox="./media/tutorial-container-web-app/portal-create-registry-enable-admin-user.png" alt-text="A screenshot that shows how to enable the admin user for the registry in Azure portal." :::

    The registry [admin account](/azure/container-registry/container-registry-authentication#admin-account) is needed when you use the Azure portal to deploy a container image as is shown in this tutorial. The admin account is only used during the creation of the App Service. After the App Service is created, managed identity is used to pull images from the registry and the admin account can be disabled.

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

    ```azurecli
    az acr repository list -n $REGISTRY_NAME
    ```

### [VS Code](#tab/vscode-aztools)

These steps require the [Docker extension](https://code.visualstudio.com/docs/containers/overview) for VS Code. VS Code needs to be opened in the working folder of your web app.

1. In the Docker extension, go to **REGISTRIES** and connect to Azure.

    :::image type="content" source="./media/tutorial-container-web-app/visual-studio-code-build-image-registries.png" lightbox="./media/tutorial-container-web-app/visual-studio-code-build-image-registries.png" alt-text="A screenshot showing how to check that Azure is signed into Docker Extension in Visual Studio Code." :::

1. Select **F1** or **CTRL+SHIFT+P** to open the command palette, type "registry", and select the **Azure Container Registry: Build Image in Azure** task.

    If you don't see the task, make sure that **Azure** appears under **REGISTRIES** in the Docker extension. You can also right-click the *Dockerfile* and select **Build Image in Azure** to run the task.

1. Follow the prompts and enter the following values to build the image.

    * **Tag image**: Use the image name "msdocspythoncontainerwebapp:latest".
    * **Registry**: Select the registry you created above or one you have access to.
    * **Base OS image**: Select **Linux**.

    :::image type="content" source="./media/tutorial-container-web-app/visual-studio-code-build-image-prompts.gif" lightbox="./media/tutorial-container-web-app/visual-studio-code-build-image-prompts.gif" alt-text="A screenshot showing how to provide information to  build container in Azure in Visual Studio Code." :::

    Check the **OUTPUT** window for progress and information on the build. If you get a credentials error, right-click the registry in the **REGISTRIES** section of the Docker extension and select **Refresh**.

1. Confirm the image in the Azure Container Registry.

    1. In the Docker extension, in the **REGISTRIES** section, find the container image created.

    1. Confirm the name and tag "latest".

    :::image type="content" source="./media/tutorial-container-web-app/visual-studio-code-build-image-confirm.png" lightbox="./media/tutorial-container-web-app/visual-studio-code-build-image-confirm.png" alt-text="A screenshot showing how to confirm the  information to  build container in Azure in Visual Studio Code." :::

### [Azure portal](#tab/azure-portal)

Sign in to the [Azure portal](https://portal.azure.com/) to complete these steps.

1. Open [Azure Cloud Shell](/azure/cloud-shell/overview).

    :::image type="content" source="./media/tutorial-container-web-app/portal-cloud-shell-icon.png" alt-text="A screenshot of the Azure portal showing the Cloud Shell icon." :::

1. Build the image with the [az acr build](/cli/azure/acr#az-acr-build) command.

    ```azurecli
    az acr build \
      -r <registry-name> \
      -g <resource-group> \
      -t msdocspythoncontainerwebapp:latest \
      <repo-path>
    ```

    The last argument in the command is the fully qualified path to the repo. Use https://github.com/Azure-Samples/msdocs-python-django-container-web-app.git for the Django sample app and https://github.com/Azure-Samples/msdocs-python-flask-container-web-app.git for the Flask sample app.

1. Confirm the container image was created with the [az acr repository list](/cli/azure/acr/repository#az-acr-repository-list) command.

    ```azurecli
    az acr repository list -n <registry-name>
    ```

---

## Next step

> [!div class="nextstepaction"]
> [Deploy web app](tutorial-containerize-deploy-python-web-app-azure-04.md)
