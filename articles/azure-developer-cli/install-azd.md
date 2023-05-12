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

**For versions before 0.5.0-beta.1**, use the following uninstall script:

```azdeveloper
powershell -ex AllSigned -c "Invoke-RestMethod 'https://aka.ms/uninstall-azd.ps1' | Invoke-Expression"
```

::: zone-end 

::: zone pivot="os-mac"
### [Homebrew (recommended)](#tab/brew-mac)
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

::: zone-end

::: zone pivot="os-linux"

### [Script](#tab/script-linux)
### Install `azd`

```bash
curl -fsSL https://aka.ms/install-azd.sh | bash
```

### Update `azd`
curl -fsSL https://aka.ms/uninstall-azd.sh | bash


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
## DevContainer

A [DevContainer](https://code.visualstudio.com/docs/remote/containers) is a Docker image that includes all of the prerequisites you need to run this app on your local machine. To get started, make sure you have the pre-requisites before choosing your azd template.

## Pre-requisites

Before you get started using `azd`, ensure you have:

- Installed:
  - [Docker Desktop](https://aka.ms/azure-dev/docker-install) (other options coming soon.)
  - [Remote - Containers VS Code Extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
  
::: zone-end