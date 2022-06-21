---
title: Configure a pipeline and push updates using GitHub Actions
description: Learn how to push updates using GitHub Actions.
author: puicchan
ms.author: puichan
ms.date: 06/20/2021
ms.topic: conceptual
ms.custom: devx-track-azdevcli
ms.prod: azure
---

# Configure a pipeline and push updates using GitHub Actions

This article uses the sample [Todo Application with Node.js and Azure Cosmo DB API for MongoDB](https://github.com/azure-samples/todo-nodejs-mongo). However, the principles you learn in this article apply to any of the [Azure Developer CLI template](azure-dev-cli-overview.md#azure-developer-cli-templates).

## Prerequisites

This article assumes you've installed the azd. If you are new to azd, begin with [Get started](get-started.md) and then return to this article.

## Configure a DevOps pipeline

The template includes a GitHub Actions pipeline configuration file that will deploy your application whenever code is pushed to the main branch. You can find that pipeline file here: `.github/workflow`.

Setting up this pipeline requires you to give GitHub permission to deploy to Azure on your behalf, which is done via a Service Principal stored in a GitHub secret named `AZURE_CREDENTIALS`. The `azd pipeline config` command will automatically create a service principal for you. The command also helps to create a private GitHub repository and pushes code to the newly created repo.  

Run the following command to set up a GitHub Action:

```bash
azd pipeline config
```

## Make and push a code change

1. Open `header.tsx` in `/src/web/src/layout`

1. Locate the line `<Text variant="xLarge">ToDo</Text>` and update **ToDo** to say **myTodo** to update the application label.

1. Save the file.

1. Commit your change and push to GitHub to automatically kick off the GitHub Action pipelie to deploy the update.

1. Visit the web frontend URL to inspect the update.

## Clean up resources

When you no longer need the resources created in this article, run the following command:

``` bash
azd down
```
