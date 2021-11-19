---
title: Create a container image for a Node.js app from Visual Studio Code
description: Docker Tutorial part 4, create a Node.js application image
ms.topic: how-to
ms.date: 08/17/2021
ms.custom: devx-track-js
# Verified full run: diberry 08/16/2021
---

# 4. Create your Node.js application image

In this step, create the image from the local Express.js app. 

## Add Docker files

In Visual Studio Code, open the **Command Palette** (**F1**), type `add docker files to workspace`, then select the **Docker: Add Docker files to workspace** command.

Answer the prompts with the following values:

|Prompt|Value|
|--|--|
|Select application platform|Node.js|
|Choose a package.json file|`myexpressapp\package.json`|
|What port does your app listen on?|3000|
|Include optional Docker Compose files?|No|

The command creates a `Dockerfile` along with some configuration files for Docker compose and a `.dockerignore`.

## Build a Docker image

The `Dockerfile` describes the environment for your app including the location of the source files and the command to start the app within a container.

1. Open the **Command Palette** (**F1**) and run **Docker Images: Build Image** to build the image. VS Code uses the Dockerfile in the current folder and gives the image the same name as the current folder.

1. Once completed, the **Terminal** panel of Visual Studio Code opens to run the `docker build` command. The output also shows each step, or layer, that makes up the app environment.

1. Once built, the image appears in the **DOCKER** explorer under **Images**, named `jse2eexpressserver`.
   
## Modify build task to include tag

To push the image to your registry, you must first tag it with the registry name. Change the build task to always build with your Azure registry name.

1. Open your VS Code's task file, found at `./vscode/tasks.json`.
1. Find the task with the type `docker-build`. 
1. Add the `tag` property, using your registry name (YOUR-REGISTRY-NAME), in the `dockerBuild` property:

    ```json
    {
        "type": "docker-build",
        "label": "docker-build",
        "platform": "node",
        "dockerBuild": {
            "dockerfile": "${workspaceFolder}/Dockerfile",
            "context": "${workspaceFolder}",
            "pull": true,
            "tag": "YOUR-REGISTRY-NAME.azurecr.io/jse2eexpressserver:latest"
        }
    },
    ```

1. As a final step, rebuild so you have the image tagged with your registry. Open the **Command Palette** (**F1**) and run **Docker Images: Build Image** to build the image. 

## Push the image to a registry

1. The newly-tagged image appears now as a _new_ node in Docker explorer, under **Images** and includes the registry name. Expand that node, right-click **latest**, and select **Push**. Accept the tag for that image by pressing **Enter**.

1. The **Terminal** panel shows the `docker push` commands used for this operation. The target registry is determined by the registry specified in the image name. 

1. If the output displays "Authentication required", run `az acr login --name <your registry name>` in the terminal.

1. Once completed, expand the **Registries** node in the Docker extension explorer to see your image in the registry, named `jse2eexpressserver`.

## Next steps

* [Deploy the image from your Azure Container registry to Azure app service](tutorial-vscode-docker-node-05.md)
