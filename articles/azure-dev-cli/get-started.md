---
title: Get started with Azure Developer CLI 
description: Learn how to get started with Azure Developer CLI
keywords: 
author: puicchan
ms.author: puichan
ms.date: 5/5/2022
ms.topic: article
ms.custom: devx-track-azdev
ms.prod: azure
---

# Get started

We'll use the [Todo Application with Node.js and Azure Cosmo DB API for MongoDB](https://github.com/azure-samples/todo-nodejs-mongo) for this walkthrough. 

This repository contains a complete ToDo application that includes everything you need to build, deploy, and monitor an Azure solution. For more information including architecture diagram and the Azure resources you'll deploy, see the [README](https://github.com/azure-samples/todo-nodejs-mongo).

To run any sample template, the first thing you need to do decide is where you want your development environment to be hosted. For pros and cons for development choices, refer to [What is Azure Developer CLI]( azure-dev-cli-overview#development-environment-choices).

Once you've decided which development environment is right for you, select the corresponding tab in the next section. 

## Set up
### [Bare metal](#tab/bare-metal)

[!INCLUDE [azd-baremetal](includes/azd-baremetal.md)]

### [DevContainer](#tab/devcontainer)

[!INCLUDE [azd-devcontainer](includes/azd-devcontainer.md)]

---

Once complete, the command will print the following URLs:

- Azure portal link to view resources created
- ToDo web application frontend
- ToDo API application

!["azd up output"](media/get-started/azdupurls.png)

Select the web application URL to launch the ToDo app. Create a new collection and add some items. 

### Clean up resources
When you're done, you can delete all the Azure resources created with this template by running the following command:

``` bash
azd infra delete
```

## Next steps

* [Run and debug using the Azure Developer CLI Visual Studio Code Extension](how-to-use-vscode-extension-to-debug-locally.md)
* [Set up GitHub pipeline using azd pipeline](how-to-update-and-deploy-using-GitHub-Action.md)
* [Monitor the health of your app](how-to-monitor-your-app.md)

## Troubleshooting/Known issues

For known issues, refer to [Troubleshooting/known issues](azure-dev-cli-known-issues.md) 

## Explore more samples

To find more Azure Developer CLI enabled templates, see our [sample templates](azure-dev-cli-templates.md).

## Reference

A [reference](azure-cli-ref) is available.

## Get help and give feedback

Post questions to the community on [Discussions](https://github.com/Azure/azure-dev/discussions). Report bugs and open issues against the Azure Developer CLI in the [GitHub repository](https://github.com/Azure/azure-dev).