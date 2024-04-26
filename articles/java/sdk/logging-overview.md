---
title: Configure logging in the Azure SDK for Java
description: Provides an overview of the Azure SDK for Java concepts related to logging.
ms.date: 02/02/2021
ms.topic: conceptual
ms.custom: devx-track-java, devx-track-extended-java
author: KarlErickson
ms.author: srnagar
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

HTTP request and response logging is off by default. Clients that communicate to Azure services over HTTP can be configured to write a log for each request and response (or exception) they received.
To enable logs, pass a configured instance of [`HttpLogOptions`](/java/api/com.azure.core.http.policy.httplogoptions) to the `httpLogOptions` method on the
corresponding client builder.

Here's an example for App Configuration service:

```java
ConfigurationClient configurationClient = new ConfigurationClientBuilder()
        .connectionString(connectionString)
        .httpLogOptions(new HttpLogOptions().setLogLevel(HttpLogDetailLevel.HEADERS))
        .buildClient();
```

In the above example, we enable logs enriched with request and response headers. Only headers from the configurable allow list are included, others are redacted.
You can add or override a list of headers allowed by default.

You can change the level of details by providing a different value of the [`HttpLogDetailLevel`](/java/api/com.azure.core.http.policy.httplogdetaillevel) enum.

For example, when `HttpLogDetailLevel.BASIC` level is configured, produced logs contain request method, sanitized request URL, try count, response code, and the content length for request and response bodies.

> Note:
> The request URL is sanitized by default - all query parameter values are redacted except for configurable allow list.

For example, Azure Blob Storage SAS URL is logged in the following format:
`https://myaccount.blob.core.windows.net/pictures/profile.jpg?sv=REDACTED&st=REDACTED&se=REDACTED&sr=REDACTED&sp=REDACTED&rscd=REDACTED&rsct=REDACTED&sig=REDACTED`

The `HttpLogDetailLevel.HEADERS` we used in the example above includes all the basic details and allowed headers. And the `HttpLogDetailLevel.BODY_AND_HEADERS` level adds request and response bodies as long as they are smaller than 16 KB and printable.

Check [`HttpLogOptions`](/java/api/com.azure.core.http.policy.httplogoptions) documentation for the full list of configuration options.

If you use OpenTelemetry, you may consider using distributed tracing instead of logging for HTTP requests, refer to the [Distributed Tracing](./tracing.md) article for the details.

## Default logger (for temporary debugging)

As noted, all Azure client libraries use SLF4J for logging, but there's a fallback, default logger built into Azure client libraries for Java. This default logger is provided for cases where an application has been deployed, and logging is required, but it's not possible to redeploy the application with an SLF4J logger included. To enable this logger, you must first be certain that no SLF4J logger exists (because it takes precedence), and then set the `AZURE_LOG_LEVEL` environment variable. The following table shows the values allowed for this environment variable:

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

In addition to logging the common properties mentioned earlier, Azure client libraries annotate log messages with extra context when applicable. For example, you may see JSON-formatted logs containing `az.sdk.message` with context written as other root properties, as shown in the following example:

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

Now that you've seen how logging works in the Azure SDK for Java, consider reviewing the following articles. These articles provide guidance on how to configure some of the more popular Java logging frameworks to work with SLF4J and the Java client libraries:

* [java.util.logging](logging-jul.md)
* [Logback](logging-logback.md)
* [Log4J](logging-log4j.md)
* [Tracing](tracing.md)