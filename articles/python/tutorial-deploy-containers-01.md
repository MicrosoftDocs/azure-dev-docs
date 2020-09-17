---
title: "Tutorial: Deploy Docker containers to Azure App Service with Visual Studio Code"
description: Tutorial step 1, configure your environment for containers
ms.topic: conceptual
ms.date: 09/17/2020
ms.custom: devx-track-python, seo-python-october2019
---

# Tutorial: Deploy Docker containers to Azure App Service with Visual Studio Code

This article walks you through the process of using Visual Studio Code to deploy a container image from a container registry to [Azure App Service](/azure/app-service/).

If you encounter issues with any of the steps in this tutorial, we'd love to hear the details. Use the **This page** feedback button at the end of each article.

For a related demonstration video, see <a href="https://www.youtube.com/watch?v=t79HDLC5kQA&feature=youtu.be&ocid=AID3006292" target="_blank">Django Apps in VS Code dev containers</a> (youtube.com) from virtual PyCon 2020.

## Configure your environment

- An [Azure account](https://azure.microsoft.com/free/?utm_source=campaign&utm_campaign=vscode-tutorial-docker-extension&mktingSource=vscode-tutorial-docker-extension)
- [Visual Studio Code](https://code.visualstudio.com/)
- A suitable container that's been uploaded to a container registry. Details on creating a container with a Python web app can be found on [Python in containers](https://code.visualstudio.com/docs/containers/quickstart-python).
- The [Azure App Service extension for VS Code](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azureappservice).
- The [Docker extension for VS Code](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-docker).

## Sign in to Azure

[!INCLUDE [azure-sign-in](includes/azure-sign-in.md)]

> [!div class="nextstepaction"]
> [I signed into Azure - continue to step 2 >>>](tutorial-deploy-containers-02.md)
