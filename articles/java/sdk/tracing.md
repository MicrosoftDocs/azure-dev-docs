---
title: Configure tracing in the Azure SDK for Java
description: An overview of the Azure SDK for Java concepts related to tracing
ms.date: 02/02/2021
ms.topic: conceptual
ms.custom: devx-track-java
ms.author: savaity
---

# Configure tracing in the Azure SDK for Java

This article provides an overview of how to configure the Azure SDK for Java to integrate tracing functionality.

OpenTelemetry is a popular open-source observability framework for generating, capturing, and collecting telemetry data for cloud-native software.

There are two key concepts related to tracing: **span** and **trace**. A span represents a single operation in a trace. A span can represent an HTTP request, a remote procedure call (RPC), a database query, or even the path that your code takes. A trace is a tree of spans showing the path of work through a system. You can distinguish a trace on its own by a unique 16-byte sequence called a TraceID. For more information on these concepts and how they relate to OpenTelemetry, see the [OpenTelemetry documentation](https://opentelemetry.io/docs/).

You can enable tracing in Azure client libraries using and configuring OpenTelemetry SDK or using OpenTelemetry-compatible agent.

## Azure SDK tracing with Azure Monitor Java agent

By using a [Azure Monitor Java in-process agent](https://docs.microsoft.com/azure/azure-monitor/app/java-in-process-agent), you can enable monitoring of your applications without any code changes - Azure SDK support is enabled by default starting with agent version 3.2.

## Tracing Azure SDK calls with OpenTelemetry agent of SDK (preview)

To enable Azure SDK tracing, add latest [com.azure:azure-core-tracing-opentelemetry](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/core/azure-core-tracing-opentelemetry#azure-tracing-opentelemetry-client-library-for-java) packages to your application, for example, in Maven add:

```xml
<dependency>
  <groupId>com.azure</groupId>
  <artifactId>azure-core-tracing-opentelemetry</artifactId>
  <version>{latest version}</version>
</dependency>
```

If you use OpenTelemetry agent, that's it - you should start getting spans from Azure SDKs. [Agent documentation](https://github.com/open-telemetry/opentelemetry-java-instrumentation) covers more details on how to configure exporters, add manual instrumentation or enrich telemetry.

### Manually instrumenting the application with OpenTelemetry SDK

If you use OpenTelemetry SDK directly, make sure to configure SDK and exporter for the backend of your choice. For more information, see [OpenTelemetry documentation](https://opentelemetry.io/docs/instrumentation/java/manual_instrumentation/).

If you run the application now, you should get Azure SDK spans on your backend. However with asynchronous calls, correlation between Azure SDK and application spans may be broken.
By default, Azure SDK uses `io.opentelemetry.context.Context.current()` implicitly propagated by OpenTelemetry as a parent to new spans. In asynchronous calls, implicit context propagation breaks. OpenTelemetry agents solve this problem by helping context propagate, but OpenTelemetry SDK doesn't have such capabilities.

### Pass trace context explicitly

Azure SDK allows passing trace context explicitly through `com.azure.core.util.Context` under `trace-context` key. When explicit trace context is provided, Azure SDK uses it instead of the implicit one, which enables correlation between application and Azure SDK spans.

**Example:** incoming web request is traced manually, Application Configuration Client Library is called asynchronously in scope of this request.

```java
Span span = TRACER.spanBuilder("incoming request").startSpan();
io.opentelemetry.context.Context traceContext = io.opentelemetry.context.Context.root().with(span);

// put get the incoming-request span (wrapped into the OpenTelemetry Context) into Azure SDK Context
// and pass it over to Application Configuration call
appConfigClient.setConfigurationSettingWithResponse(settings, true, new com.azure.core.util.Context("trace-context", traceContext));

// you could also pass the context using reactor `contextWrite` method under the same `trace-context` key.
appConfigAsyncClient.setConfigurationSettingWithResponse(settings)
   .contextWrite(reactor.util.context.Context.of("trace-context", traceContext))

//...
```

#### Azure SDK tracing conventions

Check out [Azure SDK semantic conventions specification](https://github.com/Azure/azure-sdk/blob/main/docs/tracing/distributed-tracing-conventions.yml) to find out which spans and attributes SDK emits. Azure SDK (and OpenTelemetry) semantic conventions are not stable and may change in the future.

## Next steps

Now that you're familiar with the core cross-cutting functionality in the Azure SDK for Java, see [Azure authentication with Java and Azure Identity](identity.md) to learn how you can create secure applications.
