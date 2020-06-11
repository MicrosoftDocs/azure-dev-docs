---
title: Configure logging in the Azure libraries for Python
description: The Azure libraries use the standard Python logging module, which is configured on a per-library or per-operation basis.
ms.date: 06/04/2020
ms.topic: conceptual
---

# Configure logging in the Azure libraries for Python

Azure Libraries for Python that are [based on azure.core](azure-sdk-install.md#libraries-updated-to-use-azure-core) page provide logging output using the standard Python [logging](https://docs.python.org/3/library/logging.html) library.

Logger output is not enabled by default. To enable logging:

1. Acquire the logging object for the desired library and set the logging level.
1. Register a handler for the logging stream.
1. Enable logging by passing a `logging_enable=True` parameter to a client object constructor or to a specific method.

As a general rule, the best resource for understanding logging usage within the libraries is to browse the SDK source code at [github.com/Azure/azure-sdk-for-python](https://github.com/Azure/azure-sdk-for-python). We encourage you to clone this repository locally so you can easily search for details when needed, as the following sections suggest.

## Set logging levels

```python
import logging

# ...

# Acquire the logger for a library (azure.storage.blob in this example)
logger = logging.getLogger('azure.storage.blob')

# Set the desired logging level
logger.setLevel(logging.DEBUG)
```

- This example acquires the logger for the `azure.storage.blob` library, then sets the logging level to `logging.DEBUG`.

- You can call `logger.setLevel` at any time to change the logging level for different segments of code.

To set a level for a different library, use that library's name in the `logging.getLogger` call. For example, the azure-eventhubs library provides a logger named `azure.eventhubs`, the azure-storage-queue library provides a logger named `azure.storage.queue`, and so on. (The SDK source code frequently uses the statement `logging.getLogger(__name__)`, which acquires a logger using the name of the containing module.)

You can also use more general namespaces. For example,

```python
import logging

# Set the logging level for all azure-storage-* libraries
logger = logging.getLogger('azure.storage')
logger.setLevel(logging.INFO)

# Set the logging level for all azure-* libraries
logger = logging.getLogger('azure')
logger.setLevel(logging.ERROR)
```

You can use the `logger.isEnabledFor` method to check whether any given logging level is enabled:

```python
print(f"Logger enabled for ERROR={logger.isEnabledFor(logging.ERROR)}, " \
    f"WARNING={logger.isEnabledFor(logging.WARNING)}, " \
    f"INFO={logger.isEnabledFor(logging.INFO)}, " \
    f"DEBUG={logger.isEnabledFor(logging.DEBUG)}")
```

Logging levels are the same as the [standard logging library levels](https://docs.python.org/3/library/logging.html#levels). The following table describes the general use of these logging levels in the Azure libraries for Python:

| Logging level             | Typical use |
| ---                       | ---         |
| logging.ERROR             | Failures where the application is unlikely to recover (such as out of memory). |
| logging.WARNING (default) | A function fails to perform its intended task (but not when the function can recover, such as retrying a REST API call). Functions typically log a warning when raising exceptions. The warning level automatically enables the error level. |
| logging.INFO              | Function operates normally or a service call is canceled. Info events typically include requests, responses, and headers. The info level automatically enables the error and warning levels. |
| logging.DEBUG             | Detailed information that is commonly used for troubleshooting. Debug is the only logging level that includes sensitive information such as account keys in headers. Debug output typically includes a stack trace for exceptions. The debug level automatically enables the info, warning, and error levels. |
| logging.NOTSET            | Disable all logging. |

### Library-specific logging level behavior

The exact logging behavior at each level depends on the library in question. Some libraries, such as azure.eventhub, perform extensive logging whereas other libraries do very little.

The best way to examine the exact logging for a library is to search for the logging levels in the Azure SDK for Python source code:

1. In the repository folder, navigate into the *sdk* folder, then navigate into the folder for the specific service of interest.

1. In that folder, search for any of the following strings:

    - `_LOGGER.error`
    - `_LOGGER.warning`
    - `_LOGGER.info`
    - `_LOGGER.debug`

## Register a log stream handler

To capture logging output, you must register at least one log stream handler in your code:

```python
import logging

# Direct logging output to stdout. Without adding a handler,
# no logging output is captured.
handler = logging.StreamHandler(stream=sys.stdout)
logger.addHandler(handler)
```

This example registers a handler that directs log output to stdout. You can use other types of handlers as described on [logging.handlers](https://docs.python.org/3/library/logging.handlers.html) in the Python documentation.

## Enable logging for a client object or operation

Even after you've set a logging level set and registered a handler, you must still instruct the Azure libraries to enable logging for either a client object constructor or operation method.

### Enable logging for a client object

```python
from azure.storage.blob import BlobClient
from azure.identity import DefaultAzureCredential

# endpoint is the Blob storage URL.
client = BlobClient(endpoint, DefaultAzureCredential(), logging_enable=True)
```

Enabling logging for a client object enables logging for all operations invoked through that object.

### Enable logging for an operation

```python
from azure.storage.blob import BlobClient
from azure.identity import DefaultAzureCredential

# Logging is not enabled on this client.
# endpoint is the Blob storage URL.
client = BlobClient(endpoint, DefaultAzureCredential())

# Enable logging for only this operation
client.create_container("container01", logging_enable=True)
```

## Example logging output

The following code is that shown in [Example: Use a storage account](azure-sdk-example-storage-use.md) with the addition of enabling DEBUG logging (comments omitted for brevity):

```python
import os, sys, logging
from azure.identity import DefaultAzureCredential
from azure.storage.blob import BlobClient

logger = logging.getLogger('azure.storage.blob')
logger.setLevel(logging.DEBUG)

handler = logging.StreamHandler(stream=sys.stdout)
logger.addHandler(handler)

credential = DefaultAzureCredential()
storage_url = os.environ["AZURE_STORAGE_BLOB_URL"]

blob_client = BlobClient(storage_url, container_name="blob-container-01",
    blob_name="sample-blob.txt", credential=credential)

with open("./sample-source.txt", "rb") as data:
    blob_client.upload_blob(data, logging_enable=True)
```

The logging output is as follows:

<pre>
Request URL: 'https://pythonsdkstorage12345.blob.core.windows.net/blob-container-01/sample-blob.txt'
Request method: 'PUT'
Request headers:
    'Content-Type': 'application/octet-stream'
    'Content-Length': '79'
    'x-ms-version': '2019-07-07'
    'x-ms-blob-type': 'BlockBlob'
    'If-None-Match': '*'
    'x-ms-date': 'Mon, 01 Jun 2020 22:54:14 GMT'
    'x-ms-client-request-id': 'd081f88e-a45a-11ea-b9eb-0c5415dfd03a'
    'User-Agent': 'azsdk-python-storage-blob/12.3.1 Python/3.8.3 (Windows-10-10.0.18362-SP0)'
    'Authorization': '*****'
Request body:
b"Hello there, Azure Storage. I'm a friendly file ready to be stored in a blob.\r\n"
Response status: 201
Response headers:
    'Content-Length': '0'
    'Content-MD5': 'kvMIzjEi6O8EqTVnZJNakQ=='
    'Last-Modified': 'Mon, 01 Jun 2020 22:54:14 GMT'
    'ETag': '"0x8D8067EB52FF7BC"'
    'Server': 'Windows-Azure-Blob/1.0 Microsoft-HTTPAPI/2.0'
    'x-ms-request-id': '5df479b1-f01e-00d0-5b67-382916000000'
    'x-ms-client-request-id': 'd081f88e-a45a-11ea-b9eb-0c5415dfd03a'
    'x-ms-version': '2019-07-07'
    'x-ms-content-crc64': 'QmecNePSHnY='
    'x-ms-request-server-encrypted': 'true'
    'Date': 'Mon, 01 Jun 2020 22:54:14 GMT'
Response content:
</pre>
