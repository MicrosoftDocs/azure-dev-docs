---
title: Configure Azure Virtual Desktop Session Hosts using Terraform
description: Learn how to use Terraform to configure session hosts and add them to a host pool.
keywords: azure devops terraform avd virtual desktop session host
ms.topic: how-to
ms.date: 12/17/2021
ms.custom: devx-track-terraform
---

# Configure Azure Virtual Desktop session hosts using Terraform

This article shows you how to build Session Hosts and deploy them to an AVD Host Pool with Terraform. This article assumes you have already deployed the [Azure Virtual Desktop Infrastructure](../terraform/create-azure-virtual-desktop.md).

In this article, you learn how to:
> [!div class="checklist"]

> * Use Terraform to create NIC for each session host
> * Use Terraform to create VM for session host
> * Join VM to domain
> * Register VM with Azure Virtual Desktop
> * Use variables file

## 1. Configure your environment

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../includes/open-source-devops-prereqs-azure-subscription.md)]

[!INCLUDE [configure-terraform.md](includes/configure-terraform.md)]

## 2. Create a NIC

Firstly we need a NIC for each session host VM. We are using `count` to indicate how many NICs will be created - this will be the same as the number of hosts and, in this case, is 2. We also reference the subnet ID. This will have been created when you created the infrastructure.

```terraform
resource "azurerm_network_interface" "avd_vm_nic" {
  count               = var.rdsh_count
  name                = "${var.prefix}-${count.index + 1}-nic"
  resource_group_name = var.rg_name
  location            = var.deploy_location

  ip_configuration {
    name                          = "nic${count.index + 1}_config"
    subnet_id                     = azurerm_subnet.subnet.id
    private_ip_address_allocation = "dynamic"
  }

  depends_on = [
    azurerm_resource_group.rg
  ]
}
```

## 3. Create a VM

Next, we will create the session host vms. We reference the NIC here.  

```terraform
resource "azurerm_windows_virtual_machine" "avd_vm" {
  count                 = var.rdsh_count
  name                  = "${var.prefix}-${count.index + 1}"
  resource_group_name   = var.rg_name
  location              = var.deploy_location
  size                  = var.vm_size
  network_interface_ids = ["${azurerm_network_interface.avd_vm_nic.*.id[count.index]}"]
  provision_vm_agent    = true
  admin_username        = var.local_admin_username
  admin_password        = var.local_admin_password

  os_disk {
    name                 = "${lower(var.prefix)}-${count.index + 1}"
    caching              = "ReadWrite"
    storage_account_type = "Standard_LRS"
  }

  source_image_reference {
    publisher = "MicrosoftWindowsDesktop"
    offer     = "Windows-10"
    sku       = "20h2-evd"
    version   = "latest"
  }

  depends_on = [
    azurerm_resource_group.rg,
    azurerm_network_interface.avd_vm_nic
  ]
}
```

## 4. Domain Join VM

Once the session host is created, it needs to be domain joined.  

```terraform
resource "azurerm_virtual_machine_extension" "domain_join" {
  count                      = var.rdsh_count
  name                       = "${var.prefix}-${count.index + 1}-domainJoin"
  virtual_machine_id         = azurerm_windows_virtual_machine.avd_vm.*.id[count.index]
  publisher                  = "Microsoft.Compute"
  type                       = "JsonADDomainExtension"
  type_handler_version       = "1.3"
  auto_upgrade_minor_version = true

  settings = <<SETTINGS
    {
      "Name": "${var.domain_name}",
      "OUPath": "${var.ou_path}",
      "User": "${var.domain_user_upn}@${var.domain_name}",
      "Restart": "true",
      "Options": "3"
    }
SETTINGS

  protected_settings = <<PROTECTED_SETTINGS
    {
      "Password": "${var.domain_password}"
    }
PROTECTED_SETTINGS

  lifecycle {
    ignore_changes = [settings, protected_settings]
  }

  depends_on = [
    azurerm_virtual_network_peering.peer1,
    azurerm_virtual_network_peering.peer2
  ]
}
```

## 5. Session Host Registration

Lastly, we will register the host to the host pool. For this we will need the registration token from our hostpool. To do this, we will create a local variable for this token and then create a dsc extension resource and pass the AVD configuration artifacts.

```terraform
locals {
  registration_token = azurerm_virtual_desktop_host_pool.hostpool.registration_info[0].token
}
```

Then we create the dsc extension resource. We can see that we pass the registration token in the protected settings. 

```terraform
resource "azurerm_virtual_machine_extension" "vmext_dsc" {
  count                      = var.rdsh_count
  name                       = "${var.prefix}${count.index + 1}-avd_dsc"
  virtual_machine_id         = azurerm_windows_virtual_machine.avd_vm.*.id[count.index]
  publisher                  = "Microsoft.Powershell"
  type                       = "DSC"
  type_handler_version       = "2.73"
  auto_upgrade_minor_version = true

  settings = <<-SETTINGS
    {
      "modulesUrl": "https://wvdportalstorageblob.blob.core.windows.net/galleryartifacts/Configuration_3-10-2021.zip",
      "configurationFunction": "Configuration.ps1\\AddSessionHost",
      "properties": {
        "HostPoolName":"${azurerm_virtual_desktop_host_pool.hostpool.name}"
      }
    }
SETTINGS

  protected_settings = <<PROTECTED_SETTINGS
  {
    "properties": {
      "registrationInfoToken": "${local.registration_token}"
    }
  }
PROTECTED_SETTINGS

  depends_on = [
    azurerm_virtual_machine_extension.domain_join,
    azurerm_virtual_desktop_host_pool.hostpool
  ]
}
```

## 6. Variables file

Create a variable file called `variables.tf`.  
You can learn more about using [variables in Terraform](https://www.terraform.io/docs/language/values/variables.html).  This is so that we don't need to hardcode the variables in the configuration file and can reuse the values in other parts of our deployment.   You may have already created one when you completed [Create Azure Virtual Desktop Infrastructure](../terraform/create-azure-virtual-desktop.md), in that case, append the variables that haven't already been created to the existing file.

```hcl
variable "rg_name" {
  type        = string
  default     = "avd-resources-rg"
  description = "Name of the Resource group in which to deploy these resources"
}

variable "deploy_location" {
  type        = string
  default     = "east us"
  description = "The Azure Region in which all resources in this example should be created."
}

variable "workspace" {
  type        = string
  description = "Name of the Azure Virtual Desktop workspace"
  default     = "AVD TF Workspace"
}

variable "hostpool" {
  type        = string
  description = "Name of the Azure Virtual Desktop host pool"
  default     = "AVD-TF-HP"
}

variable "ad_vnet" {
  type        = string
  default     = "infra-network"
  description = "Name of domain controller vnet"
}

variable "dns_servers" {
  type        = list(string)
  default     = ["10.0.1.4", "168.63.129.16"]
  description = "Custom DNS configuration and Azure"
}

variable "vnet_range" {
  type        = list(string)
  default     = ["10.1.0.0/16"]
  description = "Address range for deployment VNet"
}
variable "subnet_range" {
  type        = list(string)
  default     = ["10.1.0.0/24"]
  description = "Address range for session host subnet"
}

variable "ad_rg" {
  type        = string
  default     = "infra-rg"
  description = "The resource group for AD VM"
}

variable "avd_users" {
  description = "AVD users"
  default = [
    "avduser01@infra.local",
    "avduser01@infra.local"
  ]
}

variable "aad_group_name" {
  type        = string
  default     = "AVDUsers"
  description = "Azure Active Directory Group for AVD users"
}

variable "rdsh_count" {
  description = "Number of AVD machines to deploy"
  default     = 2
}

variable "prefix" {
  type        = string
  default     = "avdtf"
  description = "Prefix of the name of the AVD machine(s)"
}

variable "domain_name" {
  type        = string
  default     = "infra.local"
  description = "Name of the domain to join"
}

variable "domain_user_upn" {
  type        = string
  default     = "admin" # do not include domain name as this is appended
  description = "Username for domain join (do not include domain name as this is appended)"
}

variable "domain_password" {
  type        = string
  default     = "ChangeMe123!"
  description = "Password of the user to authenticate with the domain"
  sensitive   = true
}

variable "vm_size" {
  description = "Size of the machine to deploy"
  default     = "Standard_DS2_v2"
}

variable "ou_path" {
  default = ""
}

variable "local_admin_username" {
  type        = string
  default     = "localadm"
  description = "local admin username"
}

variable "local_admin_password" {
  type        = string
  default     = "ChangeMe123!"
  description = "local admin password"
  sensitive   = true
}
```

These variables will need to be populated either using the default value or at runtime.

## 7. Implement the Terraform code

Here we are putting all of the above sections together. You will also notice that we are now using the variables from the `variables.tf` file as well. This isn't required, but best practices would be to avoid hard coding the variables in the configuration files. We have also created a random string resource for the local user password.

This file references some resources that were created when we built the infrastructure - such as `azurerm_subnet.subnet.id` and `azurerm_virtual_desktop_host_pool.HP.name`.  If you changed the name of these resources from that section, you also need to update the references here.

Create a directory to test and run the sample Terraform code and make it the current directory.

1. Create a file named `main.tf` and insert the following code:

```terraform
#----------------------------------
# Session Host VM
#----------------------------------
locals {
  registration_token = azurerm_virtual_desktop_host_pool.HP.registration_info[0].token
}


#generate the random local machine pw
resource "random_string" "avd-local-password" {
  count            = "${var.rdsh_count}"
  length           = 16
  special          = true
  min_special      = 2
  override_special = "*!@#?"
}


# Create a NIC for the Session Host VM
resource "azurerm_network_interface" "avd_vm_nic" {
  count                     = "${var.rdsh_count}"
  name                      = "${var.vm_prefix}-${count.index +1}-nic"
  resource_group_name       = var.rg_name
  location                  = var.deploy_location

  ip_configuration {
    name                          = "nic${count.index +1}_config"
    subnet_id                     = azurerm_subnet.subnet.id
    private_ip_address_allocation = "dynamic"
  }
}

# Create the Session Host VM
resource "azurerm_windows_virtual_machine" "avd_vm" {
  count                 = var.rdsh_count
  name                  = "${var.prefix}-${count.index + 1}"
  resource_group_name   = var.rg_name
  location              = var.deploy_location
  size                  = var.vm_size
  network_interface_ids = ["${azurerm_network_interface.avd_vm_nic.*.id[count.index]}"]
  provision_vm_agent    = true
    admin_username = var.local_admin_username
    admin_password = var.local_admin_password
  
  os_disk {
    name                 = "${lower(var.prefix)}-${count.index +1}"
    caching              = "ReadWrite"
    storage_account_type = "Standard_LRS"
  }

  source_image_reference {
    publisher = "MicrosoftWindowsDesktop"
    offer     = "Windows-10"
    sku       = "20h2-evd"                             
    version   = "latest"
  }

    depends_on = [
    azurerm_resource_group.rg,
    azurerm_network_interface.avd_vm_nic
  ]
}

# VM Extension for Domain-join
resource "azurerm_virtual_machine_extension" "domain_join" {
  count                      = var.rdsh_count
  name                       = "${var.prefix}-${count.index +1}-domainJoin"
  virtual_machine_id         = azurerm_windows_virtual_machine.avd_vm.*.id[count.index]
  publisher                  = "Microsoft.Compute"
  type                       = "JsonADDomainExtension"
  type_handler_version       = "1.3"
  auto_upgrade_minor_version = true

  settings = <<SETTINGS
    {
        "Name": "${var.domain_name}",
        "OUPath": "${var.ou_path}",
        "User": "${var.domain_user_upn}@${var.domain_name}",
        "Restart": "true",
        "Options": "3"
    }
    SETTINGS

  protected_settings = <<PROTECTED_SETTINGS
  {
         "Password": "${var.domain_password}"
  }
PROTECTED_SETTINGS

  lifecycle {
    ignore_changes = [ settings, protected_settings ]
  }
  depends_on = [ 
    azurerm_virtual_network_peering.peer1, 
    azurerm_virtual_network_peering.peer2
  ]
}

# VM Extension for Desired State Config
resource "azurerm_virtual_machine_extension" "vmext_dsc" {
  count                      = var.rdsh_count
  name                       = "${var.prefix}${count.index +1}-avd_dsc"
  virtual_machine_id         = azurerm_windows_virtual_machine.avd_vm.*.id[count.index]
  publisher                  = "Microsoft.Powershell"
  type                       = "DSC"
  type_handler_version       = "2.73"
  auto_upgrade_minor_version = true
  
  settings = <<-SETTINGS
    {
      "modulesUrl": "https://wvdportalstorageblob.blob.core.windows.net/galleryartifacts/Configuration_3-10-2021.zip",
      "configurationFunction": "Configuration.ps1\\AddSessionHost",
      "properties": {
      "HostPoolName":"${azurerm_virtual_desktop_host_pool.hostpool.name}"
      
      }
    }
    SETTINGS
    
protected_settings = <<PROTECTED_SETTINGS
  {
    "properties": {
      "registrationInfoToken": "${local.registration_token}"
    }
         
  }
PROTECTED_SETTINGS

  depends_on = [ 
    azurerm_virtual_machine_extension.domain_join, 
    azurerm_virtual_desktop_host_pool.hostpool 
  ]
}
```

## 8. Initialize Terraform

[!INCLUDE [terraform-init.md](includes/terraform-init.md)]

## 9. Create a Terraform execution plan

[!INCLUDE [terraform-plan.md](includes/terraform-plan.md)]

## 10. Apply a Terraform execution plan

[!INCLUDE [terraform-apply-plan.md](includes/terraform-apply-plan.md)]

## 11. Clean up resources

[!INCLUDE [terraform-plan-destroy.md](includes/terraform-plan-destroy.md)]

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](troubleshoot.md)

## Next steps

> [!div class="nextstepaction"]
> [Learn more about using Terraform in Azure](/azure/terraform)
