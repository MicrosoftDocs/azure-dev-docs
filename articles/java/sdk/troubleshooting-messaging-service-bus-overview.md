---
title: Troubleshoot Azure Service Bus
titleSuffix: Azure SDK for Java
description: Helps you troubleshoot Service Bus issues when you use the Azure SDK for Java.
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

## Upgrade to 7.15.x

If you encounter any issues, you should first attempt to solve them by upgrading to version 7.15.x of the Service Bus SDK. The 7.15.x line is a major redesign, resolving long-standing performance and reliability concerns.

The 7.15.x line reduces thread hopping, removes locks, optimizes code in hot paths, and reduces memory allocations. These changes result in up to 45-50 times greater throughput on the `ServiceBusProcessor` client.

The 7.15.x line also comes with various reliability improvements. It addresses several race conditions (such as prefetch and credit calculations) and improved error handling. These changes result in better reliability in the presence of transient issues across various client types.

### Using clients in 7.15.x

The new underlying framework in 7.15.x with these improvements is called the V2-Stack. The 7.15.x line includes both the previous generation of the underlying stack (the stack that version 7.14.x uses) and the new V2-Stack.

By default, some of the client types use the V2-Stack, while others require V2-Stack opt-in. You can accomplish the opt-in or opt-out of a specific stack (V2 or the previous generation) for a client type by providing `com.azure.core.util.Configuration` values when you build the client.

For example, V2-Stack-based session receive with `ProcessorClient` requires opt-in as shown in the following example:

```java
ServiceBusProcessorClient sessionProcessor = new ServiceBusClientBuilder()
    .connectionString(Config.CONNECTION_STRING)
    .configuration(new com.azure.core.util.ConfigurationBuilder()
        .putProperty("com.azure.messaging.servicebus.session.processor.asyncReceive.v2", "true") // 'false' by default, opt-in for V2-Stack.
        .build())
    .sessionProcessor()
```

The following table lists the client types and corresponding configuration names, and indicates whether the client is currently enabled by default to use the V2-Stack. For a client that is not on the V2-Stack by default, you can use the example just shown to opt-in.

| Client type                                       | Configuration name                                                 | Is on V2-Stack by default? |
|---------------------------------------------------|--------------------------------------------------------------------|----------------------------|
| Sender and management client                      | `com.azure.messaging.servicebus.sendAndManageRules.v2`             | yes                        |
| Non-session processor and reactor receiver client | `com.azure.messaging.servicebus.nonSession.asyncReceive.v2`        | yes                        |
| Non-session synchronous receiver client           | `com.azure.messaging.servicebus.nonSession.syncReceive.v2`         | no                         |
| Session processor receiver client                 | `com.azure.messaging.servicebus.session.processor.asyncReceive.v2` | no                         |
| Session reactor receiver client                   | `com.azure.messaging.servicebus.session.reactor.asyncReceive.v2`   | no                         |
| Session synchronous receiver client               | `com.azure.messaging.servicebus.session.syncReceive.v2`            | no                         |

As an alternative to using `com.azure.core.util.Configuration`, you can do the opt-in or opt-out by setting the same configuration names using environment variables or system properties.

## Next steps

If the troubleshooting guidance in this article doesn't help to resolve issues when you use the Azure SDK for Java client libraries, we recommended that you [file an issue](https://github.com/Azure/azure-sdk-for-java/issues/new/choose) in the [Azure SDK for Java GitHub repository](https://github.com/Azure/azure-sdk-for-java).

<!-- LINKS -->
[LoggingPom]: https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/servicebus/azure-messaging-servicebus/docs/pom.xml
