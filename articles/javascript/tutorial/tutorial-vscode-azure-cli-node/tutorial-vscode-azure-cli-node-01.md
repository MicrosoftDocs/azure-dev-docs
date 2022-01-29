---
title: Deploy Node.js apps to Azure App Service using the Azure CLI
description: Tutorial part 1, Azure CLI introduction and prerequisites.
ms.topic: how-to
ms.date: 08/16/2021
ms.custom: devx-track-js, devx-track-azurecli
# Verified full run: diberry 08/16/2021
---


# 1. Deploy to Azure App Service using the Azure CLI

In this tutorial, you deploy a Node.js application to Azure App Service using the [Azure Command Line Interface (CLI)](/cli/azure/overview). With the Azure CLI you can:

* Create Azure resource.
* Set up a deployment pipeline between a Git repository and Azure.
* Push changes to Azure App service
* View the app's `console.log` output in a streaming log.

* [Sample code](https://github.com/Azure-Samples/js-e2e-express-server) - simple express application

## Prerequisites

- An [Azure subscription](https://azure.microsoft.com/free/).
- [Node.js LTS](https://nodejs.org/en/download), the Node.js package manager.
- [Git](https://git-scm.com/downloads), after which the command `git --version` should show a version number.
[!INCLUDE [Azure CLI](../../../includes/azure-cli-prepare-your-environment-no-header.md)]

### Sign in to Azure with Azure CLI

[!INCLUDE [Sign in ](../../../azure-cli/includes/interactive-login.md)]

## Next step

* [Create the app](tutorial-vscode-azure-cli-node-02.md)