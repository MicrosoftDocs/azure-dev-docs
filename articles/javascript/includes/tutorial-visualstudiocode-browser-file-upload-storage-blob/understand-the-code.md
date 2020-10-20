---
ms.topic: include
ms.date: 10/13/2020
ms.custom: devx-track-javascript
title: include file understand-the-code.md
description: include file understand-the-code.md
---
In this section of the tutorial, understand the code in the sample to make the web app upload a file.

## Sample created with create-react-app

The sample is a basic React app created with [create-react-app](https://create-react-app.dev/docs/adding-typescript/) with the TypeScript template.

```typescript
npx create-react-app my-app --template typescript
```

The create-react-app framework is useful to:
* provide file bundling automatically, which is a requirement for using the Azure client libraries in the browser
* provide transpilation and build scripts 

## Upload button functionality

The `src/app` file is provided as part of that app creation with create-react-app. The file has been modified to provide the file selection button and the upload button and the supporting code to provide that functionality. 

The code connecting to the Azure blob storage code is highlighted. The call to `uploadFileToBlob` returns all blobs (files) in the container as a flat list. That list is displayed with the `DisplayImagesFromContainer` function.

:::code language="typescript" source="~/../js-e2e-browser-file-upload-storage-blob/src/App.tsx" highlight="3,28":::

## Upload file to Azure Storage blob with Azure SDK client library

The code to upload the file to the Azure Storage is framework-agnostic. As the code is built for a tutorial, choices were made for simplicity and comprehension. These choices are explained; you should review your own project for intentional use, security, and efficiency. 

The sample creates and uses a publicly accessible container and files. If you want to secure your files in your own project, you have many layers where you can control that from requiring overall authentication to your resource to very specific permissions on each blob object. 

### Dependencies and variables

The `uploadToBlob.ts` loads the dependencies, and pulls in the required variables by either environment variables or hard-coded strings.

| Variable | Description |
|--|--|
|`sasToken`|The SAS token created with the Azure portal is prepended with a `?`. Remove it before setting it in your `sasToken` variable.| 
|`container`|The name of the container in Blob storage. You can think of this as equivalent to a folder or directory for a file system.|
|`storageAccountName`|Your resource name.|

:::code language="typescript" source="~/../js-e2e-browser-file-upload-storage-blob/src/uploadToBlob.ts" highlight="2,5,16" id="snippet_package":::

### Security for Azure credentials

In your own project, consider where to store secrets such as a SAS token. If your application requires you to secure your Azure information, consider hosting this storage code in an Azure Function instead of on the client, then call the Azure Function from the react app.  

### Create Storage client and manage steps

The `uploadFileToBlob` function is the main function of the file. It creates the client object for the Storage service, then creates the client to the container object, uploads the file, then gets a list of all the blobs in the container. 

:::code language="typescript" source="~/../js-e2e-browser-file-upload-storage-blob/src/uploadToBlob.ts" highlight="5,6,7" id="snippet_uploadFileToBlob":::

### Upload file to blob

The `createBlobInContainer` function uploads the file to the container with the `uploadBrowserData` client library method. The content type must be sent with the request if you intend to use browser functionality, which depends on the file type, such as displaying a picture. 

:::code language="typescript" source="~/../js-e2e-browser-file-upload-storage-blob/src/uploadToBlob.ts" highlight="10" id="snippet_createBlobInContainer":::

### Get list of blobs

The `getBlobsInContainer` function gets a list of URLs for the blobs in the container. The URLs are constructed to be used as the `src` of an image display in HTML: `<img src={item} alt={item} height="200" />`. 

:::code language="typescript" source="~/../js-e2e-browser-file-upload-storage-blob/src/uploadToBlob.ts" highlight="10" id="snippet_getBlobsInContainer":::