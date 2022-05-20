---
title: How to use Visual Studio Code to edit and push update through GitHub Action
description: How to use the VS Code and the extension for Azure Developer CLI to push update through GitHub Action.
author: puicchan
ms.author: puichan
ms.date: 04/12/2021
ms.topic: conceptual
ms.custom: devx-track-azdev
ms.prod: azure
---
#  How to config pipeline, edit and push update through GitHub Action

You can use any of the [Azure Developer CLI template](azure-dev-cli-templates.md) for this walkthrough. We'll use the [Todo Application with Node.js and Azure Cosmo DB API for MongoDB](https://github.com/azure-samples/todo-nodejs-mongo). 

By now, you should have your Azure resources provisioned and application deployed. If not, follow the steps in [get-started](get-started.md). 

## Set up DevOps pipeline using `azd pipeline`

The template includes a GitHub Actions pipeline configuration file that will deploy your application whenever code is pushed to the main branch. You can find that pipeline file here: `.github/workflow`.

Setting up this pipeline requires you to give GitHub permission to deploy to Azure on your behalf, which is done via a Service Principal stored in a GitHub secret named `AZURE_CREDENTIALS`. The `azd pipeline config` command will automatically create a service principal for you. The command also helps to create a private GitHub repository and pushes code to the newly created repo.  

Run the following command to set up a GitHub Action:

```
azd pipeline config
```

## Edit code

Use your favorite IDE, make a simple modification to the code.

1. Open `header.tsx` in `/src/web/src/layout`
1. Locate the line `<Text variant="xLarge">ToDo</Text>` and update **ToDo** to say **myTodo** to update the application label.
1. Save the file.
1. Commit your change and push to GitHub to automatically kick off the GitHub Action pipelie to deploy the update.
1. Visit the web frontend URL to inspect the update.

### Clean up resources
When you're done, you can delete all the Azure resources created with this template by running the following command:

``` bash
azd down
```
