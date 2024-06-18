---
title: Monitor your app using Azure Developer CLI
description: Learn how to use Azure Developer CLI (azd) to monitor your app health.
author: alexwolfmsft
ms.author: alexwolf
ms.date: 12/11/2022
ms.service: azure-dev-cli
ms.topic: how-to
ms.custom: devx-track-azdevcli, build-2023
---

# Monitor your app using Azure Developer CLI

In this article, you learn how to use Azure Developer CLI (`azd`) to monitor your app health.

While we use the [React Web App with Node.js API and MongoDB on Azure](https://github.com/azure-samples/todo-nodejs-mongo) template for this guide, you can use any of the [Azure Developer CLI templates](./azd-templates.md).

> [!NOTE]
> The `azd monitor` command is still in beta. Read more about alpha and beta feature support on the [feature versioning and release strategy](/azure/developer/azure-developer-cli/feature-versioning) page.

## Prerequisites

- [Install the Azure Developer CLI](./install-azd.md)
- [Run `azd init` and `azd up` for the Node.js template](./get-started.md)

## Configure your environment

Create monitoring activity in the app before running the `azd monitor` commands:

1. Open the ToDo app in your preferred code editor.

1. Create a new list and add a couple of items.

## Monitor the app

To help with monitoring apps, `azd` provides a `monitor` command whose parameters [launch various Application Insights dashboards](/azure/azure-monitor/app/overview-dashboard). Run any of the following commands in the project directory to monitor app health:

| Application Insights dashboard | Command                  |
|--------------------------------|--------------------------|
| Main dashboard                 | `azd monitor --overview` |
| Live metrics dashboard         | `azd monitor --live`     |
| Logs dashboard                 | `azd monitor --logs`     |

## Clean up resources

When you no longer need the resources created in this article, do the following steps:

```azdeveloper
azd down
```

## See also

- [Azure Monitor documentation](/azure/azure-monitor/)

[!INCLUDE [request-help](includes/request-help.md)]

## Next steps

> [!div class="nextstepaction"]
> [Make your project Azure Developer CLI (azd) compatible](make-azd-compatible.md)
