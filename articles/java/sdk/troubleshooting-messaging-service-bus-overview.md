---
title: Troubleshooting Service Bus
description: A troubleshooting guide for Service Bus issues when using the Azure SDK for Java
ms.date: 08/16/2023
ms.topic: conceptual
ms.custom: devx-track-java, devx-track-extended-java
author: KarlErickson
ms.author: jogiles
---

# Troubleshooting Service Bus

This troubleshooting guide covers failure investigation techniques, common errors for the credential types in the Azure Service Bus Java client library, and mitigation steps to resolve these errors.

## Enable and configure logging

Azure SDK for Java offers a consistent logging story to help aid in troubleshooting application errors and expedite their resolution. The logs produced capture the flow of an application before reaching the terminal state to help locate the root issue. You can review the [logging conceptual documentation](logging-overview.md) and the [troubleshooting documentation](troubleshooting-overview.md) for guidance on using logging.

In addition to enabling logging, setting the log level to `VERBOSE` or `DEBUG` provides insights into the library's state. The following sections show sample log4j2 and logback configurations to reduce the excessive messages when verbose logging is enabled.

### Configure Log4J 2

1. Add the dependencies in your *pom.xml* using ones from the [logging sample pom.xml][LoggingPom] under the "Dependencies required for Log4j2" section.
2. Add [log4j2.xml](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/servicebus/azure-messaging-servicebus/docs/log4j2.xml) to your `src/main/resources`.

### Configure logback

1. Add the dependencies in your *pom.xml* using ones from the [logging sample pom.xml][LoggingPom] under the "Dependencies required for logback" section.
2. Add [logback.xml](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/servicebus/azure-messaging-servicebus/docs/logback.xml) to your `src/main/resources`.

### Enable AMQP transport logging

If enabling client logging isn't enough to diagnose your issues. You can enable logging to a file in the underlying AMQP library, [Qpid Proton-J](https://qpid.apache.org/proton/). Qpid Proton-J uses `java.util.logging`. You can enable logging by creating a configuration file with the contents shown in the next section. Or, set `proton.trace.level=ALL` and whichever configuration options you want for the `java.util.logging.Handler` implementation. For the implementation classes and their options, see [Package java.util.logging](https://docs.oracle.com/javase/8/docs/api/java/util/logging/package-summary.html) in the Java 8 SDK documentation.

To trace the AMQP transport frames, set the environment variable: `PN_TRACE_FRM=1`.

#### Sample "logging.properties" file

The following configuration file logs TRACE level output from proton-j to the file "proton-trace.log":

```properties
handlers=java.util.logging.FileHandler
.level=OFF
proton.trace.level=ALL
java.util.logging.FileHandler.level=ALL
java.util.logging.FileHandler.pattern=proton-trace.log
java.util.logging.FileHandler.formatter=java.util.logging.SimpleFormatter
java.util.logging.SimpleFormatter.format=[%1$tF %1$tr] %3$s %4$s: %5$s %n
```

### Reduce logging

One way to decrease logging is to change the verbosity. Another is to add filters that exclude logs from logger names packages like `com.azure.messaging.servicebus` or `com.azure.core.amqp`. For examples, see the XML files in the [Configure Log4J 2](#configure-log4j-2) and [Configure logback](#configure-logback) sections.

When submitting a bug, log messages from classes in the following packages are interesting:

* `com.azure.core.amqp.implementation`
* `com.azure.core.amqp.implementation.handler`
  * The exception is that the onDelivery message in ReceiveLinkHandler can be ignored.
* `com.azure.messaging.servicebus.implementation`

## Next steps

If the troubleshooting guidance in this article doesn't help to resolve issues when using the Azure SDK for Java client libraries, we recommended that you reach out to the development team by [filing an issue](https://github.com/Azure/azure-sdk-for-java/issues/new/choose) in the [Azure SDK for Java GitHub repository](https://github.com/Azure/azure-sdk-for-java).

<!-- LINKS -->
[LoggingPom]: https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/servicebus/azure-messaging-servicebus/docs/pom.xml
