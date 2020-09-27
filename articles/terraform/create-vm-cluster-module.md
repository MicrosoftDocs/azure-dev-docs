---
title: Configure an Azure VM cluster using Terraform
description: Learn how to use Terraform modules to create a Windows virtual machine cluster in Azure.
keywords: azure devops terraform vm virtual machine cluster module registry
ms.topic: how-to
ms.date: 09/25/2020
ms.custom: devx-track-terraform
---

# Configure an Azure VM cluster using Terraform

This article shows example Terraform code for creating a VM cluster on Azure.

## Prerequisites

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../includes/open-source-devops-prereqs-azure-subscription.md)]

[!INCLUDE [terraform-configure-environment.md](includes/terraform-configure-environment.md)]

## Configure an Azure VM cluster

```hcl
module "windowsservers" {
  source              = "Azure/compute/azurerm"
  resource_group_name = azurerm_resource_group.rg.name
  is_windows_image    = true
  vm_hostname         = "mywinvm" // line can be removed if only one VM module per resource group
  admin_password      = "ComplxP@ssw0rd!"
  vm_os_simple        = "WindowsServer"
  public_ip_dns       = ["winsimplevmips"] // change to a unique name per data center region
  vnet_subnet_id      = module.network.vnet_subnets[0]
    
  depends_on = [azurerm_resource_group.rg]
}

module "network" {
  source              = "Azure/network/azurerm"
  resource_group_name = azurerm_resource_group.rg.name
  subnet_prefixes     = ["10.0.1.0/24"]
  subnet_names        = ["subnet1"]

  depends_on = [azurerm_resource_group.rg]
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
