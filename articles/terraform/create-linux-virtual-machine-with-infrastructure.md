---
title: Quickstart - Configure a Linux virtual machine in Azure using Terraform
description: Learn how to use Terraform to configure a complete Linux virtual machine environment in Azure.
keywords: azure devops terraform linux vm virtual machine
ms.topic: quickstart
ms.date: 08/29/2022
ms.custom: devx-track-terraform
---

# Quickstart: Configure a Linux virtual machine in Azure using Terraform

Article tested with the following Terraform and Terraform provider versions:

- [Terraform v1.1.7](https://releases.hashicorp.com/terraform/)
- [AzureRM Provider v.2.99.0](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs)

[!INCLUDE [Terraform abstract](./includes/abstract.md)]

This article shows you how to create a complete Linux environment and supporting resources with Terraform. Those resources include a virtual network, subnet, public IP address, and more.

In this article, you learn how to:
> [!div class="checklist"]

> * Create a virtual network
> * Create a subnet
> * Create a public IP address
> * Create a network security group and SSH inbound rule
> * Create a virtual network interface card
> * Connect the network security group to the network interface
> * Create a storage account for boot diagnostics
> * Create SSH key
> * Create a virtual machine
> * Use SSH to connect to virtual machine

## Prerequisites

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../includes/open-source-devops-prereqs-azure-subscription.md)]

[!INCLUDE [configure-terraform.md](includes/configure-terraform.md)]

## Implement the Terraform code

1. Create a directory in which to test the sample Terraform code and make it the current directory.

1. Create a file named `providers.tf` and insert the following code:

    ```hcl
    terraform {
    
      required_version = ">=0.12"
      
      required_providers {
        azurerm = {
          source = "hashicorp/azurerm"
          version = "~>2.0"
        }
      }
    }
    
    provider "azurerm" {
      features {}
    }
    ```

1. Create a file named `main.tf` and insert the following code:

    ```hcl
    resource "random_pet" "rg-name" {
      prefix    = var.resource_group_name_prefix
    }
    
    resource "azurerm_resource_group" "rg" {
      name      = random_pet.rg-name.id
      location  = var.resource_group_location
    }
    
    # Create virtual network
    resource "azurerm_virtual_network" "myterraformnetwork" {
      name                = "myVnet"
      address_space       = ["10.0.0.0/16"]
      location            = azurerm_resource_group.rg.location
      resource_group_name = azurerm_resource_group.rg.name
    }
    
    # Create subnet
    resource "azurerm_subnet" "myterraformsubnet" {
      name                 = "mySubnet"
      resource_group_name  = azurerm_resource_group.rg.name
      virtual_network_name = azurerm_virtual_network.myterraformnetwork.name
      address_prefixes     = ["10.0.1.0/24"]
    }
    
    # Create public IPs
    resource "azurerm_public_ip" "myterraformpublicip" {
      name                = "myPublicIP"
      location            = azurerm_resource_group.rg.location
      resource_group_name = azurerm_resource_group.rg.name
      allocation_method   = "Dynamic"
    }
    
    # Create Network Security Group and rule
    resource "azurerm_network_security_group" "myterraformnsg" {
      name                = "myNetworkSecurityGroup"
      location            = azurerm_resource_group.rg.location
      resource_group_name = azurerm_resource_group.rg.name
    
      security_rule {
        name                       = "SSH"
        priority                   = 1001
        direction                  = "Inbound"
        access                     = "Allow"
        protocol                   = "Tcp"
        source_port_range          = "*"
        destination_port_range     = "22"
        source_address_prefix      = "*"
        destination_address_prefix = "*"
      }
    }
    
    # Create network interface
    resource "azurerm_network_interface" "myterraformnic" {
      name                = "myNIC"
      location            = azurerm_resource_group.rg.location
      resource_group_name = azurerm_resource_group.rg.name
    
      ip_configuration {
        name                          = "myNicConfiguration"
        subnet_id                     = azurerm_subnet.myterraformsubnet.id
        private_ip_address_allocation = "Dynamic"
        public_ip_address_id          = azurerm_public_ip.myterraformpublicip.id
      }
    }
    
    # Connect the security group to the network interface
    resource "azurerm_network_interface_security_group_association" "example" {
      network_interface_id      = azurerm_network_interface.myterraformnic.id
      network_security_group_id = azurerm_network_security_group.myterraformnsg.id
    }
    
    # Generate random text for a unique storage account name
    resource "random_id" "randomId" {
      keepers = {
        # Generate a new ID only when a new resource group is defined
        resource_group = azurerm_resource_group.rg.name
      }
    
      byte_length = 8
    }
    
    # Create storage account for boot diagnostics
    resource "azurerm_storage_account" "mystorageaccount" {
      name                     = "diag${random_id.randomId.hex}"
      location                 = azurerm_resource_group.rg.location
      resource_group_name      = azurerm_resource_group.rg.name
      account_tier             = "Standard"
      account_replication_type = "LRS"
    }
    
    # Create (and display) an SSH key
    resource "tls_private_key" "example_ssh" {
      algorithm = "RSA"
      rsa_bits  = 4096
    }
    
    # Create virtual machine
    resource "azurerm_linux_virtual_machine" "myterraformvm" {
      name                  = "myVM"
      location              = azurerm_resource_group.rg.location
      resource_group_name   = azurerm_resource_group.rg.name
      network_interface_ids = [azurerm_network_interface.myterraformnic.id]
      size                  = "Standard_DS1_v2"
    
      os_disk {
        name                 = "myOsDisk"
        caching              = "ReadWrite"
        storage_account_type = "Premium_LRS"
      }
    
      source_image_reference {
        publisher = "Canonical"
        offer     = "UbuntuServer"
        sku       = "18.04-LTS"
        version   = "latest"
      }
    
      computer_name                   = "myvm"
      admin_username                  = "azureuser"
      disable_password_authentication = true
    
      admin_ssh_key {
        username   = "azureuser"
        public_key = tls_private_key.example_ssh.public_key_openssh
      }
    
      boot_diagnostics {
        storage_account_uri = azurerm_storage_account.mystorageaccount.primary_blob_endpoint
      }
    }
    ```

1. Create a file named `variables.tf` and insert the following code:

    ```hcl
    variable "resource_group_name_prefix" {
      default       = "rg"
      description   = "Prefix of the resource group name that's combined with a random ID so name is unique in your Azure subscription."
    }
    
    variable "resource_group_location" {
      default       = "eastus"
      description   = "Location of the resource group."
    }
    ```

1. Create a file named `output.tf` and insert the following code:

    ```hcl
    output "resource_group_name" {
      value = azurerm_resource_group.rg.name
    }
    
    output "public_ip_address" {
      value = azurerm_linux_virtual_machine.myterraformvm.public_ip_address
    }
    
    output "tls_private_key" {
      value     = tls_private_key.example_ssh.private_key_pem
      sensitive = true
    }
    ```

## Initialize Terraform

[!INCLUDE [terraform-init.md](includes/terraform-init.md)]

## Create a Terraform execution plan

[!INCLUDE [terraform-plan.md](includes/terraform-plan.md)]

## Apply a Terraform execution plan

[!INCLUDE [terraform-apply-plan.md](includes/terraform-apply-plan.md)]

## Verify the results

To use SSH to connect to the virtual machine, do the following steps:

1. Run [terraform output](https://www.terraform.io/cli/commands/output) to get the SSH private key and save it to a file.

    ```console
    terraform output -raw tls_private_key > id_rsa
    ```

1. Run [terraform output](https://www.terraform.io/cli/commands/output) to get the virtual machine public IP address.


    ```console
    terraform output public_ip_address
    ```

1. Use SSH to connect to the virtual machine.

    ```console
    ssh -i id_rsa azureuser@<public_ip_address>
    ```

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](troubleshoot.md)

## Next steps

> [!div class="nextstepaction"]
> [Learn more about using Terraform in Azure](/azure/terraform)