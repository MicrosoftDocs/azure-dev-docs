---
title: Configure logging in the Azure SDK for Java
description: Provides an overview of the Azure SDK for Java concepts related to logging.
ms.date: 04/01/2025 
ms.topic: how-to
ms.custom: devx-track-java, devx-track-extended-java
author: KarlErickson
ms.author: karler
ms.reviewer: srnagar
---

# Configure logging in the Azure SDK for Java

This article provides an overview of how to enable logging in applications that make use of the Azure SDK for Java. The Azure client libraries for Java have two logging options:

* A built-in logging framework for temporary debugging purposes.
* Support for logging using the [SLF4J](https://www.slf4j.org/) interface.

We recommend that you use SLF4J because it's well known in the Java ecosystem and it's well documented. For more information, see the [SLF4J user manual](https://www.slf4j.org/manual.html).

This article links to other articles that cover many of the popular Java logging frameworks. These other articles provide configuration examples, and describe how the Azure client libraries can use the logging frameworks.

Whatever logging configuration you use, the same log output is available in either case because all logging output in the Azure client libraries for Java is routed through an azure-core `ClientLogger` abstraction.

The rest of this article details the configuration of all available logging options.

## Enable HTTP request/response logging

HTTP request and response logging are off by default. You can configure clients that communicate to Azure services over HTTP to write a log record for each request and response (or exception) they receive.

If you use OpenTelemetry, consider using distributed tracing instead of logging for HTTP requests. For more information, see [Configure tracing in the Azure SDK for Java](tracing.md).

### Configure HTTP logging with an environment variable

You can use the `AZURE_HTTP_LOG_DETAIL_LEVEL` environment variable to enable HTTP logs globally. This variable supports the following values:

- `NONE`: HTTP logs are disabled. This value is the default.
- `BASIC`: HTTP logs contain request method, sanitized request URL, try count, response code, and the content length for request and response bodies.
- `HEADERS`: HTTP logs include all the basic details and also include headers that are known to be safe for logging purposes - that is, they don't contain secrets or sensitive information. The full list of header names is available in the [HttpLogOptions](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/core/azure-core/src/main/java/com/azure/core/http/policy/HttpLogOptions.java) class.
- `BODY_AND_HEADERS`: HTTP logs include all the details provided by the `HEADERS` level and also include request and response bodies as long as they're smaller than 16 KB and printable.

> [!NOTE]
> The request URL is sanitized - that is, all query parameter values are redacted except for the `api-version` value. Individual client libraries may add other query parameters that are known to be safe to the allowlist.

For example, the Azure Blob Storage shared access signature (SAS) URL is logged in the following format:
`https://myaccount.blob.core.windows.net/pictures/profile.jpg?sv=REDACTED&st=REDACTED&se=REDACTED&sr=REDACTED&sp=REDACTED&rscd=REDACTED&rsct=REDACTED&sig=REDACTED`

> [!WARNING]
> Logging request and response bodies isn't recommended in production because they might contain sensitive information, significantly affect performance, change how content is buffered, and have other side effects.

### Configure HTTP logging in code

Azure client builders that implement the [HttpTrait\<T>](/java/api/com.azure.core.client.traits.httptrait) interface support code-based HTTP logging configuration. Code-based configuration applies to individual client instances and provides more options and customizations compared to environment variable configuration.

To configure logs, pass an instance of [HttpLogOptions](/java/api/com.azure.core.http.policy.httplogoptions) to the `httpLogOptions` method on the corresponding client builder. The following code shows an example for the App Configuration service:

```java
HttpLogOptions httpLogOptions = new HttpLogOptions()
        .setLogLevel(HttpLogDetailLevel.HEADERS)
        .addAllowedHeaderName("Accept-Ranges")
        .addAllowedQueryParamName("label");

ConfigurationClient configurationClient = new ConfigurationClientBuilder()
        .httpLogOptions(httpLogOptions)
        ...
        .buildClient();
```

This code enables HTTP logs with headers and adds the `Accept-Ranges` response header and the `label` query parameter to the corresponding allowlists. After this change, these values should appear in the produced logs.

For the full list of configuration options, see the [HttpLogOptions](/java/api/com.azure.core.http.policy.httplogoptions) documentation.

## Default logger (for temporary debugging)

As noted, all Azure client libraries use SLF4J for logging, but there's a fallback, default logger built into Azure client libraries for Java. This default logger is provided for cases where an application is deployed, and logging is required, but it's not possible to redeploy the application with an SLF4J logger included. To enable this logger, you must first be certain that no SLF4J logger exists (because it takes precedence), and then set the `AZURE_LOG_LEVEL` environment variable. The following table shows the values allowed for this environment variable:

| Log Level              | Allowed environment variable values    |
|------------------------|----------------------------------------|
| VERBOSE                | `verbose`, `debug`                     |
| INFORMATIONAL          | `info`, `information`, `informational` |
| WARNING                | `warn`, `warning`                      |
| ERROR                  | `err`, `error`                         |

After the environment variable is set, restart the application to enable the environment variable to take effect. This logger logs to the console, and doesn't provide the advanced customization capabilities of an SLF4J implementation, such as rollover and logging to file. To turn the logging off again, just remove the environment variable and restart the application.

## SLF4J logging

By default, you should configure logging using an SLF4J-supported logging framework. First, include a relevant SLF4J logging implementation as a dependency from your project. For more information, see [Declaring project dependencies for logging](http://www.slf4j.org/manual.html#projectDep) in the SLF4J user manual. Next, configure your logger to work as necessary in your environment, such as setting log levels, configuring which classes do and don't log, and so on. Some examples are provided through the links in this article, but for more information, see the documentation for your chosen logging framework.

## Log format

Logging frameworks support custom log message formatting and layouts. We recommend including at least following fields to make it possible to troubleshoot Azure client libraries:

* Date and time with millisecond precision
* Log severity
* Logger name
* Thread name
* Message

For examples, see the documentation for the logging framework you use.

### Structured logging

In addition to logging the common properties mentioned earlier, Azure client libraries annotate log messages with extra context when applicable. For example, you might see JSON-formatted logs containing `az.sdk.message` with context written as other root properties, as shown in the following example:

```log
16:58:51.038 INFO  c.a.c.c.i.C.getManifestProperties - {"az.sdk.message":"HTTP request","method":"GET","url":"<>","tryCount":"1","contentLength":0}
16:58:51.141 INFO  c.a.c.c.i.C.getManifestProperties - {"az.sdk.message":"HTTP response","contentLength":"558","statusCode":200,"url":"<>","durationMs":102}
```

When you send logs to Azure Monitor, you can use the [Kusto query language](/azure/data-explorer/kusto/query/) to parse them. The following query provides an example:

```kusto
traces
| where message startswith "{\"az.sdk.message"
| project timestamp, logger=customDimensions["LoggerName"], level=customDimensions["LoggingLevel"], thread=customDimensions["ThreadName"], azSdkContext=parse_json(message)
| evaluate bag_unpack(azSdkContext)
```

> [!NOTE]
> Azure client library logs are intended for ad-hoc debugging. We don't recommend relying on the log format to alert or monitor your application. Azure client libraries do not guarantee the stability of log messages or context keys. For such purposes, we recommend using distributed tracing. The Application Insights Java agent provides stability guarantees for request and dependency telemetry. For more information, see [Configure tracing in the Azure SDK for Java](tracing.md).

## Next steps

Now that you know how logging works in the Azure SDK for Java, consider reviewing the following articles. These articles provide guidance on how to configure some of the more popular Java logging frameworks to work with SLF4J and the Java client libraries:

* [java.util.logging](logging-jul.md)
* [Logback](logging-logback.md)
* [Log4J](logging-log4j.md)
* [Tracing](tracing.md)
