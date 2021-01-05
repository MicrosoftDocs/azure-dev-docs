---
title: Tracing
description: An overview of the Azure SDK for Java concepts related to tracing
ms.date: 11/23/2020
ms.topic: conceptual
ms.custom: devx-track-java
---

# Tracing

The Azure SDK for Java enables tracing in all client libraries by simply including a dependency on the [OpenTelemetery](https://opentelemetry.io/)-based `azure-core-tracing-opentelemetry` [plugin](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/core/azure-core-tracing-opentelemetry#azure-tracing-opentelemetry-client-library-for-java). OpenTelemetry is a popular open-source observability framework for generating, capturing, and collecting telemetry data for cloud-native software.

There are two key concepts related to tracing: **span** and **trace**. A span represents a single operation in a trace. A span could be representative of an HTTP request, a remote procedure call (RPC), a database query, or even the path that a code takes. A trace is a tree of spans showing the path of work through a system. A trace on its own is distinguishable by a unique 16 byte sequence called a TraceID. Further details on these concepts, and how they relate to OpenTelemetry can be found on the [OpenTelemetry Documentation](https://opentelemetry.io/docs/) site.

There are two ways to enable tracing in the Azure client libraries for Java:

1. By enabling functionality built into the Azure SDK for Java.
2. By enabling an in-process agent to gather tracing data and submit it without any code changes.

## Enabling tracing in Azure SDK for Java

Enabling tracing for all Azure Java client libraries is simple: all developers need to do is add the `azure-core-tracing-opentelemetry` and `opentelemetry-sdk` dependencies to their application. For example, in Maven we would see the following:

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

By adding this dependency, tracing will be enabled, with traces included with all HTTP requests. There are now two problems:

1. There is no integration with any incoming parent span.
2. The generated traces are not being exported anywhere for later analysis.

Let's work on these two issues now.

### Integrating parent spans

As noted above, including the dependencies will enable tracing within the Azure client libraries, but it will not integrate with any incoming tracing data, for example in an web environment where an incoming request results in a call into an Azure client library. To enable this, developers can create a root span in their application and pass it into the Azure client library calls, so that this may be encapsulated into appropriate outgoing requests to Azure services. This can be done by using the `Context` parameter on all client methods:

```java
// The 'span' given in this context is the parent span key received from the incoming request
Context traceContext = new Context(PARENT_SPAN_KEY, span);

// in this sample code, we are passing a new configuration setting to a service, but also including
// the traceContext from above, so that it may be picked up by the http transport and included as appropriate.
appConfigClient.setConfigurationSettingWithResponse(new ConfigurationSetting().setKey("hello").setValue("world"), true, traceContext);
```

In cases where no parent span is provided, a new parent span will be created to encapsulate all the client libraries outgoing requests. Note that for each call into an Azure client library method, two spans are created: one tracing the progression through the client libraries, and the other tracing the outgoing HTTP request span.

#### Tracer Span Attributes

In addition to [OpenTelemetry's required standard attributes](https://github.com/open-telemetry/opentelemetry-specification/blob/e9340d74f1ba0b651b3581d6bd5df6a92b772e18/semantic-conventions.md), the Azure client libraries annotate the spans with the attributes mentioned below:

* `az.namespace`: Microsoft resource provider [namespaces](https://docs.microsoft.com/azure/azure-resource-manager/management/azure-services-resource-providers) mapped to Azure services.
* `x-ms-request-id`: The unique identifier for the request.
* `span.kind`: Describes the relationship between the span, its parents, and its children in a trace.
* `span.status.message`: Represents the status of a finished span.
* `span.status.code`: Represents the status code of a finished span.

Additional metadata about the operation being performed is captured in the span names. The HTTP span names are set to the URI path value and the library method invocation span is of the form `<namespace qualified type>.<method name>`.

For example, an App Configuration client request to set Configuration setting i.e `appConfigClient.setConfigurationSettingWithResponse(new ConfigurationSetting().setKey("hello").setValue("world")` will result in the following two spans:

* Library method span named `AppConfig.setKey`.
* HTTP outgoing request span named `/kv/hello`.

### Configuring tracing exports

Applications that wish to make use of trace information must export traces to a distributed tracing store (such as [Zipkin](https://zipkin.io/), [Jaeger](https://www.jaegertracing.io/), and [Azure Monitor](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/monitor/microsoft-opentelemetry-exporter-azuremonitor#azure-monitor-opentelemetry-exporter-client-library-for-java)). Shown below is the Java code used to configure exporting of trace information to a Jaeger distributed tracing store running on localhost port 14250, using Jaeger-specific APIs:

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

## Enabling tracing with the in-process agent

Application Insights, a feature of [Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/overview), can be used for automatic collection and transmission of data for subsequent analysis of applications in large-scale distributed systems. This instrumentation monitors your application and directs the telemetry data to an [Azure Application Insights resource](https://docs.microsoft.com/azure/azure-monitor/app/app-insights-overview) using a unique GUID that is referred to as an 'Instrumentation Key'.

Through the use of a [Java in-process agent](https://docs.microsoft.com/azure/azure-monitor/app/java-in-process-agent), developers can enable monitoring of their applications without any code changes. In addition to this, developers will need to add the [azure-core-tracing-opentelemetry](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/core/azure-core-tracing-opentelemetry#azure-tracing-opentelemetry-client-library-for-java) dependency to their project. Once this is done, developers can use the Application Insights dashboard to instrument requests, collect performance counters, diagnose performance issues and exceptions, and write code to track what users do with within an application.

## Next steps

Now that you've familiarized yourself with the core cross-cutting functionality in the Azure SDK for Java, consider reviewing the [identity and authentication](java-sdk-identity-overview.md) overview to familiarize yourself with how developers can create secure applications.
