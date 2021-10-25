---
title: Deploy Express.js/MongoDB app with VS Code - App Service/Cosmos DB
description: This article shows you have to deploy a Node.js app using Express.js and a MongoDB database to Azure.  Azure App Service is used to host the web application and Azure Cosmos DB to host the database using the 100% compatible MongoDB API built into Cosmos DB. 
ms.topic: tutorial
ms.date: 03/29/2021
ms.service: app-service
ms.custom: scenarios:getting-started, languages:JavaScript, devx-track-js
---

# Deploy a Node.js web app using MongoDB to Azure

Azure provides a fully managed solution for hosting JavaScript web apps in the cloud. In this article, you will clone and deploy a basic **Express.js** app using a **MongoDB** database to Azure.  The Express.js app will be hosted in Azure App Service and the MongoDB database in Azure Cosmos DB, a cloud native database offering a [100% MongoDB compatible API](/azure/cosmos-db/mongodb/mongodb-introduction).

![A diagram showing how the Express.js app will be deployed to Azure App Service and the MongoDB data will be hosted inside of Azure Cosmos DB.](./media/app-diagram.png)


In this tutorial, you will create the necessary Azure resources, deploy your code to Azure, browse to your application, and inspect the deployed app to see the log files and the environment that hosts your app. No application code changes will be necessary to host the applications in Azure.

This article assumes you already are familiar with the Node.js development workflow and have Node and MongoDB installed locally.  You will also need an Azure account with an active subscription.  If you do not have an Azure account, you [can create one for free](https://azure.microsoft.com/free/nodejs/).

Azure App Service supports Node versions 10, 12 and 14 on Linux and versions 10 and 12 on Windows.

## Sample application

The sample application for this tutorial may be cloned or downloaded from the repository [https://github.com/Azure-Samples/js-e2e-express-mongo](https://github.com/Azure-Samples/js-e2e-express-mongo).

```bash
git clone https://github.com/Azure-Samples/js-e2e-express-mongo
```

After cloning the sample app, you need to install the required dependencies before running the application or deploying it to Azure.

```bash
cd js-e2e-express-mongo
npm install
```

To run the application locally, set the `DATABASE_URL` variable to a connection string of a MongoDB database in the `.env` file in the root directory of the sample app. The sample app uses the [dotenv package](https://www.npmjs.com/package/dotenv) to support running the application locally.

```bash
ENVIRONMENT=development
DATABASE_URL=<local MongoDB connection string>
```

## 1 - Create the Azure App Service

Azure App Service is used to host the Express.js web application code. Azure App service supports hosting JavaScript apps in both Linux and Windows server environments.

When setting up the App Service for the application, you will configure two individual components:

* An **App Service plan** which defines the operating system and compute resources (CPU, memory) available for the application.
* An **App Service web app** which defines the application name and runtime used by the application.

All Azure resources must belong to a *resource group*, which serves as a logical container for related Azure resources. A common practice is to group all of the Azure resources used for an application together in a single resource group. As part of creating your App Service resources, you will also create a resource group to hold all of the Azure resources needed for the application.

Azure resources can be created using the [Azure portal](https://portal.azure.com/), VS Code using the [Azure Tools extension pack](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack), or the Azure CLI.

### [Azure portal](#tab/azure-portal)

Sign in to the [Azure portal](https://portal.azure.com/) and follow these steps to create your Azure App Service resources.

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Create app service step 1](<./includes/create-app-service-azportal-1.md>)] | :::image type="content" source="./media/azportal-create-app-service-1-240px.png" alt-text="A screenshot showing how to use the search box in the top tool bar to find App Services in Azure." lightbox="./media/azportal-create-app-service-1.png"::: |
| [!INCLUDE [Create app service account step 2](<./includes/create-app-service-azportal-2.md>)] | :::image type="content" source="./media/azportal-create-app-service-2-240px.png" alt-text="A screenshot showing the create button on the App Services page used to create a new web app." lightbox="./media/azportal-create-app-service-2.png"::: |
| [!INCLUDE [Create app service account step 3](<./includes/create-app-service-azportal-3.md>)] | :::image type="content" source="./media/azportal-create-app-service-3-240px.png" alt-text="A screenshot showing the form to fill out to create a web app in Azure." lightbox="./media/azportal-create-app-service-3.png"::: |
| [!INCLUDE [Create app service step 4](<./includes/create-app-service-azportal-4.md>)] | :::image type="content" source="./media/azportal-create-app-service-4-240px.png" alt-text="A screenshot of the Spec Picker dialog that allows you to select the App Service plan to use for your web app." lightbox="./media/azportal-create-app-service-4.png"::: |
| [!INCLUDE [Create app service step 4](<./includes/create-app-service-azportal-5.md>)] | :::image type="content" source="./media/azportal-create-app-service-5-240px.png" alt-text="A screenshot of the main web app create page showing the button to select on to create your web app in Azure." lightbox="./media/azportal-create-app-service-5.png"::: |

### [VS Code](#tab/vscode-aztools)

To create Azure resources in VS Code, you must have the [Azure Tools extension pack](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack) installed and be signed into Azure from VS Code.

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Create app service step 1](<./includes/create-app-service-vscode-1.md>)] | :::image type="content" source="./media/vscode-create-app-service-1-240px.png" alt-text="A screenshot showing the location of the Azure Tools icon in the left toolbar." lightbox="./media/vscode-create-app-service-1.png"::: |
| [!INCLUDE [Create app service step 2](<./includes/create-app-service-vscode-2.md>)] | :::image type="content" source="./media/vscode-create-app-service-2-240px.png" alt-text="A screenshot showing the App Service section of Azure Tools and the icon to select on to create a new web app." lightbox="./media/vscode-create-app-service-2.png"::: |
| [!INCLUDE [Create app service step 3](<./includes/create-app-service-vscode-3.md>)] | :::image type="content" source="./media/vscode-create-app-service-3-240px.png" alt-text="A screenshot showing the dialog box used to select the subscription for the new App Service in Azure." lightbox="./media/vscode-create-app-service-3.png"::: |
| [!INCLUDE [Create app service step 4](<./includes/create-app-service-vscode-4.md>)] | :::image type="content" source="./media/vscode-create-app-service-4-240px.png" alt-text="A screenshot of dialog box used to enter the name of the new web app in Visual Studio Code." lightbox="./media/vscode-create-app-service-4.png"::: |
| [!INCLUDE [Create app service step 5](<./includes/create-app-service-vscode-5.md>)] | :::image type="content" source="./media/vscode-create-app-service-5-240px.png" alt-text="A screenshot of the dialog box in VS Code used to select the runtime for the new web app." lightbox="./media/vscode-create-app-service-5.png"::: |
| [!INCLUDE [Create app service step 6](<./includes/create-app-service-vscode-6.md>)] | :::image type="content" source="./media/vscode-create-app-service-6-240px.png" alt-text="A screenshot of the dialog in VS Code used to select the App Service plan for the new web app." lightbox="./media/vscode-create-app-service-5.png"::: |

### [Azure CLI](#tab/azure-cli)

Azure CLI commands can be run in the [Azure Cloud Shell](https://shell.azure.com) or on a workstation with the [Azure CLI installed](/cli/azure/install-azure-cli).

First, create a resource group to act as a container for all of the Azure resources related to this application.

```azurecli
LOCATION='eastus'                          # Use 'az account list-locations --output table' to list locations
RESOURCE_GROUP_NAME='msdocs-expressjs-mondgodb-quickstart'

# Create a resource group
az group create \
    --location $LOCATION \
    --name $RESOURCE_GROUP_NAME
```

Next, create an App Service plan using the [az appservice plan create](/cli/azure/appservice/plan#az_appservice_plan_create) command.

* The `--sku` parameter defines the size (CPU, memory) and cost of the app service plan.  This example uses the F1 (Free) service plan.  For a full list of App Service plans, view the [App Service pricing](https://azure.microsoft.com/pricing/details/app-service/windows/) page.
* The `--is-linux` flag selects the Linux as the host operating system.  To use Windows, remove this flag from the command.

```azurecli
APP_SERVICE_PLAN_NAME='msdocs-expressjs-mongodb-plan-123'    

az appservice plan create \
    --name $APP_SERVICE_PLAN_NAME \
    --resource-group $RESOURCE_GROUP_NAME \
    --sku B1 \
    --is-linux
```

Finally, create the App Service web app using the [az webapp create]() command.  

* The *app service name* is used as both the name of the resource in Azure and to form the fully qualified domain name for your app in the form of `https://<app service name>.azurewebsites.com`.
* The runtime specifies what version of Node your app is running. This example uses Node 12 LTS. To list all available runtimes, use the command `az webapp list-runtimes --linux --output table` for Linux and `az webapp list-runtimes --output table` for Windows.

```azurecli
APP_SERVICE_NAME='msdocs-expressjs-mongodb-123'     # Change 123 to any three characters to form a unique name across Azure

az webapp create \
    --name $APP_SERVICE_NAME \
    --runtime 'NODE|14-lts'
    --plan $APP_SERVICE_PLAN_NAME
    --resource-group $RESOURCE_GROUP_NAME 
```

---

## 2 - Create an Azure Cosmos DB in MongoDB compatibility mode

Azure Cosmos DB is a fully managed NoSQL database for modern app development. Among its features is a 100% MongoDB compatible API allowing you to use your existing MongoDB tools, packages, and applications with Cosmos DB.

### [Azure portal](#tab/azure-portal)

You must be signed in to the [Azure portal](https://portal.azure.com/) to complete these steps to create a CosmosDB.

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Create Cosmos DB step 1](<./includes/create-cosmos-db-azportal-1.md>)] | :::image type="content" source="./media/azportal-create-cosmosdb-1-240px.png" alt-text="A screenshot showing how to use the search box in the top tool bar to find Cosmos DB in Azure." lightbox="./media/azportal-create-cosmosdb-1.png"::: |
| [!INCLUDE [Create Cosmos DB step 2](<./includes/create-cosmos-db-azportal-2.md>)] | :::image type="content" source="./media/azportal-create-cosmosdb-2-240px.png" alt-text="A screenshot showing the create button on the Cosmos DB page used to create a database." lightbox="./media/azportal-create-cosmosdb-2.png"::: |
| [!INCLUDE [Create Cosmos DB step 3](<./includes/create-cosmos-db-azportal-3.md>)] | :::image type="content" source="./media/azportal-create-cosmosdb-3-240px.png" alt-text="A screenshot showing the page where you select the MongoDB API for your Cosmos DB." lightbox="./media/azportal-create-cosmosdb-3.png"::: |
| [!INCLUDE [Create Cosmos DB step 4](<./includes/create-cosmos-db-azportal-4.md>)] | :::image type="content" source="./media/azportal-create-cosmosdb-4-240px.png" alt-text="A screenshot showing how to fill out the page to create a new Cosmos DB." lightbox="./media/azportal-create-cosmosdb-4.png"::: |

### [VS Code](#tab/vscode-aztools)

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Create Cosmos DB step 1](<./includes/create-cosmos-db-vscode-1.md>)] | :::image type="content" source="./media/vscode-create-cosmos-db-1-240px.png" alt-text="A screenshot showing the databases component of the Azure Tools VS Code extension and the location of the button to create a new database." lightbox="./media/vscode-create-cosmos-db-1.png"::: |
| [!INCLUDE [Create Cosmos DB step 2](<./includes/create-cosmos-db-vscode-2.md>)] | :::image type="content" source="./media/vscode-create-cosmos-db-2-240px.png" alt-text="A screenshot showing the dialog box used to select the subscription for the new database in Azure." lightbox="./media/vscode-create-cosmos-db-2.png"::: |
| [!INCLUDE [Create Cosmos DB step 3](<./includes/create-cosmos-db-vscode-3.md>)] | :::image type="content" source="./media/vscode-create-cosmos-db-3-240px.png" alt-text="A screenshot showing the dialog box used to select the type of database you want to create in Azure." lightbox="./media/vscode-create-cosmos-db-3.png"::: |
| [!INCLUDE [Create Cosmos DB step 4](<./includes/create-cosmos-db-vscode-4.md>)] | :::image type="content" source="./media/vscode-create-cosmos-db-4-240px.png" alt-text="A screenshot of dialog box used to enter the name of the new database in Visual Studio Code." lightbox="./media/vscode-create-cosmos-db-4.png"::: |
| [!INCLUDE [Create Cosmos DB step 5](<./includes/create-cosmos-db-vscode-5.md>)] | :::image type="content" source="./media/vscode-create-cosmos-db-5-240px.png" alt-text="A screenshot of the dialog to select the throughput mode of the database." lightbox="./media/vscode-create-cosmos-db-5.png"::: |
| [!INCLUDE [Create Cosmos DB step 6](<./includes/create-cosmos-db-vscode-6.md>)] | :::image type="content" source="./media/vscode-create-cosmos-db-6-240px.png" alt-text="A screenshot of the dialog in VS Code used to select resource group to put the new database in." lightbox="./media/vscode-create-cosmos-db-6.png"::: |
| [!INCLUDE [Create Cosmos DB step 7](<./includes/create-cosmos-db-vscode-7.md>)] | :::image type="content" source="./media/vscode-create-cosmos-db-7-240px.png" alt-text="A screenshot of the dialog in VS Code used to select location for the new database." lightbox="./media/vscode-create-cosmos-db-7.png"::: |

### [Azure CLI](#tab/azure-cli)

A new Azure CosmosDB account is created by using the [az cosmosdb create](/cli/azure/cosmosdbaz_cosmosdb_create) command.

* The name of the Cosmos DB account must be unique across Azure. The name may only contain lowercase letters, numbers, and the hyphen (-) character and must be between 3 and 50 characters long.
* The `--kind MongoDB` flag tells Azure to create a CosmosDB that is compatible with the MongoDB API.  This flag must be included for your CosmosDB to work as a MongoDB database.

```azurecli
COSMOS_DB_NAME='msdocs-expressjs-mongodb-database-123'   # Replace 123 with any three characters to form a unique name

az cosmosdb create \
    --name $COSMOS_DB_NAME \
    --resource-group $RESOURCE_GROUP_NAME \
    --kind MongoDB
```

Creating a new Azure CosmosDB typically takes about 5 minutes.

---

## 3 - Connect your App Service with your CosmosDB with a connection string

To connect to your CosmosDB database, you need to provide the connection string for the database to your application as an environment variable.

When running locally, this is done in the sample application using the [dotenv package](https://www.npmjs.com/package/dotenv) and the `.env` file. When deploying to Azure though, this approach is not recommended.

Instead, the connection string will be stored as an *application setting* in App Service and made available to the application at runtime as an environment variable. In this way, the application accesses the connection string from `process.env` the same way whether being run locally or in Azure. This same technique can also be used to store any other application settings your app may have.

### [Azure portal](#tab/azure-portal)

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Connection string step 1](<./includes/connection-string-azportal-1.md>)] | :::image type="content" source="./media/azportal-connection-string-1-240px.png" alt-text="A screenshot showing the location of the Cosmos DB connection string on the Cosmos DB quick start page." lightbox="./media/azportal-connection-string-1.png"::: |
| [!INCLUDE [Connection string step 2](<./includes/connection-string-azportal-2.md>)] | :::image type="content" source="./media/azportal-connection-string-2-240px.png" alt-text="A screenshot showing how to search for and navigate to the App Service where the connection string needs to store the connection string." lightbox="./media/azportal-connection-string-2.png"::: |
| [!INCLUDE [Connection string step 3](<./includes/connection-string-azportal-3.md>)] | :::image type="content" source="./media/azportal-connection-string-3-240px.png" alt-text="A screenshot showing how to access the Application settings within an App Service." lightbox="./media/azportal-connection-string-3.png"::: |
| [!INCLUDE [Connection string step 4](<./includes/connection-string-azportal-4.md>)] | :::image type="content" source="./media/azportal-connection-string-4-240px.png" alt-text="A screenshot showing the dialog used to set an application setting in Azure App Service." lightbox="./media/azportal-connection-string-4.png"::: |

### [VS Code](#tab/vscode-aztools)

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Connection string step 1](<./includes/connection-string-vscode-1.md>)] | :::image type="content" source="./media/vscode-connection-string-1-240px.png" alt-text="A screenshot showing how to copy the connection string for a Cosmos database to your clipboard in VS Code." lightbox="./media/vscode-connection-string-1.png"::: |
| [!INCLUDE [Connection string step 2](<./includes/connection-string-vscode-2.md>)] | :::image type="content" source="./media/vscode-connection-string-2-240px.png" alt-text="A screenshot showing how add a config setting to an App Service in VS Code." lightbox="./media/vscode-connection-string-2.png"::: |
| [!INCLUDE [Connection string step 3](<./includes/connection-string-vscode-3.md>)] | :::image type="content" source="./media/vscode-connection-string-3-240px.png" alt-text="A screenshot showing the dialog box used to give a name to an app setting in VS Code." lightbox="./media/vscode-connection-string-3.png"::: |
| [!INCLUDE [Connection string step 4](<./includes/connection-string-vscode-4.md>)] | :::image type="content" source="./media/vscode-connection-string-4-240px.png" alt-text="A screenshot showing the dialog used to set the value of an app setting in VS Code." lightbox="./media/vscode-connection-string-4.png"::: |
| [!INCLUDE [Connection string step 4](<./includes/connection-string-vscode-5.md>)] | :::image type="content" source="./media/vscode-connection-string-5-240px.png" alt-text="A screenshot showing how to view an app setting for an App Service in VS Code." lightbox="./media/vscode-connection-string-5.png"::: |

### [Azure CLI](#tab/azure-cli)

To get the connection string for a Cosmos DB database, use the [az cosmos keys list](/cli/azure/cosmosdb/keys) command.

```azurecli
az cosmosdb keys list \
    --type connection-strings \
    --resource-group $RESOURCE_GROUP_NAME \
    --name $COSMOS_DB_NAME \
    --query "connectionStrings[?description=='Primary MongoDB Connection String'].connectionString" \
    --output tsv
```

Rather then copying and pasting the value, the connection string can be stored in a variable to make subsequent steps easier.

```azurecli
COSMOS_DB_CONNECTION_STRING=`az cosmosdb keys list \
    --type connection-strings \
    --resource-group $RESOURCE_GROUP_NAME \
    --name $COSMOS_DB_NAME \
    --query "connectionStrings[?description=='Primary MongoDB Connection String'].connectionString" \
    --output tsv`
```

The [az webapp config appsettings](/cli/azure/webapp/config/appsettings) command is used to set application setting values for an App Service web app.  One or more key-value pairs are set using the `--settings` parameter. To set the `DATABASE_URL` value to the connection string for your web app, use the following command.

```azurecli
az webapp config appsettings set \
    --name $APP_SERVICE_NAME \
    --resource-group $RESOURCE_GROUP_NAME \
    --settings DATABASE_URL=$COSMOS_DB_CONNECTION_STRING
```

---

## 4 - Deploy application code to Azure

Azure App service supports multiple different methods to deploy your application code to Azure including support for GitHub actions and all major CI/CD tools. This article focuses on how to deploy your code from your local workstation to Azure.

### [Deploy using VS Code](#tab/vscode-deploy)

To deploy your application code directly from VS Code, you must have the [Azure Tools extension pack](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack) installed and be signed into Azure from VS Code.

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Deploy from VS Code 1](<./includes/deploy-from-vscode-1.md>)] | :::image type="content" source="./media/deploy-from-vscode-1-240px.png" alt-text="A screenshot showing the location of the Azure Tool icon in Visual Studio Code." lightbox="./media/deploy-from-vscode-1.png"::: |
| [!INCLUDE [Deploy from VS Code 2](<./includes/deploy-from-vscode-2.md>)] | :::image type="content" source="./media/deploy-from-vscode-2-240px.png" alt-text="A screenshot showing how you deploy an application to Azure by right-clicking on a web app in VS Code and selecting deploy from the context menu." lightbox="./media/deploy-from-vscode-2.png"::: |
| [!INCLUDE [Deploy from VS Code 3](<./includes/deploy-from-vscode-3.md>)] | :::image type="content" source="./media/deploy-from-vscode-3-240px.png" alt-text="A screenshot showing the Output window of VS Code while deploying an application to Azure." lightbox="./media/deploy-from-vscode-3.png"::: |

### [Deploy using Local git](#tab/local-git-deploy)

[!INCLUDE [Deploy using Local Git](<./includes/deploy-local-git.md>)]

### [Deploy using FTPS](#tab/ftps-deploy)

This tab is about deploying with FTPS.  You can configure this using the Azure portal or with the Azure CLI.

[!INCLUDE [Deploy FTPS](<./includes/deploy-ftps.md>)]

### [Deploy using Azure CLI](#tab/azure-cli-deploy)

Blah blah blah

---

## 5 - Browse to the application

The application will have a url of the form `https://<app name>.azurewebsites.net`. Browse the this URL to view the application.

Use the form elements in the application to add and complete tasks.

![A screenshot showing the application running in a browser.](./media/sample-app-in-browser.png)

## 6 - Configure and view application logs

## 7 - Inspect deployed files using Kudu

[Kudu](/azure/app-service/resources-kudu) is the engine behind many of the automated deployment features in App Service. In addition, it provides a useful web-based console to view your deployed application in Azure.

To access Kudu, navigate to one of the following URLs. You will need to sign into the Kudu site with your Azure credentials.
* For apps deployed in Free, Shared, Basic, Standard and Premium App Service plans - `https://<app-name>.scm.azurewebsites.net`
* For apps deployed in Isolated service plans - `https://<app-name>.scm.<ase-name>.p.azurewebsites.net`

From the main page in Kudu, you can access information about the application hosting environment, app settings, deployments and browse the files in the wwwroot directory.

![A screenshot of the main page in the Kudu SCM app showing the different information available about the hosting environment.](./media/kudu-main-page.png)

Selecting the *Deployments* link under the REST API header will show you a history of deployments of your web app.

![A screenshot of the deployments JSON in the Kudu SCM app showing the history of deployments to this web app.](./media/kudu-deployments-list.png)

Selecting the *Site wwwroot* link under the Browse Directory heading allows you to browse and view the files on the web server. This is useful when troubleshooting deployment problems and you need to see exactly what files are deployed on the server.

![A screenshot of files in the wwwroot directory showing how Kudu allows you to see what has been deployed to Azure.](./media/kudu-wwwwroot-files.png)

## Clean up resources

## Next steps

* Managed identity
* Performance monitoring
* User authentication

## Things that did not work

### [Deploy using VS Code](#tab/deploy-vscode-2)

To deploy your application code directly from VS Code, you must have the [Azure Tools extension pack](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack) installed and be signed into Azure from VS Code.

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Deploy from VS Code 1](<./includes/deploy-from-vscode-1.md>)] | :::image type="content" source="./media/deploy-from-vscode-1-240px.png" alt-text="A screenshot showing the location of the Azure Tool icon in Visual Studio Code." lightbox="./media/deploy-from-vscode-1.png"::: |
| [!INCLUDE [Deploy from VS Code 2](<./includes/deploy-from-vscode-2.md>)] | :::image type="content" source="./media/deploy-from-vscode-2-240px.png" alt-text="A screenshot showing how you deploy an application to Azure by right-clicking on a web app in VS Code and selecting deploy from the context menu." lightbox="./media/deploy-from-vscode-2.png"::: |
| [!INCLUDE [Deploy from VS Code 3](<./includes/deploy-from-vscode-3.md>)] | :::image type="content" source="./media/deploy-from-vscode-3-240px.png" alt-text="A screenshot showing the Output window of VS Code while deploying an application to Azure." lightbox="./media/deploy-from-vscode-3.png"::: |

### [Deploy using Local Git](#tab/deploy-local-git-2)

You can deploy your code to Azure from a local Git repository by configuring a remote Git repository in Azure to push code to. Pushing code to Azure via Git requires that you:

* Configure a Git remote in your local repository.
* Configure your Azure web app for local Git deployment.
* Retrieve the deployment credentials for the web app from Azure. These deployment credentials are different than the credentials you use to sign into the Azure portal with. They are auto-generated and scoped to only allow deployment to this web app.

Configuring your Azure web app for local Git deployment and retrieving your credentials can be done in either the Azure portal or using the Azure CLI.

<details>
    <summary>Azure portal</summary>
    [!INCLUDE [Deploy local Git Config Azure Portal](<./deploy-from-local-git-azportal-config-expandable.md>)]

</details>
<details>
    <summary>Azure CLI</summary>
    [!INCLUDE [Deploy local Git Config Azure CLI](<./deploy-from-local-git-azcli-config-expandable.md>)]
</details>

Next, you need to add a [Git remote](https://git-scm.com/book/en/v2/Git-Basics-Working-with-Remotes) that points to Azure where you will deploy your code to. In the root directory of your application, run the following command:

```bash
git remote add azure <deploymentLocalGitUrl-from-create-step>
```

To deploy your application to Azure, use the `git push` command to push code from your local `main` branch to the `azure` remote. The first time you push your code to Azure, Git will prompt you for the credentials to connect to the remote repository.  Enter the Azure deployment credentials you retrieved above.  Git will cache these credentials so you will not have to re-enter them on subsequent deployments.

```bash
git push azure main
```

### [Deploy using FTPS](#tab/deploy-ftps-2)

Blah blah blah

### [Deploy using Azure CLI](#tab/deploy-cli-2)

Blah blah blah

---
