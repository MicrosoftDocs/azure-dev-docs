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

### [Azure CLI](#tab/azure-cli-create-app)

Azure CLI commands can be run in the [Azure Cloud Shell](https://shell.azure.com) or on a workstation with the [Azure CLI installed](/cli/azure/install-azure-cli).

<br />

**Step 1.** Create a *resource group* using the [az group create](/cli/azure/group?view=azure-cli-latest#az-group-create) command. A *resource group* will act as a container for all of the Azure resources related to this application.

```azurecli
LOCATION='eastus'
RESOURCE_GROUP_NAME='msdocs-django-postgres-webapp-rg'

# Create a resource group
az group create \
    --location $LOCATION \
    --name $RESOURCE_GROUP_NAME
```

| Parameter | Value |
| --- | --- |
| name | Enter `msdocs-django-postgres-webapp-rg`. You will use this resource to create all the Azure resources needed to complete this tutorial. |
| location | A location near you. (Use `az account list-locations --output table` to list locations) |

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

| Parameter | Value |
| --- | --- |
| name | Enter a name for the Azure Web App plan.  |
| resource-group | Use the same resource group name from **Step 1**. |
| sku |  Defines the size (CPU, memory) and cost of the app service plan.  This example uses the B1 (Basic) service plan which will incur a small cost in your Azure subscription. For a full list of App Service plans, view the [App Service pricing](https://azure.microsoft.com/pricing/details/app-service/linux/) page. |
| is-linux | Selects the Linux as the host operating system. |

<br/>

**Step 3.** Create the *App Service web app* using the [az webapp create](/cli/azure/webapp#az_webapp_create) command.

```azurecli
APP_SERVICE_NAME='msdocs-django-postgres-webapp'

az webapp create \
    --name $APP_SERVICE_NAME \
    --runtime 'PYTHON|3.8' \
    --plan $APP_SERVICE_PLAN_NAME \
    --resource-group $RESOURCE_GROUP_NAME \
    --query 'defaultHostName' \
    --output table
```

| Parameter | Value |
| --- | --- |
| name | The *app service name* is used as both the name of the resource in Azure and to form the fully qualified domain name for your app in the form of the server endpoint `https://<app service name>.azurewebsites.com`. This name must be **unique across all Azure** and the only allowed characters are `A`-`Z`, `0`-`9`, and `-`.  |
| runtime | The runtime specifies what version of Python your app is running. This example uses Python 3.8. To list all available runtimes, use the command `az webapp list-runtimes --linux --output table`. |
| plan | Use the same *app service plan* name from **Step 2**. |
| resource-group | Use the same resource group name from **Step 1**. |
| query | JMESPath query string. See http://jmespath.org/ for more information and examples. |
| output | Output format. |

----

## 2 - Create the Postgres database in Azure

You can create a Postgres database in Azure using the [Azure portal](https://portal.azure.com/), Visual Studio Code, or the Azure CLI.

### [Azure CLI](#tab/azure-cli-create-db)

Run `az login` to sign in to  and follow these steps to create your Azure Database for PostgreSQL resource.

<br />

**Step 1.** Run the [az postgres up](/cli/azure/postgres#az_postgres_up) command to create the PostgreSQL server and database in Azure using the values below. (*Note: It is not uncommon for this command to run for a few minutes*)

```azurecli
DB_SERVER_NAME='msdocs-django-postgres-webapp-db'
DB_NAME='pollsdb'
ADMIN_USERNAME='demoadmin'
ADMIN_PWD='<enter-admin-password>'

az postgres server create --resource-group $RESOURCE_GROUP_NAME \
                          --name $DB_SERVER_NAME  \
                          --location $LOCATION \
                          --admin-user $ADMIN_USERNAME \
                          --admin-password $ADMIN_PWD \
                          --sku-name B_Gen5_1 \
                          --ssl-enforcement Enabled
```

| Setting | Value | Description |
| --- | --- | --- |
| resource-group | msdocs-django-postgres-webapp-rg | Use the same resource group name from **Step 1**. |
| name | msdocs-django-postgres-webapp-db |  The PostgreSQL database server name. This name must be **unique across all Azure** (the server endpoint becomes `https://<name>.postgres.database.azure.com`). Allowed characters are `A`-`Z`, `0`-`9`, and `-`. A good pattern is to use a combination of your company name and and server identifier. |
| location | eastus | Use the same location from **Step 1**. |
| sku-name | B_Gen5_1 | Configure server compute and storage; Name of the pricing tier and compute configuration. Follow the convention {pricing tier}{compute generation}{vCores} in shorthand. For more information, see [Azure Database for PostgreSQL pricing](/pricing/details/postgresql/server/). |
| admin-user | demoadmin | Username for the administrator login. It can't be **azure_superuser, admin, administrator, root, guest, or public**. |
| admin-password | *secure password* | Password of the administrator user. It must contain 8 to 128 characters from three of the following categories: English uppercase letters, English lowercase letters, numbers, and non-alphanumeric characters. |
| SSL enforcement | **Enabled** |

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

| Setting | Value | Description |
| --- | --- | --- |
| resource-group | msdocs-django-postgres-webapp-rg  | Name of resource group from earlier in this tutorial.|
| server | msdocs-django-postgres-webapp-db | Name of the server from **Step 1**. |
| name | AllowMyIP | Name for firewall rule. |
| start-ip-address, end-ip-address | 192.168.0.1, 192.168.0.1 |Replace the IP address or range of IP addresses that corresponds to where you'll be connecting from. If you don't know your IP address, go to [WhatIsMyIPAddress.com](https://whatismyipaddress.com/) to get it. |

<br />

**Step 3.** Get the connection information by using the [az postgres server show](/cli/azure/postgres/server/az-postgres-server-show). This command outputs a JSON object that contains different connection strings for the database along with the server URL. **Copy the administratorLogin and fullyQualifiedDomainName values to a temporary text file** as you need them later in this tutorial.

```azurecli
az postgres server show --name $DB_SERVER_NAME \
                        -- resource-group $RESOURCE_GROUP_NAME
```

| Setting | Value | Description |
| --- | --- | --- |
| resource-group | msdocs-django-postgres-webapp-rg  | Name of resource group from earlier in this tutorial.|
| name | msdocs-django-postgres-webapp-db | Name of the server from **Step 1**. |

<br />

**Step 4.** Connect to PostgreSQL server and create `pollsdb` database.

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

## Clean up resources

You can leave the app and database running as long as you want for further development work and skip ahead to [Next steps](#next-steps). Otherwise, to avoid incurring ongoing charges, delete the resource group created for this tutorial, which deletes all the resources contained within it:

### [Azure CLI](#tab/azure-cli-cleanup)

----

## Next Steps
