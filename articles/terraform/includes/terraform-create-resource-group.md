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
