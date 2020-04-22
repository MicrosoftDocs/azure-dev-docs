---
title: Deploy a static Node.js website to Azure from Visual Studio Code
description: Tutorial part 1, introduction and prerequisites.
ms.topic: conceptual
ms.date: 09/23/2019
---

# Deploy a static website to Azure from Visual Studio Code

In this tutorial, you create and deploy a static website to Azure using [Azure Storage](https://docs.microsoft.com/azure/storage). A static website is composed of HTML, CSS, JavaScript, and other static files such as images or fonts. A static site is typically a single-page application (or [SPA](https://en.wikipedia.org/wiki/Single-page_application)) written with Angular, React or Vue. However you design the app, you host and serve these files directly from _storage_ rather than using a web server. Hosting in storage is simpler and less expensive than maintaining a web server.

## Walkthrough video

Watch this video for a complete walkthrough of the content in this article.

> [!VIDEO https://channel9.msdn.com/Shows/Docs-Azure/Deploy-static-website-to-Azure-from-Visual-Studio-Code/player]

> [!NOTE]
> If you have your own server code, such as a Node.js/Express app, follow the [App Service tutorial](tutorial-vscode-azure-app-service-node-01.md) instead.

## Prerequisites

- An [Azure subscription](#azure-subscription).
- [Visual Studio Code](https://code.visualstudio.com/).
- The [Azure Storage extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurestorage).
- [Node.js and npm](https://nodejs.org/en/download), the Node.js package manager. (This requirement is used only to generate a sample project. You don't need to install Node.js if you already have app code.)

> <a class="tutorial-install-extension-btn" href="vscode:extension/ms-azuretools.vscode-azurestorage">Install the Azure Storage extension</a>

### Azure subscription

If you don't have an Azure subscription, [sign up now](https://azure.microsoft.com/free/?utm_source=campaign&utm_campaign=vscode-tutorial-static-website&mktingSource=vscode-tutorial-static-website) for a free account with $200 in Azure credits to try out any combination of services.

## Sign in to Azure

[!INCLUDE [azure-sign-in](includes/azure-sign-in.md)]

> [!div class="nextstepaction"]
> [I installed the prerequisites](tutorial-vscode-static-website-node-02.md) [I ran into an issue](https://www.research.net/r/PWZWZ52?tutorial=node-deployment-staticwebsite&step=getting-started)
