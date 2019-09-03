---
title: Deploy Python apps to Azure App Service on Linux from Visual Studio Code
description: Tutorial part 1, introduction and prerequistites.
services: app-service
author: kraigb
manager: barbkess
ms.service: app-service
ms.topic: conceptual
ms.date: 09/02/2019
ms.author: kraigb
---

# Deploy to Azure App Service on Linux

This tutorial walks you through using Visual Studio Code to deploy a Python application to Azure App Service on Linux using the [Azure App Service](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azureappservice) extension.

[Azure App Service on Linux](https://docs.microsoft.com/azure/app-service/containers/app-service-linux-intro), currently in Preview for Python, runs your source code in a pre-defined Docker container. The characteristics of this container are summarized as follows (for full documentation, see [Configure Python apps for App Service on Linux](https://docs.microsoft.com/azure/app-service/containers/how-to-configure-python)):

- Apps are run with Python 3.7 using the [Gunicorn](https://gunicorn.org) web server.
- The container includes [Flask](https://http://flask.pocoo.org) by default but not [Django](https://www.djangoproject.com).
- To install Django and any other dependencies, you **must** provide a *requirements.txt* file and deploy to App Service using Git, as shown in this tutorial. For App Service to install dependencies, *requirements.txt* must be deployed to the root folder.
- Although the container can run Django and Flask apps automatically, provided the app matches an expected structure, you can also provide a custom startup command file through which you have full control over the Gunicorn command line. A custom startup command is typically required for Flask apps, but not Django apps.
- The container definition itself is on the [github.com/Azure-App-Service/python](https://github.com/Azure-App-Service/python/tree/master/3.7).

If you encounter issues with any of the steps in this tutorial, we'd love to hear the details. Use the **I ran into an issue** button at the end of each article to submit feedback.

## Prerequisites

- An [Azure subscription](#azure-subscription).
- [Visual Studio Code with the Azure Functions extension](#visual-studio-code-python-and-the-azure-app-service-extension).
- A Python environment
- [An app you'd like to deploy](#your-application).

### Azure subscription

If you don't have an Azure subscription, [sign up now](https://azure.microsoft.com/free/?utm_source=campaign&utm_campaign=vscode-tutorial-appservice-extension&mktingSource=vscode-tutorial-appservice-extension) for a free account with $200 in Azure credits to try out any combination of services.

### Visual Studio Code, Python, and the Azure App Service extension

Install the following software:

- [Visual Studio Code](https://code.visualstudio.com/).
- Python and the [Python](https://marketplace.visualstudio.com/items?itemName=ms-python.python) extension as described on [VS Code Python Tutorial - Prerequisites](https://code.visualstudio.com/docs/python/python-tutorial.md).
- The [Azure App Service](vscode:extension/ms-azuretools.vscode-azureappservice) extension, which provides interaction with Azure App Service from within VS Code. For general information, explore the [App Service extension tutorial](https://code.visualstudio.com/tutorials/app-service-extension/getting-started) and visit the [vscode-azureappservice GitHub repository](https://github.com/Microsoft/vscode-azureappservice).

### Sign in to Azure

Once the App Service extension is installed, sign into your Azure account by navigating to the **Azure: App Service** explorer, select **Sign in to Azure**, and follow the prompts.

![Sign in to Azure through VS Code](media/deploy-azure/azure-sign-in.png)

After signing in, verify that you see the email account of your Azure around in the Status Bar and your subscription(s) in the **Azure: App Service** explorer:

![VS Code status bar showing Azure account](media/deploy-azure/azure-account-status-bar.png)

![VS Code Azure App Service explorer showing subscriptions](media/deploy-azure/azure-subscription-view.png)

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

### Your application

If you don't already have an app you'd like to work with, use one of the options below. Be sure to verify that the app runs locally.

- Create a new folder, open it in VS Code, and add a file named *hello.py* with the contents below, which creates a minimal Flask app as used in this walkthrough. The app object is purposely named `myapp` to demonstrate how the names are used in the startup command for the App Service, as you see later.

    Also follow the instructions in [Flask Tutorial - Create a project environment for Flask](/docs/python/tutorial-flask.md#create-a-project-environment-for-flask) to create a virtual environment with Flask installed within which you can run the app locally.

    ```python
    from flask import Flask
    myapp = Flask(__name__)

    @myapp.route("/")
    def hello():
        return "Hello Flask, on Azure App Service for Linux"
    ```

- [python-sample-vscode-flask-tutorial](https://github.com/Microsoft/python-sample-vscode-flask-tutorial), which is the result of following the [Flask Tutorial](/docs/python/tutorial-flask.md).

- [python-sample-vscode-django-tutorial](https://github.com/Microsoft/python-sample-vscode-django-tutorial), which is the result of following the [Django Tutorial](/docs/python/tutorial-django.md).

    > [!IMPORTANT]
    > Caveat: If your Django app uses a local SQLite database like this sample, you need to include a pre-initialized and pre-populated copy of the *db.sqlite3* file in your repository. The reason for this is that, at present, the preview of App Service for Linux doesn't have a means to run Django's `migrate` command as part of deployment, so you must deploy a pre-made database. Even then, the database is effectively read-only; writing to the database also causes errors. The workaround is to use a database that's hosted elsewhere, in which case you would deploy and initialize that database separately before deploying the app code as described in this tutorial.

> [!div class="nextstepaction"]
> [Next: Create the App Service](tutorial-deploy-app-service-on-linux-02.md) [I ran into an issue](https://www.research.net/r/PWZWZ52?tutorial=vscode-appservice&step=01-verify-prerequisites)
