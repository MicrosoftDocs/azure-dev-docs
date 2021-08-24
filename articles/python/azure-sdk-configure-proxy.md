---
title: Configuring proxies when using Azure libraries
description: Use HTTP[S]_PROXY environment variables to define a proxy for an entire script or app, or use optional named arguments for client constructors or operation methods.
ms.date: 06/16/2020
ms.topic: conceptual
ms.custom: devx-track-python
---

# How to configure proxies for the Azure libraries

A proxy server URL has of the form `http[s]://[username:password@]<ip_address_or_domain>:<port>/` where the username:password combination is optional.

You can then configure a proxy globally by using environment variables, or you can specify a proxy by passing an argument named `proxies` to an individual client constructor or operation method.

## Global configuration

To configure a proxy globally for your script or app, define `HTTP_PROXY` or `HTTPS_PROXY` environment variables with the server URL. These variables work any version of the Azure libraries.

These environment variables are ignored if you pass the parameter `use_env_settings=False` to a client object constructor or operation method.

### From Python code

:::code language="python" source="~/../python-sdk-docs-examples/proxy/set_http_proxy.py" range="1-7:::

### From the CLI

# [cmd](#tab/cmd)

:::code language="cmd" source="~/../python-sdk-docs-examples/proxy/set_proxy.cmd":::

# [bash](#tab/bash)

:::code language="bash" source="~/../python-sdk-docs-examples/proxy/set_proxy.sh":::

---

## Per-client or per-method configuration

To configure a proxy for a specific client object or operation method, specify a proxy server with an argument named `proxies`.

For example, the following code from the article [Example: use Azure storage](azure-sdk-example-storage.md) specifies an HTTPS proxy with user credentials with the `BlobClient` constructor. In this case, the object comes from the azure.storage.blob library, which is based on azure.core.

:::code language="python" source="~/../python-sdk-docs-examples/proxy/set_http_proxy.py" range="9-26:::
