---
title: Deploy a Flask or FastAPI web app as a container in Azure Container Apps
description: An overview of how to create and deploy a containerized Python web app (Flask or FastAPI) on Azure Container Apps.
ms.topic: conceptual
ms.date: 04/07/2023
ms.custom: devx-track-python
---

# Deploy a Flask or FastPI web app on Azure Container Apps

This tutorial shows you how to containerize a Python [Flask][9] or [FastAPI][10] web app and deploy it to [Azure Container Apps][1]. Azure Container Apps uses [Docker][4] container technology to host both built-in images and custom images. For more information about using containers in Azure, see [Comparing Azure container options](/azure/container-apps/compare-options).

In this tutorial, you use the [Docker CLI][7] and the [Azure CLI][17] to create a Docker image and deploy it to Azure Container Apps. You can also deploy with [Visual Studio Code][3] and the [Azure Tools Extension][5].

## Prerequisites

To complete this tutorial, you need:

* An Azure account where you can deploy a web app to [Azure Container Apps][1]. (An [Azure Container Registry][11] and [Log Analytics workspace][12] are created for you in the process.)

* [Azure CLI][17], [Docker][4], and the [Docker CLI][7] installed in your local environment.

## Get the sample code

In your local environment, get the code.

### [Flask](#tab/web-app-flask)

```bash
git clone https://github.com/Azure-Samples/msdocs-python-flask-webapp-quickstart.git
```

### [FastAPI](#tab/web-app-fastapi)

```bash
git clone https://github.com/Azure-Samples/msdocs-python-fastapi-webapp-quickstart.git
```

---

## Add Dockerfile and \.dockerignore files

Add a *Dockerfile* to instruct Docker how to build the image.

### [Flask](#tab/web-app-flask)

```dockerfile
# syntax=docker/dockerfile:1

FROM python:3.11

WORKDIR /code

COPY requirements.txt .

RUN pip3 install -r requirements.txt

COPY . .

EXPOSE 5000

ENTRYPOINT ["gunicorn", "-b", "0.0.0.0:5000", "app:app"]
```

Check the *requirements.txt* file to make sure it contains `guincorn`, and add it if necessary.

### [FastAPI](#tab/web-app-fastapi)

```dockerfile
# syntax=docker/dockerfile:1

FROM python:3.11

WORKDIR /code

COPY requirements.txt .

RUN pip install --no-cache-dir --upgrade -r requirements.txt

COPY . .

EXPOSE 80

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "80", "--proxy-headers"]
```

Check the *requirements.txt* file to make sure it contains `uvicorn`, and add it if necessary.

---

Add a *\.dockerignore* file to exclude unnecessary files from the image.

```dockerignore
.git*
**/*.pyc
.venv/
```

## Build and run the image locally

Build the image locally.

### [Flask](#tab/web-app-flask)

```bash
docker build --tag flask-demo .
```

Open the [http://localhost:5000](http://localhost:5000) URL in your browser to see the web app running locally.

### [FastAPI](#tab/web-app-fastapi)

```bash
docker build --tag fastapi-demo .
```

Open the [http://localhost:80](http://localhost:80) URL in your browser to see the web app running locally.

---

Run the image locally in a Docker container.

### [Flask](#tab/web-app-flask)

```bash
docker run --detach --publish 5000:5000 flask-demo
```

### [FastAPI](#tab/web-app-fastapi)

```bash
docker run --detach --publish 80:80 --name fastapi-demo
```

---

## Deploy to web app to Azure

To deploy the docker image to Azure Container Apps, use the [az containerapp up][6] command.

### [Flask](#tab/web-app-flask)

```azurecli
az containerapp up -g web-flask-aca-rg -n web-flask-aca-app --ingress external --target-port 5000 --source .
```

### [FastAPI](#tab/web-app-fastapi)

```azurecli
az containerapp up -g web-fastapi-aca-rg -n web-fastapi-aca-app --ingress external --target-port 80 --source .
```

---

When deployment completes, you have a resource group with the following resources inside of it: an Azure Container Registry, a Container Apps Environment, a Container App running the web app image, and a Log Analytics workspace.

## Make updates and redeploy

If you need to make code updates, you can rebuild the image and redeploy it to Azure Container Apps with the [az acr build][18] and [az containerapp update][19] commands.

You need the name of the Azure Container Registry. You can find that from the from the output of the `az containerapp up` command. You can also find it in the [Azure portal][15] or running with the [az resource list][16] command. For example, `az resource list  --resource-group <resource-group-name>`.

Fill in the `<registry-name>` placeholder in three spots in the following commands with the name of your Azure Container Registry.

### [Flask](#tab/web-app-flask)

```azurecli
az acr build --platform linux/amd64 --image <registry-name>.azurecr.io/web-flask-aca-app:latest --registry <registry-name> .
az containerapp update --name web-flask-aca-app --resource-group web-flask-aca-rg --image <registry-name>.azurecr.io/web-flask-aca-app:latest 
```

### [FastAPI](#tab/web-app-fastapi)

```azurecli
az acr build --platform linux/amd64 --image <registry-name>.azurecr.io/web-fastapi-aca-app:latest --registry <registry-name> .
az containerapp update --name web-fastapi-aca-app --resource-group web-fastapi-aca-rg --image <registry-name>.azurecr.io/web-fastapi-aca-app:latest 
```

---

## Clean up

All the Azure resources created in this tutorial are in the same resource group. Removing the resource group removes all resources in the resource group and is the fastest way to remove all Azure resources used for your app.

To remove resources use the [az group delete][20] command.

```azurecli
az group delete --name <resource-group>
```

You can also remove the group in the [Azure portal][2] or in [Visual Studio Code][3] and the [Azure Tools Extension][5].

## Next steps

For more information, see the following resources:

* [Deploy Azure Container Apps with the az containerapp up command][8]
* [Quickstart: Deploy to Azure Container Apps using Visual Studio Code][13]
* [Azure Container Apps image pull with managed identity][14]

[1]: /azure/container-apps/overview
[2]: /azure/azure-resource-manager/management/delete-resource-group
[3]: https://code.visualstudio.com/
[4]: https://www.docker.com/
[5]: https://code.visualstudio.com/docs/azure/extensions
[6]: /cli/azure/containerapp#az_containerapp_up
[7]: https://docs.docker.com/engine/reference/commandline/cli/
[8]: /azure/container-apps/containerapp-up
[9]: https://flask.palletsprojects.com/en/2.1.x/
[10]: https://fastapi.tiangolo.com/
[11]: https://azure.microsoft.com/services/container-registry/
[12]: /azure/azure-monitor/logs/log-analytics-workspace-overview
[13]: /azure/container-apps/deploy-visual-studio-code
[14]: /azure/container-apps/managed-identity-image-pull
[15]: https://portal.azure.com/
[16]: /cli/azure/resource#az-resource-list
[17]: /cli/azure/what-is-azure-cli
[18]: /cli/azure/acr#az-acr-build
[19]: /cli/azure/containerapp#az_containerapp_update
[20]: /cli/azure/group#az-group-delete