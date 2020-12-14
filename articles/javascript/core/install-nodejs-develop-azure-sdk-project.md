---
title: Install Node.js for Azure SDK application development
description: Learn how to install Node.js for common development scenarios with Azure.
ms.topic: how-to
ms.date: 12/04/2020
ms.custom: devx-track-js
---

# Install and manage Node.js for common Azure development scenarios

Your installation of Node.js for Azure development should consider both your local development environment and the hosting environment you plan to deploy to. Azure provides hosting for Node.js on both Windows and Linux in the Long Term Support (LTS) version. 

## Minimum version of Node.js 8+

The Azure SDK supports a minimum version of Node.js 8. 

## Download and install Node.js based on your intended use

You can download and install Node.js based on your requirements.
 
* [Node.js Download page](https://nodejs.org/en/download/) 
* [Official Docker image](https://hub.docker.com/_/node/)

## Managing versions of Node.js

Use nvm when you need to manage multiple versions of Node.js for your Azure development.

* OSX, *nix - [nvm](https://github.com/creationix/nvm)
* Windows - [nvm for Windows](https://github.com/marcelklehr/nodist)

## Troubleshooting

1. When troubleshooting Node.js projects, start with installing the project:

    ```bash
    npm install
    ```

1. Verify the version of your local Node.js installation:

    ```bash
    node --version
    ```

## Next steps

* [Configure your local development environment](configure-local-development-environment.md) for Azure SDK usage
