---
title: Configure Log Analytics Workspace using Terraform - Azure
description: Learn how to use Terraform to configure Azure Log Analytics Workspace
keywords: azure devops terraform log analytics
ms.topic: how-to
ms.date: 12/30/2021
ms.custom: devx-track-terraform
---

# Create an Azure Log Analytics Workspace using Terraform

This article shows you how to create a Log Analytics workspace using Terraform.

In this article, you learn how to:
> [!div class="checklist"]

> * Use Terraform to configure Azure Log Analytics Workspace

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

## 3. Configure Azure Log Analytics Workspace with Terraform

Create a file named `main.tf` and insert the following code:

```hcl
resource "azurerm_log_analytics_workspace" "<lawksp>" {
  name                = "log${random_string.random.id}"
  location            = azurerm_resource_group.<rg>.location
  resource_group_name = azurerm_resource_group.<rg>.name
  sku                 = "PerGB2018"
}
```

## 4. Initialize Terraform

[!INCLUDE [terraform-init.md](includes/terraform-init.md)]

## 5. Create a Terraform execution plan

[!INCLUDE [terraform-plan.md](includes/terraform-plan.md)]

## 6. Apply a Terraform execution plan

[!INCLUDE [terraform-apply-plan.md](includes/terraform-apply-plan.md)]

## 7. Clean up resources

[!INCLUDE [terraform-plan-destroy.md](includes/terraform-plan-destroy.md)]

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](troubleshoot.md)

## Next steps

> [!div class="nextstepaction"]
> [Learn more about using Terraform in Azure](/azure/terraform)
