---
title: Create container image from local project
description: Create a Dockerfile of your local development project with Visual Studio Code
ms.topic: how-to
ms.date: 01/28/2021
ms.custom: devx-track-js
---

# Create a container image and deploy to Azure app service

Running an app in a container is an industry practice to deploy a consistent experience for your web app users. Because Docker presents a steep-learning curve to some, Visual Studio Code provides an extension that tries to help simplify some using Docker in your apps.

## Prepare your environment 

[Docker](https://www.docker.com/) needs to be installed and running. Verify this with the following command:

```bash
docker system info
```

This command returns an error if Docker isn't running. 

## Create a container

1. Open Visual Studio to an existing Node.js project. 
1. In the activity bar, select **Extensions** icon, then search for `docker`, and select the **Docker** [extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-docker).
1. Install the Docker extension, and then reload Visual Studio Code.

    ![Installing the Docker extension for Visual Studio Code](../media/node-howto-e2e/visual-studio-code-docker-extension.png)

    The Docker extension for Visual Studio Code includes a command for generating a *Dockerfile* and the *docker-compose.yml* file for an existing project.

## View available Docker commands

To see the available Docker commands, display the command palette (**F1**) and type `docker`.

![Commands supported by the Docker extension for Visual Studio Code ](../media/node-howto-e2e/visual-studio-code-available-docker-codes.png)

## Create a Dockerfile in your project

1. Select **Docker: Add docker files to workspace**, select **Node.js** as the app platform, and specify that the app exposes port `8080`.

    ![Generated Dockerfile in Visual Studio Code](../media/node-howto-e2e/visual-studio-code-complete-dockerfile.png)

    The Docker command generates a complete *Dockerfile* and Docker-compose files that you can begin using immediately.

## Build image from your project

1. Select **F1**, enter `dockerb` at the command palette, and select the **Docker: Build Image** command. 
1. Choose the *Dockerfile* that you just generated. 
1. Specify a tag with the format of `ALIAS/IMAGE-NAME` where ALIAS is your Docker alias and IMAGE-NAME is the name for you project's image. An example tag is `diberry/express-web-app`. 
1. Select **Enter** to launch the integrated terminal window that displays the output of your Docker image being built.

    ![Docker image build output](../media/node-howto-e2e/docker-build-image-output.png)

    The command automated the process of running `docker build` for you.

## Push image to container registry

    At this point, to make this image easily acquirable for deployments, you need to push the image to DockerHub or your own Azure container registry. To push the image, make sure you have already authenticated with DockerHub by running `docker login` from the CLI and entering your account credentials. Then, in Visual Studio Code, you can bring up the command palette, enter `dockerpush`, and select the `Docker: Push` command. Select the image tag that you just built (for example, `lostintangent/node`) and press **Enter**. The command automates the calling of `docker push` and displays the output in the integrated terminal.
