---
title: Troubleshoot Azure Event Hubs producer
titleSuffix: Azure SDK for Java
description: Helps you troubleshoot Events Hubs producer issues when you use the Azure SDK for Java.
ms.date: 04/02/2025 
ms.topic: troubleshooting-general
ms.custom: devx-track-java, devx-track-extended-java
author: KarlErickson
ms.author: karler
ms.reviewer: jogiles
---

# Troubleshoot Azure Event Hubs producer

This article provides solutions to common problems that you might encounter when you use the `EventHubsProducerClient` and `EventHubsProducerAsyncClient` types. If you're looking for solutions to other common problems that you might encounter when you use Event Hubs, see [Troubleshoot Azure Event Hubs](troubleshooting-messaging-event-hubs-overview.md).

## Can't set multiple partition keys for events in EventDataBatch

When the Event Hubs service publishes messages, it supports a single partition key for each `EventDataBatch`. You should consider using the buffered producer client `EventHubBufferedProducerClient` if you want that capability. Otherwise, you have to manage your batches.

## Setting partition key on EventData isn't set in Kafka consumer

The partition key of the Event Hubs event is available in the Kafka record headers. The protocol-specific key is `x-opt-partition-key` in the header.

By design, Event Hubs doesn't promote the Kafka message key to be the Event Hubs partition key nor the reverse because with the same value, the Kafka client and the Event Hubs client likely send the message to two different partitions. It might cause some confusion if we set the value in the cross-protocol communication case. Exposing the properties with a protocol specific key to the other protocol client should be good enough.

## Next steps

If the troubleshooting guidance in this article doesn't help to resolve issues when you use the Azure SDK for Java client libraries, we recommended that you [file an issue](https://github.com/Azure/azure-sdk-for-java/issues/new/choose) in the [Azure SDK for Java GitHub repository](https://github.com/Azure/azure-sdk-for-java).
