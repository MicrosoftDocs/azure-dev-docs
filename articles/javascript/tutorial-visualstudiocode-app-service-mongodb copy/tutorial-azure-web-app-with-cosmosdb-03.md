---
title: Use MongoDB (Cosmos DB) in Node.js app deployed to Azure App Service from Visual Studio Code
description: In this tutorial, add web server which connects to a MongoDB. Deploy the Node.js application to Azure App Service (on Linux or Windows) using the App Service extension.
ms.topic: tutorial
ms.date: 09/22/2020
ms.custom: devx-track-javascript
---

# Use MongoDB (Cosmos DB) in Node.js app deployed to Azure App Service from Visual Studio Code

In this tutorial, add web server which connects to a MongoDB. Deploy the Node.js application to Azure App Service (on Linux or Windows) using the [App Service extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azureappservice).

## Create a web app connected to mongoDB



## Prerequisites

- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/?utm_source=campaign&utm_campaign=vscode-tutorial-appservice-extension&mktingSource=vscode-tutorial-appservice-extension).
- [Visual Studio Code](https://code.visualstudio.com/).
- The [Azure App Service extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azureappservice) for VS Code (installed from within VS Code).
- [Node.js and npm](https://nodejs.org/en/download), the Node.js package manager.

> <a class="tutorial-install-extension-btn" href="https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azureappservice">Install the Azure App Service extension</a>

## Sign in to Azure

[!INCLUDE [azure-sign-in](includes/azure-sign-in.md)]

> [!div class="nextstepaction"]
> [I ran into an issue](#troubleshooting-tasks-in-tutorial)

## Download and run the initial Express.js app

The initial Express.js web app is provided as a starting point. Download the app, install the dependencies and run the app.

1. [Download the app]() from GitHub to a local directory.
1. Open the directory with Visual Studio Code.
1. In Visual Studio Code, open a terminal window, and run the following command to install the sample's dependencies.

    ```javascript
    npm install
    ```

1. In the same terminal window, run the command to run the web app.

    ```javascript
    npm start
    ```

1. Open a web browser and use the following url to view the web app on your local computer.

    ```url
    http://localhost:3000/
    ```

    If you see the simple web app in your browser, you have succeeded with this section of the tutorial.

    > [!div class="nextstepaction"]
    > [I ran into an issue](#troubleshooting-tasks-in-tutorial)

## Create web app resource

Use the Visual Studio Code extension to create an App service resource and deploy the web app to the resource.

1. Navigate to the Azure explorer. Right-click on the subscription then select `Create new web app...`.

    :::image type="content" source="media/tutorial-end-to-end-app-cosmos/create-web-app-with-extension.png" alt-text="Partial screenshot of Visual Studio Code using Azure App service extension to create a web app.":::

1. Follow the prompts, use the following table to understand how your values are used.

    |Property|Value|
    |--|--|
    |Enter a globally unique name for the new web app.| Enter a value such as `web-app-with-mongodb-<YOUR-NAME>`, for your App service resource. Replace `<YOUR-NAME>` with your name or unique id. This unique name is also used as part of the URL to access the resource in a browser.|
    |Select a runtime for the Linux app.|Select `Node 12 LTS`.|

    When the app creation process is complete, a status message appears at the bottom right-corner of Visual Studio Code with a choice of `Deploy` or  `View output`. Select `Deploy`.

    :::image type="content" source="media/tutorial-end-to-end-app-cosmos/vscode-app-extension-create-web-app-deploy-web-app.png" alt-text="Partial screenshot of Visual Studio Code, using Azure App service extension to deploy web app immediately after creating web app.":::

1.  If the status message is no longer visible, you can deploy by selecting the Azure explorer, then right-click on the resource name, then select

    :::image type="content" source="media/tutorial-end-to-end-app-cosmos/vscode-app-extension-deploy-web-app.png" alt-text="Partial screenshot of Visual Studio Code, using Azure App service extension to deploy web app.":::

## Create JavaScript file to connect to mongoDB

Create a JavaScript code file which uses the Mongo API to insert and read data from a MongoDB database.

1. In the 
containing client creation with endpoint and key, create db and container if it doesn’t exist, insert method, getall method.

## Create ExpressJS routes to pass request to database

Create insert and getall routes that return DB response to browser and logging stream

## Verify app on local computer

## Redeploy to App service and verify cloud app works

## Troubleshooting tasks in tutorial

Use the following table to resolve issues with the tutorial. If you still are unable to resolve the issues, after trying the remedies, use the `Report issue` link in the related section.

|Step|Remedies|Report issue|
|--|--|--|
|Install the Azure Extension||[Report issue](https://www.research.net/r/PWZWZ52?tutorial=tutorial-azure-web-app-with-cosmosdb&step=install-vscode-extension-for-azure)|

## Next steps