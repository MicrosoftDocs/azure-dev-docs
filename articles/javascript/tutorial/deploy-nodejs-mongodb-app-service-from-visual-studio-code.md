---
title: Deploy Node.js MongoDB app with VSCode - App Service
description: In this tutorial, use a Node.js app with a MongoDB database using the MongoDB native API. Deploy the Node.js application to Azure App Service (on Linux) then verify the hosted app works.
ms.topic: tutorial
ms.date: 12/03/2020
ms.custom: scenarios:getting-started, languages:JavaScript, devx-track-javascript
---

# Deploy Express.js MongoDB app to App Service from Visual Studio Code

Deploy the Express.js application which connects to MongoDB to Azure App Service (on Linux) and a CosmosDB. 

The programming work is done for you, this tutorial focuses on using the local and remote Azure environments successfully from inside Visual Studio Code with Azure extensions.

## Top tasks

This tutorial includes several **top Azure tasks** for JavaScript developers:

* Create CosmosDB resource to host MongoDB database
* Create App service resource to host Express.js app
* Deploy Express.js app to App service

## Sample application

The [sample Express.js app](https://github.com/Azure-Samples/js-e2e-express-mongo)consists of the following elements:

* **Express.js server** hosted on port 8080
* Simple **React.js server-side view** engine
* **MongoDB native API** functions to insert, delete, and find data

:::image type="content" source="../media/tutorial-end-to-end-app-cosmos/nodejs-app-connected-mongodb-form.png" alt-text="Simple Node.js app connected to MongoDB database.":::

## Create or use existing Azure Subscription 

* An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/).

## Install software

- [Node.js 12 (LTS) and npm](https://nodejs.org/en/download), the Node.js package manager installed to your local machine.
- [Visual Studio Code](https://code.visualstudio.com/) installed to your local machine. 
- Visual Studio Code extensions:
    - [Azure App Service extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azureappservice) for Visual Studio Code (installed from within Visual Studio Code).
    - [Azure Databases](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-cosmosdb)

## Create a CosmosDB database resource for MongoDB

Create a Cosmos resource first because this will take several minutes. 

1. In Visual Studio Code, select the **Azure** icon in the left-most menu, then select the **Databases** section. 

    If the **Databases** section isn't visible, make sure you have checked the section in the top Azure **...** menu. 

    :::image type="content" source="../media/tutorial-end-to-end-app-cosmos/vscode-azure-extension-select-database-section.png" alt-text="Partial screenshot of Visual Studio Code's remote container icon"::: 

1. In the **Databases** section of the Azure explorer, select your subscription with a right-click, then select **Create Server**.
1. In the **Create new Azure Database Server** Command Palette, select **Azure Cosmos DB for MongoDB API**. 
1. Follow the prompts using the following table to understand how your values are used. The database may take up to 15 minutes to create.

    |Property|Value|
    |--|--|
    |Enter a globally unique **Account name** name for the new resource.| Enter a value such as `cosmos-mongodb-YOUR-NAME`, for your resource. Replace `YOUR-NAME` with your name or unique ID. This unique name is also used as part of the URL to access the resource in a browser.|
    |Select or create a resource group.|If you need to create a resource group, use a naming convention that identifies the owner, purpose, and region such as `westus-cosmostutorial-joesmith`.|
    |Location|The location of the resource. For this tutorial, select a regional location close to you.|

    Creating the resource may take up to 15 minutes. You can move skip the next section if you are time-restricted but remember to back to finish this next section in a few minutes.

## Get CosmosDB connection string

While still in the Azure Databases explorer, right-click the resource name, the select **Copy Connection String** to copy the connection string. You will need this later in the tutorial for your environment variable file.

:::image type="content" source="../media/tutorial-end-to-end-app-cosmos/vscode-databases-extenion-copy-connection-string.png" alt-text="Express.js web app form and data results from local MongoDB.":::

## Download and run the sample Express.js app

The Express.js web app is provided for you. Download the app, install the dependencies and run the app. 

1. [Download the zipped GitHub repo](https://github.com/Azure-Samples/js-e2e-express-mongo.git) to your local computer then expand to a folder. 
1. Open the folder with Visual Studio Code. You can either right-click on the folder and select **Open with Code** or use the CLI equivalent when inside the folder:

    ```bash
    code .
    ```

1. Edit the environment file, `.env`, adding the connection string property for your CosmosDB as the `DATABASE_URL` property's value. 

    ```bash
    ENVIRONMENT=development
    DATABASE_NAME=
    DATABASE_COLLECTION_NAME=
    DATABASE_URL=
    ```

1. In Visual Studio Code, open a terminal window, and run the following commands to install the sample's dependencies and start the web app.

    ```bash
    npm install && npm start
    ```

1. View the web app on your local computer in a browser.

    ```url
    http://localhost:8080/
    ```

    :::image type="content" source="../media/tutorial-end-to-end-app-cosmos/nodejs-app-connected-mongodb-form.png" alt-text="Simple Node.js app connected to MongoDB database.":::

## Create web app resource and deploy Express.js app

Use the Visual Studio Code extension for App Service to create an App service resource and deploy the Express.js web app to the resource.

1. Navigate to the Azure explorer. Right-click on the subscription then select `Create new web app...`.

    :::image type="content" source="../media/tutorial-end-to-end-app-cosmos/create-web-app-with-extension.png" alt-text="Partial screenshot of Visual Studio Code using Azure App service extension to create a web app.":::

1. Follow the prompts using the following table to understand how your values are used.

    |Property|Value|
    |--|--|
    |Enter a globally unique name for the new web app.| Enter a value such as `web-app-with-mongodb-YOUR-NAME`, for your App service resource. Replace `<YOUR-NAME>` with your name or unique ID. This unique name is also used as part of the URL to access the resource in a browser.|
    |Select a runtime for the Linux app.|Select `Node 12 LTS`.|

1. When the app creation process is complete, a status message appears at the bottom right-corner of Visual Studio Code with a choice of `Deploy` or  `View output`. Select `Deploy`.

    :::image type="content" source="../media/tutorial-end-to-end-app-cosmos/vscode-app-extension-create-web-app-deploy-web-app.png" alt-text="Partial screenshot of Visual Studio Code, using Azure App service extension to deploy web app immediately after creating web app.":::

    If the status message is no longer visible, you can deploy by selecting the Azure explorer, then right-click on the resource name, then select **Deploy to Web App...**.

1. During the deployment process, a notification allows you to select to see the **output window**.  This displays the rolling status of the deployment. 

1. When the deployment is complete, a notification appears. Select **Stream logs** to see the rolling logs. 

    :::image type="content" source="../media/tutorial-end-to-end-app-cosmos/vscode-app-service-deployed.png" alt-text="Service is deployed. `Stream logs`.":::

    :::image type="content" source="../media/tutorial-end-to-end-app-cosmos/vscode-app-service-stream-logs.png" alt-text="When the deployment is complete, a notification appears allowing you to select `Stream logs`.":::    

1. Open the website in a browser, replace the text `YOUR-RESOURCE_NAME` with your own resource name: `https://YOUR-RESOURCE_NAME.azurewebsites.net`.
1. Use the web app, adding and deleting items. 

## Clean up resources 

Once you have completed this tutorial, you need to remove the two resources created, to make sure you are not billed. 

1. In Visual Studio Code, use the Azure explorer for Databases, right-click on the resource then select **Delete Account...**.
1. In Visual Studio Code, use the Azure explorer for App Service, right-click on the resource then select **Delete**.

## Next steps

Continue learning about the App Service and CosmosDB:
* [Configure a Node.js app for Azure App Service](/azure/app-service/configure-language-nodejs?pivots=platform-linux)
* [Connect with SSH](/azure/app-service/configure-linux-open-ssh-session)
* [Migrate data to CosmosDB](/azure/dms/tutorial-mongodb-cosmos-db?toc=/azure/cosmos-db/toc.json?toc=/azure/cosmos-db/toc.json)
