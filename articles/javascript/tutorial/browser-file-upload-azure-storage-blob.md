---
title: Upload image to Blob Storage with VSCode - App Service/CosmosDB
description: Use a React app to upload a file to Azure Storage blobs. This tutorial focuses on using local and remote environments with Visual Studio Code extensions.
ms.topic: tutorial
ms.date: 11/13/2020
ms.custom: scenarios:getting-started, languages:JavaScript, devx-track-javascript, azure-sdk-storage-blob-typescript-version-12.2.1
---

# Upload an image to an Azure Storage blob

Use a client-side React app to upload an image file to an Azure Storage blob using an Azure Storage npm package. 

The programming work is done for you, this tutorial focuses on using the local and remote Azure environments successfully from inside Visual Studio Code with Azure extensions.

* [Source code](https://github.com/Azure-Samples/js-e2e-browser-file-upload-storage-blob)

## Application architecture and functionality

This tutorial includes several **top Azure tasks** for JavaScript developers:

* Run a React app locally with Visual Studio Code
* Create a Storage resource and configure for file uploads
    * Configure CORS
    * Create Shared access signatures (SAS) token
* Configure code for Azure SDK client library to use SAS token to authenticate to service

The sample React app, [available on GitHub](https://github.com/Azure-Samples/js-e2e-browser-file-upload-storage-blob), consists of the following elements:

* **React app** hosted on port 3000
* Azure SDK client library script to upload to Storage blobs

:::image type="content" source="../media/tutorial-browser-file-upload/browser-react-app-azure-storage-resource-image-uploaded-displayed.png" alt-text="Simple React app connected to Azure Storage blobs.":::

## 1. Set up development environment

- An Azure user account with an active subscription. [Create one for free](https://azure.microsoft.com/free/).
- [Node.js and npm](https://nodejs.org/en/download), the Node.js package manager installed to your local machine.
- [Visual Studio Code](https://code.visualstudio.com/) installed to your local machine. 
- Visual Studio Code extensions:
    - [Azure Storage](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurestorage) - used to view Storage resource

## 2. Clone and run the initial React app

Clone the app, install the dependencies and run the app. The initial app tries to connect to Azure Storage if it is configured in the code or an message saying `Storage is not configured` if it isn't available. 

1. Open Visual Studio Code.
1. Clone the GitHub repo by selecting the Git icon then selecting **Clone Repository**. This process requires you to login to GitHub. Use the repository URL of `https://github.com/Azure-Samples/js-e2e-browser-file-upload-storage-blob`, then select a folder on your local computer to clone the sample to. When prompted, open the cloned repository. 

    :::image type="content" source="../media/tutorial-browser-file-upload/vscode-git-clone-repository.png" alt-text="Clone the GitHub repo by selecting the Git icon then selecting `Clone Repository`.":::

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

    :::image type="content" source="../media/tutorial-browser-file-upload/browser-react-app-no-azure-storage-resource-configured.png" alt-text="Simple Node.js app connected to MongoDB database.":::

1. Stop the code with Control+C in the Visual Studio Code terminal.

## 3. Create Storage resource with Visual Studio extension

1. Navigate to the Azure Storage extension. Right-click on the subscription then select `Create Storage Account...`.

    :::image type="content" source="../media/tutorial-browser-file-upload/visualstudiocode-storage-extension-create-resource.png" alt-text="Navigate to the Azure Storage extension. Right-click on the subscription then select `Create Storage Account...`.":::

1. Follow the prompts using the following table to understand how your values are used.

    |Property|Value|
    |--|--|
    |Enter a globally unique name for the new web app.| Enter a value such as `fileuploadyourname`, for your Storage resource name. Replace `yourname` with your lowercase name or unique ID. This unique name is also used as part of the URL to access the resource in a browser. Use only characters and numbers, up to 24 in length. You need this **account name** to use later.|

1. When the app creation process is complete, a notification appears with information about the new resource. 

    :::image type="content" source="../media/tutorial-browser-file-upload/visualstudiocode-storage-extension-create-resource-complete.png" alt-text="When the app creation process is complete, a notification appears with information about the new resource.":::

## 4. Set storage account name in code file

Set the resource name in `src/uploadToBlob.ts` for the `storageAccountName` value by adding the storage key name into the empty string. Leave the rest of the code as it is. 

```typescript
const storageAccountName = process.env.storageresourcename || ""; 
```

## 5. Generate your shared access signature (SAS) token 

Generate the SAS token before configuring CORS. 

1. In the Visual Studio Code extension for Storage, right-click the resource then select **Open in Portal**. This opens the Azure portal to your exact Storage resource.
1. In the **Settings** section, select **Shared access signature**. 
1. Configure the SAS token with the following settings. 

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

    :::image type="content" source="../media/tutorial-browser-file-upload/azure-portal-storage-blob-generate-sas-token.png" alt-text="Configure the SAS token as show in the image. The settings are explained below the image.":::

1. Select **Generate SAS and connection string**. Immediately copy the SAS token. You won't be able to list this token so if you don't have it copied, you will need to generate a new SAS token. 

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

## 6. Configure CORS for Azure Storage resource

Configure CORS for your resource so the client-side React code can access your storage account. 

1. While still in the Azure portals, in the Settings section, select **CORS**. 
1. Configure CORS as show in the image. The settings are explained below the image. 

    | Property|Value|
    |--|--|
    |Allowed origins|`*`|
    |Allowed methods|All except patch.|
    |Allowed headers|`*`|
    |Exposed headers|`*`|
    |Max age|86400|

    :::image type="content" source="../media/tutorial-browser-file-upload/azure-portal-storage-blob-cors.png" alt-text="Configure CORS as show in the image. The settings are explained below the image.":::

1. Select **Save** above the settings to save them to the resource. The code doesn't require any changes to work with these CORS settings. 

## 7. Run project locally to verify connection to Storage account

Your SAS token and storage account name are set in the `src/uploadToBlob.ts` file, so you are ready to run the application.

1. From the Visual Studio Code terminal, enter the following command:

    ```javascript
    npm start
    ```

1. When the terminal displays the URL, such as `http://localhost:3000`, your app is ready. Open a browser and enter that URL. The website connected to Azure Storage blobs should display with a file selection button and a file upload button. 

    :::image type="content" source="../media/tutorial-browser-file-upload/browser-react-app-azure-storage-resource-configured-upload-button-displayed.png" alt-text="The React website connected to Azure Storage blobs should display with a file selection button and a file upload button.":::

1. Select an image from the `images` folder to upload. The `spring-flowers.jpg` are a good visual for this test. The select the **Upload!** button. 

    The React front-end client code calls into the `src/uploadToBlob.ts` to authenticate to Azure, then create a Storage Container (if it doesn't already exist), then uploads the file to that container. 

## Troubleshoot local connection to Storage account

If you received an error or your file doesn't upload to the container, check the following:

* Recreate your SAS token, making sure that your token is created at the Storage resource level and not the container level. Copy the new token into the code at the correct location.
* Check that the token string you copied into the code doesn't contain the `?` (question mark) at the beginning of the string.
* Verify your CORS setting for your Storage resource.

## Upload button functionality

The `src/app` file is provided as part of that app creation with create-react-app. The file has been modified to provide the file selection button and the upload button and the supporting code to provide that functionality. 

The code connecting to the Azure blob storage code is highlighted. The call to `uploadFileToBlob` returns all blobs (files) in the container as a flat list. That list is displayed with the `DisplayImagesFromContainer` function.

:::code language="typescript" source="~/../js-e2e-browser-file-upload-storage-blob/src/App.tsx" highlight="3,28":::

## Upload file to Azure Storage blob with Azure SDK client library

The code to upload the file to the Azure Storage is framework-agnostic. As the code is built for a tutorial, choices were made for simplicity and comprehension. These choices are explained; you should review your own project for intentional use, security, and efficiency. 

The sample creates and uses a publicly accessible container and files. If you want to secure your files in your own project, you have many layers where you can control that from requiring overall authentication to your resource to very specific permissions on each blob object. 

### Dependencies and variables

The `uploadToBlob.ts` file loads the dependencies, and pulls in the required variables by either environment variables or hard-coded strings.

| Variable | Description |
|--|--|
|`sasToken`|The SAS token created with the Azure portal is prepended with a `?`. Remove it before setting it in your `sasToken` variable.| 
|`container`|The name of the container in Blob storage. You can think of this as equivalent to a folder or directory for a file system.|
|`storageAccountName`|Your resource name.|

:::code language="typescript" source="~/../js-e2e-browser-file-upload-storage-blob/src/uploadToBlob.ts" highlight="2,5,16" id="snippet_package":::

### Security for Azure credentials

In your own project, consider where to store secrets such as a SAS token. If your application requires you to secure your Azure information, consider hosting this storage code in an [Azure Function](/azure/azure-functions/) instead of on the client, then call the Azure Function from the react app.  

### Create Storage client and manage steps

The `uploadFileToBlob` function is the main function of the file. It creates the client object for the Storage service, then creates the client to the container object, uploads the file, then gets a list of all the blobs in the container. 

:::code language="typescript" source="~/../js-e2e-browser-file-upload-storage-blob/src/uploadToBlob.ts" highlight="5,6,7" id="snippet_uploadFileToBlob":::

### Upload file to blob

The `createBlobInContainer` function uploads the file to the container with the `uploadBrowserData` client library method. The content type must be sent with the request if you intend to use browser functionality, which depends on the file type, such as displaying a picture. 

:::code language="typescript" source="~/../js-e2e-browser-file-upload-storage-blob/src/uploadToBlob.ts" highlight="10" id="snippet_createBlobInContainer":::

### Get list of blobs

The `getBlobsInContainer` function gets a list of URLs for the blobs in the container. The URLs are constructed to be used as the `src` of an image display in HTML: `<img src={item} alt={item} height="200" />`. 

:::code language="typescript" source="~/../js-e2e-browser-file-upload-storage-blob/src/uploadToBlob.ts" highlight="10" id="snippet_getBlobsInContainer":::

## Clean up resources

In Visual Studio Code, use the Azure explorer for Storage, right-click on the resource then select **Delete Storage Account...**.

## Next steps

If you would like to continue with this app, learn how to deploy the app to Azure for hosting with one of the following choices:

* [Upload as a static web app](/azure/static-web-apps/getting-started?tabs=vanilla-javascript)
* Upload to a web app resource using the [Visual Studio code extension for the App service](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azureappservice)
* [Upload an app to an Azure VM](nodejs-virtual-machine-vm/introduction.md)