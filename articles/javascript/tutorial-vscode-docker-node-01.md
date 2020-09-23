---
title: Deploy Docker containers to Azure App Service from Visual Studio Code
description: Tutorial part 1, introduction and prerequisites.
ms.topic: conceptual
ms.date: 09/20/2019
ms.custom: devx-track-js
---

# Deploy containers to Azure App Service

In this tutorial, you use Visual Studio Code to create a containerized Node.js application using Docker, push the container image to a registry, and then deploy the image to Azure App Service.

## Walkthrough video

Watch this video for a complete walkthrough of the content in this article.

> [!VIDEO https://channel9.msdn.com/Shows/Docs-Azure/Deploy-containers-Azure-App-Service/player]

## Prerequisites

- An [Azure subscription](#azure-subscription).
- [Visual Studio Code](https://code.visualstudio.com/).
- The [Docker extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-docker).
- The [Azure App Service extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azureappservice).
- [Node.js and npm](https://nodejs.org/en/download), the Node.js package manager.
- [Docker](https://www.docker.com/community-edition).

> <a class="tutorial-install-extension-btn" href="https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-docker">Install the Docker extension</a>

> <a class="tutorial-install-extension-btn" href="https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azureappservice">Install the Azure App Service extension</a>

### Azure subscription

If you don't have an Azure subscription, [sign up now](https://azure.microsoft.com/free/?utm_source=campaign&utm_campaign=vscode-tutorial-docker-extension&mktingSource=vscode-tutorial-docker-extension) for a free account with $200 in Azure credits to try out any combination of services.

## Sign in to Azure

[!INCLUDE [azure-sign-in](includes/azure-sign-in.md)]

## Verify Docker install

Verify that you have Docker installed properly by running the following command in a terminal or command prompt:

```bash
docker --version
```

The output should appear something like the following:

<pre>
Docker Version 17.12.0-ce, build c97c6d6
</pre>

> [!div class="nextstepaction"]
> [I installed the Docker extension](tutorial-vscode-docker-node-02.md) [I ran into an issue](https://www.research.net/r/PWZWZ52?tutorial=docker-extension&step=getting-started)
