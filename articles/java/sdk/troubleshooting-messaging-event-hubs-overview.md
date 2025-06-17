---
title: Troubleshoot Azure Event Hubs
titleSuffix: Azure SDK for Java
description: Helps you troubleshoot Events Hubs issues when you use the Azure SDK for Java.
ms.date: 04/02/2025 
ms.topic: troubleshooting-general
ms.custom: devx-track-java, devx-track-extended-java
author: KarlErickson
ms.author: karler
ms.reviewer: jogiles
---

# Troubleshoot Azure Event Hubs

This article covers failure investigation techniques, common errors for the credential types in the Event Hubs library, and mitigation steps to resolve these errors. In addition to the general troubleshooting techniques and guidance that apply regardless of the Event Hubs use case, the following articles cover specific features of the Event Hubs library:

* [Troubleshoot Azure Event Hubs producer](troubleshooting-messaging-event-hubs-producer.md)
* [Troubleshoot Azure Event Hubs event processor](troubleshooting-messaging-event-hubs-processor.md)
* [Troubleshoot Azure Event Hubs performance](troubleshooting-messaging-event-hubs-performance.md)

The remainder of this article covers general troubleshooting techniques and guidance that apply to all users of the Event Hubs library.

## Handle Event Hubs exceptions

All Event Hubs exceptions are wrapped in an [AmqpException](/java/api/com.azure.core.amqp.exception.amqpexception). These exceptions often have an underlying AMQP error code that specifies whether an error should be retried. For retryable errors (that is, `amqp:connection:forced` or `amqp:link:detach-forced`), the client libraries attempt to recover from these errors based on the retry options specified when instantiating the client. To configure retry options, follow the sample [publish events to specific partition](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/eventhubs/azure-messaging-eventhubs/src/samples/java/com/azure/messaging/eventhubs/PublishEventsToSpecificPartition.java). If the error is nonretryable, there's some configuration issue that needs to be resolved.

The recommended way to solve the specific exception the AMQP exception represents is to follow the [Event Hubs Messaging Exceptions](/azure/event-hubs/event-hubs-messaging-exceptions) guidance.

### Find relevant information in exception messages

An [AmqpException](/java/api/com.azure.core.amqp.exception.amqpexception) contains the following three fields, which describe the error:

* **getErrorCondition**: The underlying AMQP error. For a description of the errors, see the [AmqpErrorCondition Enum](/java/api/com.azure.core.amqp.exception.amqperrorcondition) documentation or the [OASIS AMQP 1.0 spec](https://docs.oasis-open.org/amqp/core/v1.0/os/amqp-core-types-v1.0-os.html).
* **isTransient**: A value that indicates whether trying to perform the same operation is possible. SDK clients apply the retry policy when the error is transient.
* **getErrorContext**: Contains the following information about where the AMQP error originated:
  * [LinkErrorContext](/java/api/com.azure.core.amqp.exception.linkerrorcontext): Errors that occur in either the send or receive link.
  * [SessionErrorContext](/java/api/com.azure.core.amqp.exception.sessionerrorcontext): Errors that occur in the session.
  * [AmqpErrorContext](/java/api/com.azure.core.amqp.exception.amqperrorcontext): Errors that occur in the connection or a general AMQP error.

### Commonly encountered exceptions

#### amqp:connection:forced and amqp:link:detach-forced

When the connection to Event Hubs is idle, the service disconnects the client after some time. This issue isn't a problem because the clients re-establish a connection when a service operation is requested. For more information, see [AMQP errors in Azure Service Bus](/azure/service-bus-messaging/service-bus-amqp-troubleshoot).

## Permission issues

An `AmqpException` with an [AmqpErrorCondition](/java/api/com.azure.core.amqp.exception.amqperrorcondition) of `amqp:unauthorized-access` means that the provided credentials don't allow for performing the action (receiving or sending) with Event Hubs. To resolve this issue, try the following tasks:

* Double check that you have the correct connection string. For more information, see [Get an Event Hubs connection string](/azure/event-hubs/event-hubs-get-connection-string).
* Ensure that your shared access signature (SAS) token is generated correctly. For more information, see [Authorizing access to Event Hubs resources using Shared Access Signatures](/azure/event-hubs/authorize-access-shared-access-signature).

For other possible solutions, see [Troubleshoot authentication and authorization issues with Event Hubs](/azure/event-hubs/troubleshoot-authentication-authorization).

## Connectivity issues

### Timeout when connecting to service

To resolve timeout issues, try the following tasks:

* Verify that the connection string or fully qualified domain name specified when creating the client is correct. For more information, see [Get an Event Hubs connection string](/azure/event-hubs/event-hubs-get-connection-string).
* Check the firewall and port permissions in your hosting environment and verify that the AMQP ports 5671 and 5762 are open.
  * Make sure that the endpoint is allowed through the firewall.
* Try using WebSockets, which connects on port 443. For more information, see the [PublishEventsWithWebSocketsAndProxy.java][PublishEventsWithWebSocketsAndProxy] sample.
* See if your network is blocking specific IP addresses. For more information, see [What IP addresses do I need to allow?](/azure/event-hubs/troubleshooting-guide#what-ip-addresses-do-i-need-to-allow)
* If applicable, check the proxy configuration. For more information, see the [PublishEventsWithWebSocketsAndProxy.java][PublishEventsWithWebSocketsAndProxy] sample.
* For more information about troubleshooting network connectivity, see [Troubleshoot connectivity issues - Azure Event Hubs](/azure/event-hubs/troubleshooting-guide).

### TLS/SSL handshake failures

This error can occur when an intercepting proxy is used. To verify, we recommend testing in your hosting environment with the proxy disabled.

### Socket exhaustion errors

Applications should prefer treating the Event Hubs clients as a singleton, creating and using a single instance through the lifetime of their application. This recommendation is important because each client type manages its connection. When you create a new Event Hubs client, it results in a new AMQP connection, which uses a socket. Additionally, it's essential that clients inherit from `java.io.Closeable`, so your application is responsible for calling `close()` when it's finished using a client.

To use the same AMQP connection when creating multiple clients, you can use the `EventHubClientBuilder.shareConnection()` flag, hold a reference to that `EventHubClientBuilder`, and create new clients from that same builder instance.

### Connect using an IoT connection string

Because translating a connection string requires querying the IoT Hub service, the Event Hubs client library can't use it directly. The [IoTConnectionString.java](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/eventhubs/azure-messaging-eventhubs/src/samples/java/com/azure/messaging/eventhubs/IoTHubConnectionSample.java) sample describes how to query IoT Hub to translate an IoT connection string into one that can be used with Event Hubs.

For more information, see the following articles:

* [Control access to IoT Hub using Shared Access Signatures](/azure/iot-hub/iot-hub-dev-guide-sas)
* [Read device-to-cloud messages from the built-in endpoint](/azure/iot-hub/iot-hub-devguide-messages-read-builtin)

### Can't add components to the connection string

The legacy Event Hubs clients allowed customers to add components to the connection string retrieved from the Azure portal. The legacy clients are in packages [com.microsoft.azure:azure-eventhubs](https://search.maven.org/artifact/com.microsoft.azure/azure-eventhubs/) and [com.microsoft.azure:azure-eventhubs-eph](https://search.maven.org/artifact/com.microsoft.azure/azure-eventhubs-eph). The current generation supports connection strings only in the form published by the Azure portal.

#### Add "TransportType=AmqpWebSockets"

To use web sockets, see the [PublishEventsWithSocketsAndProxy.java][PublishEventsWithWebSocketsAndProxy] sample.

#### Add "Authentication=Managed Identity"

To authenticate with Managed Identity, see the sample [PublishEventsWithAzureIdentity.java](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/eventhubs/azure-messaging-eventhubs/src/samples/java/com/azure/messaging/eventhubs/PublishEventsWithAzureIdentity.java).

For more information about the `Azure.Identity` library, check out our [Authentication and the Azure SDK](https://devblogs.microsoft.com/azure-sdk/authentication-and-the-azure-sdk) blog post.

## Enable and configure logging

Azure SDK for Java offers a consistent logging story to help in troubleshooting application errors and to help expedite their resolution. The logs produced capture the flow of an application before reaching the terminal state to help locate the root issue. For guidance on logging, see [Configure logging in the Azure SDK for Java](logging-overview.md) and [Troubleshooting overview](troubleshooting-overview.md).

In addition to enabling logging, setting the log level to `VERBOSE` or `DEBUG` provides insights into the library's state. The following sections show sample log4j2 and logback configurations to reduce the excessive messages when verbose logging is enabled.

### Configure Log4J 2

Use the following steps to configure Log4J 2:

1. Add the dependencies in your **pom.xml** using the ones from the [logging sample pom.xml][LoggingPom], in the "Dependencies required for Log4j2" section.
1. Add [log4j2.xml](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/eventhubs/azure-messaging-eventhubs/docs/log4j2.xml) to your **src/main/resources** folder.

### Configure logback

Use the following steps to configure logback:

1. Add the dependencies in your **pom.xml** using the ones from the [logging sample pom.xml][LoggingPom], in the "Dependencies required for logback" section.
1. Add [logback.xml](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/eventhubs/azure-messaging-eventhubs/docs/logback.xml) to your **src/main/resources** folder.

### Enable AMQP transport logging

If enabling client logging isn't enough to diagnose your issues, you can enable logging to a file in the underlying AMQP library, [Qpid Proton-J](https://qpid.apache.org/proton/). Qpid Proton-J uses `java.util.logging`. You can enable logging by creating a configuration file with the contents shown in the next section. Or, set `proton.trace.level=ALL` and whichever configuration options you want for the `java.util.logging.Handler` implementation. For the implementation classes and their options, see [Package java.util.logging](https://docs.oracle.com/javase/8/docs/api/java/util/logging/package-summary.html) in the Java 8 SDK documentation.

To trace the AMQP transport frames, set the `PN_TRACE_FRM=1` environment variable.

#### Sample "logging.properties" file

The following configuration file logs TRACE level output from Proton-J to the **proton-trace.log** file:

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

One way to decrease logging is to change the verbosity. Another way is to add filters that exclude logs from logger names packages like `com.azure.messaging.eventhubs` or `com.azure.core.amqp`. For examples, see the XML files in the [Configuring Log4J 2](#configure-log4j-2) and [Configure logback](#configure-logback) sections.

When you submit a bug, the log messages from classes in the following packages are interesting:

* `com.azure.core.amqp.implementation`
* `com.azure.core.amqp.implementation.handler`
  * The exception is that you can ignore the `onDelivery` message in `ReceiveLinkHandler`.
* `com.azure.messaging.eventhubs.implementation`

## Next steps

If the troubleshooting guidance in this article doesn't help to resolve issues when you use the Azure SDK for Java client libraries, we recommended that you [file an issue](https://github.com/Azure/azure-sdk-for-java/issues/new/choose) in the [Azure SDK for Java GitHub repository](https://github.com/Azure/azure-sdk-for-java).

<!-- LINKS -->
[LoggingPom]: https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/eventhubs/azure-messaging-eventhubs/docs/pom.xml
[PublishEventsWithWebSocketsAndProxy]: https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/eventhubs/azure-messaging-eventhubs/src/samples/java/com/azure/messaging/eventhubs/PublishEventsWithWebSocketsAndProxy.java
