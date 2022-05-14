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

# Get started with your development enviroment of choice

# [Bare metal](#tab/bare-metal)

We'll use the [Todo Application with Node.js and Azure Cosmo DB API for MongoDB](https://github.com/azure-samples/todo-nodejs-mongo) for this walkthrough. For more information including architecture diagram and the Azure resources you'll deploy, see the [README](https://github.com/azure-samples/todo-nodejs-mongo).

## Prerequisites

Before you get started, ensure you have the following tools installed on your local machine:

- [Git](https://git-scm.com/)
- [GitHub CLI v2.3+](https://github.com/cli/cli)
- [Node.js with npm (v 16.13.1 LTS)](https://nodejs.org/)
- [Azure CLI (v 2.30.0+)](/cli/azure/install-azure-cli)
- Azure Dev CLI (see install instructions below)

```bash
npm uninstall -g @azure/az-dev-cli
npm install -g https://azuresdkreleasepreview.blob.core.windows.net/azd/standalone/latest/azure-az-dev-cli-latest.tgz
```
> [!NOTE]
> * May require `sudo` depending on platform and configuration
> * Make sure you install language specification prerequisite. To get a full list of prerequisites, refer to the Dockerfile in the sample template. For this walkthrough: [Dockerfile](https://github.com/Azure-Samples/todo-nodejs-mongo/blob/main/.devcontainer/Dockerfile).

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

# [DevContainer](#tab/devcontainer)

## Prerequisites

### Azure Developer CLI

[!INCLUDE [azd-install](includes/install-azd.md)]

### Azure Developer CLI VS Code Extension

The Azure Developer CLI experience includes an Azure Developer CLI VS Code Extension that mirrors all of the CLI commands into context menu and command palette options. If you're a VS Code user, then we highly recommend installing this extension for the best experience.

1. Download the extension from https://aka.ms/azure-dev/vsix
1. In VS Code
    - Open "Extensions" (Ctrl+Shift+X)
    - Select the ... menu at top of Extensions sidebar
    - Select "Install from VSIX"
    - Select location of downloaded file

### DevContainer

A [DevContainer](https://code.visualstudio.com/docs/remote/containers) is a Docker image that includes all of the prerequisites you need to run this application on your local machine. You can find the specification for this application's DevContainer [here](https://github.com/Azure-Samples/todo-nodejs-mongo/blob/main/.devcontainer/Dockerfile).

To use the DevContainer, you'll need the following installed on your local machine:

1. [Docker Desktop](https://aka.ms/azure-dev/docker-install) (other options coming soon...)
1. [Remote - Containers VS Code Extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

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

### Run Up Command

The fastest way for you to get this application up and running on Azure is to use the `azd up` command. This single command will create and configure all necessary Azure resources - including access policies and roles for your account and service-to-service communication with Managed Identities. Because the command will create all of the resources on Azure, it can take some time. 

The `azd up` command will:

1. Provision the Azure resources, policies, and roles required
1. Deploy the code from your local machine to the previously provisioned Azure resources

```bash
azd up
```

> NOTE: This may take a while to complete as it performs two steps: `azd provision` (creates Azure services) and `azd deploy` (deploys code). You will see a progress indicator as it provisions and deploys your application.

This command will print the following URLs:

- Azure portal link to view resources created
- ToDo web application frontend
- ToDo API application

!["azd Up output"](assets/azdevupurls.png)

Select the web application URL to launch the ToDo app. Create a new collection and add some items. The command will create monitoring activity in the application that you'll be able to see later when you `monitor` the application.

> Known issue: clicking the provisioning link will not redirect to the correct page in **Visual Studio Code integrated terminal**. A fix is being released for this [VS Code known issue](https://github.com/microsoft/vscode/issues/144898#issuecomment-1079496948). For the meantime, please copy and paste the link in browser.

> :warning: **Cleanup**
>
> Please be aware that Azure resources, e.g. a Cosmos DB, have been created. You can clean up these resources by deleting the resource group that was create, or issuing the `azd infra delete` command.

### Next Steps

At this point, you have a complete application deployed on Azure. But there's much more that the Azure Developer CLI can do. These next steps will introduce you to more commands that will make creating applications on Azure much easier. Using the Azure Developer CLI, you can set up your DevOps pipelines, monitor your application, test and debug locally.

#### Set up DevOps pipeline using `azd pipeline`

This template includes a GitHub Actions pipeline configuration file that will deploy your application whenever code is pushed to the main branch. You can find that pipeline file here: `.github/workflow`.

Setting up this pipeline requires you to give GitHub permission to deploy to Azure on your behalf, which is done via a Service Principal stored in a GitHub secret named `AZURE_CREDENTIALS`. The `azd pipeline config` command will automatically create a service principal for you. The command also helps to create a private GitHub repository and pushes code to the newly created repo.  

Run the following command to set up a GitHub Action:

```
azd pipeline config
```

#### Monitor the application using `azd monitor`

To help with monitoring applications, the Azure Dev CLI provides a `monitor` command to help you get to the various Application Insights dashboards.

- Run the following command to open the "Overview" dashboard:

  ```bash
  azd monitor --overview
  ```

- Live Metrics Dashboard

  Run the following command to open the "Live Metrics" dashboard:

  ```bash
  azd monitor --live
  ```

- Logs Dashboard

  Run the following command to open the "Logs" dashboard:

  ```bash
  azd monitor --logs
  ```

#### Run and Debug Locally

The easiest way to run and debug is to leverage the Azure Developer CLI Visual Studio Code Extension. For more information, see this [walkthrough](how-to-use-vscode-extension-to-debug-locally.md).  

### Clean up resources
When you are done, you can delete all the Azure resources created with this template by running the following command:

``` bash
azd infra delete
```

## Additional azd commands

For a complete list of available commands, see the [azd overview](azure-dev-cli-ref.md).

## Troubleshooting/Known issues

For known issues, refer to [Troubleshooting/known issues](azure-dev-cli-known-issues.md) 

## Explore more samples

To learn more about how to use the Azure Developer CLI, see our [sample templates](azure-dev-cli-templates.md).

## Reference

A [reference](azure-cli-ref) is available.

## Get help and give feedback

Post questions to the community on [Discussions](https://github.com/Azure/azure-dev/discussions). Report bugs and open issues against the Azure Developer CLI in the [GitHub repository](https://github.com/Azure/azure-dev).