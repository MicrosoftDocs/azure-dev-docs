---
title: Use MongoDB (Cosmos DB) in Node.js app deployed to Azure App Service from Visual Studio Code
description:
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

[!INCLUDE [azure-sign-in](../includes/azure-sign-in.md)]

[I ran into an issue](#troubleshooting-tasks-in-tutorial)

## Download and run sample code

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

    If you ran into an issue in this section, use the [tutorial troubleshooting guide](#troubleshooting-tasks-in-tutorial) to resolve the issue or report a problem.

## Create web app resource

Create web app resource with Azure app service extension

Create web app resource in VSCode with Azure App Service extension

Deploy working project to resource

View deployment status from portal (Diagnose and solve problems)

Verify with external URL that web app is running sample project code

Browse website

Start streaming logs

Change URL – visual verify webpage and streaming logs show the event

## Create JavaScript file to connect to mongoDB

Create cosmosdb file containing client creation with endpoint and key, create db and container if it doesn’t exist, insert method, getall method.

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