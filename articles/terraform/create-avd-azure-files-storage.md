---
title: Configure Azure Files for FSLogix profiles for Azure Virtual Desktop using Terraform - Azure
description: Learn how to use Terraform to configure Azure Files for FSLogix profiles Azure Virtual Desktop with Terraform
keywords: azure devops terraform avd virtual desktop storage fslogix
service: azure
ms.service: azure
ms.topic: how-to
ms.date: 10/26/2023
ms.custom: devx-track-terraform
---

# Configure Azure Files using Terraform

Article tested with the following Terraform and Terraform provider versions:

- [Terraform v1.1.7](https://releases.hashicorp.com/terraform/)
- [AzureRM Provider v.2.99.0](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs)

[!INCLUDE [Terraform abstract](./includes/abstract.md)]

Azure offers multiple storage solutions that you can use to store your FSLogix profiles container. This article covers configuring Azure Files storage solutions for Azure Virtual Desktop FSLogix user profile containers using Terraform

In this article, you learn how to:

> [!div class="checklist"]
> * Use Terraform to Azure File Storage account
> * Use Terraform to configure File Share
> * Use Terraform to configure RBAC permission on Azure File Storage

## 1. Configure your environment

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../includes/open-source-devops-prereqs-azure-subscription.md)]

[!INCLUDE [configure-terraform.md](includes/configure-terraform.md)]

## 2. Implement the Terraform code

1. Create a directory in which to test the sample Terraform code and make it the current directory.

1. Create a file named `providers.tf` and insert the following code.

    [!code-terraform [master](../../terraform_samples/quickstart/101-azure-virtual-desktop/provider.tf)]

1. Create a file named `main.tf` and insert the following code:

    [!code-terraform [master](../../terraform_samples/quickstart/101-azure-virtual-desktop/afstorage.tf)]

1. Create a file named `variables.tf` and insert the following code:

```
variable "deploy_location" {
  type        = string
  default     = "eastus"
  description = "The Azure Region in which all resources in this example should be created."
}

variable "rg_stor" {
  type        = string
  default     = "rg-avd-storage"
  description = "Name of the Resource group in which to deploy storage"
}

variable "avd_users" {
  description = "AVD users"
  default = [
    "avduser01@contoso.net",
    "avduser02@contoso.net"
  ]
}

variable "aad_group_name" {
  type        = string
  default     = "AVDUsers"
  description = "Azure Active Directory Group for AVD users"
}
```

2. Create a file named `output.tf` and insert the following code:

```
output "location" {
  description = "The Azure region"
  value       = azurerm_resource_group.rg_storage.location
}

output "storage_account" {
  description = "Storage account for Profiles"
  value       = azurerm_storage_account.storage.name
}

output "storage_account_share" {
  description = "Name of the Azure File Share created for FSLogix"
  value       = azurerm_storage_share.FSShare.name
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

## 6. Clean up resources

[!INCLUDE [terraform-plan-destroy.md](includes/terraform-plan-destroy.md)]

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](troubleshoot.md)

## Next steps

> [!div class="nextstepaction"]
> [Learn more about using Terraform in Azure](/azure/terraform)
