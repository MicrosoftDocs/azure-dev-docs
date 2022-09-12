---
author: hhunter-ms
ms.service: azure-dev-cli
ms.topic: include
ms.date: 09/12/2022
ms.author: hannahhunter
---

A [DevContainer](https://code.visualstudio.com/docs/remote/containers) is a Docker image that includes all of the prerequisites you need to run this app on your local machine.

## Pre-requisites

Before you get started using `azd`, ensure you have:

- Installed:
  - [Docker Desktop](https://aka.ms/azure-dev/docker-install) (other options coming soon.)
  - [Remote - Containers VS Code Extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Install `azd`

### [Windows](#tab/windows)

```bash
powershell -ex AllSigned -c "Invoke-RestMethod 'https://aka.ms/install-azd.ps1' | Invoke-Expression"
```

### [Linux/MacOS](#tab/linuxmac)

```bash
curl -fsSL https://aka.ms/install-azd.sh | bash 
```

---

## Uninstall `azd`

To uninstall the `azd`:

### [Windows](#tab/windows)

```bash
powershell -ex AllSigned -c "Invoke-RestMethod 'https://aka.ms/uninstall-azd.ps1' | Invoke-Expression"
```

### [Linux/MacOS](#tab/linuxmac)

```bash
curl -fsSL https://aka.ms/uninstall-azd.sh | bash 
```

---