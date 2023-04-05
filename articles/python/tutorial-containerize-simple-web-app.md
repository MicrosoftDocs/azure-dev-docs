---
title: Deploy a Flask or FastAPI web app as a container in Azure Container Apps
description: An overview of how to create and deploy a containerized Python web app (Flask or FastAPI) on Azure Container Apps.
ms.topic: conceptual
ms.date: 04/05/2023
ms.custom: devx-track-python
---

# Deploy a Flask or FastPI web app on Azure Container Apps

This tutorial shows you how to containerize a Python Flask or FastAPI web app and deploy it to Azure. The single container web app is hosted in [Azure Container Apps][1].

For more information about using containers in Azure, see [Comparing Azure container options](/azure/container-apps/compare-options).

## Prerequisites

To complete this tutorial, you need:

* An Azure account where you can use [Azure Container Registry][11] and [Azure Container Apps][1]

* [Azure CLI][17]

* [Flask][9] or [FastAPI][10] web framework.

* [Docker][4]

## Get sample code

In your local environment, get the code.

### [Flask](#tab/web-app-flask)

```bash
git clone https://github.com/Azure-Samples/msdocs-python-flask-webapp-quickstart.git
```

### [FastAPI(#tab/web-app-fastapi))]

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

### [FastAPI(#tab/web-app-fastapi))]

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

## Build image the image locally and run it

Build the image locally.

### [Flask](#tab/web-app-flask)

```bash
docker build --tag flask-demo .
```
### [FastAPI(#tab/web-app-fastapi))]

```bash
docker build --tag fastapi-demo .
```

---

Run the image locally with Docker.

### [Flask](#tab/web-app-flask)

```bash
docker run --detach --publish 5000:5000 flask-demo
```

### [FastAPI(#tab/web-app-fastapi))]

```bash
docker run --detach --publish 80:80 --name fastapi-demo
```

---

### Deploy to web app Azure Container Apps

### Make updates and rebuild

### Clean up


[1]: /azure/container-apps/overview
[4]: https://www.docker.com/
[9]: https://flask.palletsprojects.com/en/2.1.x/
[10]: https://fastapi.tiangolo.com/
[11]: https://azure.microsoft.com/services/container-registry/
[17]: /cli/azure/what-is-azure-cli
