---
title: Use provider functions in the AzAPI Terraform provider
description: Learn how to use AzAPI provider functions to construct and parse Azure resource IDs without external data source lookups.
ms.topic: how-to
ms.date: 04/20/2026
ms.custom: devx-track-terraform
author: stema
ms.author: stema
ai-usage: ai-generated
---

# Use provider functions in the AzAPI Terraform provider

[!INCLUDE [Terraform abstract](./includes/abstract.md)]

AzAPI v2.0 and later includes a set of [provider functions](https://developer.hashicorp.com/terraform/plugin/framework/functions/concepts) for constructing and parsing Azure resource IDs. Provider functions run at plan time within the Terraform configuration and don't require a data source lookup or a network call. They reduce code complexity when your configuration needs to construct or decompose resource IDs.

> [!NOTE]
> Provider functions require Terraform 1.8 or later.

## Available provider functions

| Function | Description |
|---|---|
| [`build_resource_id`](https://registry.terraform.io/providers/Azure/azapi/latest/docs/functions/build_resource_id) | Constructs a resource ID from a parent ID, resource type, and resource name. Supports both top-level and nested resources. |
| [`extension_resource_id`](https://registry.terraform.io/providers/Azure/azapi/latest/docs/functions/extension_resource_id) | Constructs an extension resource ID from a base resource ID, resource type, and resource names. |
| [`management_group_resource_id`](https://registry.terraform.io/providers/Azure/azapi/latest/docs/functions/management_group_resource_id) | Constructs a management group–scoped resource ID. |
| [`parse_resource_id`](https://registry.terraform.io/providers/Azure/azapi/latest/docs/functions/parse_resource_id) | Parses an Azure resource ID into its component parts (subscription ID, resource group name, provider namespace, resource name, and more). |
| [`resource_group_resource_id`](https://registry.terraform.io/providers/Azure/azapi/latest/docs/functions/resource_group_resource_id) | Constructs a resource group–scoped resource ID from a subscription ID, resource group name, resource type, and resource names. |
| [`subscription_resource_id`](https://registry.terraform.io/providers/Azure/azapi/latest/docs/functions/subscription_resource_id) | Constructs a subscription-scoped resource ID. |
| [`tenant_resource_id`](https://registry.terraform.io/providers/Azure/azapi/latest/docs/functions/tenant_resource_id) | Constructs a tenant-scoped resource ID. |

## Prerequisites

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../includes/open-source-devops-prereqs-azure-subscription.md)]

[!INCLUDE [configure-terraform.md](includes/configure-terraform.md)]

Ensure your configuration declares AzAPI v2.0 or later and Terraform 1.8 or later:

```terraform
terraform {
  required_version = ">= 1.8"
  required_providers {
    azapi = {
      source  = "Azure/azapi"
      version = "~> 2.0"
    }
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 4.0"
    }
  }
}

provider "azurerm" {
  features {}
}

provider "azapi" {}
```

## Parse a resource ID with `parse_resource_id`

Use `parse_resource_id` to decompose an existing Azure resource ID into its individual components. The function is useful when you need the subscription ID, resource group name, or resource name from a resource managed elsewhere in your configuration or passed in as a variable.

```terraform
locals {
  storage_id_parts = provider::azapi::parse_resource_id(
    "Microsoft.Storage/storageAccounts",
    azurerm_storage_account.example.id
  )
}

output "subscription_id" {
  value = local.storage_id_parts.subscription_id
}

output "resource_group_name" {
  value = local.storage_id_parts.resource_group_name
}

output "storage_account_name" {
  value = local.storage_id_parts.resource_name
}
```

The function returns an object with these fields:

- `subscription_id`
- `resource_group_name`
- `provider_namespace` (for example, `Microsoft.Storage`)
- `resource_type` (for example, `storageAccounts`)
- `resource_name`
- `parent_id`

## Construct a resource group–scoped ID with `resource_group_resource_id`

Use `resource_group_resource_id` when you need to reference a resource ID for a resource you don't manage in Terraform (for example, an existing resource passed in as a variable), or when you want to construct a predictable ID ahead of resource creation.

```terraform
variable "subscription_id" {
  type = string
}

variable "existing_resource_group" {
  type = string
}

variable "existing_storage_account" {
  type = string
}

locals {
  storage_account_id = provider::azapi::resource_group_resource_id(
    var.subscription_id,
    var.existing_resource_group,
    "Microsoft.Storage/storageAccounts",
    [var.existing_storage_account]
  )
}

# Reference the pre-existing storage account without a data source lookup
resource "azapi_resource_action" "regenerate_key" {
  type        = "Microsoft.Storage/storageAccounts@2023-01-01"
  resource_id = local.storage_account_id
  action      = "regenerateKey"
  method      = "POST"

  body = {
    keyName = "key1"
  }
}
```

The resource names parameter accepts a list to support nested resource types. For example, to construct a subnet ID:

```terraform
locals {
  subnet_id = provider::azapi::resource_group_resource_id(
    var.subscription_id,
    var.resource_group_name,
    "Microsoft.Network/virtualNetworks/subnets",
    [var.vnet_name, var.subnet_name]
  )
}
```

## Construct a subscription-scoped ID with `subscription_resource_id`

Use `subscription_resource_id` for resources scoped at the subscription level, such as resource groups or policy assignments:

```terraform
locals {
  resource_group_id = provider::azapi::subscription_resource_id(
    var.subscription_id,
    "Microsoft.Resources/resourceGroups",
    [var.resource_group_name]
  )
}
```

## Construct a management group–scoped ID with `management_group_resource_id`

Use `management_group_resource_id` for management group–scoped resources such as policy assignments and role assignments:

```terraform
locals {
  mg_policy_id = provider::azapi::management_group_resource_id(
    var.management_group_name,
    "Microsoft.Authorization/policyAssignments",
    [var.policy_assignment_name]
  )
}
```

## Construct an extension resource ID with `extension_resource_id`

Use `extension_resource_id` for extension resources that are attached to another resource, such as locks or role assignments on a specific resource:

```terraform
locals {
  lock_id = provider::azapi::extension_resource_id(
    azurerm_storage_account.example.id,
    "Microsoft.Authorization/locks",
    [var.lock_name]
  )
}
```

## Build a resource ID with `build_resource_id`

Use `build_resource_id` when a parent resource ID determines the scope and you don't need to specify subscription or resource group separately. This function infers the scope from the parent ID:

```terraform
locals {
  subnet_id = provider::azapi::build_resource_id(
    azurerm_virtual_network.example.id,
    "Microsoft.Network/virtualNetworks/subnets",
    var.subnet_name
  )
}
```

## Compare with data source approaches

Provider functions are preferable over data sources for ID construction and parsing because they:

- Run entirely at plan time with no network calls.
- Don't add resources to Terraform state.
- Are deterministic and don't require `depends_on` ordering.

Use `azapi_resource` data source when you need to read live properties of a resource, not just construct or parse its ID.

## Next steps

> [!div class="nextstepaction"]
> [Terraform AzAPI provider overview](overview-azapi-provider.md)

> [!div class="nextstepaction"]
> [List Azure resources with the AzAPI Terraform provider](get-started-azapi-resource-list.md)
