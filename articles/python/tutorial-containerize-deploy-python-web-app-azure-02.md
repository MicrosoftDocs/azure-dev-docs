---
title: 'Tutorial: Containerized Python web apps on Azure: build and test locally'
description: Build and test a containerized Python web app locally.
ms.topic: conceptual
ms.date: 07/07/2022
ms.custom: devx-track-python
ms.prod: azure-python
author: jess-johnson-msft
ms.author: jejohn
---

# Build and test a containerized Python web app locally

This article is part of a tutorial about containerizing and deploy a Python web app to Azure App Service. App Service enables you to run containerized web apps and deploy through continuous integration/continuous deployment (CI/CD) capabilities with Docker Hub, Azure Container Registry, and Visual Studio Team Services. In this part of the tutorial, you learn how to build and run the containerized Python web app locally. *This is an optional step and it not needed to deploy the sample apps to Azure.*

Running a Docker image locally in your development environment requires setup beyond deployment to Azure. Think of it as an investment than can make future development cycles quicker and easier, especially when you move beyond a sample app and you start to create your own web app. To deploy a sample app or other app that doesn't need modification, you can skip this step and move on to deployment steps in this tutorial. You can always return to this step after deploying to Azure and work on these steps.

## 1. Build a Docker image

If you are using one of the the framework sample apps available for Django and Flask, you are set to go. If you are bringing your own sample app, make sure there is a *Dockerfile* in the root directory.

### [VS Code](#tab/vscode-docker)

These instructions require [Visual Studio Code](https://code.visualstudio.com/), the [Docker extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-docker) for VS Code, and [Docker](https://docs.docker.com/get-docker/).

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [A screenshot showing how to open the Docker extension in Visual Studio Code](<./includes/tutorial-container-web-app/build-docker-image-visual-studio-code-1.md>)] | :::image type="content" source="./media/tutorial-container-web-app/visual-studio-code-open-docker-extension-240px.png" lightbox="./media/tutorial-container-web-app/visual-studio-code-open-docker-extension.png" alt-text="A screenshot showing how to open the Docker extension in Visual Studio Code." ::: |
| [!INCLUDE [A screenshot showing how to build the Docker image in Visual Studio Code](<./includes/tutorial-container-web-app/build-docker-image-visual-studio-code-2.md>)] | :::image type="content" source="./media/tutorial-container-web-app/visual-studio-code-docker-extension-build-image-240px.png" lightbox="./media/tutorial-container-web-app/visual-studio-code-docker-extension-build-image.png" alt-text="A screenshot showing how to build the Docker image in Visual Studio Code." ::: |
| [!INCLUDE [A screenshot showing how to confirm the built image in Visual Studio Code](<./includes/tutorial-container-web-app/build-docker-image-visual-studio-code-3.md>)] | :::image type="content" source="./media/tutorial-container-web-app/visual-studio-code-docker-extension-view-images-240px.png" lightbox="./media/tutorial-container-web-app/visual-studio-code-docker-extension-view-images.png" alt-text="A screenshot showing how to confirm the built image in Visual Studio Code." ::: |

### [Docker CLI](#tab/docker-cli)

These instructions require [Docker](https://docs.docker.com/get-docker/).

[!INCLUDE [Build an image with the Docker CLI](<./includes/tutorial-container-web-app/build-docker-image-docker-cli.md>)]

---

At this point, you have build an image locally. The image you created is has a name formatted as `<repository-name>:<tag>` where `<repository-name>` is based on the project name and `<tag>` is set to "latest" for this tutorial. Tags are a way to define version information, intended use, stability, or other information. For more information, see [Recommendations for tagging and versioning container images](/azure/container-registry/container-registry-image-tag-version).

Built images from VS Code or from using the Docker CLI directly can be viewed in the Docker Desktop application.

## 2. Set up MongoDB

This tutorial assumes you have MongoDB installed locally or you have MongoDB hosted in Azure or anywhere else you have access to. Don't use a MongoDB database you'll use in production.

### [Local MongoDB](#tab/mongodb-local)

**Step 1:** Install [MongoDB](https://www.mongodb.com/docs/manual/installation/) if isn't already.

Check if it is installed:

```
mongo --version
```

**Step 2:** Edit the `mongod.cfg` file to add current IP address.

The [mongod configuration file](https://www.mongodb.com/docs/manual/reference/configuration-options/) has a `bindIp` key that defines hostnames and IP addresses that MongoDB listens for client connections. Add the current IP of your local development computer. The sample app running locally in a Docker container will communicate to the host machine with this address as configured in the next step.

For example, part of the configuration file will look like this.
```
net:
  port: 27017
  bindIp: 127.0.0.1,<local-ip-address>
```

Restart MongoDB to pick up changes to the configuration file.  

**Step 3:** Create a database and collection in that database.

Set the database name to "sample_db" and the collection name to "sample_coll". You can use the VS Code [MongoDB extension](https://code.visualstudio.com/docs/azure/mongodb), the [MonogoDB Shell (mongosh)](https://www.mongodb.com/docs/mongodb-shell/), or any other MondoDB-aware tool.

For the MongoDB shell, here are examples of commands to create the database and collection:

```
> help
> use sample_db
> db.sample_coll.insertOne()
> show dbs
> exit
```

At this point, your local MongoDB connection string is "mongodb://127.0.0.1:27017/", the database name is "sample_db", and the collection name is "sample_coll".

### [Azure Cosmos DB MongoDB](#tab/mongodb-azure)

**Step 1:** Get connection information from an existing MongoDB database.

You can create an Azure Cosmos DB for MongoDB with [Azure portal](/azure/cosmos-db/mongodb/create-mongodb-python), [Azure CLI](/azure/cosmos-db/scripts/cli/mongodb/create), [PowerShell](/azure/cosmos-db/scripts/powershell/mongodb/create), or [VS Code](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-cosmosdb). For the steps below, you'll need a connection string, a database name, and a collection name to use.

**Step 2:** Create or ensure that a database and collection exists in the database.

Set the database name to "sample_db" and the collection name to "sample_coll". You can do this using the [Azure Cloud Shell](https://docs.microsoft.com/en-us/azure/cloud-shell/quickstart) and the Azure CLI. For more information, see [Create a database and collection for MongoDB for Azure Cosmos DB using Azure CLI](/azure/cosmos-db/scripts/cli/mongodb/create).

At this point, your Cosmos DB MongoDB connection string is of the form "mongodb://\<server-name>:\<password>@\<server-name>.mongo.cosmos.azure.com:10255/?ssl=true&\<other-parameters>", the database name is "sample_db", and the collection name is "sample_coll". 

----

## 3. Run the image locally in a container

With information on how to connect to a MongoDB, you are ready to run the container locally. The sample app expects MongoDB connection information to be passed as environment variables. Locally, you'll specify this information through environment variables passed to the Docker container. There are a number of ways to get environment variables passed to container. Each has advantages and disadvantages in terms of security. You should avoid checking in any sensitive information or leaving sensitive information in code in the container. 

> [!NOTE]
> When deployed to Azure, the web app will get connection info from  environment values set as App Service configuration settings and none of the modifications to VS Code files and Docker commands applies. 

### [VS Code](#tab/vscode-docker)

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [A screenshot showing how to add environment variables to a Docker container in Visual Studio Code](<./includes/tutorial-container-web-app/run-docker-image-visual-studio-code-0.md>)] |  |
| [!INCLUDE [A screenshot showing how to run a Docker container in Visual Studio Code](<./includes/tutorial-container-web-app/run-docker-image-visual-studio-code-1.md>)] | :::image type="content" source="./media/tutorial-container-web-app/visual-studio-code-docker-extension-container-run-240px.png" lightbox="./media/tutorial-container-web-app/visual-studio-code-docker-extension-container-run.png" alt-text="A screenshot showing how to run a Docker container in Visual Studio Code." ::: |
| [!INCLUDE [A screenshot showing how to confirm the Docker container is running in Visual Studio Code](<./includes/tutorial-container-web-app/run-docker-image-visual-studio-code-2.md>)] | :::image type="content" source="./media/tutorial-container-web-app/visual-studio-code-docker-extension-container-confirm-240px.png" lightbox="./media/tutorial-container-web-app/visual-studio-code-docker-extension-container-confirm.png" alt-text="A screenshot showing how to confirm a Docker container is running in Visual Studio Code." ::: |
| [!INCLUDE [A screenshot showing how to browse the endpoint of the container in Visual Studio Code](<./includes/tutorial-container-web-app/run-docker-image-visual-studio-code-3.md>)] | :::image type="content" source="./media/tutorial-container-web-app/visual-studio-code-docker-extension-container-open-240px.png" lightbox="./media/tutorial-container-web-app/visual-studio-code-docker-extension-container-open.png" alt-text="A screenshot showing how to confirm a Docker container is running in Visual Studio Code." ::: |
| [!INCLUDE [A screenshot showing how to stop a container in Visual Studio Code](<./includes/tutorial-container-web-app/run-docker-image-visual-studio-code-4.md>)] | :::image type="content" source="./media/tutorial-container-web-app/visual-studio-code-docker-extension-container-stop-240px.png" lightbox="./media/tutorial-container-web-app/visual-studio-code-docker-extension-container-stop.png" alt-text="A screenshot showing how to stop a running Docker container in Visual Studio Code." ::: |

### [Docker CLI](#tab/docker-cli)

[!INCLUDE [Run an image with the Docker CLI](<./includes/tutorial-container-web-app/run-docker-image-docker-cli.md>)]

---

You can also start a container from an image and stop it with the Docker Desktop application.