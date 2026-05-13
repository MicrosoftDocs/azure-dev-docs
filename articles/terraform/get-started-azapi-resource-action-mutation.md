---
title: Quickstart - Perform Azure resource actions with the AzAPI Terraform provider
description: Learn how to use azapi_resource_action as a managed resource to perform imperative Azure operations such as rotating storage account keys.
keywords: azure devops terraform storage account azapi resource_action key rotation
ms.topic: quickstart
ms.date: 04/20/2026
ms.custom: devx-track-terraform
author: stema
ms.author: stema
ai-usage: ai-generated
---

# Quickstart: Perform Azure resource actions with the AzAPI Terraform provider

[!INCLUDE [Terraform abstract](./includes/abstract.md)]

Use [`azapi_resource_action`](https://registry.terraform.io/providers/Azure/azapi/latest/docs/resources/resource_action) as a managed Terraform resource to perform imperative, state-changing operations on Azure resources. In this example, you create an Azure storage account and then rotate its access keys.

`azapi_resource_action` has two usage forms:

- **Resource**: Performs a state-changing operation during `terraform apply`. Terraform tracks the action in state and can optionally reverse it on `terraform destroy`.
- **Data source**: Performs a read-only operation during planning. See the [resource action data source quickstart](get-started-azapi-resource-action.md) for that scenario.

Use the resource form when you need Terraform to perform an Azure operation that isn't based on a standard create/read/update/delete lifecycle—for example, rotating credentials, starting or stopping a VM, or triggering a failover.

> [!div class="checklist"]
> * Create a storage account with the AzureRM provider
> * Rotate the storage account access key with `azapi_resource_action`

## Prerequisites

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../includes/open-source-devops-prereqs-azure-subscription.md)]

[!INCLUDE [configure-terraform.md](includes/configure-terraform.md)]

[!INCLUDE [confirm-default-azure-subscription-or-authenticate.md](includes/confirm-default-azure-subscription-or-authenticate.md)]

## Implement the Terraform code

1. Create a directory in which to test the sample Terraform code and make it the current directory.

1. Create a file named `providers.tf` and insert the following code:

    ```terraform
    terraform {
      required_providers {
        azapi = {
          source  = "Azure/azapi"
          version = "~> 2.0"
        }
        azurerm = {
          source  = "hashicorp/azurerm"
          version = "~> 4.0"
        }
        random = {
          source  = "hashicorp/random"
          version = "~> 3.0"
        }
      }
    }
    
    provider "azurerm" {
      features {}
    }
    
    provider "azapi" {}
    ```

1. Create a file named `variables.tf` and insert the following code:

    ```terraform
    variable "resource_group_location" {
      type        = string
      default     = "eastus"
      description = "Location of the resource group."
    }
    
    variable "resource_group_name_prefix" {
      type        = string
      default     = "rg"
      description = "Prefix of the resource group name that's combined with a random value to create a unique name."
    }
    
    variable "storage_account_name_prefix" {
      type        = string
      default     = "st"
      description = "Prefix of the storage account name that's combined with a random value to create a unique name."
    }
    ```

1. Create a file named `main.tf` and insert the following code:

    ```terraform
    resource "random_pet" "rg_name" {
      prefix = var.resource_group_name_prefix
    }
    
    resource "random_string" "storage_suffix" {
      length  = 8
      upper   = false
      special = false
    }
    
    resource "azurerm_resource_group" "example" {
      location = var.resource_group_location
      name     = random_pet.rg_name.id
    }
    
    resource "azurerm_storage_account" "example" {
      name                     = "${var.storage_account_name_prefix}${random_string.storage_suffix.result}"
      resource_group_name      = azurerm_resource_group.example.name
      location                 = azurerm_resource_group.example.location
      account_tier             = "Standard"
      account_replication_type = "LRS"
    }
    
    resource "azapi_resource_action" "regenerate_key" {
      type        = "Microsoft.Storage/storageAccounts@2023-01-01"
      resource_id = azurerm_storage_account.example.id
      action      = "regenerateKey"
      method      = "POST"
    
      body = {
        keyName = "key1"
      }
    }
    ```

    Key points about using `azapi_resource_action` as a resource:

    - The `action` field specifies the ARM operation to perform. For storage account key rotation, use `regenerateKey`.
    - The `method` field specifies the HTTP method. Most imperative actions use `POST`.
    - The `body` attribute passes data to the action. For key regeneration, specify which key (`key1` or `key2`) to rotate.
    - The action is performed during `terraform apply` and tracked in Terraform state.

1. Create a file named `outputs.tf` and insert the following code:

    ```terraform
    output "resource_group_name" {
      value = azurerm_resource_group.example.name
    }
    
    output "storage_account_name" {
      value = azurerm_storage_account.example.name
    }
    ```

[!INCLUDE [terraform-init.md](includes/terraform-init.md)]

[!INCLUDE [terraform-plan.md](includes/terraform-plan.md)]

[!INCLUDE [terraform-apply-plan.md](includes/terraform-apply-plan.md)]

## Verify the results

After `terraform apply` completes, the storage account key has been rotated. You can verify the key rotation by checking the storage account keys in Azure.

#### [Azure CLI](#tab/azure-cli)

Run [az storage account keys list](/cli/azure/storage/account/keys#az-storage-account-keys-list) to view the storage account keys.

```azurecli
az storage account keys list \
  --resource-group <resource_group_name> \
  --account-name <storage_account_name>
```

    The `value` field shows the current key.

#### [Azure PowerShell](#tab/azure-powershell)

Run [Get-AzStorageAccountKey](/powershell/module/az.storage/get-azstorageaccountkey) to view the storage account keys.

```powershell
Get-AzStorageAccountKey `
  -ResourceGroupName <resource_group_name> `
  -Name <storage_account_name>
```

    The `Value` property shows the current key.

---

## Examples of other resource actions

The `azapi_resource_action` resource works with many Azure operations. Here are common examples:

- **Virtual Machines**: `deallocate`, `start`, `restart`, `powerOff`, `reimage`
- **Key Vaults**: `purge` (for soft-deleted vaults), `rotate` (for managed keys)
- **App Services**: `swap` (for deployment slots), `restart`
- **Databases**: `failover`, `promote`
- **Compute resources**: Any operation exposed by the Azure REST API that modifies state without creating or destroying a resource

## Clean up resources

[!INCLUDE [terraform-plan-destroy.md](includes/terraform-plan-destroy.md)]

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](troubleshoot.md)

## Next steps

> [!div class="nextstepaction"]
> [Terraform AzAPI provider overview](overview-azapi-provider.md)

> [!div class="nextstepaction"]
> [Learn how to use the AzAPI resource action as a data source](get-started-azapi-resource-action.md)
