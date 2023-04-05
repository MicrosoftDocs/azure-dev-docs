---
title: Deploy a Flask or FastAPI web app as a container in Azure Container Apps
description: An overview of how to create and deploy a containerized Python web app (Flask or FastAPI) on Azure Container Apps.
ms.topic: conceptual
ms.date: 04/05/2023
ms.custom: devx-track-python
---

# Deploy a Flask or FastPI web app on Azure Container Apps

This tutorial shows you how to containerize a Python Flask or FastAPI web app and deploy it to Azure. The single container web app is hosted in [Azure Container Apps][1]. Azure Container Apps uses [Docker][4] container technology to host both built-in images and custom images.  In this tutorial, you'll build an image from Python code and deploy it to Azure Container Apps. For more information about using containers in Azure, see [Comparing Azure container options](/azure/container-apps/compare-options).

In this tutorial, you use the [Azure CLI][17] to create and deploy a web app to Azure Container Apps. You can also create and deploy with [Visual Studio Code][3] and the [Azure Tools Extension][5].

## Prerequisites

To complete this tutorial, you need:

* An Azure account where you can use [Azure Container Registry][11] and [Azure Container Apps][1]

* [Azure CLI][17] and [Docker][4] installed locally.

## Get sample code

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

Add a Dockerfile to instruct Docker how to build the image.

### [Flask](#tab/web-app-flask)

```Dockefile
# syntax=docker/dockerfile:1

FROM python:3.9.13

WORKDIR /code

COPY requirements.txt .

RUN pip3 install -r requirements.txt

COPY . .

EXPOSE 5000

ENTRYPOINT ["gunicorn", "-b", "0.0.0.0:5000", "app:app"]
```

### [FastAPI](#tab/web-app-fastapi)

```dockerfile
FROM python:3.11

WORKDIR /code

COPY requirements.txt .

RUN pip install --no-cache-dir --upgrade -r requirements.txt

COPY . .

EXPOSE 80

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "80", "--proxy-headers"]
```

---

Add a \.dockerignore file to exclude files from the image.

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

### [FastAPI](#tab/web-app-fastapi)

```bash
docker build --tag fastapi-demo .
```

---

Run the image locally with Docker.

### [Flask](#tab/web-app-flask)

```bash
docker run --detach --publish 5000:5000 flask-demo
```

### [FastAPI](#tab/web-app-fastapi)

```bash
docker run --detach --publish 80:80 --name fastapi-demo
```

---

### Deploy to web app Azure Container Apps

To deploy the image, use the [az containerapp up][6] command. The command creates a resource group, Azure Container Registry, and Azure Container Apps instance. The command also deploys the image to Azure Container Apps.

### [Flask](#tab/web-app-flask)

```azurecli
az containerapp up -g web-flask-aca-rg -n web-flask-aca-app --ingress external --target-port 5000 --source .
```

### [FastAPI](#tab/web-app-fastapi)

```azurecli
az containerapp up -g web-fastapi-aca-rg -n web-fastapi-aca-app --ingress external --target-port 80 --source .
```

---

At this point, you have a resource group with the following resources: an Azure Container Registry, a container app, a Container Apps Environment, and a Log Analytics workspace.

### Make updates and rebuild

You can get the registry name from the output of the `az containerapp up` command.

### Clean up

In this tutorial, all the Azure resources were created in the same resource group. Removing the resource group removes all resources in the resource group and is the fastest way to remove all Azure resources used for your app.

```azurecli
az containerapp delete --name <app-name> --resource-group <resource-group>
```

You can also remove the group in the [Azure portal][2] or in [Visual Studio Code][3] and the [Azure Tools Extension][5].

[1]: /azure/container-apps/overview
[2]: https://portal.azure.com/
[3]: https://code.visualstudio.com/
[4]: https://www.docker.com/
[5]: https://code.visualstudio.com/docs/azure/extensions
[6]: /cli/azure/containerapp?view=azure-cli-latest#az_containerapp_up
[9]: https://flask.palletsprojects.com/en/2.1.x/
[10]: https://fastapi.tiangolo.com/
[11]: https://azure.microsoft.com/services/container-registry/
[17]: /cli/azure/what-is-azure-cli
