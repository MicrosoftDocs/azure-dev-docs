---
title: Run a Node.js template using Azure Developer CLI (preview)
description: Learn how to get started with Azure Developer CLI with a template for Node.js.
keywords: azure developer cli, azd
author: hhunter-ms
ms.author: hannahhunter
ms.date: 08/10/2022
ms.topic: quickstart
ms.service: azure-dev-cli
ms.custom: devx-track-azdevcli
---

# Run a Node.js template using Azure Developer CLI (preview)

Let's put the basic Azure Developer CLI (`azd`) commands to the test and run one of our Node.js template applications. We'll use the [ToDo Application with a Node.js API and Azure Cosmos DB API for MongoDB](https://github.com/azure-samples/todo-nodejs-mongo) for this guide.

Upon completion, you'll get the code in your development environment and be able to run commands to build, deploy, and monitor the app in Azure.

## Pre-requisites

- [Install the Azure Developer CLI](./install-azd.md).
- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Node.js with npm (v 16.13.1 LTS)](https://nodejs.org/)
- [Review the architecture diagram and the Azure resources you'll deploy in the Node.js template README](https://github.com/Azure-Samples/todo-nodejs-mongo/blob/main/README.md).

Select your preferred environment to continue:

## [BareMetal](#tab/baremetal)

## Run `up` command

[Learn more about the `azd up` command](./run-azd.md)

1. In **File Explorer** or a terminal, create a new empty directory, and change into it.

1. Run the following command:

```bash
azd up --template todo-nodejs-mongo
```

## Provide parameters

When you run the `azd up` command, you'll be prompted to provide the following information:

| Parameter | Description |
| --------- | ----------- |
| `Environment Name` | Prefix for the resource group that will be created to hold all Azure resources. [What is an Environment Name in `azd`?](./faq.yml#what-is-an-environment-name) You can always create a new environment with `azd env new`. |
| `Azure Location`   | The Azure location where your resources will be deployed. |
| `Azure Subscription` | The Azure Subscription where your resources will be deployed. |

This process may take some time to complete, as the `azd up` command:

- Downloads code
- Initializes your project (`azd init`)
- Creates and configures all necessary Azure resources (`azd provision`), including:
  - Access policies and roles for your account
  - Service-to-service communication with Managed Identities
- Deploys the code (`azd deploy`)

Once you've provided the necessary parameters and the `azd up` command completes, the CLI displays two Azure portal links to view resources created:

- ToDo API app
- ToDo web app frontend

:::image type="content" source="media/get-started/urls.png" alt-text="Screenshot of command output listing endpoint URLs.":::

## What happened?

Upon successful completion of the `azd up` command:

- The repo referenced by the [Node.js `azd` template](https://github.com/azure-samples/todo-nodejs-mongo) you ran with `azd up` has been cloned into [the directory you created](#run-up-command).
- The [Azure resources referenced in the templates `README.md` file](https://github.com/Azure-Samples/todo-nodejs-mongo/blob/main/README.md) have been provisioned to the Azure subscription you specified after you ran `azd up`. You can now view those Azure resources via the [Azure portal](https://portal.azure.com).
- The app has been built and deployed to Azure. Using the web app URL output from the `azd up` command, you can browse to the fully functional app.

> [!NOTE]
> You can call `azd up` as many times as you like to both provision and deploy your solution, but you only need to provide the `--template` parameter the first time you call it to get the code locally. Subsequent `azd up` calls do not require the template parameter. If you do provide the parameter, all your local source code will be overwritten if you agree to overwrite when prompted.

## Clean up resources

When you no longer need the resources created in this article, run the following command to power down the app:

``` bash
azd down
```

## [DevContainer](#tab/devcontainer)

A [DevContainer](https://code.visualstudio.com/docs/remote/containers) is a Docker image that includes all of the prerequisites you need to run this app on your local machine. You can find the specification for this app's DevContainer [here](https://github.com/Azure-Samples/todo-nodejs-mongo/blob/main/.devcontainer/Dockerfile).

### Initialize Project

1. Open a terminal, create a new empty directory, and change into it.

1. Run the following command to initialize the project:

   ```bash
   azd init --template todo-nodejs-mongo
   ```

## Provide parameters

When you run the `azd init` command, you'll be prompted to provide the following information:

| Parameter | Description |
| --------- | ----------- |
| `Environment Name` | Prefix for the resource group that will be created to hold all Azure resources. [What is an Environment Name in `azd`?](./faq.yml#what-is-an-environment-name) You can always create a new environment with `azd env new`. |
| `Azure Location`   | The Azure location where your resources will be deployed. |
| `Azure Subscription` | The Azure Subscription where your resources will be deployed. |

## Open DevContainer

Open the project in VS Code, hit F1 and choose: `Remote-Containers: Rebuild and Reopen in Container`

## Run `up` command

[Learn more about the `azd up` command.](./run-azd.md)

Run the following command:

```bash
azd up
```

This process may take some time, as the `azd up` command:

- Creates and configures all necessary Azure resources (`azd provision`), including:
  - Access policies and roles for your account
  - Service-to-service communication with Managed Identities
- Deploys the code (`azd deploy`)

Once you've provided the necessary parameters and the `azd up` command completes, the CLI displays two Azure portal links to view resources created:

- ToDo API app
- ToDo web app frontend

:::image type="content" source="media/get-started/urls.png" alt-text="Screenshot of command output listing endpoint URLs.":::

## What happened?

Upon successful completion of the `azd up` command:

- The repo referenced by the [Node.js `azd` template](https://github.com/azure-samples/todo-nodejs-mongo) you ran with `azd up` has been cloned into [the directory you created](#run-up-command).
- The [Azure resources referenced in the templates `README.md` file](https://github.com/Azure-Samples/todo-nodejs-mongo/blob/main/README.md) have been provisioned to the Azure subscription you specified after you ran `azd up`. You can now view those Azure resources via the [Azure portal](https://portal.azure.com).
- The app has been built and deployed to Azure. Using the web app URL output from the `azd up` command, you can browse to the fully functional app.

> [!NOTE]
> You can call `azd up` as many times as you like to both provision and deploy your solution, but you only need to provide the `--template` parameter the first time you call it to get the code locally. Subsequent `azd up` calls do not require the template parameter. If you do provide the parameter, all your local source code will be overwritten if you agree to overwrite when prompted.

## Clean up resources

When you no longer need the resources created in this article, run the following command to power down the app:

``` bash
azd down
```

---

## Next steps

- [Learn how to run and debug apps with `azd`.](debug.md)
- [Troubleshoot common problems when using Azure Developer CLI (azd).](troubleshoot.md)
- [Read the Azure Developer CLI frequently asked questions (FAQ).](faq.yml)