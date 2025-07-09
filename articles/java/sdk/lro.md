---
title: Long-running operations in the Azure SDK for Java
description: Provides an overview of the Azure SDK for Java concepts related to long-running operations.
ms.date: 04/02/2025
ms.topic: how-to
ms.custom: devx-track-java, devx-track-extended-java
author: KarlErickson
ms.author: karler
ms.reviewer: anuchan
---

# Long-running operations in the Azure SDK for Java

This article provides an overview of using long-running operations with the Azure SDK for Java.

Certain operations on Azure may take extended amounts of time to complete. These operations are outside the standard HTTP style of quick request / response flow. For example, copying data from a source URL to a Storage blob, or training a model to recognize forms, are operations that may take a few seconds to several minutes. Such operations are referred to as Long-Running Operations, and are often abbreviated as 'LRO'. An LRO may take seconds, minutes, hours, days, or longer to complete, depending on the operation requested and the process that must be performed on the server side.

In the Java client libraries for Azure, a convention exists that all long-running operations begin with the `begin` prefix. This prefix indicates that this operation is long-running, and that the means of interaction with this operation is slightly different that the usual request / response flow. Along with the `begin` prefix, the return type from the operation is also different than usual, to enable the full range of long-running operation functionality. As with most things in the Azure SDK for Java, there are both synchronous and asynchronous APIs for long-running operations:

* In synchronous clients, long-running operations will return a `SyncPoller` instance.
* In asynchronous clients, long-running operations will return a `PollerFlux` instance.

Both `SyncPoller` and `PollerFlux` are the client-side abstractions intended to simplify the interaction with long-running server-side operations. The rest of this article outlines best practices when working with these types.

## Synchronous long-running operations

Calling any API that returns a `SyncPoller` will immediately start the long-running operation. The API will return the `SyncPoller` immediately, letting you monitor the progress of the long-running operation and retrieve the final result. The following example shows how to monitor the progress of a long-running operation using the `SyncPoller`.

```java
SyncPoller<UploadBlobProgress, UploadedBlobProperties> poller = syncClient.beginUploadFromUri(<URI to upload from>)
PollResponse<UploadBlobProgress> response;

do {
    response = poller.poll();
    System.out.println("Status of long running upload operation: " + response.getStatus());
    Duration pollInterval = response.getRetryAfter();
    TimeUnit.MILLISECONDS.sleep(pollInterval.toMillis());
} while (!response.getStatus().isComplete());
```

This example uses the `poll()` method on the `SyncPoller` to retrieve information on progress of the long-running operation. This code prints the status to the console, but a better implementation would make relevant decisions based on this status.

The `getRetryAfter()` method returns information about how long to wait before the next poll. Most Azure long-running operations return the poll delay as part of their HTTP response (that is, the commonly used `retry-after` header). If the response doesn't contain the poll delay, then the `getRetryAfter()` method returns the duration given at the time of invoking the long-running operation.

The example above uses a `do..while` loop to repeatedly poll until the long-running operation is complete. If you aren't interested in these intermediate results, you can instead call `waitForCompletion()`. This call will block the current thread until the long-running operation completes and returns the last poll response:

```java
PollResponse<UploadBlobProgress> response = poller.waitForCompletion();
```

If the last poll response indicates that the long-running operation has completed successfully, you can retrieve the final result using `getFinalResult()`:

```java
if (LongRunningOperationStatus.SUCCESSFULLY_COMPLETED == response.getStatus()) {
    UploadedBlobProperties result = poller.getFinalResult();
}
```

Other useful APIs in `SyncPoller` include:

1. `waitForCompletion(Duration)`: wait for the long-running operation to complete, for the given timeout duration.
1. `waitUntil(LongRunningOperationStatus)`: wait until the given long-running operation status is received.
1. `waitUntil(LongRunningOperationStatus, Duration)`: wait until the given long-running operation status is received, or until the given timeout duration expires.

## Asynchronous long-running operations

The example below shows how the `PollerFlux` lets you observe a long-running operation. In async APIs, the network calls happen in a different thread than the main thread that calls `subscribe()`. What this means is that the main thread may terminate before the result is available. It's up to you to ensure that the application doesn't exit before the async operation has had time to complete.

The async API returns a `PollerFlux` immediately, but the long-running operation itself won't start until you subscribe to the `PollerFlux`. This process is how all `Flux`-based APIs operate. The following example shows an async long-running operation:

```java
asyncClient.beginUploadFromUri(...)
    .subscribe(response -> System.out.println("Status of long running upload operation: " + response.getStatus()));
```

In the following example, you'll get intermittent status updates on the long-running operation. You can use these updates to determine whether the long-running operation is still operating in the expected fashion. This example prints the status to the console, but a better implementation would make relevant error handling decisions based on this status.

If you aren't interested in the intermediate status updates and just want to get notified of the final result when it arrives, you can use code similar to the following example:

```java
asyncClient.beginUploadFromUri(...)
    .last()
    .flatMap(response -> {
        if (LongRunningOperationStatus.SUCCESSFULLY_COMPLETED == response.getStatus()) {
            return response.getFinalResult();
        }
        return Mono.error(new IllegalStateException("Polling completed unsuccessfully with status: "+ response.getStatus()));
    })
    .subscribe(
        finalResult -> processFormPages(finalResult),
        ex -> countDownLatch.countDown(),
        () -> countDownLatch.countDown());
```

In this code, you retrieve the final result of the long-running operation by calling `last()`. This call tells the `PollerFlux` that you want to wait for all the polling to complete, at which point the long-running operation has reached a terminal state, and you can inspect its status to determine the outcome. If the poller indicates that the long-running operation has completed successfully, you can retrieve the final result and pass it on to the consumer in the subscribe call.

## Next steps

Now that you're familiar with the long-running APIs in the Azure SDK for Java, see [Configure proxies in the Azure SDK for Java](proxying.md) to learn how to customize the HTTP client further.
