---
title: Deploy a Python web app to Azure with managed identity
description: An overview of how to create and deploy a Python (Django or Flask) web app to Azure that uses managed identity to access to Azure Storage and PostgreSQL.
ms.devlang: python
ms.topic: tutorial
ms.date: 11/21/2022
ms.custom: devx-track-python
---

# Overview: Deploy a Python web app to Azure with managed identity

In this tutorial, you'll deploy Python code (**[Django](https://www.djangoproject.com/)** or **[Flask](https://flask.palletsprojects.com/)**) to create and deploy a web app running in Azure App Service. The web app uses **[managed identity](/azure/active-directory/managed-identities-azure-resources/overview)** to access [Azure Storage](/azure/storage/common/storage-introduction) and [Azure Database for PostgreSQL](/azure/postgresql) resources.

Each article in the tutorial covers a part or service shown in the service diagram below. The left side of the diagram shows the local or development environment with a Python app using a local PostgreSQL instance and a local storage emulator. The right side of the diagram shows the Python app deployed in Azure with Azure App Service, Azure Database for PostgreSQL, and Azure Storage Service. 

:::image type="content" source="./media/python-web-app-managed-identity/system-diagram-local-to-deploy-python-managed-identity-800px.png" lightbox="./media/python-web-app-managed-identity/system-diagram-local-to-deploy-python-managed-identity.png" alt-text="A screenshot showing the Azure services used in the Python and managed identity tutorial." :::

## How managed identity is used

Managed identity provides an identity for your app so that it can connect to Azure resources without the need to use a secret key or other application secret. Internally, Azure knows the identity of your app and what resources it's allowed to connect to. Managed identity is the recommended approach to authenticate an app in Azure when using the Azure SDK for Python as is shown in this tutorial. For more information about authentication in Azure with Python, see [How to authenticate Python apps to Azure services using the Azure SDK for Python](./sdk/authentication-overview.md). 

The sample Python app code doesn't change between the local development and Azure-hosted environments. Using the same code is possible because the [DefaultAzureCredential](/python/api/azure-identity/azure.identity.defaultazurecredential) is used, which handles both authentication scenarios as shown in the following diagram.

:::image type="content" source="./media/python-web-app-managed-identity/python-web-app-managed-identity-overview-graphic-800px.png" lightbox="./media/python-web-app-managed-identity/python-web-app-managed-identity-overview-graphic.png" alt-text="A diagram showing authentication in the tutorial depending on where the web app code runs." :::

## Prerequisites for the tutorial

To complete this tutorial, you'll need:

* An Azure account with an active subscription. If you don't have an Azure account, you [can create one for free](https://azure.microsoft.com/free/python).
* Knowledge of Python with [Flask development](https://flask.palletsprojects.com/en/2.1.x/) or [Django development](/training/paths/django-create-data-driven-websites/).
* [Python 3.9](https://www.python.org/downloads/) installed locally.
* [Azure Identity client library for Python](https://pypi.org/project/azure-identity/)and [Azure Blob Storage Client Library for Python](https://pypi.org/project/azure-storage-blob/).
* Optionally, [PostgreSQL](https://www.postgresql.org/download/) installed locally.
* Optionally, [Azurite](/azure/storage/common/storage-use-azurite) storage emulator installed locally.

This tutorial shows three different tools for accomplishing the steps to go from local Python code to deployed web app. The three tools are the Azure portal, Visual Studio Code and extensions, and the Azure CLI. You'll be prompted at the start of instructions to download any other tools needed to complete the task. You can mix and match the tools, for example, completing one step in the portal and another step with the Azure CLI.

## Set up the sample app

Sample Python applications using the Flask and Django frameworks are available to help you follow along with this tutorial. Download or clone one of the sample applications to your local workstation. 

> [!NOTE]
> If you are following this tutorial with your own app, look at the *requirements.txt* file description in each project's *README.md* file ([Flask](https://github.com/Azure-Samples/msdocs-flask-web-app-managed-identity/blob/main/README.md), [Django](https://github.com/Azure-Samples/msdocs-django-web-app-managed-identity/blob/main/README.md)) to see what packages you'll need and how [DefaultAzureCredential](/python/api/azure-identity/azure.identity.defaultazurecredential) is implemented.

Clone the sample app:

### [Flask](#tab/flask)

```bash
git clone https://github.com/Azure-Samples/msdocs-flask-web-app-managed-identity.git
```

### [Django](#tab/django)

```bash
git clone https://github.com/Azure-Samples/msdocs-django-web-app-managed-identity.git
```

--- 

Navigate to the application folder:

### [Flask](#tab/flask)

```bash
cd msdocs-flask-web-app-managed-identity
```

### [Django](#tab/django)

```bash
cd msdocs-django-web-app-managed-identity
```

---

Create a virtual environment for the app:

[!INCLUDE [Virtual environment setup](<./includes/python-web-app-managed-identity/virtual-environment-setup.md>)]

Install the dependencies:

```Console
pip install -r requirements.txt
```

For now, you're done  setting up the sample app. In later steps, you'll optionally configure the app for use in a local development environment or as a deployed web app in Azure.

## What the sample app does

The sample Python code when run locally or deployed to Azure creates a restaurant review application. Users can create restaurants and add reviews to restaurants. Reviews can have text and images.

When deployed, restaurants and review data are stored in Azure Database for PostgreSQL server. Review images are stored in Azure Blob storage. Here's an example screenshot:

:::image type="content" source="./media/python-web-app-managed-identity/example-of-review-sample-app-production-small.png" lightbox="./media/python-web-app-managed-identity/example-of-review-sample-app-production.png" alt-text="An example of the sample app showing restaurant review functionality using Azure App Service, Azure PostgreSQL Database, and Azure Storage." :::

## Next step

> [!div class="nextstepaction"]
> [Run the web app locally >>>](./tutorial-python-managed-identity-02.md)
