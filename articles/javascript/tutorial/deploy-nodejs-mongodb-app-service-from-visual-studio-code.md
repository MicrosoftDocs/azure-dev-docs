---
title: Deploy Express.js/MongoDB app with VS Code - App Service/Cosmos DB
description: In this tutorial, use a Node.js app with a MongoDB database using the MongoDB native API. Deploy the Node.js application to Azure App Service (on Linux) then verify the hosted app works.
ms.topic: tutorial
ms.date: 03/29/2021
ms.custom: scenarios:getting-started, languages:JavaScript, devx-track-javascript
---

# Deploy Express.js MongoDB app to App Service from Visual Studio Code

Deploy the Express.js application, which connects to MongoDB to Azure App Service (on Linux) and a Cosmos DB. 

The programming work is done for you, this tutorial focuses on using the local and remote Azure environments successfully from inside Visual Studio Code with Azure extensions.

* **[Sample code](https://github.com/Azure-Samples/js-e2e-express-mongo)**

## Top tasks

This tutorial includes several **top Azure tasks** for JavaScript developers:

* Create Cosmos DB resource to host MongoDB database
* Create App service resource to host Express.js app
* Deploy Express.js app to App service

## Sample application

The [sample Express.js app](https://github.com/Azure-Samples/js-e2e-express-mongo) consists of the following elements:

* **Express.js server** hosted on port 8080
* Simple **React.js server-side view** engine
* **MongoDB native API** functions to insert, delete, and find data

:::image type="content" source="../media/tutorial-end-to-end-app-cosmos/nodejs-app-connected-mongodb-form.png" alt-text="Simple Node.js app connected to MongoDB database.":::

## Create or use existing Azure Subscription 

* An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/nodejs/).

## Install software

- [Node.js 12 (LTS) and npm](https://nodejs.org/en/download), the Node.js package manager installed to your local machine.
- [Visual Studio Code](https://code.visualstudio.com/) installed to your local machine. 
- Visual Studio Code extensions:
    - [Azure App Service extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azureappservice) for Visual Studio Code (installed from within Visual Studio Code).
    - [Azure Databases](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-cosmosdb)
    - [Azure Resources](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azureresourcegroups)
## Create a Cosmos DB database resource for MongoDB

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
    |Select or create a resource group.|Create a new resource group named `js-demo-mongodb-web-app-resource-group-YOUR-NAME-HERE`.|
    |Location|The location of the resource. For this tutorial, select a regional location close to you.|

    Creating the resource may take up to 15 minutes. You can move skip the next section if you are time-restricted but remember to back to finish this next section in a few minutes.

## Get Cosmos DB connection string

While still in the Azure Databases explorer, right-click the resource name, the select **Copy Connection String** to copy the connection string. You will need this later in the tutorial for your environment variable file.

:::image type="content" source="../media/tutorial-end-to-end-app-cosmos/vscode-databases-extenion-copy-connection-string.png" alt-text="Express.js web app form and data results from local MongoDB.":::

## Clone the sample Express.js app

The Express.js web app is provided for you. Clone the app with git, then install the dependencies and run the app. 

1. Clone the sample repo, install the dependencies, then open the project in Visual Studio Code. 

    ```bash
    git clone https://github.com/Azure-Samples/js-e2e-express-mongo.git && \
    cd js-e2e-express-mongo && \
    npm install && \
    code .
    ```
  

1. Edit the environment file, `.env`, adding the connection string property for your Cosmos DB as the `DATABASE_URL` property's value. 

    ```bash
    DATABASE_URL=ADD-YOUR-CONNECTION-STRING_HERE
    ```

1. In Visual Studio Code, open a terminal window, and run the following commands to install the sample's dependencies and start the web app.

    ```bash
    npm start
    ```

1. View the web app on your local computer in a browser.

    ```url
    http://localhost:8080/
    ```

    :::image type="content" source="../media/tutorial-end-to-end-app-cosmos/nodejs-app-connected-mongodb-form.png" alt-text="Simple Node.js app connected to MongoDB database.":::

## Create web app resource and deploy Express.js app

Use the Visual Studio Code extension for App Service to create an App service resource and deploy the Express.js web app to the resource.

1. Navigate to the Azure explorer. Right-click on the subscription then select `Create new web app...(Advanced)`.

    :::image type="content" source="../media/tutorial-end-to-end-app-cosmos/create-web-app-with-extension.png" alt-text="Partial screenshot of Visual Studio Code using Azure App service extension to create a web app.":::

1. Follow the prompts using the following table to understand how your values are used.

    |Property|Value|
    |--|--|
    |Enter a globally unique name for the new web app.| Enter a value such as `web-app-with-mongodb-YOUR-NAME`, for your App service resource. Replace `<YOUR-NAME>` with your name or unique ID. This unique name is also used as part of the URL to access the resource in a browser.|
    |Select a resource group for new resources.|Select the resource group you created for your Cosmos DB resource, `js-demo-mongodb-web-app-resource-group-YOUR-NAME-HERE`, replacing `YOUR-NAME-HERE` with your name or email alias.|
    |Select a runtime for the Linux app.|Select `Node 12 LTS`.|
    |Select an OS.|Select Linux.|
    |Create a Linux App Service Plan.|Create a new service plan named `js-demo-mongodb-web-app-plan-YOUR-NAME-HERE`, replacing `YOUR-NAME-HERE` with your name or email alias.|
    |Select a pricing tier|Free|
    |Select an Application Insights resource.|Skip for now.|
    |Select a location for new resources.|Select the same location you selected when creating your Cosmos DB resource and resource group.|

1. When the app creation process is complete, a status message appears at the bottom right-corner of Visual Studio Code with a choice of `Deploy` or  `View output`. Select `Deploy`.

    :::image type="content" source="../media/tutorial-end-to-end-app-cosmos/vscode-app-extension-create-web-app-deploy-web-app.png" alt-text="Partial screenshot of Visual Studio Code, using Azure App service extension to deploy web app immediately after creating web app.":::

    If the status message is no longer visible, you can deploy by selecting the Azure explorer, then right-click on the resource name, then select **Deploy to Web App...**.

1. During the deployment process, a notification allows you to select to see the **output window**.  This displays the rolling status of the deployment. 

1. When the deployment is complete, a notification appears. Select **Stream logs** to see the rolling logs. 

    :::image type="content" source="../media/tutorial-end-to-end-app-cosmos/vscode-app-service-deployed.png" alt-text="Service is deployed. `Stream logs`.":::

    :::image type="content" source="../media/tutorial-end-to-end-app-cosmos/vscode-app-service-stream-logs.png" alt-text="When the deployment is complete, a notification appears allowing you to select `Stream logs`.":::    

## Configure App Service environment variable for database connection string

The environment variable, `DATABASE_URL`, locally stored in your `.env`, file was not deployed to your web app. This is because it is listed as an ignored file in the `./.vscode/settings.json` file:

```json
{
    "appService.zipIgnorePattern": [
        "node_modules{,/**}",
        ".vscode{,/**}",
        ".env",
        "test{,/**}"
    ],
    "appService.deploySubpath": ".",
    "editor.codeActionsOnSave": {
        "source.fixAll.eslint": true
    }
}
```

1. Select the Azure icon in the activity bar, then select your web app under the App Service and subscription. 
1. Right-click **Application Settings**, then select **Add New Setting**. 
1. Add the same name and value from your `.env` file. 

    |Setting name|Value|
    |--|--|
    |DATABASE_URL|mongodb://...|

1. Right-click you Azure web app and select **Restart**

## View your Azure web app in a browser

1. Open the website in a browser, replace the text `YOUR-RESOURCE_NAME` with your own resource name: `https://YOUR-RESOURCE_NAME.azurewebsites.net`.
1. Use the web app, adding and deleting items. 

## Make changes and redeploy

Make a few changes and [redeploy](../how-to/deploy-web-app.md#deploy-or-redeploy-to-app-service-with-visual-studio-code) the app using the App service extension. 

## Clean up resources 

Once you have completed this tutorial, remove the resources. 

In Visual Studio Code, use the Azure explorer for Resource Groups, right-click on the resource group, such as `js-demo-mongodb-web-app-resource-group-YOUR-NAME-HERE`, replacing `YOUR-NAME-HERE` with your name or email alias, then select **Delete...**

## Want to learn more

Azure App Service extension

* [GitHub wiki](https://github.com/microsoft/vscode-azureappservice/wiki)
* [GitHub wiki zip deployment](https://github.com/microsoft/vscode-azureappservice/wiki/Configuring-Zip-Deployment#additional-zip-deploy-configuration-settings)

## Next steps

Continue learning about the App Service and Cosmos DB:
* [Learn about how to configure your app settings](../how-to/configure-web-app-settings.md)
* [Configure a Node.js app for Azure App Service](/azure/app-service/configure-language-nodejs?pivots=platform-linux)
* [Connect with SSH](/azure/app-service/configure-linux-open-ssh-session)
* [Migrate data to Cosmos DB](/azure/dms/tutorial-mongodb-cosmos-db?toc=/azure/cosmos-db/toc.json?toc=/azure/cosmos-db/toc.json)
