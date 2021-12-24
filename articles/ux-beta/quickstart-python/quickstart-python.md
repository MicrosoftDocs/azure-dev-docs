---
title: 'Quickstart: Deploy a Python web app to Azure App Service'
description: Get started with Azure App Service by deploying your first Python app to Azure App Service.
ms.topic: quickstart
ms.date: 11/03/2021
ms.service: app-service
robots: noindex
---

# Quickstart: Deploy a Python web app to Azure App Service

In this quickstart, you'll deploy a Python web app to [Azure App Service](/azure/app-service/overview.md#app-service-on-linux). Azure App Service is a fully managed web hosting service that supports Python 3.6 and higher apps hosted in a Linux server environment.

To complete this quickstart, you need:
1. An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).
1. <a href="https://www.python.org/downloads/" target="_blank">Python 3.6 or higher</a> installed locally.

## Sample application

This quickstart can be completed using either Flask or Django. A sample application in each framework is provided to help you follow along with this quickstart. Download or clone the sample application to your local workstation.

### [Flask](#tab/flask)

```Console
git clone https://github.com/Azure-Samples/msdocs-python-flask-webapp-quickstart
```

### [Django](#tab/django)

```Console
git clone https://github.com/Azure-Samples/msdocs-python-django-webapp-quickstart
```

---

To run the application locally:

### [Flask](#tab/flask)

1. Navigate into in the application folder:

    ```Console
    cd msdocs-python-flask-webapp-quickstart
    ```

1. Create a virtual environment for the app:

    [!INCLUDE [Virtual environment setup](<./includes/quickstart-python/virtual-environment-setup.md>)]

1. Install the dependencies:

    ```Console
    pip install -r requirements.txt
    ```

1. Run the app:

    ```Console
    flask run
    ```

### [Django](#tab/django)

1. Navigate into in the application folder:

    ```Console
    cd msdocs-python-django-webapp-quickstart
    ```

1. Create a virtual environment for the app:

    [!INCLUDE [Virtual environment setup](<./includes/quickstart-python/virtual-environment-setup.md>)]

1. Install the dependencies:

    ```Console
    pip install -r requirements.txt
    ```

1. Run the app:

    ```Console
    python manage.py runserver
    ```

---

Browse to the sample application at `http://localhost:5000` in a web browser.

![Run a sample Python app locally](./media/quickstart-python/sample-app-localhost.png)

Having issues? [Let us know](https://aka.ms/FlaskCLIQuickstartHelp).

## 1 - Create a web app in Azure

To host your application in Azure, you need to create Azure App Service web app in Azure. You can create a web app using the [Azure portal](https://portal.azure.com/), VS Code using the [Azure Tools extension pack](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack), or the Azure CLI.

### [Azure portal](#tab/azure-portal)

Sign in to the [Azure portal](https://portal.azure.com/) and follow these steps to create your Azure App Service resources.

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Create app service step 1](<./includes/quickstart-python/create-app-service/azure-portal-1.md>)] | :::image type="content" source="./media/quickstart-python/create-app-service/azure-portal-1-240px.png" alt-text="A screenshot showing how to use the search box in the top tool bar to find App Services in Azure." lightbox="./media/quickstart-python/create-app-service/azure-portal-1.png"::: |
| [!INCLUDE [Create app service step 1](<./includes/quickstart-python/create-app-service/azure-portal-2.md>)] | :::image type="content" source="./media/quickstart-python/create-app-service/azure-portal-2-240px.png" alt-text="A screenshot showing the location of the Create button on the App Services page in the Azure Portal." lightbox="./media/quickstart-python/create-app-service/azure-portal-2.png"::: |
| [!INCLUDE [Create app service step 1](<./includes/quickstart-python/create-app-service/azure-portal-3.md>)] | :::image type="content" source="./media/quickstart-python/create-app-service/azure-portal-3-240px.png" alt-text="A screenshot showing how fill out the form to create a new App Service in the Azure portal." lightbox="./media/quickstart-python/create-app-service/azure-portal-3.png"::: |
| [!INCLUDE [Create app service step 1](<./includes/quickstart-python/create-app-service/azure-portal-4.md>)] | :::image type="content" source="./media/quickstart-python/create-app-service/azure-portal-4-240px.png" alt-text="A screenshot showing how to select the basic app service plan in the Azure portal." lightbox="./media/quickstart-python/create-app-service/azure-portal-4.png"::: |
| [!INCLUDE [Create app service step 1](<./includes/quickstart-python/create-app-service/azure-portal-5.md>)] | :::image type="content" source="./media/quickstart-python/create-app-service/azure-portal-5-240px.png" alt-text="A screenshot showing the location of the Review plus Create button in the Azure portal." lightbox="./media/quickstart-python/create-app-service/azure-portal-5.png"::: |

### [VS Code](#tab/vscode-aztools)

To create Azure resources in VS Code, you must have the [Azure Tools extension pack](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack) installed and be signed into Azure from VS Code.

> [!div class="nextstepaction"]
> [Download Azure Tools extension pack](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack)

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Create app service step 1](<./includes/quickstart-python/create-app-service/vscode-1.md>)] | :::image type="content" source="./media/quickstart-python/create-app-service/vscode-1-240px.png" alt-text="A screenshot showing the location of the Azure Tools icon in the left toolbar of VS Code." lightbox="./media/quickstart-python/create-app-service/vscode-1.png"::: |
| [!INCLUDE [Create app service step 2](<./includes/quickstart-python/create-app-service/vscode-2.md>)] | :::image type="content" source="./media/quickstart-python/create-app-service/vscode-2-240px.png" alt-text="A screenshot showing the App Service section of Azure Tools extension and the context menu used to create a new web app." lightbox="./media/quickstart-python/create-app-service/vscode-2.png"::: |
| [!INCLUDE [Create app service step 4](<./includes/quickstart-python/create-app-service/vscode-3.md>)] | :::image type="content" source="./media/quickstart-python/create-app-service/vscode-3-240px.png" alt-text="A screenshot of dialog box used to enter the name of the new web app in Visual Studio Code." lightbox="./media/quickstart-python/create-app-service/vscode-3.png"::: |
| [!INCLUDE [Create app service step 5](<./includes/quickstart-python/create-app-service/vscode-4.md>)] | :::image type="content" source="./media/quickstart-python/create-app-service/vscode-4-240px.png" alt-text="A screenshot of the dialog box in VS Code used to select the runtime for the new web app." lightbox="./media/quickstart-python/create-app-service/vscode-4.png"::: |
| [!INCLUDE [Create app service step 6](<./includes/quickstart-python/create-app-service/vscode-5.md>)] | :::image type="content" source="./media/quickstart-python/create-app-service/vscode-5-240px.png" alt-text="A screenshot of the dialog in VS Code used to select the App Service plan for the new web app." lightbox="./media/quickstart-python/create-app-service/vscode-5.png"::: |

### [Azure CLI](#tab/azure-cli)

Azure CLI commands can be run in the [Azure Cloud Shell](https://shell.azure.com) or on a workstation with the [Azure CLI installed](/cli/azure/install-azure-cli).

First, create a resource group to act as a container for all of the Azure resources related to this application.

```azurecli
LOCATION='eastus'                          # Use 'az account list-locations --output table' to list locations
RESOURCE_GROUP_NAME='msdocs-python-webapp-quickstart'

# Create a resource group
az group create \
    --location $LOCATION \
    --name $RESOURCE_GROUP_NAME
```

Next, create an App Service plan using the [az appservice plan create](/cli/azure/appservice/plan#az_appservice_plan_create) command.

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

Finally, create the App Service web app using the [az webapp create](/cli/azure/webapp#az_webapp_create) command.  

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

---

Having issues? [Let us know](https://aka.ms/FlaskCLIQuickstartHelp).

## 2 - Deploy your application code to Azure

Azure App service supports multiple methods to deploy your application code to Azure including support for GitHub Actions and all major CI/CD tools. This article focuses on how to deploy your code from your local workstation to Azure.

### [Deploy using VS Code](#tab/vscode-deploy)

To deploy a web app from VS Code, you must have the [Azure Tools extension pack](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack) installed and be signed into Azure from VS Code.

> [!div class="nextstepaction"]
> [Download Azure Tools extension pack](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack)

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [VS Code deploy step 1](<./includes/quickstart-python/deploy-vscode/deploy-vscode-1.md>)] | :::image type="content" source="./media/quickstart-python/deploy-vscode/vscode-deploy-1-240px.png" alt-text="A screenshot showing the location of the Azure Tools icon in the left toolbar of VS Code." lightbox="./media/quickstart-python/deploy-vscode/vscode-deploy-1.png"::: |
| [!INCLUDE [VS Code deploy step 2](<./includes/quickstart-python/deploy-vscode/deploy-vscode-2.md>)] | :::image type="content" source="./media/quickstart-python/deploy-vscode/vscode-deploy-2-240px.png" alt-text="A screenshot showing the context menu of an App Service and the deploy to web app menu option." lightbox="./media/quickstart-python/deploy-vscode/vscode-deploy-2.png"::: |
| [!INCLUDE [VS Code deploy step 3](<./includes/quickstart-python/deploy-vscode/deploy-vscode-3.md>)] | :::image type="content" source="./media/quickstart-python/deploy-vscode/vscode-deploy-3-240px.png" alt-text="A screenshot dialog in VS Code used to choose the app to deploy." lightbox="./media/quickstart-python/deploy-vscode/vscode-deploy-3.png"::: |
| [!INCLUDE [VS Code deploy step 4](<./includes/quickstart-python/deploy-vscode/deploy-vscode-4.md>)] | :::image type="content" source="./media/quickstart-python/deploy-vscode/vscode-deploy-4-240px.png" alt-text="A screenshot of a dialog box in VS Code asking if you want to update your workspace to run build commands." lightbox="./media/quickstart-python/deploy-vscode/vscode-deploy-4.png"::: |
| [!INCLUDE [VS Code deploy step 5](<./includes/quickstart-python/deploy-vscode/deploy-vscode-5.md>)] | :::image type="content" source="./media/quickstart-python/deploy-vscode/vscode-deploy-5-240px.png" alt-text="A screenshot showing the confirmation dialog when the app code has been deployed to Azure." lightbox="./media/quickstart-python/deploy-vscode/vscode-deploy-5.png"::: |

### [Deploy using Local Git](#tab/local-git-deploy)

[!INCLUDE [Deploy Local Git](<./includes/quickstart-python/deploy-local-git.md>)]

### [Deploy using FTPS](#tab/ftps-deploy)

[!INCLUDE [Deploy Local FTPS](<./includes/quickstart-python/deploy-ftps.md>)]

### [Deploy using a ZIP file](#tab/zip-deploy)

[!INCLUDE [Deploy using ZIP file](<./includes/quickstart-python/deploy-zip-file.md>)]

---

Having issues? Refer first to the [Troubleshooting guide](/azure/app-service/configure-language-python.md#troubleshooting), otherwise, [let us know](https://aka.ms/FlaskCLIQuickstartHelp).

## 3 - Browse to the app

Browse to the deployed application in your web browser at the URL `http://<app-name>.azurewebsites.net`. It can take a minute or two for the the app to start, so if you see a default app page, wait a minute and refresh the browser.

The Python sample code is running a Linux container in App Service using a built-in image.

![Run a sample Python app in Azure](./media/quickstart-python/sample-app-azure.png)

**Congratulations!** You've deployed your Python app to App Service.

Having issues? Refer first to the [Troubleshooting guide](/azure/app-service/configure-language-python.md#troubleshooting), otherwise, [let us know](https://aka.ms/FlaskCLIQuickstartHelp).

## 4 - Stream logs

Azure App Service captures all messages output to the console to assist you in diagnosing issues with your application. The sample apps include `print()` statements to demonstrate this capability.

### [Flask](#tab/flask)

:::code language="python" source="~/../msdocs-python-flask-webapp-quickstart/app.py" range="6-21" highlight="3,12,15":::

### [Django](#tab/django)

:::code language="python" source="~/../msdocs-python-django-webapp-quickstart/hello_azure/app.py" range="5-21" highlight="2,10,13":::

---

The contents of the App Service diagnostic logs can be reviewed in the Azure portal, VS Code, or using the Azure CLI.

### [Azure portal](#tab/azure-portal)

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Stream logs from Azure portal 1](<./includes/quickstart-python/stream-logs/azure-portal-1.md>)] | :::image type="content" source="./media/quickstart-python/stream-logs/azure-portal-1-240px.png" alt-text="Screenshot" lightbox="./media/quickstart-python/stream-logs/azure-portal-1.png"::: |
| [!INCLUDE [Stream logs from Azure portal 2](<./includes/quickstart-python/stream-logs/azure-portal-2.md>)] | :::image type="content" source="./media/quickstart-python/stream-logs/azure-portal-2-240px.png" alt-text="Screenshot" lightbox="./media/quickstart-python/stream-logs/azure-portal-2.png"::: |

### [VS Code](#tab/vscode-aztools)

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Stream logs from VS Code 1](<./includes/quickstart-python/stream-logs/vscode-1.md>)] | :::image type="content" source="./media/quickstart-python/stream-logs/vs-code-1-240px.png" alt-text="screenshot" lightbox="./media/quickstart-python/stream-logs/vs-code-1.png"::: |
| [!INCLUDE [Stream logs from VS Code 2](<./includes/quickstart-python/stream-logs/vscode-2.md>)] | :::image type="content" source="./media/quickstart-python/stream-logs/vs-code-2-240px.png" alt-text="screenshot" lightbox="./media/quickstart-python/stream-logs/vs-code-2.png"::: |

### [Azure CLI](#tab/azure-cli)

First, you need to configure Azure App Service to output logs to the App Service filesystem using the [az webapp log config](/cli/azure/webapp/log#az_webapp_log_config) command.

```azurecli
az webapp log config \
    --web-server-logging 'filesystem' \
    --name $APP_SERVICE_NAME \
    --resource-group $RESOURCE_GROUP_NAME
```

To stream logs, use the [az webapp log tail](/cli/azure/webapp/log#az_webapp_log_tail) command.

```azurecli
az webapp log tail \
    --name $APP_SERVICE_NAME \
    --resource-group $RESOURCE_GROUP_NAME
```

Refresh the home page in the app or attempt other requests to generate some log messages. The output should look similar to the following.

```Output
Starting Live Log Stream ---

2021-12-23T02:15:52.740703322Z Request for index page received
2021-12-23T02:15:52.740740222Z 169.254.130.1 - - [23/Dec/2021:02:15:52 +0000] "GET / HTTP/1.1" 200 1360 "https://msdocs-python-webapp-quickstart-123.azurewebsites.net/hello" "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:95.0) Gecko/20100101 Firefox/95.0"
2021-12-23T02:15:52.841043070Z 169.254.130.1 - - [23/Dec/2021:02:15:52 +0000] "GET /static/bootstrap/css/bootstrap.min.css HTTP/1.1" 200 0 "https://msdocs-python-webapp-quickstart-123.azurewebsites.net/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:95.0) Gecko/20100101 Firefox/95.0"
2021-12-23T02:15:52.884541951Z 169.254.130.1 - - [23/Dec/2021:02:15:52 +0000] "GET /static/images/azure-icon.svg HTTP/1.1" 200 0 "https://msdocs-python-webapp-quickstart-123.azurewebsites.net/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:95.0) Gecko/20100101 Firefox/95.0"
2021-12-23T02:15:53.043211176Z 169.254.130.1 - - [23/Dec/2021:02:15:53 +0000] "GET /favicon.ico HTTP/1.1" 404 232 "https://msdocs-python-webapp-quickstart-123.azurewebsites.net/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:95.0) Gecko/20100101 Firefox/95.0"

2021-12-23T02:16:01.304306845Z Request for hello page received with name=David
2021-12-23T02:16:01.304335945Z 169.254.130.1 - - [23/Dec/2021:02:16:01 +0000] "POST /hello HTTP/1.1" 200 695 "https://msdocs-python-webapp-quickstart-123.azurewebsites.net/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:95.0) Gecko/20100101 Firefox/95.0"
2021-12-23T02:16:01.398399251Z 169.254.130.1 - - [23/Dec/2021:02:16:01 +0000] "GET /static/bootstrap/css/bootstrap.min.css HTTP/1.1" 304 0 "https://msdocs-python-webapp-quickstart-123.azurewebsites.net/hello" "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:95.0) Gecko/20100101 Firefox/95.0"
2021-12-23T02:16:01.430740060Z 169.254.130.1 - - [23/Dec/2021:02:16:01 +0000] "GET /static/images/azure-icon.svg HTTP/1.1" 304 0 "https://msdocs-python-webapp-quickstart-123.azurewebsites.net/hello" "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:95.0) Gecko/20100101 Firefox/95.0"
```

---


Having issues? Refer first to the [Troubleshooting guide](/azure/app-service/configure-language-python.md#troubleshooting), otherwise, [let us know](https://aka.ms/FlaskCLIQuickstartHelp).

## Clean up resources

### [Azure portal](#tab/azure-portal)

Follow these steps while signed-in to the Azure portal to delete a resource group.

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Remove resource group Azure portal 1](<./includes/quickstart-python/remove-resource-group/azure-portal-1.md>)] | :::image type="content" source="./media/quickstart-python/remove-resource-group/azure-portal-1-240px.png" alt-text="A screenshot showing how to search for and navigate to a resource group in the Azure portal." lightbox="./media/quickstart-python/remove-resource-group/azure-portal-1.png"::: |
| [!INCLUDE [Remove resource group Azure portal 2](<./includes/quickstart-python/remove-resource-group/azure-portal-2.md>)] | :::image type="content" source="./media/quickstart-python/remove-resource-group/azure-portal-2-240px.png" alt-text="A screenshot showing the location of the Delete Resource Group button in the Azure portal." lightbox="./media/quickstart-python/remove-resource-group/azure-portal-2.png"::: |
| [!INCLUDE [Remove resource group Azure portal 3](<./includes/quickstart-python/remove-resource-group/azure-portal-3.md>)] | :::image type="content" source="./media/quickstart-python/remove-resource-group/azure-portal-3-240px.png" alt-text="A screenshot of the confirmation dialog for deleting a resource group in the Azure portal." lightbox="./media/quickstart-python/remove-resource-group/azure-portal-3.png"::: |

### [VS Code](#tab/vscode-aztools)

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Remove resource group VS Code 1](<./includes/quickstart-python/remove-resource-group/vs-code-1.md>)] | :::image type="content" source="./media/quickstart-python/remove-resource-group/vs-code-1-240px.png" alt-text="A screenshot showing how to delete a resource group in VS Code using the Azure Tools extension." lightbox="./media/quickstart-python/remove-resource-group/vs-code-1.png"::: |
| [!INCLUDE [Remove resource group VS Code 2](<./includes/quickstart-python/remove-resource-group/vs-code-2.md>)] | :::image type="content" source="./media/quickstart-python/remove-resource-group/vs-code-2-240px.png" alt-text="A screenshot of the confirmation dialog for deleting a resource group from VS Code." lightbox="./media/quickstart-python/remove-resource-group/vs-code-2.png"::: |

### [Azure CLI](#tab/azure-cli)

Delete the resource group by using the [az group delete](/cli/azure/group#az_group_delete) command.

```azurecli
az group delete \
    --name msdocs-python-webapp-quickstart \
    --no-wait
```

The `--no-wait` argument allows the command to return before the operation is complete.

---

Having issues? [Let us know](https://aka.ms/FlaskCLIQuickstartHelp).

## Next steps

> [!div class="nextstepaction"]
> [Tutorial: Python (Django) web app with PostgreSQL](/azure/app-service/tutorial-python-postgresql-app.md)

> [!div class="nextstepaction"]
> [Configure Python app](/azure/app-service/configure-language-python.md)

> [!div class="nextstepaction"]
> [Add user sign-in to a Python web app](/azure/active-directory/develop/quickstart-v2-python-webapp.md)

> [!div class="nextstepaction"]
> [Tutorial: Run Python app in custom container](/azure/app-service/tutorial-custom-container.md)
