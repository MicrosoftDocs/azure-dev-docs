---
title: Get started with Azure Developer CLI using bare metal set up
description: Learn how to get started with Azure Developer CLI using bare metal set up
keywords: 
ms.author: puicchan
ms.date: 5/5/2022
ms.topic: article
ms.custom: devx-track-azdev
ms.prod: azure
---

# Get started with bare metal set up

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

We will use the [Todo Application with Node.js and Azure Cosmo DB API for MongoDB](https://github.com/azure-samples/todo-nodejs-mongo)] for this article. Make sure you have the following language specific pre-requisite installed on your local machine:
- [Node.js with npm (v 16.13.1 LTS)](https://nodejs.org/)

> [!NOTE] 
> You can refer to the DevContainer dependencies in the readme of each [sample template](azure-dev-cli-templates.md) for additional tools needed by the sample application.

[!INCLUDE [azd-quickstart](includes/azd-quickstart.md)

[!INCLUDE [azd-knownissues](includes/azd-knownissues.md)

## Explore more samples

To learn more about how to use the Azure Developer CLI, see our [sample templates](azure-dev-cli-templates.md).

## Reference and release notes

A [reference](azure-cli-ref) is available.

## Get help and give feedback

Post questions to the community on [Discussions](https://github.com/Azure/azure-dev/discussions). Report bugs and open issues against the Azure Developer CLI in the [GitHub repository](https://github.com/Azure/azure-dev).