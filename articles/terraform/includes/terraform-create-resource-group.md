---
title: include file
description: include file
author: tomarchermsft
ms.service: terraform
ms.topic: include
ms.date: 09/26/2020
ms.author: tarcher
---

## Create an Azure resource group

```hcl
  resource "azurerm_resource_group" "rg" {
    name = "<your_resource_group_name>"
    location = "<your_resource_group_location>"
  }
```

**Notes**:

- The [resource declaration](https://www.terraform.io/docs/configuration/resources.html) of [azurerm_resource_group](https://www.terraform.io/docs/providers/azurerm/r/resource_group.html) has two arguments: `name` and `location`. Set the placeholders to the appropriate values for your environment.
