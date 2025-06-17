---
title: Asynchronous programming in the Azure SDK for Java
description: Provides an overview of asynchronous programming model in the Azure SDK for Java.
ms.date: 02/14/2025
ms.topic: article
ms.custom: devx-track-java, devx-track-extended-java
author: KarlErickson
ms.author: karler
ms.reviewer: srnagar
---

# Asynchronous programming in the Azure SDK for Java

This article describes the asynchronous programming model in the Azure SDK for Java.

The Azure SDK initially contained only non-blocking, asynchronous APIs for interacting with Azure services. These APIs let you use the Azure SDK to build scalable applications that use system resources efficiently. However, the [Azure SDK for Java](https://github.com/Azure/azure-sdk-for-java#client-new-releases) also contains synchronous clients to cater to a wider audience, and also make our client libraries approachable for users not familiar with asynchronous programming. (See [Approachable](https://azure.github.io/azure-sdk/general_introduction.html#approachable) in the Azure SDK design guidelines.) As such, all Java client libraries in the Azure SDK for Java offer both asynchronous and synchronous clients. However, we recommend using the asynchronous clients for production systems to maximize the use of system resources.

## Reactive streams

If you look at the [Async Service Clients](https://azure.github.io/azure-sdk/java_introduction.html#async-service-clients) section in the [Java Azure SDK Design Guidelines](https://azure.github.io/azure-sdk/java_introduction.html), you'll notice that, instead of using `CompletableFuture` provided by Java 8, our async APIs use reactive types. Why did we choose reactive types over types that are natively available in JDK?

Java 8 introduced features like [Streams](https://docs.oracle.com/javase/8/docs/api/java/util/stream/package-summary.html), [Lambdas](https://docs.oracle.com/javase/tutorial/java/javaOO/lambdaexpressions.html), and [CompletableFuture](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/CompletableFuture.html). These features provide many capabilities, but have some limitations.

`CompletableFuture` provides callback-based, non-blocking capabilities, and the `CompletionStage` interface allowed for easy composition of a series of asynchronous operations. Lambdas make these push-based APIs more readable. Streams provide functional-style operations to handle a collection of data elements. However, streams are synchronous and can't be reused. `CompletableFuture` allows you to make a single request, provides support for a callback, and expects a _single_ response. However, many cloud services require the ability to stream data - Event Hubs for instance.

Reactive streams can help to overcome these limitations by streaming elements from a source to a subscriber. When a subscriber requests data from a source, the source sends any number of results back. It doesn't need to send them all at once. The transfer happens over a period of time, whenever the source has data to send.

In this model, the subscriber registers event handlers to process data when it arrives. These push-based interactions notify the subscriber through distinct signals:

- An `onSubscribe()` call indicates that the data transfer is about to begin.
- An `onError()` call indicates there was an error, which also marks the end of data transfer.
- An `onComplete()` call indicates successful completion of data transfer.

Unlike Java Streams, reactive streams treat errors as first-class events. Reactive streams have a dedicated channel for the source to communicate any errors to the subscriber. Also, reactive streams allow the subscriber to negotiate the data transfer rate to transform these streams into a push-pull model.

The [Reactive Streams](https://github.com/reactive-streams/reactive-streams-jvm#reactive-streams) specification provides a standard for how the transfer of data should occur. At a high level, the specification defines the following four interfaces and specifies rules on how these interfaces should be implemented.

- **Publisher** is the source of a data stream.
- **Subscriber** is the consumer of a data stream.
- **Subscription** manages the state of data transfer between a publisher and a subscriber.
- **Processor** is both a publisher and a subscriber.

There are some well-known Java libraries that provide implementations of this specification, such as [RxJava](https://github.com/ReactiveX/RxJava), [Akka Streams](https://doc.akka.io/docs/akka/current/stream/stream-introduction.html), [Vert.x](https://vertx.io/docs/#reactive), and [Project Reactor](https://projectreactor.io/docs/core/release/reference/).

The Azure SDK for Java adopted Project Reactor to offer its async APIs. The main factor driving this decision was to provide smooth integration with [Spring Webflux](https://docs.spring.io/spring/docs/current/spring-framework-reference/web-reactive.html), which also uses Project Reactor. Another contributing factor to choose Project Reactor over RxJava was that Project Reactor uses Java 8 but RxJava, at the time, was still at Java 7. Project Reactor also offers a rich set of operators that are composable and allow you to write declarative code for building data processing pipelines. Another nice thing about Project Reactor is that it has adapters for converting Project Reactor types to other popular implementation types.

## Comparing APIs of synchronous and asynchronous operations

We discussed the synchronous clients and options for asynchronous clients. The table below summarizes what APIs look like that are designed using these options:

| API Type                                           | No value                   | Single value            | Multiple values                         |
|----------------------------------------------------|----------------------------|-------------------------|-------------------------------|
| Standard Java - Synchronous APIs                   | `void`                     | `T`                     | `Iterable<T>`                 |
| Standard Java - Asynchronous APIs                  | `CompletableFuture<Void>`  | `CompletableFuture<T>`  | `CompletableFuture<List<T>>`   |
| Reactive Streams Interfaces                        | `Publisher<Void>`          | `Publisher<T>`          | `Publisher<T>`                 |
| Project Reactor implementation of Reactive Streams | `Mono<Void>`               | `Mono<T>`               | `Flux<T>`                      |

For the sake of completeness, it's worth mentioning that Java 9 introduced the [Flow](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/concurrent/Flow.html) class that includes the four reactive streams interfaces. However, this class doesn't include any implementation.

## Use async APIs in the Azure SDK for Java

The reactive streams specification doesn't differentiate between types of publishers. In the reactive streams specification, publishers simply produce zero or more data elements. In many cases, there's a useful distinction between a publisher producing at most one data element versus one that produces zero or more. In cloud-based APIs, this distinction indicates whether a request returns a single-valued response or a collection. Project Reactor provides two types to make this distinction - [Mono](https://projectreactor.io/docs/core/release/api/reactor/core/publisher/Mono.html) and [Flux](https://projectreactor.io/docs/core/release/api/reactor/core/publisher/Flux.html). An API that returns a `Mono` will contain a response that has at most one value, and an API that returns a `Flux` will contain a response that has zero or more values.

For example, suppose you use a [ConfigurationAsyncClient](/java/api/com.azure.data.appconfiguration.configurationasyncclient) to retrieve a configuration stored using the Azure App Configuration service. (For more information, see [What is Azure App Configuration?](/azure/azure-app-configuration/overview).)

If you create a `ConfigurationAsyncClient` and call `getConfigurationSetting()` on the client, it returns a `Mono`, which indicates that the response contains a single value. However, calling this method alone doesn't do anything. The client has not yet made a request to the Azure App Configuration service. At this stage, the `Mono<ConfigurationSetting>` returned by this API is just an "assembly" of data processing pipeline. What this means is that the required setup for consuming the data is complete. To actually trigger the data transfer (that is, to make the request to the service and get the response), you must subscribe to the returned `Mono`. So, when dealing with these reactive streams, you must remember to call `subscribe()` because nothing happens until you do so.

The following example shows how to subscribe to the `Mono` and print the configuration value to the console.

```java
ConfigurationAsyncClient asyncClient = new ConfigurationClientBuilder()
    .connectionString("<your connection string>")
    .buildAsyncClient();

asyncClient.getConfigurationSetting("<your config key>", "<your config value>").subscribe(
    config -> System.out.println("Config value: " + config.getValue()),
    ex -> System.out.println("Error getting configuration: " + ex.getMessage()),
    () -> System.out.println("Successfully retrieved configuration setting"));

System.out.println("Done");
```

Notice that after calling `getConfigurationSetting()` on the client, the example code subscribes to the result and provides three separate lambdas. The first lambda consumes data received from the service, which is triggered upon successful response. The second lambda is triggered if there is an error while retrieving the configuration. The third lambda is invoked when the data stream is complete, meaning no more data elements are expected from this stream.

> [!NOTE]
> As with all asynchronous programming, after the subscription is created, execution proceeds as usual. If there's nothing to keep the program active and executing, it may terminate before the async operation completes. The main thread that called `subscribe()` won't wait until you make the network call to Azure App Configuration and receive a response. In production systems, you might continue to process something else, but in this example you can add a small delay by calling `Thread.sleep()` or use a `CountDownLatch` to give the async operation a chance to complete.

As shown in the following example, APIs that return a `Flux` also follow a similar pattern. The difference is that the first callback provided to the `subscribe()` method is called multiple times for each data element in the response. The error or the completion callbacks are called exactly once and are considered as terminal signals. No other callbacks are invoked if either of these signals are received from the publisher.

```java
EventHubConsumerAsyncClient asyncClient = new EventHubClientBuilder()
    .connectionString("<your connection string>")
    .consumerGroup("<your consumer group>")
    .buildAsyncConsumerClient();

asyncClient.receive().subscribe(
    event -> System.out.println("Sequence number of received event: " + event.getData().getSequenceNumber()),
    ex -> System.out.println("Error receiving events: " + ex.getMessage()),
    () -> System.out.println("Successfully completed receiving all events"));
```

### Backpressure

What happens when the source is producing the data at a faster rate than the subscriber can handle? The subscriber can get overwhelmed with data, which can lead to out-of-memory errors. The subscriber needs a way to communicate back to the publisher to slow down when it can't keep up. By default, when you call `subscribe()` on a `Flux` as shown in the example above, the subscriber is requesting an unbounded stream of data, indicating to the publisher to send the data as quickly as possible. This behavior isn't always desirable, and the subscriber may have to control the rate of publishing through "backpressure". Backpressure allows the subscriber to take control of the flow of data elements. A subscriber will request a limited number of data elements that they can handle. After the subscriber has completed processing these elements, the subscriber can request more. By using backpressure, you can transform a push-model for data transfer into a push-pull model.

The following example shows how you can control the rate at which events are received by the Event Hubs consumer:

```java
EventHubConsumerAsyncClient asyncClient = new EventHubClientBuilder()
    .connectionString("<your connection string>")
    .consumerGroup("<your consumer group>")
    .buildAsyncConsumerClient();

asyncClient.receive().subscribe(new Subscriber<PartitionEvent>() {
    private Subscription subscription;

    @Override
    public void onSubscribe(Subscription subscription) {
        this.subscription = subscription;
        this.subscription.request(1); // request 1 data element to begin with
    }

    @Override
    public void onNext(PartitionEvent partitionEvent) {
        System.out.println("Sequence number of received event: " + partitionEvent.getData().getSequenceNumber());
        this.subscription.request(1); // request another event when the subscriber is ready
    }

    @Override
    public void onError(Throwable throwable) {
        System.out.println("Error receiving events: " + throwable.getMessage());
    }

    @Override
    public void onComplete() {
        System.out.println("Successfully completed receiving all events")
    }
});
```

When the subscriber first "connects" to the publisher, the publisher hands the subscriber a `Subscription` instance, which manages the state of the data transfer. This `Subscription` is the medium through which the subscriber can apply backpressure by calling `request()` to specify how many more data elements it can handle.

If the subscriber requests more than one data element each time it calls `onNext()`, `request(10)` for example, the publisher will send the next 10 elements immediately if they're available or when they become available. These elements accumulate in a buffer on the subscriber's end, and since each `onNext()` call will request 10 more, the backlog keeps growing until either the publisher has no more data elements to send, or the subscriber's buffer overflows, resulting in out-of-memory errors.

### Cancel a subscription

A subscription manages the state of data transfer between a publisher and a subscriber. The subscription is active until the publisher has completed transferring all the data to the subscriber or the subscriber is no longer interested in receiving data. There are a couple of ways you can cancel a subscription as shown below.

The following example cancels the subscription by disposing the subscriber:

```java
EventHubConsumerAsyncClient asyncClient = new EventHubClientBuilder()
    .connectionString("<your connection string>")
    .consumerGroup("<your consumer group>")
    .buildAsyncConsumerClient();

Disposable disposable = asyncClient.receive().subscribe(
    partitionEvent -> {
        Long num = partitionEvent.getData().getSequenceNumber()
        System.out.println("Sequence number of received event: " + num);
    },
    ex -> System.out.println("Error receiving events: " + ex.getMessage()),
    () -> System.out.println("Successfully completed receiving all events"));

// much later on in your code, when you are ready to cancel the subscription,
// you can call the dispose method, as such:
disposable.dispose();
```

The follow example cancels the subscription by calling the `cancel()` method on `Subscription`:

```java
EventHubConsumerAsyncClient asyncClient = new EventHubClientBuilder()
    .connectionString("<your connection string>")
    .consumerGroup("<your consumer group>")
    .buildAsyncConsumerClient();

asyncClient.receive().subscribe(new Subscriber<PartitionEvent>() {
    private Subscription subscription;

    @Override
    public void onSubscribe(Subscription subscription) {
        this.subscription = subscription;
        this.subscription.request(1); // request 1 data element to begin with
    }

    @Override
    public void onNext(PartitionEvent partitionEvent) {
        System.out.println("Sequence number of received event: " + partitionEvent.getData().getSequenceNumber());
        this.subscription.cancel(); // Cancels the subscription. No further event is received.
    }

    @Override
    public void onError(Throwable throwable) {
        System.out.println("Error receiving events: " + throwable.getMessage());
    }

    @Override
    public void onComplete() {
        System.out.println("Successfully completed receiving all events")
    }
});
```

## Conclusion

Threads are expensive resources that you shouldn't waste on waiting for responses from remote service calls. As the adoption of microservices architectures increase, the need to scale and use resources efficiently becomes vital. Asynchronous APIs are favorable when there are network-bound operations. The Azure SDK for Java offers a rich set of APIs for async operations to help maximize your system resources. We highly encourage you to try out our async clients.

For more information on the operators that best suit your particular tasks, see [Which operator do I need?](https://projectreactor.io/docs/core/release/reference/#which-operator) in the [Reactor 3 Reference Guide](https://projectreactor.io/docs/core/release/reference/index.html).

## Next steps

Now that you better understand the various asynchronous programming concepts, it's important to learn how to iterate over the results. For more information on the best iteration strategies, and details of how pagination works, see [Pagination and iteration in the Azure SDK for Java](pagination.md).
