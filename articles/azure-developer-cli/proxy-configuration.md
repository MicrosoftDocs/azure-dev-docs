---
title: Configure the Azure Developer CLI to use a proxy server
description: Learn how to configure the Azure Developer CLI to run behind a proxy server
author: alexwolfmsft
ms.author: alexwolf
ms.date: 07/29/2025
ms.service: azure-dev-cli
ms.topic: how-to
ms.custom: devx-track-azdevcli
---

# Proxy Configuration

The Azure Developer CLI (`azd`) supports configurations to run behind a proxy server. The `HTTP_PROXY` and `HTTPS_PROXY` environment variables set the proxy that `azd` will use for all http and https requests.

Set the following environment variable to use local proxy server:

## Windows

```powershell
$env:HTTP_PROXY = <PROXY_ADDRESS>
$env:HTTPS_PROXY = <PROXY_ADDRESS>
```

## Linux / Mac OS

```bash
export HTTP_PROXY=<PROXY_ADDRESS>
export HTTPS_PROXY=<PROXY_ADDRESS>
```

> [!NOTE]
> Setting the environment variables to invalid values will result in various HTTP related error messages when running `azd` commands.

## Next steps

> [!div class="nextstepaction"]
> [Azure Developer CLI support for Azure Deployment Environments](/azure/developer/azure-developer-cli/ade-integration)
> [Template list command reference](/azure/developer/azure-developer-cli/reference#azd-template)
