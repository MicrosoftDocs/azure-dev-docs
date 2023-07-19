---
title: "JavaScript: Upload image to Blob Storage"
description: Use a client web app to upload a file to Azure Storage blobs directly using a URL with a SAS token query string. 
ms.topic: how-to
ms.date: 07/20/2023
ms.custom: scenarios:getting-started, languages:JavaScript, devx-track-js, azure-sdk-storage-blob-typescript-version-12.2.1, engagement-fy23
---

# Upload an image to an Azure Storage blob with TypeScript

Use an static web app to upload a file to an Azure Storage blob using an Azure Storage [@azure/storage-blob](https://www.npmjs.com/package/@azure/storage-blob) npm package with an Azure Storage SAS token. 

## Application architecture 

This application architecture includes 3 Azure resources:

* Azure Static Web Apps for the statically-generated client application.
* Azure Functions for the serverless API.
* Azure Storage for the blob storage. 

:::image type="content" source="media/browser-file-upload-azure-storage-blob/file-upload-request-flow.png" alt-text="Diagram showing how a customer interacts from their computer to use the website to upload a file to Azure Storage directly.":::

|Step|Description|
|:--|--|
|1|The customer connects to the statically-generated website. The website is hosted in [Azure Static Web Apps](/azure/static-web-apps/).|
|2|The customer uses that website, to select a file to upload. For this tutorial, the front-end framework is [Vite React](https://vitejs.dev/guide/) and the file uploaded is an image file.|
|3|The website calls the [Azure Functions](/azure/azure-functions/) API to get a SAS token based on the exact **filename** of the file to upload. The serverless API uses the Azure Blob Storage SDK to create the SAS token. The API returns the full URL to use to upload the file, which includes the SAS token as the query string.<br>`https://YOUR-STORAGE-NAME.blob.core.windows.net/YOUR-CONTAINER/YOUR-FILE-NAME?YOUR-SAS-TOKEN`|
|4|The front-end website uses the SAS token URL to upload the file directly to [Azure Blob Storage](/azure/storage/blobs/).| 

## 1. Fork sample application GitHub repository

This tutorial uses GitHub actions to deploy the sample application to Azure. You need a GitHub account and a fork of the sample application repository to complete that deployment. 

1. In a web browser, use the following link to begin the fork for your own account of the sample repository: [Azure-Samples/azure-typescript-e2e-apps](https://github.com/Azure-Samples/azure-typescript-e2e-apps/fork).
1. Complete the steps to fork the sample with the **main** branch only. 

## 2. Configure dev environment

A [development container](https://containers.dev/) environment is available with all dependencies required to complete every exercise in this project. You can run the development container in GitHub Codespaces or locally using Visual Studio Code.

### [GitHub Codespaces](#tab/github-codespaces)

[GitHub Codespaces](https://docs.github.com/codespaces) runs a development container managed by GitHub with [Visual Studio Code for the Web](https://code.visualstudio.com/docs/editor/vscode-web) as the user interface. For the most straightforward development environment, use GitHub Codespaces so that you have the correct developer tools and dependencies preinstalled to complete this training module.

> [!IMPORTANT]
> All GitHub accounts can use Codespaces for up to 60 hours free each month with 2 core instances. For more information, see [GitHub Codespaces monthly included storage and core hours](https://docs.github.com/billing/managing-billing-for-github-codespaces/about-billing-for-github-codespaces#monthly-included-storage-and-core-hours-for-personal-accounts).

1. In a web browser, on your GitHub fork of the sample repository, start the process to create a new GitHub Codespace on the `main` branch of your fork by selecting the **CODE** button.

    :::image type="content" source="media/browser-file-upload-azure-storage-blob/github-codespaces-button.png" alt-text="GitHub screenshot of Code Spaces buttons for a repository.":::

1. On the **Codespaces** tab, select the ellipsis, `...`.

    :::image type="content" source="media/browser-file-upload-azure-storage-blob/github-codespaces-select.png" alt-text="GitHub screenshot of Code Spaces tab with ellipsis control highlighted.":::

1. Select **+ New with options** to select a specific Codespaces dev container. 

    :::image type="content" source="media/browser-file-upload-azure-storage-blob/github-codespaces-select-new-with-options.png" alt-text="GitHub screenshot of Codespaces New with options menu item highlighted.":::

1. Select the following options then select **Create codespace**.

    * Branch: `main`
    * Dev container configuration: `Tutorial: Upload file to storage with SAS Token`
    * Region: accept default
    * Machine type: accept default

    :::image type="content" source="media/browser-file-upload-azure-storage-blob/github-codespaces-new-with-options.png" alt-text="GitHub screenshot of Codespaces New with options menu item highlighted.":::

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
    ```

    This tutorial requires the following versions of each tool which are preinstalled in your environment:
    
    | Tool | Version |
    | --- | --- |
    | Node.js | &ge; 18 |
    | NPM | &ge; 9.5 |

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

1. Clone your fork into the current directory. Replace `YOUR-ACCOUNT` in the following command with your account name.

    ```bash
    git clone https://github.com/YOUR-ACCOUNT/azure-typescript-e2e-apps
    ```

1. Open the **Command Palette**, search for the **Dev Containers** commands, and then select **Dev Containers: Reopen in Container**.

    :::image type="content" source="media/browser-file-upload-azure-storage-blob/reopen-container-command-palette.png" alt-text="Screenshot of the Command Palette option to reopen the current folder within the context of a development container.":::

    > [!TIP]
    > Visual Studio Code may automatically prompt you to reopen the existing folder within a development container. This is functionally equivalent to using the command palette to reopen the current workspace in a container.
    >
    > :::image type="content" source="media/browser-file-upload-azure-storage-blob/reopen-container-toast.png" alt-text="Screenshot of a toast notification to reopen the current folder within the context of a development container.":::

1. Check the versions of the tools you use in this tutorial.

    ```shell
    node --version

    npm --version
    ```

     This tutorial requires the following versions of each tool which are preinstalled in your environment:

    | Tool | Version |
    | --- | --- |
    | Node.js | &ge; 18 |
    | NPM | &ge; 9.5 |

1. Close the terminal.

1. The remaining steps in this tutorial take place in the context of this development container.

---
























## 1. Set up development environment

This tutorial uses GitHub CodeSpaces to develop and deploy the sample appliction. You can choose to run CodeSpaces in a browser or in a locally installed Visual Studio Code instance. 

- An Azure user account with an active subscription. [Create one for free](https://azure.microsoft.com/free/).
- A GitHub account. [Create on for free](https://github.com/join)
    - GitHub CodeSpaces are used to develop the sample application. It is important to stop and remove the CodeSpace when you are done with this tutorial. 
    - GitHub actions are used to deploy the sample application to Azure.
- Optional, free [Visual Studio Code](https://code.visualstudio.com/)

## 2. Create sample application

1. Open this GitHub sample URL in a web browser: 

    #### [TypeScript](#tab/typescript)

    ```
    https://github.com/Azure-Samples/ts-e2e-browser-file-upload-storage-blob
    ```

    #### [JavaScript](#tab/javascript)

    ```
    https://github.com/Azure-Samples/js-e2e-browser-file-upload-storage-blob
    ```

    ---

1. Select **Fork** to create your own fork of this sample project. Your own GitHub fork is necessary to deploy this sample to Azure as a static web app.
1. Select the **Code** button, then copy the Clone URL.
1. In a bash terminal, clone your forked repository, replacing `REPLACE-WITH-YOUR-ACCOUNT-NAME` with your GitHub account name:

    #### [TypeScript](#tab/typescript)

    ```bash
    git clone https://github.com/REPLACE-WITH-YOUR-ACCOUNT-NAME/ts-e2e-browser-file-upload-storage-blob
    ```

    #### [JavaScript](#tab/javascript)

    
    ```bash
    git clone https://github.com/REPLACE-WITH-YOUR-ACCOUNT-NAME/js-e2e-browser-file-upload-storage-blob
    ```
    ---

1. Change into the new directory and open Visual Studio Code.

    #### [TypeScript](#tab/typescript)

    ```bash
    cd ts-e2e-browser-file-upload-storage-blob && code .
    ```

    #### [JavaScript](#tab/javascript)

    ```bash
    cd js-e2e-browser-file-upload-storage-blob && code .
    ```
    ---

1. Wait for the codespace to start. This startup process can take a few minutes.



## 3. Install dependencies and run local project

1. In Visual Studio Code, open an integrated bash terminal, <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>`</kbd>, and run the following command to install the sample's dependencies.

    ```bash
    npm install
    ```

1. In the same terminal window, run the command to build and run the web app.

    ```bash
    npm start
    ```

1. Open a web browser and use the following url to view the web app on your local computer.

    ```url
    http://localhost:3000/
    ```

    If you see the simple web app in your browser with the text that the Storage isn't configured, you've succeeded with this section of the tutorial.

    :::image type="content" source="media/tutorial-browser-file-upload/browser-react-app-no-azure-storage-resource-configured.png" alt-text="Screenshot of web browser showing simple Node.js app connected to MongoDB database.":::

1. Stop the code with <kbd>Ctrl</kbd> + <kbd>C</kbd> in the Visual Studio Code terminal.

<a name="3-create-storage-resource-with-visual-studio-extension"></a>

## 4. Create Storage resource with Visual Studio extension

1. Navigate to the Azure Storage extension. Right-click on the subscription then select `Create Storage Account...`.

    :::image type="content" source="media/tutorial-browser-file-upload/visualstudiocode-storage-extension-create-resource.png" alt-text="Screenshot of Visual Studio Code using the Azure extensions. Navigate to the Azure Storage extension. Right-click on the subscription then select `Create Storage Account...`.":::

1. Follow the prompts using the following table to understand how to create your Storage resource.

    |Property|Value|
    |--|--|
    |Enter a globally unique name for the new web app.| Enter a value such as `fileuploadstor`, for your Storage resource name.<br><br> This unique name is **your resource name** used in the next section. Use only characters and numbers, up to 24 in length. You need this **account name** to use later.|

1. When the app creation process is complete, a notification appears with information about the new resource. 

    :::image type="content" source="media/tutorial-browser-file-upload/visualstudiocode-storage-extension-create-resource-complete.png" alt-text="Screenshot of Visual Studio Code notification popup. When the app creation process is complete, a notification appears with information about the new resource.":::

## 5. Generate your shared access signature (SAS) token 

Create a SAS token for the container. A SAS token is a time-duration and permission limited token for delegating access to a container or blob in your Azure Storage account. 

Select from the two available types:

* User delegation SAS: Recommended. Signed with Azure AD account. Requires set up for role-based access control.
* Service SAS: Signed with the storage account key.

Once the SAS is created and distributed to a client, it's equally secure whether it's signed with the account key or with an Azure AD account. The user delegation SAS does have the advantage of being easier to revoke. 

#### [User-delegated SAS (recommended)](#tab/user-delegated-sas)

Generate the [user-delegated SAS token](/rest/api/storageservices/create-user-delegation-sas) before configuring CORS. The **user-delegated SAS token** is recommended:

* To implement [least privileged access](/azure/active-directory/develop/secure-least-privileged-access) through Azure RBAC
* To minimize access time range to 7 days or less
* To reduce developer and devops access to resource key
* To reduce burden of leaked key from key rotation to [revoking SAS token](/rest/api/storageservices/create-user-delegation-sas#revoke-a-user-delegation-sas)

1. In the Visual Studio Code extension for Storage, right-click the resource then select **Open in Portal**. This opens the Azure portal to your exact Storage resource.
1. Create a container named **uploaded**. 
1. Open the Cloud Shell in the portal.

    :::image type="content" source="media/tutorial-browser-file-upload/azure-portal-cloud-shell-icon.png" lightbox="media/tutorial-browser-file-upload/azure-portal-cloud-shell-icon.png"alt-text="Screenshot of Azure portal icon bar with Cloud Shell button highlighted." :::

1. Use the following command with your own values.

    ```azurecli
    az storage account show --resource-group 'YOUR-RESOURCE-GROUP' --name 'YOUR-STORAGE-RESOURCE-NAME' --query id
    ```

     This command returns a resource ID in the correct format: `/subscriptions/YOUR-SUBSCRIPTION/resourceGroups/YOUR-RESOURCE-GROUP/providers/Microsoft.Storage/storageAccounts/YOUR-STORAGE-RESOURCE-NAME`. 

1. Copy the output, the resource ID, and use it in the following command to add role-based-access control to the storage account.

    ```azurecli
    az role assignment create --assignee "YOUR-EMAIL" --role "Storage Blob Data Contributor" --scope "YOUR-RESOURCE-ID"
    ```

1. Select the container then right-click the row and select **Generate SAS**.

    :::image type="content" source="media/tutorial-browser-file-upload/azure-portal-storage-blob-generate-container-sas-token.png" lightbox="media/tutorial-browser-file-upload/azure-portal-storage-blob-generate-container-sas-token.png" alt-text="Screenshot of Azure portal with the container's right-click menu showing, with Generate SAS highlighted.":::

1. Configure the container **User delegation** SAS token with the following settings. If a setting isn't specified, don't change the setting.

    | Property|Value|
    |--|--|
    |Signing method|User delegation key|
    |Permissions|Read, create, write, list|
    |Start and expiry date/time|Accept the start date/time and **set the expiry to 24 hours in the future**. A user-delgated SAS token can have a maximum expiry of 7 days after the start time.|
    |HTTPS only|Selected|

    :::image type="content" source="media/tutorial-browser-file-upload/azure-portal-storage-blob-generate-sas-token.png" lightbox="media/tutorial-browser-file-upload/azure-portal-storage-blob-generate-sas-token.png" alt-text="Screenshot of Azure portal for Azure Storage, configuring the user-delegated SAS token.":::

1. Select **Generate SAS and URL**. 
1. Immediately copy the **Blob SAS token**. You won't be able to list this token so if you don't have it copied, you'll need to regenerate a new SAS token. 

#### [Account key SAS](#tab/account-key-sas)

Generate the [account SAS token](/rest/api/storageservices/create-account-sas) before configuring CORS. 

1. In the Visual Studio Code extension for Storage, right-click the resource then select **Open in Portal**. This opens the Azure portal to your exact Storage resource.
1. Create a container named **uploaded**. 
1. Select the container then right-click the row and select **Generate SAS**.

    :::image type="content" source="media/tutorial-browser-file-upload/azure-portal-storage-blob-generate-account-sas-token.png" lightbox="media/tutorial-browser-file-upload/azure-portal-storage-blob-generate-account-sas-token.png" alt-text="Screenshot of Azure portal with the container's right-click menu showing, with Generate SAS highlighted.":::

1. Configure the container **Account** SAS token with the following settings. If a setting isn't specified, don't change the setting.

    | Property|Value|
    |--|--|
    |Signing method|Account key|
    |Permissions|Read, create, write, list|
    |Start and expiry date/time|Accept the start date/time and **set the expiry to 24 hours in the future**. |
    |HTTPS only|Selected|

    :::image type="content" source="media/tutorial-browser-file-upload/azure-portal-storage-blob-generate-sas-token.png" lightbox="media/tutorial-browser-file-upload/azure-portal-storage-blob-generate-sas-token.png" alt-text="Screenshot of Azure portal for Azure Storage, configuring the service SAS token.":::

1. Select **Generate SAS and URL**. 
1. Immediately copy the **Blob SAS token**. You won't be able to list this token so if you don't have it copied, you'll need to regenerate a new SAS token. 

---

<a name="set-sas-token-in-code-file"></a>

## 6. Set Storage values in .env file

The SAS token is used when queries are made to your cloud-based resource.
1. Create a file name `.env` at the root of the project.
1. Add two required variables with their storage values:

    ```text
    REACT_APP_AZURE_STORAGE_SAS_TOKEN=
    REACT_APP_AZURE_STORAGE_RESOURCE_NAME=
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

    :::image type="content" source="media/tutorial-browser-file-upload/azure-portal-storage-blob-cors.png" lightbox="media/tutorial-browser-file-upload/azure-portal-storage-blob-cors.png" alt-text="Screenshot showing the Azure portal for the Storage resource. Configure CORS as show in the image. The settings are explained below the image.":::

    Once the application is deployed, you returned to this CORS form to add the URL for the static web app.

1. Select **Save** above the settings to save them to the resource. The code doesn't require any changes to work with these CORS settings. 

## 8. Run project locally to verify connection to Storage account

Your SAS token and storage account name are pulled into the application from environment variables, so you're ready to run the application.

1. If the app isn't running, start it again:

    ```bash
    npm start
    ```

1. Open the following URL in a browser:

    `http://localhost:3000` 

    :::image type="content" source="media/tutorial-browser-file-upload/browser-react-app-azure-storage-resource-configured-upload-button-displayed.png" alt-text="Screenshot showing web browser with the React website connected to Azure Storage blobs should display with a file selection button and a file upload button.":::

1. Select an image from the `images` folder to upload then select the **Upload!** button. 

1. The React front-end client code calls into the `./src/azure-storage-blob` to authenticate to Azure, then create a Storage Container (if it doesn't already exist), then uploads the file to that container. 

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

    :::image type="content" source="media/tutorial-browser-file-upload/visual-studio-code-static-web-app-view-edit-workflow.png" alt-text="Partial screenshot of Visual Studio Code notification pop-up with View/Edit Workflow button highlighted.":::

## 10. Add Azure Storage secrets to GitHub secrets

1. In a web browser, return to your GitHub fork of the sample project to add the two secrets and their values:

    #### [TypeScript](#tab/typescript)

    ```HTTP
    https://github.com/YOUR-GITHUB-ACCOUNT/ts-e2e-browser-file-upload-storage-blob/settings/secrets/actions
    ```

    #### [JavaScript](#tab/javascript)

    ```HTTP
    https://github.com/YOUR-GITHUB-ACCOUNT/js-e2e-browser-file-upload-storage-blob/settings/secrets/actions
    ```

     ---

    :::image type="content" source="media/tutorial-browser-file-upload/github-fork-settings-secret-new-repository-secret.png" lightbox="media/tutorial-browser-file-upload/github-fork-settings-secret-new-repository-secret.png" alt-text="Screenshot of a web browser displaying https://github.com, on the Settings -> Secrets page, with the New repository secret button highlighted.":::

## 11. Configure Static Web App to connect to storage resource

Edit the GitHub workflow and secrets to connect to Azure Storage.

1. In Visual Studio Code, open the `.github/workflows` workflow YAML file and add the two storage environment variables after the `with` section to the `build_and_deploy_job`.

    :::code language="YAML" source="~/../js-e2e-browser-file-upload-storage-blob/build-and-deploy-sample-job.yml" highlight="23-25":::

    This pulls in the secrets to the build process.

1. In Visual Studio Code, select Source Control, <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>G</kbd>, then select the addition icon to add the changed *.yml file. 
1. Enter a comment for your commit such as `Adding Storage secrets`.
1. Push to your GitHub fork by selecting the **Synchronize changes** icon on the status bar. 

    :::image type="content" source="media/tutorial-browser-file-upload/visual-studio-code-status-bar-synchronize-changes.png" alt-text="Partial screenshot of Visual Studio Code status bar.":::

1. In the pop-up window to confirm if you want to push and pull from your remote repository, select **OK**.

    If you get an error at this step, checkout your git remote to make sure you cloned _your fork_: `git remote -v`. 

1. This push triggers a new build and deploy for your static web app.

## 12. Verify build and deploy job completes

1. In a web browser, return to your GitHub fork of the sample project.
1. Select **Actions**, then select the **Azure Static Web Apps CI/CD** action. 
1. Select the Build and Deploy Job to watch the process complete.

    :::image type="content" source="media/tutorial-browser-file-upload/github-action-build-and-deploy-job-success.png" alt-text="Screenshot of web browser showing GitHub action success":::

## 13. Use the Azure-deployed static web app

1. In Visual Studio Code, right-click your Static web app from the Azure explorer and select 

    :::image type="content" source="media/tutorial-browser-file-upload/visual-studio-code-browse-site.png" alt-text="Partial screenshot selecting Browse Site from the Azure Static web site.":::

1. In the new web browser window, choose a file and upload the file. 

## Troubleshoot local connection to Storage account

If you received an error or your file doesn't upload to the container, check the following:

* Recreate your SAS token, making sure that your token is created at the Storage resource level and not the container level. Copy the new token into the code at the correct location.
* Check that the token string you copied into the code doesn't contain the `?` (question mark) at the beginning of the string.
* Verify your CORS setting for your Storage resource.

## Upload button functionality

#### [TypeScript](#tab/typescript)

The `src/App.tsx` TypeScript file is provided as part of that app creation with create-react-app. The file has been modified to provide the file selection button and the upload button and the supporting code to provide that functionality. 

The code connecting to the Azure Blob Storage code is highlighted. The call to `uploadFileToBlob` returns all blobs (files) in the container as a flat list. That list is displayed with the `DisplayImagesFromContainer` function.

:::code language="typescript" source="~/../ts-e2e-browser-file-upload-storage-blob/src/App.tsx" highlight="5,68":::

#### [JavaScript](#tab/javascript)

The `src/App.jsx` TypeScript file is provided as part of that app creation with create-react-app. The file has been modified to provide the file selection button and the upload button and the supporting code to provide that functionality. 

The code connecting to the Azure Blob Storage code is highlighted. The call to `uploadFileToBlob` returns all blobs (files) in the container as a flat list. That list is displayed with the `DisplayImagesFromContainer` function.

:::code language="javascript" source="~/../js-e2e-browser-file-upload-storage-blob/src/App.jsx" highlight="5,68":::

---



## Upload file to Azure Storage blob with Azure SDK client library

The code to upload the file to the Azure Storage is framework-agnostic. As the code is built for a tutorial, choices were made for simplicity and comprehension. These choices are explained; you should review your own project for intentional use, security, and efficiency. 

The sample creates and uses a publicly accessible container and files. If you want to secure your files in your own project, you have many layers where you can control that from requiring overall authentication to your resource to very specific permissions on each blob object. 

### Dependencies and variables

#### [TypeScript](#tab/typescript)

The [azure-storage-blob.ts](https://github.com/Azure-Samples/ts-e2e-browser-file-upload-storage-blob/blob/main/src/azure-storage-blob.ts) file loads the dependencies, and pulls in the required variables by either environment variables or hard-coded strings.

| Variable | Description |
|--|--|
|`sasToken`|The SAS token created with the Azure portal. Remove the prepended `?` before setting it in your `sasToken` variable.| 
|`container`|The name of the container in the storage account. You can think of this as equivalent to a folder or directory for a file system.|
|`storageAccountName`|Your resource name.|

:::code language="typescript" source="~/../ts-e2e-browser-file-upload-storage-blob/src/azure-storage-blob.ts" id="snippet_package":::

#### [JavaScript](#tab/javascript)


The [azure-storage-blob.js](https://github.com/Azure-Samples/js-e2e-browser-file-upload-storage-blob/blob/main/src/azure-storage-blob.js) file loads the dependencies, and pulls in the required variables by either environment variables or hard-coded strings.

| Variable | Description |
|--|--|
|`sasToken`|The SAS token created with the Azure portal is prepended with a `?`. Remove it before setting it in your `sasToken` variable.| 
|`container`|The name of the container in Blob storage. You can think of this as equivalent to a folder or directory for a file system.|
|`storageAccountName`|Your resource name.|

:::code language="javascript" source="~/../js-e2e-browser-file-upload-storage-blob/src/azure-storage-blob.js" id="snippet_package":::


---

### Create Storage client and manage steps

The client is created with a URL that includes both the storage resource name and the SAS token. The SAS token is in the query string, denoted with the question mark, `?`. When adding your SAS token to your environment variable, don't_ include the question mark because it's already included in the URL string.

#### [TypeScript](#tab/typescript)

:::code language="typescript" source="~/../ts-e2e-browser-file-upload-storage-blob/src/azure-storage-blob.ts" id="snippet_get_client":::

#### [JavaScript](#tab/javascript)

:::code language="javascript" source="~/../js-e2e-browser-file-upload-storage-blob/src/azure-storage-blob.js" id="snippet_get_client":::

---


### Upload file to blob storage

#### [TypeScript](#tab/typescript)

The `uploadFileToBlob` function is the main function of the file. It creates the client object for the Storage service, then creates the client to the container object, uploads the file, then gets a list of all the blobs in the container.

:::code language="typescript" source="~/../ts-e2e-browser-file-upload-storage-blob/src/azure-storage-blob.ts" id="snippet_uploadFileToBlob":::

#### [JavaScript](#tab/javascript)

The `uploadFileToBlob` function is the main function of the file. It creates the client object for the Storage service, then creates the client to the container object, uploads the file, then gets a list of all the blobs in the container.

:::code language="javascript" source="~/../js-e2e-browser-file-upload-storage-blob/src/azure-storage-blob.js" id="snippet_uploadFileToBlob":::

---

### Create blob in container

#### [TypeScript](#tab/typescript)

The `createBlobInContainer` function uploads the file to the container, using the [BlockBlobClient](/javascript/api/@azure/storage-blob/blockblobclient) class, [uploadData](/javascript/api/@azure/storage-blob/blockblobclient#uploadData_Buffer___Blob___ArrayBuffer___ArrayBufferView__BlockBlobParallelUploadOptions_) method. The content type must be sent with the request if you intend to use browser functionality, which depends on the file type, such as displaying a picture. 

:::code language="typescript" source="~/../ts-e2e-browser-file-upload-storage-blob/src/azure-storage-blob.ts" id="snippet_createBlobInContainer":::

#### [JavaScript](#tab/javascript)

The `createBlobInContainer` function uploads the file to the container, using the [BlockBlobClient](/javascript/api/@azure/storage-blob/blockblobclient) class, [uploadData](/javascript/api/@azure/storage-blob/blockblobclient#uploadData_Buffer___Blob___ArrayBuffer___ArrayBufferView__BlockBlobParallelUploadOptions_) method. The content type must be sent with the request if you intend to use browser functionality, which depends on the file type, such as displaying a picture. 

:::code language="javascript" source="~/../js-e2e-browser-file-upload-storage-blob/src/azure-storage-blob.js" id="snippet_createBlobInContainer":::

---

### Get list of blobs

#### [TypeScript](#tab/typescript)

The `getBlobsInContainer` function gets a list of URLs, using the [ContainerClient](/javascript/api/@azure/storage-blob/containerclient) class, [listBlobsFlat](/javascript/api/@azure/storage-blob/containerclient#listBlobsFlat_ContainerListBlobsOptions_) method, for the blobs in the container. The URLs are constructed to be used as the `src` of an image display in HTML: `<img src={item} alt={item} height="200" />`. 

:::code language="typescript" source="~/../ts-e2e-browser-file-upload-storage-blob/src/azure-storage-blob.ts" id="snippet_getBlobsInContainer":::

#### [JavaScript](#tab/javascript)

The `getBlobsInContainer` function gets a list of URLs, using the [ContainerClient](/javascript/api/@azure/storage-blob/containerclient) class, [listBlobsFlat](/javascript/api/@azure/storage-blob/containerclient#listBlobsFlat_ContainerListBlobsOptions_) method, for the blobs in the container. The URLs are constructed to be used as the `src` of an image display in HTML: `<img src={item} alt={item} height="200" />`. 

:::code language="javascript" source="~/../js-e2e-browser-file-upload-storage-blob/src/azure-storage-blob.js" id="snippet_getBlobsInContainer":::

---

## Clean up resources

In Visual Studio Code, use the Azure explorer for Resource Groups, right-click on your resource group then select **Delete**.

This deletes all resources in the group, including your Storage and Static Web app resources.

## Sample code 

#### [TypeScript](#tab/typescript)
* [**Sample code**](https://github.com/Azure-Samples/ts-e2e-browser-file-upload-storage-blob)
* [Azure Blob Storage reference documentation](/javascript/api/overview/azure/storage-blob-readme)


#### [JavaScript](#tab/javascript)
* [**Sample code**](https://github.com/Azure-Samples/js-e2e-browser-file-upload-storage-blob)
* [Azure Blob Storage reference documentation](/javascript/api/overview/azure/storage-blob-readme)

--- 

## Next steps

If you would like to continue with this app, learn how to deploy the app to Azure for hosting with one of the following choices:

* [Upload as a static web app](/azure/static-web-apps/getting-started?tabs=vanilla-javascript)
* Upload to a web app resource using the [Visual Studio code extension for the App service](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azureappservice)
* [Upload an app to an Azure VM](/azure/developer/javascript/tutorial/run-nodejs-virtual-machine)
* Azure Blob Storage [documentation](/azure/storage/blobs/storage-blobs-introduction)
* @azure/storage-blob
    * [NPM package](https://www.npmjs.com/package/@azure/storage-blob)
    * [Reference documentation](/javascript/api/@azure/storage-blob/)
* [Azure Static Web app](/azure/static-web-apps/)