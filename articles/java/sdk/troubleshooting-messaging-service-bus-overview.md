---
title: Troubleshoot Azure Service Bus
titleSuffix: Azure SDK for Java
description: Helps you troubleshoot Service Bus issues when you use the Azure SDK for Java.
ms.date: 02/23/2024
ms.topic: troubleshooting-general
ms.custom: devx-track-java, devx-track-extended-java
author: KarlErickson
ms.author: karler
ms.reviewer: jogiles
---

# Troubleshoot Azure Service Bus

This article covers failure investigation techniques, concurrency, common errors for the credential types in the Azure Service Bus Java client library, and mitigation steps to resolve these errors.

## Enable and configure logging

Azure SDK for Java offers a consistent logging story to help in troubleshooting application errors and to help expedite their resolution. The logs produced capture the flow of an application before reaching the terminal state to help locate the root issue. For guidance on logging, see [Configure logging in the Azure SDK for Java](logging-overview.md) and [Troubleshooting overview](troubleshooting-overview.md).

In addition to enabling logging, setting the log level to `VERBOSE` or `DEBUG` provides insights into the library's state. The following sections show sample log4j2 and logback configurations to reduce the excessive messages when verbose logging is enabled.

### Configure Log4J 2

Use the following steps to configure Log4J 2:

1. Add the dependencies in your **pom.xml** using ones from the [logging sample pom.xml][LoggingPom], in the "Dependencies required for Log4j2" section.
1. Add [log4j2.xml](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/servicebus/azure-messaging-servicebus/docs/log4j2.xml) to your **src/main/resources** folder.

### Configure logback

Use the following steps to configure logback:

1. Add the dependencies in your **pom.xml** using ones from the [logging sample pom.xml][LoggingPom], in the "Dependencies required for logback" section.
1. Add [logback.xml](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/servicebus/azure-messaging-servicebus/docs/logback.xml) to your **src/main/resources** folder.

### Enable AMQP transport logging

If enabling client logging isn't enough to diagnose your issues, you can enable logging to a file in the underlying AMQP library, [Qpid Proton-J](https://qpid.apache.org/proton/). Qpid Proton-J uses `java.util.logging`. You can enable logging by creating a configuration file with the contents shown in the next section. Or, set `proton.trace.level=ALL` and whichever configuration options you want for the `java.util.logging.Handler` implementation. For the implementation classes and their options, see [Package java.util.logging](https://docs.oracle.com/javase/8/docs/api/java/util/logging/package-summary.html) in the Java 8 SDK documentation.

To trace the AMQP transport frames, set the `PN_TRACE_FRM=1` environment variable.

#### Sample logging.properties file

The following configuration file logs TRACE level output from Proton-J to the file **proton-trace.log**:

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

## Message or session lock is lost

A Service Bus queue or topic subscription has a lock duration set at the resource level. When the receiver client pulls a message from the resource, the Service Bus broker applies an initial lock to the message. The initial lock lasts for the lock duration set at the resource level. If the message lock isn't renewed before it expires, then the Service Bus broker releases the message to make it available for other receivers. If the application tries to complete or abandon a message after the lock expiration, the API call fails with the error `com.azure.messaging.servicebus.ServiceBusException: The lock supplied is invalid. Either the lock expired, or the message has already been removed from the queue`. 

The Service Bus client supports running a background lock renew task that renews the message lock continuously each time before it expires. By default, the lock renew task runs for 5 minutes. You can adjust the lock renew duration by using `ServiceBusReceiverClientBuilder.maxAutoLockRenewDuration(Duration)`. If you pass the `Duration.ZERO` value, the lock renew task is disabled.

The following lists describes some of the usage patterns or host environments that can lead to the lock lost error:

* The lock renew task is disabled and the application's message processing time exceeds the lock duration set at the resource level.
* The application's message processing time exceeds the configured lock renew task duration. Note that, if the lock renew duration is not set explicitly, it defaults to 5 minutes.
* The application has turned on the Prefetch feature by setting the prefetch value to a positive integer using `ServiceBusReceiverClientBuilder.prefetchCount(prefetch)`. When the Prefetch feature is enabled, the client will retrieve the number of messages equal to the prefetch from the Service Bus entity - queue or topic - and store them in the in-memory prefetch buffer. The messages stay in the prefetch buffer until they're received into the application. The client doesn't extend the lock of the messages while they're in the prefetch buffer. If the application processing takes so long that message locks expire while staying in the prefetch buffer, then the application might acquire the messages with an expired lock. For more information, see [Why is Prefetch not the default option?](/azure/service-bus-messaging/service-bus-prefetch?tabs=java#why-is-prefetch-not-the-default-option)
* The host environment has occasional network problems - for example, transient network failure or outage - that prevent the lock renew task from renewing the lock on time.
* The host environment lacks enough CPUs or has shortages of CPU cycles intermittently that delays the lock renew task from running on time.
* The host system time isn't accurate - for example, the clock is skewed - delaying the lock renew task and keeping it from running on time.
* The connection I/O thread is overloaded, impacting its ability to execute lock renew network calls on time. The following two scenarios can cause this issue:

  * The application is running too many receiver clients sharing the same connection. For more information, see the [Connection sharing bottleneck](#connection-sharing-bottleneck) section.
  * The application has configured `ServiceBusReceiverClient.receiveMessages` or `ServiceBusProcessorClient` to have a large `maxMessages` or `maxConcurrentCalls` values. For more information, see the [Concurrency in ServiceBusProcessorClient](#concurrency-in-servicebusprocessorclient) section.
* A common application pattern that increases the likelihood of a lock-lost error involves scheduling long-running lock renew tasks - for example, tasks with durations spanning several hours. As mentioned previously, various factors outside the control of a Service Bus client can interfere with successful lock renewal, so application designs should avoid assuming guaranteed renewal over extended periods. To avoid having to reprocess long-running operations, consider breaking the work into smaller chunks or implementing idempotent checkpointing logic.

The number of lock renew tasks in the client is equal to the `maxMessages` or `maxConcurrentCalls` parameter values set for `ServiceBusProcessorClient` or `ServiceBusReceiverClient.receiveMessages`. A high number of lock renew tasks making multiple network calls can also have an adverse effect in Service Bus namespace throttling.

If the host is not sufficiently resourced, the lock can still be lost even if there are only a few lock renew tasks running. If you're running the Java application on a container, then we recommend using two or more vCPU cores. We don't recommend selecting anything less than 1 vCPU core when running Java applications on containerized environments. For in-depth recommendations on resourcing, see [Containerize your Java applications](../containers/overview.md).

The same remarks about locks are also relevant for a Service Bus queue or a topic subscription that has session enabled. When the receiver client connects to a session in the resource, the broker applies an initial lock to the session. To maintain the lock on the session, the lock renew task in the client has to keep renewing the session lock before it expires. For a session enabled resource, the underlying partitions sometimes move to achieve load balancing across Service Bus nodes - for example, when new nodes are added to share the load. When that happens, session locks can be lost. If the application tries to complete or abandon a message after the session lock is lost, the API call fails with the error `com.azure.messaging.servicebus.ServiceBusException: The session lock was lost. Request a new session receiver`.

## Next steps

If the troubleshooting guidance in this article doesn't help to resolve issues when you use the Azure SDK for Java client libraries, we recommended that you [file an issue](https://github.com/Azure/azure-sdk-for-java/issues/new/choose) in the [Azure SDK for Java GitHub repository](https://github.com/Azure/azure-sdk-for-java).

<!-- LINKS -->
[LoggingPom]: https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/servicebus/azure-messaging-servicebus/docs/pom.xml
