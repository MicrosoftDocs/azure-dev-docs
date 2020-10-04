---
title: Use MongoDB (Cosmos DB) in Node.js app deployed to Azure App Service from Visual Studio Code
description: In this tutorial, add web server which connects to a MongoDB. Deploy the Node.js application to Azure App Service (on Linux or Windows) using the App Service extension.
ms.topic: tutorial
ms.date: 09/22/2020
ms.custom: devx-track-javascript
---

## Sign in to Azure

[!INCLUDE [azure-sign-in](../includes/azure-sign-in.md)]

## Download and run the initial Express.js app

The initial Express.js web app is provided as a starting point. In this procedure, download the app, install the dependencies and run the app.

The initial app tries to connect to a database if it is available. If it isn't available, the website still responds successfully to a request. Later in the tutorial, we'll add the code to connect to a MongoDB with the native API. 

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
    http://localhost:8080/
    ```

    If you see the simple web app in your browser with the text that the database isn't found, you have succeeded with this section of the tutorial.

    > [!CAUTION]
    > You may be accustomed to using a different port for your Node.js apps. App service uses 8080 as a default port. After you have successfully run the tutorial on port 8080, use the App service's settings to add the `WEBSITES_PORT` with your typical port value and remember to change the port value in the .env file before redeploying the app.
    > TBD - add link to app service config change 

## Summary

The web app is now running locally. 

TBD - Screenshot