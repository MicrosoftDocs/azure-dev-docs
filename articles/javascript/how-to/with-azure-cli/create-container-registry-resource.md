---
title: Create custom container registry
description: A container registry is ideal for container images you want to deploy to Azure. The registry allows you to manage container repositories and versions.
ms.topic: how-to
ms.date: 01/07/2022
ms.custom: devx-track-js, devx-track-azurecli
---

# Create and use container registry

A container registry is ideal for container images you want to deploy to Azure.

The registry allows you to manage container repositories and versions.  

## Create a container registry

Create a registry with a resource name. The resource name becomes part of the login server name, identified as `loginServer` in the result, for your resource. 

Use the [`az acr create`](/cli/azure/acr#az-acr-create) command to create a registry. 

```azurecli
az acr create \
    --resource-group YOUR-RESOURCE-GROUP \
    --name YOUR-REGISTRY-NAME \
    --location westus \ 
    --admin-enabled \
    --sku Basic \
    --public-network-enabled true
```


## Get container registry credentials

To retrieve credentials, run the [`az acr credential show`](/cli/azure/acr/credential#az-acr-credential-show) command and note the displayed username and password:

```azurecli
az acr credential show \
    --resource-group YOUR-RESOURCE-GROUP \
    --name YOUR-REGISTRY-NAME
```

Create a password file and store the password in a location other than your source code, such as `~/azure_container_registry_password.txt`.

## Login to container registry with Docker CLI

Using the credentials from the previous step, and your individual login server, use the [`docker login`](https://docs.docker.com/engine/reference/commandline/login/) command to authenticate to the registry.

```bash
docker login YOUR-LOGIN_SERVER \
    --username USERNAME \
    --password PASSWORD
```

If your Azure Container Registry password is in a password file, such as `~/azure_container_registry_password.txt`, you can pass the password with the following command:

```bash
docker login YOUR-LOGIN_SERVER \
    --username USERNAME \
    --password "$(cat ~/azure_container_registry_password.txt)"
```

## Tag your local image

You need to tag your Docker container, with the [`docker tag`](https://docs.docker.com/engine/reference/commandline/login/)  command to indicate that it's associated with your private registry (replacing `YOURALIAS/IMAGENAME` with the name you gave the container image).

```bash
docker tag YOURALIAS/IMAGENAME \
    YOUR-LOGIN_SERVER/YOURALIAS/IMAGENAME:v1
```

## Push your local image to your container registry

Push your local image to your container registry with the [`docker push`](https://docs.docker.com/engine/reference/commandline/push/) command:

```bash
docker push YOUR-LOGIN_SERVER/YOURALIAS/IMAGENAME:v1
```

## Configure web app to use container 

In configure the App Service web app to pull the image from your registry, run the following [`az webapp config container set`](/cli/azure/webapp/config/container#az-webapp-config-container-set) command:

```azurecli
az webapp config container set \
    --resource-group YOUR-RESOURCE-GROUP \
    --name YOUR-WEBAPP-NAME \
    --docker-registry-server-url YOUR-LOGIN_SERVER \
    --docker-custom-image-name YOUR-LOGIN_SERVER/YOURALIAS/IMAGENAME:v1 \
    -u USERNAME \
    -p PASSWORD
```

Make sure to add the `https://` prefix to the beginning of the `--docker-registry-server-url` option. However, don't add the prefix to the container image name.

If your Azure Container Registry password is in a password file, such as `~/azure_container_registry_password.txt`, you can pass the password with the following command:

```azurecli
az webapp config container set \
    --resource-group YOUR-RESOURCE-GROUP \
    --name YOUR-WEBAPP-NAME \
    --docker-registry-server-url YOUR-LOGIN_SERVER \
    --docker-custom-image-name YOUR-LOGIN_SERVER/YOURALIAS/IMAGENAME:v1 \
    -u USERNAME \
    -p "$(cat ~/azure_container_registry_password.txt)"
```

## Next steps

* [Create an Azure Cosmos DB for MongoDB resource](/azure/developer/javascript/database-developer-guide?tabs=azure-cli%2cmongodb)