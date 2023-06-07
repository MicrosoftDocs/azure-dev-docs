---
title: Create and host a tunnel
titleSuffix: Microsoft dev tunnels
description: In this quickstart, you learn how to get started with creating publicly accessible ports for local services with dev tunnels. After you complete these steps, you have a dev tunnel that you can use to connect to remote compute.
author: curib
ms.author: cauribeg
ms.topic: quickstart
ms.service: azure-dev-tunnels
ms.custom: build-2023
ms.date: 04/26/2023 
---
# Create and host a tunnel

Create, host and connect to your first tunnel in seconds.

## Install

Before you create a dev tunnel, you first need to download and install the dev tunnel CLI (Command Line Interface) tool that corresponds to your operating system.

# [Windows](#tab/windows)

```powershell
Invoke-WebRequest -Uri https://aka.ms/TunnelsCliDownload/win-x64 -OutFile devtunnel.exe
.\devtunnel.exe -h
```

Direct download link:

[Windows (x64) - https://aka.ms/TunnelsCliDownload/win-x64](https://aka.ms/TunnelsCliDownload/win-x64)

# [macOS](#tab/macos)

```bash
curl -sL https://aka.ms/DevTunnelCliInstall | bash
```

Direct download link:

[macOS (arm64) - https://aka.ms/TunnelsCliDownload/osx-x64](https://aka.ms/TunnelsCliDownload/osx-arm64-zip)

[macOS (x64) - https://aka.ms/TunnelsCliDownload/osx-x64](https://aka.ms/TunnelsCliDownload/osx-x64-zip)

# [Linux](#tab/linux)

```bash
curl -sL https://aka.ms/DevTunnelCliInstall | bash
```

Direct download link:

[Linux (x64) - https://aka.ms/TunnelsCliDownload/linux-x64](https://aka.ms/TunnelsCliDownload/linux-x64)

---

## Login

To start a dev tunnel, you first need to login with either a Microsoft Azure Active Directory (Azure AD), Microsoft, or GitHub account. Dev tunnels don't support hosting tunnels anonymously for more information take a look at the [CLI command reference](cli-commands.md) documentation.

```bash
devtunnel user login
```

## Host

Once logged in you can start hosting a tunnel using the `host` command. In the example below dev tunnels will:

. Run a local server on port `8080` that echoes requests sent to it.
. Host a tunnel for the local port `8080` that is accessible to the internet.

```bash
# Start a http server on port 8080
devtunnel echo http -p 8080
# Tunnel port 8080
devtunnel host -p 8080
```

A successful `host` command prints something similar to the following example to the console.

```bash
Connecting to host tunnel relay wss://usw2-data.rel.tunnels.api.visualstudio.com/api/v1/Host/Connect/<tunnel_id>
Hosting port 8080 at https://<tunnel_id>.usw2.devtunnels.ms:8080/, https://<tunnel_id>-8080.usw2.devtunnels.ms/ and inspect it at https:/<tunnel_id>-8080-inspect.usw2.devtunnels.ms/
Ready to accept connections for tunnel: <tunnel_id>
```

The printed text contains:

. `tunnel_id` - The ID of the tunnel.
. Public URL - The URL, which can be used to access your tunnel, `https://<tunnel_id>.usw2.devtunnels.ms:8080/` in this example.
. Inspect URL - The URL you can use to inspect the traffic sent across the tunnel in, `https:/<tunnel_id>-8080-inspect.usw2.devtunnels.ms/` in this example.

## Connect

To connect to the tunnel, you need to:

1. Visit this URL in a web browser.
1. Login using the same account as you used to host the tunnel.By default, tunnels are only accessible to you.

Congratulations! You can now access your local service across the internet.

## Next Steps

- [CLI command reference](cli-commands.md)
