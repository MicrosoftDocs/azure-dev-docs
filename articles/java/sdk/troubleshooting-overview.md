---
title: Troubleshoot overview when using the Azure SDK for Java
description: An overview of how to troubleshoot issues related to using the Azure SDK for Java
ms.date: 08/16/2023
ms.topic: conceptual
ms.custom: devx-track-java, devx-track-extended-java
author: KarlErickson
ms.author: jogiles
---

# Troubleshooting Overview

The Azure SDK for Java consists of many client libraries, as we built one (or more!) libraries for each Azure Service that exists. We ensure that all client libraries are built to a consistent, high standard, with [common patterns](/azure/developer/java/sdk/overview) for configuration, logging, exception handling, and troubleshooting. This document introduces many troubleshooting tools available to you, and links to other pages with further details.

Because troubleshooting can span such a wide topic area, we have developed the following troubleshooting guides you may want to review:

* [Authentication troubleshooting](/azure/developer/java/sdk/troubleshooting-authentication) covers authentication failure investigation techniques, common errors for the credential types in the Azure Identity Java client library, and mitigation steps to resolve these errors.
* [Dependency conflicts](/azure/developer/java/sdk/troubleshooting-dependency-version-conflict) covers topics related to diagnosing, mitigating, and minimizing dependency conflicts, when using the Azure SDK for Java client libraries in systems that are built with tools such as Maven and Gradle.
* [Network issues](/azure/developer/java/sdk/troubleshooting-network) covers topics related to HTTP debugging *outside* of the client library, using tools like Fiddler and Wireshark.

Beyond these documents, the following content gives guidance on making the best use of logging and exception handling, as it relates to the Azure SDK for Java.

## Logging in the Azure SDK for Java

### Enabling client logging

To troubleshoot issues, it is important to first enable logging to monitor the behavior of your application. The errors and warnings in the logs generally provide useful insights into what went wrong and sometimes include corrective actions to fix issues. The Azure SDK for Java has comprehensive logging support, with [conceptual documentation on logging configuration for various logging frameworks][logging_overview].

### Enabling HTTP request / response logging

Reviewing HTTP requests as they are sent and received between Azure services can be useful in troubleshooting issues. To enable logging the HTTP request and response payload, almost all Azure SDK for Java client libraries can be configured in their client builders as shown. In particular, pay special attention to the `httpLogOptions` method on the client builder, as well as the available enum values available in `HttpLogDetailLevel`:

```java
ConfigurationClient configurationClient = new ConfigurationClientBuilder()
        .connectionString(connectionString)
        .httpLogOptions(new HttpLogOptions().setLogLevel(HttpLogDetailLevel.BODY_AND_HEADERS))
        .buildClient();
```

The above code changes the http request / response logging for a single client instance. Alternatively, you can configure logging HTTP requests and responses for your entire application by setting the `AZURE_HTTP_LOG_DETAIL_LEVEL` environment variable. It is important to note that this change enables logging for every Azure client that supports logging HTTP request/response.

| Value            | Logging level                                                        |
|------------------|----------------------------------------------------------------------|
| none             | HTTP request/response logging is disabled                            |
| basic            | Logs only URLs, HTTP methods, and time to finish the request.        |
| headers          | Logs everything in BASIC, plus all the request and response headers. |
| body             | Logs everything in BASIC, plus all the request and response body.    |
| body_and_headers | Logs everything in HEADERS and BODY.                                 |

**NOTE**: When logging request and response bodies, please ensure that they do not contain confidential information. When logging headers, the client library has a default set of headers that are considered safe to log. It is possible to add additional headers that are safe to log:

```java
clientBuilder.httpLogOptions(new HttpLogOptions().addAllowedHeaderName("safe-to-log-header-name"))
```

## Exception handling in the Azure SDK for Java

Most Azure SDK for Java client service methods throw a [HttpResponseException][http_response_exception] or a more-specific subclass on failure. The `HttpResponseException` type includes detailed response error object that provides specific useful insights into what went wrong and includes corrective actions to fix common issues. This error information can be found inside the message property of the `HttpResponseException` object. Because these exception are runtime exceptions, JavaDoc reference documentation does not explicitly call them out.

Here's the example of how to catch it with a synchronous client

```java
try {
    ConfigurationSetting setting = new ConfigurationSetting().setKey("myKey").setValue("myValue");
    client.getConfigurationSetting(setting);
} catch (HttpResponseException e) {
    System.out.println(e.getMessage());
    // Do something with the exception
}
```

With asynchronous clients, you can catch and handle exceptions in the error callbacks:

```java readme-sample-troubleshootingExceptions-async
ConfigurationSetting setting = new ConfigurationSetting().setKey("myKey").setValue("myValue");
asyncClient.getConfigurationSetting(setting)
    .doOnSuccess(ignored -> System.out.println("Success!"))
    .doOnError(
        error -> error instanceof ResourceNotFoundException,
        error -> System.out.println("Exception: 'getConfigurationSetting' could not be performed."));
```

## Tracing in the Azure SDK for Java

The Azure SDK for Java offers comprehensive tracing support, allowing you to see the flow of execution through your application code, as well as the client libraries you're using. You can enable tracing in Azure client libraries by using and configuring the [OpenTelemetry](https://opentelemetry.io) SDK or using an OpenTelemetry-compatible agent. OpenTelemetry is a popular open-source observability framework for generating, capturing, and collecting telemetry data for cloud-native software.

For more detailed information on how to enable tracing in the Azure SDK for Java, see the [Azure SDK for Java tracing documentation](/azure/developer/java/sdk/tracing).

## Next Steps

If the troubleshooting guidance above does not help to resolve issues when using the Azure SDK for Java client libraries, it is recommended that you reach out to the development team by [filing an issue on the projects GitHub page][azsdkjava_github_repo].

<!-- LINKS -->
[azsdkjava_github_repo]: https://github.com/Azure/azure-sdk-for-java
[logging_overview]:/azure/developer/java/sdk/logging-overview
[http_response_exception]: https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/core/azure-core/src/main/java/com/azure/core/exception/HttpResponseException.java