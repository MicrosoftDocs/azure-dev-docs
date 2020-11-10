---
title: Azure CLI Linux virtual machine
description: Create an Azure Linux virtual machine, with a clone of an Express.js-based app from a GitHub repository.  
ms.topic: tutorial
ms.date: 11/09/2020
ms.custom: devx-track-js
---

# 1. Create Linux virtual machine with Express.js app using Azure CLI

In this tutorial, create a Linux virtual machine (VM) for an Express.js app. The VM is configured with a cloud-init configuration and includes NGINX and a GitHub repository for an Express.js app. Once the VM is running, you can view the public Express.js server app in a web browser.

This tutorial includes the following tasks:

* Sign in to Azure with Azure CLI
* Create Azure Linux VM with Azure CLi
    * Open public port 80
    * Install Express.js web app from a GitHub repository
    * Install web app dependencies
    * Start web app
* Verify web app is publicly available in browser

[!INCLUDE [Create or use existing Azure Subscription ](../../includes/environment-subscription-h2.md)]

## Install software

[!INCLUDE [Azure CLI](~/../azure-docs/includes/azure-cli-prepare-your-environment-no-header.md)]
- Terminal with SSH

## Sign in to Azure CLI

[!INCLUDE [Sign in to Azure CLI](../../../azure-cli/includes/interactive-login.md)]

## Next step

> [!div class="nextstepaction"]
> [Create Linux virtual machine](create-linux-virtual-machine-azure-cli.md) 