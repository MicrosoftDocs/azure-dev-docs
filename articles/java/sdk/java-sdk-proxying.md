---
title: Proxying
description: An overview of the Azure SDK for Java concepts related to proxying
ms.date: 11/23/2020
ms.topic: conceptual
ms.custom: devx-track-java
---

# Proxying

## HTTP proxy configuration

The Azure client libraries for Java offer multiple ways to configure a proxy for an `HttpClient`. Each method of supplying a proxy has its own pros and cons and
provides different levels of encapsulation. Once a proxy has been configured for an `HttpClient` it will use the proxy for the remainder of its lifetime. Having the proxy tied to an individual `HttpClient` allows for multiple `HttpClient` to be used in an application where each can use a different proxy to accomplish an
applications proxying requirements.

The proxy configuration options are:

- [Proxying](#proxying)
  - [HTTP proxy configuration](#http-proxy-configuration)
    - [Using an environment proxy](#using-an-environment-proxy)
    - [Using a Configuration proxy](#using-a-configuration-proxy)
    - [Using an explicit proxy](#using-an-explicit-proxy)
  - [Next steps](#next-steps)

### Using an environment proxy

HTTP client builders, by default, will inspect the environment for proxy configurations. This makes use of the Azure SDK for Java `Configuration` APIs. By default, whenever a client is created, it is configured with a copy of the 'global configuration' retrieved by calling `Configuration.getGlobalConfiguration()`. This will read in from the system environment any HTTP proxy configuration.

When the environment is inspected it will search for the following environment configurations in the order specified:

1. `HTTPS_PROXY`
2. `HTTP_PROXY`
3. `https.proxy*`
4. `http.proxy*`

Where `*` is the [well-known Java](https://docs.oracle.com/javase/8/docs/technotes/guides/net/proxies.html) proxy properties.

If any of the environment configurations are found a `ProxyOptions` instance will be created (by calling `ProxyOptions.fromConfiguration(Configuration.getGlobalConfiguration())`). More details about the `ProxyOptions` type are provided later in this document.

> **Note:** Java requires that the system environment property `java.net.useSystemProxies` must be `true` for any proxy configuration to be used.

If the system environment variables contain proxy configuration, but this is not desired to be used when creating an HTTP client instance, it is possible to override the default behavior by explicitly setting a differently-configured `Configuration` when in the builder of a HTTP client, as setting a `Configuration` means that the default behavior of calling `Configuration.getGlobalConfiguration()` will no longer occur. For example, by calling the `configuration(Configuration)` API using `Configuration.NONE`, developers are explicitly preventing the builder from inspecting the environment for configuration.

**_Example_**

This example uses the `HTTP_PROXY` environment variable with value `localhost:8888` to use Fiddler as the proxy. It demonstrates creating a Netty and an OkHttp HTTP client (for more information on HTTP client configuration, refer to the [HTTP clients & pipeline](java-sdk-http-client-pipeline.md) document).

```bash
export HTTP_PROXY=localhost:8888
```

```java
HttpClient nettyHttpClient = new NettyAsyncHttpClientBuilder().build();
HttpClient okhttpHttpClient = new OkHttpAsyncHttpClientBuilder().build();
```

To prevent the environment proxy from being used configure the HTTP client builder with `Configuration.NONE`.

```java
HttpClient nettyHttpClient = new NettyAsyncHttpClientBuilder()
    .configuration(Configuration.NONE)
    .build();

HttpClient okhttpHttpClient = new OkHttpAsyncHttpClientBuilder()
    .configuration(Configuration.NONE)
    .build();
```

### Using a Configuration proxy

Rather than read from the environment, HTTP client builders may be configured to use a custom `Configuration`, configured with the same proxy configuration settings that are already accepted from the environment. This offers the ability to have reusable configurations that are scoped to a limited use case. When the HTTP client builder is building the `HttpClient` it will use the `ProxyOptions` returned from `ProxyOptions.fromConfiguration(<Configuration passed into the builder>)`.

**_Example_**

This example uses the `http.proxy*` configurations set in a `Configuration` object to use a proxy authenticating Fiddler as the proxy.

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

### Using an explicit proxy

The Java client libraries ships with a `ProxyOptions` class that acts as the Azure client libraries type for configuring a proxy. `ProxyOptions` is able to be configured with the network protocol used to send proxy requests, the proxy address, proxy authentication credentials, and non-proxying hosts. Only the proxy network protocol and proxy address are required. When using authentication credentials both the username and password must be set.

**_Examples_**

This example creates a simple `ProxyOptions` instance that proxies requests to the default Fiddler address (`localhost:8888`):

```java
ProxyOptions proxyOptions = new ProxyOptions(ProxyOptions.HTTP, new InetSocketAddress("localhost", 8888));
```

This example creates an authenticated `ProxyOptions` that proxies requests to a Fiddler instance requiring proxy authentication:

```java
// Fiddler uses username "1" and password "1" with basic authentication as its proxy authentication requirement.
ProxyOptions proxyOptions = new ProxyOptions(ProxyOptions.HTTP, new InetSocketAddess("localhost", 8888))
    .setCredentials("1", "1");
```

HTTP client builders may be configured with `ProxyOptions` directly to indicate an explicit proxy to use. This is the most granular way to provide a proxy and
generally isn't as flexible as passing a `Configuration` that can be mutated to update proxying requirements.

**_Example_**

This example uses `ProxyOptions` to use Fiddler as the proxy.

```java
ProxyOptions proxyOptions = new ProxyOptions(ProxyOptions.HTTP, new InetSocketAddress("localhost", 8888));

HttpClient nettyHttpClient = new NettyAsyncHttpClientBuilder()
    .proxy(proxyOptions)
    .build();

HttpClient okhttpHttpClient = new OkHttpAsyncHttpClientBuilder()
    .proxy(proxyOptions)
    .build();
```

## Next steps

Now that you've familiarized yourself with the proxy configuration in the Azure SDK for Java, consider reviewing how to enable [tracing](java-sdk-tracing.md) to better understand flows within your application, and to help diagnose issues.
