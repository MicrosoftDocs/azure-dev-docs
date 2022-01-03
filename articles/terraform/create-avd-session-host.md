---
title: Configure Azure Virtual Desktop Session Hosts using Terraform
description: Learn how to use Terraform to configure session hosts and add them to a host pool.
keywords: azure devops terraform avd virtual desktop session host
ms.topic: how-to
ms.date: 17/06/2021
ms.custom: devx-track-terraform
---

# Configure Azure Virtual Desktop session hosts using Terraform

Terraform allows you to define and create complete infrastructure deployments in Azure. You build Terraform templates in a human-readable format that create and configure Azure resources in a consistent, reproducible manner. This article shows you how to build Session Hosts and deploy to an AVD Host Pool with Terraform. You can also learn how to [install and configure Terraform](get-started-cloud-shell.md).

## Prerequisites

This article assumes you have already deployed the [Azure Virtual Desktop Infrastructure](../create-azure-virtual-desktop.md).

## 1. Create a NIC 

Firstly we need a NIC for each session host VM.  We are using `count` to indicate how many Nics will be created - this will be the same as the number of hosts and in this case is 2.  We also reference the subnet ID.  This will have been created when you created the infrastructure. 

```terraform
resource "azurerm_network_interface" "avd_vm_nic" 
{
  count                     = "2"
  name                      = "<avd-prefix>-${count.index +1}-nic"
  resource_group_name       = "<rgname>"
  location                  = "<location>"

  ip_configuration {
    name                          = "nic${count.index +1}_config"
    subnet_id                     = azurerm_subnet.subnet.id
    private_ip_address_allocation = "dynamic"
  }
}
```

## 2. Create a VM

Next we will create the session host vms.  We reference the NIC here.  

```terraform
resource "azurerm_windows_virtual_machine" "avd_vm" {
  count                 = "2"
  name                  = "${<avd-prefix>}-${count.index + 1}"
  resource_group_name   = "<rgname>"
  location              = "<location>"
  size                  = "<vm_size>"
  network_interface_ids = ["${azurerm_network_interface.avd_vm_nic.*.id[count.index]}"]
  provision_vm_agent    = true
    admin_username = "<local_admin_username>"
    admin_password = "<local_admin_password>"
  
  os_disk {
    name                 = "${lower(<avd-prefix>)}-${count.index +1}"
    caching              = "ReadWrite"
    storage_account_type = "Standard_LRS"
  }

  source_image_reference {
    publisher = "MicrosoftWindowsDesktop"
    offer     = "Windows-10"
    sku       = "20h2-evd"                                 # This is the Windows 10 Enterprise Multi-Session image
    version   = "latest"
  }
}
```
## 3. Domain Join VM

Once the session host is created it needs to be domain joined.  

```terraform
resource "azurerm_virtual_machine_extension" "domain_join" {
  count                      = "2"
  name                       = "<vm_prefix>-${count.index +1}-domainJoin"
  virtual_machine_id         = azurerm_windows_virtual_machine.avd_vm.*.id[count.index]
  publisher                  = "Microsoft.Compute"
  type                       = "JsonADDomainExtension"
  type_handler_version       = "1.3"
  auto_upgrade_minor_version = true

  settings = <<SETTINGS
    {
        "Name": "<domain_name>",
        "OUPath": "<ou_path>",
        "User": "<domain_user_upn>@<domain_name>",
        "Restart": "true",
        "Options": "3"
    }
    SETTINGS

  protected_settings = <<PROTECTED_SETTINGS
  {
         "Password": "<domain_password>"
  }
PROTECTED_SETTINGS

  lifecycle {
    ignore_changes = [ settings, protected_settings ]
  }
}
```

## 4. Session Host Registration

Lastly we will register the host to the host pool.  For this we will need the registration token from our hostpool.  To do this, we will create a local variable for this token and then create a dsc extension resource and pass the AVD configuration artifacts.

```terraform
locals {
  registration_token = <token>
}
```

Then we create the dsc extension resource.  We can see that we pass the registration token in the protected settings. 

```terraform
resource "azurerm_virtual_machine_extension" "vmext_dsc" {
    count                 = "<rdsh_count>"
  name                       = "<vm_prefix>{count.index +1}-wvd_dsc"
  virtual_machine_id         = azurerm_windows_virtual_machine.wvd_vm.*.id[count.index]
  publisher                  = "Microsoft.Powershell"
  type                       = "DSC"
  type_handler_version       = "2.73"
  auto_upgrade_minor_version = true
  
  settings = <<-SETTINGS
    {
      "modulesUrl": "https://wvdportalstorageblob.blob.core.windows.net/galleryartifacts/Configuration_3-10-2021.zip",
      "configurationFunction": "Configuration.ps1\\AddSessionHost",
      "properties": {
      "HostPoolName":"<hostpool_name>"
      
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



  depends_on = [ azurerm_virtual_machine_extension.domain_join, azurerm_virtual_desktop_host_pool.HP ]
}
```

## 5. Variables file

Firstly we will create a variable file called variables.tf.  You can learn more about using [variables in Terraform](https://www.terraform.io/docs/language/values/variables.html).  This is so that we don't need to hardcode the variables in the configuration file and can reuse the values in other parts of our deployment.   You may have already created one when you completed [Create Azure Virtual Desktop Infrastructure](../create-azure-virtual-desktop.md), in that case, append the variables that haven't already been created to the existing file. 

```hcl
variable "deploylocation" {
  type        = string
  default     = "West Europe"
  description = "location"
}

variable "rgname"{
 type = string
 default = ""
 description = "resource group name"
}

variable "rdsh_count" {
  description = "**OPTIONAL**: Number of avd machines to deploy"
  default     = 2
}

variable "host_pool_name" {
  description = "Name of the host pool"
  default     = ""
}

variable "vm_prefix" {
  description = "Prefix of the name of the AVD machine(s)"
}

variable "domain_name" {
  type = string
  description = "Name of the domain to join"

}

variable "domain_user_upn" {
  type = string
  description = "UPN of the user to authenticate with the domain"
 
}

variable "domain_password" {
  type = string
  description = "Password of the user to authenticate with the domain"
 
}

variable "local_admin_username"{
 type = string
 default = "localadm"
 description = "admin username"
}


variable "admin_password"{
 type = string
 description = "admin password"
 
}

variable "vm_size" {
  description = "Size of the machine to deploy"
  default     = "Standard_F2s"
}

variable "ou_path" {
  default = ""

}

variable "adVnet"{
 type = string
 default = ""
 description = "Name of VNet for the domain controller"
}

variable "adRG"{
 type = string
 default = ""
 description = "resource group for Active Directory domain controller"
}

variable "adVnetID"{
 type = string
  description = "resource id for VNet"
}
```

These variables will need to be populated either using the default value or at runtime.

## 6. Create the session host configuration file

Here we are putting all of the above sections together.  You will also notice that we are now using the variables from the variables.tf file as well.  This isn't required but best practices would be to avoid hard coding the variables in the configuration files.  We have also create a random string resource for the local user password. 

This file references some resources that were created when we built the infrastructure - such as `azurerm_subnet.subnet.id` and `azurerm_virtual_desktop_host_pool.HP.name`.  If you changed the name of these resources from that section, you would need to also update the references here. 

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
  resource_group_name       = var.rgname
  location                  = var.deploylocation

  ip_configuration {
    name                          = "nic${count.index +1}_config"
    subnet_id                     = azurerm_subnet.subnet.id
    private_ip_address_allocation = "dynamic"
  }
}

# Create the Session Host VM
resource "azurerm_windows_virtual_machine" "avd_vm" {
  count                 = "${var.rdsh_count}"
  name                  = "${var.vm_prefix}-${count.index + 1}"
  resource_group_name   = var.rgname
  location              = var.deploylocation
  size                  = var.vm_size
  network_interface_ids = ["${azurerm_network_interface.avd_vm_nic.*.id[count.index]}"]
  provision_vm_agent    = true
    admin_username = "${var.local_admin_username}"
    admin_password = "${random_string.avd-local-password.*.result[count.index]}"
  
  os_disk {
    name                 = "${lower(var.vm_prefix)}-${count.index +1}"
    caching              = "ReadWrite"
    storage_account_type = "Standard_LRS"
  }

  source_image_reference {
    publisher = "MicrosoftWindowsDesktop"
    offer     = "Windows-10"
    sku       = "20h2-evd"                                 # This is the Windows 10 Enterprise Multi-Session image
    version   = "latest"
  }
}

# VM Extension for Domain-join
resource "azurerm_virtual_machine_extension" "domain_join" {
  count                 = "${var.rdsh_count}"
  name                       = "${var.vm_prefix}-${count.index +1}-domainJoin"
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
  depends_on = [ azurerm_virtual_network_peering.peer1, azurerm_virtual_network_peering.peer2 ]

}

# VM Extension for Desired State Config
resource "azurerm_virtual_machine_extension" "vmext_dsc" {
    count                 = "${var.rdsh_count}"
  name                       = "${var.vm_prefix}${count.index +1}-avd_dsc"
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
      "HostPoolName":"${azurerm_virtual_desktop_host_pool.HP.name}"
      
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



  depends_on = [ azurerm_virtual_machine_extension.domain_join, azurerm_virtual_desktop_host_pool.HP ]
}
```

## 7. Build and deploy the infrastructure

With your Terraform template created, the first step is to initialize Terraform. This step ensures that Terraform has all the prerequisites to build your template in Azure.

```bash
terraform init
```

The next step is to have Terraform review and validate the template. This step compares the requested resources to the state information saved by Terraform and then outputs the planned execution. The Azure resources aren't created at this point. An execution plan is generated and stored in the file specified by the `-out` parameter.

```bash
terraform plan -out terraform_azure.tfplan
```

When you're ready to build the infrastructure in Azure, apply the execution plan:

```bash
terraform apply terraform_azure.tfplan
```

Once Terraform completes, your VM infrastructure is ready. Obtain the public IP address of your VM with [az vm show](/cli/azure/vm#az_vm_show):

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](troubleshoot.md)

## Next steps

> [!div class="nextstepaction"]
> [Learn more about using Terraform in Azure](/azure/terraform)
