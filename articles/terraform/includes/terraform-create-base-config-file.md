---
title: include file
description: include file
ms.topic: how-to
ms.date: 08/05/2021
ms.custom: devx-track-terraform
ms.author: tarcher
---

A Terraform configuration file starts off with the specification of the provider. When using Azure, you specify the [Azure provider (azurerm)](https://www.terraform.io/docs/providers/azurerm/index.html) in the `provider` block.

```terraform
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

# Your Terraform code goes here...

```

**Key points:**

- While the `version` attribute is optional, HashiCorp recommends pinning to a given version of the provider.
- If you're using Azure provider 1.x, the `features` block isn't allowed.
- If you're using Azure provider 2.x, the `features` block is required.
- The [resource declaration](https://www.terraform.io/docs/configuration/resources.html) of [azurerm_resource_group](https://www.terraform.io/docs/providers/azurerm/r/resource_group.html) has two arguments: `name` and `location`. Set the placeholders to the appropriate values for your environment.
- The [local named value](https://www.terraform.io/docs/configuration/expressions.html#references-to-named-values) of `rg` for the resource group is used throughout the how-to and article articles when referencing the resource group. This value is independent of the resource group name and only refers to the variable name in your code. If you change this value in the resource group definition, change it also in the code that references it.