---
title: Monitor your app using Azure Developer CLI
description: Learn how to use Azure Developer CLI (azd) to monitor your app health.
author: kristenwomack
ms.author: kwomack
ms.date: 09/11/2026
ms.service: azure-dev-cli
ms.topic: how-to
ms.custom: devx-track-azdevcli, build-2023
ai-usage: ai-generated
---

# Monitor your app using Azure Developer CLI

In this article, you learn how to use Azure Developer CLI (`azd`) to monitor your app health.

This guide uses the [React Web App with Node.js API and MongoDB on Azure](https://github.com/Azure-Samples/todo-nodejs-mongo) template. You can also use an [Azure Developer CLI template](azd-templates.md) that provisions Application Insights and a monitoring dashboard.

> [!NOTE]
> The ToDo sample repository is archived and no longer maintained. If you use another template, confirm that it provisions the monitoring resources required by the commands in this guide.

> [!NOTE]
> The `azd monitor` command is still in beta. Read more about alpha and beta feature support on the [feature versioning and release strategy](/azure/developer/azure-developer-cli/feature-versioning) page.

## Prerequisites

- An Azure account with an active subscription.
- The [Azure Developer CLI installed](install-azd.md).
- [Node.js with npm](https://nodejs.org/) version 20 or later for the ToDo sample.

## Deploy the monitoring sample

Open an empty directory in your terminal, and then sign in and initialize the ToDo sample in that directory:

```azdeveloper
azd auth login
azd init --template Azure-Samples/todo-nodejs-mongo .
azd up
```

When prompted, enter an environment name and select your Azure subscription and location. Wait for deployment to finish. Run the remaining commands from this project directory.

The Hello AZD samples in the [deployment quickstart](get-started.md) don't provision the Application Insights resources required by this walkthrough.

## Configure your environment

Create monitoring activity in the app before running the `azd monitor` commands:

1. Open the deployed ToDo app in your browser by using the web endpoint in the `azd up` output.

1. Create a new list and add a couple of items.

## Monitor the app

To help with monitoring apps, `azd` provides a `monitor` command to [launch various Application Insights dashboards](/azure/azure-monitor/app/overview-dashboard). Run the command with one of the following parameters in the project directory to monitor app health:

| Application Insights dashboard | Command                  |
|--------------------------------|--------------------------|
| Main dashboard                 | `azd monitor --overview` |
| Live metrics dashboard         | `azd monitor --live`     |
| Logs dashboard                 | `azd monitor --logs`     |

## Clean up resources

When you no longer need the resources created in this article, run the `azd down` command to delete the resource group:

```azdeveloper
azd down
```

## See also

- [Azure Monitor documentation](/azure/azure-monitor/)

[!INCLUDE [request-help](includes/request-help.md)]

## Next steps

> [!div class="nextstepaction"]
> [Template development overview](build-templates-overview.md)
