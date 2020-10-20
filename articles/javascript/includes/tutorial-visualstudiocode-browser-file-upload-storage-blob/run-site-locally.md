---
ms.topic: include
ms.date: 10/13/2020
ms.custom: devx-track-javascript
title: include file run-site-locally.md
description: include file run-site-locally.md
---

In this section of the tutorial, you download the sample application to your local computer and runs it from the Visual Studio Code terminal. Then you can view the locally running app in your browser.

## Clone and run the initial React app

The initial React app is provided as a starting point. In this procedure, clone the app, install the dependencies and run the app. The initial app tries to connect to Azure Storage if it is configured in the code or an message saying `Storage is not configured` if it isn't available. 

1. Fork the [GitHub repo](https://github.com/Azure-Samples/js-e2e-browser-file-upload-storage-blob), then clone it to your local computer. 

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
    http://localhost:3000/
    ```

    If you see the simple web app in your browser with the text that the Storage isn't configured, you have succeeded with this section of the tutorial.

    :::image type="content" source="../../media/tutorial-browser-file-upload/browser-react-app-no-azure-storage-resource-configured.png" alt-text="Simple Node.js app connected to MongoDB database.":::


