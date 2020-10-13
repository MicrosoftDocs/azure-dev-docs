---
title: include file tutorial-azure-web-app-mongodb-02.md
description: include file tutorial-azure-web-app-mongodb-02.md
ms.date: 10/13/2020
ms.topic: include
ms.custom: devx-track-javascript
---

In this section of the tutorial, you download the sample application to your local computer and runs it from the Visual Studio Code terminal. Then you can view the locally running app in your browser. 

## Download and run the initial Express.js app

The initial Express.js web app is provided as a starting point. In this procedure, download the app, install the dependencies and run the app. The initial app tries to connect to a database if it is available. If it isn't available, the website still responds successfully to a request. 

1. [Download the zipped GitHub repo](https://github.com/Azure-Samples/js-e2e-express-mongo.git) to your local computer then expand to a folder. 
1. Open the folder with Visual Studio Code. You can either right-click on the folder and select **Open with Code** or use the CLI equivalent when inside the folder:

    ```console
    code .
    ```

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

    :::image type="content" source="../media/tutorial-end-to-end-app-cosmos/nodejs-app-connected-mongodb-form.png" alt-text="Simple Node.js app connected to MongoDB database.":::