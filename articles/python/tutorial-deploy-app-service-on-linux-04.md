---
title: "Step 4: Configure a custom startup file for Python apps on Azure App Service on Linux"
description: Tutorial step 4, instructing App Service how to start the web app including specific instructions for Django, Flask, and other frameworks.
ms.topic: conceptual
ms.date: 11/20/2020
ms.custom: devx-track-python, seo-python-october2019
---

# 4: Configure a custom startup file for Python apps on Azure App Service

[Previous step: create the App Service](tutorial-deploy-app-service-on-linux-03.md)

In this step, you configure a custom startup file, if needed, for a Python app on an Azure App Service.

You need custom startup file in the following cases:

- You want to start the Gunicorn web server with additional arguments beyond the defaults, which are `--bind=0.0.0.0 --timeout 600`.

- Your app is built with a framework other than Flask or Django, or you want to use a different web server.

- You have a Flask app whose main code file is named something **other** than *app.py* or *application.py**, or the app object is named something **other** than `app`.

    In other words, unless you have an *app.py* or *application.py* in the root folder of your project, *and* the Flask app object is named `app`, then you need a custom startup command.

    For instance, the main file in the code example from [Step 2](tutorial-deploy-app-service-on-linux-02.md) is named *hello.py* and the app object is called `myapp`, so a custom startup file is necessary as shown in this article.

For more information, see [Configure Python Apps - Container startup process](/azure/app-service/configure-language-python#container-startup-process).

## Create a startup file

When you need a custom startup file, use the following steps:

1. Create a file in your project named *startup.txt*, *startup.sh*, or another name of your choice that contains your startup command(s). See the later sections in this article for specifics on Django, Flask, and other frameworks.

    A startup file can include multiple commands if needed.

1. Commit the file to your code repository so it can be deployed with the rest of the app.

1. In the **Azure: App Service** explorer, expand the App Service, right-click **Application Settings**, and select **Open in Portal**:

    ![Open Application Settings in Portal in the App Service explorer](media/deploy-azure/open-application-settings-in-portal-for-app-service.png)

1. In the Azure portal, sign in if necessary; then on the **Configuration** page, select **General settings**, enter the name of your startup file (like *startup.txt* or *startup.sh*) under **Stack settings** > **Startup Command**, then select **Save**.

    ![Setting the Startup Command file name in the Azure portal](media/deploy-azure/enter-startup-file-for-app-service-in-the-azure-portal.png)

    > [!NOTE]
    > Instead of using a startup command file, you can put the startup command itself directly in the **Startup Command** field on the Azure portal. Using a command file is preferable, however, because this part of your configuration is then in your repository where you can audit changes and redeploy to a different App Service instance altogether.

1. The App Service restarts when you save changes.

    Because you still haven't deployed your app code, however, visiting the site at this point shows "Application Error." This message indicates that the Gunicorn server started but failed to find the app, and therefore nothing is responding to HTTP requests. You deploy your app code in the next step.

## Django startup commands

By default, App Service automatically locates the folder that contains your *wsgi.py* file and starts Gunicorn with the following command:

```sh
# <module> is the folder that contains wsgi.py. If you need to use a subfolder,
# specify the parent of <module> using --chdir.
gunicorn --bind=0.0.0.0 --timeout 600 <module>.wsgi
```

If you want to change any of the Gunicorn arguments, such as using `--timeout 1200`, then create a command file with those modifications.

## Flask startup commands

By default, the App Service on Linux container assumes that a Flask app's WSGI callable is named `app` and is contained in a file named *application.py* or *app.py* and resides in the app's root folder.

If you use any of the following variations, then your custom startup command must identify the app object's location in the format *file:app_object*:

- **Different file name and/or app object name**: for example, if the app's main code file is *hello.py* and the app object is named `myapp`, the startup command is as follows:

    ```text
    gunicorn --bind=0.0.0.0 --timeout 600 hello:myapp
    ```

- **Startup file is in a subfolder**: for example, if the startup file is *myapp/website.py* and the app object is `app`, then use Gunicorn's `--chdir` argument to specify the folder and then name the startup file and app object as usual:

    ```text
    gunicorn --bind=0.0.0.0 --timeout 600 --chdir myapp website:app
    ```

- **Startup file is within a module**: in the [python-sample-vscode-flask-tutorial](https://github.com/Microsoft/python-sample-vscode-flask-tutorial) code, the *webapp.py* startup file is contained within the folder *hello_app*, which is itself a module with an *\_\_init\_\_.py* file. The app object is named `app` and is defined in *\_\_init\_\_.py* and *webapp.py* uses a relative import.

    Because of this arrangement, pointing Gunicorn to `webapp:app` produces the error, "Attempted relative import in non-package," and the app fails to start.

    In this situation, create a simple shim file that imports the app object from the module, and then have Gunicorn launch the app using the shim. The [python-sample-vscode-flask-tutorial](https://github.com/Microsoft/python-sample-vscode-flask-tutorial) code, for example, contains *startup.py* with the following contents:

    ```python
    # startup.py shim
    from hello_app.webapp import app
    ```

    The startup command is then the following:

    ```text
    gunicorn --bind=0.0.0.0 --timeout 600 startup:app
    ```


## Startup commands for other frameworks and web servers

The App Service container that runs Python apps has Django and Flask installed by default, along with the gunicorn web server.

To use a framework other than Django or Flask (such as Falcon, FastAPI, etc.), or to use a different web server, do the following:

- Include the framework and/or web server in your *requirements.txt* file.

- In your startup command, identify the WSGI callable as described in the [previous section for Flask](#flask-startup-commands).

- To launch a web server other than gunicorn, use a `python -m` command instead of invoking the server directly. For example, the following command starts the uvicorn server, assuming that the WSGI callable is named `app` and is found in *application.py*:

    ```sh
    python -m uvicorn application:app --host 0.0.0.0
    ```

    You use `python -m` because web servers installed via *requirements.txt* are not added to the Python global environment and therefore cannot be invoked directly. The `python -m` command invokes the server from within the current virtual environment.

> [!div class="nextstepaction"]
> [I configured my startup file - continue to step 5 >>>](tutorial-deploy-app-service-on-linux-05.md)

[Having issues? Let us know.](https://aka.ms/FlaskVSCQuickstartHelp)
