---
title: "Step 2: Prepare an app for deployment to Azure App Service on Linux from Visual Studio Code"
description: Tutorial step 2, set up your application
ms.topic: conceptual
ms.date: 09/12/2019
ms.custom: devx-track-python, seo-python-october2019
---

# 2: Prepare your app for deployment to Azure App Service

[Previous step: configure your environment](tutorial-deploy-app-service-on-linux-01.md)

In this article, you prepare an app to deploy to the Azure App Service for this tutorial. You can use an existing app or create or download an app.

If you already have an app that you'd like to work with, make sure you have a *requirements.txt* file that describes your dependencies, including frameworks like Flask or Django. You can use any framework of your choosing.

If you don't already have an app, use one of the options below. Be sure to verify that the app runs locally.

## Option 1: VS Code Flask tutorial sample

Download or clone [https://github.com/Microsoft/python-sample-vscode-flask-tutorial](https://github.com/Microsoft/python-sample-vscode-flask-tutorial), which is the result of following the [Flask Tutorial](https://code.visualstudio.com/docs/python/tutorial-flask).

## Option 2: VS Code Django tutorial sample

Download or clone [https://github.com/Microsoft/python-sample-vscode-django-tutorial](https://github.com/Microsoft/python-sample-vscode-django-tutorial), which is the result of following the [Django Tutorial](https://code.visualstudio.com/docs/python/tutorial-django).

If your Django app uses a local SQLite database like this sample, you need to include a pre-initialized and pre-populated copy of the *db.sqlite3* file in your repository. The reason for this is that, at present, App Service for Linux doesn't have a means to run Django's `migrate` command as part of deployment, so you must deploy a pre-made database. Even then, the database is effectively read-only; writing to the database also causes errors.

The best option in any case is to use a separate database that's deployed and initialized independently from the app code.

## Option 3: Create a minimal Flask app

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
    Flask==1.1.2
    ```

1. Open a terminal using the menu command **Terminal** > **New Terminal**.

1. In the terminal, create and activate a virtual environment named `env`:

    # [macOS/Linux](#tab/linux)

    ```bash
    sudo apt-get install python3-venv    # If needed
    python3 -m venv env
    source env/bin/activate
    ```

    # [Windows](#tab/windows)

    ```cmd
    python -m venv env
    env\scripts\activate
    ```

    ---

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

1. You can then open the app in a browser using the URL `http://127.0.0.1:5000/`.

> [!div class="nextstepaction"]
> [I have my app ready - continue to step 3 >>>](tutorial-deploy-app-service-on-linux-03.md)

[Having issues? Let us know.](https://aka.ms/FlaskVSCQuickstartHelp)
