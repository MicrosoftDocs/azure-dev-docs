---
title: Configure Azure Virtual Desktop using Terraform - Azure
description: Learn how to use Terraform to configure Azure Virtual Desktop with Terraform
keywords: azure devops terraform avd virtual desktop session host
ms.topic: how-to
ms.date: 12/30/2021
ms.custom: devx-track-terraform
---

# Configure Azure Virtual Desktop with Terraform

>[!IMPORTANT]
>This content applies to Azure Virtual Desktop with Azure Resource Manager Azure Virtual Desktop objects. This article shows you how to build Session Hosts and deploy to an AVD Host Pool with Terraform. Host pools are a collection of one or more identical virtual machines within Azure Virtual Desktop tenant environments. Each host pool can be associated with multiple RemoteApp groups, one desktop app group, and multiple session hosts.

In this article, you learn how to:
> [!div class="checklist"]

> * Use Terraform to create Azure Virtual Desktop workspace
> * Use Terraform to create Azure Virtual Desktop host pool
> * Use Terraform to create Azure Desktop Application Group
> * Associate Workspace and Desktop Application Group

## 1. Configure your environment

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../includes/open-source-devops-prereqs-azure-subscription.md)]

[!INCLUDE [configure-terraform.md](includes/configure-terraform.md)]

## 2. Define providers and create resource group

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

## 3. Create Azure Virtual Desktop workspace
```hcl
resource "azurerm_virtual_desktop_workspace" "<example>" {
  name                = "<workspace name>"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  friendly_name       = "<Workspace Friendly Name>"
  description         = "<A description of my workspace>"
}
```
## 4. Create Azure Virtual Desktop host pool
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
  friendly_name            = "<AVDHostPoolFriendlyName>"
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
## 5. Create Desktop Application Group

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

## 6. Associate Workspace and Desktop Application Group
```hcl
resource "azurerm_virtual_desktop_workspace_application_group_association" "example" {
  application_group_id = azurerm_virtual_desktop_application_group.example.id
  workspace_id         = azurerm_virtual_desktop_workspace.example.id
}

```

## 7. Implement the Terraform code
To bring all these sections together and see Terraform in action, create a directory in which to test and run the sample Terraform code and make it the current directory.

1. Create a file named `main.tf` and insert the following code:

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

# Create AVD Resource Group
resource "azurerm_resource_group" "<rg>" {
  name     = var.rg_name
  location = var.deploy_location
}

resource "time_rotating" "avd_token" {
  rotation_days = 30
}

# Create AVD workspace
resource "azurerm_virtual_desktop_workspace" "<example>" {
  name                = var.workspace
  resource_group_name = azurerm_resource_group.<rg>.name
  location            = var.deploy_location
  friendly_name       = "<AVD Workspace>"
  description         = "<AVD Workspace>"
}

# Create AVD host pool
resource "azurerm_virtual_desktop_host_pool" "<example>" {
  resource_group_name      = azurerm_resource_group.<rg>.name
  name                     = var.hostpool
  description              = "<A description for host pool>
  location                 = var.deploy_location
  validate_environment     = <false> #[true false]
  type                     = "<Pooled>" #[Pooled Personal]
  maximum_sessions_allowed = <16> 
  load_balancer_type       = "<BreadthFirst>" #[BreadthFirst DepthFirst]
  friendly_name            = "<AVDHostPoolFriendlyName>"
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

# Create AVD DAG
resource "azurerm_virtual_desktop_application_group" "<example>" {
  resource_group_name = azurerm_resource_group.<rg>.name
  host_pool_id        = azurerm_virtual_desktop_host_pool.<example>.id
  location            = azurerm_resource_group.<rg>.location
  type                = "<Desktop>"
  name                = "<DAGname>"
  friendly_name       = "<AppGroupName>"
  description         = "<application group description>"
  depends_on          = [azurerm_virtual_desktop_host_pool.<example> azurerm_virtual_desktop_workspace.<example>]
}

# Associate Workspace and DAG
resource "azurerm_virtual_desktop_workspace_application_group_association" "<example>" {
  application_group_id = azurerm_virtual_desktop_application_group.<example>.id
  workspace_id         = azurerm_virtual_desktop_workspace.<example>.id
}
```

## 8. Initialize Terraform

With your Terraform template created, the first step is to initialize Terraform. This step ensures that Terraform has all the prerequisites to build your template in Azure.

```bash
terraform init
```

[!INCLUDE [terraform-init.md](includes/terraform-init.md)]

## 9. Create a Terraform execution plan

The next step is to have Terraform review and validate the template. This step compares the requested resources to the state information saved by Terraform and then outputs the planned execution. The Azure resources aren't created at this point. An execution plan is generated and stored in the file specified by the `-out` parameter.

```bash
terraform plan -out terraform_azure.tfplan
```

[!INCLUDE [terraform-plan.md](includes/terraform-plan.md)]

## 10. Apply a Terraform execution plan

When you're ready to build the infrastructure in Azure, apply the execution plan:

```bash
terraform apply terraform_azure.tfplan
```

[!INCLUDE [terraform-apply-plan.md](includes/terraform-apply-plan.md)]

## 11. Verify the results

Once Terraform completes, your VM infrastructure is ready. Obtain the public IP address of your VM with [az vm show](/cli/azure/vm#az_vm_show):

## 12. Clean up resources

[!INCLUDE [terraform-plan-destroy.md](includes/terraform-plan-destroy.md)]

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](troubleshoot.md)

## Next steps

> [!div class="nextstepaction"] 
> [Learn more about Configuring Azure Virtual Desktop session hosts using Terraform in Azure](/articles/terraform/create-avd-session-host.md)