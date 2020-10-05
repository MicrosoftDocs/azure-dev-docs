Use Visual Studio Code to quickly and easily add a local MongoDB database to your application using Docker.

## Configure Visual Studio Code to run containers

In this section, configure your development environment to run two containers, one for your Node.js project, and one for your MongoDB container. 

1. In Visual Studio Code, use the Command Palette (CTRL+Shift+P) to select **Remote-Containers: Add Development Container Configuration Files**. 

1. Select **Node.js & Mongo DB** from the list.

    :::image type="content" source="../media/tutorial-end-to-end-app-cosmos/vscode-configure-development-container.png" alt-text="Partial screenshot of Visual Studio Code's Command Palette."::: 

1. In the **\.devcontainer\devcontainer.json** file, find the **forwardPorts** property, uncomment it and add `8080` to the array. If you also want access to access the MongoDB container with the shell, add the port `27017` to the array.  

    :::image type="content" source="../media/tutorial-end-to-end-app-cosmos/vscode-dev-container-configuration-forward-ports.png" alt-text="Partial screenshot of Visual Studio Code's `devcontainer.json` file with forwarding ports for app and MongoDB."::: 

## Run web app locally with database

In this section, run your development environment with both containers, and view the web site. 

1. Select the green **Remote Containers** icon in the bottom-left corner of Visual Studio Code. This opens the Command Palette. 

    :::image type="content" source="../media/tutorial-end-to-end-app-cosmos/vscode-remote-container-icon.png" alt-text="Partial screenshot of Visual Studio Code's remote container icon"::: 

1. From the Command Palette, select **Remote-Containers: Reopen in Container**. The first time you open the project with containers, the Node.js and MongoDB images are pulled down and started. This may take a few minutes. 

    When the containers are running, the Visual Studio Code terminal displays the Node.js container's terminal. 

    Optionally, you can use the `ls` command to see your files. Notice your files are using a shared volume with your local computer. Changes you make inside the Node.js container to the code files are saved in your local files.

1. Start the project at the terminal with the following command:

    ```console
    npm start
    ```

1. Open a browser with your local web app URL:

    ```http
    http://localhost:8080/
    ```

1. Enter data in the fields and submit the form. Notice that the data is immediately displayed using the server-side React rendering. 

1. When you done exploring the app, stop the containers by using the Command Palette to select **Remote-Containers: Reopen Locally...** 

    This stops the containers but leaves them on your local computer. 

## Want to know more? 

The database code is already provided in the **\src\data.js** file of the project. It uses the MongoDB native API. The database and collection are created for you, if they don't exist. This allows you to quickly move from the development to production environment without having to setup the database. 

The database settings are managed in the **.env** file:

```env
DATABASE_URL=mongodb://localhost:27017
DATABASE_NAME=my-tutorial-db
DATABASE_COLLECTION_NAME=my-collection
# use Azure app service's config setting WEBSITES_PORT to use a different port
WEB_PORT=8080
```

Connect to the MongoDB container with a Visual Studio Code extension: **[MongoDB for VS Code](https://marketplace.visualstudio.com/items?itemName=mongodb.mongodb-vscode)** to see your data.

If you would rather use the **mongo** shell, connect to the MongoDB container with a Visual Studio Code terminal by opening a new Visual Studio Code window, then using the **Remote-Containers: Attach to Running Container...**, then select the container ending in `-db`. Once the window is attached to the container, open a Visual Studio Code terminal. You can immediately access the Mongo shell using the following command:

```console
mongo
```

When you want to clean up your containers, use the Visual Studio Code extension, **[Docker](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-docker)**.