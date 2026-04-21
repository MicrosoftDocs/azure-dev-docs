---
title: Choose between AzureRM and AzAPI Terraform providers
description: Learn when to use the AzureRM provider versus the AzAPI provider for managing Azure resources with Terraform, including guidance on using both providers together.
ms.topic: concept-article
ms.date: 04/20/2026
ms.custom: devx-track-terraform
author: stema
ms.author: stema
ai-usage: ai-generated
---

# Choose between AzureRM and AzAPI Terraform providers

Azure has two official Terraform providers: **AzureRM** and **AzAPI**. Both providers manage Azure resources through Terraform, but they use different approaches. Understanding these differences helps you choose the right provider—or combination of providers—for your project.

## Overview of each provider

**AzureRM** is the standard provider for managing Azure resources with Terraform. It provides curated, typed resource blocks with integrated validation, consistent behavior, and broad community documentation. However, AzureRM supports only a subset of Azure resource types and API versions, and new features often lag behind Azure releases.

**AzAPI** is a thin layer on top of the Azure Resource Manager (ARM) REST APIs. It supports any Azure resource type at any API version, including preview features and services not yet supported in AzureRM. AzAPI gives you direct access to the ARM API without waiting for provider updates.

## When to use AzureRM

Use AzureRM as your primary provider when:

- The resources you're managing are fully supported in AzureRM with stable API versions.
- You want curated resource schemas with built-in validation and good IDE support.
- Your team values broad community resources, examples, and module availability.
- You're managing well-established Azure services that don't require access to preview features.

AzureRM is the right default for most teams building on Azure. Start with AzureRM, and supplement it with AzAPI only when needed.

## When to use AzAPI

Use AzAPI as your primary provider—or to supplement AzureRM—when:

- You need to manage Azure resources that aren't yet supported in AzureRM.
- You need to use a specific API version, including preview versions, that AzureRM doesn't expose.
- You need access to resource properties that AzureRM doesn't surface.
- You want full control over the API version for compliance or reproducibility reasons.
- You're managing resources immediately after Azure release, before AzureRM adds support.

## When to use both providers together

AzureRM and AzAPI are designed to work side by side. A common pattern is to use AzureRM for most of your infrastructure while using AzAPI to fill specific gaps:

- Use `azapi_update_resource` to set properties on AzureRM-managed resources that AzureRM doesn't expose.
- Use `azapi_resource` to manage a new service or preview feature while the rest of your stack uses AzureRM.
- Use `azapi_resource_action` to perform operations on AzureRM-managed resources that don't fit a standard create/read/update/delete lifecycle.

```terraform
# Manage the primary resource with AzureRM
resource "azurerm_kubernetes_cluster" "example" {
  name                = "my-aks"
  location            = azurerm_resource_group.example.location
  resource_group_name = azurerm_resource_group.example.name
  dns_prefix          = "myaks"
  default_node_pool {
    name       = "default"
    node_count = 1
    vm_size    = "Standard_DS2_v2"
  }
  identity {
    type = "SystemAssigned"
  }
}

# Use AzAPI to set a property not exposed by AzureRM
resource "azapi_update_resource" "aks_preview_feature" {
  type        = "Microsoft.ContainerService/managedClusters@2024-02-01"
  resource_id = azurerm_kubernetes_cluster.example.id

  body = {
    properties = {
      networkProfile = {
        networkDataplane = "cilium"
      }
    }
  }
}
```

## Choosing a long-term strategy

**AzureRM-primary**: Manage all resources in AzureRM and use AzAPI only as a temporary bridge for features not yet supported. Migrate AzAPI resources to AzureRM as support becomes available, using the [`aztfmigrate` tool](how-to-migrate-between-azurerm-and-azapi.md).

**AzAPI-primary**: Manage all resources through AzAPI for consistent API version control and early access to new features. This approach requires more configuration but gives you full control over every resource's API version.

Most teams should start with an AzureRM-primary strategy and adopt AzAPI as needed.

## Feature comparison

| Feature | AzureRM | AzAPI |
|---|---|---|
| Supports all Azure resource types | No—curated subset | Yes |
| Supports preview API versions | No | Yes |
| Curated resource schemas | Yes | No |
| Built-in property validation | Yes | Partial (via preflight) |
| IDE autocomplete for properties | Yes | Yes (with VS Code extension) |
| Response export / JMESPath filtering | No | Yes |
| Data plane resource management | No | Yes (selected resource types) |
| Provider functions for ID construction | No | Yes (v2.0 and later) |
| Preflight validation at plan time | No | Yes |

## Next steps

> [!div class="nextstepaction"]
> [Terraform AzAPI provider overview](overview-azapi-provider.md)

> [!div class="nextstepaction"]
> [Migrate resources from AzAPI to AzureRM](how-to-migrate-between-azurerm-and-azapi.md)
