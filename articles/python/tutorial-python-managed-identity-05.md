---
title: '5. Create a PostgreSQL database'
description: Create the Azure Database for PostgreSQL services that the deployed Python (Django or Flask) web app will access in Azure using managed identity.
author: jess-johnson-msft
ms.author: jejohn
ms.devlang: python
ms.topic: tutorial
ms.date: 06/01/2022
ms.prod: azure-python
ms.custom: devx-track-python, devx-track-azurecli
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
[!INCLUDE [Create postgresql database in portal - 8](<./includes/python-web-app-managed-identity/create-postgres-service-azure-portal-8.md>)] | :::image type="content" source="./media/python-web-app-managed-identity/create-postgres-service-azure-portal-8-240px.png" lightbox="./media/python-web-app-managed-identity/create-postgres-service-azure-portal-8.png" alt-text="A screenshot showing adding current IP as a firewall rule for the PostgreSQL Flexible server in the Azure portal." ::: | 

### [VS Code](#tab/vscode-aztools)

Follow these steps to create your Azure Database for PostgreSQL resource using the [Azure Tools extension pack](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack) and [Azure Databases extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-cosmosdb) in Visual Studio Code.

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Open Azure Extension - Database in VS Code](<./includes/python-web-app-managed-identity/create-postgres-service-visual-studio-code-1.md>)] | :::image type="content" source="./media/python-web-app-managed-identity/create-postgres-service-visual-studio-code-1-240px.png" lightbox="./media/python-web-app-managed-identity/create-postgres-service-visual-studio-code-1.png" alt-text="A screenshot showing how to open Azure Extension for Database in VS Code." ::: |
| [!INCLUDE [Create database server in VS Code](<./includes/python-web-app-managed-identity/create-postgres-service-visual-studio-code-2.md>)] | :::image type="content" source="./media/python-web-app-managed-identity/create-postgres-service-visual-studio-code-2-240px.gif" alt-text="A screenshot showing prompts for creating a database server in VSCode." lightbox="./media/python-web-app-managed-identity/create-postgres-service-visual-studio-code-2.gif"::: |
| [!INCLUDE [Azure portal - create new resource](<./includes/python-web-app-managed-identity/create-postgres-service-visual-studio-code-3.md>)] | :::image type="content" source="./media/python-web-app-managed-identity/create-postgres-service-visual-studio-code-3-240px.gif" alt-text="A screenshot how to create a firewall rule for a PostgreSQL database in VS Code." lightbox="./media/python-web-app-managed-identity/create-postgres-service-visual-studio-code-3.gif"::: :::image type="content" source="./media/python-web-app-managed-identity/create-postgres-service-visual-studio-code-3b-240px.png" alt-text="A screenshot showing confirmation dialog to add local IP address as a firewall rule for a PostgreSQL database in VS Code." lightbox="./media/python-web-app-managed-identity/create-postgres-service-visual-studio-code-3b.png"::: |
| [!INCLUDE [Azure portal - create new resource](<./includes/python-web-app-managed-identity/create-postgres-service-visual-studio-code-4.md>)] | :::image type="content" source="./media/python-web-app-managed-identity/create-postgres-service-visual-studio-code-4-240px.png" alt-text="A screenshot showing how to create a database for a PostgreSQL database in the VS Code." lightbox="./media/python-web-app-managed-identity/create-postgres-service-visual-studio-code-4.png"::: |

### [Azure CLI](#tab/azure-cli)

Run `az login` to sign in to  and follow these steps to create your Azure Database for PostgreSQL resource.

[!INCLUDE [Create postgres service with CLI](<./includes/python-web-app-managed-identity/create-postgres-service-cli.md>)]

---

## 2. Create a database

In your local environment or anywhere you can use the PostgreSQL interactive terminal [psql](https://www.postgresql.org/docs/13/app-psql.html) such as the [Azure Cloud Shell](/azure/cloud-shell/overview), connect to the PostgreSQL database server, and create the `restaurant` database:

```Console
psql --host=<server-name>.postgres.database.azure.com \
     --port=5432 \
     --username=<admin-user> \
     --dbname=postgres

postgres=> CREATE DATABASE restaurant;
```

The values of `<server-name>` and `<admin-user>` are the values from a previous step. If you have trouble connecting, restart the database and try again. If you're connecting from your local environment, your IP address must be added to the firewall rule list for the database service.

Optionally, verify that the `restaurant` database was successfully created by running `\c restaurant` to change the prompt from `postgres` (default) to the `restaurant`. Type `\?` to show help or `\q` to quit.

You can also create a database using [Azure Data Studio](/sql/azure-data-studio/download-azure-data-studio) or any other IDE, and Visual Studio Code with the [Azure Tools extension pack](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack) installed.

## 3. Configure managed identity for PostgreSQL

When you configure [managed identity](/azure/active-directory/managed-identities-azure-resources/overview) for PostgreSQL, you can skip using the password for the connection string from the web app to the database. Instead, the App Service authenticates to PostgreSQL with a managed identity. For more information, see [Authenticating Azure-hosted apps to Azure resources with the Azure SDK for Python](/azure/developer/python/sdk/authentication-azure-hosted-apps).

The configuration of managed identity for PostgreSQL can be broken into two steps:

* Set an Active Directory admin for the PostgreSQL database.
* Create a role for the managed identity in the PostgreSQL database. 

### Set an Active Directory admin for the PostgreSQL database

In this step, you'll create an Azure Active Directory user as the administrator for the Azure Database for PostgreSQL server. For more information, see [Use Azure Active Directory for authentication with PostgreSQL](/azure/postgresql/howto-configure-sign-in-aad-authentication).

[!INCLUDE [Assign Azure Active Directory user to PostgreSQL database](<./includes/python-web-app-managed-identity/assign-active-directory-user-to-postgresql.md>)]

### Create a role for the managed identity in the PostgreSQL database

The role you'll create is the role used by the web app (App Service) to connect to the PostgreSQL server. Specify a role user name like *webappuser* and a password that is equal to the application ID of the managed identity for the web app. 

[!INCLUDE [Create managed identity role in the PostgreSQL database](<./includes/python-web-app-managed-identity/create-role-in-postgres-database.md>)]

## Next step

> [!div class="nextstepaction"]
> [Deploy to the Python app to Azure >>>](./tutorial-python-managed-identity-06.md)
