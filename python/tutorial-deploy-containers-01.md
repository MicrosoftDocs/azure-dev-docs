---
title: Deploy Docker containers to Azure App Service with Visual Studio Code
description: description: Tutorial part 1, introduction and prerequistites.
services: app-service
author: kraigb
manager: barbkess
ms.service: app-service
ms.topic: conceptual
ms.date: 09/02/2019
ms.author: kraigb
---

# Deploy containers to Azure App Service

This tutorial walks you through the process of using Visual Studio Code to deploy a container image from a container registry to [Azure App Service](https://azure.microsoft.com/services/app-service/containers/), all within Visual Studio Code.

If you encounter issues with any of the steps in this tutorial, we'd love to hear the details. Use the **I ran into an issue** button at the end of each article to submit feedback.

## Prerequisites

- An [Azure account](https://azure.microsoft.com/free/?utm_source=campaign&utm_campaign=vscode-tutorial-docker-extension&mktingSource=vscode-tutorial-docker-extension)
- [Visual Studio Code](https://code.visualstudio.com/)
- A suitable container that's been uploaded to a container registry. For example, details on creating a container with a Python web app can be found on [Create a container](https://code.visualstudio.com/python/tutorial-create-containers.md).
- The [Azure App Service extension for VS Code](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azureappservice).
- The [Docker extension for VS Code](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-docker).

> [!div class="nextstepaction"]
> [Install the Azure App Service extension](vscode:extension/ms-azuretools.vscode-azureappservice")
> [Install the Docker extension](vscode:extension/ms-azuretools.vscode-docker)

## Sign in to Azure

Once the Azure App Service extension is installed, sign into your Azure account by navigating to the **Azure: App Service** explorer, select **Sign in to Azure**, and follow the prompts.

![Sign in to Azure through VS Code](media/deploy-containers/azure-sign-in.png)

After signing in, verify that you see the email account of your Azure around in the Status Bar and your subscription(s) in the **Azure: App Service** explorer:

![VS Code status bar showing Azure account](media/deploy-containers/azure-account-status-bar.png)

![VS Code Azure App Service explorer showing subscriptions](media/deploy-containers/azure-subscription-view.png)

> [!NOTE]
> If you see the error **"Cannot find subscription with name [subscription ID]"**, this may be because you are behind a proxy and unable to reach the Azure API. Configure `HTTP_PROXY` and `HTTPS_PROXY` environment variables with your proxy information in your terminal:
>
> ```sh
> # macOS/Linux
> export HTTPS_PROXY=https://username:password@proxy:8080
> export HTTP_PROXY=http://username:password@proxy:8080
>
> #Windows
> set HTTPS_PROXY=https://username:password@proxy:8080
> set HTTP_PROXY=http://username:password@proxy:8080
> ```

> [!div class="nextstepaction"]
> [Next: Deploy the image to Azure](tutorial-deploy-containers-02.md) [I ran into an issue](https://www.research.net/r/PWZWZ52?tutorial=vscode-appservice-containers&step=01-verify-prerequisites)
