---
title: Enable preflight validation in the AzAPI Terraform provider
description: Learn how to enable and use AzAPI preflight validation to catch Azure resource configuration errors at plan time before any infrastructure is deployed.
ms.topic: how-to
ms.date: 04/20/2026
ms.custom: devx-track-terraform
author: stema
ms.author: stema
ai-usage: ai-generated
---

# Enable preflight validation in the AzAPI Terraform provider

[!INCLUDE [Terraform abstract](./includes/abstract.md)]

The AzAPI Terraform provider includes built-in preflight validation that validates your Azure resource configuration against the ARM API schema during `terraform plan`, before any resources are created or modified in Azure. Preflight catches configuration errors early—such as invalid address prefixes, unsupported property combinations, or quota violations—without incurring the cost of a failed deployment.

Preflight validation is one of AzAPI's key differentiators and works natively with the provider's direct-to-ARM-API architecture. You can also run preflight from the [Microsoft Terraform VS Code extension](how-to-use-terraform-vscode-extension.md#preflight-validation) without setting the provider flag directly.

## Prerequisites

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../includes/open-source-devops-prereqs-azure-subscription.md)]

[!INCLUDE [configure-terraform.md](includes/configure-terraform.md)]

[!INCLUDE [confirm-default-azure-subscription-or-authenticate.md](includes/confirm-default-azure-subscription-or-authenticate.md)]

## Enable preflight validation

Set `enable_preflight = true` in the `provider "azapi"` block:

```terraform
provider "azapi" {
  enable_preflight = true
}
```

Preflight is disabled by default to preserve backward compatibility. Enable it in environments where you want early validation, such as CI pipelines and pull request checks.

## Example: Catch an invalid address prefix at plan time

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

## What preflight validates

Preflight sends the resource body to the ARM API's preflight endpoint, which validates:

- Property values against the ARM resource schema (for example, valid CIDR (Classless Inter-Domain Routing) ranges, allowed SKU names, required fields).
- Subscription-level quota and capacity constraints for supported resource types.
- Policy compliance for Azure Policy assignments that run in preflight mode.

Preflight does **not** validate:

- Cross-resource dependencies or sequencing.
- Resources that don't have ARM preflight endpoint support (the provider silently skips validation for those resource types).
- Authentication or authorization (Identity and Access Management (IAM)) failures—these failures surface during `terraform apply`.

## Use preflight in CI pipelines

Adding preflight to a CI pipeline provides a fast, nondestructive validation step that catches configuration errors before code is merged. Enable `enable_preflight = true` in the provider block of your Terraform configuration, then run `terraform plan`:

```terraform
provider "azapi" {
  enable_preflight = true
}
```

Because preflight runs during `terraform plan` with no side effects, it's safe to run in pull request workflows against live Azure subscriptions.

## Disable output noise with `ignore_no_op_changes`

If you run plans repeatedly, AzAPI may detect minor no-op differences between the configuration and the ARM state (for example, normalized default values returned by the API). To suppress these plan-time differences and focus on real changes, set `ignore_no_op_changes = true` in the provider block:

```terraform
provider "azapi" {
  enable_preflight      = true
  ignore_no_op_changes  = true
}
```

## Next steps

> [!div class="nextstepaction"]
> [Terraform AzAPI provider overview](overview-azapi-provider.md)

> [!div class="nextstepaction"]
> [Choose between AzureRM and AzAPI Terraform providers](provider-selection-azurerm-vs-azapi.md)
