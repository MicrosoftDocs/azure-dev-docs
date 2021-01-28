---
title: Pagination & iteration in the Azure SDK for Java
description: An overview of the Azure SDK for Java concepts related to pagination and iteration
author: anuchandy
ms.date: 11/23/2020
ms.topic: conceptual
ms.custom: devx-track-java
ms.author: anuchan
---

# Pagination and iteration in the Azure SDK for Java

This article provides an overview of how to make use of the Azure SDK for Java pagination and iteration functionality to efficiently and productively work with large data sets. Many operations provided by the client libraries within the Azure Java SDK return more than one result. The Azure Java SDK defines a set of acceptable return types in these cases to ensure that developer experience is maximized through consistency. The return types used are `PagedIterable` for sync APIs and `PagedFlux` for async APIs. The APIs differ slightly on account of their different use cases, but conceptually they meet the same expectations:

1. Make it possible to easily iterate over each element in the collection individually, ignoring any need for manual pagination or tracking of continuation tokens. Both `PagedIterable` and `PagedFlux` make this task easy by iterating over a paginated response deserialized into a given type `T`. `PagedIterable` implements the `Iterable` interface, and offers an API to receive a `Stream`, while `PagedFlux` provides a `Flux`. In all cases, the act of pagination is transparent, and iteration continues while there are still results iterate over.

2. Make it possible to iterate explicitly page-by-page. Doing so lets you understand more clearly when requests are made, and lets you access per-page response information. Both `PagedIterable` and `PagedFlux` have methods that will return appropriate types to iterate by page, rather than by individual element.

This article is split between the Java Azure SDK synchronous and asynchronous APIs. You'll encounter the synchronous iteration APIs when working with synchronous clients, and similarly, asynchronous iteration APIs when working with asynchronous clients.

## Synchronous pagination and iteration

This section covers the synchronous APIs. Later, this article provides guidance on working with the asynchronous APIs.

### Iterating over individual elements

As noted, the most common use case is to iterate over each element individually, rather than per page. The code samples below show how the `PagedIterable` API allows for users to use the iteration style they prefer to implement this functionality.

#### Using a for-each loop

Because `PagedIterable` implements `Iterable`, it's possible to iterate through the elements using code such as that shown below:

```java
PagedIterable<Secret> secrets = client.listSecrets();
for (Secret secret : secrets) {
   System.out.println("Secret is: " + secret);
}
```

#### Using Stream

Because `PagedIterable` has a `stream()` method defined on it, you can call it to use the standard Java Stream APIs, as shown below:

```java
client.listSecrets()
      .stream()
      .forEach(secret -> System.out.println("Secret is: " + secret));
```

#### Using Iterator

Because `PagedIterable` implements `Iterable`, it also has an `iterator()` method to allow for the Java iterator programming style, as show below:

```java
Iterator<Secret> secrets = client.listSecrets().iterator();
while (it.hasNext()) {
   System.out.println("Secret is: " + it.next());
}
```

### Iterating over pages

When working with individual pages is required, for example for when HTTP response information is required, or when continuation tokens are important to retain iteration history, it's possible to iterate per page. There's no difference in performance or the number of calls made to the service whether you iterate by page or by each item. The underlying implementation loads the next page on-demand and if you unsubscribe from the `PagedFlux` at any time, there will be no further calls to the service.

#### Using a for-each loop

The `PagedIterable` that's returned by calling `listSecrets()` has an `iterableByPage()` API, that when called gives an `Iterable<PagedResponse<Secret>>` in this case, rather than before, where you got an `Iterable<Secret>`. It's this extra `PagedResponse` that provides us with the response metadata and access to the continuation token.

```java
Iterable<PagedResponse<Secret>> secretPages = client.listSecrets().iterableByPage();
for (PagedResponse<Secret> page : secretPages) {
   System.out.println("Response code: " + page.getStatusCode());
   System.out.println("Continuation Token: " + page.getContinuationToken());
   page.getElements().forEach(secret -> System.out.println("Secret value: " + secret))
}
```

There's also an `iterableByPage` overload that accepts a continuation token. You can call this overload when you want to return to the same point of iteration at a later time.

#### Using Stream

Note here the `streamByPage()` method call, which performs the same operation as shown above. Note again that `streamByPage` has a continuation token overload, for returning to the same point of iteration at a later time.

```java
client.listSecrets()
      .streamByPage()
      .forEach(page -> {
          System.out.println("Response code: " + page.getStatusCode());
          System.out.println("Continuation Token: " + page.getContinuationToken());
          page.getElements().forEach(secret -> System.out.println("Secret value: " + secret))
      });
```

## Asynchronously observing pages and individual elements

This section covers the asynchronous APIs. In async APIs, the network calls happen in a different thread than the main-thread that calls `subscribe()`. What this means is that the main-thread may terminate before the result is available. It's up to you to ensure that the application doesn't exit before the async operation has had time to complete.

### Observing individual elements

The code example below shows how the `PagedFlux` API allows users to observe individual elements asynchronously. There are various [ways to subscribe to a Flux type](https://projectreactor.io/docs/core/release/reference/#_simple_ways_to_create_a_flux_or_mono_and_subscribe_to_it). This example is one variety there are three lambda expressions: one each for the consumer, the error consumer, and the complete consumer. Having all three is good practice, but in some cases it's adequate for the work being formed to have only the consumer, and possibly the error consumer.

 ```java
asyncClient.listSecrets()
    .subscribe(secret -> System.out.println("Secret value: " + secret),
        ex -> System.out.println("Error listing secrets: " + ex.getMessage()),
        () -> System.out.println("Successfully listed all secrets"));
 ```

### Observing pages

 The code sample below shows how the `PagedFlux` API allows users to observe each page asynchronously, again by using a `byPage()` API and by providing a consumer, error consumer, and a completion consumer.

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

Now that you're familiar with pagination and iteration in the Azure SDK for Java, consider reviewing [Long-running operations in the Azure SDK for Java](java-sdk-lro.md). Long-running operations are operations that run for a longer duration than most normal HTTP requests, typically because they require some effort on the server side. Familiarizing yourself with the long-running operation APIs will be of great use for when these APIs appear in your development journey.
