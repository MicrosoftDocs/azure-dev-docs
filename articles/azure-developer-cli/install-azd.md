---
title: Install the Azure Developer CLI
description: Install the Azure Developer CLI (azd) with all the pre-requisites for your local environment.
author: alexwolfmsft
ms.author: alexwolf
ms.date: 08/19/2022
ms.topic: how-to
ms.custom: devx-track-azdevcli, build-2023
ms.service: azure-dev-cli
zone_pivot_group_filename: developer/azure-developer-cli/azd-zone-pivot-groups.json
zone_pivot_groups: azd-os-env-set
---

# Install or update the Azure Developer CLI

Welcome to the Azure Developer CLI (`azd`)! Let's get started with installing and learning how to run `azd`.

Start by selecting your development environment. For more information about the pros and cons of the different development environment choices, see [Azure Developer CLI (azd) supported environments](./supported-languages-environments.md#supported-development-environments).

For more advanced installation scenarios and instructions, see [Azure Developer CLI Installer Scripts](https://github.com/Azure/azure-dev/blob/main/cli/installer/README.md#advanced-installation-scenarios)

Note: When you install `azd`, the following tools are installed within `azd` scope (meaning they are not installed globally) and are removed if azd is uninstalled:

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

Once you've installed the MSI versions, using the uninstall script to remove `azd` will leave some items behind on the machine. **Instead, for version 0.5.0-beta.1 and later:** 

1. Search for **Add or remove programs** in Windows.

2. Locate **Azure Dev CLI** and select the three dots to expand the options menu.

3. Select **Uninstall**.

::: zone-end 

::: zone pivot="os-mac"
### [Homebrew (recommended)](#tab/brew-mac)

> [!NOTE] 
> On Apple Silicon Macs (M1 and M2) `azd` requires Rosetta 2. If Rosetta 2 is not already installed run `softwareupdate --install-rosetta` from the terminal.

### Install `azd`

```bash
brew tap azure/azd && brew install azd
```

The `brew tap azure/azd` command only needs to be run once to configure the tap in `brew`.

If using `brew` to upgrade `azd` from a version not installed using `brew`, remove the existing version of `azd` using the uninstall script (if installed to the default location) or by deleting the `azd` binary manually.

### Update `azd`
```bash
brew upgrade azd
```

### Uninstall `azd`

```bash
brew uninstall azd
```

### [Script](#tab/script-mac)
### Install `azd`

The install script can be used to install `azd` at the machine scope.

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

### [Apple Silicon (beta, manual)](#tab/manual-mac)
### Install `azd` 

> [!NOTE]
> There is an ARM64 build of `azd` available for Apple Silicon Macs (M1 and M2). Support for ARM64 `azd` is beta. Report issues with ARM64 builds by [filing an issue in the Azure Developer CLI GitHub repo](https://github.com/Azure/azure-dev/issues).

1. Download `azd-darwin-arm64-beta.zip` from [Azure Developer CLI GitHub Releases](https://github.com/Azure/azure-dev/releases)
1. Unzip the the `.zip` file 
1. Ensure that `azd-darwin-arm64-beta` is executable (`chmod +x azd-darwin-arm64-beta`)
1. Copy `azd-darwin-arm64-beta` to a location in `$PATH` (e.g. `/usr/local/bin/azd`)

::: zone-end

::: zone pivot="os-linux"

### [Script](#tab/script-linux)
### Install `azd`

```bash
curl -fsSL https://aka.ms/install-azd.sh | bash
```

### Update `azd`
```bash
curl -fsSL https://aka.ms/uninstall-azd.sh | bash
```

When you install `azd`, the following tools are installed within `azd` scope (meaning they are not installed globally) and are removed if azd is uninstalled:

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

### [ARM64 (beta, manual)](#tab/manual-linux)
### Install `azd` 

> [!NOTE]
> There is an ARM64 build of `azd` available for ARM64 Linux. Support for ARM64 `azd` is beta. Report issues with ARM64 builds by [filing an issue in the Azure Developer CLI GitHub repo](https://github.com/Azure/azure-dev/issues).

1. Download `azd-linux-arm64-beta.tar.gz` from [Azure Developer CLI GitHub Releases](https://github.com/Azure/azure-dev/releases)
1. Extract the `.tar.gz` file
1. Ensure that `azd-linux-arm64-beta` is executable (`chmod +x azd-linux-arm64-beta`)
1. Copy `azd-linux-arm64-beta` to a location in `$PATH` (e.g. `/usr/local/bin/azd`)

::: zone-end

::: zone pivot="env-dev-container"
## Dev Container

A [Dev Container](https://code.visualstudio.com/docs/remote/containers) is a Docker image that includes all of the prerequisites you need to run this app on your local machine. To get started, make sure you have the pre-requisites before choosing your azd template.

## Pre-requisites

Before you get started using `azd`, ensure you have:

- Installed:
  - [Docker Desktop](https://aka.ms/azure-dev/docker-install) (other options coming soon.)
  - [Remote - Containers VS Code Extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
  
::: zone-end

## Updating the Azure Developer CLI

When working with an out of date version of `azd`, you will see a warning to upgrade to the latest version. Follow the instructions in the warning to update to the latest version.

[!INCLUDE [request-help](includes/request-help.md)]

## Next steps

> [!div class="nextstepaction"]
> [Choose an azd template](./azd-templates.md)
