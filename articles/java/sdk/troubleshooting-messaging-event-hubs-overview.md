---
title: Troubleshooting Event Hubs
description: A troubleshooting guide for Events Hubs issues when using the Azure SDK for Java
ms.date: 08/16/2023
ms.topic: conceptual
ms.custom: devx-track-java, devx-track-extended-java
author: KarlErickson
ms.author: jogiles
---

# Troubleshooting Event Hubs

This troubleshooting guide covers failure investigation techniques, common errors for the credential types in the Event Hubs library, and mitigation steps to resolve these errors. In addition to the general troubleshooting techniques and guidance that apply regardless of Event Hubs use case, there are additional pages linked to below for specific features of the Event Hubs library:

* [Event Producer Troubleshooting](troubleshooting-messaging-event-hubs-producer.md)
* [Event Processor Troubleshooting](troubleshooting-messaging-event-hubs-processor.md)
* [Performance Troubleshooting](troubleshooting-messaging-event-hubs-performance.md)

The remainder of this document covers general troubleshooting techniques and guidance that apply to all users of the Event Hubs library.

## Handling Event Hubs exceptions

All Event Hubs exceptions are wrapped in an [AmqpException][AmqpException]. They often have an underlying AMQP error code which specifies whether an error should be retried. For retryable errors (ie. `amqp:connection:forced` or `amqp:link:detach-forced`), the client libraries attempt to recover from these errors based on the retry options specified when instantiating the client. To configure retry options, follow the sample [publish events to specific partition][PublishEventsToSpecificPartition]. If the error is non-retryable, there is some configuration issue that needs to be resolved.

The recommended way to solve the specific exception the AMQP exception represents is to follow the [Event Hubs Messaging Exceptions][EventHubsMessagingExceptions] guidance.

### Finding relevant information in exception messages

An [AmqpException][AmqpException] contains three fields which describe the error.

* **getErrorCondition**: The underlying AMQP error. A description of the errors can be found in the [AmqpErrorCondition][AmqpErrorCondition] javadocs or the [OASIS AMQP 1.0 spec][AmqpSpec].
* **isTransient**: Whether or not trying to perform the same operation is possible. SDK clients apply the retry policy when the error is transient.
* **getErrorContext**: Information about where the AMQP error originated:
  * [LinkErrorContext][LinkErrorContext]: Errors that occur in either the send/receive link.
  * [SessionErrorContext][SessionErrorContext]: Errors that occur in the session.
  * [AmqpErrorContext][AmqpErrorContext]: Errors that occur in the connection or a general AMQP error.

### Commonly encountered exceptions

#### amqp:connection:forced and amqp:link:detach-forced

When the connection to Event Hubs is idle, the service disconnects the client after some time. This issue is not a problem because the clients re-establish a connection when a service operation is requested. For more information, see the [AMQP troubleshooting documentation][AmqpTroubleshooting].

## Permission issues

An `AmqpException` with an [`AmqpErrorCondition`][AmqpErrorCondition] of "amqp:unauthorized-access" means that the provided credentials do not allow for them to perform the action (receiving or sending) with Event Hubs.

* [Double check you have the correct connection string][GetConnectionString]
* [Ensure your SAS token is generated correctly][AuthorizeSAS]

[Troubleshoot authentication and authorization issues with Event Hubs][troubleshoot_authentication_authorization] lists other possible solutions.

## Connectivity issues

### Timeout when connecting to service

* Verify that the connection string or fully qualified domain name specified when creating the client is correct.  [Get an Event Hubs connection string][GetConnectionString] demonstrates how to acquire a connection string.
* Check the firewall and port permissions in your hosting environment and that the AMQP ports 5671 and 5762 are open.
  * Make sure that the endpoint is allowed through the firewall.
* Try using WebSockets, which connects on port 443. See [configure web sockets][PublishEventsWithWebSocketsAndProxy] sample.
* See if your network is blocking specific IP addresses.
  * [What IP addresses do I need to allow?][EventHubsIPAddresses]
* If applicable, check the proxy configuration. See [configure proxy][PublishEventsWithWebSocketsAndProxy] sample.
* For more information about troubleshooting network connectivity is at [Event Hubs troubleshooting][EventHubsTroubleshooting]

### SSL handshake failures

This error can occur when an intercepting proxy is used. We recommend testing in your hosting environment with the proxy disabled to verify.

### Socket exhaustion errors

Applications should prefer treating the Event Hubs clients as a singleton, creating and using a single instance through the lifetime of their application. This is important as each client type manages its connection; creating a new Event Hub client results in a new AMQP connection, which uses a socket. Additionally, it is essential to be aware that clients inherit from `java.io.Closeable`, so your application is responsible for calling `close()` when it is finished using a client.

To use the same AMQP connection when creating multiple clients, you can use the `EventHubClientBuilder.shareConnection()` flag, hold a reference to that `EventHubClientBuilder`, and create new clients from that same builder instance.

### Connect using an IoT connection string

Because translating a connection string requires querying the IoT Hub service, the Event Hubs client library cannot use it directly. The [IoTConnectionString.java][IoTConnectionString] sample describes how to query IoT Hub to translate an IoT connection string into one that can be used with Event Hubs.

Further reading:

* [Control access to IoT Hub using Shared Access Signatures][IoTHubSAS]
* [Read device-to-cloud messages from the built-in endpoint][IoTEventHubEndpoint]

### Cannot add components to the connection string

The legacy Event Hub clients allowed customers to add components to the connection string retrieved from the portal. The legacy clients are in packages [com.microsoft.azure:azure-eventhubs][MavenAzureEventHubs] and [com.microsoft.azure:azure-eventhubs-eph][MavenAzureEventHubsEPH]. The current generation supports connection strings only in the form published by the Azure portal.

#### Adding "TransportType=AmqpWebSockets"

To use web sockets, see the sample [PublishEventsWithSocketsAndProxy.java][PublishEventsWithWebSocketsAndProxy].

#### Adding "Authentication=Managed Identity"

To authenticate with Managed Identity, see the sample [PublishEventsWithAzureIdentity.java][PublishEventsWithAzureIdentity].

For more information about the `Azure.Identity` library, check out our [Authentication and the Azure SDK][AuthenticationAndTheAzureSDK] blog post.

## Enable and configure logging

Azure SDK for Java offers a consistent logging story to help aid in troubleshooting application errors and expedite their resolution. The logs produced capture the flow of an application before reaching the terminal state to help locate the root issue. You can review the [logging conceptual documentation](logging-overview.md) and the [troubleshooting documentation](troubleshooting-overview.md) for guidance on using logging.

In addition to enabling logging, setting the log level to `VERBOSE` or `DEBUG` provides insights into the library's state. Below are sample log4j2 and logback configurations to reduce the excessive messages when verbose logging is enabled.

### Configuring Log4J 2

1. Add the dependencies in your pom.xml using ones from the [logging sample pom.xml][LoggingPom] under the "Dependencies required for Log4j2" section.
2. Add [log4j2.xml][log4j2] to your `src/main/resources`.

### Configuring logback

1. Add the dependencies in your pom.xml using ones from the [logging sample pom.xml][LoggingPom] under the "Dependencies required for logback" section.
2. Add [logback.xml][logback] to your `src/main/resources`.

### Enable AMQP transport logging

If enabling client logging is not enough to diagnose your issues. You can enable logging to a file in the underlying AMQP library, [Qpid Proton-J][qpid_proton_j_apache]. Qpid Proton-J uses `java.util.logging`. You can enable logging by creating a configuration file with the contents below. Or set `proton.trace.level=ALL` and whichever configuration options you want for the `java.util.logging.Handler` implementation. The implementation classes and their options can be found in [Java 8 SDK javadoc][java_8_sdk_javadocs].

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

One way to decrease logging is to change the verbosity. Another is to add filters that exclude logs from logger names packages like `com.azure.messaging.eventhubs` or `com.azure.core.amqp`. Examples of this can be found in the XML files in [Configuring Log4J 2](#configuring-log4j-2) and [Configure logback](#configuring-logback).

When submitting a bug, log messages from classes in the following packages are interesting:

* `com.azure.core.amqp.implementation`
* `com.azure.core.amqp.implementation.handler`
  * The exception is that you can ignore the `onDelivery` message in `ReceiveLinkHandler`.
* `com.azure.messaging.eventhubs.implementation`

## Next steps

If the troubleshooting guidance in this article doesn't help to resolve issues when using the Azure SDK for Java client libraries, we recommended that you reach out to the development team by [filing an issue](https://github.com/Azure/azure-sdk-for-java/issues/new/choose) in the [Azure SDK for Java GitHub repository](https://github.com/Azure/azure-sdk-for-java).

<!-- LINKS -->
[IoTConnectionString]: https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/eventhubs/azure-messaging-eventhubs/src/samples/java/com/azure/messaging/eventhubs/IoTHubConnectionSample.java
[log4j2]: https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/eventhubs/azure-messaging-eventhubs/docs/log4j2.xml
[logback]: https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/eventhubs/azure-messaging-eventhubs/docs/logback.xml
[LoggingPom]: https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/eventhubs/azure-messaging-eventhubs/docs/pom.xml
[PublishEventsToSpecificPartition]: https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/eventhubs/azure-messaging-eventhubs/src/samples/java/com/azure/messaging/eventhubs/PublishEventsToSpecificPartition.java
[PublishEventsWithAzureIdentity]: https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/eventhubs/azure-messaging-eventhubs/src/samples/java/com/azure/messaging/eventhubs/PublishEventsWithAzureIdentity.java
[PublishEventsWithWebSocketsAndProxy]: https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/eventhubs/azure-messaging-eventhubs/src/samples/java/com/azure/messaging/eventhubs/PublishEventsWithWebSocketsAndProxy.java

<!-- learn.microsoft.com links -->
[AmqpErrorCondition]: /java/api/com.azure.core.amqp.exception.amqperrorcondition
[AmqpErrorContext]: /java/api/com.azure.core.amqp.exception.amqperrorcontext
[AmqpException]: /java/api/com.azure.core.amqp.exception.amqpexception
[SessionErrorContext]: /java/api/com.azure.core.amqp.exception.sessionerrorcontext
[LinkErrorContext]: /java/api/com.azure.core.amqp.exception.linkerrorcontext
[AmqpTroubleshooting]: /azure/service-bus-messaging/service-bus-amqp-troubleshoot
[AuthorizeSAS]: /azure/event-hubs/authorize-access-shared-access-signature
[EventHubsIPAddresses]: /azure/event-hubs/troubleshooting-guide#what-ip-addresses-do-i-need-to-allow
[EventHubsMessagingExceptions]: /azure/event-hubs/event-hubs-messaging-exceptions
[EventHubsTroubleshooting]: /azure/event-hubs/troubleshooting-guide
[GetConnectionString]: /azure/event-hubs/event-hubs-get-connection-string
[IoTEventHubEndpoint]: /azure/iot-hub/iot-hub-devguide-messages-read-builtin
[IoTHubSAS]: /azure/iot-hub/iot-hub-dev-guide-sas#security-tokens
[troubleshoot_authentication_authorization]: /azure/event-hubs/troubleshoot-authentication-authorization

<!-- external links -->
[AuthenticationAndTheAzureSDK]: https://devblogs.microsoft.com/azure-sdk/authentication-and-the-azure-sdk
[MavenAzureEventHubs]: https://search.maven.org/artifact/com.microsoft.azure/azure-eventhubs/
[MavenAzureEventHubsEPH]: https://search.maven.org/artifact/com.microsoft.azure/azure-eventhubs-eph
[java_8_sdk_javadocs]: https://docs.oracle.com/javase/8/docs/api/java/util/logging/package-summary.html
[AmqpSpec]: https://docs.oasis-open.org/amqp/core/v1.0/os/amqp-core-types-v1.0-os.html
[qpid_proton_j_apache]: https://qpid.apache.org/proton/