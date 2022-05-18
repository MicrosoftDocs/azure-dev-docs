---
title: How to use monitor your application using azd
description: How to use azd to monitor your application health.
author: puicchan
ms.author: puichan
ms.date: 05/17/2021
ms.topic: conceptual
ms.custom: devx-track-azdev
ms.prod: azure
---
#  How to monitor your application

We'll use the [Todo Application with Node.js and Azure Cosmo DB API for MongoDB](https://github.com/azure-samples/todo-nodejs-mongo) for this walkthrough. By now, you should have your Azure resources provisioned and application deployed. If not, follow the steps in [get-started](get-started.md). 

Make sure you select the web application URL to launch the ToDo app. Create a new collection and add some items. The command will create monitoring activity in the application that you'll be able to see by running the following the `azd monitor` command.

### Monitor the application using `azd monitor`

To help with monitoring applications, the Azure Dev CLI provides a `monitor` command to help you get to the various Application Insights dashboards.

- Run the following command to open the "Overview" dashboard:

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
