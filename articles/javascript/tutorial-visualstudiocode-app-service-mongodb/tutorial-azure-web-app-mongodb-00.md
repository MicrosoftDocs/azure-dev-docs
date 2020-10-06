---
title: Use MongoDB (Cosmos DB) in Node.js app deployed to Azure App Service from Visual Studio Code
description: In this tutorial, add web server, which connects to a MongoDB. Deploy the Node.js application to Azure App Service (on Linux or Windows) using the App Service extension.
ms.topic: tutorial
ms.date: 09/22/2020
ms.custom: devx-track-javascript
---

In this tutorial, use a Node.js app with a MongoDB database using the MongoDB native API. Deploy the Node.js application to Azure App Service (on Linux) then verify the cloud-based app works. 

The programming work is done for you, this tutorial focuses on using the local and remote Azure environments successfully from inside Visual Studio Code with Azure extensions.

This tutorial includes several **top Azure tasks** for JavaScript developers:

* Use a local MongoDB database
* Use app with container
* Deploy app to cloud
* Configure cloud-hosted app settings 
* Connect local app to a remote database

## Create a web app connected to mongoDB

The Node.js app consists of the following elements:

* **Express.js server** hosted on port 8080
* Simple **React.js server-side view** engine
* **MongoDB native API** functions to insert, delete, and find data

:::image type="content" source="../media/tutorial-end-to-end-app-cosmos/nodejs-app-connected-mongodb-form.png" alt-text="Simple Node.js app connected to MongoDB database.":::

### The MongoDB connection

If the database connection can't be made, the app displays the message, `No database found.`. This will be the initial state of the app.

When the database connection is made, the app consists of two text fields in a form with a submit button with the contents of the Mongo collection displayed under the form.

## Prepare to use this tutorial

You need the following to complete this tutorial. If you already have some of them, you do not need to redo those steps. 

- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/?utm_source=campaign&utm_campaign=vscode-tutorial-appservice-extension&mktingSource=vscode-tutorial-appservice-extension).
- [Visual Studio Code](https://code.visualstudio.com/) installed to your local machine. 
- Visual Studio Code extensions:
    - [Azure Account](https://marketplace.visualstudio.com/items?itemName=ms-vscode.azure-account)
    - [Azure App Service extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azureappservice) for VS Code (installed from within VS Code).
    - [Remote Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
    - [Azure Databases](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-cosmosdb)
- [Node.js and npm](https://nodejs.org/en/download), the Node.js package manager installed to your local machine.
- [Docker](https://docs.docker.com/get-docker/)

## Want to know more? 

Each step of the tutorial includes a **Want to know more?** section. This is _optional information_ to allow you to explore in depth. You can read as you go through the tutorial, or return to the tutorial later. 

Optional Visual Studio Code extensions:
* [MongoDB for VS Code](https://marketplace.visualstudio.com/items?itemName=mongodb.mongodb-vscode)
* [Docker](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-docker)

## Summary

Now that the tools are installed, you can download and run the app. 