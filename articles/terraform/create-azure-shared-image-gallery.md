---
title: Configure Azure Compute Gallery using Terraform - Azure
description: Learn how to use Terraform to configure Azure Compute Gallery
keywords: azure devops terraform avd virtual desktop session host
ms.topic: how-to
ms.date: 12/30/2021
ms.custom: devx-track-terraform
---

# Configure Azure Compute Gallery with Terraform

This article shows you how to configure Azure Compute Gallery.

In this article, you learn how to:
> [!div class="checklist"]

> * Use Terraform to configure Azure Compute Gallery (formerly Shared Image Gallery)

## 1. Configure your environment

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../includes/open-source-devops-prereqs-azure-subscription.md)]

[!INCLUDE [configure-terraform.md](includes/configure-terraform.md)]

## 2. Implement the Terraform code

Create a directory in which to test and run the sample Terraform code and make it the current directory.

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

resource "azurerm_resource_group" "sigrg" {
  location = var.deploy_location
  name     = "${var.prefix}-rg"
}


## Created Azure Compute Gallery formerly Shared Image Gallery
resource "azurerm_shared_image_gallery" "sig" {
  name                = "AVDsig"
  resource_group_name = azurerm_resource_group.sigrg.name
  location            = azurerm_resource_group.sigrg.location
  description         = "Shared images"

  tags = {
    Environment = "Demo"
    Tech        = "Terraform"
  }
}

resource "azurerm_shared_image" "example" {
  name                = "avd-image"
  gallery_name        = azurerm_shared_image_gallery.sig.name
  resource_group_name = azurerm_resource_group.sigrg.name
  location            = azurerm_resource_group.sigrg.location
  os_type             = "Windows"

  identifier {
    publisher = "MicrosoftWindowsDesktop"
    offer     = "office-365"
    sku       = "20h2-evd-o365pp"
  }
}
```

## 6. Initialize Terraform

[!INCLUDE [terraform-init.md](includes/terraform-init.md)]

## 7. Create a Terraform execution plan

[!INCLUDE [terraform-plan.md](includes/terraform-plan.md)]

## 8. Apply a Terraform execution plan

[!INCLUDE [terraform-apply-plan.md](includes/terraform-apply-plan.md)]

## 9. Clean up resources

[!INCLUDE [terraform-plan-destroy.md](includes/terraform-plan-destroy.md)]

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](troubleshoot.md)

## Next steps

> [!div class="nextstepaction"]
> [Learn more about using Terraform in Azure](/azure/terraform)
