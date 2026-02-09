---
author: PatAltimore
ms.service: azure
ms.topic: include
ms.date: 02/05/2026
ms.author: patricka
---

Developers can use [Azure CLI](/cli/azure/what-is-azure-cli) to authenticate. Apps that use `DefaultAzureCredential` or `AzureCLICredential` can then use this account to authenticate app requests.

To authenticate with the Azure CLI, run the `az login` command. On a system with a default web browser, the Azure CLI launches the browser to authenticate the user.

```azurecli
az login
```

For systems without a default web browser, the `az login` command uses the device code authentication flow. You can also force the Azure CLI to use the device code flow rather than launching a browser by specifying the `--use-device-code` argument.

```azurecli
az login --use-device-code
```