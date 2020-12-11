---
title: Azure CLI Linux virtual machine
description: Create an Azure Linux virtual machine, with a clone of an Express.js-based app from a GitHub repository.  
ms.topic: tutorial
ms.date: 11/13/2020
ms.custom: devx-track-js
---

# 1. Create Linux virtual machine with Express.js app using Azure CLI

In this tutorial, create a Linux virtual machine (VM) for an Express.js app. The VM is configured with a cloud-init configuration file and includes NGINX and a GitHub repository for an Express.js app. Once the VM is running, you can connect to the VM with SSH, change the web app to including trace logging, and view the public Express.js server app in a web browser.

This tutorial includes the following tasks:

* Sign in to Azure with Azure CLI
* Create Azure Linux VM resource with Azure CLI
    * Open public port 80
    * Install demo Express.js web app from a GitHub repository
    * Install web app dependencies
    * Start web app
* Create Azure Monitoring resource with Azure CLI
    * Connect to VM with SSH
    * Install Azure SDK client library with npm
    * Add Application Insights client library code to create custom tracing
* View web app from browser
    * Request `/trace` route to generate custom tracing in Application Insights log
    * View count of traces collected in log with Azure CLI
    * View list of traces with Azure portal
* Remove resources with Azure CLI

[!INCLUDE [Create or use existing Azure Subscription ](../../includes/environment-subscription-h2.md)]

## Prerequisites

- Use [Azure Cloud Shell](../articles/cloud-shell/quickstart.md) using the bash environment.

   [![Embed launch](https://shell.azure.com/images/launchcloudshell.png "Launch Azure Cloud Shell")](https://shell.azure.com)   
- If you prefer, [install](/cli/azure/install-azure-cli) the Azure CLI to run CLI reference commands.
   - If you're using a local install, sign in with Azure CLI by using the [az login](/cli/azure/reference-index#az-login) command.  To finish the authentication process, follow the steps displayed in your terminal.  See [Sign in with Azure CLI](/cli/azure/authenticate-azure-cli) for additional sign-in options.
  - When you're prompted, install Azure CLI extensions on first use.  For more information about extensions, see [Use extensions with Azure CLI](/cli/azure/azure-cli-extensions-overview).
  - Run [az version](/cli/azure/reference-index?#az_version) to find the version and dependent libraries that are installed. To upgrade to the latest version, run [az upgrade](/cli/azure/reference-index?#az_upgrade).
- SSH to connect to the VM: Use a modern terminal such as bash shell, which includes SSH.

## Next step

> [!div class="nextstepaction"]
> [Create resource group for Azure resources](create-azure-monitoring-application-insights-web-resource.md) 