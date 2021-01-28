---
title: 
description: 
ms.topic: how-to
ms.date: 01/28/2021
ms.custom: devx-track-js
---

# Create a container and deploy to Azure app service

## Dockerizing the app

This section focuses on the experience that Visual Studio Code provides for developing with [Docker](https://www.docker.com/). Node.js developers use Docker to provide portable app deployments for both development, CI (continuous integration), and production environments. As Docker presents a steep-learning curve to some, Visual Studio Code provides an extension that tries to help simplify some using Docker in your apps.

Switch back to the **Extensions** tab, search for `docker`, and select the **Docker** extension.

Install the Docker extension, and then reload Visual Studio Code.

![Installing the Docker extension for Visual Studio Code](../media/node-howto-e2e/visual-studio-code-docker-extension.png)

The Docker extension for Visual Studio Code includes a command for generating a *Dockerfile* and the *docker-compose.yml* file for an existing project.

To see the available Docker commands, display the command palette (**F1**) and type `docker`.

![Commands supported by the Docker extension for Visual Studio Code ](../media/node-howto-e2e/visual-studio-code-available-docker-codes.png)

Select **Docker: Add docker files to workspace**, select **Node.js** as the app platform, and specify that the app exposes port `8080`.

The Docker command generates a complete *Dockerfile* and Docker-compose files that you can begin using immediately.

![Generated Dockerfile in Visual Studio Code](../media/node-howto-e2e/visual-studio-code-complete-dockerfile.png)

The Docker extension also provides autocompletion for your *Dockerfile* and *docker-compose.yml* files. For example, open the *Dockerfile* and change line 2 from:

```docker
FROM node:latest
```

To:

```docker
FROM mhart
```

With your cursor positioned after the `t` in `mhart`, press **Ctrl**+**Space** to view all the image repositories that `mhart` has published on DockerHub.

![View image repositories in DockerHub](../media/node-howto-e2e/visual-studio-code-dockerhub-image-repositories.png)

Select `mhart/alpine-node`, which provides everything that this app needs. 

Smaller images are typically better since you want your app builds and deployments to be as fast as possible, which makes distribution and scaling quicker.

Now, that you have generated the *Dockerfile*, you need to build the actual Docker image. Once again, you can use a command that the Docker extension installed in Visual Studio Code. Press **F1**, enter `dockerb` at the command palette, and select the **Docker: Build Image** command. Choose the *Dockerfile* that you just generated and modified. Specify a tag that includes your DockerHub username (for example, `lostintangent/node`). Press **Enter** to launch the integrated terminal window that displays the output of your Docker image being built.

![Docker image build output](../media/node-howto-e2e/docker-build-image-output.png)

Notice that the command automated the process of running `docker build` for you, which is another example of a productivity enhancer that you can either choose to use, or you can just use the Docker CLI directly.

At this point, to make this image easily acquirable for deployments, you need only push the image to DockerHub. To push the image, make sure you have already authenticated with DockerHub by running `docker login` from the CLI and entering your account credentials. Then, in Visual Studio Code, you can bring up the command palette, enter `dockerpush`, and select the `Docker: Push` command. Select the image tag that you just built (for example, `lostintangent/node`) and press **Enter**. The command automates the calling of `docker push` and displays the output in the integrated terminal.
