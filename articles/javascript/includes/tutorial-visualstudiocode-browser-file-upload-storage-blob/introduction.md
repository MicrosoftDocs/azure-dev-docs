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

* Create a Storage resource
* Configure a Storage resource for file uploads
    * Configure CORS
    * Create Shared access signatures (SAS) token
* Configure Azure SDK client library to use:
    *  Use SAS token to authenticate to service
* Run a React app locally with Visual Studio Code
* Deploy React app to Azure Static web apps

## Sample application

The [sample React app](https://github.com/Azure-Samples/js-e2e-browser-file-upload-storage-blob), available on GitHub, consists of the following elements:

* **React app** hosted on port 3000
* Azure SDK client library script to upload to Storage blobs

:::image type="content" source="../../media/tutorial-browser-file-upload/browser-react-app-azure-storage-resource-image-uploaded-displayed.png" alt-text="Simple React app connected to Azure Storage blobs.":::

The [sample code is explained](tutorial-visualstudiocode-browser-file-upload-feedback?tutorial-step=4) later in the tutorial. 

## Want to know more? 

Each step of the tutorial includes a **Want to know more?** section. This is _optional information_ to allow you to explore in depth. You can read as you go through the tutorial, or return to the tutorial later. 