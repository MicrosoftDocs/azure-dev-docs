---
title: Deploy Azure Functions in Node.js from Visual Studio Code
description: Tutorial part 1, introduction and prerequisites.
services: app-service
author: kraigb
manager: barbkess
ms.service: app-service
ms.topic: conceptual
ms.date: 09/23/2019
ms.author: kraigb
---

# Deploy Azure Functions from Visual Studio Code

In this tutorial, you use Visual Studio Code and the Azure Functions extension to create and deploy an Azure Functions application written with JavaScript. 

## Prerequisites

- An [Azure subscription](#azure-subscription).
- [Visual Studio Code](https://code.visualstudio.com/).
- The [Azure Functions extension](vscode:extension/ms-azuretools.vscode-azurefunctions)
- [Node.js and npm](https://nodejs.org/en/download), the Node.js package manager.

> <a class="tutorial-install-extension-btn" href="vscode:extension/ms-azuretools.vscode-azurefunctions">Install the Azure Functions extension</a>

### Azure subscription

If you don't have an Azure subscription, [sign up now](https://azure.microsoft.com/en-us/free/?utm_source=campaign&utm_campaign=vscode-tutorial-functions-extension&mktingSource=vscode-tutorial-functions-extension) for a free account with $200 in Azure credits to try out any combination of services.

## Sign in to Azure

[!INCLUDE [azure-sign-in](includes/azure-sign-in.md)]

## Install the Azure Functions Core Tools

To enable local debugging, you need to install the [Azure Functions Core Tools](https://github.com/Azure/azure-functions-core-tools#installing).

### [macOS](#tab/unix)

Install the Core Tools using [Homebrew](https://brew.sh/).

```bash
brew tap azure/functions
brew install azure-functions-core-tools
```

### [Windows](#tab/windows)

Install using [npm](https://npmjs.com).

```bash
npm install -g azure-functions-core-tools
```

### [Linux](#tab/linux)

Follow the instructions in the Azure Functions Core Tools [GitHub repository](https://github.com/Azure/azure-functions-core-tools#linux).

---

To verify that you have the Azure Functions tools installed, open a terminal or command prompt and run the command, `func`. The command should show output like that below (along with usage information).

```output
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
```

> [!div class="nextstepaction"]
> [I installed the prerequisites](tutorial-vscode-serverless-node-02.md) [I ran into an issue](https://www.research.net/r/PWZWZ52?tutorial=node-deployment-azurefunctions&step=getting-started)
