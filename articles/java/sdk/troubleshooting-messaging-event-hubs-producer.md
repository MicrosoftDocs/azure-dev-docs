---
title: Troubleshoot Azure Event Hubs Producer
titleSuffix: Azure SDK for Java
description: Helps you troubleshoot Events Hubs producer issues when you use the Azure SDK for Java.
ms.date: 04/02/2025 
ms.topic: troubleshooting-general
ms.custom: devx-track-java, devx-track-extended-java
author: bmitchell287
ms.author: brendm
ms.reviewer: jogiles
---

# Troubleshoot Azure Event Hubs producer

Use this article to troubleshoot Azure Event Hubs producer issues when you use the `EventHubsProducerClient` and `EventHubsProducerAsyncClient` types. For broader Event Hubs troubleshooting, see [Troubleshoot Azure Event Hubs](troubleshooting-messaging-event-hubs-overview.md).

## Can't set multiple partition keys for events in EventDataBatch

When the Event Hubs service publishes messages, it supports a single partition key for each `EventDataBatch`. Consider using the buffered producer client `EventHubBufferedProducerClient` if you want that capability. Otherwise, you need to manage your batches.

## Setting partition key on EventData isn't set in Kafka consumer

The partition key of the Event Hubs event is available in the Kafka record headers. The protocol-specific key is `x-opt-partition-key` in the header.

By design, Event Hubs doesn't promote the Kafka message key to be the Event Hubs partition key nor the reverse. With the same value, the Kafka client and the Event Hubs client likely send the message to two different partitions. It might cause some confusion if you set the value in the cross-protocol communication case. Exposing the properties with a protocol specific key to the other protocol client is good enough.

## Next steps

If the troubleshooting guidance in this article doesn't help resolve issues when you use the Azure SDK for Java client libraries, [file an issue](https://github.com/Azure/azure-sdk-for-java/issues/new/choose) in the [Azure SDK for Java GitHub repository](https://github.com/Azure/azure-sdk-for-java).
