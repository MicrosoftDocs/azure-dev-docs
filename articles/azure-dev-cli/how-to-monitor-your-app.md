---
title: Monitor your app using Azure Developer CLI (azd)
description: Learn how to use Azure Developer CLI (azd) to monitor your app health.
author: puicchan
ms.author: puichan
ms.date: 06/29/2021
ms.topic: conceptual
ms.custom: devx-track-azdevcli
ms.prod: azure
---
# Monitor your app using Azure Developer CLI (azd)

You can use any of the [Azure Developer CLI template](azure-dev-cli-overview.md#azure-developer-cli-templates) for this tutorial. We'll use the [Todo Application with Node.js and Azure Cosmos DB API for MongoDB](https://github.com/azure-samples/todo-nodejs-mongo).

## Prerequisites

This article assumes you've installed the azd. If you are new to azd, begin with [Get started](get-started.md) and then return to this article.

## Configure your environment

Create monitoring activity in the application before running the `azd monitor` commands:

1. Launch the ToDo app.

1. Create a new list and add a couple of items.

## Monitor the application

To help with monitoring applications, the Azure Dev CLI provides a `monitor` command to help you get to the various Application Insights dashboards.

1. Run the following command to open the "Overview" dashboard:

  ```bash
  azd monitor --overview
  ```

- Live Metrics Dashboard

  Run the following command to open the "Live Metrics" dashboard:

  ```bash
  azd monitor --live
  ```

- Logs Dashboard

  Run the following command to open the "Logs" dashboard:

  ```bash
  azd monitor --logs
  ```

### Clean up resources
When you're done, you can delete all the Azure resources created with this template by running the following command:

``` bash
azd down
```
