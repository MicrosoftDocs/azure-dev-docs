---
title: Add custom domain name to web app
description: Add your custom domain name to your Azure web app using the Azure CLI.
ms.topic: how-to
ms.date: 06/25/2017
ms.custom: seo-javascript-september2019, seo-javascript-october2019, devx-track-js, devx-track-azurecli
---

# Create and use container registry

A container registry is ideal for container images you want to deploy to Azure.

The registry allows you to manage container repositories and versions.  

## Create a container registry


Create a registry with a resource name. The resource name becomes part of the login server name for your resource. 

Use the [az acr create](/cli/azure/acr?view=azure-cli-latest#az_acr_create) command to create a registry. 

```azurecli
az acr create \
    --resource-group YOUR-RESOURCE-GROUP
    --name YOUR-REGISTRY-NAME 
    --location westus 
    --admin-enabled
    --sku Basic
    --public-network-enabled false
```

## Get container registry credentials

To retrieve credentials, run the [az acr credential show](/cli/azure/acr/credential?view=azure-cli-latest#az_acr_credential_show) command and note the displayed username and password:

```azurecli
az acr credential show \
    --resource-group YOUR-RESOURCE-GROUP \
    --name YOUR-REGISTRY-NAME
```

## Login to container registry with Docker CLI

Using the credentials from the previous step, and your individual login server, you can log in to the registry using the standard Docker CLI workflow.

```bash
docker login YOUR-LOGIN_SERVER \
    --username USERNAME
    --password PASSWORD
```

## Tag your local image

You can now tag your Docker container to indicate that it's associated with your private registry using the following command (replacing `YOURALIAS/IMAGENAME` with the name you gave the container image.

```bash
docker tag YOURALIAS/IMAGENAME \
    YOUR-LOGIN_SERVER/YOURALIAS/IMAGENAME:v1
```

## Push your local image to your container registry

```bash
docker push YOUR-LOGIN_SERVER/YOURALIAS/IMAGENAME:v1
```

## Configure web app to use container 

In configure the App Service web app to pull the image from your registry, run the following [az appservice web config container set](/cli/azure/webapp/config/container?view=azure-cli-latest#az_webapp_config_container_set) command:

```azurecli
az appservice web config container set \
    --resource-group YOUR-RESOURCE-GROUP \
    --name YOUR-WEBAPP-NAME
    --docker-registry-server-url YOUR-LOGIN_SERVER \
    --docker-custom-image-name YOUR-LOGIN_SERVER/YOURALIAS/IMAGENAME:v1 \
    -u USERNAME \
    -p PASSWORD
```

Make sure to add the `https://` prefix to the beginning of the `--docker-registry-server-url` option. However, don't add the prefix to the container image name.

## Next steps

* [Create mongodb CosmosDB resource](create-mongodb-cosmosdb.md)