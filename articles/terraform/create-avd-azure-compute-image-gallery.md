---
title: Configure Azure Compute Gallery using Terraform - Azure
description: Learn how to use Terraform to configure Azure Compute Gallery
keywords: azure devops terraform avd virtual desktop session host
service: azure
ms.service: azure
ms.topic: how-to
ms.date: 10/26/2023
ms.custom: devx-track-terraform
---

# Configure Azure Compute Gallery with Terraform

[!INCLUDE [Terraform abstract](./includes/abstract.md)]

This article shows you how to configure Azure Compute Gallery.

In this article, you learn how to:

> [!div class="checklist"]
> * Use Terraform to configure Azure Compute Gallery (formerly Shared Image Gallery)

## 1. Configure your environment

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../includes/open-source-devops-prereqs-azure-subscription.md)]

[!INCLUDE [configure-terraform.md](includes/configure-terraform.md)]

## 2. Implement the Terraform code

1. Create a directory in which to test the sample Terraform code and make it the current directory.

1. Create a file named `providers.tf` and insert the following code:

    [!code-terraform [master](../../terraform_samples/quickstart/101-azure-virtual-desktop/provider.tf)]

1. Create a file named `main.tf` and insert the following code:

    [!code-terraform [master](../../terraform_samples/quickstart/101-azure-virtual-desktop/sig.tf)]

1. Create a file named `variables.tf` and insert the following code:

```
variable "deploy_location" {
  type        = string
  default     = "eastus"
  description = "The Azure Region in which all resources in this example should be created."
}

variable "rg_shared_name" {
  type        = string
  default     = "rg-shared-resources"
  description = "Name of the Resource group in which to deploy shared resources"
}
```

1. Create a file named `output.tf` and insert the following code:

```
output "location" {
  description = "The Azure region"
  value       = azurerm_resource_group.sigrg.location
}

output "Compute_Gallery" {
  description = "Azure Compute Gallery"
  value       = azurerm_shared_image_gallery.sig.name
}
```

## 3. Create a Terraform execution plan

[!INCLUDE [terraform-plan.md](includes/terraform-plan.md)]

## 4. Apply a Terraform execution plan

[!INCLUDE [terraform-apply-plan.md](includes/terraform-apply-plan.md)]

## 5. Clean up resources

[!INCLUDE [terraform-plan-destroy.md](includes/terraform-plan-destroy.md)]

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](troubleshoot.md)

## Next steps

> [!div class="nextstepaction"]
> [Learn more about using Terraform in Azure](/azure/terraform)
