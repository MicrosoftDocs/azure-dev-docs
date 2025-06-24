---
title: Configure tracing in the Azure SDK for Java
description: Provides an overview of the Azure SDK for Java concepts related to tracing.
ms.date: 04/01/2025 
ms.topic: how-to
ms.custom: devx-track-java, devx-track-extended-java
author: KarlErickson
ms.author: karler
ms.reviewer: savaity
---

# Configure tracing in the Azure SDK for Java

This article provides an overview of how to configure the Azure SDK for Java to integrate tracing functionality.

You can enable tracing in Azure client libraries by using and configuring the OpenTelemetry SDK or using an OpenTelemetry-compatible agent. OpenTelemetry is a popular open-source observability framework for generating, capturing, and collecting telemetry data for cloud-native software.

There are two key concepts related to tracing: **span** and **trace**. A span represents a single operation in a trace. A span can represent an HTTP request, a remote procedure call (RPC), a database query, or even the path that your code takes. A trace is a tree of spans showing the path of work through a system. You can distinguish a trace on its own by a unique 16-byte sequence called a TraceID. For more information on these concepts and how they relate to OpenTelemetry, see the [OpenTelemetry documentation](https://opentelemetry.io/docs/).

## Azure SDK tracing with Azure Monitor Java agent

By using an Azure Monitor Java in-process agent, you can enable monitoring of your applications without any code changes. For more information, see [Azure Monitor OpenTelemetry-based auto-instrumentation for Java applications](/azure/azure-monitor/app/java-in-process-agent). Azure SDK support is enabled by default starting with agent version 3.2.

## Tracing Azure SDK calls with OpenTelemetry agent

If you use [OpenTelemetry Java agent](https://github.com/open-telemetry/opentelemetry-java-instrumentation/), Azure SDK instrumentation is enabled out-of-the-box starting from version 1.12.0.

For more details on how to configure exporters, add manual instrumentation, or enrich telemetry, see [OpenTelemetry Instrumentation for Java](https://github.com/open-telemetry/opentelemetry-java-instrumentation).

> [!NOTE]
> OpenTelemetry agent artifact is stable, but does not provide over-the-wire telemetry stability guarantees, which may cause span names and attribute names produced by Azure SDK that might change over time if you update the agent. For more information, see [Compatibility requirements](https://github.com/open-telemetry/opentelemetry-java-instrumentation/blob/main/VERSIONING.md#compatibility-requirements).

### Manually instrument the application with OpenTelemetry SDK (preview)

If you use OpenTelemetry SDK directly, make sure to configure SDK and exporter for the backend of your choice. For more information, see [OpenTelemetry documentation](https://opentelemetry.io/docs/instrumentation/java/manual_instrumentation/).

To enable Azure SDK tracing, add the latest `com.azure:azure-core-tracing-opentelemetry` packages to your application. For example, in Maven, add the following entry to your **pom.xml** file:

```xml
<dependency>
  <groupId>com.azure</groupId>
  <artifactId>azure-core-tracing-opentelemetry</artifactId>
</dependency>
```

If you run the application now, you should get Azure SDK spans on your backend. However with asynchronous calls, the correlation between Azure SDK and application spans may be broken.

By default, Azure SDK uses `io.opentelemetry.context.Context.current()`, implicitly propagated by OpenTelemetry, as a parent to new spans. In asynchronous calls, implicit context propagation breaks. OpenTelemetry agents solve this problem by helping context propagate, but the OpenTelemetry SDK doesn't have such capabilities.

### Pass trace context explicitly

Azure SDK allows passing trace context explicitly through `com.azure.core.util.Context` under the `trace-context` key. When you provide explicit trace context, Azure SDK uses it instead of the implicit one, which enables correlation between application and Azure SDK spans.

In the following example, when an incoming web request is traced manually, the Application Configuration Client Library is called asynchronously in the scope of this request.

```java
Span span = TRACER.spanBuilder("incoming request").startSpan();
io.opentelemetry.context.Context traceContext = io.opentelemetry.context.Context.root().with(span);

// Put the incoming-request span (wrapped into the OpenTelemetry Context) into the Azure SDK Context
// and pass it over to the Application Configuration call.
appConfigClient.setConfigurationSettingWithResponse(settings, true, new com.azure.core.util.Context("trace-context", traceContext));

// You could also pass the context using the reactor `contextWrite` method under the same `trace-context` key.
appConfigAsyncClient.setConfigurationSettingWithResponse(settings)
   .contextWrite(reactor.util.context.Context.of("trace-context", traceContext))

//...
```

#### Azure SDK tracing conventions

To find out which spans and attributes the SDK emits, see the [Azure SDK semantic conventions specification](https://github.com/Azure/azure-sdk/blob/main/docs/tracing/distributed-tracing-conventions.yml). Azure SDK (and OpenTelemetry) semantic conventions are not stable and may change in the future.

## Next steps

Now that you're familiar with the core cross-cutting functionality in the Azure SDK for Java, see [Azure authentication with Java and Azure Identity](authentication/overview.md) to learn how you can create secure applications.
