---
title: Use MongoDB (Cosmos DB) in Node.js app deployed to Azure App Service from Visual Studio Code
description:
ms.topic: tutorial
ms.date: 09/22/2020
ms.custom: devx-track-javascript
---

# Use MongoDB (Cosmos DB) in Node.js app deployed to Azure App Service from Visual Studio Code

In this tutorial, you create an ExpressJS web server which connects to a MongoDB. Deploy the Node.js application to Azure App Service (on Linux or Windows) using the [App Service extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azureappservice).

<!--

## Walkthrough video

Watch this video for a complete walkthrough of the content in this article.

> [!VIDEO https://channel9.msdn.com/Shows/Docs-Azure/Deploy-to-Azure-App-Service-using-Visual-Studio-Code/player]

-->

## Create a web app connected to mongoDB

 conceptual explanation of architecture and high level steps

## Prerequisites

- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/?utm_source=campaign&utm_campaign=vscode-tutorial-appservice-extension&mktingSource=vscode-tutorial-appservice-extension).
- [Visual Studio Code](https://code.visualstudio.com/).
- The [Azure App Service extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azureappservice) for VS Code (installed from within VS Code).
- [Node.js and npm](https://nodejs.org/en/download), the Node.js package manager.

> <a class="tutorial-install-extension-btn" href="https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azureappservice">Install the Azure App Service extension</a>

[!INCLUDE [In VSCode, use Azure icon to sign into Azure](includes/vscode/extension-sign-in-azure.md)]

> [!div class="nextstepaction"]
> [I installed the Azure extension](tutorial-vscode-azure-app-service-node-02.md) [I ran into an issue](#troubleshooting-tasks-in-tutorial)

## Download sample GitHub repository

Download sample repo, run, and deploy

Git clone

Npm install

Npm run

at this point customer has a running local project with no use of Azure – customer should feel comfortable at this point

Caveats customer needs to know

Default port 8080

How to change default port

Default app is anon access – open to all

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