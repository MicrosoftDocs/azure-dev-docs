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

:::image type="content" border="False" source="./media/django-postgresql-webapp/django-postgresql-app-arch.png" alt-text="This is an architecture diagram about how the solution works in Azure":::

**To complete this tutorial, you'll need:**

1. An Azure account with an active subscription exists. If you do not have an Azure account, you [can create one for free](https://azure.microsoft.com/free/python).
1. Knowledge of [Python with Django development](/learn/paths/django-create-data-driven-websites/)
1. [Python 3.7 or higher](https://www.python.org/downloads/) installed locally
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

### [Azure portal](#tab/azure-portal-create-app)

Sign in to the [Azure portal](https://portal.azure.com/) and follow these steps to create your Azure Database for PostgreSQL resource.

<br />

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [A screenshot showing how to use the search box in the top tool bar to find App Services in Azure](<./includes/django-postgresql-webapp/create-app-service-azure-portal-1.md>)] | :::image type="content" source="./media/django-postgresql-webapp/create-app-service-azure-portal-1-240px.png" lightbox="./media/django-postgresql-webapp/create-app-service-azure-portal-1.png" alt-text="A screenshot showing how to use the search box in the top tool bar to find App Services in Azure." ::: |
| [!INCLUDE [A screenshot showing the location of the Create button on the App Services page in the Azure Portal](<./includes/django-postgresql-webapp/create-app-service-azure-portal-2.md>)] | :::image type="content" source="./media/django-postgresql-webapp/create-app-service-azure-portal-2-240px.png" lightbox="./media/django-postgresql-webapp/create-app-service-azure-portal-2.png" alt-text="A screenshot showing the location of the Create button on the App Services page in the Azure Portal." ::: |
| [!INCLUDE [A screenshot showing how to fill out the form to create a new App Service in the Azure Portal](<./includes/django-postgresql-webapp/create-app-service-azure-portal-3.md>)] | :::image type="content" source="./media/django-postgresql-webapp/create-app-service-azure-portal-3-240px.png" lightbox="./media/django-postgresql-webapp/create-app-service-azure-portal-3.png" alt-text="A screenshot showing how to fill out the form to create a new App Service in the Azure Portal." ::: |
| [!INCLUDE [A screenshot showing how to select the basic App Service plan in the Azure portal](<./includes/django-postgresql-webapp/create-app-service-azure-portal-4.md>)] | :::image type="content" source="./media/django-postgresql-webapp/create-app-service-azure-portal-4-240px.png" lightbox="./media/django-postgresql-webapp/create-app-service-azure-portal-4.png" alt-text="A screenshot showing how to select the basic App Service plan in the Azure portal." ::: |
| [!INCLUDE [A screenshot showing the location of hte Review plus Create button in the Azure Portal](<./includes/django-postgresql-webapp/create-app-service-azure-portal-5.md>)] | :::image type="content" source="./media/django-postgresql-webapp/create-app-service-azure-portal-5-240px.png" lightbox="./media/django-postgresql-webapp/create-app-service-azure-portal-5.png" alt-text="A screenshot showing the location of hte Review plus Create button in the Azure Portal." ::: |

### [VS Code](#tab/vs-code-create-app)

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

### [Azure CLI](#tab/azure-cli-create-app)

Azure CLI commands can be run in the [Azure Cloud Shell](https://shell.azure.com) or on a workstation with the [Azure CLI installed](/cli/azure/install-azure-cli).

<br />

**Step 1.** Create a *resource group* using the [az group create](/cli/azure/group/az-group-create) command. A *resource group* will act as a container for all of the Azure resources related to this application.

```azurecli
LOCATION='eastus'
RESOURCE_GROUP_NAME='msdocs-django-postgres-webapp-rg'

# Create a resource group
az group create \
    --location $LOCATION \
    --name $RESOURCE_GROUP_NAME
```

* *name* &rarr; You will use this resource to create all the Azure resources needed to complete this tutorial. (`msdocs-django-postgres-webapp-rg`)
* *location* &rarr; A location near you. (Use `az account list-locations --output table` to list locations) (ex: `eastus`)

<br />

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
* *resource-group* &rarr; Use the same resource group name from **Step 1**, `msdocs-django-postgres-webapp-rg`
* *sku* &rarr; Defines the size (CPU, memory) and cost of the app service plan.  This example uses the B1 (Basic) service plan which will incur a small cost in your Azure subscription. For a full list of App Service plans, view the [App Service pricing](https://azure.microsoft.com/pricing/details/app-service/linux/) page.
* *is-linux* &rarr; Selects Linux as the host operating system.

<br/>

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

* *name* &rarr; The *app service name* is used as both the name of the resource in Azure and to form the fully qualified domain name for your app in the form of the server endpoint `https://<app service name>.azurewebsites.com`. This name must be **unique across all Azure** and the only allowed characters are `A`-`Z`, `0`-`9`, and `-`. (ex: `msdocs-django-postgres-webapp`)
* *runtime* &rarr; The runtime specifies what version of Python your app is running. This example uses **Python 3.9**. To list all available runtimes, use the command `az webapp list-runtimes --linux --output table`.
* *plan* &rarr; Use the same *app service plan* name from **Step 2**. (`msdocs-django-postgres-webapp-plan`)
* *resource-group* &rarr; Use the same resource group name from **Step 1**. (`msdocs-django-postgres-webapp-rg`)

----

## 2 - Create the Postgres database in Azure

You can create a Postgres database in Azure using the [Azure portal](https://portal.azure.com/), Visual Studio Code, or the Azure CLI.

### [Azure portal](#tab/azure-portal-create-db)

Sign in to the [Azure portal](https://portal.azure.com/) and follow these steps to create your Azure App Service resources.

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [A screenshot showing how to use the search box in the top tool bar to find Postgres Services in Azure](<./includes/django-postgresql-webapp/create-postgres-service-azure-portal-1.md>)] | :::image type="content" source="./media/django-postgresql-webapp/create-postgres-service-azure-portal-1-240px.png" lightbox="./media/django-postgresql-webapp/create-postgres-service-azure-portal-1.png" alt-text="A screenshot showing how to use the search box in the top tool bar to find Postgres Services in Azure." ::: |
| [!INCLUDE [A screenshot showing the location of the Create button on the Azure Database for PostgreSQL servers page in the Azure Portal](<./includes/django-postgresql-webapp/create-postgres-service-azure-portal-2.md>)] | :::image type="content" source="./media/django-postgresql-webapp/create-postgres-service-azure-portal-2-240px.png" lightbox="./media/django-postgresql-webapp/create-postgres-service-azure-portal-2.png" alt-text="A screenshot showing the location of the Create button on the Azure Database for PostgreSQL servers page in the Azure Portal." ::: |
| [!INCLUDE [A screenshot showing the location of the Create Single Server button on the Azure Database for PostgreSQL deployment option page in the Azure Portal](<./includes/django-postgresql-webapp/create-postgres-service-azure-portal-3.md>)] | :::image type="content" source="./media/django-postgresql-webapp/create-postgres-service-azure-portal-3-240px.png" lightbox="./media/django-postgresql-webapp/create-postgres-service-azure-portal-3.png" alt-text="A screenshot showing the location of the Create Single Server button on the Azure Database for PostgreSQL deployment option page in the Azure Portal." ::: |
| [!INCLUDE [A screenshot showing how to fill out the form to create a new Azure Database for PostgreSQL in the Azure Portal](<./includes/django-postgresql-webapp/create-postgres-service-azure-portal-4.md>)] | :::image type="content" source="./media/django-postgresql-webapp/create-postgres-service-azure-portal-4-240px.png" lightbox="./media/django-postgresql-webapp/create-postgres-service-azure-portal-4.png" alt-text="A screenshot showing how to fill out the form to create a new Azure Database for PostgreSQL in the Azure Portal." ::: |
| [!INCLUDE [A screenshot showing how to select and configure the basic database service plan in the Azure portal](<./includes/django-postgresql-webapp/create-postgres-service-azure-portal-5.md>)] | :::image type="content" source="./media/django-postgresql-webapp/create-postgres-service-azure-portal-5-240px.png" lightbox="./media/django-postgresql-webapp/create-postgres-service-azure-portal-5.png" alt-text="A screenshot showing how to select and configure the basic database service plan in the Azure portal." ::: |
| [!INCLUDE [A screenshot showing the location of hte Review plus Create button in the Azure Portal](<./includes/django-postgresql-webapp/create-postgres-service-azure-portal-6.md>)] | :::image type="content" source="./media/django-postgresql-webapp/create-postgres-service-azure-portal-6-240px.png" lightbox="./media/django-postgresql-webapp/create-postgres-service-azure-portal-6.png" alt-text="A screenshot showing the location of hte Review plus Create button in the Azure Portal." ::: |

### [VS Code](#tab/vscode-create-db)

### [Azure CLI](#tab/azure-cli-create-db)

Run `az login` to sign in to  and follow these steps to create your Azure Database for PostgreSQL resource.

<br />

**Step 1.** Run the [az postgres up](/cli/azure/postgres#az_postgres_up) command to create the PostgreSQL server and database in Azure using the values below. (*Note: It is not uncommon for this command to run for a few minutes*)

```azurecli
DB_SERVER_NAME='msdocs-django-postgres-webapp-db'
DB_NAME='pollsdb'
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
* *name* &rarr; The PostgreSQL database server name. This name must be **unique across all Azure** (the server endpoint becomes `https://<name>.postgres.database.azure.com`). Allowed characters are `A`-`Z`, `0`-`9`, and `-`. A good pattern is to use a combination of your company name and and server identifier. (`msdocs-django-postgres-webapp-db`)
* *location* &rarr; Use the same location from **Step 1**. (ex: `eastus`)
* *sku-name* &rarr; Configure server compute and storage; Name of the pricing tier and compute configuration. (`B_Gen5_1`) Follow the convention {pricing tier}{compute generation}{vCores} in shorthand. For more information, see [Azure Database for PostgreSQL pricing](/pricing/details/postgresql/server/).
* *admin-user* &rarr; Username for the administrator login. It can't be **azure_superuser, admin, administrator, root, guest, or public**. (ex: `demoadmin`)
* *admin-password* Password of the administrator user. It must contain 8 to 128 characters from three of the following categories: English uppercase letters, English lowercase letters, numbers, and non-alphanumeric characters.
* *SSL enforcement* &rarr; Enable or disable ssl enforcement for connections to server.

> [!IMPORTANT]
> When creating usernames or passwords **do not** use the `$` character. Later you create environment variables with these values where the `$` character has special meaning within the Linux container used to run Python apps.

<br />

**Step 2.** Configure the firewall rules on your server by using the [az postgres server firewall-rule create](/cli/azure/postgres/server/firewall-rule) command to give your local environment access to connect to the server.

```azurecli
az postgres server firewall-rule create --resource-group $RESOURCE_GROUP_NAME \
                                        --server $DB_SERVER_NAME \
                                        --name AllowMyIP \
                                        --start-ip-address 192.168.0.1 \
                                        --end-ip-address 192.168.0.1
```

* *resource-group* &rarr; Name of resource group from earlier in this tutorial. (`msdocs-django-postgres-webapp-rg`)
* *server* &rarr; Name of the server from **Step 1**. (`msdocs-django-postgres-webapp-db`)
* *name* &rarr; Name for firewall rule. (ex: `AllowMyIP`)
* *start-ip-address, end-ip-address* &rarr; IP address or range of IP addresses that corresponds to where you'll be connecting from. If you don't know your IP address, go to [WhatIsMyIPAddress.com](https://whatismyipaddress.com/) to get it.

<br />

**Step 3.** Get the connection information by using the [az postgres server show](/cli/azure/postgres/server/az-postgres-server-show). This command outputs a JSON object that contains different connection strings for the database along with the server URL. **Copy the administratorLogin and fullyQualifiedDomainName values to a temporary text file** as you need them later in this tutorial.

```azurecli
az postgres server show --name $DB_SERVER_NAME \
                        -- resource-group $RESOURCE_GROUP_NAME
```

* *resource-group* &rarr; Name of resource group from earlier in this tutorial. (`msdocs-django-postgres-webapp-rg`)
* *name* &rarr; Name of the server from **Step 1**. (`msdocs-django-postgres-webapp-db`)

<br />

**Step 4.** In the Azure Cloud Shell or in your local environment connect to the PostgreSQL server and create `pollsdb` database.

```Console
psql --host=msdocs-django-postgres-webapp-db.postgres.database.azure.com \
     --port=5432 \
     --username=demoadmin@msdocs-django-postgres-webapp-db \
     --dbname=postgres

postgres=> CREATE DATABASE pollsdb;
```

<br />

**Step 5.** *(optional)* Verify `pollsdb` was successfully created by running  `\c pollsdb` to change the prompt from `postgre`  (default) to the new `pollsdb`.

```Console
postgres=> \c pollsdb
pollsdb=>
```

----

## 3 - Connect the app to the database

With the code now deployed to App Service, the next step is to connect the app to the Postgres database in Azure.

The app code expects to find database information in four environment variables named `DBHOST`, `DBNAME`, `DBUSER`, and `DBPASS`

### [Azure portal](#tab/azure-portal-connect-app-to-db)

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [A screenshot showing how to navigate to App Settings](<./includes/django-postgresql-webapp/connect-postgres-to-app-azure-portal-1.md>)] | :::image type="content" source="./media/django-postgresql-webapp/connect-postgres-to-app-azure-portal-1-240px.png" lightbox="./media/django-postgresql-webapp/connect-postgres-to-app-azure-portal-1.png" alt-text="A screenshot showing how to navigate to App Settings." ::: |
| [!INCLUDE [A screenshot showing how to configure the App Settings](<./includes/django-postgresql-webapp/connect-postgres-to-app-azure-portal-2.md>)] | :::image type="content" source="./media/django-postgresql-webapp/connect-postgres-to-app-azure-portal-2-240px.png" lightbox="./media/django-postgresql-webapp/connect-postgres-to-app-azure-portal-2.png" alt-text="A screenshot showing how to configure the App Settings." ::: |

### [Azure CLI](#tab/cli-connect-app-to-db)

To set environment variables in App Service, create "app settings" with the following [az webapp config appsettings set](/cli/azure/webapp/config/appsettings#az_webapp_config_appsettings_set) command.

```azurecli
az webapp config appsettings set --resource-group $RESOURCE_GROUP_NAME \
                                 --name $APP_SERVICE_NAME \
                                 --settings DBHOST=$DB_SERVER_NAME DBNAME=$DB_NAME  DBUSER=$ADMIN_USERNAME DBPASS=$ADMIN_PWD
```

* *DBHOST* &rarr; Replace *\<postgres-server-name>* with the name you used earlier with the `az postgres up` command. The code in *azuresite/production.py* automatically appends `.postgres.database.azure.com` to create the full Postgres server URL.
* *DBNAME* &rarr; Enter `pollsdb`
* *DBUSER, DBPASS* &rarr; Replace *\<username>* and *\<password>* with the administrator credentials that you used with the earlier `az postgres up` command, or those that `az postgres up` generated for you. The code in *azuresite/production.py* automatically constructs the full Postgres username from `DBUSER` and `DBHOST`, so don't include the `@server` portion. |

>[!NOTE]
> The resource group and app names are drawn from the cached values in the *.azure/config* file.

----

## 4 - Deploy your application code to Azure

Azure App service supports multiple methods to deploy your application code to Azure including support for GitHub Actions and all major CI/CD tools. This article focuses on how to deploy your code from your local workstation to Azure.

### [Deploy using Local Git](#tab/local-git-deploy)

[!INCLUDE [Deploy Local Git](<./includes/django-postgresql-webapp/deploy-local-git.md>)]

### [Deploy using a ZIP file](#tab/zip-deploy)

[!INCLUDE [Deploy using ZIP file](<./includes/django-postgresql-webapp/deploy-zip-file.md>)]

----

## 5 - Migrate app database

With the code deployed and the database in place, the app is almost ready to use. The only piece that remains is to establish the necessary schema in the database itself. You do this by "migrating" the data models in the Django app to the database.

**Instructions:** <br />

**Step 1.** Create SSH session and connect to web app server.

### [Azure portal](#tab/azure-portal-db-migrate)

In the browser window or tab for the web app:

* Select **SSH**, under **Development Tools** on the left side
* Then **Go** to open an SSH console on the web app server. (It may take a minute to connect for the first time as the web app container needs to start.)

### [Azure CLI](#tab/azure-cli-db-migrate)

Run `az webpp ssh` to open an SSH session for the web app in the browser:

```azurecli
az webapp ssh --resource-group $RESOURCE_GROUP_NAME \
              --name $APP_SERVICE_NAME
```

----

**Step 2.** In the SSH session, run the following commands (you can paste commands using **Ctrl**+**Shift**+**V**): <br/>

```bash
# Run database migrations
python manage.py migrate
```

If you encounter any errors related to connecting to the database, check the values of the application settings created in the previous section.

<br />

**Step 3.** Create an administrator login for the app: <br />

```bash
python manage.py createsuperuser
```

The `createsuperuser` command prompts you for Django superuser (or admin) credentials, which are used within the web app. For the purposes of this tutorial, use the default username `root`, press **Enter** for the email address to leave it blank, and enter `Pollsdb1` for the password.

<br />

**Step 4.** If you see an error that the database is locked, make sure that you ran the `az webapp settings` command in the previous section. Without those settings, the migrate command cannot communicate with the database, resulting in the error.

<br />

> [!NOTE]
> If you cannot connect to the SSH session, then the app itself has failed to start. **Check the diagnostic logs** for details. For example, if you haven't created the necessary app settings in the previous section, the logs will indicate `KeyError: 'DBNAME'`.

----

## 6 - Browse to the app

Browse to the deployed application in your web browser at the URL `http://<app-name>.azurewebsites.net`. It can take a minute or two for the the app to start, so if you see a default app page, wait a minute and refresh the browser.

The Python sample code is running a Linux container in App Service using a built-in image.

**Congratulations!** You've deployed your Python app to App Service.

## 7 - Stream diagnostic logs

You can access the console logs generated from inside the container that hosts the app on Azure.

The contents of the App Service diagnostic logs can be reviewed in the Azure portal, VS Code, or using the Azure CLI.

### [Azure CLI](#tab/azure-cli)

Run the following Azure CLI commands to see the log stream. This command uses parameters cached in the .azure/config file.

**Step 1.** Configure Azure App Service to output logs to the App Service filesystem using the [az webapp log config](/cli/azure/webapp/log#az_webapp_log_config) command.

```azurecli
az webapp log config \
    --web-server-logging 'filesystem' \
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

2021-12-23T02:15:52.740703322Z Request for index page received
2021-12-23T02:15:52.740740222Z 169.254.130.1 - - [23/Dec/2021:02:15:52 +0000] "GET / HTTP/1.1" 200 1360 "https://msdocs-django-python-webapp.azurewebsites.net/hello" "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:95.0) Gecko/20100101 Firefox/95.0"
2021-12-23T02:15:52.841043070Z 169.254.130.1 - - [23/Dec/2021:02:15:52 +0000] "GET /static/bootstrap/css/bootstrap.min.css HTTP/1.1" 200 0 "https://msdocs-django-python-webapp.azurewebsites.net/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:95.0) Gecko/20100101 Firefox/95.0"
2021-12-23T02:15:52.884541951Z 169.254.130.1 - - [23/Dec/2021:02:15:52 +0000] "GET /static/images/azure-icon.svg HTTP/1.1" 200 0 "https://msdocs-django-python-webapp.azurewebsites.net/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:95.0) Gecko/20100101 Firefox/95.0"
2021-12-23T02:15:53.043211176Z 169.254.130.1 - - [23/Dec/2021:02:15:53 +0000] "GET /favicon.ico HTTP/1.1" 404 232 "https://msdocs-django-python-webapp.azurewebsites.net/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:95.0) Gecko/20100101 Firefox/95.0"

2021-12-23T02:16:01.304306845Z Request for hello page received with name=David
2021-12-23T02:16:01.304335945Z 169.254.130.1 - - [23/Dec/2021:02:16:01 +0000] "POST /hello HTTP/1.1" 200 695 "https://msdocs-django-python-webapp.azurewebsites.net/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:95.0) Gecko/20100101 Firefox/95.0"
2021-12-23T02:16:01.398399251Z 169.254.130.1 - - [23/Dec/2021:02:16:01 +0000] "GET /static/bootstrap/css/bootstrap.min.css HTTP/1.1" 304 0 "https://msdocs-django-python-webapp.azurewebsites.net/hello" "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:95.0) Gecko/20100101 Firefox/95.0"
2021-12-23T02:16:01.430740060Z 169.254.130.1 - - [23/Dec/2021:02:16:01 +0000] "GET /static/images/azure-icon.svg HTTP/1.1" 304 0 "https://msdocs-django-python-webapp.azurewebsites.net/hello" "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:95.0) Gecko/20100101 Firefox/95.0"
```

----

## Clean up resources

You can leave the app and database running as long as you want for further development work and skip ahead to [Next steps](#next-steps).

However, when you are finished with the sample app, you can remove all of the resources for the app from Azure to insure you do not incur additional charges and keep your Azure subscription uncluttered. Removing the resource group also removes all resources in the resource group and is the fastest way to remove all Azure resources for your app.

### [Azure CLI](#tab/azure-cli-cleanup)

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
