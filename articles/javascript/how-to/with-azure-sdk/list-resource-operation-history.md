---
title: List resource operation history
description: Use Azure SDK for Monitor to list recent resource operations. 
ms.topic: how-to
ms.date: 10/26/2021
ms.custom: devx-track-js
---

# Use Azure Monitor SDK to list recent resource operations

Use the Azure Monitor SDK to list the most recent resource operations in your subscription. Operations can be filtered by a date range (within the last 10 days), and a resource group. Examples of operations can include resource creation, stopping or starting a resource such as web app or virtual machine, and retrieving a connection string.

## Set up your development environment

- An Azure user account with an active subscription. [Create one for free](https://azure.microsoft.com/free/).
- [Node.js LTS with NPM](https://nodejs.org/en/download), the Node.js package manager installed to your local machine.
- [Visual Studio Code](https://code.visualstudio.com/) installed to your local machine. 
- [Create a service principal](../../core/nodejs-sdk-azure-authenticate.md?tabs=azure-sdk-for-javascript#1-create-a-service-principal) and copy the `Tenant Id`, `Client ID`, `Client secret`.

## Create Azure operations

In order for the Azure Monitor to return results with this sample code, your subscription has to have resources with operations. An operation can be as simple as starting a web app, or getting a connection string. These operations can happen from any source that uses Azure including the Azure portal, your local installation of the Azure CLI, or any programmatic access to your resources through REST APIs or the Azure SDK.

If you are new to Azure, the [Azure portal](https://portal.azure.com) is the quickest way to create monitor entries to use this sample code.

Find a [free resource](https://azure.microsoft.com/pricing/free-services/) then create it in the Azure portal.

## Use Azure Monitor SDK with JavaScript

1. Create a file or [copy the file from GitHub](https://github.com/Azure-Samples/js-e2e/blob/main/resources/monitor/resource-creation-history.js).

    :::code language="JavaScript" source="~/../js-e2e/resources/monitor/resource-creation-history.js"  :::

1. Install the npm packages used in the Azure work:

    ```bash
    npm init -y && install @azure/identity @azure/arm-monitor
    ```

1. Install the npm packages used to support the day filtering and pretty JSON printing:

    ```bash
    npm install dayjs @base2/pretty-print-object
    ```

1. Run the code to see your subscription operation history:

    ```bash
    node resource-creation-history.js
    ```

## Next steps

* [Selecting hosting for your app](../select-hosting-service.md)
