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

## Concurrency in ServiceBusProcessorClient

`ServiceBusProcessorClient` enables the application to configure how many calls to the message handler should happen concurrently. This configuration makes it possible to process multiple messages in parallel. For a `ServiceBusProcessorClient` consuming messages from a non-session entity, the application can configure the desired concurrency using the `maxConcurrentCalls` API. For a session enabled entity, the desired concurrency is `maxConcurrentSessions` times `maxConcurrentCalls`.

If the application observes fewer concurrent calls to the message handler than the configured concurrency, it might be because the thread pool is not sized appropriately.

`ServiceBusProcessorClient` uses daemon threads from the Reactor global [boundedElastic](https://projectreactor.io/docs/core/release/api/reactor/core/scheduler/Schedulers.html#boundedElastic--) thread pool to invoke the message handler. The maximum number of concurrent threads in this pool is limited by a cap. By default, this cap is ten times the number of available CPU cores. For the `ServiceBusProcessorClient` to effectively support the application's desired concurrency (`maxConcurrentCalls` or `maxConcurrentSessions` times `maxConcurrentCalls`), you must have a `boundedElastic` pool cap value that's higher than the desired concurrency. You can override the default cap by setting the system property `reactor.schedulers.defaultBoundedElasticSize`.

You should tune the thread pool and CPU allocation on a case-by-case basis. However, when you override the pool cap, as a starting point, limit the concurrent threads to approximately 20-30 per CPU core. We recommend that you cap the desired concurrency per `ServiceBusProcessorClient` instance to approximately 20-30. Profile and measure your specific use case and tune the concurrency aspects accordingly. For high load scenarios, consider running multiple `ServiceBusProcessorClient` instances where each instance is built from a new `ServiceBusClientBuilder` instance. Also, consider running each `ServiceBusProcessorClient` in a dedicated host - such as a container or VM - so that downtime in one host doesn't impact the overall message processing.

Keep in mind that setting a high value for the pool cap on a host with few CPU cores would have adverse effects. Some signs of low CPU resources or a pool with too many threads on fewer CPUs are: frequent timeouts, lock lost, deadlock, or lower throughput. If you're running the Java application on a container, then we recommend using two or more vCPU cores. We don't recommend selecting anything less than 1 vCPU core when running Java application on containerized environments. For in-depth recommendations on resourcing, see [Containerize your Java applications](../containers/overview.md).

## Connection sharing bottleneck

All the clients created from a shared `ServiceBusClientBuilder` instance share the same connection to the Service Bus namespace.

Using a shared connection enables multiplexing operations among clients on one connection, but sharing can also become a bottleneck if there are many clients, or the clients together generate high load. Each connection has an I/O thread associated with it. When sharing connection, the clients put their work in this shared I/O thread's work-queue and the progress of each client depends on the timely completion of its work in the queue. The I/O thread handles the enqueued work serially. That is, if the I/O thread work-queue of a shared connection ends up with a lot of pending work to deal with, then the symptoms are similar to those of low CPU. This condition is described in the previous section on concurrency - for example, clients stalling, timeout, lost lock, or slowdown in recovery path.

Service Bus SDK uses the `reactor-executor-*` naming pattern for the connection I/O thread. When the application experiences the shared connection bottleneck, then it might be reflected in the I/O thread's CPU usage. Also, in the heap dump or in live memory, the object `ReactorDispatcher$workQueue` is the work-queue of the I/O thread. A long work-queue in the memory snapshot during the bottleneck period might indicate that the shared I/O thread is overloaded with pending works.

Therefore, if the application load to a Service Bus endpoint is reasonably high in terms of overall number of sent-received messages or payload size, you should use a separate builder instance for each client that you build. For example, for each entity - queue or topic - you can create a new `ServiceBusClientBuilder` and build a client from it. In case of extremely high load to a specific entity, you might want to either create multiple client instances for that entity or run clients in multiple hosts - for example, containers or VMs - to load balance.

## Clients halt when using Application Gateway custom endpoint

The custom endpoint address refers to an application-provided HTTPS endpoint address resolvable to Service Bus or configured to route traffic to Service Bus. Azure Application Gateway makes it easy to create an HTTPS front-end that forwards traffic to Service Bus. You can configure Service Bus SDK for an application to use an Application Gateway front-end IP address as the custom endpoint to connect to Service Bus.

Application Gateway offers several security policies supporting different TLS protocol versions. There are predefined policies enforcing TLSv1.2 as the minimum version, there also exist old policies with TLSv1.0 as the minimum version. The HTTPS front-end will have a TLS policy applied.

Right now, the Service Bus SDK doesn't recognize certain remote TCP terminations by the Application Gateway front end, which uses TLSv1.0 as the minimum version. For instance, if the front end sends TCP FIN, ACK packets to close the connection when its properties are updated, the SDK can't detect it, so it won't reconnect, and clients can't send or receive messages anymore. Such a halt only happens when using TLSv1.0 as the minimum version. To mitigate, use a security policy with TLSv1.2 or higher as the minimum version for the Application Gateway front-end.

The support for TLSv1.0 and 1.1 across all Azure Services is already [announced](https://azure.microsoft.com/updates/azure-support-tls-will-end-by-31-october-2024-2) to end by 31 October 2024, so transitioning to TLSv1.2 is strongly recommended.

## Troubleshooting receiver issues

### Message or session lock is lost

A Service Bus queue or subscription in a topic will have a lock duration set at the resource level. When the receiver client pulls a message from the resource, the Service Bus broker will apply an initial lock to the message. This initial lock lasts for the lock duration set at the resource level. If the message lock is not renewed before it expires then the Service Bus broker will release the message to make it available for other receivers. When an application tries to complete or abandon a message after the lock expiration, the API call will fail with the error saying "The lock supplied is invalid. Either the lock expired, or the message has already been removed from the queue". 

The Service Bus client supports renewing the message lock continuously each time before it expires. For this client will run a background lock renew task. By default, the lock renew task will run for a duration of 5 minutes, this duration can be adjusted using `ServiceBusReceiverClientBuilder::maxAutoLockRenewDuration(Duration)` API or can be turned off by setting it `Duration#ZERO`.

Some of the usage patterns or host environment that can lead to this lock expired error are -
* The lock renew task is turned off and the application's message processing time exceeds the lock duration set at the resource level.
* The application's message processing time exceeds the configured lock renew task duration. Note that if the renewal duration is not set explicitly then it defaults to 5 minutes.
* The host environment has occasional network problems, e.g., transient network failure, a network outage, that prevent the lock renewal task from being renewing the lock on time.
* The host environment lacks enough CPUs or has shortages of CPU cycles intermittently that delay the lock renewal task from running on time.
* The application is running multiple receiver clients sharing the same connection and the connection I/O Thread is overloaded, impacting I/O Thread ability to execute lock renewal network calls on time. See the section [Connection sharing bottleneck](#connection-sharing-bottleneck).

When using ServiceBusProcessorClient receiver, a higher `maxConcurrentCalls` means an equivalent number of lock renewal tasks running in the client, which may put more stress on low CPU environments. Given each lock renewal is a network call to the Service Bus broker, a high number of lock renewal tasks making multiple lock renew calls also may have an adverse effect in Service Bus namespace throttling and on network, impacting client ability to renew the locks on time. Similarly, a higher `maxMessages` for `ServiceBusReceiverClient::receiveMessages` means an equivalent number of lock renewal tasks running in the client.

The same observations related to locks apply for a session enabled Service Bus queue or subscription in a topic as well. When the receiver client connects to a session in the resource, the broker will apply an initial lock to the session. To maintain the lock on the session, the client's lock renew task has to keep renewing the session lock before it expires. When an application tries to complete or abandon a message after the lock expiration, the API call will fail with the error saying "The session lock was lost. Request a new session receiver". 

## Upgrade to 7.15.x or latest

If you encounter any issues, you should first attempt to solve them by upgrading to the latest version of the Service Bus SDK. Version 7.15.x is a major redesign, resolving long-standing performance and reliability concerns.

Version 7.15.x and later reduces thread hopping, removes locks, optimizes code in hot paths, and reduces memory allocations. These changes result in up to 45-50 times greater throughput on the `ServiceBusProcessorClient`.

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

The following table lists the client types and corresponding configuration names, and indicates whether the client is currently enabled by default to use the V2-Stack in the latest version 7.17.0. For a client that isn't on the V2-Stack by default, you can use the example just shown to opt-in.

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
