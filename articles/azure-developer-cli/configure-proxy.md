---
title: Configure a proxy server for the Azure Developer CLI
description: Learn how to configure the Azure Developer CLI (azd) and its dependent tools to work behind a corporate proxy server or firewall.
author: alexwolfmsft
ms.author: alexwolf
ms.date: 12/19/2025
ms.service: azure-dev-cli
ms.topic: how-to
ms.custom: devx-track-azdevcli
---

# Configure a proxy server for the Azure Developer CLI

If your organization requires the use of a proxy server to access internet resources, you must configure the Azure Developer CLI (`azd`) to route traffic through that proxy.

## Configure `azd` proxy settings

Set the following environment variable to use local proxy server:

### PowerShell

```powershell
$env:HTTP_PROXY = "http://proxy.example.com:8080"
$env:HTTPS_PROXY = "http://proxy.example.com:8080"
$env:NO_PROXY = "localhost,127.0.0.1,.azurewebsites.net"
```

### Bash

```bash
export HTTP_PROXY="http://proxy.example.com:8080"
export HTTPS_PROXY="http://proxy.example.com:8080"
export NO_PROXY="localhost,127.0.0.1,.azurewebsites.net"
```

> [!NOTE]
> Invalid environment variables values will result in various HTTP related error messages when running azd commands.

`azd` uses the Go `net/http` package. `DefaultTransport` is the default implementation of `Transport` and is used by `DefaultClient`. It establishes network connections as needed and caches them for reuse by subsequent calls. It uses HTTP proxies as directed by the environment variables `HTTP_PROXY`, `HTTPS_PROXY` and `NO_PROXY` (upppercase or lowercase).

## Next steps

- [Troubleshoot](/azure/developer/azure-developer-cli/troubleshoot)
- [Environment variables](/azure/developer/azure-developer-cli/manage-environment-variables)
