---
title: 'Quickstart: Create a Python app'
description: Get started with Azure App Service by deploying your first Python app to a Linux container in App Service.
ms.topic: quickstart
ms.date: 11/03/2021
ms.service: app-service
robots: noindex
---

# Quickstart: Create a Python app using Azure App Service on Linux

In this quickstart, you'll deploy a Python web app to [Azure App Service](/azure/app-service/overview.md#app-service-on-linux). Azure App Service is a fully managed web hosting service that supports hosting Python 3.6 and higher apps in both Linux and Windows server environments.

To complete this quickstart, you should:
1. Have an Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).
1. Have <a href="https://www.python.org/downloads/" target="_blank">Python 3.6 or higher</a> installed locally.

## Sample application

This quickstart can be completed using either Flask or Django. A sample application in each framework is provided to help you follow along with this quickstart.

### [Flask](#tab/flask)

Download or clone the sample application to your local workstation.

```terminal
git clone https://github.com/Azure-Samples/python-docs-hello-world
```

To run the application locally, you must:

* Create a virtual environment for the app.
* Install dependencies
* Run the app using the `flask run` command.

#### [Mac/Linux](#tab/mac-linux)

```Bash
cd python-docs-hello-world

# Create a virtual environment
python3 -m venv .venv
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the app
flask run
```

#### [Windows (CMD prompt)](#tab/windows)

```dos
cd python-docs-hello-world

REM Create a virtual environment
py -3 -m venv .venv
.venv\scripts\activate

REM Install dependencies
pip install -r requirements.txt

REM Run the app
flask run
```

---

You can browse to the sample application at `http://localhost:5000`.

![Run a sample Python app locally](./media/quickstart-python/run-hello-world-sample-python-app-in-browser-localhost.png)

Having issues? [Let us know](https://aka.ms/FlaskCLIQuickstartHelp).

### [Django](#tab/django)

Download or clone the sample application to your local workstation.

```terminal
git clone https://github.com/Azure-Samples/python-docs-hello-django
```

To run the application locally:

1. Navigate into in the *python-docs-hello-world* folder:

    ```terminal
    cd python-docs-hello-world
    ```

1. Create a virtual environment for the app:

    [!INCLUDE [Virtual environment setup](<./includes/quickstart-python/virtual-environment-setup.md>)]

1. Install the dependencies:

    ```terminal
    pip install -r requirements.txt
    ```

1. Run the development server.

    ```terminal
    python manage.py runserver
    ```

1. Browse to the sample application at `http://localhost:5000` in a web browser.

    ![Run a sample Python app locally](./media/quickstart-python/run-hello-world-sample-python-app-in-browser-localhost.png)

Having issues? [Let us know](https://aka.ms/FlaskCLIQuickstartHelp).

---

## Create a web app in Azure

There are two components that work together in Azure App Service to host your web app in Azure:

* An **App Service web app** which defines the application name and runtime used by the application.
* An **App Service plan** which defines the operating system and compute resources (CPU, memory) available for the application.

In addition, all Azure resources must belong to a resource group, a logical container used to group together all Azure resource for a single purpose.

Azure resources can be created using the [Azure portal](https://portal.azure.com/), VS Code using the [Azure Tools extension pack](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack), or the Azure CLI. 

### [Azure portal](#tab/azure-portal)

Sign in to the [Azure portal](https://portal.azure.com/) and follow these steps to create your Azure App Service resources.

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Create app service step 1](<./includes/quickstart-python/create-app-service-azure-portal-1.md>)] | :::image type="content" source="./media/quickstart-python/azure-portal-create-app-service-1-240px.png" alt-text="A screenshot showing how to use the search box in the top tool bar to find App Services in Azure." lightbox="./media/quickstart-python/azure-portal-create-app-service-1.png"::: |
| [!INCLUDE [Create app service step 1](<./includes/quickstart-python/create-app-service-azure-portal-2.md>)] | :::image type="content" source="./media/quickstart-python/azure-portal-create-app-service-2-240px.png" alt-text="A screenshot showing the location of the Create button on the App Services page in the Azure Portal." lightbox="./media/quickstart-python/azure-portal-create-app-service-2.png"::: |
| [!INCLUDE [Create app service step 1](<./includes/quickstart-python/create-app-service-azure-portal-3.md>)] | :::image type="content" source="./media/quickstart-python/azure-portal-create-app-service-3-240px.png" alt-text="A screenshot showing how fill out the form to create a new App Service in the Azure portal." lightbox="./media/quickstart-python/azure-portal-create-app-service-3.png"::: |
| [!INCLUDE [Create app service step 1](<./includes/quickstart-python/create-app-service-azure-portal-4.md>)] | :::image type="content" source="./media/quickstart-python/azure-portal-create-app-service-4-240px.png" alt-text="A screenshot showing how to select the basic app service plan in the Azure portal." lightbox="./media/quickstart-python/azure-portal-create-app-service-4.png"::: |
| [!INCLUDE [Create app service step 1](<./includes/quickstart-python/create-app-service-azure-portal-5.md>)] | :::image type="content" source="./media/quickstart-python/azure-portal-create-app-service-5-240px.png" alt-text="A screenshot showing the location of the Review plus Create button in the Azure portal." lightbox="./media/quickstart-python/azure-portal-create-app-service-5.png"::: |

### [VS Code](#tab/vscode-aztools)

To create Azure resources in VS Code, you must have the [Azure Tools extension pack](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack) installed and be signed into Azure from VS Code.

> [!div class="nextstepaction"]
> [Download Azure Tools extension pack](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack)

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Create app service step 1](<./includes/quickstart-python/create-app-service-vscode-1.md>)] | :::image type="content" source="./media/quickstart-python/vscode-create-app-service-1-240px.png" alt-text="A screenshot showing the location of the Azure Tools icon in the left toolbar of VS Code." lightbox="./media/quickstart-python/vscode-create-app-service-1.png"::: |
| [!INCLUDE [Create app service step 2](<./includes/quickstart-python/create-app-service-vscode-2.md>)] | :::image type="content" source="./media/quickstart-python/vscode-create-app-service-2-240px.png" alt-text="A screenshot showing the App Service section of Azure Tools extension and the context menu used to create a new web app." lightbox="./media/quickstart-python/vscode-create-app-service-2.png"::: |
| [!INCLUDE [Create app service step 4](<./includes/quickstart-python/create-app-service-vscode-3.md>)] | :::image type="content" source="./media/quickstart-python/vscode-create-app-service-3-240px.png" alt-text="A screenshot of dialog box used to enter the name of the new web app in Visual Studio Code." lightbox="./media/quickstart-python/vscode-create-app-service-3.png"::: |
| [!INCLUDE [Create app service step 5](<./includes/quickstart-python/create-app-service-vscode-4.md>)] | :::image type="content" source="./media/quickstart-python/vscode-create-app-service-4-240px.png" alt-text="A screenshot of the dialog box in VS Code used to select the runtime for the new web app." lightbox="./media/quickstart-python/vscode-create-app-service-4.png"::: |
| [!INCLUDE [Create app service step 6](<./includes/quickstart-python/create-app-service-vscode-5.md>)] | :::image type="content" source="./media/quickstart-python/vscode-create-app-service-5-240px.png" alt-text="A screenshot of the dialog in VS Code used to select the App Service plan for the new web app." lightbox="./media/quickstart-python/vscode-create-app-service-5.png"::: |

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

* The `--sku` parameter defines the size (CPU, memory) and cost of the app service plan.  This example uses the B1 (Basic) service plan which will incur a small cost in your Azure subscription. For a full list of App Service plans, view the [App Service pricing](https://azure.microsoft.com/pricing/details/app-service/windows/) page.
* The `--is-linux` flag selects the Linux as the host operating system.  To use Windows, remove this flag from the command.

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
* The runtime specifies what version of Python your app is running. This example uses Python 3.6. To list all available runtimes, use the command `az webapp list-runtimes --linux --output table` for Linux and `az webapp list-runtimes --output table` for Windows.

```azurecli
APP_SERVICE_NAME='msdocs-python-webapp-quickstart-123'     # Change 123 to any three characters to form a unique name across Azure

az webapp create \
    --name $APP_SERVICE_NAME \
    --runtime 'PYTHON|3.6' \
    --plan $APP_SERVICE_PLAN_NAME \
    --resource-group $RESOURCE_GROUP_NAME \
    --query 'defaultHostName' \
    --output table

az webapp delete \
    --name $APP_SERVICE_NAME \
    --resource-group $RESOURCE_GROUP_NAME 

```

---

Having issues? [Let us know](https://aka.ms/FlaskCLIQuickstartHelp).

## Deploy your application code to Azure

Azure App service supports multiple methods to deploy your application code to Azure including support for GitHub Actions and all major CI/CD tools. This article focuses on how to deploy your code from your local workstation to Azure.

### [Deploy using VS Code](#tab/vscode-deploy)

To deploy a web app from VS Code, you must have the [Azure Tools extension pack](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack) installed and be signed into Azure from VS Code.

> [!div class="nextstepaction"]
> [Download Azure Tools extension pack](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack)

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [VS Code deploy step 1](<./includes/quickstart-python/deploy-vscode-1.md>)] | :::image type="content" source="./media/quickstart-python/vscode-deploy-1-240px.png" alt-text="A screenshot showing the location of the Azure Tools icon in the left toolbar of VS Code." lightbox="./media/quickstart-python/vscode-deploy-1.png"::: |
| [!INCLUDE [VS Code deploy step 2](<./includes/quickstart-python/deploy-vscode-2.md>)] | :::image type="content" source="./media/quickstart-python/vscode-deploy-2-240px.png" alt-text="A screenshot showing the context menu of an App Service and the deploy to web app menu option." lightbox="./media/quickstart-python/vscode-deploy-2.png"::: |
| [!INCLUDE [VS Code deploy step 3](<./includes/quickstart-python/deploy-vscode-3.md>)] | :::image type="content" source="./media/quickstart-python/vscode-deploy-3-240px.png" alt-text="A screenshot dialog in VS Code used to choose the app to deploy." lightbox="./media/quickstart-python/vscode-deploy-3.png"::: |
| [!INCLUDE [VS Code deploy step 4](<./includes/quickstart-python/deploy-vscode-4.md>)] | :::image type="content" source="./media/quickstart-python/vscode-deploy-4-240px.png" alt-text="A screenshot of a dialog box in VS Code asking if you want to update your workspace to run build commands." lightbox="./media/quickstart-python/vscode-deploy-4.png"::: |
| [!INCLUDE [VS Code deploy step 5](<./includes/quickstart-python/deploy-vscode-5.md>)] | :::image type="content" source="./media/quickstart-python/vscode-deploy-5-240px.png" alt-text="A screenshot showing the confirmation dialog when the app code has been deployed to Azure." lightbox="./media/quickstart-python/vscode-deploy-5.png"::: |

### [Deploy using Local Git](#tab/local-git-deploy)

### [Deploy using FTPS](#tab/ftps-deploy)

### [Deploy using a ZIP file](#tab/zip-deploy)

---

Having issues? Refer first to the [Troubleshooting guide](/azure/app-service/configure-language-python.md#troubleshooting), otherwise, [let us know](https://aka.ms/FlaskCLIQuickstartHelp).

## Browse to the app

Browse to the deployed application in your web browser at the URL `http://<app-name>.azurewebsites.net`. It can take a minute or two for the the app to start, so if you see a default app page, wait a minute and refresh the browser.

The Python sample code is running a Linux container in App Service using a built-in image.

![Run a sample Python app in Azure](./media/quickstart-python/run-hello-world-sample-python-app-in-browser.png)

**Congratulations!** You've deployed your Python app to App Service.

Having issues? Refer first to the [Troubleshooting guide](/azure/app-service/configure-language-python.md#troubleshooting), otherwise, [let us know](https://aka.ms/FlaskCLIQuickstartHelp).

## Stream logs

You can access the console logs generated from inside the app and the container in which it runs. Logs include any output generated using `print` statements.

To stream logs, run the [az webapp log tail](/cli/azure/webapp/log#az_webapp_log_tail) command:

```azurecli
az webapp log tail
```

You can also include the `--logs` parameter with then `az webapp up` command to automatically open the log stream on deployment.

Refresh the app in the browser to generate console logs, which include messages describing HTTP requests to the app. If no output appears immediately, try again in 30 seconds.

You can also inspect the log files from the browser at `https://<app-name>.scm.azurewebsites.net/api/logs/docker`.

To stop log streaming at any time, press **Ctrl**+**C** in the terminal.

Having issues? Refer first to the [Troubleshooting guide](/azure/app-service/configure-language-python.md#troubleshooting), otherwise, [let us know](https://aka.ms/FlaskCLIQuickstartHelp).

## Clean up resources

In the preceding steps, you created Azure resources in a resource group. The resource group has a name like "appsvc_rg_Linux_CentralUS" depending on your location. If you keep the web app running, you will incur some ongoing costs (see [App Service pricing](https://azure.microsoft.com/pricing/details/app-service/linux/)).

If you don't expect to need these resources in the future, delete the resource group by running the following command:

```azurecli
az group delete --no-wait
```

The command uses the resource group name cached in the *.azure/config* file.

The `--no-wait` argument allows the command to return before the operation is complete.

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
