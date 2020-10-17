---
title: include file create-storage-resource.md
description: include file create-storage-resource.md
ms.date: 10/13/2020
ms.topic: include
ms.custom: devx-track-javascript
---

In this section of the tutorial, you create the Azure Storage resource with a Visual Studio extension then configure the resource with Azure CLI commands for file upload. 

## Sign in to Azure

[!INCLUDE [azure-sign-in](azure-sign-in.md)]

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

## Set SAS token in code file

The SAS token value is a partial query string and is used in the URL when queries are made to your cloud-based resource.

The token format depends are which tool you used to create it: 
* **Azure portal**: If you create your SAS token in the portal, the token includes the `?` as the first character of the string.
* **Azure CLI**: If you create your SAS token with the Azure CLI, the value returned doesn't include the `?` as the first character of the string. 

1. Remove the `?`, if it is the first character of the token. The code file provides the `?` for you so you don't need it in the token.

1. Set the SAS token into `src/uploadToBlob.ts` for the sasToken value by adding the SAS token into the empty string. Leave the rest of the code as it is. 

```typescript
// remove `?` if it is first character of token
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

1. Select **Save** above the settings to save them to the resource. The code doesn't require any changes to work with these CORS settings. 

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