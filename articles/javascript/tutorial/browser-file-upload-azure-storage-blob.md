---
title: "TypeScript: Upload image to Blob Storage"
titleSuffix: TypeScript on Azure
description: Use a client web app to upload a file to Azure Storage blobs directly using a URL with a SAS token query string. 
ms.topic: tutorial
ms.date: 12/17/2025
ms.custom: scenarios:getting-started, languages:TypeScript, devx-track-ts, azure-sdk-storage-blob-typescript-version-12.2.1, engagement-fy23
# CustomerIntent: As a JavaScript developer new to Azure, I want learn how to upload a file to Azure Storage in a web app so that know how to browser to do the actual file upload without exposing authentication secrets on the client.'
---


# Tutorial: Upload an image to an Azure Storage blob with TypeScript

In this tutorial you will use a full-stack TypeScript application to upload files directly to an Azure Storage blob using the @azure/storage-blob package. The API generates a SAS token following the [Valet Key pattern](/azure/architecture/patterns/valet-key), which lets you securely delegate limited access without exposing full credentials.

## Prerequisites

* An Azure subscription; if you don't already have an Azure subscription, you can sign up for a [free Azure account].
* [GitHub account](https://github.com/join) to fork and push to a repo.

## Application architecture 

This application architecture includes several Azure resources:

:::image type="content" source="./media/browser-file-upload-azure-storage-blob/architecture-with-user-flow.png" alt-text="Azure architecture diagram showing user accessing a Web App Frontend, which calls an API App Backend that uploads and lists files from a Storage Blob Container. Managed Identity provides authentication to both apps, and Container Registry supplies container images to both the frontend and backend applications.":::


| Step | Action | Description |
|------|--------|-------------|
| 1. | Select file | User selects a file from their local system to upload |
| 2. | Get SAS token | Frontend requests a Shared Access Signature (SAS) token from the Backend Fastify API to authorize the upload |
| 3. | Request SAS | Backend Fastify API requests a SAS token from Azure Storage Blob Container |
| 4. | Get User Delegation Key | Storage Blob Container retrieves a user delegation key from Managed Identity for secure token generation |
| 5. | Return Key | Managed Identity returns the user delegation key to the Storage Blob Container |
| 6. | Return SAS URL | Storage Blob Container returns the SAS URL to the Backend Fastify API |
| 7. | Upload file | Backend Fastify API returns the SAS URL to the Frontend, which uses it to upload the file directly to Storage |
| 8. | Direct Upload of PNG using SAS token| Frontend uploads the PNG file directly to Azure Storage Blob Container using the SAS token for authentication |
| 10. | Query Blobs | Backend Fastify API can query the Storage Blob Container to list or retrieve uploaded files |

 :::image type="content" source="./media/browser-file-upload-azure-storage-blob/solution-demo-sas-token-file-storage.gif" alt-text="Demonstration of uploading an image file through the web app interface.":::

## Key concepts

This sample demonstrates modern Azure security and deployment patterns for a production-ready file upload solution.

### Secure authentication with User Delegation SAS tokens

The application uses Shared Access Signature (SAS) tokens to provide time-limited and permission-scoped access to Azure Blob Storage. Specifically, it uses User Delegation SAS tokens, which offer enhanced security compared to traditional SAS tokens:

- **Traditional SAS tokens**: Signed with storage account keys that require rotation and secure storage
- **User Delegation SAS tokens**: Signed with Microsoft Entra ID credentials obtained through Managed Identity

This keyless authentication pattern is Azure's recommended approach. The API authenticates to Azure using its managed identity, requests a temporary User Delegation Key from Blob Storage, and generates short-lived SAS tokens (typically 10-60 minutes) with specific permissions such as read, write, or delete. The browser uses these tokens to upload files directly to storage, bypassing the API and reducing server load while maintaining security.

### Infrastructure deployment with Azure Developer CLI

The infrastructure deployment uses Azure Developer CLI (azd), which streamlines the developer experience. A single `azd up` command provisions all Azure resources, configures security settings, builds container images, and deploys the application.

The infrastructure is defined using Bicep templates that follow Azure Well-Architected Framework principles and incorporate Azure Verified Modules (AVM) where applicable. These Microsoft-maintained modules are production-ready components that implement best practices for security, reliability, and cost optimization.

The deployment creates an Azure Container Apps environment that hosts both the React frontend and Fastify API backend. It automatically configures managed identities for each container app and assigns the necessary Role-Based Access Control (RBAC) permissions:

- **API managed identity**: Receives Storage Blob Data Contributor role for managing blobs and Storage Blob Delegator role for generating User Delegation SAS tokens
- **Infrastructure identity**: Uses AcrPull role to retrieve container images from Azure Container Registry

This approach eliminates the need to store or manage credentials in code or configuration files.


## Development container environment

This tutorial's [complete sample code](https://github.com/Azure-Samples/azure-typescript-upload-file-storage-blob) uses a development container in either [GitHub Codespaces](https://codespaces.new/Azure-Samples/azure-typescript-upload-file-storage-blob) or local Visual Studio Code.

## Fork sample application repository with GitHub

This tutorial uses [Azure Developer CLI](/azure/developer/azure-developer-cli) to deploy the sample application to Azure. 

[GitHub Codespaces](https://docs.github.com/codespaces) runs a development container managed by GitHub with [Visual Studio Code for the Web](https://code.visualstudio.com/docs/editor/vscode-web) as the user interface. For the most straightforward development environment, use GitHub Codespaces so that you have the correct developer tools and dependencies preinstalled to complete this training module.

> [!IMPORTANT]
> All GitHub accounts can use Codespaces with free hours each month. For more information, see [GitHub Codespaces monthly included storage and core hours](https://docs.github.com/billing/managing-billing-for-github-codespaces/about-billing-for-github-codespaces#monthly-included-storage-and-core-hours-for-personal-accounts).

1. In a web browser, fork the sample then open the sample in a Codespace for the main branch. 

    :::image type="content" source="media/browser-file-upload-azure-storage-blob/github-codespaces-button.png" alt-text="GitHub screenshot of Codespaces buttons for a repository.":::

1. Wait for the development container to start. This startup process can take a few minutes. The remaining steps in this tutorial take place in the context of this development container.

## Deploy the sample

To deploy the sample, complete the following steps from the terminal with Azure Developer CLI.

1. Sign in to Azure.

    ```azdcli
    azd auth login
    ```

1. Provision resources and deploy the sample to the hosting environment.

    ```azdcli
    azd up
    ```

    When prompted, enter the following information:

    |Prompt|Enter|
    |--|--|
    | Enter a unique environment name | `secure-upload` |
    | Select an Azure Subscription to use | Select your subscription from the list |
    | Enter a value for the 'location' infrastructure parameter | Select from the locations available |

1. When the deployment is complete, note the URL of the deployed web app displayed in the terminal.

    ```console
      (✓) Done: Deploying service app
      - Endpoint: https://app-gp2pofajnjhy6.calmtree-87e53015.eastus2.azurecontainerapps.io/
    ```

    This is an example URL. Your URL will be different.

1. Open the deployed web app in a new browser tab and select a PNG file to upload. Several PNG files are available in the `./docs/media` folder. 

    :::image type="content" source="media/browser-file-upload-azure-storage-blob/browser-app-select-file.png" alt-text="Screenshot of web browser showing deployed web app with Select File button available.":::

1. Select **Get sas token** to send the file name to the API. The API requests a time-limited, write-only SAS token from Azure Storage and returns the SAS token URL to the frontend.
1. Select **Upload file** to upload the file directly from the browser to Azure Storage using the SAS token. After the upload completes, the frontend automatically requests the list of all uploaded files from the API. Each image URL returned includes a read-only SAS token. The web app displays thumbnails and URLs for all uploaded files.

    :::image type="content" source="media/browser-file-upload-azure-storage-blob/browser-file-upload-complete.png" lightbox="media/browser-file-upload-azure-storage-blob/browser-file-upload-complete.png" alt-text="Screenshot of web browser showing web app with the image file uploaded and a thumbnail of the file displayed."::: 

    Both the file upload and image rendering happen as direct connections from the browser to Azure Storage, secured by time-limited and permission-scoped SAS tokens generated by the API. 

Now that the sample is deployed and working, continue to the next section to understand how to run and test the sample in your local development container environment.

## Run the API server and the client app

When you deployed the application, part of the process created a `.env` in the root of the project with environment variables used by both the client and API apps.

1. Open a terminal and install the dependencies. 

    ```console
    npm install
    ```

    This package uses npm workspaces to manage both the client app and the API app dependencies.

1. Split the terminal so you have two terminals, one for the web app (client) and one for the API app (server).

1. In one of the terminals, run the following command to start the API server.

    ```bash
    npm run start:api
    ```


1. Open the browser to the web app at `http://localhost:5173`.
1. Use the web app to see that the URLs with SAS tokens are returned to the browser and the browser uses the URLs to connect directly and securely to Azure Storage to upload and list files.
1. Stop both apps by pressing `CTRL + C` in each terminal. Move to the next section to understand how the API app generates SAS tokens.

## Run the API app to understand SAS token generation

Run the API server to understand SAS token generation.

1. Run the following command to start the API app. 

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

The app needs the Azure Storage resource name and key before the API works correctly. When deployed to Azure Static Web Apps, the client app and API are hosted from the same domain, eliminating the need to set the client app's environment variable VITE_API_SERVER.

1. Still in the Azure Explorer, right-click on the **Static Web App resource** and select **Open in Portal**.
1. Select **Configuration** in the **Settings** section.
1. Add application settings using the following table.

    |Property|Value|Description|
    |--|--|--|
    |Azure_Storage_AccountName|Azure Storage account name, for example: `fileuploadstor`.|Used in source code to connect to Storage resource.|
    |Azure_Storage_AccountKey|Azure Storage account key|Used in source code to connect to Storage resource.|

1. Select **Save** on the Configuration page to save both settings.

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

* Azure Blob Storage [documentation](/azure/storage/blobs/storage-blobs-introduction)
* @azure/storage-blob
    * [npm package](https://www.npmjs.com/package/@azure/storage-blob)
* [Azure Static Web app](/azure/static-web-apps/)

[free Azure account]: https://azure.microsoft.com/pricing/free-trial/