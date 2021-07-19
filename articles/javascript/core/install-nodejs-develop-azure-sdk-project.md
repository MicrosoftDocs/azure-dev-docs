---
title: Install Node.js for Azure SDK application development
description: Learn how to install Node.js for common development scenarios with Azure.
ms.topic: how-to
ms.date: 07/19/2021
ms.custom: devx-track-js
---

# Install and manage Node.js for Azure development

Your installation of Node.js for Azure development should consider both your local development environment and the hosting environment you plan to deploy to. Azure provides hosting for Node.js on both Windows and Linux in the Long Term Support (LTS) version:

* Node.js 14


## Minimum version of Node.js for Azure SDK

The Azure SDK supports a minimum version of:

* Node.js 10. 

## Minimum version of Node.js for Azure services

If you intend to **host your application on Azure**, without hosting it inside a container, you need to check the minimum Node.js version supported for the service you host with:

* [Azure Static Web apps](/azure/static-web-apps/) - client and API
* [Azure Functions](/azure/azure-functions/) - API only
* [Azure Apps](/azure/app-service/) - server

## Manage versions of Node.js

When you need to manage more than one version of Node.js across your local and remote environments, we recommend:

* NVM: a command-line interface to set or switch your local version of Node.js. 
    * OSX, *nix - [nvm](https://github.com/creationix/nvm)
    * Windows - [nvm for Windows](https://github.com/marcelklehr/nodist) 
* Containers: Use a container with a specific Node.js minimum version. You can manage the version of Node.js across several environments using containers. Visual Studio Code's [Remote - Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) extension simplifies container use. After you install [Docker](https://www.docker.com/), and you have your project open, use the extension to load the project into a container and attach to the container to debug. 

## Download and install Node.js based on your intended use

You can download and install Node.js based on your requirements.
 
* [Node.js Download page](https://nodejs.org/en/download/) 
* [Official Docker image](https://hub.docker.com/_/node/)

## Next steps

* [Configure your local development environment](configure-local-development-environment.md) for Azure SDK usage
