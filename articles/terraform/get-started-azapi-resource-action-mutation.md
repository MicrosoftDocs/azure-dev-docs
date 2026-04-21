---
title: Quickstart - Perform Azure resource actions with the AzAPI Terraform provider
description: Learn how to use azapi_resource_action as a managed resource to perform imperative Azure operations such as deallocating a virtual machine.
keywords: azure devops terraform virtual machine azapi resource_action mutation
ms.topic: quickstart
ms.date: 04/20/2026
ms.custom: devx-track-terraform
author: stema
ms.author: stema
ai-usage: ai-generated
---

# Quickstart: Perform Azure resource actions with the AzAPI Terraform provider

[!INCLUDE [Terraform abstract](./includes/abstract.md)]

In this article, you learn how to use [`azapi_resource_action`](https://registry.terraform.io/providers/Azure/azapi/latest/docs/resources/resource_action) as a managed Terraform **resource** (not a data source) to perform an imperative, state-changing operation on an Azure resource. In this example, you create a Linux virtual machine and then deallocate it using `azapi_resource_action`.

`azapi_resource_action` has two usage forms:

- **Resource**: Performs a state-changing operation during `terraform apply`. Terraform tracks the action in state and can optionally reverse it on `terraform destroy`.
- **Data source**: Performs a read-only operation during planning. See the [resource action data source quickstart](get-started-azapi-resource-action.md) for that scenario.

Use the resource form when you need Terraform to perform an Azure operation that isn't based on a standard CRUD lifecycle—for example, starting or stopping a VM, rotating a key, or triggering a failover.

> [!div class="checklist"]
> * Define and configure the AzureRM and AzAPI providers
> * Create a resource group, virtual network, subnet, and Linux virtual machine with the AzureRM provider
> * Use `azapi_resource_action` to deallocate the virtual machine

## Prerequisites

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../includes/open-source-devops-prereqs-azure-subscription.md)]

[!INCLUDE [configure-terraform.md](includes/configure-terraform.md)]

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
    
    variable "admin_username" {
      type        = string
      default     = "adminuser"
      description = "Administrator username for the virtual machine."
    }
    
    variable "admin_password" {
      type        = string
      sensitive   = true
      description = "Administrator password for the virtual machine."
    }
    ```

1. Create a file named `main.tf` and insert the following code:

    ```terraform
    resource "random_pet" "rg_name" {
      prefix = var.resource_group_name_prefix
    }
    
    resource "azurerm_resource_group" "example" {
      location = var.resource_group_location
      name     = random_pet.rg_name.id
    }
    
    resource "azurerm_virtual_network" "example" {
      name                = "vnet-example"
      address_space       = ["10.0.0.0/16"]
      location            = azurerm_resource_group.example.location
      resource_group_name = azurerm_resource_group.example.name
    }
    
    resource "azurerm_subnet" "example" {
      name                 = "subnet-example"
      resource_group_name  = azurerm_resource_group.example.name
      virtual_network_name = azurerm_virtual_network.example.name
      address_prefixes     = ["10.0.1.0/24"]
    }
    
    resource "azurerm_network_interface" "example" {
      name                = "nic-example"
      location            = azurerm_resource_group.example.location
      resource_group_name = azurerm_resource_group.example.name
    
      ip_configuration {
        name                          = "internal"
        subnet_id                     = azurerm_subnet.example.id
        private_ip_address_allocation = "Dynamic"
      }
    }
    
    resource "azurerm_linux_virtual_machine" "example" {
      name                            = "vm-example"
      resource_group_name             = azurerm_resource_group.example.name
      location                        = azurerm_resource_group.example.location
      size                            = "Standard_B1s"
      admin_username                  = var.admin_username
      admin_password                  = var.admin_password
      disable_password_authentication = false
    
      network_interface_ids = [azurerm_network_interface.example.id]
    
      os_disk {
        caching              = "ReadWrite"
        storage_account_type = "Standard_LRS"
      }
    
      source_image_reference {
        publisher = "Canonical"
        offer     = "0001-com-ubuntu-server-jammy"
        sku       = "22_04-lts"
        version   = "latest"
      }
    }
    
    resource "azapi_resource_action" "deallocate_vm" {
      type        = "Microsoft.Compute/virtualMachines@2023-07-01"
      resource_id = azurerm_linux_virtual_machine.example.id
      action      = "deallocate"
      method      = "POST"
    }
    ```

    Key points about using `azapi_resource_action` as a resource:

    - The `action` field specifies the ARM operation to perform. Common examples include `deallocate`, `start`, `powerOff`, `restart`, and `regenerateKey`.
    - The `method` field specifies the HTTP method. Most imperative actions use `POST`.
    - The action is performed during `terraform apply` and tracked in Terraform state.
    - To pass a request body with the action (for example, when rotating a storage account key), use the `body` attribute.

1. Create a file named `outputs.tf` and insert the following code:

    ```terraform
    output "resource_group_name" {
      value = azurerm_resource_group.example.name
    }
    
    output "virtual_machine_name" {
      value = azurerm_linux_virtual_machine.example.name
    }
    ```

[!INCLUDE [terraform-init.md](includes/terraform-init.md)]

[!INCLUDE [terraform-plan.md](includes/terraform-plan.md)]

[!INCLUDE [terraform-apply-plan.md](includes/terraform-apply-plan.md)]

## Verify the results

After `terraform apply` completes, the virtual machine is in a deallocated state. You're not billed for compute resources while the VM is deallocated, but the VM disk and network resources remain.

#### [Azure CLI](#tab/azure-cli)

1. Run [az vm get-instance-view](/cli/azure/vm#az-vm-get-instance-view) to check the power state of the virtual machine.

    ```azurecli
    az vm get-instance-view \
      --resource-group <resource_group_name> \
      --name vm-example \
      --query instanceView.statuses[1].displayStatus \
      --output tsv
    ```

    The output should be `VM deallocated`.

#### [Azure PowerShell](#tab/azure-powershell)

1. Run [Get-AzVM](/powershell/module/az.compute/get-azvm) to check the power state of the virtual machine.

    ```powershell
    (Get-AzVM -ResourceGroupName <resource_group_name> -Name vm-example -Status).Statuses[1].DisplayStatus
    ```

    The output should be `VM deallocated`.

---

## Pass a request body with an action

Some actions require a request body. For example, to regenerate a storage account access key, include a `body` attribute:

```terraform
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

## Clean up resources

[!INCLUDE [terraform-plan-destroy.md](includes/terraform-plan-destroy.md)]

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](troubleshoot.md)

## Next steps

> [!div class="nextstepaction"]
> [Terraform AzAPI provider overview](overview-azapi-provider.md)

> [!div class="nextstepaction"]
> [Learn how to use the AzAPI resource action as a data source](get-started-azapi-resource-action.md)

## Additional reading

- [Choose between AzureRM and AzAPI Terraform providers](provider-selection-azurerm-vs-azapi.md)
