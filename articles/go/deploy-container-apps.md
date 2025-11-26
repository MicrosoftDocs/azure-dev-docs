---
title: Deploy a Go web app to Azure Container Apps
description: In this tutorial, you learn how to use Docker, Azure Container Registry, and Azure Container Apps to deploy a Go web app to Azure.
ms.topic: quickstart
ms.date: 11/24/2025
ms.custom: devx-track-go, devx-track-azurecli
---

# Deploy a Go web app to Azure Container Apps

In this quickstart, you learn to deploy a containerized Go web app to Azure Container Apps.

[Azure Container Apps](/azure/container-apps/) lets you run application code packaged in any container without managing complicated cloud infrastructure or complex container orchestrators. It also eliminates the need to worry about the runtime or programming model. Common uses of Azure Container Apps include: Deploying API endpoints, hosting background processing applications, handling event-driven processing, and running microservices.

Follow this tutorial to walk through building a Docker image, deploying that image to Azure Container Registry, and deploying a Go web app to Azure Container Apps.

## Prerequisites

[!INCLUDE [azure-subscription.md](includes/azure-subscription.md)]
- **Go installed**: Version 1.18 or [above](https://go.dev/dl/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

## Setup

To sign in to Azure from the CLI, run the [az login](/cli/azure/reference-index#az-login) command and follow the prompts to complete the authentication process.

```azurecli
az login
```

To ensure you're running the latest version of the CLI, run the [az upgrade](/cli/azure/reference-index#az-upgrade) command.

```azurecli
az upgrade
```

Next, install or update the Azure Container Apps extension for the CLI.

If you receive errors about missing parameters when you run `az containerapp` commands in Azure CLI, make sure you have the latest version of the Azure Container Apps extension installed.

```azurecli
az extension add --name containerapp --upgrade
```

> [!NOTE]
> Starting in May 2024, Azure CLI extensions no longer enable preview features by default. To access Container Apps [preview features](/azure/container-apps/whats-new), install the Container Apps extension with `--allow-preview true`.
>
> ```azurecli
> az extension add --name containerapp --upgrade --allow-preview true
> ```

Now that the current extension or module is installed, register the `Microsoft.App`, `Microsoft.ContainerRegistry`, and `Microsoft.OperationalInsights` namespaces.

```azurecli
az provider register --namespace Microsoft.App
az provider register --namespace Microsoft.ContainerRegistry
az provider register --namespace Microsoft.OperationalInsights
```

> [!NOTE]
> Azure Container Apps resources migrated from the `Microsoft.Web` namespace to the `Microsoft.App` namespace. For more information, see [Namespace migration from Microsoft.Web to Microsoft.App in March 2022](https://github.com/microsoft/azure-container-apps/issues/109).

## Download the sample app

To follow this tutorial, you need a sample application to containerize. The [msdocs-go-webapp-quickstart](https://github.com/Azure-Samples/msdocs-go-webapp-quickstart) GitHub repository provides a sample Go web app. Download or clone the sample application to your local workstation.

```bash
git clone https://github.com/Azure-Samples/msdocs-go-webapp-quickstart.git

cd msdocs-go-webapp-quickstart
```

## Create an Azure Container Registry

[Azure Container Registry](/azure/container-registry/) allows you to build, store, and manage container images. Use it to store the Docker image that contains the sample Go web app provided in the sample repository mentioned previously.

Run the following commands to create an Azure Container Registry:

1. Set environment variables for the resources you'll create. Replace the placeholder text in brackets with the appropriate values. Your Azure Container Registry name needs to be globally unique.

    ```bash
    RESOURCE_GROUP_NAME="<resourceGroupName>"  # Name of the Azure resource group to create
    LOCATION="<location>"                      # Azure region (For example, "eastus", "westus2")
    ACR_NAME="<azureContainerRegistryName>"    # Globally unique name for Azure Container Registry
    ```

    The example commands for setting the environment variables are for the Bash shell. If you're using a different shell, adjust the commands accordingly.

1. Create an Azure resource group with the [az group create](/cli/azure/group#az-group-create) command.

    ```azurecli
    az group create \
        --name $RESOURCE_GROUP_NAME \
        --location $LOCATION
    ```

1. Create an Azure Container Registry with the [az acr create](/cli/azure/acr#az-acr-create) command.

    ```azurecli
    az acr create \
        --resource-group $RESOURCE_GROUP_NAME \
        --name $ACR_NAME \
        --sku basic
    ```

1. Sign in to the Azure container instance with the [az acr login](/cli/azure/acr#az-acr-login) command.

    ```azurecli
    az acr login --name $ACR_NAME
    ```

    > [!NOTE]
    > If you get an error similar to the following error when you run the `az acr login` command, make sure the Docker daemon is running on your system:
    >
    > ```output
    > You may want to use 'az acr login -n $ACR_NAME --expose-token' to get an access token, which doesn't require Docker to be installed.
    > An error occurred: DOCKER_COMMAND_ERROR
    > ```

### Build and push the Docker image

After you create an Azure Container Registry, build and push the Docker image of the sample Go web app.

Run the following commands to build and push the image to the registry.

1. Set environment variable for the Docker image you'll create. Replace the placeholder text in brackets with the appropriate values.

    ```bash
    IMAGE_NAME="go-webapp"  # Name for the Docker image
    ```
    The example commands for setting the environment variables are for the Bash shell. If you're using a different shell, adjust the commands accordingly.

1. Get the sign-in server information with the [az acr show](/cli/azure/acr#az-acr-show) command and store it in an environment variable.

    ```azurecli
    LOGIN_SERVER=$(az acr show \
        --name $ACR_NAME \
        --resource-group $RESOURCE_GROUP_NAME \
        --query loginServer \
        --output tsv)

    echo "Login server: $LOGIN_SERVER"
    ```

1. Build the Docker image locally.

    ```bash
    docker build -t $LOGIN_SERVER/$IMAGE_NAME:latest .
    ```

1. Push the Docker image to Azure Container Registry.

    ```bash
    docker push $LOGIN_SERVER/$IMAGE_NAME:latest
    ```

1. Verify the image was successfully pushed to Azure Container Registry with the [az acr repository list](/cli/azure/acr#az-acr-list) command.

    ```azurecli
    az acr repository list \
        --name $ACR_NAME \
        --output table
    ```

Now that you have an image available in Azure Container Registry, you're ready to deploy the Azure Container App and its environment.

### Create an Azure Container Apps environment

Azure Container Apps doesn't have the complexity of a container orchestrator, but it still needs some way to establish secure boundaries. Azure Container Apps environments provide this capability. Container Apps deployed in the same environment share the same virtual network and write logs to the same Log Analytics workspace. Before you can deploy an Azure Container App, you need an environment to deploy to.

1. Set environment variables for the resources you'll create. Replace the placeholder text in brackets with the appropriate values.

    ```bash
    CONTAINER_APP_ENV="mygoappenv"  # Name for the Container Apps environment
    CONTAINER_APP_NAME="mygoapp"    # Name for your container app
    ```
    The example commands for setting the environment variables are for the Bash shell. If you're using a different shell, adjust the commands accordingly.

1. Run the [az containerapp env create](/cli/azure/containerapp/env#az-containerapp-env-create) command to create an Azure Container Apps environment.

    ```azurecli
    az containerapp env create \
        --name $CONTAINER_APP_ENV \
        --resource-group $RESOURCE_GROUP_NAME \
        --location $LOCATION
    ```

## Deploy to Azure Container Apps

At this point, you've completed the following steps:

- Created an Azure Container Registry.
- Built and pushed a Docker image to the registry.
- Set up an Azure Container Apps environment.

The last step is to deploy the application.

Run the [az containerapp create](/cli/azure/containerapp#az-containerapp-create) command to deploy the Go web app to Azure Container Apps.

```azurecli
az containerapp create \
    --name $CONTAINER_APP_NAME \
    --resource-group $RESOURCE_GROUP_NAME \
    --environment $CONTAINER_APP_ENV \
    --image "$LOGIN_SERVER/$IMAGE_NAME:latest" \
    --registry-server "$LOGIN_SERVER" \
    --registry-identity system \
    --target-port 8080 \
    --ingress external
```

The `--registry-identity system` parameter configures the system-assigned **[managed identity](/azure/active-directory/managed-identities-azure-resources/overview)** on the container app. The container app uses this identity rather than username and password, which is less secure, to authenticate with the container registry. The command also automatically creates an [`AcrPull` role](/azure/role-based-access-control/built-in-roles/containers#acrpull) assignment for the identity, authorizing it to pull images from the registry. To use managed identities for authentication and authorization, the registry must be an Azure Container Registry.

## Verify the web app URL

1. Run the [az containerapp show](/cli/azure/containerapp#az-containerapp-show) command to get the FQDN (Fully Qualified Domain Name) of the web application's ingress.

    ```azurecli
    APP_FQDN=$(az containerapp show \
        --name $CONTAINER_APP_NAME \
        --resource-group $RESOURCE_GROUP_NAME \
        --query properties.configuration.ingress.fqdn \
        --output tsv)

    echo "App URL: https://$APP_FQDN"
    ```

1. Run the curl command against the FQDN and confirm the output reflects the HTML of the website. You can also open the URL in a web browser to interact with the web app.

    ```bash
    curl "https://$APP_FQDN"
    ```

    `The command returns the HTML for the web app's home page similar to the following:

    ```html
    <!DOCTYPE html>
    <html>

    <head>
        <title>Hello Azure - Go Quickstart</title>
        <link rel="stylesheet" href="/assets/main.css">
        <link rel="icon" type="image/x-icon" href="/assets/favicon.ico">
    </head>

    <header>
        <h1>Welcome to Azure</h1>
    </header>

    <section>
        <img src="/assets/images/azure-icon.svg">
        <form method="post">
            <label for="form-label">Could you please tell me your name?</label><br>
            <input type="text" id="name" name="name" style="max-width: 256px;"><br>
            <button type="submit">Say Hello</button>
        </form>
    </section>

    </html>
    ```

## Clean up resources

When you're finished with the sample app, you can remove all of the resources for the app from Azure. Doing so avoids ongoing charges and keeps your Azure subscription uncluttered. Removing the resource group also removes all resources in the resource group and is the fastest way to remove all Azure resources for your app.

Run the [az group delete](/cli/azure/group#az-group-delete) command to delete the resource group and its resources.

```azurecli
az group delete \
    --name $RESOURCE_GROUP_NAME \
    --no-wait
```

## Next steps

> [!div class="nextstepaction"]
> [Key Azure Services for Go developers](key-azure-services-for-go.md)

> [!div class="nextstepaction"]
> [Configure Visual Studio Code for Go Development](configure-visual-studio-code.md)
