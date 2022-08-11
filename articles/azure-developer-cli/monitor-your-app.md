---
title: Monitor your app using Azure Developer CLI (preview)
description: Learn how to use Azure Developer CLI (azd) to monitor your app health.
author: hhunter-ms
ms.author: hannahhunter
ms.date: 08/11/2022
ms.service: azure-dev-cli
ms.topic: conceptual
ms.custom: devx-track-azdevcli
---

# Monitor your app using Azure Developer CLI (preview)

In this article, you learn how to use Azure Developer CLI (`azd`) to monitor your app health. 

While we use the [Todo Application with Node.js and Azure Cosmos DB API for MongoDB](https://github.com/azure-samples/todo-nodejs-mongo) template for this guide, you can use any of the [Azure Developer CLI templates](./azd-templates.md).

## Prerequisites

- [Install the Azure Developer CLI](./install-azd.md)
- [Run `azd up` for the Node.js template](./get-started-nodejs.md), or [run on the template of your choice](./azd-templates.md#azure-developer-cli-templates)

## Configure your environment

Create monitoring activity in the app before running the `azd monitor` commands:

1. Open the ToDo app in your preferred code editor.

1. Create a new list and add a couple of items.

## Monitor the app

To help with monitoring apps, azd provides a `monitor` command whose parameters [launch various Application Insights dashboards](../../../azure-docs-pr/articles/azure-monitor/app/overview-dashboard.md). Run any of the following commands in the project directory to monitor app health:

| Application Insights dashboard | Command                  |
|--------------------------------|--------------------------|
| Main dashboard                 | `azd monitor --overview` |
| Live metrics dashboard         | `azd monitor --live`     |
| Logs dashboard                 | `azd monitor --logs`     |

## Clean up resources

When you no longer need the resources created in this article, do the following steps:

``` bash
azd down
```

## See also

- [Azure Monitor documentation](/azure/azure-monitor/)

## Next steps

> [!div class="nextstepaction"]
> [Make your project Azure Developer CLI (azd) compatible](make-azd-compatible.md)
