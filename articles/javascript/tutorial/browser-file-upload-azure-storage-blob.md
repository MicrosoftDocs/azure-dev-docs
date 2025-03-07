---
title: "JavaScript: Upload image to Blob Storage"
titleSuffix: JavaScript on Azure
description: Use a client web app to upload a file to Azure Storage blobs directly using a URL with a SAS token query string. 
ms.topic: how-to
ms.date: 02/14/2025
ms.custom: scenarios:getting-started, languages:JavaScript, devx-track-js, azure-sdk-storage-blob-typescript-version-12.2.1, engagement-fy23
# CustomerIntent: As a JavaScript developer new to Azure, I want learn how to upload a file to Azure Storage in a web app so that know how to browser to do the actual file upload without exposing authentication secrets on the client.'
---

# Upload an image to an Azure Storage blob with JavaScript

Use a static web app to upload files directly to an Azure Storage blob using the @azure/storage-blob package. The API generates a SAS token following the [Valet Key pattern](/azure/architecture/patterns/valet-key), which lets you securely delegate limited access without exposing full credentials.

> [!CAUTION]
> This tutorial shows you how to host your function app in a Consumption Plan. When you plan to secure your connections by using Microsoft Entra ID with managed identities, you should instead consider hosting your app in the [Flex Consumption plan](/azure/azure-functions/flex-consumption-plan). The **Flex Consumption** tier optimizes security by supporting the use of managed identities and virtual network integration.  

## Prerequisites

* An Azure subscription; if you don't already have an Azure subscription, you can sign up for a [free Azure account].
* [GitHub account](https://github.com/join) to fork and push to a repo.

## Application architecture 

This application architecture includes two Azure resources:

* Azure Static Web Apps host both the static client and the linked Azure Functions API, with the service managing the API resource automatically.
* Azure Storage for the blob storage. 

:::image type="content" source="media/browser-file-upload-azure-storage-blob/file-upload-request-flow.png" alt-text="Diagram showing how a customer interacts from their computer to use the website to upload a file to Azure Storage directly.":::

|Step|Description|
|:--|--|
|1|The customer connects to the statically generated website. The website is hosted in [Azure Static Web Apps](/azure/static-web-apps/).|
|2|The customer uses that website, to select a file to upload. For this tutorial, the front-end framework is [Vite React](https://vitejs.dev/guide/) and the file uploaded is an image file.|
|3|The website calls the [Azure Functions](/azure/azure-functions/) API `sas` to get a SAS token based on the exact **filename** of the file to upload. The serverless API uses the Azure Blob Storage SDK to create the SAS token. The API returns the full URL to use to upload the file, which includes the SAS token as the query string.<br>`https://YOUR-STORAGE-NAME.blob.core.windows.net/YOUR-CONTAINER/YOUR-FILE-NAME?YOUR-SAS-TOKEN`|
|4|The front-end website uses the SAS token URL to upload the file directly to [Azure Blob Storage](/azure/storage/blobs/).| 

## Local and build environments

This tutorial uses the following environments:

* Local development with GitHub Codespaces or Visual Studio Code.
* Build and deploy with GitHub Actions.

## Fork sample application repository with GitHub

This tutorial uses GitHub actions to deploy the sample application to Azure. You need a GitHub account and a fork of the sample application repository to complete that deployment. 

1. In a web browser, use the following link to begin the fork for your own account of the sample repository: [Azure-Samples/azure-typescript-e2e-apps](https://github.com/Azure-Samples/azure-typescript-e2e-apps/fork).
1. Complete the steps to fork the sample with the **main** branch only. 

## Configure dev environment

A [development container](https://containers.dev/) environment is available with all dependencies required to complete every exercise in this project. You can run the development container in GitHub Codespaces or locally using Visual Studio Code.

### [GitHub Codespaces](#tab/github-codespaces)

[GitHub Codespaces](https://docs.github.com/codespaces) runs a development container managed by GitHub with [Visual Studio Code for the Web](https://code.visualstudio.com/docs/editor/vscode-web) as the user interface. For the most straightforward development environment, use GitHub Codespaces so that you have the correct developer tools and dependencies preinstalled to complete this training module.

> [!IMPORTANT]
> All GitHub accounts can use Codespaces for up to 60 hours free each month with 2 core instances. For more information, see [GitHub Codespaces monthly included storage and core hours](https://docs.github.com/billing/managing-billing-for-github-codespaces/about-billing-for-github-codespaces#monthly-included-storage-and-core-hours-for-personal-accounts).

1. In a web browser, on your GitHub fork of the sample repository, start the process to create a new GitHub Codespace on the `main` branch of your fork by selecting the **CODE** button.

    :::image type="content" source="media/browser-file-upload-azure-storage-blob/github-codespaces-button.png" alt-text="GitHub screenshot of Codespaces buttons for a repository.":::

1. On the **Codespaces** tab, select the ellipsis, `...`.

    :::image type="content" source="media/browser-file-upload-azure-storage-blob/github-codespaces-select.png" alt-text="GitHub screenshot of Codespaces tab with ellipsis control highlighted.":::

1. Select **+ New with options** to select a specific Codespaces dev container. 

    :::image type="content" source="media/browser-file-upload-azure-storage-blob/github-codespaces-select-new-with-options.png" alt-text="GitHub screenshot of Codespaces New with options menu item highlighted.":::

1. Select the following options then select **Create codespace**.

    * Branch: `main`
    * Dev container configuration: `Tutorial: Upload file to storage with SAS Token`
    * Region: accept default
    * Machine type: accept default

    :::image type="content" source="media/browser-file-upload-azure-storage-blob/github-codespaces-new-with-options.png" alt-text="GitHub screenshot of Codespaces New with options menu with the following dev container highlighted, Tutorial: Upload file to storage with SAS Token.":::

1. Wait for the codespace to start. This startup process can take a few minutes.

1. Open a new terminal in the codespace.

    > [!TIP]
    > You can use the main menu to navigate to the **Terminal** menu option and then select the **New Terminal** option.
    >
    > :::image type="content" source="media/browser-file-upload-azure-storage-blob/open-terminal-option.png" lightbox="media/browser-file-upload-azure-storage-blob/open-terminal-option.png" alt-text="Screenshot of the codespaces menu option to open a new terminal.":::

1. Check the versions of the tools you use in this tutorial.

    ```shell
    node --version
    npm --version
    func --version
    ```

    This tutorial requires the following versions of each tool, which are preinstalled in your environment:
    
    | Tool | Version |
    | --- | --- |
    | Node.js | &ge; 18 |
    | npm | &ge; 9.5 |
    | Azure Functions core tools| &ge; 4.5098|

1. Close the terminal.

1. The remaining steps in this tutorial take place in the context of this development container.

### [Visual Studio Code](#tab/visual-studio-code)

The [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) for Visual Studio Code requires [Docker](https://docs.docker.com/) to be installed on your local machine. The extension hosts the development container locally using the Docker host with the correct developer tools and dependencies preinstalled to complete this training module.

1. Open **Visual Studio Code** in the context of an empty directory.

1. Ensure that you have the [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) installed in Visual Studio Code.

1. Open a new terminal in the editor.

    > [!TIP]
    > You can use the main menu to navigate to the **Terminal** menu option and then select the **New Terminal** option.
    >
    > :::image type="content" source="media/browser-file-upload-azure-storage-blob/open-terminal-option.png" lightbox="media/browser-file-upload-azure-storage-blob/open-terminal-option.png" alt-text="Screenshot of the menu option to open a new terminal.":::

1. Clone your fork into the current directory. Replace `<YOUR-ACCOUNT>` in the following command with your account name.

    ```bash
    git clone https://github.com/<YOUR-ACCOUNT>/azure-typescript-e2e-apps
    ```

1. Open the **Command Palette**, search for the **Dev Containers** commands, and then select **Dev Containers: Reopen in Container**.

    :::image type="content" source="media/browser-file-upload-azure-storage-blob/reopen-container-command-palette.png" alt-text="Screenshot of the Command Palette option to reopen the current folder within the context of a development container.":::

    > [!TIP]
    > Visual Studio Code may automatically prompt you to reopen the existing folder within a development container. This functionality is equivalent to using the command palette to reopen the current workspace in a container.
    >
    > :::image type="content" source="media/browser-file-upload-azure-storage-blob/reopen-container-toast.png" alt-text="Screenshot of a toast notification to reopen the current folder within the context of a development container.":::

1. Check the versions of the tools you use in this tutorial.

    ```shell
    node --version
    npm --version
    func --version
    ```

     This tutorial requires the following versions of each tool, which are preinstalled in your environment:

    | Tool | Version |
    | --- | --- |
    | Node.js | &ge; 18 |
    | npm | &ge; 9.5 |
    | Azure Functions core tools| &ge; 4.5098|

1. Close the terminal.

1. The remaining steps in this tutorial take place in the context of this development container.

---

## Install dependencies

The sample app for this tutorial is in the `azure-upload-file-to-storage` folder. You won't need to use any other folders in the project. 

1. In Visual Studio Code, open a terminal, and move to the project folder.

    ```bash
    cd azure-upload-file-to-storage
    ``````

1. Split the terminal so you have two terminals, one for the client app and one for the API app.
1. In one of the terminals, run the following command to install the **API** app's dependencies and run the app.

    ```bash
    cd api && npm install
    ```

1. In the other terminal, run the command to install the **client app**.

    ```bash
    cd app && npm install
    ```

<a name="3-create-storage-resource-with-visual-studio-extension"></a>

## Create storage resource with Visual Studio extension

Create the Azure Storage resource to use with the sample app. Storage is used for:

* Triggers in the Azure Functions app
* Blob (file) storage

1. Navigate to the Azure Storage extension.
1. Sign in to Azure if necessary.
1. Right-click on the subscription then select `Create Resource...`.

    :::image type="content" source="media/browser-file-upload-azure-storage-blob/visual-studio-code-azure-explorer-create-resource.png" alt-text="Screenshot of Visual Studio Code in the Azure Explorer with the right-click menu showing the Create Resource item highlighted.":::

1. Select **Create Storage Account** from list.
1. Follow the prompts using the following table to understand how to create your Storage resource.

    |Property|Value|
    |--|--|
    |Enter a globally unique name for the new web app.| Enter a unique value such as `fileuploadstor`, for your Storage resource name.<br><br> This unique name is **your resource name** used in the next section. Use a maximum of 24 alphanumeric characters in length. You need this **account name** to use later.|
    |Select a location for new resources.|Use the recommended location.|

1. When the app creation process is complete, a notification appears with information about the new resource. 

    :::image type="content" source="media/browser-file-upload-azure-storage-blob/visual-studio-code-azure-activity-log-storage-notification.png" lightbox="media/browser-file-upload-azure-storage-blob/visual-studio-code-azure-activity-log-storage-notification.png" alt-text="Screenshot of Visual Studio Code showing the Azure Activity Bar and the notification that the storage account was successfully created.":::

## Configure Storage CORS

Because the browser is used to upload the file, the Azure Storage account needs to configure CORS to allow cross-origin requests. These CORS settings are used for this tutorial to simplify the steps and aren't meant to indicate best practices or security. Learn more about [CORS for Azure Storage](/rest/api/storageservices/cross-origin-resource-sharing--cors--support-for-the-azure-storage-services).

1. Navigate to the Azure Storage extension. Right-click on your storage resource and select **Open in Portal**.
1. In the Azure portal storage account **Settings** section, select **Resource sharing (CORS)**. 
1. Use the following properties to set CORS for this tutorial. 

    * Allowed origins: `*`
    * Allowed methods: All except patch
    * Allowed headers: `*`
    * Exposed headers: `*`
    * Max age: 86400

1. Select **Save**.

## Grant anonymous access to storage

After file upload, the tutorial scenario requires public access to the blob for viewing. For simplicity, this guide enables anonymous access for the uploaded files.

1. To enable public access in the Azure portal, select the **Overview** page for your storage account, in the **Properties** section, select **Blob anonymous access** then select **Disabled**.
1. On the **Configuration** page, enable **Allow Blob anonymous access**.

## Create upload container

Create a private container which has publicly readable blobs.  

1. While still in the Azure portal storage account, in the **Data storage** section, select **Containers**.
1. Select **+ Container** to create your `upload` container with the following settings:

    * Name: `upload`
    * Public access Level: `Blob`
1. Select **Create**. 

## Grant yourself Blob Data access

While you created the resource, you don't have permission to view the contents of the container. This authorization is reserved for specific IAM roles. Add your account so you can view the blobs in the containers.

1. In the Azure portal storage account, select **Access Control (IAM)**.
1. Select **Add role assignments**. 
1. Search and select **Storage Blob Data Contributor**. Select **Next**. 
1. Select **+ Select members**. 
1. Search and select your account.
1. Select **Review + assign**.
1. Select **Containers** then the **upload** container. You should be able to see there are no blobs in the container without authorization errors. 

## Get Storage resource credentials

The Storage resource credentials are used in the Azure Functions API app to connect to the Storage resource. 

1. While still in the Azure portal, in the **Security + networking** section, select **Access keys**.
1. Copy the `Key ` key. 
1. In Visual Studio Code, in the `./workspaces/azure-typescript-e2e-apps/azure-upload-file-to-storage/api`folder, **rename** the file from `local.settings.json.sample` to `local.settings.json`. The file is ignored by Git so it isn't be checked into source control.
1. Update the settings for `local.settings.json` using the following table.

    |Property|Value|Description|
    |--|--|--|
    |Azure_Storage_AccountName|Azure Storage account name, for example: `fileuploadstor`.|Used in source code to connect to Storage resource.|
    |Azure_Storage_AccountKey|Azure Storage account key|Used in source code to connect to Storage resource.|
    |AzureWebJobsStorage|Azure Storage account connection string|Use by Azure Functions runtime to store state and logs.|

It may seem like you entered the same account credentials twice, once as a key and once as a connection string. You did, but specifically for this simple tutorial. Generally speaking, Azure Functions apps should have a separate Storage resource that isn't reused for another purpose. When you create the Azure Function resource later in the tutorial, you won't need to set the **AzureWebJobsStorage** value for the cloud resource. You'll need to set the **Azure_Storage_AccountName** and **Azure_Storage_AccountKey** values which are used in source code.

## Run the API app

Run the Functions App to make sure it works correctly before deploying it to Azure.

1. In the API app's terminal, run the following command to start the API app. 

    ```bash
    npm run start
    ```

1. Wait until the Azure Functions app is started. You'll get a notice that the Azure Functions app's port, **7071** is now available. You should also see the APIs listed in the terminal for the API app.

    ```console
    Functions:
    
            list: [POST,GET] http://localhost:7071/api/list
    
            sas: [POST,GET] http://localhost:7071/api/sas

            status: [GET] http://localhost:7071/api/status
    ```

1. Select the **Ports** tab in the bottom pane then right-click the **7071** port and select **Port Visibility** then select **Public**.

    If you don't expose this app as public, you'll get an error when you use the API from the client app. 

1. To test that the API works and connects to storage, in the **Ports** tab in the bottom pane, select the globe icon in the **Local Address** area for port 7071. This opens a web browser to the functions app.
1. Add the API route to the URL address bar: `/api/sas?container=upload&file=test.png`. 
    It's ok that the file isn't in the container yet. The API creates the SAS token based on where you want it to be uploaded to. 
1. The JSON response should look something like the following: 

    ```JSON
    {
        "url":"https://YOUR-STORAGE-RESOURCE.blob.core.windows.net/upload/test.png?sv=2023-01-03&spr=https&st=2023-07-26T22%3A15%3A59Z&se=2023-07-26T22%3A25%3A59Z&sr=b&sp=w&sig=j3Yc..."
    }
    ```
1. Copy the base of the API URL in the browser address bar (not the SAS token URL in the JSON object) to use in the next step. The base URL is everything before `/api/sas`. You'll paste this base URL into the client app environment variable file in the next section.

## Configure and run the client app

1. Rename the `./azure-upload-file-to-storage/app/.env.sample` file to `.env`.
1. Open the `.env` file and paste the base URL from the previous section as the value for the `VITE_API_SERVER`.

    An example for a Codespaces environment may look something like `VITE_API_SERVER=https://improved-space-fishstick-pgvxvxjpqgrh6qxp-7071.app.github.dev`

1. In the other split terminal, start the client app with the following command:

    ```bash
    npm run dev
    ```

1. Wait until the terminal returns the following notice that the app is available on port **5173**.

    ```console
      VITE v4.4.4  ready in 410 ms
    
      ➜  Local:   https://localhost:5173/
      ➜  Network: use --host to expose
      ➜  press h to show help
    ``` 

1. Select the **Ports** tab in the bottom pane then right-click the **5173** port and select the globe icon.

1. You should see the web app.

    :::image type="content" source="media/browser-file-upload-azure-storage-blob/browser-app-select-file.png" alt-text="Screenshot of web browser showing web app with Select File button available.":::

1. Interact with the web app:

    * Select an image file (*.jpg or *.png) from your local computer to upload. 
    * Select the **Get a SAS** button to request a SAS token from the API app. The response shows the full URL to use to upload the file to Storage. 
    * Select the **Upload** button to send the image file directly to Storage.
    
    :::image type="content" source="media/browser-file-upload-azure-storage-blob/browser-file-upload-complete.png" lightbox="media/browser-file-upload-azure-storage-blob/browser-file-upload-complete.png" alt-text="Screenshot of web browser showing web app with the image file uploaded and a thumbnail of the file displayed.":::

1. The client app and the API app successfully worked together in a containerized developer environment. 

## Commit code changes

1. In Visual Studio Code, open the **Source Control** tab.
1. Select the **+** icon to stage all changes. These changes should only include new package-lock.json files for the `app` and `api` folders for this tutorial.

## Deploy static web app to Azure 

The Azure Functions app is using a preview feature. It must be deployed to **West US 2** to function properly.

1. In Visual Studio Code, select the Azure explorer.

1. In the Azure Explorer, right-click on the subscription name then select `Create Resource...`.
1. Select **Create Static Web App** from list.
1. Follow the prompts using the following table to understand how to create your Static Web App resource.

    |Property|Value|
    |--|--|
    |Enter a globally unique name for the new web app.| Enter a unique value such as `fileuploadstor`, for your Storage resource name.<br><br> This unique name is **your resource name** used in the next section. Use only characters and numbers, up to 24 in length. You need this **account name** to use later.|
    |Select a location for new resources.|Use the recommended location.|

1. Follow the prompts to provide the following information:

    |Prompt|Enter|
    |--|--|
    |*Select a resource group for new resources.*|Use the resource group that you created for your storage resource.|
    |*Enter the name for the new static web app.*|Accept the default name.|
    |*Select a SKU*| Select the free SKU for this tutorial. If you already have a free Static Web App resource in your subscription, select the next pricing tier.|
    |*Choose build preset to configure default project structure.*|Select **Custom**.|
    |*Select the location of your application code*|`azure-upload-file-to-storage/app`|
    |*Select the location of your Azure Functions code*|`azure-upload-file-to-storage/api`|
    |*Enter the path of your build output...*|`dist`<br><br> value is the path from your app to your static (generated) files.|
    |*Select a location for new resources.*|Select a region close to you.|

1. When the process is complete, a notification pop-up displays. Select **View/Edit Workflow**.

1. Your remote fork has a new workflow file for deploying to Static Web Apps. Pull that file down to your environment with the following command in the terminal:

    ```bash
    git pull origin main
    ```

1. Open the workflow file located at `/.github/workflows/`. 
1. Verify the section of the workflow specific to this tutorial's Static Web app should look like:

    ```yml
    ###### Repository/Build Configurations - These values can be configured to match your app requirements. ######
    # For more information regarding Static Web App workflow configurations, please visit: https://aka.ms/swaworkflowconfig
    app_location: "/azure-upload-file-to-storage/app" # App source code path
    api_location: "/azure-upload-file-to-storage/api" # Api source code path - optional
    output_location: "dist" # Built app content directory - optional
    ###### End of Repository/Build Configurations ######
    ```

1. Go to your GitHub fork of the sample, `https://github.com/<YOUR-ACCOUNT>/azure-typescript-e2e-apps/actions` to verify the build and deploy action, named `Azure Static Web Apps CI/CD`, completed successfully. This action may take a few minutes to complete.

1. Go to your Azure portal for your app and view the **APIs** section of **Settings**. The **Backend Resource Name** in the production environment is `(managed)` indicating your APIs are successfully deployed. 
1. Select **(managed)** to see the list of APIs loaded in the app:
    * list
    * sas
    * status

1. Go to the Overview page to find the **URL** for your deployed app.
1. The deployment of the app is complete.

## Configure API with Storage resource name and key

The app needs the Azure Storage resource name and key before the API works correctly.

1. Still in the Azure Explorer, right-click on the **Static Web App resource** and select **Open in Portal**.
1. Select **Configuration** in the **Settings** section.
1. Add application settings using the following table.

    |Property|Value|Description|
    |--|--|--|
    |Azure_Storage_AccountName|Azure Storage account name, for example: `fileuploadstor`.|Used in source code to connect to Storage resource.|
    |Azure_Storage_AccountKey|Azure Storage account key|Used in source code to connect to Storage resource.|

1. Select **Save** on the Configuration page to save both settings.

> [!NOTE]
> You don't need to set the client app's env variable **VITE_API_SERVER** because the client app and the API are hosted from the same domain. 

## Use the Azure-deployed static web app

Verify the deploy and configuration succeeded by using the web site. 

1. In Visual Studio Code, right-click your Static web app from the Azure explorer and select **Browse site**.
1. In the new web browser window, select **Choose File** then select an image file (*.png or *.jpg) to upload. 
1. Select **Get sas token**. This action passes the file name to the API and receives the SAS token URL necessary to upload the file.  
1. Select **Upload file** to use the SAS token URL to upload the file. The browser displays the thumbnail and URL of the uploaded file. 

## Clean up resources

In Visual Studio Code, use the Azure explorer for Resource Groups. Right-click on your resource group then select **Delete**.

This action deletes all resources in the group, including your Storage and Static Web app resources.

## Troubleshooting

Report [issues](https://github.com/Azure-Samples/azure-typescript-e2e-apps/issues) with this sample in the GitHub repo. Include the following with the issue:

* The URL of the article
* The step or context within the article that was problematic
* Your development environment

## Sample code

* GitHub repository: [azure-upload-file-to-storage](https://github.com/Azure-Samples/azure-typescript-e2e-apps/tree/main/azure-upload-file-to-storage)


## Related content

If you would like to continue with this app, learn how to deploy the app to Azure for hosting with one of the following choices:

* Azure Blob Storage [documentation](/azure/storage/blobs/storage-blobs-introduction)
* @azure/storage-blob
    * [npm package](https://www.npmjs.com/package/@azure/storage-blob)
* [Azure Static Web app](/azure/static-web-apps/)

[free Azure account]: https://azure.microsoft.com/pricing/free-trial/