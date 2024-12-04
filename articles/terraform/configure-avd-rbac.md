---
title: Configure Azure Virtual Desktop Role-Based access control using Terraform
description: Learn how to use Terraform to configure role-based access control for Azure Virtual Desktop.
keywords: azure devops terraform avd virtual desktop rbac
service: azure
ms.service: azure
ms.topic: how-to
ms.date: 10/26/2023
ms.custom: devx-track-terraform
---

# Configure Azure Virtual Desktop role-based access control using Terraform

Article tested with the following Terraform and Terraform provider versions:

- [Terraform v1.1.4](https://releases.hashicorp.com/terraform/)
- [AzureRM Provider v.2.94.0](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs)

[!INCLUDE [Terraform abstract](./includes/abstract.md)]

This article will walk through adding our users and Microsoft Entra group and then assign the group to the "Desktop Virtualization User" role, scoped to our host pool.  

In this article, you learn how to:

> [!div class="checklist"]
> * Use Terraform to read Microsoft Entra existing users
> * Use Terraform to create Microsoft Entra group
> * Role assignment for Azure Virtual Desktop

## 1. Configure your environment

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../includes/open-source-devops-prereqs-azure-subscription.md)]

[!INCLUDE [configure-terraform.md](includes/configure-terraform.md)]

## 2. Implement the Terraform code

1. Create a directory in which to test the sample Terraform code and make it the current directory.

1. Create a file named `providers.tf` and insert the following code:

    [!code-terraform [master](../../terraform_samples/quickstart/101-azure-virtual-desktop/provider.tf)]

1. Create a file named `main.tf` and insert the following code:

    [!code-terraform [master](../../terraform_samples/quickstart/101-azure-virtual-desktop/rbac.tf)]

1. Create a file named `variables.tf` and insert the following code:

```
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

1. Create a file named `output.tf` and insert the following code:

```
output "AVD_user_groupname" {
  description = "Azure Active Directory Group for AVD users"
  value       = azuread_group.aad_group.display_name
}
```
## 6. Initialize Terraform

[!INCLUDE [terraform-init.md](includes/terraform-init.md)]

## 7. Create a Terraform execution plan

[!INCLUDE [terraform-plan.md](includes/terraform-plan.md)]

## 8. Apply a Terraform execution plan

[!INCLUDE [terraform-apply-plan.md](includes/terraform-apply-plan.md)]

You are now ready to build and deploy your infrastructure with role based access control.

## 9. Clean up resources

[!INCLUDE [terraform-plan-destroy.md](includes/terraform-plan-destroy.md)]

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](troubleshoot.md)

## Next steps

> [!div class="nextstepaction"]
> [Learn more about Configuring Azure Virtual Desktop session hosts using Terraform in Azure](./create-avd-session-host.md)
