---
title: Authenticate Terraform to Azure
description: Learn the various options to authenticate to Azure with a Microsoft Account
keywords: azure devops terraform cli powershell authentication microsoft account subscription environment variables provider block
ms.topic: how-to
ms.date: 06/20/2024
ms.custom: devx-track-terraform
# Customer intent: I want to authenticate Terraform to Azure.
---

# Authenticate Terraform to Azure

[!INCLUDE [Terraform abstract](./includes/abstract.md)]

To use Terraform commands against your Azure subscription, you must first authenticate Terraform to that subscription. This article covers some common scenarios for authenticating to Azure.

In this article, you learn how to:

> [!div class="checklist"]
> * See a list of available authentication methods.
> * Select an authentication method.
> * Verify that you're authenticated.

## 1. Configure your environment

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../includes/open-source-devops-prereqs-azure-subscription.md)]

[!INCLUDE [configure-terraform.md](includes/configure-terraform.md)]

## 2. Authenticate Terraform to Azure

Terraform only supports authenticating to Azure with the Azure CLI. Authenticating using Azure PowerShell isn't supported. Therefore, while you can use the Azure PowerShell module when doing your Terraform work, you first need to authenticate to Azure using the Azure CLI.

- [Authenticate with a Microsoft account using Cloud Shell (with Bash or PowerShell)](./authenticate-to-azure-with-microsoft-account.md)
- [Authenticate with a Microsoft account using Windows (with Bash or PowerShell)](./authenticate-to-azure-with-microsoft-account.md)
- [Authenticate with a service principal](./authenticate-to-azure-with-service-principle.md)
- [Authenticate with a managed identity for Azure services](./authenticate-to-azure-with-managed-identity-for-azure-services.md)

## 3. Verify the results

Verify that you've authenticated to the Azure subscription by displaying the current subscription.

#### [Bash](#tab/bash)

To confirm the current Azure subscription with the Azure CLI, run [az account show](/cli/azure/account#az-account-show).

```azurecli
az account show
```

#### [Azure PowerShell](#tab/azure-powershell)

To confirm the current Azure subscription with Azure PowerShell, run [Get-AzContext](/powershell/module/az.accounts/get-azcontext).

```powershell
Get-AzContext
```

---

## Next steps

> [!div class="nextstepaction"]
> [Your first Terraform project: Create an Azure resource group](create-resource-group.md)
