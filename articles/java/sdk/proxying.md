---
title: Configure proxies in the Azure SDK for Java
description: Provides an overview of the Azure SDK for Java concepts related to proxying.
ms.date: 04/01/2025 
ms.topic: how-to
ms.custom: devx-track-java, devx-track-extended-java
author: KarlErickson
ms.author: karler
ms.reviewer: alzimmer
---

# Configure proxies in the Azure SDK for Java

This article provides an overview of how to configure the Azure SDK for Java to make proper use of proxies.

## HTTP proxy configuration

The Azure client libraries for Java offer multiple ways to configure a proxy for an `HttpClient`.

Each method of supplying a proxy has its own pros and cons and provides different levels of encapsulation. When you've configured a proxy for an `HttpClient`, it will use the proxy for the rest of its lifetime. Having the proxy tied to an individual `HttpClient` allows an application to use multiple `HttpClient` instances where each can use a different proxy to fulfill an application's proxying requirements.

The proxy configuration options are:

* [Use an environment proxy](#use-an-environment-proxy)
* [Use a Configuration proxy](#use-a-configuration-proxy)
* [Use an explicit proxy](#use-an-explicit-proxy)

### Use an environment proxy

By default, HTTP client builders will inspect the environment for proxy configurations. This process makes use of the Azure SDK for Java `Configuration` APIs. When the builder creates a client, it's configured with a copy of the 'global configuration' retrieved by calling `Configuration.getGlobalConfiguration()`. This call will read in any HTTP proxy configuration from the system environment.

When the builder inspects the environment, it will search for the following environment configurations in the order specified:

1. `HTTPS_PROXY`
2. `HTTP_PROXY`
3. `https.proxy*`
4. `http.proxy*`

The `*` represents the well-known Java proxy properties. For more information, see [Java Networking and Proxies](https://docs.oracle.com/javase/8/docs/technotes/guides/net/proxies.html) in the Oracle documentation.

If the builder finds any of the environment configurations, it creates a `ProxyOptions` instance by calling `ProxyOptions.fromConfiguration(Configuration.getGlobalConfiguration())`. This article provides more details below about the `ProxyOptions` type.

> [!Important]
> To use any proxy configuration, Java requires you to set the system environment property `java.net.useSystemProxies` to `true`.

You can also create an HTTP client instance that doesn't use any proxy configuration present in the system environment variables. To override the default behavior, you explicitly set a differently-configured `Configuration` in the HTTP client builder. When you set a `Configuration` in the builder, it will no longer call `Configuration.getGlobalConfiguration()`. For example, if you call `configuration(Configuration)` using `Configuration.NONE`, you can explicitly prevent the builder from inspecting the environment for configuration.

The following example uses the `HTTP_PROXY` environment variable with value `localhost:8888` to use Fiddler as the proxy. This code demonstrates creating a Netty and an OkHttp HTTP client. (For more information on HTTP client configuration, see [HTTP clients and pipelines](http-client-pipeline.md).)

```bash
export HTTP_PROXY=localhost:8888
```

```java
HttpClient nettyHttpClient = new NettyAsyncHttpClientBuilder().build();
HttpClient okhttpHttpClient = new OkHttpAsyncHttpClientBuilder().build();
```

To prevent the environment proxy from being used, configure the HTTP client builder with `Configuration.NONE`, as shown in the following example:

```java
HttpClient nettyHttpClient = new NettyAsyncHttpClientBuilder()
    .configuration(Configuration.NONE)
    .build();

HttpClient okhttpHttpClient = new OkHttpAsyncHttpClientBuilder()
    .configuration(Configuration.NONE)
    .build();
```

### Use a Configuration proxy

Rather than read from the environment, you can configure HTTP client builders to use a custom `Configuration` with the same proxy settings that are already accepted from the environment. This configuration offers the ability to have reusable configurations that are scoped to a limited use case. When the HTTP client builder is building the `HttpClient`, it will use the `ProxyOptions` returned from `ProxyOptions.fromConfiguration(<Configuration passed into the builder>)`.

The following example uses the `http.proxy*` configurations set in a `Configuration` object to use a proxy that authenticates Fiddler as the proxy.

```java
Configuration configuration = new Configuration()
    .put("java.net.useSystemProxies", "true")
    .put("http.proxyHost", "localhost")
    .put("http.proxyPort", "8888")
    .put("http.proxyUser", "1")
    .put("http.proxyPassword", "1");

HttpClient nettyHttpClient = new NettyAsyncHttpClientBuilder()
    .configuration(configuration)
    .build();

HttpClient okhttpHttpClient = new OkHttpAsyncHttpClientBuilder()
    .configuration(configuration)
    .build();
```

### Use an explicit proxy

The Java client libraries ship with a `ProxyOptions` class that acts as the Azure client libraries type for configuring a proxy. You can configure `ProxyOptions` with the network protocol used to send proxy requests, the proxy address, proxy authentication credentials, and non-proxying hosts. Only the proxy network protocol and proxy address are required. When using authentication credentials, you must set both the username and password.

The following example creates a simple `ProxyOptions` instance that proxies requests to the default Fiddler address (`localhost:8888`):

```java
ProxyOptions proxyOptions = new ProxyOptions(ProxyOptions.Type.HTTP, new InetSocketAddress("localhost", 8888));
```

The following example creates an authenticated `ProxyOptions` that proxies requests to a Fiddler instance requiring proxy authentication:

```java
// Fiddler uses username "1" and password "1" with basic authentication as its proxy authentication requirement.
ProxyOptions proxyOptions = new ProxyOptions(ProxyOptions.Type.HTTP, new InetSocketAddress("localhost", 8888))
    .setCredentials("1", "1");
```

You can configure HTTP client builders with `ProxyOptions` directly to indicate an explicit proxy to use. This configuration is the most granular way to provide a proxy, and generally isn't as flexible as passing a `Configuration` that you can mutate to update proxying requirements.

The following example uses `ProxyOptions` to use Fiddler as the proxy:

```java
ProxyOptions proxyOptions = new ProxyOptions(ProxyOptions.Type.HTTP, new InetSocketAddress("localhost", 8888));

HttpClient nettyHttpClient = new NettyAsyncHttpClientBuilder()
    .proxy(proxyOptions)
    .build();

HttpClient okhttpHttpClient = new OkHttpAsyncHttpClientBuilder()
    .proxy(proxyOptions)
    .build();
```

## Next steps

Now that you're familiar with proxy configuration in the Azure SDK for Java, see [Configure tracing in the Azure SDK for Java](tracing.md) to better understand flows within your application, and to help diagnose issues.
