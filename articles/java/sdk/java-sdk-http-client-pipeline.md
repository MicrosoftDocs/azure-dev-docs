---
title: HTTP clients & pipelines in the Azure SDK for Java
description: An overview of the Azure SDK for Java concepts related to HTTP clients and pipelines
author: srnagar
ms.date: 01/06/2021
ms.topic: conceptual
ms.custom: devx-track-java
ms.author: srnagar
---

# HTTP clients & pipelines in the Azure SDK for Java

This article provides an overview of using the HTTP client and pipeline functionality within the Azure SDK for Java. This functionality provides a consistent, powerful, and flexible developer experience for developers using all Azure SDK for Java libraries.

## HTTP clients

The Azure SDK for Java is implemented using an `HttpClient` abstraction. This abstraction enables a pluggable architecture that accepts multiple HTTP client libraries or custom implementations when the need arises. However, to make dependency management simpler for most users, all Azure client libraries depend on `azure-core-http-netty`. Therefore, the [Netty](https://netty.io) HTTP client is the default client used in all Azure libraries for Java.

Despite Netty being the default HTTP client, there are three implementations available for your use, depending on which dependencies you already have in your project. These are implementations for:

* [Netty](https://netty.io)
* [OkHttp](https://square.github.io/okhttp/)
* The new [HttpClient](https://openjdk.java.net/groups/net/httpclient/intro.html) introduced in JDK 11

### Replacing the Default HTTP Client

You can remove the dependency on Netty if you prefer another implementation. To do this, you exclude the Netty dependency from the build configuration files. In a Maven *pom.xml* file, you exclude the Netty dependency and substitute another dependency.

The following example shows you how to exclude the Netty dependency from a real dependency on the `azure-security-keyvault-secrets` library. Depending on the libraries readers are using, be sure to exclude Netty from all appropriate `com.azure` libraries, as shown here:

```xml
<dependency>
    <groupId>com.azure</groupId>
    <artifactId>azure-security-keyvault-secrets</artifactId>
    <version>4.2.2.</version>
    <exclusions>
      <exclusion>
        <groupId>com.azure</groupId>
        <artifactId>azure-core-http-netty</artifactId>
      </exclusion>
    </exclusions>
</dependency>
```

```xml
<dependency>
  <groupId>com.azure</groupId>
  <artifactId>azure-core-http-okhttp</artifactId>
  <version>1.3.3</version>
</dependency>
```

> [!NOTE]
> If you remove the Netty dependency but provide no implementation in its place, the application will fail to start. An `HttpClient` implementation must exist on the classpath.

### Configuring HTTP clients

When you build a service client it will default to using `HttpClient.createDefault()`. This method returns a basic `HttpClient` instance based on the provided HTTP client implementation. In case you require a more complex `HttpClient`, such as a proxy, each implementation offers a builder that allows you to construct a configured `HttpClient`. The builders are `NettyAsyncHttpClientBuilder`, `OkHttpAsyncHttpClientBuilder`, and `JdkAsyncHttpClientBuilder`. These builders will share a common set of configurations, such as proxying and communication port, but will contain configurations that are specific to each implementation.

The following examples show you how to build `HttpClient` instances using Netty, OkHttp, and the JDK 11 HttpClient. These instances proxy through `http://localhost:3128` and authenticate with user `example` with password `weakPassword`.

```java
// Netty
HttpClient httpClient = new NettyAsyncHttpClientBuilder()
    .proxy(new ProxyOptions(ProxyOptions.Type.HTTP, new InetSocketAddress("localhost", 3128))
        .setCredentials("example", "weakPassword"))
    .build();

// OkHttp
HttpClient httpClient = new OkHttpAsyncHttpClientBuilder()
    .proxy(new ProxyOptions(ProxyOptions.Type.HTTP, new InetSocketAddress("localhost", 3128))
        .setCredentials("example", "weakPassword"))
    .build();

// JDK 11 HttpClient
HttpClient client = new JdkAsyncHttpClientBuilder()
    .proxy(new ProxyOptions(ProxyOptions.Type.HTTP, new InetSocketAddress("localhost", 3128))
        .setCredentials("example", "weakPassword"))
    .build();
```

You can now pass the constructed `HttpClient` instance into a service client builder to be used as the client it uses to communicate to the service. The following example uses the new `HttpClient` instance to build an Azure Storage Blob client.

```java
BlobClient blobClient = new BlobClientBuilder()
    .connectionString(<connection string>)
    .containerName("container")
    .blobName("blob")
    .httpClient(httpClient)
    .build();
```

For management libraries, you can set the `HttpClient` during Manager configuration.

```java
AzureResourceManager azureResourceManager = AzureResourceManager.configure()
    .withHttpClient(httpClient)
    .authenticate(credential, profile)
    .withDefaultSubscription();
```

## HTTP pipeline

The HTTP pipeline is one of the key components in achieving consistency and diagnosability in the Java client libraries for Azure, which are two of the core design principles for all Azure SDKs, whatever the language. An HTTP pipeline is composed of:

* HTTP Transport
* HTTP pipeline policies

You can provide your own custom HTTP pipeline when creating a client. If you don't provide a pipeline, the client library will create one with all of the common policies required for the specific service that the library represents.

### HTTP transport

The HTTP transport is responsible for establishing the connection to the server, as well as sending and receiving HTTP messages. The HTTP transport forms the gateway for the Azure SDK client libraries to interact with Azure services. As noted earlier in this article, The Azure SDK for Java uses [Netty](https://netty.io/) by default for its HTTP transport. However, the SDK also provides a pluggable HTTP Transport so you can use other implementations where appropriate. The SDK also provides two additional HTTP transport implementations for OkHttp and the HttpClient that ships with JDK 11 and later.

### HTTP pipeline policies

A pipeline consists of a sequence of steps that are executed for each HTTP request-response roundtrip. Each policy has a dedicated purpose and will act on a request or a response or sometimes both. Because all client libraries are built on a standard 'Azure Core' layer, this layer will be used to ensure that each policy is executed in order in the pipeline. On the onward journey (that is, while sending a request), the policies are executed in the order in which they are added to the pipeline. When a response is received from the service, the policies are executed in the reverse order. All policies added to the pipeline will be executed before the request is sent and after a response is received. The policy has to decide whether to act on the request, the response, or both. For example, a logging policy will log the request and response whereas the authentication policy is only interested in modifying the request.

The Azure Core framework will provide the policy with necessary request and response data along with any necessary context to execute the policy. The policy can then perform its operation with the given data and pass the control along to the next policy in the pipeline.

![HTTP pipeline diagram](./media/http-pipeline.svg)

### HTTP pipeline policy position

When you make HTTP requests to cloud services, it's important to handle transient failures and retry failed attempts. Because this functionality is frequently needed, Azure Core provides a retry policy that can watch for transient failures and automatically retry the request.

This retry policy, therefore, splits the whole pipeline into two parts: policies that are executed before the retry policy and policies that are executed after the retry policy. Policies that are added before the retry policy are executed only once per API operation and policies that are added after the retry policy will be executed as many times as the retries.

So, when building the HTTP pipeline, it's necessary to understand whether a policy should be executed each time a request is retried or if it's sufficient to execute it just once per API operation.

### Common HTTP pipeline policies

HTTP pipelines for REST-based services are generally configured with policies for authentication, retries, logging, telemetry and specifying request ID in the header. Azure Core is pre-loaded with these commonly required HTTP policies that can be added to the pipeline.

| Policy                | GitHub link        |
|-----------------------|--------------------|
| Retry Policy          | [RetryPolicy.java](https://github.com/Azure/azure-sdk-for-java/blob/master/sdk/core/azure-core/src/main/java/com/azure/core/http/policy/RetryPolicy.java) |
| Authentication Policy | [BearerTokenAuthenticationPolicy.java](https://github.com/Azure/azure-sdk-for-java/blob/master/sdk/core/azure-core/src/main/java/com/azure/core/http/policy/BearerTokenAuthenticationPolicy.java) |
| Logging Policy        | [HttpLoggingPolicy.java](https://github.com/Azure/azure-sdk-for-java/blob/master/sdk/core/azure-core/src/main/java/com/azure/core/http/policy/HttpLoggingPolicy.java) |
| Request ID Policy     | [RequestIdPolicy.java](https://github.com/Azure/azure-sdk-for-java/blob/master/sdk/core/azure-core/src/main/java/com/azure/core/http/policy/RequestIdPolicy.java) |
| Telemetry Policy      | [UserAgentPolicy.java](https://github.com/Azure/azure-sdk-for-java/blob/master/sdk/core/azure-core/src/main/java/com/azure/core/http/policy/UserAgentPolicy.java) |

### Custom HTTP pipeline policy

The HTTP pipeline policy provides a convenient mechanism to modify or decorate the request and response. Custom policies can be added to the pipeline that is either created by the user or by the client library developer. When adding the policy to the pipeline, you can specify whether this policy should be executed per-call or per-retry.

Creating a custom HTTP pipeline policy is as simple as extending a base policy type and implementing some abstract method. You can then plug the policy into the pipeline.

## Next steps

Now that you're familiar with HTTP client functionality in the Azure SDK for Java, consider reviewing the [proxying](java-sdk-proxying.md) documentation to learn how to further customize the HTTP client being used.
