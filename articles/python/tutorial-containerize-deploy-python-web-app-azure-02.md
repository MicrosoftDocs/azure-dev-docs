---
title: 'Tutorial: Containerized Python web apps on Azure: build and test locally'
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

* Optionally, understand how to run the image container locally.

## 1. Build a Docker image

If you are using one of the the framework sample apps available for Django and Flask, you are set to go. If you are bringing your own sample app, make sure there is a *Dockerfile* in the root directory.

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

At this point, you have build an image locally. The image you created is has a name formatted as `<repository-name>:<tag>` where `<repository-name>` is based on the project name and `<tag>` is set to "latest" for this tutorial. Tags are a way to define version information, intended use, stability, or other information. For more information, see [Recommendations for tagging and versioning container images](/azure/container-registry/container-registry-image-tag-version).

Built images from VS Code or from using the Docker CLI directly can be viewed in the Docker Desktop application.

## 2. Run the image locally in a container

The sample app requires a MongoDB connection string, database name, and collection name. The MongoDB database must be accessible to you locally as well as in Azure. 

> [!TIP])
> You can install [MongoDB](https://www.mongodb.com/docs/manual/installation/) locally or use any MongoDB database you can reach locally. To create an Azure Cosmos DB for MongoDB with theses steps for [Azure portal](/azure/cosmos-db/mongodb/create-mongodb-python), [Azure CLI](/azure/cosmos-db/scripts/cli/mongodb/create), [PowerShell](/azure/cosmos-db/scripts/powershell/mongodb/create), or [VS Code](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-cosmosdb). 

The sample app expects MongoDB connection information to be passed as environment variables. Locally, we pass in MongoDB connection information through environment variables passed to the container. When deployed to Azure, the web app will get these environment values from the App Service configuration parameters, which act as the environment parameters. 

### [VS Code](#tab/vscode-aztools)

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