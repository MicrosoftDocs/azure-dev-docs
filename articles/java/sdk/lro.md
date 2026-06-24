---
title: Use Long-Running Operations in the Azure SDK for Java
description: Learn how to monitor and complete long-running operations in the Azure SDK for Java with SyncPoller and PollerFlux, and apply best practices now.
ms.date: 04/02/2025
ms.topic: how-to
ms.custom: devx-track-java, devx-track-extended-java
author: bmitchell287
ms.author: brendm
ms.reviewer: anuchan
---

# Long-running operations in the Azure SDK for Java

This article explains long-running operations in the Azure SDK for Java and shows how to track progress and retrieve final results with less manual polling logic.

Certain operations on Azure take extended amounts of time to complete. These operations don't follow the standard HTTP style of quick request and response flow. For example, copying data from a source URL to a Storage blob, or training a model to recognize forms, are operations that might take a few seconds to several minutes. These operations are long-running operations, often abbreviated as LRO. An LRO might take seconds, minutes, hours, days, or longer to complete, depending on the operation requested and the process that the server must perform.

In the Java client libraries for Azure, all long-running operations start with the `begin` prefix. This prefix indicates that the operation is long-running, and that the means of interaction with this operation is slightly different from the usual request and response flow. Along with the `begin` prefix, the return type from the operation is also different than usual, to enable the full range of long-running operation functionality. As with most things in the Azure SDK for Java, long-running operations have both synchronous and asynchronous APIs:

* In synchronous clients, long-running operations return a `SyncPoller` instance.
* In asynchronous clients, long-running operations return a `PollerFlux` instance.

Both `SyncPoller` and `PollerFlux` are client-side abstractions that simplify interaction with long-running server-side operations. The rest of this article outlines best practices when working with these types.

## Synchronous long-running operations

When you call an API that returns a `SyncPoller`, the long-running operation starts right away. The API returns the `SyncPoller` immediately, so you can monitor the progress of the long-running operation and get the final result. The following example shows how to monitor the progress of a long-running operation by using the `SyncPoller`.

```java
SyncPoller<UploadBlobProgress, UploadedBlobProperties> poller = syncClient.beginUploadFromUri(<URI to upload from>);
PollResponse<UploadBlobProgress> response;

do {
    response = poller.poll();
    System.out.println("Status of long running upload operation: " + response.getStatus());
    Duration pollInterval = response.getRetryAfter();
    TimeUnit.MILLISECONDS.sleep(pollInterval.toMillis());
} while (!response.getStatus().isComplete());
```

This example uses the `poll()` method on the `SyncPoller` to get information about the progress of the long-running operation. This code prints the status to the console, but a better implementation makes relevant decisions based on this status.

The `getRetryAfter()` method returns information about how long to wait before the next poll. Most Azure long-running operations return the poll delay as part of their HTTP response (that is, the commonly used `retry-after` header). If the response doesn't contain the poll delay, the `getRetryAfter()` method returns the duration given when invoking the long-running operation.

The preceding example uses a `do..while` loop to repeatedly poll until the long-running operation finishes. If you aren't interested in these intermediate results, you can instead call `waitForCompletion()`. This call blocks the current thread until the long-running operation finishes and returns the last poll response:

```java
PollResponse<UploadBlobProgress> response = poller.waitForCompletion();
```

If the last poll response indicates that the long-running operation finishes successfully, you can get the final result by using `getFinalResult()`:

```java
if (LongRunningOperationStatus.SUCCESSFULLY_COMPLETED == response.getStatus()) {
    UploadedBlobProperties result = poller.getFinalResult();
}
```

Other useful APIs in `SyncPoller` include:

* `waitForCompletion(Duration)`: wait for the long-running operation to finish, for the given timeout duration.
* `waitUntil(LongRunningOperationStatus)`: wait until the given long-running operation status is received.
* `waitUntil(LongRunningOperationStatus, Duration)`: wait until the given long-running operation status is received, or until the given timeout duration expires.

## Asynchronous long-running operations

The following example shows how `PollerFlux` lets you observe a long-running operation. In async APIs, network calls happen in a different thread than the main thread that calls `subscribe()`. This architecture means that the main thread might terminate before the result is available. You need to ensure that the application doesn't exit before the async operation finishes.

The async API returns a `PollerFlux` immediately, but the long-running operation itself doesn't start until you subscribe to the `PollerFlux`. This process is how all `Flux`-based APIs operate. The following example shows an async long-running operation:

```java
asyncClient.beginUploadFromUri(...)
    .subscribe(response -> System.out.println("Status of long running upload operation: " + response.getStatus()));
```

In the following example, you get intermittent status updates on the long-running operation. You can use these updates to determine whether the long-running operation is still operating in the expected fashion. This example prints the status to the console, but a better implementation would make relevant error handling decisions based on this status.

If you're not interested in the intermediate status updates and just want to get notified of the final result when it arrives, use code similar to the following example:

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

In this code, you retrieve the final result of the long-running operation by calling `last()`. This call tells the `PollerFlux` that you want to wait for all the polling to complete. At this point, the long-running operation reaches a terminal state, and you can inspect its status to determine the outcome. If the poller indicates that the long-running operation completed successfully, you can retrieve the final result and pass it on to the consumer in the subscribe call.

## Next steps

Now that you're familiar with the long-running APIs in the Azure SDK for Java, see [Configure proxies in the Azure SDK for Java](proxying.md) to learn how to customize the HTTP client further.
