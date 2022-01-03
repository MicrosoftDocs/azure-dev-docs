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
  location = var.location
  name     = "${var.prefix}-rg"
}
```

In other sections, you reference the resource group with `azurerm_resource_group.<rg>.name`.

## 3. Configure Azure Compute Gallery formerly Shared Image Gallery

```hcl
resource "azurerm_shared_image_gallery" "<sig>" {
  name                = "<AVDsig>"
  resource_group_name = azurerm_resource_group.<rg>.name
  location            = azurerm_resource_group.<rg>.location
  description         = "<Shared images and things>"

  tags = {
    Environment = "<Demo>"
    Tech        = "<Terraform>"
  }
}
```

## 4. Configure an Image Definition

```hcl

resource "azurerm_shared_image" "<example>" {
  name                = "<avd-image>"
  gallery_name        = azurerm_shared_image_gallery.<sig>.name
  resource_group_name = azurerm_resource_group.<rg>.name
  location            = azurerm_resource_group.<rg>.location
  os_type             = "<Windows>"

  identifier {
    publisher = "<MicrosoftWindowsDesktop>"
    offer     = "<office-365>"
    sku       = "<20h2-evd-o365pp>"
  }
}
```

## 5. Implement the Terraform code

To bring all these sections together and see Terraform in action, create a directory in which to test and run the sample Terraform code and make it the current directory.

1. Create a file named `main.tf` and insert the following code:

```hcl
provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "<rg>" {
  location = var.location
  name     = "${var.prefix}-rg"
}


## Created Azure Compute Gallery formerly Shared Image Gallery
resource "azurerm_shared_image_gallery" "<sig>" {
  name                = "<AVDsig>"
  resource_group_name = azurerm_resource_group.<rg>.name
  location            = azurerm_resource_group.<rg>.location
  description         = "<Shared images and things>"

  tags = {
    Environment = "<Demo>"
    Tech        = "<Terraform>"
  }
}

resource "azurerm_shared_image" "<example>" {
  name                = "<avd-image>"
  gallery_name        = azurerm_shared_image_gallery.<sig>.name
  resource_group_name = azurerm_resource_group.<rg>.name
  location            = azurerm_resource_group.<rg>.location
  os_type             = "<Windows>"

  identifier {
    publisher = "<MicrosoftWindowsDesktop>"
    offer     = "<office-365>"
    sku       = "<20h2-evd-o365pp>"
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
