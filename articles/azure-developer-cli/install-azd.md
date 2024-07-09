---
title: Install the Azure Developer CLI
description: Install the Azure Developer CLI (azd) with all the prerequisites for your local environment.
author: alexwolfmsft
ms.author: alexwolf
ms.date: 12/11/2022
ms.topic: how-to
ms.custom: devx-track-azdevcli, build-2023, linux-related-content
ms.service: azure-dev-cli
zone_pivot_group_filename: developer/azure-developer-cli/azd-zone-pivot-groups.json
zone_pivot_groups: azd-os-env-set
---

# Install or update the Azure Developer CLI

Welcome to the Azure Developer CLI (`azd`)! Let's get started with installing and learning how to run `azd`.

Start by selecting your development environment. For more information about the pros and cons of the different development environment choices, see [Azure Developer CLI (azd) supported environments](./supported-languages-environments.md#supported-development-environments).

For more advanced installation scenarios and instructions, see [Azure Developer CLI Installer Scripts](https://github.com/Azure/azure-dev/blob/main/cli/installer/README.md#advanced-installation-scenarios).

Note: When you install `azd`, the following tools are installed within `azd` scope (meaning they aren't installed globally) and are removed if azd is uninstalled:

- The [GitHub CLI](https://cli.github.com/)
- The [Bicep CLI](/azure/azure-resource-manager/bicep/install)

::: zone pivot="os-windows"
### [Windows Package Manager (winget)](#tab/winget-windows)
### Install `azd`

```powershell
winget install microsoft.azd
```

### Update `azd`

```powershell
winget upgrade microsoft.azd
```

### Uninstall `azd`

```powershell
winget uninstall microsoft.azd
```

### [Chocolatey](#tab/choco-windows)
### Install `azd`

```powershell
choco install azd
```

### Update `azd`
```powershell
choco upgrade azd
```

### Uninstall `azd`

```powershell
choco uninstall azd
```

### [Script](#tab/script-windows)
### Install `azd`

The install script downloads and installs the MSI package on the machine with default parameters.

```powershell
powershell -ex AllSigned -c "Invoke-RestMethod 'https://aka.ms/install-azd.ps1' | Invoke-Expression"
```

### Update `azd`
```powershell
powershell -ex AllSigned -c "Invoke-RestMethod 'https://aka.ms/install-azd.ps1' | Invoke-Expression"
```

### Uninstall `azd`

Using the uninstall script to remove `azd` leaves some items behind on the machine. **Instead, for version 0.5.0-beta.1 and later:** 

1. Search for **Add or remove programs** in Windows.

2. Locate **Azure Dev CLI** and select the three dots to expand the options menu.

3. Select **Uninstall**.

::: zone-end 

::: zone pivot="os-mac"
### [Homebrew (recommended)](#tab/brew-mac)

> [!NOTE] 
> On Apple Silicon Macs (M1 and M2) `azd` requires Rosetta 2. If Rosetta 2 is not already installed run `softwareupdate --install-rosetta` from the terminal.
>
> The `azd` install process will automatically choose the correct binary for the architecture of your machine.

### Install `azd`

```bash
brew tap azure/azd && brew install azd
```

The `brew tap azure/azd` command only needs to be run once to configure the tap in `brew`.

If you're using `brew` to upgrade `azd` from a version not installed using `brew`, remove the existing version of `azd` using the uninstall script (if installed to the default location) or by deleting the `azd` binary manually. This will automatically install the correct version.

### Update `azd`
```bash
brew upgrade azd
```

### Uninstall `azd`

```bash
brew uninstall azd
```

### [Script](#tab/script-mac)

> [!NOTE]
> The `azd` install process will automatically choose the correct binary for the architecture of the machine.

The install script can be used to install the correct version of `azd` at the machine scope. 

```bash
curl -fsSL https://aka.ms/install-azd.sh | bash
```

### Update `azd`
```bash
curl -fsSL https://aka.ms/install-azd.sh | bash
```

### Uninstall `azd`

```bash
curl -fsSL https://aka.ms/uninstall-azd.sh | bash
```

::: zone-end

::: zone pivot="os-linux"

### [Script](#tab/script-linux)
### Install `azd`

```bash
curl -fsSL https://aka.ms/install-azd.sh | bash
```

### Update `azd`
```bash
curl -fsSL https://aka.ms/install-azd.sh | bash
```

When you install `azd`, the following tools are installed within `azd` scope (meaning they aren't installed globally) and are removed if azd is uninstalled:

- The [Git CLI](https://cli.github.com/)
- The [Bicep CLI](/azure/azure-resource-manager/bicep/install)

### Uninstall `azd`

```bash
curl -fsSL https://aka.ms/uninstall-azd.sh | bash
```

### [.deb package](#tab/deb-linux)
The Azure Developer CLI releases signed `.deb` and `.rpm` packages to [GitHub Releases](https://github.com/Azure/azure-dev/releases). To install or update, download the appropriate file from the GitHub release and run the appropriate command to install the package:**

### Install or Update `.deb` package for `azd`

You can install the `.deb` package using `apt-get`:

```bash 
curl -fSL https://github.com/Azure/azure-dev/releases/download/azure-dev-cli_<version>/azd_<version>_amd64.deb -o azd_<version>_amd64.deb
apt update 
apt install ./azd_<version>_amd64.deb -y
```

### Uninstall `.deb` package for `azd`
```bash 
apt remove -y azd
```
> [!NOTE]
> You may need to use `sudo` when running `apt`.

### [.rpm package](#tab/rpm-linux)
The Azure Developer CLI releases signed `.deb` and `.rpm` packages to [GitHub Releases](https://github.com/Azure/azure-dev/releases). To install, download the appropriate file from the GitHub release and run the appropriate command to install the package:**

### Install `.rpm` package for `azd`

You can install the `.rpm` package using `yum install`:

```bash 
curl -fSL https://github.com/Azure/azure-dev/releases/download/azure-dev-cli_<version>/azd-<version>-1.x86_64.rpm -o azd-<version>-1.x86_64.rpm
yum install -y azd-<version>-1.x86_64.rpm 
```

### Uninstall `.rpm` package for `azd`

```bash 
yum remove -y azd
```

> [!NOTE]
> You may need to use `sudo` when running `yum`.

::: zone-end

::: zone pivot="env-dev-container"

## Prerequisites

Before you get started using `azd`, ensure you have:

- Installed:
  - [Docker Desktop](https://aka.ms/azure-dev/docker-install) (other options coming soon.)
  - [Remote - Containers VS Code Extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Install `azd` in a dev container

A [dev container](https://code.visualstudio.com/docs/remote/containers) is a Docker image that includes all of the prerequisites you need to run an app on your local machine. Install `azd` as a feature in your dev container via the following steps:

1. Add the `azd` feature to the `devcontainer.json` file in the `.devcontainer` folder at the root of your template.

    ```json
    {
        "name": "Azure Developer CLI",
        "image": "mcr.microsoft.com/devcontainers/python:3.10-bullseye",
        "features": {
            // See https://containers.dev/features for list of features
            "ghcr.io/devcontainers/features/docker-in-docker:2": {
            },
            "ghcr.io/azure/azure-dev/azd:latest": {}
        }
        // Rest of file omitted...
    } 
    ```

1. Rebuild and run your dev container. In Visual Studio Code, use the [command palette](https://code.visualstudio.com/docs/getstarted/userinterface#_command-palette) to execute the **Rebuild and Reopen in Dev Container** command.

::: zone-end

## Verify your installation

Verify your `azd` installation completed successfully by running the `azd version` command in a terminal:

```azdeveloper
azd version
```

`azd` prints the current version:

```output
azd version 1.9.4 (commit 60d7a770c73289e303a539babf5965e638843227)
```

## Update the Azure Developer CLI

When working with an out of date version of `azd`, you'll see a warning to upgrade to the latest version. Follow the instructions in the warning to update to the latest version.

[!INCLUDE [request-help](includes/request-help.md)]

## Next steps

> [!div class="nextstepaction"]
> [Choose an azd template](./azd-templates.md)
> [!div class="nextstepaction"]
> [Azure Developer CLI FAQ](./faq.yml)
