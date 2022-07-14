---
title: Deploy a Go web app to Azure Container Apps
description: In this tutorial, you'll learn how to use Docker, Azure Container Registry, and Azure Container Apps to deploy a Go web app to Azure.
ms.topic: quickstart
ms.date: 07/12/2022
ms.custom: devx-track-go
---

# Deploy a Go web app to Azure Container Apps

In this quickstart, you'll learn to deploy a containerized Go web app to Azure Container Apps.

Azure Container Apps lets you execute application code package in any container without having to manage complicated cloud infrastructure or complex container orchestrators. Allowing you to deploy code packaged in any container to run without worrying about the runtime or programming model. Common uses of Azure Container apps include: Deploying API endpoints, hosting background processing applications, handling event-driven processing, and running microservices.

Follow this tutorial to walk through building a docker image, deploying that image to Azure Container Registry, and deploying a Go web app to Azure Container Apps.

## Prerequisites

[!INCLUDE [azure-subscription.md](includes/azure-subscription.md)]
- **Go installed**: Version 1.18 or [above](https://golang.org/dl/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

## Download the sample app

To follow this tutorial, you'll need a sample application to containerize. A sample Go web app is provided in the [msdocs-go-webapp-quickstart](https://github.com/Azure-Samples/msdocs-go-webapp-quickstart) GitHub repository. Download or clone the sample application to your local workstation.

```bash
git clone https://github.com/Azure-Samples/msdocs-go-webapp-quickstart.git

cd msdocs-go-webapp-quickstart
```

## Create an Azure Container Registry

Azure Container Registry allows you to build, store, and manage container images. You'll use it to store the Docker image that contains the sample Go web app provided in the sample repository mentioned previously.

Run the following commands to create an Azure Contain Registry:

1. Create an Azure resource group.
    ```bash
    az group create --name <resourceGroupName> --location eastus
    ```
1. Create an Azure Container Registry.
    ```bash
    az acr create --resource-group <resourceGroupName> --name <azureContainerRegistryName> --sku basic --admin-enabled true
    ```
1. Sign in to the Azure container instance.
    ```bash
    az acr login --name <azureContainerRegistryName>  
    ```

Repace `<resourceGroupName>` and `<azureContainerRegistryName>` with the appropriate values.

### Build and push the Docker image

Once you've created an Azure Container Registry, build and push the Docker image of the sample Go web app.

Run the following commands build and push the image to registry:

1. Get the sign-in server information.
    ```bash
    az acr list --query "[].loginServer" 
    ```
1. Build and push the docker image to ACR.
    ```bash
    docker build -t <loginServer>/<imageName>:latest
    ```
2. Push the docker image to ACR.
    ```bash
    docker push <loginServer>/<imageName>:latest
    ```
3. Verify the image was deployed to ACR.
    ```bash
    az acr repository list --name <azureContainerRegistryName> --output table
    ```

Replace `loginServer`, `azureContainerRegistryName`, and `imageName` with the appropriate values. The image name is the Docker image that is pushed to Azure Container Registry and later used to deploy to Azure Container Apps.

Now that you've got an image available in Azure Container Registry, you're ready to deploy the Azure Container App and its environment. 

### Deploy an Azure Container App environment

Azure Container Apps doesn't have the complexity of a container orchestrator, but it still needs some way to establish secure boundaries, which is where Azure Container Apps environments come in. Apps deployed in the same environment share the same virtual network and write logs to the same Log Analytics workspace. Before you can deploy an Azure Container App, you'll need an environment to deploy to.

Run the following commands to create an Azure Container App environment:

1. Get the ARC admin password.
    ```bash
    password=$(az acr credential show -n <azureContainerRegistryName> --query 'passwords[0].value' --out tsv)
    ```
2. Create a container app environment.
    ```bash
    az containerapp env create \
    --name <containerAppEnvName> \
    --resource-group <resourceGroupName> \
    --location "East US"
    ```

## Deploy to Azure Container Apps

At this point, you've created, built, deployed a Docker Image to Azure Container and created an environment for your container app. All that's left is to deploy the application.

Run the following command to deploy the Go web app to Azure Container Registry:

```bash
az containerapp create \
--name <containerAppName> \
--resource-group <resourceGroupName> \
--environment <goWebAppContainerAppEnv> \
--image "<loginServer>/<imageName>:latest" \
--registry-server "<loginServer>" \
--registry-username "<azureContainerRegistryName" \
--registry-password "$password" \
--target-port 8080 \
--ingress 'external'
```

## Verify the web app Url

Run the following AzureCLI command to get the FQDN of the web application's ingress.

```bash
az containerapp list --query "[].properties.configuration.ingress.fqdn" 
```

Next, run the curl command against the FQDN and confirm output reflects the HTML of the website.

```bash
curl <FQDN>
```

## Clean-up resources

When you're finished with the sample app, you can remove all of the resources for the app from Azure. It will not incur extra charges and keep your Azure subscription uncluttered. Removing the resource group also removes all resources in the resource group and is the fastest way to remove all Azure resources for your app.

```bash
az group delete \
    --name <resourceGroupName> \
    --no-wait
```

## Next steps

> [!div class="nextstepaction"]
> [Key Azure Services for Go developers](key-azure-services-for-go.md)

> [!div class="nextstepaction"]
> [Configure Visual Studio Code for Go Development](configure-visual-studio-code.md)
