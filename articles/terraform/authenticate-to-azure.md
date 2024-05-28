---
title: Authenticate Terraform to Azure
description: Learn the various options to authenticate to Azure with a Microsoft Account
keywords: azure devops terraform cli powershell authentication microsoft account subscription environment variables provider block
ms.topic: how-to
ms.date: 05/28/2024
ms.custom: devx-track-terraform, devx-track-azurepowershell
# Customer intent: I want to authenticate Terraform to Azure.
---

# Authenticate Terraform to Azure

[!INCLUDE [Terraform abstract](./includes/abstract.md)]

To use Terraform commands against your Azure subscription, you must first authenticate Terraform to that subscription. This article covers some common scenarios for authenticating to Azure.

In this article, you learn how to:

> [!div class="checklist"]
> * Understand common Terraform and Azure authentication scenarios
> * Authenticate via a Microsoft account from Cloud Shell (using Bash or PowerShell)
> * Authenticate via a Microsoft account from Windows (using Bash or PowerShell)
> * Create a service principal using the Azure CLI
> * Create a service principal using Azure PowerShell
> * Specify service principal credentials in environment variables
> * Specify service principal credentials in a Terraform provider block

## 1. Configure your environment

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../includes/open-source-devops-prereqs-azure-subscription.md)]

[!INCLUDE [configure-terraform.md](includes/configure-terraform.md)]

## 2. Authenticate Terraform to Azure

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

---

## Next steps

> [!div class="nextstepaction"]
> [Create an Azure resource group](create-resource-group.md)
