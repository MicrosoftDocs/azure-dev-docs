---
title: Deploy a Go web app to Azure Container Apps
description: In this tutorial, you learn how to use Docker, Azure Container Registry, and Azure Container Apps to deploy a Go web app to Azure.
ms.topic: quickstart
ms.date: 09/12/2024
ms.custom: devx-track-go, devx-track-azurecli
---

# Deploy a Go web app to Azure Container Apps

In this quickstart, you learn to deploy a containerized Go web app to Azure Container Apps.

Azure Container Apps lets you execute application code packaged in any container without having to manage complicated cloud infrastructure or complex container orchestrators, and without worrying about the runtime or programming model. Common uses of Azure Container Apps include: Deploying API endpoints, hosting background processing applications, handling event-driven processing, and running microservices.

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

If you receive errors about missing parameters when you run `az containerapp` commands in Azure CLI, be sure you have the latest version of the Azure Container Apps extension installed.

```azurecli
az extension add --name containerapp --upgrade
```

> [!NOTE]
> Starting in May 2024, Azure CLI extensions no longer enable preview features by default. To access Container Apps [preview features](/azure/container-apps/whats-new), install the Container Apps extension with `--allow-preview true`.
>
> ```azurecli
> az extension add --name containerapp --upgrade --allow-preview true
> ```

Now that the current extension or module is installed, register the `Microsoft.App` and `Microsoft.OperationalInsights` namespaces.

> [!NOTE]
> Azure Container Apps resources have migrated from the `Microsoft.Web` namespace to the `Microsoft.App` namespace. Refer to [Namespace migration from Microsoft.Web to Microsoft.App in March 2022](https://github.com/microsoft/azure-container-apps/issues/109) for more details.

```azurecli
az provider register --namespace Microsoft.App
```

```azurecli
az provider register --namespace Microsoft.OperationalInsights
```

## Download the sample app

To follow this tutorial, you need a sample application to containerize. A sample Go web app is provided in the [msdocs-go-webapp-quickstart](https://github.com/Azure-Samples/msdocs-go-webapp-quickstart) GitHub repository. Download or clone the sample application to your local workstation.

```bash
git clone https://github.com/Azure-Samples/msdocs-go-webapp-quickstart.git

cd msdocs-go-webapp-quickstart
```

## Create an Azure Container Registry

Azure Container Registry allows you to build, store, and manage container images. You'll use it to store the Docker image that contains the sample Go web app provided in the sample repository mentioned previously.

Run the following commands to create an Azure Container Registry:

1. Create an Azure resource group with the [az group create](/cli/azure/group#az-group-create) command.

    ```azurecli
    
    
    az group create \
        --name <resourceGroupName> \
        --location eastus
    ```

1. Create an Azure Container Registry with the [az acr create](/cli/azure/acr#az-acr-create) command.

    ```azurecli
    az acr create \
        --resource-group <resourceGroupName> \
        --name <azureContainerRegistryName> \
        --sku basic
    ```

1. Sign in to the Azure container instance with the [az acr login](/cli/azure/acr#az-acr-login) command.

    ```azurecli
    az acr login --name <azureContainerRegistryName>  
    ```

Replace `<resourceGroupName>` and `<azureContainerRegistryName>` with the appropriate values. Your Azure Container Registry name needs to be globally unique.

> [!NOTE]
> If you get an error similar to the following:
>
> ```output
> You may want to use 'az acr login -n <azureContainerRegistryName> --expose-token' to get an access token, which does not require Docker to be installed.
> 2024-09-12 17:25:25.127779 An error occurred: DOCKER_COMMAND_ERROR
> ```
>
> Make sure that the Docker deamon is running on your system.

### Build and push the Docker image

Once you've created an Azure Container Registry, build and push the Docker image of the sample Go web app.

Run the following commands build and push the image to the registry:

1. Get the sign-in server information with the [az acr show](/cli/azure/acr#az-acr-show) command.

    ```azurecli
    az acr show \
        --name <azureContainerRegistryName> \
        --resource-group <resourceGroupName> \
        --query loginServer \
        --output tsv  
    ```

1. Build the Docker image locally.

    ```bash
    docker build -t <loginServer>/<imageName>:latest .
    ```

1. Push the Docker image to Azure Container Registry.

    ```bash
    docker push <loginServer>/<imageName>:latest
    ```

1. Verify the image was successfully pushed to Azure Container Registry with the [az acr repository list](/cli/azure/acr#az-acr-list) command.

    ```azurecli
    az acr repository list \
        --name <azureContainerRegistryName> \
        --output table
    ```

Replace `loginServer`, `imageName`, and `azureContainerRegistryName` with the appropriate values. The image name is the Docker image that is pushed to Azure Container Registry and later used to deploy to Azure Container Apps.

Now that you've got an image available in Azure Container Registry, you're ready to deploy the Azure Container App and its environment. 

### Create an Azure Container Apps environment

Azure Container Apps doesn't have the complexity of a container orchestrator, but it still needs some way to establish secure boundaries, which is where Azure Container Apps environments come in. Container Apps deployed in the same environment share the same virtual network and write logs to the same Log Analytics workspace. Before you can deploy an Azure Container App, you need an environment to deploy to.

1. Run the [az containerapp env create](/cli/azure/containerapp/env#az-containerapp-env-create) command to create an Azure Container Apps environment.

    ```azurecli
    az containerapp env create \
        --name <containerAppEnvName> \
        --resource-group <resourceGroupName> \
        --location "East US"
    ```

## Deploy to Azure Container Apps

At this point, you've created an Azure Container Registry, built and pushed a Docker image to it, and created an Azure Container Apps environment. All that's left is to deploy the application.

Run the [az containerapp create](/cli/azure/containerapp#az-containerapp-create) command to deploy the Go web app to Azure Container Apps.

```azurecli
az containerapp create \
    --name <containerAppName> \
    --resource-group <resourceGroupName> \
    --environment <containerAppEnvName> \
    --image "<loginServer>/<imageName>:latest" \
    --registry-server "<loginServer>" \
    --registry-identity system \
    --target-port 8080 \
    --ingress external
```

The `--registry-identity system` configures the system-assigned managed identity on the container app. The container app uses this identity rather than username/password to authenticate with the container registry. The registry must be an Azure Container Registry. The command also creates an 'acrpull' role assignment for the identity.

## Verify the web app URL

Run the [az containerapp show](/cli/azure/containerapp#az-containerapp-show) command to get the FQDN (Fully Qualified Domain Name) of the web application's ingress.

```azurecli
APP_FQDN=$(az containerapp show \
    --name <containerAppName> \
    --resource-group <resourceGroupName> \
    --query properties.configuration.ingress.fqdn \
    --output tsv)
```

Next, run the curl command against the FQDN and confirm output reflects the HTML of the website.

```bash
curl "https://$APP_FQDN"
```

## Clean-up resources

When you're finished with the sample app, you can remove all of the resources for the app from Azure. Doing so avoids ongoing charges and keeps your Azure subscription uncluttered. Removing the resource group also removes all resources in the resource group and is the fastest way to remove all Azure resources for your app.

Run the [az group delete](/cli/azure/group#az-group-delete) command to delete the resource group and its resources.

```azurecli
az group delete \
    --name <resourceGroupName> \
    --no-wait
```

## Next steps

> [!div class="nextstepaction"]
> [Key Azure Services for Go developers](key-azure-services-for-go.md)

> [!div class="nextstepaction"]
> [Configure Visual Studio Code for Go Development](configure-visual-studio-code.md)
