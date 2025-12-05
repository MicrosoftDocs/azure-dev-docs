---
title: Understand Common Response Types in the Azure SDK for Python
description: Learn about types of objects that you receive from SDK operations when you use the Azure SDK for Python.
ms.date: 7/10/2025
ms.topic: conceptual
ms.custom: devx-track-python, py-fresh-zinc
---

# Understand common response types in the Azure SDK for Python

The Azure SDK for Python abstracts calls to the underlying Azure service communication protocol, whether that protocol is HTTP or AMQP (which is used for messaging SDKs like `ServiceBus` and `EventHubs`). For example, if you use one of the libraries that uses HTTP, the Azure SDK for Python makes HTTP requests and receives HTTP responses under the hood. The SDK abstracts away this complexity so that you can work with intuitive Python objects instead of raw HTTP responses or JSON payloads.

Understanding the types of objects that you receive from SDK operations is essential for writing effective Azure applications. This article explains the common response types that you encounter and how they relate to the underlying HTTP communication.

> [!NOTE]
> This article examines only the HTTP scenario, not the AMQP scenario.

## Deserialized Python objects

The Azure SDK for Python prioritizes developer productivity by returning strongly typed Python objects from service operations. Instead of parsing JSON or handling HTTP status codes directly, you work with resource models that represent Azure resources as Python objects.

For example, when you retrieve a blob from Azure Storage, you receive a `BlobProperties` object with attributes like `name`, `size`, and `last_modified` rather than a raw JSON dictionary:

```python
from azure.storage.blob import BlobServiceClient

# Connect to storage account
blob_service_client = BlobServiceClient.from_connection_string(connection_string)
container_client = blob_service_client.get_container_client("mycontainer")

# Get blob properties - returns a BlobProperties object
blob_client = container_client.get_blob_client("myblob.txt")
properties = blob_client.get_blob_properties()

# Access properties as Python attributes
print(f"Blob name: {properties.name}")
print(f"Blob size: {properties.size} bytes")
print(f"Last modified: {properties.last_modified}")
```

### Where the data comes from

Understanding the data flow helps you appreciate what the SDK does behind the scenes:

- **Your code calls an SDK method:** You invoke a method like `get_blob_properties()`.
- **The SDK constructs an HTTP request:** The SDK builds the appropriate HTTP request with headers, authentication, and query parameters.
- **The Azure service responds:** The service returns an HTTP response, typically with a JSON payload in the response body.
- **The SDK processes the response:** The SDK:
  - Checks the HTTP status code.
  - Parses the response body (usually JSON).
  - Validates the data against expected schemas.
  - Maps the data to Python model objects.
- **Your code receives Python objects:** You work with the deserialized objects, not raw HTTP data.

This abstraction allows you to focus on your application logic rather than HTTP protocol details.

## Common response types

The Azure SDK for Python uses several standard response types across all services. Understanding these types helps you work effectively with any Azure service.

### Resource models

Most SDK operations return resource models. These Python objects represent Azure resources. The models are service specific but follow consistent patterns:

```python
# Azure Key Vault example
from azure.keyvault.secrets import SecretClient

secret_client = SecretClient(vault_url=vault_url, credential=credential)
secret = secret_client.get_secret("mysecret")  # Returns KeyVaultSecret

print(f"Secret name: {secret.name}")
print(f"Secret value: {secret.value}")
print(f"Secret version: {secret.properties.version}")

# Azure Cosmos DB example
from azure.cosmos import CosmosClient

cosmos_client = CosmosClient(url=cosmos_url, credential=credential)
database = cosmos_client.get_database_client("mydatabase")
container = database.get_container_client("mycontainer")
item = container.read_item(item="item-id", partition_key="partition-value")  # Returns dict

print(f"Item ID: {item['id']}")
```

### ItemPaged for collection results

When the SDK lists resources, it returns `ItemPaged` objects that handle pagination transparently:

```python
from azure.storage.blob import BlobServiceClient
from azure.core.paging import ItemPaged

blob_service_client = BlobServiceClient.from_connection_string(connection_string)
container_client = blob_service_client.get_container_client("mycontainer")

# list_blobs returns ItemPaged[BlobProperties]
blobs: ItemPaged[BlobProperties] = container_client.list_blobs()

# Iterate naturally - SDK handles pagination
for blob in blobs:
    print(f"Blob: {blob.name}, Size: {blob.size}")
```

## Access the raw HTTP response

While the SDK's high-level abstractions meet most needs, you sometimes need access to the underlying HTTP response. Common scenarios include:

- Debugging failed requests.
- Accessing custom response headers.
- Implementing custom retry logic.
- Working with nonstandard response formats.

Most SDK methods accept a `raw_response_hook` parameter:

```python
from azure.keyvault.secrets import SecretClient

secret_client = SecretClient(vault_url=vault_url, credential=credential)

def inspect_response(response):
    # Access the raw HTTP response
    print(f"Request URL: {response.http_request.url}")
    print(f"Status code: {response.http_response.status_code}")
    print(f"Response headers: {dict(response.http_response.headers)}")
    
    # Access custom headers
    request_id = response.http_response.headers.get('x-ms-request-id')
    print(f"Request ID: {request_id}")
    
    # Must return the response
    return response

# Hook is called before deserialization
secret = secret_client.get_secret("mysecret", raw_response_hook=inspect_response)
```

## Paging and iterators

Azure services often return large collections of resources. The SDK uses `ItemPaged` to handle these collections efficiently without loading everything into memory at once.

### Automatic pagination

The SDK automatically fetches new pages as you iterate:

```python
# List all blobs - could be thousands
blobs = container_client.list_blobs()

# SDK fetches pages as needed during iteration
for blob in blobs:
    process_blob(blob)  # Pages loaded on-demand
```

### Work with pages explicitly

You can also work with pages directly when needed:

```python
blobs = container_client.list_blobs()

# Process by page
for page in blobs.by_page():
    print(f"Processing page with {len(list(page))} items")
    for blob in page:
        process_blob(blob)
```

### Control page size

Many list operations accept a `results_per_page` parameter:

```python
# Fetch 100 items per page instead of the default
blobs = container_client.list_blobs(results_per_page=100)
```

Some methods for some Azure services have other mechanisms for controlling page size. For example, Azure Key Vault and Azure Search use the `top` kwarg to limit results per call. For an example that uses the Azure Search `search()` method, see the [source code](https://github.com/Azure/azure-sdk-for-python/blob/0cf4523c054fc793c6ce46616daa5e23f9607d33/sdk/search/azure-search-documents/azure/search/documents/_search_client.py#L174).

## Special case: Long-running operations and pollers

Some Azure operations can't complete immediately. Examples include:

- Creating or deleting virtual machines.
- Deploying Azure Resource Manager templates.
- Training machine learning models.
- Copying large blobs.

These operations return poller objects that track the operation's progress.

### Work with pollers

```python
from azure.mgmt.storage import StorageManagementClient

storage_client = StorageManagementClient(credential, subscription_id)

# Start storage account creation
poller = storage_client.storage_accounts.begin_create(
    resource_group_name="myresourcegroup",
    account_name="mystorageaccount",
    parameters=storage_parameters
)

# Option 1: Wait for completion (blocking)
storage_account = poller.result()

# Option 2: Check status periodically
while not poller.done():
    print(f"Status: {poller.status()}")
    time.sleep(5)

storage_account = poller.result()
```

### Asynchronous pollers

When you use async/await patterns, you work with `AsyncLROPoller`:

```python
from azure.storage.blob.aio import BlobServiceClient

async with BlobServiceClient.from_connection_string(connection_string) as client:
    container_client = client.get_container_client("mycontainer")
    
    # Start async copy operation
    blob_client = container_client.get_blob_client("large-blob.vhd")
    poller = await blob_client.begin_copy_from_url(source_url)
    
    # Wait for async completion
    copy_properties = await poller.result()
```

### Polling objects for long-running operations example: Virtual machines

Deploying virtual machines is an example of an operation that takes time to complete and handles it by returning poller objects (`LROPoller` for synchronous code, `AsyncLROPoller` for asynchronous code):

```python
from azure.mgmt.compute import ComputeManagementClient
from azure.core.polling import LROPoller

compute_client = ComputeManagementClient(credential, subscription_id)

# Start VM creation - returns immediately with a poller
poller: LROPoller = compute_client.virtual_machines.begin_create_or_update(
    resource_group_name="myresourcegroup",
    vm_name="myvm",
    parameters=vm_parameters
)

# Wait for completion and get the result
vm = poller.result()  # Blocks until operation completes
print(f"VM {vm.name} provisioned successfully")
```

### Access response for paged results

For paged results, use the `by_page()` method with `raw_response_hook`:

```python
def page_response_hook(response):
    continuation_token = response.http_response.headers.get('x-ms-continuation')
    print(f"Continuation token: {continuation_token}")
    return response

blobs = container_client.list_blobs()
for page in blobs.by_page(raw_response_hook=page_response_hook):
    for blob in page:
        print(blob.name)
```

## Best practices

- **Prefer high-level abstractions.**
- **Work with the SDK's resource models rather than raw responses whenever possible.**
- **Avoid accessing any method prefixed with an underscore (_).** By convention, those methods are private in Python. There are no guarantees about issues like breaking changes compared to public APIs:

  ```python
  # Preferred: Work with typed objects
  secret = secret_client.get_secret("mysecret")
  if secret.properties.enabled:
      use_secret(secret.value)

  # Avoid: Manual JSON parsing (unless necessary) ...
  # AND avoid accessing any objects or methods that start with `_`
  response = secret_client._client.get(...)  # Don't access internal clients
  data = json.loads(response.text)
  if data['attributes']['enabled']:
      use_secret(data['value'])
  ```

- **Handle pagination properly.** Always iterate over paged results instead of converting to a list:

  ```python
  # Good: Memory-efficient iteration
  for blob in container_client.list_blobs():
      process_blob(blob)
  
  # Avoid: Loading everything into memory
  all_blobs = list(container_client.list_blobs())  # Could consume excessive memory
  ```

- **Use poller.result() for long-running operations.** Always use the `result()` method to ensure that operations complete successfully:

  ```python
  # Correct: Wait for operation completion
  poller = compute_client.virtual_machines.begin_delete(
      resource_group_name="myresourcegroup",
      vm_name="myvm"
  )
  poller.result()  # Ensures deletion completes
  print("VM deleted successfully")
  
  # Wrong: Assuming immediate completion
  poller = compute_client.virtual_machines.begin_delete(...)
  print("VM deleted successfully")  # Deletion might still be in progress!
  ```

- **Access raw responses only when needed.** Use raw response access sparingly and only for specific requirements:

  ```python
  # Good use case: Debugging or logging
  def log_request_id(response):
      request_id = response.http_response.headers.get('x-ms-request-id')
      logger.info(f"Operation request ID: {request_id}")
      return response
  
  blob_client.upload_blob(data, raw_response_hook=log_request_id)
  
  # Good use case: Custom error handling
  def check_custom_header(response):
      if response.http_response.headers.get('x-custom-error'):
          raise CustomApplicationError("Custom error condition detected")
      return response
  ```
