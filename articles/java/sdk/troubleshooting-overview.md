---
title: Troubleshooting overview when you use the Azure SDK for Java
description: Provides an overview of how to troubleshoot issues related to using the Azure SDK for Java.
ms.date: 02/14/2025
ms.topic: concept-article
ms.custom: devx-track-java, devx-track-extended-java
author: KarlErickson
ms.author: karler
ms.reviewer: jogiles
---

# Troubleshooting overview for the Azure SDK for Java

This article introduces many troubleshooting tools available to you when you use the Azure SDK for Java, and links to other articles with further details.

The Azure SDK for Java consists of many client libraries - one or more for each Azure Service that exists. We ensure that all client libraries are built to a consistent, high standard, with common patterns for configuration, logging, exception handling, and troubleshooting. For more information, see [Use the Azure SDK for Java](overview.md).

Because troubleshooting can span such a wide subject area, we've developed the following troubleshooting guides that you may want to review:

* [Troubleshoot Azure Identity authentication issues](troubleshooting-authentication-overview.md) covers authentication failure investigation techniques, common errors for the credential types in the Azure Identity Java client library, and mitigation steps to resolve these errors.
* [Troubleshoot dependency version conflicts](troubleshooting-dependency-version-conflict.md) covers subjects related to diagnosing, mitigating, and minimizing dependency conflicts. These conflicts can arise when you use the Azure SDK for Java client libraries in systems that are built with tools such as Maven and Gradle.
* [Troubleshoot networking issues](troubleshooting-network.md) covers subjects related to HTTP debugging outside of the client library, using tools like Fiddler and Wireshark.

Along with these general troubleshooting guides, we also provide library-specific troubleshooting guides. Right now, the following guides are available:

* [Troubleshoot Azure Event Hubs](troubleshooting-messaging-event-hubs-overview.md)
* [Troubleshoot Azure Service Bus](troubleshooting-messaging-service-bus-overview.md)

Beyond these documents, the following content provides guidance on making the best use of logging and exception handling as it relates to the Azure SDK for Java.

## Use logging in the Azure SDK for Java

The following sections describe how to enable different kinds of logging.

### Enable client logging

To troubleshoot issues, it's important to first enable logging to monitor the behavior of your application. The errors and warnings in the logs generally provide useful insights into what went wrong and sometimes include corrective actions to fix issues. The Azure SDK for Java has comprehensive logging support. For more information, see [Configure logging in the Azure SDK for Java](logging-overview.md).

### Enable HTTP request/response logging

When troubleshooting issues, it's useful to review HTTP requests as they're sent and received between Azure services. To enable logging the HTTP request and response payload, you can configure almost all Azure SDK for Java client libraries in their client builders as shown in the following example. In particular, pay special attention to the `httpLogOptions` method on the client builder, and the enum values available in `HttpLogDetailLevel`.

```java
ConfigurationClient configurationClient = new ConfigurationClientBuilder()
        .connectionString(connectionString)
        .httpLogOptions(new HttpLogOptions().setLogLevel(HttpLogDetailLevel.BODY_AND_HEADERS))
        .buildClient();
```

This code changes the HTTP request/response logging for a single client instance. Alternatively, you can configure logging HTTP requests and responses for your entire application by setting the `AZURE_HTTP_LOG_DETAIL_LEVEL` environment variable to one of the values in the following table. It's important to note that this change enables logging for every Azure client that supports logging HTTP request/response.

| Value              | Logging level                                                        |
|--------------------|----------------------------------------------------------------------|
| `none`             | HTTP request/response logging is disabled.                           |
| `basic`            | Logs only URLs, HTTP methods, and time to finish the request.        |
| `headers`          | Logs everything in BASIC, plus all the request and response headers. |
| `body`             | Logs everything in BASIC, plus all the request and response body.    |
| `body_and_headers` | Logs everything in HEADERS and BODY.                                 |

> [!NOTE]
> When you log request and response bodies, ensure that they don't contain confidential information. When you log query parameters and headers, the client library has a default set of query parameters and headers that are considered safe to log. It's possible to add additional query parameters and headers that are safe to log, as shown in the following example:
>
> ```java
> clientBuilder.httpLogOptions(new HttpLogOptions()
>     .addAllowedHeaderName("safe-to-log-header-name")
>     .addAllowedQueryParamName("safe-to-log-query-parameter-name"))
> ```

## Exception handling in the Azure SDK for Java

Most Azure SDK for Java client service methods throw an [HttpResponseException](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/core/azure-core/src/main/java/com/azure/core/exception/HttpResponseException.java) or a more-specific subclass on failure. The `HttpResponseException` type includes a detailed response error object that provides specific useful insights into what went wrong and includes corrective actions to fix common issues. You can find this error information inside the message property of the `HttpResponseException` object. Because these exceptions are runtime exceptions, the JavaDoc reference documentation doesn't explicitly call them out.

The following example shows you how to catch this exception with a synchronous client:

```java
try {
    ConfigurationSetting setting = new ConfigurationSetting().setKey("myKey").setValue("myValue");
    client.getConfigurationSetting(setting);
} catch (HttpResponseException e) {
    System.out.println(e.getMessage());
    // Do something with the exception
}
```

With asynchronous clients, you can catch and handle exceptions in the error callbacks, as shown in the following example:

```java
ConfigurationSetting setting = new ConfigurationSetting().setKey("myKey").setValue("myValue");
asyncClient.getConfigurationSetting(setting)
    .doOnSuccess(ignored -> System.out.println("Success!"))
    .doOnError(
        error -> error instanceof ResourceNotFoundException,
        error -> System.out.println("Exception: 'getConfigurationSetting' could not be performed."));
```

## Use tracing in the Azure SDK for Java

The Azure SDK for Java offers comprehensive tracing support, enabling you to see the flow of execution through your application code and the client libraries you're using. You can enable tracing in Azure client libraries by using and configuring the [OpenTelemetry](https://opentelemetry.io) SDK or by using an OpenTelemetry-compatible agent. OpenTelemetry is a popular open-source observability framework for generating, capturing, and collecting telemetry data for cloud-native software.

For more information on how to enable tracing in the Azure SDK for Java, see [Configure tracing in the Azure SDK for Java](tracing.md).

## Next steps

If the troubleshooting guidance in this article doesn't help to resolve issues when you use the Azure SDK for Java client libraries, we recommended that you [file an issue](https://github.com/Azure/azure-sdk-for-java/issues/new/choose) in the [Azure SDK for Java GitHub repository](https://github.com/Azure/azure-sdk-for-java).
