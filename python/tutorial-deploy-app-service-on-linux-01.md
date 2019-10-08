---
title: "Tutorial: Deploy Python apps to Azure App Service on Linux from Visual Studio Code"
description: Tutorial step 1, introduction, prerequisites, and signing into Azure.
services: app-service
author: kraigb
manager: barbkess
ms.service: app-service
ms.topic: conceptual
ms.date: 09/12/2019
ms.author: kraigb
ms.custom: seo-python-october2019
---

# Deploy to Azure App Service on Linux

This article walks you through using Visual Studio Code to deploy a Python application to Azure App Service on Linux using the [Azure App Service](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azureappservice) extension.

If you encounter issues with any of the steps in this tutorial, we'd love to hear the details. Use the **I ran into an issue** link at the end of each article to submit feedback.

> [!TIP]
> [Azure App Service on Linux](https://docs.microsoft.com/azure/app-service/containers/app-service-linux-intro), currently in Preview for Python, runs your source code in a pre-defined Docker container. That container runs apps with Python 3.7 using the [Gunicorn](https://gunicorn.org) web server. The characteristics of this container are described on [Configure Python apps for App Service on Linux](https://docs.microsoft.com/azure/app-service/containers/how-to-configure-python). The container definition itself is on the [github.com/Azure-App-Service/python](https://github.com/Azure-App-Service/python/tree/master/3.7).

## Prerequisites

- An [Azure subscription](#azure-subscription).
- [Visual Studio Code with the Azure App Service extension](#visual-studio-code-python-and-the-azure-app-service-extension).
- A Python environment

### Azure subscription

If you don't have an Azure subscription, [sign up now](https://azure.microsoft.com/free/?utm_source=campaign&utm_campaign=vscode-tutorial-appservice-extension&mktingSource=vscode-tutorial-appservice-extension) for a free account with $200 in Azure credits to try out any combination of services.

### Visual Studio Code, Python, and the Azure App Service extension

Install the following software:

- [Visual Studio Code](https://code.visualstudio.com/).
- Python and the [Python](https://marketplace.visualstudio.com/items?itemName=ms-python.python) extension as described on [VS Code Python Tutorial - Prerequisites](https://code.visualstudio.com/docs/python/python-tutorial).
- The [Azure App Service](vscode:extension/ms-azuretools.vscode-azureappservice) extension, which provides interaction with Azure App Service from within VS Code. For general information, explore the [App Service extension tutorial](https://code.visualstudio.com/tutorials/app-service-extension/getting-started) and visit the [vscode-azureappservice GitHub repository](https://github.com/Microsoft/vscode-azureappservice).

## Sign in to Azure

[!INCLUDE [azure-sign-in](includes/azure-sign-in.md)]

> [!div class="nextstepaction"]
> [I signed into Azure](tutorial-deploy-app-service-on-linux-02.md)

[I ran into an issue](https://www.research.net/r/PWZWZ52?tutorial=vscode-appservice-python&step=01-verify-prerequisites)
