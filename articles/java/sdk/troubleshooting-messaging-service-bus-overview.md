---
title: Troubleshoot Azure Service Bus
titleSuffix: Azure SDK for Java
description: Helps you troubleshoot Service Bus issues when you use the Azure SDK for Java.
ms.date: 02/23/2024
ms.topic: conceptual
ms.custom: devx-track-java, devx-track-extended-java
author: KarlErickson
ms.author: jogiles
---

# Troubleshoot Azure Service Bus

This article covers failure investigation techniques, concurrency, common errors for the credential types in the Azure Service Bus Java client library, and mitigation steps to resolve these errors.

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

## Concurrency in ProcessorClient

`ProcessorClient` enables the application to configure how many calls to the message handler should happen concurrently. This configuration makes it possible to process multiple messages in parallel. For a `ProcessorClient` consuming messages from a non-session entity, the application can configure the desired concurrency using the `maxConcurrentCalls` API. For a session enabled entity, the desired concurrency is `maxConcurrentSessions` times `maxConcurrentCalls`.

If the application observes fewer concurrent calls to the message handler than the configured concurrency, it might be because the thread pool is not sized appropriately.

`ProcessorClient` uses daemon threads from the Reactor global [boundedElastic](https://projectreactor.io/docs/core/release/api/reactor/core/scheduler/Schedulers.html#boundedElastic--) thread pool to invoke the message handler. The maximum number of concurrent threads in this pool is limited by a cap. By default, this cap is ten times the number of available CPU cores. For the `ProcessorClient` to effectively support the application's desired concurrency (`maxConcurrentCalls` or `maxConcurrentSessions` times `maxConcurrentCalls`), you must have a `boundedElastic` pool cap value that's higher than the desired concurrency. You can override the default cap by setting the system property `reactor.schedulers.defaultBoundedElasticSize`.

You should tune the thread pool and CPU allocation on a case-by-case basis. However, when you override the pool cap, as a starting point, limit the concurrent threads to approximately 20-30 per CPU core. We recommend that you cap the desired concurrency per `ProcessorClient` instance to approximately 20-30. Profile and measure your specific use case and tune the concurrency aspects accordingly. For high load scenarios, consider running multiple `ProcessorClient` instances where each instance is built from a new `ServiceBusClientBuilder` instance. Also, consider running each `ProcessorClient` in a dedicated host - such as a container or VM - so that downtime in one host doesn't impact the overall message processing.

Keep in mind that setting a high value for the pool cap on a host with few CPU cores would have adverse effects. Some signs of low CPU resources or a pool with too many threads on fewer CPUs are: frequent timeouts, lock lost, deadlock, or lower throughput. If you're running the Java application on a container, then we recommend using two or more vCPU cores. We don't recommend selecting anything less than 1 vCPU core when running Java application on containerized environments. For in-depth recommendations on resourcing, see [Containerize your Java applications](../containers/overview.md).

## Upgrade to 7.15.x or latest

If you encounter any issues, you should first attempt to solve them by upgrading to the latest version of the Service Bus SDK. Version 7.15.x is a major redesign, resolving long-standing performance and reliability concerns.

Version 7.15.x and later reduces thread hopping, removes locks, optimizes code in hot paths, and reduces memory allocations. These changes result in up to 45-50 times greater throughput on the `ServiceBusProcessor` client.

Version 7.15.x and later also comes with various reliability improvements. It addresses several race conditions (such as prefetch and credit calculations) and improved error handling. These changes result in better reliability in the presence of transient issues across various client types.

### Using the latest clients

The new underlying framework with these improvements - in version 7.15.x and later - is called the V2-Stack. This release line includes both the previous generation of the underlying stack - the stack that version 7.14.x uses - and the new V2-Stack.

By default, some of the client types use the V2-Stack, while others require V2-Stack opt-in. You can accomplish the opt-in or opt-out of a specific stack (V2 or the previous generation) for a client type by providing `com.azure.core.util.Configuration` values when you build the client.

For example, V2-Stack-based session receive with `ServiceBusSessionReceiverClient` requires opt-in as shown in the following example:

```java
ServiceBusSessionReceiverClient sessionReceiver = new ServiceBusClientBuilder()
    .connectionString(Config.CONNECTION_STRING)
    .configuration(new com.azure.core.util.ConfigurationBuilder()
        .putProperty("com.azure.messaging.servicebus.session.syncReceive.v2", "true") // 'false' by default, opt-in for V2-Stack.
        .build())
    .sessionReceiver()
    .queueName(Config.QUEUE_NAME)
    .buildClient();
```

The following table lists the client types and corresponding configuration names, and indicates whether the client is currently enabled by default to use the V2-Stack in the latest version 7.16.0. For a client that isn't on the V2-Stack by default, you can use the example just shown to opt-in.

| Client type                                       | Configuration name                                                 | Is on V2-Stack by default? |
|---------------------------------------------------|--------------------------------------------------------------------|----------------------------|
| Sender and management client                      | `com.azure.messaging.servicebus.sendAndManageRules.v2`             | yes                        |
| Non-session processor and reactor receiver client | `com.azure.messaging.servicebus.nonSession.asyncReceive.v2`        | yes                        |
| Session processor receiver client                 | `com.azure.messaging.servicebus.session.processor.asyncReceive.v2` | yes                        |
| Session reactor receiver client                   | `com.azure.messaging.servicebus.session.reactor.asyncReceive.v2`   | yes                        |
| Non-session synchronous receiver client           | `com.azure.messaging.servicebus.nonSession.syncReceive.v2`         | no                         |
| Session synchronous receiver client               | `com.azure.messaging.servicebus.session.syncReceive.v2`            | no                         |

As an alternative to using `com.azure.core.util.Configuration`, you can do the opt-in or opt-out by setting the same configuration names using environment variables or system properties.

## Next steps

If the troubleshooting guidance in this article doesn't help to resolve issues when you use the Azure SDK for Java client libraries, we recommended that you [file an issue](https://github.com/Azure/azure-sdk-for-java/issues/new/choose) in the [Azure SDK for Java GitHub repository](https://github.com/Azure/azure-sdk-for-java).

<!-- LINKS -->
[LoggingPom]: https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/servicebus/azure-messaging-servicebus/docs/pom.xml
