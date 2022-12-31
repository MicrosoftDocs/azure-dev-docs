---
title: Authenticate Pulumi to Azure
description: Learn the various options to authenticate to Azure with a Microsoft Account
keywords: azure devops pulumi cli powershell authentication microsoft account subscription environment variables
ms.topic: how-to
ms.date: 12/30/2022
ms.custom: devx-track-pulumi
# Customer intent: I want to authenticate Pulumi to Azure.
---

# Authenticate Pulumi to Azure

[!INCLUDE [Pulumi abstract](./includes/abstract.md)]

To use Pulumi commands against your Azure subscription, you must first authenticate Pulumi to that subscription. This article covers some common scenarios for authenticating to Azure.

In this article, you learn how to:
> [!div class="checklist"]

> * Understand common Pulumi and Azure authentication scenarios
> * Authenticate via a Microsoft account from Cloud Shell (using Bash or PowerShell)
> * Authenticate via a Microsoft account from Windows (using Bash or PowerShell)
> * Create a service principal using the Azure CLI
> * Create a service principal using Azure PowerShell
> * Specify service principal credentials in environment variables

## 1. Configure your environment

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../includes/open-source-devops-prereqs-azure-subscription.md)]

[!INCLUDE [configure-pulumi.md](includes/configure-pulumi.md)]

## 2. Authenticate Pulumi to Azure

[!INCLUDE [authenticate-to-azure.md](includes/authenticate-to-azure.md)]

## 3. Verify the results

Verify that you've authenticated to the Azure subscription by displaying the current subscription.

#### [Bash](#tab/bash)

To confirm the current Azure subscription via the Azure CLI, run [az account show](/cli/azure/account#az-account-show).

```azurecli
az account show
```

#### [Azure PowerShell](#tab/azure-powershell)

To confirm the current Azure subscription via Azure PowerShell, run [Get-AzContext](/powershell/module/az.accounts/get-azcontext).

```powershell
Get-AzContext
```
