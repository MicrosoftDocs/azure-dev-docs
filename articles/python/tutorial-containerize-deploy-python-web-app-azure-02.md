---
title: Build and run a containerized Python web app locally with MongoDB
description: Build and run a containerized Python web app (Django or Flask) locally with MongoDB or using Azure Cosmos DB for MongoDB. In later articles in this tutorial series, you learn to deploy a Python web app to Azure App Service.
ms.topic: how-to
ms.date: 04/10/2025
ms.custom: devx-track-python
---

# Build and run a containerized Python web app locally

In this part of the tutorial series, you learn how to build and run a containerized [Django](https://github.com/Azure-Samples/msdocs-python-django-container-web-app) or a [Flask](https://github.com/Azure-Samples/msdocs-python-flask-container-web-app) Python web app on your local computer. To store data for this app, you can use either a local MongoDB instance or [Azure Cosmos DB for MongoDB](/azure/cosmos-db/mongodb/mongodb-introduction). This article is part 2 of a 5-part tutorial series. We recommend that you complete [part 1](tutorial-containerize-deploy-python-web-app-azure-01.md) before starting this article.

The following service diagram highlights the local components covered in this article In this article, you also learn how to use Azure Cosmos DB for MongdoDB with a local Docker image, rather than a local instance of MongoDB.

:::image type="content" source="./media/tutorial-container-web-app/containerization-of-python-apps-run-local.png" alt-text="A screenshot of the Tutorial - Containerized Python App on Azure with local part highlighted." lightbox="./media/tutorial-container-web-app/containerization-of-python-apps-run-local.png":::

## Clone or download the sample Python app

In this section, you clone or download the sample Python app that you use to build a Docker image. You can choose between a Django or Flask Python web app. If you have your own Python web app, you can choose to use that instead. If you use your own Python web app, make sure your app has a *Dockerfile* in the root folder and can connect to a MongoDB database.

### [Git clone](#tab/sample-app-git-clone)

1. Clone either the Django or Flask repository into a local folder by using one of the following commands:

    ### [Django](#tab/Django)

    ```console
    # Django
    git clone https://github.com/Azure-Samples/msdocs-python-django-container-web-app.git
    ```

    ### [Flask](#tab/Flask)

    ```console
    # Flask
    git clone https://github.com/Azure-Samples/msdocs-python-flask-container-web-app.git
    ```

    ---

1. Navigate to the root folder for your cloned repository.

    ### [Django](#tab/Django)

    ```console
    # Django
    cd msdocs-python-django-container-web-app
    ```

    ### [Flask](#tab/Flask)

    ```console
    # Flask
    cd msdocs-python-flask-container-web-app
    ```

    ---

### [Download](#tab/sample-app-download)

Visit [https://github.com/Azure-Samples/msdocs-python-django-container-web-app](https://github.com/Azure-Samples/msdocs-python-django-container-web-app) or [https://github.com/Azure-Samples/msdocs-python-flask-container-web-app](https://github.com/Azure-Samples/msdocs-python-flask-container-web-app).

1. Select **Code**, and then select **Download ZIP**.

1. Unpack the ZIP file into a local folder.

---

## Build a Docker image

In this section, you build a Docker image for the Python web app using either Visual Studio Code or the Azure CLI. The Docker image contains the Python web app, its dependencies, and the Python runtime. The Docker image is built from a *Dockerfile* that defines the image's contents and behavior. The *Dockerfile* is in the root folder of the sample app you cloned or downloaded (or provided yourself).

> [!TIP]
> If you're new to the Azure CLI, see [Get started with Azure CLI](/cli/azure/get-started-with-azure-cli) to learn how to download and install the Azure CLI locally or how to run Azure CLI commands in Azure Cloud Shell.

### [Azure CLI](#tab/azure-cli)

[Docker](https://docs.docker.com/get-docker/) is required to build the Docker image using the Docker CLI. Once Docker is installed, open a terminal window and navigate to the sample folder.

> [!NOTE]
> The steps in this section require the Docker daemon to be running. In some installations, for example on Windows, you need to open [Docker Desktop](https://www.docker.com/products/docker-desktop/), which starts the daemon, before proceeding.

1. Confirm that Docker is accessible by running the following command in the root folder of the sample app.

    ```console
    docker
    ```

    If, after running this command, you see help for the [Docker CLI](https://docs.docker.com/engine/reference/commandline/cli/), Docker is accessible. Otherwise, make sure Docker is installed and that your shell has access to the Docker CLI.

1. Build the Docker image for the Python web app by using the [Docker build](https://docs.docker.com/engine/reference/commandline/build/) command.

    The general form of the command is `docker build --rm --pull --file "<path-to-project-root>/Dockerfile" --label "com.microsoft.created-by=docker-cli" --tag "<container-name>:latest" "<path-to-project-root>"`.

    If you're at the root folder of the project, use the following command to build the Docker image. The dot (".") at the end of the command refers to the current directory in which the command runs. To force a rebuild, add `--no-cache`.

    ### [Bash](#tab/bash)

    ```console
    #!/bin/bash
    docker build --rm --pull \
      --file "Dockerfile" \
      --label "com.microsoft.create-by=docker-cli" \
      --tag "msdocspythoncontainerwebapp:latest" \
        .
    ```

    ### [PowerShell](#tab/powershell)

    ```console
    # PowerShell syntax
    docker build --rm --pull `
      --file "Dockerfile" `
      --label "com.microsoft.create-by=docker-cli" `
      --tag "msdocspythoncontainerwebapp:latest" `
        .
    ```

    ---

1. Confirm the image was built successfully by using the [Docker images](https://docs.docker.com/engine/reference/commandline/images/) command.

    ```console
    docker images
    ```

    The command returns a list of images by REPOSITORY name, TAG, and CREATED date among other image characteristics.

### [VS Code](#tab/vscode)

[Visual Studio Code](https://code.visualstudio.com/) and the [Docker extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-docker) are required to build the Docker image locally using Visual Studio Code. Install Visual Studio Code and the Docker extension before continuing. Once Visual Studio Code and the Docker extension are installed, go to the sample folder you cloned or downloaded and open VS Code with the command `code .`.

> [!NOTE]
> The steps in this section require the Docker daemon to be running. In some installations, for example on Windows, you need to open [Docker Desktop](https://www.docker.com/products/docker-desktop/) to start the daemon before proceeding.

1. Once Visual Studio Code and the Docker extension are installed, go to the sample folder you cloned or downloaded and open VS Code with the command `code .`.

1. In VS Code, open the Docker extension and then select the **Docker** extension on the Activity Bar.

    :::image type="content" source="./media/tutorial-container-web-app/visual-studio-code-open-docker-extension.png" lightbox="./media/tutorial-container-web-app/visual-studio-code-open-docker-extension.png" alt-text="A screenshot that shows how to open the Docker extension in Visual Studio Code." :::

    If the Docker extension reports a "Failed to connect" error, make sure [Docker](https://docs.docker.com/get-docker/) is installed and running.

1. To build the Docker image, right-click the *Dockerfile* and then select **Build Image...**.

    For more information about Dockerfile syntax, see the [Dockerfile reference](https://docs.docker.com/engine/reference/builder/).

1. To confirm the image was built, expand the **IMAGES** section of the Docker extension and look for the recently built image. The name of this container image is "msdocspythoncontainerwebapp" (this value is set in the *.vscode/tasks.json* file).

    :::image type="content" source="./media/tutorial-container-web-app/visual-studio-code-docker-extension-view-images.png" lightbox="./media/tutorial-container-web-app/visual-studio-code-docker-extension-view-images.png" alt-text="A screenshot that shows how to confirm the built image in Visual Studio Code." :::

---

At this point, you have a local Docker image named "msdocspythoncontainerwebapp" with the tag "latest". Tags help define version details, intended use, stability, and other relevant information. For more information, see [Recommendations for tagging and versioning container images](/azure/container-registry/container-registry-image-tag-version).

> [!NOTE]
> Images that are built from VS Code or by using the Docker CLI directly can also be viewed with the [Docker Desktop](https://www.docker.com/products/docker-desktop/) application.

## Set up MongoDB

Your Python web app requires a MongoDB database named *restaurants_reviews* and a collection named *restaurants_reviews* are required to store data. In this tutorial, you use both a local installation of MongoDB and a [Azure Cosmos DB for MongoDB](/azure/cosmos-db/mongodb/mongodb-introduction) instance to create and access the database and collection.

> [!IMPORTANT]
> Don't use a MongoDB database you use in production. In this tutorial, you store the MongoDB connection string to the one of these MongoDB instances in an environment variable (which is observable by anyone capable of inspecting your container - such as by using `docker inspect`).

### Local MongoDB

Let's start by creating a local instance of MongoDB using the Azure CLI.

1. Install [MongoDB](https://www.mongodb.com/docs/manual/installation/) (if it isn't already installed).

    You can check for the installation of MongoDB by using the [MongoDB Shell (mongosh)](https://www.mongodb.com/docs/mongodb-shell/). If the following commands don't work, you may need to explicitly [install mongosh](https://www.mongodb.com/docs/mongodb-shell/install/) or [connect mongosh to your MongoDB server](https://www.mongodb.com/docs/mongodb-shell/connect/).

    * Use the following command to open the MongoDB shell and get the version of both the MongoDB shell and the MongoDB server:

        ```console
        mongosh
        ```

        > [!TIP]
        > To return just the version of MongoDB server installed on your system, close and reopen the MongoDB shell and use the following command: `mongosh --quiet --exec 'db.version()'`

        In some setups, you can also directly invoke the Mongo daemon in your bash shell.

        ```console
        mongod --version
        ```

1. Edit the *mongod.cfg* file in the `\MongoDB\Server\8.0\bin` folder and add your computer's local IP address to the `bindIP` key.

    The `bindip` key in the [MongoD configuration file](https://www.mongodb.com/docs/manual/reference/configuration-options/) defines the hostnames and IP addresses that MongoDB listens for client connections. Add the current IP of your local development computer. The sample Python web app running locally in a Docker container communicates to the host computer with this address.

    For example, part of the configuration file should look like this:

    ```yml
    net:
      port: 27017
      bindIp: 127.0.0.1,<local-ip-address>
    ```

1. Save your changes to this configuration file.

    > [!IMPORTANT]
    > You need administrative privileges to save the changes you make to this configuration file.

1. Restart MongoDB to pick up changes to the configuration file.

1. Open a MongoDB shell and run the following command to set the database name to "restaurants_reviews" and the collection name to "restaurants_reviews". You can also create a database and collection with the VS Code [MongoDB extension](https://code.visualstudio.com/docs/azure/mongodb) or any other MongoDB-aware tool.

    ```mongosh
    > help
    > use restaurants_reviews
    > db.restaurants_reviews.insertOne({})
    > show dbs
    > exit
    ```

After you complete the previous step, the local MongoDB connection string is "mongodb://127.0.0.1:27017/", the database name is "restaurants_reviews", and the collection name is "restaurants_reviews".

### Azure Cosmos DB for MongoDB

Now, let's also create an Azure Cosmos DB for MongoDB instance using the Azure CLI. 

>[!NOTE]
> In part 4 of this tutorial series, you use the Azure Cosmos DB for MongoDB instance to run the web app in Azure App Service.

Before running the following script, replace the location, the resource group, and Azure Cosmos DB for MongoDB account name with appropriate values (optional). We recommend using the same resource group for all the Azure resources created in this tutorial to make them easier to delete when you're finished.

The script takes a few minutes to run.

### [Bash](#tab/bash)

```azurecli-interactive
#!/bin/bash
# LOCATION: The Azure region. Use the "az account list-locations -o table" command to find a region near you.
LOCATION='westus'
# RESOURCE_GROUP_NAME: The resource group name, which can contain underscores, hyphens, periods, parenthesis, letters, and numbers.
RESOURCE_GROUP_NAME='msdocs-web-app-rg'
# ACCOUNT_NAME: The Azure Cosmos DB for MongDB account name, which can contain lowercase letters, hyphens, and numbers.
ACCOUNT_NAME='msdocs-cosmos-db-account-name'

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

### [PowerShell](#tab/powershell)

```powershell-interactive
# PowerShell syntax
# LOCATION: The Azure region. Use "az account list-locations -o table" to find a region near you.
# RESOURCE_GROUP_NAME: The resource group name, which can contain underscores, hyphens, periods, parenthesis, letters, and numbers.
# ACCOUNT_NAME: The Azure Cosmos DB for MongoDB account name, which can contain lowercase letters, hyphens, and numbers.

$LOCATION = "westus"
$RESOURCE_GROUP_NAME = "msdocs-web-app-rg"
$ACCOUNT_NAME = "msdocs-cosmos-db-account-name"

# Create a resource group
Write-Output "Creating resource group $RESOURCE_GROUP_NAME in $LOCATION..."
az group create --name $RESOURCE_GROUP_NAME --location $LOCATION

# Create a Cosmos account for MongoDB API
Write-Output "Creating $ACCOUNT_NAME. This command may take a while to complete."
az cosmosdb create --name $ACCOUNT_NAME --resource-group $RESOURCE_GROUP_NAME --kind MongoDB

# Create a MongoDB API database
Write-Output "Creating database restaurants_reviews"
az cosmosdb mongodb database create --account-name $ACCOUNT_NAME --resource-group $RESOURCE_GROUP_NAME --name "restaurants_reviews"

# Create a MongoDB API collection
Write-Output "Creating collection restaurants_reviews"
az cosmosdb mongodb collection create --account-name $ACCOUNT_NAME --resource-group $RESOURCE_GROUP_NAME --database-name "restaurants_reviews" --name "restaurants_reviews"

# Get the connection string for the MongoDB database
Write-Output "Getting the connection string for the MongoDB account..."
az cosmosdb keys list --name $ACCOUNT_NAME --resource-group $RESOURCE_GROUP_NAME --type connection-strings

Write-Output "Copy the Primary MongoDB Connection String from the list above."

```

---

When the script completes, copy the *Primary MongoDB Connection String* from the output of the last command to your clipboard or other location.

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

After you complete the previous step, you have an Azure Cosmos DB for MongoDB connection string of the form `mongodb://<server-name>:<password>@<server-name>.mongo.cosmos.azure.com:10255/?ssl=true&<other-parameters>`, a database named `restaurants_reviews`, and a collection named `restaurants_reviews`.

For more information about how to use the Azure CLI to create a Cosmos DB for MongoDB account and to create databases and collections, see [Create a database and collection for MongoDB for Azure Cosmos DB using Azure CLI](/azure/cosmos-db/scripts/cli/mongodb/create). You can also use [PowerShell](/azure/cosmos-db/scripts/powershell/mongodb/create), the VS Code [Azure Databases extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-cosmosdb), and [Azure portal](/azure/cosmos-db/mongodb/create-mongodb-python).

> [!TIP]
> In the VS Code Azure Databases extension, you can right-click on the MongoDB server and get the connection string.

## Run the image locally in a container

You're now ready to run the Docker container locally using either your local MongoDB instance or your Cosmos DB for MongoDB instance. In this section of the tutorial, you learn to use either VS Code or the Azure CLI to run the image locally. The sample app expects the MongoDB connection information to be passed in to it with environment variables. There are several ways to get environment variables passed to container locally. Each has advantages and disadvantages in terms of security. You should avoid checking in any sensitive information or leaving sensitive information in code in the container.

> [!NOTE]
> When the web app is deployed to Azure, the web app gets connection information from environment values set as App Service configuration settings and none of the modifications for the local development environment scenario apply.

### [Azure CLI](#tab/azure-cli)

### MongoDB local

Use the following commands with your local instance of MongoDB to run the Docker image locally.

1. Run the latest version of the image.

    ### [Bash](#tab/bash)

    ```bash
    #!/bin/bash
    
    # Define variables
    # Set the port number based on the framework being used:
    # 8000 for Django, 5000 for Flask
    export PORT=<port-number>  # Replace with actual port (e.g., 8000 or 5000)
    
    # Set your computer''s IP address (replace with actual IP)
    export YOUR_IP_ADDRESS=<your-computer-ip-address>  # Replace with actual IP address
    
    # Run the Docker container with the required environment variables
    docker run --rm -it \
      --publish "$PORT:$PORT" \
      --publish 27017:27017 \
      --add-host "mongoservice:$YOUR_IP_ADDRESS" \
      --env CONNECTION_STRING=mongodb://mongoservice:27017 \
      --env DB_NAME=restaurants_reviews \
      --env COLLECTION_NAME=restaurants_reviews \
      --env SECRET_KEY="supersecretkeythatispassedtopythonapp" \
      msdocspythoncontainerwebapp:latest
    ```

    ### [PowerShell](#tab/powershell)

    ```powershell
    # PowerShell syntax
    # Define variables
    # Set the port number based on the framework being used:
    # 8000 for Django, 5000 for Flask
    $PORT = "your_port_number"  # Replace with your actual port number
    $YOUR_IP_ADDRESS = "your_ip_address"  # Replace with your actual IP address
    
    # Run the Docker container with the required environment variables
    docker run --rm -it `
        --publish "${PORT}:${PORT}" `
        --publish 27017:27017 `
        --add-host "mongoservice:$YOUR_IP_ADDRESS" `
        --env CONNECTION_STRING="mongodb://mongoservice:27017" `
        --env DB_NAME="restaurants_reviews" `
        --env COLLECTION_NAME="restaurants_reviews" `
        --env SECRET_KEY="supersecretkeythatispassedtopythonapp" `
        msdocspythoncontainerwebapp:latest 
    ```

    ---

1. Confirm that the container is running. In another console window, run the [docker container ls](https://docs.docker.com/engine/reference/commandline/container_ls/) command.

    ```console
    docker container ls
    ```

    See your container "msdocspythoncontainerwebapp:latest:latest" in the list. Notice the `NAMES` column of the output and the `PORTS` column. Use the container name to stop the container.

1. Test the web app.

    Go to "http://127.0.0.1:8000" for Django and "http://127.0.0.1:5000/" for Flask.

1. Shut down the container.

    ```console
    docker container stop <container-name>
    ```

### Azure Cosmos DB for MongoDB

Use the following commands with your Azure Cosmos DB for MongoDB instance to run the Docker image in Azure.

1. Run the latest version of the image.

    ### [Bash](#tab/bash)

    ```bash
    #!/bin/bash
    # PORT=8000 for Django and 5000 for Flask
    export PORT=<port-number>
    export CONNECTION_STRING="<connection-string>"

    docker run --rm -it \
      --publish $PORT:$PORT/tcp \
      --env CONNECTION_STRING=$CONNECTION_STRING \
      --env DB_NAME=restaurants_reviews \
      --env COLLECTION_NAME=restaurants_reviews \
      --env SECRET_KEY=supersecretkeythatyougenerate \
      msdocspythoncontainerwebapp:latest
    ```

    ### [PowerShell](#tab/powershell)

    ```powershell
    # PowerShell syntax
    # PORT=8000 for Django and 5000 for Flask
    $PORT=<port-number>
    $CONNECTION_STRING="<connection-string>"

    docker run --rm -it `
      --publish ${PORT}:${PORT}/tcp `
      --env CONNECTION_STRING=$CONNECTION_STRING `
      --env DB_NAME=restaurants_reviews `
      --env COLLECTION_NAME=restaurants_reviews `
      --env SECRET_KEY=supersecretkeythatyougenerate `
      msdocspythoncontainerwebapp:latest
    ```

    ---

    Passing in sensitive information is only shown for demonstration purposes. The connection string information can be viewed by inspecting the container with the command [docker container inspect](https://docs.docker.com/engine/reference/commandline/container_inspect/). Another way to handle secrets is to use the [BuildKit](https://docs.docker.com/develop/develop-images/build_enhancements/) functionality of Docker.

1. Open a new console window, run the following [docker container ls](https://docs.docker.com/engine/reference/commandline/container_ls/) command to confirm that the container is running.

    ```console
    docker container ls
    ```

    See your container "msdocspythoncontainerwebapp:latest:latest" in the list. Notice the `NAMES` column of the output and the `PORTS` column. Use the container name to stop the container.

1. Test the web app.

    Go to "http://127.0.0.1:8000" for Django and "http://127.0.0.1:5000/" for Flask.

1. Shut down the container.

    ```console
    docker container stop <container-name>
    ```

### [VS Code](#tab/vscode)

In this section of the tutorial, you use the Docker extension in Visual Studio Code to run the container. You can use either the connection string to your local MongoDB instance or your Cosmos DB for MongoDB instance within VS Code.

1. In the *.vscode* folder of the sample app, the *settings.json* file defines what happens when you use the Docker extension and select **Run** or **Run Interactive** from the context menu of a Tag. The *settings.json* file contains two templates each for the `(MongoDB local)` and `(MongoDB Azure)` scenarios.

    :::image type="content" source="./media/tutorial-container-web-app/visual-studio-code-settings-file.png" lightbox="./media/tutorial-container-web-app/visual-studio-code-settings-file.png" alt-text="A screenshot that shows the settings.json file in Visual Studio Code." :::

    If you're using a local MongoDB database:

    * Replace both instances of `<YOUR_IP_ADDRESS>` with your IP address.

    * Replace both instances of `<CONNECTION_STRING>` with the connection string for your MongoDB database.

    * Add the following environment variable to the string of variables passed to the Docker run command for the MongoDB local templates for both the "docker.commands.run" and "docker.commands.runInteractive" code blocks:

        ```python
        -e 'SECRET_KEY=supersecretkeythatispassedtopythonapp'
        ```

    If you're using an Azure Cosmos DB for MongoDB database:

    * Replace both instances of `<CONNECTION_STRING>` with the Azure Cosmos DB for MongoDB connection string.

    * Add the following environment variable to the string of variables passed to the Docker run command for the Azure Cosmos DB for MongoDB templates for both the "docker.commands.run" and "docker.commands.runInteractive" code blocks:

        ```python
        -e 'SECRET_KEY=supersecretkeythatispassedtopythonapp'
        ```

1. Set the `docker.dockerPath` configuration setting used by the templates. To set `docker.dockerPath`, open the VS Code **Command Palette** (**Ctrl+Shift+P**), enter "Preferences: Open Workspace Settings", then enter "docker.dockerPath" in the **Search settings** box. Enter "docker" (without the quotes) for the value of the setting.

    > [!NOTE]
    > Both the database name and collection name are assumed to be `restaurants_reviews`.

1. Run the image.

    1. In the **IMAGES** section of the Docker extension, find the built image.

    1. Expand the image to find the **latest** tag, right-click, and select **Run Interactive**.

    1. You're prompted to select the task appropriate for your scenario, either "Interactive run configuration (MongoDB local)" or "Interactive run configuration (MongoDB Azure)".

    With an interactive run, you see any print statements in the code, which can be useful for debugging. You can also select **Run**, which is non-interactive and doesn't keep standard input open.

    :::image type="content" source="./media/tutorial-container-web-app/visual-studio-code-docker-extension-container-run.png" lightbox="./media/tutorial-container-web-app/visual-studio-code-docker-extension-container-run.png" alt-text="A screenshot that shows how to run a Docker container in Visual Studio Code." :::

    > [!IMPORTANT]
    > This step fails if the default terminal profile is set to (Windows) Command Prompt. To change the default profile, open the VS Code **Command Palette** (**Ctrl+Shift+P**), enter "Terminal: Select Default Profile", and then select a different profile from the dropdown menu - such as *Git Bash* or *PowerShell*.

1. Confirm that the Docker container is running.

    1. In the **CONTAINERS** section of the Docker extension, find the container.

    1. Expand the **Individual Containers** node and confirm that the "msdocspythoncontainerwebapp" container is running. Look for a green triangle symbol next to the container name.

    :::image type="content" source="./media/tutorial-container-web-app/visual-studio-code-docker-extension-container-confirm.png" lightbox="./media/tutorial-container-web-app/visual-studio-code-docker-extension-container-confirm.png" alt-text="A screenshot showing how to confirm a Docker container is running in Visual Studio Code." :::

1. Test the web app by right-clicking the container name and selecting **Open in Browser**.

    :::image type="content" source="./media/tutorial-container-web-app/visual-studio-code-docker-extension-container-open.png" lightbox="./media/tutorial-container-web-app/visual-studio-code-docker-extension-container-open.png" alt-text="A screenshot that shows how to browse the endpoint of a Docker container in Visual Studio Code." :::

    The browser opens into your default browser as "http://127.0.0.1:8000" for Django or "http://127.0.0.1:5000/" for Flask.

    > [!NOTE]
    > If you receive a timeout error, verify that the MongoDB service is running. If not, stop the Docker container in VS Code and restart the MongoDB service. Then, start the Docker container again and try to access the web app in your browser.

1. Stop the container.

    1. In the **CONTAINERS** section of the Docker extension, find the running container.

    1. Right-click the container and select **Stop**.

    :::image type="content" source="./media/tutorial-container-web-app/visual-studio-code-docker-extension-container-stop.png" lightbox="./media/tutorial-container-web-app/visual-studio-code-docker-extension-container-stop.png" alt-text="A screenshot showing how to stop a running Docker container in Visual Studio Code." :::

> [!TIP]
> You can also run the container selecting a run or debug configuration. The Docker extension tasks in *tasks.json* are called when you run or debug. The task called depends on what launch configuration you select. For the task "Docker: Python (MongoDB local)", specify \<YOUR-IP-ADDRESS>. For the task "Docker: Python (MongoDB Azure)", specify \<CONNECTION-STRING>.

---

You can also start a container from an image and stop it with the [Docker Desktop](https://www.docker.com/products/docker-desktop/) application.

## Next step

> [!div class="nextstepaction"]
> [Build a container image in Azure](tutorial-containerize-deploy-python-web-app-azure-03.md)
