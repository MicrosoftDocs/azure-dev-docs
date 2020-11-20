---
title: "Tutorial: Deploy Python apps to Azure App Service on Linux from Visual Studio Code"
description: Tutorial step 1, configure your environment for App Service
ms.topic: conceptual
ms.date: 11/20/2020
ms.custom: devx-track-python, seo-python-october2019
---

# Tutorial: Deploy Python apps to Azure App Service on Linux from Visual Studio Code

This article walks you through using Visual Studio Code to deploy a Python application to Azure App Service on Linux using the [Azure App Service](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azureappservice) extension.

If you encounter issues with any of the steps in this tutorial, we'd love to hear the details. Use the **Having issues? Let us know.** link at the end of each article to submit feedback.

For a demonstration video, see <a href="https://www.youtube.com/watch?v=dNVvFttc-sA&feature=youtu.be&ocid=AID3006292" target="_blank">Build WebApps with VS Code and Azure App Service</a> (youtube.com) from virtual PyCon 2020.

> [!NOTE]
> If you prefer to deploy apps through the CLI, see **[Quickstart: Create a Python app in Azure App Service on Linux](/azure/app-service/quickstart-python)**.

> [!TIP]
> [Azure App Service on Linux](/azure/app-service/overview#app-service-on-linux) runs your source code in a pre-defined Docker container. That container runs apps with Python 3.6+ using the [Gunicorn](https://gunicorn.org) web server. The characteristics of this container are described on [Configure Python apps for App Service on Linux](/azure/app-service/configure-language-python). The container definitionw are on [github.com/Azure-App-Service/python](https://github.com/Azure-App-Service/python/tree/master/).

---

## Configure your environment

- If you don't have an Azure account with an active subscription, [create one for free](https://azure.microsoft.com/free/?utm_source=campaign&utm_campaign=vscode-tutorial-appservice-extension&mktingSource=vscode-tutorial-appservice-extension).

- Make sure you have a [local installation of Python 3.7 or 3.8](https://python.org/downloads). To verify your version, run the following command:

    ```bash
    python --version
    ```

- Install the following software:
  - [Visual Studio Code](https://code.visualstudio.com/).
  - Python and the [Python](https://marketplace.visualstudio.com/items?itemName=ms-python.python) extension as described on [VS Code Python Tutorial - Prerequisites](https://code.visualstudio.com/docs/python/python-tutorial).
  - The [Azure App Service](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azureappservice) extension, which provides interaction with Azure App Service from within VS Code. For general information, explore the [App Service extension tutorial](https://code.visualstudio.com/tutorials/app-service-extension/getting-started) and visit the [vscode-azureappservice GitHub repository](https://github.com/Microsoft/vscode-azureappservice).

---

## Sign in to Azure

[!INCLUDE [azure-sign-in](includes/azure-sign-in.md)]

> [!div class="nextstepaction"]
> [I signed into Azure - continue to step 2 >>>](tutorial-deploy-app-service-on-linux-02.md)

[Having issues? Let us know.](https://aka.ms/FlaskVSCQuickstartHelp)
