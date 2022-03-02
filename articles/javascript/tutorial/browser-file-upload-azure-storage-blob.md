---
title: Upload image to Blob Storage with VSCode - App Service/Cosmos DB
description: Use a React/TypeScript app to upload a file to Azure Storage blobs. This tutorial focuses on using local and remote environments with Visual Studio Code extensions.
ms.topic: how-to
ms.date: 09/16/2021
ms.custom: scenarios:getting-started, languages:JavaScript, devx-track-js, azure-sdk-storage-blob-typescript-version-12.2.1
---

# Upload an image to an Azure Storage blob

Use a client-side React app to upload an image file to an Azure Storage blob using an Azure Storage [@azure/storage-blob](https://www.npmjs.com/package/@azure/storage-blob) npm package. 

The TypeScript programming work is done for you, this tutorial focuses on using the local and remote Azure environments successfully from inside Visual Studio Code with Azure extensions.

* [**Sample code**](https://github.com/Azure-Samples/js-e2e-browser-file-upload-storage-blob)
* [Azure Blob Storage reference documentation](/javascript/api/overview/azure/storage-blob-readme?view=azure-node-latest)

## Application architecture and functionality

This article includes several top Azure tasks for JavaScript developers:

* Run a React/TypeScript app locally with Visual Studio Code
* Create an **Azure Storage Blob** resource and configure for file uploads
    * Configure CORS
    * Create Shared access signatures (SAS) token
* Configure code for Azure SDK client library to use SAS token to authenticate to service

The sample React app, [available on GitHub](https://github.com/Azure-Samples/js-e2e-browser-file-upload-storage-blob), consists of the following elements:

* **[React app](https://github.com/Azure-Samples/js-e2e-browser-file-upload-storage-blob/blob/main/src/App.tsx)** hosted on port 3000
* **[Azure SDK client library script](https://github.com/Azure-Samples/js-e2e-browser-file-upload-storage-blob/blob/main/src/azure-storage-blob.ts)** to upload to Storage blobs

:::image type="content" source="../media/tutorial-browser-file-upload/browser-react-app-azure-storage-resource-image-uploaded-displayed.png" alt-text="Simple React app connected to Azure Storage blobs.":::

## 1. Set up development environment

- An Azure user account with an active subscription. [Create one for free](https://azure.microsoft.com/free/).
- [Node.js LTS with NPM](https://nodejs.org/en/download), the Node.js package manager installed to your local machine.
- [Visual Studio Code](https://code.visualstudio.com/) installed to your local machine. 
- Visual Studio Code extensions:
    - [Azure Resource](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azureresourcegroups)
    - [Azure Storage](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurestorage) - used to view Storage resource
    - [Azure Static Web Apps](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurestaticwebapps) - used to create and deploy the React app to Azure

## 2. Fork and clone the sample application

1. Open this GitHub sample URL in a web browser: 

    ```
    https://github.com/Azure-Samples/js-e2e-browser-file-upload-storage-blob
    ```
1. Select **Fork** to create your own fork of this sample project. Your own GitHub fork is necessary to deploy this sample to Azure as a static web app.
1. Select the **Code** button, then copy the Clone URL.
1. In a bash terminal, clone your forked repository, replacing `REPLACE-WITH-YOUR-ACCOUNT-NAME` with your GitHub account name:

    ```bash
    git clone https://github.com/REPLACE-WITH-YOUR-ACCOUNT-NAME/js-e2e-browser-file-upload-storage-blob

1. Change into the new directory and open Visual Studio Code.

    ```bash
    cd js-e2e-browser-file-upload-storage-blob && code .
    ```

## 3. Install dependencies and run local project

1. In Visual Studio Code, open an integrated bash terminal, <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>`</kbd>, and run the following command to install the sample's dependencies.

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

1. Stop the code with <kbd>Ctrl</kbd> + <kbd>C</kbd> in the Visual Studio Code terminal.

<a name="3-create-storage-resource-with-visual-studio-extension"></a>

## 4. Create Storage resource with Visual Studio extension

1. Navigate to the Azure Storage extension. Right-click on the subscription then select `Create Storage Account...`.

    :::image type="content" source="../media/tutorial-browser-file-upload/visualstudiocode-storage-extension-create-resource.png" alt-text="Navigate to the Azure Storage extension. Right-click on the subscription then select `Create Storage Account...`.":::

1. Follow the prompts using the following table to understand how to create your Storage resource.

    |Property|Value|
    |--|--|
    |Enter a globally unique name for the new web app.| Enter a value such as `fileuploaddemo`, for your Storage resource name.<br><br> This unique name is **your resource name** used in the next section. Use only characters and numbers, up to 24 in length. You need this **account name** to use later.|

1. When the app creation process is complete, a notification appears with information about the new resource. 

    :::image type="content" source="../media/tutorial-browser-file-upload/visualstudiocode-storage-extension-create-resource-complete.png" alt-text="When the app creation process is complete, a notification appears with information about the new resource.":::

## 5. Generate your shared access signature (SAS) token 

Generate the SAS token before configuring CORS. 

1. In the Visual Studio Code extension for Storage, right-click the resource then select **Open in Portal**. This opens the Azure portal to your exact Storage resource.
1. In the **Security + networking** section, select **Shared access signature**. 
1. Configure the SAS token with the following settings. 

    | Property|Value|
    |--|--|
    |Allowed services|Blob|
    |Allowed resource types|Service, Container, Object|
    |Allowed permissions|Read, write, delete, list, add, create|
    |Blob versioning permissions|Checked|
    |Allow blob index permissions|Read/Write and Filter should be checked|
    |Start and expiry date/time|Accept the start date/time and **set the end date time 24 hours in the future**. Your SAS token is only good for 24 hours.|
    |HTTPS only|Selected|
    |Preferred routing tier|Basic|
    |Signing Key|key1 selected|

    :::image type="content" source="../media/tutorial-browser-file-upload/azure-portal-storage-blob-generate-sas-token.png" alt-text="Configure the SAS token as show in the image. The settings are explained below the image.":::

1. Select **Generate SAS and connection string**. 
1. Immediately copy the SAS token. You won't be able to list this token so if you don't have it copied, you will need to generate a new SAS token. 

<a name="set-sas-token-in-code-file"></a>

## 6. Set Storage values in .env file

The SAS token is used when queries are made to your cloud-based resource.
1. Create a file name `.env` at the root of the project.
1. Add two required variables with their storage values:

    ```text
    REACT_APP_STORAGESASTOKEN=
    REACT_APP_STORAGERESOURCENAME=
    ```

    React builds the static files with these variables.

1. If the token begins with a question mark, remove the `?`. The code file provides the `?` for you so you don't need it in the token.

<a name="6-configure-cors-for-azure-storage-resource"></a>

## 7. Configure CORS for Azure Storage resource

Configure CORS for your resource so the client-side React code can access your storage account. 

1. While still in the Azure portals, in the Settings section, select **Resource sharing (CORS)**. 
1. Configure the Blob service CORS as show in the image. The settings are explained below the image. 

    | Property|Value|
    |--|--|
    |Allowed origins|`*`|
    |Allowed methods|All except patch.|
    |Allowed headers|`*`|
    |Exposed headers|`*`|
    |Max age|86400|

    :::image type="content" source="../media/tutorial-browser-file-upload/azure-portal-storage-blob-cors.png" alt-text="Configure CORS as show in the image. The settings are explained below the image.":::

1. Select **Save** above the settings to save them to the resource. The code doesn't require any changes to work with these CORS settings. 

## 8. Run project locally to verify connection to Storage account

Your SAS token and storage account name are set in the `src/azure-storage-blob.ts` file, so you are ready to run the application.

1. If the app isn't running, start it again:

    ```javascript
    npm start
    ```

1. Open the following URL in a browser:

    `http://localhost:3000` 

    :::image type="content" source="../media/tutorial-browser-file-upload/browser-react-app-azure-storage-resource-configured-upload-button-displayed.png" alt-text="The React website connected to Azure Storage blobs should display with a file selection button and a file upload button.":::

1. Select an image from the `images` folder to upload then select the **Upload!** button. 

1. The React front-end client code calls into the [./src/azure-storage-blob.ts](https://github.com/Azure-Samples/js-e2e-browser-file-upload-storage-blob/blob/main/src/azure-storage-blob.ts) to authenticate to Azure, then create a Storage Container (if it doesn't already exist), then uploads the file to that container. 

## 9. Deploy static web app to Azure 

1. In Visual Studio Code, select the Azure explorer.
1. If you see a pop-up window asking you to commit your changes, don't do this. The sample should be ready to deploy without changes.

    To roll back the changes, in Visual Studio Code, select the **Source Control** icon in the activity bar. Then select each changed file in the **Changes** list, and select the **Discard changes** icon.

1. Right-click on the subscription name, and then select **Create Static Web App (Advanced)**.    

1. Follow the prompts to provide the following information:

    |Prompt|Enter|
    |--|--|
    |*Enter the name for the new static web app.*|Create a unique name for your resource. For example, you can prepend your name to the repository name, such as `upload-file-to-storage`. |
    |*Select a resource group for new resources.*|Use the resource group that you created for your storage resource.|
    |*Select a SKU*| Select the free SKU for this tutorial. If you already have a free Static Web App resource used, select the next pricing tier.|
    |*Choose build preset to configure default project structure.*|Select **React**.|
    |*Select the location of your application code*|`/` - This indicates the package.json file is at the root of the repository.|
    |*Select the location of your Azure Functions code*|Accept the default value. While this sample doesn't use an API, you can add one later.|
    |*Enter the path of your build output...*|`build`<br><br>This is the path from your app to your static (generated) files.|
    |*Select a location for new resources.*|Select a region close to you.|

1. When the process is complete, a notification pop-up displays. Select **View/Edit Workflow**.

    :::image type="content" source="../media/tutorial-browser-file-upload/visual-studio-code-static-web-app-view-edit-workflow.png" alt-text="Partial screenshot of Visual Studio Code notification pop-up with View/Edit Workflow button highlighted.":::

## 10. Add Azure Storage secrets to GitHub secrets

1. In a web browser, return to your GitHub fork of the sample project to add the two secrets and their values:

    ```HTTP
    https://github.com/YOUR-GITHUB-ACCOUNT/js-e2e-browser-file-upload-storage-blob/settings/secrets/actions
    ```

    :::image type="content" source="../media/tutorial-browser-file-upload/github-fork-settings-secret-new-repository-secret.png" alt-text="Screenshot of a web browser displaying https://github.com, on the Settings -> Secrets page, with the New repository secret button highlighted.":::

## 11. Configure static web app to connect to storage resource

Edit the GitHub workflow and secrets to connect to Azure Storage.

1. In Visual Studio Code, open the `.github/workflows` workflow YAML file and add the two storage environment variables after the `with` section to the `build_and_deploy_job`.

    :::code language="YAML" source="~/../js-e2e-browser-file-upload-storage-blob/build-and-deploy-sample-job.yml" highlight="23-25":::

    This pulls in the secrets to the build process.

1. In Visual Studio Code, select Source Control, <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>G</kbd>, then select the addition icon to add the changed *.yml file. 
1. Enter a comment for your commit such as `Adding Storage secrets`.
1. Push to your GitHub fork by selecting the **Synchronize changes** icon on the status bar. 

    :::image type="content" source="../media/tutorial-browser-file-upload/visual-studio-code-status-bar-synchronize-changes.png" alt-text="Partial screenshot of Visual Studio Code status bar.":::

1. In the pop-up window to confirm if you want to push and pull from your remote repository, select **OK**.

    If you get an error at this step, checkout your git remote to make sure you cloned _your fork_: `git remote -v`. 

1. This push triggers a new build and deploy for your static web app.

## 12. Verify build and deploy job completes

1. In a web browser, return to your GitHub fork of the sample project.
1. Select **Actions**, then select the **Azure Static Web Apps CI/CD** action. 
1. Select the Build and Deploy Job to watch the process complete.

    :::image type="content" source="../media/tutorial-browser-file-upload/github-action-build-and-deploy-job-success.png" alt-text="Screenshot of web browser showing GitHub action success":::

## 13. Use the Azure-deployed static web app

1. In Visual Studio Code, right-click your Static web app from the Azure explorer and select 

    :::image type="content" source="../media/tutorial-browser-file-upload/visual-studio-code-browse-site.png" alt-text="Partial screenshot selecting Browse Site from the Azure Static web site.":::

1. In the new web browser window, choose a file and upload the file. 

## Troubleshoot local connection to Storage account

If you received an error or your file doesn't upload to the container, check the following:

* Recreate your SAS token, making sure that your token is created at the Storage resource level and not the container level. Copy the new token into the code at the correct location.
* Check that the token string you copied into the code doesn't contain the `?` (question mark) at the beginning of the string.
* Verify your CORS setting for your Storage resource.

## Upload button functionality

The `src/App.tsx` TypeScript file is provided as part of that app creation with create-react-app. The file has been modified to provide the file selection button and the upload button and the supporting code to provide that functionality. 

The code connecting to the Azure Blob Storage code is highlighted. The call to `uploadFileToBlob` returns all blobs (files) in the container as a flat list. That list is displayed with the `DisplayImagesFromContainer` function.

:::code language="typescript" source="~/../js-e2e-browser-file-upload-storage-blob/src/App.tsx" highlight="5,25":::

## Upload file to Azure Storage blob with Azure SDK client library

The code to upload the file to the Azure Storage is framework-agnostic. As the code is built for a tutorial, choices were made for simplicity and comprehension. These choices are explained; you should review your own project for intentional use, security, and efficiency. 

The sample creates and uses a publicly accessible container and files. If you want to secure your files in your own project, you have many layers where you can control that from requiring overall authentication to your resource to very specific permissions on each blob object. 

### Dependencies and variables

The [azure-storage-blob.ts](https://github.com/Azure-Samples/js-e2e-browser-file-upload-storage-blob/blob/main/src/azure-storage-blob.ts) TypeScript file loads the dependencies, and pulls in the required variables by either environment variables or hard-coded strings.

| Variable | Description |
|--|--|
|`sasToken`|The SAS token created with the Azure portal is prepended with a `?`. Remove it before setting it in your `sasToken` variable.| 
|`container`|The name of the container in Blob storage. You can think of this as equivalent to a folder or directory for a file system.|
|`storageAccountName`|Your resource name.|

:::code language="typescript" source="~/../js-e2e-browser-file-upload-storage-blob/src/azure-storage-blob.ts" highlight="2,5,6" id="snippet_package":::

### Create Storage client and manage steps

The `uploadFileToBlob` function is the main function of the file. It creates the client object for the Storage service, then creates the client to the container object, uploads the file, then gets a list of all the blobs in the container.

:::code language="typescript" source="~/../js-e2e-browser-file-upload-storage-blob/src/azure-storage-blob.ts" highlight="5-7," id="snippet_uploadFileToBlob":::

### Upload file to blob

The `createBlobInContainer` function uploads the file to the container, using the [BlockBlobClient](/javascript/api/@azure/storage-blob/blockblobclient) class, [uploadData](/javascript/api/@azure/storage-blob/blockblobclient#uploadData_Buffer___Blob___ArrayBuffer___ArrayBufferView__BlockBlobParallelUploadOptions_) method. The content type must be sent with the request if you intend to use browser functionality, which depends on the file type, such as displaying a picture. 

:::code language="typescript" source="~/../js-e2e-browser-file-upload-storage-blob/src/azure-storage-blob.ts" highlight="10" id="snippet_createBlobInContainer":::

### Get list of blobs

The `getBlobsInContainer` function gets a list of URLs, using the [ContainerClient](/javascript/api/@azure/storage-blob/containerclient) class, [listBlobsFlat](/javascript/api/@azure/storage-blob/containerclient#listBlobsFlat_ContainerListBlobsOptions_) method, for the blobs in the container. The URLs are constructed to be used as the `src` of an image display in HTML: `<img src={item} alt={item} height="200" />`. 

:::code language="typescript" source="~/../js-e2e-browser-file-upload-storage-blob/src/azure-storage-blob.ts" highlight="10" id="snippet_getBlobsInContainer":::

## Clean up resources

In Visual Studio Code, use the Azure explorer for Resource Groups, right-click on the your resource group then select **Delete**.

This deletes all resources in the group, including your Storage and Static Web app resources.

## Next steps

If you would like to continue with this app, learn how to deploy the app to Azure for hosting with one of the following choices:

* [Upload as a static web app](/azure/static-web-apps/getting-started?tabs=vanilla-javascript)
* Upload to a web app resource using the [Visual Studio code extension for the App service](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azureappservice)
* [Upload an app to an Azure VM](nodejs-virtual-machine-vm/introduction.md)
* Azure Blob Storage [documentation](/azure/storage/blobs/storage-blobs-introduction)
* @azure/storage-blob
    * [NPM package](https://www.npmjs.com/package/@azure/storage-blob)
    * [Reference documentation](/javascript/api/@azure/storage-blob/)
* [Azure Static Web app](/azure/static-web-apps/)
