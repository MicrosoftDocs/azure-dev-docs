---
title: Deploy Node.js apps to Azure App Service using the Azure CLI
description: Tutorial part 1, Azure CLI introduction and prerequisites.
ms.topic: tutorial
ms.date: 09/24/2019
ms.custom: devx-track-js, devx-track-azurecli
---

# Deploy to Azure App Service using the Azure CLI

In this tutorial, you deploy a Node.js application to Azure App Service using the [Azure Command Line Interface (CLI)](/cli/azure/overview?view=azure-cli-latest), which runs on all operating systems. With the CLI you can create Azure resources, set up a deployment pipeline between a Git repository and Azure, and view the app's `console.log` output.

## Prerequisites

- An [Azure subscription](#azure-subscription).
- [Node.js and npm 6.x or higher](https://nodejs.org/en/download), the Node.js package manager.
- [Git](https://git-scm.com/downloads), after which the command `git --version` should show a version number.
- The [Azure CLI](/cli/azure/install-azure-cli).

You can alternately use the [Azure CLI extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=ms-vscode.azurecli), which provides syntax colorization, IntelliSense (completions) and snippets when writing Azure CLI scripts.

A second alternative is the [Azure Cloud Shell](/azure/cloud-shell/overview), which you can use from within Visual Studio Code using the the [Azure Account extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.azure-account).

### Azure subscription

If you don't have an Azure subscription, [sign up now](https://azure.microsoft.com/free/?utm_source=campaign&utm_campaign=vscode-tutorial-node-git&mktingSource=vscode-tutorial-node-git) for a free account with $200 in Azure credits to try out any combination of services.

### Sign in to the Azure CLI

Once the Azure CLI is installed, run the following command from a terminal or command prompt:

```azurecli
az login
```

The command opens a browser window in which you're asked to log into Azure. Once you're logged in, the terminal window shows JSON output with details of your subscription.

## Check npm version

If you already had Node.js installed, run the `node -v` command and verify that the version is 10.x or higher. If you have an older version, [upgrade](https://nodejs.org/en/download/) to the most current LTS ("Long Term Support") release.

> [!div class="nextstepaction"]
> [I installed the prerequisites](tutorial-vscode-azure-cli-node-02.md) [I ran into an issue](https://www.research.net/r/PWZWZ52?tutorial=node-deployment&step=getting-started)
