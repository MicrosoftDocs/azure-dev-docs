---
title: Install and manage Node.js for Azure SDK application development
description: Learn how to install and manage Node.js for common development scenarios with Azure, including local and hosting environments.
ms.topic: how-to
ms.date: 08/09/2022
ms.custom: devx-track-js, ai-readiness-20240730
---

# Install and manage Node.js for Azure SDK application development

Learn how to install and manage Node.js for Azure SDK application development. Consider both your local development environment and the hosting environment you plan to deploy to. Azure provides hosting for Node.js on both Windows and Linux in the Long Term Support (LTS) version.

## Azure SDK Node.js minimum version

The Azure SDK supports the [Node.js Long Term Support (LTS) version](https://nodejs.org/en/download/). Read the [Azure SDK Support Policy](https://github.com/Azure/azure-sdk-for-js/blob/main/SUPPORT.md#microsoft-support-policy) for more details.

## Azure services Node.js minimum version

[!INCLUDE [Azure services Node.js minimum version](../includes/nodejs-runtime-for-azure-services.md)]

## Manage multiple versions of Node.js

When you need to manage more than one version of Node.js across your local and remote environments, we recommend:

* **NVM (Node Version Manager)**: A command-line interface to set or switch your local version of Node.js.
    * macOS, Linux - [nvm](https://github.com/creationix/nvm)
    * Windows - [nvm for Windows](https://github.com/marcelklehr/nodist)
* **Containers**: Use a container with a specific Node.js version. You can manage the version of Node.js across several environments using containers. Visual Studio Code's [Remote - Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) simplifies this process.

## Download and install Node.js based on your intended use

You can download and install Node.js based on your requirements.

* [Node.js Download page](https://nodejs.org/en/download/)
* [Official Docker image](https://hub.docker.com/_/node/)

## Next steps

For more information on managing Node.js versions and Azure SDK development, refer to the following resources:

* [Configure your local development environment](configure-local-development-environment.md) for Azure SDK usage
* [Azure SDK for JavaScript documentation](/javascript/api/)

