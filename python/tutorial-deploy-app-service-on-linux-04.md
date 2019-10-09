---
title: "Tutorial: Configure a custom startup file for Python apps on Azure App Service on Linux"
description: Tutorial step 4, instructing App Service how to start the web app.
services: app-service
author: kraigb
manager: barbkess
ms.service: app-service
ms.topic: conceptual
ms.date: 09/12/2019
ms.author: kraigb
ms.custom: seo-python-october2019
---

# Tutorial: Configure a custom startup file for Python apps on Azure App Service

[Previous step: create the App Service](tutorial-deploy-app-service-on-linux-02.md)

Depending on how you've structured your app, you may need to create a custom startup command file for your app as described on [Configure Python apps for App Service on Linux](https://docs.microsoft.com/azure/app-service/containers/how-to-configure-python) in the Azure docs.

The specific use cases of a custom startup command are as follows:

- You have a **Flask** app whose startup file and app object are named something **other** than *application.py* and `app`, respectively. In other words, unless you have an *application.py* in the root folder of your project, *and* the Flask app object is named `app`, then you need a custom startup command.
- You want to start the Gunicorn web server with additional arguments beyond the defaults, which are `--bind=0.0.0.0 --timeout 600`.

## Create a startup file

If you need a custom startup file, use the following steps:

1. Create a file in your project named *startup.txt* (or another name of your choice) that contains your startup command. For Flask, see [Flask startup commands](#flask-startup-commands) in the next section. Django apps typically don't need customization.

1. Commit the file to your code repository so it can be deployed with the rest of the app.

1. In the **Azure: App Service** explorer, expand the App Service, right-click **Application Settings**, and select **Open in Portal**:

    ![Open Settings in Portal command in the App Service explorer](media/deploy-azure/open-settings-in-portal-command.png)

1. In the Azure portal, sign in if necessary; then on the **Configuration** page, select **General settings**, enter the name of your startup file (like *startup.txt*) under **Stack settings** > **Startup Command**, then select **Save**.

    ![Setting the startup file name in the Azure portal](media/deploy-azure/azure-portal-startup-file.png)

    > [!NOTE]
    > Instead of using a startup command file, you can also put the startup command directly in the **Startup Command** field on the Azure portal. Using a file is generally preferable, however, as it keeps this bit of configuration in your repository where you can audit changes and redeploy to a different App Service instance altogether.

1. The App Service restarts when you save changes. Because you still haven't deployed your app code, however, visiting the site at this point shows "Application Error." This message indicates that the Gunicorn server started but failed to find the app, and therefore nothing is responding to HTTP requests. You deploy your app code in the next step.

## Django startup commands

By default, App Service automatically locates the folder that contains your *wsgi.py* file and starts Gunicorn with the following command:

```bash
# <module> is the path to the folder that contains wsgi.py
gunicorn --bind=0.0.0.0 --timeout 600 <module>.wsgi
```

If you want to change any of the Gunicorn arguments, such as using `--timeout 1200`, then create a command file with those modifications.

## Flask startup commands

By default, the App Service on Linux container assumes that a Flask app's startup file is named *application.py* and resides in the app's root folder. It further assumes that the Flask app object defined within that file is named `app`. If your app isn't structured in this exact way, then your custom startup command must identify the app object's location:

1. **Different file name and/or app object name**: for example, if the app's startup file is *hello.py* and the app object is named `myapp`, the startup command is as follows:

    ```text
    gunicorn --bind=0.0.0.0 --timeout 600 hello:myapp
    ```

1. **Startup file is in a subfolder**: for example, if the startup file is *myapp/website.py* and the app object is `app`, then use Gunicorn's `--chdir` argument to specify the folder and then name the startup file and app object as usual:

    ```text
    gunicorn --bind=0.0.0.0 --timeout 600 --chdir myapp website:app
    ```

1. **Startup file is within a module**: in the [python-sample-vscode-flask-tutorial](https://github.com/Microsoft/python-sample-vscode-flask-tutorial) code, the *webapp.py* startup file is contained within the folder *hello_app*, which is itself a module with an *\_\_init\_\_.py* file. The app object is named `app` and is defined in *\_\_init\_\_.py* and *webapp.py* uses a relative import. Because of this arrangement, pointing Gunicorn to `webapp:app` produces the error, "Attempted relative import in non-package," and the app fails to start.

    In this situation, create a simple shim file that imports the app object from the module, and then have Gunicorn launch the app using the shim. The [python-sample-vscode-flask-tutorial](https://github.com/Microsoft/python-sample-vscode-flask-tutorial) code, for example, contains *startup.py* with the following contents:

    ```python
    # startup.py shim
    from hello_app.webapp import app
    ```

    The startup command is then the following:

    ```text
    gunicorn --bind=0.0.0.0 --timeout 600 startup:app
    ```

> [!div class="nextstepaction"]
> [I configured my startup file](tutorial-deploy-app-service-on-linux-05.md)

[I ran into an issue](https://www.research.net/r/PWZWZ52?tutorial=vscode-appservice-python&step=04-startup-command)
