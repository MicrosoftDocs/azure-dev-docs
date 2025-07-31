---
title: HTTP pipeline and retries in the Azure SDK libraries for Python
description: Learn how requests and responses flow through the HTTP pipeline when using the Azure SDK for Python and how to create policies to modify the flow.
ms.date: 7/16/2025
ms.topic: conceptual
ms.custom: devx-track-python, py-fresh-zinc
---

# Understanding HTTP pipeline and retries in the Azure SDK for Python

When you make a call to any Azure service using the Azure SDK for Python—whether it's Blob Storage, Key Vault, Cosmos DB, or any other service—your request doesn't go directly to the Azure service. Instead, it flows through a sophisticated HTTP pipeline that handles critical cross-cutting concerns automatically.

Understanding how the HTTP pipeline works is essential for building robust, performant applications. The pipeline manages retries for transient failures, handles authentication, provides logging capabilities, and enables you to add custom behavior when needed. This knowledge helps you debug performance issues, optimize resiliency, and customize your application's interaction with Azure services.

## What is the HTTP pipeline?

The Azure SDK for Python uses an internal HTTP pipeline architecture to process all requests and responses. This pipeline consists of a series of policies that execute in sequence, each responsible for a specific aspect of the HTTP communication.
Think of the pipeline as a chain of processing steps:

```ascii
Client Request → Retry Policy → Authentication Policy → Logging Policy → HTTP Transport → Azure Service
                                                                                              ↓
Client Response ← Retry Policy ← Authentication Policy ← Logging Policy ← HTTP Transport ← Response
```

Each policy in the pipeline can:

- Modify the request before it's sent
- Process the response after it's received
- Perform actions like retrying failed requests
- Add headers, log information, or implement custom logic

## Key policies in the pipeline

The Azure SDK for Python includes several built-in policies that handle common scenarios:

- **RetryPolicy**: Automatically retries requests that fail due to transient errors. This policy implements intelligent retry logic with exponential backoff to avoid overwhelming services during outages.
- **BearerTokenCredentialPolicy**: Manages authentication by automatically acquiring and refreshing access tokens. This policy ensures your requests include valid authentication credentials without manual token management.
- **NetworkTraceLoggingPolicy**: Captures detailed information about HTTP requests and responses for debugging purposes. This policy is invaluable when troubleshooting communication issues.
- **HttpTransport**: The lowest layer of the pipeline that actually sends HTTP requests over the network. In the Azure SDK for Python, this is typically implemented using requests or aiohttp for asynchronous operations.

### Additional policies

- **RedirectPolicy**: Handles HTTP redirects automatically
- **DistributedTracingPolicy**: Integrates with distributed tracing systems for monitoring
- **ProxyPolicy**: Routes requests through HTTP proxies when configured
- **UserAgentPolicy**: Adds SDK version information to request headers

## Retry behavior

The Azure SDK for Python implements intelligent retry logic to handle transient failures automatically. Understanding this behavior helps you build more resilient applications.

### Automatically retried conditions

The SDK retries requests for these HTTP status codes:

- **408 Request Timeout**: The server timed out waiting for the request
- **429 Too Many Requests**: Rate limiting is in effect
- **500 Internal Server Error**: Temporary server issue
- **502 Bad Gateway**: Temporary network issue
- **503 Service Unavailable**: Service temporarily unavailable
- **504 Gateway Timeout**: Gateway or proxy timeout

### Default retry configuration

The default retry settings provide a good balance between resilience and performance:

- Maximum retry attempts: 3
- Retry mode: Exponential backoff
- Base delay: 0.8 seconds
- Maximum delay: 60 seconds
- Maximum total retry time: 120 seconds

The exponential backoff calculation follows this pattern:

```python
delay = min(base_delay * (2 ** retry_attempt), max_delay)
```

### Customizing retries

You can customize retry behavior when creating SDK clients to match your application's specific requirements.
Common Retry Parameters

```python
from azure.storage.blob import BlobServiceClient
from azure.core.pipeline.policies import RetryPolicy

# Custom retry configuration
retry_policy = RetryPolicy(
    retry_total=5,                    # Maximum number of retry attempts
    retry_backoff_factor=0.5,         # Base backoff time in seconds
    retry_backoff_max=120,            # Maximum backoff time in seconds
    retry_on_status_codes=[429, 500, 502, 503, 504]  # HTTP status codes to retry
)

# Apply custom retry policy to client
client = BlobServiceClient(
    account_url="https://myaccount.blob.core.windows.net",
    credential=credential,
    retry_policy=retry_policy
)
```

### Disabling retries

For scenarios where retries aren't appropriate:

```python
from azure.core.pipeline.policies import RetryPolicy

# Disable retries completely
no_retry_policy = RetryPolicy(retry_total=0)

client = BlobServiceClient(
    account_url="https://myaccount.blob.core.windows.net",
    credential=credential,
    retry_policy=no_retry_policy
)
```

## Diagnosing and debugging retry behavior

Understanding when and why retries occur is crucial for troubleshooting performance issues.

### Enable SDK logging

The Azure SDK for Python uses Python's standard logging framework:

```python
import logging
import sys

# Configure logging to see retry attempts
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    stream=sys.stdout
)

# Enable specific Azure SDK loggers
azure_logger = logging.getLogger('azure')
azure_logger.setLevel(logging.DEBUG)

# Now SDK operations will log retry attempts
```

## Identifying retry patterns

Look for log entries like:

```output
Retry attempt 1 for request [GET] https://myaccount.blob.core.windows.net/container/blob
Waiting 0.8 seconds before retry
```

## Common retry pitfalls

- **Retrying non-transient errors**: The SDK doesn't retry client errors (4xx) except for 408 and 429
- **Ignoring retry latency**: Remember that retries add latency to failed operations
- **Insufficient timeout**: Ensure your overall operation timeout accounts for retry delays

## Advanced: Adding custom policies

You can extend the pipeline with custom policies for specialized scenarios.

### Creating a custom policy

```python
from azure.core.pipeline import PipelineRequest, PipelineResponse
from azure.core.pipeline.policies import HTTPPolicy
from typing import Any, Optional

class CustomTelemetryPolicy(HTTPPolicy):
    """Custom policy to add telemetry headers"""
    
    def send(self, request: PipelineRequest) -> PipelineResponse:
        # Add custom header before sending request
        request.http_request.headers['X-Custom-Telemetry'] = 'my-app-v1.0'
        
        # Continue with the pipeline
        response = self.next.send(request)
        
        # Log response time
        print(f"Request to {request.http_request.url} completed")
        
        return response
```

### Applying custom policies

```python
from azure.storage.blob import BlobServiceClient

# Create client with custom policy
client = BlobServiceClient(
    account_url="https://myaccount.blob.core.windows.net",
    credential=credential,
    per_call_policies=[CustomTelemetryPolicy()],  # Policies that run per request
    per_retry_policies=[]  # Policies that run per retry attempt
)
```

## Policy ordering

Policies execute in a specific order:

- Per-call policies (execute once per operation)
- Retry policy
- Per-retry policies (execute on each attempt)
- Authentication policy
- HTTP transport

## Best practices

### Use default settings when possible

The default retry configuration works well for most scenarios. Only customize when you have specific requirements.

### Customization guidelines

When customizing retry behavior:

- **Use exponential backoff**: Prevents overwhelming services during recovery
- **Set reasonable limits**: Cap total retry time to prevent indefinite waiting
- **Monitor retry metrics**: Track retry rates in production to identify issues
- **Consider circuit breakers**: For high-volume scenarios, implement circuit breaker patterns

### What not to retry

Avoid retrying these types of errors:

- **Authentication failures (401, 403)**: Authentication errors require fixing credentials, not retrying
- **Client errors (400, 404)**: Client errors indicate problems with the request itself
- **Business logic errors**: Application-specific errors that don't resolve with retries

## Operational excellence

- **Log correlation IDs**: Include `x-ms-client-request-id` in logs for Azure support
- **Set appropriate timeouts**: Balance between reliability and user experience
- **Test retry behavior**: Verify your application handles retries gracefully
- **Monitor performance**: Track P95/P99 latencies (percentile-based latency metrics) including retry overhead

## Next steps

- [Implementing resilient applications](/azure/well-architected/reliability/)
