---
title: Create a dev environment in GitHub Codespaces with FastAPI and Postgres.
description: How to set up a Python dev environment in GitHub Codespaces with FastAPI and Postgres.
ms.date: 05/11/2023
ms.topic: conceptual
ms.custom: devx-track-python
---

# Create a dev environment in Codespaces with FastAPI and Postgres

This article shows you how to run FastAPI and Postgres together in a development environment using GitHub Codepaces. Codespaces is a development environment hosted in the cloud.  Using Codespaces (or equivalent Dev Container locally) enables you to create a configurable and repeatable development environment.

You can open the sample repo in a [browser](https://docs.github.com/en/codespaces/developing-in-codespaces/creating-a-codespace-for-a-repository) or IDE like [VS Code](https://code.visualstudio.com/docs/remote/codespaces) with the [GitHub Codespaces extension](https://marketplace.visualstudio.com/items?itemName=GitHub.codespaces).

You can also clone the sample repo and when you open the project in VS Code, you have the option to run as a [Dev Container](https://code.visualstudio.com/docs/devcontainers/containers). VS Code Dev Container require that Docker is install locally. If you don't have Docker installed.

If you use Codespaces in a browser or VS Code, keep in mind that you have a fixed number of core hours free per month. This tutorial requires less than one core hour to complete. For more information, see [About billing for GitHub Codespaces](https://docs.github.com/en/billing/managing-billing-for-github-codespaces/about-billing-for-github-codespaces).

With the approach shown here, you can start with the sample code and use it to run other framework like Django or Flask. 

## Start the dev environment in Codespaces

There are many possible paths to create and use GitHub Codespaces. This is just one path you can start with.

1. Go to sample app repo in /Azure-Samples/msdocs-fastapi-postgres-codespace

1. Select **Code**, **Codespaces** tab, and **+** to create a new codespace.

1. When the container finishes building, you'll have a codespace for the project running in a browser.

    See the section [About the project devcontainer](#below) for information about how the container is built.

    > [!TIP]
    > You can also run the codespace in a VS COde. Select **Codespaces** in lower left corner of the browser or CTRL+SHIFT+P and type "Codespaces". Then select **Open in VS Code**. Also, if you stop Codespaces and go back to the repo and open again in Codespace, you can open in VS Code or a browser.

1. Click **PORTS** to show that PostgreSQL is running on port 5432.

1. Select *.env.devcontainer* and create a copy called *.env* with the same contents.

1. CTRL + SHIFT + P and type "Terminal: Create New Terminal" and select to create a new terminal.

1. Run the FastAPI app with

    ```bash
    uvicorn main:app --reload
    ```

1. Click the notification **Open in Browser**.

    If you don't see or missed the notification, got **PORTS** and find the **Local Address* for port 8000. This is the URL to use.

1. Add */docs* on the end of the preview URL to see the API methods.

1. In the preview ULR page, run the POST method to add a restaurant.

    Be sure to fill in the request body and select **Execute** to commit the change.

    ```json
    {
      "name": "restaurant 1",
      "address": "test address"
    }
    ```

1. Back Codespaces for the project, select the SQLTools extension, then select **Local database** to connect.

1. Expand the **Local database** node until you find the *restaurants* table, right select **Show Table Records**.

    You should see the restaurant you added.

## About the project devcontainer.json

This information is optional. For an overview of GitHub Codespaces, see [GetHub Codespaces overview](https://docs.github.com/codespaces/overview). 

A codespace is a development environment that's hosted in the cloud. You can customize your project for GitHub Codespaces by committing configuration files to your repository (often known as Configuration-as-Code), which creates a repeatable codespace configuration for all users of your project.

The sample repo (link) has all the configuration needed to create a FastAPI app with Postgres environment and run them. The key files are *devcontainer.json*, *Dockerfile*, and *docker-compose.yml*.

The *devcontainer.json* file defines frameworks, tools, extensions, and port forwarding. The *Dockerfile* contains the instructions for creating a Docker container image.


## Clean up

To stop using the codespace, close the browser. (Or, close VS Code if you opened it that way.)

If you plan on using the codespace again, you can keep it and you won't be charged if it isn't used.

Go to https://github.com/codespaces to manage you codespaces, including restarting and deleting codespaces.


## Next steps

* [Develop a Python web app](/azure/app-service/quickstart-python?toc=/azure/developer/python/toc.json&bc=/azure/developer/breadcrumb/toc.json)
* [Develop a container app](./containers-in-azure-overview-python.md)
* [Learn to use the Azure libraries for Python](./sdk/azure-sdk-overview.md)
