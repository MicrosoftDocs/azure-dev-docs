---
title: Deploy a Python web app to App Service
description: Shows configuration and deployment of a Python (Django or Flask) web app to App Service using managed identity to access to Azure Storage and PostgreSQL.
ms.devlang: python
ms.topic: tutorial
ms.date: 07/21/2022
ms.custom: devx-track-python, devx-track-azurecli, vscode-azure-extension-update-completed
---

# Deploy and configure a Python web app in Azure with managed identity

This article is part of a tutorial about deploying a Python app to Azure App Service. The web app uses managed identity to authenticate to other Azure resources. In this article, you'll configure the App Service and then deploy the Python app to it.

:::image type="content" source="./media/python-web-app-managed-identity/system-diagram-local-to-deploy-python-managed-identity-deploy-800px.png" lightbox="./media/python-web-app-managed-identity/system-diagram-local-to-deploy-python-managed-identity-deploy.png" alt-text="A screenshot showing the Azure services in the tutorial used with deployment to Azure highlighted." :::

## 1. Configure the web app in Azure

With the web app, storage account, and PostgreSQL database resources created, the next step is to tell the web app how to connect to the Azure Storage account and Azure Database for PostgreSQL service.

The Python sample code expects environment variables named `DBHOST`, `DBNAME`, `DBUSER`, `STORAGE_ACCOUNT_NAME`, `STORAGE_CONTAINER_NAME`, and `SECRET_KEY` to connect to the storage and database resources. You don't specify an access key for storage or a password for the database because authentication is handled by managed identity.

### [Azure portal](#tab/azure-portal)

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Azure portal connect app to postgres step 1](<./includes/python-web-app-managed-identity/connect-postgres-to-app-azure-portal-1.md>)] | :::image type="content" source="./media/python-web-app-managed-identity/connect-postgres-to-app-azure-portal-1-240px.png" lightbox="./media/python-web-app-managed-identity/connect-postgres-to-app-azure-portal-1.png" alt-text="A screenshot showing how to navigate to App Settings in the Azure portal." ::: |
| [!INCLUDE [Azure portal connect app to postgres step 2](<./includes/python-web-app-managed-identity/connect-postgres-to-app-azure-portal-2.md>)] | :::image type="content" source="./media/python-web-app-managed-identity/connect-postgres-to-app-azure-portal-2-240px.png" lightbox="./media/python-web-app-managed-identity/connect-postgres-to-app-azure-portal-2.png" alt-text="A screenshot showing how to configure the App Settings in the Azure portal." ::: |

### [VS Code](#tab/vscode-aztools)

To configure environment variables for the web app from VS Code, you must have the [Azure Tools extension pack](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack) installed and be signed into Azure from VS Code.

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [VS Code connect app to postgres step 1](<./includes/python-web-app-managed-identity/connect-postgres-to-app-visual-studio-code-1.md>)] | :::image type="content" source="./media/python-web-app-managed-identity/connect-app-to-database-create-setting-240px.png" lightbox="./media/python-web-app-managed-identity/connect-app-to-database-create-setting.png" alt-text="A screenshot showing how to add a setting to the App Service in VS Code." ::: |
| [!INCLUDE [VS Code connect app to postgres step 2](<./includes/python-web-app-managed-identity/connect-postgres-to-app-visual-studio-code-2.md>)] |  |

### [Azure CLI](#tab/azure-cli)

[!INCLUDE [Connect web app to postgres service with CLI](<./includes/python-web-app-managed-identity/connect-postgres-to-app-cli.md>)]

---

## 2. Deploy the Python web app to Azure

Azure App Service supports multiple ways to deploy your application code to Azure including support for GitHub Actions and all major CI/CD tools. This article focuses on how to deploy your code from your local workstation to Azure.

### [Deploy using VS Code](#tab/vscode-aztools-deploy)

To deploy a web app from VS Code, you must have the [Azure Tools extension pack](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack) installed and be signed into Azure from VS Code.

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [VS Code deploy step 1](<./includes/python-web-app-managed-identity/deploy-visual-studio-code-1.md>)] | |
| [!INCLUDE [VS Code deploy step 2](<./includes/python-web-app-managed-identity/deploy-visual-studio-code-2.md>)] | :::image type="content" source="./media/python-web-app-managed-identity/deploy-web-app-visual-studio-code-1-240px.png" lightbox="./media/python-web-app-managed-identity/deploy-web-app-visual-studio-code-1.png" alt-text="A screenshot showing how to deploy a web app in VS Code." ::: |
| [!INCLUDE [VS Code deploy step 3](<./includes/python-web-app-managed-identity/deploy-visual-studio-code-3.md>)] | :::image type="content" source="./media/python-web-app-managed-identity/deploy-web-app-visual-studio-code-3-240px.png" lightbox="./media/python-web-app-managed-identity/deploy-web-app-visual-studio-code-3.png" alt-text="A screenshot showing how to deploy a web app in VS Code: a dialog box to confirm deployment." ::: |
| [!INCLUDE [VS Code deploy step 4](<./includes/python-web-app-managed-identity/deploy-visual-studio-code-4.md>)] | :::image type="content" source="./media/python-web-app-managed-identity/deploy-web-app-visual-studio-code-4-240px.png" lightbox="./media/python-web-app-managed-identity/deploy-web-app-visual-studio-code-4.png" alt-text="A screenshot showing how to deploy a web app in VS Code: a dialog box to choose to always deploy to the app service." ::: |
| [!INCLUDE [VS Code deploy step 5](<./includes/python-web-app-managed-identity/deploy-visual-studio-code-5.md>)] | :::image type="content" source="./media/python-web-app-managed-identity/deploy-web-app-visual-studio-code-5-240px.png" lightbox="./media/python-web-app-managed-identity/deploy-web-app-visual-studio-code-5.png" alt-text="A screenshot showing how to deploy a web app in VS Code: a dialog box with choice to browse to website." :::  :::image type="content" source="./media/python-web-app-managed-identity/deploy-web-app-visual-studio-code-6-240px.png" lightbox="./media/python-web-app-managed-identity/deploy-web-app-visual-studio-code-6.png" alt-text="A screenshot showing how to deploy a web app in VS Code: a dialog box with choice to view deployment details." ::: |

### [Deploy using Local Git](#tab/local-git-deploy)

[!INCLUDE [Deploy Local Git](<./includes/python-web-app-managed-identity/deploy-local-git.md>)]

### [Deploy using a ZIP file](#tab/zip-deploy)

[!INCLUDE [Deploy using ZIP file](<./includes/python-web-app-managed-identity/deploy-zip-file.md>)]

----

## 3. Create the database schema

With the code deployed and the database in place, the app is almost ready to use. As a final step, you need to establish the necessary schema in the database. You create the schema by "migrating" the data models stored with the app code to the PostgreSQL database.

**Step 1.** Create an SSH session and connect to web app server.

### [Azure portal](#tab/azure-portal)

Navigate to page for the App Service instance in the Azure portal.

1. Select **SSH**, under **Development Tools** on the left resource menu.
2. Then **Go** to open an SSH console on the web app server. It may take a minute to connect the first time.

### [VS Code](#tab/vscode-aztools)

In VS Code, you can use the [Azure Tools extension pack](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack) to create an SSH session. You must be signed into Azure from VS Code.

In the **App Services** section of the Azure Tools extension:

1. Locate your web app and right-click to bring up the context menu. (Make sure you viewing resources by **Group by Resource Type**.)
2. Select **SSH into Web App** to open an SSH terminal window.

### [Azure CLI](#tab/azure-cli)

[!INCLUDE [Deploy local git with CLI](<./includes/python-web-app-managed-identity/migrate-app-database-cli.md>)]

---

If you can't connect with SSH, see [Troubleshooting tips](#5-troubleshooting-tips).

**Step 2.** In the SSH session, run commands to migrate the models into the database:

### [Flask](#tab/flask)

When you deploy the Flask sample app to Azure App Service, the database tables are automatically created in Azure Database for PostgreSQL server. If you try to run `flask db init` you'll receive the message "Directory migrations already exists and is not empty."

### [Django](#tab/django)

```bash
# Create database tables
python manage.py migrate
```

---

If you can't migrate the models, see [Troubleshooting tips](#5-troubleshooting-tips).

> [!TIP]
> In an SSH session, for Django you can also create users with the `python manage.py createsuperuser` command like you would with a typical Django app. For more information, see the documentation for [django django-admin and manage.py](https://docs.djangoproject.com/en/1.8/ref/django-admin/). Use the superuser account to access the `/admin` portion of the web site. For Flask, use an extension such as [Flask-admin](https://github.com/flask-admin/flask-admin) to provide the same functionality.

## 4. Test the Python web app in Azure

The sample Python app uses the [azure.identity](https://pypi.org/project/azure-identity/) package and `DefaultAzureCredentialClass`. The `DefaultAzureCredential` automatically detects that a managed identity exists for the App Service and uses it to access other Azure resources (storage and Postgres in this case). There's no need to provide storage keys, certificates, or credentials to the App Service to access these resources.

Browse to the deployed application at the URL `http://<app-name>.azurewebsites.net`. It can take a minute or two for the app to start. If you see a default app page that isn't the default sample app page, wait a minute and refresh the browser.

To test the functionality of the sample app, add a restaurant and then add some reviews with photos for the restaurant. The restaurant and review information is stored in Azure Database for PostgreSQL and the photos are stored in Azure Storage. Here's an example screenshot:

:::image type="content" source="./media/python-web-app-managed-identity/example-of-review-sample-app-production-deployed-small.png" lightbox="./media/python-web-app-managed-identity/example-of-review-sample-app-production-deployed.png" alt-text="An example of the sample app showing restaurant review functionality using Azure App Service, Azure PostgreSQL Database, and Azure Storage." :::

## 5. Troubleshooting tips

Here are a few tips for troubleshooting your deployment:

* When you deploy Python code to App Service, a built-in Linux container is created to run the web app. If a deployment isn't successful, in the Azure portal check the **Deployment Center** | **Logs** generated during the build of the container to confirm the deployment failed. If there was a failure, go to the **Diagnose and solve problems** resource of the App Service to check the [diagnostic logging](/azure/app-service/troubleshoot-diagnostic-logs). The *Application logging* logs are the most useful for troubleshooting failed deployments. Be sure to check the timestamp of the logging entries to make sure they correspond to the deployment you're troubleshooting. There may be a delay in writing the logs and you might need to wait to see the logging information for the deployment.

* If you encounter errors related to connecting to the database while doing the migration, check the values of the application settings of the App Service, specifically `DBHOST`, `DBNAME`, and `DBUSER`. Without these settings, the web app can't communicate with the database.

* If you have the database connection information correctly specified, confirm that you set up managed identity for the database correctly. 

* If you can't open an SSH session to connect to your Azure App Service, then the app might have failed to start. Check the [diagnostic logs](/azure/app-service/troubleshoot-diagnostic-logs) for details, and in particular, the application logs. Errors can occur for many reasons. For example, if you haven't created the necessary app settings in the previous section, the logs will indicate `KeyError: 'DBNAME'`. 

* Check that there's an App Service configuration setting `SCM_DO_BUILD_DURING_DEPLOYMENT` set to  `true` or `1`. For more information and background on how Azure App Service runs Python apps, see [Configure a Linux Python app for Azure App Service](/azure/app-service/configure-language-python). 

* If you're deploying to App Service using local Git and you specified the wrong credentials, it might get cached and you need to clear these credentials. For more information about Git credentials, see [Git Tools - Credential Storage](https://git-scm.com/book/en/v2/Git-Tools-Credential-Storage). On Windows, you can open the Credential Manager / Windows Credentials, find the credentials and remove it.

* If deployment is successful and the web app is running, `print` statements in the code write to the log stream. In the Azure portal, go to the App Service and open the **Log Stream** resource. For more information, see [Enable diagnostics logging for apps in Azure App Service - Stream logs](/azure/app-service/troubleshoot-diagnostic-logs#stream-logs).

## Next step

> [!div class="nextstepaction"]
> [Clean up resources >>>](./tutorial-python-managed-identity-07.md)
