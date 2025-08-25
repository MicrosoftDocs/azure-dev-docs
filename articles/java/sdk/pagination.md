---
title: Pagination and iteration in the Azure SDK for Java
description: Provides an overview of the Azure SDK for Java concepts related to pagination and iteration.
ms.date: 04/02/2025
ms.topic: article
ms.custom: devx-track-java, devx-track-extended-java
author: KarlErickson
ms.author: karler
ms.reviewer: anuchan
---

# Pagination and iteration in the Azure SDK for Java

This article provides an overview of how to use the Azure SDK for Java pagination and iteration functionality to work efficiently and productively with large data sets.

Many operations provided by the client libraries within the Azure Java SDK return more than one result. The Azure Java SDK defines a set of acceptable return types in these cases to ensure that developer experience is maximized through consistency. The return types used are `PagedIterable` for sync APIs and `PagedFlux` for async APIs. The APIs differ slightly on account of their different use cases, but conceptually they have the same requirements:

- Make it possible to easily iterate over each element in the collection individually, ignoring any need for manual pagination or tracking of continuation tokens. Both `PagedIterable` and `PagedFlux` make this task easy by iterating over a paginated response deserialized into a given type `T`. `PagedIterable` implements the `Iterable` interface, and offers an API to receive a `Stream`, while `PagedFlux` provides a `Flux`. In all cases, the act of pagination is transparent, and iteration continues while there are still results iterate over.

- Make it possible to iterate explicitly page-by-page. Doing so lets you understand more clearly when requests are made, and lets you access per-page response information. Both `PagedIterable` and `PagedFlux` have methods that will return appropriate types to iterate by page, rather than by individual element.

This article is split between the Java Azure SDK synchronous and asynchronous APIs. You'll see the synchronous iteration APIs when you work with synchronous clients, and asynchronous iteration APIs when you work with asynchronous clients.

## Synchronous pagination and iteration

This section covers the synchronous APIs.

### Iterate over individual elements

As noted, the most common use case is to iterate over each element individually, rather than per page. The following code examples show how the `PagedIterable` API lets you use the iteration style you prefer to implement this functionality.

#### Use a for-each loop

Because `PagedIterable` implements `Iterable`, you can iterate through the elements as shown in the following example:

```java
PagedIterable<Secret> secrets = client.listSecrets();
for (Secret secret : secrets) {
   System.out.println("Secret is: " + secret);
}
```

#### Use Stream

Because `PagedIterable` has a `stream()` method defined on it, you can call it to use the standard Java Stream APIs, as shown in the following example:

```java
client.listSecrets()
      .stream()
      .forEach(secret -> System.out.println("Secret is: " + secret));
```

#### Use Iterator

Because `PagedIterable` implements `Iterable`, it also has an `iterator()` method to allow for the Java iterator programming style, as show in the following example:

```java
Iterator<Secret> secrets = client.listSecrets().iterator();
while (it.hasNext()) {
   System.out.println("Secret is: " + it.next());
}
```

### Iterate over pages

When you work with individual pages, you can iterate per page, for example when you need HTTP response information, or when continuation tokens are important to retain iteration history. Regardless of whether you iterate by page or by each item, there's no difference in performance or the number of calls made to the service. The underlying implementation loads the next page on demand, and if you unsubscribe from the `PagedFlux` at any time, there are no further calls to the service.

#### Use a for-each loop

When you call `listSecrets()`, you get a `PagedIterable`, which has an `iterableByPage()` API. This API produces an `Iterable<PagedResponse<Secret>>` instead of an `Iterable<Secret>`. The `PagedResponse` provides the response metadata and access to the continuation token, as shown in the following example:

```java
Iterable<PagedResponse<Secret>> secretPages = client.listSecrets().iterableByPage();
for (PagedResponse<Secret> page : secretPages) {
   System.out.println("Response code: " + page.getStatusCode());
   System.out.println("Continuation Token: " + page.getContinuationToken());
   page.getElements().forEach(secret -> System.out.println("Secret value: " + secret))
}
```

There's also an `iterableByPage` overload that accepts a continuation token. You can call this overload when you want to return to the same point of iteration at a later time.

#### Use Stream

The following example shows how the `streamByPage()` method performs the same operation as shown above. This API also has a continuation token overload for returning to the same point of iteration at a later time.

```java
client.listSecrets()
      .streamByPage()
      .forEach(page -> {
          System.out.println("Response code: " + page.getStatusCode());
          System.out.println("Continuation Token: " + page.getContinuationToken());
          page.getElements().forEach(secret -> System.out.println("Secret value: " + secret))
      });
```

## Asynchronously observe pages and individual elements

This section covers the asynchronous APIs. In async APIs, the network calls happen in a different thread than the main thread that calls `subscribe()`. What this means is that the main thread may terminate before the result is available. It's up to you to ensure that the application doesn't exit before the async operation has had time to complete.

### Observe individual elements

The following example shows how the `PagedFlux` API lets you observe individual elements asynchronously. There are various ways to subscribe to a Flux type. For more information, see [Simple Ways to Create a Flux or Mono and Subscribe to It](https://projectreactor.io/docs/core/release/reference/#_simple_ways_to_create_a_flux_or_mono_and_subscribe_to_it) in the [Reactor 3 Reference Guide](https://projectreactor.io/docs/core/release/reference). This example is one variety where there are three lambda expressions, one each for the consumer, the error consumer, and the complete consumer. Having all three is good practice, but in some cases it's only necessary to have the consumer, and possibly the error consumer.

 ```java
asyncClient.listSecrets()
    .subscribe(secret -> System.out.println("Secret value: " + secret),
        ex -> System.out.println("Error listing secrets: " + ex.getMessage()),
        () -> System.out.println("Successfully listed all secrets"));
 ```

### Observe pages

 The following example shows how the `PagedFlux` API lets you observe each page asynchronously, again by using a `byPage()` API and by providing a consumer, error consumer, and a completion consumer.

  ```java
asyncClient.listSecrets().byPage()
    .subscribe(page -> {
            System.out.println("Response code: " + page.getStatusCode());
            System.out.println("Continuation Token: " + page.getContinuationToken());
            page.getElements().forEach(secret -> System.out.println("Secret value: " + secret))
        },
        ex -> System.out.println("Error listing pages with secret: " + ex.getMessage()),
        () -> System.out.println("Successfully listed all pages with secret"));
 ```

## Next steps

Now that you're familiar with pagination and iteration in the Azure SDK for Java, consider reviewing [Long-running operations in the Azure SDK for Java](lro.md). Long-running operations are operations that run for a longer duration than most normal HTTP requests, typically because they require some effort on the server side.
