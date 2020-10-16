---
title: include file tutorial-03.md
description: include file tutorial-03.md
ms.date: 10/13/2020
ms.topic: include
ms.custom: devx-track-javascript
---

In this section of the tutorial, you create the Azure Storage resource with a Visual Studio extension then configure the resource with Azure CLI commands for file upload. 

## Sign in to Azure

[!INCLUDE [azure-sign-in](../azure-sign-in.md)]

## Create Storage resource 

Use the Visual Studio Code extension to create a Storage resource. 

1. Navigate to the Azure Storage extension. Right-click on the subscription then select `Create Storage Account...`.

    :::image type="content" source="../../media/tutorial-browser-file-upload/visualstudiocode-storage-extension-create-resource.png" alt-text="Navigate to the Azure Storage extension. Right-click on the subscription then select `Create Storage Account...`.":::

1. Follow the prompts using the following table to understand how your values are used.

    |Property|Value|
    |--|--|
    |Enter a globally unique name for the new web app.| Enter a value such as `fileuploadyourname`, for your Storage resource name. Replace `yourname` with your lowercase name or unique ID. This unique name is also used as part of the URL to access the resource in a browser. Use only characters and numbers, up to 24 in length. You need this **account name** to use the Azure CLI scripts later.<br>Each Azure resource resides in an Azure resource group. This is a logical group to help you manage resources. That management can be all resources within a project or team, as an example. This resource is created in a resource group with the same name. |

1. When the app creation process is complete, a notification appears with information about the new resource. 

    :::image type="content" source="../../media/tutorial-browser-file-upload/visualstudiocode-storage-extension-create-resource-complete.png" alt-text="When the app creation process is complete, a notification appears with information about the new resource.":::

1. Right-click on the resource in the Azure Storage extension, select **Copy Primary Key**. You will need this **Storage account key** later.

## Set storage account key in code file

Set the resource name in `src/uploadToBlob.ts` for the storageAccountName value by adding the storage key name into the empty string. Leave the rest of the code as it is. 

```typescript
const storageAccountName = process.env.storageresourcename || ""; 
```

## Generate your shared access signature (SAS) token 

Generate the SAS token before configuring CORS. 

1. Open the [Azure portal](https://ms.portal.azure.com/#blade/HubsExtension/BrowseAll) then select your Storage resource.
1. In the **Settings** section, select **Shared access signature**. 
1. Configure the SAS token as show in the image. The settings are explained below the image. 

    :::image type="content" source="../../media/tutorial-browser-file-upload/azure-portal-storage-blob-generate-sas-token.png" alt-text="Configure the SAS token as show in the image. The settings are explained below the image.":::

    | Property|Value|
    |--|--|
    |Allowed services|Blob|
    |Allowed resource types|Service, Container, Object|
    |Allowed permissions|Read, write, delete, list, add, create|
    |Enable deletions of version|Checked|
    |Start and expiry date/time|Accept the start date/time and set the end date time 24 hours in the future. Your SAS token is only good for 24 hours.|
    |HTTPS only|Selected|
    |Preferred routing tier|Basic|
    |Signing Key|key1 selected|

1.  Select **Generate SAS and connection string**. Immediately copy the SAS token. You won't be able to list this token so if you don't have it copied, you will need to generate a new SAS token. 

> [!CAUTION]
> **SAS Token** value as a string - The value returned from the Azure CLI is returned as a quoted string "value". The value inside the string is your token but when you use it in the Azure CLi or the Azure SDK code, it needs to be in quotes because it contains characters that are not allowed as input unless they are in a string. 
> **SAS Token** value beginning with `?` - Remove the beginning `?`, if it is at the beginning of the token string. The `?` is added in code for you before the string interpolation of the variable, when you create the blob service, so you shouldn't keep in the token string:<br>
```typescript
  // get BlobService
  const blobService = new BlobServiceClient(
    `https://${storageAccountName}.blob.core.windows.net/?${sasToken}`
  );
``` 

## Set SAS token in code file

1. Copy the SAS token into `src/uploadToBlob.ts` for the sasToken value by adding the SAS token into the empty string. Leave the rest of the code as it is. 

```typescript
const sasToken = process.env.storagesastoken || "";
```

## Configure your Azure Storage resource for CORS with Azure CLI

Configure CORS for your resource so the client-side React code can access your storage account. 


1. Open the [Azure portal](https://ms.portal.azure.com/#blade/HubsExtension/BrowseAll) then select your Storage resource.
1. In the **Settings** section, select **CORS**. 
1. Configure CORS as show in the image. The settings are explained below the image. 

    :::image type="content" source="../../media/tutorial-browser-file-upload/azure-portal-storage-blob-cors.png" alt-text="Configure CORS as show in the image. The settings are explained below the image.":::

    | Property|Value|
    |--|--|
    |Allowed origins|`*`|
    |Allowed methods|All except patch.|
    |Allowed headers|`*`|
    |Exposed headers|`*`|
    |Max age|86400|

1. Select **Save** above the settings to save them to the resource.

The code doesn't require any changes to work with these CORS settings. 

## Run project locally to verify connection to Storage account

If you followed these steps, your SAS token and storage account name are set in the `src/uploadToBlob.ts` file, so you are ready to run the application.

1. From the Visual Studio Code terminal, enter the following command:

    ```javascript
    npm start
    ```

1. When the terminal displays the URL, such as `http://localhost:3000`, your app is ready. Open a browser and enter that URL. The website connected to Azure Storage blobs should display with a file selection button and a file upload button. 

    :::image type="content" source="../../media/tutorial-browser-file-upload/browser-react-app-azure-storage-resource-configured-upload-button-displayed.png" alt-text="The React website connected to Azure Storage blobs should display with a file selection button and a file upload button.":::

1. Select an image from the `images` folder to upload. The `spring-flowers.jpg` are a good visual for this test. The select the **Upload!** button. 

    The React front-end client code calls into the `[src/uploadToBlob.ts](https://github.com/Azure-Samples/js-e2e-browser-file-upload-storage-blob/blob/main/src/uploadToBlob.ts)` to authenticate to Azure, then create a Storage Container (if it doesn't already exist), the upload the blob to that container. 

## Want to know more? 

If you want to see your subscription list, use [this link into the Azure portal Subscription list](https://ms.portal.azure.com/#blade/Microsoft_Azure_Billing/SubscriptionsBlade) for your account. 

Other ways to configuration your Storage account include:
* SAS Token with [PowerShell](/azure/powershell/module/azure.storage/new-azurestorageblobsastoken)
* SAS Token with Portal
* CORS with [PowerShell](/azure/powershell/module/azure.storage/set-azurestoragecorsrule)
* CORS with Portal

Learn more about [Shared Access Signatures](/azure/storage/common/storage-sas-overview.md).