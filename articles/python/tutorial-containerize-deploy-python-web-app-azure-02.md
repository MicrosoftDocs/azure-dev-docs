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

**Step 1: Open the Docker extension.**

If the Docker extension reports an error, make sure Docker is installed and running. 

**Step 2: Build the image.**

Right-click the *Dockerfile* in the project folder and select **Build Image...**.

Alternately, you can use the Command Palette (<kbd>Ctrl+Shift+P</kbd> or <kbd>F1</kbd>) and type "Docker Images: Build Images" to invoke the command.

**Step 3: Confirm the image was built.**

The tag of the image will be "msdocspythoncontainerwebapp", the name is derived from the name of the project and is automatically selected. If you want more control over the name, use the Docker build command.

For more on the Dockerfile syntax, see the [Dockerfile reference](https://docs.docker.com/engine/reference/builder/).

### [Docker](#tab/docker-commands)

**Step 1: At a shell prompt, confirm that Docker is accessible.**

```dotnetcli
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

```
docker images
```
---


## 2. Run the image locally in a container