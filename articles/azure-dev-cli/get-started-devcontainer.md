---
title: Get started with Azure Developer CLI using DevContainer
description: Learn how to get started with Azure Developer CLI using Dev Container
keywords: 
ms.author: puicchan
ms.date: 5/5/2022
ms.topic: article
ms.custom: devx-track-azdev
ms.prod: azure
---

# Get started with Dev Container

Before you get started, ensure you have the following tools installed on your local machine:

- [Azure Developer CLI](https://aka.ms/azure-dev/install)
    `npm install -g https://aka.ms/azure-dev/npm`
- [Docker Desktop](https://aka.ms/azure-dev/docker-install) (Other options coming soon...)
  > Verify installation by running `docker` in your terminal
- [Remote - Containers VS Code Extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

We will use the [Todo Application with Node.js and Azure Cosmo DB API for MongoDB](https://github.com/azure-samples/todo-nodejs-mongo)] for this article. 

> [!NOTE] 
> You can refer to the DevContainer dependencies in the readme of each [sample template](azure-dev-cli-templates.md) for the Dev Container dependencies.

### Azure Subscription

This template will create infrastructure and deploy code to Azure. If you don't have an Azure Subscription, sign up for a [free account here](https://azure.microsoft.com/free/). 

## Quickstart

### 1. Initialize Project

```bash
azd init --template todo-nodejs-mongo
```

You will be prompted for the following information:

- `Environment Name`: This will be used as a prefix for all your Azure resources, make sure it is globally unique and under 15 characters.
- `Azure Location`: The Azure location where your resources will be deployed.
- `Azure Subscription`: The Azure Subscription where your resources will be deployed.

### 2. Open in VS Code and Start DevContainer

Open the project in VS Code and follow the prompts to re-open the project in the provided DevContainer.  If you aren't prompted, then you can hit F1 and choose : `Remote-Containers: Rebuild and Reopen in Container`

### 3. Run Up Command

The fastest way for you to get this app up and running on Azure is to use the `azd up` command. This single command will create and configure all necessary resources - including access policies and roles for your account and the Azure resources to communicate with each other via Managed Identity. Because this will create all of the resources on Azure, it can take some time. You will see an indication of the CLI progress as it creates the resources.

The `azd up` command will:

1. Create all the Azure resources required by this application
1. Deploy the code you need to run the application

```bash
azd up
```

> NOTE: This may take a while to complete as it performs two steps: `azd provision` (creates Azure services) and `azd deploy` (deploys code).


[!INCLUDE [azd-quickstart](includes/azd-quickstart.md)]

## Explore more samples

To learn more about how to use the Azure Developer CLI, see our [sample templates](azure-dev-cli-templates.md).

## Reference and release notes

A [reference](azure-cli-ref) is available.

## Get help and give feedback

Post questions to the community on [Discussions](https://github.com/Azure/azure-dev/discussions). Report bugs and open issues against the Azure Developer CLI in the [GitHub repository](https://github.com/Azure/azure-dev).