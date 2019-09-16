---
title: Prepare an app for deployment to Azure App Service on Linux from Visual Studio Code
description: Tutorial step 2, set up your application
services: app-service
author: kraigb
manager: barbkess
ms.service: app-service
ms.topic: conceptual
ms.date: 09/12/2019
ms.author: kraigb
---

# Prepare your app

[Previous step: prerequisites](tutorial-deploy-app-service-on-linux-01.md)

If you already have an app that you'd like to work with, make sure you have a *requirements.txt* file that describes your dependencies, including frameworks like Flask or Django.

If you don't already have an app, use one of the options below. Be sure to verify that the app runs locally.

## Minimal Flask app

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
    Flask==1.1.1
    ```

1. Follow the instructions in [Flask Tutorial - Create a project environment for Flask](/docs/python/tutorial-flask.md#create-a-project-environment-for-flask) to create a virtual environment with Flask installed within which you can run the app locally.

1. To run this app, use the following commands (depending on your operating system). The FLASK_APP environment variable tells Flask where to find the app object.

    ```ps
    set FLASK_APP=hello:myapp
    flask run
    ```

    ```bash
    export FLASK_APP=hello:myapp
    flask run
    ```

    You can then open the app in a browser using the URL `http://127.0.0.1:5000/`.

## VS Code Flask tutorial sample

Download or clone [python-sample-vscode-flask-tutorial](https://github.com/Microsoft/python-sample-vscode-flask-tutorial), which is the result of following the [Flask Tutorial](/docs/python/tutorial-flask.md).

## VS Code Django tutorial sample

Download or clone [python-sample-vscode-django-tutorial](https://github.com/Microsoft/python-sample-vscode-django-tutorial), which is the result of following the [Django Tutorial](/docs/python/tutorial-django.md).

If your Django app uses a local SQLite database like this sample, you need to include a pre-initialized and pre-populated copy of the *db.sqlite3* file in your repository. The reason for this is that, at present, App Service for Linux doesn't have a means to run Django's `migrate` command as part of deployment, so you must deploy a pre-made database. Even then, the database is effectively read-only; writing to the database also causes errors.

The best option in any case is to use a separate database that's deployed and initialized independently from the app code.

> [!div class="nextstepaction"]
> [I have my app ready](tutorial-deploy-app-service-on-linux-03.md)

[I ran into an issue](https://www.research.net/r/PWZWZ52?tutorial=vscode-appservice-python&step=02-prepare-app)
