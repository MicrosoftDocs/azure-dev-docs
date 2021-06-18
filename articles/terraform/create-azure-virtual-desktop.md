---
title: Configure Azure Virtual Desktop using Terraform - Azure
description: Learn how to use Terraform to configure Azure Virtual Desktop with Terraform
keywords: azure devops terraform avd virtual desktop session host
ms.topic: how-to article
ms.date: 06/30/2021
ms.custom: devx-track-terraform
---

# Configure Azure Virtual Desktop with Terraform

>[!IMPORTANT]
>This content applies to Azure Virtual Desktop with Azure Resource Manager Azure Virtual Desktop objects. If you're using Azure Virtual Desktop (classic) without Azure Resource Manager objects, see [this article](../virtual-desktop-fall-2019/create-host-pools-powershell-2019.md).

Terraform allows you to define and create complete infrastructure deployments in Azure. You build Terraform templates in a human-readable format that create and configure Azure resources in a consistent, reproducible manner. This article shows you how to build Session Hosts and deploy to an AVD Host Pool with Terraform. You can also learn how to [install and configure Terraform](get-started-cloud-shell.md).

Host pools are a collection of one or more identical virtual machines within Azure Virtual Desktop tenant environments. Each host pool can be associated with multiple RemoteApp groups, one desktop app group, and multiple session hosts.

If you're building landing zones, see [this article](../cloud-adoption-framework/ready/landing-zone/terraform-landing-zone.md)


## Prerequisites

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../includes/open-source-devops-prereqs-azure-subscription.md)]

This article assumes you've already configured Terraform
* [Configure Terraform using Azure Cloud Shell](../get-started-cloud-shell.md) 
* [Configure the Azure Terraform Visual Studio Code extension](../terraform/configure-vs-code-extension-for-terraform)

## Create Azure connection and resource group

The following code defines the Azure Terraform provider:

```hcl
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
```
The following section creates a resource group in the location:

```hcl
resource "azurerm_resource_group" "<rg>" {
  name = "<resource_group_name>"
  location = "<location>"
}
```
In other sections, you reference the resource group with `azurerm_resource_group.rg.name`.

```hcl
resource "time_rotating" "token" {
  rotation_days = 30
}
```

## Create Azure Virtual Desktop workspace
```hcl
resource "azurerm_virtual_desktop_workspace" "<example>" {
  name                = "<workspace name>"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  friendly_name       = "<Workspace Friendly Name>"
  description         = "<A description of my workspace>"
}
```
## Create Azure Virtual Desktop host pool
```hcl
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
```
## Create Desktop Application Group

```hcl
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
```

# Associate Workspace and Desktop Application Group
```hcl
resource "azurerm_virtual_desktop_workspace_application_group_association" "example" {
  application_group_id = azurerm_virtual_desktop_application_group.example.id
  workspace_id         = azurerm_virtual_desktop_workspace.example.id
}

```

# Complete Terraform script
To bring all these sections together and see Terraform in action, create a file called main.tf and paste the following content:
```hcl
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
## Build and deploy the infrastructure

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


[!INCLUDE [terraform-troubleshooting.md](includes/terraform-troubleshooting.md)]

## Next steps

> [!div class="nextstepaction"] 
> [Learn more about Configuring Azure Virtual Desktop session hosts using Terraform in Azure](/articles/terraform/create-avd-session-host.md)