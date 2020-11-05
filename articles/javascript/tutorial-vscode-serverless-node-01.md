---
title: Deploy Azure Functions in Node.js from Visual Studio Code
description: Serverless Tutorial part 1, introduction and prerequisites.
ms.topic: tutorial
ms.date: 11/05/2020
ms.custom: devx-track-js, contperfq2
---

# 1. Deploy Azure Functions from Visual Studio Code

In this tutorial, you use Visual Studio Code and the Azure Functions extension to create a JavaScript-based Functions app locally, then deploy the application to a remote Azure Functions resource:

Tasks include:
* Install required software
* Sign in to Azure with Azure CLI


## Walkthrough video

Watch this video for a complete walkthrough of the content in this article.

> [!VIDEO https://channel9.msdn.com/Shows/Docs-Azure/Deploy-Azure-Functions-Visual-Studio-Code/player]

## Create or use existing Azure Subscription 

* An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/?utm_source=campaign&utm_campaign=vscode-tutorial-browser-upload-storage-blob&mktingSource=vscode-tutorial-storage-extension).

## Set up development environment

- An [Azure subscription](#azure-subscription).
- [Visual Studio Code](https://code.visualstudio.com/).
- The [Azure Functions extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions)
- [Node.js and npm](https://nodejs.org/en/download), the Node.js package manager.

> <a class="tutorial-install-extension-btn" href="https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions">Install the Azure Functions extension</a>

### Azure subscription

If you don't have an Azure subscription, [sign up now](https://azure.microsoft.com/free/?utm_source=campaign&utm_campaign=vscode-tutorial-functions-extension&mktingSource=vscode-tutorial-functions-extension) for a free account with $200 in Azure credits to try out any combination of services.

## Sign in to Azure

[!INCLUDE [azure-sign-in](includes/azure-sign-in.md)]

## Install the Azure Functions Core Tools

To enable local debugging, you need to install the [Azure Functions Core Tools](https://github.com/Azure/azure-functions-core-tools), which can be done directly in Visual Studio Code.

1. Start Visual Studio Code.

1. Open the **Command Palette** (**F1**), enter **Azure Functions: Install or Update Azure Functions Core Tools**, and press **Enter** to run the command.

1. To verify installation, select the menu command **Terminal** > **New Terminal** in VS Code, then run the command, `func`. The command should show output like that below (along with usage information).

    <pre>
                      %%%%%%
                     %%%%%%
                @   %%%%%%    @
              @@   %%%%%%      @@
           @@@    %%%%%%%%%%%    @@@
         @@      %%%%%%%%%%        @@
           @@         %%%%       @@
             @@      %%%       @@
               @@    %%      @@
                    %%
                    %

    Azure Functions Core Tools (2.4.419 Commit hash: c9c1724d002bd90b2e6b41393915ea3a26bcf0ce)
    Function Runtime Version: 2.0.12332.0
    </pre>

> [!div class="nextstepaction"]
> [I installed the prerequisites](tutorial-vscode-serverless-node-02.md) [I ran into an issue](https://www.research.net/r/PWZWZ52?tutorial=node-deployment-azurefunctions&step=getting-started)
