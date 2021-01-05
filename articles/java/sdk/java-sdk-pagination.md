---
title: Pagination & iteration
description: An overview of the Azure SDK for Java concepts related to pagination and iteration
ms.date: 11/23/2020
ms.topic: conceptual
ms.custom: devx-track-java
---

# Pagination & iteration

Many operations provided by the client libraries within the Azure Java SDK return more than one result. The Azure Java SDK defines a set of acceptable return types in these cases to ensure developer experience is maximized through consistency. The return types used are `PagedIterable` for sync APIs and `PagedFlux` for async APIs. The APIs differ slightly on account of their different use cases, but conceptually they meet the same expectations:

1. Make it possible for developers to easily iterate over each element in the collection individually, ignoring any need for manual pagination or tracking of continuation tokens. Both `PagedIterable` and `PagedFlux` enable the common case to be quickly and easily achieved: iterating over a paginated response deserialized into a given type `T`. In the case of `PagedIterable`, it implements the `Iterable` interface, and offers API to receive a `Stream`. In the case of `PagedFlux`, it is a `Flux`. In all cases, the act of pagination is transparent to developers and iteration will continue until the returned results are completely iterated over.

2. Make it possible to iterate explicitly page-by-page. This enables developers to more clearly understand when requests are being made, and to be able to access per-page response information. Both `PagedIterable` and `PagedFlux` have methods that will return appropriate types to iterate by page, rather than by individual element.

This document is split between the Java Azure SDK synchronous and asynchronous APIs. Developers will encounter the synchronous iteration APIs when working with synchronous clients, and similarly, asynchronous iteration APIs will be present when working with asynchronous clients.

## Synchronous Pagination and Iteration

This section covers the synchronous APIs. Further down this document is guidance on working with the asynchronous APIs.

### Iterating over Individual Elements

As noted, the most common use case is to iterate over each element individually, rather than per page. The code samples below show how the `PagedIterable` API allows for users to use the iteration style they prefer to implement this functionality.

#### Using a _for-each_ loop

Because `PagedIterable` implements `Iterable`, it is possible to iterate through the elements using code such as that shown below:

```java
PagedIterable<Secret> secrets = client.listSecrets();
for (Secret secret : secrets) {
   System.out.println("Secret is: " + secret);
}
```

#### Using Stream

Because `PagedIterable` has a `stream()` method defined on it, developers can call it to use the standard Java Stream APIs, as shown below:

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

### Iterating over Pages

When working with individual pages is required, for example for when HTTP response information is required, or when continuation tokens are important to retain iteration history, it is possible to iterate per page.

#### Using a _for-each_ loop

Note that the `PagedIterable` that is returned by calling `listSecrets()` has an `iterableByPage()` API, that when called gives an `Iterable<PagedResponse<Secret>>` in this case, rather than before, where we got an `Iterable<Secret>`. It is this extra `PagedResponse` that provides us with the response metadata and access to the continuation token.

```java
Iterable<PagedResponse<Secret>> secretPages = client.listSecrets().iterableByPage();
for (PagedResponse<Secret> page : secretPages) {
   System.out.println("Response code: " + page.getStatusCode());
   System.out.println("Continuation Token: " + page.getContinuationToken());
   page.getElements().forEach(secret -> System.out.println("Secret value: " + secret))
}
```

Note that there is also an `iterableByPage` overload that accepts a continuation token. This can be called when you want to return to the same point of iteration at a later time.

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

This section covers the asynchronous APIs. Further up this document is guidance on working with the synchronous APIs. It is important to note that in async APIs the network calls happens in a different thread than the main-thread that calls `subscribe()`. This means that the main-thread may terminate before the result is available. It is up to the developer to ensure that the application does not exit before the async operation has had time to complete.

### Observing individual elements

The code sample below shows how the `PagedFlux` API allows users to observe individual elements asynchronously. There are a variety of [ways to subscribe to a Flux type](https://projectreactor.io/docs/core/release/reference/#_simple_ways_to_create_a_flux_or_mono_and_subscribe_to_it), presented below is one variety where we provide three lambda expressions, for the consumer, error consumer, and the complete consumer. Having all three is good practice, but in some cases a simpler form where only the consumer, and possibly the error consumer, is adequate for the work being performed.
 
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

Now that you've familiarized yourself with pagination and iteration in the Azure SDK for Java, consider reviewing the guide on [Long-Running operations](java-sdk-lro.md). Long-running operations are, as the name implies, those that run for a longer duration than most normal HTTP requests. This is typically because the operation requires some effort on the server side. Familiarizing yourself with the long-running operation APIs will be of great use for when these APIs appear in your development journey.
