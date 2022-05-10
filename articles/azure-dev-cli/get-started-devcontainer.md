---
title: Get started with Azure Developer CLI using DevContainer
description: Learn how to get started with Azure Developer CLI using Dev Container
keywords: 
author: puicchan
ms.author: puichan
ms.date: 5/5/2022
ms.topic: article
ms.custom: devx-track-azdev
ms.prod: azure
---

# Get started with Dev Container

We'll use the [Todo Application with Node.js and Azure Cosmo DB API for MongoDB](https://github.com/azure-samples/todo-nodejs-mongo) for this walkthrough. 

## Prerequisites

### Azure Developer CLI

Start by installing the Azure Developer CLI:

```bash
npm uninstall -g @azure/az-dev-cli
npm install -g https://azuresdkreleasepreview.blob.core.windows.net/azd/standalone/latest/azure-az-dev-cli-latest.tgz
```

### Azure Developer CLI VS Code Extension

The Azure Developer CLI experience includes an Azure Developer CLI VS Code Extension that mirrors all of the CLI commands into context menu and command palette options. If you're a VS Code user, then we highly recommend installing this extension for the best experience.

1. Download the extension from https://aka.ms/azure-dev/vsix
1. In VS Code
    - Open "Extensions" (Ctrl+Shift+X)
    - Select the ... menu at top of Extensions sidebar
    - Select "Install from VSIX"
    - Select location of downloaded file

A [DevContainer](https://code.visualstudio.com/docs/remote/containers) is a Docker image that includes all of the prerequisites you need to run this application on your local machine. You can find the specification for this application's DevContainer here: https://github.com/Azure-Samples/todo-nodejs-mongo/blob/main/.devcontainer/Dockerfile.

  To use the DevContainer, you'll need the following installed on your local machine:

  2. [Docker Desktop](https://aka.ms/azure-dev/docker-install) (Other options coming soon...)
  3. [Remote - Containers VS Code Extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

### Azure Subscription

This template will create infrastructure and deploy code to Azure. If you don't have an Azure Subscription, sign up for a [free account here](https://azure.microsoft.com/free/). 

### Initialize Project

```bash
azd init --template todo-nodejs-mongo
```

You'll be prompted for the following information:

- `Environment Name`: Prefix for all your Azure resources, make sure it's globally unique and under 15 characters.
- `Azure Location`: The Azure location where your resources will be deployed.
- `Azure Subscription`: The Azure Subscription where your resources will be deployed.

### Open DevContainer

Open the project in VS Code, hit F1 and choose: `Remote-Containers: Rebuild and Reopen in Container`

[!INCLUDE [azd-quickstart](includes/azd-quickstart.md)]

## Explore more samples

To learn more about how to use the Azure Developer CLI, see our [sample templates](azure-dev-cli-templates.md).

## Reference and release notes

A [reference](azure-cli-ref) is available.

## Get help and give feedback

Post questions to the community on [Discussions](https://github.com/Azure/azure-dev/discussions). Report bugs and open issues against the Azure Developer CLI in the [GitHub repository](https://github.com/Azure/azure-dev).