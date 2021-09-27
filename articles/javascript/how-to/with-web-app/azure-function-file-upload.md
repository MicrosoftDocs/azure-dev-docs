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

## File upload restrictions

100 MB limit

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

## Install npm package dependencies from bash terminal

1. In Visual Studio Code, open an integrated bash terminal, <kbd>Ctrl</kbd> + <kbd>`</kbd>.
1. Install npm dependencies:

    ```bash
    npm install
    ```

## Install and start Azurite storage emulator

Now that the basic project directory structure and files are in place, add storage emulation.

1. To emulate the Azure Storage service locally, install Azurite.

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

    This actions uses the local directory `azureStorage` to hold the storage files and logs.

1. In a new VSCode bash terminal, start the npm script:

    ```bash
    npm start start-azurite
    ```    


## Next steps

* [Install and debug a local project](../with-visual-studio-code/install-run-debug-nodejs.md)
