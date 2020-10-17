---
ms.topic: include
ms.date: 10/13/2020
ms.custom: devx-track-javascript
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

## Want to know more? 

The sample app is made with [create-react-app](https://www.npmjs.com/package/create-react-app) with TypeScript. The structural changes to the boilerplate are in the following files:
*
* [src/App.tsx](https://github.com/Azure-Samples/js-e2e-browser-file-upload-storage-blob/blob/main/src/App.tsx) - this file is the user interface for the app including:
    * Message if Storage isn't configured
    * Form to select and upload file
    * List of current files in Storage container
* [src/uploadToBlob.ts](https://github.com/Azure-Samples/js-e2e-browser-file-upload-storage-blob/blob/main/src/uploadToBlob.ts) - this the all of the code interacting with Azure Storage including:
    * Creating a container if it doesn't exist
    * Uploading a file
    * Get a flat listing of the blobs (files) in the Storage container

These files have not been developed for a production environment. They are only to be used as code that works for a learning experience. When you plan to develop a client application to directly connect to Azure Storage, you need to use cloud-based best practices. For more information, use the following resources: 
* [Azure Architecture Center](https://docs.microsoft.com/azure/architecture/)

When using Azure Storage, the [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/), a separate installable tool is helpful.