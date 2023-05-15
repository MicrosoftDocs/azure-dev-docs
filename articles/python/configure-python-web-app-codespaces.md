---
title: Create a dev environment in GitHub Codespaces with FastAPI and Postgres.
description: How to set up a Python dev environment in GitHub Codespaces with FastAPI and Postgres.
ms.date: 05/14/2023
ms.topic: conceptual
ms.custom: devx-track-python
---

# Create a dev environment in GitHub Codespaces with FastAPI and Postgres

This article shows you how to run FastAPI and Postgres together in a development environment using [GitHub Codespaces][1]. Codespaces is a development environment hosted in the cloud.  Using Codespaces enables you to create a configurable and repeatable development environment.

You can open the sample repo in a [browser][4] or IDE like [VS Code][6] with the [GitHub Codespaces extension][5].

You can also clone the sample repo and when you open the project in VS Code, you can run in [Visual Studio Dev Containers][2]. Dev Containers requires that [Docker Desktop][3] is install locally. If you don't have Docker installed, you can still use VS Code to run the project, but you're using GitHub Codespaces as the environment.

If you use Codespaces in a browser or VS Code, keep in mind that you have a fixed number of core hours free per month. This tutorial requires less than one core hour to complete. For more information, see [About billing for GitHub Codespaces][7].

With the approach shown here, you can start with the sample code and use it to run other Python frameworks like Django or Flask. 

## Start the dev environment in Codespaces

There are many possible paths to create and use GitHub Codespaces. This tutorial shows one path you can start with.

1. Go to sample app repo in /Azure-Samples/msdocs-fastapi-postgres-codespace

    The sample repo has all the configuration needed to create a FastAPI app with a Postgres database environment and run them in an environment. You can create a similar project following the steps in [Setting up a Python project for GitHub Codespaces][8].

1. Select **Code**, **Codespaces** tab, and **+** to create a new codespace.

    :::image type="content" source="./media/codespaces-tutorial/create-codespaces.png" alt-text="Create a codespaces from GitHub repo." lightbox="./media/codespaces-tutorial/create-codespaces.png":::
    
1. When the container finishes building, codespace is running in a browser with the sample project.

    A codespace is a development environment that's hosted in the cloud. The configuration key files are *devcontainer.json*, *Dockerfile*, and *docker-compose.yml*. For more information, see [GitHub Codespaces overview][1].

    > [!TIP]
    > You can also run the codespace in a Visual Studio Code. Select **Codespaces** in lower left corner of the browser or (`Ctrl` + `Shift` + `P` / `Ctrl` + `Command` + `P`) and type "Codespaces". Then select **Open in VS Code**. Also, if you stop Codespaces and go back to the repo and open it again in GitHub Codespaces, you can open in VS Code or a browser.

1. Open the Command Palette (`Ctrl` + `Shift` + `P` / `Ctrl` + `Command` + `P`) and type "Terminal: Create New Terminal" and select to create a new terminal.

1. Select the **PORTS** in the terminal window to show that PostgreSQL is running on port 5432.

1. Select the *.env.devcontainer* file and create a copy called *.env* with the same contents.

1. Run the FastAPI app with

    ```bash
    uvicorn main:app --reload
    ```

1. Select the notification **Open in Browser**.

    If you don't see or missed the notification, go to **PORTS** and find the **Local Address* for port 8000. Use the URL listed there.

1. Add */docs* on the end of the preview URL to see the API methods.

1. In the preview page, run the POST method to add a restaurant.

    Be sure to fill in the request body and select **Execute** to commit the change.

    ```json
    {
      "name": "restaurant 1",
      "address": "an address"
    }
    ```

## Connect to the Postgres database

1. Go back to the GitHub Codespace for the project, select the SQLTools extension, and then select **Local database** to connect.

1. Expand the **Local database** node until you find the *restaurants* table, right select **Show Table Records**.

    You should see the restaurant you added.

## Clean up

To stop using the codespace, close the browser. (Or, close VS Code if you opened it that way.)

If you plan on using the codespace again, you can keep it, and you aren't be charged if it isn't used.

Go to https://github.com/codespaces to manage your codespaces, including restarting and deleting codespaces.


## Next steps

* [Develop a Python web app][9]
* [Develop a container app][10]
* [Learn to use the Azure libraries for Python][11]

[1]: https://docs.github.com/codespaces
[2]: https://code.visualstudio.com/docs/devcontainers/containers
[3]: https://www.docker.com/products/docker-desktop/
[4]: https://docs.github.com/codespaces/developing-in-codespaces/creating-a-codespace-for-a-repository
[5]: https://marketplace.visualstudio.com/items?itemName=GitHub.codespaces
[6]: https://code.visualstudio.com/docs/remote/codespaces
[7]: https://docs.github.com/en/billing/managing-billing-for-github-codespaces/about-billing-for-github-codespaces
[8]: https://docs.github.com/en/codespaces/setting-up-your-project-for-codespaces/adding-a-dev-container-configuration/setting-up-your-python-project-for-codespaces
[9]: /azure/app-service/quickstart-python?toc=/azure/developer/python/toc.json&bc=/azure/developer/breadcrumb/toc.json
[10]: ./containers-in-azure-overview-python.md
[11]: ./sdk/azure-sdk-overview.md