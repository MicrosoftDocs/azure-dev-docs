---
title: Install the Azure Developer CLI (preview)
description: Install the Azure Developer CLI (azd) with all the pre-requisites for your local environment.
author: alexwolfmsft
ms.author: alexwolf
ms.date: 08/19/2022
ms.topic: how-to
ms.custom: devx-track-azdevcli
ms.service: azure-dev-cli
zone_pivot_group_filename: developer/azure-developer-cli/azd-zone-pivot-groups.json
zone_pivot_groups: azd-os-env-set
---

# Install the Azure Developer CLI (preview)

Welcome to the Azure Developer CLI (`azd`)! Let's get started with installing and learning how to run the `azd`.

Start by selecting your development environment. For more information about the pros and cons of the different development environment choices, see [Azure Developer CLI (azd) supported environments](overview.md#supported-development-environments).

For more advanced installation scenarios and instructions, see [Azure Developer CLI Installer Scripts](https://github.com/Azure/azure-dev/blob/main/cli/installer/README.md)

::: zone pivot="os-windows"
### Install `azd`
## [Windows Package Manager (winget)](#tab/install-winget-windows)

```powershell
winget install microsoft.azd
```
`
## [Chocolatey](#tab/install-choco-windows)

```powershell
choco install azd
```

## [Script](#tab/install-script-windows)

The install script downloads and installs the MSI package on the machine with default parameters.

```powershell
powershell -ex AllSigned -c "Invoke-RestMethod 'https://aka.ms/install-azd.ps1' | Invoke-Expression"
```

### Uninstall `azd`
## [Windows Package Manager (winget)](#tab/uninstall-winget-windows)

```powershell
winget uninstall microsoft.azd
```
`
## [Chocolatey](#tab/uninstall-choco-windows)

```powershell
choco uninstall azd
```

## [Script](#tab/uninstall-script-windows)
Once you've installed the MSI versions, using the uninstall script to remove `azd` will leave some items behind on the machine. **Instead, for version 0.5.0-beta.1 and later:** 

1. Search for **Add or remove programs** in Windows.

1. Locate **Azure Dev CLI** and select the three dots to expand the options menu.

1. Select **Uninstall**.

**For versions before 0.5.0-beta.1**, use the following uninstall script:

```azdeveloper
powershell -ex AllSigned -c "Invoke-RestMethod 'https://aka.ms/uninstall-azd.ps1' | Invoke-Expression"
```

::: zone-end 

::: zone pivot="os-mac"
### Install `azd`

## [Homebrew (recommended)](#tab/install-brew-mac)
```bash
brew tap azure/azd && brew install azd
```

The `brew tap azure/azd` command only needs to be run once to configure the tap in `brew`.

If using `brew` to upgrade `azd` from a version not installed using `brew`, remove the existing version of `azd` using the uninstall script (if installed to the default location) or by deleting the `azd` binary manually.

## [Script](#tab/install-script-mac)

The install script can be used to install `azd` at the machine scope.

```bash
curl -fsSL https://aka.ms/install-azd.sh | bash
```

### Uninstall `azd`

## [Homebrew (recommended)](#tab/uninstall-brew-mac)
```bash
brew uninstall azd
```

## [Script](#tab/uninstall-script-mac)

```bash
curl -fsSL https://aka.ms/uninstall-azd.sh | bash
```

::: zone-end

::: zone pivot="os-linux"

### Install `azd`

## [Script](#tab/install-script-linux)

```bash
curl -fsSL https://aka.ms/install-azd.sh | bash
```

### DEB/RPM Packages
The Azure Developer CLI releases signed `.deb` and `.rpm` packages to [GitHub Releases](https://github.com/Azure/azure-dev/releases). To install, download the appropriate file from the GitHub release and run the appropriate command to install the package:

## [.deb package](#tab/install-deb-linux)

You can install the `.deb` package using `apt-get`:

```bash 
curl -fSL https://github.com/Azure/azure-dev/releases/download/azure-dev-cli_<version>/azd_<version>_amd64.deb -o azd_<version>_amd64.deb
apt update 
apt install ./azd_<version>_amd64.deb -y
```

> [!NOTE]
> You may need to use `sudo` when running `apt`.

## [.rpm package](#tab/install-rpm-linux)

You can install the `.rpm` package using `yum install`:

```bash 
curl -fSL https://github.com/Azure/azure-dev/releases/download/azure-dev-cli_<version>/azd-<version>-1.x86_64.rpm -o azd-<version>-1.x86_64.rpm
yum install -y azd-<version>-1.x86_64.rpm 
```

> [!NOTE]
> You may need to use `sudo` when running `yum`.

### Uninstall `azd`

## [Script](#tab/uninstall-script-linux)

```bash
curl -fsSL https://aka.ms/uninstall-azd.sh | bash
```

If you installed `azd` using one of the .deb or .rpm packages, use the appropriate uninstall method for your package manager. 

## [.deb package](#tab/uninstall-deb-linux)
```bash 
apt remove -y azd
```
> [!NOTE]
> You may need to use `sudo` when running `apt`.

## [.rpm package](#tab/uninstall-rpm-linux)
```bash 
yum remove -y azd
```

> [!NOTE]
> You may need to use `sudo` when running `yum`.


::: zone-end

::: zone pivot="env-dev-container"
A [DevContainer](https://code.visualstudio.com/docs/remote/containers) is a Docker image that includes all of the prerequisites you need to run this app on your local machine. To get started, make sure you have the pre-requisites before choosing your azd template.

## Pre-requisites

Before you get started using `azd`, ensure you have:

- Installed:
  - [Docker Desktop](https://aka.ms/azure-dev/docker-install) (other options coming soon.)
  - [Remote - Containers VS Code Extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
  
::: zone-end