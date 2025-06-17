---
title: Deploy a Flask or FastAPI web app as a container in Azure Container Apps
description: An overview of how to create and deploy a containerized Python web app (Flask or FastAPI) on Azure Container Apps.
ms.topic: install-set-up-deploy
ms.date: 12/16/2024
ms.custom: devx-track-python
---

# Deploy a Flask or FastAPI web app on Azure Container Apps

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

Add a *Dockerfile* to instruct Docker how to build the image. The *Dockerfile* specifies the use of [Gunicorn][24], a production-level web server that forwards web requests to the Flask and FastAPI frameworks. The ENTRYPOINT and CMD commands instruct Gunicorn to handle requests for the app object.

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

## Configure gunicorn

Gunicorn can be configured with a *gunicorn.conf.py* file. When the *gunicorn.conf.py* file is located in the same directory where `gunicorn` is run, you don't need to specify its location in the `ENTRYPOINT` or `CMD` instruction of the *Dockerfile*. For more information about specifying the configuration file, see [Gunicorn settings][22].

In this tutorial, the suggested configuration file configures GUnicorn to increase its number of workers based on the number of CPU cores available. For more information about *gunicorn.conf.py* file settings, see [Gunicorn configuration][23].

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

```dockerfile
FROM python:3.11

# Set the working directory in the container
WORKDIR /code

# Copy the requirements file into the container
COPY requirements.txt .

# Install the dependencies
RUN pip install --no-cache-dir --upgrade -r requirements.txt

# Copy the rest of the application code into the container
COPY . .

# Expose the port that the app will run on
EXPOSE 3100

# Command to run the application using Uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "3100", "--workers", "4"]
```

`3100` is used for the container port (internal) in this example, but you can use any free port.

Check the *requirements.txt* file to make sure it contains `uvicorn`.

:::code language="python" source="~/../msdocs-python-fastapi-webapp-quickstart/requirements.txt" highlight="2-3" :::

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

Open the ```http://localhost:5000``` URL in your browser to see the web app running locally.

### [FastAPI](#tab/web-app-fastapi)

```bash
docker run --detach --publish 3100:3100 fastapi-demo
```

Open the ```http://localhost:3100``` URL in your browser to see the web app running locally.

---

The `--detach` option runs the container in the background. The `--publish` option maps the container port to a port on the host. The host port (external) is first in the pair, and the container port (internal) is second. For more information, see [Docker run reference][21].

## Deploy web app to Azure

To deploy the Docker image to Azure Container Apps, use the [az containerapp up][6] command. (The following commands are shown for the Bash shell. Change the continuation character (`\`) as appropriate for other shells.)

### [Flask](#tab/web-app-flask)

```azurecli
az containerapp up \
  --resource-group web-flask-aca-rg --name web-aca-app \
  --ingress external --target-port 50505 --source .
```

### [FastAPI](#tab/web-app-fastapi)

```azurecli
az containerapp up \
  --resource-group web-fastapi-aca-rg --name web-aca-app \ 
  --ingress external --target-port 3100 --source .
```

---

When deployment completes, you have a resource group with the following resources inside of it:

* An Azure Container Registry
* A Container Apps Environment
* A Container App running the web app image
* A Log Analytics workspace

The URL for the deployed app is in the output of the `az containerapp up` command. Open the URL in your browser to see the web app running in Azure. The form of the URL will look like the following `https://web-aca-app.<generated-text>.<location-info>.azurecontainerapps.io`, where the `<generated-text>` and `<location-info>` are unique to your deployment.

## Make updates and redeploy

After you make code updates, you can run the previous `az containerapp up` command again, which rebuilds the image and redeploys it to Azure Container Apps. Running the command again takes in account that the resource group and app already exist, and updates just the container app.

In more complex update scenarios, you can redeploy with the [az acr build][18] and [az containerapp update][19] commands together to update the container app.

## Clean up

All the Azure resources created in this tutorial are in the same resource group. Removing the resource group removes all resources in the resource group and is the fastest way to remove all Azure resources used for your app.

To remove resources, use the [az group delete][20] command.

### [Flask](#tab/web-app-flask)

```azurecli
az group delete --name web-flask-aca-rg
```

### [FastAPI](#tab/web-app-fastapi)

```azurecli
az group delete --name web-fastapi-aca-rg
```

---

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
[21]: https://docs.docker.com/engine/reference/run/
[22]: https://docs.gunicorn.org/en/stable/settings.html#config-file
[23]: https://docs.gunicorn.org/en/stable/configure.html#configuration-file
[24]: https://docs.gunicorn.org/en/stable/index.html
[25]: https://www.uvicorn.org/#running-with-gunicorn
