---
title: Azure SDK Language Design Guidelines for Python
description: Learn about the Azure SDK Language Design Guidelines for Python and how they promote consistency which easy usability across the entire SDK surface.
ms.date: 7/15/2025
ms.topic: conceptual
ms.custom: devx-track-python
---

# Azure SDK Language Design Guidelines for Python

Azure SDK Design Guidelines are comprehensive standards that ensure consistency, predictability, and ease of use across all Azure SDKs. These guidelines help developers work efficiently with Azure services by providing familiar patterns and behaviors across different services and programming languages.

The guidelines consist of two categories:

- **General Guidelines**: Core principles that apply to all Azure SDKs regardless of programming language
- **Language-Specific Guidelines**: Implementation details optimized for each supported language, including Python, .NET, Java, and JavaScript

These guidelines are developed openly on GitHub, allowing community review and contribution.

## General design principles

All Azure SDKs follow these fundamental principles:

|Principle|Description|
|---|---|
|Idiomatic usage|SDKs follow language-specific conventions and patterns|
|Consistency|Uniform behaviors across different Azure services|
|Simplicity|Common tasks require minimal code|
|Progressive disclosure|Advanced features are available but don't complicate basic usage|
|Robustness|Built-in handling for errors, retries, and timeouts|

## Python-specific guidelines

### Naming conventions

Azure SDKs for Python follow standard Python naming conventions:

- **Methods** - Use snake_case.

  ```python
  list_containers()
  get_secret()
  create_database()
  ```

- **Variables** - Use snake_case.

  ```python
  connection_string = "..."
  retry_count = 3
  ```

- **Classes** - Use PascalCase.

  ```python
  BlobServiceClient
  SecretClient
  CosmosClient
  ```

- **Constants** - Use UPPER_CASE.

  ```python
  DEFAULT_CHUNK_SIZE
  MAX_RETRIES
  ```

### Package structure

Azure SDK packages follow a consistent structure:

```ascii
azure-<service>-<feature>
├── azure/
│   └── <service>/
│       ├── __init__.py
│       ├── _client.py
│       ├── _models.py
│       └── aio/           # Async implementations
│           └── __init__.py
```

### Client instantiation

Clients provide multiple instantiation methods:

```python
from azure.storage.blob import BlobServiceClient
from azure.identity import DefaultAzureCredential

# Using connection string
client = BlobServiceClient.from_connection_string(conn_str)

# Using account URL and credential
credential = DefaultAzureCredential()
client = BlobServiceClient(account_url="https://account.blob.core.windows.net", 
                          credential=credential)

```

### Authentication

Azure SDKs use consistent authentication patterns:

```python
from azure.identity import DefaultAzureCredential, ClientSecretCredential

# Default credential chain
credential = DefaultAzureCredential()

# Explicit credential
credential = ClientSecretCredential(
    tenant_id="tenant-id",
    client_id="client-id",
    client_secret="secret"
)
```

### Context managers

Most Azure SDK clients implement context manager protocols for automatic resource cleanup:

```python
from azure.storage.blob import BlobServiceClient

# Automatic cleanup with context manager
with BlobServiceClient.from_connection_string(conn_str) as client:
    container_client = client.get_container_client("mycontainer")
    blob_list = container_client.list_blobs()
```

> [!Note]
> While most clients support context managers, verify specific client documentation for availability.

### Asynchronous operations

Async clients are provided in separate `.aio` modules:

```python
from azure.storage.blob.aio import BlobServiceClient
import asyncio

async def list_blobs_async():
    async with BlobServiceClient.from_connection_string(conn_str) as client:
        container_client = client.get_container_client("mycontainer")
        async for blob in container_client.list_blobs():
            print(blob.name)

# Run async function
asyncio.run(list_blobs_async())
```

### Long-running operations

Long-running operations use the begin_ prefix and return poller objects:

```python
from azure.storage.blob import BlobServiceClient

client = BlobServiceClient.from_connection_string(conn_str)
container_client = client.get_container_client("mycontainer")

# Start long-running operation
poller = container_client.begin_copy_blob_from_url(source_url)

# Wait for completion
result = poller.result()

# Or check status
if poller.done():
    result = poller.result()
```

### Pagination

List operations return iterables that handle pagination automatically:

```python
from azure.storage.blob import BlobServiceClient

client = BlobServiceClient.from_connection_string(conn_str)

# Automatic pagination
for container in client.list_containers():
    print(container.name)

# Manual pagination control
containers = client.list_containers(results_per_page=10).by_page()
for page in containers:
    for container in page:
        print(container.name)
```

### Return types

Methods return strongly typed model objects rather than dictionaries:

```python
from azure.keyvault.secrets import SecretClient

client = SecretClient(vault_url="...", credential=credential)

# Returns KeyVaultSecret object, not dict
secret = client.get_secret("my-secret")
print(secret.value)
print(secret.properties.created_on)
```

## Error handling

Azure SDK exceptions inherit from AzureError and provide specific exception types:

```python
from azure.core.exceptions import (
    AzureError,
    ResourceNotFoundError,
    ResourceExistsError,
    ClientAuthenticationError,
    HttpResponseError
)

try:
    blob_client.download_blob()
except ResourceNotFoundError:
    # Handle missing resource
    print("Blob not found")
except ClientAuthenticationError:
    # Handle authentication failure
    print("Authentication failed")
except HttpResponseError as e:
    # Handle HTTP errors
    print(f"HTTP {e.status_code}: {e.message}")
except AzureError as e:
    # Handle any other Azure SDK error
    print(f"Azure SDK error: {e}")

```

## Configuration options

Clients accept configuration through keyword arguments:

```python
from azure.storage.blob import BlobServiceClient

client = BlobServiceClient(
    account_url="...",
    credential=credential,
    # Configuration options
    max_single_put_size=64 * 1024 * 1024,
    max_block_size=4 * 1024 * 1024,
    retry_total=3,
    logging_enable=True
)
```

## Common SDK patterns

### Service client hierarchy

Azure SDKs typically follow a three-level hierarchy:

- **Service Client**: Entry point for service operations

  ```python
  service_client = BlobServiceClient(...)
  ```

- **Resource Client**: Operations on specific resources

  ```python
  container_client = service_client.get_container_client("container")
  ```

- **Operation Methods**: Actions on resources

  ```python
  blob_client = container_client.get_blob_client("blob.txt")
  blob_client.upload_blob(data)
  ```

### Consistent method naming

Method names follow predictable patterns:

|Operation|Method Pattern|Example|
|---|---|---|
|Create|`create_<resource>`|`create_container()`|
|Read|`get_<resource>`|`get_blob()`|
|Update|`update_<resource>`|`update_secret()`|
|Delete|`delete_<resource>`|`delete_container()`|
|List|`list_<resources>`|`list_blobs()`|
|Exists|`exists()`|`blob_client.exists()`|


## Working with Azure SDKs

The following example demonstrates how design guidelines create consistency across different Azure services:

```python
from azure.storage.blob import BlobServiceClient
from azure.keyvault.secrets import SecretClient
from azure.cosmos import CosmosClient
from azure.identity import DefaultAzureCredential

# Consistent authentication
credential = DefaultAzureCredential()

# Consistent client instantiation
blob_service = BlobServiceClient(
    account_url="https://account.blob.core.windows.net",
    credential=credential
)
secret_client = SecretClient(
    vault_url="https://vault.vault.azure.net",
    credential=credential
)
cosmos_client = CosmosClient(
    url="https://account.documents.azure.com",
    credential=credential
)

# Consistent method patterns
containers = blob_service.list_containers()
secrets = secret_client.list_properties_of_secrets()
databases = cosmos_client.list_databases()

# Consistent error handling
from azure.core.exceptions import ResourceNotFoundError

try:
    blob_service.get_container_client("container").get_container_properties()
    secret_client.get_secret("secret")
    cosmos_client.get_database_client("database").read()
except ResourceNotFoundError as e:
    print(f"Resource not found: {e}")
```

## Contributing to Azure SDKs

When extending or contributing to Azure SDKs:

- **Follow Python idioms** - Use Pythonic patterns and conventions
- **Maintain consistency** - Align with existing SDK patterns
- **Write comprehensive tests** - Include unit and integration tests
- **Document thoroughly** - Provide docstrings and examples
- **Review guidelines** - Consult the Azure SDK Contribution Guide

Here's an example of implementing a custom client method that follows the Language Design Guidelines.

```python
def list_items_with_prefix(self, prefix: str, **kwargs) -> ItemPaged[ItemProperties]:
    """List items that start with the specified prefix.
    
    :param str prefix: The prefix to filter items
    :return: An iterable of ItemProperties
    :rtype: ~azure.core.paging.ItemPaged[ItemProperties]
    
    :example:
        items = client.list_items_with_prefix("test-")
        for item in items:
            print(item.name)
    """
    return self.list_items(name_starts_with=prefix, **kwargs)
```

## Next steps

- Review the complete [Azure SDK Design Guidelines](https://azure.github.io/azure-sdk/)
- Read the [Azure SDK Releases page](https://azure.github.io/azure-sdk/releases/latest/python.html)
