---
title: Deploy a Python Django web app with PostgreSQL in Azure
description: Provision and deploy a Python using Django web app and PostgreSQL database on Azure.
author: jess-johnson-msft
ms.author: jejohn
ms.topic: tutorial
ms.date: 01/19/2022
ms.service: app-service
ms.role: developer
ms.devlang: python
ms.azure.devx-azure-tooling: ['azure-portal', 'vscode-azure-tools', 'azure-cli']
ms.custom: devx-track-python
ROBOTS: NOINDEX
---

# Deploy a Django web app with PostgreSQL in Azure

In this tutorial, you will deploy a data-driven Python **[Django](https://www.djangoproject.com/)** web app using an **[Azure Database for PostgreSQL](/azure/postgresql/)** database.  The Django app will be hosted in a fully managed **[Azure App Service](/azure/app-service/overview#app-service-on-linux)** in a Linux server environment. You can start with the **Basic (B1)** pricing tier that can be scaled up at any later time.

:::image type="content" border="False" source="./media/e2e-python-django-app-postgresql/webapp-postgresql-arch.png" alt-text="This is an architecture diagram about how the solution works in Azure":::

**To complete this tutorial, you'll need:**

1. An Azure account with an active subscription exists. If you do not have an Azure account, you [can create one for free](https://azure.microsoft.com/free/python).
1. Knowledge of [Python with Django development](/learn/paths/django-create-data-driven-websites/)
1. [Python 3.7 or higher](https://www.python.org/downloads/) installed locally
1. [Django](https://docs.djangoproject.com/en/4.0/topics/install/) installed locally
1. [PostgreSQL](https://www.postgresql.org/download/) installed locally

## Sample application

A sample Python application using the Django framework is provided to help you follow along with this tutorial. The `djangoapp` sample contains the data-driven Django polls app created by following [Writing your first Django app](https://docs.djangoproject.com/en/3.1/intro/tutorial01/) in the Django documentation.

To follow along with this tutorial, the completed app is available for Download or clone for your convenience.

### Get completed application code

#### [Git clone](#tab/sample-app-clone)

**Step 1.** Clone the Sample Application locally using `git`.

```bash
git clone https://github.com/Azure-Samples/djangoapp.git
```

**Step 2.** Navigate into the `djangoapp` folder:

```bash
cd djangoapp
```

#### [GitHub download](#tab/sample-app-download)

**Step 1.** Visit the [Django Sample App GitHub Repository](https://github.com/Azure-Samples/djangoapp).

**Step 2.** Select **Clone**, and then select **Download ZIP**.

**Step 3.** Unpack the ZIP file into a folder named `djangoapp`.

**Step 4.** Then open a terminal window in that `djangoapp` folder.

----

### Run the application locally

**Step 1.** Create a virtual environment for the app:

[!INCLUDE [Virtual environment setup](<./includes/quickstart-python/virtual-environment-setup.md>)]

**Step 2.** Install the dependencies:

```Console
pip install -r requirements.txt
```

**Step 3.** Run the app:

```Console
python manage.py runserver
```

**Step 4.** Browse to the sample application at `http://localhost:8000` in a web browser.

----

## 1 - Create the Postgres database in Azure

You can create a Postgres database in Azure using the [Azure portal](https://portal.azure.com/), VS Code using the [Azure Tools extension pack](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack), or the Azure CLI.

### [Azure portal](#tab/azure-portal-create-db-svr)

Sign in to the [Azure portal](https://portal.azure.com/) and follow these steps to create your Azure Database for PostgreSQL resource.

### [VS Code](#tab/vscode-create-db-svr)

To create Azure resources in VS Code, you must have the [Azure Tools extension pack](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack) installed and be signed into Azure from VS Code.

> [!div class="nextstepaction"]
> [Download Azure Tools extension pack](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack)

Follow these steps to create your Azure Database for PostgreSQL resource using the Azure Tools extension pack in Visual Studio Code.

----

## Clean up resources

You can leave the app and database running as long as you want for further development work and skip ahead to [Next steps](#next-steps). Otherwise, to avoid incurring ongoing charges, delete the resource group created for this tutorial, which deletes all the resources contained within it:

### [Azure portal](#tab/azure-portal-cleanup)

**Step 1.** On the Azure portal, enter "DjangoPostgres-Tutorial-rg" in the search bar at the top of the window, then select the same name under Resource Groups.

**Step 2.** On the resource group page, select Delete resource group.

**Step 3.** Enter the name of the resource group when prompted and select Delete.

### [VS Code](#tab/vscode-cleanup)

### [Azure CLI](#tab/azure-cli-cleanup)

----

## Next Steps
