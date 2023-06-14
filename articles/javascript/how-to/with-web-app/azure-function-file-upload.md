---
title: Upload file to Storage
description: Create an Azure Function API, which uploads a file to Azure Storage.
ms.topic: how-to
ms.date: 09/06/2022
ms.custom: devx-track-js
#intent: How to locally develop a file-upload serverless function then deploy that function to Azure. 
---

# <a name='#Azure Storage considerations when using Azure Functions'></a>Upload file to Azure Blob Storage with an Azure Function

This article shows you how to create an Azure Function API, which uploads a file to Azure Storage using an _out_ binding to move the file contents from the API to Storage.

* [Sample code](https://github.com/Azure-samples/js-e2e-azure-function-upload-file)

## Solution architecture considerations

> [!CAUTION]
>The Azure Function **file upload limit is 100 MB**. If you need to upload larger files, consider either a browser-based approach such as [Static web apps](/azure/static-web-apps) or a server-based solution such as [Azure App Service](/azure/app-service/). 

This sample:
* Uploads a file to an Azure Function
* Uses **parse-multipart** npm package to get information about the uploaded file.
* Uses **@azure/storage-blob** to generate a blob SAS token URL for the file. The URL should be handed back to a client or other service to read the file with authorization.
* Uses a Function App **out** binding to upload the file to Blob Storage. This is the easiest way to get a file into blob storage. 

    :::image type="content" source="../../media/azure-function-file-upload-binding/azure-architecure.png" alt-text="Architectural diagram of browser uploading file to Azure Function App then connecting to Azure Storage in two ways: out binding and SDK.":::

While you can replace the _out_ binding with more code to upload the file to Blob storage, you can't replace the SDK with any _out_ binding to generate the SAS token URL. As you move from beginning code for this functionality to more complex code, you'll replace the _out_ binding with [SDK upload calls](/azure/storage/blobs/storage-blob-upload-javascript#upload-by-blob-client).

## Prepare your development environment

Make sure the following are installed on your local developer workstation:

- An Azure account with **an active subscription which you own**. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
    - Ownership is required to provide the correct Azure Active folder permissions to complete these steps. 
- [Node.js LTS and npm](https://nodejs.org/en/download) - for local development.
- [Visual Studio Code](https://code.visualstudio.com/) - to develop locally and to deploy to Azure. 
- Visual Studio Code extensions:
    - [Azure Resource extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azureresourcegroups).
    - [Azure Function extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions).
    - [Azure Storage extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurestorage).

## 1. Create a resource group

A resource group holds both the Azure Function resource and the Azure Storage resource. Because both resources are in a single resource group, when you want to remove these resources, you remove the resource group. That action removes all resources in the resource group.

1. In Visual Studio Code, select the Azure explorer, then select the **+** (Plus/Addition) icon under **Resources**. 

    :::image type="content" source="../../media/azure-function-file-upload-binding/visual-studio-code-create-resource-group.png" alt-text="Partial screenshot of Visual Studio Code's Azure Explorer showing the Resources area with the Plus/Addition icon highlighted.":::

1. Select **Create Resource Group** from the list of resources.

    :::image type="content" source="../../media/azure-function-file-upload-binding/visual-studio-code-select-create-resource-group.png" alt-text="Partial screenshot of Visual Studio Code's Azure Explorer showing list of the resources with the `Create Resource Group` highlighted.":::

1. Use the following table to finish creating the resource group:

    |Prompt|Value|Notes|
    |--|--|--|
    |Enter the name of the new resource group.|`blob-storage-upload-function-group`|If you choose a different name, remember to use it as a replacement for this name when you see it in the rest of this article.|
    |Select a location for new resources. |Select a region close to you.||

## <a name="#create-the-local-functions-app-with-the-visual-studio-code"></a>2. Create the local Function app

1. Create a new folder on your local workstation, then open Visual Studio Code in this folder. 

1. In Visual Studio Code, open the **Command Palette** (View -> Command Palette | <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd>), then filter and select **Azure Function: Create New Project ...**

1. Use the following table to finish creating the local Azure Function project:

    |Prompt|Value|Notes|
    |--|--|--|
    |Select the folder that will contain your function project.|Select the current folder, which is the default value.||
    |Select a language|TypeScript||
    |Select a template for your project's first function|HTTP Trigger|API is invoked with an HTTP request.|
    |Provide a function name|`upload`|API route is `/api/upload`|
    |Authorization Level|Function|This locks the remote API to requests that pass the function key with the request. While developing locally, you won't need the function key.|

    This process doesn't create cloud-based Azure Function resource yet. That step will come later.

1. Return to the Visual Studio Code File Explorer.
1. After a few moments, Visual Studio Code completes creation of the local project, including a folder named for the function, *upload*, within which are three files:

    | Filename | Description |
    | --- | --- |
    | *index.ts* |  The source code that responds to the HTTP request. |
    | *function.json* | The [binding configuration](/azure/azure-functions/functions-triggers-bindings) for the HTTP trigger. |
    | *sample.dat* | A placeholder data file to demonstrate that you can have other files in the folder. You can delete this file, if desired, as it's not used in this tutorial. |

<a name="install-functions-npm-package-dependencies-from-bash-terminal"></a>

## 3. Install dependencies 

1. In Visual Studio Code, open an integrated bash terminal, <kbd>Ctrl</kbd> + <kbd>`</kbd>.
1. Install npm dependencies:

    ```bash
    npm install
    ```

## 4. Install and start Azurite storage emulator

Now that the basic project folder structure and files are in place, add local storage emulation.

1. To emulate the Azure Storage service locally, install [Azurite](https://github.com/Azure/Azurite).

    ```bash
    npm install azurite
    ```

1. Create a folder to hold the storage files inside your local project folder:

    ```base
    mkdir azureStorage
    ```

1. To start the Azurite emulator, add an npm script to the end of the `scripts` property items in the **package.json** file:

    ```json
    "start-azurite": "azurite --silent --location azureStorage --debug azureStorage/debug.log"
    ```

    This action uses the local folder `azureStorage` to hold the storage files and logs.

1. In a new Visual Studio Code bash terminal, start the emulator:

    ```bash
    npm run start-azurite
    ```    

    Don't close this terminal during the article until the cleanup step.

## <a name="#add-typescript-code-to-manage-file-upload"></a>5. Add code to manage file upload

1. In a new Visual Studio Code integrated bash terminal, add npm packages to handle file tasks:

    ```bash
    npm install http-status-enum parse-multipart @types/parse-multipart @azure/storage-blob
    ```

    Leave this terminal open to use other script commands. You should have two terminal windows open: one window running Azurite storage emulator, and this terminal for commands.

1. Open the `./upload/index.ts` file and replace the contents with the following code:

    :::code language="TypeScript" source="~/../js-e2e-azure-function-upload-file/upload/index.ts" range="35-134" highlight="68-88":::

    The `filename` query string parameter is required because the _out_ binding needs to know the name of the file to create. The `username` query string parameter is required because it becomes the Storage container (folder) name. For example, if the user name is `jsmith` and the file name is `test-file.txt`, the Storage location is `jsmith/test-file.txt`. 

    The code to read the file and send it to the out binding is highlighted.

1. Create a new file named `azure-storage-blob-sas-url.ts`, then copy the following code into the file to generate a SAS token for the uploaded file. 

    :::code language="TypeScript" source="~/../js-e2e-azure-function-upload-file/upload/azure-storage-blob-sas-url.ts" highlight="39-44":::

## <a name="#configure-the-function-to-connect-to-azure-storage"></a>6. Connect Azure Function to Azure Storage

1. Open the `./upload/function.json` file and replace the contents with the following code:

    :::code language="JSON" source="~/../js-e2e-azure-function-upload-file/upload/function.json" highlight="13-24":::

    The first highlighted object defines the _out_ binding to read the returned object from the function. The second highlighted object defines how to use the read information. The connection string for the Storage resource is defined in the **connection** property with the `AzureWebJobsStorage` value. 

1. Open the `./local.settings.json` file and replace the **AzureWebJobsStorage** property's value with `UseDevelopmentStorage=true` to ensure that when you develop locally, the function uses the local Azurite storage emulator:

    :::code language="JSON" source="~/../js-e2e-azure-function-upload-file/sample.local.settings.json" highlight="5":::

## <a name="#run-the-local-function-with-local-storage-emulation"></a>7. Run the local function

1. In the integrated terminal window for commands (not the terminal window running Azurite), start the function:

    ```bash
    npm start
    ```

1. Wait until you see the URL for the function. This indicates your function started correctly.

    ```bash
    upload: [POST] http://localhost:7071/api/upload
    ```

1. Create a new file in the root of the project named `test-file.txt` and copy in the text:

    :::code language="TEXT" source="~/../js-e2e-azure-function-upload-file/test-file.txt" :::

1. In Visual Studio Code, open a new bash terminal at the root of the project to use the function API to upload the `test-file.txt`. Copy the bash script to the terminal and execute it.

    :::code language="bash" source="~/../js-e2e-azure-function-upload-file/upload.sh":::

1. Check the response for a status code of 200:

    :::code language="console" source="~/../js-e2e-azure-function-upload-file/response.txt":::

1. In the response JSON, the **url** property is the SAS token url for the file. It can be used to read the file.


1. In Visual Studio Code, in the file explorer, expand the **azureStorage/_blobstorage_** folder and view the contents of the file. 

    :::image type="content" source="../../media/azure-function-file-upload-binding/visual-studio-code-azurite-storage.png" alt-text="Screenshot of Visual Studio Code with file explorer showing Azurite storage with blob folder containing uploaded file.":::

    Locally, you've called the function and uploaded the file to the storage emulator successfully.

<a name="use-visual-studio-code-extension-to-deploy-to-hosting-environment"></a>

## 8. Create Function App resource 

1. In Visual Studio Code, select the Azure explorer, then right-click on **Function App**, then select **Create Function App in Azure (Advanced)**. 

    :::image type="content" source="../../media/azure-function-file-upload-binding/visual-studio-code-create-function-app-resource-advanced-selection.png" alt-text="Partial screenshot of Visual Studio Code's Azure Explorer showing the Resources area, Function App with the right-click menu item highlighted.":::

    Alternately, you can create a Function App by opening the **Command Palette** (**F1**), entering `Azure Functions:`, and running the **Azure Functions: Create Function App in Azure (Advanced)** command.

1. Use the following table to complete the prompts to create a new Azure Function resource. 

    |Prompt|Value|Notes|
    |--|--|--|
    |Select Function App in Azure|Create new Function app in Azure (Advanced)|Create a cloud-based resource for your function.|
    |Enter a globally unique name for the new Function App|The name becomes part of the API's URL.|API is invoked with an HTTP request. Valid characters for a function app name are 'a-z', '0-9', and '-'. An example is `blob-storage-upload-function-app-jsmith`. You can replace `jsmith` with your own name, if you would prefer.|
    |Select a runtime stack|Select a Node.js stack with the `LTS` descriptor.|LTS means long-term support.|
    |Select an OS.|Windows|Windows is selected specifically for the stream logs integration in Visual Studio Code. Linux log streaming is available from the Azure portal.|
    |Select a resource group for new resources.|`blob-storage-upload-function-group`|Select the resource group you created.|
    |Select a location for new resources.|Select the recommended region.||
    |Select a hosting plan.|Consumption||
    |Select a storage account.|+ Create new storage account||
    |Enter the name of the new storage account.|`blobstoragefunction`||
    |Select an Application Insights resource for your app.|+ Create new Application Insights resource.||
    |Enter an Application Insights resource for your app.|`blob-storage-upload-function-app-insights`||

1. The Visual Studio Code **Azure: Activity log** shows progress:

    :::image type="content" source="../../media/azure-function-file-upload-binding/visual-studio-create-function-app-azure-activity-log.png" alt-text="Screenshot of Visual Studio Code output window creating a function resource.":::

1. In Visual Studio Code, select the Azure explorer, then right-click on your new app in **Function App** resource area, then select **Deploy to Function app**. 

1. Select the notification link to see the output of the deployment. 

    When this is complete, your Function App isn't configured to use Azure Blob Storage yet. 

## 10. Create an Azure Storage Resource

1. In Visual Studio Code, select the Azure explorer, then right-click on your subscription under **Storage** to select **Create Storage Account (Advanced)**.
1. Use the following table to finish creating the local Azure Function project:

    |Prompt|Value|Notes|
    |--|--|--|
    |Enter a globally unique name for the new Storage resource|`blobstoragefunction`|The name must be 3 to 24 lowercase letters and numbers only.|
    |Select a resource group for new resources.|`blob-storage-upload-function-group`|Select the resource group you created.|
    |Would you like to enable static website hosting?|No.|| 
    |Select a location for new resources.|Select one of the recommended locations close to use.||

<a name="copy-the-storage-connection-string-into-azure-function-application-setting"></a>
<a name="copy-the-storage-connection-string-into-function-app-setting"></a>

## 11. Set Storage connection string in Function app setting

1. In Visual Studio Code, select the Azure explorer, then right-click on your new storage resource, and select **Copy Connection String**.
1. Still in the Azure explorer, expand your Azure Function app, then expand the **Application Settings** node and right-click **AzureWebJobsStorage** to select **Edit Setting**.
1. Paste in the Azure Storage connection string and press enter to complete the change. 

    When **moving to production**, this connection string setting and its environment variable in the source code should be replaced [**DefaultAzureCredential**](/javascript/api/overview/azure/identity-readme#defaultazurecredential) in order to use passwordless authentication.

## <a name="#verify-functions-app-is-available-with-browser"></a>12. Use cloud-based function

Once deployment is completed and the _AzureWebJobsStorage_ app setting have been updated, test your Azure Function.

1. In Visual Studio Code, create a bash file named `upload-azure.sh` and copy the following code into the file.

    :::code language="bash" source="~/../js-e2e-azure-function-upload-file/upload-azure.sh":::

1. In Visual Studio Code, select the Azure explorer, then expand the node for your Function app, then expand **Functions**. Right-click the function name, `upload` and select **Copy Function Url**.
1. In the `upload-azure.sh` bash file, paste your function url value into `FUNCTION_URL`.

1. Execute that bash script in the terminal from the project's root folder:

    ```bash
    bash upload-azure.sh
    ```

1. Check the response for a status code of 200:

    :::code language="console" source="~/../js-e2e-azure-function-upload-file/response.cloud.txt":::

1. In the response JSON, the **url** property is the SAS token url for the file. It can be used to read the file.

1. In Visual Studio Code, open the Azure explorer, expand your Storage blob resource, under containers, and find the container name that matches your username value in the query string. 

    :::image type="content" source="../../media/azure-function-file-upload-binding/visual-studio-code-storage-container-file.png" alt-text="Screenshot of Visual Studio Code showing the Azure explorer's Storage node with the file uploaded.":::

## 13. Query your Azure Function logs

1. In Visual Studio Code, select the Azure explorer, then under **Functions**, right-click on your function app, then select **Open in Portal**.

    This opens the Azure portal to your Azure Function.

1. Select **Application Insights** from the Settings, then select **View Application Insights data**.

    :::image type="content" source="../../media/azure-function-file-upload-binding/azure-portal-function-application-insights-link.png" alt-text="Browser screenshot showing menu choices. Select **Application Insights** from the Settings, then select **View Application Insights data**." lightbox="../../media/azure-function-file-upload-binding/azure-portal-function-application-insights-link.png":::

    This link takes you to your separate metrics resource created for you when you created your Azure Function with Visual Studio Code.

1. Select **Logs** in the Monitoring section. If a **Queries** pop-up window appears, select the **X** in the top-right corner of the pop-up to close it. 
1. In the **New Query 1** pane, on the **Tables** tab, double-click the **traces** table. 

    This enters the [Kusto query](/azure/data-explorer/kusto/query/), `traces` into the query window. 
1. Edit the query to search for the custom logs:

    ```kusto
    traces 
    | where message startswith "***"
    ```

1. Select **Run**.

    If the log doesn't display any results, it may be because there's a few minutes delay between the HTTP request to the Azure Function and the log availability in Kusto. Wait a few minutes and run the query again.

    :::image type="content" source="../../media/azure-function-file-upload-binding/azure-portal-function-application-insight-trace-message.png" alt-text="Browser screenshot showing Azure portal Kusto query result for Trace table." lightbox="../../media/azure-function-file-upload-binding/azure-portal-function-application-insight-trace-message.png":::
   

## 14. Clean up Azure resources

1. In Visual Studio Code, in the Azure explorer, use the **Group by** feature to switch the Resources view to **Group by Resource Group**. 

    :::image type="content" source="../../media/azure-function-file-upload-binding/visual-studio-code-resource-group-by-resource-group.png" alt-text="Partial screenshot of Visual Studio Code showing how to use Azure extension to group by resource group.":::

1. Find your resource group name, such as `blob-storage-upload-function-group`, in the list.
1. Right-click the resource group name and select **Delete Resource Group**.

    :::image type="content" source="../../media/azure-function-file-upload-binding/visual-studio-code-resource-group-delete.png" alt-text="Partial screenshot of Visual Studio Code, Azure extension, Azure Resource Groups, to delete the resource group and all resources within the group.":::

## Troubleshooting

* **SPLIT**: If you try to use this sample and run into an error regarding `split` from the `parse-multipart` library, verify that you're sending the `filename` property in your multiform data and that you're sending the `content-type` header into the function
* **Debug in Dev Container**: If you run this app in its dev container in Visual Studio Code, make sure the Azure Function extensions in installed and _enabled_ in the dev container. You may have to rebuild the container.


## Next steps

* Azure Functions
    * Function [triggers and bindings](/azure/azure-functions/functions-triggers-bindings?tabs=javascript)
    * [Azure Storage triggers and bindings](/azure/azure-functions/functions-bindings-storage-blob?tabs=in-process%2Cextensionv5%2Cextensionv3&pivots=programming-language-javascript)

* Azure Storage
    * Learn how to [write code](/azure/storage/blobs/storage-blob-javascript-get-started) with Azure Blob Storage SDK

* Passwordless code
    
    * [How to use managed identity in Azure Functions](/azure/app-service/overview-managed-identity?toc=%2Fazure%2Fazure-functions%2Ftoc.json&tabs=portal%2Chttp)
    * [Use DefaultAzureCredential with SDK](/azure/storage/blobs/storage-blob-javascript-get-started#connect-with-azure-ad) 
    
* Manage Azure resources with SDKs
    * [Create a resource group with an Azure Function API](./azure-function-resource-group-management.md)
    
    
