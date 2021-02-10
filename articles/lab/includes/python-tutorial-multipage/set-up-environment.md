---
title: include file azure-sign-in.md
description: include file azure-sign-in.md
ms.date: 10/13/2020
ms.topic: include
ms.custom: devx-track-javascript
---


1. Have an Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).
1. Install <a href="https://www.python.org/downloads/" target="_blank">Python 3.6 or higher</a>.
1. Install the <a href="/cli/azure/install-azure-cli" target="_blank">Azure CLI</a> 2.0.80 or higher, with which you run commands in any shell to provision and configure Azure resources.

Open a terminal window and check your Python version is 3.6 or higher:

# [Bash](#tab/bash)

```bash
python3 --version
```

# [PowerShell](#tab/powershell)

```cmd
py -3 --version
```

# [Cmd](#tab/cmd)

```cmd
py -3 --version
```

---

Check that your Azure CLI version is 2.0.80 or higher:

```azurecli
az --version
```

Then sign in to Azure through the CLI:

```azurecli
az login
```

This command opens a browser to gather your credentials. When the command finishes, it shows JSON output containing information about your subscriptions.

Once signed in, you can run Azure commands with the Azure CLI to work with resources in your subscription.
