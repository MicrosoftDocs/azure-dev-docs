---
title: Deploy Node.js apps to Azure App Service using the Azure CLI
description: Tutorial part 1, Azure CLI introduction and prerequisites.
ms.topic: tutorial
ms.date: 08/04/2021
ms.custom: devx-track-js, devx-track-azurecli
---


# Deploy to Azure App Service using the Azure CLI

In this tutorial, you deploy a Node.js application to Azure App Service using the [Azure Command Line Interface (CLI)](/cli/azure/overview), which runs on all operating systems. With the CLI you can create Azure resources, set up a deployment pipeline between a Git repository and Azure, and view the app's `console.log` output.

## Prerequisites

- An [Azure subscription]((https://azure.microsoft.com/free/).
- [Node.js LTS](https://nodejs.org/en/download), the Node.js package manager.
- [Git](https://git-scm.com/downloads), after which the command `git --version` should show a version number.
[!INCLUDE [Azure CLI](../../../includes/azure-cli-prepare-your-environment-no-header.md)]

### Sign in to Azure with Azure CLI

[!INCLUDE [Sign in ](../../../azure-cli/includes/interactive-login.md)]

## Check npm version

If you already had Node.js installed, run the `node -v` command and verify that the version is an LTS version or higher. If you have an older version, [upgrade](https://nodejs.org/en/download/) to the most current LTS ("Long Term Support") release.

## Next step

* [Create the app](tutorial-vscode-azure-cli-node-02.md)