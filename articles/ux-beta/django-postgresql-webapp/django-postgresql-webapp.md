---
title: Deploy a Python Django web app with PostgreSQL in Azure
description: Provision and deploy a Python using Django web app and PostgreSQL database on Azure.
author: jess-johnson-msft
ms.author: jejohn
ms.topic: tutorial
ms.date: 01/20/2022
ms.service: app-service
ms.role: developer
ms.devlang: python
ms.azure.devx-azure-tooling: ['azure-portal', 'vscode-azure-tools', 'azure-cli']
ms.custom: devx-track-python
ROBOTS: NOINDEX
---

# Deploy a Django web app with PostgreSQL in Azure

In this tutorial, you will deploy a data-driven Python web app using the **[Django](https://www.djangoproject.com/)** framework and an **[Azure Database for PostgreSQL](/azure/postgresql/)** database.  The Django app will be hosted in a fully managed **[Azure App Service](/azure/app-service/overview#app-service-on-linux)** which supports [Python 3.7 or higher](https://www.python.org/downloads/) in a Linux server environment. You can start with the **Basic (B1)** pricing tier that can be scaled up at any later time.

:::image type="content" border="False" source="./media/django-postgresql-webapp/django-postgresql-app-architecture-240px.png" lightbox="./media/django-postgresql-webapp/django-postgresql-app-architecture.png" alt-text="An architecture diagram showing an  App Service with a PostgreSQL database in Azure.":::

**To complete this tutorial, you'll need:**

1. An Azure account with an active subscription exists. If you do not have an Azure account, you [can create one for free](https://azure.microsoft.com/free/python).
1. Knowledge of [Python with Django development](/learn/paths/django-create-data-driven-websites/).
1. [Python 3.7 or higher](https://www.python.org/downloads/) installed locally.
1. [PostgreSQL](https://www.postgresql.org/download/) installed locally.

## 1 - Sample application

A sample Python application using the Django framework is provided to help you follow along with this tutorial. The `msdocs-python-django-webapp-quickstart` sample contains a data-driven Django polls app similar to the tutorial [Writing your first Django app](https://docs.djangoproject.com/en/3.1/intro/tutorial01/) in the Django documentation.

To follow along with this tutorial, the completed app is available to download or clone for your convenience.

### Get completed application code

#### [Git clone](#tab/sample-app-clone)

1. Clone the sample application locally using `git`:

    ```bash
    git clone https://github.com/Azure-Samples/msdocs-python-django-webapp-quickstart.git
    ```
    
2. Navigate to the *msdocs-python-django-webapp-quickstart* folder:

    ```bash
    cd msdocs-python-django-webapp-quickstart
    ```
    
#### [GitHub download](#tab/sample-app-download)

1. Visit the [Django Sample App GitHub Repository](https://github.com/Azure-Samples/msdocs-python-django-webapp-quickstart).

2. Select **Code** and then select **Download ZIP**.

3. Unpack the ZIP file into a folder named *msdocs-python-django-webapp-quickstart*.

4. Then open a terminal window in the *msdocs-python-django-webapp-quickstart* folder.

----

### Run the application locally

1. Create a virtual environment for the app:

    [!INCLUDE [Virtual environment setup](<./includes/django-postgresql-webapp/virtual-environment-setup.md>)]

1. Install the dependencies:

    ```Console
    pip install -r requirements.txt
    ```

1. Set environment variables to specify how to connect to a local PostgreSQL instance.

    This sample application requires a *.env* file describing how to connect to a local PostgreSQL instance. Create an *.env* file using the *.evn.sample* as a template. Set the value of `DBNAME` to the name of an existing database in your PostgreSQL instance. This tutorial assumes the database name is *restaurant*. Set the values of `DBHOST`, `DBUSER`, and `DBPASS` as appropriate for your local PostgreSQL instance.

    If you want to run SQLite locally instead, you can do so by following the instructions in the  *settings.py* file.

1. Create the `restaurant` database tables:

    ```Console
    python manage.py migrate
    ```

1. Run the app:

    ```Console
    python manage.py runserver
    ```

1. In a web browser, go to the sample application at `http://localhost:8000`.

    Add some restaurants and reviews of them to see how the app works.

    :::image type="content" source="./media/django-postgresql-webapp/run-django-postgresql-app-localhost.png" alt-text="Screenshot of the Django with PostgreSQL app running locally in a browser":::

----

## 2 - Create a web app in Azure

To host your application in Azure, you need to create Azure App Service web app.
### [Azure portal](#tab/azure-portal)

Sign in to the [Azure portal](https://portal.azure.com/) and follow these steps to create your Azure Database for PostgreSQL resource.

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [A screenshot showing how to use the search box in the top tool bar to find App Services in Azure](<./includes/django-postgresql-webapp/create-app-service-azure-portal-1.md>)] | :::image type="content" source="./media/django-postgresql-webapp/create-app-service-azure-portal-1-240px.png" lightbox="./media/django-postgresql-webapp/create-app-service-azure-portal-1.png" alt-text="A screenshot showing how to use the search box in the top tool bar to find App Services in Azure." ::: |
| [!INCLUDE [A screenshot showing the location of the Create button on the App Services page in the Azure portal](<./includes/django-postgresql-webapp/create-app-service-azure-portal-2.md>)] | :::image type="content" source="./media/django-postgresql-webapp/create-app-service-azure-portal-2-240px.png" lightbox="./media/django-postgresql-webapp/create-app-service-azure-portal-2.png" alt-text="A screenshot showing the location of the Create button on the App Services page in the Azure portal." ::: |
| [!INCLUDE [A screenshot showing how to fill out the form to create a new App Service in the Azure portal](<./includes/django-postgresql-webapp/create-app-service-azure-portal-3.md>)] | :::image type="content" source="./media/django-postgresql-webapp/create-app-service-azure-portal-3-240px.png" lightbox="./media/django-postgresql-webapp/create-app-service-azure-portal-3.png" alt-text="A screenshot showing how to fill out the form to create a new App Service in the Azure portal." ::: |
| [!INCLUDE [A screenshot showing how to select the basic App Service plan in the Azure portal](<./includes/django-postgresql-webapp/create-app-service-azure-portal-4.md>)] | :::image type="content" source="./media/django-postgresql-webapp/create-app-service-azure-portal-4-240px.png" lightbox="./media/django-postgresql-webapp/create-app-service-azure-portal-4.png" alt-text="A screenshot showing how to select the basic App Service plan in the Azure portal." ::: |
| [!INCLUDE [A screenshot showing the location of the Review plus Create button in the Azure portal](<./includes/django-postgresql-webapp/create-app-service-azure-portal-5.md>)] | :::image type="content" source="./media/django-postgresql-webapp/create-app-service-azure-portal-5-240px.png" lightbox="./media/django-postgresql-webapp/create-app-service-azure-portal-5.png" alt-text="A screenshot showing the location of the Review plus Create button in the Azure portal." ::: |

### [VS Code](#tab/vscode-aztools)

To create Azure resources in VS Code, you must have the [Azure Tools extension pack](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack) installed and be signed into Azure from VS Code.

> [!div class="nextstepaction"]
> [Download Azure Tools extension pack](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack)

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [A screenshot showing how to use the search box in the top tool bar to find App Services in Azure](<./includes/django-postgresql-webapp/create-app-service-vscode-1.md>)] | :::image type="content" source="./media/django-postgresql-webapp/create-app-service-vscode-1-240px.png" lightbox="./media/django-postgresql-webapp/create-app-service-vscode-1.png" alt-text="A screenshot showing how to use the search box in the top tool bar to find App Services in Azure." ::: |
| [!INCLUDE [A screenshot showing how to use the search box in the top tool bar to find App Services in Azure](<./includes/django-postgresql-webapp/create-app-service-vscode-2.md>)] | :::image type="content" source="./media/django-postgresql-webapp/create-app-service-vscode-2-240px.png" lightbox="./media/django-postgresql-webapp/create-app-service-vscode-2.png" alt-text="A screenshot showing how to use the search box in the top tool bar to find App Services in Azure." ::: |
| [!INCLUDE [A screenshot showing how to use the search box in the top tool bar to find App Services in Azure](<./includes/django-postgresql-webapp/create-app-service-vscode-3.md>)] | :::image type="content" source="./media/django-postgresql-webapp/create-app-service-vscode-3-240px.png" lightbox="./media/django-postgresql-webapp/create-app-service-vscode-3.png" alt-text="A screenshot showing how to use the search box in the top tool bar to find App Services in Azure." ::: |
| [!INCLUDE [A screenshot showing how to use the search box in the top tool bar to find App Services in Azure](<./includes/django-postgresql-webapp/create-app-service-vscode-4.md>)] | :::image type="content" source="./media/django-postgresql-webapp/create-app-service-vscode-4-240px.png" lightbox="./media/django-postgresql-webapp/create-app-service-vscode-4.png" alt-text="A screenshot showing how to use the search box in the top tool bar to find App Services in Azure." ::: |
| [!INCLUDE [A screenshot showing how to use the search box in the top tool bar to find App Services in Azure](<./includes/django-postgresql-webapp/create-app-service-vscode-5.md>)] | :::image type="content" source="./media/django-postgresql-webapp/create-app-service-vscode-5-240px.png" lightbox="./media/django-postgresql-webapp/create-app-service-vscode-5.png" alt-text="A screenshot showing how to use the search box in the top tool bar to find App Services in Azure." ::: |
| [!INCLUDE [A screenshot showing how to use the search box in the top tool bar to find App Services in Azure](<./includes/django-postgresql-webapp/create-app-service-vscode-6.md>)] | :::image type="content" source="./media/django-postgresql-webapp/create-app-service-vscode-6-240px.png" lightbox="./media/django-postgresql-webapp/create-app-service-vscode-6.png" alt-text="A screenshot showing how to use the search box in the top tool bar to find App Services in Azure." ::: |
| [!INCLUDE [A screenshot showing how to use the search box in the top tool bar to find App Services in Azure](<./includes/django-postgresql-webapp/create-app-service-vscode-7.md>)] | :::image type="content" source="./media/django-postgresql-webapp/create-app-service-vscode-7a-240px.png" lightbox="./media/django-postgresql-webapp/create-app-service-vscode-7a.png" alt-text="A screenshot showing how to use the search box in the top tool bar to find App Services in Azure." ::: <br /> :::image type="content" source="./media/django-postgresql-webapp/create-app-service-vscode-7b-240px.png" lightbox="./media/django-postgresql-webapp/create-app-service-vscode-7b.png" alt-text="A screenshot showing how to use the search box in the top tool bar to find App Services in Azure." ::: |
| [!INCLUDE [A screenshot showing how to use the search box in the top tool bar to find App Services in Azure](<./includes/django-postgresql-webapp/create-app-service-vscode-8.md>)] | :::image type="content" source="./media/django-postgresql-webapp/create-app-service-vscode-8-240px.png" lightbox="./media/django-postgresql-webapp/create-app-service-vscode-8.png" alt-text="A screenshot showing how to use the search box in the top tool bar to find App Services in Azure." ::: |
| [!INCLUDE [A screenshot showing how to use the search box in the top tool bar to find App Services in Azure](<./includes/django-postgresql-webapp/create-app-service-vscode-9.md>)] | :::image type="content" source="./media/django-postgresql-webapp/create-app-service-vscode-9a-240px.png" lightbox="./media/django-postgresql-webapp/create-app-service-vscode-9a.png" alt-text="A screenshot showing how to use the search box in the top tool bar to find App Services in Azure." ::: <br /> :::image type="content" source="./media/django-postgresql-webapp/create-app-service-vscode-9b-240px.png" lightbox="./media/django-postgresql-webapp/create-app-service-vscode-9b.png" alt-text="A screenshot showing how to use the search box in the top tool bar to find App Services in Azure." ::: |
| [!INCLUDE [A screenshot showing how to use the search box in the top tool bar to find App Services in Azure](<./includes/django-postgresql-webapp/create-app-service-vscode-10.md>)] | :::image type="content" source="./media/django-postgresql-webapp/create-app-service-vscode-10a-240px.png" lightbox="./media/django-postgresql-webapp/create-app-service-vscode-10a.png" alt-text="A screenshot showing how to use the search box in the top tool bar to find App Services in Azure." ::: <br /><br /> :::image type="content" source="./media/django-postgresql-webapp/create-app-service-vscode-10b-240px.png" lightbox="./media/django-postgresql-webapp/create-app-service-vscode-10b.png" alt-text="A screenshot showing how to use the search box in the top tool bar to find App Services in Azure." ::: <br /><br /> :::image type="content" source="./media/django-postgresql-webapp/create-app-service-vscode-10c-240px.png" lightbox="./media/django-postgresql-webapp/create-app-service-vscode-10c.png" alt-text="A screenshot showing how to use the search box in the top tool bar to find App Services in Azure." :::  |

### [Azure CLI](#tab/azure-cli)

Azure CLI commands can be run in the [Azure Cloud Shell](https://shell.azure.com) or on a workstation with the [Azure CLI installed](/cli/azure/install-azure-cli).

**Step 1.** Create a *resource group* using the [az group create](/cli/azure/group/az-group-create) command. A *resource group* will act as a container for all of the Azure resources related to this application.

```azurecli
LOCATION='eastus'
RESOURCE_GROUP_NAME='msdocs-django-postgres-webapp-rg'

# Create a resource group
az group create \
    --location $LOCATION \
    --name $RESOURCE_GROUP_NAME
```

* *location* &rarr; A location near you, for example `eastus`. Use `az account list-locations --output table` to list locations.
* *name* &rarr; You will use this resource group to organize all the Azure resources needed to complete this tutorial. (for example, `msdocs-django-postgres-webapp-rg`)

**Step 2.** Create an *App Service plan* using the [az appservice plan create](/cli/azure/appservice/plan#az_appservice_plan_create) command.

```azurecli
APP_SERVICE_PLAN_NAME='msdocs-django-postgres-webapp-plan'

az appservice plan create \
    --name $APP_SERVICE_PLAN_NAME \
    --resource-group $RESOURCE_GROUP_NAME \
    --sku B1 \
    --is-linux
```

* *name* &rarr; Name for the Azure Web App plan, `msdocs-django-postgres-webapp-plan`
* *resource-group* &rarr; Use the same resource group name you used when you created the web app, for example `msdocs-django-postgres-webapp-rg`.
* *sku* &rarr; Defines the size (CPU, memory) and cost of the app service plan.  This example uses the B1 (Basic) service plan, which will incur a small cost in your Azure subscription. For a full list of App Service plans, view the [App Service pricing](https://azure.microsoft.com/pricing/details/app-service/linux/) page.
* *is-linux* &rarr; Selects Linux as the host operating system.

**Step 3.** Create the *App Service web app* using the [az webapp create](/cli/azure/webapp#az_webapp_create) command.

```azurecli
APP_SERVICE_NAME='msdocs-django-postgres-webapp'

az webapp create \
    --name $APP_SERVICE_NAME \
    --runtime 'PYTHON|3.9' \
    --plan $APP_SERVICE_PLAN_NAME \
    --resource-group $RESOURCE_GROUP_NAME \
    --query 'defaultHostName' \
    --output table
```

* *name* &rarr; The app service name is used as both the name of the resource in Azure and to form the fully qualified domain name for your app in the form of the server endpoint `https://<app-service-name>.azurewebsites.com`. This name must be **unique across all Azure** and the only allowed characters are `A`-`Z`, `0`-`9`, and `-`. (for example, `msdocs-django-postgres-webapp`)
* *runtime* &rarr; The runtime specifies what version of Python your app is running. This example uses **Python 3.9**. To list all available runtimes, use the command `az webapp list-runtimes --linux --output table`.
* *plan* &rarr; Use the same *app service plan* name from **Step 2**. (`msdocs-django-postgres-webapp-plan`)
* *resource-group* &rarr; Use the same resource group name from **Step 1**. (`msdocs-django-postgres-webapp-rg`)

----

## 3 - Create the Postgres database in Azure

You can create a Postgres database in Azure using the [Azure portal](https://portal.azure.com/), Visual Studio Code, or the Azure CLI.

### [Azure portal](#tab/azure-portal)

Sign in to the [Azure portal](https://portal.azure.com/) and follow these steps to create your Azure App Service resources.

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [A screenshot showing how to use the search box in the top tool bar to find Postgres Services in Azure](<./includes/django-postgresql-webapp/create-postgres-service-azure-portal-1.md>)] | :::image type="content" source="./media/django-postgresql-webapp/create-postgres-service-azure-portal-1-240px.png" lightbox="./media/django-postgresql-webapp/create-postgres-service-azure-portal-1.png" alt-text="A screenshot showing how to use the search box in the top tool bar to find Postgres Services in Azure." ::: |
| [!INCLUDE [A screenshot showing the location of the Create button on the Azure Database for PostgreSQL servers page in the Azure portal](<./includes/django-postgresql-webapp/create-postgres-service-azure-portal-2.md>)] | :::image type="content" source="./media/django-postgresql-webapp/create-postgres-service-azure-portal-2-240px.png" lightbox="./media/django-postgresql-webapp/create-postgres-service-azure-portal-2.png" alt-text="A screenshot showing the location of the Create button on the Azure Database for PostgreSQL servers page in the Azure portal." ::: |
| [!INCLUDE [A screenshot showing the location of the Create Single Server button on the Azure Database for PostgreSQL deployment option page in the Azure portal](<./includes/django-postgresql-webapp/create-postgres-service-azure-portal-3.md>)] | :::image type="content" source="./media/django-postgresql-webapp/create-postgres-service-azure-portal-3-240px.png" lightbox="./media/django-postgresql-webapp/create-postgres-service-azure-portal-3.png" alt-text="A screenshot showing the location of the Create Single Server button on the Azure Database for PostgreSQL deployment option page in the Azure portal." ::: |
| [!INCLUDE [A screenshot showing how to fill out the form to create a new Azure Database for PostgreSQL in the Azure portal](<./includes/django-postgresql-webapp/create-postgres-service-azure-portal-4.md>)] | :::image type="content" source="./media/django-postgresql-webapp/create-postgres-service-azure-portal-4-240px.png" lightbox="./media/django-postgresql-webapp/create-postgres-service-azure-portal-4.png" alt-text="A screenshot showing how to fill out the form to create a new Azure Database for PostgreSQL in the Azure portal." ::: |
| [!INCLUDE [A screenshot showing how to select and configure the basic database service plan in the Azure portal](<./includes/django-postgresql-webapp/create-postgres-service-azure-portal-5.md>)] | :::image type="content" source="./media/django-postgresql-webapp/create-postgres-service-azure-portal-5-240px.png" lightbox="./media/django-postgresql-webapp/create-postgres-service-azure-portal-5.png" alt-text="A screenshot showing how to select and configure the basic database service plan in the Azure portal." ::: |
| [!INCLUDE [A screenshot showing the location of the Review plus Create button in the Azure portal](<./includes/django-postgresql-webapp/create-postgres-service-azure-portal-6.md>)] | :::image type="content" source="./media/django-postgresql-webapp/create-postgres-service-azure-portal-6-240px.png" lightbox="./media/django-postgresql-webapp/create-postgres-service-azure-portal-6.png" alt-text="A screenshot showing the location of the Review plus Create button in the Azure portal." ::: |
| [!INCLUDE [A screenshot showing the location and adding a firewall rule in the Azure portal](<./includes/django-postgresql-webapp/create-postgres-service-azure-portal-7.md>)] |  |

[!INCLUDE [A screenshot showing creating the restaurant database in the Azure Cloud Shell](<./includes/django-postgresql-webapp/create-postgres-service-azure-portal-8.md>)]

### [VS Code](#tab/vscode-aztools)

Follow these steps to create your Azure Database for PostgreSQL resource using the [Azure Tools extension pack](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack) in Visual Studio Code.

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Open Azure Extension - Database in VS Code](<./includes/django-postgresql-webapp/create-postgres-service-vscode-1.md>)] | :::image type="content" source="./media/django-postgresql-webapp/create-postgres-service-vscode-1-240px.png" lightbox="./media/django-postgresql-webapp/create-postgres-service-vscode-1.png" alt-text="Open Azure Extension - Database." ::: |
| [!INCLUDE [Create database server in VS Code](<./includes/django-postgresql-webapp/create-postgres-service-vscode-2.md>)] | :::image type="content" source="./media/django-postgresql-webapp/create-postgres-service-vscode-2-240px.png" alt-text="Create database server with VSCode." lightbox="./media/django-postgresql-webapp/create-postgres-service-vscode-2.png"::: |
| [!INCLUDE [Azure portal - create new resource](<./includes/django-postgresql-webapp/create-postgres-service-vscode-3.md>)] | :::image type="content" source="./media/django-postgresql-webapp/create-postgres-service-vscode-3-240px.png" alt-text="Create a new Resource in the Azure portal." lightbox="./media/django-postgresql-webapp/create-postgres-service-vscode-3.png"::: |
| [!INCLUDE [Azure portal - create new resource](<./includes/django-postgresql-webapp/create-postgres-service-vscode-4.md>)] | :::image type="content" source="./media/django-postgresql-webapp/create-postgres-service-vscode-4a-240px.png" alt-text="Create a new Resource in the Azure portal." lightbox="./media/django-postgresql-webapp/create-postgres-service-vscode-4a.png"::: :::image type="content" source="./media/django-postgresql-webapp/create-postgres-service-vscode-4b-240px.png" alt-text="Create a new Resource in the Azure portal." lightbox="./media/django-postgresql-webapp/create-postgres-service-vscode-4b.png"::: :::image type="content" source="./media/django-postgresql-webapp/create-postgres-service-vscode-4c-240px.png" alt-text="Create a new Resource in the Azure portal." lightbox="./media/django-postgresql-webapp/create-postgres-service-vscode-4c.png"::: :::image type="content" source="./media/django-postgresql-webapp/create-postgres-service-vscode-4d-240px.png" alt-text="Create a new Resource in the Azure portal." lightbox="./media/django-postgresql-webapp/create-postgres-service-vscode-4d.png"::: :::image type="content" source="./media/django-postgresql-webapp/create-postgres-service-vscode-4e-240px.png" alt-text="Create a new Resource in the Azure portal." lightbox="./media/django-postgresql-webapp/create-postgres-service-vscode-4e.png"::: :::image type="content" source="./media/django-postgresql-webapp/create-postgres-service-vscode-4f-240px.png" alt-text="Create a new Resource in the Azure portal." lightbox="./media/django-postgresql-webapp/create-postgres-service-vscode-4f.png":::|
| [!INCLUDE [Create a new Azure resource in the Azure portal](<./includes/django-postgresql-webapp/create-postgres-service-vscode-5.md>)] | :::image type="content" source="./media/django-postgresql-webapp/create-postgres-service-vscode-5-240px.png" lightbox="./media/django-postgresql-webapp/create-postgres-service-vscode-5.png" alt-text="Create a new Azure resource in the Azure portal." ::: |
| [!INCLUDE [Create a new Azure resource in the Azure portal](<./includes/django-postgresql-webapp/create-postgres-service-vscode-6.md>)] | :::image type="content" source="./media/django-postgresql-webapp/create-postgres-service-vscode-6-240px.png" lightbox="./media/django-postgresql-webapp/create-postgres-service-vscode-6.png" alt-text="Create a new Azure resource in the Azure portal." ::: |

### [Azure CLI](#tab/azure-cli)

Run `az login` to sign in to  and follow these steps to create your Azure Database for PostgreSQL resource.

**Step 1.** Run the [az postgres up](/cli/azure/postgres#az_postgres_up) command to create the PostgreSQL server and database in Azure using the values below. It is not uncommon for this command to run for a few minutes to complete.

```azurecli
DB_SERVER_NAME='msdocs-django-postgres-webapp-db'
DB_NAME='restaurant'
ADMIN_USERNAME='demoadmin'

az postgres server create --resource-group $RESOURCE_GROUP_NAME \
                          --name $DB_SERVER_NAME  \
                          --location $LOCATION \
                          --admin-user $ADMIN_USERNAME \
                          --admin-password '<enter-admin-password>' \
                          --sku-name B_Gen5_1 \
                          --ssl-enforcement Enabled
```

* *resource-group* &rarr; Use the same resource group name from **Step 1**. (`msdocs-django-postgres-webapp-rg`)
* *name* &rarr; The PostgreSQL database server name. This name must be **unique across all Azure** (the server endpoint becomes `https://<name>.postgres.database.azure.com`). Allowed characters are `A`-`Z`, `0`-`9`, and `-`. A good pattern is to use a combination of your company name and server identifier. (`msdocs-django-postgres-webapp-db`)
* *location* &rarr; Use the same location use used for the web app.
* *sku-name* &rarr; The name of the pricing tier and compute configuration, for example `B_Gen5_1`. Follow the convention {pricing tier}{compute generation}{vCores} set create this variable. For more information, see [Azure Database for PostgreSQL pricing](https://azure.microsoft.com/pricing/details/postgresql/server/).
* *admin-user* &rarr; Username for the administrator login. It can't be `azure_superuser`, `admin`, `administrator`, `root`, `guest`, or `public`. For example, `demoadmin` is okay.
* *admin-password* Password of the administrator user. It must contain 8 to 128 characters from three of the following categories: English uppercase letters, English lowercase letters, numbers, and non-alphanumeric characters.
* *SSL enforcement* &rarr; Enable or disable ssl enforcement for connections to server.

> [!IMPORTANT]
> When creating usernames or passwords **do not** use the `$` character. Later you create environment variables with these values where the `$` character has special meaning within the Linux container used to run Python apps.

**Step 2.** Configure the firewall rules on your server by using the [az postgres server firewall-rule create](/cli/azure/postgres/server/firewall-rule) command to give your the web app and local environment access to connect to the server.

First, create a rule that allows other Azure services to connect.

```azurecli
az postgres server firewall-rule create --resource-group $RESOURCE_GROUP_NAME \
                                        --server $DB_SERVER_NAME \
                                        --name AllowAllWindowsAzureIps \
                                        --start-ip-address 0.0.0.0 \
                                        --end-ip-address 0.0.0.0
```

* *resource-group* &rarr; Name of resource group from earlier in this tutorial. (`msdocs-django-postgres-webapp-rg`)
* *server* &rarr; Name of the server from **Step 1**. (`msdocs-django-postgres-webapp-db`)
* *name* &rarr; Name for firewall rule. (use `AllowAllWindowsAzureIps`)
* *start-ip-address, end-ip-address* &rarr; `0.0.0.0` signals that access will be from other Azure services. This is sufficient for a demonstration app, but for a production app you should use an [Azure Virtual Network](/azure/virtual-network/virtual-networks-overview).

Repeat the command to add a firewall rule with `name` equal to *AllMyIp* and the `start-ip-address` and `end-ip-address` equal to your IP address. This allows you to connect your local environment to the database. To get your current IP address, see [WhatIsMyIPAddress.com](https://whatismyipaddress.com/).

```azurecli
az postgres server firewall-rule create --resource-group $RESOURCE_GROUP_NAME \
                                        --server $DB_SERVER_NAME \
                                        --name AllowMyIP \
                                        --start-ip-address <your IP> \
                                        --end-ip-address <your IP>
```

**Step 3.** Get the connection information by using the [az postgres server show](/cli/azure/postgres/server/az-postgres-server-show). This command outputs a JSON object that contains different connection strings for the database along with the server URL. **Copy the administratorLogin and fullyQualifiedDomainName values to a temporary text file** as you need them later in this tutorial.

```azurecli
az postgres server show --name $DB_SERVER_NAME \
                        -- resource-group $RESOURCE_GROUP_NAME
```

* *resource-group* &rarr; Name of resource group from earlier in this tutorial. (`msdocs-django-postgres-webapp-rg`)
* *name* &rarr; Name of the server from **Step 1**. (`msdocs-django-postgres-webapp-db`)

**Step 4.** In the [Azure Cloud Shell](https://shell.azure.com) or in your local environment, connect to the PostgreSQL server, and create the `restaurant` database.

```Console
psql --host=<server-name>.postgres.database.azure.com \
     --port=5432 \
     --username=<admin-user>@<server name> \
     --dbname=postgres

postgres=> CREATE DATABASE restaurant;
```

The values of `<server name>` and `<admin-user>` are the values from a previous step.

**Step 5.** *(optional)* Verify `restaurant` database was successfully created by running  `\c restaurant` to change the prompt from `postgre`  (default) to `restaurant`.

```Console
postgres=> \c restaurant
restaurant=>
```

Type `\?` to show help or `\q` to quit.

----

## 4 - Connect the app to the database

With the web app and Postgres database created, the next step is to connect the web app to the Postgres database in Azure.

The web app code uses database information in four environment variables named `DBHOST`, `DBNAME`, `DBUSER`, and `DBPASS` to connect to the PostgresSQL server.

### [Azure portal](#tab/azure-portal)

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Azure portal connect app to postgres step 1](<./includes/django-postgresql-webapp/connect-postgres-to-app-azure-portal-1.md>)] | :::image type="content" source="./media/django-postgresql-webapp/connect-postgres-to-app-azure-portal-1-240px.png" lightbox="./media/django-postgresql-webapp/connect-postgres-to-app-azure-portal-1.png" alt-text="A screenshot showing how to navigate to App Settings in the Azure portal." ::: |
| [!INCLUDE [Azure portal connect app to postgres step 2](<./includes/django-postgresql-webapp/connect-postgres-to-app-azure-portal-2.md>)] | :::image type="content" source="./media/django-postgresql-webapp/connect-postgres-to-app-azure-portal-2-240px.png" lightbox="./media/django-postgresql-webapp/connect-postgres-to-app-azure-portal-2.png" alt-text="A screenshot showing how to configure the App Settings in the Azure portal." ::: |

### [VS Code](#tab/vscode-aztools)

To configure environment variables for the web app from VS Code, you must have the [Azure Tools extension pack](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack) installed and be signed into Azure from VS Code.

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [VS Code connect app to postgres step 1](<./includes/django-postgresql-webapp/connect-postgres-to-app-vscode-1.md>)] | :::image type="content" source="./media/django-postgresql-webapp/connect-app-to-database-azure-extension-240px.png" lightbox="./media/django-postgresql-webapp/connect-app-to-database-azure-extension.png" alt-text="A screenshot showing how to locate the Azure Tools extension in VS Code." ::: |
| [!INCLUDE [VS Code connect app to postgres step 2](<./includes/django-postgresql-webapp/connect-postgres-to-app-vscode-2.md>)] | :::image type="content" source="./media/django-postgresql-webapp/connect-app-to-database-create-setting-240px.png" lightbox="./media/django-postgresql-webapp/connect-app-to-database-create-setting.png" alt-text="A screenshot showing how to add a setting to the App Service." ::: |
| [!INCLUDE [VS Code connect app to postgres step 3](<./includes/django-postgresql-webapp/connect-postgres-to-app-vscode-3.md>)] | :::image type="content" source="./media/django-postgresql-webapp/connect-app-to-database-settings-example-240px.png" lightbox="./media/django-postgresql-webapp/connect-app-to-database-settings-example.png" alt-text="A screenshot showing adding settings for app service to connect to Postgresql database." ::: |

### [Azure CLI](#tab/azure-cli)

To set environment variables in App Service, you create *app settings* with the following [az webapp config appsettings set](/cli/azure/webapp/config/appsettings#az_webapp_config_appsettings_set) command.

```azurecli
az webapp config appsettings set \
   --resource-group $RESOURCE_GROUP_NAME \
   --name $APP_SERVICE_NAME \
   --settings DBHOST=$DB_SERVER_NAME DBNAME=$DB_NAME  DBUSER=$ADMIN_USERNAME DBPASS=$ADMIN_PWD
```

* *DBHOST* &rarr; Use the name of the name you used earlier with the `az postgres up` command. The code in *azuresite/production.py* automatically appends `.postgres.database.azure.com` to create the full Postgres server URL.
* *DBNAME* &rarr; Use `restaurant`
* *DBUSER, DBPASS* &rarr; Use the administrator credentials that you used with the earlier `az postgres up` command, or those that `az postgres up` generated for you. The code in *azuresite/production.py* automatically constructs the full Postgres username from `DBUSER` and `DBHOST`, so don't include the `@server` portion. |

>[!NOTE]
> The resource group and app names are drawn from the cached values in the *.azure/config* file.

----

## 5 - Deploy your application code to Azure

Azure App service supports multiple methods to deploy your application code to Azure including support for GitHub Actions and all major CI/CD tools. This article focuses on how to deploy your code from your local workstation to Azure.

### [Deploy using VS Code <span style="background:mistyrose">TBD</span>](#tab/vscode-aztools-deploy)

To deploy a web app from VS Code, you must have the [Azure Tools extension pack](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack) installed and be signed into Azure from VS Code.

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [VS Code deploy step 1](<./includes/django-postgresql-webapp/deploy-vscode-1.md>)] | :::image type="content" source="./media/django-postgresql-webapp/connect-app-to-database-azure-extension-240px.png" lightbox="./media/django-postgresql-webapp/connect-app-to-database-azure-extension.png" alt-text="A screenshot showing how to locate the Azure Tools extension in VS Code." ::: |
| [!INCLUDE [VS Code deploy step 2](<./includes/django-postgresql-webapp/deploy-vscode-2.md>)] | :::image type="content" source="./media/django-postgresql-webapp/deploy-web-app-vs-code-240px.png" lightbox="./media/django-postgresql-webapp/deploy-web-app-vs-code.png" alt-text="A screenshot showing how to deploy a web app." ::: |
| [!INCLUDE [VS Code deploy step 3](<./includes/django-postgresql-webapp/deploy-vscode-3.md>)] | |
| [!INCLUDE [VS Code deploy step 4](<./includes/django-postgresql-webapp/deploy-vscode-4.md>)] | |
| [!INCLUDE [VS Code deploy step 5](<./includes/django-postgresql-webapp/deploy-vscode-5.md>)] | |

### [Deploy using Local Git](#tab/local-git-deploy)

[!INCLUDE [Deploy Local Git](<./includes/django-postgresql-webapp/deploy-local-git.md>)]

### [Deploy using a ZIP file](#tab/zip-deploy)

[!INCLUDE [Deploy using ZIP file](<./includes/django-postgresql-webapp/deploy-zip-file.md>)]

----

## 6 - Migrate app database

With the code deployed and the database in place, the app is almost ready to use. The only piece that remains is to establish the necessary schema in the database itself. You do this by "migrating" the data models in the Django app to the database.

**Instructions:**

**Step 1.** Create SSH session and connect to web app server.

### [Azure portal](#tab/azure-portal)

Navigate to page for the App Service instance in the Azure portal.

1. Select **SSH**, under **Development Tools** on the left side
2. Then **Go** to open an SSH console on the web app server. (It may take a minute to connect for the first time as the web app container needs to start.)

### [VS Code](#tab/vscode-aztools)

In VS Code, you can use the [Azure Tools extension pack](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack), which must be installed and be signed into Azure from VS Code.

In the **App Service** section of the Azure Tools extension:

1. Locate your web app and right-click to bring up the context menu.
2. Select **SSH into Web App** to open a SSH terminal window.

### [Azure CLI](#tab/azure-cli)

Run `az webpp ssh` to open an SSH session for the web app in the browser:

```azurecli
az webapp ssh --resource-group $RESOURCE_GROUP_NAME \
              --name $APP_SERVICE_NAME
```

----

**Step 2.** In the SSH session, run the following command to migrate the models into the database schema (you can paste commands using **Ctrl**+**Shift**+**V**): 

```bash
python manage.py migrate
```

If you encounter any errors related to connecting to the database, check the values of the application settings of the App Service created in the previous section, namely `DBHOST`, `DBNAME`, `DBUSER`, and `DBPASS`. Without those settings, the migrate command cannot communicate with the database.

**Step 3.** Create an administrator login for the app:

```bash
python manage.py createsuperuser
```

The `createsuperuser` command prompts you for Django superuser (or admin) credentials, which are used within the web app. For the purposes of this tutorial, use the default username `root`, press **Enter** for the email address to leave it blank, and enter `Restaurantsdb1` for the password.

> [!NOTE]
> If you cannot connect to the SSH session, then the app itself has failed to start. **Check the diagnostic logs** for details. For example, if you haven't created the necessary app settings in the previous section, the logs will indicate `KeyError: 'DBNAME'`.

----

## 7 - Browse to the app

Browse to the deployed application in your web browser at the URL `http://<app-name>.azurewebsites.net`. It can take a minute or two for the app to start, so if you see a default app page, wait a minute and refresh the browser.

The Python sample code is running a Linux container in App Service using a built-in image.

**Congratulations!** You've deployed your Python app to App Service.

## 8 - Stream diagnostic logs

Azure App Service captures all messages output to the console to assist you in diagnosing issues with your application. The sample apps include `print()` statements to demonstrate this capability as shown below.

:::code language="python" source="~/../msdocs-django-postgresql-sample-app/restaurant_review/views.py" range="12-16" highlight="2":::

You can access the console logs generated from inside the container that hosts the app on Azure.

### [Azure portal <span style="background:mistyrose">TBD</span>](#tab/azure-portal)

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Stream logs from Azure portal 1](<./includes/django-postgresql-webapp/stream-logs-azure-portal-1.md>)] | :::image type="content" source="./media/django-postgresql-webapp/pending-screenshot-240x160.png" lightbox="./media/django-postgresql-webapp/pending-screenshot-850x550.png" alt-text="A screenshot showing how to set application logging in the Azure portal." ::: |
| [!INCLUDE [Stream logs from Azure portal 2](<./includes/django-postgresql-webapp/stream-logs-azure-portal-2.md>)] | :::image type="content" source="./media/django-postgresql-webapp/pending-screenshot-240x160.png" lightbox="./media/django-postgresql-webapp/pending-screenshot-850x550.png" alt-text="A screenshot showing how to to stream logs in the Azure portal." ::: |

### [VS Code <span style="background:mistyrose">TBD</span>](#tab/vscode-aztools)

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Stream logs from VS Code 1](<./includes/django-postgresql-webapp/stream-logs-vscode-1.md>)] | :::image type="content" source="./media/django-postgresql-webapp/pending-screenshot-240x160.png" lightbox="./media/django-postgresql-webapp/pending-screenshot-850x550.png" alt-text="A screenshot showing how to set application logging in VS Code." ::: |
| [!INCLUDE [Stream logs from VS Code 2](<./includes/django-postgresql-webapp/stream-logs-vscode-2.md>)] | :::image type="content" source="./media/django-postgresql-webapp/pending-screenshot-240x160.png" lightbox="./media/django-postgresql-webapp/pending-screenshot-850x550.png" alt-text="A screenshot showing VS Code output window." ::: |

### [Azure CLI](#tab/azure-cli)

Run the following Azure CLI commands to see the log stream. This command uses parameters cached in the .azure/config file.

**Step 1.** Configure Azure App Service to output logs to the App Service filesystem using the [az webapp log config](/cli/azure/webapp/log#az_webapp_log_config) command.

```azurecli
az webapp log config \
    --web-server-logging filesystem \
    --name $APP_SERVICE_NAME \
    --resource-group $RESOURCE_GROUP_NAME
```

**Step 2.** To stream logs, use the [az webapp log tail](/cli/azure/webapp/log#az_webapp_log_tail) command.

```azurecli
az webapp log tail \
    --name $APP_SERVICE_NAME \
    --resource-group $RESOURCE_GROUP_NAME
```

**Step 3.** Refresh the home page in the app or attempt other requests to generate some log messages. The output should look similar to the following.

```Output
Starting Live Log Stream ---

2022-02-10T14:01:00.846167125Z Request for index page received
2022-02-10T14:01:00.847060433Z 169.254.130.1 - - [10/Feb/2022:14:01:00 +0000] "GET / HTTP/1.1" 200 4909 "https://vmagelo-msdocs-django-postgres-webapp2.azurewebsites.net/1/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.80 Safari/537.36 Edg/98.0.1108.43"
2022-02-10T14:01:00.909664401Z 169.254.130.1 - - [10/Feb/2022:14:01:00 +0000] "GET /static/bootstrap/css/bootstrap.min.css HTTP/1.1" 200 0 "https://vmagelo-msdocs-django-postgres-webapp2.azurewebsites.net/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.80 Safari/537.36 Edg/98.0.1108.43"
2022-02-10T14:01:00.921269807Z 169.254.130.1 - - [10/Feb/2022:14:01:00 +0000] "GET /static/fontawesome/css/all.min.css HTTP/1.1" 200 0 "https://vmagelo-msdocs-django-postgres-webapp2.azurewebsites.net/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.80 Safari/537.36 Edg/98.0.1108.43"
2022-02-10T14:01:01.022254723Z 169.254.130.1 - - [10/Feb/2022:14:01:01 +0000] "GET /static/images/azure-icon.svg HTTP/1.1" 200 0 "https://vmagelo-msdocs-django-postgres-webapp2.azurewebsites.net/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.80 Safari/537.36 Edg/98.0.1108.43"
2022-02-10T14:01:01.032642118Z 169.254.130.1 - - [10/Feb/2022:14:01:01 +0000] "GET /static/bootstrap/js/bootstrap.min.js HTTP/1.1" 200 0 "https://vmagelo-msdocs-django-postgres-webapp2.azurewebsites.net/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.80 Safari/537.36 Edg/98.0.1108.43"
2022-02-10T14:01:01.225921972Z 169.254.130.1 - - [10/Feb/2022:14:01:01 +0000] "GET /static/fontawesome/webfonts/fa-solid-900.woff2 HTTP/1.1" 200 0 "https://vmagelo-msdocs-django-postgres-webapp2.azurewebsites.net/static/fontawesome/css/all.min.css" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.80 Safari/537.36 Edg/98.0.1108.43"
```

----

## Clean up resources

You can leave the app and database running as long as you want for further development work and skip ahead to [Next steps](#next-steps).

However, when you are finished with the sample app, you can remove all of the resources for the app from Azure to ensure you do not incur additional charges and keep your Azure subscription uncluttered. Removing the resource group also removes all resources in the resource group and is the fastest way to remove all Azure resources for your app.

### [Azure portal <span style="background:mistyrose">TBD</span>](#tab/azure-portal)

Follow these steps while signed-in to the Azure portal to delete a resource group.

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Remove resource group Azure portal 1](<./includes/django-postgresql-webapp/remove-resource-group-azure-portal-1.md>)] | :::image type="content" source="./media/django-postgresql-webapp/pending-screenshot-240x160.png" lightbox="./media/django-postgresql-webapp/pending-screenshot-850x550.png" alt-text="A screenshot showing how to find resource group in the Azure portal." ::: |
| [!INCLUDE [Remove resource group Azure portal 2](<./includes/django-postgresql-webapp/remove-resource-group-azure-portal-2.md>)] | :::image type="content" source="./media/django-postgresql-webapp/pending-screenshot-240x160.png" lightbox="./media/django-postgresql-webapp/pending-screenshot-850x550.png" alt-text="A screenshot showing how to delete a resource group in the Azure portal." ::: |
| [!INCLUDE [Remove resource group Azure portal 3](<./includes/django-postgresql-webapp/remove-resource-group-azure-portal-3.md>)] | :::image type="content" source="./media/django-postgresql-webapp/pending-screenshot-240x160.png" lightbox="./media/django-postgresql-webapp/pending-screenshot-850x550.png" alt-text="A screenshot showing how to finish deleting a resource in the Azure portal." ::: |


### [VS Code <span style="background:mistyrose">TBD</span>](#tab/vscode-aztools)

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Remove resource group VS Code 1](<./includes/django-postgresql-webapp/remove-resource-group-vscode-1.md>)] | :::image type="content" source="./media/django-postgresql-webapp/pending-screenshot-240x160.png" lightbox="./media/django-postgresql-webapp/pending-screenshot-850x550.png" alt-text="A screenshot showing how to delete a resource group in VS Code." ::: |
| [!INCLUDE [Remove resource group VS Code 2](<./includes/django-postgresql-webapp/remove-resource-group-vscode-2.md>)] | :::image type="content" source="./media/django-postgresql-webapp/pending-screenshot-240x160.png" lightbox="./media/django-postgresql-webapp/pending-screenshot-850x550.png" alt-text="A screenshot showing how to finish deleting a resource in VS Code." ::: |

### [Azure CLI](#tab/azure-cli)

Delete the resource group by using the [az group delete](/cli/azure/group#az_group_delete) command.

```azurecli
az group delete \
    --name msdocs-django-postgres-webapp-rg \
    --no-wait
```

The `--no-wait` argument allows the command to return before the operation is complete.

----

## Next Steps

> [!div class="nextstepaction"]
> [Configure Python app](/azure/app-service/configure-language-python.md)

> [!div class="nextstepaction"]
> [Add user sign-in to a Python web app](/azure/active-directory/develop/quickstart-v2-python-webapp.md)

> [!div class="nextstepaction"]
> [Tutorial: Run Python app in custom container](/azure/app-service/tutorial-custom-container.md)
