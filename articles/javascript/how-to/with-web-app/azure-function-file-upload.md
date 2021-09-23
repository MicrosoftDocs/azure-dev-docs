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

## Create new function app

-- so package.json has function package

## Download Azure Storage emulator

# [Windows](#tab/download-storage-emulator-windows)

Download the [Standalone installer](https://go.microsoft.com/fwlink/?linkid=717179&clcid=0x409) and complete the installation. 

# [Mac/Linux](#tab/download-storage-emulator-mac-linux)

Use npm on in a bash terminal to install the [Azurite emulator](https://github.com/azure/azurite) to your local project:

```bash
npm install azurite
```

---

## Start the local Azure Storage emulator
 
# [Windows](#tab/start-storage-emulator-windows)

1. Select the Start button or press the Windows key.
1. Enter `Azure Storage Emulator` in the search box.
1. Select the emulator from the list of displayed applications.
1. This starts a terminal and begins the emulator CLI.

    :::image type="content" source="../../media/azure-function-file-upload-binding/start-storage-emulator-windows.png" alt-text="Screenshot of terminal showing emulator commands and results.":::

# [Mac/Linux](#tab/start-storage-emulator-mac-linux)

1. Create a directory to hold the storage files inside your local project directory:

    ```base
    mkdir azureStorage
    ```

1. Create your project.json file in the directory, if one doesn't already exist for your project. 


    ```base
    npm init -y
    ```

1. Add an npm script to start the Azurite emulator:

    ```json
    "start-azurite": "azurite --silent --location azureStorage --debug azureStorage/debug.log"
    ```

1. Start the npm script:

    ```bash
    npm start start-azurite
    ```    

---

mkdir azuriteStorage && azurite --silent --location azuriteStorage --debug azuriteStorage\debug.log

## Next steps

* [Install and debug a local project](../with-visual-studio-code/install-run-debug-nodejs.md)
