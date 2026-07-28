---
title: Enable preflight validation for Terraform on Azure
description: Learn how to enable preflight validation in the AzureRM and AzAPI Terraform providers to catch Azure resource configuration errors at plan time before any infrastructure is deployed.
ms.topic: how-to
ms.date: 07/28/2026
ms.custom: devx-track-terraform
author: stema
ms.author: stema
ai-usage: ai-assisted
---

# Enable preflight validation for Terraform on Azure

[!INCLUDE [Terraform abstract](./includes/abstract.md)]

Preflight validation checks your Azure resource configuration against the Azure Resource Manager (ARM) deployments validation API during `terraform plan`, before any resources are created or modified in Azure. Preflight catches configuration errors early—such as invalid address prefixes, unsupported property values, or Azure Policy violations—without incurring the cost of a failed `terraform apply`.

Both the **AzureRM** and **AzAPI** Terraform providers support opt-in preflight validation. Preflight is disabled by default in both providers to preserve backward compatibility. Enable it in environments where you want early validation, such as CI pipelines and pull request checks.

You can also run preflight from the [Microsoft Terraform VS Code extension](how-to-use-terraform-vscode-extension.md#preflight-validation) without setting a provider flag directly.

## Prerequisites

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../includes/open-source-devops-prereqs-azure-subscription.md)]

[!INCLUDE [configure-terraform.md](includes/configure-terraform.md)]

[!INCLUDE [confirm-default-azure-subscription-or-authenticate.md](includes/confirm-default-azure-subscription-or-authenticate.md)]

## How preflight validation works

When preflight is enabled, the provider submits the resource payload that it would send during `Create` and `Update` operations to the ARM deployments validation API during `terraform plan`. Where the resource type supports it, this surfaces configuration errors—including those raised by Azure Policy assignments—at plan time rather than at apply time.

Because preflight runs during `terraform plan` and makes no changes to your infrastructure, it's safe to run in pull request workflows against live Azure subscriptions.

## Enable preflight validation in the AzureRM provider

Set `preflight_enabled = true` in the `enhanced_validation` block, inside the `features` block of the provider configuration:

```terraform
provider "azurerm" {
  features {
    enhanced_validation {
      preflight_enabled = true
    }
  }
}
```

You can also enable preflight validation by setting the `ARM_PROVIDER_ENHANCED_VALIDATION_PREFLIGHT_ENABLED` environment variable to `true`.

### Supported resources

In the AzureRM provider, preflight validation applies to a selected, growing list of resource types. The following resources currently support preflight validation:

- `azurerm_eventgrid_namespace`
- `azurerm_managed_redis`
- `azurerm_service_plan`
- `azurerm_dashboard_grafana`
- `azurerm_nginx_deployment`

For the current list, see the [AzureRM provider preflight validation guide](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/guides/preflight_validation).

## Enable preflight validation in the AzAPI provider

Set `enable_preflight = true` in the `provider "azapi"` block:

```terraform
provider "azapi" {
  enable_preflight = true
}
```

The AzAPI provider works natively with a direct-to-ARM-API architecture, so preflight applies to any resource type that has ARM preflight support. The provider silently skips validation for resource types that don't support it.

### Example: Catch an invalid address prefix at plan time

The following configuration creates a virtual network with an invalid Classless Inter-Domain Routing (CIDR) block. With preflight enabled, the error surfaces during `terraform plan` rather than during `terraform apply`:

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
  }
}

provider "azurerm" {
  features {}
}

provider "azapi" {
  enable_preflight = true
}

resource "azurerm_resource_group" "example" {
  name     = "rg-preflight-demo"
  location = "eastus"
}

resource "azapi_resource" "vnet" {
  type      = "Microsoft.Network/virtualNetworks@2024-01-01"
  parent_id = azurerm_resource_group.example.id
  name      = "vnet-example"
  location  = "eastus"

  body = {
    properties = {
      addressSpace = {
        addressPrefixes = [
          "10.0.0.0/160"  # Invalid prefix length — preflight catches this at plan time
        ]
      }
    }
  }
}
```

When you run `terraform plan` with this configuration, preflight returns an error similar to:

```
Error: preflight validation failed for resource "azapi_resource.vnet":
  The value '10.0.0.0/160' is not a valid CIDR block.
```

Correcting the address prefix to a valid value (for example, `10.0.0.0/16`) clears the error.

### Suppress plan noise with `ignore_no_op_changes`

If you run plans repeatedly, AzAPI might detect minor no-op differences between the configuration and the ARM state (for example, normalized default values returned by the API). To suppress these plan-time differences and focus on real changes, set `ignore_no_op_changes = true` in the provider block:

```terraform
provider "azapi" {
  enable_preflight     = true
  ignore_no_op_changes = true
}
```

## What preflight validates

Preflight sends the resource body to the ARM deployments validation API, which validates:

- Property values against the ARM resource schema (for example, valid CIDR (Classless Inter-Domain Routing) ranges, allowed SKU names, and required fields).
- Policy compliance for Azure Policy assignments that run in validation mode.

Preflight does **not** validate:

- Whether dependent resources exist, or cross-resource dependencies and sequencing.
- Whether sufficient quota or regional capacity is available.
- Whether a globally unique name (for example, a storage account or DNS name) is still available.
- Authentication or authorization (Identity and Access Management (IAM)) failures.

These checks continue to occur during `terraform apply`.

## Use preflight in CI pipelines

Adding preflight to a CI pipeline provides a fast, nondestructive validation step that catches configuration errors before code is merged. Enable preflight in the provider block—`preflight_enabled = true` for AzureRM or `enable_preflight = true` for AzAPI—then run `terraform plan`. Because preflight runs during `terraform plan` with no side effects, it's safe to run in pull request workflows against live Azure subscriptions.

## Choose an enablement approach

| | AzureRM provider | AzAPI provider |
|---|---|---|
| Enable in configuration | `features { enhanced_validation { preflight_enabled = true } }` | `enable_preflight = true` |
| Enable via environment variable | `ARM_PROVIDER_ENHANCED_VALIDATION_PREFLIGHT_ENABLED=true` | Not available |
| Default | Disabled | Disabled |
| Resource coverage | Selected resource types (growing list) | Any resource type with ARM preflight support; unsupported types are skipped |
| Related settings | — | `ignore_no_op_changes` |

## Next steps

> [!div class="nextstepaction"]
> [Choose between AzureRM and AzAPI Terraform providers](provider-selection-azurerm-vs-azapi.md)

> [!div class="nextstepaction"]
> [Terraform AzAPI provider overview](overview-azapi-provider.md)