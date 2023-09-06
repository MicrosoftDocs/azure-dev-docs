---
title: Troubleshoot Azure Service Bus
titleSuffix: Azure SDK for Java
description: A troubleshooting guide for Service Bus issues when you use the Azure SDK for Java
ms.date: 09/07/2023
ms.topic: conceptual
ms.custom: devx-track-java, devx-track-extended-java
author: KarlErickson
ms.author: jogiles
---

# Troubleshoot Azure Service Bus

This article covers failure investigation techniques, common errors for the credential types in the Azure Service Bus Java client library, and mitigation steps to resolve these errors.

## Enable and configure logging

Azure SDK for Java offers a consistent logging story to help in troubleshooting application errors and to help expedite their resolution. The logs produced capture the flow of an application before reaching the terminal state to help locate the root issue. For guidance on logging, see [Configure logging in the Azure SDK for Java](logging-overview.md) and [Troubleshooting overview](troubleshooting-overview.md).

In addition to enabling logging, setting the log level to `VERBOSE` or `DEBUG` provides insights into the library's state. The following sections show sample log4j2 and logback configurations to reduce the excessive messages when verbose logging is enabled.

### Configure Log4J 2

Use the following steps to configure Log4J 2:

1. Add the dependencies in your *pom.xml* using ones from the [logging sample pom.xml][LoggingPom], in the "Dependencies required for Log4j2" section.
1. Add [log4j2.xml](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/servicebus/azure-messaging-servicebus/docs/log4j2.xml) to your *src/main/resources* folder.

### Configure logback

Use the following steps to configure logback:

1. Add the dependencies in your *pom.xml* using ones from the [logging sample pom.xml][LoggingPom], in the "Dependencies required for logback" section.
1. Add [logback.xml](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/servicebus/azure-messaging-servicebus/docs/logback.xml) to your *src/main/resources* folder.

### Enable AMQP transport logging

If enabling client logging isn't enough to diagnose your issues, you can enable logging to a file in the underlying AMQP library, [Qpid Proton-J](https://qpid.apache.org/proton/). Qpid Proton-J uses `java.util.logging`. You can enable logging by creating a configuration file with the contents shown in the next section. Or, set `proton.trace.level=ALL` and whichever configuration options you want for the `java.util.logging.Handler` implementation. For the implementation classes and their options, see [Package java.util.logging](https://docs.oracle.com/javase/8/docs/api/java/util/logging/package-summary.html) in the Java 8 SDK documentation.

To trace the AMQP transport frames, set the `PN_TRACE_FRM=1` environment variable.

#### Sample logging.properties file

The following configuration file logs TRACE level output from Proton-J to the file *proton-trace.log*:

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

One way to decrease logging is to change the verbosity. Another way is to add filters that exclude logs from logger names packages like `com.azure.messaging.servicebus` or `com.azure.core.amqp`. For examples, see the XML files in the [Configure Log4J 2](#configure-log4j-2) and [Configure logback](#configure-logback) sections.

When you submit a bug, the log messages from classes in the following packages are interesting:

* `com.azure.core.amqp.implementation`
* `com.azure.core.amqp.implementation.handler`
  * The exception is that you can ignore the `onDelivery` message in `ReceiveLinkHandler`.
* `com.azure.messaging.servicebus.implementation`

## Next steps

If the troubleshooting guidance in this article doesn't help to resolve issues when you use the Azure SDK for Java client libraries, we recommended that you [file an issue](https://github.com/Azure/azure-sdk-for-java/issues/new/choose) in the [Azure SDK for Java GitHub repository](https://github.com/Azure/azure-sdk-for-java).

<!-- LINKS -->
[LoggingPom]: https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/servicebus/azure-messaging-servicebus/docs/pom.xml
