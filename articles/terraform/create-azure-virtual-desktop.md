---
title: Create Azure Virtual Desktop  Terraform - Azure
description: How to create Azure Virtual Desktop with Terraform
author: jensheerin
ms.author: jensheerin
ms.topic: how-to article
ms.date: 06/30/2021
ms.custom: template-how-to article 
---

# Create a Azure Virtual Desktop with Terraform

>[!IMPORTANT]
>This content applies to Azure Virtual Desktop with Azure Resource Manager Azure Virtual Desktop objects. If you're using Azure Virtual Desktop (classic) without Azure Resource Manager objects, see [this article](../virtual-desktop-fall-2019/create-host-pools-powershell-2019.md).

Host pools are a collection of one or more identical virtual machines within Azure Virtual Desktop tenant environments. Each host pool can be associated with multiple RemoteApp groups, one desktop app group, and multiple session hosts.

If you're building landing zones, see [this article](../cloud-adoption-framework/ready/landing-zone/terraform-landing-zone.md)


## Prerequisites

This article assumes you've already followed the instructions in [Configure Terraform using Azure Cloud Shell](../get-started-cloud-shell.md). 

## Use Terraform to create Azure Virtual Desktop 

Run the following configuration after sign in to the Azure CLI:

```terraform
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
resource "azurerm_resource_group" "rg" {
  name = "<resource_group_name>"
  location = "<location>"
}

resource "time_rotating" "token" {
  rotation_days = 30
}

#Create workspace
resource "azurerm_virtual_desktop_workspace" "<example>" {
  name                = "<workspace name>"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  friendly_name       = "<Workspace Friendly Name>"
  description         = "<A description of my workspace>"
}

# Create host pool
resource "azurerm_virtual_desktop_host_pool" "example" {
  resource_group_name      = azurerm_resource_group.rg.name
  name                     = "<hostpoolname>"
  description              = "<A description for host pool>
  location                 = azurerm_resource_group.rg.location
  validate_environment     = <false> #[true false]
  type                     = "<Pooled>" #[Pooled Personal]
  maximum_sessions_allowed = <MaxSessionLimit> 
  load_balancer_type       = "<BreadthFirst>" #[BreadthFirst DepthFirst]
  friendly_name            = "<WVDHostPoolFriendlyName>"
  custom_rdp_properties    = "audiocapturemode:i:1;audiomode:i:0;"
  preferred_app_group_type = "<Desktop>" #[Desktop RemoteApp]
  start_vm_on_connect      = "true"
  tags = {
    "<image>" = "<month>"
  }

  registration_info {
    expiration_date = time_rotating.token.rotation_rfc3339
  }
}

# Create DAG
resource "azurerm_virtual_desktop_application_group" "example" {
  resource_group_name = azurerm_resource_group.rg.name
  host_pool_id        = azurerm_virtual_desktop_host_pool.example.id
  location            = azurerm_resource_group.rg.location
  type                = "<Desktop>"
  name                = "<DAGname>"
  friendly_name       = "<AppGroupName>"
  description         = "<application group description>"
  depends_on          = [azurerm_virtual_desktop_host_pool.example]
}

# Associate Workspace and DAG
resource "azurerm_virtual_desktop_workspace_application_group_association" "example" {
  application_group_id = azurerm_virtual_desktop_application_group.example.id
  workspace_id         = azurerm_virtual_desktop_workspace.example.id
}

```

This block will create the host pool, desktop application group and workspace. 

You can create a virtual machine in multiple ways:

- [Create a virtual machine from an Azure Gallery image](../virtual-machines/windows/quick-create-portal.md#create-virtual-machine)
- [Create a virtual machine from a managed image](../virtual-machines/windows/create-vm-generalized-managed.md)
- [Create a virtual machine from an unmanaged image](https://github.com/Azure/azure-quickstart-templates/tree/master/101-vm-user-image-data-disks)

