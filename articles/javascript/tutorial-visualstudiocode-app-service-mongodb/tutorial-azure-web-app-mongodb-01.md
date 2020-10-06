---
title: Use MongoDB (Cosmos DB) in Node.js app deployed to Azure App Service from Visual Studio Code
description: In this tutorial, add web server which connects to a MongoDB. Deploy the Node.js application to Azure App Service (on Linux or Windows) using the App Service extension.
ms.topic: tutorial
ms.date: 09/22/2020
ms.custom: devx-track-javascript
---

This section of the tutorial brings down the sample application to your local machine and runs it from the Visual Studio Code terminal. Then you can view the locally running app in your browser. 

## Download and run the initial Express.js app

The initial Express.js web app is provided as a starting point. In this procedure, download the app, install the dependencies and run the app.

The initial app tries to connect to a database if it is available. If it isn't available, the website still responds successfully to a request. 

1. [Download the zipped GitHub repo]() (TBD-new GitHub repo) to a local folder then expand to a folder. 
1. Open the folder with Visual Studio Code.
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
