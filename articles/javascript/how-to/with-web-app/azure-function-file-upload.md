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

## Azure Storage dependency


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

## Add TypeScript code to receive file upload in function

1. In a new VS Code integrated bash terminal, add npm packages to handle file tasks:

    ```bash
    npm install http-status-enum parse-multipart @types/parse-multipart
    ```

    Leave this terminal open to use other script commands. You should have two terminal windows open: one window running Azurite storage emulator, and this terminal for commands.

1. Open the `./upload/index.ts` file and replace the contents with the following code:

    :::code language="TypeScript" source="~/../upload/index.ts" highlight="41-55":::

    The file name query string parameter is required because the _out_ binding needs to know the name of the file. The user name query string parameter is required because it becomes the Storage container name so it is a required query string parameter. For example, if the user name is `jsmith` and the file name is `tweets.txt`, the Storage location is `jsmith/tweets.txt`. 

    The code to read the file and send it to the out binding is highlighted.

## Configure the function to connect to Azure Storage

1. Open the `./upload/function.json` file and replace the contents with the following code:

    :::code language="JSON" source="~/../upload/function.json" highlight="13-24":::

    These first object defines the out binding to read the returned object from the function. The second object defines how to use the read information. The connection string for the Storage resource is defined in the **connection** property with the `AzureWebJobsStorage` value. 

1. Open the `./local.settings.json` file and find the **AzureWebJobsStorage** property to ensure that when you develop locally, the function uses the local Azurite storage emulator.:

    :::code language="JSON" source="~/../local.settings.json" highlight="5":::

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

    :::code language="TEXT" source="~/../response.txt" highlight="14":::

1. In VS Code, in the file explorer, expand the **azureStorage/_blobstorage_** folder and view the contents of the file. It's name is a guid but the contents should be:

    :::code language="TEXT" source="~/../test-file.txt" highlight="14":::

## Next steps

* [Install and debug a local project](../with-visual-studio-code/install-run-debug-nodejs.md)
