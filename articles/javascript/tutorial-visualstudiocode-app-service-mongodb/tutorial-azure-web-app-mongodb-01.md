---
title: include file
description: include file
ms.date: 10/13/2020
ms.custom: devx-track-javascript
---
In this section of the tutorial, you need an Azure subscription and all the software to use this tutorial.

## Create or use existing Azure Subscription 

* An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/?utm_source=campaign&utm_campaign=vscode-tutorial-appservice-extension&mktingSource=vscode-tutorial-appservice-extension).

## Install software

- [Node.js and npm](https://nodejs.org/en/download), the Node.js package manager installed to your local machine.
- [Docker](https://docs.docker.com/get-docker/) - Docker is used to provide a local MongoDB database without having to install MongoDB. 
    - If you need to use Docker to get a local MongoDB database, you also need to use:
        -  Visual Studio [Dev Containers](https://code.visualstudio.com/docs/remote/containers) provide several common containers for JavaScript development. 
        - [Remote Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
    - If you already have a local MongoDB, and don't want to install Docker, you can still this step. Any steps using the Development Container to access a locally running MongoDB can be repurposed to use your own local MongoDB as long as the following MongoDB URL is available: 
        - `mongodb://localhost:27017`
- [Visual Studio Code](https://code.visualstudio.com/) installed to your local machine. 
- Visual Studio Code extensions:
    - [Azure App Service extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azureappservice) for Visual Studio Code (installed from within Visual Studio Code).
    - [Azure Databases](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-cosmosdb)

## Want to know more? 

Optional Visual Studio Code extensions:
* [MongoDB for VS Code](https://marketplace.visualstudio.com/items?itemName=mongodb.mongodb-vscode)
* [Docker](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-docker)