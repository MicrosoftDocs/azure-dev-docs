---
title: Troubleshoot Azure Event Hubs event processor
titleSuffix: Azure SDK for Java
description: Helps you troubleshoot Event Hubs EventProcessor issues when you use the Azure SDK for Java.
ms.date: 04/02/2025 
ms.topic: troubleshooting-general
ms.custom: devx-track-java, devx-track-extended-java
author: KarlErickson
ms.author: karler
ms.reviewer: jogiles
---

# Troubleshoot Azure Event Hubs event processor

This article provides solutions to common problems that you might encounter when you use the `EventProcessorClient` type. If you're looking for solutions to other common problems that you might encounter when you use Azure Event Hubs, see [Troubleshoot Azure Event Hubs](troubleshooting-messaging-event-hubs-overview.md).

## 412 precondition failures when you use an event processor

412 precondition errors occur when the client tries to take or renew ownership of a partition, but the local version of the ownership record is outdated. This problem occurs when another processor instance steals partition ownership. For more information, see the next section.

## Partition ownership changes frequently

When the number of `EventProcessorClient` instances changes (that is, are added or removed), the running instances try to load-balance partitions between themselves. For a few minutes after the number of processors changes, partitions are expected to change owners. After it's balanced, partition ownership should be stable and change infrequently. If partition ownership is changing frequently when the number of processors is constant, it likely indicates a problem. We recommended that you file a GitHub issue with logs and a repro.

Partition ownership is determined via the ownership records in the `CheckpointStore`. On every load balancing interval, the `EventProcessorClient` will perform the following tasks:

1. Fetch the latest ownership records.
1. Check the records to see which records haven't updated their timestamp within the partition ownership expiration interval. Only records matching this criteria are considered.
1. If there are any unowned partitions and the load is not balanced between instances of `EventProcessorClient`, the event processor client will try to claim a partition.
1. Update the ownership record for the partitions it owns that have an active link to that partition.

You can configure the load balancing and ownership expiration intervals when you create the `EventProcessorClient` via the `EventProcessorClientBuilder`, as described in the following list:

- The [loadBalancingUpdateInterval(Duration)](/java/api/com.azure.messaging.eventhubs.eventprocessorclientbuilder#com-azure-messaging-eventhubs-eventprocessorclientbuilder-loadbalancingupdateinterval(java-time-duration)) method indicates how often the load balancing cycle runs.
- The [partitionOwnershipExpirationInterval(Duration)](/java/api/com.azure.messaging.eventhubs.eventprocessorclientbuilder#com-azure-messaging-eventhubs-eventprocessorclientbuilder-partitionownershipexpirationinterval(java-time-duration)) method indicates the minimum amount of time since the ownership record has been updated, before the processor considers a partition unowned.

For example, if an ownership record was updated at 9:30am and `partitionOwnershipExpirationInterval` is 2 mins. When a load balance cycle occurs and it notices that the ownership record has not been updated in the last 2 min or by 9:32am, it will consider the partition unowned.

If an error occurs in one of the partition consumers, it will close the corresponding consumer but will not try to reclaim it until the next load balancing cycle.

## "...current receiver '&lt;RECEIVER_NAME&gt;' with epoch '0' is getting disconnected"

The entire error message looks similar to the following output:

```output
New receiver 'nil' with higher epoch of '0' is created hence current receiver 'nil' with epoch '0'
is getting disconnected. If you are recreating the receiver, make sure a higher epoch is used.
TrackingId:&lt;GUID&gt;, SystemTracker:&lt;NAMESPACE&gt;:eventhub:&lt;EVENT_HUB_NAME&gt;|&lt;CONSUMER_GROUP&gt;,
Timestamp:2022-01-01T12:00:00}"}
```

This error is expected when load balancing occurs after `EventProcessorClient` instances are added or removed. Load balancing is an ongoing process. When you use the `BlobCheckpointStore` with your consumer, every ~30 seconds (by default), the consumer checks to see which consumers have a claim for each partition, then runs some logic to determine whether it needs to 'steal' a partition from another consumer. The service mechanism used to assert exclusive ownership over a partition is known as the [Epoch](/azure/event-hubs/event-hubs-event-processor-host#epoch).

However, if no instances are being added or removed, there's an underlying issue that should be addressed. For more information, see the [Partition ownership changes frequently](#partition-ownership-changes-frequently) section and [Filing GitHub issues](https://github.com/Azure/azure-sdk-for-java/issues/new/choose).

## High CPU usage

High CPU usage is usually because an instance owns too many partitions. We recommend no more than three partitions for every CPU core. It's better to start with 1.5 partitions for each CPU core and then test by increasing the number of partitions owned.

## Out of memory and choosing the heap size

The out of memory (OOM) problem can happen if the current max heap for the JVM is insufficient to run the application. You may want to measure the application's heap requirement. Then, based on the result, size the heap by setting the appropriate max heap memory using the `-Xmx` JVM option.

You shouldn't specify `-Xmx` as a value larger than the memory available or limit set for the host (the VM or container) - for example, the memory requested in the container's configuration. You should allocate enough memory for the host to support the Java heap.

The following steps describe a typical way to measure the value for max Java Heap:

1. Run the application in an environment close to production, where the application sends, receives, and processes events under the peak load expected in production.

1. Wait for the application to reach a steady state. At this stage, the application and JVM would have loaded all domain objects, class types, static instances, object pools (TCP, DB connection pools), etc.

   Under the steady state, you see the stable sawtooth-shaped pattern for the heap collection, as shown in the following screenshot:

   :::image type="content" source="media/troubleshooting-messaging-event-hubs-processor/healthy-heap-pattern.png" alt-text="Screenshot of the heap memory collection showing the stable sawtooth pattern." lightbox="media/troubleshooting-messaging-event-hubs-processor/healthy-heap-pattern.png":::

1. After the application reaches the steady state, force a full garbage collection (GC) using tools like JConsole. Observe the memory occupied after the full GC. You want to size the heap such that only 30% is occupied after the full GC. You can use this value to set the max heap size (using `-Xmx`).

If you're on the container, then size the container to have an extra ~1 GB of memory for the non-heap need for the JVM instance.

## Processor client stops receiving

The processor client often continually runs in a host application for days on end. Sometimes, it notices that `EventProcessorClient` isn't processing one or more partitions. Usually, there isn't enough information to determine why the exception occurred. The `EventProcessorClient` stopping is the symptom of an underlying cause (that is, the race condition) that occurred while trying to recover from a transient error. For the information we require, see [Filing GitHub issues](https://github.com/Azure/azure-sdk-for-java/issues/new/choose).

## Duplicate EventData received when processor is restarted

The `EventProcessorClient` and Event Hubs service guarantees an *at-least-once* delivery. You can add metadata to discern duplicate events. For more information, see [Does Azure Event Hubs guarantee an at-least once delivery?](https://stackoverflow.com/questions/33220685/does-azure-event-hub-guarantees-at-least-once-delivery/33577018#33577018) on Stack Overflow. If you require *only-once* delivery, you should consider Service Bus, which waits for an acknowledgment from the client. For a comparison of the messaging services, see [Choosing between Azure messaging services](/azure/event-grid/compare-messaging-services).

## Low-level consumer client stops receiving

`EventHubConsumerAsyncClient` is a low-level consumer client provided by the Event Hubs library, designed for advanced users who require greater control and flexibility over their Reactive applications. This client offers a low-level interface, enabling users to manage backpressure, threading, and recovery within the Reactor chain. Unlike `EventProcessorClient`, `EventHubConsumerAsyncClient` doesn't include automatic recovery mechanisms for all terminal causes. Therefore, users must handle terminal events and select appropriate Reactor operators to implement recovery strategies.

The `EventHubConsumerAsyncClient::receiveFromPartition` method emits a terminal error when the connection encounters a non-retriable error or when a series of connection recovery attempts fail consecutively, exhausting the maximum retry limit. Although the low-level receiver attempts to recover from transient errors, users of the consumer client are expected to handle terminal events. If continuous event reception is desired, the application should adjust the Reactor chain to create a new consumer client on a terminal event.

## Migrate from legacy to new client library

The [migration guide](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/eventhubs/azure-messaging-eventhubs/migration-guide.md) includes steps on migrating from the legacy client and migrating legacy checkpoints.

## Next steps

If the troubleshooting guidance in this article doesn't help to resolve issues when you use the Azure SDK for Java client libraries, we recommended that you [file an issue](https://github.com/Azure/azure-sdk-for-java/issues/new/choose) in the [Azure SDK for Java GitHub repository](https://github.com/Azure/azure-sdk-for-java).
