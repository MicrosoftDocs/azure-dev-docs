---
title: Asynchronous programming
description: An overview of the Azure SDK for Java concepts related to asynchronous programming
ms.date: 01/06/2021
ms.topic: conceptual
ms.custom: devx-track-java
---

# Asynchronous programming

When the Azure SDK team started to architect the redesign of the [new Azure SDK for Java](https://github.com/Azure/azure-sdk-for-java#client-new-releases), initially only non-blocking, asynchronous APIs were to be offered to developers for interacting with Azure services. Doing so would enable application developers using Azure SDK to utilize their system resources efficiently to build scalable applications. However, when the Azure SDK team conducted user studies, it was quickly realized that it was important to include synchronous clients to cater to a wider audience, and also make our client libraries [approachable](https://azure.github.io/azure-sdk/general_introduction.html#approachable) for users not familiar with asynchronous programming. Given this, all Java client libraries in the Azure SDK for Java offers both asynchronous and synchronous clients. It is, however, recommended to use the asynchronous clients for production systems to maximize the utilization of system resources.

## Reactive Streams

If you look at the [async client](https://azure.github.io/azure-sdk/java_design.html#java-async-client-shape) in the new Azure SDK for Java design guidelines, you'll notice that instead of using [`CompletableFuture`](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/CompletableFuture.html) provided by Java 8, our async APIs use reactive types. Why did we choose reactive types over types that are natively available in JDK?

Java 8 introduced some very useful features like Streams, Lambdas and CompletableFuture. `CompletableFuture`s provide callback-based, non-blocking capabilities and the `CompletionStage` interface allowed for easy composition of a series of asynchronous operations. [Lambdas](https://docs.oracle.com/javase/tutorial/java/javaOO/lambdaexpressions.html) make these push-based APIs more readable. Lastly, [Streams](https://docs.oracle.com/javase/8/docs/api/java/util/stream/package-summary.html) provide functional-style operations to handle a collection of data elements. However, there are some limitations. Streams are synchronous and cannot be reused. `CompletableFuture` allows you to make a single request, provides support for a callback, and expects a _single_ response. Many cloud services require the ability to stream data - Event Hubs for instance. 

Reactive streams overcome these limitations by supporting streaming transfer of elements from a source to the subscriber of the data. When a subscriber requests data from a source, the source can send any number of results back. These results don't have to be sent all at once. The transfer can happen over a period of time as and when the source has data to send. In this model, the subscriber registers event handlers to process data when it arrives. This push-based interaction notifies the subscriber when the source is ready to send data, when there is an error or when there's no further data to send. This is accomplished by having distinct signals - `onSubscribe()` to indicate the data transfer is about to begin, `onError()` to indicate there was an error which also marks the end of data transfer, `onComplete()` to indicate successful completion of data transfer. Unlike Java Streams, reactive streams treat errors as first-class events and have a dedicated channel for the source to communicate any errors to the subscriber. Additionally, reactive streams allow subscriber to negotiate the rate at which the data is transferred that can transform these streams into a push-pull model.

The [Reactive Streams](https://github.com/reactive-streams/reactive-streams-jvm#reactive-streams) specification provides a standard for how the transfer of data should occur. At a high-level, the following four interfaces are defined and the specification specifies rules on how these interfaces should be implemented.

- **Publisher** is the source of a data stream
- **Subscriber** is the consumer of a data stream
- **Subscription** manages the state of data transfer between a publisher and a subscriber
- **Processor** is both a Publisher and a Subscriber

There are some well-known Java libraries that provide implementations of this specification - [RxJava](https://github.com/ReactiveX/RxJava), [Akka Streams](https://doc.akka.io/docs/akka/current/stream/stream-introduction.html), [Vert.x](https://vertx.io/docs/#reactive), and [Project Reactor](https://projectreactor.io/docs/core/release/reference/). 

The Azure SDK for Java adopted Project Reactor to offer its async APIs. The main factor driving this decision was to provide smooth integration with [Spring Webflux](https://docs.spring.io/spring/docs/current/spring-framework-reference/web-reactive.html) which also uses Project Reactor. Another contributing factor to choose Project Reactor over RxJava was that Project Reactor uses Java 8 whereas RxJava, at the time, was still at Java 7. Project Reactor also offers a rich set of operators that are composable and allows developers to write declarative code for building data processing pipelines. Another nice thing about Project Reactor is that it has adapters for converting Project Reactor types to other popular implementation types. 

## Comparing APIs of synchronous and asynchronous operations

We discussed the synchronous clients and options for asynchronous clients. The table below summarizes what APIs designed using these options look like:

| API Type                                           | No value                 | Single value          | Multiple values              |
|----------------------------------------------------|--------------------------|-----------------------|------------------------------|
| Standard Java - Synchronous APIs                   | void                     | T                     | Iterable\<T>                 |
| Standard Java - Asynchronous APIs                  | CompletableFuture\<Void> | CompletableFuture\<T> | CompletableFuture\<List\<T>> |
| Reactive Streams Interfaces                        | Publisher\<Void>         | Publisher\<T>         | Publisher\<T>                |
| Project Reactor implementation of Reactive Streams | Mono\<Void>              | Mono\<T>              | Flux\<T>                     |

> For the sake of completeness, it's worth mentioning that Java 9 introduced the [Flow](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/concurrent/Flow.html) class that includes the four reactive streams interfaces. However, this does not include any implementation.

## Using Async APIs in the new Azure SDK for Java

The reactive streams specification does not differentiate between a publisher that produces at most one data element vs. a publisher that may produce more than one data element. However, this distinction is very useful in building cloud APIs to indicate if a request returns a single-valued response or a collection. Project Reactor provides two types to make this distinction - [Mono](https://projectreactor.io/docs/core/release/api/reactor/core/publisher/Mono.html) and [Flux](https://projectreactor.io/docs/core/release/api/reactor/core/publisher/Flux.html). An API that returns a `Mono` will contain a result that has at most one value and an API that returns a type of `Flux` will contain a response that has 0 or more values.

Let's take an example of [App Configuration async client](https://docs.microsoft.com/java/api/com.azure.data.appconfiguration.configurationasyncclient?view=azure-java-stable&preserve-view=true) to retrieve a configuration stored in [App Configuration Azure service](https://docs.microsoft.com/azure/azure-app-configuration/overview).

Creating a `ConfigurationAsyncClient` and calling the `getConfigurationSetting()` API on the client returns a `Mono` which indicates that the response contains a single value. Here's the important bit - just calling this method alone doesn't do anything. The client has not made a request to the App Configuration service yet. At this stage, `Mono<ConfigurationSetting>` returned by this API is just an "assembly" of data processing pipeline. What this means is that the required setup for consuming the data is done. In order to actually trigger the data transfer i.e. to make the request to the service and get the response, the returned `Mono` has to be subscribed to. So, when dealing with these reactive streams, you must remember to `subscribe()` because _nothing happens until you do so_.

Let's look at a sample on how to subscribe to the `Mono` and print the value of configuration to the console.

```java
ConfigurationAsyncClient asyncClient = new ConfigurationClientBuilder()
    .connectionString("{connection-string}")
    .buildAsyncClient();

asyncClient.getConfigurationSetting("{config-key}", "{config-value}").subscribe(
    config -> System.out.println("Config value: " + config.getValue()),
    ex -> System.out.println("Error getting configuration: " + ex.getMessage()),
    () -> System.out.println("Successfully retrieved configuration setting"));

System.out.println("Done");
```

Notice that after calling `getConfigurationSetting()` API on the client, we subscribed to the result and provided three separate lambdas - the first one consumes data received from the service which is triggered upon successful response, the second callback is triggered if there was an error while retrieving the configuration and the third one is invoked when the data stream is complete, meaning no more data elements are expected from this stream.

>**Note:** As with all asynchronous programming, after the subscription is created, execution proceeds as per usual. This means that if there is nothing to keep the program active and executing, it may terminate before the async operation completes. The main thread that called `subscribe()` will not wait until the network call to App Configuration service is made and a response is received. In production systems, you might continue to process something else but in this example you can simply add a small delay by calling `Thread.sleep()` or use a `CountDownLatch` to give the async operation a chance to complete.

APIs that return a `Flux` also follow a similar pattern, with the difference being the first callback provided to the `subscribe()` method will be called multiple times for each data element in the response. The error or the completion callbacks are called exactly once and are considered as terminal signals. No other callbacks will be invoked if either of these signals are received from the publisher. 

```java
EventHubConsumerAsyncClient asyncClient = new EventHubClientBuilder()
    .connectionString("{connection-string}")
    .consumerGroup("{consumer-group}")
    .buildAsyncConsumerClient();

asyncClient.receive().subscribe(
    event -> System.out.println("Sequence number of received event: " + event.getData().getSequenceNumber()),
    ex -> System.out.println("Error receiving events: " + ex.getMessage()),
    () -> System.out.println("Successfully completed receiving all events"));
```

### Backpressure

What happens when the source is producing the data at a faster rate than the subscriber can handle? The subscriber can get overwhelmed with data and can lead to out of memory errors. The subscriber needs a way to communicate back to the publisher to slow down when it cannot keep up. By default, when you `subscribe()` to a `Flux` as shown in the example above, the subscriber is requesting an unbounded stream of data indicating to the publisher to send the data as quickly as possible. This may not always be desired and the subscriber may have to control the rate of publishing. The subscriber can choose to do so by requesting a limited number of data elements to start with and then request for more when it's ready again. This is known as "backpressure" where the subscriber of the data signals to the publisher how much data it can handle. By using backpressure, a push-model for data transfer can be transformed to a push-pull model where the subscriber requests data when it's ready and the publisher sends data when available. 

Here's an example of how you can control the rate at which events are received by the Event Hubs consumer:

```java
EventHubConsumerAsyncClient asyncClient = new EventHubClientBuilder()
    .connectionString("{connection-string}")
    .consumerGroup("{consumer-group}")
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

When the subscriber first "connects" to the publisher, the publisher hands the subscriber an instance of `Subscription` which manages the state of the data transfer. This `Subscription` is the medium through which the subscriber can apply backpressure by calling `request()` method to specify how many more data elements it can handle. 

If the subscriber requests more than one data element each time `onNext()` is called, `request(10)` for example, the publisher will send the next 10 elements immediately, if they are available or when they become available. These elements are accumulated in a buffer on the subscriber's end and since each `onNext()` call will request 10 more, the backlog keeps growing until either the publisher has no more data elements to send or the subscriber's buffer overflows resulting in out of memory errors. 

### Cancelling a subscription

A subscription manages the state of data transfer between a publisher and a subscriber. The subscription is active until the publisher has completed transferring all the data to the subscriber or the subscriber is no longer interested in receiving data. There are a couple of ways in which the subscriber can cancel a subscription as shown below.

Dispose the subscriber:

```java
EventHubConsumerAsyncClient asyncClient = new EventHubClientBuilder()
    .connectionString("{connection-string}")
    .consumerGroup("{consumer-group}")
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

or call the `cancel()` method on `Subscription`:

```java
EventHubConsumerAsyncClient asyncClient = new EventHubClientBuilder()
    .connectionString("{connection-string}")
    .consumerGroup("{consumer-group}")
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
        this.subscription.cancel(); // Cancels the subscription and no further event will be received
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

### Pagination using PagedFlux

Many Azure services have APIs that return a collection of results. For example, listing all the configurations stored in App Configuration service. There may be thousands of configurations and sending them all at once as one single HTTP response could cause high latency, increase the size of payload and may not even fit into the memory of the client application. So, typically, such APIs support pagination. Each request to the service returns a single page with a limited set of results and a link to the next page. To get the results from next page, another request has to be made to the service. 

The Azure Java clients - both sync and async - hide the details of paging and provides application developers with a simple abstraction to iterate through the results. The pagination happens behind the scenes, on-demand. The async clients return a [`PagedFlux`](https://docs.microsoft.com/java/api/com.azure.core.http.rest.pagedflux?view=azure-java-stable&preserve-view=true) which is a type of `Flux` that allows you to iterate through the results one item at a time or one page at a time. For example, if you are interested in listing the configurations stored in App Configuration and iterate through each configuration and don't really care about paging, you can simply treat the `PagedFlux` as a `Flux` and `subscribe()` to iterate through each configuration, as shown below.

```java
ConfigurationAsyncClient asyncClient = new ConfigurationClientBuilder()
    .connectionString("{connection-string}")
    .buildAsyncClient();

// just subscribe to the PagedFlux similar to a Flux
asyncClient.listConfigurationSettings(selector).subscribe(
    config -> System.out.println("Config value: " + config.getValue()),
    ex -> System.out.println("Error listing configuration: " + ex.getMessage()),
    () -> System.out.println("Successfully listed all configurations"));
```

If you are interested in iterating the results by page, you can use the `byPage()` method on `PagedFlux`. This method returns a `Flux` of `PagedResponse` type that includes details of HTTP response like the HTTP status code, response headers, link to next page and any other information specific to that page.

```java
ConfigurationAsyncClient asyncClient = new ConfigurationClientBuilder()
    .connectionString("{connection-string}")
    .buildAsyncClient();

// just subscribe to the pagedFlux similar to a Flux
asyncClient.listConfigurationSettings(selector)
    .byPage() // iterating by page
    .subscribe(
        page -> System.out.println("Next page link: " + page.getContinuationToken() + ", results: " + page.getElements()),
        ex -> System.out.println("Error listing configuration: " + ex.getMessage()),
        () -> System.out.println("Successfully listed all configurations"));
```

Note that there's no difference in performance or the number of calls made to the service whether you iterate by page or by each item. The underlying implementation loads the next page on-demand and if you unsubscribe from the `PagedFlux` at any time, there will be no further calls to the service.  

### Long Running Operations and PollerFlux

Certain operations on Azure may require extended processing times to successfully complete a user request. For example, copying data from a source URL to a Storage blob or training a model to recognize forms are operations that may take a few seconds to several minutes. Such operations are referred to as long running operations and these operations, typically, acknowledge the user request to start the long running operation by returning a "request id" immediately. The client will then periodically poll the service to get the status of the operation. When the terminal state has reached either because the operation completed successfully or failed, the polling stops. The client can then request the final response of the operation.

For such operations, the Java async clients return a type of `Flux` known as the [`PollerFlux`](https://docs.microsoft.com/java/api/com.azure.core.util.polling.pollerflux?view=azure-java-stable&preserve-view=true). Each data element emitted by `PollerFlux` is of type [`AsyncPollResponse`](https://docs.microsoft.com/java/api/com.azure.core.util.polling.asyncpollresponse?view=azure-java-stable&preserve-view=true) and holds the result of the polling operation done periodically by the SDK. Client applications interested in keeping track of the progress of the long running operation may subscribe to this flux and inspect the status of each response as shown below:

```java
FormRecognizerAsyncClient formRecognizerAsyncClient = new FormRecognizerClientBuilder()
    .credential(new DefaultAzureCredentialBuilder().build())
    .buildAsyncClient();

formRecognizerAsyncClient.beginRecognizeContentFromUrl("{form-url")
    .subscribe(response -> System.out.println("Status of long running operation: " + response.getStatus()));
```

If you are interested in getting the final result of a long running operation, you may use the `last()` operator on `PollerFlux` to wait until the last response is emitted by the poller flux and then inspect the status. If the status of the long running operation is successful, you can fetch the final result or throw an error if the operation failed as shown below:

```java
FormRecognizerAsyncClient formRecognizerAsyncClient = new FormRecognizerClientBuilder()
    .credential(new DefaultAzureCredentialBuilder().build())
    .buildAsyncClient();

CountDownLatch countDownLatch = new CountDownLatch(1);
formRecognizerAsyncClient.beginRecognizeContentFromUrl("{form-url")
    .last()
    .flatMap(response -> {
        if (LongRunningOperationStatus.SUCCESSFULLY_COMPLETED == response.getStatus()) {
            return response.getFinalResult();
        }
        return Mono.error(new IllegalStateException("Polling completed unsuccessfully with status:"
                + response.getStatus()));
    })
    .subscribe(formPages -> processFormPages(formPages),
        ex -> countDownLatch.countDown(),
        () -> countDownLatch.countDown());

countDownLatch.await();
}
```

In this example, we use `CountDownLatch` to wait until the long running operation is complete or if an error occurs. The `onError` and `onComplete` handlers both decrement the latch count to stop the program gracefully.

## Conclusion

Threads are expensive resources and should not be wasted waiting for response from remote service calls. As the adoption of microservices architecture increases, the need to scale and utilize resources efficiently becomes vital. Asynchronous APIs are favorable when there are network-bound operations. The new Azure SDK for Java offers a rich set of APIs for async operations to help maximize your system resources. We highly encourage you to try out our async clients.

If you need more information, you can [lookup which operator to use](https://projectreactor.io/docs/core/release/reference/#which-operator) that best suits your task at hand.

## Next steps

Now that you've familiarized yourself with the asynchronous programming functionality in the Azure SDK for Java, consider reviewing the [pagination and iteration](java-sdk-pagination.md) documentation to learn how to consume responses from Azure services where there is more than one returned value.
