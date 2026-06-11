---
title: Configuring proxies when using Azure libraries
description: Use HTTP[S]_PROXY environment variables to define a proxy for an entire script or app, or use optional named arguments for client constructors or operation methods in the Azure SDK.
ms.date: 06/10/2026
ms.topic: how-to
ms.custom: devx-track-python, py-fresh-zinc
---

# How to configure proxies for the Azure SDK for Python

You often need a proxy if:

- You're behind a corporate firewall.
- Your network traffic needs to go through a security appliance.
- You want to use a custom proxy for debugging or routing.

If your organization requires a proxy server to access internet resources, set an environment variable with the proxy server information before you use the Azure SDK for Python. When you set the `HTTP_PROXY` and `HTTPS_PROXY` environment variables, the Azure SDK for Python uses the proxy server at run time.

A proxy server URL has the form `http[s]://[username:password@]<ip_address_or_domain>:<port>/`, where the username and password combination is optional.

You can obtain your proxy information from your IT or network team, from your browser, or from network utilities.

You can configure a proxy globally by using environment variables. You can also configure a proxy for an individual client constructor or operation method by passing an argument named `proxies`.

## Global configuration

To configure a proxy globally for your script or app, define `HTTP_PROXY` or `HTTPS_PROXY` environment variables with the server URL. These variables work with any version of the Azure libraries. Note that `HTTPS_PROXY` doesn't mean an HTTPS proxy. It specifies the proxy to use for `https://` requests.

If you pass the parameter `use_env_settings=False` to a client object constructor or operation method, the SDK ignores these environment variables.

### Set from the command line

#### [cmd](#tab/cmd)

:::code language="cmd" source="~/../python-sdk-docs-examples/proxy/set_proxy.cmd":::

#### [bash](#tab/bash)

:::code language="bash" source="~/../python-sdk-docs-examples/proxy/set_proxy.sh":::

---

### Set in Python code

Set proxy settings by using environment variables. You don't need any custom configuration.

:::code language="python" source="~/../python-sdk-docs-examples/proxy/set_http_proxy.py" range="1-7":::

## Custom configuration

### Set a proxy in Python code for a client or method

For custom configuration, specify a proxy for a specific client object or operation method. Use an argument named `proxies`.

For example, the following code from the article [Example: use Azure storage](./examples/azure-sdk-example-storage.md) specifies an HTTPS proxy with user credentials in the `BlobClient` constructor. In this case, the object comes from the `azure.storage.blob` library, which is based on `azure.core`.

:::code language="python" source="~/../python-sdk-docs-examples/proxy/set_http_proxy.py" range="9-26":::
