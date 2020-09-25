---
title: Create an Azure resource group using Terraform
description: Learn how to use Terraform to create an Azure resource group
keywords: azure devops terraform resource group
ms.topic: how-to
ms.date: 09/25/2020
ms.custom: devx-track-terraform
---

# Create an Azure resource group using Terraform

This article shows example Terraform code for creating a resource group on Azure.

[!INCLUDE [hashicorp-support.md](includes/hashicorp-support.md)]

## Prerequisites

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../includes/open-source-devops-prereqs-azure-subscription.md)]

## Configure your environment

Based on your environment, install and configure Terraform:

- [Configure Terraform using Azure Cloud Shell and Azure CLI](get-started-cloud-shell.md)
- [Configure Terraform using Azure PowerShell](get-started-powershell.md)

The configuration articles also explain how to do the following tasks:

- Create a Terraform configuration file by inserting a `provider block` in front of your Terraform code.
- Create and apply a Terraform execution plan to "run" your code.
- Reverse an execution plan once you're finished using the resources and want to delete them.

## Create an Azure resource group

```hcl
  resource "azurerm_resource_group" "rg" {
    name = "<your_resource_group_name>"
    location = "<your_resource_group_location>"
  }
```

**Notes**:

- The [resource declaration](https://www.terraform.io/docs/configuration/resources.html) of [azurerm_resource_group](https://www.terraform.io/docs/providers/azurerm/r/resource_group.html) has two arguments: `name` and `location`. Set the placeholders to the appropriate values for your environment.