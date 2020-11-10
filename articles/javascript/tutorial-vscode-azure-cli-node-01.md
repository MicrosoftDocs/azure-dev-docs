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
[!INCLUDE [Azure CLI](~/../azure-docs/includes/azure-cli-prepare-your-environment-no-header.md)]

### Azure subscription

If you don't have an Azure subscription, [sign up now](https://azure.microsoft.com/free/?utm_source=campaign&utm_campaign=vscode-tutorial-node-git&mktingSource=vscode-tutorial-node-git) for a free account with $200 in Azure credits to try out any combination of services.

### Sign in to Azure with Azure CLI

[!INCLUDE [Sign in ](../azure-cli/includes/interactive-login.md)]

## Check npm version

If you already had Node.js installed, run the `node -v` command and verify that the version is 10.x or higher. If you have an older version, [upgrade](https://nodejs.org/en/download/) to the most current LTS ("Long Term Support") release.

> [!div class="nextstepaction"]
> [I installed the prerequisites](tutorial-vscode-azure-cli-node-02.md) [I ran into an issue](https://www.research.net/r/PWZWZ52?tutorial=node-deployment&step=getting-started)
