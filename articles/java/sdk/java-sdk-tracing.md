---
title: Configure tracing in the Azure SDK for Java
description: An overview of the Azure SDK for Java concepts related to tracing
author: samvaity
ms.date: 01/29/2021
ms.topic: conceptual
ms.custom: devx-track-java
ms.author: savaity
---

# Configure tracing in the Azure SDK for Java

This article provides an overview of how to configure the Azure SDK for Java to integrate tracing functionality.

The Azure SDK for Java enables tracing in all client libraries by including a dependency on the [OpenTelemetery](https://opentelemetry.io/)-based [azure-core-tracing-opentelemetry plugin](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/core/azure-core-tracing-opentelemetry#azure-tracing-opentelemetry-client-library-for-java). OpenTelemetry is a popular open-source observability framework for generating, capturing, and collecting telemetry data for cloud-native software.

There are two key concepts related to tracing: **span** and **trace**. A span represents a single operation in a trace. A span can represent an HTTP request, a remote procedure call (RPC), a database query, or even the path that your code takes. A trace is a tree of spans showing the path of work through a system. You can distinguish a trace on its own by a unique 16-byte sequence called a TraceID. For more information on these concepts and how they relate to OpenTelemetry, see the [OpenTelemetry documentation](https://opentelemetry.io/docs/).

There are two ways to enable tracing in the Azure client libraries for Java:

1. By enabling functionality built into the Azure SDK for Java.
2. By enabling an in-process agent to gather tracing data and submit it without any code changes.

## Enable tracing in the Azure SDK for Java

To enable tracing for all Azure Java client libraries, add the `azure-core-tracing-opentelemetry` and `opentelemetry-sdk` dependencies to your application. For example, in Maven, add the following dependencies:

```xml
<dependency>
  <groupId>com.azure</groupId>
  <artifactId>azure-core-tracing-opentelemetry</artifactId>
  <version>1.0.0-beta.6</version>
</dependency>

<dependency>
  <groupId>io.opentelemetry</groupId>
  <artifactId>opentelemetry-sdk</artifactId>
  <version>0.8.0</version>
</dependency>
```

By adding this dependency, tracing is enabled, with traces included with all HTTP requests. There are now two problems:

1. There's no integration with any incoming parent span.
2. The generated traces aren't being exported anywhere for later analysis.

The following sections address these problems.

### Integrate parent spans

As noted above, including the dependencies will enable tracing within the Azure client libraries. However, it won't integrate with any incoming tracing data, for example in a web environment where an incoming request results in a call into an Azure client library. To enable tracing, you can create a root span in your application and pass it into the Azure client library calls, so that this span may be encapsulated into appropriate outgoing requests to Azure services. You can accomplish this task by using the `Context` parameter on all client methods, as shown in the following example:

```java
// The 'span' given in this context is the parent span key received from the incoming request.
Context traceContext = new Context(PARENT_SPAN_KEY, span);

// This example code passes a new configuration setting to a service, but also includes
// the traceContext from above, so that it may be picked up by the http transport and included as appropriate.
appConfigClient.setConfigurationSettingWithResponse(new ConfigurationSetting().setKey("hello").setValue("world"), true, traceContext);
```

In cases where no parent span is provided, a new parent span is created to encapsulate all the client libraries outgoing requests. For each call into an Azure client library method, two spans are created: one tracing the progression through the client libraries, and the other tracing the outgoing HTTP request span.

#### Tracer span attributes

In addition to the required standard attributes documented in OpenTelemetry's [Semantic Conventions](https://github.com/open-telemetry/opentelemetry-specification/blob/e9340d74f1ba0b651b3581d6bd5df6a92b772e18/semantic-conventions.md)), the Azure client libraries annotate the spans with the following attributes:

* `az.namespace`: Microsoft resource provider [namespaces](/azure/azure-resource-manager/management/azure-services-resource-providers) mapped to Azure services.
* `x-ms-request-id`: The unique identifier for the request.
* `span.kind`: Describes the relationship between the span, its parents, and its children in a trace.
* `span.status.message`: Represents the status of a finished span.
* `span.status.code`: Represents the status code of a finished span.

More metadata about the operation being performed is captured in the span names. The HTTP span names are set to the URI path value and the library method invocation span is of the form `<namespace qualified type>.<method name>`.

For example, an App Configuration client request to set the Configuration setting - that is, `appConfigClient.setConfigurationSettingWithResponse(new ConfigurationSetting().setKey("hello").setValue("world")` - will result in the following two spans:

* A Library method span named `AppConfig.setKey`.
* An HTTP outgoing request span named `/kv/hello`.

### Configure tracing exports

Applications that wish to make use of trace information must export traces to a distributed tracing store (such as [Zipkin](https://zipkin.io/), [Jaeger](https://www.jaegertracing.io/), and [Azure Monitor](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/monitor/microsoft-opentelemetry-exporter-azuremonitor#azure-monitor-opentelemetry-exporter-client-library-for-java)). The following example configures the exporting of trace information to a Jaeger distributed tracing store running on localhost port 14250, using Jaeger-specific APIs:

```java
ManagedChannel channel = ManagedChannelBuilder.forAddress("localhost", 14250).usePlaintext().build();
JaegerGrpcSpanExporter exporter = JaegerGrpcSpanExporter.newBuilder()
    .setChannel(channel)
    .setServiceName("Sample")
    .setDeadline(0)
    .build();
TracerSdkFactory tracerSdkFactory = (TracerSdkFactory) OpenTelemetry.getTracerFactory();
tracerSdkFactory.addSpanProcessor(SimpleSpansProcessor.newBuilder(exporter).build());
```

## Enable tracing with the in-process agent

You can use Application Insights, a feature of [Azure Monitor](/azure/azure-monitor/overview), for automatic collection and transmission of data for later analysis of applications in large-scale distributed systems. This instrumentation monitors your application and directs the telemetry data to an [Azure Application Insights resource](/azure/azure-monitor/app/app-insights-overview) using a unique GUID that's referred to as an 'Instrumentation Key'.

By using a [Java in-process agent](/azure/azure-monitor/app/java-in-process-agent), you can enable monitoring of your applications without any code changes. Also, you'll need to add the [azure-core-tracing-opentelemetry](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/core/azure-core-tracing-opentelemetry#azure-tracing-opentelemetry-client-library-for-java) dependency to your project. After you complete this task, you can use the Application Insights dashboard to instrument requests, collect performance counters, diagnose performance issues and exceptions, and write code to track what users do with within an application.

## Next steps

Now that you're familiar with the core cross-cutting functionality in the Azure SDK for Java, see [Azure authentication with Java and Azure Identity](java-sdk-identity.md) to learn how you can create secure applications.
