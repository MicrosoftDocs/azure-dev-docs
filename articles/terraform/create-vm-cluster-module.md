---
title: Configure an Azure VM cluster using Terraform
description: Learn how to use Terraform modules to create a Windows virtual machine cluster in Azure.
keywords: azure devops terraform vm virtual machine cluster module registry
ms.topic: how-to
ms.date: 09/27/2020
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
  vm_hostname         = "mywinvm"                         // Line can be removed if only one VM module per resource group
  admin_password      = "ComplxP@ssw0rd!"                 // See note following code about storing passwords in your config files
  vm_os_simple        = "WindowsServer"
  public_ip_dns       = ["winsimplevmips"]                // Change to a unique name per your data center region
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

**Notes**:

- In the preceding code example, the variable `admin_password` is assigned a literal value for the sake of simplicity. Also, there are many ways in which to store sensitive data like this. The decision as to how you want to protect your data comes down to individual choices involving your particular environment and comfort level exposing this data. For example, depending on your source control system, this value might be seen by others. For more information on this subject, HashiCorp has documented various ways to [declare input variables](https://www.terraform.io/docs/configuration/variables.html) and techniques for [managing sensitive data (such as passwords)](https://www.terraform.io/docs/state/sensitive-data.html).

[!INCLUDE [terraform-troubleshooting.md](includes/terraform-troubleshooting.md)]

## Next steps

> [!div class="nextstepaction"] 
> [Learn more about using Terraform in Azure](/azure/terraform)
