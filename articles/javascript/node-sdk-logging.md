---
title: Logging with the Azure SDK for JavaScript
description: Learn how to enable logging with the Azure SDK for JavaScript client libraries
ms.topic: article
ms.date: 07/23/2020
ms.author: dsindona
author: dsindona
---

# Logging with the Azure SDK for JavaScript

The Azure SDK for JavaScript [core library](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/core) includes a [logger](https://github.com/Azure/azure-sdk-for-js/blob/master/sdk/core/logger/README.md) NPM module that allows you to easily enable logging for your application. 

[NPM package](https://www.npmjs.com/package/@azure/logger) | [Library source code](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/core/logger)

## Enable logging

You can enable logging across your entire application using a single environment variable, or you can dynamically configure logging for one part of your application. This article explains key concepts about the logger package and how to enable logging with the following methods:

- Set the `AZURE_LOG_LEVEL` environment variable.
- Call `setLogLevel` imported from the logger library.
- Call `enable()` on specific loggers.

> [!NOTE]
> This article applies to client libraries that use the most recent versions of the Azure SDK. To see if a library is supported, refer to the list of [Azure SDK latest releases](https://azure.github.io/azure-sdk/releases/latest/index.html#javascript). If your application is using an older version of the Azure SDK client libraries, refer to specific instructions in the applicable service documentation.

## Log levels

The `@azure/logger` package supports the following log levels specified in order of most verbose to least verbose:

- verbose
- info
- warning
- error

When you set a log level, either programmatically or via the `AZURE_LOG_LEVEL` environment variable, any logs written with a log level equal to or less than the one you choose will be emitted. For example, if you set the log level to `warning`, all logs with the level `warning` or `error` will be emitted.

## Install the logger package

The Azure SDK for JavaScript logger library is delivered as an [npm](https://www.npmjs.com/) package. Use npm to install the `@azure/logger` package:

```cmd
npm install @azure/logger
```

## Set the logging environment variable

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

## Configure dynamic logging

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

## Redirect log output

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