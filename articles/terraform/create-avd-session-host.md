---
title: Configure Azure Virtual Desktop Session Hosts using Terraform
description: Learn how to use Terraform to configure session hosts and add them to a host pool.
keywords: azure devops terraform avd virtual desktop session host
service: azure
ms.service: azure
ms.topic: how-to
ms.date: 10/26/2023
ms.custom: devx-track-terraform
---

# Configure Azure Virtual Desktop session hosts using Terraform

This article shows you how to build Session Hosts and deploy them to an AVD Host Pool with Terraform. This article assumes you've already deployed the [Azure Virtual Desktop Infrastructure](../terraform/configure-azure-virtual-desktop.md).

Article tested with the following Terraform and Terraform provider versions:

- [Terraform v1.1.7](https://releases.hashicorp.com/terraform/)
- [AzureRM Provider v.2.99.0](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs)

[Learn more about using Terraform in Azure](/azure/terraform)

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

## 2. Implement the Terraform code

1. Create a directory in which to test the sample Terraform code and make it the current directory.

1. Create a file named `providers.tf` and insert the following code.

    [!code-terraform [master](../../terraform_samples/quickstart/101-azure-virtual-desktop/provider.tf)]

    **Key points:**

    - Use `count` to indicate how many resources will be created
    - References resources that were created when the infrastructure was built - such as `azurerm_subnet.subnet.id` and `azurerm_virtual_desktop_host_pool.hostpool.name`.  If you  changed the name of these resources from that section, you also need to update the references here.

1. Create a file named `main.tf` and insert the following code:

    [!code-terraform [master](../../terraform_samples/quickstart/101-azure-virtual-desktop/host.tf)]

1. Create a file named `variables.tf` and insert the following code:

    ```
    variable "resource_group_location" {
      default     = "eastus"
      description = "Location of the resource group."
    }
    
    variable "rg" {
      type        = string
      default     = "rg-avd-compute"
      description = "Name of the Resource group in which to deploy session host"
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
      default     = "domainjoineruser" # do not include domain name as this is appended
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
    
    1. Create a file named `output.tf` and insert the following code:
    
    ```
    output "location" {
      description = "The Azure region"
      value       = azurerm_resource_group.rg.location
    }
    
    output "session_host_count" {
      description = "The number of VMs created"
      value       = var.rdsh_count
    }
    
    output "dnsservers" {
      description = "Custom DNS configuration"
      value       = azurerm_virtual_network.vnet.dns_servers
    }
    
    output "vnetrange" {
      description = "Address range for deployment vnet"
      value       = azurerm_virtual_network.vnet.address_space
    }
    ```
    
1. Create a file named `terraform.tfvars` and insert the following code:

    [!code-terraform [master](../../terraform_samples/quickstart/101-azure-virtual-desktop/environments/sample.tfvars)]

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
