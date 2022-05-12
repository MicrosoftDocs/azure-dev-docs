---
title: Get started with Azure Developer CLI using bare metal set-up
description: Learn how to get started with Azure Developer CLI using bare metal set-up
keywords: 
author: puicchan
ms.author: puichan
ms.date: 5/5/2022
ms.topic: article
ms.custom: devx-track-azdev
ms.prod: azure
---

# Get started with bare metal set-up

We'll use the [Todo Application with Node.js and Azure Cosmo DB API for MongoDB](https://github.com/azure-samples/todo-nodejs-mongo) for this walkthrough. For more information including architecture diagram and the Azure resources you'll deploy, see the [README](https://github.com/azure-samples/todo-nodejs-mongo).

## Prerequisites

Before you get started, ensure you have the following tools installed on your local machine:

- [Git](https://git-scm.com/)
- [GitHub CLI v2.3+](https://github.com/cli/cli)
- [Azure CLI (v 2.30.0+)](/cli/azure/install-azure-cli)
- Azure Dev CLI (see install instructions below)

```bash
npm uninstall -g @azure/az-dev-cli
npm install -g https://azuresdkreleasepreview.blob.core.windows.net/azd/standalone/latest/azure-az-dev-cli-latest.tgz
```
> [!NOTE]
> May require `sudo` depending on platform and configuration

Make sure you have the following language specific pre-requisite installed on your local machine:
- [Node.js with npm (v 16.13.1 LTS)](https://nodejs.org/)

> [!NOTE] 
> You can refer to the DevContainer dependencies in You can find the language specification prerequisite for this application here: https://github.com/Azure-Samples/todo-nodejs-mongo/blob/main/.devcontainer/Dockerfile.

### Project Folder

You'll need an empty folder on your computer to house the project files that will be copied from this repository.

1. Open your favorite terminal and create a new folder.

```bash
mkdir {your-unique-project-folder-name}
```

2. Now, set your current directory to that newly created folder.

```bash
cd {your-unique-project-folder-name}
```

### Azure Subscription

This template will create infrastructure and deploy code to Azure. If you don't have an Azure Subscription, sign up for a [free account here](https://azure.microsoft.com/free/). 

## Quickstart

### 1. Initialize Project

```bash
azd init --template todo-nodejs-mongo
```

You'll be prompted for the following information:

- `Environment Name`: Prefix for all your Azure resources, make sure it's globally unique and under 15 characters.
- `Azure Location`: The Azure location where your resources will be deployed.
- `Azure Subscription`: The Azure Subscription where your resources will be deployed.

[!INCLUDE [azd-quickstart](includes/azd-quickstart.md)]

## Explore more samples

To learn more about how to use the Azure Developer CLI, see our [sample templates](azure-dev-cli-templates.md).

## Reference and release notes

A [reference](azure-cli-ref) is available.

## Get help and give feedback

Post questions to the community on [Discussions](https://github.com/Azure/azure-dev/discussions). Report bugs and open issues against the Azure Developer CLI in the [GitHub repository](https://github.com/Azure/azure-dev).