---
title: Configure logging in the Azure libraries for Python
description: The Azure libraries use the standard Python logging module, which is configured on a per-library or per-operation basis.
ms.date: 11/01/2024
ms.topic: how-to
ms.custom: devx-track-python, py-fresh-zinc
---

# Configure logging in the Azure libraries for Python

Azure Libraries for Python that are [based on azure.core](azure-sdk-library-package-index.md#libraries-using-azurecore) provide logging output using the standard Python [logging](https://docs.python.org/3/library/logging.html) library.

The general process to work with logging is as follows:

1. Acquire the logging object for the desired library and set the logging level.
1. Register a handler for the logging stream.
1. To include HTTP information, pass a `logging_enable=True` parameter to a client object constructor, a credential object constructor, or to a specific method.

Details are provided in the remaining sections of this article.

As a general rule, the best resource for understanding logging usage within the libraries is to browse the SDK source code at [github.com/Azure/azure-sdk-for-python](https://github.com/Azure/azure-sdk-for-python). We encourage you to clone this repository locally so you can easily search for details when needed, as the following sections suggest.

## Set logging levels

:::code language="python" source="~/../python-sdk-docs-examples/logging/set_levels.py" range="1-9":::

- This example acquires the logger for the `azure.mgmt.resource` library, then sets the logging level to `logging.DEBUG`.
- You can call `logger.setLevel` at any time to change the logging level for different segments of code.

To set a level for a different library, use that library's name in the `logging.getLogger` call. For example, the azure-eventhubs library provides a logger named `azure.eventhubs`, the azure-storage-queue library provides a logger named `azure.storage.queue`, and so on. (The SDK source code frequently uses the statement `logging.getLogger(__name__)`, which acquires a logger using the name of the containing module.)

You can also use more general namespaces. For example,

:::code language="python" source="~/../python-sdk-docs-examples/logging/set_levels.py" range="1-2,11-17":::

The `azure` logger is used by some libraries instead of a specific logger. For example, the azure-storage-blob library uses the `azure` logger.

You can use the `logger.isEnabledFor` method to check whether any given logging level is enabled:

:::code language="python" source="~/../python-sdk-docs-examples/storage/use_blob_auth_logging.py" range="22-27":::

Logging levels are the same as the [standard logging library levels](https://docs.python.org/3/library/logging.html#levels). The following table describes the general use of these logging levels in the Azure libraries for Python:

| Logging level             | Typical use |
| ---                       | ---         |
| logging.ERROR             | Failures where the application is unlikely to recover (such as out of memory). |
| logging.WARNING (default) | A function fails to perform its intended task (but not when the function can recover, such as retrying a REST API call). Functions typically log a warning when raising exceptions. The warning level automatically enables the error level. |
| logging.INFO              | Function operates normally or a service call is canceled. Info events typically include requests, responses, and headers. The info level automatically enables the error and warning levels. |
| logging.DEBUG             | Detailed information that is commonly used for troubleshooting and includes a stack trace for exceptions. The debug level automatically enables the info, warning, and error levels. CAUTION: If you also set `logging_enable=True`, the debug level includes sensitive information such as account keys in headers and other credentials. Be sure to protect these logs to avoid compromising security. |
| logging.NOTSET            | Disable all logging. |

### Library-specific logging level behavior

The exact logging behavior at each level depends on the library in question. Some libraries, such as azure.eventhub, perform extensive logging whereas other libraries do little.

The best way to examine the exact logging for a library is to search for the logging levels in the [Azure SDK for Python source code](https://github.com/Azure/azure-sdk-for-python):

1. In the repository folder, navigate into the *sdk* folder, then navigate into the folder for the specific service of interest.

1. In that folder, search for any of the following strings:

    - `_LOGGER.error`
    - `_LOGGER.warning`
    - `_LOGGER.info`
    - `_LOGGER.debug`

## Register a log stream handler

To capture logging output, you must register at least one log stream handler in your code:

:::code language="python" source="~/../python-sdk-docs-examples/storage/use_blob_auth_logging.py" range="1,17-20":::

This example registers a handler that directs log output to stdout. You can use other types of handlers as described on [logging.handlers](https://docs.python.org/3/library/logging.handlers.html) in the Python documentation or use the standard [logging.basicConfig](https://docs.python.org/3/library/logging.html#logging.basicConfig) method.

## Enable HTTP logging for a client object or operation

By default, logging within the Azure libraries doesn't include any HTTP information. To include HTTP information in log output, you must explicitly pass `logging_enable=True` to a client or credential object constructor or to a specific method.

> [!CAUTION]
> HTTP logging can include sensitive information such as account keys in headers and other credentials. Be sure to protect these logs to avoid compromising security.

### Enable HTTP logging for a client object

:::code language="python" source="~/../python-sdk-docs-examples/logging/enable_for_client.py":::

Enabling HTTP logging for a client object enables logging for all operations invoked through that object.

### Enable HTTP logging for a credential object

:::code language="python" source="~/../python-sdk-docs-examples/logging/enable_for_credential.py":::

Enabling HTTP logging for a credential object enables logging for all operations invoked through that object, but not for operations in a client object that don't involve authentication.

### Enable logging for an individual method

:::code language="python" source="~/../python-sdk-docs-examples/logging/enable_for_method.py":::

## Example logging output

The following code is that shown in [Example: Use a storage account](./examples/azure-sdk-example-storage-use.md) with the addition of enabling DEBUG and HTTP logging:

:::code language="python" source="~/../python-sdk-docs-examples/storage/use_blob_auth_logging.py":::

The output is as follows:

```output
Logger enabled for ERROR=True, WARNING=True, INFO=True, DEBUG=True
Request URL: 'https://pythonazurestorage12345.blob.core.windows.net/blob-container-01/sample-blob-5588e.txt'
Request method: 'PUT'
Request headers:
    'Content-Length': '77'
    'x-ms-blob-type': 'BlockBlob'
    'If-None-Match': '*'
    'x-ms-version': '2023-11-03'
    'Content-Type': 'application/octet-stream'
    'Accept': 'application/xml'
    'User-Agent': 'azsdk-python-storage-blob/12.19.0 Python/3.10.11 (Windows-10-10.0.22631-SP0)'
    'x-ms-date': 'Fri, 19 Jan 2024 19:25:53 GMT'
    'x-ms-client-request-id': '8f7b1b0b-b700-11ee-b391-782b46f5c56b'
    'Authorization': '*****'
Request body:
b"Hello there, Azure Storage. I'm a friendly file ready to be stored in a blob."
Response status: 201
Response headers:
    'Content-Length': '0'
    'Content-MD5': 'SUytm0872jZh+KYqtgjbTA=='
    'Last-Modified': 'Fri, 19 Jan 2024 19:25:54 GMT'
    'ETag': '"0x8DC1924749AE3C3"'
    'Server': 'Windows-Azure-Blob/1.0 Microsoft-HTTPAPI/2.0'
    'x-ms-request-id': '7ac499fa-601e-006d-3f0d-4bdf28000000'
    'x-ms-client-request-id': '8f7b1b0b-b700-11ee-b391-782b46f5c56b'
    'x-ms-version': '2023-11-03'
    'x-ms-content-crc64': 'rtHLUlztgxc='
    'x-ms-request-server-encrypted': 'true'
    'Date': 'Fri, 19 Jan 2024 19:25:53 GMT'
Response content:
b''
```

> [!NOTE]
> If you get an authorization error, make sure the identity you're running under is assigned the "Storage Blob Data Contributor" role on your blob container. To learn more, see [Use blob storage from app code (Passwordless tab)](./examples/azure-sdk-example-storage-use.md?tab=managed-identity#4-use-blob-storage-from-app-code).
