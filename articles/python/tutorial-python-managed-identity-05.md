---
title: Create a PostgreSQL database with managed identity
description: Create an Azure Database for PostgreSQL services that a deployed Python (Django or Flask) web app can access in Azure using managed identity.
ms.devlang: python
ms.topic: tutorial
ms.date: 08/10/2022
ms.custom: devx-track-python, devx-track-azurecli, vscode-azure-extension-update-completed
---

# Create an Azure Database for PostgreSQL and configure managed identity

This article is part of a tutorial about deploying a Python app to Azure App Service. The web app uses managed identity to authenticate to other Azure resources. In this article, you'll create an Azure Database for PostgreSQL Service.

:::image type="content" source="./media/python-web-app-managed-identity/system-diagram-local-to-deploy-python-managed-identity-postgres-800px.png" lightbox="./media/python-web-app-managed-identity/system-diagram-local-to-deploy-python-managed-identity-postgres.png" alt-text="A screenshot showing the Azure services in the tutorial with Azure PostgreSQL highlighted." :::

## 1. Create an Azure PostgreSQL server

You can create an Azure Database for PostgreSQL server using the [Azure portal](https://portal.azure.com/), Visual Studio Code, or the Azure CLI.

> [!NOTE]
> Managed identity is currently only supported in [PostgreSQL Single Server](/azure/postgresql/concepts-servers).

### [Azure portal](#tab/azure-portal)

Sign in to the [Azure portal](https://portal.azure.com/) and follow these steps to create your Azure Database for PostgreSQL resource.

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Create postgresql database in portal - 1](<./includes/python-web-app-managed-identity/create-postgres-service-azure-portal-1.md>)] | :::image type="content" source="./media/python-web-app-managed-identity/create-postgres-service-azure-portal-1-240px.png" lightbox="./media/python-web-app-managed-identity/create-postgres-service-azure-portal-1.png" alt-text="A screenshot showing how to use the search box in the toolbar to find Postgres Services in the Azure portal." ::: |
| [!INCLUDE [Create postgresql database in portal - 2](<./includes/python-web-app-managed-identity/create-postgres-service-azure-portal-2.md>)] | :::image type="content" source="./media/python-web-app-managed-identity/create-postgres-service-azure-portal-2-240px.png" lightbox="./media/python-web-app-managed-identity/create-postgres-service-azure-portal-2.png" alt-text="A screenshot showing the location of the Create button on the Azure Database for PostgreSQL servers page in the Azure portal." ::: |
| [!INCLUDE [Create postgresql database in portal - 3](<./includes/python-web-app-managed-identity/create-postgres-service-azure-portal-3.md>)] |  |
| [!INCLUDE [Create postgresql database in portal - 4](<./includes/python-web-app-managed-identity/create-postgres-service-azure-portal-4.md>)] | :::image type="content" source="./media/python-web-app-managed-identity/create-postgres-service-azure-portal-4-240px.png" lightbox="./media/python-web-app-managed-identity/create-postgres-service-azure-portal-4.png" alt-text="A screenshot showing how to fill out the form to create a new Azure Database for PostgreSQL in the Azure portal." ::: |
| [!INCLUDE [Create postgresql database in portal - 5](<./includes/python-web-app-managed-identity/create-postgres-service-azure-portal-5.md>)] | |
| [!INCLUDE [Create postgresql database in portal - 6](<./includes/python-web-app-managed-identity/create-postgres-service-azure-portal-6.md>)] | |
| [!INCLUDE [Create postgresql database in portal - 7](<./includes/python-web-app-managed-identity/create-postgres-service-azure-portal-7.md>)] | :::image type="content" source="./media/python-web-app-managed-identity/create-postgres-service-azure-portal-7-240px.png" lightbox="./media/python-web-app-managed-identity/create-postgres-service-azure-portal-7.png" alt-text="A screenshot showing link to go to resource after database is created." ::: |

### [VS Code](#tab/vscode-aztools)

Follow these steps to create your Azure Database for PostgreSQL resource using the [Azure Tools extension pack](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack) and [Azure Databases extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-cosmosdb) in Visual Studio Code.

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Open Azure Extension - Database in VS Code](<./includes/python-web-app-managed-identity/create-postgres-service-visual-studio-code-1.md>)] | :::image type="content" source="./media/python-web-app-managed-identity/create-postgres-service-visual-studio-code-1-240px.png" lightbox="./media/python-web-app-managed-identity/create-postgres-service-visual-studio-code-1.png" alt-text="A screenshot showing how to open Azure Extension for Database in VS Code." ::: |
| [!INCLUDE [Create database server in VS Code](<./includes/python-web-app-managed-identity/create-postgres-service-visual-studio-code-2.md>)] | :::image type="content" source="./media/python-web-app-managed-identity/create-postgres-service-visual-studio-code-2-240px.gif" alt-text="A screenshot showing prompts for creating a database server in VSCode." lightbox="./media/python-web-app-managed-identity/create-postgres-service-visual-studio-code-2.gif"::: |
| [!INCLUDE [Finish create database server in VS Code](<./includes/python-web-app-managed-identity/create-postgres-service-visual-studio-code-2.5.md>)] | |

### [Azure CLI](#tab/azure-cli)

Run `az login` to sign in to  and follow these steps to create your Azure Database for PostgreSQL resource.

[!INCLUDE [Create postgres service with CLI](<./includes/python-web-app-managed-identity/create-postgres-service-cli.md>)]

---

## 2. Add database firewall rules

In this step, you'll add firewall rules that allow:

* The web app to access to the database server.  This access is enabled with a database firewall rule that accepts connections from all Azure resources. In a production system, you should turn off this rule and use an [Azure Virtual Network (VNet)](/azure/virtual-network/virtual-networks-overview). This firewall rule can also be useful during database configuration when you might use an Azure Cloud Shell (an Azure resource) with psql to access the database. 

* Your local environment to access the database server. This access is useful for subsequent configuration steps especially but should be turned off after configuration and deployment is completed.

### [Azure portal](#tab/azure-portal)

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [A screenshot showing the location and adding a firewall rule in the Azure portal](<./includes/python-web-app-managed-identity/add-access-to-postgres-from-web-app-portal-1.md>)] | :::image type="content" source="./media/python-web-app-managed-identity/add-access-to-postgres-from-web-app-portal-1-240px.png" lightbox="./media/python-web-app-managed-identity/add-access-to-postgres-from-web-app-portal-1.png" alt-text="A screenshot showing how to add access from other Azure services to a PostgreSQL database in the Azure portal." ::: |

### [VS Code](#tab/vscode-aztools)

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Azure portal - create new resource](<./includes/python-web-app-managed-identity/create-postgres-service-visual-studio-code-3.md>)] | :::image type="content" source="./media/python-web-app-managed-identity/create-postgres-service-visual-studio-code-3-240px.gif" alt-text="A screenshot how to create a firewall rule for a PostgreSQL database in VS Code." lightbox="./media/python-web-app-managed-identity/create-postgres-service-visual-studio-code-3.gif"::: :::image type="content" source="./media/python-web-app-managed-identity/create-postgres-service-visual-studio-code-3b-240px.png" alt-text="A screenshot showing confirmation dialog to add local IP address as a firewall rule for a PostgreSQL database in VS Code." lightbox="./media/python-web-app-managed-identity/create-postgres-service-visual-studio-code-3b.png"::: |
| [!INCLUDE [Azure portal - create firewall rule](<./includes/python-web-app-managed-identity/create-postgres-service-visual-studio-code-5.md>)] |  |

### [Azure CLI](#tab/azure-cli)

[!INCLUDE [Allow access from web app to postgres service with CLI](<./includes/python-web-app-managed-identity/add-access-to-postgres-from-web-app-cli.md>)]

---

## 3. Create a database

### [psql](#tab/create-database-psql)

In your local environment, or anywhere you can use the PostgreSQL interactive terminal [psql](https://www.postgresql.org/docs/13/app-psql.html) such as the [Azure Cloud Shell](/azure/cloud-shell/overview), connect to the PostgreSQL database server to create the `restaurant` database. 

Start psql:

```bash
psql --host=<server-name>.postgres.database.azure.com \
     --port=5432 \
     --username=<admin-user>@<server-name> \
     --dbname=postgres
```

The values of `<server-name>` and `<admin-user>` are the values from a previous step, used in the creation of the PostgreSQL database service. The command above will prompt you for the admin password. If you have trouble connecting, restart the database and try again. If you're connecting from your local environment, your IP address must be added to the firewall rule list for the database service.

At the `postgres=>` prompt, create the database:

```sql
CREATE DATABASE restaurant;
```

The semicolon (";") at the end of the command is necessary. To verify that the `restaurant` database was successfully created, use the command `\c restaurant` to change the prompt from `postgres=>` (default) to the `restaurant->`. Type `\?` to show help or `\q` to quit.

You can also create a database using [Azure Data Studio](/sql/azure-data-studio/download-azure-data-studio) or any other IDE, and Visual Studio Code with the [Azure Tools extension pack](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack) installed.

### [VS Code](#tab/create-database-vscode-aztools)

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Azure portal - create firewall rule](<./includes/python-web-app-managed-identity/create-postgres-service-visual-studio-code-4.md>)] | :::image type="content" source="./media/python-web-app-managed-identity/create-postgres-service-visual-studio-code-4-240px.png" alt-text="A screenshot showing how to create a database for a PostgreSQL database in the VS Code." lightbox="./media/python-web-app-managed-identity/create-postgres-service-visual-studio-code-4.png"::: |

---

## 4. Configure managed identity for PostgreSQL

When you configure [managed identity](/azure/active-directory/managed-identities-azure-resources/overview) for PostgreSQL, you enable the web app to securely connect to the database without a password. Instead, the App Service authenticates to PostgreSQL with a managed identity. For more information, see [Authenticating Azure-hosted apps to Azure resources with the Azure SDK for Python](./sdk/authentication-azure-hosted-apps.md).

The configuration of managed identity for PostgreSQL can be broken into two steps:

* Set an Active Directory admin for the PostgreSQL database. 
* Create a role for the managed identity in the PostgreSQL database. 

### Set an Active Directory admin for the PostgreSQL database

In this step, you'll create an Azure Active Directory user as the administrator for the Azure Database for PostgreSQL server. For more information, see [Use Azure Active Directory for authentication with PostgreSQL](/azure/postgresql/howto-configure-sign-in-aad-authentication).

[!INCLUDE [Assign Azure Active Directory user to PostgreSQL database](<./includes/python-web-app-managed-identity/assign-active-directory-user-to-postgresql.md>)]

### Create a role for the managed identity in the PostgreSQL database

The role you'll create is the role used by the web app (App Service) to connect to the PostgreSQL server. Specify the role user name *webappuser* and a password that is equal to the application ID of the managed identity for the web app. 

[!INCLUDE [Create managed identity role in the PostgreSQL database](<./includes/python-web-app-managed-identity/create-role-in-postgres-database.md>)]

## Next step

> [!div class="nextstepaction"]
> [Deploy to the Python app to Azure](./tutorial-python-managed-identity-06.md)
