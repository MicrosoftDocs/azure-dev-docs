---
title: How to install the Azure Developer CLI
description: The Azure Developer CLI is available to install in Windows, macOS and Linux environments.
ms.date: 04/12/2021
ms.topic: conceptual
ms.custom: devx-track-azdev
ms.prod: azure
---
# How to install the Azure Developer CLI

Before you get started, ensure you have the following tools installed on your local machine:

- [Git](https://git-scm.com/)
- [GitHub CLI v2.3+](https://github.com/cli/cli)
- [Node.js with npm (v 16.13.1 LTS)](https://nodejs.org/)
- [Azure CLI (v 2.30.0+)](https://docs.microsoft.com/cli/azure/install-azure-cli)
- Azure Dev CLI Extension (See install instructions below)

```bash
az extension remove --name azure-dev
az config set extension.index_url=https://azuresdkreleasepreview.blob.core.windows.net/azd/whl/latest/index.json
az extension add --name azure-dev
az config unset extension.index_url
```

> Note: the first command removes the extension. Don't worry if you see "The extension azure-dev is not installed." in red text. That is expected if you do not already have an old version of the extension.

## Install the VS Code extension 

1. Download the extension from https://azuresdkreleasepreview.blob.core.windows.net/azd/vscode/latest/azure-dev-latest.vsix
2. In vscode
    1. Open "Extensions" (Ctrl+Shift+X)
    2. Click the `...` menu at top of Extensions sidebar
    3. Click "Install from VSIX"
    4. Select location of downloaded file
