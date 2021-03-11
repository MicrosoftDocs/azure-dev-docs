---
title: Install Node.js for Azure SDK application development
description: Learn how to install Node.js for common development scenarios with Azure.
ms.topic: how-to
ms.date: 03/11/2021
ms.custom: devx-track-js
---

# Install and manage Node.js for Azure development

Your installation of Node.js for Azure development should consider both your local development environment and the hosting environment you plan to deploy to. Azure provides hosting for Node.js on both Windows and Linux in the Long Term Support (LTS) version. 

## Minimum version of Node.js for Azure SDK

The Azure SDK supports a minimum version of:

* Node.js 8. 

## Minimum version of Node.js for Azure services

If you intend to host your application on Azure, without hosting it inside a container, you need to check the minimum Node.js version supported for the service you host with:

* [Azure Static Web apps](/azure/static-web-apps/) - client and API
* [Azure Functions](/azure/azure-functions/) - API only
* [Azure Apps](/azure/app-service/) - server

## Manage versions of Node.js

When you need to manage more than one version of Node.js across your local and remote environments, use either of the following choices:

* [NVM](#manage-version-with-nvm) - Node version manager
* [Containers](#manage-version-with) - Use a container with a specific Node.js minimum version

## Manage Node.js version with NVM

Use nvm when you need to manage multiple versions of Node.js for your Azure development.

* OSX, *nix - [nvm](https://github.com/creationix/nvm)
* Windows - [nvm for Windows](https://github.com/marcelklehr/nodist)

## Manage Node.js version with Containers

You can manage the version of Node.js across several environments using containers. Visual Studio Code's [Remote - Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) extension makes container use very simple. 

After you install [Docker](https://www.docker.com/), and you have your project open, use the extension to load the project in to a container and attach to the container to debug.  

## Download and install Node.js based on your intended use

You can download and install Node.js based on your requirements.
 
* [Node.js Download page](https://nodejs.org/en/download/) 
* [Official Docker image](https://hub.docker.com/_/node/)

## Next steps

* [Configure your local development environment](configure-local-development-environment.md) for Azure SDK usage
