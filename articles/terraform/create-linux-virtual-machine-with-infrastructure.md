---
title: Configure a Linux VM with infrastructure in Azure using Terraform
description: Learn how to use Terraform to configure a complete Linux virtual machine environment in Azure.
keywords: azure devops terraform linux vm virtual machine
ms.topic: how-to
ms.date: 08/07/2021
ms.custom: devx-track-terraform
---

# Configure a Linux VM with infrastructure in Azure using Terraform

Terraform allows you to define and create complete infrastructure deployments in Azure. You build Terraform templates in a human-readable format that create and configure Azure resources in a consistent, reproducible manner. This article shows you how to create a complete Linux environment and supporting resources with Terraform.

In this article, you learn how to:
> [!div class="checklist"]

> * Create a virtual network
> * Create a subnet
> * Create a public IP address
> * Create a network security group
> * Create a virtual network interface card
> * Create a storage account for diagnostics
> * Create a virtual machine

## 1. Configure your environment

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../includes/open-source-devops-prereqs-azure-subscription.md)]

[!INCLUDE [configure-terraform.md](includes/configure-terraform.md)]

## 2. Implement the Terraform code

1. Create a directory in which to test and run the sample Terraform code and make it the current directory.

1. Create a file named `main.tf` and insert the following code:

    ```hcl
    # Configure the Microsoft Azure Provider
    terraform {
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
    
    # Create a resource group if it doesn't exist
    resource "azurerm_resource_group" "myterraformgroup" {
        name     = "myResourceGroup"
        location = "eastus"
    
        tags = {
            environment = "Terraform Demo"
        }
    }
    
    # Create virtual network
    resource "azurerm_virtual_network" "myterraformnetwork" {
        name                = "myVnet"
        address_space       = ["10.0.0.0/16"]
        location            = "eastus"
        resource_group_name = azurerm_resource_group.myterraformgroup.name
    
        tags = {
            environment = "Terraform Demo"
        }
    }
    
    # Create subnet
    resource "azurerm_subnet" "myterraformsubnet" {
        name                 = "mySubnet"
        resource_group_name  = azurerm_resource_group.myterraformgroup.name
        virtual_network_name = azurerm_virtual_network.myterraformnetwork.name
        address_prefixes       = ["10.0.1.0/24"]
    }
    
    # Create public IPs
    resource "azurerm_public_ip" "myterraformpublicip" {
        name                         = "myPublicIP"
        location                     = "eastus"
        resource_group_name          = azurerm_resource_group.myterraformgroup.name
        allocation_method            = "Dynamic"
    
        tags = {
            environment = "Terraform Demo"
        }
    }
    
    # Create Network Security Group and rule
    resource "azurerm_network_security_group" "myterraformnsg" {
        name                = "myNetworkSecurityGroup"
        location            = "eastus"
        resource_group_name = azurerm_resource_group.myterraformgroup.name
    
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
    
        tags = {
            environment = "Terraform Demo"
        }
    }
    
    # Create network interface
    resource "azurerm_network_interface" "myterraformnic" {
        name                      = "myNIC"
        location                  = "eastus"
        resource_group_name       = azurerm_resource_group.myterraformgroup.name
    
        ip_configuration {
            name                          = "myNicConfiguration"
            subnet_id                     = azurerm_subnet.myterraformsubnet.id
            private_ip_address_allocation = "Dynamic"
            public_ip_address_id          = azurerm_public_ip.myterraformpublicip.id
        }
    
        tags = {
            environment = "Terraform Demo"
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
            resource_group = azurerm_resource_group.myterraformgroup.name
        }
    
        byte_length = 8
    }
    
    # Create storage account for boot diagnostics
    resource "azurerm_storage_account" "mystorageaccount" {
        name                        = "diag${random_id.randomId.hex}"
        resource_group_name         = azurerm_resource_group.myterraformgroup.name
        location                    = "eastus"
        account_tier                = "Standard"
        account_replication_type    = "LRS"
    
        tags = {
            environment = "Terraform Demo"
        }
    }
    
    # Create (and display) an SSH key
    resource "tls_private_key" "example_ssh" {
      algorithm = "RSA"
      rsa_bits = 4096
    }
    output "tls_private_key" { 
        value = tls_private_key.example_ssh.private_key_pem 
        sensitive = true
    }
    
    # Create virtual machine
    resource "azurerm_linux_virtual_machine" "myterraformvm" {
        name                  = "myVM"
        location              = "eastus"
        resource_group_name   = azurerm_resource_group.myterraformgroup.name
        network_interface_ids = [azurerm_network_interface.myterraformnic.id]
        size                  = "Standard_DS1_v2"
    
        os_disk {
            name              = "myOsDisk"
            caching           = "ReadWrite"
            storage_account_type = "Premium_LRS"
        }
    
        source_image_reference {
            publisher = "Canonical"
            offer     = "UbuntuServer"
            sku       = "18.04-LTS"
            version   = "latest"
        }
    
        computer_name  = "myvm"
        admin_username = "azureuser"
        disable_password_authentication = true
    
        admin_ssh_key {
            username       = "azureuser"
            public_key     = file("~/.ssh/id_rsa.pub")
        }
    
        boot_diagnostics {
            storage_account_uri = azurerm_storage_account.mystorageaccount.primary_blob_endpoint
        }
    
        tags = {
            environment = "Terraform Demo"
        }
    }
    ```
    
    **Key points:**

    -  The SSH public key file is specified in the `admin_ssh_key` block. If your SSH public key filename is different or in a different location, update the `public_key` value accordingly.

## 3. Initialize Terraform

[!INCLUDE [terraform-init.md](includes/terraform-init.md)]

## 4. Create a Terraform execution plan

[!INCLUDE [terraform-plan.md](includes/terraform-plan.md)]

## 5. Apply a Terraform execution plan

[!INCLUDE [terraform-apply-plan.md](includes/terraform-apply-plan.md)]

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](troubleshoot.md)

## Next steps

> [!div class="nextstepaction"]
> [Learn more about using Terraform in Azure](/azure/terraform)