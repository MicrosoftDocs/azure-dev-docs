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
