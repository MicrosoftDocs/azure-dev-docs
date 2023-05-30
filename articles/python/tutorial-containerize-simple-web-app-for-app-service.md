---
title: Deploy a Flask or FastAPI web app as a container in Azure App Service
description: An overview of how to create and deploy a containerized Python web app (Flask or FastAPI) on Azure App Service.
ms.topic: conceptual
ms.date: 04/13/2023
ms.custom: devx-track-python, devx-track-azurecli
---

# Deploy a Flask or FastPI web app on Azure App Service

This tutorial shows you how to deploy a Python [Flask][5] or [FastAPI][6] web app to [Azure App Service][1] using the [Web App for Containers][2] feature. Web App for Containers provides an easy on-ramp for developers to take advantage of the fully managed Azure App Service platform, but who also want a single deployable artifact containing an app and all of its dependencies. For more information about using containers in Azure, see [Comparing Azure container options][3].

In this tutorial, you use the [Docker CLI][7] and [Docker][12] to optionally create a Docker image and test it locally. And, you use the [Azure CLI][8] to create a Docker image in Azure and deploy it to Azure App Service. You can also deploy with [Visual Studio Code][9] with the [Azure Tools Extension][10] installed. For an example of building and creating a Docker image to run on Azure Container Apps, see [Deploy a Flask or FastPI web app on Azure Container Apps][4].

> [!NOTE]
> This tutorial shows creating a Docker image that can then be run on App Service. This is not required to use App Service. You can deploy code directly from a local workspace to App Service without creating a Docker image. For an example, see [Quickstart: Deploy a Python (Django or Flask) web app to Azure App Service][4].

## Prerequisites

To complete this tutorial, you need:

* An Azure account where you can deploy a web app to [Azure App Service][1] and [Azure Container Registry][11].

* [Azure CLI][8] to create a Docker image and deploy it to App Service. And optionally, [Docker][12]and the [Docker CLI][7] to create a Docker and test it in your local environment.

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

Add a *Dockerfile* to instruct Docker how to build the image. The *Dockerfile* specifies the use of [Gunicorn][13], a production-level web server that forwards web requests to the Flask and FastAPI frameworks. The ENTRYPOINT and CMD commands instruct Gunicorn to handle requests for the app object.

### [Flask](#tab/web-app-flask)

```dockerfile
# syntax=docker/dockerfile:1

FROM python:3.11

WORKDIR /code

COPY requirements.txt .

RUN pip3 install -r requirements.txt

COPY . .

EXPOSE 50505

ENTRYPOINT ["gunicorn", "app:app"]
```

`50505` is used for the container port (internal) in this example, but you can use any free port.

Check the *requirements.txt* file to make sure it contains `gunicorn`.

:::code language="python" source="~/../msdocs-python-flask-webapp-quickstart/requirements.txt" highlight="2" :::

### [FastAPI](#tab/web-app-fastapi)

```dockerfile
# syntax=docker/dockerfile:1

FROM python:3.11

WORKDIR /code

COPY requirements.txt .

RUN pip install --no-cache-dir --upgrade -r requirements.txt

COPY . .

EXPOSE 3100

CMD ["gunicorn", "main:app"]
```

`3100` is used for the container port (internal) in this example, but you can use any free port.

Check the *requirements.txt* file to make sure it contains `gunicorn` and `uvicorn`.

:::code language="python" source="~/../msdocs-python-fastapi-webapp-quickstart/requirements.txt" highlight="2-3" :::

---

Add a *\.dockerignore* file to exclude unnecessary files from the image.

```dockerignore
.git*
**/*.pyc
.venv/
```

## Configure gunicorn

Gunicorn can be configured with a *gunicorn.conf.py* file. When the *gunicorn.conf.py* file is located in the same directory where gunicorn is run, you don't need to specify its location in the *Dockerfile*. For more information about specifying the configuration file, see [Gunicorn settings][14].

In this tutorial, the suggested configuration file configures gunicorn to increase its number of workers based on the number of CPU cores available. For more information about *gunicorn.conf.py* file settings, see [Gunicorn configuration][15].

### [Flask](#tab/web-app-flask)

```text
# Gunicorn configuration file
import multiprocessing

max_requests = 1000
max_requests_jitter = 50

log_file = "-"

bind = "0.0.0.0:50505"

workers = (multiprocessing.cpu_count() * 2) + 1
threads = workers

timeout = 120
```

### [FastAPI](#tab/web-app-fastapi)

```text
# Gunicorn configuration file
import multiprocessing

max_requests = 1000
max_requests_jitter = 50

log_file = "-"

bind = "0.0.0.0:3100"

worker_class = "uvicorn.workers.UvicornWorker"
workers = (multiprocessing.cpu_count() * 2) + 1
```

With the `uvicorn.workers.UvicornWorker` worker class, you can use `gunicorn` to run `FastAPI` apps. For more information, see [Running uvicorn with gunicorn][16].

---

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

Run the image locally in a Docker container.

### [Flask](#tab/web-app-flask)

```bash
docker run --detach --publish 5000:50505 flask-demo
```

Open the [http://localhost:5000](http://localhost:5000) URL in your browser to see the web app running locally.

### [FastAPI](#tab/web-app-fastapi)

```bash
docker run --detach --publish 3100:3100 fastapi-demo
```

Open the [http://localhost:3100](http://localhost:3100) URL in your browser to see the web app running locally.

---

The `--detach` option runs the container in the background. The `--publish` option maps the container port to a port on the host. The host port (external) is first in the pair, and the container port (internal) is second. For more information, see [Docker run reference][17].

## Create a resource group and Azure Container Registry

1. Create a group with the [az group create][18] command.

    ```azurecli
    az group create --name web-app-simple-rg --location eastus
    ```

    An Azure resource group is a logical container into which Azure resources are deployed and managed. When creating a resource group, you specify a location, such as *eastus*.

1. Create an Azure Container Registry with the [az acr create][19] command.

    ```azurecli
    az acr create --resource-group web-app-simple-rg \
    --name webappacr123 --sku Basic --admin-enabled true
    
    ACR_PASSWORD=$(az acr credential show \
    --resource-group web-app-simple-rg \
    --name webappacr123 \
    --query "passwords[?name == 'password'].value" \
    --output tsv)
    ```

    An Azure Container Registry is a private Docker registry that stores images for use in Azure Container Instances, Azure App Service, Azure Kubernetes Service, and other services. When creating a registry, you specify a name, SKU, and resource group. The second command saves the password to a variable with the [az credential show][20] command. The password is used to authenticate to the registry in a later step.

    The commands for creating the registry and subsequent ones are shown for the Bash shell. Change the continuation character (`\`) as appropriate for other shells.

    You can also get the password (`ACR_PASSWORD`) from the [Azure portal][25] by going to the registry, selecting **Access keys**, and copying the password.

## Build the image in Azure Container Registry

Build the Docker image in Azure with the [az acr build][21] command. The command uses the Dockerfile in the current directory, and pushes the image to the registry.

```azurecli
az acr build \
  --resource-group web-app-simple-rg \
  --registry webappacr123 \
  --image webappsimple:latest .
```

The `--registry` option specifies the registry name, and the `--image` option specifies the image name. The image name is in the format `registry.azurecr.io/repository:tag`.

## Deploy to web app to Azure

1. Create an App Service plan with the [az appservice plan][22] command.

    ```azurecli
    az appservice plan create \
    --name webplan \
    --resource-group web-app-simple-rg \
    --sku B1 \
    --is-linux
    ```

1. Create the web app with the [az webapp create][23] command.

    ```azurecli
    az webapp create \
    --resource-group web-app-simple-rg \
    --plan webplan --name webappsimple123 \
    --docker-registry-server-password $ACR_PASSWORD \
    --docker-registry-server-user webappacr123 \
    --role acrpull \
    --deployment-container-image-name webappacr123.azurecr.io/webappsimple:latest 
    ```

    Notes:

    * The web app name must be unique in Azure. If you run into an error, try a different name.

    * It can take a few minutes for the web app to be created. You can check the deployment logs with the [az webapp log tail][27] command. For example, `az webapp log tail --resource-group web-app-simple-rg --name webappsimple123`. If you see entries with "warmup" in them, the container is being deployed.

    * The URL of the web app is `<web-app-name>.azurewebsites.net`, for example, [https://webappsimple123.azurewebsites.net](https://webappsimple123.azurewebsites.net).

## Make updates and redeploy

After you make code changes, you can redeploy to App Service with the [az acr build][18] and [az webapp update][19] commands.

## Clean up

All the Azure resources created in this tutorial are in the same resource group. Removing the resource group removes all resources in the resource group and is the fastest way to remove all Azure resources used for your app.

To remove resources, use the [az group delete][24] command.

```azurecli
az group delete --name web-app-simple-rg
```

You can also remove the group in the [Azure portal][25] or in [Visual Studio Code][9] and the [Azure Tools Extension][10].

## Next steps

For more information, see the following resources:

* [Deploy a Python web app on Azure Container Apps][4]
* [Quickstart: Deploy a Python (Django or Flask) web app to Azure App Service][26]

[1]: /azure/app-service/getting-started
[2]: https://azure.microsoft.com/products/app-service/containers
[3]:./containers-in-azure-overview-python.md
[4]: ./tutorial-containerize-simple-web-app.md
[5]: https://flask.palletsprojects.com/en/2.1.x/
[6]: https://fastapi.tiangolo.com/
[7]: https://docs.docker.com/engine/reference/commandline/cli/
[8]: /cli/azure/what-is-azure-cli
[9]: https://code.visualstudio.com/
[10]: https://code.visualstudio.com/docs/azure/extensions
[11]: https://azure.microsoft.com/services/container-registry/
[12]: https://www.docker.com/
[13]: https://docs.gunicorn.org/en/stable/index.html
[14]: https://docs.gunicorn.org/en/stable/settings.html#config-file
[15]: https://docs.gunicorn.org/en/stable/configure.html#configuration-file
[16]: https://www.uvicorn.org/#running-with-gunicorn
[17]: https://docs.docker.com/engine/reference/run/
[18]: /cli/azure/group#az-group-create
[19]: /cli/azure/acr#az-acr-create
[20]: /cli/azure/acr/credential#az-acr-credential-show
[21]: /cli/azure/acr#az-acr-build
[22]: /cli/azure/appservice/plan#az-appservice-plan-create
[23]: /cli/azure/webapp#az-webapp-create
[24]: /cli/azure/group#az-group-delete
[25]: https://portal.azure.com/
[26]: /azure/app-service/quickstart-python
[27]: /cli/azure/webapp/log#az-webapp-log-tail
