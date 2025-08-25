---
title: Handling errors produced by the Azure SDK for Python
description: Learn the Azure SDK for Python's comprehensive error model designed to help developers build resilient applications.
ms.date: 7/15/2025
ms.topic: conceptual
ms.custom: devx-track-python
---

# Handling errors produced by the Azure SDK for Python

Building reliable cloud applications requires more than just implementing features—it demands robust error handling strategies. When working with distributed systems and cloud services, your application must be prepared to handle various failure scenarios gracefully.

The Azure SDK for Python provides a comprehensive error model designed to help developers build resilient applications. Understanding this error model is crucial for:

- Improving application reliability by anticipating and handling common failure scenarios
- Enhancing user experience through meaningful error messages and graceful degradation
- Simplifying troubleshooting by capturing and logging relevant diagnostic information

This article explores the Azure SDK for Python's error architecture and provides practical guidance for implementing effective error handling in your applications.

## How the Azure SDK for Python models errors

The Azure SDK for Python uses a hierarchical exception model that provides both general and specific error handling capabilities. At the core of this model is AzureError, which serves as the base exception class for all Azure SDK-related errors.

### Exception hierarchy

```
AzureError
├── ClientAuthenticationError
├── ResourceNotFoundError
├── ResourceExistsError
├── ResourceModifiedError
├── ResourceNotModifiedError
├── ServiceRequestError
├── ServiceResponseError
└── HttpResponseError
```

### Key exception types

|Error|Description|
|---|---|
|AzureError|The base exception class for all Azure SDK errors. Use this as a catch-all when you need to handle any Azure-related error.|
|ClientAuthenticationError|Raised when authentication fails. Common causes include invalid credentials, expired tokens, and misconfigured authentication settings.|
|ResourceNotFoundError|Raised when attempting to access a resource that doesn't exist. This typically corresponds to HTTP 404 responses.|
|ResourceExistsError|Raised when attempting to create a resource that already exists. This helps prevent accidental overwrites.|
|ServiceRequestError|Raised when the SDK can't send a request to the service. Common causes include network connectivity issues, DNS resolution failures, and invalid service endpoints.|
|ServiceResponseError|Raised when the service returns an unexpected response that the SDK can't process.|
|HttpResponseError|Raised for HTTP error responses (4xx and 5xx status codes). This exception provides access to the underlying HTTP response details.|

## Common error scenarios

Understanding typical error scenarios helps you implement appropriate handling strategies for each situation.

### Authentication and authorization errors

Authentication failures occur when the SDK can't verify your identity:

```python
from azure.core.exceptions import ClientAuthenticationError
from azure.identity import DefaultAzureCredential
from azure.storage.blob import BlobServiceClient

try:
    credential = DefaultAzureCredential()
    blob_service = BlobServiceClient(
        account_url="https://myaccount.blob.core.windows.net",
        credential=credential
    )
    # Attempt to list containers
    containers = blob_service.list_containers()
except ClientAuthenticationError as e:
    print(f"Authentication failed: {e.message}")
    # Don't retry - fix credentials first
```

Authorization errors (typically HttpResponseError with 403 status) occur when you lack permissions:

```python
from azure.core.exceptions import HttpResponseError

try:
    blob_client.upload_blob(data)
except HttpResponseError as e:
    if e.status_code == 403:
        print("Access denied. Check your permissions.")
    else:
        raise
```

### Resource errors

Handle missing resources gracefully:

```python
from azure.core.exceptions import ResourceNotFoundError

try:
    blob_client = container_client.get_blob_client("myblob.txt")
    content = blob_client.download_blob().readall()
except ResourceNotFoundError:
    print("Blob not found. Using default content.")
    content = b"default"
```

Prevent duplicate resource creation:

```python
from azure.core.exceptions import ResourceExistsError

try:
    container_client.create_container()
except ResourceExistsError:
    print("Container already exists.")
    # Continue with existing container
```

### Server errors

Handle server-side failures appropriately:

```python
from azure.core.exceptions import HttpResponseError

try:
    result = client.process_data(large_dataset)
except HttpResponseError as e:
    if 500 <= e.status_code < 600:
        print(f"Server error ({e.status_code}). The service may be temporarily unavailable.")
        # Consider retry logic here
    else:
        raise
```

## Best practices for error handling

- **Use specific exception handling** - Always catch specific exceptions before falling back to general ones:

  ```python
  from azure.core.exceptions import (
      AzureError,
      ClientAuthenticationError,
      ResourceNotFoundError,
      HttpResponseError
  )
  
  try:
      # Azure SDK operation
      result = client.get_resource()
  except ClientAuthenticationError:
      # Handle authentication issues
      print("Please check your credentials")
  except ResourceNotFoundError:
      # Handle missing resources
      print("Resource not found")
  except HttpResponseError as e:
      # Handle specific HTTP errors
      if e.status_code == 429:
          print("Rate limited. Please retry later.")
      else:
          print(f"HTTP error {e.status_code}: {e.message}")
  except AzureError as e:
      # Catch-all for other Azure errors
      print(f"Azure operation failed: {e}")
  ```

- **Implement appropriate retry strategies** - Some errors warrant retry attempts, while others don't.

  Don't retry on:
  
  - 401 Unauthorized (authentication failures)
  - 403 Forbidden (authorization failures)
  - 400 Bad Request (client errors)
  - 404 Not Found (unless you expect the resource to appear)
  
  Consider retrying on:
  
  - 408 Request Timeout
  - 429 Too Many Requests (with appropriate backoff)
  - 500 Internal Server Error
  - 502 Bad Gateway
  - 503 Service Unavailable
  - 504 Gateway Timeout

- **Extract meaningful error information**

  ```python
  from azure.core.exceptions import HttpResponseError
  
  try:
      client.perform_operation()
  except HttpResponseError as e:
      # Extract detailed error information
      print(f"Status code: {e.status_code}")
      print(f"Error message: {e.message}")
      print(f"Error code: {e.error.code if e.error else 'N/A'}")
      
      # Request ID is crucial for Azure support
      if hasattr(e, 'response') and e.response:
          request_id = e.response.headers.get('x-ms-request-id')
          print(f"Request ID: {request_id}")
  ```

## Retry policies and resilience

The Azure SDK includes built-in retry mechanisms that handle transient failures automatically.

### Default retry behavior

Most Azure SDK clients include default retry policies that:

- Retry on connection errors and specific HTTP status codes
- Use exponential backoff with jitter
- Limit the number of retry attempts

### Customize retry policies

If the default behavior doesn't suit your use case, you can customize the retry policy as in the following example:

```python
from azure.storage.blob import BlobServiceClient
from azure.core.pipeline.policies import RetryPolicy

# Create a custom retry policy
retry_policy = RetryPolicy(
    retry_total=5,  # Maximum retry attempts
    retry_backoff_factor=2,  # Exponential backoff factor
    retry_backoff_max=60,  # Maximum backoff time in seconds
    retry_on_status_codes=[408, 429, 500, 502, 503, 504]
)

# Apply to client
blob_service = BlobServiceClient(
    account_url="https://myaccount.blob.core.windows.net",
    credential=credential,
    retry_policy=retry_policy
)
```

### Avoid handling network and timeout errors with custom loops

You should try to use built-in retries for network and timeout errors before implementing your own custom logic.

```python
from azure.core.exceptions import ServiceRequestError
import time

# Avoid this approach if possible
max_retries = 3
retry_count = 0

while retry_count < max_retries:
    try:
        response = client.get_secret("mysecret")
        break
    except ServiceRequestError as e:
        retry_count += 1
        if retry_count >= max_retries:
            raise
        print(f"Network error. Retrying... ({retry_count}/{max_retries})")
        time.sleep(2 ** retry_count)  # Exponential backoff
```


### Implementing circuit breaker patterns

For critical operations, consider implementing circuit breaker patterns:

```python
class CircuitBreaker:
    def __init__(self, failure_threshold=5, recovery_timeout=60):
        self.failure_threshold = failure_threshold
        self.recovery_timeout = recovery_timeout
        self.failure_count = 0
        self.last_failure_time = None
        self.state = 'closed'  # closed, open, half-open
    
    def call(self, func, *args, **kwargs):
        if self.state == 'open':
            if time.time() - self.last_failure_time > self.recovery_timeout:
                self.state = 'half-open'
            else:
                raise Exception("Circuit breaker is open")
        
        try:
            result = func(*args, **kwargs)
            if self.state == 'half-open':
                self.state = 'closed'
                self.failure_count = 0
            return result
        except Exception as e:
            self.failure_count += 1
            self.last_failure_time = time.time()
            
            if self.failure_count >= self.failure_threshold:
                self.state = 'open'
            
            raise e
```

### Understanding error messages and codes

Azure services return structured error responses that provide valuable debugging information.

- **Parsing error responses**

  ```python
  from azure.core.exceptions import HttpResponseError
  import json
  
  try:
      client.create_resource(resource_data)
  except HttpResponseError as e:
      # Many Azure services return JSON error details
      if e.response and e.response.text():
          try:
              error_detail = json.loads(e.response.text())
              print(f"Error code: {error_detail.get('error', {}).get('code')}")
              print(f"Error message: {error_detail.get('error', {}).get('message')}")
              
              # Some services provide additional details
              if 'details' in error_detail.get('error', {}):
                  for detail in error_detail['error']['details']:
                      print(f"  - {detail.get('code')}: {detail.get('message')}")
          except json.JSONDecodeError:
              print(f"Raw error: {e.response.text()}")
  ```

- **Capturing diagnostic information** - Always capture key diagnostic information for troubleshooting:

  ```python
  import logging
  from azure.core.exceptions import AzureError
  
  logger = logging.getLogger(__name__)
  
  try:
      result = client.perform_operation()
  except AzureError as e:
      # Log comprehensive error information
      logger.error(
          "Azure operation failed",
          extra={
              'error_type': type(e).__name__,
              'error_message': str(e),
              'operation': 'perform_operation',
              'timestamp': datetime.utcnow().isoformat(),
              'request_id': getattr(e.response, 'headers', {}).get('x-ms-request-id') if hasattr(e, 'response') else None
          }
      )
      raise
  ```

- **Logging and diagnostics** - Enable SDK-level logging for detailed troubleshooting:

  ```python
  import logging
  import sys
  
  # Configure logging for Azure SDKs
  logging.basicConfig(level=logging.DEBUG)
  
  # Enable HTTP request/response logging
  logging.getLogger('azure.core.pipeline.policies.http_logging_policy').setLevel(logging.DEBUG)
  
  # For specific services
  logging.getLogger('azure.storage.blob').setLevel(logging.DEBUG)
  logging.getLogger('azure.identity').setLevel(logging.DEBUG)
  ```

  For more information about logging, see [Configure logging in the Azure libraries for Python](../azure-sdk-logging.md).

- **Using network tracing** - For deep debugging, enable network-level tracing:

  > [!IMPORTANT]
  > HTTP logging can include sensitive information such as account keys in headers and other credentials. Be sure to protect these logs to avoid compromising security.

  ```python
  from azure.storage.blob import BlobServiceClient
  
  # Enable network tracing
  blob_service = BlobServiceClient(
      account_url="https://myaccount.blob.core.windows.net",
      credential=credential,
      logging_enable=True,  # Enable logging
      logging_body=True     # Log request/response bodies (careful with sensitive data)
  )
  ```

### Special considerations for async programming

When using async clients, error handling requires special attention.

- **Basic async error handling**

  ```python
  import asyncio
  from azure.core.exceptions import AzureError
  
  async def get_secret_async(client, secret_name):
      try:
          secret = await client.get_secret(secret_name)
          return secret.value
      except ResourceNotFoundError:
          print(f"Secret '{secret_name}' not found")
          return None
      except AzureError as e:
          print(f"Error retrieving secret: {e}")
          raise
  ```

- **Handling cancellations**

  ```python
  async def long_running_operation(client):
      try:
          result = await client.start_long_operation()
          # Wait for completion
          final_result = await result.result()
          return final_result
      except asyncio.CancelledError:
          print("Operation cancelled")
          # Cleanup if necessary
          if hasattr(result, 'cancel'):
              await result.cancel()
          raise
      except AzureError as e:
          print(f"Operation failed: {e}")
          raise
  ```

- **Concurrent error handling**

  ```python
  async def process_multiple_resources(client, resource_ids):
      tasks = []
      for resource_id in resource_ids:
          task = client.get_resource(resource_id)
          tasks.append(task)
      
      results = []
      errors = []
      
      # Use gather with return_exceptions to handle partial failures
      outcomes = await asyncio.gather(*tasks, return_exceptions=True)
      
      for resource_id, outcome in zip(resource_ids, outcomes):
          if isinstance(outcome, Exception):
              errors.append((resource_id, outcome))
          else:
              results.append(outcome)
      
      # Process successful results and errors appropriately
      if errors:
          print(f"Failed to process {len(errors)} resources")
          for resource_id, error in errors:
              print(f"  - {resource_id}: {error}")
      
      return results
  ```

## Summary of best practices

Effective error handling in Azure SDK for Python applications requires:

- **Anticipate failures**: Cloud applications must expect and handle partial failures gracefully.
- **Use specific exception handling**: Catch specific exceptions like ResourceNotFoundError and ClientAuthenticationError before falling back to general AzureError handling.
- **Implement smart retry logic**: Use built-in retry policies or customize them based on your needs. Remember that not all errors should trigger retries.
- **Capture diagnostic information**: Always log request IDs, error codes, and timestamps for effective troubleshooting.
- **Provide meaningful user feedback**: Transform technical errors into user-friendly messages while preserving technical details for support.
- **Test error scenarios**: Include error handling in your test coverage to ensure your application behaves correctly under failure conditions.

## Next steps

- [Azure Core exceptions Module reference](/python/api/azure-core/azure.core.exceptions?view=azure-python)
- Learn about [troubleshooting authentication and authorization issues](../authentication/overview.md)
- Explore [Azure Monitor OpenTelemetry](/azure/azure-monitor/app/opentelemetry-enable?tabs=python) for comprehensive application monitoring
