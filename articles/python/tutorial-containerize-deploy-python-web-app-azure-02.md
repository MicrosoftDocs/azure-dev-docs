---
title: Build and run a containerized Python web app locally with MongoDB
description: Build and run a containerized Python web app (Django or Flask) locally with MongoDB in preparation for deployment to Azure App Service.
ms.topic: conceptual
ms.date: 10/09/2023
ms.custom: devx-track-python
---

# Build and run a containerized Python web app locally with MongoDB

This article is part of a tutorial about how to containerize and deploy a containerized Python web app to Azure App Service. App Service enables you to run containerized web apps and deploy through continuous integration/continuous deployment (CI/CD) capabilities with Docker Hub, Azure Container Registry, and Visual Studio Team Services. In this part of the tutorial, you learn how to build and run the containerized Python web app locally. ***This step is optional and isn't required to deploy the sample app to Azure.***

Running a Docker image locally in your development environment requires setup beyond deployment to Azure. Think of it as an investment that can make future development cycles easier, especially when you move beyond sample apps and you start to create your own web apps. To deploy the sample apps for [Django](https://github.com/Azure-Samples/msdocs-python-django-container-web-app) and [Flask](https://github.com/Azure-Samples/msdocs-python-flask-container-web-app), you can skip this step and go to the next step in this tutorial. You can always return after deploying to Azure and work through these steps.

The following service diagram highlights the components covered in this article.

:::image type="content" source="./media/tutorial-container-web-app/containerization-of-python-apps-run-local.png" alt-text="A screenshot of the Tutorial - Containerized Python App on Azure with local part highlighted." lightbox="./media/tutorial-container-web-app/containerization-of-python-apps-run-local.png":::

## 1. Clone or download the sample app

### [Git clone](#tab/sample-app-git-clone)

Clone the Django or Flask repository:

```terminal
# Django
git clone https://github.com/Azure-Samples/msdocs-python-django-container-web-app.git

# Flask
git clone https://github.com/Azure-Samples/msdocs-python-flask-container-web-app.git
```

Then navigate to the root folder:

```terminal
# Django
cd msdocs-python-django-container-web-app

# Flask
cd msdocs-python-flask-container-web-app
```

### [Download](#tab/sample-app-download)

Visit [https://github.com/Azure-Samples/msdocs-python-django-container-web-app](https://github.com/Azure-Samples/msdocs-python-django-container-web-app) or [https://github.com/Azure-Samples/msdocs-python-flask-container-web-app](https://github.com/Azure-Samples/msdocs-python-flask-container-web-app).

Select **Code**, and then select **Download ZIP**.

Unpack the ZIP file into a folder and then open a terminal window in that folder.

---

## 2. Build a Docker image

If you're using one of the framework sample apps available for [Django](https://github.com/Azure-Samples/msdocs-python-django-container-web-app) and [Flask](https://github.com/Azure-Samples/msdocs-python-flask-container-web-app), you're set to proceed. If you're working with your own sample app, take a look to see how the sample apps are set up, in particular, the *Dockerfile* in the root directory.

### [VS Code](#tab/vscode-docker)

These instructions require [Visual Studio Code](https://code.visualstudio.com/) and the [Docker extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-docker). Go to the sample folder you cloned or downloaded and open VS Code with the command `code .`.

> [!NOTE]
> The steps in this section require the Docker daemon to be running. In some installations, for example on Windows, you need to open [Docker Desktop](https://www.docker.com/products/docker-desktop/), which starts the daemon, before proceeding.

1. Open the Docker extension. Select the **Docker** extension on the Activity Bar.

    :::image type="content" source="./media/tutorial-container-web-app/visual-studio-code-open-docker-extension.png" lightbox="./media/tutorial-container-web-app/visual-studio-code-open-docker-extension.png" alt-text="A screenshot that shows how to open the Docker extension in Visual Studio Code." :::

    If the Docker extension reports an error "Failed to connect", make sure [Docker](https://docs.docker.com/get-docker/) is installed and running. If it's your first time working with Docker, you probably won't have any containers, images, or connected registries.

1. Build the image. In the project Explorer, right-click the *Dockerfile* and select **Build Image...**.

    Alternately, you can use the Command Palette (**F1** or **Ctrl+Shift+P**) and type "Docker Images: Build Images" to invoke the command.
  
    For more information about Dockerfile syntax, see the [Dockerfile reference](https://docs.docker.com/engine/reference/builder/).

1. Confirm the image was built. Expand the **IMAGES** section of the Docker extension and look for the recently built extension. The name of the container image is "msdocspythoncontainerwebapp", which is set in the *.vscode/tasks.json* file.

    :::image type="content" source="./media/tutorial-container-web-app/visual-studio-code-docker-extension-view-images.png" lightbox="./media/tutorial-container-web-app/visual-studio-code-docker-extension-view-images.png" alt-text="A screenshot that shows how to confirm the built image in Visual Studio Code." :::
  
### [Docker CLI](#tab/docker-cli)

These instructions require [Docker](https://docs.docker.com/get-docker/).

> [!NOTE]
> The steps in this section require the Docker daemon to be running. In some installations, for example on Windows, you need to open [Docker Desktop](https://www.docker.com/products/docker-desktop/), which starts the daemon, before proceeding.

Start in the root folder of the sample app you cloned or downloaded.

1. At a shell prompt, enter the following command to confirm that Docker is accessible.

    ```Docker
    docker
    ```

    If, after running this command, you see help for the [Docker CLI](https://docs.docker.com/engine/reference/commandline/cli/), you can continue. Otherwise, make sure Docker is installed and that your shell has access to the Docker CLI.
  
1. Build the image with the [docker build](https://docs.docker.com/engine/reference/commandline/build/) command.

    The general form of the command is `docker build --rm --pull --file "<path-to-project-root>/Dockerfile" --label "com.microsoft.created-by=docker-cli" --tag "<container-name>:latest" "<path-to-project-root>"`.
  
    For example, if you''re at the root folder of the project, you can use the command like this to build an image:
  
    ```Docker
    docker build --rm --pull \
      --file "Dockerfile" \
      --label "com.microsoft.create-by=docker-cli" \
      --tag "msdocspythoncontainerwebapp:latest" \
      .
    ```
  
    The dot (".") at the end of the command refers to the current directory in which the command runs. You can add `--no-cache` to force a rebuild.
  
1. Confirm the image was built with the [docker images](https://docs.docker.com/engine/reference/commandline/images/) command.

    ```Docker
    docker images
    ```

    The command returns a list of images by REPOSITORY name, TAG, and CREATED date among other image characteristics.

---

At this point, you have built an image locally. The image you created has the name "msdocspythoncontainerwebapp" and tag "latest". Tags are a way to define version information, intended use, stability, or other information. For more information, see [Recommendations for tagging and versioning container images](/azure/container-registry/container-registry-image-tag-version).

Images that are built from VS Code or from using the Docker CLI directly can also be viewed with the [Docker Desktop](https://www.docker.com/products/docker-desktop/) application.

## 3. Set up MongoDB

For this tutorial, you need a MongoDB database named *restaurants_reviews* and a collection named *restaurants_reviews*. The steps in this section show you how to use a local installation of MongoDB or [Azure Cosmos DB for MongoDB](/azure/cosmos-db/mongodb/mongodb-introduction) to create and access the database and collection.

> [!IMPORTANT]
> Don't use a MongoDB database you'll use in production. In this tutorial, you'll store the MongoDB connection string in an environment variable. This makes it observable by anyone capable of inspecting your container (for example, using `docker inspect`).

### [Local MongoDB](#tab/mongodb-local)

1. Install [MongoDB](https://www.mongodb.com/docs/manual/installation/) if it isn't already installed.

    You can check for the installation of MongoDB by using the [MongoDB Shell (mongosh)](https://www.mongodb.com/docs/mongodb-shell/).
  
    * The following command enters the shell and gives you the version of both mongosh and mongoDB server installed on your system:

      ```terminal
      mongosh
      ```

    * The following command gives you just the version of MongoDB server installed on your system:

        ```terminal
        mongosh --quiet --exec 'db.version()'
        ```

    If these commands don't work, you might need to explicitly [install mongosh](https://www.mongodb.com/docs/mongodb-shell/install/) or [connect mongosh to your MongoDB server](https://www.mongodb.com/docs/mongodb-shell/connect/).

    An alternative in some installations is to directly invoke the Mongo daemon.

    ```terminal
    mongod --version
    ```

1. Edit the *mongod.cfg* file to add your computer's IP address.

    The [mongod configuration file](https://www.mongodb.com/docs/manual/reference/configuration-options/) has a `bindIp` key that defines hostnames and IP addresses that MongoDB listens for client connections. Add the current IP of your local development computer. The sample app running locally in a Docker container communicates to the host machine with this address.

    For example, part of the configuration file should look like this:

    ```yml
    net:
      port: 27017
      bindIp: 127.0.0.1,<local-ip-address>
    ```

    Restart MongoDB to pick up changes to the configuration file.  

1. Create a database and collection in the local MongoDB database.

    Set the database name to "restaurants_reviews" and the collection name to "restaurants_reviews". You can create a database and collection with the VS Code [MongoDB extension](https://code.visualstudio.com/docs/azure/mongodb), the [MongoDB Shell (mongosh)](https://www.mongodb.com/docs/mongodb-shell/), or any other MondoDB-aware tool.

    For the MongoDB shell, here are example commands to create the database and collection:

    ```mongosh
    > help
    > use restaurants_reviews
    > db.restaurants_reviews.insertOne({})
    > show dbs
    > exit
    ```

After finishing these steps, your local MongoDB connection string is "mongodb://127.0.0.1:27017/", the database name is "restaurants_reviews", and the collection name is "restaurants_reviews".

### [Azure Cosmos DB for MongoDB](#tab/mongodb-azure)

You can use Azure CLI commands to create an Azure Cosmos DB for MongoDB account and then create the required database and collection for this tutorial. If you haven't used the Azure CLI before, see [Get started with Azure CLI](/cli/azure/get-started-with-azure-cli) to learn how to download and install the Azure CLI locally or how to run Azure CLI commands in Azure Cloud Shell.

Before running the following script, replace the location and Azure Cosmos DB for MongoDB account name with appropriate values. You can use the resource group name specified in the script or change it. Either way, we recommend using the same resource group for all the Azure resources created in the different articles of this tutorial. It makes them easier to delete when you're finished with the tutorial. If you arrived here from part **4. Deploy container App Service**, use the resource group name and location that you've already been using for your resources.

The script assumes that you're using a Bash shell. If you want to use a different shell, you need to change the variable declaration and substitution syntax. The script might take a few minutes to run.

```azurecli
#!/bin/bash

# LOCATION: The Azure region. Use the "az account list-locations -o table" command to find a region near you.
# RESOURCE_GROUP_NAME: The resource group name. Can contain underscores, hyphens, periods, parenthesis, letters, and numbers.
# ACCOUNT_NAME: The Azure Cosmos DB for MongDB account name. Can contain lowercase letters, hyphens, and numbers.
LOCATION='eastus'
RESOURCE_GROUP_NAME='msdocs-web-app-rg'
ACCOUNT_NAME='<cosmos-db-account-name>'

# Create a resource group
echo "Creating resource group $RESOURCE_GROUP_NAME in $LOCATION..."
az group create --name $RESOURCE_GROUP_NAME --location $LOCATION

# Create a Cosmos account for MongoDB API
echo "Creating $ACCOUNT_NAME. This command may take a while to complete."
az cosmosdb create --name $ACCOUNT_NAME --resource-group $RESOURCE_GROUP_NAME --kind MongoDB

# Create a MongoDB API database
echo "Creating database restaurants_reviews"
az cosmosdb mongodb database create --account-name $ACCOUNT_NAME --resource-group $RESOURCE_GROUP_NAME --name restaurants_reviews

# Create a MongoDB API collection
echo "Creating collection restaurants_reviews"
az cosmosdb mongodb collection create --account-name $ACCOUNT_NAME --resource-group $RESOURCE_GROUP_NAME --database-name restaurants_reviews --name restaurants_reviews

# Get the connection string for the MongoDB database
echo "Get the connection string for the MongoDB account"
az cosmosdb keys list --name $ACCOUNT_NAME --resource-group $RESOURCE_GROUP_NAME --type connection-strings

echo "Copy the Primary MongoDB Connection String from the list above"
```

When the script completes, copy the *Primary MongoDB Connection String* from the output of the last command.

```output
{
  "connectionStrings": [
    {
      "connectionString": ""mongodb://msdocs-cosmos-db:pnaMGVtGIRAZHUjsg4GJBCZMBJ0trV4eg2IcZf1TqV...5oONz0WX14Ph0Ha5IeYACDbuVrBPA==@msdocs-cosmos-db.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@msdocs-cosmos-db@"",
      "description": "Primary MongoDB Connection String",
      "keyKind": "Primary",
      "type": "MongoDB"
    },

    ...
  ]
}
```

At this point, you should have an Azure Cosmos DB for MongoDB connection string of the form `mongodb://<server-name>:<password>@<server-name>.mongo.cosmos.azure.com:10255/?ssl=true&<other-parameters>`, a database named `restaurants_reviews`, and a collection named `restaurants_reviews`.

For more detail about using the Azure CLI to create a Cosmos DB for MongoDB account and to create databases and collections, see [Create a database and collection for MongoDB for Azure Cosmos DB using Azure CLI](/azure/cosmos-db/scripts/cli/mongodb/create). You can also use [PowerShell](/azure/cosmos-db/scripts/powershell/mongodb/create), the VS Code [Azure Databases extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-cosmosdb), and [Azure portal](/azure/cosmos-db/mongodb/create-mongodb-python).

> [!TIP]
> In the VS Code Azure Databases extension, you can right-click on the MongoDB server and get the connection string.

---

## 4. Run the image locally in a container

With information on how to connect to a MongoDB, you're ready to run the container locally. The sample app expects MongoDB connection information to be passed in environment variables. There are several ways to get environment variables passed to container locally. Each has advantages and disadvantages in terms of security. You should avoid checking in any sensitive information or leaving sensitive information in code in the container.

> [!NOTE]
> When deployed to Azure, the web app gets connection information from environment values set as App Service configuration settings and none of the modifications for the local development environment scenario apply.

### [VS Code](#tab/vscode-docker)

1. In the *.vscode* folder of the sample app, the *settings.json* file defines what happens when you use the Docker extension and select **Run** or **Run Interactive** from the context menu of a Tag. The *settings.json* file contains two templates each for the `(MongoDB local)` and `(MongoDB Azure)` scenarios.

    If you're using a local MongoDB database:

    * Replace both instances of `<YOUR_IP_ADDRESS>` with your IP address.

    * Replace both instances of `<CONNECTION_STRING>` with the connection string for your MongoDB database.

    If you're using an Azure Cosmos DB for MongoDB database:

    * Replace both instances of `<CONNECTION_STRING>` with the Azure Cosmos DB for MongoDB connection string.

    :::image type="content" source="./media/tutorial-container-web-app/visual-studio-code-settings-file.png" lightbox="./media/tutorial-container-web-app/visual-studio-code-settings-file.png" alt-text="A screenshot that shows the settings.json file in Visual Studio Code." :::

    Set the `docker.dockerPath` configuration setting used by the templates. To set `docker.dockerPath`, open the VS Code **Command Palette** (**Ctrl+Shift+P**), enter "Preferences: Open Workspace Settings", then enter "docker.dockerPath" in the **Search settings** box. Enter "docker" (without the quotes) for the value of the setting.

    > [!NOTE]
    > Both the database name and collection name are assumed to be `restaurants_reviews`.

1. Run the image.

    1. In the **IMAGES** section of the Docker extension, find the built image.

    1. Expand the image to find the **latest** tag, right-click, and select **Run Interactive**.

    1. You're prompted to select the task appropriate for your scenario, either "Interactive run configuration (MongoDB local)" or "Interactive run configuration (MongoDB Azure)".

    With interactive run, you'll see any print statements in the code, which can be useful for debugging. You can also select **Run** which is non-interactive and doesn't keep standard input open.

    :::image type="content" source="./media/tutorial-container-web-app/visual-studio-code-docker-extension-container-run.png" lightbox="./media/tutorial-container-web-app/visual-studio-code-docker-extension-container-run.png" alt-text="A screenshot that shows how to run a Docker container in Visual Studio Code." :::

    > [!IMPORTANT]
    > This step fails if the default terminal profile is set to (Windows) Command Prompt. To change the default profile, open the VS Code **Command Palette** (**Ctrl+Shift+P**), enter "Terminal: Select Default Profile", and then select a different profile from the dropdown menu; for example *Git Bash* or *PowerShell*.

1. Confirm that the container is running.

    1. In the **CONTAINERS** section of the Docker extension, find the container.
  
    1. Expand the **Individual Containers** node and confirm that "msdocspythoncontainerwebapp" is running. You should see a green triangle symbol next to the container name if it's running.

    :::image type="content" source="./media/tutorial-container-web-app/visual-studio-code-docker-extension-container-confirm.png" lightbox="./media/tutorial-container-web-app/visual-studio-code-docker-extension-container-confirm.png" alt-text="A screenshot showing how to confirm a Docker container is running in Visual Studio Code." :::

1. Test the web app by right-clicking the container name and selecting **Open in Browser**.

    The browser opens into your default browser as "http://127.0.0.1:8000" for Django or "http://127.0.0.1:5000/" for Flask.

    :::image type="content" source="./media/tutorial-container-web-app/visual-studio-code-docker-extension-container-open.png" lightbox="./media/tutorial-container-web-app/visual-studio-code-docker-extension-container-open.png" alt-text="A screenshot that shows how to browse the endpoint of a Docker container in Visual Studio Code." :::

1. Stop the container.

    1. In the **CONTAINERS** section of the Docker extension, find the running container.

    1. Right-click the container and select **Stop**.

    :::image type="content" source="./media/tutorial-container-web-app/visual-studio-code-docker-extension-container-stop.png" lightbox="./media/tutorial-container-web-app/visual-studio-code-docker-extension-container-stop.png" alt-text="A screenshot showing how to stop a running Docker container in Visual Studio Code." :::

> [!TIP]
> You can also run the container selecting a run or debug configuration. The Docker extension tasks in *tasks.json* are called when you run or debug. The task called depends on what launch configuration you select.  For the task "Docker: Python (MongoDB local)", specify \<YOUR-IP-ADDRESS>. For the task "Docker: Python (MongoDB Azure)", specify \<CONNECTION-STRING>.

### [Docker CLI](#tab/docker-cli)

1. Run the latest version of the image.

    ### [Local MongoDB](#tab/mongodb-local)

    ```Docker
    # PORT=8000 for Django and 5000 for Flask
    export PORT=<port-number>
    export YOUR_IP_ADDRESS=<your-machine-ip-address>
    
    docker run --rm -it \
      --publish $PORT:$PORT --publish 27017:27017 \
      --add-host mongoservice:$YOUR_IP_ADDRESS \
      --env CONNECTION_STRING=mongodb://mongoservice:27017 --env DB_NAME=restaurants_reviews --env COLLECTION_NAME=restaurants_reviews \
      msdocspythoncontainerwebapp:latest  
    ```

    ### [Azure Cosmos DB MongoDB](#tab/mongodb-azure)

    ```Docker
    # PORT=8000 for Django and 5000 for Flask
    export PORT=<port-number>
    export CONNECTION_STRING="<connection-string>"
    
    docker run --rm -it \
      --publish $PORT:$PORT/tcp \
      --env CONNECTION_STRING=$CONNECTION_STRING --env DB_NAME=restaurants_reviews --env COLLECTION_NAME=restaurants_reviews \
      msdocspythoncontainerwebapp:latest  
    ```

    ---

    The docker command is formatted for Bash shell. If you use PowerShell, Command Prompt, or another shell, you might need to adjust the line continuation and environment variable format accordingly.

    Passing in sensitive information as shown here is for demonstration purposes. The connection string information can be viewed by inspecting the container with the command [docker container inspect](https://docs.docker.com/engine/reference/commandline/container_inspect/). Another way to handle secrets is to use the [BuildKit](https://docs.docker.com/develop/develop-images/build_enhancements/) functionality of Docker.

1. Confirm that the container is running. Open a second shell and run the [docker container ls](https://docs.docker.com/engine/reference/commandline/container_ls/) command.

    ```Docker
    docker container ls
    ```

    You should see your container "msdocspythoncontainerwebapp:latest:latest" in the list. Note the `NAMES` column of the output and the `PORTS` column. You can use the name to stop the container.

1. Test the web app.

    Go to "http://127.0.0.1:8000" for Django and "http://127.0.0.1:5000/" for Flask when running with local MongoDB.

1. Shut down the container.

    ```Docker
    docker container stop <container-name>
    ```

---

You can also start a container from an image and stop it with the [Docker Desktop](https://www.docker.com/products/docker-desktop/) application.

## Next step

> [!div class="nextstepaction"]
> [Build a container image in Azure](tutorial-containerize-deploy-python-web-app-azure-03.md)
