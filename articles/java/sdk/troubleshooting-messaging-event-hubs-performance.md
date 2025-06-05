---
title: Troubleshoot Azure Event Hubs performance
titleSuffix: Azure SDK for Java
description: Helps you troubleshoot Events Hubs performance issues when you use the Azure SDK for Java.
ms.date: 04/02/2025 
ms.topic: troubleshooting-general
ms.custom: devx-track-java, devx-track-extended-java
author: KarlErickson
ms.author: karler
ms.reviewer: jogiles
---

# Troubleshoot Azure Event Hubs performance

This article provides solutions to common performance problems that you might encounter when you use the Event Hubs library in the Azure SDK for Java. If you're looking for solutions to other common problems that you might encounter when you use Event Hubs, see [Troubleshooting Azure Event Hubs](troubleshooting-messaging-event-hubs-overview.md).

## Use processEvent or processEventBatch

When you use the `processEvent` callback, each `EventData` instance received calls your code. This process works well with low or moderate traffic in the event hub.

If the event hub has high traffic and high throughput is expected, the aggregated cost of continuously calling your callback hinders performance of `EventProcessorClient`. In this case, you should use `processEventBatch`.

For each partition, your callback is invoked one at a time. High processing time in the callback hinders performance because the `EventProcessorClient` doesn't continue to push more events downstream nor request more `EventData` instances from the Event Hubs service.

## Costs of checkpointing

When you use Azure Blob Storage as the checkpoint store, there's a network cost to checkpointing because it makes an HTTP request and waits for a response. This process could take up to several seconds due to network latency, the performance of Azure Blob Storage, resource location, and so on.

Checkpointing after every `EventData` instance is processed hinders performance due to the cost of making these HTTP requests. You shouldn't checkpoint if your callback processed no events, or you should checkpoint after processing some number of events.

## Use LoadBalancingStrategy.BALANCED or LoadBalancingStrategy.GREEDY

When you use `LoadBalancingStrategy.BALANCED`, the `EventProcessorClient` claims one partition for every load balancing cycle. If there are 32 partitions in an event hub, it takes 32 load-balancing iterations to claim all the partitions. If users know a set number of `EventProcessorClient` instances are running, they can use `LoadBalancingStrategy.GREEDY` to claim their share of the partitions in one load-balancing cycle.

For more information about each strategy, see [LoadBalancingStrategy.java](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/eventhubs/azure-messaging-eventhubs/src/main/java/com/azure/messaging/eventhubs/LoadBalancingStrategy.java) in the [azure-sdk-for-java repository](https://github.com/Azure/azure-sdk-for-java).

## Configure prefetchCount

The default prefetch value is 500. When the AMQP receive link is opened, it places 500 credits on the link. Assuming that each `EventData` instance is one link credit, `EventProcessorClient` prefetches 500 `EventData` instances. When all the events are consumed, the processor client adds 500 credits to the link to receive more messages. This flow repeats while the `EventProcessorClient` still has ownership of a partition.

Configuring `prefetchCount` may have performance implications if the number is too low. Each time the AMQP receive link places credits, the remote service sends an ACK. For high throughput scenarios, the overhead of making thousands of client requests and service ACKs may hinder performance.

Configuring `prefetchCount` may have performance implications if the number is too high. When *x* credits are placed on the line, the Event Hubs service knows that it can send at most *x* messages. When each `EventData` instance is received, it's placed in an in-memory queue, waiting to be processed. A high number of `EventData` instances in the queue can result in very high memory usage.

## Next steps

If the troubleshooting guidance in this article doesn't help to resolve issues when you use the Azure SDK for Java client libraries, we recommended that you [file an issue](https://github.com/Azure/azure-sdk-for-java/issues/new/choose) in the [Azure SDK for Java GitHub repository](https://github.com/Azure/azure-sdk-for-java).
