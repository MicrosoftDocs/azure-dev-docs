---
title: Create and host a tunnel
titleSuffix: Microsoft dev tunnels
description: In this quickstart, you learn how to get started with creating publicly accessible ports for local services with dev tunnels. After you complete these steps, you have a dev tunnel that you can use to connect to remote compute.
author: derekbekoe
ms.author: debekoe
ms.topic: quickstart
ms.service: azure-dev-tunnels
ms.date: 03/27/2025
---
# Create and host a dev tunnel

Dev tunnels is a powerful tool to securely open your localhost to the internet and control who has access, so you can easily test and debug your web apps and webhooks from virtually anywhere. Create, host, and connect to your first dev tunnel in seconds.

In this quickstart, you'll learn how to create, host, and connect to your first dev tunnel in seconds.

## Install

Before you create a dev tunnel, you first need to download and install the `devtunnel` CLI (Command Line Interface) tool that corresponds to your operating system.

## [Windows](#tab/windows)

## Windows Package Manager (winget)

You can use winget, Microsoft's package manager for Windows, to install and update the `devtunnel` CLI.

```powershell
winget install Microsoft.devtunnel
```

This command installs the latest version by default and removes the older version in the same location, which is %LOCALAPPDATA%\Microsoft\WinGet\Packages. To specify a version, add `--version <version_number>` with your desired version to the command.

```powershell
winget upgrade Microsoft.devtunnel
```

## PowerShell script

You can also install the `devtunnel` CLI using PowerShell and running the following command:

```powershell
Invoke-WebRequest -Uri https://aka.ms/TunnelsCliDownload/win-x64 -OutFile devtunnel.exe
.\devtunnel.exe -h
```

Direct download link:

[Windows (x64) - https://aka.ms/TunnelsCliDownload/win-x64](https://aka.ms/TunnelsCliDownload/win-x64)

Run commands with `devtunnel` instead of `./devtunnel`:

1. Press the Windows key and type 'Environment variables'.
2. Select the option 'Edit the system environment variables'.
3. Select the 'Environment Variables...' button.
4. There you see two tables, in the 'System Variables' table, find and select the 'PATH' variable.
5. Select the 'Edit...' button.
6. A window should pop up. Select the 'New' button.
7. Type the directory path of your devtunnel.exe file (directory means exclude the file name from path.
8. To find the directory string, you can navigate to the directory in PowerShell or terminal and type 'pwd')
9. Select 'Ok' on all open windows and restart the command prompt.

## [macOS](#tab/macos)

## Homebrew

You can use Homebrew, to install and update the `devtunnel` CLI. The following commands could be used with or without `--cask`.

```bash
brew install --cask devtunnel
```

```bash
brew uninstall --cask devtunnel
```

```bash
brew upgrade --cask devtunnel
```

```bash
brew list --versions devtunnel
```

Please note, the following command is only available if you installed the version you are looking for with Homebrew previously. To see a list of which versions you have available, run the command above.

```bash
brew switch --cask devtunnel <older_version>
```


## Script

```bash
curl -sL https://aka.ms/DevTunnelCliInstall | bash
```

Direct download link:

[macOS (arm64) - https://aka.ms/TunnelsCliDownload/osx-arm64-zip](https://aka.ms/TunnelsCliDownload/osx-arm64-zip)

[macOS (x64) - https://aka.ms/TunnelsCliDownload/osx-x64-zip](https://aka.ms/TunnelsCliDownload/osx-x64-zip)

## [Linux](#tab/linux)

```bash
curl -sL https://aka.ms/DevTunnelCliInstall | bash
```

Direct download link:

[Linux (x64) - https://aka.ms/TunnelsCliDownload/linux-x64](https://aka.ms/TunnelsCliDownload/linux-x64)

---

## Login

To start a dev tunnel, you first need to log in with either a Microsoft Entra ID, Microsoft, or GitHub account. Dev tunnels doesn't support hosting tunnels anonymously for more information take a look at the [CLI command reference](cli-commands.md) documentation.

```bash
devtunnel user login
```

## Host

Once logged in you can start hosting a dev tunnel using the `host` command. In the example below dev tunnels will:

- Run a local server on port `8080` that echoes requests sent to it.
- Host a dev tunnel for the local port `8080` that is accessible to the internet.

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

- `tunnel_id` - The ID of the dev tunnel.
- Public URL - The URL, which can be used to access your dev tunnel, `https://<tunnel_id>.usw2.devtunnels.ms:8080/` in this example.
- Inspect URL - The URL you can use to inspect the traffic sent across the dev tunnel in, `https:/<tunnel_id>-8080-inspect.usw2.devtunnels.ms/` in this example.

## Connect

To connect to the dev tunnel, you need to:

1. Visit this URL in a web browser.
1. Login using the same account as you used to host the dev tunnel. By default, dev tunnels are only accessible to you.

Congratulations! You can now access your local service across the internet.

## Next Steps

- [CLI command reference](cli-commands.md)
