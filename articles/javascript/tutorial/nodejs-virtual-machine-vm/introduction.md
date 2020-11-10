---
title: Azure CLI Linux virtual machines
description: Create an Azure Linux virtual machine, with a clone of an Express.js-based app from a GitHub repository.  
ms.topic: tutorial
ms.date: 11/09/2020
ms.custom: devx-track-js
---

# Linux virtual machines with Express.js app using Azure CLI

In this tutorial, create a Linux virtual machine (VM) from a cloud-init configuration. The cloud-init configuration includes NGINX and a GitHub repository for an Express.js app. Once the VM is running, you can view the public Express.js server app in a web browser.

[!INCLUDE [Create or use existing Azure Subscription ](../../includes/environment-subscription-h2.md)]

## Install software

[!INCLUDE [Azure CLI](~/azure-docs-pr/../includes/azure-cli-prepare-your-environment-no-header.md)]
- Terminal with SSH

## Sign in to Azure CLI

[!INCLUDE [Create or use existing Azure Subscription ](../../../azure-cli/includes/interactive-login.md)]
