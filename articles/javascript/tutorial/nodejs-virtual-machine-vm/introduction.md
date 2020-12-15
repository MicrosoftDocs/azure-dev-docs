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

[!INCLUDE [Create or use existing Azure Subscription ](../../../includes/environment-subscription-h2.md)]

## Prerequisites

- SSH to connect to the VM: Use a modern terminal such as bash shell, which includes SSH.
[!INCLUDE [Azure CLI](../includes/azure-cli-prepare-your-environment-no-header.md)]


## Next step

> [!div class="nextstepaction"]
> [Create resource group for Azure resources](create-azure-monitoring-application-insights-web-resource.md) 