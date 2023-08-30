---
title: Troubleshooting Event Processor
description: A troubleshooting guide for Event Hubs EventProcessor issues when using the Azure SDK for Java
ms.date: 08/16/2023
ms.topic: conceptual
ms.custom: devx-track-java, devx-track-extended-java
author: KarlErickson
ms.author: jogiles
---

# Troubleshooting Event Processor

This troubleshooting guide provides solutions to common problems that you might encounter when using the `EventProcessorClient` type. If you are looking for solutions to common problems that you might encounter when using the Event Hubs, see [Troubleshooting Azure SDK for Java messaging issues](troubleshooting-messaging-event-hubs-overview.md).

## 412 precondition failures when using an event processor

412 precondition errors occur when the client tries to take or renew ownership of a partition, but the local version of the ownership record is outdated. This occurs when another processor instance steals partition ownership. See [Partition ownership changes frequently](#partition-ownership-changes-frequently) for more information.

## Partition ownership changes frequently

When the number of EventProcessorClient instances changes (i.e. added or removed), the running instances try to load-balance partitions between themselves. For a few minutes after the number of processors changes, partitions are expected to change owners. After it's balanced, partition ownership should be stable and change infrequently. If partition ownership is changing frequently when the number of processors is constant, this likely indicates a problem. It is recommended that a GitHub issue with logs and a repro be filed in this case.

## "...current receiver '&lt;RECEIVER_NAME&gt;' with epoch '0' is getting disconnected"

The entire error message looks similar to the following output:

```output
New receiver 'nil' with higher epoch of '0' is created hence current receiver 'nil' with epoch '0'
is getting disconnected. If you are recreating the receiver, make sure a higher epoch is used.
TrackingId:&lt;GUID&gt;, SystemTracker:&lt;NAMESPACE&gt;:eventhub:&lt;EVENT_HUB_NAME&gt;|&lt;CONSUMER_GROUP&gt;,
Timestamp:2022-01-01T12:00:00}"}
```

This error is expected when load balancing occurs after `EventProcessorClient` instances are added or removed. Load balancing is an ongoing process. When using the `BlobCheckpointStore` with your consumer, every ~30 seconds (by default), the consumer checks to see which consumers have a claim for each partition, then runs some logic to determine whether it needs to 'steal' a partition from another consumer. The service mechanism used to assert exclusive ownership over a partition is known as the [Epoch](/azure/event-hubs/event-hubs-event-processor-host#epoch).

However, if no instances are being added or removed, there is an underlying issue that should be addressed. See [Partition ownership changes frequently](#partition-ownership-changes-frequently) for additional information and [Filing GitHub issues](https://github.com/Azure/azure-sdk-for-java/issues/new/choose).

## High CPU usage

High CPU usage is usually because an instance owns too many partitions. We recommend no more than three partitions for every 1 CPU core; better to start with 1.5 partitions for each CPU core and test increasing the number of partitions owned.

## Out of memory and choosing the heap size

The Out of memory (OOM) can happen if the current max heap for the JVM is insufficient to run the application. You may want to measure the application's heap requirement, then, based on the result, size the heap by setting the appropriate max heap memory (-Xmx JVM option).

Note that you should not specify -Xmx as a value larger than the memory available or limit set for the host (VM, container), e.g., the memory requested in the container's configuration. You should allocate enough memory for the host to support the Java heap.

A typical way to measure the value for max Java Heap is -

Run the application in an environment close to production, where the application sends, receives, and processes events under the peak load expected in production.

Wait for the application to reach a steady state. At this stage, the application and JVM would have loaded all domain objects, class types, static instances, object pools (TCP, DB connection pools), etc.

Under the steady state you see the stable sawtooth-shaped pattern for the heap collection, as shown in the following screenshot:

:::image type="content" source="media/troubleshooting-messaging-event-hubs-processor/healthy-heap-pattern.png" alt-text="Screenshot of the heap memory collection showing the stable sawtooth pattern." lightbox="media/troubleshooting-messaging-event-hubs-processor/healthy-heap-pattern.png":::

After the application reaches the steady state, force a full GC using tools like JConsole. Observe the memory occupied after the full GC. You want to size the heap such that only 30% is occupied after the full GC. You can use this value to set the max heap size (-Xmx).

If you're on the container, then size the container to have an "additional ~1 GB" of memory for the "non-heap" need for the JVM instance.

## Processor client stops receiving

The processor client often is continually running in a host application for days on end. Sometimes, they notice that EventProcessorClient isn't processing one or more partitions. Usually, this isn't enough information to determine why the exception occurred. The EventProcessorClient stopping is the symptom of an underlying cause (i.e. race condition) that occurred while trying to recover from a transient error. For the information we require, see [Filing Github issues](https://github.com/Azure/azure-sdk-for-java/issues/new/choose).

## Duplicate EventData received when processor is restarted

The `EventProcessorClient` and Event Hub service guarantees an "at least once" delivery. Customers can add metadata to discern duplicate events. The answer to [Does Azure Event Hub guarantee an at-least once delivery?](https://stackoverflow.com/questions/33220685/does-azure-event-hub-guarantees-at-least-once-delivery/33577018#33577018) provides additional information. If customers require only-once delivery, they may consider Service Bus, which waits for an acknowledgement from the client. A comparison of the messaging services is documented in [Choosing between Azure messaging services](/azure/event-grid/compare-messaging-services).

## Migrate from legacy to new client library

The [migration guide](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/eventhubs/azure-messaging-eventhubs/migration-guide.md) includes steps on migrating from the legacy client and migrating legacy checkpoints.

## Next steps

If the troubleshooting guidance in this article doesn't help to resolve issues when using the Azure SDK for Java client libraries, we recommended that you reach out to the development team by [filing an issue](https://github.com/Azure/azure-sdk-for-java/issues/new/choose) in the [Azure SDK for Java GitHub repository](https://github.com/Azure/azure-sdk-for-java).
