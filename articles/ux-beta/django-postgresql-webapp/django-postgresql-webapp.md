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

:::image type="content" border="False" source="./media/django-postgresql-webapp/django-postgresql-app-arch.png" alt-text="This is an architecture diagram about how the solution works in Azure":::

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

[!INCLUDE [Virtual environment setup](<./includes/django-postgresql-webapp/virtual-environment-setup.md>)]

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

## 1 - Create a web app in Azure

To host your application in Azure, you need to create Azure App Service web app in Azure. You can create a web app using the [Azure portal](https://portal.azure.com/), VS Code using the [Azure Tools extension pack](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack), or the Azure CLI.

### [Azure portal](#tab/azure-portal)

Sign in to the [Azure portal](https://portal.azure.com/) and follow these steps to create your Azure App Service resources.

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Create app service step 1](<./includes/django-postgresql-webapp/create-app-service-azure-portal-1.md>)] | :::image type="content" source="./media/django-postgresql-webapp/create-app-service-azure-portal-1-240px.png" alt-text="A screenshot showing how to use the search box in the top tool bar to find App Services in Azure." lightbox="./media/django-postgresql-webapp/create-app-service-azure-portal-1.png"::: |
| [!INCLUDE [Create app service step 1](<./includes/django-postgresql-webapp/create-app-service-azure-portal-2.md>)] | :::image type="content" source="./media/django-postgresql-webapp/create-app-service-azure-portal-2-240px.png" alt-text="A screenshot showing the location of the Create button on the App Services page in the Azure Portal." lightbox="./media/django-postgresql-webapp/create-app-service-azure-portal-2.png"::: |
| [!INCLUDE [Create app service step 1](<./includes/django-postgresql-webapp/create-app-service-azure-portal-3.md>)] | :::image type="content" source="./media/django-postgresql-webapp/create-app-service-azure-portal-3-240px.png" alt-text="A screenshot showing how fill out the form to create a new App Service in the Azure portal." lightbox="./media/django-postgresql-webapp/create-app-service-azure-portal-3.png"::: |
| [!INCLUDE [Create app service step 1](<./includes/django-postgresql-webapp/create-app-service-azure-portal-4.md>)] | :::image type="content" source="./media/django-postgresql-webapp/create-app-service-azure-portal-4-240px.png" alt-text="A screenshot showing how to select the basic app service plan in the Azure portal." lightbox="./media/django-postgresql-webapp/create-app-service-azure-portal-4.png"::: |
| [!INCLUDE [Create app service step 1](<./includes/django-postgresql-webapp/create-app-service-azure-portal-5.md>)] | :::image type="content" source="./media/django-postgresql-webapp/create-app-service-azure-portal-5-240px.png" alt-text="A screenshot showing the location of the Review plus Create button in the Azure portal." lightbox="./media/django-postgresql-webapp/create-app-service-azure-portal-5.png"::: |

### [VS Code](#tab/vscode-aztools)

To create Azure resources in VS Code, you must have the [Azure Tools extension pack](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack) installed and be signed into Azure from VS Code.

> [!div class="nextstepaction"]
> [Download Azure Tools extension pack](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack)

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Create app service step 1](<./includes/django-postgresql-webapp/create-app-service-vscode-1.md>)] | :::image type="content" source="./media/django-postgresql-webapp/create-app-service-vscode-1-240px.png" alt-text="A screenshot showing the location of the Azure Tools icon in the left toolbar of VS Code." lightbox="./media/django-postgresql-webapp/create-app-service-vscode-1.png"::: |
| [!INCLUDE [Create app service step 2](<./includes/django-postgresql-webapp/create-app-service-vscode-2.md>)] | :::image type="content" source="./media/django-postgresql-webapp/create-app-service-vscode-2-240px.png" alt-text="A screenshot showing the App Service section of Azure Tools extension and the context menu used to create a new web app." lightbox="./media/django-postgresql-webapp/create-app-service-vscode-2.png"::: |
| [!INCLUDE [Create app service step 4](<./includes/django-postgresql-webapp/create-app-service-vscode-3.md>)] | :::image type="content" source="./media/django-postgresql-webapp/create-app-service-vscode-3-240px.png" alt-text="A screenshot of dialog box used to enter the name of the new web app in Visual Studio Code." lightbox="./media/django-postgresql-webapp/create-app-service-vscode-3.png"::: |
| [!INCLUDE [Create app service step 5](<./includes/django-postgresql-webapp/create-app-service-vscode-4.md>)] | :::image type="content" source="./media/django-postgresql-webapp/create-app-service-vscode-4-240px.png" alt-text="A screenshot of the dialog box in VS Code used to select the runtime for the new web app." lightbox="./media/django-postgresql-webapp/create-app-service-vscode-4.png"::: |
| [!INCLUDE [Create app service step 6](<./includes/django-postgresql-webapp/create-app-service-vscode-5.md>)] | :::image type="content" source="./media/django-postgresql-webapp/create-app-service-vscode-5-240px.png" alt-text="A screenshot of the dialog in VS Code used to select the App Service plan for the new web app." lightbox="./media/django-postgresql-webapp/create-app-service-vscode-5.png"::: |

### [Azure CLI](#tab/azure-cli)

Azure CLI commands can be run in the [Azure Cloud Shell](https://shell.azure.com) or on a workstation with the [Azure CLI installed](/cli/azure/install-azure-cli).

<br />

**Step 1.** Create a resource group to act as a container for all of the Azure resources related to this application.

```azurecli
LOCATION='eastus'                          # Use 'az account list-locations --output table' to list locations
RESOURCE_GROUP_NAME='msdocs-python-webapp-quickstart'

# Create a resource group
az group create \
    --location $LOCATION \
    --name $RESOURCE_GROUP_NAME
```

<br />

**Step 2.** Create an App Service plan using the [az appservice plan create](/cli/azure/appservice/plan#az_appservice_plan_create) command.

* The `--sku` parameter defines the size (CPU, memory) and cost of the app service plan.  This example uses the B1 (Basic) service plan which will incur a small cost in your Azure subscription. For a full list of App Service plans, view the [App Service pricing](https://azure.microsoft.com/pricing/details/app-service/linux/) page.
* The `--is-linux` flag selects the Linux as the host operating system.

```azurecli
APP_SERVICE_PLAN_NAME='msdocs-python-webapp-quickstart'

az appservice plan create \
    --name $APP_SERVICE_PLAN_NAME \
    --resource-group $RESOURCE_GROUP_NAME \
    --sku B1 \
    --is-linux
```

<br/>

**Step 3.** Create the App Service web app using the [az webapp create](/cli/azure/webapp#az_webapp_create) command.

* The *app service name* is used as both the name of the resource in Azure and to form the fully qualified domain name for your app in the form of `https://<app service name>.azurewebsites.com`.
* The runtime specifies what version of Python your app is running. This example uses Python 3.8. To list all available runtimes, use the command `az webapp list-runtimes --linux --output table`.

```azurecli
APP_SERVICE_NAME='msdocs-python-webapp-quickstart-123'     # Change 123 to any three characters to form a unique name across Azure

az webapp create \
    --name $APP_SERVICE_NAME \
    --runtime 'PYTHON|3.8' \
    --plan $APP_SERVICE_PLAN_NAME \
    --resource-group $RESOURCE_GROUP_NAME \
    --query 'defaultHostName' \
    --output table
```

----

## 2 - Create the Postgres database in Azure

You can create a Postgres database in Azure using the [Azure portal](https://portal.azure.com/), Visual Studio Code, or the Azure CLI.

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
