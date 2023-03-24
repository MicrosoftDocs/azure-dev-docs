---
title: Build and run a containerized Python web app locally with MongoDB
description: Build and run a containerized Python web app (Django or Flask) locally with MongoDB in preparation for deployment to Azure App Service.
ms.topic: conceptual
ms.date: 08/16/2022
ms.custom: devx-track-python
---

# Build and run a containerized Python web app locally with MongoDB

This article is part of a tutorial about how to containerize and deploy a containerized Python web app to Azure App Service. App Service enables you to run containerized web apps and deploy through continuous integration/continuous deployment (CI/CD) capabilities with Docker Hub, Azure Container Registry, and Visual Studio Team Services. In this part of the tutorial, you learn how to build and run the containerized Python web app locally. ***This step is optional and isn't required to deploy the sample app to Azure.***

Running a Docker image locally in your development environment requires setup beyond deployment to Azure. Think of it as an investment that can make future development cycles easier, especially when you move beyond sample apps and you start to create your own web apps. To deploy the sample apps for [Django](https://github.com/Azure-Samples/msdocs-python-django-container-web-app) and [Flask](https://github.com/Azure-Samples/msdocs-python-flask-container-web-app), you can skip this step and go to the next step in this tutorial. You can always return after deploying to Azure and work through these steps.

The service diagram shown below highlights the components covered in this article.

:::image type="content" source="./media/tutorial-container-web-app/containerization-of-python-apps-run-local.png" alt-text="A screenshot of the Tutorial - Containerized Python App on Azure with local part highlighted." lightbox="./media/tutorial-container-web-app/containerization-of-python-apps-run-local.png":::

## 1. Clone or download the sample app

### [Git clone](#tab/sample-app-git-clone)

Clone the repository:

```terminal
# Django
git clone https://github.com/Azure-Samples/msdocs-python-django-container-web-app.git

# Flask
git clone https://github.com/Azure-Samples/msdocs-python-flask-container-web-app.git
```

Then navigate into that folder:

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

If you're using one of the framework sample apps available for [Django](https://github.com/Azure-Samples/msdocs-python-django-container-web-app) and [Flask](https://github.com/Azure-Samples/msdocs-python-flask-container-web-app), you're set to go. If you're working with your own sample app, take a look to see how the sample apps are set up, in particular the *Dockerfile* in the root directory.

### [VS Code](#tab/vscode-docker)

These instructions require [Visual Studio Code](https://code.visualstudio.com/) and the [Docker extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-docker). Go to the sample folder you cloned or downloaded and open VS Code with the command `code .`.

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [A screenshot showing how to open the Docker extension in Visual Studio Code](<./includes/tutorial-container-web-app/build-docker-image-visual-studio-code-1.md>)] | :::image type="content" source="./media/tutorial-container-web-app/visual-studio-code-open-docker-extension-240px.png" lightbox="./media/tutorial-container-web-app/visual-studio-code-open-docker-extension.png" alt-text="A screenshot showing how to open the Docker extension in Visual Studio Code." ::: |
| [!INCLUDE [A screenshot showing how to build the Docker image in Visual Studio Code](<./includes/tutorial-container-web-app/build-docker-image-visual-studio-code-2.md>)] | :::image type="content" source="./media/tutorial-container-web-app/visual-studio-code-docker-extension-build-image-240px.png" lightbox="./media/tutorial-container-web-app/visual-studio-code-docker-extension-build-image.png" alt-text="A screenshot showing how to build the Docker image in Visual Studio Code." ::: |
| [!INCLUDE [A screenshot showing how to confirm the built image in Visual Studio Code](<./includes/tutorial-container-web-app/build-docker-image-visual-studio-code-3.md>)] | :::image type="content" source="./media/tutorial-container-web-app/visual-studio-code-docker-extension-view-images-240px.png" lightbox="./media/tutorial-container-web-app/visual-studio-code-docker-extension-view-images.png" alt-text="A screenshot showing how to confirm the built image in Visual Studio Code." ::: |

### [Docker CLI](#tab/docker-cli)

These instructions require [Docker](https://docs.docker.com/get-docker/).

[!INCLUDE [Build an image with the Docker CLI](<./includes/tutorial-container-web-app/build-docker-image-docker-cli.md>)]

---

At this point, you have built an image locally. The image you created has the name "msdocspythoncontainerwebapp" and tag "latest". Tags are a way to define version information, intended use, stability, or other information. For more information, see [Recommendations for tagging and versioning container images](/azure/container-registry/container-registry-image-tag-version).

Images that are built from VS Code or from using the Docker CLI directly can also be viewed with the [Docker Desktop](https://www.docker.com/products/docker-desktop/) application.

## 3. Set up MongoDB

This tutorial assumes you have MongoDB installed locally or you have MongoDB hosted in Azure or elsewhere that you have access to. Don't use a MongoDB database you'll use in production.

### [Local MongoDB](#tab/mongodb-local)

**Step 1:** Install [MongoDB](https://www.mongodb.com/docs/manual/installation/) if it isn't already.

Check if it's installed:

```
mongo --version
```

**Step 2:** Edit the *mongod.cfg* file to add your computer's IP address.

The [mongod configuration file](https://www.mongodb.com/docs/manual/reference/configuration-options/) has a `bindIp` key that defines hostnames and IP addresses that MongoDB listens for client connections. Add the current IP of your local development computer. The sample app running locally in a Docker container will communicate to the host machine with this address.

For example, part of the configuration file should look like this:

```yml
net:
  port: 27017
  bindIp: 127.0.0.1,<local-ip-address>
```

Restart MongoDB to pick up changes to the configuration file.  

**Step 3:** Create a database and collection in the local MongoDB database.

Set the database name to "restaurants_reviews" and the collection name to "restaurants_reviews". You can create a database and collection with the VS Code [MongoDB extension](https://code.visualstudio.com/docs/azure/mongodb), the [MonogoDB Shell (mongosh)](https://www.mongodb.com/docs/mongodb-shell/), or any other MondoDB-aware tool.

For the MongoDB shell, here are example commands to create the database and collection:

```
> help
> use restaurants_reviews
> db.restaurants_reviews.insertOne()
> show dbs
> exit
```

At this point, your local MongoDB connection string is "mongodb://127.0.0.1:27017/", the database name is "restaurants_reviews", and the collection name is "restaurants_reviews".

### [Azure Cosmos DB for MongoDB](#tab/mongodb-azure)

**Step 1:** If needed, create a MongoDB database.

You can create an Azure Cosmos DB for MongoDB with [Azure portal](/azure/cosmos-db/mongodb/create-mongodb-python), [Azure CLI](/azure/cosmos-db/scripts/cli/mongodb/create), [PowerShell](/azure/cosmos-db/scripts/powershell/mongodb/create), or [VS Code](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-cosmosdb).

**Step 2:** Create or ensure that a database and collection exists in the database.

Create a database named "restaurants_reviews" and a collection named "restaurants_reviews". You can do this using the [Azure Cloud Shell](/azure/cloud-shell/quickstart) and the Azure CLI. For more information, see [Create a database and collection for MongoDB for Azure Cosmos DB using Azure CLI](/azure/cosmos-db/scripts/cli/mongodb/create). You can also use the VS Code [Azure Database](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-cosmosdb) extension to create databases and collections.

At this point, you should have an Azure Cosmos DB for MongoDB connection string of the form `mongodb://\<server-name>:\<password>@\<server-name>.mongo.cosmos.azure.com:10255/?ssl=true&\<other-parameters>`, a database named `restaurants_reviews`, and a collection named `restaurants_reviews`. 

If you are working in VS Code, you can right-click on the MongoDB server and get the connection string.

----

## 4. Run the image locally in a container

With information on how to connect to a MongoDB, you're ready to run the container locally. The sample app expects MongoDB connection information to be passed in environment variables. There are several ways to get environment variables passed to container locally. Each has advantages and disadvantages in terms of security. You should avoid checking in any sensitive information or leaving sensitive information in code in the container.

> [!NOTE]
> When deployed to Azure, the web app will get connection info from environment values set as App Service configuration settings and none of the modifications for the local development environment scenario apply.

### [VS Code](#tab/vscode-docker)

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [A screenshot showing how to add environment variables to a Docker container in Visual Studio Code](<./includes/tutorial-container-web-app/run-docker-image-visual-studio-code-0.md>)] | :::image type="content" source="./media/tutorial-container-web-app/visual-studio-code-settings-file-240px.png" lightbox="./media/tutorial-container-web-app/visual-studio-code-settings-file.png" alt-text="A screenshot showing the settings.json file Visual Studio Code." ::: |
| [!INCLUDE [A screenshot showing how to run a Docker container in Visual Studio Code](<./includes/tutorial-container-web-app/run-docker-image-visual-studio-code-1.md>)] | :::image type="content" source="./media/tutorial-container-web-app/visual-studio-code-docker-extension-container-run-240px.png" lightbox="./media/tutorial-container-web-app/visual-studio-code-docker-extension-container-run.png" alt-text="A screenshot showing how to run a Docker container in Visual Studio Code." ::: |
| [!INCLUDE [A screenshot showing how to confirm the Docker container is running in Visual Studio Code](<./includes/tutorial-container-web-app/run-docker-image-visual-studio-code-2.md>)] | :::image type="content" source="./media/tutorial-container-web-app/visual-studio-code-docker-extension-container-confirm-240px.png" lightbox="./media/tutorial-container-web-app/visual-studio-code-docker-extension-container-confirm.png" alt-text="A screenshot showing how to confirm a Docker container is running in Visual Studio Code." ::: |
| [!INCLUDE [A screenshot showing how to browse the endpoint of the container in Visual Studio Code](<./includes/tutorial-container-web-app/run-docker-image-visual-studio-code-3.md>)] | :::image type="content" source="./media/tutorial-container-web-app/visual-studio-code-docker-extension-container-open-240px.png" lightbox="./media/tutorial-container-web-app/visual-studio-code-docker-extension-container-open.png" alt-text="A screenshot showing how to browse the endpoint of a Docker container in Visual Studio Code." ::: |
| [!INCLUDE [A screenshot showing how to stop a container in Visual Studio Code](<./includes/tutorial-container-web-app/run-docker-image-visual-studio-code-4.md>)] | :::image type="content" source="./media/tutorial-container-web-app/visual-studio-code-docker-extension-container-stop-240px.png" lightbox="./media/tutorial-container-web-app/visual-studio-code-docker-extension-container-stop.png" alt-text="A screenshot showing how to stop a running Docker container in Visual Studio Code." ::: |


> [!TIP]
> You can also run the container selecting a run or debug configuration. The Docker extension tasks in *tasks.json* are called when you run or debug. The task called depends on what launch configuration you select.  For the task "Docker: Python (MongoDB local)", specify \<YOUR-IP-ADDRESS>. For the task "Docker: Python (MongoDB Azure)", specify \<CONNECTION-STRING>.


### [Docker CLI](#tab/docker-cli)

[!INCLUDE [Run an image with the Docker CLI](<./includes/tutorial-container-web-app/run-docker-image-docker-cli.md>)]

---

You can also start a container from an image and stop it with the [Docker Desktop](https://www.docker.com/products/docker-desktop/) application.

## Next step

> [!div class="nextstepaction"]
> [Build a container image in Azure](tutorial-containerize-deploy-python-web-app-azure-03.md)
