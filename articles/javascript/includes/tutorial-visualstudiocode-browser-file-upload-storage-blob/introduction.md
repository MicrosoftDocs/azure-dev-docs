---
title: include file tutorial-azure-web-app-mongodb-00.md 
description: include file tutorial-azure-web-app-mongodb-00.md
ms.date: 10/13/2020
ms.topic: include
ms.custom: devx-track-javascript
---

In this tutorial, use a React app to upload a file to an Azure Storage blob. 

The programming work is done for you, this tutorial focuses on using the local and remote Azure environments successfully from inside Visual Studio Code with Azure extensions.

## Top tasks

This tutorial includes several **top Azure tasks** for JavaScript developers:

* Run a React app locally with Visual Studio Code
* Create a Storage resource and configure for file uploads
    * Configure CORS
    * Create Shared access signatures (SAS) token
* Configure code for Azure SDK client library to use SAS token to authenticate to service

## Sample application

The sample React app, [available on GitHub](https://github.com/Azure-Samples/js-e2e-browser-file-upload-storage-blob), consists of the following elements:

* **React app** hosted on port 3000
* Azure SDK client library script to upload to Storage blobs

:::image type="content" source="../../media/tutorial-browser-file-upload/browser-react-app-azure-storage-resource-image-uploaded-displayed.png" alt-text="Simple React app connected to Azure Storage blobs.":::
