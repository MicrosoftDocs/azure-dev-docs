---
title: Logging, metrics, telemetry in Azure
description: Learn about logging options in Azure
ms.topic: how-to
ms.date: 04/30/2021
ms.custom: devx-track-js
---

# Logging, metrics, and telemetry in Azure 

There are several options for logging, metrics, and telemetry when using Azure. Review the options to find the tool or service you are looking for:

* [Resource metrics](#resource-metrics-provided-by-azure-services) - when you use Azure services, Azure monitors your individual resources and collects metrics.  
* [Logging](#custom-logging-to-azure) - when your application (on-prem, cloud, or hybrid), needs to log information.
* [Azure SDK client libraries](#azure-sdk-client-library-logging) - when you need to view logging already built into Azure client libraries

## Azure resource monitoring in the Azure portal

* Enable [Application Insights](/azure/azure-monitor/app/app-insights-overview) for your resource. This integration is usually available at resource creation time and after the resource is created.

    The process creates a separate Azure resource for logging, which you can use for more than just the resource logging.

    :::image type="content" source="../media/logging-metrics/create-azure-app-service-with-logging.png" alt-text="View your HTTP endpoint from the service's Overview page on the Azure portal.":::

* View metrics for your resource on a scheduled basis in the [Azure portal](https://portal.azure.com) for each resource. 

    :::image type="content" source="../media/logging-metrics/view-resource-metrics-in-azure-portal.png" alt-text="Configure alerts for your resource in the Azure portal, with URL of `https://portal.azure.com`, for each resource. ":::

* Set alerts for your resource in the [Azure portal](https://portal.azure.com) for each resource. Alerts can include specific metrics, communication streams (such as email), and frequency. Common alerts to set are total:
    * Requests 
    * Response time
    * Http server errors (in Hosting environments)

    :::image type="content" source="../media/logging-metrics/create-alert-for-http-server-errors-in-app-service.png" alt-text="Set common alerts for your resource such as requests, response time and http server errors (for your hosting environment resources).":::

* View failures for Application Insights monitored resources.     

    :::image type="content" source="../media/logging-metrics/view-resource-failure-in-application-insights.png" alt-text="View failures for Application Insights monitored resources.":::

* View log stream of hosted resources available in the resource's Monitoring section of the Azure portal. Configure them with the App service log configuration. 

    :::image type="content" source="../media/logging-metrics/configue-azure-app-service-logs-in-azure-portal.png" alt-text="View log stream of hosted resources available in the resource's Monitoring section of the Azure portal.":::

* [Add Application Insights SDK](/azure/azure-monitor/app/nodejs) to your source code. 


## Resource metrics provided by Azure services

[Azure Monitor](/azure/azure-monitor/overview) maximizes the availability and performance of your applications and services by delivering a comprehensive solution for collecting, analyzing, and acting on telemetry from your cloud and on-premises environments.

The metrics are available inside your resource in the Azure portal. 

:::image type="content" source="../media/logging-metrics/azure-resource-metrics-portal.png" alt-text="Simple Node.js app connected to MongoDB database.":::

Once data is monitored, use either the Azure portal to query the data with common queries, or build your [Kusto queries](/azure/data-explorer/kusto/query/). 

## Custom logging to Azure

Use Azure Monitor's [Application Insights](/azure/azure-monitor/app/app-insights-overview), which offers [Server](/azure/azure-monitor/app/nodejs) (Node.js) and [Client](/azure/azure-monitor/app/javascript) (browser) scenarios:

* Server - log from Node.js with [Application Insights](/azure/azure-monitor/app/app-insights-overview) - [npm package](https://www.npmjs.com/package/applicationinsights)
* Client - log from your client code - [npm package](https://www.npmjs.com/package/@microsoft/applicationinsights-web)
* Containers and VMs - log from your [Kubernetes cluster](/azure/azure-monitor/insights/container-insights-overview) or [Azure Virtual machines](/azure/azure-monitor/insights/vminsights-overview)
 
## Azure SDK client library logging

Generally, you shouldn't need to access internal Azure SDK client library logging. The Azure client core library for logging is built for Azure services to use. 

[NPM package](https://www.npmjs.com/package/@azure/logger) | [Library source code](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/core/logger)

### Enable logging

You can enable logging across your entire application using a single environment variable, or you can dynamically configure logging for one part of your application. This article explains key concepts about the logger package and how to enable logging with the following methods:

- Set the `AZURE_LOG_LEVEL` environment variable.
- Call `setLogLevel` imported from the logger library.
- Call `enable()` on specific loggers.

> [!NOTE]
> This article applies to client libraries that use the most recent versions of the Azure SDK. To see if a library is supported, refer to the list of [Azure SDK latest releases](https://azure.github.io/azure-sdk/releases/latest/index.html#javascript). If your application is using an older version of the Azure SDK client libraries, refer to specific instructions in the applicable service documentation.

### Log levels

The `@azure/logger` package supports the following log levels specified in order of most verbose to least verbose:

- verbose
- info
- warning
- error

When you set a log level, either programmatically or via the `AZURE_LOG_LEVEL` environment variable, any logs written with a log level equal to or less than the one you choose will be emitted. For example, if you set the log level to `warning`, all logs with the level `warning` or `error` will be emitted.

### Install the logger package

The Azure SDK for JavaScript logger library is delivered as an [npm](https://www.npmjs.com/) package. Use npm to install the `@azure/logger` package:

```cmd
npm install @azure/logger
```

### Set the logging environment variable

You can use the single `AZURE_LOG_LEVEL` environment variable to enable logging across your application. The logs will be output to stderr. After you set the environment variable, you’ll need to restart your application to start generating logs.

This bash example sets the log level to verbose:

```bash
export AZURE_LOG_LEVEL="verbose"
```

This example uses PowerShell:

```powershell
$env:AZURE_LOG_LEVEL="verbose"
```

This example uses CMD:

```cmd
set AZURE_LOG_LEVEL="verbose"
```

### Configure dynamic logging

The Azure SDK for JavaScript allows you to dynamically enable logging as needed or for specific client libraries. This accommodates developers who want to use a custom logging implementation for some application components, or who want temporary logs for debugging.

You can use the `@azure/logger` module to set your log level in code:

```js
import { setLogLevel } from "@azure/logger";

setLogLevel("verbose");
```

To enable a specific log channel, import `logger` from the package you want to emit logs for. The following example enables info logging for Event Hubs only:

```js
import { logger } from "@azure/event-hubs";

logger.info.enable();
```

### Redirect log output

To handle log messages yourself, reassign the `log` method on `AzureLogger` or any logger imported from a client library.

This example redirects log messages to stderr:

```js
import { AzureLogger } from "@azure/logger";

AzureLogger.log = msg => console.error(msg);
```

This example redirects only info log messages from Azure EventHub:

```js
import { logger } from "@azure/event-hubs";
logger.info.log = msg => console.error(msg);
```

## Next steps

- [Enable diagnostics logging for apps in Azure App Service](/azure/app-service/troubleshoot-diagnostic-logs)
- [Review Azure security logging and auditing options](/azure/security/fundamentals/log-audit)
- [Learn how to work with Azure platform logs](/azure/azure-monitor/platform/platform-logs-overview)