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

These instruction require [Visual Studio Code](https://code.visualstudio.com/), the [Docker extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-docker) for VS Code, and [Docker](https://docs.docker.com/get-docker/).


| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [A screenshot showing how to open the Docker extension in Visual Studio Code](<./includes/tutorial-container-web-app/build-docker-image-visual-studio-code-1.md>)] | |
| [!INCLUDE [A screenshot showing how to build the Docker image in Visual Studio Code](<./includes/tutorial-container-web-app/build-docker-image-visual-studio-code-2.md>)] | |
| [!INCLUDE [A screenshot showing how to confirm the built image in Visual Studio Code](<./includes/tutorial-container-web-app/build-docker-image-visual-studio-code-3.md>)] | |



**Step 1: Open the Docker extension.**

If the Docker extension reports an error, make sure Docker is installed and running. If this is your first time using this extension, you'll probably won't have any containers, images, or connected registries. That's okay.

**Step 2: Build the image.**

Right-click the *Dockerfile* in the project folder and select **Build Image...**.

Alternately, you can use the Command Palette (<kbd>Ctrl+Shift+P</kbd> or <kbd>F1</kbd>) and type "Docker Images: Build Images" to invoke the command.

**Step 3: Confirm the image was built.**

The tag of the container image will be "msdocspythoncontainerwebapp:latest". The name is derived from the name of the project and is automatically selected as well as the "latest" tag. If you want more control over the name, use the Docker build command.

### [Docker](#tab/docker-cli)

These instruction require [Docker](https://docs.docker.com/get-docker/).

**Step 1: At a shell prompt, confirm that Docker is accessible.**

```
docker
```
If you see the help for the [Docker CLI](https://docs.docker.com/engine/reference/commandline/cli/), then continue. Otherwise, make sure Docker is installed or your shell as access to the Docker CLI.

**Step 2: Build the image.**

Use the command:

```
 docker build --rm --pull --file "<path-to-project-root>/Dockerfile" --label "com.microsoft.created-by=docker-cli" --tag "<container-name>:latest" "<path-to-project-root>" 
```

For example, if you are at the root of the project directory, you can use a command like this:

```
docker build --rm --pull --file "Dockerfile" --label "com.microsoft.create-by=docker-cli" --tag "mycontainer:latest" .
```

**Step 3: Confirm the image was built.**

In the returned list, look for the image you just created.

```
docker images
```

For more information about this command, see [docker images](https://docs.docker.com/engine/reference/commandline/images/) in the Docker Command-line reference.

---

At this point, you have build an image locally. You can also see the image with Docker Desktop.


## 2. Run the image locally in a container

