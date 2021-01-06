---
title: Logging
description: An overview of the Azure SDK for Java concepts related to logging
ms.date: 11/23/2020
ms.topic: conceptual
ms.custom: devx-track-java
---

# Logging

The Azure client libraries for Java have two logging options:

* A built-in logging framework for temporary debugging purposes.
* Support for logging using the [SLF4J](https://www.slf4j.org/) interface.

It is recommended that developers use the SLF4J functionality, as this is well known through the Java ecosystem and there exists significant documentation on making use of this. For starters, consider referring to the [SLF4J manual](https://www.slf4j.org/manual.html). Further down this document there are links to configuration examples for many of the popular Java logging frameworks and how they may be used by the Azure client libraries.

Regardless of logging configuration used, the same log output will be available in either case, as all logging output in the Azure client libraries for Java is routed through an azure-core `ClientLogger` abstraction.

The remainder of this document details configuration of all available logging options.

## Default logger (For Temporary Debugging)

As noted, all Azure client libraries use SLF4J for logging, but there is a fallback, default logger built into Azure client libraries for Java for circumstances where an application is deployed, and logging is required, but it is not possible to redeploy the application with an SLF4J logger included. To enable this logger, developers must firstly be certain that there exists no SLF4J logger (as this will take precedence), and then set the `AZURE_LOG_LEVEL` environment variable. Refer to the following table for the allowed values for this environment variable:

| Log Level              | Allowed Environment Variable Values     |
|------------------------|-----------------------------------------|
| VERBOSE                | "verbose", "debug"                      |
| INFORMATIONAL          | "info", "information", "informational"  |
| WARNING                | "warn", "warning"                       |
| ERROR                  | "err", "error"                          |

After the environment variable is set, restarting the application will enable the environment variable to take effect. Enabling this logger will log to the console and does not provide advanced customization capabilities like rollover, logging to file, etc. that an SLF4J implementation will provide. To turn the logging off again, just remove the environment variable and restart the application.

## SLF4J logging

By default, logging should be configured using an SLF4J-supported logging framework. This starts by including a [relevant SLF4J logging implementation as a dependency from your project](http://www.slf4j.org/manual.html#projectDep), but then continues onward to configuring your logger to work as necessary in your environment (such as setting log levels, configuring which classes do and do not log, etc.). Some examples are provided below, but for more detail, refer to the documentation for your chosen logging framework.

## Next steps

Now that you've been introduced to how logging works in the Azure SDK for Java, consider reviewing the links below for guidance on how to configure some of the more popular Java logging frameworks to work with SLF4J and the Java client libraries:

* [java.util.logging](java-sdk-logging-jul.md)
* [Logback](java-sdk-logging-logback.md)
* [Log4J](java-sdk-logging-log4j.md)
