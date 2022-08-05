---
title: Install the Azure Developer CLI in a DevContainer environment
description: Install the Azure Developer CLI (azd) with all the pre-requisites for your local environment.
author: hhunter-ms
ms.author: hannahhunter
ms.date: 08/05/2022
ms.topic: how-to
ms.custom: devx-track-azdevcli
ms.service: azure-dev-cli
---

# Install the Azure Developer CLI in a DevContainer environment

Welcome to the Azure Developer CLI (`azd`)! Let's get started with installing Azure Developer CLI in a DevContainer. A [DevContainer](https://code.visualstudio.com/docs/remote/containers) is a Docker image that includes all of the prerequisites you need to run this app on your local machine.

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

## Next steps

> [!div class="nextstepaction"]
> [Run azd in DevContainer](run-azd-devcontainer.md)
