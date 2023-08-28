---
title: Troubleshooting Event Hubs Performance
description: A troubleshooting guide for Events Hubs performance issues when using the Azure SDK for Java
ms.date: 08/16/2023
ms.topic: conceptual
ms.custom: devx-track-java, devx-track-extended-java
author: KarlErickson
ms.author: jogiles
---

# Troubleshooting Event Hubs performance

This troubleshooting guide provides solutions to common performance problems that you might encounter when using the Event Hubs library in the Azure SDK for Java. If you are looking for solutions to common problems that you might encounter when using the Event Hubs, see [Troubleshooting Azure SDK for Java messaging issues](troubleshooting-messaging-event-hubs-overview.md).

## Using processEvent or processEventBatch

When using the `processEvent` callback, each `EventData` received calls the users' code. This works well with low or moderate traffic in the Event Hub.

If the Event Hub has high traffic and high throughput is expected, the aggregated cost of continuously calling the users' callback hinders performance of `EventProcessorClient`. In this case, users should use `processEventBatch`.

For each partition, the users' callback is invoked one at a time, so high processing time in the callback hinders performance as the `EventProcessorClient` does not continue to push more events downstream nor request more `EventData` from Event Hubs service.

## Costs of checkpointing

When using Azure Blob Storage as the checkpoint store, there is a network cost to checkpointing as it makes an HTTP request and waits for a response. This process could take up to several seconds due to network latency, the performance of Azure Blob Storage, resource location, etc.

Checkpointing after _every_ `EventData` is processed hinders performance due to the cost of making these HTTP requests. Users should not checkpoint if their callback processed no events or checkpoint after processing some number of events.

## Using LoadBalancingStrategy.BALANCED or LoadBalancingStrategy.GREEDY

When using `LoadBalancingStrategy.BALANCED`, the `EventProcessorClient` claims one partition for every load balancing cycle. If there are 32 partitions in an Event Hub, it takes 32 load-balancing iterations to claim all the partitions. If users know a set number of `EventProcessorClient` instances are running, they can use `LoadBalancingStrategy.GREEDY` to claim their share of the partitions in one load-balancing cycle.

[LoadBalancingStrategy javadocs](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/eventhubs/azure-messaging-eventhubs/src/main/java/com/azure/messaging/eventhubs/LoadBalancingStrategy.java) contains additional information about each strategy.

## Configuring prefetchCount

The default prefetch value is 500. When the AMQP receive link is opened, it places 500 credits on the link. Assuming that each `EventData` is one link credit, `EventProcessorClient` prefetches 500 `EventData`. When _all_ the events are consumed, the processor client adds 500 credits to the link to receive more messages. This flow repeats while the `EventProcessorClient` still has ownership of a partition.

Configuring `prefetchCount` may have performance implications if the number is _low_. Each time the AMQP receive link places credits, the remote service sends an ACK. For high throughput scenarios, the overhead of making thousands of client requests and service ACKs may hinder performance.

Configuring `prefetchCount` may have performance implications if the number is _very high_. When _x_ credits are placed on the line, the Event Hubs service knows that it can send at most _x_ messages. When each `EventData` is received, they are placed in an in-memory queue, waiting to be processed. The high number of `EventData` in the queue can result in very high memory usage.

## Next steps

If the troubleshooting guidance in this article doesn't help to resolve issues when using the Azure SDK for Java client libraries, we recommended that you reach out to the development team by [filing an issue](https://github.com/Azure/azure-sdk-for-java/issues/new/choose) in the [Azure SDK for Java GitHub repository](https://github.com/Azure/azure-sdk-for-java).
