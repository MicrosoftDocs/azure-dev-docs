---
title: Create an Azure VM cluster with Terraform using the Module Registry
description: Learn how to use Terraform modules to create a Windows virtual machine cluster in Azure.
keywords: azure devops terraform vm virtual machine cluster module registry
ms.topic: how-to
ms.date: 09/25/2020
ms.custom: devx-track-terraform
---

# Create an Azure VM cluster with Terraform using the Module Registry

This article shows example Terraform code for creating a VM cluster on Azure.

## Prerequisites

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../includes/open-source-devops-prereqs-azure-subscription.md)]

## Configure your environment

Based on your environment, install and configure Terraform:

- [Configure Terraform using Azure Cloud Shell and Azure CLI](get-started-cloud-shell.md)
- [Configure Terraform using Azure PowerShell](get-started-powershell.md)

The configuration articles also explain how to do the following tasks:

- Create a Terraform configuration file by inserting a `provider block` in front of your Terraform code.
- Create and apply a Terraform execution plan to "run" your code.
- Reverse an execution plan once you're finished using the resources and want to delete them.

## Create an Azure VM cluster

```hcl
resource "azurerm_resource_group" "myResourceGroup" {
  name     = "create-vm-cluster-rg"
  location = "eastus"
}

module "windowsservers" {
  source              = "Azure/compute/azurerm"
  resource_group_name = azurerm_resource_group.myResourceGroup.name
  is_windows_image    = true
  vm_hostname         = "mywinvm" // line can be removed if only one VM module per resource group
  admin_password      = "ComplxP@ssw0rd!"
  vm_os_simple        = "WindowsServer"
  public_ip_dns       = ["winsimplevmips"] // change to a unique name per datacenter region
  vnet_subnet_id      = module.network.vnet_subnets[0]
    
  depends_on = [azurerm_resource_group.myResourceGroup]
}

module "network" {
  source              = "Azure/network/azurerm"
  resource_group_name = azurerm_resource_group.myResourceGroup.name
  subnet_prefixes     = ["10.0.1.0/24"]
  subnet_names        = ["subnet1"]

  depends_on = [azurerm_resource_group.myResourceGroup]
}

output "windows_vm_public_name" {
  value = module.windowsservers.public_ip_dns_name
}

output "vm_public_ip" {
  value = module.windowsservers.public_ip_address
}

output "vm_private_ips" {
  value = module.windowsservers.network_interface_private_ip
}
```

[!INCLUDE [terraform-troubleshooting.md](includes/terraform-troubleshooting.md)]

## Next steps

> [!div class="nextstepaction"]
> [Learn more about using Terraform in Azure](/azure/terraform)