---
title: Authenticate Terraform using Managed Identity for Azure services
description: Learn the various options to configure and authenticate Terraform to Azure using Managed Identity for Azure services
keywords: azure devops terraform cli powershell authentication microsoft account subscription environment variables provider block
ms.topic: how-to
ms.date: 06/19/2024
ms.custom: devx-track-terraform, devx-track-azurepowershell
# Customer intent: I want to authenticate Terraform to Azure.
---

# Authenticate Terraform using Managed Identity

[!INCLUDE [Terraform abstract](./includes/abstract.md)]

[Managed identities for Azure resources](/entra/identity/managed-identities-azure-resources/overview) is used to authenticate to Azure Active Directory. HashiCorp recommends using either a Service Principal or managed identity if you're running Terraform in a non-interactive manner. There are two types of managed identities: *system-assigned* and *user-assigned*. In this article, you learn how to use system-assigned identities.

## Define a system-assigned managed identity

To use a system-assigned managed identity, use the following steps:

1. Specify the `identity` block and set `type` to `SystemAssigned`.

    ```terraform
    resource "azurerm_linux_virtual_machine" "example" {
      # ...
    
      identity {
        type = "SystemAssigned"
      }
    }
    ```

1. Grant the `Contributor` role to the identity.

    ```terraform
    data "azurerm_subscription" "current" {}

    data "azurerm_role_definition" "contributor" {
      name = "Contributor"
    }
    
    resource "azurerm_role_assignment" "example" {
      scope              = data.azurerm_subscription.current.id
      role_definition_name = "Contributor"
      principal_id       = azurerm_linux_virtual_machine.example.identity[0].principal_id
    }
    ```

1. Configure with environment variables, specifying your Azure credentials.

    ```bash
    export ARM_USE_MSI=true
    export ARM_SUBSCRIPTION_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
    export ARM_TENANT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
    ```

## Example: Create a virtual machine with a managed identity

1. Create a directory in which to test the sample Terraform code and make it the current directory.

1. Create a file named `providers.tf` and insert the following code.

    ```terraform
    terraform {
      required_version = ">=0.12"
    
      required_providers {
        azapi = {
          source  = "azure/azapi"
          version = "~>1.5"
        }
        azurerm = {
          source  = "hashicorp/azurerm"
          version = "~>2.0"
        }
        random = {
          source  = "hashicorp/random"
          version = "~>3.0"
        }
      }
    }
    
    provider "azurerm" {
      features {}
    }
    ```

1. Create a file named `main.tf` and insert the following code:

    ```terraform
    resource "random_pet" "rg_name" {
      prefix = var.resource_group_name_prefix
    }
    
    resource "azurerm_resource_group" "rg" {
      location = var.resource_group_location
      name     = random_pet.rg_name.id
    }
    
    data "azurerm_subscription" "current" {}
    
    resource "azurerm_virtual_network" "example" {
      name                = "myVnet"
      address_space       = ["10.0.0.0/16"]
      location            = azurerm_resource_group.rg.location
      resource_group_name = azurerm_resource_group.rg.name
    }
    
    resource "azurerm_subnet" "example" {
      name                 = "mySubnet"
      resource_group_name  = azurerm_resource_group.rg.name
      virtual_network_name = azurerm_virtual_network.example.name
      address_prefixes     = ["10.0.2.0/24"]
    }
    
    resource "azurerm_network_interface" "example" {
      name                = "myNic"
      location            = azurerm_resource_group.rg.location
      resource_group_name = azurerm_resource_group.rg.name
    
      ip_configuration {
        name                          = "internal"
        subnet_id                     = azurerm_subnet.example.id
        private_ip_address_allocation = "Dynamic"
      }
    }
    
    resource "azurerm_linux_virtual_machine" "example" {
      name                = "myVm"
      resource_group_name = azurerm_resource_group.rg.name
      location            = azurerm_resource_group.rg.location
      size                = "Standard_F2"
      network_interface_ids = [
        azurerm_network_interface.example.id,
      ]
    
      computer_name  = "hostname"
      admin_username = var.username
    
      admin_ssh_key {
        username   = var.username
        public_key = azapi_resource_action.ssh_public_key_gen.output.publicKey
      }
    
      identity {
        type = "SystemAssigned"
      }
    
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
    
    data "azurerm_role_definition" "contributor" {
      name = "Contributor"
    }
    
    resource "azurerm_role_assignment" "example" {
      scope              = data.azurerm_subscription.current.id
      role_definition_name = "Contributor"
      principal_id       = azurerm_linux_virtual_machine.example.identity[0].principal_id
    }
    ```

1. Create a file named `ssh.tf` and insert the following code.

    ```terraform
    resource "random_pet" "ssh_key_name" {
      prefix    = "ssh"
      separator = ""
    }
    
    resource "azapi_resource_action" "ssh_public_key_gen" {
      type        = "Microsoft.Compute/sshPublicKeys@2022-11-01"
      resource_id = azapi_resource.ssh_public_key.id
      action      = "generateKeyPair"
      method      = "POST"
    
      response_export_values = ["publicKey", "privateKey"]
    }
    
    resource "azapi_resource" "ssh_public_key" {
      type      = "Microsoft.Compute/sshPublicKeys@2022-11-01"
      name      = random_pet.ssh_key_name.id
      location  = azurerm_resource_group.rg.location
      parent_id = azurerm_resource_group.rg.id
    }
    
    output "key_data" {
      value = azapi_resource_action.ssh_public_key_gen.output.publicKey
    }
        ```

1. Create a file named `variables.tf` and insert the following code:

    ```terraform
    variable "resource_group_location" {
      type        = string
      description = "Location of the resource group."
      default     = "eastus"
    }
    
    variable "resource_group_name_prefix" {
      type        = string
      description = "Prefix of the resource group name that's combined with a random ID so name is unique in your Azure subscription."
      default     = "rg"
    }
    
    variable "username" {
      type        = string
      description = "The username for the local account that will be created on the new VM."
      default     = "azureadmin"
    }
    ```

1. Create a file named `outputs.tf` and insert the following code:

    ```terraform
    output "resource_group_name" {
      value = azurerm_resource_group.rg.name
    }
    
    output "azurerm_linux_virtual_machine_name" {
      value = azurerm_linux_virtual_machine.example.name
    }
    ```

## Next steps

> [!div class="nextstepaction"]
> [Your first Terraform project: Create an Azure resource group](./create-resource-group.md)
