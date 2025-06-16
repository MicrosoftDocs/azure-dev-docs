---
title: Create a dev environment in GitHub Codespaces with FastAPI and Postgres.
description: How to set up a Python development environment in GitHub Codespaces with FastAPI and Postgres.
ms.date: 06/24/2024
ms.topic: how-to
ms.custom: devx-track-python
---

# Create a GitHub Codespaces dev environment with FastAPI and Postgres

This article shows you how to run FastAPI and Postgres together in a [GitHub Codespaces][1] environment. Codespaces is a development environment hosted in the cloud. Codespaces enables you to create configurable and repeatable development environments.

You can open the sample repo in a [browser][4] or in an integrated development environment (IDE) like [Visual Studio Code][6] with the [GitHub Codespaces extension][5].

You can also clone the sample repo locally and when you open the project in Visual Studio Code, you can run using [Dev Containers][2]. Dev Containers requires that [Docker Desktop][3] installed locally. If you don't have Docker installed, you can still use VS Code to run the project, but you're using GitHub Codespaces as the environment.

When using GitHub Codespaces, keep in mind that you have a fixed number of core hours free per month. This tutorial requires less than one core hour to complete. For more information, see [About billing for GitHub Codespaces][7].

With the approach shown in this tutorial, you can start with the sample code and modify it to run other Python frameworks like Django or Flask. 

## Start the dev environment in Codespaces

There are many possible paths to create and use GitHub Codespaces. This tutorial shows one path you can start with.

1. Go to sample app repo [https://github.com/Azure-Samples/msdocs-fastapi-postgres-codespace][0].

    The sample repo has all the configuration needed to create an environment with a FastAPI app using a Postgres database. You can create a similar project following the steps in [Setting up a Python project for GitHub Codespaces][8].

1. Select **Code**, **Codespaces** tab, and **+** to create a new codespace.

    :::image type="content" source="./media/codespaces-tutorial/create-codespaces-small.png" alt-text="Screenshot showing how to create a codespace from the GitHub repo." lightbox="./media/codespaces-tutorial/create-codespaces.png":::
    
1. When the container finishes building, confirm that you see **Codespaces** in the lower left corner of the browser, and that sample repo has loaded.

    The codespace key configuration files are *devcontainer.json*, *Dockerfile*, and *docker-compose.yml*. For more information, see [GitHub Codespaces overview][1].

    > [!TIP]
    > You can also run the codespace in Visual Studio Code. Select **Codespaces** in lower left corner of the browser or (`Ctrl` + `Shift` + `P` / `Ctrl` + `Command` + `P`) and type "Codespaces". Then select **Open in VS Code**. Also, if you stop the codespace and go back to the repo and open it again in GitHub Codespaces, you have the option to open it in VS Code or a browser.

1. Select the *.env.devcontainer* file and create a copy called *.env* with the same contents.

    The *.env* contains environment variables that are used in the code to connect to the database.

1. If a terminal window isn't already open, open one by opening the Command Palette (`Ctrl` + `Shift` + `P` / `Ctrl` + `Command` + `P`), typing "Terminal: Create New Terminal", and selecting it to create a new terminal.

1. Select the **PORTS** tab in the terminal window to confirm that PostgreSQL is running on port 5432.

1. In the terminal window, run the FastAPI app.

    ```bash
    uvicorn main:app --reload
    ```

1. Select the notification **Open in Browser**.

    If you don't see or missed the notification, go to **PORTS** and find the **Local Address** for port 8000. Use the URL listed there.

1. Add */docs* on the end of the preview URL to see the [Swagger UI][12], which allows you to test the API methods.

    The API methods are generated from the OpenAPI interface that FastAPI creates from the code.

    :::image type="content" source="./media/codespaces-tutorial/codespaces-fastapi-openapi-interface-small.png" alt-text="Screenshot showing the FastAPI Swagger UI." lightbox="./media/codespaces-tutorial/codespaces-fastapi-openapi-interface.png":::


1. On the Swagger page, run the POST method to add a restaurant.

    1. Expand the **POST** method.

    1. Select **Try it out**.

    1. Fill in the request body.

        ```json
        {
          "name": "Restaurant 1",
          "address": "Restaurant 1 address"
        }
        ```

    1. Select **Execute** to commit the change

## Connect to the database and view the data

1. Go back to the GitHub Codespace for the project, select the SQLTools extension, and then select **Local database** to connect.

    The SQLTools extension should be installed when the container is created. If the SQLTools extension doesn't appear in the Activity Bar, close the codespace and reopen. 

1. Expand the **Local database** node until you find the *restaurants* table, right select **Show Table Records**.

    You should see the restaurant you added.

    :::image type="content" source="./media/codespaces-tutorial/codespaces-show-table-records-small.png" alt-text="Screenshot showing how touUse SQLTools extension in Visual Studio Code to connect to Postgres local database and show table records." lightbox="./media/codespaces-tutorial/codespaces-show-table-records.png":::

## Clean up

To stop using the codespace, close the browser. (Or, close VS Code if you opened it that way.)

If you plan on using the codespace again, you can keep it. Only running codespaces incur CPU charges. A stopped codespace incurs only storage costs. 

If you want to remove the codespace, go to https://github.com/codespaces to manage your codespaces.


## Next steps

* [Develop a Python web app][9]
* [Develop a container app][10]
* [Learn to use the Azure libraries for Python][11]

[0]: https://github.com/Azure-Samples/msdocs-fastapi-postgres-codespace
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
[12]: https://swagger.io/tools/swagger-ui/
