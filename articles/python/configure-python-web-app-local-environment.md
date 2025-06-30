---
title: "Configure your local environment for developing and deploying Python web apps to Azure using popular frameworks like Django, Flask, and FastAPI."
description: Configure your local Python environment for working with Python web apps and deploying them to Azure using popular framework like Django, Flask, and FastAPI.
ms.topic: how-to
ms.date: 02/04/2025
ms.custom: devx-track-python, devx-track-azurecli
adobe-target: true
---

# Configure your local environment for deploying Python web apps on Azure

This article walks you through setting up your local environment to develop Python *web apps* and deploy them to Azure. Your web app can be pure Python or use one of the common Python-based web frameworks like [Django](https://www.djangoproject.com/), [Flask](https://flask.palletsprojects.com/en/2.1.x/), or [FastAPI](https://fastapi.tiangolo.com/).

Python web apps developed locally can be deployed to services such as [Azure App Service](/azure/app-service/), [Azure Container Apps](/azure/container-apps/), or [Azure Static Web Apps](/azure/static-web-apps/). There are many options for deployment. For example, for App Service deployment, you can choose to deploy from code, a Docker container, or a Static Web App. If you deploy from code, you can deploy with Visual Studio Code, with the Azure CLI, from a local Git repository, or with GitHub actions. If you deploy in a Docker Container, you can do so from Azure Container Registry, Docker Hub, or any private registry.

Before continuing with this article, we suggest you review the [Set up your dev environment](configure-local-development-environment.md) for guidance on setting up your dev environment for Python and Azure. Below, we'll discuss setup and configuration specific to Python web app development.

After you get your local environment setup for Python web app development, you'll be ready to tackle these articles:

* [Quickstart: Create a Python (Django or Flask) web app in Azure App Service](/azure/app-service/quickstart-python).
* [Tutorial: Deploy a Python (Django or Flask) web app with PostgreSQL in Azure](/azure/app-service/tutorial-python-postgresql-app)
* [Create and deploy a Flask web app to Azure with a system-assigned managed identity](./tutorial-python-managed-identity-cli.md)

## Working with Visual Studio Code

The [Visual Studio Code](https://code.visualstudio.com/) integrated development environment (IDE) is an easy way to develop Python web apps and work with Azure resources that web apps use.

> [!TIP]
> Make sure you have the [Python](https://marketplace.visualstudio.com/items?itemName=ms-python.python) extension installed. For an overview of working with Python in VS Code, see [Getting Started with Python in VS Code](https://code.visualstudio.com/docs/python/python-tutorial).

In VS Code, you work with Azure resources through [VS Code extensions](https://code.visualstudio.com/docs/editor/extension-marketplace). You can install extensions from the **Extensions** View or the key combination Ctrl+Shift+X. For Python web apps, you'll likely be working with one or more of the following extensions:
 
* The [Azure App Service](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azureappservice) extension enables you to interact with Azure App Service from within Visual Studio Code. App Service provides fully managed hosting for web applications including websites and web APIs.

* The [Azure Static Web Apps](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azureresourcegroups) extension enables you to create Azure Static Web Apps directly from VS Code. Static Web Apps is serverless and a good choice for static content hosting.

* If you plan on working with containers, then install:

  * The [Docker](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-docker) extension to build and work with containers locally. For example, you can run a containerized Python web app on Azure App Service using [Web Apps for Containers](https://azure.microsoft.com/services/app-service/containers/).
  
  * The [Azure Container Apps](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurecontainerapps) extension to create and deploy containerized apps directly from Visual Studio Code.

* There are other extensions such as the [Azure Storage](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurestorage), [Azure Databases](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-cosmosdb), and [Azure Resources](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azureresourcegroups) extensions. You can always add these and other extensions as needed.

Extensions in Visual Studio Code are accessible as you would expect in a typical IDE interface and with rich keyword support using the [VS Code command palette](https://code.visualstudio.com/docs/getstarted/userinterface#_command-palette). To access the command palette, use the key combination Ctrl+Shift+P. The command palette is a good way to see all the possible actions you can take on an Azure resource. The screenshot below shows some of the actions for App Service.

:::image type="content" source="./media/configure-local-development-environment/visual-studio-command-palette-small.png" alt-text="A screenshot of the Visual Studio Code command palette for App Service." lightbox="./media/configure-local-development-environment/visual-studio-command-palette.png":::

### Working with Dev Containers in Visual Studio Code

Python developers often rely on virtual environments to create an isolated and self-contained environment for a specific project. Virtual environments allow developers to manage dependencies, packages, and Python versions separately for each project, avoiding conflicts between different projects that might require different package versions.

While there are popular options available in Python for managing environments like `virtualenv` or `venv`, the [*Visual Studio Code Dev Container*](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) 
extension (based on the [open Dev Container specification](https://containers.dev)) lets you use a [Docker container](https://docker.com/) as a full-featured containerized environment. It enables developers to define a consistent and easily reproducible toolchain with all the necessary tools, dependencies, and extensions pre-configured. This means if you have system requirements, shell configurations, or use other languages entirely, you can use a Dev Container to explicitly configure all of those parts of your project that might live outside of a basic Python environment.

For example, a developer can configure a single Dev Container to include everything needed to work on a project, including a PostgreSQL database server along with the project database and sample data, a Redis server, Nginx, front-end code, client libraries like React, and so on. In addition, the container would contain the project code, the Python runtime, and all the Python project dependencies with the correct versions. Finally, the container can specify Visual Studio Code extensions to be installed so the entire team has the same tooling available. So when a new developer joins the team, the whole environment, including tooling, dependencies, and data, is ready to be cloned to their local machine, and they can begin working immediately.

See [Developing inside a Container](https://code.visualstudio.com/docs/devcontainers/containers).


## Working with Visual Studio 2022

[Visual Studio 2022](https://visualstudio.microsoft.com/vs/) is a full-featured integrated development environment (IDE) with support for Python application development and many built-in tools and extensions to access and deploy to Azure resources. While most documentation for building Python web apps on Azure focuses
on using Visual Studio Code, Visual Studio 2022 is a great option if you already
have it installed, you're comfortable with using it, and are using it for .NET or 
C++ projects.

* In general, see [Visual Studio | Python documentation](/visualstudio/python/) for all documentation related to using Python on Visual Studio 2022.

* For setup steps, see [Install Python support in Visual Studio](/visualstudio/python/installing-python-support-in-visual-studio) which walks you through the steps of installing the Python workload into Visual Studio 2022.

* For general workflow of using Python for web development, see [Quickstart: Create your first Python web app using Visual Studio](/visualstudio/ide/quickstart-python). This article is useful for understanding how to build a Python web application
from scratch (but does not include deployment to Azure).

* For using Visual Studio 2022 to manage Azure resources and deploy to Azure, 
see [Azure Development with Visual Studio](/visualstudio/azure/). While much of the documentation here specifically mentions 
.NET, the tooling for managing Azure resources and deploying to Azure works the 
same regardless of the programming language.

* When there's no built-in tool available in Visual Studio 2022 for a given 
Azure management or deployment task, you can always use [Azure CLI commands](#azure-cli-commands).

## Working with other IDEs

If you're working in another IDE that doesn't have explicit support for Azure, then you can use the Azure CLI to manage Azure resources. In the screenshot below, a simple Flask web app is open in the [PyCharm](https://www.jetbrains.com/pycharm/) IDE. The web app can be deployed to an Azure App Service using the `az webapp up` command. In the screenshot, the CLI command runs within the PyCharm embedded terminal emulator. If your IDE doesn't have an embedded emulator, your can use any terminal and the same command. The Azure CLI must be installed on your computer and be accessible in either case.

:::image type="content" source="./media/configure-local-development-environment/pycharm-ide-create-web-app-example-small.png" alt-text="A screenshot of the PyCharm IDE with an Azure CLI command deploying a web app." lightbox="./media/configure-local-development-environment/pycharm-ide-create-web-app-example.png":::

## Azure CLI commands

When working locally with web apps using the [Azure CLI](/cli/azure/) commands, you'll typically work with the following commands:  

|Command   |Description|
|----------|-----------|
|[az webapp](/cli/azure/webapp) | Manages web apps. Includes the subcommands [create](/cli/azure/webapp#az-webapp-create) and [up](/cli/azure/webapp#az-webapp-up) to create a web app or to create and deploy from a local workspace, respectively. |
|[az&nbsp;container&nbsp;app](/cli/azure/containerapp) | Manages Azure Container Apps. |
|[az&nbsp;staticwebapp](/cli/azure/staticwebapp) | Manages Azure Static Web Apps. |
|[az group](/cli/azure/group)  | Manages resource groups and template deployments. Use the subcommand [create](/cli/azure/group#az-group-create) to make a resource group to put your Azure resources in.|
|[az appservice](/cli/azure/appservice) | Manages App Service plans.  |
|[az config](/cli/azure/reference-index#az-config) | Manages Azure CLI configuration. To save keystrokes, you can define a default location or resource group that other commands use automatically.|

Here's an example Azure CLI command to create a web app and associated resources, and deploy it to Azure in one command using [az webapp up](/cli/azure/webapp#az-webapp-up). Run the command in the root directory of your web app.

#### [bash](#tab/terminal-bash)

```azurecli
az webapp up \
    --runtime PYTHON:3.9 \
    --sku B1 \
    --logs
```

#### [PowerShell terminal](#tab/terminal-powershell)

```azurecli
az webapp up `
    --runtime PYTHON:3.9 `
    --sku B1 `
    --logs
```

---

For more about this example, see [Quickstart: Deploy a Python (Django or Flask) web app to Azure App Service](/azure/app-service/quickstart-python?tabs=azure-cli).

Keep in mind that for some of your Azure workflow you can also use the Azure CLI from an [Azure Cloud Shell](/azure/cloud-shell/overview). Azure Cloud Shell is an interactive, authenticated, browser-accessible shell for managing Azure resources. 

## Azure SDK key packages

In your Python web apps, you can refer programmatically to Azure services using the [Azure SDK for Python](/python/api/overview/azure/). This SDK is discussed extensively in the section [Use the Azure libraries (SDK) for Python](https://azure.github.io/azure-sdk-for-python/). In this section, we'll briefly mention some key packages of the SDK that you'll use in web development. And, we'll show an example around the best practices for authenticating your code with Azure resources.

Below are some of the packages commonly used in web app development. You can install packages in your virtual environment directly with `pip`. Or put the Python package index (Pypi) name in your *requirements.txt* file.

|SDK docs   |Install | Python package index |
|---------------------|--------|----------------------|
|[Azure Identity](/python/api/overview/azure/identity-readme) | `pip install azure-identity`| [azure-identity](https://pypi.org/project/azure-identity/) |
|[Azure Storage Blobs](/python/api/overview/azure/storage-blob-readme) | `pip install azure-storage-blob`| [azure-storage-blob](https://pypi.org/project/azure-storage-blob/) |
|[Azure Cosmos DB](/python/api/overview/azure/cosmos-readme) | `pip install azure-cosmos`| [azure-cosmos](https://pypi.org/project/azure-cosmos/) |
|[Azure Key Vault Secrets](/python/api/overview/azure/keyvault-secrets-readme) | `pip install azure-keyvault-secrets`| [azure-keyvault-secrets](https://pypi.org/project/azure-keyvault-secrets/) |

The [azure-identity](https://pypi.org/project/azure-identity/) package allows your web app to authenticate with Microsoft Entra ID. For authentication in your web app code, it's recommended that you use the [DefaultAzureCredential](/python/api/azure-identity/azure.identity.defaultazurecredential) in the `azure-identity` package. Here's an example of how to access Azure Storage. The pattern is similar for other Azure resources.

```python
from azure.identity import DefaultAzureCredential
from azure.storage.blob import BlobServiceClient

azure_credential = DefaultAzureCredential()
blob_service_client = BlobServiceClient(
    account_url=account_url,
    credential=azure_credential)
```

The `DefaultAzureCredential` will look in predefined locations for account information, for example, in environment variables or from the Azure CLI sign-in. For in-depth information on the `DefaultAzureCredential` logic, see [Authenticate Python apps to Azure services by using the Azure SDK for Python](sdk/authentication-overview.md).

## Python-based web frameworks

In Python web app development, you often work with Python-based web frameworks. These frameworks provide functionality, such as page templates, session management, database access, and easy access to HTTP request and response objects. Frameworks enable you to avoid the need for you to have to reinvent the wheel for common functionality.

Three common Python web frameworks are [Django](https://www.djangoproject.com/), [Flask](https://flask.palletsprojects.com/en/2.1.x/), or [FastAPI](https://fastapi.tiangolo.com/). These and other web frameworks can be used with Azure.

Below is an example of how you might get started quickly with these frameworks locally. Running these commands, you'll end up with an application, albeit a simple one that could be deployed to Azure. Run these commands inside a [virtual environment](./configure-local-development-environment.md#configure-python-virtual-environment).

**Step 1:**  Download the frameworks with [pip](https://pip.pypa.io/en/stable/cli/pip_install/).
### [Django](#tab/django)

```
pip install Django
```

### [Flask](#tab/flask)

```
pip install Flask
```

### [FastAPI](#tab/fastapi)

```
pip install fastapi
pip install "uvicorn[standard]"
```

---

**Step 2:** Create a hello world app.

### [Django](#tab/django)

Create a sample project using the [django-admin startproject](https://docs.djangoproject.com/en/4.0/ref/django-admin/#startapp) command. The project includes a *manage.py* file that is the entry point for running the app.

```
django-admin startproject hello_world
```

### [Flask](#tab/flask)

Create a file named *app.py* with the following code.

```python
from flask import Flask

app = Flask(__name__)

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"
```

### [FastAPI](#tab/fastapi)

Create a file named *main.py* with the following code.

```python
from typing import Union

from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}
```

---

**Step 3:** Run the code locally.

### [Django](#tab/django)

Django uses WSGI to run the app.

```
python hello_world\manage.py runserver
```

### [Flask](#tab/flask)

Flask comes with a dev server to run the app.

```
flask run
```

### [FastAPI](#tab/fastapi)

Use the ASGI server installed.

```
uvicorn main:app --reload
```
---

---

**Step 4:** Browse the hello world app.

### [Django](#tab/django)

```
http://127.0.0.1:8000/
```
### [Flask](#tab/flask)


```
http://127.0.0.1:5000/
```

### [FastAPI](#tab/fastapi)

```
http://127.0.0.1:8000/
```

---


At this point, add a *requirements.txt* file and then you can deploy the web app to Azure or containerize it with Docker and then deploy it. 

## Next steps

* [Quickstart: Create a Python (Django or Flask) web app in Azure App Service](/azure/app-service/quickstart-python).
* [Tutorial: Deploy a Python (Django or Flask) web app with PostgreSQL in Azure](/azure/app-service/tutorial-python-postgresql-app)
* [Create and deploy a Flask web app to Azure with a system-assigned managed identity](./tutorial-python-managed-identity-cli.md)
