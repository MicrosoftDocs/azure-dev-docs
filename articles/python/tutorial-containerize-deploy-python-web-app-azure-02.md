---
title: "Tutorial: Containerized Python web apps on Azure - Build and test locally"
description: Build and test a containerized Python web app locally.
ms.topic: conceptual
ms.date: 06/27/2022
ms.custom: devx-track-python
ms.prod: azure-python
author: jess-johnson-msft
ms.author: jejohn
---

# Build and test a containerized Python web app locally

This article is part of a tutorial about containerizing and deploy a Python web app to Azure App Service. App Service enables you to run containerized web apps and deploy through continuous integration/continuous deployment (CI/CD) capabilities with Docker Hub, Azure Container Registry, and Visual Studio Team Services. In this part of the tutorial, you learn how to build and run the containerized Python web app locally.

After completing this part of the tutorial, you will

* Understand a Dockerfile and how it it is used to build the container image.

* Understand how to use tags as reference for Docker images and use the tag to reference the image. 

## 1. Build a Docker image

### [VS Code](#tab/vscode-aztools)

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

At this point, you have build an image locally. You can also see and work the image with Docker Desktop.

## 2. Run the image locally in a container

The sample app requires a MongoDB connection string, database name, and collection name. You can create an Azure Cosmos DB for MongoDB, you can use the steps for [Azure portal](/azure/cosmos-db/mongodb/create-mongodb-python), [Azure CLI](/azure/cosmos-db/scripts/cli/mongodb/create), [PowerShell](/azure/cosmos-db/scripts/powershell/mongodb/create), or [VS Code](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-cosmosdb). 

### [VS Code](#tab/vscode-aztools)

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [A screenshot showing how to run a Docker container in Visual Studio Code](<./includes/tutorial-container-web-app/run-docker-image-visual-studio-code-1.md>)] | |
| [!INCLUDE [A screenshot showing how to confirm the Docker container is running in Visual Studio Code](<./includes/tutorial-container-web-app/run-docker-image-visual-studio-code-2.md>)] |  |
| [!INCLUDE [A screenshot showing how to browse the endpoint of the container in Visual Studio Code](<./includes/tutorial-container-web-app/run-docker-image-visual-studio-code-3.md>)] | |
| [!INCLUDE [A screenshot showing how to stop a container in Visual Studio Code](<./includes/tutorial-container-web-app/run-docker-image-visual-studio-code-4.md>)] | |

### [Docker CLI](#tab/docker-cli)

**Step 1.** Build the latest version of the image.

```
docker run --rm -d  -p 5002:5002/tcp mycontainer:latest  
```

**Step 2.** Confirm that the container is running.

Use the [docker container ls](https://docs.docker.com/engine/reference/commandline/container_ls/) command.

```
docker container ls
```

You should see your container "mycontainer:latest" in the list. Note the `NAMES` column of the output. You can use this name to stop the container.

**Step 3.** Test the web app.

Go to "http://localhost:5002/" for Flask or "http://localhost:8000" for Django.

**Step 4.** Shut down the container

```
docker container stop <name>
```

---

You can also start a container from an image and stop it with the Docker Desktop.