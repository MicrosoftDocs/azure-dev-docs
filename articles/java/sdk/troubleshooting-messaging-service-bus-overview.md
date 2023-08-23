---
title: Messaging troubleshooting overview when using the Azure SDK for Java
description: An overview of how to troubleshoot messaging-related issues related to using the Azure SDK for Java
ms.date: 08/16/2023
ms.topic: conceptual
ms.custom: devx-track-java, devx-track-extended-java
author: KarlErickson
ms.author: jogiles
---

# Troubleshooting Service Bus

## Enable and configure logging

Azure SDK for Java offers a consistent logging story to help aid in troubleshooting application errors and expedite their resolution. The logs produced will capture the flow of an application before reaching the terminal state to help locate the root issue. You can review the [logging conceptual documentation](/azure/developer/java/sdk/logging-overview) and the [troubleshooting documentation](/azure/developer/java/sdk/troubleshooting-overview) for guidance on using logging.

In addition to enabling logging, setting the log level to `VERBOSE` or `DEBUG` provides insights into the library's state. Below are sample log4j2 and logback configurations to reduce the excessive messages when verbose logging is enabled.

### Configuring Log4J 2

1. Add the dependencies in your pom.xml using ones from the [logging sample pom.xml][LoggingPom] under the "Dependencies required for Log4j2" section.
2. Add [log4j2.xml][log4j2] to your `src/main/resources`.

### Configuring logback

1. Add the dependencies in your pom.xml using ones from the [logging sample pom.xml][LoggingPom] under the "Dependencies required for logback" section.
2. Add [logback.xml][logback] to your `src/main/resources`.

### Enable AMQP transport logging

If enabling client logging is not enough to diagnose your issues.  You can enable logging to a file in the underlying AMQP library, [Qpid Proton-J][qpid_proton_j_apache]. Qpid Proton-J uses `java.util.logging`. You can enable logging by creating a configuration file with the contents below.  Or set `proton.trace.level=ALL` and whichever configuration options you want for the `java.util.logging.Handler` implementation.  The implementation classes and their options can be found in [Java 8 SDK javadoc][java_8_sdk_javadocs].

To trace the AMQP transport frames, set the environment variable: `PN_TRACE_FRM=1`.

#### Sample "logging.properties" file

The configuration file below logs TRACE level output from proton-j to the file "proton-trace.log".

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

One way to decrease logging is to change the verbosity.  Another is to add filters that exclude logs from logger names packages like `com.azure.messaging.servicebus` or `com.azure.core.amqp`. Examples of this can be found in the XML files in [Configuring Log4J 2](#configuring-log4j-2) and [Configure logback](#configuring-logback).

When submitting a bug, log messages from classes in the following packages are interesting:

* `com.azure.core.amqp.implementation`
* `com.azure.core.amqp.implementation.handler`
  * The exception is that the onDelivery message in ReceiveLinkHandler can be ignored.
* `com.azure.messaging.servicebus.implementation`

## Next Steps

If the troubleshooting guidance above does not help to resolve issues when using the Azure SDK for Java client libraries, it is recommended that you reach out to the development team by [filing an issue][azsdkjava_github_repo_new_issue] on the [Azure SDK for Java GitHub page][azsdkjava_github_repo].

<!-- LINKS -->
[azsdkjava_github_repo]: https://github.com/Azure/azure-sdk-for-java
[azsdkjava_github_repo_new_issue]: https://github.com/Azure/azure-sdk-for-java/issues/new/choose

[log4j2]: https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/servicebus/azure-messaging-servicebus/docs/log4j2.xml
[logback]: https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/servicebus/azure-messaging-servicebus/docs/logback.xml
[LoggingPom]: https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/servicebus/azure-messaging-servicebus/docs/pom.xml

<!-- external links -->
[java_8_sdk_javadocs]: https://docs.oracle.com/javase/8/docs/api/java/util/logging/package-summary.html
[qpid_proton_j_apache]: https://qpid.apache.org/proton/