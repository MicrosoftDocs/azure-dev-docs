---
title: Configuring proxies when using Azure libraries
description: Use HTTP[S]_PROXY environment variables to define a proxy for an entire script or app, or use optional named arguments for client constructors or operation methods.
ms.date: 06/09/2020
ms.topic: conceptual
---

# How to configure proxies for the Azure libraries

A proxy server URL has of the form `http[s]://[username:password@]<ip_address_or_domain>:<port>/` where the username:password combination is optional.

You can then configure a proxy globally by using environment variables, or you can specify a proxy by passing an argument named `proxies` to an individual client constructor or operation method.

## Global configuration

To configure a proxy globally for your script or app, define `HTTP_PROXY` or `HTTPS_PROXY` environment variables with the server URL. These variables work any version of the Azure libraries.

### From Python code

```python
import os
os.environ["HTTP_PROXY"] = "http://10.10.1.10:1180"

# Alternate URL and variable forms:
# os.environ["HTTP_PROXY"] = "http://username:password@10.10.1.10:1180"
# os.environ["HTTPS_PROXY"] = "http://10.10.1.10:1180"
# os.environ["HTTPS_PROXY"] = "http://username:password@10.10.1.10:1180"
```

### From the CLI

# [cmd](#tab/cmd)

```cmd
rem Non-authenticated HTTP server:
set HTTP_PROXY=http://10.10.1.10:1180

rem Authenticated HTTP server:
set HTTP_PROXY=http://username:password@10.10.1.10:1180

rem Non-authenticated HTTPS server:
set HTTPS_PROXY=http://10.10.1.10:1180

rem Authenticated HTTPS server:
set HTTPS_PROXY=http://username:password@10.10.1.10:1180
```

# [bash](#tab/bash)

```bash
# Non-authenticated HTTP server:
HTTP_PROXY=http://10.10.1.10:1180

# Authenticated HTTP server:
HTTP_PROXY=http://username:password@10.10.1.10:1180

# Non-authenticated HTTPS server:
HTTPS_PROXY=http://10.10.1.10:1180

# Authenticated HTTPS server:
HTTPS_PROXY=http://username:password@10.10.1.10:1180
```

---

## Per-client or per-method configuration

To configure a proxy for a specific client object or operation method, specify a proxy server with an argument named `proxies`.

For example, the following code from the article [Example: use Azure storage](azure-sdk-example-storage.md) specifies an HTTPS proxy with user credentials with the `BlobClient` constructor. In this case, the object comes from the azure.storage.blob library, which is based on azure.core.

```python
# Earlier code omitted for brevity

blob_client = BlobClient(storage_url, container_name="blob-container-01",
    blob_name="sample-blob.txt", credential=credential,
    proxies={ "https": "https://username:password@10.10.1.10:1180" }
)

# Other forms that the proxy URL might take:
# proxies={ "http": "http://10.10.1.10:1180" }
# proxies={ "http": "http://username:password@10.10.1.10:1180" }
# proxies={ "https": "https://10.10.1.10:1180" }
```
