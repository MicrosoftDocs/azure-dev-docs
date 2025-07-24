---
title: Configuring proxies when using Azure libraries
description: Use HTTP[S]_PROXY environment variables to define a proxy for an entire script or app, or use optional named arguments for client constructors or operation methods in the Azure SDK.
ms.date: 05/21/2025
ms.topic: how-to
ms.custom: devx-track-python, py-fresh-zinc
---

# How to configure proxies for the Azure SDK for Python

A proxy is often needed if:

- You're behind a corporate firewall
- Your network traffic needs to go through a security appliance
- You want to use a custom proxy for debugging or routing

If your organization requires the use of a proxy server to access internet resources, you need to set an environment variable with the proxy server information to use the Azure SDK for Python. Setting the environment variables (HTTP_PROXY and HTTPS_PROXY) causes the Azure SDK for Python to use the proxy server at run time.

A proxy server URL has of the form `http[s]://[username:password@]<ip_address_or_domain>:<port>/` where the username and password combination is optional.

You can obtain your proxy information from your IT/network team, from your browser, or from network utilities.

You can then configure a proxy globally by using environment variables, or you can specify a proxy by passing an argument named `proxies` to an individual client constructor or operation method.

## Global configuration

To configure a proxy globally for your script or app, define `HTTP_PROXY` or `HTTPS_PROXY` environment variables with the server URL. These variables work with any version of the Azure libraries. Note that `HTTPS_PROXY` doesn't mean `HTTPS` proxy, but the proxy for `https://` requests.

These environment variables are ignored if you pass the parameter `use_env_settings=False` to a client object constructor or operation method.

### Set from the command line

#### [cmd](#tab/cmd)

:::code language="cmd" source="~/../python-sdk-docs-examples/proxy/set_proxy.cmd":::

##### [bash](#tab/bash)

:::code language="bash" source="~/../python-sdk-docs-examples/proxy/set_proxy.sh":::

---

### Set in Python code

You can set proxy settings using environment variables, with no
custom configuration necessary.

:::code language="python" source="~/../python-sdk-docs-examples/proxy/set_http_proxy.py" range="1-7":::

## Custom configuration

### Set in Python code per-client or per-method

For custom configuration, you can specify a proxy for a specific client object or operation method. Specify a proxy server with an argument named `proxies`.

For example, the following code from the article [Example: use Azure storage](./examples/azure-sdk-example-storage.md) specifies an HTTPS proxy with user credentials with the `BlobClient` constructor. In this case, the object comes from the azure.storage.blob library, which is based on azure.core.

:::code language="python" source="~/../python-sdk-docs-examples/proxy/set_http_proxy.py" range="9-26":::
