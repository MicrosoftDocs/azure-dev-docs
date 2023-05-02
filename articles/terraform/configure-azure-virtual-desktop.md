---
title: Configure Azure Virtual Desktop using Terraform - Azure
description: Learn how to use Terraform to configure Azure Virtual Desktop with Terraform
keywords: azure devops terraform avd virtual desktop session host
ms.topic: how-to
ms.date: 03/18/2023
ms.custom: devx-track-terraform
---

# Configure Azure Virtual Desktop with Terraform

Article tested with the following Terraform and Terraform provider versions:

- [Terraform v1.1.7](https://releases.hashicorp.com/terraform/)
- [AzureRM Provider v.2.99.0](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs)

[!INCLUDE [Terraform abstract](./includes/abstract.md)]

This article provides an overview of how to use Terraform to deploy an ARM Azure Virtual Desktop environment, not AVD Classic.

There are several pre-requisites [requirements for Azure Virtual Desktop](/azure/virtual-desktop/prerequisites)

New to Azure Virtual Desktop? Start with [What is Azure Virtual Desktop?](/azure/virtual-desktop/overview)

It is assumed that an appropriate platform foundation is already setup which may or may not be the [Enterprise Scale Landing Zone platform foundation.](/azure/cloud-adoption-framework/ready/enterprise-scale/implementation)

In this article, you learn how to:

> [!div class="checklist"]
> * Use Terraform to create an Azure Virtual Desktop workspace
> * Use Terraform to create an Azure Virtual Desktop host pool
> * Use Terraform to create an Azure Desktop Application Group
> * Associate a Workspace and a Desktop Application Group

## 1. Configure your environment

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../includes/open-source-devops-prereqs-azure-subscription.md)]

[!INCLUDE [configure-terraform.md](includes/configure-terraform.md)]

## 2. Implement the Terraform code

1. Create a directory in which to test the sample Terraform code and make it the current directory.

1. Create a file named `providers.tf` and insert the following code:

    [!code-terraform [master](../../terraform_samples/quickstart/101-azure-virtual-desktop/provider.tf)]

1. Create a file named `main.tf` and insert the following code:

    [!code-terraform [master](../../terraform_samples/quickstart/101-azure-virtual-desktop/main.tf)]

1. Create a file named `variables.tf` and insert the following code:

    ```
    variable "resource_group_location" {
    default     = "eastus"
    description = "Location of the resource group."
    }

    variable "rg_name" {
    type        = string
    default     = "rg-avd-resources"
    description = "Name of the Resource group in which to deploy service objects"
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

    variable "rfc3339" {
    type        = string
    default     = "2022-03-30T12:43:13Z"
    description = "Registration token expiration"
    }

    variable "prefix" {
    type        = string
    default     = "avdtf"
    description = "Prefix of the name of the AVD machine(s)"
    }
    ```

1. Create a file named `output.tf` and insert the following code:

    ```
    output "azure_virtual_desktop_compute_resource_group" {
      description = "Name of the Resource group in which to deploy session host"
      value       = azurerm_resource_group.sh.name
    }
    
    output "azure_virtual_desktop_host_pool" {
      description = "Name of the Azure Virtual Desktop host pool"
      value       = azurerm_virtual_desktop_host_pool.hostpool.name
    }
    
    output "azurerm_virtual_desktop_application_group" {
      description = "Name of the Azure Virtual Desktop DAG"
      value       = azurerm_virtual_desktop_application_group.dag.name
    }
    
    output "azurerm_virtual_desktop_workspace" {
      description = "Name of the Azure Virtual Desktop workspace"
      value       = azurerm_virtual_desktop_workspace.workspace.name
    }
    
    output "location" {
      description = "The Azure region"
      value       = azurerm_resource_group.sh.location
    }
    
    output "AVD_user_groupname" {
      description = "Azure Active Directory Group for AVD users"
      value       = azuread_group.aad_group.display_name
    }
    ```

## 3. Initialize Terraform

[!INCLUDE [terraform-init.md](includes/terraform-init.md)]

## 4. Create a Terraform execution plan

[!INCLUDE [terraform-plan.md](includes/terraform-plan.md)]

## 5. Apply a Terraform execution plan

[!INCLUDE [terraform-apply-plan.md](includes/terraform-apply-plan.md)]

## 6. Verify the results

1. On the Azure portal, Select **Azure Virtual Desktop**.
1. Select **Host pools** and then the **Name of the pool created** resource.
1. Select **Session hosts** and then verify the session host is listed.

## 7. Clean up resources

[!INCLUDE [terraform-plan-destroy.md](includes/terraform-plan-destroy.md)]

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](troubleshoot.md)

## Next steps

> [!div class="nextstepaction"]
> [Learn more about using Terraform in Azure](/azure/terraform)
