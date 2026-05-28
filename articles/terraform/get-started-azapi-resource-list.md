---
title: Quickstart - List Azure resources with the AzAPI Terraform provider
description: Learn how to use the azapi_resource_list data source to list Azure resources and filter results with JMESPath.
keywords: azure devops terraform azapi resource_list data source jmespath
ms.topic: quickstart
ms.date: 04/20/2026
ms.custom: devx-track-terraform
author: stema
ms.author: stema
ai-usage: ai-generated
---

# Quickstart: List Azure resources with the AzAPI Terraform provider

[!INCLUDE [Terraform abstract](./includes/abstract.md)]

In this article, you use the [`azapi_resource_list`](https://registry.terraform.io/providers/Azure/azapi/latest/docs/data-sources/resource_list) data source to list Azure resources and filter results with [JMESPath](https://jmespath.org/) expressions. You create two storage accounts, then use `azapi_resource_list` to list and extract their properties.

> [!div class="checklist"]
> * Create a resource group and two storage accounts with the AzureRM provider
> * Use `azapi_resource_list` to list the storage accounts and extract their names and locations using JMESPath

## Prerequisites

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../includes/open-source-devops-prereqs-azure-subscription.md)]

[!INCLUDE [configure-terraform.md](includes/configure-terraform.md)]

[!INCLUDE [confirm-default-azure-subscription-or-authenticate.md](includes/confirm-default-azure-subscription-or-authenticate.md)]

## Understand `response_export_values`

The `response_export_values` attribute controls which properties are extracted from the API response and made available in the `output` attribute of the data source. It accepts either a list or a map:

- **List**: Specifies JSON paths to extract. Use `["*"]` to export the full response body.
- **Map**: Uses JMESPath expressions to filter and reshape the response. The key is the name of the result, and the value is the JMESPath expression.

The map form is preferred when you need to extract specific fields or transform list responses, because it produces cleaner, more usable output values.

## Implement the Terraform code

1. Create a directory in which to test the sample Terraform code and make it the current directory.

1. Create a file named `providers.tf` and insert the following code:

    ```terraform
    terraform {
      required_providers {
        azapi = {
          source  = "Azure/azapi"
          version = "~> 2.0"
        }
        azurerm = {
          source  = "hashicorp/azurerm"
          version = "~> 4.0"
        }
        random = {
          source  = "hashicorp/random"
          version = "~> 3.0"
        }
      }
    }
    
    provider "azurerm" {
      features {}
    }
    
    provider "azapi" {}
    ```

1. Create a file named `variables.tf` and insert the following code:

    ```terraform
    variable "resource_group_location" {
      type        = string
      default     = "eastus"
      description = "Location of the resource group."
    }
    
    variable "resource_group_name_prefix" {
      type        = string
      default     = "rg"
      description = "Prefix of the resource group name that's combined with a random value to create a unique name."
    }
    ```

1. Create a file named `main.tf` and insert the following code:

    ```terraform
    resource "random_pet" "rg_name" {
      prefix = var.resource_group_name_prefix
    }
    
    resource "random_string" "storage_suffix" {
      length  = 8
      upper   = false
      special = false
    }
    
    resource "azurerm_resource_group" "example" {
      location = var.resource_group_location
      name     = random_pet.rg_name.id
    }
    
    resource "azurerm_storage_account" "example" {
      count                    = 2
      name                     = "st${random_string.storage_suffix.result}${count.index}"
      resource_group_name      = azurerm_resource_group.example.name
      location                 = azurerm_resource_group.example.location
      account_tier             = "Standard"
      account_replication_type = "LRS"
    }
    ```

[!INCLUDE [terraform-init.md](includes/terraform-init.md)]

[!INCLUDE [terraform-plan.md](includes/terraform-plan.md)]

[!INCLUDE [terraform-apply-plan.md](includes/terraform-apply-plan.md)]

## List resources with `azapi_resource_list`

Now that the storage accounts are created, add a data source to list them and extract properties using JMESPath.

1. Create a file named `list_resources.tf` and insert the following code:

    ```terraform
    data "azapi_resource_list" "storage_accounts" {
      type      = "Microsoft.Storage/storageAccounts@2023-01-01"
      parent_id = azurerm_resource_group.example.id
    
      # Use JMESPath expressions to extract specific fields from the response.
      # The API returns a list of resources in a top-level "value" array.
      response_export_values = {
        "names"     = "value[].name"
        "locations" = "value[].location"
        "skus"      = "value[].sku.name"
      }
    }
    ```

1. Create a file named `outputs.tf` and insert the following code:

    ```terraform
    output "resource_group_name" {
      value = azurerm_resource_group.example.name
    }
    
    output "storage_account_names" {
      value = data.azapi_resource_list.storage_accounts.output.names
    }
    
    output "storage_account_locations" {
      value = data.azapi_resource_list.storage_accounts.output.locations
    }
    
    output "storage_account_skus" {
      value = data.azapi_resource_list.storage_accounts.output.skus
    }
    ```

1. Run `terraform apply` again to create the data source and extract the outputs:

    ```console
    terraform apply
    ```

## Key points about `azapi_resource_list`

- The `type` field identifies the resource type and API version to list.
- The `parent_id` field sets the scope: a resource group ID to list within a resource group, a subscription ID to list across a subscription, or a parent resource ID to list child resources (for example, subnets under a VNet).
- The map form of `response_export_values` uses JMESPath expressions against the raw API response. The storage account list API returns results in a top-level `value` array, so expressions start with `value[]`.

## List resources at different scopes

The `parent_id` determines the listing scope. Examples:

```terraform
# List all storage accounts in a subscription
data "azapi_resource_list" "all_storage" {
  type      = "Microsoft.Storage/storageAccounts@2023-01-01"
  parent_id = "/subscriptions/${var.subscription_id}"
  response_export_values = {
    "names" = "value[].name"
  }
}

# List subnets in a virtual network (child resource listing)
data "azapi_resource_list" "subnets" {
  type      = "Microsoft.Network/virtualNetworks/subnets@2023-11-01"
  parent_id = azurerm_virtual_network.example.id
  response_export_values = ["*"]
}
```

## Clean up resources

[!INCLUDE [terraform-plan-destroy.md](includes/terraform-plan-destroy.md)]

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](troubleshoot.md)

## Next steps

> [!div class="nextstepaction"]
> [Terraform AzAPI provider overview](overview-azapi-provider.md)

> [!div class="nextstepaction"]
> [Use provider functions in the AzAPI Terraform provider](how-to-use-azapi-provider-functions.md)
