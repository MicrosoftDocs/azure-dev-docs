---
title: HTTP Pipelines and Retries in the Azure SDK for C++
description: Understand how HTTP pipelines and retry mechanisms are implemented in the Azure SDK for C++. Learn to customize and troubleshoot request processing and failure recovery in their Azure applications. 
ms.topic: overview
ms.date: 5/08/2025
ms.custom: devx-track-cpp

#customer intent: As a developer, I want a comprehensive and easy-to-use SDK for Azure services so that I can efficiently integrate cloud capabilities into my C++ applications.

---

# HTTP Pipelines and retries in the Azure SDK for C++

The Azure SDK for C++ uses an HTTP pipeline architecture to process HTTP requests to Azure services. This document explains how HTTP pipelines work, how retry policies are implemented, and how you can customize them for your application needs.

## HTTP pipeline architecture

### What is an HTTP pipeline?

An HTTP pipeline is a stack of HTTP policies that get applied sequentially to process HTTP requests and responses. Each client in the Azure SDK has its own HTTP pipeline. The policies in the pipeline shape how HTTP requests are handled, including operations like:

- Adding authentication headers
- Request/response logging
- Retry logic for failed requests
- Telemetry collection
- Transport handling (actually sending the HTTP request)

The pipeline is split into two main parts:

1. **Per-call policies** - Execute once per API operation
2. **Per-retry policies** - Execute for each retry attempt

This structure ensures that appropriate policies (like authentication) only execute once per operation, while others (like logging) execute for each retry attempt.

### Policy ordering

A typical HTTP pipeline in the Azure SDK for C++ includes the following policies in order:

1. **Telemetry Policy** (per-call) - Adds Azure SDK telemetry information
2. **Request ID Policy** (per-call) - Ensures each request has a unique ID
3. **Service-specific Per-Call Policies** - Custom policies specific to a service
4. **Retry Policy** (per-call) - Implements retry logic
5. **Service-specific Per-Retry Policies** - Custom policies specific to a service that run on each retry
6. **Request Activity Policy** (per-retry) - Manages distributed tracing
7. **Log Policy** (per-retry) - Handles logging requests and responses
8. **Transport Policy** (per-retry) - Handles the actual sending of the HTTP request

:::image type="content" source="../media/http-pipeline.svg" alt-text="A diagram that shows the policy phases of the Azure SDK for C++ HTTP Pipeline." :::

## Retry policy

### How retries work

The retry policy is designed to handle transient failures that may occur when making HTTP requests to Azure services. When a request fails due to a transient error, the retry policy will:

1. Determine if the failure is retryable
2. Calculate an appropriate delay
3. Wait for that delay
4. Retry the request

The policy supports retrying on both transport-level failures (network issues) and certain HTTP status codes.

### Default retry behavior

By default, the retry policy is configured with:

- Maximum of three retry attempts
- Initial retry delay of 800 milliseconds
- Maximum retry delay of 60 seconds
- Retryable status codes: 408, 429, 500, 502, 503, 504

The retry delay uses an exponential backoff strategy with jitter:

- First retry: ~800 ms
- Second retry: ~1,600 ms
- Third retry: ~3,200 ms
- And so on, until max retry delay is reached

### When retries happen

The retry policy attempts to retry a request in the following scenarios:

1. **Transport failures**:
   - Network connectivity issues
   - Connection time-outs
   - DNS (Domain Name System) resolution failures

2. **HTTP status codes**:
   - 408 (Request time-out)
   - 429 (Too Many Requests)
   - 500 (Internal Server Error)
   - 502 (Bad Gateway)
   - 503 (Service Unavailable)
   - 504 (Gateway time-out)

3. **Service-specific retry logic**:
   - Some services like Storage implement specialized retry logic for failover scenarios

## Customizing retry behavior

You can customize the retry behavior when creating a client by modifying the `RetryOptions` in the client options.

### Example: customizing retry options

```cpp
#include <azure/storage/blobs.hpp>

int main() 
{
    // Create client options
    Azure::Storage::Blobs::BlobClientOptions options;
    
    // Modify retry options
    options.Retry.MaxRetries = 5;                                    // Increase max retries
    options.Retry.RetryDelay = std::chrono::milliseconds(1000);      // Set initial retry delay to 1 second
    options.Retry.MaxRetryDelay = std::chrono::seconds(30);          // Cap maximum retry delay at 30 seconds
    
    // Add a custom status code to retry on
    options.Retry.StatusCodes.insert(Azure::Core::Http::HttpStatusCode::Forbidden); // Retry on 403 errors
    
    // Create the client with custom retry options
    auto blobClient = Azure::Storage::Blobs::BlobClient::CreateFromConnectionString(
        connectionString,
        containerName,
        blobName,
        options);
    
    // Use the client...
}
```

## Adding custom policies

You can add custom policies to the HTTP pipeline to implement specialized behavior:

### Adding a per-operation policy

Per-operation policies are called once per API operation, regardless of how many retries are needed:

```cpp
class MyCustomPolicy final : public Azure::Core::Http::Policies::HttpPolicy {
public:
    ~MyCustomPolicy() override = default;
    std::unique_ptr<HttpPolicy> Clone() const override
    {
        return std::make_unique<MyCustomPolicy>(*this);
    }

    std::unique_ptr<Azure::Core::Http::RawResponse> Send(
        Azure::Core::Http::Request& request,
        Azure::Core::Http::Policies::NextHttpPolicy nextPolicy,
        Azure::Core::Context const& context) const override
    {
        // Custom logic before the request
        
        auto response = nextPolicy.Send(request, context);
        
        // Custom logic after the response
        
        return response;
    }
};

// Adding the policy to client options
Azure::Storage::Blobs::BlobClientOptions options;
options.PerOperationPolicies.emplace_back(std::make_unique<MyCustomPolicy>());
```

### Adding a per-retry policy

Per-retry policies are called for each retry attempt:

```cpp
// Similar implementation to above, but add to PerRetryPolicies
options.PerRetryPolicies.emplace_back(std::make_unique<MyCustomRetryPolicy>());
```

## Handling secondary endpoints

Some Azure services like Storage support secondary endpoints for high availability. The SDK includes support for automatic failover to secondary endpoints:

```cpp
Azure::Storage::Blobs::BlobClientOptions options;

// Configure secondary endpoint for Storage
std::string primaryUrl = blobClient.GetUrl();
std::string secondaryUrl = InferSecondaryUrl(primaryUrl); // Your logic to determine secondary URL
std::string secondaryHost = Azure::Core::Url(secondaryUrl).GetHost();

options.SecondaryHostForRetryReads = secondaryHost;
```

## Logging retry attempts

The HTTP pipeline includes built-in logging for retry attempts. You can configure the logging level to see information about retries:

```cpp
// Set log level to see retry information
Azure::Core::Diagnostics::Logger::SetLevel(Azure::Core::Diagnostics::Logger::Level::Informational);

// Set a custom log listener to capture logs
Azure::Core::Diagnostics::Logger::SetListener([](auto level, auto message) {
    std::cout << "Log [" << static_cast<int>(level) << "]: " << message << std::endl;
});
```

When a retry occurs, log entries appear like:

- "HTTP Transport error: [error details]"
- "HTTP Retry attempt #1 will be made in 800 ms."
- "HTTP status code 503 will be retried."

## Best practices

1. **Use default retry settings when possible**
   - The default settings are tuned for most scenarios and include best practices like exponential backoff

2. **Be careful with non-idempotent operations**
   - Consider limiting retries for operations that aren't safe to retry (like nonidempotent POST requests)

3. **Consider circuit breaker patterns**
   - For high-volume applications, implement circuit breaker patterns to prevent overwhelming services that are responding with errors

4. **Test retry scenarios**
   - Test your application's behavior when retries occur to ensure proper handling

5. **Monitor retry telemetry**
   - High retry rates might indicate underlying issues that should be addressed

## Advanced: pipeline internals

The HTTP pipeline is implemented in the `Azure::Core::Http::_internal::HttpPipeline` class, which manages the sequence of policy execution. When a request is made, the pipeline:

1. Starts with the first policy in the pipeline
2. Each policy processes the request and then passes it to the next policy
3. The last policy is typically the transport policy, which actually sends the request
4. The response then flows back through the policies in reverse order

The retry policy is special in that it can repeat the entire sequence of policies that come after it in the pipeline.

## Troubleshooting

If you're experiencing issues with retries:

1. **Enable informational logging**
   - Set the `AZURE_LOG_LEVEL` environment variable to `Informational` to see retry attempts

2. **Check for transport errors**
   - Network issues often manifest as transport exceptions

3. **Verify service health**
   - Persistent 500-level errors may indicate an Azure service issue

4. **Review request IDs**
   - Each request has a unique ID that can be used when working with Azure Support

5. **Check timeout settings**
   - Ensure your application's time-outs are compatible with the retry policy

## Related content

- [Azure SDK Design Guidelines](https://azure.github.io/azure-sdk/cpp_introduction.html)
- [Retry Pattern](/azure/architecture/patterns/retry)
- [Circuit Breaker Pattern](/azure/architecture/patterns/circuit-breaker)
