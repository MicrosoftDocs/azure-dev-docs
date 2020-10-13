---
ms.topic: include
ms.date: 10/13/2020
ms.custom: devx-track-javascript
---

In this section of the tutorial, create an Azure Storage resource. Images are typically stored in Azure Storage as blobs in your resource. 


## Sign in to Azure

[!INCLUDE [azure-sign-in](../includes/azure-sign-in.md)]

## Create storage resource

Use the **Azure Storage** extension for Visual Studio Code to create a resource.

1. Navigate to the Azure explorer. Right-click on the subscription then select `Create storage account...`.

    :::image type="content" source="../media/tutorial-browser-file-upload/visualstudiocode-storage-extension-create-resource.png" alt-text="Partial screenshot of Visual Studio Code using Azure App service extension to create a web app.":::

1. Follow the prompts using the following table to understand how your values are used.

    |Property|Value|
    |--|--|
    |Enter a globally unique name for the new web app.| Enter a value such as `fileuploadYOURNAME`, for your Storage resource. Replace `<YOURNAME>` with your name or unique ID. This unique name is also used as part of the URL to access the resource in a browser. Do not use anything except letters and numbers.|

1. When the storage creation process is complete, a status message appears at the bottom right-corner of Visual Studio Code with information about the resource.

    :::image type="content" source="../media/tutorial-browser-file-upload/visualstudiocode-storage-extension-create-resource-complete.png" alt-text="Partial screenshot of Visual Studio Code, using Azure App service extension to deploy web app immediately after creating web app.":::

## Want to know more?

The initial web service is configured to run on port 8080 and is publicly available. These types of web site settings are configurable.
* [App settings](/app-service/configure-common)
* [Authentication](/app-service/configure-authentication-provider-microsoft)
* [Restrict access by network](/azure/app-service/app-service-ip-restrictions)

When using this App service extension to deploy your web site to the Azure cloud, you may want to know more about how to [configure that deployment](https://github.com/microsoft/vscode-azureappservice/wiki/Configuring-Zip-Deployment#additional-zip-deploy-configuration-settings)