---
title: 
description: 
ms.topic: how-to
ms.date: 09/24/2021
ms.custom: devx-track-js
#intent: How to locally develop a file-upload serverless function then deploy that function to Azure. 
---

# Upload file to Azure Blob Storage with an Azure Function

* [Sample code](https://github.com/diberry/js-e2e-azure-function-upload-file.git)

## Architecture overview

This function integrates Azure Functions with Azure Storage to upload a file through an API into a blob. 

### Azure Storage dependency

The Azure Function **file upload limit is 100 MB**. If you need to upload larger files, consider either a browser-based approach or a web app. 

This sample uses an **Azure Function _out_ binding** instead of the Azure Storage npm package. By using the binding, you have to configure your function to correctly use the outbound binding to move the file from our function to the storage resource. 

The _out_ binding usage, used in this article, has some pros and cons:

|Pros|Cons|
|--|--|
|* No code to write to move a file from the function to storage<br><br>* No npm dependency for storage|* function.json just be configured correctly<br><br>* Connection string to storage must be configured correctly in environment|

The code required to read the uploaded file and convert it into a format that can be sent to storage is required, regardless if you use an out binding or an npm storage package.

## Prepare your development environment

Make sure the following are installed on your local developer workstation:

- An Azure account with **an active subscription which you own**. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). Ownership is required to provide the correct Azure Active Directory permissions to complete these steps.
- Microsoft Identity account - this is an [email account](https://signup.live.com) added to Microsoft Identity but doesn't have to be the same account you use to create resources.
- [Node.js 14 and npm](https://nodejs.org/en/download) - installed to your local machine.
- [Visual Studio Code](https://code.visualstudio.com/) - installed to your local machine. 
- Visual Studio Code extensions:
    - [Azure App Service extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azureappservice) for Visual Studio Code.

## Create a resource group

A resource group holds both the Azure Function resource and the Azure Storage resource. By adding both resources to a single group, when you want to clean up, you just need to remove the resource group.

1. In VS Code, select the Azure explorer, then select the **+** (Plus/Addition) icon under **Resource Groups**. 
1. Use the following table to finish creating the resource group:

    |Prompt|Value|Notes|
    |--|--|--|
    |Enter the name of the new resource group.|`blob-storage-upload-function-group`|If you choose a different name, remember to use it as a replacement for this name when you see it in the rest of this article.|Select a location for new resources. |Select a region close to you.||

## Create the local Functions app with the Visual Studio Code _Functions_ extension

1. Create a new directory on your local workstation, then open Visual Studio Code in this directory. 

1. In Visual Studio Code, select the Azure explorer, then expand the **Azure Functions** explorer, then select the **Create New Project** command:

    ![Create a local Function app in VS Code](../../media/azure-function-file-upload-binding/create-function-app-project.png)

1. At the first two prompts, select the current folder, then select **TypeScript** for the language.
1. Use the following table to finish creating the local Azure Function project:

    |Prompt|Value|Notes|
    |--|--|--|
    |Select a language|TypeScript||
    |Select a template for your project's first function|HTTP Trigger|API is invoked with an HTTP request.|
    |Provide a function name|`upload`|API route is `/api/upload`|
    |Authorization Level|Function|This locks the remote API to requests that pass the function key with the request. While developing locally, you won't need the function key.|
    |Select how you would like to open your project|Open in current window.||

    This process doesn't create cloud-based Azure Function resource yet. That step will come later.

1. After a few moments, VS Code completes creation of the project. You have a folder named for the function, *upload*, within which are three files:

    | Filename | Description |
    | --- | --- |
    | *index.js* |  The source code that responds to the HTTP request. |
    | *function.json* | The [binding configuration](/azure/azure-functions/functions-triggers-bindings) for the HTTP trigger. |
    | *sample.dat* | A placeholder data file to demonstrate that you can have other files in the folder. You can delete this file, if desired, as it's not used in this tutorial. |

## Install functions npm package dependencies from bash terminal

1. In Visual Studio Code, open an integrated bash terminal, <kbd>Ctrl</kbd> + <kbd>`</kbd>.
1. Install npm dependencies:

    ```bash
    npm install
    ```

## Install and start Azurite storage emulator

Now that the basic project directory structure and files are in place, add storage emulation.

1. To emulate the Azure Storage service locally, install [Azurite](https://github.com/Azure/Azurite).

    ```bash
    npm install azurite
    ```

1. Create a directory to hold the storage files inside your local project directory:

    ```base
    mkdir azureStorage
    ```

1. To start the Azurite emulator, add an npm script to the `scripts` property of the **package.json** file :

    ```json
    "start-azurite": "azurite --silent --location azureStorage --debug azureStorage/debug.log"
    ```

    This action uses the local directory `azureStorage` to hold the storage files and logs.

1. In a new VSCode bash terminal, start the emulator:

    ```bash
    npm start start-azurite
    ```    

    Don't close this terminal during the article until the cleanup step.

## Add TypeScript code to manage file upload

1. In a new VS Code integrated bash terminal, add npm packages to handle file tasks:

    ```bash
    npm install http-status-enum parse-multipart @types/parse-multipart
    ```

    Leave this terminal open to use other script commands. You should have two terminal windows open: one window running Azurite storage emulator, and this terminal for commands.

1. Open the `./upload/index.ts` file and replace the contents with the following code:

    :::code language="TypeScript" source="~/../js-e2e-azure-function-upload-file/upload/index.ts" highlight="41-55":::

    The file name query string parameter is required because the _out_ binding needs to know the name of the file. The user name query string parameter is required because it becomes the Storage container name so it is a required query string parameter. For example, if the user name is `jsmith` and the file name is `tweets.txt`, the Storage location is `jsmith/tweets.txt`. 

    The code to read the file and send it to the out binding is highlighted.

## Configure the function to connect to Azure Storage

1. Open the `./upload/function.json` file and replace the contents with the following code:

    :::code language="JSON" source="~/../js-e2e-azure-function-upload-file/upload/function.json" highlight="13-24":::

    These first object defines the out binding to read the returned object from the function. The second object defines how to use the read information. The connection string for the Storage resource is defined in the **connection** property with the `AzureWebJobsStorage` value. 

1. Open the `./local.settings.json` file and find the **AzureWebJobsStorage** property to ensure that when you develop locally, the function uses the local Azurite storage emulator.:

    :::code language="JSON" source="~/../js-e2e-azure-function-upload-file/sample.local.settings.json" highlight="5":::

## Run the local function with local storage emulation

1. In the integrated terminal window for commands (not the terminal window running Azurite), start the function:

    ```bash
    npm start
    ```

1. Wait until you see the URL for the function. This indicates your function started correctly.

    ```bash
    upload: [POST] http://localhost:7071/api/upload
    ```

1. In VS Code, open a new bash terminal to use the function:

    ```bash
    curl -X POST  -F 'filename=@test-file.txt' 'http://localhost:7071/api/upload?filename=test-file.txt&username=jsmith' --verbose
    ```

1. Check the response for a status code of 200:

    :::code language="TEXT" source="~/../js-e2e-azure-function-upload-file/response.txt" highlight="14":::

1. In VS Code, in the file explorer, expand the **azureStorage/_blobstorage_** folder and view the contents of the file. It's name is a guid but the contents should be:

    :::code language="TEXT" source="~/../js-e2e-azure-function-upload-file/test-file.txt" highlight="14":::

    Locally, you've called the function and the file was uploaded to the storage emulator successfully.

## Use Visual Studio Code extension to deploy to hosting environment

1. In Visual Studio Code, open the **Azure Explorer**, then right-click the deployment icon under **Functions** to deploy your app:

    ![Deploy to Azure Functions command](../../media/functions-extension/deploy-app.png)

    Alternately, you can deploy by opening the **Command Palette** (**F1**), entering `deploy to function app`, and running the **Azure Functions: Deploy to Function App** command.

1. Use the following table to complete the prompts to create a new Azure Function resource. 

    |Prompt|Value|Notes|
    |--|--|--|
    |Select Function App in Azure|Create new Function app in Azure (Advanced)|Create a cloud-based resource for your function.|
    |Enter a globally unique name for the new Function App|The name becomes part of the API's URL.|API is invoked with an HTTP request. Valid characters for a function app name are 'a-z', '0-9', and '-'. An example is `blob-storage-upload-function-app-jsmith`. You can replace `jsmith` with your own name, if you would prefer.|
    |Select a runtime stack|Select a Node.js stack with the `LTS` descriptor.||
    |Select an OS.|Windows||
    |Select a resource group for new resources.|`blob-storage-upload-function-group`|Select the [resource group](#create-a-resource-group) you created.|
    |Select a location for new resources.|Select the recommended region.||
    |Select a hosting plan.|Consumption||
    |Select a storage account.|+ Create new storage account||
    |Enter the name of the new storage account.|`blobstoragefunction`||
    |Enter an Application Insights resource for your app.|`blob-storage-upload-function-app-insights`||

1. The Visual Studio Code **Output** panel for **Azure Functions** shows progress:

    ```console
    12:26:48 PM: Creating new function app "Visual Studio Codeblob-storage-upload-function-app"...
    12:27:09 PM: Successfully created function app "Visual Studio Codeblob-storage-upload-function-app": https://Visual Studio Codeblob-storage-upload-function-app.azurewebsites.net
    12:27:38 PM Visual Studio Codeblob-storage-upload-function-app: Starting deployment...
    12:27:40 PM Visual Studio Codeblob-storage-upload-function-app: Creating zip package...
    12:27:41 PM Visual Studio Codeblob-storage-upload-function-app: Uploading zip package to storage container...
    12:27:41 PM Visual Studio Codeblob-storage-upload-function-app: Zip package size: 2.73 kB
    12:27:44 PM Visual Studio Codeblob-storage-upload-function-app: Deployment successful.
    12:27:44 PM Visual Studio Codeblob-storage-upload-function-app: Started postDeployTask "npm install (functions)".
    12:27:55 PM Visual Studio Codeblob-storage-upload-function-app: Syncing triggers...
    12:27:57 PM Visual Studio Codeblob-storage-upload-function-app: Querying triggers...
    12:28:01 PM Visual Studio Codeblob-storage-upload-function-app: WARNING: Some http trigger urls cannot be displayed in the output window because they require an authentication token. Instead, you may copy them from the Azure Functions explorer.
    ```

    When deploying, the entire Functions application is deployed, any changes to individual APIs are deployed at once.

1. In the notifications, select **Stream logs** and keep the view open while you make a request to the API in the next section.


## Create an Azure Storage Resource

1. In VS Code, select the Azure explorer, then right-click on your subscription under **Storage** to select **Create Storage Account (Advanced)**.
1. Use the following table to finish creating the local Azure Function project:

    |Prompt|Value|Notes|
    |--|--|--|
    |Enter a globally unique name for the new Storage resource|`blobstoragefunction`|The name must be 3 to 24 lowercase letters and numbers only.|
    |Select a resource group for new resources.|`blob-storage-upload-function-group`|Select the [resource group](#create-a-resource-group) you created.||
    |Would you like to enable static website hosting?|No.|| 
    |Select a location for new resources.|Select one of the recommended locations close to use.||

## Copy the Storage connection string into Azure Function application setting

1. In VS Code, select the Azure explorer, then right-click on your new storage resource, and select **Copy Connection String**.
1. Still in the Azure explorer, expand your Azure Function app, then expand the **Application Settings** node and right-click **AzureWebJobsStorage** to select **Edit Setting**.
1. Paste in the Azure Storage connection string and press enter to complete the change. 

## Verify Functions app is available with browser

Once deployment is completed and the _AzureWebJobsStorage_ app setting have been updated, test your Azure Function.

1. Open a text file and copy in the following: 

    ```bash
    curl -X POST  -F 'filename=@test-file.txt' 'REPLACE-WITH-YOUR-FUNCTION-URL' --verbose
    ```

1. In VS Code, select the Azure explorer, then expand the node for your Functions app, then expand **Functions**. Right-click the function name and select **Copy Function Url**:

    ![Copy function URL command](../../media/functions-extension/copy-function-url-command.png)

1. Paste the URL into a text file overwritting `REPLACE-WITH-YOUR-FUNCTION-URL`.
1. Append the filename and username query string name/value pairs:

    |Name|Value|
    |username|`jsmith`|
    |filename|`test-file.txt`|

    The final curl command format should similar to the following, except for your own substitutions:

    ```TEXT
    curl -X POST -F 'filename=@test-file.txt' 'https://blob-storage-upload-function-app-jsmith.azurewebsites.net/api/randomnumber?code=12345&filename=test-file.txt&username=jsmith' --verbose
    ```

    The value for `code` in your own URL will be a much longer value. 

1. Copy the complete cURL command and run it in a VS Code bash terminal at the root of your function app to upload the root file, `test-file.txt`.

1. Open the Azure explorer, expand your Storage blob resource, under containers, and find the container name that matches your username value in the query string. 

## Query your Azure Function logs

Streaming logs is good for in-the-moment scanning. To search the logs, use the Azure portal. 

1. In Visual Studio Code, select the Azure logo to open the **Azure Explorer**, then under **Functions**, right-click on your function app, then select **Open in Portal**.

    This opens the Azure portal to your Azure Function.

1. Select **Application Insights** from the Settings, then select **View Application Insights data**.

    :::image type="content" source="../../media/functions-extension/azure-portal-function-application-insights-link.png" alt-text="Browser screenshot showing menu choices. Select **Application Insights** from the Settings, then select **View Application Insights data**." lightbox="../../media/functions-extension/azure-portal-function-application-insights-link.png":::

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

    If the log doesn't display any results, it may be because there is a few minutes delay between the HTTP request to the Azure Function and the log availability in Kusto. Wait a few minutes and run the query again.

    :::image type="content" source="../../media/functions-extension/azure-portal-application-insights-function-log-trace.png" alt-text="Browser screenshot showing Azure portal Kusto query result for Trace table." lightbox="../../media/functions-extension/azure-portal-application-insights-function-log-trace.png":::

    You didn't need to do anything extra to get this logging information:

    * The code used the standard `console.log` function.
    * The Function app added Application Insights _for you_.
    * The Query tool is included in the Azure portal.
    * You can click on `traces` instead of having to learn to write a [Kusto query](/azure/data-explorer/kusto/concepts/) to get even the minimum information from your logs.

## Remove remote Azure resources

The Functions App you created includes resources that can incur minimal costs (refer to [Functions Pricing](https://azure.microsoft.com/pricing/details/functions/)).  

1. Find the resource group name, `cosmosdb-mongodb-function-resource-group`, in the list.
1. Right-click the resource group name and select **Delete**.

    :::image type="content" source="../../media/visual-studio-code-azure-resources-extension-remove-resource-group.png" alt-text="Use the Visual Studio Code extension, Azure Resource Groups, to delete the resource group and all resources within the group.":::

## Next steps

* [Install and debug a local project](../with-visual-studio-code/install-run-debug-nodejs.md)
