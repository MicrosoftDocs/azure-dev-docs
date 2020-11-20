---
title: "Step 2: Prepare an app for deployment to Azure App Service on Linux from Visual Studio Code"
description: Tutorial step 2, set up your application
ms.topic: conceptual
ms.date: 11/20/2020
ms.custom: devx-track-python, seo-python-october2019
---

# 2: Prepare your app for deployment to Azure App Service

[Previous step: configure your environment](tutorial-deploy-app-service-on-linux-01.md)

In this article, you prepare an app to deploy to the Azure App Service for this tutorial. You can use an existing app or create or download an app.

---

## If you already have an app

If you already have an app that you'd like to work with, make sure you have a *requirements.txt* file in your project root that lists your dependencies, including frameworks like Flask or Django. You can use any framework of your choosing.

> [!div class="nextstepaction"]
> [I have my own app ready - continue to step 3 >>>](tutorial-deploy-app-service-on-linux-03.md)

---

## If you don't already have an app

If you don't already have an app, use *one* of the options below. Be sure to verify that the app runs locally.

The remainder of this tutorial uses the code shown in [Option 3](#option-3-create-a-minimal-flask-app).

### Option 1: Use the VS Code Flask tutorial sample

Download or clone [https://github.com/Microsoft/python-sample-vscode-flask-tutorial](https://github.com/Microsoft/python-sample-vscode-flask-tutorial), which is the result of following the [Flask Tutorial](https://code.visualstudio.com/docs/python/tutorial-flask). Note that the app code is in the *hello_app* folder, specifically. Review the sample's *readme.md* file for instructions on running the app locally.

### Option 2: Use the VS Code Django tutorial sample

Download or clone [https://github.com/Microsoft/python-sample-vscode-django-tutorial](https://github.com/Microsoft/python-sample-vscode-django-tutorial), which is the result of following the [Django Tutorial](https://code.visualstudio.com/docs/python/tutorial-django).

Ideally, Django apps deployed to the cloud also use a cloud-based database, such as PostgreSQL for Azure. For more information, see [Tutorial: Deploy a Django web app with PostgreSQL using the Azure portal](tutorial-python-postgresql-app-portal.md).

If your Django app uses a local SQLite database like this sample, it's easiest for this tutorial to include a pre-initialized and pre-populated copy of the *db.sqlite3* file in your repository. Otherwise, you need to configure a post-build command to run Django's `migrate` command in the container to which the app is deployed. For more information, see [App Service configuration - Customize build automation](/app-service/configure-language-python#customize-build-automation).

### Option 3: Create a minimal Flask app

This section describes the minimal Flask app used in this walkthrough.

1. Create a new folder, open it in VS Code, and add a file named *hello.py* with the contents below. The app object is purposely named `myapp` to demonstrate how the names are used in the startup command for the App Service, as you learn later.

    ```python
    from flask import Flask
    myapp = Flask(__name__)

    @myapp.route("/")
    def hello():
        return "Hello Flask, on Azure App Service for Linux"
    ```

1. Create a file named *requirements.txt* with the following contents:

    ```text
    Flask
    ```

1. Open a terminal using the menu command **Terminal** > **New Terminal**.

1. In the terminal, create and activate a virtual environment named `.venv`. 

    # [macOS/Linux](#tab/linux)

    ```bash
    sudo apt-get install python3-venv    # If needed
    python3 -m venv .venv
    source .venv/bin/activate
    ```

    # [Windows](#tab/windows)

    ```cmd
    py -3 -m venv .venv
    .venv\scripts\activate
    ```

    ---

1. When VS Code prompts you to activate the newly-created environment, answer **Yes**.

1. Install the app's dependencies:

    ```cmd
    pip install -r requirements.txt
    ```

1. Set a FLASK_APP environment variable tells Flask where to find the app object:

    # [cmd](#tab/cmd)

    ```cmd
    set FLASK_APP=hello:myapp
    ```

    # [PowerShell](#tab/powershell)

    ```ps
    $env:FLASK_APP = "hello:myapp"
    ```

   # [bash](#tab/bash)

    ```bash
    export FLASK_APP=hello:myapp
    ```

    ---

1. Run the app:

    ```cmd
    flask run
    ```

1. Open the app in a browser using the URL `http://127.0.0.1:5000/`. You should see the message "Hello Flask, on Azure App Service for Linux."

1. Stop the Flask server by pressing **Ctrl**+**C** in the terminal.

> [!div class="nextstepaction"]
> [I have my app ready - continue to step 3 >>>](tutorial-deploy-app-service-on-linux-03.md)

[Having issues? Let us know.](https://aka.ms/FlaskVSCQuickstartHelp)
