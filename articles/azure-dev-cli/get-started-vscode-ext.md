---
title: How to install the Visual Studio Code extension for Azure Developer CLI
description: The VS COde Extension for Azure Developer CLI is available to install.
ms.date: 04/12/2021
ms.topic: conceptual
ms.custom: devx-track-azdev
ms.prod: azure
---

# Install the VS Code extension for Azure Developer CLI

1. Install `azd` from NPM

    ```bash
    npm uninstall -g @azure/az-dev-cli
    npm install -g https://azuresdkreleasepreview.blob.core.windows.net/azd/standalone/latest/azure-az-dev-cli-latest.tgz
    ```
    
    > [!NOTE]
    > may require sudo depending on platform and configuration

2. In vscode
    1. Open "Extensions" (Ctrl+Shift+X)
    2. Click the `...` menu at top of Extensions sidebar
    3. Click "Install from VSIX"
    4. Select location of downloaded file
