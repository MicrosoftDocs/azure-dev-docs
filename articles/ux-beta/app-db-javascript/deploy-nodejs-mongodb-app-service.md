---
title: Deploy Express.js/MongoDB app with VS Code - App Service/Cosmos DB
description: In this tutorial, use a Node.js app with a MongoDB database using the MongoDB native API. Deploy the Node.js application to Azure App Service (on Linux) then verify the hosted app works.
ms.topic: tutorial
ms.date: 03/29/2021
ms.service: app-service
ms.custom: scenarios:getting-started, languages:JavaScript, devx-track-js
---

# Deploy a Node.js web app using MongoDB to Azure

Azure provides a fully managed solution for hosting JavaScript web apps in the cloud. In this article, you will clone and deploy a basic **Express.js** app using a **MongoDB** database to Azure.  The Express.js app will be hosted in Azure App Service and the MongoDB database in Azure Cosmos DB, a cloud native database offering a [100% MongoDB compatible API](/azure/cosmos-db/mongodb/mongodb-introduction).

[IMAGE]

In this tutorial, you will create the necessary Azure resources, deploy your code to Azure, browse to your application, and inspect the deployed app to see the log files and the environment that hosts your app. No application code changes will be necessary to host the applications in Azure.

This article assumes you already are familiar with the Node.js development workflow and have Node and MongoDB installed locally.  You will also need an Azure account with an active subscription.  If you do not have an Azure account, you [can create one for free](https://azure.microsoft.com/free/nodejs/).

Node versions supported

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

To run the application locally...

## 1 - Create the Azure App Service

Azure App Service is used to host the Express.js web application code. Azure App service supports hosting JavaScript apps in both Linux and Windows server environments.

When setting up the App Service for the application, you will configure two individual components:

* An **App Service plan** which defines the operating system and compute resources (CPU, memory) available for the application.
* A **App Service web app** which defines the application name and runtime used by the application.

All Azure resources must belong to a *resource group, which serves as a logical container to group related Azure resources together. As part of creating your App Service resources, you will also create a resource group used to group together all of the Azure resources needed for the application.

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
| [!INCLUDE [Create app service step 5](<./includes/create-app-service-vscode-6.md>)] | :::image type="content" source="./media/vscode-create-app-service-6-240px.png" alt-text="A screenshot of the dialog in VS Code used to select the App Service plan for the new web app." lightbox="./media/vscode-create-app-service-5.png"::: |

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

Instead, the connection string will be stored as an *application setting* in App Service and made available to the application at runtime as an environment variable. In this way, the application accesses the connection string from `process.env` the same way whether being run locally or in Azure.


### [Azure portal](#tab/azure-portal)

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Connection string step 1](<./includes/connection-string-azportal-1.md>)] | :::image type="content" source="./media/azportal-connection-string-1-240px.png" alt-text="A screenshot showing the location of the Cosmos DB connection string on the Cosmos DB quick start page." lightbox="./media/azportal-connection-string-1.png"::: |
| [!INCLUDE [Connection string step 2](<./includes/connection-string-azportal-2.md>)] | :::image type="content" source="./media/azportal-connection-string-2-240px.png" alt-text="A screenshot showing how to search for and navigate to the App Service where the connection string needs to store the connection string." lightbox="./media/azportal-connection-string-2.png"::: |
| [!INCLUDE [Connection string step 3](<./includes/connection-string-azportal-3.md>)] | :::image type="content" source="./media/azportal-connection-string-3-240px.png" alt-text="A screenshot showing how to access the Application settings within an App Service." lightbox="./media/azportal-connection-string-3.png"::: |
| [!INCLUDE [Connection string step 4](<./includes/connection-string-azportal-4.md>)] | :::image type="content" source="./media/azportal-connection-string-4-240px.png" alt-text="A screenshot showing the dialog used to set an application setting in Azure App Service." lightbox="./media/azportal-connection-string-4.png"::: |



### [VS Code](#tab/vscode-aztools)

### [Azure CLI](#tab/azure-cli)


---


## 4 - Deploy application code to Azure


## 5 - Browse to the application

## 6 - Inspect application logs

## 7 - Something with Kudu
