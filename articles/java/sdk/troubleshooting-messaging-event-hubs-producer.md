---
title: Troubleshooting Event Hubs Producer
description: A troubleshooting guide for Events Hubs producer issues when using the Azure SDK for Java
ms.date: 08/16/2023
ms.topic: conceptual
ms.custom: devx-track-java, devx-track-extended-java
author: KarlErickson
ms.author: jogiles
---

# Troubleshooting Event Hubs Producer

This troubleshooting guide provides solutions to common problems that you might encounter when using the `EventHubsProducerClient` and `EventHubsProducerAsyncClient` types. If you are looking for solutions to common problems that you might encounter when using the Event Hubs, see [Troubleshooting Azure SDK for Java messaging issues](./troubleshooting-messaging-overview).

## Cannot set multiple partition keys for events in EventDataBatch

When publishing messages, the Event Hubs service supports a single partition key for each EventDataBatch. Customers can consider using the buffered producer client `EventHubBufferedProducerClient` if they want that capability. Otherwise, they'll have to manage their batches.

## Setting partition key on EventData is not set in Kafka consumer

The partition key of the EventHubs event is available in the Kafka record headers, the protocol specific key being "x-opt-partition-key" in the header.

By design, Event Hubs does not promote the Kafka message key to be the Event Hubs partition key nor the reverse because with the same value, the Kafka client and the Event Hub client likely send the message to two different partitions. It might cause some confusion if we set the value in the cross-protocol communication case. Exposing the properties with a protocol specific key to the other protocol client should be good enough.

## Next Steps

If the troubleshooting guidance above does not help to resolve issues when using the Azure SDK for Java client libraries, it is recommended that you reach out to the development team by [filing an issue][azsdkjava_github_repo_new_issue] on the [Azure SDK for Java GitHub page][azsdkjava_github_repo].

<!-- LINKS -->
[azsdkjava_github_repo]: https://github.com/Azure/azure-sdk-for-java
[azsdkjava_github_repo_new_issue]: https://github.com/Azure/azure-sdk-for-java/issues/new/choose
