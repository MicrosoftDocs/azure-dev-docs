---
title: Introduction and prerequisites 
description: Locally build and deploy a React/TypeScript client application to an Azure Static Web App with a GitHub action. 
ms.topic: tutorial
ms.date: 12/17/2020
ms.custom: devx-track-js
---


# 1. Build and deploy a Static Web app to Azure

In this tutorial, locally build and deploy a React/TypeScript client application to an Azure Static Web App with a GitHub action. The React app allows you to analyze an image with Cognitive Services Computer Vision.

* [**Sample code**](https://github.com/Azure-Samples/js-e2e-client-cognitive-services)

[!INCLUDE [Create or use existing Azure Subscription ](../../includes/environment-subscription-h2.md)]

## Prerequisites

- [Node.js and npm](https://nodejs.org/en/download) - installed to your local machine.
- [Visual Studio Code](https://code.visualstudio.com/) - installed to your local machine. 
    - [Azure Static Web Apps (Preview)](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurestaticwebapps) - used to deploy React app to Azure Static Web app.
- [Git](https://git-scm.com/downloads) - used to push to GitHub - which activates the GitHub action.
- [GitHub account](https://github.com/join) - to fork and push to a repo
- Use [Azure Cloud Shell](/azure/cloud-shell/quickstart) using the bash environment.

   [![Embed launch](https://shell.azure.com/images/launchcloudshell.png "Launch Azure Cloud Shell")](https://shell.azure.com)   
- If you prefer, [install](/cli/azure/install-azure-cli) the Azure CLI to run CLI reference commands.
   - If you're using a local install, sign in with Azure CLI by using the [az login](/cli/azure/reference-index#az-login) command.  To finish the authentication process, follow the steps displayed in your terminal.  See [Sign in with Azure CLI](/cli/azure/authenticate-azure-cli) for additional sign-in options.
  - When you're prompted, install Azure CLI extensions on first use.  For more information about extensions, see [Use extensions with Azure CLI](/cli/azure/azure-cli-extensions-overview).
  - Run [az version](/cli/azure/reference-index?#az_version) to find the version and dependent libraries that are installed. To upgrade to the latest version, run [az upgrade](/cli/azure/reference-index?#az_upgrade).

## Next step

> [!div class="nextstepaction"]
> [Understand client app architecture and deployment process with GitHub action](application-architecture.md) 