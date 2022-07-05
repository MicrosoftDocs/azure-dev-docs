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

You can use any of the [Azure Developer CLI template](overview.md#azure-developer-cli-templates) for this tutorial. We'll use the [Todo Application with Node.js and Azure Cosmos DB API for MongoDB](https://github.com/azure-samples/todo-nodejs-mongo).

## Prerequisites

This article assumes you've installed the azd. If you are new to azd, begin with [Get started](get-started.md) and then return to this article.

## Configure your environment

Create monitoring activity in the application before running the `azd monitor` commands:

1. Launch the ToDo app.

1. Create a new list and add a couple of items.

## Monitor the application

To help with monitoring applications, azd provides a `monitor` command whose parameters launch various Application Insights dashboards.

| Application Insights dashboard | Command                |
|--------------------------------|------------------------|
| Main dashboard                 | azd monitor --overview |
| Live metrics dashboard         | azd monitor --live     |
| Logs dashboard                 | azd monitor --logs     |

## Clean up resources

When you no longer need the resources created in this article, do the following steps:

``` bash
azd down
```

## Next steps

> [!div class="nextstepaction"]
> [Make your project Azure Developer CLI (azd) compatible](make-azd-compatible.md)
